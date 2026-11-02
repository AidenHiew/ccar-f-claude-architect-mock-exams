#!/usr/bin/env node
// Gate for authored quizzes embedded in lessons/*.html (the `const QUIZ = [...]` array).
// Run before considering any lesson or drill finished:
//   node tutor/build/check-quiz.js lessons/*.html
//
// Why this exists: some third-party mocks leak their key through option length
// (correct = longest option in 55-57 of 60 questions per round). Drill 7 was
// authored with the same leak in 4 of 8 questions and only caught by an ad hoc
// check. Gate it, don't rely on remembering.

const fs = require("fs");

const RULES = {
  maxSpread: 14,      // chars between longest and shortest option in a question
  maxKeyRun: 3,       // identical key position repeated this many times in a row
  keyMargin: 8,       // a key longer than every distractor by this much is visibly the longest
  keyLongestShare: 0.4, // and across a quiz, the key should rarely be the longest at all
};

function parseQuiz(file) {
  const src = fs.readFileSync(file, "utf8");
  const m = src.match(/const QUIZ = (\[[\s\S]*?\n\];)/);
  if (!m) return null;
  return Function(`"use strict"; return (${m[1].replace(/;$/, "")});`)();
}

let failed = 0;
const files = process.argv.slice(2);
if (!files.length) {
  console.error("usage: node tutor/build/check-quiz.js <lesson.html> [...]");
  process.exit(2);
}

for (const file of files) {
  const quiz = parseQuiz(file);
  if (!quiz) continue; // lessons without a quiz are fine
  const errs = [];
  const keys = [];

  quiz.forEach((q, i) => {
    const at = `Q${i + 1}`;
    if (!Array.isArray(q.opts) || q.opts.length !== 4) errs.push(`${at}: needs exactly 4 options`);
    if (typeof q.ok !== "number" || q.ok < 0 || q.ok > 3) errs.push(`${at}: ok must be 0-3`);
    if (!q.stem || !q.stem.trim()) errs.push(`${at}: empty stem`);
    if (!q.fb || !q.fb.trim()) errs.push(`${at}: empty feedback`);
    if (!Array.isArray(q.opts)) return;
    if (q.opts.some(o => !o || !o.trim())) errs.push(`${at}: empty option text`);

    const lens = q.opts.map(o => o.length);
    const longestOther = Math.max(...lens.filter((_, j) => j !== q.ok));
    // Only a visible margin leaks the key; 1-3 chars is noise, not a tell.
    if (lens[q.ok] - longestOther >= RULES.keyMargin) {
      errs.push(`${at}: key is visibly the longest option (${lens[q.ok]} vs ${longestOther}) — length leak`);
    }
    const spread = Math.max(...lens) - Math.min(...lens);
    if (spread > RULES.maxSpread) errs.push(`${at}: option length spread ${spread} > ${RULES.maxSpread}`);
    // Note: no "option starts with A-D" rule — options legitimately begin with the
    // article "A" ("A skill in that repo..."), which made that check pure noise.
    if (q.opts.some(o => /^[A-D]\)/.test(o))) errs.push(`${at}: option text carries its own "A)" label`);
    // Shape leak: the key is the only option with a split ("x; y") or a snake_case field name
    // (blind audit, 2026-10-16: lesson 16 Q2 and Q4 were pickable on shape alone).
    for (const [name, re] of [["semicolon split", /;/], ["snake_case name", /\b[a-z]+_[a-z_]+\b/]]) {
      const hits = q.opts.map(o => re.test(o));
      // Warn only: lessons 1, 9-11 and 15 were served before this rule and still trip it.
      if (hits[q.ok] && hits.filter(Boolean).length === 1) console.warn(`warn ${file.split("/").pop()} ${at}: only the key has a ${name} — shape leak`);
    }
    keys.push(q.ok);
  });

  // Aggregate leak: across a whole quiz the key should seldom be the longest option at all.
  const keyLongest = quiz.filter(q => Array.isArray(q.opts) &&
    q.opts[q.ok].length > Math.max(...q.opts.filter((_, j) => j !== q.ok).map(o => o.length))).length;
  if (quiz.length >= 6 && keyLongest / quiz.length > RULES.keyLongestShare) {
    errs.push(`key is the longest option in ${keyLongest}/${quiz.length} questions — systematic length leak`);
  }

  // Style leak: purpose clauses ("so that …") padded onto distractors but not keys (blind audit, 2026-10-09).
  const pc = (o) => /\bso (that )?\b/i.test(o);
  const full = quiz.filter(q => Array.isArray(q.opts) && q.opts.length === 4);
  if (full.length >= 8) {
    const keyPc = full.filter(q => pc(q.opts[q.ok])).length / full.length;
    const wrongPc = full.reduce((n, q) => n + q.opts.filter((o, j) => j !== q.ok && pc(o)).length, 0) / (3 * full.length);
    if (Math.abs(keyPc - wrongPc) > 0.15) errs.push(`purpose-clause tell: keys ${(keyPc * 100).toFixed(0)}% vs distractors ${(wrongPc * 100).toFixed(0)}% (max gap 15 pts)`);
  }

  // key positions must not all be the same, nor run too long in one position
  if (keys.length && new Set(keys).size === 1) errs.push(`every key is position ${keys[0]}`);
  let run = 1;
  for (let i = 1; i < keys.length; i++) {
    run = keys[i] === keys[i - 1] ? run + 1 : 1;
    if (run > RULES.maxKeyRun) { errs.push(`key position ${keys[i]} repeats ${run}x in a row (Q${i + 1})`); break; }
  }

  const label = file.split("/").pop();
  if (errs.length) {
    failed++;
    console.log(`FAIL ${label}`);
    errs.forEach(e => console.log(`  - ${e}`));
  } else {
    console.log(`ok   ${label}  (${quiz.length} questions, keys ${keys.join("")})`);
  }
}

process.exit(failed ? 1 : 0);
