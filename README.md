# CCA-F exam prep kit

Study materials for the **Claude Certified Architect – Foundations** exam (CCAR-F), from one candidate who failed the first sitting (627) and passed the retake (791, pass mark 720).

> **Unofficial.** This repo is not made by, endorsed by or affiliated with Anthropic. It contains **no real exam questions**: every question here was written for practice. The exam's confidentiality agreement covers its questions and options, and nothing here comes from them.

## Start here

Read **[docs/lessons-for-future-candidates.md](docs/lessons-for-future-candidates.md)** first. It's short: what the exam looks like, what caught this candidate out, and how to practise so it doesn't catch you.

Then get the **official exam guide** from Anthropic. It lists the 5 domains, the 30 task statements and the 6 scenarios, and it is the real blueprint. It isn't in this repo: download it from [Anthropic's exam page](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification) ("Download the exam guide"). Everything here assumes you have it, and links to "the guide" in the lessons go to that page.

## How the kit works: two halves

The kit runs inside [Claude Code](https://code.claude.com/docs/en/overview). Open this folder in Claude Code and use the commands below.

### 1. Lessons: understand the ideas (`/teach`)

`/teach` is a skill that turns a topic, plus the mistakes you've made, into a long HTML lesson you work through in a browser. It is **not** included here. Install it from its author's repo: **[mattpocock/skills](https://github.com/mattpocock/skills)** (Matt Pocock, MIT). Installing it from there keeps you on the current version.

`lessons/` holds the lessons one candidate built with it. You can read them without installing anything; they show what `/teach` produces. They were written for that candidate's own misses and speak to them ("your pick", "your three misses"). The "Miss history" lines and labels like "D1 Q8", "learning record 0018" or "Weak Rows Paper 6" point to that candidate's private records and practice papers, which aren't in this repo. Lessons 3–8 are left out, so the numbering has a gap. The same kind of private label appears elsewhere: in the answer rationales of the mock papers ("LR-0033", "learning record 0016", "Paper 4 Q9"), in the cheat sheet's source lines, and in `tutor/build/` comments ("wr1"–"wr7", "sim4", "spec §6"). They name that candidate's records, unshipped papers and design notes. You can ignore them.

### 2. Mocks and review: practise like the exam (`/tutor` and the `mock-exam` skill)

- **`/tutor`** (`.claude/commands/tutor.md`) runs short quiz sessions with spaced repetition. It tracks every task statement in `tutor/mastery.md`. The grid ships blank, so your first `/tutor` run is a 30-question diagnostic (`tutor/diagnostic.md`). Its answers are in `tutor/diagnostic-key.md`: don't open that until you've finished.
- **`mock-exam`** (`.claude/skills/mock-exam/SKILL.md`) builds a new exam-style paper through `tutor/build/` and grades the PDF you print from it.
- **Ready-made papers** are in `tutor/`. Open any `mock-*.html` in a browser; no install is needed. The two to start with are `mock-full1.html` and `mock-full2.html`: 60 questions and 120 minutes each, in 4 scenario blocks like the real exam. Together the two papers cover all 6 scenarios and all 30 task statements. In exam mode they look like the real exam screen: one question at a time, a question grid, flag for review, and cross-out for options.

`/tutor` and `mock-exam` started as one person's study setup, so expect to adapt them. `/tutor` creates its state on the first run: `MISSION.md` (your goal and exam date) and `learning-records/` (one note per mistake pattern). `tutor/mastery.md` and `tutor/question-bank.md` ship empty for them to fill. Both also expect a text copy of the official guide at `reference/ccar-f-official-exam-guide.md`: convert the PDF (for example `pdftotext -layout`) and save it there. The repo's `.gitignore` keeps that copy out of git: the guide is Anthropic's, so don't publish it.

### The ready-made papers

| File | Questions | What it is |
|---|---|---|
| `mock-full1.html`, `mock-full2.html` | 60 each | Full mocks, 4 scenario blocks each; together they cover all 6 scenarios. Start here. |
| `mock-final-sim.html`, `mock-final-sim2.html`, `mock-final-sim3.html` | 60 each | Older full mocks ("Representative Mock"). All three use the same 4 scenarios, so don't rely on them for coverage. |
| `mock-gauntlet.html` | 60 | A drill weighted to one candidate's weak areas |
| `mock-d1.html`, `mock-d2.html`, `mock-d2-paper2.html` | 16, 11, 11 | Single-domain papers (Domain 1, Domain 2) |
| `mock-d23.html`, `mock-d23-paper2.html` … `mock-d23-paper5.html` | 30, 30, 30, 30, 23 | Domains 2 and 3 together |
| `mock-d145.html` | 30 | Domains 1, 4 and 5 together |
| `mock-fresh-1.html` | 15 | A short mixed paper |
| `mock-exam.html`, `d3-exam-quiz-*.html`, `d4-exam-quiz-*.html` | | Early quizzes, kept as they were |

Some papers were built for one candidate's weak spots, so their mix isn't exam-proportional. Every paper passes `node tutor/build/check.js <set>` (answer-letter balance, no length or wording tells).

## What else is here

| Path | What it is |
|---|---|
| `cheat-sheet.md`, `cheat-sheet.html` | Facts worth knowing cold |
| `notes/` | Notes for each domain, organised by task statement |
| `reference/*.html` | One-page explainers (batch API, escalation, tool design, …) |
| `exercises.md`, `practice-questions.md` | Hands-on builds and an early question set |
| `tutor/question-bank.md` | Empty question log in the format `/tutor` and `mock-exam` append to |
| `tutor/build/` | The paper builder: `node tutor/build/build.js <set>` writes a paper; `node tutor/build/check.js <set>` runs the quality gates (answer-letter balance, no length or wording tells); `node tutor/build/check.test.js` tests the gates |

The builder needs only Node.js, with no dependencies.

## Credits

- **`/teach`** is by Matt Pocock: [mattpocock/skills](https://github.com/mattpocock/skills), MIT licence, Copyright (c) 2026 Matt Pocock. It is linked here, not copied; install it from his repo.
- **The question-grid exam screen** takes its ideas from the practice exam at [szymonpaluch.com](https://szymonpaluch.com) ([hculap/claude-certified-architect-practice-exam](https://github.com/hculap/claude-certified-architect-practice-exam), MIT). Only ideas were taken; no code was copied.

## Licence

MIT, see [LICENSE](LICENSE). This licence covers this repo's own content only, not the exam guide or anything else of Anthropic's.

## About this repo

This is a generated copy. A private working repo is the source, and an export script copies an allowlisted set of files from it, then scans them for leaks before writing anything. Changes made here directly would be overwritten by the next export.
