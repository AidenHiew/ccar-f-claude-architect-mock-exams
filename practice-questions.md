# Practice Question Bank

24 original questions in exam style (scenario stem, 1 correct + 3 distractors), weighted roughly by domain. Answers with explanations are at the bottom — do a full section before checking.

---

## Domain 1: Agentic Architecture & Orchestration

**Q1.** Your agentic loop sometimes exits before the support agent has finished processing a refund. Inspecting the code, you find the loop terminates whenever the model's response contains any text content, on the assumption that text means a final answer. What is the correct termination condition?

- A) Terminate when the response's `stop_reason` is `"end_turn"`; continue executing tools when it is `"tool_use"`
- B) Terminate after a fixed maximum of 10 iterations to bound cost and latency
- C) Terminate when the model's text contains a completion phrase such as "resolution complete"
- D) Terminate when the model stops requesting the `process_refund` tool for two consecutive turns

**Q2.** In your research system, the coordinator invokes the web search subagent, which returns findings. The coordinator then invokes the synthesis subagent, but the synthesis output ignores the search findings entirely and produces generic content. What is the most likely cause?

- A) The synthesis subagent's temperature is too high, causing it to ignore grounding data
- B) The coordinator did not include the search findings in the synthesis subagent's prompt — subagents do not inherit the coordinator's conversation history
- C) The synthesis subagent needs `allowedTools` to include the web search tools so it can re-fetch the findings
- D) The Task tool truncated the findings because subagent prompts have a much smaller context limit

**Q3.** A compliance requirement states that account changes must never be executed until two-factor identity verification has succeeded. Your system prompt states this rule prominently, and testing shows 99.2% compliance. The compliance team says 99.2% is unacceptable. What should you do?

- A) Move the rule to the top of the system prompt and repeat it before each tool definition
- B) Add few-shot examples demonstrating verification-first ordering in ambiguous cases
- C) Add a programmatic prerequisite gate that blocks account-change tool calls until the verification tool has returned success
- D) Lower the model temperature to make instruction-following more deterministic

**Q4.** Your coordinator delegates to four subagents sequentially, waiting for each to finish before starting the next, even though their tasks are independent. Total latency is 4× a single agent. How do you run them in parallel?

- A) Have the coordinator emit all four Task tool calls in a single response
- B) Set `parallel: true` in each subagent's AgentDefinition
- C) Start four separate coordinator sessions, one per subagent
- D) Move the four subagents into a single combined agent with all tools

**Q5.** Different MCP tools in your support stack return dates as Unix timestamps, ISO 8601 strings, and locale-formatted strings, and the agent occasionally miscompares them. Which mechanism normalizes these before the model reasons about them?

- A) A system prompt instruction listing every date format and how to convert each
- B) A PostToolUse hook that transforms all tool results into a canonical date format before the model processes them
- C) A dedicated `normalize_dates` tool the agent is instructed to call after every lookup
- D) Few-shot examples demonstrating correct date comparisons across formats

**Q6.** You analyzed a codebase in a session yesterday and want to compare two refactoring strategies today, each starting from that same analysis. Which session mechanism fits best?

- A) `--resume` the session twice in a row, trying one strategy after the other
- B) `fork_session` to create two independent branches from the shared analysis baseline
- C) Start two fresh sessions and re-run the full analysis in each
- D) Use `/compact` to compress the analysis, then explore both strategies in the same session

**Q7.** Since yesterday's analysis session, a teammate merged changes to 3 of the ~60 files you analyzed. You want to continue the investigation today. What's the best approach?

- A) Resume the session and inform the agent which 3 files changed so it re-analyzes only those
- B) Resume the session as-is; the agent will notice stale results when it reads files again
- C) Always start fresh after any code change; re-run the full 60-file analysis
- D) Resume the session and run `/compact` to purge stale tool results

## Domain 2: Tool Design & MCP Integration

**Q8.** Your document agent has `analyze_document` ("Analyzes a document") and `analyze_content` ("Analyzes content"), and routinely picks the wrong one. Which change most directly fixes the misrouting?

- A) Rewrite both descriptions to differentiate purpose, expected inputs/outputs, and when to use each versus the other — renaming them for specificity if needed
- B) Add a preprocessing classifier that routes each request to the right tool before the model sees it
- C) Set `tool_choice: "any"` so the model is forced to commit to one of them
- D) Merge them into a single `analyze` tool that inspects its input to decide the backend

**Q9.** Your `lookup_order` MCP tool returns the string "Operation failed" for timeouts, malformed order IDs, and discontinued-product policy blocks alike. The agent responds by retrying everything three times. What should the tool return instead?

- A) Distinct HTTP status codes for each failure type
- B) Structured error metadata: an `errorCategory` (transient/validation/business), an `isRetryable` boolean, and a human-readable description
- C) A stack trace so the agent can diagnose the failure itself
- D) An empty result set, letting the agent infer failure from the absence of data

**Q10.** Your synthesis subagent currently has all 18 tools available in the system "for flexibility," and logs show it occasionally runs web searches and file writes mid-synthesis, degrading output quality. What's the right tool distribution?

- A) Keep all 18 tools but add system prompt instructions never to use non-synthesis tools
- B) Restrict the synthesis agent to its role-relevant tools, optionally adding one scoped cross-role tool (e.g., `verify_fact`) for its high-frequency verification need
- C) Remove all tools from the synthesis agent so it can only produce text
- D) Give every subagent the same toolset so behavior is uniform and predictable

**Q11.** Your team shares a Jira MCP server; you also want to experiment with a personal scratch MCP server without affecting teammates. Where does each configuration belong?

- A) Both in `.mcp.json`, with the personal one commented out before committing
- B) Team server in project `.mcp.json` (committed, with `${JIRA_TOKEN}` env expansion); personal server in user-level `~/.claude.json`
- C) Both in `~/.claude.json`, since MCP servers are always user-scoped
- D) Team server in CLAUDE.md; personal server in `.claude/rules/`

**Q12.** An agent exploring an unfamiliar codebase needs to find every file matching `**/*.repository.ts`, then locate which of them reference `LegacyConnection`. Which built-in tool sequence is right?

- A) Glob to find the matching file paths, then Grep to search those files' contents for `LegacyConnection`
- B) Grep to find the file paths, then Glob to search their contents
- C) Read every file in the repository and filter in the model's context
- D) Bash `find` piped to Bash `cat`, loading everything into one response

**Q13.** Agents keep making a dozen exploratory `list_*` and `describe_*` tool calls just to discover what data your internal knowledge base contains before doing real work. Which MCP feature addresses this directly?

- A) Increase the tool-call budget so exploration completes reliably
- B) Expose the content catalog (available collections, schemas, summaries) as MCP resources so agents see what exists without exploratory calls
- C) Cache exploratory tool results in a PostToolUse hook
- D) Add the full catalog to every tool description

## Domain 3: Claude Code Configuration & Workflows

**Q14.** You wrote thorough coding standards in `~/.claude/CLAUDE.md` and they work great for you. A new teammate clones the repo and Claude ignores all the standards for them. Why?

- A) The teammate needs to run `/memory` once to activate memory files
- B) User-level `~/.claude/CLAUDE.md` applies only to your machine and isn't in version control; the standards belong in a project-level CLAUDE.md
- C) CLAUDE.md files require an `@import` directive in the repo root to activate
- D) The teammate's Claude Code version predates CLAUDE.md support

**Q15.** Your team has a `/deploy-checklist` skill that produces extremely verbose environment-scan output, which afterwards crowds out the main conversation's context. Which frontmatter change fixes this?

- A) `allowed-tools: [Read]` to limit how much the skill can scan
- B) `context: fork` so the skill runs in an isolated sub-agent context and only its result returns to the main conversation
- C) `argument-hint` so users scope the skill to one environment
- D) Move the skill to `~/.claude/skills/` where output is automatically summarized

**Q16.** SQL migration files live in `db/migrations/`, `services/*/migrations/`, and `tools/seed/`, and all must follow the same conventions. What's the most maintainable way to apply the conventions exactly when those files are edited?

- A) A `.claude/rules/migrations.md` file with YAML frontmatter `paths:` globs matching all three locations
- B) A CLAUDE.md in each of the three directories, kept in sync manually
- C) A section in root CLAUDE.md titled "Migration conventions," relying on Claude to notice when it applies
- D) A `/migrations` slash command developers run before editing migration files

**Q17.** Task A: fix an off-by-one in one function, with a failing test and clear stack trace. Task B: migrate the codebase from REST to gRPC, touching ~50 files with several viable sequencing strategies. How should you run each?

- A) Plan mode for both — planning never hurts
- B) Direct execution for both — plan mode just adds latency
- C) Direct execution for A; plan mode for B
- D) Plan mode for A; direct execution for B

**Q18.** In CI, your re-review job comments on every PR update, repeating the same findings each time a developer pushes a fix commit, burying new feedback. What's the fix?

- A) Only run the review once per PR, on the first commit
- B) Include the prior review's findings in context and instruct Claude to report only new or still-unaddressed issues
- C) Have Claude post a single consolidated comment and edit it in place via the API
- D) Deduplicate comments post-hoc by string similarity before posting

## Domain 4: Prompt Engineering & Structured Output

**Q19.** Your CI reviewer's "maintainability" category has an 80% false-positive rate, and developers have started ignoring all findings, including accurate security ones. What's the best immediate response?

- A) Instruct the reviewer to "be conservative and only report high-confidence maintainability issues"
- B) Temporarily disable the maintainability category to restore trust, while developing explicit criteria (with code examples) for it
- C) Ask developers to keep triaging; false positives are inherent to LLM review
- D) Lower the model temperature for review runs

**Q20.** Your invoice extraction uses tool_use with a strict JSON schema. Syntax errors are gone, but you still see line items that don't sum to the stated total and amounts placed in the wrong field. Why, and what helps?

- A) The schema isn't strict enough; adding stricter types will catch these
- B) Strict schemas eliminate syntax errors, not semantic errors — add semantic validation (e.g., extract `calculated_total` alongside `stated_total` and flag discrepancies) with retry-on-error feedback
- C) The model is too small; upgrade to a larger model to eliminate semantic errors
- D) Switch from tool_use to raw JSON output with a validation regex

**Q21.** Some vendor documents legitimately lack a `purchase_order_number`. Since that field is `required` in your extraction schema, the model has begun inventing plausible-looking PO numbers. What's the fix?

- A) Add a system prompt instruction: "never fabricate PO numbers"
- B) Make `purchase_order_number` nullable/optional so the model can return null when the document doesn't contain it
- C) Retry the extraction until a real PO number is produced
- D) Post-process outputs to remove PO numbers that don't match a known list

**Q22.** You must OCR-extract and classify 40,000 archived contracts, with results needed within one week, and separately run a compliance check that blocks each new contract upload until it passes. Which API strategy fits?

- A) Message Batches API for both, since 50% savings applies at any scale
- B) Synchronous API for both, to keep the codepaths identical
- C) Message Batches API for the 40,000-contract archive job; synchronous API for the blocking upload check
- D) Batches for the blocking check (it's small) and synchronous calls for the archive (it's important)

## Domain 5: Context Management & Reliability

**Q23.** In hour-long support conversations, your agent's rolling summarization works, but late in conversations it misquotes refund amounts and promised dates that were correct earlier. What's the most effective fix?

- A) Increase the summary length so fewer details are dropped
- B) Pull the transactional details (amounts, dates, order numbers, statuses) out into a persistent case-facts block included in every prompt, outside the summarized history
- C) Disable summarization entirely and pass the full transcript until the context limit is hit
- D) Instruct the summarizer to "keep all important details"

**Q24.** A customer's first message is: "This is ridiculous. I want to talk to a human RIGHT NOW." Logs show your agent responds by running `get_customer` and `lookup_order` to investigate before replying. Per escalation best practice, what should the agent do?

- A) Continue investigating — resolving the issue quickly is the best de-escalation
- B) Escalate to a human immediately, honoring the explicit request without first attempting investigation
- C) Run sentiment analysis to confirm the frustration is genuine before escalating
- D) Ask the customer to describe the problem first so the handoff summary is complete

---
---

## Answer Key

**Q1 — A.** `stop_reason` is the loop's control signal: `"tool_use"` → run tools and continue; `"end_turn"` → done. B (iteration caps as the primary stop), C (text parsing), and D (heuristics about tool usage) are all named anti-patterns; models emit text alongside tool calls, so text presence means nothing.

**Q2 — B.** Subagents run with isolated context and never inherit the coordinator's history — findings must be passed explicitly in the subagent's prompt. A is a red herring; C would have the subagent redo work rather than receive it; D describes a nonexistent limitation.

**Q3 — C.** When deterministic compliance is required, prompt-based approaches (A, B) always retain a non-zero failure rate — 99.2% proves the point. A programmatic prerequisite gate guarantees ordering. D doesn't make instruction-following deterministic.

**Q4 — A.** Parallel subagents are spawned by emitting multiple Task tool calls in a single coordinator response. B is a nonexistent option; C loses coordination; D destroys specialization and worsens tool selection.

**Q5 — B.** PostToolUse hooks intercept tool results and transform them before the model processes them — the exact mechanism for normalizing heterogeneous formats deterministically. A and D are probabilistic; C adds latency and depends on the model remembering to call it.

**Q6 — B.** `fork_session` exists precisely for exploring divergent approaches from a shared analysis baseline. A serializes and lets strategy 1 contaminate strategy 2's context; C wastes the baseline; D doesn't create independent branches.

**Q7 — A.** When prior context is mostly valid, resume and explicitly inform the agent which files changed for targeted re-analysis. B risks stale reasoning (the agent won't spontaneously re-read); C is disproportionate for 3 of 60 files; D compresses context but doesn't refresh stale results.

**Q8 — A.** Tool descriptions are the primary selection mechanism; near-identical descriptions are the root cause. Differentiate (and rename if needed). B is over-engineered and bypasses the model; C forces a choice without informing it; D may be valid architecture later but doesn't fix selection ambiguity as a first step.

**Q9 — B.** Structured error metadata (category, `isRetryable`, description) lets the agent retry transient failures, fix validation input, and explain business blocks to the customer. Uniform errors cause exactly the observed blind retrying. A is transport-level, opaque to the agent's reasoning; C leaks internals without categorization; D silently suppresses errors — an anti-pattern.

**Q10 — B.** Scoped tool access: role-relevant tools only, with a narrow cross-role tool for the high-frequency need. A is probabilistic; C removes a legitimate need; D maximizes the too-many-tools selection problem.

**Q11 — B.** Project `.mcp.json` for shared team servers (with env-var expansion for credentials), `~/.claude.json` for personal/experimental. Both are available simultaneously.

**Q12 — A.** Glob finds files by path pattern; Grep searches contents. B reverses them; C and D bulk-load and blow context — exploration should be incremental.

**Q13 — B.** MCP resources exist to expose content catalogs so agents have visibility without exploratory tool calls. A pays the cost instead of removing it; C still requires the calls once per session; D bloats every tool description.

**Q14 — B.** User-level memory isn't shared through version control. Team standards belong at project level (root CLAUDE.md or `.claude/CLAUDE.md`). `/memory` (A) is a diagnostic, not an activation step.

**Q15 — B.** `context: fork` runs the skill in an isolated sub-agent context, keeping verbose output out of the main conversation. A limits capability, not output volume; C reduces but doesn't isolate; D describes nonexistent behavior.

**Q16 — A.** Path-scoped rules with glob frontmatter apply conventions deterministically to files spread across directories. B duplicates content; C relies on inference; D requires manual invocation.

**Q17 — C.** Direct execution suits well-scoped single-file fixes; plan mode suits large-scale, multi-approach architectural work. The complexity of B is already stated — don't wait to discover it (that's the trap in "switch later" style options).

**Q18 — B.** The documented pattern: include prior findings in context and instruct Claude to report only new or still-unaddressed issues. A abandons re-review value; C and D treat symptoms at the posting layer rather than fixing what the model reports.

**Q19 — B.** High false-positive categories undermine trust in accurate categories, so disable the noisy category temporarily while writing explicit categorical criteria with concrete examples. A ("be conservative") is documented as ineffective; confidence-based filtering doesn't substitute for categorical criteria.

**Q20 — B.** Strict schemas via tool use eliminate syntax errors but not semantic errors. The fix is semantic validation — e.g., `calculated_total` vs `stated_total` discrepancy flags — plus retry-with-error-feedback.

**Q21 — B.** Required fields force the model to fabricate values when the information is absent. Making the field nullable lets it truthfully return null. A is probabilistic; C can't conjure absent information (the documented limit of retries); D masks the symptom.

**Q22 — C.** Batch API: 50% savings, up to 24h, no SLA → perfect for the latency-tolerant archive with a week of headroom; wrong for a blocking upload check where someone waits. Match each API to its latency requirement.

**Q23 — B.** Progressive summarization erodes numerical values, dates, and stated expectations. Persist transactional facts in a structured case-facts block outside the summarized history. A and D still leave preservation probabilistic; C just delays the failure to the context limit.

**Q24 — B.** An explicit customer request for a human is an immediate escalation trigger — honor it without first attempting investigation. (Contrast: frustration *without* an explicit request, on a straightforward issue → acknowledge and offer to resolve.) C uses sentiment, an unreliable proxy; D delays the honored request.

---

## Score yourself

- 22–24: exam-ready on these topics — verify with the official practice exam
- 18–21: solid; re-read the notes for each domain you missed
- <18: re-read all domain notes, redo the hands-on exercises, retake in a week
