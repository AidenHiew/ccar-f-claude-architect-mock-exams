// tutor/build/data/full2.js — Full Mock 2 (built 2026-11-01, plan phase 2): 60 single-answer questions in 4 scenario blocks,
// draw cs+cc+ci+de (DRAWS in statements.js). With the other full mock it covers all 6 guide scenarios and all 30 task statements.
// Most items are earlier papers' questions adapted to one new company setting per block (source noted on each record);
// the rest were written new for slots no earlier item filled. Facts only from reference/ccar-f-official-exam-guide.md and notes/.
'use strict';

const META = {
  "key": "full2",
  "title": "CCA-F Full Mock 2",
  "eyebrow": "Full mock · 60 questions · 4 scenarios",
  "intro": "Sixty exam-level questions in four scenario blocks, like the real exam: Customer Support Resolution Agent, Code Generation with Claude Code, Claude Code for CI and Structured Data Extraction. Full Mock 1 draws a different four, and the two papers together cover all six exam scenarios. Every question has one correct answer. Flag questions to return to them before you submit. Labels stay hidden until grading. Sit it once, in exam mode, with the 120-minute timer on.",
  "defaultMode": "exam",
  "timerDefault": true,
  "minutes": 120,
  "storageKey": "ccaf-full2",
  "blocks": [
    {
      "id": "cs",
      "title": "Customer Support Resolution Agent",
      "intro": "You are building a support agent on the Claude Agent SDK for Loopway, a car-sharing service with 180,000 members in 9 cities. It handles trip charges, damage and cleaning disputes, refunds and membership changes through MCP tools including get_member, lookup_trip, refund_charge, update_membership and escalate_to_human. The goal is to settle most issues in the first chat without the agent acting beyond its authority."
    },
    {
      "id": "cc",
      "title": "Code Generation with Claude Code",
      "intro": "Medlane builds hospital shift-scheduling software: a Python and Django back end, a React front end and about 3,000 files in one repository. Its 22 engineers use Claude Code every day to write new code, refactor, debug and document. You own the team's Claude Code setup: CLAUDE.md files, rules, skills, commands and MCP servers, and you decide when work needs a plan first."
    },
    {
      "id": "ci",
      "title": "Claude Code for CI",
      "intro": "Tallis Travel keeps its Go booking API and TypeScript web app in one monorepo of about 4,000 files. On every pull request, a Buildkite pipeline runs Claude Code with no one at the keyboard: it reviews the change, suggests or writes tests, and posts findings back to the pull request. Nightly jobs handle audits and chores. Scripts read Claude's output as data, and the 30 developers mute the bot when it repeats itself or flags non-problems."
    },
    {
      "id": "de",
      "title": "Structured Data Extraction",
      "intro": "Harlow Mutual, a commercial property insurer, is building a system that extracts structured data from claim documents: contractor repair invoices, building inspection reports, permits, loss runs and certificates of insurance. Claude returns each record through tool use against a JSON schema, and the records feed claims payment and underwriting. Documents vary widely, fields are often missing or contradict each other, and a team of 12 assessors reviews part of the output."
    }
  ]
};

const Q = [
  // B01 · cs 1.1 · adapted from sim2/M01
  {
    "id": "B01",
    "ts": "1.1",
    "s": "cs",
    "block": "cs",
    "q": "The agent's loop stops after 6 iterations whatever the model returned. In 11% of chats about disputed charges across several trips, the loop is cut off while the last response still has stop_reason \"tool_use\", and the customer gets no answer at all. A teammate proposes raising the cap to 12. What change makes the loop end at the right point?",
    "o": [
      "Raise the cap to 12 iterations and log a warning when a chat reaches it",
      "Run tools while stop_reason is \"tool_use\" and finish when it is \"end_turn\"",
      "End the loop at the first response whose text reads like a final answer",
      "Keep looping until a response has no text block, then return it"
    ],
    "a": 1,
    "why": "The loop's control signal is stop_reason: \"tool_use\" means run the requested tool and send the result back, \"end_turn\" means the model has finished. An arbitrary iteration cap as the main stopping rule is a named anti-pattern; it cuts off chats that still have work to do.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "A bigger cap only moves the cut-off point. Longer chats still end mid-task, and the loop still ignores the signal the API gives."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Reading the text to decide when to stop is the natural-language-parsing anti-pattern; a response can hold text and a tool call together."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Text is not a completion signal: a final answer has text, so this loops on after \"end_turn\", and a tool call with no text ends the loop with the tool unrun."
      }
    },
    "cite": "Exam guide §1.1; notes/domain-1-agentic-architecture.md §1.1"
  },
  // B02 · cs 1.1 · adapted from fresh1/F01
  {
    "id": "B02",
    "ts": "1.1",
    "s": "cs",
    "block": "cs",
    "q": "After each tool call, the car-share agent's loop code adds only the word \"OK\" to the conversation, and the model keeps requesting the same get_member lookup. A developer's first fix appended the full get_member result, but each result has 52 fields, of which the agent uses 6, and long chats then hit the context limit by turn 15. What should the loop send back after each tool call?",
    "o": [
      "The tool_result block, trimmed to the 6 fields the agent uses",
      "The tool_result block with all 52 fields, as in the first fix",
      "The \"OK\", plus the 6 fields placed in the system prompt",
      "The \"OK\" only, with the context limit raised for long chats"
    ],
    "a": 0,
    "why": "Two facts decide it. Tool results must be appended to the conversation so the model can reason with them (1.1). Verbose tool output should be trimmed to the relevant fields before it accumulates in context (5.1).",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Appending the result fixes the repeated lookups, but the unused fields are what fill the context by turn 15."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Trimming helps, but results belong in the conversation as tool results, not in the system prompt."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "The model still never sees the data, and a larger budget only delays the bloat."
      }
    },
    "cite": "Exam guide §1.1; exam guide §5.1; notes/domain-1-agentic-architecture.md §1.1"
  },
  // B03 · cs 1.1 · adapted from d145/K02
  {
    "id": "B03",
    "ts": "1.1",
    "s": "cs",
    "block": "cs",
    "q": "To keep requests small, the loop sends each follow-up request with only the system prompt and one new user message holding the latest tool result. In 120 test sessions the model called get_member again on the next turn in 47, and in 19 it asked customers for a membership number they had already given. Each repeat call adds about 2 seconds. What should change?",
    "o": [
      "Add a system prompt line telling the model not to repeat a tool call it has made in this session",
      "Cache get_member results in the MCP server and return them at once on any repeat call",
      "Send the full message history each turn, with the assistant's tool_use turn and its tool_result appended",
      "Summarise the session in one paragraph and send that summary along with each new tool result"
    ],
    "a": 2,
    "why": "The API is stateless. Tool results are appended to the conversation history and the whole history is sent each turn; that is how the model reasons about its next step with what it already learned. Without the history it has no record of the earlier call or of what the customer said.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The model cannot avoid repeating a call it has no record of; the instruction cannot work while the history is missing."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Makes repeat calls faster but leaves them happening, and does nothing for the customer asked twice for their membership number."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Better than nothing, but a paragraph summary drops details and is not the conversation history the loop is meant to carry."
      }
    },
    "cite": "Exam guide §1.1, §5.1; notes/domain-1 §1.1; notes/domain-5 §5.1"
  },
  // B04 · cs 1.4 · adapted from sim2/M04
  {
    "id": "B04",
    "ts": "1.4",
    "s": "cs",
    "block": "cs",
    "q": "Of 3,000 chats closed last month, 7% ended with neither a recorded resolution nor an escalate_to_human call. Some hit max_tokens, some ended on \"end_turn\" after promising a follow-up, and some stopped when a tool threw an error the loop did not catch. The system prompt already says 'Resolve the issue or escalate before ending the chat.' Each of these chats turned into a complaint about 2 days later. What should the team add?",
    "o": [
      "The same prompt line repeated at the end of the system prompt, in bold",
      "Code around the loop that escalates a session left unresolved on exit",
      "A close_case tool the model is told to call as the last step of a chat",
      "A nightly list of unresolved sessions for support leads to work through"
    ],
    "a": 1,
    "why": "The guarantee has to sit in the orchestration layer, outside the model: whatever ended the loop (max_tokens, end_turn, an uncaught tool error), code wrapped around it checks for a resolution or escalation and escalates if neither happened. The prompt line already exists and still misses 7%.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The instruction is already there. Repeating it leaves the outcome to the model, and a tool error or max_tokens stop ends the loop whatever the prompt says."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The model still has to remember the call, and a tool error or max_tokens cut-off ends the loop before it can make it."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "Customers have already been left without an answer for a day; the complaints arrive within 2 days."
      }
    },
    "cite": "Score-report objective 1; exam guide §1.4; notes/domain-1-agentic-architecture.md §1.4"
  },
  // B05 · cs 1.4 · adapted from sim2/M06
  {
    "id": "B05",
    "ts": "1.4",
    "s": "cs",
    "block": "cs",
    "q": "Policy says a membership can be paused for more than 4 weeks only after get_member confirms the account has no unpaid balance. The system prompt states this rule with 2 examples, yet audits find 3% of long pauses were applied to accounts in arrears. Each one costs about $90 in fees that are never collected. What change enforces the rule?",
    "o": [
      "Move the rule to the top of the system prompt and add 4 more arrears examples",
      "Add a PreToolUse hook that blocks long pauses until a clear balance is confirmed",
      "Add a PostToolUse hook that reverses a long pause if the balance is unpaid",
      "Have update_membership add a warning to its result when a balance is unpaid"
    ],
    "a": 1,
    "why": "A business rule with money at stake needs deterministic enforcement. A hook that intercepts the update_membership call can check that get_member returned a clear balance and block the call otherwise. Prompt instructions keep a non-zero failure rate, which the 3% shows.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The rule and examples are already in the prompt. More examples may lower the 3% but cannot make it zero."
      },
      "C": {
        "trap": "reactive-too-late",
        "text": "Right family, wrong event: PostToolUse runs after the pause is applied, so the account is paused, then unpaused, instead of being blocked."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "A warning in the result arrives after the tool ran, so the pause is already in place."
      }
    },
    "cite": "Exam guide §1.4, §1.5; score-report objective 5; notes/domain-1-agentic-architecture.md §1.4–1.5"
  },
  // B06 · cs 1.5 · new (2026-11-01)
  {
    "id": "B06",
    "ts": "1.5",
    "s": "cs",
    "block": "cs",
    "q": "Loopway has 2 problems. Refunds above $250 need a duty manager's approval, but last month the system prompt rule still let 2% of them through. Older cars report trip distance to lookup_trip in miles while newer cars report kilometres, and the agent misjudged distance-based charges in 4% of disputes. Both rules must hold every time. What should the team add?",
    "o": [
      "A PostToolUse hook to block and escalate big refunds; a PreToolUse one for miles",
      "A PreToolUse hook to block and escalate big refunds; a prompt table for miles",
      "A prompt rule to escalate big refunds; a PostToolUse hook to convert the miles",
      "A PreToolUse hook to block and escalate big refunds; a PostToolUse one for miles"
    ],
    "a": 3,
    "why": "A hook on the outgoing refund_charge call can block anything above $250 and send it to escalation before money moves. A hook on lookup_trip's result can convert miles to kilometres before the model reads it. Each problem needs the hook that runs at the right moment, and hooks give the guarantee prompts don't.",
    "wrong": {
      "A": {
        "trap": "reactive-too-late",
        "text": "Both events are swapped: a PostToolUse block runs after the refund is issued, and a PreToolUse hook can't change what lookup_trip returns."
      },
      "B": {
        "trap": "probabilistic",
        "text": "The refund half is right, but a prompt table leaves the conversion to the model, which already gets it wrong in 4% of disputes."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The distance half is right, but a prompt rule is what already lets 2% of big refunds through."
      }
    },
    "cite": "Exam guide §1.5; notes/domain-1-agentic-architecture.md §1.5"
  },
  // B07 · cs 1.5 · new (2026-11-01)
  {
    "id": "B07",
    "ts": "1.5",
    "s": "cs",
    "block": "cs",
    "q": "Marketing wants the agent to mention Loopway's referral credit at the end of chats where the member's issue was resolved, and accepts that some chats will miss it. One engineer proposes a PostToolUse hook that appends the referral line to every refund_charge result; another wants a PreToolUse hook on escalate_to_human. In 2,000 test chats, a one-line system prompt instruction already mentioned it in 91% of resolved chats and in none of the escalated ones. What should the team do?",
    "o": [
      "Add the PostToolUse hook, which puts the referral line in each refund result",
      "Add a PreToolUse hook that blocks escalate_to_human until the line is sent",
      "Add a subagent that reviews each chat and appends the referral when needed",
      "Keep the system prompt line, as nothing here needs a guaranteed outcome"
    ],
    "a": 3,
    "why": "Hooks are for business rules that need guaranteed compliance. This is a soft preference that tolerates misses, and the prompt already meets it 91% of the time while keeping it out of escalated chats. A hook here adds machinery without a requirement that calls for it.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "A PostToolUse hook changes what the model reads from the tool, not what the member sees, and it fires on every refund, resolved or not."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Holds up escalations, which must stay fast, for a marketing line that is allowed to be missed."
      },
      "C": {
        "trap": "over-engineered",
        "text": "A second agent on every chat for a line the prompt already delivers 91% of the time."
      }
    },
    "cite": "Exam guide §1.5; notes/domain-1-agentic-architecture.md §1.5"
  },
  // B08 · cs 2.1 · adapted from d23d/H02
  {
    "id": "B08",
    "ts": "2.1",
    "s": "cs",
    "block": "cs",
    "q": "Two teams added tools to the car-share agent: the payments team's check_status, described as 'Returns the current status', and the fleet team's get_status, described as 'Returns status details'. One reports on a payment or refund, the other on a vehicle. In 38 of 500 chats the agent checked a vehicle when the customer asked whether a refund had gone through. What is the best fix?",
    "o": [
      "Rename both by service and describe what each one reports on",
      "Remove the fleet team's tool, and have the agent ask a colleague about vehicles",
      "Add a system prompt line saying refund questions go to check_status",
      "Detect the word refund in code, then force check_status with tool_choice"
    ],
    "a": 0,
    "why": "Two tools with near-identical names and descriptions can't be told apart. Names that say which service and record each covers, with descriptions to match, remove the ambiguity where the model reads it.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "Takes away a tool the agent needs, to fix a naming problem."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The two names and descriptions still say the same thing, so the rule has to beat the tool list on every call."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Keyword detection in code to force one tool, when the clash is in the names and descriptions."
      }
    },
    "cite": "notes/2026-09-docs-delta §2.1 (namespace tool names; detailed descriptions); notes/domain-2 §2.1 (rename for specificity)"
  },
  // B09 · cs 2.2 · adapted from d2r/R05
  {
    "id": "B09",
    "ts": "2.2",
    "s": "cs",
    "block": "cs",
    "q": "Your get_trip_history MCP tool returns an empty list whenever the trip database query fails. In 4% of conversations the agent tells customers 'I can't find any trips on your account', and logs show each was a database timeout. About 9% of customers have newly created accounts and genuinely have no trips yet. How should get_trip_history respond?",
    "o": [
      "Return isError with a transient category and isRetryable true when the query fails, and keep the empty list for accounts that have no trips",
      "Return one shared 'trip history unavailable' message for both query failures and empty accounts, and let the agent explain it to the customer",
      "Return isError with a transient category for any empty result, and let the agent retry or escalate before it tells the customer anything",
      "Keep the empty list, and add a system prompt rule telling the agent to call get_trip_history a second time whenever the first call returns no trips"
    ],
    "a": 0,
    "why": "An access failure and a successful query with no matches are different outcomes and need different signals. The timeout comes back as a structured, retryable error; a new account's empty list stays a valid result the agent can report truthfully.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "A uniform message removes the false statement but also removes the distinction. The agent can no longer tell a customer with no trips that they have none, nor decide to retry an outage."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Over-corrects: the 9% of new customers with no trips would now be retried and escalated for a correct answer. Empty is a valid result, not a failure."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Retrying on empty guesses at the cause from the outside, doubles calls for every genuine new account, and still reports a no-trips answer if the second call also times out."
      }
    },
    "cite": "Exam guide §2.2; learning record 0016; notes/domain-2 §2.2"
  },
  // B10 · cs 2.3 · adapted from fresh1/F04
  {
    "id": "B10",
    "ts": "2.3",
    "s": "cs",
    "block": "cs",
    "q": "The member-facing agent sees 15 tools, including staff tools such as unlock_any_car and edit_pricing, and called a staff tool in 4% of chats last month. Separately, every chat must begin with verify_member, and in 7% of chats the first response is plain text asking the member a question instead. Staff tools are still needed by the staff agent. What should you configure?",
    "o": [
      "Only its 7 member tools, and verify_member forced first",
      "Limit it to its 7 member tools and add a prompt rule to verify first",
      "Keep all 15 tools and force verify_member on the first turn",
      "Keep all 15 tools and set tool_choice to \"any\" on the first turn"
    ],
    "a": 0,
    "why": "Each agent should get only the tools its role needs, which removes the staff-tool misuse. To guarantee a specific tool is called first, force it with tool_choice {\"type\": \"tool\", \"name\": \"verify_member\"} on the first turn, then continue with \"auto\".",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Scoping fixes the staff-tool calls, but a prompt rule cannot guarantee the first call."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "The first call is guaranteed, but staff tools stay in reach and keep being misused."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "\"any\" forces some tool call, not verify_member, and the staff tools remain."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2-tool-design-mcp.md §2.3"
  },
  // B11 · cs 2.3 · adapted from d23d/H04
  {
    "id": "B11",
    "ts": "2.3",
    "s": "cs",
    "block": "cs",
    "q": "Every car-share chat must end with a case log for reporting, written by one of 3 tools: log_resolved, log_escalated or log_abandoned. The closing request is sent with only those 3 tools attached and tool_choice set to auto. In 7% of chats the agent ends with a goodbye message and no log. Which of the 3 to call depends on how the chat went. What should the closing request use?",
    "o": [
      "tool_choice set to type tool, with name log_resolved, on that request",
      "tool_choice left at auto, with a prompt line saying always finish with a log",
      "tool_choice set to none, with code writing the log from the transcript",
      "tool_choice set to any on the closing request that carries the 3 log tools"
    ],
    "a": 3,
    "why": "any requires a tool call and lets the model choose which. With only the 3 log tools attached, that guarantees a log and keeps the outcome the agent's call. A forced tool fixes one outcome; auto allows plain text.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Forces one outcome on every chat, so escalated and abandoned chats get logged as resolved."
      },
      "B": {
        "trap": "probabilistic",
        "text": "auto still allows a plain goodbye, and a prompt line is a request, not a guarantee."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "none stops tool calls altogether, and code would have to guess the outcome the agent judged."
      }
    },
    "cite": "Exam guide §2.3; notes/2026-09-docs-delta §2.3 (auto / any / tool / none); notes/domain-2 §2.3"
  },
  // B12 · cs 4.2 · adapted from sim2/M11
  {
    "id": "B12",
    "ts": "4.2",
    "s": "cs",
    "block": "cs",
    "q": "The system prompt lists 9 rules for when a dirty or damaged car earns a full refund, a partial credit or a free trip. On mixed cases the agent applies them unevenly: in a review of 150 chats where the car was dirty but the trip went ahead, the same situation got all three outcomes. A 10th rule added last week made no difference. What should the team add?",
    "o": [
      "A severity score from 1 to 10 the agent assigns before choosing an outcome",
      "An 11th rule ranking the 3 outcomes for cars with more than one problem",
      "A refund_decision subagent that applies the 9 rules to each disputed car",
      "3 worked mixed cases, each showing why one outcome beat the other two"
    ],
    "a": 3,
    "why": "When detailed instructions still produce inconsistent results, 2–4 targeted few-shot examples of the ambiguous case, each showing the reasoning for the chosen action over the alternatives, are the most effective fix. Another rule was already tried and made no difference.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "A self-assigned score is another judgement the model makes unevenly; it does not show what the right outcome looks like."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "A 10th rule made no difference; an 11th is more of the same."
      },
      "C": {
        "trap": "over-engineered",
        "text": "A new subagent applies the same 9 rules with the same ambiguity, plus a handoff."
      }
    },
    "cite": "Exam guide §4.2; notes/domain-4-prompt-engineering.md §4.2"
  },
  // B13 · cs 5.1 · adapted from dm/M05
  {
    "id": "B13",
    "ts": "5.1",
    "s": "cs",
    "block": "cs",
    "q": "A member has raised 3 issues in one chat: a late-return fee on trip 8812, a $19.99 cleaning charge on trip 9034, and a dashcam fault on trip 9101. The chat is at 38 turns, and the system summarises older turns into prose once context passes 70%. At turn 41 the agent tells the member the cleaning charge was $19 on trip 9043. What change most reliably prevents this?",
    "o": [
      "Keep the last 20 turns word for word and summarise only the older turns",
      "A summariser instruction to copy each number, amount and trip ID exactly",
      "Each issue's trip number, amount and status in a case-facts block on every request",
      "A fresh lookup_trip call before the agent quotes any amount or trip number"
    ],
    "a": 2,
    "why": "Progressive summarization blurs amounts and identifiers. The guide's fix is a persistent case-facts layer, outside the summarized history, included in every prompt. It also stops a garbled trip number from sending a re-fetch to the wrong trip.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "The cleaning charge came up early, in the turns that still get summarized. A longer window only moves the boundary."
      },
      "B": {
        "trap": "probabilistic",
        "text": "Asking a summarizer to preserve numbers is still lossy compression, and it already garbled one."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "The trip number itself was corrupted to 9043, so the agent would re-fetch the wrong trip."
      }
    },
    "cite": "Exam guide §5.1; learning record 0026 Q42"
  },
  // B14 · cs 5.2 · adapted from sim2/M13
  {
    "id": "B14",
    "ts": "5.2",
    "s": "cs",
    "block": "cs",
    "q": "A member writes: 'Third time this month the car wasn't where the app said. I want to speak to a person now, not a bot.' The agent can see the car's GPS trace and could issue a $45 credit in one tool call, which settles 85% of wrong-location cases. Today the agent offers the credit first and escalates only if the member asks a second time. What should it do here?",
    "o": [
      "Issue the $45 credit now, then offer a transfer if they still want one",
      "Escalate now, passing the GPS trace and the credit it could have given",
      "Ask one question about the car location first, then escalate if they still insist",
      "Score the customer's frustration and escalate only above a set threshold"
    ],
    "a": 1,
    "why": "An explicit request for a human is honoured immediately, without first attempting a resolution. Offering a fix and escalating on a second request is right for frustration alone, not for an explicit demand. The handoff carries the facts the human needs.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Resolving first is right when the member is frustrated but has not asked for a person; here they asked outright."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Investigating before honouring the request is what the guide says not to do."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Sentiment is an unreliable escalation proxy, and the customer has already said what they want."
      }
    },
    "cite": "Exam guide §5.2 and sample question 3; score-report objective 18; notes/domain-5-context-reliability.md §5.2"
  },
  // B15 · cs 5.2 · adapted from d145/K06
  {
    "id": "B15",
    "ts": "5.2",
    "s": "cs",
    "block": "cs",
    "q": "A member asks to be refunded a $62 taxi fare after their car ran out of charge mid-trip because a public charger had silently failed overnight. The credit policy covers billing errors and cars left uncleaned and says nothing about faulty third-party chargers. In 14 such chats the agent applied the standard $40 goodwill credit 8 times and refused 6 times. What should the agent do with this request?",
    "o": [
      "Apply the $40 goodwill credit, which is how the policy treats billing errors",
      "Refuse and explain that the credit policy only covers billing errors and cleaning",
      "Escalate to a human: the credit policy is silent on charger faults",
      "Ask how upset the customer is and escalate if they rate it 4 or more out of 5"
    ],
    "a": 2,
    "why": "A policy gap is an escalation trigger. The policy does not forbid charger-fault credits; it does not address them, and deciding is a human call.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Makes a policy exception on its own authority by analogy with a different case."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Treats silence as a refusal; the policy does not say no, it says nothing."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Sentiment is not complexity; an upset customer with a covered issue should not be escalated, and a calm one with a gap should."
      }
    },
    "cite": "Exam guide §5.2; notes/domain-5 §5.2"
  },
  // B16 · cc 1.6 · adapted from wr4/T16
  {
    "id": "B16",
    "ts": "1.6",
    "s": "cc",
    "block": "cc",
    "q": "About 1 in 25 CI runs fails the rota-export test, and nobody knows why. It has been blamed on test ordering, a shared cache and a slow database container, but none of those has been confirmed, and the last check found the failures happen only on one type of CI runner, which nobody expected. A developer wants Claude Code to find the cause. How should they set up the task?",
    "o": [
      "A fixed checklist: test order first, then the cache, then the database",
      "3 subagents, one per suspected cause, each reporting back once",
      "Start from the failure logs and choose each next check from findings",
      "Give Claude 3 examples of past flaky-test fixes from the repo"
    ],
    "a": 2,
    "why": "An open-ended investigation suits dynamic decomposition: each finding decides the next subtask, instead of a fixed list.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "A fixed sequence covers only the 3 guesses and can't follow the new questions each check raises."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Covers only what is already suspected; none can follow a lead to a fourth cause."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Examples show a format; this is an investigation into an unknown cause."
      }
    },
    "cite": "Exam guide §1.6; notes/domain-1 §1.6"
  },
  // B17 · cc 1.7 · new (2026-11-01)
  {
    "id": "B17",
    "ts": "1.7",
    "s": "cc",
    "block": "cc",
    "q": "An engineer has 2 named Claude Code sessions from last month. rota-map mapped the rota engine; since then only 2 of its 90 files have changed. pay-audit audited the payroll export; since then the export was rewritten, and 40 of its 50 files changed. They now want to continue both investigations. What should they do?",
    "o": [
      "Resume rota-map naming the 2 files; start pay-audit fresh from a summary",
      "Resume both, and in each one name the files that changed since that session",
      "Start both again as new sessions, each seeded with a summary of its findings",
      "Resume pay-audit naming the 40 files; start rota-map fresh from a summary"
    ],
    "a": 0,
    "why": "The choice turns on how much of each session's context is still valid. rota-map's is almost all current, so resume it with --resume and name the 2 changed files for targeted re-analysis. pay-audit's tool results are mostly stale, so a new session seeded with a structured summary is more reliable.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Right for rota-map, but resuming pay-audit brings back tool results for 40 files that no longer exist in that form."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Right for pay-audit, but throws away rota-map's still-valid context for the sake of 2 changed files."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Reversed: it resumes the stale session and discards the current one."
      }
    },
    "cite": "Exam guide §1.7; notes/domain-1-agentic-architecture.md §1.7"
  },
  // B18 · cc 2.4 · new (2026-11-01)
  {
    "id": "B18",
    "ts": "2.4",
    "s": "cc",
    "block": "cc",
    "q": "The team's own MCP server has search_award_rules, which finds any of the 220 pay-award rules by clause number and effective date. Its description says only 'Searches rules', and in 60% of pay questions Claude runs Grep over the rules folder instead and misses rules that changed date. Before using the tool, Claude also calls list_rules 5 to 10 times to see which rules exist. What should the server change?",
    "o": [
      "Expand the tool description and cache list_rules results on the server",
      "Expand the tool description and expose the rule list as an MCP resource",
      "Expose the rule list as an MCP resource and tell Claude to avoid Grep",
      "Deny Grep in settings and expose the rule list as an MCP resource"
    ],
    "a": 1,
    "why": "Two problems, two mechanisms. A detailed description of what the tool does that Grep can't (clause numbers, effective dates) stops Claude preferring the built-in tool. Exposing the rule list as an MCP resource lets Claude see what exists without exploratory list_rules calls.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "The description fix is right, but caching makes the exploratory calls faster without removing them."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The resource is right, but a prompt line against Grep leaves the vague description that causes the preference."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Removes a tool the team uses for everything else to fix one weak description."
      }
    },
    "cite": "Exam guide §2.4; notes/domain-2-tool-design-mcp.md §2.4"
  },
  // B19 · cc 2.5 · adapted from dm/M21
  {
    "id": "B19",
    "ts": "2.5",
    "s": "cc",
    "block": "cc",
    "q": "In the scheduler repo, Claude Code must change a retry limit from 3 to 5 in a YAML file with 4 retry blocks, one per queue. The blocks and the lines around them are byte-for-byte identical, and only the third block should change. Edit has failed 2 times because the target text is not unique. What should it do?",
    "o": [
      "Retry Edit with a longer old string that takes in more of the lines around the third block",
      "Read the full file, then Write it back with only the third block's retry limit changed to 5",
      "Grep for the line number of the third block, then pass that line number to Edit as its target",
      "Run Edit 3 times on the same old string to reach the third match, one occurrence per call"
    ],
    "a": 1,
    "why": "When Edit cannot find unique anchor text, the guide's fallback is Read plus Write: load the whole file and write it back with exactly the intended change.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "The surrounding lines are identical too, so a longer old string is still not unique."
      },
      "C": {
        "trap": "nonexistent-feature",
        "text": "Edit matches unique text, not line numbers. A line number cannot stand in for an anchor."
      },
      "D": {
        "trap": "nonexistent-feature",
        "text": "Edit does not step through matches. A non-unique old string fails on every call."
      }
    },
    "cite": "Exam guide §2.5; 2026-10-09 D2 drill D11"
  },
  // B20 · cc 3.1 · adapted from fresh1/F06
  {
    "id": "B20",
    "ts": "3.1",
    "s": "cc",
    "block": "cc",
    "q": "A developer wants 2 changes. First, the team has agreed that all new endpoints must return errors in the platform's standard JSON shape, and new hires keep missing it. Second, the developer alone is trying an experimental MCP server for a pager-system API this month and doesn't want teammates to get it. Where should each go?",
    "o": [
      "The error rule in the project CLAUDE.md; the server in the project .mcp.json",
      "The error rule in their ~/.claude/CLAUDE.md; the server in their ~/.claude.json",
      "The error rule in the project CLAUDE.md; the server in their ~/.claude.json",
      "The error rule in their ~/.claude/CLAUDE.md; the server in the project .mcp.json"
    ],
    "a": 2,
    "why": "Two facts decide it: who needs each item. A team standard goes in project-level CLAUDE.md, shared through version control. A personal, experimental MCP server goes in the user's own ~/.claude.json, not the project's .mcp.json.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The rule's place is right, but a project .mcp.json is shared with every teammate."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "The server's place is right, but a user-level CLAUDE.md never reaches the new hires."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Both scopes are reversed: the shared rule is personal and the personal server is shared."
      }
    },
    "cite": "Exam guide §3.1; exam guide §2.4; notes/domain-3-claude-code-config.md §3.1"
  },
  // B21 · cc 3.1 · adapted from d23c/C12
  {
    "id": "B21",
    "ts": "3.1",
    "s": "cc",
    "block": "cc",
    "q": "The team's committed CLAUDE.md bans raw SQL in Django view functions. Two of the 22 engineers say Claude keeps writing raw SQL in views for them, and both switched to a new terminal setup last week. Everyone else's sessions follow the rule. One of the two asks whether to paste the rule into their own CLAUDE.local.md. What should they do first?",
    "o": [
      "Paste the rule into their CLAUDE.local.md, as they suggest",
      "Add a PostToolUse hook that rejects raw SQL in any view function",
      "Move the rule to the top of CLAUDE.md, in capitals with examples",
      "Run /memory in an affected session first, to check what loads"
    ],
    "a": 3,
    "why": "When the same rule works for most people and not for a few, check what their sessions actually load before adding config. /memory shows the loaded memory files.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "A copy that may hide whatever stops the team file loading, and it will drift."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Builds enforcement before finding out why 2 setups differ."
      },
      "C": {
        "trap": "probabilistic",
        "text": "20 people's sessions follow it as written. Emphasis doesn't explain the 2."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1 (/memory to verify loaded files)"
  },
  // B22 · cc 3.2 · adapted from sim3/N20
  {
    "id": "B22",
    "ts": "3.2",
    "s": "cc",
    "block": "cc",
    "q": "The team's /trace-swaps skill walks every module that touches shift swaps and prints about 3,000 lines of findings into the session. Developers usually run it before starting a change, and afterwards Claude often loses track of the change it was asked to make. They only need the 20-line summary at the end. Which line should you add to the skill's SKILL.md frontmatter?",
    "o": [
      "model: haiku",
      "allowed-tools: Read",
      "argument-hint: [module]",
      "context: fork"
    ],
    "a": 3,
    "why": "context: fork runs the skill in an isolated sub-agent context. Its verbose working output stays there, and only the result comes back, keeping the main conversation focused on the change.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "A smaller model may run faster, but its 3,000 lines still land in the main session."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "This limits which tools the skill may use; the volume of output it returns is unchanged."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "A prompt for a module name may narrow some runs, but whatever the skill prints still fills the main conversation."
      }
    },
    "cite": "Exam guide §3.2; notes/domain-3-claude-code-config.md §3.2; notes/2026-09-docs-delta.md §3.2 (frontmatter keys)"
  },
  // B23 · cc 3.3 · adapted from wr3/T20
  {
    "id": "B23",
    "ts": "3.3",
    "s": "cc",
    "block": "cc",
    "q": "An engineer added .claude/rules/terraform.md with paths: [\"infra/**/*.tf\"]. In one session they asked how the deploy pipeline works, Claude read only 2 YAML files under .github/, and /memory did not list the rule. In a later session where Claude edited infra/network/main.tf, /memory did list it. What explains the difference?",
    "o": [
      "Rules files load only if the root CLAUDE.md imports them with an @ line",
      "It loads only once Claude works with a matching file; session 1 had none",
      "Rules match the folder the session started in, not the files Claude reads",
      "A rule loads only for files open in the editor when the session starts"
    ],
    "a": 1,
    "why": "A path-scoped rule loads when Claude works with a file matching its glob. The first session touched only YAML files, so the rule rightly stayed out of context; nothing is broken.",
    "wrong": {
      "A": {
        "trap": "nonexistent-feature",
        "text": "No import is needed; the same rule loaded in the second session without one."
      },
      "C": {
        "trap": "nonexistent-feature",
        "text": "Path rules match the files Claude works with; both sessions started in the same repository."
      },
      "D": {
        "trap": "nonexistent-feature",
        "text": "Nothing about the editor decides it; the rule loaded once Claude edited a matching file."
      }
    },
    "cite": "Exam guide §3.3; notes/domain-3 §3.3; lesson 23 (when does it fire)"
  },
  // B24 · cc 3.4 · adapted from sim3/N23
  {
    "id": "B24",
    "ts": "3.4",
    "s": "cc",
    "block": "cc",
    "q": "The team must move SMS notifications from one provider's SDK to another's before the current contract ends in 9 weeks. The old SDK is called from 52 files across 6 services, and there are 2 ways to do it: an adapter layer or a rewrite of each call site. Nobody has yet mapped which services depend on the old SDK's retry behaviour. Which workflow fits?",
    "o": [
      "Direct execution on the smallest service first, then repeat the pattern",
      "Explore subagent to map the call sites, then direct execution on all 52",
      "Direct execution with a prompt that lists all 52 files and the adapter design",
      "Plan mode to map call sites and choose an approach, then direct execution"
    ],
    "a": 3,
    "why": "Many files, two valid approaches and an unmapped dependency are what plan mode is for: explore and design before changing code. Once the approach is chosen, direct execution carries out the plan.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The pattern from one small service may not fit the others; the unmapped retry dependencies surface late, as rework."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Mapping the call sites is half of it; the choice between the 2 approaches is never designed or reviewed before the edits start."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "It commits to the adapter before anyone knows which services rely on the retry behaviour."
      }
    },
    "cite": "Exam guide §3.4; score-report objective 9; notes/domain-3-claude-code-config.md §3.4"
  },
  // B25 · cc 3.4 · adapted from sim2/M24
  {
    "id": "B25",
    "ts": "3.4",
    "s": "cc",
    "block": "cc",
    "q": "An error report shows a TypeError in formatShiftTotal in rota/format.ts, line 48, when a rota has no shifts. The fix is a guard for an empty array in that one function, and an existing test file covers the function. A teammate suggests plan mode in case other callers are affected. Which approach fits?",
    "o": [
      "Direct execution: add the guard and a test for the empty case",
      "Plan mode to map each caller of formatShiftTotal first",
      "The Explore subagent on the rota service first, then plan mode",
      "Plan mode, with the plan sent to the team lead for approval"
    ],
    "a": 0,
    "why": "A single-function bug with a clear stack trace and an obvious fix is a well-scoped change; direct execution is the right mode. The guard only changes behaviour for empty rotas, which currently crash.",
    "wrong": {
      "B": {
        "trap": "over-engineered",
        "text": "Mapping callers is planning for a change with no architectural impact; the fix is local."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Discovery tools suit large unknown areas, not one line in a known function."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Stakeholder review fits architectural changes; this is a one-line guard."
      }
    },
    "cite": "Exam guide §3.4; score-report objective 9; notes/domain-3-claude-code-config.md §3.4"
  },
  // B26 · cc 3.5 · adapted from wr6/T03
  {
    "id": "B26",
    "ts": "3.5",
    "s": "cc",
    "block": "cc",
    "q": "Claude is rewriting the overtime pay function. The payroll team has listed 11 rules it must follow, including time-and-a-half after 38 hours, a 4-hour minimum for call-outs, a night-shift loading of 15%, and double time on public holidays. The current version gets 2 of the 11 wrong, and the function must return within 50 ms for a rota with 400 lines. How should the developer drive the rewrite?",
    "o": [
      "Give Claude 3 rotas, each with the exact pay it should come to",
      "Use plan mode to have Claude design the function, then approve it",
      "Have Claude ask them about the pay rules before it changes code",
      "Write tests for the 11 rules and 50 ms limit, then share failures"
    ],
    "a": 3,
    "why": "The rules and the performance target are known. Tests written first, with failures shared after each round, check all 11 rules and the speed on every iteration.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "3 rotas can't cover 11 listed rules, and nothing in them checks the 50 ms limit."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "A plan says how to build it; nothing checks the 11 rules or the speed after each change."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "The interview surfaces cases nobody has thought of; the payroll team has already listed all 11."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5; lesson 29"
  },
  // B27 · cc 4.2 · adapted from wr6/T02
  {
    "id": "B27",
    "ts": "4.2",
    "s": "cc",
    "block": "cc",
    "q": "Developers run the team's /review-tests skill before opening a pull request; it lists new code branches that have no test. Its SKILL.md holds 7 rules for when a missing test counts, yet developers ignore about half of its list, mostly branches that are fine untested, such as a fallback that only writes a log line. Each rule added fixed only the case it named, and new kinds of branch turn up weekly. The root CLAUDE.md is already 300 lines and loads in every session. What should you add, and where?",
    "o": [
      "3 hard branches, each marked a real gap or fine with the reason, in SKILL.md",
      "3 hard branches, each marked a real gap or fine with the reason, in CLAUDE.md",
      "An 8th rule for log-only fallback branches, added to the skill's SKILL.md",
      "15 clear examples of missing tests from last month, added to the SKILL.md"
    ],
    "a": 0,
    "why": "Two facts decide it. Rules keep missing new shapes, so a few hard examples that show the reasoning (why one branch is a real gap and another is fine) let the model generalise to branches no rule names. The examples serve one on-demand check, so they belong in the skill, not in the always-loaded CLAUDE.md.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "The right examples in the wrong place: CLAUDE.md loads in every session, and these only matter when the skill runs."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Covers this week's shape; each added rule has fixed only the case it named."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Clear-cut cases teach what is already easy; none shows where the line between a real gap and a fine branch falls."
      }
    },
    "cite": "Exam guide §4.2; Exam guide §3.2; notes/domain-4-prompt-engineering.md §4.2"
  },
  // B28 · cc 5.1 · adapted from fresh1/F10
  {
    "id": "B28",
    "ts": "5.1",
    "s": "cc",
    "block": "cc",
    "q": "A team skill, /module-digest, gathers the findings of 30 module audits and pastes them one after another into a single 40-page input, then asks Claude for a summary for the tech lead. The summaries reliably cover the first and last few modules but leave out findings from the middle in about 1 run in 3, even when those findings are serious. The input is within the context limit. What should change in how the skill assembles the input?",
    "o": [
      "Shuffle the order of the 30 modules' findings on each run",
      "A key-findings summary first, and a header for each module",
      "Cut the input down to the 10 modules that had the most findings",
      "Tell Claude to read the whole input carefully"
    ],
    "a": 1,
    "why": "Models reliably process the beginning and end of long inputs and may miss the middle (\"lost in the middle\"). Placing a key-findings summary at the start and organising the details under explicit section headers reduces the position effect.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Shuffling moves which findings get lost; it does not stop the loss."
      },
      "C": {
        "trap": "error-suppression",
        "text": "This throws away findings to shorten the input; the problem was position, not size."
      },
      "D": {
        "trap": "probabilistic",
        "text": "An instruction does not change how the model attends to the middle of long inputs."
      }
    },
    "cite": "Exam guide §5.1; notes/domain-5-context-reliability.md §5.1"
  },
  // B29 · cc 5.4 · adapted from dm/M22
  {
    "id": "B29",
    "ts": "5.4",
    "s": "cc",
    "block": "cc",
    "q": "You are mapping a legacy rostering engine of 1,200 files across several days of Claude Code sessions. By the third hour of each session, answers start referring to 'typical scheduling patterns' instead of the classes found earlier. Each new day also starts by re-reading the same 30 files. Which approach best sustains the exploration?",
    "o": [
      "Work in one long session per day, and run /compact whenever the context passes about 80% full",
      "Add the 30 most-read files to CLAUDE.md with @import, and load them at the start of each session",
      "Delegate specific questions to subagents, and keep a scratchpad file of key findings for later questions and sessions",
      "Resume the previous day's session with --resume each morning and continue with yesterday's full context"
    ],
    "a": 2,
    "why": "Generic answers are the guide's sign of context degradation. Subagents keep verbose exploration out of the main context, and a scratchpad file carries key findings across context boundaries and days.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "/compact helps within a session, but nothing durable carries findings to the next day, so the re-reading continues."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Loading 30 raw files into every session fills the context the exploration needs."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Resuming brings back the same degraded context."
      }
    },
    "cite": "Exam guide §5.4; score report objective 15 (0%); lesson 0012"
  },
  // B30 · cc 5.4 · adapted from sim3/N45
  {
    "id": "B30",
    "ts": "5.4",
    "s": "cc",
    "block": "cc",
    "q": "Over a weekend, a Claude Code coordinator session runs 5 explorer subagents to document the nightly batch jobs. On Sunday the process crashed after 3 explorers had finished. The restarted coordinator had no record of their findings, and all 5 were run again for another 9 hours. What design avoids repeating finished work after a crash?",
    "o": [
      "Have the coordinator save one summary of all findings when the run ends",
      "Explorers save results to files; on restart the coordinator reads an index",
      "Have each explorer keep its findings in its own context until asked again",
      "Have the coordinator log each explorer's start time and rerun unfinished"
    ],
    "a": 1,
    "why": "Crash recovery needs structured state outside the process: each agent exports its state to a known location, and on restart the coordinator loads the index of what finished, injects those findings, and runs only the rest.",
    "wrong": {
      "A": {
        "trap": "reactive-too-late",
        "text": "A crash before the end leaves nothing saved, which is exactly what happened."
      },
      "C": {
        "trap": "nonexistent-feature",
        "text": "A subagent's context does not outlive its run, let alone a crash of the whole process."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Start times say who began, not what they found; the finished explorers' findings are still lost."
      }
    },
    "cite": "Exam guide §5.4; score-report objective 15; notes/domain-5-context-reliability.md §5.4"
  },
  // B31 · ci 3.1 · adapted from gauntlet/G21 (rewritten for a CI job)
  {
    "id": "B31",
    "ts": "3.1",
    "s": "ci",
    "block": "ci",
    "q": "The review job pipes each pull request's diff into claude -p and never asks Claude to open files. The booking service's 25 lines of review criteria sit in services/booking/CLAUDE.md, and local sessions that edit booking code follow them. In CI, reviews of booking changes ignored them in all 40 runs sampled. What should change?",
    "o": [
      "Move the criteria to .claude/rules/ with paths set to services/booking/**",
      "Add the criteria to each developer's CLAUDE.local.md at the repository root",
      "Add 'apply the booking service standards' to the review job's prompt line",
      "Move the criteria to a file @imported from the repository's root CLAUDE.md"
    ],
    "a": 3,
    "why": "A subdirectory CLAUDE.md loads only when Claude reads a file in that directory. The CI job hands Claude a diff and opens no files, so services/booking/CLAUDE.md never loads. The root CLAUDE.md loads at launch, so importing the criteria from it puts them in every review.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "A path-scoped rule also loads only when Claude works with a matching file, and the CI job opens none."
      },
      "B": {
        "trap": "blame-shifting",
        "text": "CLAUDE.local.md is personal and stays out of git, so the CI runner never has it."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Names the standards without giving Claude their content, which still never loads."
      }
    },
    "cite": "Exam guide §3.1; Exam guide §3.6; notes/domain-3-claude-code-config.md §3.1 (subdirectory files load lazily when Claude reads files there)"
  },
  // B32 · ci 3.2 · new (2026-11-01)
  {
    "id": "B32",
    "ts": "3.2",
    "s": "ci",
    "block": "ci",
    "q": "Tallis's project skill /release-notes reads release/merged-prs.json, which the pipeline writes, and prints draft release notes from it. CI runs it nightly through claude -p, and developers run it by hand. In 3 of the last 40 runs it also edited CHANGELOG.md directly, which broke the release script. Developers who type /release-notes without a version often get notes for the wrong release, as the skill then picks the latest tag. What should you add to the skill?",
    "o": [
      "allowed-tools limited to Read and Grep, plus context: fork for isolation",
      "context: fork for isolation, plus argument-hint: [version] for the input",
      "allowed-tools limited to Read and Grep, plus argument-hint: [version]",
      "A SKILL.md line asking it not to edit files, plus argument-hint: [version]"
    ],
    "a": 2,
    "why": "allowed-tools in the frontmatter restricts which tools the skill can use, so it can no longer edit CHANGELOG.md. argument-hint prompts a developer for the version when they invoke the skill without one.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The tool limit is right, but context: fork changes where the skill runs, not whether it gets the version."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "The version prompt is right, but a forked context can still edit files."
      },
      "D": {
        "trap": "probabilistic",
        "text": "The version prompt is right, but a request inside the skill is guidance it has already ignored 3 times."
      }
    },
    "cite": "Exam guide §3.2; notes/domain-3-claude-code-config.md §3.2"
  },
  // B33 · ci 3.5 · adapted from dm/M30
  {
    "id": "B33",
    "ts": "3.5",
    "s": "ci",
    "block": "ci",
    "q": "A CI run flagged 3 problems in the baggage-fee module. The weight-rounding function rounds 23.45 kg down to 23 kg instead of up to 24 kg, and the fee step multiplies that rounded weight by the route's excess-baggage rate. Separately, a log message misspells 'surcharge'. How should you present these problems to Claude Code?",
    "o": [
      "Describe all 3 problems together in one message, with the file and line number for each",
      "Describe the rounding and fee problems in one message, and the log typo separately",
      "Fix them one at a time in 3 messages, starting with rounding, and check each fix before the next",
      "Open 3 separate Claude Code sessions, one per problem, and let each focus on a single issue"
    ],
    "a": 1,
    "why": "Problems that interact go in one message, so the fixes are designed together. Here the fee step consumes the rounded weight. An independent problem is handled separately. Being found together is not a reason to bundle.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Being found in the same module and run is proximity, not interaction. The typo does not touch the fee logic."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Sequential fixes suit independent problems. Here fixing rounding alone changes what the fee step receives."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Separate sessions split two interacting problems apart, inviting conflicting fixes."
      }
    },
    "cite": "Exam guide §3.5; learning records 0022 Q10, 0025; lesson 0018"
  },
  // B34 · ci 3.6 · adapted from d23c/C28
  {
    "id": "B34",
    "ts": "3.6",
    "s": "ci",
    "block": "ci",
    "q": "A CI job runs claude -p to generate unit tests for changed Go packages. 35% of the generated tests don't compile, because they build structs by hand instead of using the team's test fixtures and builder helpers. Those conventions are written down only in a wiki page. The prompt says 'follow our testing conventions'. What should change?",
    "o": [
      "Retry the job until the generated tests compile, up to 3 times",
      "Put the test conventions and fixture helpers in the project's CLAUDE.md",
      "Make the prompt line stronger: 'you MUST follow our conventions'",
      "Run with --output-format json and drop tests that fail to compile"
    ],
    "a": 1,
    "why": "CLAUDE.md gives CI runs project context, such as testing standards and fixture conventions. Claude can't follow conventions it can't see, and a wiki page isn't loaded.",
    "wrong": {
      "A": {
        "trap": "reactive-too-late",
        "text": "Repeats generation without the conventions it lacks."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Emphasis on conventions Claude has never seen."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Shapes the output and discards failures, without fixing the cause."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6"
  },
  // B35 · ci 3.6 · adapted from d23c/C29
  {
    "id": "B35",
    "ts": "3.6",
    "s": "ci",
    "block": "ci",
    "q": "Another CI job suggests missing tests for the web module changed in each pull request. It receives only the diff, and 1 in 3 of its suggestions already exists as a Jest test in that module, often under a different name. What should change?",
    "o": [
      "Drop suggestions that match an existing test name before posting",
      "Include the module's existing test files in its context",
      "List the module's test names in the prompt and ask to skip those",
      "Run the job with --json-schema to give each suggestion a name"
    ],
    "a": 1,
    "why": "To avoid duplicate test suggestions, give Claude the existing tests in context. It can only skip what it can see.",
    "wrong": {
      "A": {
        "trap": "reactive-too-late",
        "text": "Catches only exact names, after generation, and the stem says many duplicates have different names."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Names alone don't show what each test covers, and the duplicates often have different names."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Structures the output but doesn't tell Claude what exists."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6"
  },
  // B36 · ci 3.6 · adapted from d23/F29
  {
    "id": "B36",
    "ts": "3.6",
    "s": "ci",
    "block": "ci",
    "q": "A nightly Buildkite job runs claude 'update the changelog from merged PRs' and has hit the 6-hour job timeout on 4 of the last 5 nights. The logs show Claude's opening output and then nothing until the runner kills the job. The same command finishes in 2 minutes when a developer runs it at their desk. What is the fix?",
    "o": [
      "Set CLAUDE_HEADLESS=true in the job's environment before running",
      "Add --output-format json to the command for machine-readable output",
      "Run it as claude -p 'update the changelog from merged PRs'",
      "Redirect the job's stdin from /dev/null to stop it waiting on input"
    ],
    "a": 2,
    "why": "Without -p (--print), Claude Code starts an interactive session and waits for input, which never comes in CI. -p runs the prompt non-interactively and exits.",
    "wrong": {
      "A": {
        "trap": "nonexistent-feature",
        "text": "No such variable. The documented way to run non-interactively is the -p flag."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "A real flag, but it shapes the output of a print-mode run. Without -p the session is still interactive and still waits."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "A shell workaround that doesn't put Claude Code in non-interactive mode."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6"
  },
  // B37 · ci 3.6 · adapted from d23/F30
  {
    "id": "B37",
    "ts": "3.6",
    "s": "ci",
    "block": "ci",
    "q": "A Buildkite job asks Claude to fix failing tests and then, in the same session, to review its own diff before the PR opens. Over 50 runs the review step approved each diff, while human reviewers later found 11 real problems in those PRs. The review prompt already asks Claude to be critical and to list at least 3 risks. What change would most improve the review?",
    "o": [
      "Make the review prompt stricter, requiring 5 risks and a severity rating for each of them",
      "Ask the same session to review the diff twice and report only issues found both times",
      "Add a CLAUDE.md section listing the review criteria the session should apply",
      "Run the review as a separate claude -p instance that sees only the diff and the tests"
    ],
    "a": 3,
    "why": "A session that generated code keeps its reasoning context and is unlikely to question its own decisions. An independent instance without the generation context reviews the diff on its own merits.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "A stricter prompt was already in place. The reviewer still carries the reasoning that produced the diff."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Two passes by the same context repeat the same blind spots, and requiring agreement filters out more findings."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Criteria help, but the reviewer is still the session that wrote the fix and won't question its own decisions."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6"
  },
  // B38 · ci 4.1 · adapted from wr2/V04
  {
    "id": "B38",
    "ts": "4.1",
    "s": "ci",
    "block": "ci",
    "q": "The review labels each finding blocker, major or minor, and a blocker stops the merge. Across 60 pull requests, the same finding, an unscoped query that loads every customer booking in a handler, was labelled blocker 7 times, major 11 times and minor 4 times. The prompt says \"use blocker for anything that could hurt travellers or the business\". What change makes the labels consistent?",
    "o": [
      "Have the model add a 0–1 score to each finding and use blocker only above 0.9",
      "Let 2 developers vote on the level of any blocker that someone overrides",
      "For each level, state what qualifies and show a code finding for it",
      "Define blocker precisely and leave major and minor to the model's judgement"
    ],
    "a": 2,
    "why": "Consistent severity needs explicit criteria for each level with a concrete code example of what belongs there. \"Anything that could hurt\" leaves every call to the model's judgement in the moment.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "A score from the same undefined standard; nothing says where blocker ends and major starts."
      },
      "B": {
        "trap": "blame-shifting",
        "text": "Moves the inconsistency to developers after the merge is already blocked, instead of fixing the prompt."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Fixes only the top level; the same finding also split 11 to 4 between major and minor, and a definition without an example still leaves borderline calls open."
      }
    },
    "cite": "Exam guide §4.1; notes/domain-4 §4.1"
  },
  // B39 · ci 4.1 · adapted from dm/M28
  {
    "id": "B39",
    "ts": "4.1",
    "s": "ci",
    "block": "ci",
    "q": "The pull-request review posts findings in 4 categories. Engineers dismiss 80% of naming findings, and in a survey they said they now skim past the security findings too, which are accurate 93% of the time. Last sprint, adding 3 examples to the naming prompt moved the dismissal rate by under 2 points. A full rewrite of the naming criteria will take about 2 weeks. What should you do now?",
    "o": [
      "Keep naming findings but tag them as low priority, with a filter for them in the pull request view",
      "Add 5 few-shot examples of acceptable names to the prompt this week, ahead of the full criteria rewrite",
      "Disable the naming category now to restore trust, and re-enable it once the rewritten criteria are tested",
      "Merge naming into the style category and cut the number of categories engineers must read to 3"
    ],
    "a": 2,
    "why": "High false-positive categories undermine trust in the accurate ones. The guide's move is to disable the noisy category temporarily while its criteria are improved.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "The noise still lands on every PR. The trust damage is already spreading to security findings."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Examples are part of the proper fix, which needs testing. Meanwhile 80% noise keeps eroding trust in the accurate security findings."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Renaming the bucket keeps every false positive and spreads them into another category."
      }
    },
    "cite": "Exam guide §4.1; learning record 0019 Q8"
  },
  // B40 · ci 4.2 · adapted from wr4/T17
  {
    "id": "B40",
    "ts": "4.2",
    "s": "ci",
    "block": "ci",
    "q": "The Buildkite review job posts comments on each pull request. The prompt lists the 4 parts each comment needs: file and line, the problem, severity and a suggested fix. About half the comments leave out the line or the fix, and the order of the parts changes from comment to comment. A longer version of the instruction 2 weeks ago changed nothing. What should you add to the prompt?",
    "o": [
      "A sentence saying comments missing a part will be rejected",
      "A step where a second job rewrites each comment into 4 parts",
      "3 example comments with file and line, problem, severity, fix",
      "A cut-off that trims each comment to its first 80 words"
    ],
    "a": 2,
    "why": "Few-shot examples are the most effective way to get consistently formatted output when detailed instructions alone produce inconsistent results, here showing location, issue, severity and fix.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "More instruction; a longer instruction was already tried and changed nothing."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Adds a job to repair output the prompt could get right; a second job can't add a fix the first never wrote."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Shortens long comments but can't add a missing line or fix, and may cut one off."
      }
    },
    "cite": "Exam guide §4.2; notes/domain-4 §4.2"
  },
  // B41 · ci 4.3 · adapted from gauntlet/G37 (rewritten as a schema-limits item)
  {
    "id": "B41",
    "ts": "4.3",
    "s": "ci",
    "block": "ci",
    "q": "The review job already returns findings through --output-format json with --json-schema, and every run parses. But about 5% of findings give a line number outside the lines the pull request changed, and the bot then fails to post them. An engineer proposes tightening the schema until those findings are impossible. What is the best response?",
    "o": [
      "Validate each finding's line against the diff in the posting script",
      "Give the line field a minimum and maximum from the file's line count",
      "Add 3 example findings to the prompt, each with a line inside the diff",
      "Drop --json-schema and ask for findings as text for the script to parse"
    ],
    "a": 0,
    "why": "A strict schema guarantees the shape of the output, not that its values are right. Whether a line is inside this pull request's diff is a semantic fact the schema can't express, so a check against the diff in code is what catches it.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "A line can be inside the file and still outside the changed lines, so the bounds miss most of these findings."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Examples may lower the rate but don't guarantee it, and a check in code costs almost nothing."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Brings back the parsing failures the schema removed, and still doesn't check the line."
      }
    },
    "cite": "Exam guide §4.3; notes/domain-4-prompt-engineering.md §4.3"
  },
  // B42 · ci 4.4 · adapted from wr1/W17
  {
    "id": "B42",
    "ts": "4.4",
    "s": "ci",
    "block": "ci",
    "q": "Tallis developers dismiss 38% of the pull-request review's findings. The team wants to cut the noise but cannot tell which kinds of code produce the dismissed findings, because each finding is free text. 1,900 findings were posted last month. What should you change first?",
    "o": [
      "Tag each finding with the code pattern that triggered it, then group dismissals",
      "Ask developers to reply with a reason each time they dismiss a finding",
      "Run a second review instance that removes findings it disagrees with",
      "Have the model attach a 0–1 confidence to each finding and hide low ones"
    ],
    "a": 0,
    "why": "Tagging each finding with the code construct that triggered it (a detected_pattern field) lets dismissals be grouped by pattern and the worst patterns fixed. Without it the team still cannot see what to change.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Free-text reasons are another pile of unstructured text, and depend on developers writing them."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Filters output without showing which patterns cause the noise."
      },
      "D": {
        "trap": "probabilistic",
        "text": "A self-assigned number filters without explaining anything, and nobody would know which kinds of finding it hides."
      }
    },
    "cite": "Exam guide §4.4; notes/domain-4 §4.4"
  },
  // B43 · ci 4.5 · adapted from fresh1/F15
  {
    "id": "B43",
    "ts": "4.5",
    "s": "ci",
    "block": "ci",
    "q": "Tallis plans a one-off job: Claude writes doc comments for 40,000 exported Go functions through the Message Batches API, with results due in 2 weeks. The prompt is new and has been tried on 5 functions. The last large batch the team ran used an untested prompt: 18% of results failed review, and resubmitting and fixing them nearly doubled the cost. What should the team do before submitting the 40,000?",
    "o": [
      "Submit all 40,000 and resubmit failures by custom_id afterwards",
      "Refine the prompt on a sample of a few hundred first",
      "Use the synchronous API for all 40,000 to see failures sooner",
      "Split the 40,000 into 4 batches of 10,000 sent on the same day"
    ],
    "a": 1,
    "why": "Refining the prompt on a sample set before batch-processing large volumes raises the first-pass success rate and cuts resubmission costs. The batch API still suits the job itself, which has a 2-week deadline.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Resubmitting by custom_id is right for failures, but the last large batch shows this path nearly doubles the cost."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "This gives up the 50% saving on a job with 2 weeks of slack."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "4 batches with the same untested prompt fail at the same rate."
      }
    },
    "cite": "Exam guide §4.5; notes/domain-4-prompt-engineering.md §4.5"
  },
  // B44 · ci 4.5 · adapted from dm/M29
  {
    "id": "B44",
    "ts": "4.5",
    "s": "ci",
    "block": "ci",
    "q": "The Buildkite pipeline runs 2 Claude jobs: a pre-merge review that blocks each PR until it finishes, about 120 per day, and a nightly audit of the whole repository that people read the next morning. To cut costs, your manager wants both moved to the Message Batches API to halve the cost. What should you do?",
    "o": [
      "Move the nightly audit to the Batch API, and keep the pre-merge review on the synchronous API",
      "Move both to the Batch API, with a 20-minute timeout that falls back to the synchronous API for pre-merge",
      "Move both to the Batch API, and post a PR comment as each pre-merge result arrives",
      "Keep both synchronous, and cut cost by trimming the diff and prompt context sent to each job"
    ],
    "a": 0,
    "why": "Match the API to each job's latency need. Batch processing suits latency-tolerant work such as overnight audits, and it has no latency SLA, so blocking pre-merge checks stay synchronous.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Every timeout leaves a developer blocked for 20 minutes and then pays full price anyway."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "A comment on arrival does not unblock the merge. Batches have no latency SLA, and PRs could wait up to 24 hours."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Trimming context saves a little on both jobs but leaves the nightly audit at full price when it has no latency need."
      }
    },
    "cite": "Exam guide §4.5; learning records 0001, 0026 Q46; lesson 0001"
  },
  // B45 · ci 4.6 · new (2026-11-01)
  {
    "id": "B45",
    "ts": "4.6",
    "s": "ci",
    "block": "ci",
    "q": "Each nightly refactor is reviewed by a separate claude -p instance that did not write it: one pass per changed file, then a cross-file pass. A typical night produces about 40 findings, but the 3 on-call engineers can check only about 10 before the morning deploy. A check of last month's 1,200 findings showed the model's self-reported confidence tracks reality: high-confidence findings were real 6 times as often as low-confidence ones. Last week the 2 real bugs were findings 31 and 37 in the posted order, and nobody reached them. The engineers want the likeliest real problems checked first, without losing the rest. What should the review add?",
    "o": [
      "A confidence the model reports on each finding, used to order the queue",
      "A 0.8 confidence cut-off, with only the findings above it posted at all",
      "An order by how many lines each finding's file changed in the refactor",
      "A third pass that repeats the review and keeps only findings found twice"
    ],
    "a": 0,
    "why": "A verification pass in which the model reports its confidence alongside each finding enables calibrated review routing: the engineers' 10 checks go to the findings most likely to be real, and the rest stay in the queue instead of being dropped.",
    "wrong": {
      "B": {
        "trap": "error-suppression",
        "text": "Uses the same confidence to hide findings instead of ordering them; a real bug under the cut-off is never seen."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Lines changed measures the size of the edit, not how likely a finding is to be a real problem."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Doubles the review cost and drops real findings that one pass happened to miss, without ordering what is left."
      }
    },
    "cite": "Exam guide §4.6; notes/domain-4-prompt-engineering.md §4.6"
  },
  // B46 · de 1.4 · new (2026-11-01)
  {
    "id": "B46",
    "ts": "1.4",
    "s": "de",
    "block": "de",
    "q": "When the pipeline can't settle a claim, it hands the case to an assessor, who has the documents but not the pipeline's reasoning. Assessors report spending about 12 minutes a case re-finding which pages held the figures that disagree, in bundles of up to 60 pages. The current handoff gives the claim ID and the message 'Extraction conflict, please review'. What should the handoff contain?",
    "o": [
      "Claim ID, each conflicting value, a root cause and a recommended next step",
      "Claim ID, the full pipeline transcript, and the bundle with pages numbered",
      "Claim ID, each conflicting value with its page, the conflict and a next step",
      "Claim ID, an overall confidence score and a priority from 1 to 5 for the case"
    ],
    "a": 2,
    "why": "A structured handoff gives the human what the pipeline already established, in fields they can act on. Here the time goes on finding the conflicting figures, so each value needs its source page alongside the conflict and the recommended next step.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Close, but without the pages the assessor still hunts through 60 pages for each figure."
      },
      "B": {
        "trap": "over-engineered",
        "text": "The assessor has to read the pipeline's work to rebuild what a summary would state."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Says how urgent the case is, not what conflicts or where."
      }
    },
    "cite": "Exam guide §1.4; Exam guide §5.6; notes/domain-1-agentic-architecture.md §1.4"
  },
  // B47 · de 1.4 · adapted from dm/M07 (rewritten for claims)
  {
    "id": "B47",
    "ts": "1.4",
    "s": "de",
    "block": "de",
    "q": "One claim email covers 3 separate losses from a storm: roof damage, spoiled refrigerated stock and 2 weeks of lost trade. One prompt extracts everything into a single record, and in 30% of such claims figures land under the wrong loss, such as a stock invoice under roof repair. Each loss has its own policy section, and the claim must be paid as one settlement with one excess. What should the pipeline do?",
    "o": [
      "One prompt, plus 3 worked multi-loss claims that keep the figures apart",
      "One record per document, with the payment system adding them together",
      "3 loss items, each extracted in parallel and paid as its own separate claim",
      "3 loss items, each extracted in parallel with the shared policy, then merged"
    ],
    "a": 3,
    "why": "A multi-concern request is split into distinct items, each investigated in parallel with the shared context (here the policy and claimant), and then brought together into one resolution. That keeps each loss's figures apart and still produces the single settlement the policy requires.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "Examples may reduce the mix-ups, but one pass over 3 losses is what mixes them."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Documents aren't losses: one invoice can cover two losses, and adding totals isn't settling the claim."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Keeps the figures apart but pays 3 claims with 3 excesses, where the policy says one settlement."
      }
    },
    "cite": "Exam guide §1.4; notes/domain-1-agentic-architecture.md §1.4"
  },
  // B48 · de 1.5 · new (2026-11-01)
  {
    "id": "B48",
    "ts": "1.5",
    "s": "de",
    "block": "de",
    "q": "lookup_policyholder comes from a vendor MCP server the team cannot change. Its results include each policyholder's full bank account number, which the extracted records never need. Last month the number appeared in the free-text notes of 31 records, although the prompt forbids copying it. Compliance now requires that the number does not reach Claude at all. What should you add?",
    "o": [
      "A PreToolUse hook that asks lookup_policyholder to leave the number out",
      "A code check that scrubs the number from each record before it is saved",
      "A stronger prompt rule, with 2 examples of notes that leave out the number",
      "A PostToolUse hook that masks the account number in each lookup result"
    ],
    "a": 3,
    "why": "A PostToolUse hook transforms a tool's result before the model processes it, so masking there keeps the number out of Claude's context entirely, which is the requirement.",
    "wrong": {
      "A": {
        "trap": "nonexistent-feature",
        "text": "A PreToolUse hook changes the outgoing call. The vendor's server can't be changed and still returns the number."
      },
      "B": {
        "trap": "reactive-too-late",
        "text": "Cleans the saved record, but the number has already reached Claude, which compliance forbids."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The prompt rule already fails, and the number would still reach Claude."
      }
    },
    "cite": "Exam guide §1.5; notes/domain-1-agentic-architecture.md §1.5"
  },
  // B49 · de 1.6 · adapted from wr4/T24
  {
    "id": "B49",
    "ts": "1.6",
    "s": "de",
    "block": "de",
    "q": "For each large claim, one prompt reads the whole claim bundle of about 15 documents and extracts 40 fields, then checks that the documents agree. On bundles over 10 documents, fields from the later documents are often missed, and last month 9 claims were paid where the repair invoice total did not match the adjuster's estimate. The fields are the same for each kind of document. How should the work be split?",
    "o": [
      "One subagent per document, then a pass comparing the documents",
      "One prompt as now, with the 40 fields listed again before each document",
      "A coordinator that picks which document to read next from each finding",
      "Per-document subagents that each post their fields straight to the record"
    ],
    "a": 0,
    "why": "Per-document local passes keep attention even across a long bundle, and a separate cross-document pass catches disagreements between documents, like the invoice total and the estimate.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Still one pass over 15 documents; repeating the list doesn't stop attention thinning on the later ones."
      },
      "C": {
        "trap": "over-engineered",
        "text": "The fields are fixed for each kind of document; nothing found changes what to extract next."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "No step compares documents, and the value mismatch spans the invoice and the estimate."
      }
    },
    "cite": "Exam guide §1.6; notes/domain-1 §1.6"
  },
  // B50 · de 2.1 · adapted from sim2/M46
  {
    "id": "B50",
    "ts": "2.1",
    "s": "de",
    "block": "de",
    "q": "Loss runs, repair invoices and certificates all go through one tool, extract_document, described as 'Extracts data from a document', with one schema that holds loss-run, invoice and certificate fields. In 14% of repair invoices the output includes loss-run fields such as paid_to_date filled with invoice amounts. The team wants each type extracted against its own fields. What should they change?",
    "o": [
      "Split it into extract_loss_run, extract_invoice, extract_certificate tools",
      "Add 3 few-shot examples of invoices with only invoice fields filled",
      "Keep 1 tool and drop fields that do not fit the type after extraction",
      "Put a line naming the detected type at the top of each extraction prompt"
    ],
    "a": 0,
    "why": "Splitting a generic tool into purpose-specific tools, each with its own description and input/output contract, removes the overlap. An invoice tool has no paid_to_date field to fill.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Examples make mixing less likely but leave loss-run fields available on every invoice."
      },
      "C": {
        "trap": "reactive-too-late",
        "text": "Dropping fields afterwards hides the misplaced values; the invoice amount is still in the wrong field."
      },
      "D": {
        "trap": "probabilistic",
        "text": "The model still fills one mixed schema; a line of text does not change which fields exist."
      }
    },
    "cite": "Exam guide §2.1; score-report objective 27; notes/domain-2-tool-design-mcp.md §2.1"
  },
  // B51 · de 2.3 · adapted from d23b/P04
  {
    "id": "B51",
    "ts": "2.3",
    "s": "de",
    "block": "de",
    "q": "The extraction agent saves its results with update_claim, a general tool that can set any field on any claim. In 1,200 runs it changed approved_payout 4 times, overwriting amounts assessors had approved, and once edited a different claim with a similar number. Its job is to fill the 11 extraction fields on the claim it is processing. The assessors want it unable to change anything else, not just warned. What is the best fix?",
    "o": [
      "Add a PreToolUse hook that blocks any update_claim call whose input sets approved_payout",
      "Add a PostToolUse hook that reverts changes to approved_payout and alerts the assessor",
      "Add a system prompt rule that only assessors set payouts, with 2 examples of correct saves",
      "Replace update_claim with save_extraction, which takes only the 11 fields for the current claim"
    ],
    "a": 3,
    "why": "The tool is far wider than the job. A constrained tool that accepts only the extraction fields for the current claim makes every other change impossible, which is least privilege. The PreToolUse option covers only part of the requirement: the payout field, but not other fields or other claims.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Blocks one field, but update_claim can still change other fields and other claims, which the stem also rules out."
      },
      "B": {
        "trap": "reactive-too-late",
        "text": "Undoes the change after it was made, and leaves the tool's reach to every field and every claim in place."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Leaves the broad tool in place and relies on the model following a rule it already breaks."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3"
  },
  // B52 · de 4.1 · adapted from sim3/N49
  {
    "id": "B52",
    "ts": "4.1",
    "s": "de",
    "block": "de",
    "q": "The prompt asks Claude to flag \"any safety concerns\" in building inspection reports. Reviewers find that 3 of every 4 flags are routine notes such as \"gutter needs clearing\", while 2 real cases of exposed live wiring were missed last quarter. Adding \"focus on serious issues\" to the prompt changed little. What change should you make?",
    "o": [
      "Add to the prompt what to flag, such as live wiring, and what to skip",
      "Add 3 examples of serious defects to the prompt as few-shot examples",
      "Run the same prompt twice per report and keep flags found in both runs",
      "Ask for routine notes in a second list beside the safety flags"
    ],
    "a": 0,
    "why": "Specific categorical criteria, naming what to report and what to skip, improve precision and recall where vague instructions such as \"any concerns\" or \"serious issues\" do not.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Examples of serious defects alone show what to catch but not where the line falls; routine notes have nothing telling the model to skip them."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Agreement between 2 runs of a vague prompt filters noise at random and can drop the rare real hazard."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Sorting output into two lists needs the same missing criterion to decide which list a note goes in."
      }
    },
    "cite": "Exam guide §4.1; notes/domain-4-prompt-engineering.md §4.1"
  },
  // B53 · de 4.2 · adapted from wr6/T09
  {
    "id": "B53",
    "ts": "4.2",
    "s": "de",
    "block": "de",
    "q": "The pipeline extracts each charge on a repair invoice into a line_items array. On invoices from 2 contractors that put several charges on one line, such as \"Labour 6h + scaffold hire + 2x roof sheets\", only the first charge is extracted. The prompt has 2 examples, both from invoices with one charge per line. What should you add to the prompt?",
    "o": [
      "2 more examples of invoices that list one charge on each line",
      "An instruction to extract each charge found on the invoice",
      "2 examples with a combined line, each showing it split into its items",
      "A raw_line field that keeps the full text of each combined charge line"
    ],
    "a": 2,
    "why": "Few-shot examples must cover the varied document structures; the ones in the prompt show only the format that works.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "More of the layout that already works; none shows how to split a combined line."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "The instruction is already implied; the examples the model has show only one item per line."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Keeps the line unsplit; the items are still missing from line_items."
      }
    },
    "cite": "Exam guide §4.2; notes/domain-4 §4.2"
  },
  // B54 · de 4.3 · adapted from sim3/N52
  {
    "id": "B54",
    "ts": "4.3",
    "s": "de",
    "block": "de",
    "q": "The building-permit schema makes approval_date a required string. About 1 in 10 permits is still pending and has no approval date, and on those Claude fills in the lodgement date or today's date. Claims tracking then shows pending permits as approved. What schema change fixes this?",
    "o": [
      "Add a prompt rule telling Claude not to guess approval_date for pending permits",
      "Keep approval_date required and add an example of a pending permit's record",
      "Make approval_date an enum of the 12 months plus a value named \"pending\"",
      "Make approval_date optional and nullable, with null when no date is shown"
    ],
    "a": 3,
    "why": "When the source may not contain a value, the field should be optional and nullable. A required field pushes the model to fabricate a value to satisfy the schema.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The schema still demands a value; a prompt rule fights the required field."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "A required field still has to be filled, so the example has to show a value that does not exist."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "It throws away the day and year to make room for one status value."
      }
    },
    "cite": "Exam guide §4.3; score-report objective 22; notes/domain-4-prompt-engineering.md §4.3"
  },
  // B55 · de 4.3 · adapted from sim3/N53
  {
    "id": "B55",
    "ts": "4.3",
    "s": "de",
    "block": "de",
    "q": "The inspection schema has a damage_type enum with 6 values: roofing, plumbing, electrical, structural, glazing and drainage. About 7% of damage fits none of them, such as tree roots lifting a floor slab, and Claude forces each case into the closest value, mostly \"structural\". Claims are then routed to the wrong specialist assessor. New kinds of damage appear every few months. What schema change fits?",
    "o": [
      "Add tree_roots as a seventh enum value and keep the rest of the schema",
      "Add an \"other\" enum value plus a damage_detail string for the description",
      "Replace the enum with a free-text damage_type string for every case",
      "Make damage_type nullable and leave it empty when no value fits the damage"
    ],
    "a": 1,
    "why": "An \"other\" value plus a detail string keeps the fixed categories for routing while letting the model describe anything new honestly, which suits a category list that keeps growing.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "It fixes today's case; the next new kind of damage is forced into a wrong value again."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "It loses the fixed categories assessor routing relies on for the 93% that fit."
      },
      "D": {
        "trap": "error-suppression",
        "text": "The damage is recorded with no type and no description, so it is lost to routing."
      }
    },
    "cite": "Exam guide §4.3; score-report objective 22; notes/domain-4-prompt-engineering.md §4.3"
  },
  // B56 · de 4.4 · adapted from wr1/W25
  {
    "id": "B56",
    "ts": "4.4",
    "s": "de",
    "block": "de",
    "q": "A validation step in the claims pipeline checks that the claim amounts in each loss run add up to its stated total. About 7% of extractions fail. Most failures are a claim counted twice where a table continues onto the next page; the source totals are correct. Today the pipeline re-sends the same request, which fixes about 1 failure in 10. What should you change?",
    "o": [
      "Retry up to 5 times, each time re-sending the original request unchanged",
      "Send back the document and extraction, naming the claims that break the total",
      "Drop the sum check and send each loss run straight to the assessors",
      "Have the model rate its confidence and retry only extractions below 0.5"
    ],
    "a": 1,
    "why": "This is a structural error the model can fix, and the information is in the document. Sending back the document and the failed extraction with the specific validation error, here which claims break the total, lets it self-correct.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Repeats the request that already fails 9 times in 10, without telling the model what went wrong."
      },
      "C": {
        "trap": "error-suppression",
        "text": "Discards a check that catches real errors and floods the 12 assessors."
      },
      "D": {
        "trap": "probabilistic",
        "text": "The failures are already known from the sum check; a self-assigned number adds no information about what to correct."
      }
    },
    "cite": "Exam guide §4.4; notes/domain-4 §4.4"
  },
  // B57 · de 4.5 · adapted from wr1/W27
  {
    "id": "B57",
    "ts": "4.5",
    "s": "de",
    "block": "de",
    "q": "Certificates arrive all day, and the insurer promises brokers extracted data within 33 hours of receipt. The team will submit through the Message Batches API at half price and must plan for every batch taking the full 24-hour processing window. Certificates wait in a queue until the next submission. What is the least frequent submission schedule that still keeps the 33-hour promise?",
    "o": [
      "Submit the queued certificates every 6 hours",
      "Submit the queued certificates every 12 hours",
      "Submit the queued certificates every 9 hours",
      "Submit the queued certificates every 18 hours"
    ],
    "a": 2,
    "why": "Worst case = the wait for the next submission plus 24 hours of processing. Every 9 hours: 9 + 24 = 33, exactly the promise. Every 6 hours also meets it (30) but is more frequent than needed; 12 + 24 = 36 and 18 + 24 = 42 miss it.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "6 + 24 = 30 meets the promise, but the question asks for the least frequent schedule that does."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "12 + 24 = 36 hours, 3 over the promise."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "18 + 24 = 42 hours: a certificate arriving just after a submission waits 18 hours before processing starts."
      }
    },
    "cite": "Exam guide §4.5; notes/domain-4 §4.5"
  },
  // B58 · de 5.5 · adapted from wr3/T26
  {
    "id": "B58",
    "ts": "5.5",
    "s": "de",
    "block": "de",
    "q": "Each extracted field gets a confidence score, and fields under 0.85 go to an assessor. Spot checks show many wrong rebuild-cost figures scored above 0.9, while most fields sent to assessors were correct. Last season the assessors hand-checked every field on 2,400 claims, and that set is stored with the correct values. What should you do about the routing?",
    "o": [
      "Set each field's cutoff from its error rate by score on the 2,400",
      "Send the lowest-scoring fields to assessors first, up to their capacity",
      "Add 5 low-scoring claims with corrected values as few-shot examples",
      "Hand-check a random 400 claims from this season to count the errors"
    ],
    "a": 0,
    "why": "The scores don't match reality, and a hand-checked set exists. Calibrating each field's threshold against it ties scores to measured error rates, and only then does routing on them mean something.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "Lowest-first only helps once scores track errors; here wrong fields score above 0.9."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Examples change the outputs, not what a score means."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Measures an error rate but doesn't fix the routing, and a hand-checked set already exists."
      }
    },
    "cite": "Exam guide §5.5; notes/domain-5 §5.5"
  },
  // B59 · de 5.5 · adapted from wr2/V11
  {
    "id": "B59",
    "ts": "5.5",
    "s": "de",
    "block": "de",
    "q": "Thresholds are now calibrated, and about 2,600 of the 3,000 documents a week go straight to payment with no review. The insurer's auditor asks how the team will know if the error rate in those unreviewed documents rises, or if a new kind of error appears, for example after a contractor changes its invoice layout. The 2,400 hand-checked claims are all from last season. What should the team add?",
    "o": [
      "Explicit criteria listing which fields need a second look after a contractor changes layout",
      "A monthly re-run of the 2,400 checked claims to confirm the scores still hold",
      "A weekly random sample of unreviewed documents, drawn from each type and contractor group",
      "Higher thresholds on every field, cutting the unreviewed documents to 2,000"
    ],
    "a": 2,
    "why": "Stratified random sampling of high-confidence extractions measures their error rate over time and catches error patterns nobody anticipated, such as a new layout.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Criteria only cover the changes someone thought to list, and measure nothing; nobody would see a rise in errors or a pattern nobody predicted."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Last season's documents cannot show a layout a contractor introduced this season, and the same documents score the same each month."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Puts more documents in front of assessors but still never measures the error rate in the 2,000 left unreviewed."
      }
    },
    "cite": "Exam guide §5.5; notes/domain-5 §5.5"
  },
  // B60 · de 5.6 · adapted from sim3/N60
  {
    "id": "B60",
    "ts": "5.6",
    "s": "de",
    "block": "de",
    "q": "A claim summary merges 2 inspection reports for the same warehouse roof. The March report lists 4 cracked roof tiles and the September report lists 9, and the summary step writes \"the sources disagree on cracked tiles\" and keeps the March figure. Both reports are accurate for their dates. What should the extracted data include?",
    "o": [
      "Only the September figure, the most recent report on the roof's tiles",
      "The average of the 2 figures, labelled as an estimate of cracked tiles",
      "Both figures marked as a conflict for a person to resolve by hand",
      "Each figure with its report and date, read as a change over time"
    ],
    "a": 3,
    "why": "Requiring dates in structured outputs lets later steps read the difference correctly. Here the two counts are not a contradiction but two points in time.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Dropping March loses the history that shows tiles cracking over the season."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "An average of two counts from different dates describes neither date."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Both are right for their dates; calling it a conflict sends reviewers a non-problem."
      }
    },
    "cite": "Exam guide §5.6; notes/domain-5-context-reliability.md §5.6"
  },
];

module.exports = { META, Q };
