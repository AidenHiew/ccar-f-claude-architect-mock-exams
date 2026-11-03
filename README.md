# CCAR-F mock exams and study kit

A free study kit for anyone preparing for the **Claude Certified Architect – Foundations** exam (CCAR-F). You can sit ready-made practice papers that look like the real exam screen, generate new mocks with Claude Code, and keep the whole kit in step with the latest official exam guide.

> **Unofficial.** This repo is not made by, endorsed by or affiliated with Anthropic. It contains **no real exam questions**: every question here was written for practice. The exam's confidentiality agreement covers its questions and options, and nothing here comes from them.

## Step 1 (required): confirm which exam guide you're preparing for

The official exam guide is the blueprint: its domains, task statements and scenarios define what the exam can test. Anthropic updates it, and everything in this kit (the papers, the builder's coverage rules, the notes) was built against **guide Version 1.0, effective July 2026**.

1. Download the current guide from [Anthropic's exam page](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification) ("Download the exam guide") and note its version and date.
2. If you'll use Claude Code (options B and C below), save a text copy at `reference/ccar-f-official-exam-guide.md` (for example `pdftotext -layout guide.pdf reference/ccar-f-official-exam-guide.md`). `/tutor` and `mock-exam` check it before doing anything else. The repo's `.gitignore` keeps that copy out of git: the guide is Anthropic's, so don't publish it.
3. **If your version isn't 1.0**, treat the ready-made papers as a starting point, not full coverage. Use option C first.

## Step 2: pick how you'll practise

### A. Sit a ready-made paper (no install)

Open any `tutor/mock-*.html` file in a browser. Choose exam mode for a timed sitting: one question at a time, a question grid, flag for review, and cross-out for options, like the real exam screen. Submit to see your score, each answer's rationale and the task statement it tests. Print the graded page to PDF to keep a record.

| File | Questions | What it is |
|---|---|---|
| `mock-full1.html`, `mock-full2.html` | 60 each | **Start here.** Full mocks, 120 minutes, 4 scenario blocks each, like the real exam. Together they cover all 6 scenarios and all 30 task statements. |
| `mock-final-sim.html`, `mock-final-sim2.html`, `mock-final-sim3.html` | 60 each | More full mocks. All three use the same 4 scenarios, so pair them with full1 and full2 for coverage. |
| `mock-gauntlet.html` | 60 | A hard drill weighted to one candidate's weak areas; its mix isn't exam-proportional |
| `mock-d1.html`, `mock-d2.html`, `mock-d2-paper2.html` | 16, 11, 11 | Single-domain papers (Domain 1, Domain 2) |
| `mock-d23.html`, `mock-d23-paper2.html` … `mock-d23-paper5.html` | 30, 30, 30, 30, 23 | Domains 2 and 3 together |
| `mock-d145.html` | 30 | Domains 1, 4 and 5 together |
| `mock-fresh-1.html` | 15 | A short mixed paper |
| `mock-exam.html`, `d3-exam-quiz-*.html`, `d4-exam-quiz-*.html` | | Early quizzes |

The papers share some questions: full1 and full2 were partly assembled from the older papers. Every question is single-answer. Guide Version 1.0 says items may also be multiple-response; to practise that format, ask `mock-exam` for some.

### B. Generate new mocks and get them graded (Claude Code)

Open this folder in [Claude Code](https://code.claude.com/docs/en/overview).

- **`mock-exam`** (`.claude/skills/mock-exam/SKILL.md`): ask for "a full mock" or "a Domain 3 paper". It writes the questions, builds the paper through `tutor/build/`, runs quality gates (answer-letter balance, no length or wording tells, scenario rotation so every two full mocks cover all 6 scenarios) and a blind audit, then grades the PDF you print back.
- **`/tutor`** (`.claude/commands/tutor.md`): short quiz sessions with spaced repetition, tracked per task statement in `tutor/mastery.md`. The first run is a 30-question diagnostic (`tutor/diagnostic.md`); don't open `tutor/diagnostic-key.md` until you've finished it.

Both create your own state on first run (`MISSION.md` for your goal and exam date, `learning-records/` for mistake patterns) and use your misses to weight, never to narrow, what they test next.

### C. Bring the kit up to a newer guide (Claude Code)

This repo can't ship the guide itself, so the kit's record of Version 1.0 is `tutor/build/statements.js`: the 30 task statements (short labels), the 6 scenarios and the domain weights. If your guide's version differs from 1.0, ask Claude Code: "compare my exam guide with tutor/build/statements.js and update the kit". `/tutor` and `mock-exam` also stop and offer this when they see a different version. The update should:
1. list task statements, scenarios and domain weights that were added, removed or changed;
2. update the builder's coverage tables in `tutor/build/statements.js` so new mocks follow the new blueprint;
3. flag ready-made papers whose questions test removed or changed statements;
4. generate new mocks with option B.

## Learn the ideas

- **[docs/lessons-for-future-candidates.md](docs/lessons-for-future-candidates.md)**: a short read on what the exam looks like and how to practise so it doesn't catch you out. Read it before your first full mock.
- `notes/`: notes for each domain, organised by task statement.
- `cheat-sheet.md`, `cheat-sheet.html`: facts worth knowing cold.
- `reference/*.html`: one-page explainers (batch API, escalation, tool design, …).
- `exercises.md`, `practice-questions.md`: hands-on builds and an early question set.
- **Lessons with `/teach`:** `/teach` turns a topic, plus your own mistakes, into a long HTML lesson you work through in a browser. It is **not** included here. Install it from **[mattpocock/skills](https://github.com/mattpocock/skills)** (Matt Pocock, MIT) to get the current version. `lessons/` holds sample lessons built with it. They were written for one candidate's misses, so they speak to them ("your pick"), and lessons 3–8 are left out.

Some files carry labels from the private repo this kit came from ("LR-0033", "Weak Rows Paper 6", "wr7", "sim4"). They name records and papers that aren't published. You can ignore them.

## The builder

`tutor/build/` needs only Node.js, with no dependencies.
- `node tutor/build/build.js <set>` writes a paper.
- `node tutor/build/check.js <set>` runs the quality gates.
- `node tutor/build/check.test.js` tests the gates.

## Where this came from

One candidate built this kit for their own exam: they failed the first sitting (627) and passed the retake (791; the pass mark is 720). The main lesson from the fail: practise every scenario in the guide, not only the ones on your last score report. The scenario-rotation rule in the builder enforces that.

## Credits

- **`/teach`** is by Matt Pocock: [mattpocock/skills](https://github.com/mattpocock/skills), MIT licence, Copyright (c) 2026 Matt Pocock. It is linked here, not copied; install it from his repo.
- **The question-grid exam screen** takes its ideas from the practice exam at [szymonpaluch.com](https://szymonpaluch.com) ([hculap/claude-certified-architect-practice-exam](https://github.com/hculap/claude-certified-architect-practice-exam), MIT). Only ideas were taken; no code was copied.

## Licence

MIT, see [LICENSE](LICENSE). This licence covers this repo's own content only, not the exam guide or anything else of Anthropic's.

## About this repo

This is a generated copy. A private working repo is the source, and an export script copies an allowlisted set of files from it, then scans them for leaks before writing anything. Changes made here directly would be overwritten by the next export.
