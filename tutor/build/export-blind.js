// tutor/build/export-blind.js — key-stripped export for the blind audit (spec §7.2).
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { STATEMENTS, SCENARIOS, ALLOCATION } = require('./statements.js');
const set = process.argv[2];
if (!Object.keys(ALLOCATION).includes(set)) { console.error(`usage: node export-blind.js ${Object.keys(ALLOCATION).join('|')}`); process.exit(2); }
const { Q, META } = require(path.join(__dirname, 'data', `${set}.js`));
const outDir = process.env.AUDIT_DIR || path.join(os.tmpdir(), 'cca-audit');
fs.mkdirSync(outDir, { recursive: true });
let md = `# ${META.title} — ${Q.length} questions, NO answer key\n\n`;
Q.forEach((q, i) => {
  md += `## Q${i + 1} [${q.id} · ${q.ts} ${STATEMENTS[q.ts]}] (${SCENARIOS[q.s]})\n${q.q}\n`;
  q.o.forEach((o, j) => { md += `- ${'ABCD'[j]}) ${o}\n`; });
  md += '\n';
});
// Leak self-check on VALUES, not vocabulary: stems legitimately contain words like "wrong" and "cite".
const leaked = Q.some((q) => md.includes(q.why) || md.includes(q.cite) || Object.values(q.wrong).some((w) => md.includes(w.text)))
  || /\bbp\s*:/.test(md);
if (leaked) { console.error('export leaked key fields — nothing written'); process.exit(1); }
const file = path.join(outDir, `${set}-blind.md`);
fs.writeFileSync(file, md);
console.log(file);
