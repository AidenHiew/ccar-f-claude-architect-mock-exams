# Diagnostic — CCA Foundations

30 questions, one per task statement. Answers live in `tutor/diagnostic-key.md` — do not open it until you have finished all 30. Pick the single best option for each.

## Q1

You are building an inventory agent with the Claude API. After each model response, your loop must decide whether to execute tools and send another request, or return the final response to the user. What should drive that decision?

A) Instruct Claude to end every completed reply with the marker "DONE" and scan each response's text for it
B) Inspect `stop_reason` on each response: continue when it is `"tool_use"`, terminate when it is `"end_turn"`
C) Terminate the loop after a fixed maximum of eight iterations so the agent can never run indefinitely
D) Terminate whenever the response contains a text block, since text content indicates the model is finished

## Q2

A multi-agent research system produces reports in which the synthesis agent's claims cannot be traced to any search result, and failures inside the analysis agent surface only as silent gaps in the final report. A teammate had wired the analysis agent to send findings directly to the synthesis agent to cut round trips. What is the best architectural fix?

A) Route all inter-subagent communication back through the coordinator for observability, error handling, and information flow control
B) Add detailed logging inside each subagent so the direct messages between them are at least recorded for later debugging
C) Build a dedicated message-bus service with schema validation sitting between every pair of subagents in the system
D) Give the synthesis agent its own retry logic so that analysis-agent failures are automatically retried before synthesis begins

## Q3

Your coordinator spawns a synthesis subagent via the `Task` tool, but the synthesis output ignores all web-search findings gathered earlier in the run. Logs confirm the subagent never saw them. What is the most likely cause?

A) The synthesis agent's system prompt lacks an instruction telling it to consult the findings from earlier phases
B) The `allowedTools` list for the synthesis agent omits the web-search tool, so it cannot re-fetch the findings itself
C) The findings exceeded the subagent's context window and were silently truncated before the model processed them
D) Subagents do not inherit the coordinator's conversation history — the findings must be passed explicitly in the subagent's prompt

## Q4

A billing agent occasionally issues account credits without first calling `verify_account_owner`, despite a system prompt stating verification is mandatory. Compliance requires that this ordering can never be violated. What should you do?

A) Rewrite the system prompt so the verification rule appears first, in stronger and fully capitalized language
B) Add few-shot example transcripts to the prompt demonstrating the verification call always happening first
C) Add a programmatic prerequisite that blocks `issue_credit` until `verify_account_owner` has returned a verified owner ID
D) Log every ordering violation and alert a supervisor to review the affected credits shortly after issuance

## Q5

Your support agent's MCP tools return timestamps in three formats: Unix epoch integers, ISO 8601 strings, and RFC 2822 strings. The agent intermittently mis-orders events when reasoning across tools. What is the most reliable fix?

A) Add a PostToolUse hook that normalizes every tool result's timestamps to ISO 8601 before the model processes them
B) Update the system prompt with explicit instructions to convert all timestamps to ISO 8601 before comparing any two event times
C) Build a preprocessing microservice that proxies every MCP server and rewrites responses into one canonical event schema
D) Put few-shot examples in the system prompt demonstrating correct chronological ordering across the three timestamp formats

## Q6

You are designing two workflows: (a) reviewing every pull request for style, security, and test coverage — the same aspects every time; and (b) investigating why a legacy service leaks memory — where each finding changes what to examine next. Which decomposition strategy fits each workflow?

A) Use dynamic adaptive decomposition for both, since flexibility never hurts a structured review process
B) Use a fixed prompt-chained pipeline for (a) and dynamic adaptive decomposition based on findings for (b)
C) Use fixed prompt-chained pipelines for both, since predictable stages make every workflow easier to debug
D) Use dynamic adaptive decomposition for (a) and a fixed prompt-chained pipeline for (b), matching depth to risk

## Q7

Last week you analyzed a codebase in a named Claude Code session. Since then, a large refactor landed touching roughly 40% of the files. You want to continue the investigation now. What is the best move?

A) Resume the named session with `--resume` and continue the investigation exactly where you left off
B) Use `fork_session` to branch the old analysis into two parallel explorations of the refactored code
C) Start a fresh session seeded with a structured summary of your prior conclusions, noting that the refactor landed
D) Re-run the entire codebase analysis from scratch in a new session without carrying over any prior conclusions

## Q8

An agent has two tools with the descriptions "Searches the ticket system" and "Searches the knowledge base." Users asking about known bugs are routinely routed to the wrong tool, since both accept free-text queries. What is the most effective first step?

A) Add several few-shot examples to the system prompt showing bug questions being routed to the ticket-system tool
B) Insert a keyword-based routing layer that classifies each query before the model ever selects a tool
C) Merge both tools into one `search_everything` tool that queries both backends and merges ranked results
D) Expand each tool's description with input formats, example queries, and boundaries stating when to choose it over the other

## Q9

Your MCP tool returns the string "Operation failed" for every failure: timeouts, malformed input, and policy blocks alike. The agent responds by retrying everything three times — including policy violations that can never succeed. What is the best fix?

A) Return structured error metadata: an `errorCategory` (transient/validation/permission), an `isRetryable` boolean, and a human-readable description
B) Add a system prompt instruction telling the agent it may retry any failed tool call at most one time
C) Remove the agent's retry behavior entirely so that no failure category is ever retried automatically
D) Wrap the tool in a gateway service that classifies failures by parsing the error message text with regular expressions

## Q10

An extraction pipeline must guarantee the model always calls one of three extraction tools rather than replying in prose, and the document type — unknown until runtime — determines which tool is right. How should you configure the request?

A) Set `tool_choice: "auto"` and add a system prompt instruction that a tool must always be used for every document
B) Set `tool_choice: "any"` so the model must call some tool while remaining free to pick the one matching the document
C) Force `tool_choice` to name `extract_invoice`, the most common document type in the pipeline's historical volume
D) Set temperature to zero so the model deterministically selects a tool instead of drifting into a prose reply

## Q11

Your team's Jira MCP server must be available to everyone who clones the repo, authenticated by an API token that must never be committed. You also run a personal experimental MCP server. What is the correct setup?

A) Put both servers in the project's `.mcp.json`, storing the token in a git-ignored `.env` file referenced by absolute path
B) Put both servers in your user-level `~/.claude.json` so that the API token never appears anywhere inside the repository
C) Configure a central secrets-distribution service that injects both server configs into each developer's environment at login
D) Put Jira in the project's `.mcp.json` using `${JIRA_TOKEN}` environment expansion, and the personal server in `~/.claude.json`

## Q12

You need to change one function in a 4,000-line file, but Edit fails because your anchor text appears six times in the file. What is the most reliable path to the modification?

A) Use Bash with `sed` to replace the first occurrence, since the target function is defined near the top
B) Use Grep across the codebase to find an alternative definition of the function that might be easier to edit
C) Read the full file, then Write it back with the single targeted modification applied
D) Split the file into six smaller modules first so that each occurrence of the anchor text becomes unique

## Q13

A contractor joins your team, clones the repo, and Claude Code ignores every team convention — naming rules, test standards, commit format — that works fine on your machine. What is the most likely cause?

A) The contractor's Claude Code version predates support for CLAUDE.md files and silently skips loading them
B) The conventions reference tools that exist on your machine but are missing from the contractor's environment
C) The conventions live in your user-level `~/.claude/CLAUDE.md`, which is never shared through version control
D) The contractor cloned with a git protocol that excludes hidden directories such as `.claude/` from checkout

## Q14

Your team runs a codebase-analysis workflow whose output is thousands of lines of exploration detail. Run as a normal skill, it floods the main conversation and degrades everything that follows. Which skill configuration fixes this?

A) Set `context: fork` in the skill's frontmatter so it runs in an isolated sub-agent context and returns only its summary
B) Set `allowed-tools` in the frontmatter to read-only tools so the skill produces less output while it explores
C) Move the skill from `.claude/skills/` to `~/.claude/skills/` so its output attaches to your user scope instead
D) Add an `argument-hint` to the frontmatter so users scope the analysis narrowly enough to produce less text

## Q15

Test files sit next to their source files across dozens of directories (`Button.test.tsx` beside `Button.tsx`), and you want one set of testing conventions applied automatically whenever any test file is edited. What is the most maintainable mechanism?

A) Place a CLAUDE.md file in every directory that contains test files, each repeating the testing conventions
B) Create a `.claude/rules/` file with YAML frontmatter `paths: ["**/*.test.*"]` so the rule loads only when editing matching files
C) Consolidate the conventions into the root CLAUDE.md under a clearly labeled "Testing" section header
D) Create a skill containing the conventions and rely on Claude choosing to load it when tests are being edited

## Q16

Your team must migrate 60 files from one ORM to another, with real decisions about transaction boundaries and query semantics. A teammate says "just start executing and course-correct if it gets complex." What is the right approach?

A) Follow the teammate's advice, since starting quickly surfaces the real problems faster than any upfront design
B) Use direct execution but write extremely detailed upfront instructions specifying how every file must change
C) Split the migration across parallel sessions, one per module, so no single session carries the full complexity
D) Start in plan mode — the complexity is already evident in the requirements, so explore and design before changing files

## Q17

You ask Claude Code to reformat customer records, describing the transformation in prose. Across attempts, the output format keeps drifting in ways the prose never pins down. What is the most effective fix?

A) Provide 2–3 concrete input/output example pairs that demonstrate the exact transformation you want
B) Rewrite the prose description to be substantially longer and more precise about every formatting detail
C) Ask Claude to restate the transformation in its own words before performing it on the records
D) Break the transformation into many smaller sequential steps, each described in its own separate prose message

## Q18

Your nightly cron job runs `claude "Summarize yesterday's error logs"` and hangs forever; logs show Claude Code waiting for interactive input. What fixes the pipeline?

A) Redirect stdin from `/dev/null` so the process receives an immediate end-of-file instead of waiting
B) Set the `CLAUDE_HEADLESS=true` environment variable before the command so it runs non-interactively
C) Add the `-p` flag — `claude -p "Summarize yesterday's error logs"` — to run in non-interactive mode
D) Add the `--batch` flag so the job is queued and processed without an attached interactive terminal

## Q19

Your automated code review flags dozens of harmless style choices as problems, and developers have begun ignoring all its output — including real bug reports. The prompt already says "only report high-confidence issues." What is the most effective fix?

A) Strengthen the confidence instruction further, telling the model to report only findings it is virtually certain about
B) Replace confidence-based filtering with explicit categorical criteria: report bugs and security issues, skip style and local patterns
C) Route all findings through a second model pass that scores each one and drops those below a fixed threshold
D) Reduce the volume of findings by capping the review at a maximum of five reported issues per pull request

## Q20

Your extraction prompt has detailed instructions, yet output format still varies and ambiguous inputs are handled inconsistently from run to run. What is the most effective addition?

A) An instruction block restating the format requirements at both the start and the end of the prompt
B) A significantly longer instruction section enumerating every ambiguous case you have observed so far
C) A closing warning that inconsistent output formats will be rejected by the downstream validation system
D) 2–4 targeted few-shot examples covering the ambiguous cases, each showing the reasoning behind the correct handling

## Q21

Your invoice-extraction schema marks `po_number` as required, but many supplier invoices genuinely have no PO number — and the model keeps inventing plausible-looking values for those. What is the correct schema fix?

A) Make `po_number` nullable/optional so the model can return null when the source document lacks the value
B) Add a prompt instruction telling the model to use the string "NONE" whenever the PO number is missing
C) Keep the field required but add a validation step that rejects extractions whose PO numbers look fabricated
D) Split invoices into two pipelines — with and without PO numbers — each with its own extraction schema

## Q22

An extraction fails Pydantic validation: the model returned `"total": "1,249.00"` where a number is required. You have one retry budgeted. What gives the retry the best chance of success?

A) Resend the identical request, since validation failures of this kind are usually transient model noise
B) Resend with temperature lowered to zero so the model makes fewer formatting mistakes on the second pass
C) Resend the document with the failed extraction and the specific validation error appended, so the model can self-correct
D) Resend with a simplified schema that removes the failing field, then re-add it in a later enrichment pass

## Q23

Two workflows call Claude: a pre-merge check developers wait on, and a nightly technical-debt report read the next morning. Your manager wants both moved to the Message Batches API for the 50% cost savings. What should you recommend?

A) Move both workflows to the Batch API and add status polling so the pre-merge check completes as soon as possible
B) Move only the nightly report to the Batch API; keep the pre-merge check synchronous because batches have no latency SLA
C) Keep both synchronous, because batch results can arrive out of order and correlation between jobs becomes unreliable
D) Move both to the Batch API with a timeout that falls back to synchronous calls whenever a batch runs long

## Q24

The same Claude session that generated a complex module is then asked to review its own output; it approves code containing a subtle concurrency bug. Extended thinking was already enabled. What review architecture fixes this?

A) Re-run the self-review with a stronger prompt instructing the model to be adversarial toward its own code
B) Have the session review the module twice more and only trust findings that appear in at least two passes
C) Increase the thinking budget substantially so the self-review reasons more deeply about the concurrency paths
D) Dispatch an independent instance without the generation context to review the module with fresh eyes

## Q25

In a long support conversation, progressive summarization has replaced exact order numbers, amounts, and promised dates with vague prose, and the agent has begun misquoting them. What is the best fix?

A) Increase the summarization interval so exact values survive longer before each compression pass occurs
B) Extract transactional facts into a persistent "case facts" block included in each prompt outside the summarized history
C) Instruct the summarizer to preserve all numbers verbatim whenever it compresses the conversation history
D) Store the full unsummarized transcript externally and re-inject the complete history when a discrepancy appears

## Q26

A customer asks your support agent whether the company will match a competitor's advertised price. The policy document covers only own-site price adjustments and says nothing about competitor matching. The agent should:

A) Escalate to a human, because the policy is silent on this request and policy gaps are not the agent's call
B) Decline the request, because anything the policy does not explicitly authorize must default to refusal
C) Approve the match if the price difference is small, since low-value goodwill gestures carry minimal risk
D) Ask the customer to provide proof of the competitor's price before making any decision on the request

## Q27

A database-analysis subagent times out mid-task. You must design what flows back to the coordinator so it can recover intelligently. What should the subagent return?

A) A generic "analysis unavailable" status after exhausting its own internal retries, keeping the interface simple
B) An empty result set marked successful, so the coordinator's pipeline continues without special-case handling
C) The raw timeout exception propagated upward so the whole workflow halts and no partial data is trusted
D) Structured error context: the kind of failure, the query tried, any partial results, and viable alternative approaches

## Q28

Deep into a long codebase-exploration session, Claude starts citing "typical repository patterns" instead of the specific classes it identified earlier, and responses have become inconsistent. Which countermeasure directly addresses this?

A) Restate your original question with more detail so the model re-anchors on the current task's specifics
B) Switch to a model tier with a larger context window so earlier findings remain inside the window longer
C) Maintain a scratchpad file of key findings and reference it for subsequent questions, delegating verbose exploration to subagents
D) Ask the model to summarize everything it has learned so far and continue the session from that summary alone

## Q29

Your extraction system reports 97% aggregate accuracy, and leadership wants to cut human review of high-confidence extractions. What must you verify before agreeing?

A) Accuracy segmented by document type and field, since a strong aggregate can hide severe failures in specific segments
B) That the 97% figure was measured on a sample of at least ten thousand documents drawn from recent production traffic
C) That model confidence scores exceed 0.97 on the extractions that would no longer receive any human review
D) That the remaining 3% of errors are concentrated in fields whose downstream business impact is demonstrably low

## Q30

Two credible sources give different figures for the same market statistic, and your synthesis agent must produce the final report. How should the conflict be handled?

A) Select the figure from the source with the higher domain authority and cite it as the report's single value
B) Present both figures annotated with their sources, letting the report flag the conflict rather than silently resolving it
C) Average the two figures, since the midpoint minimizes the expected error when sources genuinely disagree
D) Omit the statistic entirely, since any number the sources dispute is too unreliable for a cited report
