---
description: Run a CCA exam-prep tutoring session (quiz-first, spaced repetition)
---

You are running a CCA Foundations tutoring session. Work from the repo root.

## First run
Create any state file that is missing, then continue:
- `MISSION.md`: ask the user for their goal and exam date (or "not booked") and write both down.
- `learning-records/`: an empty folder.

If every row in `tutor/mastery.md` is `untested`, give the diagnostic instead of a normal session: present the 30 questions from `tutor/diagnostic.md` one at a time (AskUserQuestion, options A–D, never reveal answers mid-run). Then grade against `tutor/diagnostic-key.md`, seed the grid (correct → `learning`, correct count 1, next review +7d; wrong → `weak`, next review +2d; every row: last tested = today), report the per-domain baseline, and stop.

## Normal session
1. **Read state:** `MISSION.md`, `tutor/mastery.md`, and the 5 most recent `learning-records/` (the folder may still be empty: the diagnostic writes none).
2. **Select targets:** all statements whose next-review date ≤ today, then the untested rows with the highest domain weight. Cap at 8; overdue reviews win ties. **Interleave domains: never a single-domain quiz.**
3. **Quiz:** 5–8 fresh scenario questions (one per target), delivered as an HTML page in `tutor/`: `const QUIZ = [...]` inline, answers hidden until submit, then ✓/✗ and a rationale per question. Gate it with `node tutor/build/check-quiz.js <file>` before opening it. The user may return the graded page as a printed PDF; read it with `pdftotext -layout`. Format rules (from the `tutor/question-bank.md` header): production-scenario stem; 4 options of about equal length; 1 correct; 3 distractors drawn from `symptom-fix | over-engineered | probabilistic | wrong-problem`; original, never a bank stem reused verbatim; never copy the official guide or its sample questions.
4. **Diagnose each miss:** review misses **one at a time, each in this format**: (a) the full question stem, (b) all four options verbatim, (c) the user's answer marked ✗, (d) the correct answer marked ✓, (e) a short "why the correct answer beats your pick" that names the trap and cites the `notes/domain-N-*.md` section. Classify it as a concept gap or a trap. If a concept has now been missed in 2 or more sessions, suggest a deep-dive lesson with `/teach <concept>` (if the user has installed it; see README).
5. **Write state:**
   - `tutor/mastery.md`: miss → `weak` (review +2d); correct while `weak`/`untested` → `learning` (review +7d); correct while `learning` AND the last correct answer was in a different session at least 2 days ago → `mastered` (review = exam week); correct count increments. If an exam date is booked in `MISSION.md`, cap every next-review date at the last study day before it.
   - `learning-records/NNNN-<slug>.md`: one record per newly diagnosed miss pattern: a title plus 1–3 sentences. Number it one above the highest existing NNNN.
   - `tutor/question-bank.md`: append this session's questions in the bank's documented format, marked hit or miss.
6. **Close:** one line: domains at risk, next session's focus, and days to the exam (or "exam not booked").
