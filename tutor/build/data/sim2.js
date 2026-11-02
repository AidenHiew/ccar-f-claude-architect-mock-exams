// tutor/build/data/sim2.js — Second representative full mock: 60 original questions in 4 scenario blocks of 15 (built 2026-10-22).
// Allocation = sim exactly (statements.js sim2 = { ...sim }); same SIM_BLOCKS matrix; all-new settings and stems.
// obj = score-report objectives each record is authored to test (attempt-1 score report, not public); [] = untagged.
// bp.weight / bp.scope / bp.trigger on the D3 configuration items, as in d23b. bp.rank = measured length rank of the key (1 longest).
// Facts only from reference/ccar-f-official-exam-guide.md, notes/ and lessons/. Single-answer only.
'use strict';

const META = {
  "key": "sim2",
  "title": "CCA-F Representative Mock 2",
  "eyebrow": "Full mock · 60 questions · 4 scenarios",
  "intro": "Sixty new exam-level questions in four scenario blocks of fifteen, shaped like the real exam: mixed domains inside each block, domain shares matching the published weights, and every objective from one candidate's score report tested at least once. None of these questions has appeared on an earlier paper. Every question has one correct answer. Flag questions to return to them before you submit. Labels stay hidden until grading. Sit it once, in exam mode, with the 120-minute timer.",
  "defaultMode": "exam",
  "timerDefault": true,
  "minutes": 120,
  "storageKey": "ccaf-sim2-representative",
  "blocks": [
    {
      "id": 1,
      "title": "Customer Support Resolution Agent",
      "intro": "You are building a customer support resolution agent on the Claude Agent SDK for a meal-kit subscription company with 400,000 subscribers. It handles missing and damaged boxes, refunds, billing disputes and subscription changes through MCP tools including get_customer, lookup_order, process_refund, update_subscription and escalate_to_human. The target is 80% first-contact resolution while still escalating the cases that need a person."
    },
    {
      "id": 2,
      "title": "Code Generation with Claude Code",
      "intro": "Your team of 15 engineers uses Claude Code on a veterinary clinic chain's practice-management platform: TypeScript NestJS services, a Vue front end and Terraform for the infrastructure, about 2,600 files in one repository. You own the setup: CLAUDE.md files, rules, skills and commands, hooks, and the Claude Code review job in CI."
    },
    {
      "id": 3,
      "title": "Developer Productivity with Claude",
      "intro": "You are building an internal developer productivity tool on the Claude Agent SDK for a regional bus operator's ticketing system: an 11-year-old .NET monolith of about 3,800 C# files. A coordinator delegates to subagents that explore code, trace dependencies and draft documentation, using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) and MCP servers."
    },
    {
      "id": 4,
      "title": "Structured Data Extraction",
      "intro": "You are building an extraction system for a property-management firm with 9,000 rental units. Claude extracts fields from leases, contractor invoices and insurance certificates using tool use and JSON schemas. Output feeds rent billing, maintenance payments and compliance checks, and a team of 4 reviewers checks part of it."
    }
  ]
};

const Q = [
  // ───────────── Block 1 · Customer Support Resolution Agent ─────────────
  {
    "id": "M01", "ts": "1.1", "s": "cs", "block": 1, "obj": [6], "bp": { "rank": 1 },
    "q": "The agent's loop stops after 6 iterations whatever the model returned. In 11% of chats about refunds across several boxes, the loop is cut off while the last response still has stop_reason \"tool_use\", and the customer gets no answer at all. A teammate proposes raising the cap to 12. What change makes the loop end at the right point?",
    "o": [
      "Raise the cap to 12 iterations and log a warning when a chat reaches it",
      "End the loop at the first response whose text reads like a final answer",
      "Run tools while stop_reason is \"tool_use\" and finish when it is \"end_turn\"",
      "Keep looping until a response has no text block, then return it"
    ],
    "a": 2,
    "why": "The loop's control signal is stop_reason: \"tool_use\" means run the requested tool and send the result back, \"end_turn\" means the model has finished. An arbitrary iteration cap as the main stopping rule is a named anti-pattern; it cuts off chats that still have work to do.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "A bigger cap only moves the cut-off point. Longer chats still end mid-task, and the loop still ignores the signal the API gives." },
      "B": { "trap": "probabilistic", "text": "Reading the text to decide when to stop is the natural-language-parsing anti-pattern; a response can hold text and a tool call together." },
      "D": { "trap": "wrong-problem", "text": "Text is not a completion signal: a final answer has text, so this loops on after \"end_turn\", and a tool call with no text ends the loop with the tool unrun." }
    },
    "cite": "Exam guide §1.1; notes/domain-1-agentic-architecture.md §1.1"
  },
  {
    "id": "M02", "ts": "1.1", "s": "cs", "block": 1, "obj": [6], "bp": { "rank": 2 },
    "q": "The first version of the agent hard-codes one sequence for every chat: get_customer, then lookup_order, then process_refund if the box is marked damaged. Customers who only want to skip next week's delivery still go through the refund check, and 18% of chats call a tool the request never needed. The agent has 7 tools and more are planned. Which design fits how an agentic loop is meant to work?",
    "o": [
      "Give the model the tools, let it pick each next call, and loop on stop_reason",
      "Add a branch to the sequence per request type, keyed on words in the message",
      "Add a classifier step that picks one of 5 fixed scripts for each new request",
      "Keep the sequence and let the model answer 'skip' for steps it thinks unneeded"
    ],
    "a": 0,
    "why": "In an agentic loop the model decides which tool to call next from the context, and the code loops on stop_reason. A pre-configured sequence or decision tree is the contrast the guide draws; it makes every chat pay for steps it does not need.",
    "wrong": {
      "B": { "trap": "symptom-fix", "text": "Keyword branches are a bigger decision tree. They break on phrasing they did not expect and grow with each new tool." },
      "C": { "trap": "over-engineered", "text": "Five fixed scripts are still pre-configured sequences, with a classifier added in front." },
      "D": { "trap": "symptom-fix", "text": "The order is still fixed in code; the model only gets a veto, and every chat still walks the whole script." }
    },
    "cite": "Exam guide §1.1; notes/domain-1-agentic-architecture.md §1.1"
  },
  {
    "id": "M03", "ts": "1.3", "s": "cs", "block": 1, "obj": [], "bp": { "rank": 4 },
    "q": "Billing disputes are meant to go to a billing subagent that has its own AgentDefinition, description and system prompt. In testing, the coordinator never spawns it: across 200 billing chats it answers from its own tools or says it cannot help, and no Task calls appear in the logs. The coordinator's allowedTools lists get_customer, lookup_order, process_refund and escalate_to_human. What is the fix?",
    "o": [
      "Expand the billing subagent's description with 3 sample billing disputes",
      "Add \"Task\" to the coordinator's allowedTools next to its 4 MCP tools",
      "Add a system-prompt rule telling the coordinator to delegate billing disputes",
      "Add \"Task\" to the tools listed in the billing subagent's AgentDefinition"
    ],
    "a": 1,
    "why": "Subagents are spawned through the Task tool, and a coordinator can only invoke them if its allowedTools includes \"Task\". With Task missing, no description or prompt rule can make delegation happen.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "A better description helps the coordinator choose a subagent, but it cannot call one without the Task tool." },
      "C": { "trap": "probabilistic", "text": "The coordinator cannot follow the rule: the tool that spawns subagents is not in its tool list." },
      "D": { "trap": "over-engineered", "text": "Wrong side: the coordinator is the one spawning, so Task must be in the coordinator's allowedTools, not the subagent's." }
    },
    "cite": "Exam guide §1.3; notes/domain-1-agentic-architecture.md §1.3"
  },
  {
    "id": "M04", "ts": "1.4", "s": "cs", "block": 1, "obj": [1], "bp": { "rank": 4 },
    "q": "Of 3,000 sessions closed last month, 7% ended with neither a recorded resolution nor an escalate_to_human call. Some hit max_tokens, some ended on \"end_turn\" after promising a follow-up, and some stopped when a tool threw an error the loop did not catch. The system prompt already says 'Resolve the issue or escalate before ending the chat.' Each of these sessions turned into a complaint about 2 days later. What should the team add?",
    "o": [
      "The same prompt line repeated at the end of the system prompt, in bold",
      "Code around the loop that escalates a session left unresolved on exit",
      "A close_case tool the model is told to call as the last step of a chat",
      "A nightly list of unresolved sessions for support leads to work through"
    ],
    "a": 1,
    "why": "The guarantee has to sit in the orchestration layer, outside the model: whatever ended the loop (max_tokens, end_turn, an uncaught tool error), code wrapped around it checks for a resolution or escalation and escalates if neither happened. The prompt line already exists and still misses 7%.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "The instruction is already there. Repeating it leaves the outcome to the model, and a tool error or max_tokens stop ends the loop whatever the prompt says." },
      "C": { "trap": "probabilistic", "text": "The model still has to remember the call, and a tool error or max_tokens cut-off ends the loop before it can make it." },
      "D": { "trap": "reactive-too-late", "text": "Customers have already been left without an answer for a day; the complaints arrive within 2 days." }
    },
    "cite": "Score-report objective 1; exam guide §1.4; notes/domain-1-agentic-architecture.md §1.4"
  },
  {
    "id": "M05", "ts": "1.4", "s": "cs", "block": 1, "obj": [2], "bp": { "rank": 2 },
    "q": "When the agent escalates a billing dispute, the human team receives the last 3 messages of the chat and nothing else. Human agents cannot open the full transcript, and on 40% of escalations they ask the customer again for account details and what has already been refunded. In one case a $64 partial refund the agent had approved was issued a second time. What should the escalation pass to the human?",
    "o": [
      "The last 10 messages in place of 3, with the refund messages marked",
      "A longer, friendlier summary paragraph written by the agent in prose",
      "Customer ID, issue, root cause, amounts refunded, recommended action",
      "A link the human can use to rerun the agent's tool calls for the case"
    ],
    "a": 2,
    "why": "Humans who cannot see the transcript need a structured handoff: customer details, root cause, what has been done (amounts refunded) and the recommended action. That preserves the context and authorization state the agent built up.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "More raw messages still leave the human to dig out the facts, and anything before message 10 is still lost." },
      "B": { "trap": "probabilistic", "text": "Free prose may drop the amounts and IDs the human needs; the fields should be structured." },
      "D": { "trap": "over-engineered", "text": "Rerunning tool calls makes the human rebuild the case, and could repeat side effects such as refunds." }
    },
    "cite": "Exam guide §1.4; score-report objective 2; notes/domain-1-agentic-architecture.md §1.4"
  },
  {
    "id": "M06", "ts": "1.4", "s": "cs", "block": 1, "obj": [5], "bp": { "rank": 1 },
    "q": "Policy says a subscription can be paused for more than 4 weeks only after get_customer confirms the account has no unpaid balance. The system prompt states this rule with 2 examples, yet audits find 3% of long pauses were applied to accounts in arrears. Each one costs about $90 in fees that are never collected. What change enforces the rule?",
    "o": [
      "Move the rule to the top of the system prompt and add 4 more arrears examples",
      "Add a PostToolUse hook that reverses a long pause if the balance is unpaid",
      "Have update_subscription add a warning to its result when a balance is unpaid",
      "Add a PreToolUse hook that blocks long pauses until a clear balance is confirmed"
    ],
    "a": 3,
    "why": "A business rule with money at stake needs deterministic enforcement. A hook that intercepts the update_subscription call can check that get_customer returned a clear balance and block the call otherwise. Prompt instructions keep a non-zero failure rate, which the 3% shows.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "The rule and examples are already in the prompt. More examples may lower the 3% but cannot make it zero." },
      "B": { "trap": "reactive-too-late", "text": "Right family, wrong event: PostToolUse runs after the pause is applied, so the account is paused, then unpaused, instead of being blocked." },
      "C": { "trap": "reactive-too-late", "text": "A warning in the result arrives after the tool ran, so the pause is already in place." }
    },
    "cite": "Exam guide §1.4, §1.5; score-report objective 5; notes/domain-1-agentic-architecture.md §1.4–1.5"
  },
  {
    "id": "M07", "ts": "1.5", "s": "cs", "block": 1, "obj": [], "bp": { "rank": 1 },
    "q": "lookup_order returns delivery dates as ISO 8601 strings, while the courier's MCP tool track_box returns Unix timestamps and numeric status codes such as 3 and 7. In 9% of 'where is my box?' chats, the agent misreads a code or compares the two dates wrongly and tells the customer the box is late. track_box belongs to the courier, takes only a box ID, and cannot be changed. What is the most reliable fix?",
    "o": [
      "A PostToolUse hook that turns track_box results into ISO dates and named statuses",
      "A table in the system prompt mapping each status code, plus rules for timestamps",
      "A PreToolUse hook that rewrites track_box calls to request ISO dates",
      "A request to the courier to return ISO dates and named statuses in its next API"
    ],
    "a": 0,
    "why": "A PostToolUse hook intercepts tool results before the model sees them, so it can normalize Unix timestamps and numeric codes into the same format lookup_order uses. The conversion then happens in code, every time.",
    "wrong": {
      "B": { "trap": "probabilistic", "text": "The model still has to do the conversion itself, which is the step it gets wrong 9% of the time." },
      "C": { "trap": "over-engineered", "text": "A PreToolUse hook changes the outgoing call, but track_box cannot be changed and has no option for ISO dates; the result is what needs converting." },
      "D": { "trap": "blame-shifting", "text": "The courier's tool cannot be changed, and waiting on their roadmap leaves the bug in place." }
    },
    "cite": "Exam guide §1.5; notes/domain-1-agentic-architecture.md §1.5"
  },
  {
    "id": "M08", "ts": "2.1", "s": "cs", "block": 1, "obj": [27], "bp": { "rank": 1 },
    "q": "The agent has two tools with one-line descriptions: lookup_order ('Gets order details') and lookup_subscription ('Gets subscription details'). Both accept a customer email or an 8-digit reference. In 21% of chats about a missing box, the agent calls lookup_subscription and tells the customer their plan is active. The team added 6 few-shot routing examples last week and the rate fell only from 23% to 21%. What should they change first?",
    "o": [
      "Add 6 more few-shot examples of missing-box chats sent to lookup_order",
      "Rewrite both descriptions: inputs, sample questions, when to use the other",
      "Rename lookup_subscription to get_plan_status and keep its one-line text",
      "Add a system-prompt line: 'Use lookup_order for anything about deliveries'"
    ],
    "a": 1,
    "why": "Tool descriptions are the main signal the model uses to choose a tool. One-line descriptions over identical inputs give it nothing to tell them apart. Expanding each with input formats, example questions and when to use the other tool fixes the cause; few-shot examples were already tried and barely moved the rate.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "Six examples moved the rate by 2 points. More examples add tokens without fixing the descriptions the model selects from." },
      "C": { "trap": "over-engineered", "text": "Renaming helps only alongside better descriptions; with the same one line, the model still has nothing to tell the tools apart." },
      "D": { "trap": "symptom-fix", "text": "A keyword-style prompt line works around the descriptions instead of fixing them, and can pull subscription questions that mention delivery to the wrong tool." }
    },
    "cite": "Exam guide §2.1 and sample question 2; score-report objective 27; notes/domain-2-tool-design-mcp.md §2.1"
  },
  {
    "id": "M09", "ts": "2.2", "s": "cs", "block": 1, "obj": [26], "bp": { "rank": 2 },
    "q": "process_refund returns {isError: true, message: 'Refund failed'} in three different situations: the payment provider timed out, the amount is more than the order total, or the order is older than the 60-day refund window. The agent retries every failure up to 3 times. Customers with 70-day-old orders sit through 3 rejected attempts before hearing anything useful. What should process_refund return instead?",
    "o": [
      "The same message, with the agent told to retry once rather than 3 times",
      "isError true with errorCategory 'transient' on all 3, for the agent to retry",
      "A different message per case, such as 'Refund failed: window expired'",
      "errorCategory, isRetryable and a customer-facing reason for each failure"
    ],
    "a": 3,
    "why": "Structured error metadata lets the agent recover correctly: a transient timeout is retryable, while an expired refund window is a business error with isRetryable false and a reason the agent can explain to the customer. A uniform message forces the agent to treat all three the same.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "One retry still wastes a call on a rejection that can never succeed, and may give up too soon on a real timeout." },
      "B": { "trap": "error-suppression", "text": "Structured, but wrong: labelling the expired window and the over-limit amount as transient tells the agent to retry rejections that can never succeed." },
      "C": { "trap": "probabilistic", "text": "Clearer text helps, but there is no isRetryable flag, so the agent still has to guess from wording whether a retry can work." }
    },
    "cite": "Exam guide §2.2; score-report objective 26; notes/domain-2-tool-design-mcp.md §2.2"
  },
  {
    "id": "M10", "ts": "2.3", "s": "cs", "block": 1, "obj": [29], "bp": { "rank": 4 },
    "q": "Each chat must start with get_customer, because later tools need the verified customer ID it returns. With tool_choice \"auto\", 6% of chats open with a text reply asking a question the customer record would have answered, and 2% call lookup_order first with a guessed ID. The team wants the first turn to fetch the customer record in all cases. Which configuration does this?",
    "o": [
      "Set tool_choice to \"any\" on the first turn of each chat, then \"auto\"",
      "Force get_customer with tool_choice on the first turn, then \"auto\"",
      "Keep \"auto\" and state in the system prompt that get_customer comes first",
      "Offer only get_customer until the model sends a text reply, then the rest"
    ],
    "a": 1,
    "why": "Forced tool selection, tool_choice {\"type\": \"tool\", \"name\": \"get_customer\"}, guarantees that specific tool runs first; later turns go back to \"auto\". That fixes both failures: no text-only opening and no lookup_order before the ID exists.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "\"any\" guarantees a tool call but lets the model pick which one, so the 2% that call lookup_order first remain." },
      "C": { "trap": "probabilistic", "text": "A prompt line still leaves the first call to the model's discretion under \"auto\"." },
      "D": { "trap": "wrong-problem", "text": "Waiting for a text reply makes the conversational opening the trigger, which is the failure the team wants gone." }
    },
    "cite": "Exam guide §2.3, §4.3; score-report objective 29; notes/domain-2-tool-design-mcp.md §2.3"
  },
  {
    "id": "M11", "ts": "4.2", "s": "cs", "block": 1, "obj": [], "bp": { "rank": 4 },
    "q": "The system prompt lists 9 rules for when a damaged box earns a full refund, a partial credit or a replacement. On mixed cases the agent applies them unevenly: in a review of 150 chats where one item was spoiled and the rest were fine, the same situation got all three outcomes. A 10th rule added last week made no difference. What should the team add?",
    "o": [
      "A severity score from 1 to 10 the agent assigns before choosing an outcome",
      "An 11th rule ranking the 3 outcomes for boxes with more than one problem",
      "3 worked mixed cases, each showing why one outcome beat the other two",
      "A refund_decision subagent that applies the 9 rules to each damaged box"
    ],
    "a": 2,
    "why": "When detailed instructions still produce inconsistent results, 2–4 targeted few-shot examples of the ambiguous case, each showing the reasoning for the chosen action over the alternatives, are the most effective fix. Another rule was already tried and made no difference.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "A self-assigned score is another judgement the model makes unevenly; it does not show what the right outcome looks like." },
      "B": { "trap": "symptom-fix", "text": "A 10th rule made no difference; an 11th is more of the same." },
      "D": { "trap": "over-engineered", "text": "A new subagent applies the same 9 rules with the same ambiguity, plus a handoff." }
    },
    "cite": "Exam guide §4.2; notes/domain-4-prompt-engineering.md §4.2"
  },
  {
    "id": "M12", "ts": "5.1", "s": "cs", "block": 1, "obj": [17], "bp": { "rank": 4 },
    "q": "For SMS support the team calls the Messages API directly. To save tokens, each request sends the system prompt, a one-line note 'Customer is asking about an order' and the newest SMS. In 25% of threads with 4 or more messages, the agent asks for the order number the customer gave 2 messages earlier. What fixes this?",
    "o": [
      "Send the earlier user and assistant turns with each new request",
      "Pass a session_id on each request for the API to recall earlier turns",
      "Ask customers to include their order number in each SMS they send",
      "Raise max_tokens on each request to let the model hold more of the thread"
    ],
    "a": 0,
    "why": "The Messages API is stateless: the model only knows what is in the request. Conversation state is kept by sending the prior turns with each new request, which is how the order number stays available.",
    "wrong": {
      "B": { "trap": "nonexistent-feature", "text": "The Messages API keeps no server-side memory of earlier requests; history has to be sent by the caller." },
      "C": { "trap": "blame-shifting", "text": "This pushes the system's memory problem onto the customer." },
      "D": { "trap": "wrong-problem", "text": "max_tokens limits the length of the reply; it adds nothing about earlier messages to the request." }
    },
    "cite": "Exam guide §5.1; score-report objective 17; notes/domain-5-context-reliability.md §5.1"
  },
  {
    "id": "M13", "ts": "5.2", "s": "cs", "block": 1, "obj": [18], "bp": { "rank": 2 },
    "q": "A customer writes: 'Third missing box this month. I want to speak to a person now, not a bot.' The agent can see the box was marked delivered and could issue a $45 credit in one tool call, which settles 85% of missing-box cases. Today the agent offers the credit first and escalates only if the customer asks a second time. What should it do here?",
    "o": [
      "Issue the $45 credit now, then offer a transfer if they still want one",
      "Ask one question about the missing box first, then escalate if they still insist",
      "Escalate now, passing the box history and the credit it could have given",
      "Score the customer's frustration and escalate only above a set threshold"
    ],
    "a": 2,
    "why": "An explicit request for a human is honoured immediately, without first attempting a resolution. Offering a fix and escalating on a second request is right for frustration alone, not for an explicit demand. The handoff carries the facts the human needs.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Resolving first is right when the customer is frustrated but has not asked for a person; here they asked outright." },
      "B": { "trap": "symptom-fix", "text": "Investigating before honouring the request is what the guide says not to do." },
      "D": { "trap": "probabilistic", "text": "Sentiment is an unreliable escalation proxy, and the customer has already said what they want." }
    },
    "cite": "Exam guide §5.2 and sample question 3; score-report objective 18; notes/domain-5-context-reliability.md §5.2"
  },
  {
    "id": "M14", "ts": "5.2", "s": "cs", "block": 1, "obj": [18], "bp": { "rank": 4 },
    "q": "Policy covers refunds for damaged and missing boxes. It says nothing about a box that arrived on the old delivery day after the customer changed the day in the app 30 minutes before the cutoff. The customer asks for a refund of the $72 box. The agent can refund up to $100 per order without approval. What should the agent do?",
    "o": [
      "Refund the $72, as the amount is within the agent's $100 limit",
      "Decline, as policy covers only damaged and missing boxes",
      "Offer a 50% credit as a middle ground between yes and no",
      "Escalate to a human, as policy does not cover this case"
    ],
    "a": 3,
    "why": "A policy gap is an escalation trigger: when policy is silent on the customer's specific request, the agent should not invent an answer either way. The refund limit says what the agent may spend, not what policy allows.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "The limit governs amount, not eligibility. Policy does not say this case qualifies." },
      "B": { "trap": "wrong-problem", "text": "Silence is not a rule against it; declining invents policy as much as refunding does." },
      "C": { "trap": "symptom-fix", "text": "A split-the-difference credit is still the agent making up policy for a case policy does not address." }
    },
    "cite": "Exam guide §5.2; notes/domain-5-context-reliability.md §5.2"
  },
  {
    "id": "M15", "ts": "5.3", "s": "cs", "block": 1, "obj": [], "bp": { "rank": 3 },
    "q": "Before the coordinator answers a cancellation request, a promotions subagent checks whether the customer qualifies for any of 4 retention offers. When the promotions database times out, the subagent returns 'no eligible offers', the same as a real empty result. In one week, 340 customers cancelled without seeing an offer they qualified for. What should the subagent return on a timeout?",
    "o": [
      "'No eligible offers', but only after retrying the database 5 times",
      "An exception that ends the chat with an apology to the customer",
      "A default 10% offer, used each time the database cannot be reached",
      "A timeout error with the query tried, partial results and options"
    ],
    "a": 3,
    "why": "The coordinator can only recover well if it can tell an access failure from a valid empty result. Structured error context (failure type, what was attempted, partial results, alternatives) lets it retry, try another route, or tell the customer an offer check is pending.",
    "wrong": {
      "A": { "trap": "error-suppression", "text": "After the retries, the failure is still reported as a real empty result, so the coordinator still cannot tell the two apart." },
      "B": { "trap": "over-engineered", "text": "Ending the whole chat on one failed lookup is the terminate-everything anti-pattern." },
      "C": { "trap": "error-suppression", "text": "This hides the failure behind a made-up answer the customer may not qualify for." }
    },
    "cite": "Exam guide §5.3; notes/domain-5-context-reliability.md §5.3"
  },

  // ───────────── Block 2 · Code Generation with Claude Code ─────────────
  {
    "id": "M16", "ts": "1.5", "s": "cc", "block": 2, "obj": [12], "bp": { "rank": 3, "weight": "heavy" },
    "q": "The project CLAUDE.md tells Claude to run the affected unit tests after editing any file in services/. In 40 sessions last week Claude skipped the tests in 13, and 4 of those changes broke the build in CI. Moving the line to the top of CLAUDE.md and putting it in bold changed nothing. What makes the tests run after each edit?",
    "o": [
      "A PostToolUse hook on Edit and Write that runs the affected unit tests",
      "A PreToolUse hook on Edit and Write that runs the unit tests first",
      "A rule in .claude/rules/ with paths: [\"services/**/*\"] repeating the line",
      "A pre-push git hook that runs the full test suite before code is pushed"
    ],
    "a": 0,
    "why": "A PostToolUse hook runs after every file edit whether or not the model remembers. CLAUDE.md is guidance the model may skip, as the 13 of 40 sessions show; the hook makes the test run independent of instruction-following.",
    "wrong": {
      "B": { "trap": "probabilistic", "text": "Right mechanism, wrong event: PreToolUse fires before the edit, so it tests the code as it was, not the change." },
      "C": { "trap": "probabilistic", "text": "A path rule loads the same instruction at a narrower time; it is still guidance, not enforcement." },
      "D": { "trap": "reactive-too-late", "text": "Tests run only at push, after a whole session of edits, not after each one." }
    },
    "cite": "Exam guide §1.5; score-report objective 12; notes/domain-3-claude-code-config.md §3.1"
  },
  {
    "id": "M17", "ts": "3.1", "s": "cc", "block": 2, "obj": [10], "bp": { "rank": 4, "weight": "heavy", "scope": "shared" },
    "q": "The root CLAUDE.md says 'Do not run terraform apply; only run terraform plan.' Twice in 2 months a session ran terraform apply against staging after a long debugging chat, and once it deleted a test database. The team wants the command blocked in Claude Code for all 15 engineers working in this repo. What should change?",
    "o": [
      "Repeat the line in a rule file with paths: [\"terraform/**/*\"]",
      "A PreToolUse hook in each engineer's ~/.claude/settings.json",
      "An allow rule for terraform plan in .claude/settings.json",
      "A deny rule for terraform apply in .claude/settings.json"
    ],
    "a": 3,
    "why": "A hard boundary belongs in settings permissions, not CLAUDE.md. CLAUDE.md is delivered as guidance and can be ignored; a permission deny rule is evaluated deterministically. The project's .claude/settings.json is committed, so it covers the whole team.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "A path rule is still CLAUDE.md-style guidance, and loads only when a terraform file is read." },
      "B": { "trap": "probabilistic", "text": "A hook would block it, but a user-level file is not shared: each of the 15 engineers has to install it, and new joiners start without it." },
      "C": { "trap": "probabilistic", "text": "Allowing plan says nothing about apply; apply is still possible whenever a developer approves it." }
    },
    "cite": "Exam guide §3.1; score-report objective 10; notes/domain-3-claude-code-config.md §3.1 (deny rules; exam traps table)"
  },
  {
    "id": "M18", "ts": "3.1", "s": "cc", "block": 2, "obj": [16], "bp": { "rank": 2, "weight": "light", "scope": "personal", "trigger": "prompt" },
    "q": "A developer is fixing one bug in the appointment-reminder service and wants Claude to read a 300-line error trace saved at tmp/reminder-trace.txt. The trace matters for this task only, and nobody will need it after the fix ships today. A teammate suggests adding it to the project CLAUDE.md so Claude cannot miss it. What should the developer do?",
    "o": [
      "Add an @tmp/reminder-trace.txt import line to the project CLAUDE.md",
      "Reference @tmp/reminder-trace.txt in the prompt for this session",
      "Paste the trace into CLAUDE.local.md until the fix has shipped",
      "Put the trace in a rule with paths: [\"services/reminders/**\"]"
    ],
    "a": 1,
    "why": "For a one-off, task-specific file, an @ reference in the prompt brings it into this session only. CLAUDE.md and rule files are for context that is reusable across sessions; putting a temporary trace there loads it for everyone, or for every later session, until someone removes it.",
    "wrong": {
      "A": { "trap": "over-engineered", "text": "An import in the project CLAUDE.md loads the trace into every teammate's sessions until someone deletes the line." },
      "C": { "trap": "over-engineered", "text": "CLAUDE.local.md loads in each of this developer's sessions in the project, not just the one that needs the trace." },
      "D": { "trap": "over-engineered", "text": "A committed rule loads the trace for anyone who touches the reminders service, long after the fix." }
    },
    "cite": "Exam guide §3.1; score-report objective 16; notes/domain-3-claude-code-config.md §3.1"
  },
  {
    "id": "M19", "ts": "3.2", "s": "cc", "block": 2, "obj": [7], "bp": { "rank": 4, "scope": "personal", "trigger": "demand" },
    "q": "The team shares a /release-notes skill in .claude/skills/ that writes notes in the format the clinics' support desk reads. One developer wants a version that writes shorter notes in their own layout for a weekly email they send. The other 14 engineers must keep getting the team format, and the developer still runs the team's /release-notes for the support desk each release, so they need both. Where should the developer create their version?",
    "o": [
      "Edit .claude/skills/release-notes/SKILL.md and add their layout as an option",
      "In ~/.claude/skills/ under a new name such as /my-release-notes",
      "In ~/.claude/skills/release-notes/, using the same name as the team's skill",
      "In CLAUDE.local.md, as a note to shorten notes when /release-notes runs"
    ],
    "a": 1,
    "why": "Personal variants of team skills go in ~/.claude/skills/ with a different name. That keeps the variant out of version control and leaves the shared /release-notes untouched for teammates.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Editing the committed skill changes it for all 15 engineers, which is what must not happen." },
      "C": { "trap": "symptom-fix", "text": "Under the same name the developer can no longer run both versions; the guide's practice is a personal variant with a different name." },
      "D": { "trap": "probabilistic", "text": "A side note only nudges the shared skill's output; it is not a variant the developer can invoke on its own." }
    },
    "cite": "Exam guide §3.2; score-report objective 7; notes/domain-3-claude-code-config.md §3.2"
  },
  {
    "id": "M20", "ts": "3.2", "s": "cc", "block": 2, "obj": [], "bp": { "rank": 3, "weight": "light", "trigger": "demand" },
    "q": "The team's /dep-audit skill scans all 38 package.json files and prints about 4,000 lines of dependency analysis before a 10-line summary. After running it, developers find Claude losing track of the task they were working on before the audit. Only the summary is needed in the session. What change to the skill fixes this?",
    "o": [
      "Add context: fork to the skill's SKILL.md frontmatter",
      "Add allowed-tools: Read to the skill's SKILL.md frontmatter",
      "Tell developers to run /compact after each audit",
      "Tell Claude in SKILL.md to set the scan output aside after use"
    ],
    "a": 0,
    "why": "context: fork runs the skill in an isolated sub-agent context. The verbose scan stays in the fork and only the result comes back, so the main conversation keeps its earlier task.",
    "wrong": {
      "B": { "trap": "wrong-problem", "text": "allowed-tools limits which tools the skill can use; the output still lands in the main session." },
      "C": { "trap": "reactive-too-late", "text": "Compacting after the fact summarizes away detail from the earlier task too; the output should never enter the session." },
      "D": { "trap": "probabilistic", "text": "The 4,000 lines are already in context; an instruction cannot remove them." }
    },
    "cite": "Exam guide §3.2; notes/domain-3-claude-code-config.md §3.2"
  },
  {
    "id": "M21", "ts": "3.3", "s": "cc", "block": 2, "obj": [11], "bp": { "rank": 1, "weight": "light", "scope": "shared", "trigger": "file" },
    "q": "Database migrations live in 12 service folders, each in a migrations folder inside its service, such as services/billing/migrations/. The team's 60 lines of migration conventions sit in the root CLAUDE.md, where they load into every session, front-end work included. Which mechanism loads the conventions only when Claude works on a migration file?",
    "o": [
      "A CLAUDE.md in services/ holding the 60 lines of conventions",
      "A rule with paths: [\"services/*/migrations/**\"] in its frontmatter",
      "A /migrations skill that developers invoke before editing",
      "An @import of migrations.md placed in the root CLAUDE.md"
    ],
    "a": 1,
    "why": "A .claude/rules/ file with a paths glob loads only when Claude reads a matching file. The glob reaches the migrations folders across all 12 services, and nothing loads for front-end work.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "A directory CLAUDE.md loads for any file under services/, not just migrations." },
      "C": { "trap": "probabilistic", "text": "A skill loads only when someone remembers to invoke it; the conventions should apply on their own." },
      "D": { "trap": "symptom-fix", "text": "An import from the root CLAUDE.md still loads the conventions into every session." }
    },
    "cite": "Exam guide §3.3; score-report objective 11; notes/domain-3-claude-code-config.md §3.3"
  },
  {
    "id": "M22", "ts": "3.3", "s": "cc", "block": 2, "obj": [11], "bp": { "rank": 4, "weight": "light", "trigger": "file" },
    "q": "To trim the root CLAUDE.md, a developer moved 80 lines of Vue component conventions into .claude/rules/vue.md with no frontmatter. The .vue files live in web/ and in 2 shared packages. A week later, tokens per session have not dropped, even in sessions that only touch Terraform. What explains this, and what is the fix?",
    "o": [
      "Rules load only after /memory runs; run it at the start of each session",
      "CLAUDE.md is cached between sessions; restart Claude Code after edits",
      "Rules apply to all files; move the 80 lines to a CLAUDE.md in web/",
      "No paths: means it loads at launch; add paths: [\"**/*.vue\"]"
    ],
    "a": 3,
    "why": "A rule file without paths: frontmatter loads at launch, like CLAUDE.md. Adding a paths glob makes it load only when a matching file is read, and **/*.vue reaches the Vue files in web/ and both shared packages.",
    "wrong": {
      "A": { "trap": "nonexistent-feature", "text": "/memory shows which memory files are loaded; it does not load them." },
      "B": { "trap": "wrong-problem", "text": "The rule loads because it has no paths field, not because of a cache." },
      "C": { "trap": "symptom-fix", "text": "A CLAUDE.md in web/ would miss the Vue files in the 2 shared packages; a glob follows them." }
    },
    "cite": "Exam guide §3.3; notes/2026-09-docs-delta.md §3.1 / 3.3 (rules without paths: load at launch); notes/domain-3-claude-code-config.md §3.3"
  },
  {
    "id": "M23", "ts": "3.4", "s": "cc", "block": 2, "obj": [9], "bp": { "rank": 4, "weight": "heavy" },
    "q": "The team must move appointment scheduling from a cron-based job runner to an event queue. Two queue products are under consideration with different infrastructure needs, the change touches about 50 files across 6 services, and the infrastructure lead must approve the approach before any code changes. A senior engineer suggests starting to code and seeing where it leads. How should the developer use Claude Code?",
    "o": [
      "Direct execution, one service at a time, merging each once it works",
      "Plan mode for the first service only, then direct execution for the rest",
      "Plan mode to explore the services and compare both queue options",
      "The Explore subagent to list the affected files, then direct execution"
    ],
    "a": 2,
    "why": "Plan mode suits changes with architectural decisions, several valid approaches and many files, and it produces a plan the infrastructure lead can review before anything is edited. Here all of that is known from the start.",
    "wrong": {
      "A": { "trap": "reactive-too-late", "text": "Choosing the queue mid-way risks rework across 6 services, and the lead's approval would come after the code." },
      "B": { "trap": "wrong-problem", "text": "The queue choice and its approval affect all 6 services; planning one service leaves the other 5 to be decided while coding." },
      "D": { "trap": "reactive-too-late", "text": "Explore isolates discovery output, but it does not compare the two queue products or give the lead a plan to approve." }
    },
    "cite": "Exam guide §3.4 and sample question 5; score-report objective 9; notes/domain-3-claude-code-config.md §3.4"
  },
  {
    "id": "M24", "ts": "3.4", "s": "cc", "block": 2, "obj": [9], "bp": { "rank": 2, "weight": "light" },
    "q": "An error report shows a TypeError in formatInvoiceTotal in billing/format.ts, line 48, when an invoice has no line items. The fix is a guard for an empty array in that one function, and an existing test file covers the function. A teammate suggests plan mode in case other callers are affected. Which approach fits?",
    "o": [
      "Direct execution: add the guard and a test for the empty case",
      "Plan mode to map each caller of formatInvoiceTotal first",
      "The Explore subagent on the billing service first, then plan mode",
      "Plan mode, with the plan sent to the team lead for approval"
    ],
    "a": 0,
    "why": "A single-function bug with a clear stack trace and an obvious fix is a well-scoped change; direct execution is the right mode. The guard only changes behaviour for empty invoices, which currently crash.",
    "wrong": {
      "B": { "trap": "over-engineered", "text": "Mapping callers is planning for a change with no architectural impact; the fix is local." },
      "C": { "trap": "over-engineered", "text": "Discovery tools suit large unknown areas, not one line in a known function." },
      "D": { "trap": "over-engineered", "text": "Stakeholder review fits architectural changes; this is a one-line guard." }
    },
    "cite": "Exam guide §3.4; score-report objective 9; notes/domain-3-claude-code-config.md §3.4"
  },
  {
    "id": "M25", "ts": "3.5", "s": "cc", "block": 2, "obj": [8], "bp": { "rank": 2 },
    "q": "A developer with no background in health records must build an export of each pet's vaccination history that clinics send to a national pet registry. Their first 2 attempts produced code that missed the registry's consent rules and its handling of partial records. Neither the developer nor Claude raised those questions before writing code. What should the developer do before the next attempt?",
    "o": [
      "Write a longer prompt listing each field in the registry's API docs",
      "Ask Claude to write the export again, this time in a single pass",
      "Ask Claude to write 50 tests based on the existing export code",
      "Have Claude interview them about requirements and edge cases first"
    ],
    "a": 3,
    "why": "The interview pattern has Claude ask the developer questions to surface considerations they had not anticipated, such as consent and partial records, before implementing in an unfamiliar domain. The misses came from questions nobody asked.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "Listing fields covers what the developer already knows; the gaps were rules they did not know to mention." },
      "B": { "trap": "wrong-problem", "text": "A third attempt with the same understanding produces the same gaps." },
      "C": { "trap": "wrong-problem", "text": "Tests derived from the existing code encode its gaps instead of finding them." }
    },
    "cite": "Exam guide §3.5; score-report objective 8; notes/domain-3-claude-code-config.md §3.5"
  },
  {
    "id": "M26", "ts": "3.5", "s": "cc", "block": 2, "obj": [8], "bp": { "rank": 2 },
    "q": "Claude's rewrite of the clinic-hours parser has 3 bugs found in review: overnight shifts past midnight are dropped, time zones are applied twice, and holidays shift the next day's hours. All 3 come from how the parser converts times to UTC, and fixing one changes the others. The developer has sent one bug per message, and after 4 rounds each fix breaks another. What should they do next?",
    "o": [
      "Keep to one bug per message, starting with the time-zone one",
      "All 3 bugs in one message, with an input and expected output each",
      "Ask Claude to review its own parser and list any further bugs",
      "Revert the rewrite and have Claude write the parser again from scratch"
    ],
    "a": 1,
    "why": "Interacting problems should be described together in one detailed message, and concrete input/expected-output pairs pin down each fix. Sequential fixes suit independent problems; these share one cause, which is why each fix breaks another.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "Four rounds already show that one-at-a-time fixes undo each other when the bugs interact." },
      "C": { "trap": "wrong-problem", "text": "The bugs are already known; the problem is how they are being fixed." },
      "D": { "trap": "over-engineered", "text": "Starting over discards working code, and the same interaction will recur without clear examples." }
    },
    "cite": "Exam guide §3.5; score-report objective 8; notes/domain-3-claude-code-config.md §3.5"
  },
  {
    "id": "M27", "ts": "3.6", "s": "cc", "block": 2, "obj": [], "bp": { "rank": 1, "scope": "shared", "trigger": "session" },
    "q": "A CI job runs claude -p to suggest unit tests for each pull request. Reviewers say most suggestions test trivial getters and build objects by hand instead of using the 14 shared test fixtures in test/fixtures/. The job's prompt holds only the diff, and the team's testing standards live in a wiki page. What change improves the suggestions most?",
    "o": [
      "Add 'write meaningful tests' to the job's prompt",
      "Put the standards and fixtures in the project CLAUDE.md",
      "Write the standards into CLAUDE.local.md in the repo",
      "Drop suggested tests under 5 lines after generation"
    ],
    "a": 1,
    "why": "CLAUDE.md is how CI-invoked Claude Code gets project context. Documenting what makes a test valuable and which fixtures exist there improves generation and cuts low-value output, and it loads in each CI run.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "A vague instruction does not tell Claude which tests matter or that the fixtures exist." },
      "C": { "trap": "wrong-problem", "text": "CLAUDE.local.md is personal and gitignored, so the CI checkout does not have it." },
      "D": { "trap": "reactive-too-late", "text": "Filtering by length removes some bad tests after the fact and keeps hand-built objects in longer ones." }
    },
    "cite": "Exam guide §3.6; notes/domain-3-claude-code-config.md §3.1, §3.6"
  },
  {
    "id": "M28", "ts": "3.6", "s": "cc", "block": 2, "obj": [], "bp": { "rank": 3 },
    "q": "The review job runs claude -p with --output-format json and posts findings as inline PR comments. A script reads the result field, which holds Claude's findings as prose, and pulls out file names and line numbers. About 1 review in 8 posts a comment on the wrong line or fails to post at all. What should the job add?",
    "o": [
      "--json-schema defining file, line, severity and comment fields",
      "--output-format stream-json, with each streamed event parsed in turn",
      "3 sample findings in the required layout added to the prompt",
      "A prompt asking for JSON output, with up to 3 retries on parse errors"
    ],
    "a": 0,
    "why": "--json-schema with --output-format json makes the CLI return structured findings that match a schema, ready for posting as inline comments. --output-format json alone wraps the result but leaves its content free-form; with a schema, the findings arrive in structured_output.",
    "wrong": {
      "B": { "trap": "wrong-problem", "text": "stream-json streams progress events; the findings inside are still prose without a schema." },
      "C": { "trap": "probabilistic", "text": "Examples make the layout more consistent but do not guarantee it; the script still parses prose." },
      "D": { "trap": "symptom-fix", "text": "Prompt-requested JSON can still be malformed; retries hide the failures and add runs." }
    },
    "cite": "Exam guide §3.6; notes/domain-3-claude-code-config.md §3.6"
  },
  {
    "id": "M29", "ts": "4.1", "s": "cc", "block": 2, "obj": [], "bp": { "rank": 1 },
    "q": "The CI review flags 'possible performance issues' on about 25 lines per pull request, and developers dismiss 80% of them. They have started ignoring the security findings too, though those are accurate 90% of the time. The prompt already says 'Only report performance issues you are confident about.' What should the team change?",
    "o": [
      "Pause the performance category and rewrite it with report and skip criteria",
      "Change the line to 'Only report performance issues you are 95% sure of'",
      "Add a confidence score to each finding and hide those scored under 0.8",
      "Add a second pass in which Claude re-checks each performance finding"
    ],
    "a": 0,
    "why": "Temporarily disabling a high false-positive category restores trust in the accurate ones, and the fix for the category is specific criteria for what to report and what to skip. Confidence-style instructions were already in the prompt and fail to improve precision.",
    "wrong": {
      "B": { "trap": "probabilistic", "text": "A stricter confidence wording is the same kind of instruction that is already failing." },
      "C": { "trap": "probabilistic", "text": "Confidence-based filtering is what the guide says not to rely on; the categories need explicit criteria." },
      "D": { "trap": "over-engineered", "text": "A second pass judges against the same vague standard, and trust keeps falling while it runs." }
    },
    "cite": "Exam guide §4.1; notes/domain-4-prompt-engineering.md §4.1"
  },
  {
    "id": "M30", "ts": "4.6", "s": "cc", "block": 2, "obj": [], "bp": { "rank": 2 },
    "q": "A developer has Claude write a refund-calculation module and then, in the same session, review it for bugs. Across 20 modules this month, the same-session reviews found 2 issues; a teammate's later review of the same code found 11. Adding 'review this critically, as if someone else wrote it' changed nothing. What should the developer do?",
    "o": [
      "Turn on extended thinking for the review step in the same session",
      "Review in a separate Claude instance with only the code and the spec",
      "Have the same session review twice and keep issues found both times",
      "Add a 25-item review checklist to CLAUDE.md for the session to apply each time"
    ],
    "a": 1,
    "why": "A model that wrote the code keeps its reasoning context and is less likely to question its own decisions. An independent instance without that context catches more than self-review instructions or extended thinking.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "The guide names extended thinking as less effective than an independent instance; the session still holds its own reasoning." },
      "C": { "trap": "symptom-fix", "text": "Two reviews from the same context share its blind spots, and requiring agreement drops findings." },
      "D": { "trap": "probabilistic", "text": "A checklist helps structure the review but does not remove the self-review bias." }
    },
    "cite": "Exam guide §4.6, §3.6; notes/domain-4-prompt-engineering.md §4.6"
  },

  // ───────────── Block 3 · Developer Productivity with Claude ─────────────
  {
    "id": "M31", "ts": "1.2", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 1 },
    "q": "The coordinator sends every request through 5 subagents in order: explorer, dependency tracer, test finder, doc writer and reviewer. For one-line questions such as 'which class reads the fare table?', a run takes 4 minutes and costs about 20 times a single agent call. About 70% of requests are questions like that. What should change?",
    "o": [
      "Run all 5 subagents in parallel instead of in sequence",
      "Add a flag users set to skip the doc writer and reviewer",
      "Replace the 5 subagents with 1 agent holding all their tools",
      "Have the coordinator pick only the subagents a request needs"
    ],
    "a": 3,
    "why": "The coordinator should analyse each request and dynamically choose which subagents to invoke, instead of always routing through the full pipeline. A one-line lookup needs the explorer, not five agents.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "Parallel runs cut time but still pay for 5 subagents on a question that needs 1." },
      "B": { "trap": "blame-shifting", "text": "This moves the routing decision onto users, and still runs the explorer, tracer and test finder each time." },
      "C": { "trap": "over-engineered", "text": "One agent with every tool degrades tool selection; the problem is routing, not the number of agents." }
    },
    "cite": "Exam guide §1.2; notes/domain-1-agentic-architecture.md §1.2"
  },
  {
    "id": "M32", "ts": "1.2", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 3 },
    "q": "For 'document the refund flow end to end', the doc writer's draft skips refunds issued at ticket machines, because the explorer was never asked about the machine code. The coordinator accepts the first draft it gets. Reviewers find a gap like this in 35% of end-to-end documents. What should the coordinator do?",
    "o": [
      "Check the draft for gaps, query the explorer again, rerun the writer",
      "Ask the doc writer to list any gaps at the end of the draft for human reviewers",
      "Tell the explorer to read every file under src/ before any drafting starts",
      "Run the doc writer twice and merge the 2 drafts into one document"
    ],
    "a": 0,
    "why": "An iterative refinement loop has the coordinator evaluate the output for gaps, re-delegate targeted queries (here, the ticket-machine code) and re-invoke the writer until coverage is enough.",
    "wrong": {
      "B": { "trap": "reactive-too-late", "text": "Listing gaps leaves them for people to fill; the coordinator can close them itself." },
      "C": { "trap": "over-engineered", "text": "Reading all 3,800 files floods context and costs far more than a targeted follow-up query." },
      "D": { "trap": "wrong-problem", "text": "Both drafts come from the same incomplete findings, so both miss the machine code." }
    },
    "cite": "Exam guide §1.2; notes/domain-1-agentic-architecture.md §1.2"
  },
  {
    "id": "M33", "ts": "1.2", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 1 },
    "q": "For 'find every place fares are calculated', the coordinator spawns 3 explorer subagents with the same prompt. Their reports overlap by about 80%, and together they still miss the night-fare code in the scheduling module. The monolith has 3 top-level modules: ticketing, scheduling and reporting. What should the coordinator do differently?",
    "o": [
      "Spawn 6 explorers with that same prompt to raise coverage",
      "Have a 4th subagent dedupe the 3 reports before it reads them",
      "Assign each explorer one module: ticketing, scheduling, reporting",
      "Let the explorers share a list of files the others have read"
    ],
    "a": 2,
    "why": "The coordinator should partition the scope across subagents, giving each a distinct area, which removes the duplication and makes sure every module is covered.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "More identical prompts produce more overlap, not coverage of the module they all skip." },
      "B": { "trap": "symptom-fix", "text": "Deduplication tidies the overlap but cannot add the night-fare code nobody found." },
      "D": { "trap": "over-engineered", "text": "Explorers coordinating among themselves bypasses the coordinator, which should do the partitioning." }
    },
    "cite": "Exam guide §1.2; notes/domain-1-agentic-architecture.md §1.2"
  },
  {
    "id": "M34", "ts": "1.3", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 3 },
    "q": "The coordinator's prompt to the explorer is 14 numbered steps: open Program.cs, then Startup.cs, then each controller, and so on. About 30% of modules use a newer folder layout without those files; there the explorer follows the steps anyway and returns empty sections. The team wants it to find the module's structure whatever the layout. How should the coordinator brief the explorer?",
    "o": [
      "Add steps for the newer layout, with a branch on the folder name",
      "Add a 15th step: 'If a file in a step is missing, skip that step'",
      "State the goal and what good findings look like, not the steps",
      "Check the layout first and send 1 of 2 different step lists"
    ],
    "a": 2,
    "why": "Coordinator prompts should specify the research goal and quality criteria rather than step-by-step procedure, which lets the subagent adapt to what it finds, such as a different layout.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "This handles today's 2 layouts and breaks on the next one." },
      "B": { "trap": "symptom-fix", "text": "Skipping missing files still returns empty sections; the explorer is still not looking for the structure." },
      "D": { "trap": "over-engineered", "text": "Two fixed procedures are still procedures, with the coordinator now doing the explorer's job." }
    },
    "cite": "Exam guide §1.3; notes/domain-1-agentic-architecture.md §1.3"
  },
  {
    "id": "M35", "ts": "1.6", "s": "dp", "block": 3, "obj": [4], "bp": { "rank": 1 },
    "q": "An engineer asks why some passengers are charged twice for a day pass. The coordinator runs a fixed 4-step plan: read the payment controller, read the pass service, read the database schema, write a summary. At step 2 the explorer finds the duplicates come from a retry in a payment-gateway adapter the plan never mentions, but the plan moves on to the schema. Which decomposition fits this task?",
    "o": [
      "A fixed plan of 8 steps that covers the gateway adapters too",
      "Adaptive: next subtasks come from each finding, such as the retry",
      "Run the 4 steps in parallel to get to the summary sooner",
      "A pass per file in the payments folder, then a summary pass"
    ],
    "a": 1,
    "why": "Open-ended investigation needs dynamic decomposition: subtasks are generated from what each step discovers. The retry finding should have produced the next subtask instead of the plan's fixed schema step.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "A longer fixed plan covers this bug's location and still ignores the next surprise." },
      "C": { "trap": "wrong-problem", "text": "Running fixed steps faster does not follow the finding." },
      "D": { "trap": "wrong-problem", "text": "Prompt chaining suits predictable reviews; this investigation's path is not known in advance." }
    },
    "cite": "Exam guide §1.6; score-report objective 4; notes/domain-1-agentic-architecture.md §1.6"
  },
  {
    "id": "M36", "ts": "1.6", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 1 },
    "q": "The tool reviews each pull request on 3 fixed aspects: security, data access and fare-rule correctness. Most PRs touch 6 to 10 files. One prompt covering all aspects across all files gives shallow notes on the later files and contradictory notes on identical code. Fare bugs often span files: a data-access change in one file alters fares computed in another. Which decomposition fits this review?",
    "o": [
      "Let the agent design its own review steps for each pull request",
      "One pass per aspect over all files, then a pass merging the notes",
      "A pass per file covering all 3 aspects, with no cross-file pass",
      "A pass per file for local issues, then a separate cross-file pass"
    ],
    "a": 3,
    "why": "For a predictable multi-aspect review, prompt chaining fits: analyse each file on its own, then run a separate integration pass for cross-file issues. That avoids the attention dilution causing shallow and contradictory notes.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Dynamic decomposition is for open-ended investigation; these aspects are fixed and known." },
      "B": { "trap": "wrong-problem", "text": "Chaining by aspect still spreads each pass across 6 to 10 files, which is the dilution causing shallow notes." },
      "C": { "trap": "error-suppression", "text": "Per-file passes fix the depth problem, but without an integration pass the cross-file fare bugs go unseen." }
    },
    "cite": "Exam guide §1.6, sample question 12; notes/domain-1-agentic-architecture.md §1.6"
  },
  {
    "id": "M37", "ts": "1.7", "s": "dp", "block": 3, "obj": [3], "bp": { "rank": 2 },
    "q": "Last week an engineer's named session, cap-audit, analysed 35 files of the fare-cap logic. Since then a refactor renamed or moved 30 of those 35 files and split 2 of them, so most file paths and tool results in that session are out of date. The engineer's written summary of the conclusions is still accurate. How should they continue?",
    "o": [
      "Resume cap-audit and tell it that the files have moved since then",
      "Resume cap-audit and carry on, as it re-reads files when it needs to",
      "New session with the written summary injected as starting context",
      "Fork cap-audit and continue in the fork, keeping the original"
    ],
    "a": 2,
    "why": "When most prior tool results are stale, starting fresh with an injected summary is more reliable than resuming. Resuming with targeted re-analysis suits sessions whose context is mostly still valid, which is not the case after 30 of 35 files moved.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "Naming changes works when a few files changed; here almost all the session's tool results point at old paths." },
      "B": { "trap": "probabilistic", "text": "The resumed session will reason from stale results and old paths it has no reason to doubt." },
      "D": { "trap": "wrong-problem", "text": "A fork copies the same stale history; forking is for exploring divergent approaches." }
    },
    "cite": "Exam guide §1.7; score-report objective 3; notes/domain-1-agentic-architecture.md §1.7"
  },
  {
    "id": "M38", "ts": "1.7", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 4 },
    "q": "Yesterday an engineer ran 3 sessions in the monolith's folder. The one that matters, named gateway-map, holds 2 hours of analysis of the payment gateways; the most recent one was a 5-minute question about a log file. Nothing in the gateway code has changed since. How should the engineer get back into the gateway analysis?",
    "o": [
      "claude --resume gateway-map",
      "claude --continue in that folder",
      "Start a session and re-run it",
      "claude --fork-session gateway-map"
    ],
    "a": 0,
    "why": "--resume with a session name continues that specific named session. --continue picks the most recent session in the folder, which here is the 5-minute log question.",
    "wrong": {
      "B": { "trap": "wrong-problem", "text": "--continue reopens the most recent session in the folder: the log-file question, not gateway-map." },
      "C": { "trap": "over-engineered", "text": "The analysis is still valid; redoing 2 hours of work gains nothing." },
      "D": { "trap": "wrong-problem", "text": "Forking makes a new branch for a divergent approach and needs --resume or --continue anyway; the engineer just wants to continue." }
    },
    "cite": "Exam guide §1.7; notes/2026-09-docs-delta.md §1.7 (--continue = most recent session in cwd; --fork-session with --continue/--resume); notes/domain-1-agentic-architecture.md §1.7"
  },
  {
    "id": "M39", "ts": "2.4", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 2 },
    "q": "The agent answers questions about the monolith's 140 database tables through an MCP server with a run_query tool. Before most answers it runs 5 to 9 exploratory queries just to find which tables and columns exist, adding about 40 seconds. The schema changes about once a month. What should the MCP server add?",
    "o": [
      "A list_tables tool for the agent to call at the start of each new session",
      "A copy of all 140 table definitions pasted into the system prompt",
      "An MCP prompt listing the 140 tables, for engineers to run",
      "The schema catalogue exposed as an MCP resource the agent can read"
    ],
    "a": 3,
    "why": "MCP resources expose content catalogues, such as database schemas, so the agent can see what data exists without exploratory tool calls.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "This replaces 5–9 exploratory calls with fewer exploratory calls; a resource is the mechanism for catalogues." },
      "B": { "trap": "over-engineered", "text": "140 definitions in each prompt cost tokens on every request and go stale with each monthly change." },
      "C": { "trap": "wrong-problem", "text": "MCP prompts are user-invoked templates; the agent cannot consult one on its own before answering." }
    },
    "cite": "Exam guide §2.4; notes/domain-2-tool-design-mcp.md §2.4"
  },
  {
    "id": "M40", "ts": "2.4", "s": "dp", "block": 3, "obj": [14, 28], "bp": { "rank": 2 },
    "q": "An engineer added the team's issue-tracker MCP server to the project .mcp.json, committed it, and wrote the token as ${TRACKER_TOKEN}. It works for them, but 2 of the 9 teammates report that its tools never show up in their sessions. Both have pulled the latest commit. What is the most likely cause and fix?",
    "o": [
      "Commit the token itself into .mcp.json in place of ${TRACKER_TOKEN}",
      "Move the server into each teammate's own ~/.claude.json file",
      "The 2 have no TRACKER_TOKEN set; they set it, then check /mcp",
      "List the server's tool names in CLAUDE.md for Claude to find"
    ],
    "a": 2,
    "why": "Environment variable expansion in .mcp.json reads each user's own environment, which keeps the secret out of git. Teammates without the variable set cannot authenticate; once they set it, /mcp shows whether the server and its tools are discovered.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Committing a secret to the repo is what environment variable expansion exists to avoid." },
      "B": { "trap": "wrong-problem", "text": "User scope is for personal servers; this is shared team tooling and belongs in .mcp.json." },
      "D": { "trap": "nonexistent-feature", "text": "Tools are discovered from connected servers, not from names written in CLAUDE.md." }
    },
    "cite": "Exam guide §2.4; score-report objectives 14, 28; notes/2026-09-docs-delta.md §2.4 (/mcp lists servers)"
  },
  {
    "id": "M41", "ts": "2.5", "s": "dp", "block": 3, "obj": [13], "bp": { "rank": 1 },
    "q": "The agent must change one connection string in appsettings.Production.json. The same block appears 4 times, each under a parent key naming its region about 30 lines above; the block and the lines just around it are identical. Only the eu-west block should change. Edit has failed 3 times with a non-unique match error. What should the agent do?",
    "o": [
      "Read the whole file, then Write it back with only that block changed",
      "Retry Edit with 3 more lines of surrounding context as the anchor",
      "Use Bash with sed to replace the connection string across the file",
      "Edit with replace_all set, to change the matching block in one call"
    ],
    "a": 0,
    "why": "When Edit cannot find unique anchor text, Read the full file and Write the corrected version. That changes only the eu-west block, which Edit cannot single out.",
    "wrong": {
      "B": { "trap": "symptom-fix", "text": "Three more lines are still inside the identical stretch; the only difference, the region key, is 30 lines away, so the match stays non-unique." },
      "C": { "trap": "wrong-problem", "text": "A global replace changes all 4 regions, not just eu-west." },
      "D": { "trap": "wrong-problem", "text": "Replacing every match changes all 4 regions, not just eu-west." }
    },
    "cite": "Exam guide §2.5; score-report objective 13; notes/domain-2-tool-design-mcp.md §2.5"
  },
  {
    "id": "M42", "ts": "2.5", "s": "dp", "block": 3, "obj": [13], "bp": { "rank": 4 },
    "q": "The agent must list every integration test file. By convention they end in IntegrationTests.cs and sit in 20 different project folders. It ran Grep for 'IntegrationTests' and got 900 matches, mostly using statements and references in other files. Which call answers the question directly?",
    "o": [
      "Grep for 'IntegrationTests', listing only matching file names",
      "Glob with the pattern **/*IntegrationTests.cs",
      "Read the solution file and each project's file list",
      "Glob with the pattern **/IntegrationTests/**/*.cs"
    ],
    "a": 1,
    "why": "Finding files by name pattern is Glob's job. **/*IntegrationTests.cs returns exactly the test files, wherever they sit; Grep searches file contents, which is why it returned references.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Listing file names still searches content: any file that mentions IntegrationTests, such as one with a using statement, is listed." },
      "D": { "trap": "over-engineered", "text": "Walking project files reads many files to answer a file-name question." },
      "C": { "trap": "symptom-fix", "text": "Right tool, wrong pattern: it matches files inside a folder named IntegrationTests, and the files sit in 20 project folders." }
    },
    "cite": "Exam guide §2.5; score-report objective 13; notes/domain-2-tool-design-mcp.md §2.5"
  },
  {
    "id": "M43", "ts": "2.5", "s": "dp", "block": 3, "obj": [13], "bp": { "rank": 3 },
    "q": "The team wants every caller of the legacy SmsGateway class. Grep for 'SmsGateway' finds only 6 uses, because a NotificationFacade module wraps the class and exposes it as SendText and SendAlert, which code calls in about 70 places. The agent reported the 6 as the full list. What approach finds every caller?",
    "o": [
      "Read each file in the Notifications folder to find callers",
      "Glob for **/*Sms*.cs and read the files that come back",
      "Report the 6 Grep results, noting the facade as a gap",
      "List what the facade exports, then Grep for each name"
    ],
    "a": 3,
    "why": "To trace usage across wrapper modules, first identify every name the wrapper exports, then search the codebase for each one. That reaches the 70 indirect callers that a search for the class name misses.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "The callers are elsewhere in the codebase; reading the wrapper's folder finds the wrapper, not its users." },
      "B": { "trap": "wrong-problem", "text": "File names do not show who calls SendText or SendAlert." },
      "C": { "trap": "error-suppression", "text": "Noting the gap without closing it leaves 70 callers out of an answer the agent can complete." }
    },
    "cite": "Exam guide §2.5; score-report objective 13; notes/domain-2-tool-design-mcp.md §2.5"
  },
  {
    "id": "M44", "ts": "5.4", "s": "dp", "block": 3, "obj": [15], "bp": { "rank": 1 },
    "q": "Mapping how the monolith prices concession fares will take about 4 sessions over 2 days, more than one context window can hold. By the end of the first session the agent had found the ConcessionRuleEngine and FareCapCalculator classes and 12 pricing rules. The engineer wants each later session to build on those findings without re-exploring. What should the agent do?",
    "o": [
      "Resume the same session each day with --resume and keep going",
      "Keep the findings in a scratchpad file each session reads first",
      "Restate each finding in its replies as the sessions go on",
      "Run /compact at the end of each session to fit more in the next"
    ],
    "a": 1,
    "why": "Scratchpad files persist key findings across context boundaries: each session records what it found and the next reads it, instead of relying on a context window that cannot hold the whole job.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "Resuming carries the same overfull context forward; the job is larger than one window." },
      "C": { "trap": "symptom-fix", "text": "Restated findings still live in a context that fills and degrades; they do not cross into a new session." },
      "D": { "trap": "symptom-fix", "text": "/compact shrinks one session's history and loses detail; it does not carry findings into the next session." }
    },
    "cite": "Exam guide §5.4; score-report objective 15; notes/domain-5-context-reliability.md §5.4"
  },
  {
    "id": "M45", "ts": "5.4", "s": "dp", "block": 3, "obj": [15], "bp": { "rank": 3 },
    "q": "To answer 'which modules write to the passengers table?', the main agent read 120 files itself and used about 85% of its context. Its follow-up answers got vaguer, and it began describing 'a typical repository class' instead of the classes it had read. It has already run /compact twice, and each time it lost the module list it had built. How should the next question be handled?",
    "o": [
      "Read only the first 50 lines of each file to save its context",
      "Run /compact before each new follow-up question it gets",
      "Spawn subagents to investigate and return short summaries",
      "Raise max_tokens on each request to fit more of the files in"
    ],
    "a": 2,
    "why": "Subagent delegation isolates verbose exploration: each subagent reads files in its own context and returns a summary, while the main agent keeps the high-level picture. That keeps the main context from filling with raw file contents.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "The write may be past line 50; a fixed cut-off reads less, not more selectively." },
      "B": { "trap": "symptom-fix", "text": "/compact was already tried twice and lost the module list each time." },
      "D": { "trap": "wrong-problem", "text": "max_tokens caps the reply length; it does not enlarge the context window." }
    },
    "cite": "Exam guide §5.4; score-report objective 15; notes/domain-5-context-reliability.md §5.4"
  },

  // ───────────── Block 4 · Structured Data Extraction ─────────────
  {
    "id": "M46", "ts": "2.1", "s": "de", "block": 4, "obj": [27], "bp": { "rank": 2 },
    "q": "All 3 document types go through one tool, extract_document, described as 'Extracts data from a document', with one schema that holds lease, invoice and insurance fields. In 14% of contractor invoices the output includes lease fields such as monthly_rent filled with invoice amounts. The team wants each type extracted against its own fields. What should they change?",
    "o": [
      "Add 3 few-shot examples of invoices with only invoice fields filled",
      "Split it into extract_lease, extract_invoice, extract_certificate tools",
      "Keep 1 tool and drop fields that do not fit the type after extraction",
      "Put a line naming the detected type at the top of each extraction prompt"
    ],
    "a": 1,
    "why": "Splitting a generic tool into purpose-specific tools, each with its own description and input/output contract, removes the overlap. An invoice tool has no monthly_rent field to fill.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "Examples make mixing less likely but leave lease fields available on every invoice." },
      "C": { "trap": "reactive-too-late", "text": "Dropping fields afterwards hides the misplaced values; the invoice amount is still in the wrong field." },
      "D": { "trap": "probabilistic", "text": "The model still fills one mixed schema; a line of text does not change which fields exist." }
    },
    "cite": "Exam guide §2.1; score-report objective 27; notes/domain-2-tool-design-mcp.md §2.1"
  },
  {
    "id": "M47", "ts": "2.2", "s": "de", "block": 4, "obj": [26], "bp": { "rank": 4 },
    "q": "An insurance-check subagent calls the insurer's verification API for each certificate. On a timeout it sends the error straight to the coordinator, which restarts the whole certificate from extraction. The API times out on about 4% of calls, and nearly all of them succeed on a second try. Each restart costs about 3 extra model calls. How should the errors be handled?",
    "o": [
      "Return 'verification unavailable' to the coordinator in each case",
      "Return each timeout to the coordinator as a structured, retryable error",
      "Raise the subagent's API timeout from 10 to 60 seconds for each call",
      "Retry timeouts in the subagent; pass on only ones it cannot fix"
    ],
    "a": 3,
    "why": "Transient failures should be recovered locally in the subagent. Only errors it cannot resolve go to the coordinator, together with what was attempted and any partial results. Here a second try nearly always works.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "A generic status hides that the error is transient and retryable, and still escalates each timeout." },
      "B": { "trap": "error-suppression", "text": "Structured errors are right for what reaches the coordinator, but a transient failure the subagent can fix itself should not reach it at all." },
      "C": { "trap": "symptom-fix", "text": "A longer timeout makes every slow call wait longer, and a timeout that still happens goes up to the coordinator as before." }
    },
    "cite": "Exam guide §2.2, §5.3; score-report objective 26; notes/domain-2-tool-design-mcp.md §2.2"
  },
  {
    "id": "M48", "ts": "2.3", "s": "de", "block": 4, "obj": [23, 29], "bp": { "rank": 2 },
    "q": "Uploads arrive as a lease, an invoice or a certificate, and the type is not known in advance. Each type has its own extraction tool. With tool_choice \"auto\", 4% of replies are prose such as 'This looks like a renewal letter', and the loader fails. Forcing extract_lease for a week stopped the prose but extracted 300 invoices as leases. What setting fits?",
    "o": [
      "Keep forcing extract_lease and route the failures to reviewers",
      "Keep \"auto\" and add 'Respond only with a tool call' to the system prompt",
      "tool_choice \"any\": a tool call is required, the model picks which",
      "Keep \"auto\" and have the loader retry any reply that is prose"
    ],
    "a": 2,
    "why": "tool_choice \"any\" guarantees the model calls a tool instead of replying in text, while letting it choose the right extraction tool for an unknown document type. Forcing one tool fixed the prose but broke the choice.",
    "wrong": {
      "A": { "trap": "reactive-too-late", "text": "Forcing one tool makes every invoice a lease; reviewers then clean up a failure the setting caused." },
      "B": { "trap": "probabilistic", "text": "Under \"auto\" the model may still reply in text; a prompt line does not guarantee a tool call." },
      "D": { "trap": "symptom-fix", "text": "Retries hide the prose replies at extra cost; the setting that allows them stays." }
    },
    "cite": "Exam guide §2.3, §4.3; score-report objectives 23, 29; notes/domain-4-prompt-engineering.md §4.3"
  },
  {
    "id": "M49", "ts": "4.1", "s": "de", "block": 4, "obj": [], "bp": { "rank": 1 },
    "q": "After extracting each contractor invoice, the model flags ones it finds 'suspicious' for an accounts-payable check. It flags 30% of invoices; staff find a real problem in about 1 flag in 20 and have started approving flags without reading them. The prompt says 'Be conservative and flag only invoices you are sure about.' What should the team change?",
    "o": [
      "Flag on named criteria: rate above contract, reused number, no work order",
      "Change the line to 'Flag only invoices you are more than 90% sure about'",
      "Have the model give a suspicion score from 1 to 10 and flag 8 or above",
      "Add a second model pass that re-checks each flag before staff see it"
    ],
    "a": 0,
    "why": "Explicit categorical criteria (what to flag and what to skip) improve precision, where general instructions like 'be conservative' or 'only when sure' do not. The current wording is already that kind of instruction.",
    "wrong": {
      "B": { "trap": "probabilistic", "text": "A stricter 'sure' threshold is the same vague instruction that produces 19 false flags in 20." },
      "C": { "trap": "probabilistic", "text": "A self-reported score is confidence-based filtering, which the guide says fails to improve precision." },
      "D": { "trap": "over-engineered", "text": "A second pass judges against the same undefined idea of 'suspicious'." }
    },
    "cite": "Exam guide §4.1; notes/domain-4-prompt-engineering.md §4.1"
  },
  {
    "id": "M50", "ts": "4.2", "s": "de", "block": 4, "obj": [24], "bp": { "rank": 1 },
    "q": "Leases come from 40 landlord templates. The break_clause_date field comes back null on 19% of leases where a reviewer later finds the clause. Most of these phrase it as 'either party may end the tenancy after the first 12 months' rather than giving a date. The schema and an instruction to work out dates from relative terms are already in place. What should the team add?",
    "o": [
      "Make break_clause_date required so a value has to be given",
      "Retry each extraction that returns a null break_clause_date",
      "A longer instruction listing 10 phrasings of break clauses",
      "3 examples of break clauses in varied forms, each extracted"
    ],
    "a": 3,
    "why": "Few-shot examples showing correct extraction from documents with varied formats address empty or null extraction of fields that are present. The instruction already exists; examples show what a relative break clause looks like and how it maps to the field.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Making it required pushes the model to invent dates on leases that truly have no break clause." },
      "B": { "trap": "symptom-fix", "text": "A plain retry repeats the same reading; nothing tells the model what it missed." },
      "C": { "trap": "probabilistic", "text": "More prose instructions were already the approach; templates will keep producing phrasings not on the list." }
    },
    "cite": "Exam guide §4.2; score-report objective 24; notes/domain-4-prompt-engineering.md §4.2"
  },
  {
    "id": "M51", "ts": "4.3", "s": "de", "block": 4, "obj": [21], "bp": { "rank": 3 },
    "q": "The invoice extractor asks for 'JSON only' in the prompt and parses the reply. About 3% of 20,000 monthly replies fail to parse: a trailing comment, a missing bracket, or a sentence before the JSON. The team retries failures, which costs about 600 extra calls a month. What change removes the parse failures?",
    "o": [
      "Prefill the assistant turn with an opening brace",
      "An extraction tool with the schema as its input",
      "3 examples of valid JSON output in the prompt",
      "Cut text outside the outer braces before parsing"
    ],
    "a": 1,
    "why": "Tool use with a JSON schema is the most reliable way to get schema-compliant structured output; it eliminates JSON syntax errors. The extraction comes back as the tool call's input.",
    "wrong": {
      "A": { "trap": "nonexistent-feature", "text": "Prefill is not supported on current Claude models, and would not stop a missing bracket anyway." },
      "C": { "trap": "probabilistic", "text": "Examples make valid JSON more likely; they cannot guarantee it." },
      "D": { "trap": "symptom-fix", "text": "Stripping text fixes one failure type; trailing comments and missing brackets still break the parse." }
    },
    "cite": "Exam guide §4.3; score-report objective 21; notes/2026-09-docs-delta.md §2.3 (prefill not supported on Claude 4.6+)"
  },
  {
    "id": "M52", "ts": "4.3", "s": "de", "block": 4, "obj": [22], "bp": { "rank": 2 },
    "q": "The insurance-certificate schema marks policy_end_date as required. About 10% of certificates are for rolling policies with no end date, and on those the model enters a date such as the issue date plus 1 year. Compliance has recorded 120 contractors as covered until dates no policy states. What should the team change?",
    "o": [
      "Make policy_end_date optional and nullable in the schema",
      "Add 'do not invent dates' to the extraction prompt",
      "Check that end dates fall after issue dates, and retry if not",
      "Default policy_end_date to the issue date plus 1 year"
    ],
    "a": 0,
    "why": "A required field forces the model to put something there, so it fabricates. Making the field optional and nullable lets it return null when the document has no end date.",
    "wrong": {
      "B": { "trap": "probabilistic", "text": "The schema still demands a value; an instruction competes with a required field." },
      "C": { "trap": "wrong-problem", "text": "An invented date of issue plus 1 year passes the check, so validation catches nothing." },
      "D": { "trap": "error-suppression", "text": "This writes the fabrication into code; compliance still sees cover no policy states." }
    },
    "cite": "Exam guide §4.3; score-report objective 22; notes/domain-4-prompt-engineering.md §4.3"
  },
  {
    "id": "M53", "ts": "4.3", "s": "de", "block": 4, "obj": [22], "bp": { "rank": 2 },
    "q": "The invoice schema has work_category, an enum of 6 values: plumbing, electrical, roofing, HVAC, landscaping and cleaning. Contractors now also bill for pest control and lift servicing, and the model puts those under 'cleaning' or 'electrical'. 7% of invoices are paid from the wrong maintenance budget as a result. New kinds of work appear every few months and cannot be predicted, and finance wants anything outside the list held for a person to assign a budget. What should the team change in the schema?",
    "o": [
      "Make work_category a free-text field instead of an enum",
      "Add 2 new values now, and new ones each quarter after that",
      "Add 'other' plus a work_category_detail free-text field",
      "Tell the model to pick the closest of the 6 categories"
    ],
    "a": 2,
    "why": "An 'other' value with a detail string handles categories the enum does not list, without forcing a wrong value or losing structure. The budget system can route 'other' items for a person to assign.",
    "wrong": {
      "A": { "trap": "over-engineered", "text": "Free text loses the fixed categories the budget system relies on." },
      "B": { "trap": "symptom-fix", "text": "Unpredictable new work types are miscoded until each update ships, and nothing is held for a person as finance asked." },
      "D": { "trap": "wrong-problem", "text": "Picking the closest category is what the model already does, and it is the cause of the 7%." }
    },
    "cite": "Exam guide §4.3; score-report objective 22; notes/domain-4-prompt-engineering.md §4.3"
  },
  {
    "id": "M54", "ts": "4.4", "s": "de", "block": 4, "obj": [25], "bp": { "rank": 4 },
    "q": "The extractor adds compliance warnings such as 'possible missing signature' to some certificates. Staff dismiss 45% of the warnings as wrong. Each warning is a single sentence, so after 2 months nobody can say which document features trigger the warnings that get dismissed, and prompt changes are guesses. What should the team add?",
    "o": [
      "A confidence score on each warning, hiding those under 0.7",
      "A required free-text reason from staff on each dismissal",
      "Each dismissed warning added to the prompt as an example",
      "A detected_pattern field on each warning, for analysis"
    ],
    "a": 3,
    "why": "Recording which pattern triggered each finding (a detected_pattern field) lets the team analyse dismissals systematically and see which patterns produce false positives, then fix the prompt or examples for those.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "Confidence filtering hides warnings without showing which document features cause the false ones, so prompt fixes stay guesses." },
      "B": { "trap": "symptom-fix", "text": "More free text from staff is more unstructured notes, not data that can be grouped." },
      "C": { "trap": "over-engineered", "text": "Hundreds of examples bloat the prompt without showing which pattern is the problem." }
    },
    "cite": "Exam guide §4.4; score-report objective 25; notes/domain-4-prompt-engineering.md §4.4"
  },
  {
    "id": "M55", "ts": "4.4", "s": "de", "block": 4, "obj": [], "bp": { "rank": 2 },
    "q": "Validation checks that each invoice's line items add up to the stated total. Failures are retried with the document, the failed extraction and the specific mismatch, and retries fix 85% of them. The rest are invoices that say 'see attached schedule': the line items are on a separate schedule that was not uploaded, and those fail every retry. What should happen to them?",
    "o": [
      "Make line_items optional and accept the extraction as complete",
      "Stop retrying, and route them to a person to obtain the schedule",
      "Retry once with a note that the items may be on a separate schedule",
      "Keep the stated total and add a line item that makes it match"
    ],
    "a": 1,
    "why": "Retries work for format or structural errors but not when the information is absent from the document. The schedule was never provided, so no retry can recover it; the case needs a person to obtain it.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "Accepting it skips the check without the line items ever being seen, so an unverified total gets paid." },
      "C": { "trap": "probabilistic", "text": "The note is accurate, but the schedule is still not in the input; no retry can extract what was never provided." },
      "D": { "trap": "error-suppression", "text": "Inventing a balancing line item hides the mismatch and pays an amount nobody has checked." }
    },
    "cite": "Exam guide §4.4; notes/domain-4-prompt-engineering.md §4.4"
  },
  {
    "id": "M56", "ts": "4.5", "s": "de", "block": 4, "obj": [20], "bp": { "rank": 3 },
    "q": "Two workloads use the extractor. At move-in, a leasing agent uploads a signed lease and the tenant waits for their keys until the rent and deposit fields are confirmed, usually 2 minutes. Separately, 30,000 archived invoices are re-extracted for an audit due in 2 weeks. The finance lead wants both on the Message Batches API for its 50% saving. What should the team do?",
    "o": [
      "Batch the archive only; keep move-in leases on the synchronous API",
      "Batch both, sending each move-in lease at once in its own small batch",
      "Keep both synchronous, with the archive run overnight in quiet hours",
      "Batch the move-in leases only, as each is a single short request"
    ],
    "a": 0,
    "why": "The Batches API has up to a 24-hour window and no latency guarantee, which suits the latency-tolerant archive job and not a workflow where a tenant is waiting. Each workload gets the mode that fits its latency need.",
    "wrong": {
      "B": { "trap": "probabilistic", "text": "A small batch has the same lack of a latency guarantee as a large one; the tenant could still wait hours." },
      "C": { "trap": "wrong-problem", "text": "Running overnight does not earn the batch discount; the archive is latency-tolerant and is exactly what batching suits." },
      "D": { "trap": "over-engineered", "text": "This is reversed: the short request is the one someone is waiting on, and the archive is the one that can wait." }
    },
    "cite": "Exam guide §4.5 and sample question 11; score-report objective 20; notes/domain-4-prompt-engineering.md §4.5"
  },
  {
    "id": "M57", "ts": "4.5", "s": "de", "block": 4, "obj": [], "bp": { "rank": 4 },
    "q": "Insurance certificates arrive all day, and each must be extracted within 30 hours of upload. The team wants to use the Message Batches API, whose processing can take up to 24 hours. Certificates are held until the next submission and then sent as one batch. Which submission schedule meets the 30-hour limit?",
    "o": [
      "Once a day, at midnight",
      "Every 12 hours",
      "Every 4 hours",
      "Whenever 1,000 have arrived"
    ],
    "a": 2,
    "why": "A certificate can wait up to one full interval before submission and then up to 24 hours in processing. Every 4 hours gives at most 4 + 24 = 28 hours, inside 30. Every 12 hours gives up to 36 and once a day up to 48.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "A certificate uploaded just after midnight waits 24 hours, then up to 24 more: 48 hours." },
      "B": { "trap": "wrong-problem", "text": "12 + 24 = 36 hours, past the 30-hour limit." },
      "D": { "trap": "wrong-problem", "text": "A count-based trigger has no time bound; on a slow day certificates could wait well past 30 hours." }
    },
    "cite": "Exam guide §4.5; notes/domain-4-prompt-engineering.md §4.5"
  },
  {
    "id": "M58", "ts": "5.5", "s": "de", "block": 4, "obj": [19], "bp": { "rank": 1 },
    "q": "High-confidence extractions (score 0.90 or above), 70% of volume, skip review; a one-off check in March measured them at 98% accurate. Since then 3 new landlord templates have appeared, and nobody measures the skip-review stream. The 4 reviewers have time for about 200 extra checks a week. How should they spend it?",
    "o": [
      "The 200 lowest-scoring items in the high-confidence group",
      "Review any field scored under 0.95, up from the 0.90 bar",
      "A repeat of the March check once each year from now on",
      "A stratified random sample of high-confidence items, weekly"
    ],
    "a": 3,
    "why": "Stratified random sampling of high-confidence extractions gives an ongoing error rate across document types and templates, and catches new error patterns such as those from the 3 new templates.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "Items just above the threshold are not representative, so the stream's error rate stays unmeasured." },
      "B": { "trap": "wrong-problem", "text": "Raising the bar shifts which items get reviewed but still measures nothing about the items that skip review." },
      "C": { "trap": "reactive-too-late", "text": "A yearly check leaves errors from new templates unseen for months." }
    },
    "cite": "Exam guide §5.5; score-report objective 19; notes/domain-5-context-reliability.md §5.5"
  },
  {
    "id": "M59", "ts": "5.5", "s": "de", "block": 4, "obj": [19], "bp": { "rank": 1 },
    "q": "Overall accuracy is 97% across 50,000 extractions, and the team proposes removing review for any field with a confidence score of 0.9 or more. Broken down, contractor invoices are 99% accurate, but the break-clause field on leases is 81% accurate, and leases are 12% of volume. What should the team do before reducing review?",
    "o": [
      "Remove review at 0.9 for all fields, as the 97% overall supports",
      "Check accuracy by type and field, and keep review for lease clauses",
      "Raise the threshold to 0.95 for all fields and then remove review",
      "Keep reviewing a random 5% of all extractions across the board"
    ],
    "a": 1,
    "why": "Aggregate accuracy can hide weak segments. Accuracy should be checked by document type and field before automating; segments that meet the bar can skip review, and weak ones such as the lease break-clause field keep it.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "The 97% average hides a field that is wrong almost 1 time in 5." },
      "C": { "trap": "symptom-fix", "text": "One higher threshold for all fields still has not checked whether scores mean the same thing for each field." },
      "D": { "trap": "symptom-fix", "text": "Uniform random sampling spreads review thinly instead of on the weak segment." }
    },
    "cite": "Exam guide §5.5; score-report objective 19; notes/domain-5-context-reliability.md §5.5"
  },
  {
    "id": "M60", "ts": "5.6", "s": "de", "block": 4, "obj": [], "bp": { "rank": 1 },
    "q": "A compliance summary merges extractions from a contractor's insurance certificate and the insurer's confirmation letter. The certificate, dated March, states liability cover of $2,000,000; the letter, dated June, states $1,000,000. Compliance rules say a person decides which figure applies when sources disagree. The summary step currently keeps whichever value it read last. What should it do?",
    "o": [
      "Keep the June letter's figure, the more recent of the two",
      "Keep the larger of the 2 figures and drop the other one",
      "Report both figures with source and date, marked as a conflict",
      "Keep the certificate's figure, supplied by the contractor"
    ],
    "a": 2,
    "why": "Conflicting values from credible sources should be kept and annotated with their sources, not resolved by picking one. Including the dates lets the reviewer see whether the difference is a change over time or a real contradiction, and the rules leave that decision to a person.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "The later date may explain the difference, but the rules leave the choice to a person; the summary should not make it." },
      "B": { "trap": "error-suppression", "text": "Choosing the larger figure hides the conflict and may overstate cover." },
      "D": { "trap": "wrong-problem", "text": "Preferring one source by who supplied it is another arbitrary pick that hides the conflict." }
    },
    "cite": "Exam guide §5.6; notes/domain-5-context-reliability.md §5.6"
  }
];

module.exports = { META, Q };
