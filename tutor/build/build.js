// tutor/build/build.js — inline data into the template (spec §6).
'use strict';
const fs = require('fs'), path = require('path');
const { STATEMENTS, SCENARIOS, SCENARIO_TEXT, DOMAINS, DRAWS } = require('./statements.js');
const OUT = { gauntlet: 'mock-gauntlet.html', sim: 'mock-final-sim.html', d1: 'mock-d1.html', d2: 'mock-d2.html', d2r: 'mock-d2-paper2.html', d5: 'mock-d5.html', dm: 'mock-misses.html', d34: 'mock-d34-addon.html', d23: 'mock-d23.html', d23b: 'mock-d23-paper2.html', d23c: 'mock-d23-paper3.html', d23d: 'mock-d23-paper4.html', d23e: 'mock-d23-paper5.html', d145: 'mock-d145.html', sim2: 'mock-final-sim2.html', wr1: 'mock-weak-rows-1.html', sim3: 'mock-final-sim3.html', wr2: 'mock-weak-rows-2.html', wr3: 'mock-weak-rows-3.html', wr4: 'mock-weak-rows-4.html', wr5: 'mock-weak-rows-5.html', wr6: 'mock-weak-rows-6.html', sim4: 'mock-final-sim4.html', fresh1: 'mock-fresh-1.html', wr7: 'mock-weak-rows-7.html' };
// Drawn full mocks (DRAWS) build to mock-<set>.html unless listed above.
Object.keys(DRAWS).forEach((k) => { OUT[k] ??= `mock-${k}.html`; });

function render(META, Q) {
  const tpl = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
  if (!tpl.includes('/*__DATA__*/') || !tpl.includes('__TITLE__')) throw new Error('template markers missing');
  const data = Object.entries({ META, Q, STATEMENTS, SCENARIOS, SCENARIO_TEXT, DOMAINS }).map(([k, v]) => `const ${k} = ${JSON.stringify(v)};`).join('\n');
  return tpl.replace('/*__DATA__*/', () => data).replace('__TITLE__', () => META.title);
}

if (require.main === module) {
  const set = process.argv[2];
  const have = Object.keys(OUT).filter((k) => fs.existsSync(path.join(__dirname, 'data', `${k}.js`)));
  if (!have.includes(set)) { console.error(`usage: node build.js ${have.join('|')}${OUT[set] ? `\n(${set} is registered but tutor/build/data/${set}.js is missing)` : ''}`); process.exit(2); }
  const { META, Q } = require(path.join(__dirname, 'data', `${set}.js`));
  const html = render(META, Q);
  const out = path.join(__dirname, '..', OUT[set]);
  fs.writeFileSync(out, html);
  console.log(`wrote ${path.relative(process.cwd(), out)} (${(html.length / 1024).toFixed(1)} KB, ${Q.length} questions)`);
}

module.exports = { render };
