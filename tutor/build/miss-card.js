#!/usr/bin/env node
// Render past-miss cards (assets/miss.css) from the question's stored text,
// never from memory. Usage: node tutor/build/miss-card.js <spec.json>
// spec: [{ title, pick: "B", why: "<html>", marks: ["phrase in stem", ...],
//          bankStem: "first words of the **Stem:** in tutor/question-bank.md" | data: "sim", id: "S19" }]
const fs = require("fs");
const path = require("path");
const L = "ABCD";
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const bank = fs.readFileSync(path.join(__dirname, "../question-bank.md"), "utf8");

function fromBank(prefix) {
  const hits = bank.split("\n").map((l, i) => [l, i]).filter(([l]) => l.startsWith("**Stem:** " + prefix));
  if (hits.length !== 1) throw new Error(`bankStem "${prefix}" matched ${hits.length} stems`);
  const lines = bank.split("\n").slice(hits[0][1], hits[0][1] + 8);
  const stem = lines[0].slice("**Stem:** ".length);
  const optLine = lines.find(l => l.startsWith("A) "));
  const opts = optLine.split(/\s{2}(?=[B-D]\) )/).map(o => o.slice(3));
  const key = L.indexOf(lines.find(l => l.startsWith("**Answer:** "))["**Answer:** ".length]);
  return { stem, opts, key };
}
function fromData(set, id) {
  const { Q } = require(path.join(__dirname, "data", set + ".js"));
  const q = Q.find(x => x.id === id);
  if (!q) throw new Error(`no ${id} in data/${set}.js`);
  return { stem: q.q, opts: q.o, key: q.a };
}

const spec = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const out = spec.map(c => {
  const { stem, opts, key } = c.bankStem ? fromBank(c.bankStem) : fromData(c.data, c.id);
  if (opts.length !== 4) throw new Error(c.title + ": expected 4 options");
  const pick = L.indexOf(c.pick);
  if (pick < 0 || pick === key) throw new Error(c.title + ": pick must be a wrong option");
  let s = esc(stem);
  for (const m of c.marks || []) {
    const e = esc(m);
    if (s.split(e).length !== 2) throw new Error(`${c.title}: mark "${m}" must occur once in the stem`);
    s = s.replace(e, `<mark>${e}</mark>`);
  }
  const rest = [0, 1, 2, 3].filter(i => i !== pick && i !== key);
  return `<section class="mc">
  <p class="mc-h">${esc(c.title)}</p>
  <p class="mc-stem">${s}</p>
  <div class="mc-vs"><div class="mc-p"><b>✗ Your pick: ${L[pick]}</b>${esc(opts[pick])}</div><div class="mc-k"><b>✓ Correct: ${L[key]}</b>${esc(opts[key])}</div></div>
  <details open><summary>The other two options (${rest.map(i => L[i]).join(", ")})</summary><ul class="mc-o">${rest.map(i => `<li><span class="mc-l">${L[i]}</span><span>${esc(opts[i])}</span></li>`).join("")}</ul></details>
  <div class="mc-why">${c.why}</div>
</section>`;
}).join("\n");
process.stdout.write(out + "\n");
