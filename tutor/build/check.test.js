'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { runChecks } = require('./check.js');
const { ALLOCATION } = require('./statements.js');

const LETTERS = 'ABCD';
// Build a valid record. `rank` 1..4 = correct option is longest..shortest.
function mk(over = {}) {
  const a = over.a ?? 1;
  const rank = over.rank ?? 2;
  const lens = [60, 45, 30, 15];                 // longest → shortest
  const o = ['', '', '', ''];
  o[a] = 'x'.repeat(lens[rank - 1]);
  let k = 0;
  for (let j = 0; j < 4; j++) if (j !== a) { while (k === rank - 1) k++; o[j] = 'y'.repeat(lens[k]); k++; }
  const wrong = {};
  for (let j = 0; j < 4; j++) if (j !== a) wrong[LETTERS[j]] = { trap: 'symptom-fix', text: 'why it tempts' };
  return Object.assign({
    id: 'T01', ts: '1.1', s: 'cs',
    q: 'First sentence here. Second sentence with 12% here. Third sentence closes it.',
    o, a, why: 'because', wrong, cite: 'notes/domain-1-agentic-architecture.md §1.1',
  }, over);
}
// A full, gate-compliant 60-record gauntlet set: letters 15 each, ranks 15 each.
function synth(set = 'gauntlet') {
  const Q = []; let i = 0;
  for (const [ts, n] of Object.entries(ALLOCATION[set])) {
    for (let c = 0; c < n; c++, i++) {
      Q.push(mk({ id: 'S' + String(i + 1).padStart(2, '0'), ts, a: (3 * i) % 4, rank: ((i + Math.floor(i / 4)) % 4) + 1,
        q: `Stem number ${i} sentence one. Sentence two mentions ${i + 10} files. Sentence three ends.` }));
    }
  }
  return Q;
}

test('valid partial record passes', () => {
  assert.deepEqual(runChecks([mk()], 'gauntlet', { partial: true }).failures, []);
});
test('missing wrong key is reported', () => {
  const q = mk(); delete q.wrong.C;
  assert.match(runChecks([q], 'gauntlet', { partial: true }).failures.join('\n'), /wrong keys/);
});
test('bad trap tag is reported', () => {
  const q = mk(); q.wrong.A.trap = 'lazy';
  assert.match(runChecks([q], 'gauntlet', { partial: true }).failures.join('\n'), /bad trap/);
});
test('two-sentence stem is reported', () => {
  const q = mk({ q: 'One sentence. Two sentences.' });
  assert.match(runChecks([q], 'gauntlet', { partial: true }).failures.join('\n'), /≥3 sentences/);
});
test('blueprint rank mismatch is reported', () => {
  const q = mk({ rank: 1, bp: { rank: 4 } });
  assert.match(runChecks([q], 'gauntlet', { partial: true }).failures.join('\n'), /length rank 1 ≠ blueprint 4/);
});
test('duplicate stem vs external list is reported', () => {
  const q = mk();
  assert.match(runChecks([q], 'gauntlet', { partial: true, externalStems: [q.q] }).failures.join('\n'), /external stem/);
});
test('synthesised full gauntlet passes all gates', () => {
  const r = runChecks(synth('gauntlet'), 'gauntlet');
  assert.deepEqual(r.failures, []);
  assert.deepEqual(r.stats.rank, [15, 15, 15, 15]);
});
test('full set with 21 longest-correct fails the length gate', () => {
  const Q = synth('gauntlet');
  // force six rank-2 records to rank 1 → 21 longest
  let moved = 0;
  for (const q of Q) { const L = q.o.map(s => s.length); const sorted = [...L].sort((x, y) => y - x);
    if (sorted.indexOf(L[q.a]) === 1 && moved < 6) { q.o[q.a] = 'x'.repeat(61); moved++; } }
  assert.match(runChecks(Q, 'gauntlet').failures.join('\n'), /correct is longest 21/);
});
test('allocation mismatch is reported on full set', () => {
  const Q = synth('gauntlet'); Q[0].ts = '1.3';
  assert.match(runChecks(Q, 'gauntlet').failures.join('\n'), /ts 1\.1: 0 ≠ allocation 1/);
});
test('sim record without block is reported', () => {
  assert.match(runChecks([mk()], 'sim', { partial: true }).failures.join('\n'), /needs block/);
});
test('stem containing < is reported', () => {
  const q = mk({ q: 'Latency < 200 ms here. Second sentence. Third sentence.' });
  assert.match(runChecks([q], 'gauntlet', { partial: true }).failures.join('\n'), /contains < or &/);
});
test('stem without a digit is reported', () => {
  const q = mk({ q: 'No numbers here at all. Second sentence. Third sentence.' });
  assert.match(runChecks([q], 'gauntlet', { partial: true }).failures.join('\n'), /no digit/);
});

// Scaled distribution bounds (Math.round on total). d1 = 16 → letters 3–5, longest ≤5; d2 = 11 → letters 2–3, longest ≤4.
const reKey = (Q, i, a) => { const q = Q[i]; Q[i] = mk({ id: q.id, ts: q.ts, q: q.q, a, rank: q.o.map((s) => s.length).sort((x, y) => y - x).indexOf(q.o[q.a].length) + 1 }); };
const reRank = (Q, i, rank) => { const q = Q[i]; Q[i] = mk({ id: q.id, ts: q.ts, q: q.q, a: q.a, rank }); };
test('synthesised d1 and d2 pass all gates at their own sizes', () => {
  assert.deepEqual(runChecks(synth('d1'), 'd1').failures, []);
  assert.deepEqual(runChecks(synth('d2'), 'd2').failures, []);
});
test('d1: letter B correct 5× passes (round(4.8)=5, not floor)', () => {
  const Q = synth('d1'); reKey(Q, Q.findIndex((q) => q.a === 0), 1);   // A4→3, B4→5
  assert.deepEqual(runChecks(Q, 'd1').failures, []);
});
test('d1: letter B correct 6× fails', () => {
  const Q = synth('d1'); reKey(Q, Q.findIndex((q) => q.a === 0), 1); reKey(Q, Q.findIndex((q) => q.a === 2), 1);
  assert.match(runChecks(Q, 'd1').failures.join('\n'), /letter B correct 6× \(need 3–5\)/);
});
test('d2: letter D correct 4× fails (round(3.3)=3, not ceil)', () => {
  const Q = synth('d2'); reKey(Q, Q.findIndex((q) => q.a === 0), 3);   // A3→2, D3→4
  assert.deepEqual(runChecks(Q, 'd2').failures, ['letter D correct 4× (need 2–3)']);   // A at 2 = lower bound round(2.2), not ceil
});
test('d2: correct-longest 4× passes (round(3.67)=4), 5× fails', () => {
  const Q = synth('d2'), notLongest = Q.map((q, i) => i).filter((i) => runChecks([Q[i]], 'd2', { partial: true }).stats.rank[0] === 0);
  reRank(Q, notLongest[0], 1);
  assert.equal(runChecks(Q, 'd2').stats.rank[0], 4);
  assert.deepEqual(runChecks(Q, 'd2').failures, []);
  reRank(Q, notLongest[1], 1);
  assert.match(runChecks(Q, 'd2').failures.join('\n'), /correct is longest 5× \(max 4\)/);
});

// Pins for the two bounds the tests above leave unpinned: maxLong ceil (d1 6 vs 5) and minShort ceil (d1 3 vs 2, d2 2 vs 1).
const withRank = (Q, set, want) => Q.map((q, i) => i).filter((i) => runChecks([Q[i]], set, { partial: true }).stats.rank[want - 1] === 1);
test('d1: correct-longest 5× passes, 6× fails (round(5.33)=5, not ceil)', () => {
  const Q = synth('d1'), r2 = withRank(Q, 'd1', 2);
  reRank(Q, r2[0], 1);
  assert.equal(runChecks(Q, 'd1').stats.rank[0], 5);
  assert.deepEqual(runChecks(Q, 'd1').failures, []);
  reRank(Q, r2[1], 1);
  assert.match(runChecks(Q, 'd1').failures.join('\n'), /correct is longest 6× \(max 5\)/);
});
test('d1: correct-shortest 2× passes, 1× fails (round(2.13)=2, not ceil)', () => {
  const Q = synth('d1'), r4 = withRank(Q, 'd1', 4);
  reRank(Q, r4[0], 2); reRank(Q, r4[1], 3);
  assert.equal(runChecks(Q, 'd1').stats.rank[3], 2);
  assert.deepEqual(runChecks(Q, 'd1').failures, []);
  reRank(Q, r4[2], 2);
  assert.match(runChecks(Q, 'd1').failures.join('\n'), /correct is shortest 1× \(min 2\)/);
});
test('d2: correct-shortest 1× passes, 0× fails (round(1.47)=1, not ceil)', () => {
  const Q = synth('d2'), r4 = withRank(Q, 'd2', 4);
  reRank(Q, r4[0], 2); reRank(Q, r4[1], 3);
  assert.equal(runChecks(Q, 'd2').stats.rank[3], 1);
  assert.deepEqual(runChecks(Q, 'd2').failures, []);
  reRank(Q, r4[2], 2);
  assert.match(runChecks(Q, 'd2').failures.join('\n'), /correct is shortest 0× \(min 1\)/);
});

// Purpose-clause gate. 'so that ' overwrites the option's first 8 chars so length ranks are untouched.
const pc = (s) => 'so that ' + s.slice(8);
test('purpose clauses at equal rates on keys and distractors pass', () => {
  const Q = synth('gauntlet');
  Q.slice(0, 12).forEach((q) => { q.o = q.o.map(pc); });               // keys 12/60 = 20%, distractors 36/180 = 20%
  assert.deepEqual(runChecks(Q, 'gauntlet').failures, []);
});
test('purpose clauses padded onto distractors fail (d2 shape: keys 18% vs 36%)', () => {
  const Q = synth('d2');
  Q.slice(0, 2).forEach((q) => { q.o[q.a] = pc(q.o[q.a]); });          // keys 2/11
  let n = 0;
  Q.forEach((q) => q.o.forEach((o, j) => { if (j !== q.a && n < 12) { q.o[j] = pc(o); n++; } }));   // distractors 12/33
  assert.match(runChecks(Q, 'd2').failures.join('\n'), /purpose-clause tell: keys 18% vs distractors 36%/);
});
test('purpose clauses padded onto keys only also fail', () => {
  const Q = synth('gauntlet');
  Q.slice(0, 12).forEach((q) => { q.o[q.a] = pc(q.o[q.a]); });         // keys 20%, distractors 0%
  assert.match(runChecks(Q, 'gauntlet').failures.join('\n'), /purpose-clause tell: keys 20% vs distractors 0%/);
});

// Trailing-clause gate. ', using ' overwrites the option's first 8 chars so length ranks are untouched.
const tcl = (s) => ', using ' + s.slice(8);
test('trailing clauses at equal rates on keys and distractors pass', () => {
  const Q = synth('gauntlet');
  Q.slice(0, 12).forEach((q) => { q.o = q.o.map(tcl); });              // keys 20%, distractors 20%
  assert.deepEqual(runChecks(Q, 'gauntlet').failures, []);
});
test('trailing clauses padded onto distractors fail (dm shape: keys 10% vs 27%)', () => {
  const Q = synth('gauntlet');
  Q.slice(0, 6).forEach((q) => { q.o[q.a] = tcl(q.o[q.a]); });         // keys 6/60
  let n = 0;
  Q.forEach((q) => q.o.forEach((o, j) => { if (j !== q.a && n < 48) { q.o[j] = tcl(o); n++; } }));   // distractors 48/180
  assert.match(runChecks(Q, 'gauntlet').failures.join('\n'), /trailing-clause tell: keys 10% vs distractors 27%/);
});
test('trailing clauses padded onto keys only also fail', () => {
  const Q = synth('gauntlet');
  Q.slice(0, 12).forEach((q) => { q.o[q.a] = tcl(q.o[q.a]); });        // keys 20%, distractors 0%
  assert.match(runChecks(Q, 'gauntlet').failures.join('\n'), /trailing-clause tell: keys 20% vs distractors 0%/);
});

// Full sim: 4 scenario blocks of 15, every record tagged with the score-report objective(s) it tests (1–29).
const { SIM_BLOCKS } = require('./statements.js');
function synthSim() {
  const Q = synth('sim'), pool = SIM_BLOCKS.flatMap((b) => b.statements.map((ts) => ({ ts, block: b.id })));
  Q.forEach((q, i) => { const k = pool.findIndex((p) => p.ts === q.ts); q.block = pool[k].block; pool.splice(k, 1); q.obj = [(i % 29) + 1]; });
  return Q;
}
test('sim is 4 blocks of 15 that sum to the sim allocation', () => {
  assert.deepEqual(SIM_BLOCKS.map((b) => b.size), [15, 15, 15, 15]);
  SIM_BLOCKS.forEach((b) => assert.equal(b.statements.length, b.size));
  const n = {}; SIM_BLOCKS.forEach((b) => b.statements.forEach((ts) => { n[ts] = (n[ts] || 0) + 1; }));
  assert.deepEqual(n, Object.fromEntries(Object.entries(ALLOCATION.sim).filter(([, c]) => c)));
});
test('sim domain counts track the blueprint weights (D1 16 · D2 11 · D3 12 · D4 12 · D5 9)', () => {
  const d = {}; Object.entries(ALLOCATION.sim).forEach(([ts, c]) => { const k = 'D' + ts[0]; d[k] = (d[k] || 0) + c; });
  assert.deepEqual(d, { D1: 16, D2: 11, D3: 12, D4: 12, D5: 9 });
});
test('synthesised full sim passes all gates', () => {
  assert.deepEqual(runChecks(synthSim(), 'sim').failures, []);
});
test('sim record without objective tags is reported', () => {
  const q = mk({ block: 1 });
  assert.match(runChecks([q], 'sim', { partial: true }).failures.join('\n'), /needs obj/);
});
test('sim record with obj [] (untagged) passes', () => {
  assert.deepEqual(runChecks([mk({ block: 1, obj: [] })], 'sim', { partial: true }).failures, []);
});
test('sim obj that is not an array is reported', () => {
  assert.match(runChecks([mk({ block: 1, obj: '5' })], 'sim', { partial: true }).failures.join('\n'), /needs obj/);
});
test('sim objective outside 1–29 is reported', () => {
  const q = mk({ block: 1, obj: [30] });
  assert.match(runChecks([q], 'sim', { partial: true }).failures.join('\n'), /obj 30 not in 1–29/);
});
test('full sim that leaves an objective untested is reported', () => {
  const Q = synthSim(); Q.forEach((q) => { if (q.obj[0] === 19) q.obj = [18]; });
  assert.match(runChecks(Q, 'sim').failures.join('\n'), /objective 19 untested/);
});
// sim2 (2026-10-22) shares the sim allocation and block matrix, so the same block / objective gates must run on it.
test('sim2 record without block is reported', () => {
  assert.match(runChecks([mk({ obj: [] })], 'sim2', { partial: true }).failures.join('\n'), /needs block/);
});
test('sim2 record without objective tags is reported', () => {
  assert.match(runChecks([mk({ block: 1 })], 'sim2', { partial: true }).failures.join('\n'), /needs obj/);
});
test('full sim2 that leaves an objective untested is reported', () => {
  const Q = synthSim(); Q.forEach((q) => { if (q.obj[0] === 7) q.obj = [8]; });
  assert.match(runChecks(Q, 'sim2').failures.join('\n'), /objective 7 untested/);
});
test('full sim2 with a block of the wrong size is reported', () => {
  const Q = synthSim(); const q = Q.find((r) => r.block === 1); q.block = 2;
  assert.match(runChecks(Q, 'sim2').failures.join('\n'), /block 1: 14 ≠ 15/);
});

// Weight and scope balance gates (d23, 2026-10-19). LR-0027: the candidate over-picks the heavier mechanism and mixes up
// personal vs shared scope. A paper that targets those habits must not make "lightest" or one scope the safe guess.
// tag(Q, field, values): set bp[field] on the first values.length records.
const tag = (Q, field, values) => { values.forEach((v, i) => { Q[i].bp = { ...(Q[i].bp || {}), [field]: v }; }); return Q; };
const rep = (v, n) => Array(n).fill(v);
// A d23 synth with balanced tags: 10 weight items (5 heavy), 10 scope items (5 personal).
const synthD23 = () => tag(tag(synth('d23'), 'weight', [...rep('heavy', 5), ...rep('light', 5)]), 'scope', [...rep('personal', 5), ...rep('shared', 5)]);
test('d23 allocation is 30 questions with the weak rows at 3–4', () => {
  const a = ALLOCATION.d23;
  assert.equal(Object.values(a).reduce((x, y) => x + y, 0), 30);
  ['2.4', '3.1', '3.2', '3.3', '3.4', '3.5'].forEach((ts) => assert.equal(a[ts], 3));
  assert.equal(a['2.5'], 4);
});
test('synthesised d23 with balanced weight and scope tags passes', () => {
  assert.deepEqual(runChecks(synthD23(), 'd23').failures, []);
});
test('untagged sets are not held to the tag gates', () => {
  assert.deepEqual(runChecks(synth('gauntlet'), 'gauntlet').failures, []);
});
test('a tagged set without any weight or scope tags fails', () => {
  const f = runChecks(synth('d23'), 'd23').failures.join('\n');
  assert.match(f, /d23 must tag bp\.weight \(light\|heavy\) on ≥10 items \(found 0\)/);
  assert.match(f, /d23 must tag bp\.scope \(personal\|shared\) on ≥6 items \(found 0\)/);
});
test('a tagged set below its minimum tag count fails, even when balanced (1 heavy + 1 light)', () => {
  const Q = tag(tag(synth('d23'), 'weight', ['heavy', 'light']), 'scope', ['personal', 'shared']);
  const f = runChecks(Q, 'd23').failures.join('\n');
  assert.match(f, /bp\.weight .* on ≥10 items \(found 2\)/);
  assert.match(f, /bp\.scope .* on ≥6 items \(found 2\)/);
});
test('a misspelt bp key on one item is reported', () => {
  const Q = synthD23(); Q[3].bp = { weigth: 'heavy' };
  assert.match(runChecks(Q, 'd23').failures.join('\n'), /unknown bp key "weigth"/);
});
test('a non-object bp is reported without throwing', () => {
  assert.match(runChecks([mk({ bp: 'heavy' })], 'gauntlet', { partial: true }).failures.join('\n'), /bp must be an object/);
  assert.match(runChecks([mk({ bp: null })], 'gauntlet', { partial: true }).failures.join('\n'), /bp must be an object/);
  assert.match(runChecks([mk({ bp: [] })], 'gauntlet', { partial: true }).failures.join('\n'), /bp must be an object/);
});
test('weight bounds hold at n=30: 9/30 and 21/30 pass, 8/30 and 22/30 fail', () => {
  const at = (h) => runChecks(tag(synthD23(), 'weight', [...rep('heavy', h), ...rep('light', 30 - h)]), 'd23').failures;
  assert.deepEqual(at(9), []); assert.deepEqual(at(21), []);
  assert.deepEqual(at(8), ['weight tell: heavy is the key on 8/30 tagged items (need 30–70%)']);
  assert.deepEqual(at(22), ['weight tell: heavy is the key on 22/30 tagged items (need 30–70%)']);
});
test('bp.weight outside light|heavy is reported, even in partial mode', () => {
  assert.match(runChecks([mk({ bp: { weight: 'medium' } })], 'gauntlet', { partial: true }).failures.join('\n'), /bp\.weight "medium"/);
});
test('bp.scope outside personal|shared is reported, even in partial mode', () => {
  assert.match(runChecks([mk({ bp: { scope: 'team' } })], 'gauntlet', { partial: true }).failures.join('\n'), /bp\.scope "team"/);
});
test('heavy keys at 30% and 70% pass (bounds inclusive)', () => {
  assert.deepEqual(runChecks(tag(synthD23(), 'weight', [...rep('heavy', 3), ...rep('light', 7)]), 'd23').failures, []);
  assert.deepEqual(runChecks(tag(synthD23(), 'weight', [...rep('heavy', 7), ...rep('light', 3)]), 'd23').failures, []);
});
test('heavy keys at 20% fail: "pick the lightest" would be a tell', () => {
  const Q = tag(synthD23(), 'weight', [...rep('heavy', 2), ...rep('light', 8)]);
  assert.deepEqual(runChecks(Q, 'd23').failures, ['weight tell: heavy is the key on 2/10 tagged items (need 30–70%)']);
});
test('heavy keys at 80% fail the other way', () => {
  const Q = tag(synthD23(), 'weight', [...rep('heavy', 8), ...rep('light', 2)]);
  assert.deepEqual(runChecks(Q, 'd23').failures, ['weight tell: heavy is the key on 8/10 tagged items (need 30–70%)']);
});
test('scope: each value at 35% passes (7/20 personal, 7/20 shared boundary)', () => {
  const Q = synth('d23'); tag(Q, 'weight', [...rep('heavy', 5), ...rep('light', 5)]);
  tag(Q, 'scope', [...rep('personal', 7), ...rep('shared', 13)]);
  assert.deepEqual(runChecks(Q, 'd23').failures, []);
  tag(Q, 'scope', [...rep('personal', 13), ...rep('shared', 7)]);
  assert.deepEqual(runChecks(Q, 'd23').failures, []);
});
test('scope: personal on 6/20 (30%) fails', () => {
  const Q = synth('d23'); tag(Q, 'weight', [...rep('heavy', 5), ...rep('light', 5)]);
  tag(Q, 'scope', [...rep('personal', 6), ...rep('shared', 14)]);
  assert.deepEqual(runChecks(Q, 'd23').failures, ['scope tell: personal is the key on 6/20 tagged items (need ≥35% each)']);
});
test('scope: shared on 6/20 (30%) fails', () => {
  const Q = synth('d23'); tag(Q, 'weight', [...rep('heavy', 5), ...rep('light', 5)]);
  tag(Q, 'scope', [...rep('personal', 14), ...rep('shared', 6)]);
  assert.deepEqual(runChecks(Q, 'd23').failures, ['scope tell: shared is the key on 6/20 tagged items (need ≥35% each)']);
});
test('tag gates also apply to an untagged-list set once it uses a tag', () => {
  const Q = tag(synth('gauntlet'), 'weight', rep('light', 4));
  assert.deepEqual(runChecks(Q, 'gauntlet').failures, ['weight tell: heavy is the key on 0/4 tagged items (need 30–70%)']);
});

// Trigger balance gate (d23b, 2026-10-20). LR-0031: skills picked for always-on content, CLAUDE.local.md for a one-session note.
// "When does it fire?" items must not make one trigger the safe guess.
// A d23b synth: 6 weight (3 heavy), 8 scope (4 personal), 8 trigger (2 of each value).
const synthD23b = () => tag(tag(tag(synth('d23b'), 'weight', [...rep('heavy', 3), ...rep('light', 3)]),
  'scope', [...rep('personal', 4), ...rep('shared', 4)]), 'trigger', ['session', 'file', 'demand', 'prompt', 'session', 'file', 'demand', 'prompt']);
test('d23b allocation is 30 questions with 3.1, 2.4, 2.5 and 3.3 at 4', () => {
  const a = ALLOCATION.d23b;
  assert.equal(Object.values(a).reduce((x, y) => x + y, 0), 30);
  ['2.4', '2.5', '3.1', '3.3'].forEach((ts) => assert.equal(a[ts], 4));
});
test('synthesised d23b with balanced weight, scope and trigger tags passes', () => {
  assert.deepEqual(runChecks(synthD23b(), 'd23b').failures, []);
});
test('d23b without trigger tags fails the minimum; d23 is not held to it', () => {
  const Q = tag(tag(synth('d23b'), 'weight', [...rep('heavy', 3), ...rep('light', 3)]), 'scope', [...rep('personal', 4), ...rep('shared', 4)]);
  assert.deepEqual(runChecks(Q, 'd23b').failures, ['d23b must tag bp.trigger (session|file|demand|prompt) on ≥8 items (found 0)']);
  assert.deepEqual(runChecks(synthD23(), 'd23').failures, []);
});
test('d23b with 3 trigger tags fails the minimum of 8, even when spread', () => {
  const Q = synthD23b(); [3, 4, 5, 6, 7].forEach((i) => { delete Q[i].bp.trigger; });
  assert.match(runChecks(Q, 'd23b').failures.join('\n'), /bp\.trigger .* on ≥8 items \(found 3\)/);
});
test('trigger: one value on exactly 50% passes (4/8)', () => {
  const Q = tag(synthD23b(), 'trigger', ['session', 'session', 'session', 'session', 'file', 'demand', 'prompt', 'file']);
  assert.deepEqual(runChecks(Q, 'd23b').failures, []);
});
TRIGGERS_ALL().forEach((v) => test(`trigger: ${v} on 5/8 fails (each value is checked)`, () => {
  const others = TRIGGERS_ALL().filter((x) => x !== v);
  const Q = tag(synthD23b(), 'trigger', [...rep(v, 5), ...others]);
  assert.deepEqual(runChecks(Q, 'd23b').failures, [`trigger tell: ${v} is the key on 5/8 tagged items (max 50%)`]);
}));
function TRIGGERS_ALL() { return ['session', 'file', 'demand', 'prompt']; }
test('trigger: 5/9 fails and 4/9 passes (odd n, integer bound)', () => {
  const base = () => { const Q = synthD23b(); Q[8].bp = { ...(Q[8].bp || {}), trigger: 'file' }; return Q; };
  assert.deepEqual(runChecks(tag(base(), 'trigger', ['session', 'session', 'session', 'session', 'file', 'demand', 'prompt', 'file']), 'd23b').failures, []);
  assert.deepEqual(runChecks(tag(base(), 'trigger', ['session', 'session', 'session', 'session', 'session', 'demand', 'prompt', 'file']), 'd23b').failures,
    ['trigger tell: session is the key on 5/9 tagged items (max 50%)']);
});
test('bp.trigger outside the four values is reported, even in partial mode', () => {
  assert.match(runChecks([mk({ bp: { trigger: 'always' } })], 'gauntlet', { partial: true }).failures.join('\n'), /bp\.trigger "always" not session\|file\|demand\|prompt/);
});
test('trigger is a known bp key (no unknown-key failure)', () => {
  assert.deepEqual(runChecks([mk({ bp: { trigger: 'file' } })], 'gauntlet', { partial: true }).failures, []);
});
test('trigger gate also applies to a set outside TAGGED_SETS once it uses the tag', () => {
  const Q = tag(synth('gauntlet'), 'trigger', rep('demand', 3));
  assert.deepEqual(runChecks(Q, 'gauntlet').failures, ['trigger tell: demand is the key on 3/3 tagged items (max 50%)']);
});
test('trigger: a value never used as the key fails once 4+ items are tagged (review MED, 2026-10-20)', () => {
  const Q = tag(synthD23b(), 'trigger', ['session', 'session', 'file', 'file', 'session', 'file', 'demand', 'demand']);
  assert.deepEqual(runChecks(Q, 'd23b').failures, ['trigger tell: prompt is the key on 0/8 tagged items (need ≥1 each)']);
  const G = tag(synth('gauntlet'), 'trigger', ['session', 'file', 'demand']);
  assert.deepEqual(runChecks(G, 'gauntlet').failures, [], 'under 4 tags, coverage is not required');
  const G4 = tag(synth('gauntlet'), 'trigger', ['session', 'session', 'file', 'demand']);
  assert.deepEqual(runChecks(G4, 'gauntlet').failures, ['trigger tell: prompt is the key on 0/4 tagged items (need ≥1 each)'], 'at exactly 4 tags, coverage applies');
});
test('trigger: each value is checked for coverage', () => {
  ['session', 'file', 'demand', 'prompt'].forEach((v) => {
    const rest = ['session', 'file', 'demand', 'prompt'].filter((x) => x !== v);
    const Q = tag(synthD23b(), 'trigger', [...rest, ...rest, rest[0], rest[1]]);
    assert.deepEqual(runChecks(Q, 'd23b').failures, [`trigger tell: ${v} is the key on 0/8 tagged items (need ≥1 each)`]);
  });
});
test('an array bp is not counted towards tag balance (review LOW)', () => {
  const Q = tag(synthD23b(), 'trigger', ['session', 'session', 'session', 'session', 'file', 'demand', 'prompt', 'file']);
  Q[20].bp = Object.assign(['x'], { trigger: 'session' }); // counted, it would make session 5/9
  assert.deepEqual(runChecks(Q, 'd23b').failures, ['S21: bp must be an object']);
});
test('d23c allocation is 30 questions weighted to the Paper 2 weak rows', () => {
  const a = ALLOCATION.d23c;
  assert.equal(Object.values(a).reduce((x, y) => x + y, 0), 30);
  assert.equal(a['3.1'], 5); ['2.3', '3.3'].forEach((ts) => assert.equal(a[ts], 4)); ['3.5', '3.6'].forEach((ts) => assert.equal(a[ts], 3));
});
test('d23c is held to the weight, scope and trigger minimums', () => {
  const f = runChecks(synth('d23c'), 'd23c').failures.join('\n');
  ['weight', 'scope', 'trigger'].forEach((k) => assert.match(f, new RegExp(`d23c must tag bp\\.${k} .* \\(found 0\\)`)));
});
test('d23d allocation is 30 questions at the blueprint D2:D3 ratio', () => {
  const a = ALLOCATION.d23d;
  const dom = (d) => Object.entries(a).filter(([ts]) => ts[0] === d).reduce((x, [, n]) => x + n, 0);
  assert.equal(dom('2'), 14); assert.equal(dom('3'), 16);
  Object.values(a).forEach((n) => assert.ok(n >= 2 && n <= 3));
});
test('d23d is held to the weight, scope and trigger minimums', () => {
  const f = runChecks(synth('d23d'), 'd23d').failures.join('\n');
  ['weight', 'scope', 'trigger'].forEach((k) => assert.match(f, new RegExp(`d23d must tag bp\\.${k} .* \\(found 0\\)`)));
});

// Scenario draws (2026-10-28): full mocks drew the same four scenarios, so two scenarios were never practised as blocks. New full mocks draw 4 of the 6 SCENARIO_BLOCKS and must cover what the previous full mock left out.
const { SCENARIO_BLOCKS, DRAWS, SCENARIOS, STATEMENTS, SIM_SETS, DOMAINS, DOMAIN_TOLERANCE, drawAllocation } = require('./statements.js');
const { drawFailures, validDraw } = require('./check.js');
// Run fn with DRAWS holding exactly `draws` (real entries set aside), so these tests don't depend on what's been built.
function withDraws(draws, fn) {
  const saved = { ...DRAWS };
  Object.keys(saved).forEach((k) => { delete DRAWS[k]; delete ALLOCATION[k]; });
  Object.entries(draws).forEach(([k, v]) => { DRAWS[k] = v; ALLOCATION[k] = drawAllocation(v); });
  try { return fn(); } finally {
    Object.keys(draws).forEach((k) => { delete DRAWS[k]; delete ALLOCATION[k]; });
    Object.entries(saved).forEach(([k, v]) => { DRAWS[k] = v; ALLOCATION[k] = drawAllocation(v); });
  }
}
const metaFor = (keys) => ({ blocks: keys.map((k) => ({ id: k, title: SCENARIOS[k], intro: 'x' })) });
function synthDraw(keys) {
  return keys.flatMap((k) => SCENARIO_BLOCKS[k].map((ts) => ({ ts, k }))).map(({ ts, k }, i) => mk({
    id: 'D' + String(i + 1).padStart(2, '0'), ts, s: k, block: k, a: (3 * i) % 4, rank: ((i + Math.floor(i / 4)) % 4) + 1,
    q: `Stem number ${i} sentence one. Sentence two mentions ${i + 10} files. Sentence three ends.` }));
}
const domainCounts = (keys) => { const d = {}; keys.forEach((k) => SCENARIO_BLOCKS[k].forEach((ts) => { d['D' + ts[0]] = (d['D' + ts[0]] || 0) + 1; })); return d; };
const allDraws = () => { const k = Object.keys(SCENARIO_BLOCKS), out = []; for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) out.push(k.filter((_, i) => i !== a && i !== b)); return out; };
const inTolerance = (keys) => { const d = domainCounts(keys); return DOMAINS.every(({ tag, pct }) => Math.abs((d[tag] || 0) - pct * 0.6) <= DOMAIN_TOLERANCE); };
const GOOD1 = ['ma', 'cc', 'ci', 'de'], GOOD2 = ['cs', 'dp', 'ci', 'de'];   // GOOD1 follows sim4; GOOD2 follows GOOD1

test('catalog: one 15-item block per guide scenario, all 30 statements, blueprint weights × 90', () => {
  assert.deepEqual(Object.keys(SCENARIO_BLOCKS).sort(), Object.keys(SCENARIOS).sort());
  Object.values(SCENARIO_BLOCKS).forEach((b) => { assert.equal(b.length, 15); b.forEach((ts) => assert.ok(STATEMENTS[ts], ts)); });
  assert.deepEqual([...new Set(Object.values(SCENARIO_BLOCKS).flat())].sort(), Object.keys(STATEMENTS).sort());
  assert.deepEqual(domainCounts(Object.keys(SCENARIO_BLOCKS)), { D1: 24, D2: 16, D3: 18, D4: 18, D5: 14 });
});
test('catalog: 8 of 15 draws are within domain tolerance, each has an allowed follow-up, each covers 25–29 statements', () => {
  const ok = allDraws().filter(inTolerance);
  assert.equal(ok.length, 8);
  ok.forEach((d) => {
    const left = Object.keys(SCENARIOS).filter((k) => !d.includes(k));
    assert.ok(ok.some((n) => left.every((k) => n.includes(k))), `${d} has no allowed follow-up`);
    const n = new Set(d.flatMap((k) => SCENARIO_BLOCKS[k])).size; assert.ok(n >= 25 && n <= 29, `${d}: ${n} statements`);
  });
  assert.ok(ok.some((d) => d.includes('ma') && d.includes('ci')), 'no allowed first draw after sim4');
});
test('legacy SIM_SETS list is closed', () => {
  assert.deepEqual(SIM_SETS, ['sim', 'sim2', 'sim3', 'sim4']);
});
test('an unregistered full-size set fails the gate', () => {
  ALLOCATION.rogue = { '1.1': 50 };
  try { assert.match(runChecks([mk()], 'rogue', { partial: true }).failures.join('\n'), /register it in DRAWS/); }
  finally { delete ALLOCATION.rogue; }
  assert.doesNotMatch(runChecks([mk()], 'gauntlet', { partial: true }).failures.join('\n'), /register it in DRAWS/);
});
test('first draw after the legacy mocks must include ci and ma', () => {
  withDraws({ t1: ['cs', 'dp', 'de', 'cc'] }, () => assert.match(drawFailures('t1').join('\n'), /sim4 drew .* leaving ma\+ci unpractised/));
  withDraws({ t1: GOOD1 }, () => assert.deepEqual(drawFailures('t1'), []));
});
test('a draw must cover what the previous draw left out', () => {
  withDraws({ t1: GOOD1, t2: ['ma', 'cc', 'dp', 'de'] }, () => assert.match(drawFailures('t2').join('\n'), /t1 drew .* leaving cs unpractised/));
  withDraws({ t1: GOOD1, t2: GOOD2 }, () => assert.deepEqual(drawFailures('t2'), []));
});
test('the whole chain is re-checked: a draw inserted before a later one is caught when checking either', () => {
  withDraws({ t1: GOOD1, ins: GOOD1, t2: GOOD2 }, () => {
    assert.match(drawFailures('t2').join('\n'), /t1 drew .* and ins drew .* leaving cs\+dp/);
    assert.match(drawFailures('t1').join('\n'), /t1 drew .* and ins drew .* leaving cs\+dp/);
  });
});
test('a draw outside domain tolerance is reported', () => {
  withDraws({ t1: ['cs', 'ma', 'cc', 'ci'] }, () => assert.deepEqual(drawFailures('t1'), []));
  withDraws({ t1: ['cs', 'ma', 'dp', 'ci'], t2: ['cs', 'ma', 'dp', 'de'] }, () => assert.match(drawFailures('t2').join('\n'), /domain mix: D3 4/));
});
test('malformed draws are reported, including prototype keys, and full mode does not crash', () => {
  [['ma', 'ci', 'ci', 'de'], ['ma', 'ci', 'cs'], ['ma', 'ma', 'ci', 'cs', 'de'], ['ma', 'ci', 'cs', 'xx'], ['ma', 'ci', 'cs', 'toString'], 'macicsde'].forEach((d) => {
    assert.equal(validDraw(d), false, JSON.stringify(d));
    withDraws({ t1: d }, () => {
      assert.match(drawFailures('t1').join('\n'), /need 4 distinct/);
      assert.match(runChecks(synthDraw(['ma', 'ci', 'cs', 'de']), 't1', { meta: metaFor(['ma', 'ci', 'cs', 'de']) }).failures.join('\n'), /need 4 distinct/);
    });
  });
});
test('rotation failure shows in runChecks, partial included', () => {
  withDraws({ t1: ['cs', 'dp', 'de', 'cc'] }, () => assert.match(runChecks([mk({ s: 'cs', block: 'cs' })], 't1', { partial: true }).failures.join('\n'), /rotation/));
});
test('synthesised full drawn mock passes all gates', () => {
  withDraws({ t1: GOOD1 }, () => assert.deepEqual(runChecks(synthDraw(GOOD1), 't1', { meta: metaFor(GOOD1) }).failures, []));
});
test('drawn record outside the draw, or set in another scenario, is reported', () => {
  withDraws({ t1: GOOD1 }, () => {
    assert.match(runChecks([mk({ s: 'cs', block: 'cs' })], 't1', { partial: true }).failures.join('\n'), /needs block, one of/);
    assert.match(runChecks([mk({ s: 'ma', block: 'ci' })], 't1', { partial: true }).failures.join('\n'), /scenario "ma" ≠ block "ci"/);
    assert.match(runChecks([mk({ s: 'ci', block: 'ci', obj: [40] })], 't1', { partial: true }).failures.join('\n'), /obj must be/);
    const Q = synthDraw(GOOD1); Q[0].block = 'cs'; Q[0].s = 'cs';
    assert.match(runChecks(Q, 't1', { meta: metaFor(GOOD1) }).failures.join('\n'), /needs block, one of/);
  });
});
test('full drawn mock with a block off its template, or the wrong size, is reported', () => {
  withDraws({ t1: GOOD1 }, () => {
    let Q = synthDraw(GOOD1); Q.find((r) => r.block === 'ci' && r.ts === '3.6').ts = '3.4';
    assert.match(runChecks(Q, 't1', { meta: metaFor(GOOD1) }).failures.join('\n'), /block ci: statements/);
    Q = synthDraw(GOOD1).filter((r, i) => i !== 20);
    assert.match(runChecks(Q, 't1', { meta: metaFor(GOOD1) }).failures.join('\n'), /block cc: 14 ≠ 15/);
  });
});
test('drawn mock META.blocks must list the draw in order with guide titles', () => {
  withDraws({ t1: GOOD1 }, () => {
    const Q = synthDraw(GOOD1);
    assert.match(runChecks(Q, 't1').failures.join('\n'), /META.blocks missing/);
    assert.match(runChecks(Q, 't1', { meta: { blocks: [1, 2, 3, 4].map((id) => ({ id, title: 'x' })) } }).failures.join('\n'), /META.blocks ids/);
    const m = metaFor(GOOD1); m.blocks[2].title = 'CI';
    assert.match(runChecks(Q, 't1', { meta: m }).failures.join('\n'), /META.blocks ci: title/);
  });
});
test('drawn mock records must run block by block in draw order', () => {
  withDraws({ t1: GOOD1 }, () => {
    const Q = synthDraw(GOOD1); [Q[0], Q[20]] = [Q[20], Q[0]];
    assert.match(runChecks(Q, 't1', { meta: metaFor(GOOD1) }).failures.join('\n'), /record order/);
  });
});
test('SIM_SETS closure is enforced by check.js itself', () => {
  SIM_SETS.push('sim5');
  try { assert.match(runChecks([mk()], 'sim', { partial: true }).failures.join('\n'), /SIM_SETS is closed/); } finally { SIM_SETS.pop(); }
});
test('META.blocks with a null entry is reported, not a crash', () => {
  withDraws({ t1: GOOD1 }, () => {
    const m = metaFor(GOOD1); m.blocks[0] = null;
    assert.match(runChecks(synthDraw(GOOD1), 't1', { meta: m }).failures.join('\n'), /META.blocks missing or malformed/);
  });
});
