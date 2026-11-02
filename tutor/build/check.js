// tutor/build/check.js — publish gate for exam data files (spec §3.3, §3.4, §6).
'use strict';
const fs = require('fs');
const path = require('path');
const { STATEMENTS, SCENARIOS, TRAPS, ALLOCATION, SIM_BLOCKS, OBJECTIVE_COUNT, TAGGED_SETS, SIM_SETS, DOMAINS,
  SCENARIO_BLOCKS, DRAWS, LEGACY_DRAW, DOMAIN_TOLERANCE, FULL_SIZE, FULL_SIZE_EXEMPT } = require('./statements.js');

const LETTERS = 'ABCD';
const WEIGHTS = ['light', 'heavy'], SCOPES = ['personal', 'shared'], TRIGGERS = ['session', 'file', 'demand', 'prompt'];
const BP_KEYS = ['rank', 'weight', 'scope', 'trigger'];
const LEGACY_SIM_SETS = ['sim', 'sim2', 'sim3', 'sim4'];
const normalize = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

// Draw gates (2026-10-28). A full mock draws 4 distinct scenarios from SCENARIO_BLOCKS; its domain counts stay within
// DOMAIN_TOLERANCE of the blueprint weights × 60; and every draw in DRAWS, with the one before it (sim4's LEGACY_DRAW for the
// first), covers all six scenarios. The whole chain is re-checked on every run, so inserting or reordering a draw can't slip.
// Runs in --partial too.
const validDraw = (d) => Array.isArray(d) && d.length === 4 && new Set(d).size === 4 && d.every((k) => Object.hasOwn(SCENARIO_BLOCKS, k));

function drawFailures(set) {
  const draw = DRAWS[set];
  if (!validDraw(draw)) return [`draw ${JSON.stringify(draw)}: need 4 distinct scenarios from ${Object.keys(SCENARIO_BLOCKS).join('|')}`];
  const F = [], d = {};
  draw.forEach((k) => SCENARIO_BLOCKS[k].forEach((ts) => { d['D' + ts[0]] = (d['D' + ts[0]] || 0) + 1; }));
  DOMAINS.forEach(({ tag, pct }) => {
    const want = (pct * 60) / 100, have = d[tag] || 0;
    if (Math.abs(have - want) > DOMAIN_TOLERANCE) F.push(`domain mix: ${tag} ${have} vs blueprint ${want.toFixed(1)} (±${DOMAIN_TOLERANCE}); pick another draw`);
  });
  let prevSet = SIM_SETS[SIM_SETS.length - 1], prev = LEGACY_DRAW;
  Object.entries(DRAWS).forEach(([s, cur]) => {
    if (!validDraw(cur)) { F.push(`rotation: ${s} has an invalid draw`); return; }
    const missed = Object.keys(SCENARIOS).filter((k) => !prev.includes(k) && !cur.includes(k));
    if (missed.length) F.push(`rotation: ${prevSet} drew ${prev.join('+')} and ${s} drew ${cur.join('+')}, leaving ${missed.join('+')} unpractised`);
    prevSet = s; prev = cur;
  });
  return F;
}

// Draw-set layout: META.blocks must list the draw in order with the guide's scenario titles (template.html groups by
// META.blocks, so numeric legacy ids would render no questions), and each block's records must be contiguous in that order.
function layoutFailures(Q, set, meta) {
  const draw = DRAWS[set], F = [];
  const blocks = meta && Array.isArray(meta.blocks) && meta.blocks.every((b) => b && typeof b === 'object') ? meta.blocks : null;
  if (!blocks) return [`META.blocks missing or malformed: list ${draw.join(', ')} in order as { id, title, intro }`];
  if (blocks.map((b) => b.id).join(',') !== draw.join(',')) F.push(`META.blocks ids [${blocks.map((b) => b.id)}] ≠ draw [${draw}]`);
  blocks.forEach((b) => { if (b.title !== SCENARIOS[b.id]) F.push(`META.blocks ${b.id}: title "${b.title}" ≠ "${SCENARIOS[b.id]}"`); });
  const runs = Q.map((q) => q.block).filter((b, i, a) => i === 0 || b !== a[i - 1]);
  if (runs.join(',') !== draw.join(',')) F.push(`record order: blocks run [${runs}], need each block contiguous in draw order [${draw}]`);
  return F;
}

function runChecks(Q, set, opts = {}) {
  const F = [];
  const partial = !!opts.partial;
  const alloc = ALLOCATION[set];
  if (!alloc) return { failures: [`unknown set "${set}" (${Object.keys(ALLOCATION).join('|')})`], stats: {} };
  const total = Object.values(alloc).reduce((x, y) => x + y, 0);
  if (!partial && Q.length !== total) F.push(`expected ${total} records, got ${Q.length}`);

  const isSim = SIM_SETS.includes(set);
  // SIM_SETS is closed: a set added there would skip the draw gates.
  if (SIM_SETS.join(',') !== LEGACY_SIM_SETS.join(',')) F.push(`SIM_SETS is closed at ${LEGACY_SIM_SETS.join(',')}; put new full mocks in DRAWS`);
  const draw = Object.hasOwn(DRAWS, set) ? DRAWS[set] : undefined, drawOk = validDraw(draw);
  if (draw !== undefined) F.push(...drawFailures(set));
  else if (!isSim && !FULL_SIZE_EXEMPT.includes(set) && total >= FULL_SIZE) {
    F.push(`${set}: ${total} items is full-mock size; register it in DRAWS (statements.js) so the scenario gates run`);
  }
  const ids = new Set(), counts = {}, letters = { A: 0, B: 0, C: 0, D: 0 }, rank = [0, 0, 0, 0], stems = new Map(), objs = new Set();

  Q.forEach((q, i) => {
    const tag = q.id || `#${i + 1}`;
    if (!q.id) F.push(`${tag}: missing id`); else if (ids.has(q.id)) F.push(`${tag}: duplicate id`); ids.add(q.id);
    if (!STATEMENTS[q.ts]) F.push(`${tag}: unknown ts "${q.ts}"`); counts[q.ts] = (counts[q.ts] || 0) + 1;
    if (!SCENARIOS[q.s]) F.push(`${tag}: unknown scenario "${q.s}"`);
    const okOpts = Array.isArray(q.o) && q.o.length === 4 && q.o.every((o) => typeof o === 'string' && o.trim());
    if (!okOpts) F.push(`${tag}: need 4 non-empty options`);
    if (!(Number.isInteger(q.a) && q.a >= 0 && q.a <= 3)) F.push(`${tag}: a must be 0-3`);
    else {
      letters[LETTERS[q.a]]++;
      if (okOpts) {
        const L = q.o.map((o) => o.length), sorted = [...L].sort((x, y) => y - x), r = sorted.indexOf(L[q.a]);
        rank[r]++;
        if (q.bp && q.bp.rank && q.bp.rank !== r + 1) F.push(`${tag}: length rank ${r + 1} ≠ blueprint ${q.bp.rank}`);
      }
      const expect = [0, 1, 2, 3].filter((j) => j !== q.a).map((j) => LETTERS[j]);
      const got = q.wrong ? Object.keys(q.wrong).sort() : [];
      if (got.join('') !== expect.join('')) F.push(`${tag}: wrong keys ${got.join('') || '(none)'} ≠ ${expect.join('')}`);
      else expect.forEach((k) => {
        const w = q.wrong[k];
        if (!w || !TRAPS.includes(w.trap)) F.push(`${tag}: ${k} bad trap "${w && w.trap}"`);
        if (!w || !w.text || !String(w.text).trim()) F.push(`${tag}: ${k} empty text`);
      });
    }
    if (!q.why || !String(q.why).trim()) F.push(`${tag}: empty why`);
    if (!q.cite || !String(q.cite).trim()) F.push(`${tag}: empty cite`);
    const htmlUnsafe = [q.q, q.why, q.cite, ...(Array.isArray(q.o) ? q.o : []), ...(q.wrong ? Object.values(q.wrong).map((w) => w && w.text) : [])]
      .filter((s) => typeof s === 'string').some((s) => /[<&]/.test(s));
    if (htmlUnsafe) F.push(`${tag}: text contains < or & (rendered via innerHTML — rephrase)`);
    // bp.weight: is the key the lighter or the heavier mechanism? bp.scope: is the key personal or shared config?
    // bp.trigger: when does the key's mechanism take effect (every session, on file access, on demand, this session only)? (balance gates below)
    if (q.bp !== undefined && (typeof q.bp !== 'object' || q.bp === null || Array.isArray(q.bp))) F.push(`${tag}: bp must be an object`);
    else if (q.bp) {
      Object.keys(q.bp).filter((k) => !BP_KEYS.includes(k)).forEach((k) => F.push(`${tag}: unknown bp key "${k}" (${BP_KEYS.join('|')})`));
      if ('weight' in q.bp && !WEIGHTS.includes(q.bp.weight)) F.push(`${tag}: bp.weight "${q.bp.weight}" not ${WEIGHTS.join('|')}`);
      if ('scope' in q.bp && !SCOPES.includes(q.bp.scope)) F.push(`${tag}: bp.scope "${q.bp.scope}" not ${SCOPES.join('|')}`);
      if ('trigger' in q.bp && !TRIGGERS.includes(q.bp.trigger)) F.push(`${tag}: bp.trigger "${q.bp.trigger}" not ${TRIGGERS.join('|')}`);
    }
    if (q.q && !/\d/.test(q.q)) F.push(`${tag}: stem has no digit (spec §3.1 requires a concrete number)`);
    const sentences = q.q ? (String(q.q).match(/[.?!](\s|$)/g) || []).length : 0;
    if (sentences < 3) F.push(`${tag}: stem needs ≥3 sentences (found ${sentences})`);
    if (isSim && !Number.isInteger(q.block)) F.push(`${tag}: sim record needs block`);
    if (drawOk) {
      if (!draw.includes(q.block)) F.push(`${tag}: drawn record needs block, one of ${draw.join('|')}`);
      else if (q.s !== q.block) F.push(`${tag}: scenario "${q.s}" ≠ block "${q.block}" (a block's questions are set in its scenario)`);
      if ('obj' in q && !(Array.isArray(q.obj) && q.obj.every((o) => Number.isInteger(o) && o >= 1 && o <= OBJECTIVE_COUNT))) F.push(`${tag}: obj must be an array of 1–${OBJECTIVE_COUNT}`);
    }
    if (isSim) {
      // obj: [] = record not tagged with any objective. Tags are authored, not derived; the coverage check below needs each of the 29 tagged at least once.
      if (!Array.isArray(q.obj)) F.push(`${tag}: sim record needs obj (score-report objective numbers, [] if none)`);
      else q.obj.forEach((o) => { if (!(Number.isInteger(o) && o >= 1 && o <= OBJECTIVE_COUNT)) F.push(`${tag}: obj ${o} not in 1–${OBJECTIVE_COUNT}`); else objs.add(o); });
    }
    if (q.q) { const n = normalize(q.q); if (stems.has(n)) F.push(`${tag}: duplicate stem of ${stems.get(n)}`); else stems.set(n, tag); }
  });

  (opts.externalStems || []).forEach((e) => { const n = normalize(e); if (stems.has(n)) F.push(`${stems.get(n)}: duplicates external stem`); });

  if (!partial) {
    Object.entries(alloc).forEach(([ts, n]) => { if ((counts[ts] || 0) !== n) F.push(`ts ${ts}: ${counts[ts] || 0} ≠ allocation ${n}`); });
    // Bounds scale with paper size; for 60 they are the original 12–18 / max 20 / min 8.
    const lo = Math.round(total * 0.2), hi = Math.round(total * 0.3), maxLong = Math.round(total / 3), minShort = Math.round(total * 2 / 15);
    Object.entries(letters).forEach(([l, n]) => { if (n < lo || n > hi) F.push(`letter ${l} correct ${n}× (need ${lo}–${hi})`); });
    if (rank[0] > maxLong) F.push(`correct is longest ${rank[0]}× (max ${maxLong})`);
    if (rank[3] < minShort) F.push(`correct is shortest ${rank[3]}× (min ${minShort})`);
    // Style leak: a blind audit (2026-10-09) found purpose clauses ("so that …") padded onto distractors far more than keys.
    const pc = (o) => /\bso (that )?\b/i.test(o);
    const keyPc = Q.filter((q) => pc(q.o[q.a])).length / Q.length;
    const wrongPc = Q.reduce((n, q) => n + q.o.filter((o, j) => j !== q.a && pc(o)).length, 0) / (3 * Q.length);
    if (Math.abs(keyPc - wrongPc) > 0.15) F.push(`purpose-clause tell: keys ${(keyPc * 100).toFixed(0)}% vs distractors ${(wrongPc * 100).toFixed(0)}% (max gap 15 pts)`);
    // Same leak, other shape: a blind audit of the first dm draft (2026-10-18) found trailing ", since …" / ", letting …" clauses
    // on 28% of distractors vs 11% of keys. Known gaps: ", which …" / ", with …" are not checked, and ", billing" counts as a participle.
    const tc = (o) => /,\s+(since|because)\b|,\s+[a-z]+ing\b/i.test(o);
    const keyTc = Q.filter((q) => tc(q.o[q.a])).length / Q.length;
    const wrongTc = Q.reduce((n, q) => n + q.o.filter((o, j) => j !== q.a && tc(o)).length, 0) / (3 * Q.length);
    if (Math.abs(keyTc - wrongTc) > 0.10) F.push(`trailing-clause tell: keys ${(keyTc * 100).toFixed(0)}% vs distractors ${(wrongTc * 100).toFixed(0)}% (max gap 10 pts)`);
    // Weight / scope tells (LR-0027 habits): a paper aimed at "picks the heavier mechanism" or "mixes up personal vs shared"
    // must not let "pick the lightest" or one scope become the safe guess. Integer maths keeps the bounds exact.
    const isObj = (q) => q.bp && typeof q.bp === 'object' && !Array.isArray(q.bp);
    const wt = Q.filter((q) => isObj(q) && WEIGHTS.includes(q.bp.weight)), sc = Q.filter((q) => isObj(q) && SCOPES.includes(q.bp.scope));
    const tr = Q.filter((q) => isObj(q) && TRIGGERS.includes(q.bp.trigger));
    const need = TAGGED_SETS[set];
    if (need && wt.length < need.weight) F.push(`${set} must tag bp.weight (light|heavy) on ≥${need.weight} items (found ${wt.length})`);
    if (need && sc.length < need.scope) F.push(`${set} must tag bp.scope (personal|shared) on ≥${need.scope} items (found ${sc.length})`);
    if (need && tr.length < need.trigger) F.push(`${set} must tag bp.trigger (${TRIGGERS.join('|')}) on ≥${need.trigger} items (found ${tr.length})`);
    if (wt.length) {
      const h = wt.filter((q) => q.bp.weight === 'heavy').length, n = wt.length;
      if (h * 10 < 3 * n || h * 10 > 7 * n) F.push(`weight tell: heavy is the key on ${h}/${n} tagged items (need 30–70%)`);
    }
    if (sc.length) SCOPES.forEach((v) => {
      const c = sc.filter((q) => q.bp.scope === v).length, n = sc.length;
      if (c * 20 < 7 * n) F.push(`scope tell: ${v} is the key on ${c}/${n} tagged items (need ≥35% each)`);
    });
    // LR-0031: when-does-it-fire items must not let one trigger (e.g. "it's always CLAUDE.md") become the safe guess.
    if (tr.length) TRIGGERS.forEach((v) => {
      const c = tr.filter((q) => q.bp.trigger === v).length, n = tr.length;
      if (c * 2 > n) F.push(`trigger tell: ${v} is the key on ${c}/${n} tagged items (max 50%)`);
      // A trigger that is never the key can be eliminated on sight, so once there are enough tags to cover all four, each must appear.
      if (c === 0 && n >= TRIGGERS.length) F.push(`trigger tell: ${v} is the key on 0/${n} tagged items (need ≥1 each)`);
    });
    if (isSim) for (let o = 1; o <= OBJECTIVE_COUNT; o++) if (!objs.has(o)) F.push(`objective ${o} untested`);
    if (isSim) SIM_BLOCKS.forEach((b) => {
      const qs = Q.filter((q) => q.block === b.id);
      if (qs.length !== b.size) F.push(`block ${b.id}: ${qs.length} ≠ ${b.size}`);
      const have = qs.map((q) => q.ts).sort().join(','), want = [...b.statements].sort().join(',');
      if (have !== want) F.push(`block ${b.id}: statements [${have}] ≠ [${want}]`);
    });
    if (drawOk) {
      draw.forEach((k) => {
        const qs = Q.filter((q) => q.block === k);
        if (qs.length !== SCENARIO_BLOCKS[k].length) F.push(`block ${k}: ${qs.length} ≠ ${SCENARIO_BLOCKS[k].length}`);
        const have = qs.map((q) => q.ts).sort().join(','), want = [...SCENARIO_BLOCKS[k]].sort().join(',');
        if (have !== want) F.push(`block ${k}: statements [${have}] ≠ [${want}]`);
      });
      F.push(...layoutFailures(Q, set, opts.meta));
    }
  }
  return { failures: F, stats: { count: Q.length, letters, rank, counts } };
}

// Stems from tutor/diagnostic.md — paragraphs between a "## Qn" heading and the first "A)" line.
function diagnosticStems(file) {
  if (!fs.existsSync(file)) return [];
  const out = []; let buf = null;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (/^## Q\d+/.test(line)) { buf = []; continue; }
    if (buf && /^A\) /.test(line)) { out.push(buf.join(' ').trim()); buf = null; continue; }
    if (buf && line.trim()) buf.push(line.trim());
  }
  return out;
}

if (require.main === module) {
  const set = process.argv[2], partial = process.argv.includes('--partial');
  if (!Object.keys(ALLOCATION).includes(set)) { console.error(`usage: node check.js ${Object.keys(ALLOCATION).join('|')} [--partial]`); process.exit(2); }
  const { META, Q } = require(path.join(__dirname, 'data', `${set}.js`));
  const externalStems = diagnosticStems(path.join(__dirname, '..', 'diagnostic.md'));
  Object.keys(ALLOCATION).filter((o) => o !== set).forEach((o) => {
    const f = path.join(__dirname, 'data', `${o}.js`);
    if (fs.existsSync(f)) externalStems.push(...require(f).Q.map((q) => q.q));
  });
  const { failures, stats } = runChecks(Q, set, { partial, externalStems, meta: META });
  console.log(`${set}: ${stats.count} records · letters ${JSON.stringify(stats.letters)} · rank longest→shortest ${JSON.stringify(stats.rank)}`);
  if (failures.length) { console.error(failures.map((f) => ' ✗ ' + f).join('\n')); process.exit(1); }
  console.log(partial ? 'partial checks passed (distribution gates skipped)' : 'ALL GATES PASSED');
}

module.exports = { runChecks, diagnosticStems, drawFailures, validDraw };
