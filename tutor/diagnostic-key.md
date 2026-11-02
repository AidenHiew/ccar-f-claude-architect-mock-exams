# Diagnostic answer key — spoilers

One entry per question. Do not open until all 30 questions are answered.

## K1 — task 1.1

**Answer: B.** `stop_reason` is the loop's control signal: `"tool_use"` means execute tools and continue, `"end_turn"` means the model is done. It is the only deterministic, documented termination mechanism.
- A `probabilistic` — text markers depend on the model remembering to emit them; parsing natural language for termination is a named anti-pattern.
- C `wrong-problem` — an iteration cap is a safety net, not a control signal; it ends conversations mid-task and prolongs finished ones.
- D `wrong-problem` — responses can contain text alongside tool calls; text presence says nothing about completion.

## K2 — task 1.2

**Answer: A.** Hub-and-spoke exists precisely for this: routing everything through the coordinator restores observability (traceable claims), consistent error handling (no silent gaps), and controlled information flow.
- B `symptom-fix` — logging records the failures but fixes neither the silent-gap propagation nor the lost provenance.
- C `over-engineered` — new infrastructure to re-create what coordinator routing already provides in-process.
- D `wrong-problem` — retries address transient failures, not the architectural loss of observability and error handling.

## K3 — task 1.3

**Answer: D.** Subagents run with isolated context and never inherit the parent's conversation history — all needed findings must be passed explicitly in the spawning prompt. This is the single most common multi-agent bug.
- A `probabilistic` — no instruction can make the model consult context it was never given.
- B `wrong-problem` — tool access governs what the subagent can do, not what context it received.
- C `wrong-problem` — plausible mechanism, but the scenario says the findings were never passed, not truncated.

## K4 — task 1.4

**Answer: C.** "Can never be violated" demands deterministic enforcement: a programmatic prerequisite gate blocks the downstream tool until verification completes. Prompts have a non-zero failure rate; compliance rules cannot ride on probabilities.
- A `probabilistic` — stronger wording shifts the odds, never to zero.
- B `probabilistic` — few-shot raises compliance rates; it cannot guarantee ordering.
- D `symptom-fix` — after-the-fact detection means the violation already happened; the requirement is prevention.

## K5 — task 1.5

**Answer: A.** Data normalization of tool results is exactly what PostToolUse hooks are for — deterministic transformation before the model sees the data, so mis-ordering cannot recur. Hooks give guarantees; prompts give probabilities.
- B `probabilistic` — prompt compliance has a non-zero failure rate; "intermittently" demands a guarantee.
- C `over-engineered` — new infrastructure when a hook already intercepts results in-process.
- D `probabilistic` — few-shot improves the odds but cannot eliminate an error class a hook removes entirely.

## K6 — task 1.6

**Answer: B.** Match decomposition to predictability: fixed prompt chaining for predictable multi-aspect work (same review aspects every PR), dynamic adaptive decomposition for open-ended investigation where each finding redirects the search.
- A `wrong-problem` — adaptive planning on a fixed-aspect review adds nondeterminism and cost with no benefit.
- C `wrong-problem` — a fixed pipeline cannot follow a memory-leak investigation wherever the evidence leads.
- D `wrong-problem` — exactly inverted: the mapping follows predictability, not perceived risk.

## K7 — task 1.7

**Answer: C.** With ~40% of files changed, prior tool results are stale; resuming would have the agent reasoning from analysis that no longer matches reality. Fresh session + structured summary of conclusions is the reliable pattern.
- A `wrong-problem` — resume fits when prior context is mostly valid; 40% churn is not "mostly valid."
- B `wrong-problem` — forking duplicates the same stale baseline into two sessions.
- D `over-engineered` — throwing away valid conclusions wastes the prior investment; carry them via summary.

## K8 — task 2.1

**Answer: D.** Tool descriptions are the primary mechanism for tool selection; minimal descriptions are the stated root cause. Expanding them with formats, examples, and boundaries is the low-effort, high-leverage first fix.
- A `symptom-fix` — few-shot patches routing without fixing the descriptions the model actually selects from.
- B `over-engineered` — a routing layer bypasses the model's language understanding to work around bad descriptions.
- C `over-engineered` — merging tools is a real architectural option but far more effort than a first step warrants.

## K9 — task 2.2

**Answer: A.** Structured error metadata (`errorCategory`, `isRetryable`, description) lets the agent make correct recovery decisions per category: retry transients, fix validation input, never retry policy blocks.
- B `symptom-fix` — capping retries reduces waste but the agent still cannot distinguish error types.
- C `wrong-problem` — removing retries breaks recovery for transient failures that genuinely deserve one.
- D `over-engineered` — regex-parsing your own error strings when the tool could just return structure.

## K10 — task 2.3

**Answer: B.** `tool_choice: "any"` guarantees a tool call while leaving tool selection to the model — exactly right when a call is mandatory but the correct tool varies by input.
- A `probabilistic` — `"auto"` permits prose responses no matter what the prompt says.
- C `wrong-problem` — forcing one named tool breaks every document that needs the other two.
- D `wrong-problem` — temperature shapes sampling, it cannot guarantee a tool call.

## K11 — task 2.4

**Answer: D.** Project-scoped `.mcp.json` shares team servers via version control, `${JIRA_TOKEN}` expansion keeps the secret out of git, and personal/experimental servers belong in user-scoped `~/.claude.json`.
- A `wrong-problem` — the personal server pollutes team config, and path-referenced env files are not the supported expansion mechanism.
- B `wrong-problem` — user scope hides the Jira server from everyone who clones the repo.
- C `over-engineered` — infrastructure to replace two config lines that already solve it.

## K12 — task 2.5

**Answer: C.** When Edit fails on a non-unique anchor, the documented fallback is Read + Write: load the full file, apply the single change, write it back reliably.
- A `wrong-problem` — "first occurrence" is a guess; nothing says the target is the first match.
- B `wrong-problem` — the function's definition location was never in doubt; searching elsewhere solves nothing.
- D `over-engineered` — restructuring a 4,000-line file to enable one edit.

## K13 — task 3.1

**Answer: C.** User-level `~/.claude/CLAUDE.md` is personal and never travels through version control. Team conventions must live at project level (root `CLAUDE.md` or `.claude/`) to reach everyone who clones.
- A `wrong-problem` — invents a version incompatibility; the mechanism is scoping, not support.
- B `wrong-problem` — missing tools would produce failures, not silently ignored conventions.
- D `wrong-problem` — git clones hidden directories fine; no such protocol behavior exists.

## K14 — task 3.2

**Answer: A.** `context: fork` runs the skill in an isolated sub-agent context, so verbose exploration output stays out of the main conversation and only the useful summary returns.
- B `wrong-problem` — tool restrictions govern safety, not output volume; exploration is already read-heavy.
- C `wrong-problem` — user vs project scope changes who has the skill, not where its output lands.
- D `symptom-fix` — narrower scope means less text, but any real analysis still floods the main context.

## K15 — task 3.3

**Answer: B.** Glob-scoped rules (`paths: ["**/*.test.*"]`) load exactly when a matching file is edited, follow the files wherever they live, and cost no tokens otherwise — the designed mechanism for conventions spanning scattered directories.
- A `over-engineered` — dozens of duplicated CLAUDE.md files that will drift apart on the first edit.
- C `probabilistic` — section headers rely on the model inferring which section applies; path matching is deterministic.
- D `probabilistic` — skills load on demand or by relevance; "automatically whenever editing" needs deterministic triggering.

## K16 — task 3.4

**Answer: D.** The complexity — 60 files, transaction semantics, real design decisions — is already evident in the requirements. That is precisely the plan-mode trigger: explore and design before committing to changes, preventing costly rework.
- A `wrong-problem` — "switch when it gets complex" ignores that it is already complex; rework arrives before the switch.
- B `wrong-problem` — detailed upfront instructions assume you already know the right design without exploration.
- C `over-engineered` — parallel sessions multiply coordination risk without providing the missing design phase.

## K17 — task 3.5

**Answer: A.** Concrete input/output examples are the most effective way to communicate transformations when prose keeps being interpreted inconsistently — the exact drift described.
- B `wrong-problem` — longer prose is still prose; ambiguity survives verbosity.
- C `probabilistic` — restating helps detect misunderstanding once; it does not pin the format across runs.
- D `wrong-problem` — more prose messages multiply the interpretation surface instead of constraining it.

## K18 — task 3.6

**Answer: C.** `-p` / `--print` is the documented non-interactive mode: process the prompt, print the result, exit. It is the fix for CI/cron hangs.
- A `wrong-problem` — a Unix workaround that does not engage Claude Code's non-interactive mode.
- B `wrong-problem` — `CLAUDE_HEADLESS` does not exist; classic distractor.
- D `wrong-problem` — `--batch` does not exist; classic distractor.

## K19 — task 4.1

**Answer: B.** Confidence-based filtering fails because self-assessed confidence is poorly calibrated. Explicit categorical criteria — report bugs/security, skip style/local patterns — are what measurably cut false positives and restore trust.
- A `probabilistic` — doubling down on the mechanism that already failed.
- C `over-engineered` — a second scoring pass built on the same uncalibrated confidence signal.
- D `symptom-fix` — capping volume drops real bugs alongside noise without improving precision.

## K20 — task 4.2

**Answer: D.** When detailed instructions alone produce inconsistent output, 2–4 targeted few-shot examples are the most effective technique — especially examples that show the reasoning for ambiguous cases, which lets the model generalize judgment.
- A `wrong-problem` — repetition re-states rules the model already read; it adds no new signal for ambiguity.
- B `wrong-problem` — enumerating cases pattern-matches the past; examples with reasoning generalize to novel inputs.
- C `probabilistic` — threats change nothing about how the model resolves an ambiguous input.

## K21 — task 4.3

**Answer: A.** Required fields force the model to produce a value even when none exists — so it fabricates. Fields that may be genuinely absent must be nullable/optional so null is a legal answer.
- B `probabilistic` — sentinel strings leak into downstream data and still fight the schema's `required`.
- C `symptom-fix` — detecting fabrications after forcing them, instead of not forcing them.
- D `over-engineered` — two pipelines and a classifier to avoid one schema keyword.

## K22 — task 4.4

**Answer: C.** Retry-with-error-feedback: include the document, the failed extraction, and the specific validation error so the model can self-correct the exact failure. Format/structural errors are precisely what this fixes.
- A `wrong-problem` — the same request reproduces the same formatting choice; nothing was corrected.
- B `probabilistic` — lower temperature narrows sampling but never tells the model what was wrong.
- D `over-engineered` — a two-pass pipeline redesign for an error one feedback line fixes.

## K23 — task 4.5

**Answer: B.** The Batch API trades latency for cost: 50% cheaper, up to 24 hours, no latency SLA. That fits the overnight report exactly and disqualifies the blocking pre-merge check developers wait on.
- A `wrong-problem` — polling cannot manufacture a latency guarantee the API does not offer.
- C `wrong-problem` — `custom_id` correlates request/response pairs; ordering is a non-issue.
- D `over-engineered` — a fallback architecture when simply matching each workflow to its API suffices.

## K24 — task 4.6

**Answer: D.** A session that generated code retains its reasoning context and will not seriously question its own decisions — self-review instructions and extended thinking do not fix this. An independent instance without that context does.
- A `probabilistic` — adversarial prompting still reasons inside the same self-justifying context.
- B `wrong-problem` — repeated self-review repeats the same blind spot; consensus of one biased reviewer.
- C `wrong-problem` — thinking budget scales depth, not independence; the bias is contextual, not effort-bound.

## K25 — task 5.1

**Answer: B.** Transactional facts (order numbers, amounts, dates) belong in a persistent structured "case facts" block carried in every prompt outside the summarized history — summarization then can't erode them.
- A `symptom-fix` — delaying compression delays the loss; the facts still eventually blur.
- C `probabilistic` — "preserve all numbers" is an instruction to the exact process that keeps failing.
- D `over-engineered` — re-injecting full transcripts blows the context budget summarization exists to protect.

## K26 — task 5.2

**Answer: A.** Policy gaps are a canonical escalation trigger: the policy is silent on competitor matching, so the decision is not the agent's to make. Escalate with context.
- B `wrong-problem` — silence is not refusal; inventing a "default deny" is still the agent making policy.
- C `wrong-problem` — inventing an approval threshold is making policy from the other direction.
- D `symptom-fix` — gathering proof postpones the real issue: no policy authorizes any decision either way.

## K27 — task 5.3

**Answer: D.** Structured error context — failure type, attempted query, partial results, alternatives — is what lets the coordinator choose intelligently: retry modified, reroute, or proceed with partials annotated.
- A `wrong-problem` — generic statuses hide exactly the context recovery decisions need.
- B `wrong-problem` — silent success-faking corrupts the pipeline's picture of its own coverage.
- C `wrong-problem` — terminating everything discards recoverable work when alternatives existed.

## K28 — task 5.4

**Answer: C.** That symptom — generic "typical patterns" replacing specific earlier findings — is context degradation. Scratchpad files persist key findings across the boundary, and subagent delegation keeps verbose exploration out of the main window.
- A `probabilistic` — restating the question does not restore evicted findings.
- B `over-engineered` — a bigger window postpones degradation; it does not fix the pattern, and attention quality still decays.
- D `symptom-fix` — a one-shot summary from an already-degraded session bakes the degradation in.

## K29 — task 5.5

**Answer: A.** Aggregate accuracy can hide catastrophic failure in specific segments. Before cutting review, verify accuracy by document type and field — the segments are where automation risk actually lives.
- B `wrong-problem` — sample size validates the aggregate, which was never the risk.
- C `wrong-problem` — model confidence is uncalibrated until checked against labeled data; a threshold proves nothing.
- D `symptom-fix` — triaging by assumed impact concedes unknown segment failures instead of measuring them.

## K30 — task 5.6

**Answer: B.** Conflicting statistics from credible sources are annotated with both values and their sources — never silently resolved. The report flags the conflict; readers (or the coordinator upstream) decide.
- A `wrong-problem` — authority-picking silently discards a credible measurement and its context.
- C `wrong-problem` — the midpoint is a number neither source reported; it manufactures false precision.
- D `wrong-problem` — omission trades a documented conflict for a silent coverage gap.
