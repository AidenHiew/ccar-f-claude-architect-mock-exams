// tutor/build/statements.js — single source of truth for exam structure (spec §4, §5).
'use strict';

const STATEMENTS = {
  '1.1': 'Agentic loops (stop_reason control flow)',
  '1.2': 'Coordinator–subagent orchestration',
  '1.3': 'Subagent invocation, context passing, spawning',
  '1.4': 'Multi-step workflows: enforcement & handoffs',
  '1.5': 'Agent SDK hooks (interception, normalization)',
  '1.6': 'Task decomposition strategies',
  '1.7': 'Session state, resumption, forking',
  '2.1': 'Tool interface design (descriptions, boundaries)',
  '2.2': 'Structured error responses for MCP tools',
  '2.3': 'Tool distribution & tool_choice',
  '2.4': 'MCP server integration (scoping, env vars, resources)',
  '2.5': 'Built-in tools (Read/Write/Edit/Bash/Grep/Glob)',
  '3.1': 'CLAUDE.md hierarchy & modular organization',
  '3.2': 'Custom slash commands & skills',
  '3.3': 'Path-specific rules (.claude/rules/ globs)',
  '3.4': 'Plan mode vs direct execution',
  '3.5': 'Iterative refinement techniques',
  '3.6': 'CI/CD integration (-p, --output-format json)',
  '4.1': 'Explicit criteria to reduce false positives',
  '4.2': 'Few-shot prompting',
  '4.3': 'Structured output via tool use + JSON schemas',
  '4.4': 'Validation, retry, and feedback loops',
  '4.5': 'Batch processing strategies',
  '4.6': 'Multi-instance & multi-pass review',
  '5.1': 'Context preservation in long interactions',
  '5.2': 'Escalation & ambiguity resolution',
  '5.3': 'Error propagation in multi-agent systems',
  '5.4': 'Context management in large codebase exploration',
  '5.5': 'Human review workflows & confidence calibration',
  '5.6': 'Provenance & uncertainty in multi-source synthesis',
};

const DOMAINS = [
  { tag: 'D1', name: 'Agentic Architecture & Orchestration', pct: 27 },
  { tag: 'D2', name: 'Tool Design & MCP Integration', pct: 18 },
  { tag: 'D3', name: 'Claude Code Configuration & Workflows', pct: 20 },
  { tag: 'D4', name: 'Prompt Engineering & Structured Output', pct: 20 },
  { tag: 'D5', name: 'Context Management & Reliability', pct: 15 },
];

const DOMAIN_OF = (id) => 'D' + String(id).split('.')[0];

const SCENARIOS = {
  cs: 'Customer Support Resolution Agent',
  ma: 'Multi-Agent Research System',
  cc: 'Code Generation with Claude Code',
  de: 'Structured Data Extraction',
  dp: 'Developer Productivity with Claude',
  ci: 'Claude Code for CI',
};

// Scenario passage for the exam screen's left pane (2026-11-01), used when a paper has no META.blocks intro for the question.
// Our own wording; the guide's scenario text is not reused (the guide is marked Confidential NTK).
const SCENARIO_TEXT = {
  cs: ['You are building a customer support agent on the Claude Agent SDK. It handles messy requests such as refunds, billing disputes and account problems, and reaches the company’s backend through MCP tools: looking up customers and orders, issuing refunds, and handing a case to a human.',
    'The business wants most issues solved in the first conversation, without the agent acting beyond what it is allowed to decide on its own.'],
  ma: ['You are building a research assistant on the Claude Agent SDK. A coordinator agent receives a research brief, splits it into parts, and hands each part to a specialist subagent: one searches the web, one reads and analyses documents, one combines the findings, and one writes the final report with citations.',
    'Subagents don’t share memory. Each one sees only what the coordinator passes to it, and returns its results to the coordinator.'],
  cc: ['Your team uses Claude Code every day to write new code, refactor, debug and write documentation.',
    'You are deciding how to set it up for the whole team: what goes in CLAUDE.md, which custom commands and skills to share, and when a task needs a plan first instead of going straight to edits.'],
  dp: ['You are building an internal tool on the Claude Agent SDK that helps engineers work in code they don’t know: finding their way around a large or old codebase, generating repetitive code, and automating chores.',
    'The agent works through the built-in tools for reading, searching, editing and running commands, and connects to MCP servers for other systems.'],
  ci: ['Your team runs Claude Code inside its continuous-integration pipeline. On every pull request, a job starts Claude Code with no one at the keyboard. It reviews the change, writes or updates tests, and posts its findings back to the pull request.',
    'The pipeline has to read Claude’s output as data, so the format matters. A run must never stop to wait for input. Developers will start ignoring the bot if it repeats itself or flags things that aren’t real problems.'],
  de: ['You are building a system that pulls structured data out of messy documents such as invoices, forms and reports. Claude’s output must match a JSON schema so that downstream systems can load it without fixing it by hand.',
    'Documents vary a lot, and fields are sometimes missing or contradict each other. The system has to cope with those cases without inventing data.'],
};

const TRAPS = [
  'symptom-fix', 'over-engineered', 'probabilistic', 'wrong-problem',
  'nonexistent-feature', 'blame-shifting', 'reactive-too-late', 'error-suppression',
];

// spec §4 — Gauntlet: 60 = 18 (weakest ×6) + 20 (weak ×4) + 22 (coverage ×1)
const gauntlet = {};
Object.keys(STATEMENTS).forEach((id) => { gauntlet[id] = 1; });
Object.assign(gauntlet, { '1.2': 6, '4.5': 6, '5.2': 6, '2.5': 4, '3.1': 4, '3.4': 4, '4.4': 4, '5.1': 4 });

// Representative full mock (re-planned 2026-10-19): D1 16 / D2 11 / D3 12 / D4 12 / D5 9 = the blueprint weights × 60.
// Within each domain, counts follow the 29 objectives on the attempt-1 score report (not public):
// 4.3 carries three objectives (21–23), 5.4 and 5.5 carry the 0% / 33% objectives 15 and 19.
const sim = {
  '1.1': 2, '1.2': 3, '1.3': 2, '1.4': 3, '1.5': 2, '1.6': 2, '1.7': 2,
  '2.1': 2, '2.2': 2, '2.3': 2, '2.4': 2, '2.5': 3,
  '3.1': 2, '3.2': 2, '3.3': 2, '3.4': 2, '3.5': 2, '3.6': 2,
  '4.1': 2, '4.2': 2, '4.3': 3, '4.4': 2, '4.5': 2, '4.6': 1,
  '5.1': 1, '5.2': 2, '5.3': 1, '5.4': 2, '5.5': 2, '5.6': 1,
};

// Second representative full mock (2026-10-22): the sim allocation exactly, all-new questions, same SIM_BLOCKS matrix.
const sim2 = { ...sim };

// Third representative full mock (2026-10-23): the booking-gate readiness read. The sim allocation exactly, all-new questions,
// same SIM_BLOCKS matrix; exam-proportional, not weighted toward weak rows.
const sim3 = { ...sim };

// Fourth representative full mock (late October 2026): the final confirming read before booking. The sim allocation exactly, all-new
// questions and settings, same SIM_BLOCKS matrix; exam-proportional, not weighted toward weak rows.
const sim4 = { ...sim };

// Fresh Paper 1 (late October 2026): replaces sim4 as the booking check (sim4 abandoned, 51/60 near-copies of answered questions).
// 6 angles no past key used + 9 two-fact items, D1 3 / D2 2 / D3 3 / D4 3 / D5 4.
const fresh1 = { '1.1': 1, '1.3': 1, '1.4': 1, '2.1': 1, '2.3': 1, '3.1': 1, '3.3': 1, '3.5': 1, '4.2': 1, '4.3': 1, '4.5': 1, '5.1': 1, '5.2': 1, '5.3': 1, '5.6': 1 };

// D2-only drill: 11 = 18% of 60, tilted to the 0% objectives (2.1, 2.3) from the attempt-1 score report.
const d2 = { '2.1': 3, '2.2': 2, '2.3': 3, '2.4': 1, '2.5': 2 };
const d2r = { ...d2 }; // D2 paper 2 — same split, questions re-test recorded D2 miss patterns.

// Domain 1 paper — same D1 split as the sim (16 = 27% of 60).
const d1 = { '1.1': 2, '1.2': 3, '1.3': 2, '1.4': 3, '1.5': 2, '1.6': 2, '1.7': 2 };

// Domain 5 paper — 9 = 15% of 60, tilted to 5.4 / 5.5 (0% / 33% objectives on the attempt-1 score report).
const d5 = { '5.1': 1, '5.2': 2, '5.3': 1, '5.4': 2, '5.5': 2, '5.6': 1 };

// Misses paper — one question per recorded miss mechanism (learning records 0001–0026 + attempt-1 score report).
const dm = { '1.1': 1, '1.2': 2, '1.3': 1, '1.4': 2, '1.6': 1, '1.7': 1, '2.1': 2, '2.2': 1, '2.3': 2, '2.4': 1, '2.5': 3,
  '3.1': 1, '3.2': 2, '3.3': 1, '3.5': 2, '4.1': 1, '4.3': 1, '4.4': 1, '4.5': 2,
  '5.1': 1, '5.2': 3, '5.3': 1, '5.4': 1, '5.5': 2, '5.6': 1 };

// 3.4 add-on to the misses paper (2026-10-21 re-test): dm has no 3.4 item.
const d34 = { '3.4': 2 };

// D2/D3 focused paper (2026-10-22): the 7 weak rows after the 2026-10-19 representative mock (2.4, 2.5, 3.1–3.5) ×3–4, plus coverage.
const d23 = { '2.1': 3, '2.2': 1, '2.3': 2, '2.4': 3, '2.5': 4, '3.1': 3, '3.2': 3, '3.3': 3, '3.4': 3, '3.5': 3, '3.6': 2 };

// D2/D3 Paper 2 (2026-10-22): weighted to the grid after the d23 result (LR-0031): 3.1 and 2.4 ×4 (personal-location map),
// 2.5 ×4 (git-history shape), 3.3 ×4 (when-does-it-fire), 2.3 ×3 (two-constraint least privilege).
const d23b = { '2.1': 2, '2.2': 1, '2.3': 3, '2.4': 4, '2.5': 4, '3.1': 4, '3.2': 3, '3.3': 4, '3.4': 2, '3.5': 2, '3.6': 1 };

// D2/D3 Paper 3 (2026-10-23): weighted to the weak rows after Paper 2 (LR-0033): 3.1 ×5, 3.3, 2.3 ×4, 3.5, 3.6 ×3.
const d23c = { '2.1': 2, '2.2': 1, '2.3': 4, '2.4': 2, '2.5': 2, '3.1': 5, '3.2': 2, '3.3': 4, '3.4': 2, '3.5': 3, '3.6': 3 };

// D1/D4/D5 paper (2026-10-20): re-tests the three domains the representative mock had all correct but the real exam did not
// (D1 67%, D5 57%). Weighted to the weak score-report objectives (LR-0015): 5.4 / 1.4 (0%), 5.5 (33%), 1.1 / 1.6 / 4.2 (50%), 4.3 (67%).
const d145 = {
  '1.1': 2, '1.2': 1, '1.3': 2, '1.4': 2, '1.6': 2, '1.7': 1,
  '4.1': 1, '4.2': 2, '4.3': 2, '4.4': 1, '4.5': 1, '4.6': 1,
  '5.1': 1, '5.2': 2, '5.3': 2, '5.4': 2, '5.5': 3, '5.6': 2,
};

// D2/D3 Paper 4 (2026-10-21): exam-weighted, candidate's pick. D2 14 / D3 16 = the blueprint's 18:20 ratio × 30; within each
// domain, near-even like the sim, with 3.4 and 3.6 at 2.
const d23d = { '2.1': 3, '2.2': 2, '2.3': 3, '2.4': 3, '2.5': 3, '3.1': 3, '3.2': 3, '3.3': 3, '3.4': 2, '3.5': 3, '3.6': 2 };

// D2/D3 Paper 5 (2026-10-21): exam proportion (D2 11 / D3 12 = the sim's D2/D3 counts), not weighted toward weak rows.
// Same as the sim except 2.4 ×3 / 2.5 ×2 (one 2.4 slot is the pending-approval item from LR-0038).
const d23e = { '2.1': 2, '2.2': 2, '2.3': 2, '2.4': 3, '2.5': 2, '3.1': 2, '3.2': 2, '3.3': 2, '3.4': 2, '3.5': 2, '3.6': 2 };

// Weak-rows re-test 1 (2026-10-24): the 11 weak rows after Representative Mock 2 (LR-0040), plus one 5.5 item where calibrated
// confidence routing IS the key (contrast with the self-assigned score-and-filter distractors on 4.1/4.2/4.4).
const wr1 = { '1.2': 2, '1.3': 3, '1.5': 3, '1.7': 2, '2.5': 2, '3.2': 2, '4.1': 3, '4.2': 3, '4.3': 3, '4.4': 3, '4.5': 2, '5.5': 1 };

const wr2 = { '4.1': 4, '4.2': 4, '4.5': 5, '5.5': 6 };

// Weak-rows re-test 3 (2026-10-25): the 7 weak rows after Representative Mock 3 (LR-0043), sized so each clears only if all correct.
const wr3 = { '1.1': 5, '1.6': 5, '3.3': 5, '3.5': 5, '4.1': 5, '4.2': 3, '5.5': 3 };

// Weak-rows re-test 4 (2026-10-25): the 4 weak rows after Weak Rows Paper 3 (LR-0045), sized so each clears on all correct pooled with wr3.
const wr4 = { '1.1': 5, '1.6': 9, '3.5': 5, '4.2': 5 };
// Weak-rows re-test 5 (2026-10-26): the 2 weak rows after Weak Rows Paper 4 (LR-0046), sized so each clears on all correct pooled with wr4.
const wr5 = { '3.5': 5, '4.2': 5 };
// Weak-rows re-test 6 (2026-10-26): the 2 weak rows after Weak Rows Paper 5 (LR-0048), sized so each clears on all correct pooled with wr5.
const wr6 = { '3.5': 5, '4.2': 5 };
// Weak-rows re-test 7 (late October 2026): the 2 weak rows after Weak Rows Paper 6 (LR-0049); 3.5 x9 is the fewest that clears on all correct pooled with wr6.
const wr7 = { '3.5': 9, '4.2': 3 };
const ALLOCATION = { gauntlet, sim, d2, d1, d2r, d5, dm, d34, d23, d23b, d23c, d145, d23d, d23e, sim2, wr1, sim3, wr2, wr3, wr4, wr5, wr6, sim4, fresh1, wr7 };

// Sets that must carry bp.weight / bp.scope / bp.trigger tags, with the minimum number of tagged items for each
// (check.js balances heavy-vs-light, personal-vs-shared and the four triggers; a minimum stops 1 heavy + 1 light passing as "balanced").
const TAGGED_SETS = { d23: { weight: 10, scope: 6 }, d23b: { weight: 6, scope: 8, trigger: 8 }, d23c: { weight: 6, scope: 8, trigger: 8 },
  d23d: { weight: 6, scope: 5, trigger: 6 }, d23e: { weight: 4, scope: 6, trigger: 5 }, sim2: { weight: 6, scope: 5, trigger: 5 },
  sim3: { weight: 6, scope: 5, trigger: 5 }, sim4: { weight: 6, scope: 5, trigger: 5 } };

// LEGACY sim block matrix, kept so sim–sim4 still check as they were sat. Do not use it for a new full mock: use SCENARIO_BLOCKS + DRAWS.
// It fixed every full mock to the four scenarios attempt 1's score report mapped onto (inferred), so CI and Multi-Agent Research
// were never practised as blocks.
const SIM_BLOCKS = [
  { id: 1, key: 'cs', title: 'Customer Support Resolution Agent', size: 15, domains: { D1: 7, D2: 3, D4: 1, D5: 4 },
    statements: ['1.1', '1.1', '1.3', '1.4', '1.4', '1.4', '1.5', '2.1', '2.2', '2.3', '4.2', '5.1', '5.2', '5.2', '5.3'] },
  { id: 2, key: 'cc', title: 'Code Generation with Claude Code', size: 15, domains: { D1: 1, D3: 12, D4: 2 },
    statements: ['1.5', '3.1', '3.1', '3.2', '3.2', '3.3', '3.3', '3.4', '3.4', '3.5', '3.5', '3.6', '3.6', '4.1', '4.6'] },
  { id: 3, key: 'dp', title: 'Developer Productivity with Claude', size: 15, domains: { D1: 8, D2: 5, D5: 2 },
    statements: ['1.2', '1.2', '1.2', '1.3', '1.6', '1.6', '1.7', '1.7', '2.4', '2.4', '2.5', '2.5', '2.5', '5.4', '5.4'] },
  { id: 4, key: 'de', title: 'Structured Data Extraction', size: 15, domains: { D2: 3, D4: 9, D5: 3 },
    statements: ['2.1', '2.2', '2.3', '4.1', '4.2', '4.3', '4.3', '4.3', '4.4', '4.4', '4.5', '4.5', '5.5', '5.5', '5.6'] },
];

// LEGACY full mocks that use the SIM_BLOCKS matrix and must tag every record with block + obj. Closed list: new full mocks go in DRAWS.
const SIM_SETS = ['sim', 'sim2', 'sim3', 'sim4'];

// Scenario catalog (2026-10-28): one 15-item block per guide scenario (reference/ccar-f-official-exam-guide.md §5), statements
// picked to fit each scenario's primary domains and the guide's own examples (Opus review: 1.4 is customer-support enforcement,
// 2.4 is Claude Code MCP config, 4.2/4.4 are review-pipeline wording). The exam draws 4 of 6 scenarios per sitting, so a full
// mock draws from all six here, never from one score report. Over all six blocks: D1 24 · D2 16 · D3 18 · D4 18 · D5 14
// (= blueprint weights × 90), and all 30 statements appear. One mock covers 4 scenarios and 25–29 statements; two consecutive
// mocks cover all 6 and all 30 (rotation gate). 8 of the 15 possible draws stay within DOMAIN_TOLERANCE of the weights; check.js
// rejects the other 7, and every allowed draw has an allowed follow-up.
const SCENARIO_BLOCKS = {
  cs: ['1.1', '1.1', '1.1', '1.4', '1.4', '1.5', '1.5', '2.1', '2.2', '2.3', '2.3', '4.2', '5.1', '5.2', '5.2'],
  ma: ['1.2', '1.2', '1.3', '1.3', '1.6', '1.6', '1.7', '2.1', '2.2', '2.3', '4.3', '5.3', '5.3', '5.6', '5.6'],
  cc: ['1.6', '1.7', '2.4', '2.5', '3.1', '3.1', '3.2', '3.3', '3.4', '3.4', '3.5', '4.2', '5.1', '5.4', '5.4'],
  dp: ['1.1', '1.2', '1.3', '1.7', '2.1', '2.4', '2.4', '2.5', '2.5', '3.1', '3.2', '3.3', '3.5', '4.1', '5.4'],
  ci: ['3.1', '3.2', '3.5', '3.6', '3.6', '3.6', '3.6', '4.1', '4.1', '4.2', '4.3', '4.4', '4.5', '4.5', '4.6'],
  de: ['1.4', '1.4', '1.5', '1.6', '2.1', '2.3', '4.1', '4.2', '4.3', '4.3', '4.4', '4.5', '5.5', '5.5', '5.6'],
};

// Max distance, in items, between a draw's domain count and blueprint weight × 60 (guide §4: weights are the approximate
// proportion of scored items on the exam).
const DOMAIN_TOLERANCE = 4;

// A set this size or larger is a full mock and must be in SIM_SETS (legacy) or DRAWS. gauntlet predates scenario blocks.
const FULL_SIZE = 45;
const FULL_SIZE_EXEMPT = ['gauntlet'];

// Full mocks drawn from SCENARIO_BLOCKS, in build order: set → its 4 scenario keys. Each record carries block = s = its scenario key.
// Allocation is derived from the draw; don't also list these sets by hand in ALLOCATION.
const DRAWS = {
  full1: ['cs', 'ma', 'dp', 'ci'], // 2026-11-01, plan phase 2: with sim4's legacy draw before it, covers all 6
  full2: ['cs', 'cc', 'ci', 'de'], // 2026-11-01: with full1, covers all 6; CI drawn twice in a row
};

// The scenarios the legacy SIM_SETS drew, for the rotation gate.
const LEGACY_DRAW = SIM_BLOCKS.map((b) => b.key);

const drawAllocation = (keys) => {
  const a = {};
  (Array.isArray(keys) ? keys : []).forEach((k) => (Object.hasOwn(SCENARIO_BLOCKS, k) ? SCENARIO_BLOCKS[k] : []).forEach((ts) => { a[ts] = (a[ts] || 0) + 1; }));
  return a;
};
Object.entries(DRAWS).forEach(([set, keys]) => { ALLOCATION[set] = drawAllocation(keys); });

// Score-report objectives (attempt-1 score report, not public; report order). Sim records tag theirs in `obj`.
const OBJECTIVE_COUNT = 29;

module.exports = { STATEMENTS, DOMAINS, DOMAIN_OF, SCENARIOS, SCENARIO_TEXT, TRAPS, ALLOCATION, SIM_BLOCKS, OBJECTIVE_COUNT, TAGGED_SETS, SIM_SETS,
  SCENARIO_BLOCKS, DRAWS, LEGACY_DRAW, drawAllocation, DOMAIN_TOLERANCE, FULL_SIZE, FULL_SIZE_EXEMPT };
