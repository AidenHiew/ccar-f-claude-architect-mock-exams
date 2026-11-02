// tutor/build/data/d1.js — CCA-F Domain 1 paper: 16 original questions (27% of 60), exam-sized D1 slice.
// Allocation = the sim's D1 split (statements.js `d1`). Weighted inside each statement toward the score-report
// attempt-1 misses: termination safeguards (1.4/1.1), stop_reason (1.1), dynamic decomposition (1.6).
// Facts only from reference/ccar-f-official-exam-guide.md, notes/domain-1-agentic-architecture.md, notes/2026-09-docs-delta.md.
// bp.rank = required length rank of the correct option (1 longest … 4 shortest); 4 of each, letters 4 of each.
'use strict';

const META = {
  key: 'd1',
  title: 'CCA-F Domain 1 Paper',
  eyebrow: 'Agentic Architecture & Orchestration · 16 questions',
  intro: 'Sixteen original questions, the size of the Domain 1 slice of a real 60-question paper, grouped under the three exam scenarios where Domain 1 lives. Exam mode with the 32-minute countdown matches real-exam pace. None of these stems appear in the Gauntlet.',
  defaultMode: 'exam',
  timerDefault: true,
  minutes: 32,
  storageKey: 'ccaf-d1',
  blocks: [
    { id: 1, title: 'Customer Support Resolution Agent', intro: 'Agent SDK support agent with MCP tools get_customer, lookup_order, process_refund, escalate_to_human. Target: 80%+ first-contact resolution while knowing when to escalate.' },
    { id: 2, title: 'Multi-Agent Research System', intro: 'A coordinator delegates to subagents that search the web, analyze documents, synthesize findings, and generate cited reports.' },
    { id: 3, title: 'Developer Productivity with Claude', intro: 'An Agent SDK agent that helps engineers explore unfamiliar codebases, generate boilerplate, and automate repetitive tasks with Read, Write, Bash, Grep, Glob and MCP servers.' },
  ],
};

const Q = [
  // ───────────────────────── Block 1 · Customer Support ─────────────────────────
  {
    id: 'D101', ts: '1.1', s: 'cs', block: 1, bp: { rank: 2 },
    q: "Your support agent's loop returns the response to the customer as soon as it contains a text block. The model often writes a short preamble such as 'Let me pull up that order for you' in the same response as a tool_use block. In 9% of sessions the customer receives only that preamble and no tool ever runs. Which change fixes the loop?",
    o: [
      "Add a system prompt rule that the agent must never write text in the same response as a tool call, with two worked examples of the correct pattern and one of the wrong one",
      "Drive the loop from stop_reason: on tool_use, execute every tool_use block and append the results whatever text accompanies them, and return only on end_turn",
      "Treat a response as final only when its text block is longer than 40 characters, so short preambles no longer end the loop",
      "Cap the loop at 8 iterations and return the most recent text block when the cap is reached",
    ],
    a: 1,
    why: "Text content is not a completion signal; a response can carry text and tool_use blocks together. stop_reason is the control signal: tool_use means run the tools and send the results back, end_turn means the model is done.",
    wrong: {
      A: { trap: 'probabilistic', text: "Asks the model to avoid a pattern the loop mishandles. The loop is still checking text presence, so any slip still ends the session — fix the control flow, not the model." },
      C: { trap: 'symptom-fix', text: "Still uses text content as the completion indicator, just with a length threshold. A long preamble passes it; a short final answer fails it." },
      D: { trap: 'wrong-problem', text: "An iteration cap is a safety net, not the stopping mechanism. The failure here happens on iteration 1, so a cap changes nothing." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.1 · Exam Guide TS 1.1',
  },
  {
    id: 'D102', ts: '1.4', s: 'cs', block: 1, bp: { rank: 3 },
    q: "An audit of 2,000 support sessions finds that 3% ended with neither a completed resolution nor a call to escalate_to_human. The causes were mixed: responses cut off at max_tokens, the 15-iteration safety cap being hit, a tool raising an exception, and customers disconnecting mid-investigation. The system prompt already says to escalate whenever the agent cannot resolve a case. Which design guarantees that every session ends resolved or escalated?",
    o: [
      "Move the escalation rule to the top of the system prompt, repeat it at the end, and add a few-shot example of an agent escalating after a tool error so the instruction is harder to miss",
      "Raise max_tokens to 8,192 and the iteration cap to 40 so that sessions stop terminating before the agent reaches a resolution or decides to escalate",
      "Add a PostToolUse hook on escalate_to_human that validates the handoff payload has a customer ID, root cause and recommended action",
      "Wrap the loop in orchestration code that checks every exit path and, if nothing was resolved, opens a human escalation with a structured handoff",
    ],
    a: 3,
    why: "Every listed cause ends the loop before the model gets a chance to follow its instructions, so no prompt can cover them. The guarantee has to live outside the loop: the orchestration layer inspects the final state on every exit path and escalates whatever is unresolved.",
    wrong: {
      A: { trap: 'probabilistic', text: "A truncated response, a hit cap, an exception and a disconnect all end the session before the model acts — the instruction never gets a turn to be followed." },
      B: { trap: 'symptom-fix', text: "Makes two of the four causes rarer; it eliminates none of them, and does nothing for exceptions or disconnects. Reduces, does not guarantee." },
      C: { trap: 'wrong-problem', text: "Fires only when the agent does call escalate_to_human. The failing sessions are the ones where it never did." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.4 · score-report objective 1',
  },
  {
    id: 'D103', ts: '1.4', s: 'cs', block: 1, bp: { rank: 4 },
    q: "Your agent verifies identity with get_customer before any refund. Across 10,000 refunds, 1.5% were issued against an order that belongs to a different customer — usually a caller quoting a relative's order number. The system prompt already tells the agent to confirm the order belongs to the verified customer before calling process_refund. What is the most reliable fix?",
    o: [
      "Gate process_refund in code so it rejects the call unless the order's owner matches the verified customer ID",
      "Add few-shot examples of the agent comparing the order's customer_id to the verified ID, including one where it declines the refund",
      "Have the agent ask the caller to confirm the order is theirs before every refund and log the confirmation in the transcript",
      "Have a second Claude instance review each refund decision against the transcript and flag ownership mismatches to a human",
    ],
    a: 0,
    why: "A financial operation with a compliance precondition needs a programmatic prerequisite, not better guidance. Prompt instructions — few-shot or not — keep a non-zero failure rate; a code gate on process_refund makes the mismatch impossible.",
    wrong: {
      B: { trap: 'probabilistic', text: "Better examples lower the 1.5%; they cannot make it zero. The rule is deterministic, so the enforcement should be too." },
      C: { trap: 'wrong-problem', text: "The caller is the source of the wrong order number, and will happily confirm it. Asking them adds friction without adding a check." },
      D: { trap: 'over-engineered', text: "A second model is another probabilistic check plus a human queue, to enforce an equality comparison one line of code can make." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.4 · Exam Guide TS 1.4',
  },
  {
    id: 'D104', ts: '1.4', s: 'cs', block: 1, bp: { rank: 1 },
    q: "A customer writes: 'I was charged twice for order 5521, the blender arrived cracked, and please change the delivery address on order 5530.' Logs show that for messages raising 3 or more issues, the agent resolves the first one, ends its turn, and the remaining issues go unaddressed in 22% of cases. First-contact resolution on these chats is 48%. Which approach best fixes this?",
    o: [
      "Add a system prompt instruction to address every issue the customer raises before ending the conversation, with an example message that lists three issues",
      "Detect messages that raise more than one issue and route them straight to a human agent, since they are the complex cases the agent struggles with",
      "Decompose the message into discrete concerns held as structured state, investigate each one (in parallel where independent) using the shared customer context, and compose one reply once every item is resolved or escalated",
      "Open a separate agent session for each concern, each started fresh with the customer ID, and send the customer one reply per session",
    ],
    a: 2,
    why: "Multi-concern requests are decomposed into distinct items, investigated using shared context (in parallel where they do not depend on each other), and synthesized into one unified resolution. Holding the items as state is what stops issues two and three from being dropped.",
    wrong: {
      A: { trap: 'probabilistic', text: "This is the instruction the agent is already failing to follow 22% of the time. Nothing tracks which issues remain open." },
      B: { trap: 'wrong-problem', text: "These are routine issues the agent can resolve; routing them all to humans drives first-contact resolution further from 80%." },
      D: { trap: 'over-engineered', text: "Throws away the shared customer context, duplicates verification three times, and sends three disconnected replies instead of one resolution." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.4 · Exam Guide TS 1.4',
  },
  {
    id: 'D105', ts: '1.5', s: 'cs', block: 1, bp: { rank: 3 },
    q: "Three MCP tools return dates in different formats: billing returns Unix epoch seconds, orders return ISO 8601, and the shipping carrier returns DD/MM/YYYY strings. In 7% of return requests the agent miscalculates the 30-day return window, for example reading 03/04/2026 as 4 March. The system prompt already documents each tool's format. What is the most effective fix?",
    o: [
      "Expand the system prompt's date section with a worked example for each of the three formats and an explicit warning about day-month ordering",
      "Add a PostToolUse hook that converts every date field in tool results to ISO 8601 before the model processes them",
      "Add a calculate_return_window tool and instruct the agent to call it with the dates it reads from tool results",
      "Run a validation pass after each response that recomputes any date arithmetic and asks the model to correct mismatches",
    ],
    a: 1,
    why: "PostToolUse hooks intercept tool results before the model processes them — the designed place to normalize heterogeneous formats from different MCP tools. Once every date is ISO 8601, there is no ambiguous string left to misread.",
    wrong: {
      A: { trap: 'probabilistic', text: "The formats are already documented and the error persists. More instruction still leaves the model interpreting an ambiguous string." },
      C: { trap: 'symptom-fix', text: "The arithmetic is not the problem — the model's reading of DD/MM is. It would pass the misread date into the new tool." },
      D: { trap: 'reactive-too-late', text: "Detects the error after the answer is written, and the recomputation has to parse the same ambiguous strings." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.5 · Exam Guide TS 1.5',
  },
  {
    id: 'D106', ts: '1.5', s: 'cs', block: 1, bp: { rank: 1 },
    q: "Policy requires human approval for refunds above $500, so you added a PreToolUse hook that denies process_refund calls over that amount. Since deployment, 14% of high-value refund sessions end with the agent telling the customer 'I'm unable to process this refund' and nothing further happens. No escalation is recorded for those sessions. What should you change?",
    o: [
      "Remove the hook and state the $500 limit in the system prompt, instructing the agent to call escalate_to_human for any refund above it",
      "Keep the hook and add a system prompt instruction that whenever a refund is denied, the agent must call escalate_to_human",
      "Change the policy so the agent refunds $500 immediately and escalates only the remaining amount for human approval",
      "Have the hook itself, on denial, open the human escalation with a structured handoff and return a reason telling the agent the case is now with a specialist so it can inform the customer",
    ],
    a: 3,
    why: "Interception hooks should block the policy-violating action and redirect it to the alternative workflow. Making the redirect part of the hook keeps the whole path deterministic; leaving the escalation to the model reintroduces the probabilistic step that just failed 14% of the time.",
    wrong: {
      A: { trap: 'probabilistic', text: "Trades a guaranteed block for a prompt rule. The $500 limit becomes something the model usually respects." },
      B: { trap: 'probabilistic', text: "The block is deterministic but the redirect still depends on the model remembering to escalate — the exact step that is failing." },
      C: { trap: 'wrong-problem', text: "Rewrites the business policy to work around a workflow gap. The open question is the escalation path, not the threshold." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.5 · Exam Guide TS 1.5',
  },

  // ───────────────────────── Block 2 · Multi-Agent Research ─────────────────────────
  {
    id: 'D107', ts: '1.2', s: 'ma', block: 2, bp: { rank: 2 },
    q: "Your coordinator runs every query through all four subagents: search, document analysis, synthesis and report. Usage data shows 40% of queries are simple factual lookups such as 'When was the EU AI Act adopted?'. Those take about 90 seconds and cost roughly 12 times a single-agent answer. What is the best change?",
    o: [
      "Have the coordinator assess each query's complexity and invoke only the subagents it needs, answering simple lookups with the search subagent alone",
      "Move all four subagents to a smaller, cheaper model to lower the per-query cost",
      "Run all four subagents in parallel instead of in sequence to cut the 90-second latency",
      "Put a keyword-based classifier in front of the coordinator that detects simple factual queries and sends them to a separate, cheaper single-agent system instead",
    ],
    a: 0,
    why: "The coordinator's job includes deciding which subagents to invoke based on query complexity rather than always routing through the full pipeline. Anthropic's own research system scales effort to the query: one agent and a few tool calls for a simple question, many subagents for a complex one.",
    wrong: {
      B: { trap: 'wrong-problem', text: "Makes unnecessary work cheaper instead of not doing it. Simple lookups still pay for four agents and a report." },
      C: { trap: 'wrong-problem', text: "Synthesis and reporting depend on earlier outputs, so they cannot start in parallel, and the unnecessary work still runs." },
      D: { trap: 'over-engineered', text: "Builds a second system and a brittle keyword router for a decision the coordinator is already positioned to make." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.2 · notes/2026-09-docs-delta.md §1.2 (scaling rule: simple query → 1 agent)',
  },
  {
    id: 'D108', ts: '1.2', s: 'ma', block: 2, bp: { rank: 4 },
    q: "Briefs ask for desalination cost data across 6 named regions. Reviewers find that 30% of reports omit at least one region entirely, although each subagent's output is accurate for what it covered. The coordinator runs search, analysis and synthesis exactly once per query, then generates the report. What is the most effective fix?",
    o: [
      "Raise the search subagent's results per query from 10 to 30 so that fewer of the regions get missed",
      "Have the report subagent list any missing regions in a limitations section at the end of the report",
      "Have the coordinator check synthesis against the brief so it can re-delegate searches for gaps",
      "Give the synthesis subagent the full search and analysis toolsets so it can research any gap it notices itself",
    ],
    a: 2,
    why: "This is the iterative refinement loop: the coordinator evaluates synthesis output for gaps, re-delegates targeted queries to search and analysis, and re-invokes synthesis until coverage is sufficient. A single pass has no step that notices a missing region.",
    wrong: {
      A: { trap: 'symptom-fix', text: "More results per query may catch some regions by chance; nothing checks coverage against the brief, so gaps still ship." },
      B: { trap: 'reactive-too-late', text: "Discloses the gap instead of closing it. The brief asked for all 6 regions." },
      D: { trap: 'over-engineered', text: "A whole missing region is deep investigation, not a quick fact-check. Handing synthesis every toolset breaks separation of concerns and bypasses the coordinator." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.2 · Exam Guide TS 1.2',
  },
  {
    id: 'D109', ts: '1.2', s: 'ma', block: 2, bp: { rank: 2 },
    q: "To cut latency, the team let the document-analysis subagent pass its results straight to the synthesis subagent through a shared queue, skipping the coordinator. Since then, in 5 of 50 runs, synthesis received partial analyses after the analysis subagent failed midway. The coordinator's logs show all 50 runs as successful. What should the team do?",
    o: [
      "Add retry logic inside the analysis subagent so it re-sends complete results to the queue after a failure",
      "Have the synthesis subagent check that the analyses look complete before it starts writing",
      "Have the analysis subagent write any failures to a shared error log, which the coordinator reads and reviews once each run has finished",
      "Route analysis output back through the coordinator, which checks its status and decides to retry, re-delegate, or pass it to synthesis",
    ],
    a: 3,
    why: "In hub-and-spoke orchestration all subagent communication flows through the coordinator, which gives observability, consistent error handling and controlled information flow. The bypass removed exactly those: failures became invisible and nothing could decide on recovery.",
    wrong: {
      A: { trap: 'symptom-fix', text: "Covers one failure type inside one subagent. The coordinator still sees nothing, and an unrecoverable failure still reaches synthesis." },
      B: { trap: 'symptom-fix', text: "Asks the downstream agent to guess completeness from content, without the error status — and the coordinator still believes the run succeeded." },
      C: { trap: 'reactive-too-late', text: "The coordinator learns about the failure after synthesis has already consumed the partial data." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.2 · Exam Guide TS 1.2',
  },
  {
    id: 'D110', ts: '1.3', s: 'ma', block: 2, bp: { rank: 4 },
    q: "The coordinator passes findings to the synthesis subagent as concatenated prose paragraphs. Final reports attribute 18% of statistics to the wrong source. The search subagents' own outputs carried the correct URL for every finding. What is the most effective fix?",
    o: [
      "Instruct the synthesis subagent to double-check every citation against the findings before finalizing the report",
      "Pass findings as structured records so each claim stays paired with its URL, document name and page",
      "Have each search subagent send its findings directly to the synthesis subagent instead of through the coordinator",
      "Raise the synthesis subagent's max_tokens so that it has enough room to write out every citation in full",
    ],
    a: 1,
    why: "Attribution is lost when claims and their metadata are flattened into prose. Passing context in a structured format that keeps content separate from metadata (URL, document, page) preserves the claim-to-source link through the handoff.",
    wrong: {
      A: { trap: 'probabilistic', text: "Asks the model to recover links that the prose format has already destroyed; there is nothing reliable to check against." },
      C: { trap: 'wrong-problem', text: "The route is not the problem — the format is. It also bypasses the coordinator's observability." },
      D: { trap: 'wrong-problem', text: "Nothing suggests truncation. Misattribution comes from the input format, not output length." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.3 · Exam Guide TS 1.3',
  },
  {
    id: 'D111', ts: '1.6', s: 'ma', block: 2, bp: { rank: 3 },
    q: "For 'Why did Company X lose market share in 2025?', the coordinator follows a fixed 5-step plan: pricing, marketing, product quality, competitors, synthesis. In 2 of 3 runs, step 1 surfaced a regulatory ban in the company's largest market. The remaining steps still researched marketing and product quality as planned, and the report mentioned the ban in one line. What should change?",
    o: [
      "Have the coordinator generate subtasks from each step's findings, re-planning when evidence points to an unanticipated cause",
      "Add a sixth fixed step, regulatory analysis, to the plan so that every future run covers regulation alongside pricing and marketing",
      "Have the synthesis subagent rank all candidate causes by strength of evidence before the report is written, so the strongest cause leads",
      "Run the five steps in parallel, then let synthesis discard the branches that turn out irrelevant",
    ],
    a: 0,
    why: "Open-ended investigation calls for dynamic decomposition: subtasks generated from what each step discovers. A fixed sequence executes regardless of intermediate findings, so the decisive lead was never investigated in depth.",
    wrong: {
      B: { trap: 'symptom-fix', text: "Patches this one question. The next unanticipated cause — a recall, a lawsuit — is missed the same way." },
      C: { trap: 'symptom-fix', text: "May move the ban higher in the report, but the ban itself was never investigated — the plan spent its budget elsewhere." },
      D: { trap: 'wrong-problem', text: "Faster execution of the same fixed plan; steps still cannot react to what step 1 found." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.6 · score-report objective 4',
  },

  // ───────────────────────── Block 3 · Developer Productivity ─────────────────────────
  {
    id: 'D112', ts: '1.1', s: 'dp', block: 3, bp: { rank: 1 },
    q: "Your boilerplate agent's loop is: while stop_reason is tool_use, run the tools; otherwise return the response as final. In 6% of runs the returned code stops mid-function, and logs show stop_reason was max_tokens on those turns. A teammate proposes having the model end every answer with the marker '// END' and looping until it appears. What should you do?",
    o: [
      "Adopt the '// END' marker and loop until it appears, since it directly detects whether the model finished writing",
      "Instruct the model to keep every generated file under 200 lines so responses never reach the token limit",
      "Branch on max_tokens as a non-final state — continue the generation or raise the limit — and treat only end_turn as completion, keeping tool_use as the signal to run tools",
      "Re-send the whole request at temperature 0 whenever the output looks incomplete",
    ],
    a: 2,
    why: "stop_reason has more values than tool_use and end_turn. max_tokens means the output was cut off, so it must not be treated as final. Only end_turn means the model finished; parsing a text marker is the natural-language-signal anti-pattern.",
    wrong: {
      A: { trap: 'probabilistic', text: "Parses natural-language output to decide termination — a listed anti-pattern. The model may omit or misplace the marker; stop_reason already says why the turn ended." },
      B: { trap: 'symptom-fix', text: "Makes truncation rarer without handling it. A 201-line file is still returned truncated as final." },
      D: { trap: 'reactive-too-late', text: "'Looks incomplete' is a guess, and temperature has nothing to do with the token limit." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.1 · notes/2026-09-docs-delta.md §1.1 (max_tokens, pause_turn, refusal must be handled)',
  },
  {
    id: 'D113', ts: '1.3', s: 'dp', block: 3, bp: { rank: 1 },
    q: "Your exploration coordinator must investigate 4 independent modules, each through its own subagent. Logs show it spawns one subagent, waits for the result, then spawns the next, so a run takes about 4 times as long as one module. The modules share no state and their findings are only combined at the end. What change gives the speedup?",
    o: [
      "Write a shell script that launches four separate SDK processes, one per module, and merges their output files afterwards",
      "Instruct the coordinator to emit all four Task tool calls in a single response so they run in parallel, each brief carrying its module path and expected output format",
      "Give a single subagent all four module paths so the coordinator only has to wait for one result",
      "Raise the coordinator's maximum turns so it has room to finish all four sequential spawns",
    ],
    a: 1,
    why: "Parallel subagents come from multiple Task tool calls emitted in one coordinator response, not spread across turns. The coordinator still aggregates the results, and each brief carries its own context because subagents do not inherit the parent's.",
    wrong: {
      A: { trap: 'over-engineered', text: "Rebuilds parallelism outside the SDK and loses the coordinator's aggregation and error handling." },
      C: { trap: 'wrong-problem', text: "Serializes the work inside one context window, the opposite of isolated parallel investigation." },
      D: { trap: 'wrong-problem', text: "The run is not failing to finish; it is slow because the spawns are sequential." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.3 · Exam Guide TS 1.3',
  },
  {
    id: 'D114', ts: '1.6', s: 'dp', block: 3, bp: { rank: 4 },
    q: "An engineer asks the agent to 'add comprehensive tests' to a 400-file legacy service with almost no coverage. The agent generates tests file by file in alphabetical order. After 3 days, 60% of new tests cover rarely used utility modules and the payment module has none. Which approach should the agent have taken?",
    o: [
      "Map the structure first so high-impact areas get priority, then adapt the plan as dependencies surface",
      "Chain the work: generate tests for each file on its own, then run a single cross-file integration pass at the end",
      "Keep the file-by-file sequence but order the files by line count, largest first, so the big modules come early",
      "Spawn 400 subagents in parallel, one per file, so that every file in the service gets its tests at the same time",
    ],
    a: 0,
    why: "Open-ended tasks are decomposed by mapping structure, identifying high-impact areas, and building a prioritized plan that adapts as dependencies are discovered. The per-file-plus-integration chain fits predictable multi-aspect reviews, not open-ended work.",
    wrong: {
      B: { trap: 'wrong-problem', text: "Prompt chaining is the pattern for predictable multi-file reviews. It still visits files with no notion of impact." },
      C: { trap: 'symptom-fix', text: "File size is a weak proxy for importance; the plan still cannot adapt to what it learns." },
      D: { trap: 'over-engineered', text: "Massive fan-out with no prioritization, and per-file isolation loses the cross-module dependencies tests need." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.6 · Exam Guide TS 1.6',
  },
  {
    id: 'D115', ts: '1.7', s: 'dp', block: 3, bp: { rank: 3 },
    q: "On Monday an engineer ran a named session, auth-audit, in which the agent read and analyzed 35 files. On Tuesday and Wednesday, teammates merged 2 pull requests that rewrote 3 of those files; the other 32 are unchanged. The engineer wants to continue the audit on Thursday. What is the best approach?",
    o: [
      "Start a new session and have the agent re-explore all 35 files, so no stale analysis can leak into the audit",
      "Resume auth-audit and continue; the agent will re-read any file it needs when it gets to it",
      "Fork the session with fork_session so the original stays untouched, then continue the audit in the fork",
      "Resume auth-audit with --resume and name the 3 changed files so the agent re-analyzes only those",
    ],
    a: 3,
    why: "When prior context is mostly valid, resume — and inform the agent about the specific files that changed so it re-analyzes those instead of re-exploring everything. Fresh-start-with-summary is for when most prior tool results are stale.",
    wrong: {
      A: { trap: 'over-engineered', text: "Discards valid analysis of 32 unchanged files to handle 3 changed ones." },
      B: { trap: 'wrong-problem', text: "The agent already holds tool results for the 3 rewritten files and has no reason to think they are stale, so it reasons from old code." },
      C: { trap: 'wrong-problem', text: "Forking creates a branch for divergent exploration; the fork inherits the same stale results." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.7 · Exam Guide TS 1.7',
  },
  {
    id: 'D116', ts: '1.7', s: 'dp', block: 3, bp: { rank: 2 },
    q: "After a 2-hour session analyzing a 120,000-line monolith, the team wants to compare two refactoring strategies: strangler-fig and module extraction. Each strategy should build on the full shared analysis. Neither should be influenced by the other's exploration. What should they do?",
    o: [
      "Continue in the same session, try the first strategy, then tell the agent to disregard it before trying the second",
      "Start two brand-new sessions and re-run the full 2-hour analysis in each so they share nothing",
      "Use fork_session to create two independent branches from the shared analysis baseline, one per strategy",
      "Resume the analysis session in two terminals at once so both strategies continue from the same history",
    ],
    a: 2,
    why: "fork_session creates independent branches from a shared analysis baseline — the designed tool for comparing divergent approaches without repeating the baseline or cross-contaminating the branches.",
    wrong: {
      A: { trap: 'probabilistic', text: "'Disregard it' does not remove the first strategy's exploration from context; the second strategy is still shaped by it." },
      B: { trap: 'over-engineered', text: "Repeats 2 hours of analysis twice to get the isolation forking provides for free." },
      D: { trap: 'wrong-problem', text: "Both terminals continue one session rather than two independent branches, so the strategies are not isolated." },
    },
    cite: 'notes/domain-1-agentic-architecture.md §1.7 · Exam Guide TS 1.7',
  },
];

module.exports = { META, Q };
