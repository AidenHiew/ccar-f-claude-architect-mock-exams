# CCAR-F: lessons for future candidates

From one candidate's two sittings: **627 (fail) in September 2026, 791 (pass) in October 2026**. Pass mark 720. Below, "attempt 1" and "attempt 2" are those two sittings.

No exam questions here. The exam NDA covers questions and options; this is about how to prepare.

## 1. Practise all six scenarios as full blocks

Each sitting draws 4 of the guide's 6 scenarios, about 15 questions each (guide §3, §5).
Any one scenario appears in 10 of the 15 possible draws, so **each is on 2 in 3 exams**.

What happened: every practice mock copied the four scenarios from attempt 1's report, so CI/CD and Multi-Agent Research were never practised as blocks. A scenario you have never practised as a block is close to guessing on the day, and only a wide margin elsewhere makes up for it.

Rule: rotate scenarios across mocks so any two in a row cover all six. Inside a scenario block, questions mix domains, all set in that scenario.

## 2. The score report is one exam form, not the blueprint

Attempt 1's report listed 29 objectives; attempt 2's listed 37. Only 14 were the same wording.
Studying "the objectives I missed" fixes real gaps, but the blueprint is the official exam guide: 6 scenarios, 30 task statements, the domain weights.

## 3. CI/CD: facts worth knowing

Task statement 3.6 in the guide, plus the Claude Code docs (`notes/2026-09-docs-delta.md`):
- `-p` (`--print`) runs Claude Code non-interactively, so a CI job never waits for input.
- `--output-format json` with `--json-schema` gives output a script can parse, in the shape you define.
- `--bare` skips auto-discovery of hooks, skills, subagents, plugins, MCP servers, memory and CLAUDE.md. The docs recommend it for scripted calls.
- CLAUDE.md is how the guide gives Claude Code project context in CI (standards, fixtures, review criteria). `--bare` stops it loading, so the two pull in opposite directions.
- Automated review: load the project's standards, restrict the tools, ask for structured output, and supply project conventions on every run to cut false positives.
- The Message Batches API costs less but can take up to 24 hours, with no latency guarantee. It suits work nobody waits on, not a check that blocks a merge.
- Turn and cost limits on the CLI call keep a runaway run in check. Check the current docs for the exact flags.

## 4. Don't trust a mock score until you've checked the mock

Before attempt 1 a practice mock read about 750; the real exam returned 627. The mocks had tells (the key was often the longest option) and later some papers were near-copies of earlier questions. Check a mock for answer-length leaks and reworded repeats before believing its score.

## 5. What moved the score

Same objective on both reports (14): 7 up, 4 held, 3 down.
Biggest gains came from targeted lessons and re-tests on missed mechanisms: iterative refinement with input-output examples 25 → 100, tool_choice 0 → 100, review routing by confidence 33 → 100.
Booking rule used: don't book while a study-grid row (`tutor/mastery.md`) is below 85% over its last two tested sessions.

## 6. Reading your own score

The report gives percent per objective, not a raw count. A bound: each objective below 100% needs at least one wrong answer (two for 33%, three for 25%). Attempt 2: at least 13 wrong, so at most 47/60. The scaled-to-raw mapping is unpublished.
