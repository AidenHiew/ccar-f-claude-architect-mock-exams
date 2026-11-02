// tutor/build/diff-audit.js — compare a blind audit against the data-file key (spec §7.2).
'use strict';
const fs = require('fs'), path = require('path');
const { ALLOCATION } = require('./statements.js');
const [set, auditFile] = process.argv.slice(2);
if (!Object.keys(ALLOCATION).includes(set) || !auditFile) { console.error(`usage: node diff-audit.js ${Object.keys(ALLOCATION).join('|')} <audit.json>`); process.exit(2); }
// Pass rule scales with paper size; Math.round as in check.js. For 60 it is the original ≥57 agree / ≤3 trivial.
const total = Object.values(ALLOCATION[set]).reduce((x, y) => x + y, 0);
const minAgree = Math.round(total * 0.95), maxTrivial = Math.round(total * 0.05);
const { Q } = require(path.join(__dirname, 'data', `${set}.js`));
const audit = JSON.parse(fs.readFileSync(auditFile, 'utf8'));
const byN = Object.fromEntries(audit.map((a) => [a.n, a]));
let agree = 0; const dis = [], flags = [];
Q.forEach((q, i) => {
  const a = byN[i + 1]; const key = 'ABCD'[q.a];
  if (!a) { dis.push(`${q.id}: MISSING from audit`); return; }
  if (a.answer === key) agree++; else dis.push(`${q.id} (Q${i + 1}): key ${key} · audit ${a.answer} [${a.confidence}] — ${a.reason}`);
  if (a.flag) flags.push(`${q.id} (Q${i + 1}): ${a.flag} — ${a.reason}`);
});
const trivial = audit.filter((a) => a.flag === 'trivially-obvious').length;
console.log(`${set}: agreement ${agree}/${Q.length} (need ≥${minAgree}) · trivially-obvious ${trivial} (max ${maxTrivial})`);
if (dis.length) console.log('\nDISAGREEMENTS\n' + dis.map((d) => ' • ' + d).join('\n'));
if (flags.length) console.log('\nFLAGS\n' + flags.map((f) => ' • ' + f).join('\n'));
process.exit(agree >= minAgree && trivial <= maxTrivial ? 0 : 1);
