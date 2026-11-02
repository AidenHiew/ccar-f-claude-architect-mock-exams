// tutor/build/data/sim.js — Representative full mock: 60 original questions in 4 scenario blocks of 15 (built 2026-10-19).
// Scenarios: the four the 29 score-report objectives map onto (inferred). Domain shares = blueprint weights × 60.
// obj = score-report objectives each record is authored to test (attempt-1 score report, not public); [] = untagged.
// Tags are judgements, not the report's inferred Row column: S06 (1.4 prerequisite gate) is tagged objective 5 (hook-enforced business rules).
// Facts only from reference/ccar-f-official-exam-guide.md, notes/ and lessons/. bp.rank = length rank of the key (1 longest).
// Single-answer only (2026-10-19).
'use strict';

const META = {
  "key": "sim",
  "title": "CCA-F Representative Mock",
  "eyebrow": "Full mock · 60 questions · 4 scenarios",
  "intro": "Sixty exam-level questions in four scenario blocks of fifteen, shaped like the real exam: mixed domains inside each block, domain shares matching the published weights, and every objective from one candidate's score report tested at least once. Every question has one correct answer. Flag questions to return to them before you submit. Labels stay hidden until grading. Sit it once, in exam mode, with the 120-minute timer.",
  "defaultMode": "exam",
  "timerDefault": true,
  "minutes": 120,
  "storageKey": "ccaf-sim-representative",
  "blocks": [
    {
      "id": 1,
      "title": "Customer Support Resolution Agent",
      "intro": "You are building a customer support resolution agent on the Claude Agent SDK for an e-bike retailer. It handles warranty claims, returns, billing problems and account changes through MCP tools including get_customer, lookup_order, process_refund and escalate_to_human. The target is 80% first-contact resolution while still escalating the cases that need a person."
    },
    {
      "id": 2,
      "title": "Code Generation with Claude Code",
      "intro": "Your team uses Claude Code to build and maintain a fleet-routing platform: Go services plus a React dispatcher dashboard in one repository. You own the setup: CLAUDE.md files, rules, skills and commands, hooks, and the Claude Code review job in CI."
    },
    {
      "id": 3,
      "title": "Developer Productivity with Claude",
      "intro": "You are building an internal developer productivity tool on the Claude Agent SDK for a 12-year-old Rails monolith that schedules clinic appointments. A coordinator delegates to subagents that explore code, trace dependencies and write documentation, using the built-in tools and MCP servers."
    },
    {
      "id": 4,
      "title": "Structured Data Extraction",
      "intro": "You are building an extraction system for a chemical distributor. Claude extracts fields from certificates of analysis, bills of lading and utility bills using tool use and JSON schemas. Output feeds inventory, logistics and finance systems, and a small team of reviewers checks part of it."
    }
  ]
};

const Q = [
  {
    "id": "S01",
    "ts": "1.1",
    "s": "cs",
    "block": 1,
    "obj": [
      6
    ],
    "bp": {
      "rank": 3
    },
    "q": "The support agent for an e-bike retailer runs a loop that exits as soon as a response contains a text block. In 14% of sessions the model replies with 'Let me pull up that battery warranty for you' plus a tool_use block for lookup_order in the same response. Those sessions end with the customer seeing only the promise. The team's first idea is a prompt line telling the model not to narrate before tool calls. What should change?",
    "o": [
      "Keep looping while stop_reason is \"tool_use\", and exit only when it is \"end_turn\"",
      "Add a system-prompt line forbidding narration before tool calls, with two examples of it",
      "Exit only when the text block has no future-tense phrases such as 'let me' or 'I will check'",
      "Keep the text-block exit but require 3 loop iterations before a session can end"
    ],
    "a": 0,
    "why": "stop_reason is the loop's control signal: \"tool_use\" means execute the tool and send the result back, \"end_turn\" means finish. Checking for assistant text as a completion indicator is a listed anti-pattern, because a response can carry text and a tool call together.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Prompt compliance is not guaranteed, and the bug is in the exit test: a text block alongside tool_use is normal output."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Parsing natural language to decide termination is a named anti-pattern; phrasing varies without end."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "An arbitrary iteration floor still ignores the signal the API gives, and adds wasted turns to short sessions."
      }
    },
    "cite": "Exam guide §1.1; notes/domain-1-agentic-architecture.md §1.1"
  },
  {
    "id": "S02",
    "ts": "1.1",
    "s": "cs",
    "block": 1,
    "obj": [
      6
    ],
    "bp": {
      "rank": 2
    },
    "q": "A developer's loop for the support agent sends each iteration as the system prompt plus the latest tool_result only. Logs from 300 sessions show the agent calling get_customer 4 to 6 times in a row for the same rider before giving up. Each call returns the same verified record. What is the most likely cause, and the fix?",
    "o": [
      "Append each tool_use and tool_result to the history, and send the full message list each time",
      "Expand get_customer's description to say a verified record completes the identity step",
      "Cap get_customer at 2 calls per session, after which the agent calls escalate_to_human",
      "Turn on prompt caching for the system prompt to keep the earlier lookups available between calls"
    ],
    "a": 0,
    "why": "The agentic loop works by appending each tool result to the conversation so the model can reason about the next action. A request that drops prior turns leaves the model with no record that it already verified the customer, so it asks again.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "A better description cannot help a model that never sees its own earlier call and result."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "An iteration cap hides the symptom; the model still reasons without the history it needs."
      },
      "D": {
        "trap": "nonexistent-feature",
        "text": "Caching reduces cost for a repeated prefix; it does not add missing turns to the request."
      }
    },
    "cite": "Exam guide §1.1, §5.1; notes/domain-1-agentic-architecture.md §1.1"
  },
  {
    "id": "S03",
    "ts": "1.3",
    "s": "cs",
    "block": 1,
    "obj": [],
    "bp": {
      "rank": 4
    },
    "q": "The coordinator verifies the rider with get_customer and lookup_order, then spawns a warranty-claims subagent through the Task tool with the prompt 'Assess this battery warranty claim.' In 31% of runs the subagent reports it cannot tell which order or battery serial number the claim is about. The coordinator already holds the verified customer ID, order ID, serial number and purchase date. What change fixes this most directly?",
    "o": [
      "Give the warranty subagent its own get_customer and lookup_order tools to repeat the verification itself",
      "Configure the subagent's definition to inherit the coordinator's conversation memory on each call",
      "Expand the subagent's system prompt with the full warranty policy and the fields a valid claim needs",
      "Pass the verified IDs, serial number and purchase date in the Task prompt as structured fields"
    ],
    "a": 3,
    "why": "Subagents do not inherit the parent's context. Whatever they need must be passed explicitly in the Task prompt, and structured fields keep identifiers and metadata intact.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "The data already exists; re-fetching adds calls and the subagent still does not know which order the customer meant."
      },
      "B": {
        "trap": "nonexistent-feature",
        "text": "Subagents start with isolated context; they do not share memory with the coordinator."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Knowing which fields matter does not give the subagent the values the coordinator holds."
      }
    },
    "cite": "Exam guide §1.3; lesson 0012"
  },
  {
    "id": "S04",
    "ts": "1.4",
    "s": "cs",
    "block": 1,
    "obj": [
      1
    ],
    "bp": {
      "rank": 1
    },
    "q": "An audit of 2,000 closed sessions finds that 9% ended with stop_reason \"end_turn\" after a message such as 'I'll check with the warehouse and get back to you.' None of those sessions issued a refund, created a return or called escalate_to_human, and no one followed up. Adding a line to the system prompt was tried last month and cut the rate from 11% to 9%. What should the team build?",
    "o": [
      "A stronger system-prompt rule, with examples of closing messages that resolve or escalate",
      "A loop change that re-prompts after end_turn until the reply mentions a refund or a human",
      "An orchestration-layer check on loop exit that escalates any session with no recorded resolution",
      "A weekly report of unresolved sessions, reviewed by a team lead who contacts each rider"
    ],
    "a": 2,
    "why": "Every session must end in a completed resolution or a human escalation however the loop terminates. That guarantee belongs in code that inspects the session's outcome when the loop exits, because prompt instructions have a non-zero failure rate, and the stem shows a prompt fix already failing.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "A prompt line was already tried and barely moved the rate; the guarantee has to sit outside the model."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Re-prompting until a phrase appears parses natural language and can loop without ever acting."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "Customers wait days, and the defect stays in the system; detection after the fact is not a safeguard."
      }
    },
    "cite": "Exam guide §1.4, §1.1; score-report objective 1; learning record 0015"
  },
  {
    "id": "S05",
    "ts": "1.4",
    "s": "cs",
    "block": 1,
    "obj": [
      2
    ],
    "bp": {
      "rank": 3
    },
    "q": "When the agent escalates, the human team receives the note 'Customer needs help with a refund.' Human agents cannot see the chat transcript, and they spend an average of 7 minutes re-asking riders for details the agent had already confirmed. The escalate_to_human tool accepts a 2,000-character payload. What should the agent send?",
    "o": [
      "The last 2,000 characters of the transcript, which hold the most recent details of the case",
      "A reason code from a fixed list plus the customer ID, for the human to look up the rest",
      "A note asking the rider to restate the issue to the human, plus the agent's confidence score",
      "A structured summary: customer ID, order ID, root cause, amounts, actions taken, next step"
    ],
    "a": 3,
    "why": "Humans who lack the transcript need a structured handoff that carries the accumulated context, findings and recommended action. The guide's example lists customer ID, root cause, refund amount and recommended action.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "A truncated tail drops the verified facts from earlier turns and leaves the human to reconstruct the case."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Humans would still repeat the lookups the agent already did, which is the 7 minutes being lost."
      },
      "C": {
        "trap": "blame-shifting",
        "text": "It pushes the work back to the customer, and self-reported confidence does not tell the human what happened."
      }
    },
    "cite": "Exam guide §1.4; score-report objective 2"
  },
  {
    "id": "S06",
    "ts": "1.4",
    "s": "cs",
    "block": 1,
    "obj": [
      5
    ],
    "bp": {
      "rank": 4
    },
    "q": "Changing the email address on an account requires that get_customer has first returned a verified customer ID. The system prompt states this rule in bold. Across 18,000 email-change requests last quarter, the agent called update_account before verification 41 times, and 3 accounts were taken over. What is the most effective change?",
    "o": [
      "Move the verification rule to the top of the system prompt and add 3 examples of verifying first",
      "Make update_account send a confirmation email to the old address after it changes the account",
      "Block update_account in code until get_customer has returned a verified ID in this session",
      "Route email changes to escalate_to_human and remove update_account from the agent's own tools"
    ],
    "a": 2,
    "why": "When a step must happen before another for security or money, programmatic prerequisites give a deterministic guarantee; prompt instructions are probabilistic. The gate blocks the downstream tool until the prerequisite result exists.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The rule is already in the prompt; with account takeover at stake, a non-zero failure rate is not acceptable."
      },
      "B": {
        "trap": "reactive-too-late",
        "text": "The change has already happened by the time the email goes out; the gate must act before the call."
      },
      "D": {
        "trap": "over-engineered",
        "text": "It throws away automation for every request to fix an ordering gap that a prerequisite check closes."
      }
    },
    "cite": "Exam guide §1.4, §1.5; score-report objective 5"
  },
  {
    "id": "S07",
    "ts": "1.5",
    "s": "cs",
    "block": 1,
    "obj": [],
    "bp": {
      "rank": 2
    },
    "q": "Orders placed before a platform migration come back from lookup_order with Unix timestamps, and newer orders come back with ISO 8601 dates. The return window is 30 days. The agent misjudged the window on 6% of older orders, approving some late returns and refusing some valid ones. What is the most reliable fix?",
    "o": [
      "A PostToolUse hook that converts lookup_order dates to ISO 8601 before the model reads them",
      "A system-prompt section on converting Unix timestamps, with two worked conversions",
      "A PreToolUse hook that rejects lookup_order calls for orders placed before the migration date",
      "A rule that sends returns on pre-migration orders to escalate_to_human for a manual check"
    ],
    "a": 0,
    "why": "PostToolUse hooks intercept tool results and can normalise heterogeneous formats, such as Unix timestamps and ISO 8601, before the agent processes them. That makes the comparison deterministic.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Asking the model to do date arithmetic correctly every time is the probabilistic path the hook removes."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Blocking the lookup stops legitimate returns; the data is fine, only its format differs."
      },
      "D": {
        "trap": "over-engineered",
        "text": "It turns a formatting problem into a staffing cost on every older order."
      }
    },
    "cite": "Exam guide §1.5; notes/domain-1-agentic-architecture.md §1.5"
  },
  {
    "id": "S08",
    "ts": "2.1",
    "s": "cs",
    "block": 1,
    "obj": [
      27
    ],
    "bp": {
      "rank": 1
    },
    "q": "The retailer added a check_battery_recall tool next to lookup_order. Last sprint both descriptions were rewritten with input formats, example queries and boundaries, yet 18% of recall questions such as 'is my battery on the recall list?' still go to lookup_order. The system prompt contains the line 'For anything about a specific bike or battery, start with lookup_order.' What should the team do next?",
    "o": [
      "Add 6 to 8 few-shot examples to the system prompt routing recall questions to the recall tool",
      "Rewrite the system-prompt line that sends bike and battery questions to lookup_order, then retest",
      "Merge both tools into one lookup_bike tool that decides internally whether to check recalls",
      "Expand both descriptions again with more recall examples and a sentence on when to use each"
    ],
    "a": 1,
    "why": "System-prompt wording can create keyword associations that override well-written tool descriptions. The stem rules out the descriptions (already improved, no change) and shows an instruction that sends exactly these questions to the wrong tool.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Examples would fight the instruction that causes the misrouting instead of removing it."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Consolidation is a bigger redesign; the cause is a keyword-sensitive instruction overriding good descriptions."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "The descriptions were already rewritten and the rate held at 18%, which points away from them."
      }
    },
    "cite": "Exam guide §2.1; score-report objective 27"
  },
  {
    "id": "S09",
    "ts": "2.2",
    "s": "cs",
    "block": 1,
    "obj": [
      26
    ],
    "bp": {
      "rank": 3
    },
    "q": "process_refund returns 'Operation failed' both when the payment gateway times out and when the refund would exceed the amount originally paid. The agent retries every failure 3 times and then tells the rider 'please try again later.' For over-limit refunds, which are 40% of failures, that message is wrong and riders come back the next day. What should process_refund return?",
    "o": [
      "A numeric error code per failure type, with each code's meaning in the system prompt",
      "Structured errors with a category, an isRetryable flag, and a customer-friendly reason",
      "The same message, with the tool retrying gateway timeouts with backoff before it returns",
      "A success response with refund_amount set to 0 when the request exceeds the original payment"
    ],
    "a": 1,
    "why": "Structured error metadata (errorCategory, isRetryable, a human-readable description) lets the agent retry transient failures and stop on business-rule violations, explaining them in customer terms. Uniform 'Operation failed' messages prevent that choice.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The agent must decode opaque numbers through the prompt; structured fields with retryability are direct."
      },
      "C": {
        "trap": "error-suppression",
        "text": "Local retry helps timeouts, but policy failures still look identical and the rider still gets the wrong message."
      },
      "D": {
        "trap": "error-suppression",
        "text": "Reporting a failure as success hides the reason and leaves the agent nothing truthful to tell the rider."
      }
    },
    "cite": "Exam guide §2.2; score-report objective 26"
  },
  {
    "id": "S10",
    "ts": "2.3",
    "s": "cs",
    "block": 1,
    "obj": [
      29
    ],
    "bp": {
      "rank": 4
    },
    "q": "In 9% of conversations the agent answers a rider's question about their own order from what the rider typed, without calling get_customer or lookup_order first. The team already has a hook that blocks process_refund until get_customer has run. In these conversations no tool is called at all, and some answers quote the wrong delivery date. What change guarantees the account is looked up first?",
    "o": [
      "Force get_customer with tool_choice on the first request, then return to \"auto\"",
      "Set tool_choice to \"any\" for the conversation, which makes the agent call some tool on each turn",
      "Extend the existing hook to block replies that mention an order until get_customer has run",
      "Add a system-prompt rule that the first action in each conversation is a call to get_customer"
    ],
    "a": 0,
    "why": "Forced tool selection ({\"type\": \"tool\", \"name\": ...}) makes a specific tool run first, and later steps continue in follow-up turns. That sequences the workflow so prerequisite data exists before the agent answers. The existing hook cannot help because no tool call happens.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "\"any\" guarantees a tool call but not which one, and forcing a tool on every turn blocks plain replies."
      },
      "C": {
        "trap": "nonexistent-feature",
        "text": "The hook intercepts tool calls; a conversational reply makes no call for it to block."
      },
      "D": {
        "trap": "probabilistic",
        "text": "A rule asks for the behaviour; forced tool selection guarantees it on the turn where it matters."
      }
    },
    "cite": "Exam guide §2.3; score-report objective 29; lesson 0010"
  },
  {
    "id": "S11",
    "ts": "4.2",
    "s": "cs",
    "block": 1,
    "obj": [],
    "bp": {
      "rank": 2
    },
    "q": "The system prompt lists 12 rules for choosing between lookup_order, check_battery_recall and create_return. On clear requests the agent follows them. On ambiguous ones, such as 'my battery dies after 5 km, what now?', it picks differently from one session to the next, and 3 more rules added last month did not help. What is the most effective next step?",
    "o": [
      "Add 3 or 4 few-shot examples of ambiguous requests, each showing why one tool beat the others",
      "Add a rule for each new ambiguous phrasing in the logs, ordered from most to least specific",
      "Lower the temperature to 0 to make the agent give one tool choice per ambiguous request",
      "Train a classifier on past tickets to choose the tool before the agent sees an ambiguous request"
    ],
    "a": 0,
    "why": "Few-shot examples are the most effective way to show ambiguous-case handling. Targeted examples that explain why one action beat the plausible alternatives let the model generalise its judgement to new phrasings that rules do not list.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "More rules were already tried and failed; listing phrasings never covers the next variant."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Consistency on identical text does not make the choice right, and new phrasings still vary."
      },
      "D": {
        "trap": "over-engineered",
        "text": "It adds a model and labelled data before trying the prompt technique built for ambiguous cases."
      }
    },
    "cite": "Exam guide §4.2"
  },
  {
    "id": "S12",
    "ts": "5.1",
    "s": "cs",
    "block": 1,
    "obj": [
      17
    ],
    "bp": {
      "rank": 1
    },
    "q": "A new web chat front end calls the Messages API with the system prompt and the rider's latest message only. In turn 1 a rider gives order number 58213; by turn 3 the agent asks for it again in 70% of chats. A developer believes the model should remember earlier turns from the same session ID. What is the correct fix?",
    "o": [
      "Pass the session ID in request metadata for the API to attach earlier turns of the same chat",
      "Send the complete conversation history, including earlier tool calls and results, with each request",
      "Copy the order number into the system prompt once the rider states it, and change nothing else",
      "Switch to a model with a larger context window to keep earlier turns in the model's memory"
    ],
    "a": 1,
    "why": "The API keeps no state between requests. Conversational coherence requires passing the complete history in each subsequent request; nothing else maintains it.",
    "wrong": {
      "A": {
        "trap": "nonexistent-feature",
        "text": "The Messages API is stateless; it does not look up earlier turns by session."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "It patches one fact while every other detail from earlier turns is still lost."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Window size does not matter when earlier turns are never sent in the request."
      }
    },
    "cite": "Exam guide §5.1; score-report objective 17"
  },
  {
    "id": "S13",
    "ts": "5.2",
    "s": "cs",
    "block": 1,
    "obj": [
      18
    ],
    "bp": {
      "rank": 4
    },
    "q": "Policy allows a free replacement charger within 12 months of purchase and says nothing about chargers lost in transit by the rider's own courier. A rider whose bike is 4 months old asks for a free charger because their courier lost the original. lookup_order confirms the purchase date. What should the agent do?",
    "o": [
      "Send a free replacement charger: the bike is 4 months old and well inside the 12-month window",
      "Escalate to a human, noting that the policy does not cover a loss by the rider's courier",
      "Decline the request and explain that the policy covers only defective chargers, not lost ones",
      "Ask the rider for the courier's tracking number before choosing between replacement and refusal"
    ],
    "a": 1,
    "why": "Escalation triggers include policy exceptions and gaps: when policy is ambiguous or silent on the specific request, escalate rather than decide. The guide's example is a price-match request the policy does not address.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The window covers defects; applying it to a loss the policy never mentions is the agent making policy."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "The policy is silent rather than negative; refusing invents a rule as surely as approving does."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "More evidence does not resolve a policy gap; the decision still needs someone with authority."
      }
    },
    "cite": "Exam guide §5.2; score-report objective 18; lesson 0002"
  },
  {
    "id": "S14",
    "ts": "5.2",
    "s": "cs",
    "block": 1,
    "obj": [
      18
    ],
    "bp": {
      "rank": 3
    },
    "q": "A rider gives only their name, Priya Natarajan, and asks to cancel a service booking. get_customer returns 3 accounts with that name in the same city. Logs show the agent usually picks the account with the most recent order, which was wrong in 2 of 25 reviewed cases. What should the agent do instead?",
    "o": [
      "Pick the account whose last order fits a service booking best, and confirm the date with the rider",
      "Escalate to a human, as several accounts match and the agent cannot verify which one is the right one",
      "List the 3 matching accounts with their addresses and ask the rider which one is theirs",
      "Ask the rider for another identifier, such as an email address or order number, before acting"
    ],
    "a": 3,
    "why": "Multiple customer matches require clarification through additional identifiers, not heuristic selection. The agent should ask for something that singles out one account.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "A better heuristic is still a guess, and confirming one detail can match the wrong account."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Asking for one more identifier resolves this in a turn; a queue is not needed."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Showing other customers' details to an unverified person leaks personal data."
      }
    },
    "cite": "Exam guide §5.2; score-report objective 18"
  },
  {
    "id": "S15",
    "ts": "5.3",
    "s": "cs",
    "block": 1,
    "obj": [],
    "bp": {
      "rank": 2
    },
    "q": "A shipment-status subagent tracks the 3 parcels in a rider's order through a carrier API. After 2 parcels return, the carrier times out on the third, and the subagent reports only 'shipping lookup failed' to the coordinator. The coordinator then tells the rider nothing is known about any of the parcels. What should the subagent return?",
    "o": [
      "An empty parcel list marked successful, and the coordinator asks the rider to check back again later",
      "An exception that ends the conversation and opens a ticket for the support team to follow up",
      "The same 'shipping lookup failed' status, sent after 5 retries with backoff in the subagent",
      "The 2 statuses it found, plus the failure type, the query that timed out, and options to retry"
    ],
    "a": 3,
    "why": "Structured error context (failure type, what was attempted, partial results, alternatives) lets the coordinator recover intelligently. Generic statuses hide that context, and both suppressing errors and terminating the workflow are anti-patterns.",
    "wrong": {
      "A": {
        "trap": "error-suppression",
        "text": "Marking a failure as success hides it, and the 2 good statuses are thrown away."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Ending everything on one timeout discards progress the rider could use now."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Local retries are reasonable, but a generic status after them still hides the partial results."
      }
    },
    "cite": "Exam guide §5.3, §2.2"
  },
  {
    "id": "S16",
    "ts": "1.5",
    "s": "cc",
    "block": 2,
    "obj": [
      12
    ],
    "bp": {
      "rank": 4
    },
    "q": "The team's CLAUDE.md says 'Run gofmt and golangci-lint after editing any Go file.' Review of 120 sessions shows Claude ran them after 81% of Go edits, and unformatted code reached later edits in the other 19%. The team wants the check after every edit, whatever the model decides. What should they configure?",
    "o": [
      "A git pre-commit hook that formats and lints the staged Go files before each commit is created",
      "A /lint-go slash command in .claude/commands/ that developers run after finishing a set of edits",
      "A PostToolUse hook on Edit and Write that runs gofmt and golangci-lint on the changed file",
      "The CLAUDE.md line rewritten in capitals at the top of the file, with an example of each command"
    ],
    "a": 2,
    "why": "PostToolUse hooks run after every matching tool call regardless of what the model chooses, so formatting and linting happen deterministically after each file edit. Instructions in CLAUDE.md are followed only probabilistically.",
    "wrong": {
      "A": {
        "trap": "reactive-too-late",
        "text": "It runs at commit time, not after each edit, and unformatted code keeps feeding later edits in the session."
      },
      "B": {
        "trap": "probabilistic",
        "text": "It depends on someone remembering to run it, which is the gap the team wants closed."
      },
      "D": {
        "trap": "probabilistic",
        "text": "CLAUDE.md is guidance the model may skip; 81% compliance is what instructions already deliver."
      }
    },
    "cite": "Exam guide §1.5, §3.1; score-report objective 12; notes/domain-3-claude-code-config.md §3.1"
  },
  {
    "id": "S17",
    "ts": "3.1",
    "s": "cc",
    "block": 2,
    "obj": [
      10
    ],
    "bp": {
      "rank": 1
    },
    "q": "The project CLAUDE.md contains the line 'Never open anything under config/secrets/.' In about 1 of 200 sessions Claude still reads a file there while tracing a configuration bug. The security lead wants this to be impossible, not unlikely. What should the team do?",
    "o": [
      "A permission deny rule for Read on config/secrets/** in the project's shared .claude/settings.json",
      "The line moved to the top of CLAUDE.md and repeated in a .claude/rules/ file for config paths",
      "A skill whose allowed-tools excludes Read, which developers use for any config work",
      "A CLAUDE.md inside config/secrets/ telling Claude to leave the folder at once"
    ],
    "a": 0,
    "why": "CLAUDE.md is advisory guidance delivered to the model. Rules that must hold are enforced through settings permissions or hooks; a deny rule is evaluated deterministically before the tool runs.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Repeating guidance raises the odds of compliance but cannot make the read impossible."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "It only restricts sessions that invoke the skill; normal sessions can still read the folder."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "A subdirectory CLAUDE.md loads only after Claude reads files there, which is too late and still only guidance."
      }
    },
    "cite": "Exam guide §3.1; score-report objective 10; notes/domain-3-claude-code-config.md §3.1 (security boundary as deny rule, CLAUDE.md is advisory); notes/2026-09-docs-delta.md §1.4"
  },
  {
    "id": "S18",
    "ts": "3.1",
    "s": "cc",
    "block": 2,
    "obj": [
      16
    ],
    "bp": {
      "rank": 3
    },
    "q": "To debug one routing outage, a developer added the line '@logs/outage-0412.log' to the repository's root CLAUDE.md and committed it. The log is 900 lines and matters only for that single investigation, and the developer also works in 3 other repositories. A week later every teammate's sessions still load it at startup. What should the developer have done?",
    "o": [
      "Put the import in the developer's ~/.claude/CLAUDE.md, out of the teammates' sessions",
      "Paste a prose summary of the log's key errors into the root CLAUDE.md under an Outage heading",
      "Create a .claude/rules/outage.md file with a paths glob of logs/** that holds the import line",
      "Reference @logs/outage-0412.log in the debugging session's prompt and leave CLAUDE.md alone"
    ],
    "a": 3,
    "why": "Choose the context mechanism by reusability and cross-session need. A one-off, specific file belongs in the prompt as an @ reference; CLAUDE.md is for context that every session needs.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "User-level CLAUDE.md loads in all 4 of the developer's repositories, in every session, long after the outage."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "It still loads in everyone's sessions, and a paraphrase drops the exact lines being debugged."
      },
      "C": {
        "trap": "over-engineered",
        "text": "It is standing, committed configuration for a one-off investigation: it loads whenever any log is read and stays until someone deletes it."
      }
    },
    "cite": "Exam guide §3.1; score-report objective 16"
  },
  {
    "id": "S19",
    "ts": "3.2",
    "s": "cc",
    "block": 2,
    "obj": [
      7
    ],
    "bp": {
      "rank": 2
    },
    "q": "The team shares an /incident-summary skill in .claude/skills/. One engineer wants a version that writes in a terser style for their own notes, and must not change what the other 11 engineers get. They tried editing the shared SKILL.md locally, but kept nearly committing it. Where should the personal version live?",
    "o": [
      "In the engineer's ~/.claude/skills/ under a different name, such as /incident-summary-terse",
      "In the root CLAUDE.md, as a line asking for terse incident summaries for this engineer",
      "In .claude/skills/ next to the team skill, with a note in its description that it is personal",
      "In CLAUDE.local.md, as an instruction to write incident summaries tersely for this engineer"
    ],
    "a": 0,
    "why": "Personal skill variants go in ~/.claude/skills/ with a different name so they do not affect teammates. Project skills and commands in .claude/ are shared through version control.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "The root CLAUDE.md is committed and loads for all 11 teammates, and it is guidance, not a separate skill."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Anything in the project directory is shared through version control with all 11 teammates."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "It changes every incident summary this engineer gets, including team runs that need the full style."
      }
    },
    "cite": "Exam guide §3.2; score-report objective 7"
  },
  {
    "id": "S20",
    "ts": "3.2",
    "s": "cc",
    "block": 2,
    "obj": [],
    "bp": {
      "rank": 4
    },
    "q": "A project skill, /api-docs, reads the Go handlers and writes Markdown reference pages into docs/api/. Twice in 40 runs it also ran git commands through Bash, once force-pushing a branch. The skill already uses context: fork. What change prevents this while keeping the skill's job intact?",
    "o": [
      "Add 'Do not run git commands' near the top of the skill body in SKILL.md, with a short reason",
      "Change context: fork to context: isolate in the frontmatter to keep Bash out of the repository",
      "Set allowed-tools in SKILL.md to Read, Grep, Glob and Write, with Bash left out",
      "Add a PreToolUse hook to the project settings that blocks Bash calls in any session"
    ],
    "a": 2,
    "why": "allowed-tools in skill frontmatter restricts which tools are available while the skill runs, for example limiting it to file operations to prevent destructive actions. context: fork isolates conversation context, not tool access.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "An instruction can be ignored; the frontmatter restriction removes the tool for the skill's run."
      },
      "B": {
        "trap": "nonexistent-feature",
        "text": "There is no such option; fork isolates context, not tool access, which is why the push still happened."
      },
      "D": {
        "trap": "over-engineered",
        "text": "It breaks Bash for all other work to fix one skill that has a tool restriction built for this."
      }
    },
    "cite": "Exam guide §3.2; notes/domain-3-claude-code-config.md §3.2"
  },
  {
    "id": "S21",
    "ts": "3.3",
    "s": "cc",
    "block": 2,
    "obj": [
      11
    ],
    "bp": {
      "rank": 1
    },
    "q": "The React dashboard keeps Storybook stories next to their components, in about 30 directories, as Button.stories.tsx and similar. Story conventions currently sit in a 90-line section of the root CLAUDE.md, and Claude ignores them in about a third of story edits. The team also wants those 90 lines out of sessions that never touch a story. What should they do?",
    "o": [
      "Put a CLAUDE.md with the story conventions into each of the 30 directories with stories",
      "Move the conventions to a .claude/rules/ file with paths set to **/*.stories.tsx in its frontmatter",
      "Keep the section in the root CLAUDE.md, moved to the top of the file under its own heading",
      "Create a /story skill with the conventions and ask developers to run it before story work"
    ],
    "a": 1,
    "why": ".claude/rules/ files with a paths glob load only when Claude works on matching files, wherever those files sit. That suits conventions for a file type spread across many directories better than directory-level CLAUDE.md files.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Thirty copies drift apart, and new story directories start without the conventions."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "It still loads in every session and still depends on Claude inferring when the section applies."
      },
      "D": {
        "trap": "probabilistic",
        "text": "It applies only when someone remembers to invoke it, not automatically on matching files."
      }
    },
    "cite": "Exam guide §3.3, §9 sample Q6; score-report objective 11"
  },
  {
    "id": "S22",
    "ts": "3.3",
    "s": "cc",
    "block": 2,
    "obj": [
      11
    ],
    "bp": {
      "rank": 3
    },
    "q": "The root CLAUDE.md holds a 350-line runbook for failing over the routing database. Engineers use it about twice a month, when someone explicitly starts a failover. The runbook is not tied to any particular set of files, and it costs tokens in every session. Which mechanism fits this content best?",
    "o": [
      "A .claude/rules/ file with paths set to db/** that loads the runbook on database edits",
      "A project skill holding the runbook, invoked when an engineer starts a failover",
      "An @import of a separate runbook file from the root CLAUDE.md to shorten the main file",
      "A CLAUDE.md in db/ with the runbook, loaded when Claude works in that folder"
    ],
    "a": 1,
    "why": "Pick the mechanism by guidance type and when it should apply. Path rules suit conventions tied to file patterns; skills suit task-specific workflows invoked on demand; CLAUDE.md holds universal, always-loaded standards.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Failovers are not triggered by editing files there, and routine schema edits would load it for no reason."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "An import still loads at startup, so every session pays the same token cost."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Directory loading follows file access, not the decision to run a failover."
      }
    },
    "cite": "Exam guide §3.2, §3.3; score-report objective 11"
  },
  {
    "id": "S23",
    "ts": "3.4",
    "s": "cc",
    "block": 2,
    "obj": [
      9
    ],
    "bp": {
      "rank": 2
    },
    "q": "The team must integrate a new telematics provider. It offers either a streaming API that needs a persistent consumer service, or hourly file drops to object storage that need a scheduled importer. The choice affects 3 services, the deployment setup and on-call ownership, and the tech lead wants to review the approach before code is written. How should the developer use Claude Code?",
    "o": [
      "Use direct execution to build the streaming consumer first, then switch if problems appear",
      "Use direct execution with detailed step-by-step instructions for the hourly importer",
      "Ask Claude to build both integrations in separate branches and let the lead pick the better one",
      "Start in plan mode to explore the services and compare both approaches, then implement one"
    ],
    "a": 3,
    "why": "Plan mode is for tasks with architectural implications, multiple valid approaches and a need for stakeholder review before implementation, such as choosing between integration approaches with different infrastructure. Implementation can then run directly.",
    "wrong": {
      "A": {
        "trap": "reactive-too-late",
        "text": "The architectural choice and review need are known now; discovering them mid-build causes rework."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "It commits to one approach before exploring the codebase or giving the lead anything to review."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Building twice spends effort on code that will be thrown away, before any design comparison."
      }
    },
    "cite": "Exam guide §3.4; score-report objective 9"
  },
  {
    "id": "S24",
    "ts": "3.4",
    "s": "cc",
    "block": 2,
    "obj": [
      9
    ],
    "bp": {
      "rank": 4
    },
    "q": "A crash report shows a nil pointer dereference in ETAForStop in eta/calc.go, line 212, when a stop has no geocode. The fix is a guard returning an error for a missing geocode, in that one function. A teammate suggests plan mode because the routing service is business-critical. What is the best approach?",
    "o": [
      "Direct execution: add the guard in ETAForStop plus a test for a stop with no geocode",
      "Plan mode, to map all the callers of ETAForStop before making any change to the function",
      "The interview pattern, letting Claude ask about geocoding edge cases before it writes code",
      "An Explore subagent to survey the routing service, then the fix applied in the main session"
    ],
    "a": 0,
    "why": "Direct execution fits well-scoped changes with a clear cause, such as a single-file bug fix with a stack trace. Importance of the service does not make a small fix architectural.",
    "wrong": {
      "B": {
        "trap": "over-engineered",
        "text": "The stack trace and scope are clear; planning adds a phase without reducing a real risk."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Interviewing helps in unfamiliar domains with open design choices, not a one-line guard."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Exploration suits verbose discovery; here the location and cause are already known."
      }
    },
    "cite": "Exam guide §3.4; score-report objective 9"
  },
  {
    "id": "S25",
    "ts": "3.5",
    "s": "cc",
    "block": 2,
    "obj": [
      8
    ],
    "bp": {
      "rank": 1
    },
    "q": "A developer with no mobile background must add offline sync to the drivers' app: stop updates made without signal have to merge with dispatcher changes later. They plan to ask Claude to 'implement offline sync' in one prompt. A senior engineer warns that the last offline feature took 3 rewrites because conflict cases surfaced late. What should the developer do first?",
    "o": [
      "Write a detailed prompt listing each conflict case they can think of, then ask for the code",
      "Ask Claude to implement a first version now and iterate on bug reports from drivers",
      "Ask Claude to interview them about conflicts, ordering and failure modes before it designs anything",
      "Give Claude 3 input and output examples of stop updates before and after sync, then implement"
    ],
    "a": 2,
    "why": "The interview pattern has Claude ask questions that surface considerations the developer did not anticipate, such as failure modes, before implementing in an unfamiliar domain.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Someone new to the domain cannot list the cases they have not anticipated, which caused the rewrites."
      },
      "B": {
        "trap": "reactive-too-late",
        "text": "Field bugs surface the same late conflicts that forced the earlier rewrites."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Examples pin down a known transformation; the problem here is the design questions nobody has raised yet."
      }
    },
    "cite": "Exam guide §3.5; score-report objective 8"
  },
  {
    "id": "S26",
    "ts": "3.5",
    "s": "cc",
    "block": 2,
    "obj": [
      8
    ],
    "bp": {
      "rank": 3
    },
    "q": "Claude is rewriting the function that rounds route distances for driver pay. Over 4 rounds of chat feedback, each fix breaks a case fixed earlier: one round broke zero-length legs, another broke distances near the 0.5 km boundary. The team knows the expected output for 15 such cases. What should the developer do?",
    "o": [
      "Write tests for the 15 cases first, then iterate by giving Claude the failing tests",
      "Describe the 15 cases in one long prose message and ask Claude to handle them together",
      "Fix the rounding by hand and ask Claude only to tidy the code style around the function",
      "Give Claude 2 input and output pairs for the hardest cases and go on as before"
    ],
    "a": 0,
    "why": "Test-driven iteration writes tests for expected behaviour and edge cases first, then shares failures to guide each round. Here regressions are the problem, and a suite catches every case on every round.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Prose was already interpreted inconsistently, and nothing catches a case that breaks again."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "It gives up on the workflow instead of fixing what made it regress."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Examples clarify a transformation but do not stop earlier fixes from silently breaking."
      }
    },
    "cite": "Exam guide §3.5; score-report objective 8"
  },
  {
    "id": "S27",
    "ts": "3.6",
    "s": "cc",
    "block": 2,
    "obj": [],
    "bp": {
      "rank": 2
    },
    "q": "Claude Code reviews each pull request in CI. When a developer pushes new commits, the review runs again from scratch and re-posts its earlier findings, including 6 the developer already fixed. Developers have started muting the bot. What change addresses this?",
    "o": [
      "Post comments on the first review run of a pull request and skip the later runs",
      "Put the prior review's findings in context and ask Claude to report only new or unaddressed issues",
      "Delete the earlier bot comments in the CI script before each new review is posted",
      "Resume the original review session with --resume to let Claude recall what it already posted before"
    ],
    "a": 1,
    "why": "When re-running reviews after new commits, put the earlier findings in context and ask Claude to flag only issues that are new or still open, which avoids repeat comments.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Later commits can add new problems, and the review would miss them."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Fixed issues disappear and reappear as fresh comments; the review still re-reports them."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Old tool results are stale after new commits; the review needs the prior findings, not the old session."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3-claude-code-config.md §3.6"
  },
  {
    "id": "S28",
    "ts": "3.6",
    "s": "cc",
    "block": 2,
    "obj": [],
    "bp": {
      "rank": 4
    },
    "q": "A CI job runs claude -p with a review prompt, and a script uses regular expressions on the prose output to create inline PR comments. About 1 run in 12 changes its wording and the script posts nothing. The team needs findings with file, line, severity and message every time. What should they change?",
    "o": [
      "Add 'Respond only in JSON with file, line, severity and message' to the review prompt of the job",
      "Make the regular expressions tolerant of more phrasings, and log each run they fail to parse in CI",
      "Drop the -p flag and run the review interactively to keep the output format the same on each run",
      "Run with --output-format json and a --json-schema for the findings, and post from those fields"
    ],
    "a": 3,
    "why": "--output-format json with --json-schema produces machine-parseable structured findings for automated posting as inline PR comments. -p is what keeps the run non-interactive.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "Asking for JSON in the prompt does not enforce it; the CLI flags do."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Parsing free text stays brittle; each new phrasing is another failure."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Without -p the job waits for input and hangs; the format problem is untouched."
      }
    },
    "cite": "Exam guide §3.6"
  },
  {
    "id": "S29",
    "ts": "4.1",
    "s": "cc",
    "block": 2,
    "obj": [],
    "bp": {
      "rank": 1
    },
    "q": "The review prompt asks Claude to rate each finding as critical, major or minor. The same unchecked error return in a Go handler was rated critical in one PR and minor in another, and 3 engineers disagree with about 35% of ratings. The prompt defines critical only as 'a serious issue.' What change gives the most consistent ratings?",
    "o": [
      "Tell Claude to assign critical only when it is highly confident the issue is serious",
      "Drop severity and post each finding at one level for the engineers to triage",
      "Define each severity level with explicit criteria and a short Go code example of that level",
      "Run each review 3 times and keep the severity that appears most often per finding"
    ],
    "a": 2,
    "why": "Explicit severity criteria with concrete code examples for each level achieve consistent classification. Vague definitions and confidence instructions do not.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "Confidence-based filtering does not create a shared standard for what counts as critical."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "It removes information the team uses rather than making the classification consistent."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Voting over an undefined standard gives a stable answer, not a correct or agreed one."
      }
    },
    "cite": "Exam guide §4.1"
  },
  {
    "id": "S30",
    "ts": "4.6",
    "s": "cc",
    "block": 2,
    "obj": [],
    "bp": {
      "rank": 3
    },
    "q": "In one Claude Code session, a developer has Claude write a database migration for the stops table, then asks the same session to 'review your migration critically.' Production later showed 2 bugs the review had called correct, including a missing index the session had chosen to skip. The team wants a review step that catches this kind of issue. What should they use?",
    "o": [
      "The same session with extended thinking turned on for the review, after the code is written",
      "The same session working through a 20-item migration checklist before it approves the code",
      "A separate Claude instance, with none of the generating session's context, reviewing it",
      "A second pass in the same session after /compact, seeing only a summary of the work"
    ],
    "a": 2,
    "why": "A model that generated code retains its reasoning context and is less likely to question its own decisions. An independent instance without that context catches subtle issues better than self-review instructions or extended thinking.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "More reasoning in the same context still carries the decisions it made while writing."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "A checklist helps, but the session still defends choices such as skipping the index."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "The summary still carries the generator's reasoning and drops detail the reviewer needs."
      }
    },
    "cite": "Exam guide §4.6, §3.6"
  },
  {
    "id": "S31",
    "ts": "1.2",
    "s": "dp",
    "block": 3,
    "obj": [],
    "bp": {
      "rank": 2
    },
    "q": "The productivity tool's coordinator sends every question through 4 subagents in order: a code mapper, a dependency tracer, a test finder and a doc writer. A question such as 'what does Appointment#reschedule return?' takes 95 seconds and about 60,000 tokens. Broad questions like 'how does billing touch scheduling?' do need all four. What should change?",
    "o": [
      "Cache each subagent's last output to let repeat questions skip the slower stages",
      "Split the tool into quick and deep modes, and ask the engineer to choose one before asking",
      "Run the 4 subagents in parallel instead of in order to cut the time each question takes overall",
      "Have the coordinator assess each question and invoke only the subagents that question needs"
    ],
    "a": 3,
    "why": "The coordinator should look at what each query needs and call only those subagents, instead of sending every query through the whole pipeline.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "New narrow questions still run all four stages; the routing is the problem."
      },
      "B": {
        "trap": "blame-shifting",
        "text": "It pushes the routing decision to the user that the coordinator is there to make."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Parallel runs cut latency but still spend the tokens of all four on a one-line question."
      }
    },
    "cite": "Exam guide §1.2"
  },
  {
    "id": "S32",
    "ts": "1.2",
    "s": "dp",
    "block": 3,
    "obj": [],
    "bp": {
      "rank": 4
    },
    "q": "To save round trips, the team let the dependency-tracer subagent send its results straight to the test-finder subagent, and the test finder message the doc writer. Since then, 3 incidents could not be traced, and one tracer error was silently dropped because the test finder had no error handling for it. Before the change, all results went through the coordinator. What should the team do?",
    "o": [
      "Copy the same error-handling code into each subagent and keep the direct links between them",
      "Add a shared log file that each subagent appends to, with a correlation ID for each request",
      "Merge the tracer, test finder and doc writer into one large subagent to remove the hand-offs",
      "Route all subagent communication back through the coordinator, which handles the errors"
    ],
    "a": 3,
    "why": "In hub-and-spoke orchestration the coordinator manages all inter-subagent communication, which gives observability, consistent error handling and controlled information flow.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Duplicated handling drifts, and direct links still give no single place to observe the flow."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Logging helps tracing after the fact but leaves error handling and routing scattered."
      },
      "C": {
        "trap": "over-engineered",
        "text": "It throws away the specialisation the subagents exist for, to fix a routing choice."
      }
    },
    "cite": "Exam guide §1.2"
  },
  {
    "id": "S33",
    "ts": "1.2",
    "s": "dp",
    "block": 3,
    "obj": [],
    "bp": {
      "rank": 1
    },
    "q": "For the question 'where are we running N+1 queries?', the coordinator spawns 3 subagents, each told to 'search the codebase for N+1 queries.' Their reports overlap by about 60%, and the run costs about 3 times a single agent's tokens. The app has three main areas: models, controllers and background jobs. What change makes the most of the 3 subagents?",
    "o": [
      "Give each subagent a distinct area, models, controllers or jobs, stated as a boundary in its prompt",
      "Use a single subagent for the whole search, as 3 copies of one task only repeat each other",
      "Have the synthesis step deduplicate the 3 reports before the coordinator returns the answer",
      "Give each subagent a different model to make their searches take different paths"
    ],
    "a": 0,
    "why": "Partition the scope across subagents to minimise duplication, for example by giving each agent distinct subtopics or sources. The same task given to three agents produces overlapping work.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "It removes the duplication but also the parallel coverage the split could provide."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "The duplicated work and tokens are already spent by the time deduplication runs."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Different models still search the same scope and overlap by chance, not by design."
      }
    },
    "cite": "Exam guide §1.2; notes/2026-09-docs-delta.md §1.2 (explicit task boundaries)"
  },
  {
    "id": "S34",
    "ts": "1.3",
    "s": "dp",
    "block": 3,
    "obj": [],
    "bp": {
      "rank": 3
    },
    "q": "To summarise 4 independent engines in the monolith, the coordinator issues one Task call per turn and waits for each subagent to finish before spawning the next. Each subagent takes about 50 seconds, and nothing in one summary depends on another. The full summary takes over 3 minutes. How should the coordinator spawn the subagents?",
    "o": [
      "Send the 4 summary requests through the Message Batches API and collect results when ready",
      "Give a single subagent all 4 engines in one prompt, which needs only one Task call",
      "Tell the coordinator in its prompt that the engines are independent and that it should spawn faster",
      "Emit all 4 Task tool calls in one coordinator response to run the subagents in parallel"
    ],
    "a": 3,
    "why": "To run subagents in parallel, the coordinator issues several Task calls in one response, not one per turn.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Batches do not support multi-turn tool calling and have no latency guarantee, so it is slower, not faster."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "One agent working through four engines is sequential again and crowds its context."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Wording does not change the pattern; parallel spawning means several Task calls in one response."
      }
    },
    "cite": "Exam guide §1.3, §4.5"
  },
  {
    "id": "S35",
    "ts": "1.6",
    "s": "dp",
    "block": 3,
    "obj": [
      4
    ],
    "bp": {
      "rank": 2
    },
    "q": "Asked to find out why appointment reminders are sometimes sent twice, the agent follows a fixed 6-step plan: read the mailer, the job, the model, the scheduler, the config, then report. At step 2 it found that the job queue retries on timeout, but it carried on with the plan and its report blamed the mailer. This is an open-ended investigation. How should the task be decomposed?",
    "o": [
      "A fixed plan extended to 9 steps, with the queue retry settings added as step 3",
      "Each of the 6 steps run as a parallel subagent, with the reports merged at the very end",
      "An adaptive plan that adds or reorders subtasks as findings appear, such as the retry",
      "A first step listing all possible causes, then a check of each in the order listed"
    ],
    "a": 2,
    "why": "Open-ended investigation needs dynamic decomposition, with subtasks generated from what each step discovers. Fixed sequential pipelines suit predictable tasks and ignore intermediate findings.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "It fixes this one path; the next investigation will turn up a different lead the plan ignores."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Parallel fixed steps still cannot react to what one of them finds."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "A fixed list made upfront has the same blind spot: it is decided before anything is learned."
      }
    },
    "cite": "Exam guide §1.6; score-report objective 4"
  },
  {
    "id": "S36",
    "ts": "1.6",
    "s": "dp",
    "block": 3,
    "obj": [],
    "bp": {
      "rank": 4
    },
    "q": "The team wants reference documentation for all 140 JSON endpoints. Every endpoint needs the same three steps: extract the route and parameters, describe the behaviour from the controller, and write one example request. A proposal suggests a coordinator that decides the steps for each endpoint as it goes. What decomposition fits best?",
    "o": [
      "A coordinator using dynamic decomposition to decide each endpoint's steps from its findings",
      "A fixed prompt chain per endpoint: extract the signature, describe it, write the example",
      "A single prompt that documents all 140 endpoints in one response for a consistent house style",
      "One subagent per step, with the coordinator choosing at run time which steps each endpoint needs"
    ],
    "a": 1,
    "why": "Prompt chaining, a fixed sequence of steps, suits predictable multi-step work. Dynamic decomposition is for open-ended tasks whose subtasks depend on discoveries.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "The steps are known and identical; adaptive planning adds cost and variation for no gain."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "One huge pass dilutes attention and gives uneven depth across endpoints."
      },
      "D": {
        "trap": "over-engineered",
        "text": "It reintroduces run-time decisions for a workflow with no decisions to make."
      }
    },
    "cite": "Exam guide §1.6"
  },
  {
    "id": "S37",
    "ts": "1.7",
    "s": "dp",
    "block": 3,
    "obj": [
      3
    ],
    "bp": {
      "rank": 1
    },
    "q": "Yesterday an engineer ran a named session, noshow-audit, that analysed 40 files of the no-show penalty logic. Overnight, teammates changed 3 of those files, and the engineer knows which ones. The rest of yesterday's analysis is still valid. How should the engineer continue?",
    "o": [
      "Resume noshow-audit, name the 3 changed files, and ask the agent to re-analyse only those",
      "Start a fresh session and have the agent re-explore the 40 files to rebuild the analysis",
      "Resume noshow-audit and carry on, as the agent will notice the edits when it reads files",
      "Fork noshow-audit and continue in the fork, with the original session left unchanged"
    ],
    "a": 0,
    "why": "Resume a session when its prior context is mostly valid, and inform the agent of specific file changes for targeted re-analysis rather than full re-exploration.",
    "wrong": {
      "B": {
        "trap": "over-engineered",
        "text": "Most of the prior context is valid; re-exploring it repeats work the session already did."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The agent holds yesterday's results and has no reason to re-read files it thinks it knows."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Forking is for exploring divergent approaches; the fork still holds the stale analysis."
      }
    },
    "cite": "Exam guide §1.7; score-report objective 3"
  },
  {
    "id": "S38",
    "ts": "1.7",
    "s": "dp",
    "block": 3,
    "obj": [],
    "bp": {
      "rank": 3
    },
    "q": "A session has spent 2 hours mapping how the scheduling engine uses its legacy calendar library. The team wants to compare two refactoring approaches, wrapping the library behind an adapter or replacing it outright, and both must start from that same analysis. Re-running the analysis would take another 2 hours. What should they do?",
    "o": [
      "Start two new sessions and paste the same one-paragraph summary of the analysis into each",
      "Use fork_session to create two branches from the analysed session, one per approach",
      "Stay in the single session, trying the adapter first and then the replacement after it",
      "Resume the session twice in two terminals, both approaches building on one history"
    ],
    "a": 1,
    "why": "fork_session creates independent branches from a shared analysis baseline, which is how to compare divergent approaches without repeating the shared work.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "A paragraph loses most of the 2 hours of findings that both branches need."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "The second approach is coloured by the first one's work and leftover context."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Two runs writing to one session do not give independent branches and can tangle their histories."
      }
    },
    "cite": "Exam guide §1.7"
  },
  {
    "id": "S39",
    "ts": "2.4",
    "s": "dp",
    "block": 3,
    "obj": [],
    "bp": {
      "rank": 2
    },
    "q": "The team connected an MCP code-intelligence server with a find_callers tool that resolves Ruby's dynamic method calls. Its description reads 'Finds callers.' In 70% of caller questions the agent uses Grep instead and misses calls made through send, which find_callers would catch. What is the most effective fix?",
    "o": [
      "Remove Grep from the agent's tools to make it use find_callers for any caller question",
      "Force find_callers with tool_choice on any turn that mentions callers or call sites",
      "Expand find_callers' description to say what it resolves that text search cannot, and its output",
      "Add a system-prompt line asking the agent to prefer MCP tools over the built-in tools in general use"
    ],
    "a": 2,
    "why": "Enhancing MCP tool descriptions to explain capabilities and outputs in detail stops the agent reaching for built-ins like Grep when the MCP tool can do more.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Grep is still the right tool for plain text search, such as error messages."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Forcing per turn needs keyword routing outside the model and breaks other turns."
      },
      "D": {
        "trap": "probabilistic",
        "text": "A blanket preference does not tell the agent when find_callers is better than Grep."
      }
    },
    "cite": "Exam guide §2.4, §2.1"
  },
  {
    "id": "S40",
    "ts": "2.4",
    "s": "dp",
    "block": 3,
    "obj": [
      14,
      28
    ],
    "bp": {
      "rank": 4
    },
    "q": "All 9 engineers need the agent to read and comment on GitLab merge requests. A maintained community GitLab MCP server exists, and one engineer has started writing a custom server instead. Each engineer has a personal access token, and the repository must never contain a token. How should the team set this up?",
    "o": [
      "The custom server, once finished, in the project's .mcp.json with each token in an env var",
      "The community server in the project's .mcp.json, with the token read from ${GITLAB_TOKEN}",
      "The community server added by each engineer to their own ~/.claude.json, with their own token",
      "The community server in the project's .mcp.json, with one shared service token in the file"
    ],
    "a": 1,
    "why": "Shared team tooling goes in project-scoped .mcp.json, with environment variable expansion for credentials so no secret is committed. Community servers are preferred over custom ones for standard integrations.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Standard integrations should use existing community servers; custom ones are for team-specific workflows."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "User scope is for personal servers; shared team tooling belongs in the project file."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "That commits a secret to the repository, which environment variable expansion exists to avoid."
      }
    },
    "cite": "Exam guide §2.4; score-report objectives 14 and 28"
  },
  {
    "id": "S41",
    "ts": "2.5",
    "s": "dp",
    "block": 3,
    "obj": [
      13
    ],
    "bp": {
      "rank": 1
    },
    "q": "An engineer asks the agent where the error code APPT-409 is raised. The string appears in exactly 1 of the app's 2,400 files, errors/codes.rb, where it is assigned to the constant APPOINTMENT_CONFLICT. Raise sites across the app refer only to the constant. Which approach finds the raise sites?",
    "o": [
      "Grep for APPT-409 to learn the constant's name, then Grep for that constant across the codebase",
      "Grep for APPT-409 across the codebase and Read each file that matches the string",
      "Glob for **/*conflict*.rb and Read the results to find where the error is raised",
      "Read errors/codes.rb, then Read each file under app/ that requires the errors module"
    ],
    "a": 0,
    "why": "Grep searches file contents. When the string is only a definition and callers use another name, first identify the name that is actually used, then search for that name across the codebase, as the guide does for wrapper modules.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "It finds only the definition in errors/codes.rb; the raise sites use the constant, not the string."
      },
      "C": {
        "trap": "probabilistic",
        "text": "File names do not track where an error is raised; this guesses by name."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Loading the errors module is common across the app, so this reads far more files than the raise sites, one by one."
      }
    },
    "cite": "Exam guide §2.5; score-report objective 13; lesson 0014"
  },
  {
    "id": "S42",
    "ts": "2.5",
    "s": "dp",
    "block": 3,
    "obj": [
      13
    ],
    "bp": {
      "rank": 3
    },
    "q": "The agent must list every billing spec file. They are named *_spec.rb and live under spec/billing/ and under each of 6 engines in engines/*/spec/billing/. Many other spec files mention billing in their content, and those are not wanted. Which approach finds exactly the right files?",
    "o": [
      "Grep for the word Billing in files ending _spec.rb and keep the files that match",
      "Read the spec/ folder and each engine's spec/ folder and pick out billing files by eye",
      "Glob with a path pattern such as **/spec/billing/**/*_spec.rb, then list the matches",
      "Grep for describe Billing in the spec/ folder, then Read each match to confirm where it is"
    ],
    "a": 2,
    "why": "Glob finds files by naming and path patterns, such as **/*.test.tsx. When the requirement is about where files are and what they are called, a path pattern is exact.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Content search returns the many other specs that mention billing."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Walking folders by hand is slow and easy to get wrong when a path pattern exists."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "It misses the engine specs and still selects by content, not by location."
      }
    },
    "cite": "Exam guide §2.5; score-report objective 13; lesson 0014"
  },
  {
    "id": "S43",
    "ts": "2.5",
    "s": "dp",
    "block": 3,
    "obj": [
      13
    ],
    "bp": {
      "rank": 2
    },
    "q": "An engineer asks how a booking cancellation flows from the API to the refund. The agent's first move was to Read all 220 files under app/, and by file 140 its context was full and its answers became vague. The cancel endpoint is a single controller action. How should the agent explore instead?",
    "o": [
      "Read the 220 files in batches of 40 and summarise each batch before the next one",
      "Spawn a subagent to Read all 220 files and return one summary of the whole app",
      "Grep for the cancel action's route or method name, Read that action, then follow its calls",
      "Glob app/**/*.rb, then Read the files whose names suggest a cancellation, refund or booking"
    ],
    "a": 2,
    "why": "Build understanding incrementally: start with Grep to find the entry point, then use Read to follow imports and trace the flow, rather than reading all files upfront.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Batched summaries still spend effort on files unrelated to cancellation."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Isolation protects the main context, but the subagent still reads everything upfront instead of tracing from the entry point."
      },
      "D": {
        "trap": "probabilistic",
        "text": "File names miss the services and jobs the action calls, and catch unrelated files."
      }
    },
    "cite": "Exam guide §2.5; score-report objective 13"
  },
  {
    "id": "S44",
    "ts": "5.4",
    "s": "dp",
    "block": 3,
    "obj": [
      15
    ],
    "bp": {
      "rank": 4
    },
    "q": "A 3-hour session is mapping the scheduling engine. After 2 hours the agent began describing 'typical Rails service patterns' instead of the SlotAllocator and WaitlistPromoter classes it found in the first hour. The engineer has already run /compact twice, and after each one more class-level detail was gone. What practice best keeps the findings available?",
    "o": [
      "Have the agent keep key findings in a scratchpad file and consult it for later questions",
      "Run /compact more often, at 30-minute intervals, with an instruction to keep the class names",
      "Restart the session each hour and ask the agent to re-explore the classes it found before",
      "Add the class names to the project CLAUDE.md to load them at the start of each new session"
    ],
    "a": 0,
    "why": "Context degrades in extended sessions, and models start citing 'typical patterns' instead of specifics. Scratchpad files persist key findings across context boundaries, and the agent references them for later questions.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Compaction was already tried twice and kept losing detail; it summarises, it does not persist."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Re-exploring repeats an hour of work each time instead of carrying findings forward."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "It puts one investigation's working notes into context for every teammate's sessions."
      }
    },
    "cite": "Exam guide §5.4; score-report objective 15; learning record 0015"
  },
  {
    "id": "S45",
    "ts": "5.4",
    "s": "dp",
    "block": 3,
    "obj": [
      15
    ],
    "bp": {
      "rank": 1
    },
    "q": "A nightly job runs a coordinator and 5 exploration subagents to map dependencies across the monolith, taking about 4 hours. Last night it crashed at hour 3, and on restart every agent began from scratch. The team wants a restart to pick up where each agent stopped. What design achieves this?",
    "o": [
      "Each agent writes its state to an agreed location, and the coordinator loads that manifest on restart",
      "Restart the job with --resume on the coordinator's session to recover the subagents' work",
      "Split the job into 5 nightly jobs, one per subagent, to limit the work one crash loses",
      "Raise the job's timeout and memory limits to make a crash before the end less likely"
    ],
    "a": 0,
    "why": "Crash recovery uses structured state persistence: each agent writes its state to an agreed location, and the coordinator loads a manifest on resume and injects it into agent prompts.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "Subagent findings live in their own isolated contexts, not in the coordinator's history."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "A crash still sends that job back to the start; nothing persists its progress."
      },
      "D": {
        "trap": "probabilistic",
        "text": "It lowers the odds of a crash but gives no recovery when one happens."
      }
    },
    "cite": "Exam guide §5.4; score-report objective 15"
  },
  {
    "id": "S46",
    "ts": "2.1",
    "s": "de",
    "block": 4,
    "obj": [
      27
    ],
    "bp": {
      "rank": 3
    },
    "q": "The extraction agent has two tools: extract_test_certificate, described as 'Extracts data from a chemical document', and extract_safety_sheet, described as 'Extracts chemical document fields.' On a sample of 400 uploads, 23% of certificates of analysis were sent to the safety-sheet tool. Both documents arrive as PDFs with similar letterheads. What is the most effective first step?",
    "o": [
      "Merge both tools into one extract_chemical_document tool that detects the document type internally",
      "Rewrite both descriptions with inputs, sample documents, outputs, and when to use each one",
      "Add 8 few-shot examples to the system prompt that show certificates routed to the right tool",
      "Force extract_test_certificate with tool_choice when the file name contains 'CoA'"
    ],
    "a": 1,
    "why": "Tool descriptions are the primary mechanism the model uses to select tools. Near-identical minimal descriptions cause misrouting; descriptions that state inputs, examples, outputs and boundaries against similar tools fix the root cause.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Consolidation is a valid redesign but more work than a first step when the cause is thin descriptions."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Examples add tokens around the gap; the descriptions the model selects by still say nothing."
      },
      "D": {
        "trap": "probabilistic",
        "text": "File names are inconsistent, and routing by keyword outside the model is brittle."
      }
    },
    "cite": "Exam guide §2.1, §9 sample Q2; score-report objective 27"
  },
  {
    "id": "S47",
    "ts": "2.2",
    "s": "de",
    "block": 4,
    "obj": [
      26
    ],
    "bp": {
      "rank": 2
    },
    "q": "Before accepting a certificate, the pipeline calls search_prior_certificates to compare it with earlier lots from the same supplier. When the search index is down, the tool returns an empty list, exactly as it does for a supplier's first shipment. Last month 140 certificates skipped the comparison because of an outage. What should the tool return?",
    "o": [
      "The empty list as before, with a warning written to the tool's log when the index is down",
      "An exception that stops the whole pipeline until the search index is available again",
      "A placeholder prior certificate with zero values, to give the comparison step some input on each run",
      "An isError result marking the outage as transient and retryable, distinct from a valid empty list"
    ],
    "a": 3,
    "why": "Access failures need retry decisions; valid empty results are successful queries with no matches. The tool must distinguish them, with structured error metadata such as category and retryability for the failure.",
    "wrong": {
      "A": {
        "trap": "error-suppression",
        "text": "The agent never sees the log; it still reads an outage as 'no prior lots'."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Halting every document on one dependency is an overreaction when the agent can retry or defer."
      },
      "C": {
        "trap": "error-suppression",
        "text": "Fake data hides the failure and corrupts the comparison."
      }
    },
    "cite": "Exam guide §2.2; score-report objective 26"
  },
  {
    "id": "S48",
    "ts": "2.3",
    "s": "de",
    "block": 4,
    "obj": [
      23,
      29
    ],
    "bp": {
      "rank": 4
    },
    "q": "Uploads can be a certificate of analysis, a bill of lading or a utility bill, and the type is not known in advance. Each type has its own extraction tool, and tool_choice is set to \"auto\". In 5% of requests the model replies with a prose summary instead of calling a tool, and the downstream loader fails. What setting fixes this?",
    "o": [
      "Force extract_test_certificate with tool_choice, as certificates are the most common upload",
      "Keep \"auto\" and add 'Always respond by calling a tool' to the system prompt for extraction",
      "Set tool_choice to \"any\": the model must call an extraction tool but can pick which",
      "Keep \"auto\" and have the loader retry any request that comes back as plain prose text"
    ],
    "a": 2,
    "why": "tool_choice \"any\" guarantees the model calls a tool rather than returning text, while letting it choose among several extraction schemas when the document type is unknown. Forced selection fits when one specific tool must run.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Forcing one tool sends bills of lading and utility bills through the wrong schema."
      },
      "B": {
        "trap": "probabilistic",
        "text": "\"auto\" lets the model return text; an instruction lowers the rate without guaranteeing a call."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "Retries cost a second call and can return text again; the setting can prevent it."
      }
    },
    "cite": "Exam guide §2.3, §4.3; score-report objectives 23 and 29"
  },
  {
    "id": "S49",
    "ts": "4.1",
    "s": "de",
    "block": 4,
    "obj": [],
    "bp": {
      "rank": 1
    },
    "q": "After extraction, the model flags certificates whose results it judges 'unusual' for a chemist to check. Chemists dismiss 30% of flags, and two weeks ago the prompt added 'only flag results you are confident are problems,' which changed the rate by 1 point. Each certificate prints the specification range next to every measured value. What change best improves precision?",
    "o": [
      "Strengthen the instruction to 'be very conservative and flag only clear, serious problems'",
      "Have the model give a confidence score per flag and show chemists only those above 0.9",
      "Turn flagging off until a classifier trained on dismissed flags is ready to replace it",
      "State the criterion: flag a result only when its value falls outside the range on that certificate"
    ],
    "a": 3,
    "why": "Explicit categorical criteria improve precision; vague instructions such as 'be conservative' or 'only report high-confidence findings' do not. Here the certificate supplies an objective test.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "General caution was already tried; it barely moved the rate because it defines nothing."
      },
      "B": {
        "trap": "probabilistic",
        "text": "Confidence filtering replaces a definition with an uncalibrated number."
      },
      "C": {
        "trap": "over-engineered",
        "text": "It drops a useful check and adds a model when a precise criterion is available on the page."
      }
    },
    "cite": "Exam guide §4.1"
  },
  {
    "id": "S50",
    "ts": "4.2",
    "s": "de",
    "block": 4,
    "obj": [
      24
    ],
    "bp": {
      "rank": 3
    },
    "q": "The batch_number field comes back null on 22% of certificates. Review shows the number is present in all of them, but some suppliers print it in a header table labelled 'Lot', others in a footer line, and others as 'Batch/Lot No.' The instructions describing these placements were rewritten twice without much change. What should the team try next?",
    "o": [
      "Make batch_number a required field to force the model to return a value for each certificate",
      "Add few-shot examples showing correct batch_number extraction from each of the 3 layouts",
      "Retry each null batch_number with the instruction 'look harder for the batch number'",
      "Add a fourth paragraph to the instructions that lists more labels the suppliers might print"
    ],
    "a": 1,
    "why": "Few-shot examples showing correct extraction from documents with varied formats address empty or null extraction of required information, and work where detailed instructions alone produce inconsistent results.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Required fields push the model to fabricate when it cannot find the value."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "A vague retry adds cost without showing the model where these layouts put the number."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Prose descriptions have already failed twice; more of the same is unlikely to change it."
      }
    },
    "cite": "Exam guide §4.2; score-report objective 24"
  },
  {
    "id": "S51",
    "ts": "4.3",
    "s": "de",
    "block": 4,
    "obj": [
      21
    ],
    "bp": {
      "rank": 2
    },
    "q": "The extractor asks for 'valid JSON only' in the prompt and parses the reply with JSON.parse. About 2.5% of replies fail to parse: some add a sentence after the object, others drop a closing brace on long certificates. Downstream systems need schema-compliant output every time. Which approach is most reliable?",
    "o": [
      "Prefill the assistant turn with an opening brace to force the reply to start as a JSON object",
      "Retry any reply that fails JSON.parse, sending the parse error back to the model",
      "Strip the text before the first brace and after the last one before calling JSON.parse",
      "Define an extraction tool whose input schema is the JSON schema, and read its tool_use input"
    ],
    "a": 3,
    "why": "Tool use with a JSON schema is the most reliable way to get schema-compliant structured output and eliminates JSON syntax errors. Prompt-based formatting and prefills are weaker.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "A prefill shapes the start of the reply but does not prevent trailing text or broken structure."
      },
      "B": {
        "trap": "reactive-too-late",
        "text": "Retries recover some failures after the fact; tool use removes syntax errors upfront."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Trimming fixes trailing sentences but not missing braces, and hides malformed output."
      }
    },
    "cite": "Exam guide §4.3; score-report objective 21"
  },
  {
    "id": "S52",
    "ts": "4.3",
    "s": "de",
    "block": 4,
    "obj": [
      22
    ],
    "bp": {
      "rank": 4
    },
    "q": "The bill-of-lading schema marks seal_number as required. About 15% of bills are for bulk cargo shipped without a container seal, so the document has no seal number at all. Audits found the model returned plausible-looking seal numbers on most of those bills. What schema change fixes this?",
    "o": [
      "Keep seal_number required and add 'do not invent a seal number' to the extraction prompt",
      "Keep seal_number required and retry any bill whose seal number fails a format check",
      "Keep it required and set it to the string 'UNKNOWN' when the field fails validation",
      "Make seal_number nullable and optional, with null for a bill that has no seal"
    ],
    "a": 3,
    "why": "Design fields as optional or nullable when source documents may not contain the information. A required field pushes the model to fabricate a value to satisfy the schema.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The schema still demands a value; an instruction competes with that requirement."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Retries cannot supply information that is not in the document."
      },
      "C": {
        "trap": "error-suppression",
        "text": "A sentinel string disguises absent data as a value and spreads into downstream systems."
      }
    },
    "cite": "Exam guide §4.3, §4.4; score-report objective 22; learning record 0021"
  },
  {
    "id": "S53",
    "ts": "4.3",
    "s": "de",
    "block": 4,
    "obj": [
      22
    ],
    "bp": {
      "rank": 1
    },
    "q": "The certificate schema has a hazard_class enum with 4 values. New suppliers send products in classes outside the list, and some certificates state the class unclearly. In both cases the model picks the nearest listed value, and 7% of records last month carried a wrong class. How should the schema change?",
    "o": [
      "Expand the enum to cover each hazard class that exists, with no product outside the list",
      "Replace the enum with a free-text field for the model to write what the certificate says",
      "Add \"other\" with a detail string for unlisted classes, and \"unclear\" for ambiguous certificates",
      "Keep the 4 values and add a prompt rule to pick the closest one only when it is sure"
    ],
    "a": 2,
    "why": "Enum values such as \"unclear\" handle ambiguous cases, and \"other\" plus a detail field handles extensible categories. Both let the model represent the source faithfully.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "A complete list still forces ambiguous certificates into one confident-looking value."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Free text throws away the categorisation that downstream systems rely on."
      },
      "D": {
        "trap": "probabilistic",
        "text": "The schema still allows no honest answer when the class is unlisted or unclear."
      }
    },
    "cite": "Exam guide §4.3; score-report objective 22"
  },
  {
    "id": "S54",
    "ts": "4.4",
    "s": "de",
    "block": 4,
    "obj": [
      25
    ],
    "bp": {
      "rank": 3
    },
    "q": "Reviewers correct about 600 extractions a week and type a free-text note for each fix. After 3 months nobody can say which fields, suppliers or layouts cause most errors, and prompt changes are chosen by gut feel. The team wants each round of prompt, schema and example changes to target the real failure patterns. What should they build?",
    "o": [
      "Have the model summarise the free-text notes each month into a short list of common problems",
      "Log each correction as structured fields, such as field, supplier, layout and error type",
      "Raise the share of documents sent to reviewers to correct more errors before loading",
      "Retry each corrected document with the reviewer's note appended, to confirm the model fixes it"
    ],
    "a": 1,
    "why": "A review loop improves when every flagged error records why it fired (the pattern, the field, the input) and that record drives the next round of prompt, schema or example changes.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Summaries of unstructured notes stay vague and cannot be counted or tracked across rounds."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "More corrections fix more records but still teach the pipeline nothing."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "One-off retries fix single records after the fact; they do not reveal patterns."
      }
    },
    "cite": "Exam guide §4.4; score-report objective 25"
  },
  {
    "id": "S55",
    "ts": "4.4",
    "s": "de",
    "block": 4,
    "obj": [],
    "bp": {
      "rank": 2
    },
    "q": "For utility bills, the pipeline checks that line charges sum to the printed total. Checks fail on 4% of bills, and the team's plan is to retry failures with the error message appended. A sample shows that on most failing bills the printed total itself disagrees with the printed charges, through the utility's own error. What design handles this best?",
    "o": [
      "Retry each failure with the validation error appended until the charges and total agree",
      "Extract calculated_total and stated_total, with a conflict_detected flag when they differ",
      "Drop the line charges and keep only the stated total, the amount the customer pays",
      "Overwrite the stated total with the sum of the line charges whenever the two values disagree"
    ],
    "a": 1,
    "why": "Self-correction flows extract calculated_total alongside stated_total and add a conflict_detected flag for inconsistent source data. Retry with error feedback helps when the model made the error, not when the document did.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The source disagrees with itself; a retry pressures the model to alter numbers to pass."
      },
      "C": {
        "trap": "error-suppression",
        "text": "It hides a real discrepancy that someone needs to see."
      },
      "D": {
        "trap": "error-suppression",
        "text": "It silently replaces what the document says with a computed value."
      }
    },
    "cite": "Exam guide §4.4; lesson 0016"
  },
  {
    "id": "S56",
    "ts": "4.5",
    "s": "de",
    "block": 4,
    "obj": [
      20
    ],
    "bp": {
      "rank": 4
    },
    "q": "Two workloads use the extractor. At the loading dock, staff upload a bill of lading and the truck waits until the extraction confirms release, usually within 20 seconds. Separately, 30,000 archived utility bills must be processed for a carbon report due in 5 days. Finance wants both moved to the Message Batches API for the 50% saving. What should the team do?",
    "o": [
      "Batch API for the archived bills, synchronous API for the dock uploads",
      "Batch API for both, polled often, as most batches finish well within 1 hour",
      "Synchronous API for both, to avoid batch results coming back out of order",
      "Batch API for both, with a fallback to the synchronous API after 2 minutes"
    ],
    "a": 0,
    "why": "The Message Batches API saves 50% but processes within up to 24 hours with no latency SLA. It fits latency-tolerant work and not blocking workflows.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Batches have no latency guarantee; a truck cannot wait on 'usually fast'."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "custom_id correlates batch results, so ordering is no reason to skip the saving."
      },
      "D": {
        "trap": "over-engineered",
        "text": "It adds machinery to recover from a choice that was wrong for the blocking workflow."
      }
    },
    "cite": "Exam guide §4.5, §9 sample Q11; score-report objective 20"
  },
  {
    "id": "S57",
    "ts": "4.5",
    "s": "de",
    "block": 4,
    "obj": [],
    "bp": {
      "rank": 1
    },
    "q": "A batch of 50,000 archived certificates finished with 1,100 requests errored for exceeding the context limit. All of them are long multi-certificate PDFs, and the other 48,900 succeeded. Each request carried a custom_id set to the document ID. What should the team do next?",
    "o": [
      "Resubmit all 50,000 requests with a higher max_tokens value on each request",
      "Resubmit the 1,100 failed documents unchanged, as batch errors are often transient",
      "Resubmit only the 1,100 failed documents by custom_id, split into chunks that fit the limit",
      "Move the 1,100 failed documents to the synchronous API, which accepts larger inputs"
    ],
    "a": 2,
    "why": "Handle batch failures by resubmitting only the failed documents, identified by custom_id, with the change the failure calls for, such as chunking documents that exceeded context limits.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "max_tokens limits output; the inputs were too long, and the successes are paid for twice."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Context-limit errors repeat for the same input; nothing about them is transient."
      },
      "D": {
        "trap": "nonexistent-feature",
        "text": "The context limit is the model's, not the batch API's; the same documents fail there too."
      }
    },
    "cite": "Exam guide §4.5"
  },
  {
    "id": "S58",
    "ts": "5.5",
    "s": "de",
    "block": 4,
    "obj": [
      19
    ],
    "bp": {
      "rank": 3
    },
    "q": "Extractions the model marks high-confidence make up 70% of volume and have measured 98% accurate over the last quarter. The operations lead proposes stopping human review of them entirely and putting all reviewer time on the other 30%. New suppliers with unfamiliar layouts join every month. What should the team do?",
    "o": [
      "Stop reviewing high-confidence extractions, as 98% accuracy is above the target",
      "Review a flat random 5% of all extractions, whatever their confidence",
      "Keep a stratified random sample of high-confidence extractions under review",
      "Keep reviewing each high-confidence extraction until a full year of results is in"
    ],
    "a": 2,
    "why": "Stratified random sampling of high-confidence extractions keeps measuring error rates and detects novel error patterns. That matters most when new document types keep arriving.",
    "wrong": {
      "A": {
        "trap": "reactive-too-late",
        "text": "Without any sampling, errors from new layouts go unmeasured until they cause harm."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Flat sampling wastes capacity on the 30% already reviewed and ignores layout segments."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Full review of the most reliable segment spends the limited capacity where it helps least."
      }
    },
    "cite": "Exam guide §5.5; score-report objective 19; learning record 0024"
  },
  {
    "id": "S59",
    "ts": "5.5",
    "s": "de",
    "block": 4,
    "obj": [
      19
    ],
    "bp": {
      "rank": 2
    },
    "q": "The model outputs a confidence score for each field, and anything at 0.90 or above skips review. On a labelled set of 2,000 fields, those at 0.90 or above were correct only 81% of the time for purity values, against 99% for supplier names. Reviewer capacity is fixed at 15% of fields. How should the team set up routing?",
    "o": [
      "Raise the single threshold to 0.97 for each field and send everything below it to review",
      "Ask the model in the prompt to give lower confidence scores when it is unsure of a field",
      "Stop using confidence scores and send a random 15% of the fields to review on each day of the week",
      "Calibrate thresholds per field on the labelled set, and route below-threshold fields to review"
    ],
    "a": 3,
    "why": "Have models output field-level confidence, then calibrate review thresholds using labelled validation sets, and route low-confidence or ambiguous fields to limited reviewer capacity.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "One threshold ignores that the score means different things for different fields, and may exceed capacity."
      },
      "B": {
        "trap": "probabilistic",
        "text": "Instructions do not calibrate self-reported confidence; a labelled set does."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Random selection ignores the signal and puts capacity on fields that are rarely wrong."
      }
    },
    "cite": "Exam guide §5.5; score-report objective 19"
  },
  {
    "id": "S60",
    "ts": "5.6",
    "s": "de",
    "block": 4,
    "obj": [],
    "bp": {
      "rank": 4
    },
    "q": "A supplier-quality report merges findings from two analyses. One reports the supplier's impurity rate as 0.8%, and the other as 0.3%. The synthesis step flagged this as a contradiction and asked for an investigation, but the first figure comes from 2024 certificates and the second from 2026 certificates. What change prevents this misreading?",
    "o": [
      "Have synthesis keep the lower figure as the likely more recent and reliable value",
      "Require the analyses to output the test dates behind each figure",
      "Average the two figures and report 0.55% as the supplier's impurity rate",
      "Drop figures that conflict with another source and report the rate as unavailable"
    ],
    "a": 1,
    "why": "Requiring publication or collection dates in structured outputs prevents temporal differences from being misinterpreted as contradictions.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "Guessing which value is newer is what the missing dates should settle."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Averaging two periods produces a number that describes neither."
      },
      "D": {
        "trap": "error-suppression",
        "text": "Both figures are valid for their periods; dropping them loses real information."
      }
    },
    "cite": "Exam guide §5.6"
  }
];

module.exports = { META, Q };
