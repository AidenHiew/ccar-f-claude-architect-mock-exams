---
name: mock-exam
description: Build a CCA-F mock exam paper — single-domain (that domain's share of 60) or a full 60-question mock — through the tutor/build pipeline, then grade the user's returned PDF. Use whenever the user asks for a mock, mock exam, practice paper, exam-style quiz on a domain, or "quiz me on domain N like the exam". Reference build: D2 Paper 2 (tutor/build/data/d2r.js).
---

# Mock exam — standard build

Reference build: `tutor/build/data/d2r.js` → `tutor/mock-d2-paper2.html`. Read it before authoring. Work from the repo root.

## 0. Guide check, then ask
This kit was built against the official exam guide **Version 1.0, effective July 2026**. Find the version line (on the cover page, e.g. "Version 1.0") in `reference/ccar-f-official-exam-guide.md`. If the file is missing, stop and ask the user to save a text copy there (README, Step 1). If the version isn't 1.0, or none is found, stop: tell the user, and offer to bring the kit up to date first (README, option C) by comparing the guide with `tutor/build/statements.js` (the kit's record of Version 1.0), listing the task statements, scenarios and weights added, removed or changed, updating `tutor/build/statements.js`, and flagging ready-made papers that test changed statements. Build on the old blueprint only if the user says so.

Then, before you author anything, read state (step 1) and ask the user once:
- **Scope**, if the request doesn't already say it: one domain or a full 60-question mock.
- **Mix:** how many slots re-test recorded misses (a fresh question on the same mechanism, in a new setting) and how many go to exam-proportional coverage. Lead with a recommended split and list the miss patterns you found, each with its learning-record or question id. The ratio is the user's to set each time.

On a fresh clone there are no recorded misses yet (no `learning-records/`, an all-untested grid): ask for scope only and put every slot on exam-proportional coverage.

A single-domain paper overrides /tutor's interleave rule, because the user asked for one domain.

## 1. Read state
`tutor/mastery.md` (rows in scope), `learning-records/` (every miss in scope; grep the statement ids), `tutor/question-bank.md` (stems to avoid), and your own score report if you have one (for weighting only), `reference/ccar-f-official-exam-guide.md` (your text copy of the official guide: task statements in scope; see README), and `notes/domain-N-*.md`. Facts come only from the guide, the notes and `lessons/`.

## 2. Size and allocation
- One domain: D1 16 · D2 11 · D3 12 · D4 12 · D5 9 (the split under `sim` in `tutor/build/statements.js`). 120 minutes for a full mock.
- **Full mock: draw 4 of the 6 scenarios**, like the real exam. Add the set to `DRAWS` in `statements.js` with its 4 scenario keys; its allocation comes from `SCENARIO_BLOCKS` (one 15-item template per guide scenario). Each record carries `block` = `s` = its scenario key, and the records run block by block in draw order; `obj` is optional. `META.blocks` lists the draw in order: `{ id: '<key>', title: SCENARIOS[key], intro }`, with string ids matching each record's `block` (numeric ids render an empty page, and the gate rejects them). Don't add the set to `ALLOCATION` by hand; `build.js` writes it to `mock-<set>.html`. The gate fails if this draw plus the previous full mock's draw leaves any scenario out, or if the draw's domain counts are more than 4 off the weights × 60. Only 8 of the 15 draws pass that check; pick one that does. Never pick scenarios from a score report: a report describes one sitting's random draw, and the next sitting draws again. `SIM_BLOCKS` / `SIM_SETS` are legacy.
- **Weak spots weight, never exclude.** A past score report or miss list may add re-test slots or decide which statements get the hard items. It never removes a scenario or a task statement from coverage.
- A full mock meant as a readiness read should match the real format: 4 scenario blocks of about 15, mixed domains inside each block, sat once in exam mode with flag-for-review. Single-answer only. The guide allows multiple-response items, but the author's two real sittings had none.
- Anything other than a full mock: add a new set to `ALLOCATION` in `statements.js` (per-statement counts; reuse an existing split such as `d2r = { ...d2 }` where one exists), and its output file to `OUT` in `build.js`. Set keys: `d<N>r`, `d<N>r3`, …; files: `mock-d<N>-paper<K>.html`.
- Timer: 2 minutes per question.

## 3. Author inline (in the main conversation, not delegated)
Copy the `d2r.js` record shape: `id, ts, s, bp.rank, q, o[4], a, why, wrong{3 letters: {trap, text}}, cite`.
- Stem: a production scenario, at least 3 sentences, at least one concrete number, ending in a question.
- Exam-level difficulty: every distractor is a fix someone would really try (a prompt rule, a few-shot example, a new subagent, a rename, a retry), and is plausible enough to need the mechanism to reject it. Make the key beat the second-best option because of a fact in the stem, for example "a prompt line was already tried and barely moved the rate".
- Options are within about 15 characters of each other. None contains `so` or `so that` (the gate checks purpose clauses), `<` or `&`, or absolute wording ("never", "always", "every") that only the distractors use.
- Each distractor gets a trap from `TRAPS` in `statements.js`, plus one or two lines on why it tempts and why it fails.
- `cite` names the guide section, the notes section and any lesson or learning record used.
- `META.intro` must not name the concepts being tested.

## 4. Gate (repeat until clean)
`node tutor/build/check.js <set>` must print ALL GATES PASSED. It checks counts per statement, key letters at 20–30% each, the longest-key cap, the shortest-key minimum, the purpose-clause gap and the trailing-clause gap (", since …" / ", letting …" on distractors only). Measure where each key ranks by length, then rebalance by editing options; don't hand-fit `bp.rank`. Also run `node tutor/build/check.test.js` (expect 0 fail). When you add or change a gate rule: copy `tutor/build/*.js` to a scratch folder, disable the new rule there, and confirm its failure tests now fail. A test that still passes with the rule off proves nothing.

## 5. Blind audit (no paper ships unreviewed)
1. `AUDIT_DIR=<scratch>/<set>-audit node tutor/build/export-blind.js <set>`
2. Spawn one subagent, foreground. Tell it not to open `tutor/build/data/` or `tutor/*.html`, and to answer each question from the guide. Ask it to be adversarial: is a second option defensible, is there a surface tell, is anything factually wrong? It writes `[{n, answer, confidence, reason, flag}]` to `<AUDIT_DIR>/<set>-audit.json`. Flags: `trivially-obvious | ambiguous | factual-error | surface-tell`.
3. `node tutor/build/diff-audit.js <set> <audit.json>` must pass.
4. **Fix every flag, even when the pass rule is met.** Have the same agent re-audit only the changed questions, then re-run the gate and the diff-audit.

## 5b. Near-copy audit
The blind audit answers questions; it can't see whether the user has already seen them. Papers can pass every gate and the blind audit and still be reskins of earlier ones. Before shipping, spawn a strong subagent to compare every stem semantically against `tutor/question-bank.md`, every other `tutor/build/data/*.js`, and the quizzes and miss cards of the lessons the user has taken (above all the most recent). A reskin is the same deciding fact and key shape in a new setting; word overlap doesn't detect it. Rewrite each reskin and re-audit until the count is 0. Check 2 of its verdicts yourself. Fixes that work: cross-statement two-fact items, or a deciding fact and option set no past item used.

## 6. Ship
`node tutor/build/build.js <set>`. Open it in a browser and check that the intro renders and gives nothing away, and that no task-statement badge shows before a question is graded. Commit the data file, `statements.js`, `build.js` and the HTML. Then tell the user: open the paper, use exam mode, submit, print the graded page to PDF, and send it back.

## 7. When the PDF comes back
`pdftotext -layout <pdf>`. Grep `Your answer` for ✓/✗ and read the Result Report for the score. Then follow /tutor (`.claude/commands/tutor.md`) steps 4–6: review misses one at a time in the exact format, apply grid transitions (a row doesn't leave `weak` on a day it was missed), write learning records, append to the question bank (generate the entries from the data file; don't retype them), commit.
