// tutor/build/data/d2r.js — Domain 2 retake paper 2: 11 original questions (18% of a 60-question paper).
// Same allocation as d2 (statements.js). Each question re-tests a recorded D2 miss pattern in a new setting:
// D03 / LR-0021 Q4 (2.1), D05 + LR-0016 Q7 (2.2), D08 + LR-0016 Q4 + LR-0021 Q3 (2.3), D11 + obj 13 (2.5).
// Facts only from reference/ccar-f-official-exam-guide.md §2.1–2.5, notes/domain-2-tool-design-mcp.md and
// lessons 0009/0010. bp.rank = required length rank of the correct option (1 longest … 4 shortest).
'use strict';

const META = {
  key: 'd2r',
  title: 'CCA-F Domain 2 Paper 2',
  eyebrow: 'Tool Design and MCP Integration · 11 questions',
  intro: 'Eleven exam-level questions on Domain 2, its 18% share of a 60-question paper. Each one re-tests, in a new setting, a pattern you missed on an earlier Domain 2 drill or lesson quiz. Exam mode, 22 minutes.',
  defaultMode: 'exam',
  timerDefault: true,
  minutes: 22,
  storageKey: 'ccaf-d2r-paper',
};

const Q = [
  // ───────────────────────── 2.1 — system prompt override (D03 pattern) ─────────────────────────
  {
    id: 'R01', ts: '2.1', s: 'dp', bp: { rank: 3 },
    q: "Your developer-productivity agent has search_wiki for internal design docs and search_code for the monorepo. Three weeks ago you rewrote both descriptions with input formats, example queries, and when-to-use-which guidance; misroutes fell from 26% to 11% and have stayed there for 2 releases. Nine in 10 remaining misroutes are questions like 'where is RetryPolicy defined?' sent to search_wiki. The system prompt contains: 'When asked where something is defined, check the design docs before anything else.' What is the most effective next step?",
    o: [
      "Add six few-shot examples to the system prompt that show 'where is X defined' questions about code symbols being routed to search_code",
      "Merge both into one search tool with a target parameter set to wiki or code, and let the model choose the target on each request",
      "Delete the 'defined means design docs' rule from the system prompt and let the rewritten tool descriptions decide the routing",
      "Rename search_wiki to search_design_docs and add a line to its description saying it never contains source code definitions",
    ],
    a: 2,
    why: "The descriptions were already fixed and the improvement plateaued. The residue clusters on one phrase that a keyword-sensitive system prompt instruction ties to the wrong tool, and that instruction overrides the descriptions. Removing it fixes the cause at zero cost.",
    wrong: {
      A: { trap: 'probabilistic', text: "Few-shot examples argue against an instruction that still says the opposite. The conflicting rule stays in the prompt, so the result depends on which signal wins on each request." },
      B: { trap: 'wrong-problem', text: "Wiki and code are different resources with different result shapes, the split case. Merging moves the same misroute into the target parameter while the overriding rule still points at the docs." },
      D: { trap: 'symptom-fix', text: "The descriptions are already good, which is why misroutes fell to 11%. Another description line does not remove the system prompt instruction that keeps overriding them." },
    },
    cite: 'Exam guide §2.1; notes/domain-2 §2.1; lesson 0009 §1',
  },

  // ───────────────────────── 2.1 — consolidate vs split (LR-0021 lesson 9 Q4) ─────────────────────────
  {
    id: 'R02', ts: '2.1', s: 'cs', bp: { rank: 3 },
    q: "Your support agent has 16 tools. Six of them are set_ticket_status, set_ticket_priority, set_ticket_assignee, set_ticket_tags, set_ticket_due_date and set_ticket_category; each takes a ticket ID and one value, and each returns the updated ticket. When a customer request changes 2 or more fields, the agent calls only one of the setters in 23% of cases and reports the ticket as fully updated. Each setter's description is already clear about which field it changes, and a system prompt line added last month, 'apply every change the customer asks for', moved the rate only from 27% to 23%. Which change best addresses this?",
    o: [
      "Move update work to a separate ticket-editing subagent that owns all six setters and is called by the main agent for every edit",
      "Expand each setter's description with example requests and a reminder to check whether other fields also need to change",
      "Add a system prompt rule telling the agent to list every field a request changes and then call one setter for each listed field",
      "Replace the six setters with one update_ticket tool that takes a ticket ID plus any of the six fields and returns the ticket",
    ],
    a: 3,
    why: "The six tools act on the same resource with the same input and result shape; only the field differs. That is the consolidate signal: one update_ticket tool takes every changed field in a single call, which removes the multi-call step the agent keeps dropping and cuts the tool count from 16 to 11.",
    wrong: {
      A: { trap: 'over-engineered', text: "A new subagent adds a coordination hop and still hands that subagent six near-identical setters to sequence. The cause, one tool per field, is unchanged." },
      B: { trap: 'symptom-fix', text: "The descriptions are already clear, as the stem says. Longer descriptions do not remove the need to make several near-identical calls, which is where the fields get dropped." },
      C: { trap: 'probabilistic', text: "A prompt rule of this kind was already tried and barely moved the rate. It asks the agent to remember a multi-call sequence that the tool shape still demands, one call per field." },
    },
    cite: 'Lesson 0009 §4 (consolidate when same resource and result type, only the verb or field changes); exam guide §2.3; notes/domain-2 §2.3',
  },

  // ───────────────────────── 2.1 — expand thin descriptions (obj 27, 0%) ─────────────────────────
  {
    id: 'R03', ts: '2.1', s: 'de', bp: { rank: 2 },
    q: "Your extraction agent enriches each parsed invoice with two MCP tools: get_customer, described as 'Returns details for the customer on an invoice', and lookup_account, described as 'Returns details for the account on an invoice'. Over 1,500 invoices, 14% of calls go to the wrong tool, split almost evenly in both directions and across every invoice type. The system prompt does not mention either tool. What should you do first?",
    o: [
      "Put a routing step in front of the agent that classifies each invoice and calls the matching tool before the agent runs",
      "Rewrite both descriptions to state each input format, what each returns, an example query, and when to pick which one",
      "Add 8 few-shot examples to the system prompt that pair typical invoice lines with the right lookup tool to call next",
      "Rename them get_customer_contact and lookup_billing_account, keeping the two current descriptions exactly as they are",
    ],
    a: 1,
    why: "Two near-identical one-sentence descriptions give the model nothing to tell the tools apart, and errors spread evenly in both directions with no prompt involvement point at the descriptions themselves. Expanding them with input formats, examples, outputs, and explicit boundaries is the first, lowest-cost fix.",
    wrong: {
      A: { trap: 'over-engineered', text: "A separate routing layer works around tool selection instead of fixing the thin descriptions that cause it, and adds a component to maintain." },
      C: { trap: 'probabilistic', text: "Few-shot examples help at the margins, but the descriptions are the primary selection signal and they still overlap. Fix the root cause first." },
      D: { trap: 'symptom-fix', text: "A sharper name helps, but the guide's rename fix pairs it with a rewritten description. Left as is, the two descriptions still overlap word for word and still say nothing about inputs, outputs, or when to use which." },
    },
    cite: 'Exam guide §2.1; test objective 27 (0% on attempt 1); notes/domain-2 §2.1',
  },

  // ───────────────────────── 2.2 — local recovery + partial results (D05 pattern) ─────────────────────────
  {
    id: 'R04', ts: '2.2', s: 'ma', bp: { rank: 2 },
    q: "A research subagent is asked to collect pricing data from 5 market databases. Three return results; the other 2 time out, and each still times out after the subagent's own 3 retries. The coordinator decides whether to re-dispatch, narrow scope, or note a coverage gap in the report. What should the subagent return to the coordinator?",
    o: [
      "The results from the 3 successful databases as a normal success, with a sentence in the summary text noting that 2 were unreachable",
      "An error marked transient that lists the 2 failed sources and the retries tried, together with the results from the 3 that succeeded",
      "An error marked transient for the whole task with no data attached, and let the coordinator re-dispatch all 5 of the database queries",
      "Keep retrying the 2 failed databases with a longer backoff until they respond, and return all 5 result sets together at that point",
    ],
    a: 1,
    why: "The subagent already did its local recovery; what it could not resolve goes up with structure: category, what was attempted, and the partial results. The coordinator then has what it needs to choose between re-dispatching 2 sources, narrowing scope, or annotating the gap.",
    wrong: {
      A: { trap: 'error-suppression', text: "Marking it a success and burying the failure in prose means the coordinator's control flow sees complete coverage. The gap reaches the report only if something happens to read that sentence." },
      C: { trap: 'symptom-fix', text: "Throwing away the 3 good result sets forces redundant work, and a whole-task error hides which sources actually failed." },
      D: { trap: 'reactive-too-late', text: "Unbounded retries on sources that already failed 3 times stall the whole run and take the recovery decision away from the coordinator." },
    },
    cite: 'Exam guide §2.2; notes/domain-2 §2.2',
  },

  // ───────────────────────── 2.2 — empty vs access failure (D05 + LR-0016 Q7) ─────────────────────────
  {
    id: 'R05', ts: '2.2', s: 'cs', bp: { rank: 3 },
    q: "Your get_order_history MCP tool returns an empty list whenever the order database query fails. In 4% of conversations the agent tells customers 'I can't find any orders on your account', and logs show each was a database timeout. About 9% of customers have newly created accounts and genuinely have no orders yet. How should get_order_history respond?",
    o: [
      "Return one shared 'order history unavailable' message for both query failures and empty accounts, and let the agent explain it to the customer",
      "Return isError with a transient category for any empty result, and let the agent retry or escalate before it tells the customer anything",
      "Keep the empty list, and add a system prompt rule telling the agent to call get_order_history a second time whenever the first call returns no orders",
      "Return isError with a transient category and isRetryable true when the query fails, and keep the empty list for accounts that have no orders",
    ],
    a: 3,
    why: "An access failure and a successful query with no matches are different outcomes and need different signals. The timeout comes back as a structured, retryable error; a new account's empty list stays a valid result the agent can report truthfully.",
    wrong: {
      B: { trap: 'over-engineered', text: "Over-corrects: the 9% of new customers with no orders would now be retried and escalated for a correct answer. Empty is a valid result, not a failure." },
      C: { trap: 'probabilistic', text: "Retrying on empty guesses at the cause from the outside, doubles calls for every genuine new account, and still reports a no-orders answer if the second call also times out." },
      A: { trap: 'symptom-fix', text: "A uniform message removes the false statement but also removes the distinction. The agent can no longer tell a customer with no orders that they have none, nor decide to retry an outage." },
    },
    cite: 'Exam guide §2.2; learning record 0016; notes/domain-2 §2.2',
  },

  // ───────────────────────── 2.3 — forced first, then follow-up turns (D08 + LR-0016 Q4) ─────────────────────────
  {
    id: 'R06', ts: '2.3', s: 'cs', bp: { rank: 3 },
    q: "Your billing agent has get_account_status, issue_credit and send_confirmation. issue_credit is only valid after get_account_status confirms the account is active, but with tool_choice set to auto, 7% of credit requests call issue_credit first using an account state the model assumed. Two of those credits last month went to closed accounts. How should you configure the requests?",
    o: [
      "Set tool_choice to any on the first request, which makes the model call a tool before writing any reply to the customer",
      "Make account_status a required parameter of issue_credit, which makes the model supply the status before any credit",
      "Force get_account_status on the first request, then let the model choose issue_credit and the rest in later turns",
      "Add a numbered rule to the system prompt: get_account_status first, then issue_credit, then send_confirmation",
    ],
    a: 2,
    why: "The prerequisite has to be guaranteed, and forced selection with {\"type\": \"tool\", \"name\": \"get_account_status\"} is the setting that guarantees which tool runs first. Once its result is in the conversation, later turns go back to auto and the model chooses issue_credit and send_confirmation with real data.",
    wrong: {
      A: { trap: 'wrong-problem', text: "any guarantees that some tool is called, not which one. issue_credit still satisfies it." },
      B: { trap: 'probabilistic', text: "A required parameter only forces a value to be filled. The model can fill it with the same assumed status it already guesses today." },
      D: { trap: 'probabilistic', text: "An ordering instruction under auto is the setup that already fails 7% of the time. A prompt asks; tool_choice enforces." },
    },
    cite: 'Exam guide §2.3; lesson 0010; learning record 0016; notes/domain-2 §2.3',
  },

  // ───────────────────────── 2.3 — any + no text before the call (LR-0021 lesson 10 Q3) ─────────────────────────
  {
    id: 'R07', ts: '2.3', s: 'de', bp: { rank: 4 },
    q: "Your extraction service has three schema tools: extract_invoice, extract_receipt and extract_statement, and the document type is not known in advance. You switched tool_choice from auto to any after 6% of auto responses came back as plain text and broke the parser. Reviewers also want a one-sentence reason for the chosen schema, but since the switch the 'explain your choice first' line in the prompt never produces any text. What should you change?",
    o: [
      "Keep tool_choice set to any and add a required reason field to all three schemas, filled in as part of the tool call itself",
      "Go back to auto and keep the explanation line, then add a parser check that resubmits any response that arrives without a tool call",
      "Keep any and move the explanation instruction into each tool's description, where the model reads it at the moment it picks a schema",
      "Send each document twice: once with auto to get the explanation as text, then once with any to get the structured extraction call",
    ],
    a: 0,
    why: "Under any (or a forced tool) the API makes the response begin with the tool call, so no text can come before it however the prompt is worded. Keeping any preserves the guarantee, and a reason field inside the schema carries the explanation inside the call.",
    wrong: {
      B: { trap: 'symptom-fix', text: "Gives up the guarantee that fixed the 6% failure and pays for resubmissions to recover it." },
      C: { trap: 'probabilistic', text: "Moving the instruction does not change the mechanism: under any no text precedes the tool call, wherever the request to explain is written." },
      D: { trap: 'over-engineered', text: "Doubles cost and latency, and the explanation comes from a separate call that may not match the schema the second call picks." },
    },
    cite: "Exam guide §2.3; lesson 0010 (no text before the call under any or a forced tool); learning record 0021",
  },

  // ───────────────────────── 2.3 — scoped cross-role tool ─────────────────────────
  {
    id: 'R08', ts: '2.3', s: 'ma', bp: { rank: 4 },
    q: "Your synthesis agent was given the full set of 12 web-research tools to check facts while drafting. It now runs broad searches mid-draft, and synthesis time has risen 40%. About 85% of its checks are single-fact confirmations against sources already collected; the rest need new research. How should you change its tools?",
    o: [
      "Keep all 12 tools and tell it in the system prompt to search only when a fact cannot be confirmed from collected sources",
      "Remove every web tool and send each fact check, simple or complex, back through the coordinator for a research subagent",
      "Give it one narrow verify_fact tool for the simple checks and route checks that need new research via the coordinator",
      "Keep all 12 tools but rate-limit it to 3 search calls per draft, after which further searches are rejected with an error",
    ],
    a: 2,
    why: "Scoped access: the synthesis agent gets only what its role needs, plus a narrow cross-role tool for its high-frequency need. verify_fact covers the 85% of simple checks without coordinator round trips, while complex research still goes through the coordinator to the research agents.",
    wrong: {
      A: { trap: 'probabilistic', text: "Out-of-role tools left in place keep getting misused; a prompt rule only asks the agent to resist them." },
      B: { trap: 'over-engineered', text: "Correct for the 15% that need research, but it sends the 85% of simple checks on a full coordinator round trip as well, adding latency." },
      D: { trap: 'symptom-fix', text: "Caps the damage without changing the tool set. The agent still holds 12 tools outside its specialization and spends its 3 calls on broad searches." },
    },
    cite: 'Exam guide §2.3; notes/domain-2 §2.3',
  },

  // ───────────────────────── 2.4 — env var expansion + verifying discovery (obj 28, 75%) ─────────────────────────
  {
    id: 'R09', ts: '2.4', s: 'dp', bp: { rank: 2 },
    q: "Your team's project .mcp.json, committed to the repo, configures the community Jira MCP server with its token written as ${JIRA_API_TOKEN}. Eleven engineers use its 9 tools daily. A new engineer cloned the repo yesterday and skipped the onboarding step that sets team environment variables, and Claude Code shows no Jira tools in their sessions. What should they do?",
    o: [
      "Set JIRA_API_TOKEN in their own environment, restart Claude Code, then confirm in /mcp that the Jira server and its tools appear",
      "Copy the Jira server entry into their own user-level ~/.claude.json with their token written in directly, then restart Claude Code",
      "Replace ${JIRA_API_TOKEN} in .mcp.json with a shared team token and commit it, which keeps everyone's setup consistent",
      "Expand the Jira tool descriptions in .mcp.json, which helps Claude Code discover and prefer the Jira tools over built-ins",
    ],
    a: 0,
    why: "The shared config is correct: project scope for team tooling, with ${JIRA_API_TOKEN} expanded from each engineer's environment. The one missing piece is that variable on the new machine. Set it, restart, and verify discovery in /mcp.",
    wrong: {
      B: { trap: 'symptom-fix', text: "Duplicates a shared team server into personal scope, where it will drift from the project config, to work around a missing environment variable." },
      C: { trap: 'wrong-problem', text: "Commits a secret to version control, which is exactly what environment variable expansion exists to prevent." },
      D: { trap: 'wrong-problem', text: "Descriptions affect which tool the model picks once tools are available. Here no Jira tools were discovered at all." },
    },
    cite: 'Exam guide §2.4; test objective 28; notes/domain-2 §2.4',
  },

  // ───────────────────────── 2.5 — Edit non-unique → Read + Write (D11 pattern) ─────────────────────────
  {
    id: 'R10', ts: '2.5', s: 'cc', bp: { rank: 1 },
    q: "Claude Code needs to change the expected status code in only the second of 5 mock-response blocks in a 400-line test fixture. The 5 blocks are byte-for-byte identical, including the lines above and below each one. Edit has now failed twice, reporting that its match text appears 5 times. What should Claude do next?",
    o: [
      "Read the whole fixture file, then Write the complete contents back with only the second block's status code changed",
      "Call Edit with replace_all set to true, then run the test suite and revert any of the other blocks that now fail",
      "Grep the fixture with line numbers to find the second block, then pass that line number to Edit as its target line",
      "Run sed through Bash to replace the status code pattern in the fixture file, then review the diff of the result",
    ],
    a: 0,
    why: "Edit needs a unique anchor, and none exists when every block and its surroundings are identical. The documented fallback is Read for the full content, then Write it back with exactly the one change.",
    wrong: {
      B: { trap: 'symptom-fix', text: "replace_all changes all 5 blocks, then depends on tests to notice and undo 4 unintended edits." },
      C: { trap: 'nonexistent-feature', text: "Edit matches on text, not on line numbers. A line number from Grep gives it nothing to anchor on." },
      D: { trap: 'symptom-fix', text: "A pattern substitution hits every matching block, the same over-reach as replace_all, just outside the editing tools." },
    },
    cite: 'Exam guide §2.5; notes/domain-2 §2.5',
  },

  // ───────────────────────── 2.5 — wrapper modules / incremental exploration (obj 13, 50%) ─────────────────────────
  {
    id: 'R11', ts: '2.5', s: 'cc', bp: { rank: 2 },
    q: "In a 4,200-file legacy codebase you need every call site of sendInvoice before changing its signature. A Grep for 'sendInvoice' found 6 callers, but the test suite later broke in 23 other places. Those callers import it through 2 wrapper modules that re-export it under different names. What approach finds all of them?",
    o: [
      "Read every file in both wrapper modules' directories up front, then build a full map of each import before searching",
      "Read the 2 wrappers to list every name sendInvoice is exported as, then Grep the codebase for each of those names",
      "Glob for every file whose name contains 'invoice', then Read each matching file to look for calls to the function",
      "Grep with a broad pattern like 'send.*Inv' that catches likely variants of the name across the whole codebase",
    ],
    a: 1,
    why: "Callers that use an alias never contain the original name. Identify every exported name first by reading the wrappers, then Grep for each name across the codebase, and Read only the hits needed to trace flows.",
    wrong: {
      A: { trap: 'over-engineered', text: "Bulk-reads whole directories into context before knowing what matters. The wrappers alone hold the alias list." },
      C: { trap: 'wrong-problem', text: "Glob matches file paths, not contents. Callers live in files with any name, and the aliases need not contain 'invoice'." },
      D: { trap: 'probabilistic', text: "Guesses at the alias spelling. It misses aliases that do not fit the pattern and floods results with unrelated matches." },
    },
    cite: 'Exam guide §2.5; test objective 13; notes/domain-2 §2.5',
  },
];

module.exports = { META, Q };
