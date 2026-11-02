# Domain 1: Agentic Architecture & Orchestration (27% — the biggest domain)

## 1.1 Agentic loops

**The loop:** send request → Claude responds → inspect `stop_reason` →
- `"tool_use"` → execute the requested tool(s), append results to conversation history, send the next request
- `"end_turn"` → Claude is done; present the final response and terminate

**Why it works:** tool results are appended to conversation history, so the model reasons about the *next* action with the new information in context. Decisions are **model-driven** (Claude picks the next tool from context), not a pre-configured decision tree or fixed tool sequence.

**Anti-patterns (likely distractors):**
- Parsing natural-language signals ("I'm finished") to decide loop termination
- Arbitrary iteration caps as the *primary* stopping mechanism (fine as a safety net, wrong as the control signal)
- Checking whether the assistant returned text content as a "completion indicator"

## 1.2 Coordinator–subagent (hub-and-spoke) orchestration

- **All inter-subagent communication routes through the coordinator** — so that monitoring, uniform error handling and managed information flow stay in one place. Subagents never talk directly to each other.
- Subagents run with **isolated context**: they start without the coordinator's earlier conversation.
- Coordinator responsibilities: task decomposition, delegation, result aggregation, and **dynamically selecting which subagents to invoke** based on query complexity (not always running the full pipeline).
- **Failure mode to recognize:** overly narrow decomposition. If a report on "creative industries" only covers visual arts, check the coordinator's subtask list first — subagents executing their assignments correctly can't fix a bad assignment.
- **Iterative refinement loop:** coordinator evaluates synthesis output for gaps → re-delegates targeted queries to search/analysis subagents → re-invokes synthesis, until coverage is sufficient.
- Partition research scope across subagents (distinct subtopics or source types) to minimize duplication.
- **Each subagent brief needs:** an objective, an output format, which tools/sources to use, and **explicit task boundaries** — without boundaries, subagents duplicated work (docs-delta §1.2). Duplicated or missing coverage while every subagent executed its brief correctly → fix the briefs, not the output.

## 1.3 Subagent invocation, context passing, spawning

- Subagents are spawned via the **`Task` tool**; the coordinator's `allowedTools` **must include `"Task"`**.
- Context must be **explicitly provided in the subagent's prompt** — no automatic inheritance, no shared memory between invocations. E.g., the synthesis subagent must receive the web-search results and document analyses *in its prompt*.
- Use **structured data formats** that keep content apart from its metadata (source URLs, document names, page numbers) when passing context, to preserve attribution.
- **Parallel subagents:** emit multiple `Task` tool calls **in a single coordinator response** — not spread across separate turns.
- `AgentDefinition` configures each subagent type: description, system prompt, tool restrictions.
- Coordinator prompts should specify **research goals and quality criteria**, not step-by-step procedures — this lets subagents adapt.

## 1.4 Multi-step workflows: enforcement & handoffs

- **Programmatic enforcement (hooks, prerequisite gates) vs prompt-based guidance:** when deterministic compliance is required (e.g., identity verification before refunds), prompts alone have a **non-zero failure rate**. Use a programmatic prerequisite that *blocks* `process_refund` until `get_customer` has come back with a verified customer ID.
- Multi-concern requests: decompose into distinct items, investigate each **in parallel with shared context**, then synthesize one unified resolution.
- **Structured handoff for escalation** (the human agent can't see the transcript): include customer ID, root cause analysis, refund amount, recommended action.
- Idempotency: a retry-safe side effect needs a **stable key derived from the operation's identity** (release, order, invoice). Check-then-act leaves a race in the gap; disabling retries trades duplication for lost resilience.

## 1.5 Agent SDK hooks

- **PostToolUse hooks** intercept tool *results* before the model sees them — use for normalizing heterogeneous data (Unix timestamps vs ISO 8601, numeric vs string status codes) coming from different MCP tools.
- **Tool-call interception hooks** intercept *outgoing* calls to enforce compliance — e.g., block refunds > $500 and redirect to a human-escalation workflow.
- Decision rule: **hooks = deterministic guarantee; prompts = probabilistic compliance.** Business rules that must never be violated → hooks.

## 1.6 Task decomposition strategies

- **Prompt chaining (fixed sequential pipeline):** for predictable multi-aspect work. E.g., code review = analyze each file individually, then a cross-file integration pass. Avoids attention dilution.
- **Dynamic adaptive decomposition:** for open-ended investigation — generate subtasks based on what each step discovers. E.g., "add comprehensive tests to a legacy codebase": map structure → identify high-impact areas → build a prioritized plan that adapts as dependencies surface.
- Choose by predictability: predictable multi-aspect review → chaining; open-ended exploration → adaptive.

## 1.7 Session state, resumption, forking

- `--resume <session-name>` — continue a specific named prior conversation across work sessions.
- `fork_session` — create **independent branches from a shared analysis baseline** to explore divergent approaches (e.g., compare two refactoring strategies from one codebase analysis).
- **Stale context rule:** if prior tool results are stale (files changed since), it is more reliable to begin a **fresh session seeded with a structured summary** than to resume. If prior context is mostly valid, resume — but **tell the agent which files changed** so it can re-analyze just those instead of re-exploring everything.

---

## Exam traps for this domain

| Trap | Correct instinct |
|---|---|
| "Strengthen the system prompt" for a mandatory tool ordering | Programmatic prerequisite/hook — prompts are probabilistic |
| Blaming subagents when coverage is incomplete | Check the coordinator's decomposition first |
| Spawning parallel agents across multiple turns | Multiple Task calls in ONE response |
| Assuming subagents see the parent's conversation | They don't — pass context explicitly in the prompt |
| Iteration caps / text parsing to stop the loop | `stop_reason == "end_turn"` is the termination signal |
| Resuming a session after big code changes with no notice | Fresh session + structured summary, or resume + explicit list of changed files |
