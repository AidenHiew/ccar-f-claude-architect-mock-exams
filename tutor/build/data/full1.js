// tutor/build/data/full1.js — Full Mock 1 (built 2026-11-01, plan phase 2): 60 single-answer questions in 4 scenario blocks,
// draw cs+ma+dp+ci (DRAWS in statements.js). With the other full mock it covers all 6 guide scenarios and all 30 task statements.
// Most items are earlier papers' questions adapted to one new company setting per block (source noted on each record);
// the rest were written new for slots no earlier item filled. Facts only from reference/ccar-f-official-exam-guide.md and notes/.
'use strict';

const META = {
  "key": "full1",
  "title": "CCA-F Full Mock 1",
  "eyebrow": "Full mock · 60 questions · 4 scenarios",
  "intro": "Sixty exam-level questions in four scenario blocks, like the real exam: Customer Support Resolution Agent, Multi-Agent Research System, Developer Productivity with Claude and Claude Code for CI. Full Mock 2 draws a different four, and the two papers together cover all six exam scenarios. Every question has one correct answer. Flag questions to return to them before you submit. Labels stay hidden until grading. Sit it once, in exam mode, with the 120-minute timer on.",
  "defaultMode": "exam",
  "timerDefault": true,
  "minutes": 120,
  "storageKey": "ccaf-full1",
  "blocks": [
    {
      "id": "cs",
      "title": "Customer Support Resolution Agent",
      "intro": "You are building a support agent on the Claude Agent SDK for Brightwater Energy, a gas and electricity retailer with 400,000 household customers. It handles bills, credits, payment plans, home moves and meter problems through MCP tools including get_customer, get_bill, issue_credit, set_payment_plan and escalate_to_human. The target is to resolve most contacts in the first chat while still escalating the cases that need a person."
    },
    {
      "id": "ma",
      "title": "Multi-Agent Research System",
      "intro": "You are building a research system on the Claude Agent SDK for the Halden Institute, which writes evidence briefs on air quality, heat and infection for 14 city health departments. A coordinator agent delegates to subagents that search the web, analyse documents, synthesise findings and write briefs with citations."
    },
    {
      "id": "dp",
      "title": "Developer Productivity with Claude",
      "intro": "You are building an internal developer agent on the Claude Agent SDK for Corvane Logistics. It helps 70 engineers work in a 14-year-old Java freight-booking monolith of about 6,000 files and the Kotlin services around it: finding their way round unfamiliar code, generating repetitive code and automating chores. It uses the built-in tools and MCP servers for the build system, databases and tickets."
    },
    {
      "id": "ci",
      "title": "Claude Code for CI",
      "intro": "Pennant Bank's mobile team keeps a Kotlin Android app, a Swift iOS app and a Node.js API in one GitHub monorepo. On every pull request, GitHub Actions runs Claude Code with no one at the keyboard: it reviews the change, writes or updates tests, and posts findings as PR comments. Nightly jobs handle larger chores. The pipeline reads Claude's output as data, and the 45 engineers stop reading the bot when it repeats itself or flags non-problems."
    }
  ]
};

const Q = [
  // A01 · cs 1.1 · adapted from sim/S01
  {
    "id": "A01",
    "ts": "1.1",
    "s": "cs",
    "block": "cs",
    "q": "The agent runs a loop that exits as soon as a response contains a text block. In 14% of sessions the model replies with 'Let me pull up that bill for you' plus a tool_use block for get_bill in the same response. Those sessions end with the customer seeing only the promise. The team's first idea is a prompt line telling the model not to narrate before tool calls. What should change?",
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
  // A02 · cs 1.1 · adapted from sim3/N02
  {
    "id": "A02",
    "ts": "1.1",
    "s": "cs",
    "block": "cs",
    "q": "After get_bill runs, the loop code sends the next request with only the original customer message and a note saying \"tool succeeded\". The model then asks for the same bill again, and 14% of credit chats repeat get_bill 3 or more times. The tool returns correct data each time. What is the fix?",
    "o": [
      "Raise max_tokens and give the model more room to recall the earlier bill lookup",
      "Add a system prompt line telling the model not to call get_bill twice",
      "Cache get_bill results in the MCP server and return them faster on repeats",
      "Append the tool_result block with the returned data to the next request"
    ],
    "a": 3,
    "why": "The model only knows what is in the messages it is sent. Each tool result has to be appended to the conversation as a tool_result block, so the next iteration can reason about the data and choose the next step. A bare \"tool succeeded\" note gives it nothing to work with.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "max_tokens limits the length of the reply. The bill data was never sent back, so there is nothing to recall."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "This stops the repeat call but leaves the model without the bill data, so it answers without the facts it asked for."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Speed is not the problem. The result still never reaches the model's context, so it keeps asking."
      }
    },
    "cite": "Exam guide §1.1; notes/domain-1-agentic-architecture.md §1.1"
  },
  // A03 · cs 1.1 · adapted from sim2/M02
  {
    "id": "A03",
    "ts": "1.1",
    "s": "cs",
    "block": "cs",
    "q": "The first version of the agent hard-codes one sequence for every chat: get_customer, then get_bill, then issue_credit if the bill is marked disputed. Customers who only want to submit a meter reading still go through the credit check, and 18% of chats call a tool the request never needed. The agent has 7 tools and more are planned. Which design fits how an agentic loop is meant to work?",
    "o": [
      "Add a branch to the sequence per request type, keyed on words in the message",
      "Give the model the tools, let it pick each next call, and loop on stop_reason",
      "Add a classifier step that picks one of 5 fixed scripts for each new request",
      "Keep the sequence and let the model answer 'skip' for steps it thinks unneeded"
    ],
    "a": 1,
    "why": "In an agentic loop the model decides which tool to call next from the context, and the code loops on stop_reason. A pre-configured sequence or decision tree is the contrast the guide draws; it makes every chat pay for steps it does not need.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Keyword branches are a bigger decision tree. They break on phrasing they did not expect and grow with each new tool."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Five fixed scripts are still pre-configured sequences, with a classifier added in front."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "The order is still fixed in code; the model only gets a veto, and every chat still walks the whole script."
      }
    },
    "cite": "Exam guide §1.1; notes/domain-1-agentic-architecture.md §1.1"
  },
  // A04 · cs 1.4 · adapted from fresh1/F02
  {
    "id": "A04",
    "ts": "1.4",
    "s": "cs",
    "block": "cs",
    "q": "Policy says that waiving an early-exit fee above $200 needs a team lead's approval. The system prompt states the rule, yet 3% of waivers above $200 went through without approval last quarter. When the agent does hand a case over, team leads cannot see the chat; chats average 40 turns, and team leads spend about 8 minutes finding the cause and amount. Which change addresses both problems?",
    "o": [
      "A hook blocking waivers above $200 that escalates with a structured summary",
      "A hook blocking waivers above $200 that escalates with the full chat transcript",
      "A firmer prompt rule for waivers above $200, plus a structured summary on handoff",
      "A firmer prompt rule for waivers above $200, plus the transcript on handoff"
    ],
    "a": 0,
    "why": "A business rule that must hold every time needs programmatic enforcement: a hook that intercepts the waiver call and blocks amounts above $200, redirecting to escalation. A human who cannot see the chat needs a structured handoff (customer, root cause, amount, recommended action), not a transcript to reread.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "The hook fixes the breaches, but team leads still have to read a whole chat to rebuild the case."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The handoff improves, but a prompt rule is what already lets 3% through."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Neither half changes the mechanism behind either problem."
      }
    },
    "cite": "Exam guide §1.4; exam guide §1.5; notes/domain-1-agentic-architecture.md §1.4–1.5"
  },
  // A05 · cs 1.4 · adapted from sim3/N05
  {
    "id": "A05",
    "ts": "1.4",
    "s": "cs",
    "block": "cs",
    "q": "When a credit exceeds the agent's limit, it calls escalate_to_human with the message \"Customer needs help with a credit, please review.\" Human agents cannot see the chat transcript. They spend an average of 7 minutes re-asking customers for details the agent had already confirmed, and most often they re-run the identity check the agent had already passed. What should the escalation pass?",
    "o": [
      "Customer ID and bill, root cause, credit amount and recommended action",
      "Customer ID and bill plus the last 10 messages of the chat as a transcript",
      "Customer ID and bill, the customer's sentiment and a priority from 1 to 5",
      "Customer ID and bill, verified status, root cause, amount and next step"
    ],
    "a": 3,
    "why": "A structured handoff carries what the agent has established, including authorisation state such as verified identity, in fields the human can act on at once: who, which bill, what went wrong, how much, and what to do next. The human then continues the case instead of restarting it.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "This carries most of the facts but not the one the humans re-check most: that identity was already verified."
      },
      "B": {
        "trap": "over-engineered",
        "text": "The human has to dig the facts out of raw messages, and the verification may have happened earlier than the last 10."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Sentiment and a priority score tell the human how urgent the case feels, not what has been established."
      }
    },
    "cite": "Exam guide §1.4; score-report objective 2; notes/domain-1-agentic-architecture.md §1.4"
  },
  // A06 · cs 1.5 · adapted from sim/S07
  {
    "id": "A06",
    "ts": "1.5",
    "s": "cs",
    "block": "cs",
    "q": "Bills issued before a billing-system migration come back from get_bill with Unix timestamps, and newer bills come back with ISO 8601 dates. Disputes must be raised within 30 days of the bill date. The agent misjudged that window on 6% of older bills, accepting some late disputes and refusing some valid ones. What is the most reliable fix?",
    "o": [
      "A system-prompt section on converting Unix timestamps, with two worked conversions",
      "A PostToolUse hook that converts get_bill dates to ISO 8601 before the model reads them",
      "A PreToolUse hook that rejects get_bill calls for bills issued before the migration date",
      "A rule that sends disputes on pre-migration bills to escalate_to_human for a manual check"
    ],
    "a": 1,
    "why": "PostToolUse hooks intercept tool results and can normalise heterogeneous formats, such as Unix timestamps and ISO 8601, before the agent processes them. That makes the comparison deterministic.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "Asking the model to do date arithmetic correctly every time is the probabilistic path the hook removes."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Blocking the lookup stops legitimate disputes; the data is fine, only its format differs."
      },
      "D": {
        "trap": "over-engineered",
        "text": "It turns a formatting problem into a staffing cost on every older bill."
      }
    },
    "cite": "Exam guide §1.5; notes/domain-1-agentic-architecture.md §1.5"
  },
  // A07 · cs 1.5 · adapted from d1/D106
  {
    "id": "A07",
    "ts": "1.5",
    "s": "cs",
    "block": "cs",
    "q": "Policy requires human approval for credits above $500, so you added a PreToolUse hook that denies issue_credit calls over that amount. Since deployment, 14% of high-value credit sessions end with the agent telling the customer 'I'm unable to apply this credit' and nothing further happens. No escalation is recorded for those sessions. What should you change?",
    "o": [
      "Have the hook itself open the escalation with a handoff and tell the agent the case has moved",
      "Remove the hook and put the $500 limit in the prompt, telling the agent to escalate above it",
      "Keep the hook and add a prompt rule that the agent must escalate whenever a credit is denied",
      "Change the policy: the agent credits $500 at once and escalates only the amount above it"
    ],
    "a": 0,
    "why": "Interception hooks should block the policy-violating action and redirect it to the alternative workflow. Making the redirect part of the hook keeps the whole path deterministic; leaving the escalation to the model reintroduces the probabilistic step that just failed 14% of the time.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Trades a guaranteed block for a prompt rule. The $500 limit becomes something the model usually respects."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The block is deterministic but the redirect still depends on the model remembering to escalate — the exact step that is failing."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Rewrites the business policy to work around a workflow gap. The open question is the escalation path, not the threshold."
      }
    },
    "cite": "notes/domain-1-agentic-architecture.md §1.5 · Exam Guide TS 1.5"
  },
  // A08 · cs 2.1 · adapted from fresh1/F03
  {
    "id": "A08",
    "ts": "2.1",
    "s": "cs",
    "block": "cs",
    "q": "The agent has get_bill (\"Gets bill\") and get_payment_plan (\"Gets plan\"). Customers asking \"why was I charged twice?\" are routed to get_payment_plan in 19% of chats, although the answer is on the bill. The system prompt also contains the line \"For anything about payments, use get_payment_plan.\" A teammate proposes adding routing examples to the prompt. What should you change?",
    "o": [
      "Expand both tool descriptions and keep the prompt line as it is",
      "Expand both descriptions and delete the prompt's payments line",
      "Remove the \"payments\" line and add 6 routing examples to the prompt",
      "Keep the prompt line and add 6 routing examples to the prompt"
    ],
    "a": 1,
    "why": "The stem shows 2 causes. Minimal descriptions give the model nothing to tell the tools apart, so they need inputs, examples and boundaries. A keyword-sensitive prompt line ties \"payments\" to one tool and can override even good descriptions, so it must go too.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Better descriptions help, but the prompt line sends any payment question to get_payment_plan and overrides them."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Removing the line helps, but examples patch routing on top of descriptions that still say almost nothing."
      },
      "D": {
        "trap": "probabilistic",
        "text": "This leaves both causes in place and adds examples that fight the prompt's own instruction."
      }
    },
    "cite": "Exam guide §2.1; notes/domain-2-tool-design-mcp.md §2.1"
  },
  // A09 · cs 2.2 · adapted from sim3/N09
  {
    "id": "A09",
    "ts": "2.2",
    "s": "cs",
    "block": "cs",
    "q": "issue_credit returns the same error text, \"Credit failed\", whether the payment gateway timed out, the account is under a collections hold, or the amount was above the bill total. The agent retries every failure up to 3 times and then tells the customer to try again tomorrow. That includes the 40% of failures that are collections holds, which no retry can fix. What should issue_credit return instead?",
    "o": [
      "isError with a per-type HTTP status (504, 409 or 422) and no other fields",
      "isError with errorCategory \"transient\" and a 30-second retry delay",
      "isError with isRetryable false on every failure and a reason for the customer",
      "isError with an errorCategory, an isRetryable flag and a reason for the customer"
    ],
    "a": 3,
    "why": "A structured error tells the agent what kind of failure it is (transient, validation, business), whether retrying can help, and what to tell the customer. The values must differ by cause: the timeout is retryable, the collections hold is not and needs an explanation.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "A code per type is closer, but the agent gets no retryable flag and no explanation for the customer, and has to guess what each code means."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Calling policy and input failures transient tells the agent to wait and retry what can never succeed."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "It stops wasted retries but also stops retries of gateway timeouts, which a retry would fix."
      }
    },
    "cite": "Exam guide §2.2; score-report objective 26; notes/domain-2-tool-design-mcp.md §2.2"
  },
  // A10 · cs 2.3 · adapted from sim3/N10
  {
    "id": "A10",
    "ts": "2.3",
    "s": "cs",
    "block": "cs",
    "q": "Every chat must start with a get_customer call, because the other tools all need the account ID it returns. In 12% of chats the first response is plain text asking the customer a question their account record already answers. The first request in each chat is sent with tool_choice \"auto\". What change makes get_customer the first call in every chat?",
    "o": [
      "Set tool_choice to \"any\" on the first request of each new chat session",
      "Put get_customer first in the tools array and describe it as the first step",
      "Add a system prompt rule that the first action in a chat is to call get_customer",
      "Force get_customer with tool_choice on the first request, then use \"auto\" after"
    ],
    "a": 3,
    "why": "Forced tool selection, tool_choice {\"type\": \"tool\", \"name\": \"get_customer\"}, makes the model call that specific tool, so the prerequisite data exists before anything depends on it. Later turns go back to \"auto\" and the model chooses freely.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "\"any\" guarantees some tool call, not get_customer; the model could still call get_bill first without an account ID."
      },
      "B": {
        "trap": "probabilistic",
        "text": "Order and wording make the right first call more likely, not certain."
      },
      "C": {
        "trap": "probabilistic",
        "text": "A prompt rule is guidance; with \"auto\" the model can still reply in text first."
      }
    },
    "cite": "Exam guide §2.3; score-report objective 29; notes/domain-2-tool-design-mcp.md §2.3"
  },
  // A11 · cs 2.3 · adapted from d23d/H05
  {
    "id": "A11",
    "ts": "2.3",
    "s": "cs",
    "block": "cs",
    "q": "The agent has send_sms, which can text any phone number with any message. It is meant only for sending customers the visit details for their own meter appointment. In 2,000 chats it twice texted a number the customer typed in, and once included a card's last 4 digits in the message. Compliance wants it unable to text anyone but the account holder, or anything but the visit details. What is the best fix?",
    "o": [
      "Add a PreToolUse hook that blocks send_sms when the number isn't the one on the account",
      "Add a system prompt rule to text only the number on the account, with the visit details",
      "Replace send_sms with a notify_visit tool that takes only an appointment ID",
      "Log every send_sms call and have compliance review the log at the end of each week"
    ],
    "a": 2,
    "why": "The tool can do far more than the job. A tool that takes only an appointment ID and sends the fixed visit text to the phone on file makes other recipients and other content impossible. The hook covers the number but not what the message says.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Stops other recipients, but send_sms can still send any content to the right number."
      },
      "B": {
        "trap": "probabilistic",
        "text": "Leaves the broad tool in place and relies on the model following a rule it already breaks."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "Finds the bad texts after customers and strangers have received them."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3 (constrained alternatives, least privilege); LR-0033 (Q4 shape)"
  },
  // A12 · cs 4.2 · adapted from sim/S11
  {
    "id": "A12",
    "ts": "4.2",
    "s": "cs",
    "block": "cs",
    "q": "The system prompt lists 12 rules for choosing between get_bill, check_meter_fault and open_dispute. On clear requests the agent follows them. On ambiguous ones, such as 'my bill tripled since the new meter, what now?', it picks differently from one session to the next, and 3 more rules added last month did not help. What is the most effective next step?",
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
  // A13 · cs 5.1 · adapted from d145/K07
  {
    "id": "A13",
    "ts": "5.1",
    "s": "cs",
    "block": "cs",
    "q": "Brightwater home-move chats run 30 or more turns, and after turn 20 older history is summarised to save tokens. In 11 of 200 moves the agent later set the wrong payment plan: the customer had agreed $84 a month, but the summary read 'customer agreed a payment plan' and the agent used $48 from an old bill. The summariser prompt already asks it to keep amounts. What should you change?",
    "o": [
      "Raise the summary limit from 200 to 600 words and keep the amounts instruction",
      "Call get_customer again before set_payment_plan and use the amount it returns",
      "Keep agreed amounts and dates in a case facts block outside the summary",
      "Switch the summariser to a larger model with the same prompt and word limit"
    ],
    "a": 2,
    "why": "Transactional facts belong in a persistent case-facts block included in each prompt outside the summarised history. Summaries compress numbers and customer-stated expectations; a separate block is never summarised.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "A longer summary loses fewer facts, but it is still a summary, and the amounts instruction already failed."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "The $84 was agreed in chat and is not on the account yet; get_customer returns the old $48."
      },
      "D": {
        "trap": "probabilistic",
        "text": "A better summariser still compresses; the fact needs to live somewhere that is not summarised."
      }
    },
    "cite": "Exam guide §5.1; notes/domain-5 §5.1"
  },
  // A14 · cs 5.2 · adapted from sim3/N13
  {
    "id": "A14",
    "ts": "5.2",
    "s": "cs",
    "block": "cs",
    "q": "A customer writes: \"I've been charged twice for the same month's bill. I want to speak to a person, not a bot.\" The double charge is a known gateway issue that issue_credit fixes in under a minute, and the agent resolves 92% of such cases on its own. Logs show the agent currently replies by starting its own investigation. What should the agent do?",
    "o": [
      "Call escalate_to_human now with the charge details, before investigating",
      "Fix the double charge first, then offer the customer a transfer if still unhappy",
      "Explain that it can fix this in a minute and escalate only if the customer insists",
      "Check sentiment and escalate only if the customer's message scores as very angry"
    ],
    "a": 0,
    "why": "An explicit request for a human is honoured immediately, without first attempting investigation, even when the agent could fix the issue. Passing the charge details in the escalation saves the human from asking again.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "The customer asked for a person in plain words; working the case first overrides that request."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Offering to resolve fits a frustrated customer who has not asked for a person. This customer already asked, so the agent should hand over."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Sentiment is an unreliable escalation trigger, and the customer's explicit request is the trigger here."
      }
    },
    "cite": "Exam guide §5.2; score-report objective 18; notes/domain-5-context-reliability.md §5.2"
  },
  // A15 · cs 5.2 · adapted from d145/K05
  {
    "id": "A15",
    "ts": "5.2",
    "s": "cs",
    "block": "cs",
    "q": "A customer gives a surname and street, and get_customer returns 2 accounts: the customer's flat and a neighbour's flat with the same surname. The agent picks the account with the most recent payment, which was wrong in 9 of 70 such cases last month, and once applied a $60 credit to the wrong home. What should the agent do when get_customer returns more than 1 match?",
    "o": [
      "Ask the customer for one more identifier, such as the account number or meter serial",
      "Pick the account whose address text is the closest match to what the customer typed",
      "Escalate to a human agent each time get_customer returns 2 or more matches",
      "Pick the most recent account and confirm the choice with the customer after the credit"
    ],
    "a": 0,
    "why": "Several matches call for clarification, not a heuristic pick. One more identifier settles it, and the agent keeps the case.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "A better heuristic is still a heuristic; two flats on one street can match equally well."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Hands a solvable case to a person and hurts first-contact resolution; one question settles it."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "Confirms after the money has moved, which is the failure the stem describes."
      }
    },
    "cite": "Exam guide §5.2; notes/domain-5 §5.2"
  },
  // A16 · ma 1.2 · adapted from d1/D107
  {
    "id": "A16",
    "ts": "1.2",
    "s": "ma",
    "block": "ma",
    "q": "Your coordinator runs every query through all four subagents: search, document analysis, synthesis and report. Usage data shows 40% of queries are simple factual lookups such as 'When did the WHO last revise its PM2.5 guideline?'. Those take about 90 seconds and cost roughly 12 times a single-agent answer. What is the best change?",
    "o": [
      "Have the coordinator judge each query's complexity and call only the subagents it needs",
      "Move all four subagents to a smaller, cheaper model to lower the cost of each query",
      "Run all four subagents in parallel instead of in sequence to cut the 90-second latency",
      "Put a keyword classifier in front that sends simple queries to a separate single agent"
    ],
    "a": 0,
    "why": "The coordinator's job includes deciding which subagents to invoke based on query complexity rather than always routing through the full pipeline. Anthropic's own research system scales effort to the query: one agent and a few tool calls for a simple question, many subagents for a complex one.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "Makes unnecessary work cheaper instead of not doing it. Simple lookups still pay for four agents and a report."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Synthesis and reporting depend on earlier outputs, so they cannot start in parallel, and the unnecessary work still runs."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Builds a second system and a brittle keyword router for a decision the coordinator is already positioned to make."
      }
    },
    "cite": "notes/domain-1-agentic-architecture.md §1.2 · notes/2026-09-docs-delta.md §1.2 (scaling rule: simple query → 1 agent)"
  },
  // A17 · ma 1.2 · adapted from d1/D108
  {
    "id": "A17",
    "ts": "1.2",
    "s": "ma",
    "block": "ma",
    "q": "Briefs ask for asthma admission data across 6 named cities. Reviewers find that 30% of reports omit at least one city entirely, although each subagent's output is accurate for what it covered. The coordinator runs search, analysis and synthesis exactly once per query, then generates the report. What is the most effective fix?",
    "o": [
      "Raise the search subagent's results per query from 10 to 30 so that fewer of the cities get missed",
      "Have the report subagent list any missing cities in a limitations section at the end of the report",
      "Give the synthesis subagent the full search and analysis toolsets so it can research any gap it notices itself",
      "Have the coordinator check synthesis against the brief so it can re-delegate searches for gaps"
    ],
    "a": 3,
    "why": "This is the iterative refinement loop: the coordinator evaluates synthesis output for gaps, re-delegates targeted queries to search and analysis, and re-invokes synthesis until coverage is sufficient. A single pass has no step that notices a missing city.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "More results per query may catch some cities by chance; nothing checks coverage against the brief, so gaps still ship."
      },
      "B": {
        "trap": "reactive-too-late",
        "text": "Discloses the gap instead of closing it. The brief asked for all 6 cities."
      },
      "C": {
        "trap": "over-engineered",
        "text": "A whole missing city is deep investigation, not a quick fact-check. Handing synthesis every toolset breaks separation of concerns and bypasses the coordinator."
      }
    },
    "cite": "notes/domain-1-agentic-architecture.md §1.2 · Exam Guide TS 1.2"
  },
  // A18 · ma 1.3 · adapted from d145/K09
  {
    "id": "A18",
    "ts": "1.3",
    "s": "ma",
    "block": "ma",
    "q": "For the weekly air-quality brief the coordinator searches 3 subtopics: sensor readings, hospital admissions and policy changes. Each search is independent and takes about 3 minutes. Logs show the coordinator emits one Task call, waits for its result, then emits the next, and briefs take 10 minutes. How should the searches be launched?",
    "o": [
      "Combine the 3 subtopics into one search subagent brief with a longer time budget",
      "Let the readings search subagent spawn the admissions and policy searches itself",
      "Have the coordinator emit all 3 Task calls in a single response",
      "Run 3 coordinator processes, each owning one subtopic, and merge their briefs"
    ],
    "a": 2,
    "why": "Parallel subagents are spawned by emitting several Task tool calls in one coordinator response, not one per turn.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Still serial work inside one agent, and one brief covering three subtopics loses focus."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Breaks hub-and-spoke: subagent-to-subagent spawning bypasses the coordinator's routing and error handling."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Three pipelines and a merge step for something one coordinator response can do."
      }
    },
    "cite": "Exam guide §1.3; notes/domain-1 §1.3"
  },
  // A19 · ma 1.3 · adapted from d145/K10
  {
    "id": "A19",
    "ts": "1.3",
    "s": "ma",
    "block": "ma",
    "q": "The coordinator invokes the synthesis subagent with the prompt 'Using the research the team gathered, write this week's brief.' In 40% of runs the brief has no figures from the week's monitoring reports and reads like general health commentary. The search and document-analysis results are complete in the coordinator's context. What should change?",
    "o": [
      "Turn on a shared memory setting that gives the subagent the coordinator's history",
      "Put the full search results and document analyses into the synthesis prompt",
      "Give the synthesis subagent the web-search tool to gather the figures it needs",
      "Add a few-shot example brief full of figures to the synthesis system prompt"
    ],
    "a": 1,
    "why": "Subagents do not inherit the coordinator's context. The findings have to be passed explicitly in the subagent's prompt.",
    "wrong": {
      "A": {
        "trap": "nonexistent-feature",
        "text": "No such setting: subagents start fresh and share no memory between invocations."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Repeats research already done, and the results may differ from what the other subagents found."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Shows the format wanted, but the subagent still has no figures to put in it."
      }
    },
    "cite": "Exam guide §1.3; notes/domain-1 §1.3; notes/2026-09-docs-delta §1.3"
  },
  // A20 · ma 1.6 · adapted from d145/K11
  {
    "id": "A20",
    "ts": "1.6",
    "s": "ma",
    "block": "ma",
    "q": "A city health officer asks why asthma admissions in one district rose 30% this autumn. The system runs a fixed chain: search the news, analyse the latest air-monitoring report, synthesise. The first search turned up reports of a new freight depot sending diesel trucks through the district at night, but the chain moved on to the monitoring report and the brief never mentions the depot. What should change?",
    "o": [
      "Let the coordinator add subtasks from each step's findings, such as the depot",
      "Add a fixed fourth step to the chain that searches for freight and traffic news",
      "Raise the number of results per search from 10 to 30 in the first step",
      "Run the same fixed chain twice and merge the two briefs"
    ],
    "a": 0,
    "why": "An open-ended \"why\" question needs dynamic decomposition: subtasks generated from intermediate findings. The depot lead should have produced a follow-up subtask.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Fits this question; the next one will turn on a lead the fixed steps do not cover."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "The lead was already found; the chain had no way to follow it."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Two runs of a chain that cannot follow leads both miss the lead."
      }
    },
    "cite": "Exam guide §1.6; notes/domain-1 §1.6"
  },
  // A21 · ma 1.6 · adapted from wr4/T22
  {
    "id": "A21",
    "ts": "1.6",
    "s": "ma",
    "block": "ma",
    "q": "Every monthly city report goes through the same 3 jobs: pull each station's readings out of the month's monitoring export, compare each reading with the legal limits, then write the summary with citations. One prompt does all 3 today, and on long reports it skips the limits comparison about 1 time in 8. The steps and their order are the same every month. How should the work be split?",
    "o": [
      "A coordinator that chooses the next step from each result",
      "3 prompts in sequence, each passing its output on to the next",
      "3 example reports worked through all 3 jobs in the one prompt",
      "Send long reports to a reviewer to do the limits check by hand"
    ],
    "a": 1,
    "why": "Predictable steps in a fixed order suit prompt chaining: each prompt does one job and passes its output to the next.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Dynamic decomposition is for open-ended work; the steps here are fixed."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Examples show the jobs, but one prompt still does all 3 on long reports."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "Moves a step the pipeline should run to people, and it doesn't fix the prompt."
      }
    },
    "cite": "Exam guide §1.6; notes/domain-1 §1.6; LR-0045 T08"
  },
  // A22 · ma 1.7 · new (2026-11-01)
  {
    "id": "A22",
    "ts": "1.7",
    "s": "ma",
    "block": "ma",
    "q": "Last Tuesday a named session, no2-review, analysed 30 studies of traffic pollution for an evidence brief. Since then 12 of the 30 studies have published corrected datasets and 3 have been withdrawn, so many of the session's tool results are out of date. The team now wants to compare 2 ways of writing the brief, one weighting studies by sample size and one by study design. Both should start from the same up-to-date analysis, and neither should affect the other. What should they do?",
    "o": [
      "Fork no2-review twice and run one weighting approach in each branch",
      "Resume no2-review, tell it which 15 studies changed, then try both in turn",
      "Start a new session from a summary with the 15 changes, then try both in turn",
      "Start a new session from a summary with the 15 changes, then fork it twice"
    ],
    "a": 3,
    "why": "Two facts decide it. With 15 of 30 studies changed, the old tool results are stale, so a new session seeded with a structured summary (plus the changes) is more reliable than resuming. Comparing 2 divergent approaches from one shared baseline, without either affecting the other, is what fork_session is for. So build the fresh baseline first, then fork it.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Forking gives 2 independent branches, but both inherit the stale results for half the studies."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Resuming and naming changes suits a few changed files. Half the studies changed here, and trying both approaches in one line of work lets the first shape the second."
      },
      "C": {
        "trap": "reactive-too-late",
        "text": "The baseline is right, but running the approaches one after the other in the same session means the second starts with the first in its history."
      }
    },
    "cite": "Exam guide §1.7; notes/domain-1-agentic-architecture.md §1.7"
  },
  // A23 · ma 2.1 · adapted from d23c/C02
  {
    "id": "A23",
    "ts": "2.1",
    "s": "ma",
    "block": "ma",
    "q": "The synthesis subagent has verify_claim, described as 'Checks a claim'. It actually compares one sentence against the source document cited for it and returns supported, contradicted or not found. In 60 reports, the subagent called it 23 times to check arithmetic such as year-on-year admission growth, and each time got 'not found' and dropped the figure. What should you change first?",
    "o": [
      "Add a calculate tool for arithmetic, and keep verify_claim's description as it is today",
      "Expand the description to list the source types it can open, such as journal papers and datasets",
      "Add a system prompt rule that verify_claim is never used on numbers, with 2 examples",
      "Expand the description with what it compares, its outputs, and what it can't do"
    ],
    "a": 3,
    "why": "Descriptions are the main input the model uses to choose a tool. 'Checks a claim' fits arithmetic as well as source comparison. Stating what the tool compares, its outputs and what it can't do is the first fix. Listing the sources it opens doesn't address the misuse.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Helps with sums, but the vague description still invites misuse for anything that sounds like checking."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Right place, wrong content: knowing which sources it opens still doesn't say it compares a sentence to its cited source, or that it can't do arithmetic."
      },
      "C": {
        "trap": "probabilistic",
        "text": "A routing rule around a description that still doesn't say what the tool does."
      }
    },
    "cite": "Exam guide §2.1; notes/domain-2 §2.1 (expand descriptions with inputs, outputs, edge cases, boundaries)"
  },
  // A24 · ma 2.2 · adapted from d23c/C03
  {
    "id": "A24",
    "ts": "2.2",
    "s": "ma",
    "block": "ma",
    "q": "search_trial_registry returns an empty list in 2 cases: when no trials match, and when the matching trial's records are restricted, which the institute's access rights can't open. In 9 of 140 briefs the synthesis subagent wrote 'no trials found' for a treatment that had a restricted trial. The researchers want restricted trials flagged for a data-access request. What should the tool return for a restricted trial?",
    "o": [
      "An empty list, as now, with the word 'restricted' added to the tool's description",
      "isError with errorCategory 'transient' and isRetryable true, to make the agent retry",
      "isError, errorCategory 'permission', isRetryable false, noting a restricted match",
      "An empty list, plus a coordinator rule to treat each empty result as possibly restricted"
    ],
    "a": 2,
    "why": "An empty result means the query succeeded with no matches. An access failure is different and needs its own signal. A permission error that isn't retryable, noting that a restricted trial matched, lets the agent flag it for the data-access request.",
    "wrong": {
      "A": {
        "trap": "error-suppression",
        "text": "Still reports an access failure as an empty result, so the agent can't tell it apart from no matches."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Retrying won't open a restricted trial. The category tells the agent the wrong thing."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Makes every genuine 'no trials' doubtful and still hides which results were restricted."
      }
    },
    "cite": "Exam guide §2.2; notes/domain-2 §2.2"
  },
  // A25 · ma 2.3 · adapted from d2r/R08
  {
    "id": "A25",
    "ts": "2.3",
    "s": "ma",
    "block": "ma",
    "q": "Your synthesis subagent was given the full set of 12 web-research tools to check facts while drafting. It now runs broad searches mid-draft, and synthesis time has risen 40%. About 85% of its checks are single-fact confirmations against sources already collected; the rest need new research. How should you change its tools?",
    "o": [
      "Give it one narrow verify_fact tool for the simple checks and route checks that need new research via the coordinator",
      "Keep all 12 tools and tell it in the system prompt to search only when a fact cannot be confirmed from collected sources",
      "Remove every web tool and send each fact check, simple or complex, back through the coordinator for a research subagent",
      "Keep all 12 tools but rate-limit it to 3 search calls per draft, after which further searches are rejected with an error"
    ],
    "a": 0,
    "why": "Scoped access: the synthesis agent gets only what its role needs, plus a narrow cross-role tool for its high-frequency need. verify_fact covers the 85% of simple checks without coordinator round trips, while complex research still goes through the coordinator to the research agents.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Out-of-role tools left in place keep getting misused; a prompt rule only asks the agent to resist them."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Correct for the 15% that need research, but it sends the 85% of simple checks on a full coordinator round trip as well, adding latency."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Caps the damage without changing the tool set. The agent still holds 12 tools outside its specialization and spends its 3 calls on broad searches."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3"
  },
  // A26 · ma 4.3 · new (2026-11-01)
  {
    "id": "A26",
    "ts": "4.3",
    "s": "ma",
    "block": "ma",
    "q": "The document-analysis subagent returns each study's findings to the coordinator as JSON written in its reply text, and the coordinator parses it. In 1 run in 30 the parse fails, usually on a closing remark after the JSON. Separately, about 4% of parsed records put the publication year, such as 2019, in the sample_size field, and those studies get far too much weight in the brief. What should change?",
    "o": [
      "A tool with the record as its input schema, which stops both of the errors",
      "JSON in the reply text, with a retry on each failed parse and a value check",
      "A tool with the record as its input schema, plus a check on field values",
      "JSON in the reply text, with 3 example records that show each field filled"
    ],
    "a": 2,
    "why": "Returning the record through a tool whose input schema is the record removes JSON syntax failures. A schema does not stop semantic errors: 2019 is a valid integer for sample_size. A value check (for example, a sample size that looks like a year, or out of range for the study type) catches those.",
    "wrong": {
      "A": {
        "trap": "nonexistent-feature",
        "text": "The schema fixes the parse failures, but a year is still a valid number in sample_size. Strict schemas don't catch values in the wrong field."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "The value check is right, but retrying text JSON pays for failures that tool use removes at the source."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Examples may cut field mix-ups a little, but text JSON still fails to parse, and nothing checks the values."
      }
    },
    "cite": "Exam guide §4.3; notes/domain-4-prompt-engineering.md §4.3"
  },
  // A27 · ma 5.3 · adapted from d145/K12
  {
    "id": "A27",
    "ts": "5.3",
    "s": "ma",
    "block": "ma",
    "q": "The document-analysis subagent reads 12 regional monitoring reports a week. When one region's site timed out after 3 local retries, it returned {status: 'error', message: 'analysis failed'} and discarded the 11 reports it had finished. The coordinator then reran the whole analysis, which took 9 more minutes. What should the subagent return?",
    "o": [
      "An error with the failure type and the region name, and the 11 analyses left out",
      "The 11 finished analyses marked as success, with the failed region left out",
      "The failure type, the URL tried, the 11 finished analyses and alternatives",
      "An exception that stops the whole brief run until someone looks at it"
    ],
    "a": 2,
    "why": "Structured error context — failure type, what was attempted, partial results and alternatives — lets the coordinator decide: retry one source, use a substitute, or proceed with the 11.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Better than a generic status, but the 11 good analyses are still thrown away."
      },
      "B": {
        "trap": "error-suppression",
        "text": "Hides the gap: the brief silently omits a region and calls itself complete."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Ending the whole workflow on one failed source is a named anti-pattern."
      }
    },
    "cite": "Exam guide §5.3; notes/domain-5 §5.3"
  },
  // A28 · ma 5.3 · adapted from fresh1/F11
  {
    "id": "A28",
    "ts": "5.3",
    "s": "ma",
    "block": "ma",
    "q": "In 1 run of 4, the search subagent for pollen-count data fails after 2 retries because the city's data portal is down, and it reports this to the coordinator with what it tried. The coordinator continues, and the final report covers the other 3 topics well but says nothing about pollen counts. Readers assume none of the sources mentioned them. What should the report include?",
    "o": [
      "Notes on which findings are solid and which topics have gaps",
      "A scope line naming only the 3 topics the report does cover",
      "Nothing yet; hold the report until the portal is back up",
      "A note on the pollen gap in the coordinator's log only"
    ],
    "a": 0,
    "why": "When a source is unavailable, synthesis output should carry coverage annotations: which findings are well supported and which topic areas have gaps because sources were unavailable. Silence reads as \"nothing found\".",
    "wrong": {
      "B": {
        "trap": "error-suppression",
        "text": "A narrower scope hides that pollen counts were asked for and could not be found. Readers still can't tell a gap from a topic that was never relevant."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Holds 3 well-covered topics back for one outage. Going ahead with partial results is right, as long as the gap is shown."
      },
      "D": {
        "trap": "error-suppression",
        "text": "The coordinator knows about the gap, but the people reading the report don't; the gap has to appear where they read."
      }
    },
    "cite": "Exam guide §5.3; notes/domain-5-context-reliability.md §5.3"
  },
  // A29 · ma 5.6 · adapted from d145/K14
  {
    "id": "A29",
    "ts": "5.6",
    "s": "ma",
    "block": "ma",
    "q": "Two credible sources estimate last summer's heat-related deaths in the region: a government report says 2,100 and a university study says 1,900. Both cover the same summer and were published in the same week. In 3 briefs the synthesis subagent printed only the government figure with no mention of the other. How should this be handled?",
    "o": [
      "Print the average, 2,000 deaths, and cite both sources beside it",
      "Prefer the government figure as the more reliable public source",
      "Have the search subagent find a third estimate and print the majority value",
      "Keep both figures with sources, flag the conflict for the coordinator"
    ],
    "a": 3,
    "why": "Conflicting statistics from credible sources are kept and annotated with their sources, not resolved by picking one. Analysis completes with the conflict flagged, and the coordinator decides before synthesis.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Invents a figure neither source published and hides that they disagree."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Arbitrarily picks one value, the failure in the stem written down as a rule."
      },
      "C": {
        "trap": "over-engineered",
        "text": "A vote among sources still drops a credible figure and hides the disagreement."
      }
    },
    "cite": "Exam guide §5.6; notes/domain-5 §5.6"
  },
  // A30 · ma 5.6 · adapted from fresh1/F12
  {
    "id": "A30",
    "ts": "5.6",
    "s": "ma",
    "block": "ma",
    "q": "The report subagent turns everything into prose. A comparison of nitrogen dioxide levels across 6 cities and 4 years now reads as 3 paragraphs of numbers, and reviewers cannot compare the cities. News coverage of a 2025 smog episode and a list of air-quality standards are also written as running prose. What should the report subagent do?",
    "o": [
      "Pollution data as a table, news as a table, standards as a list",
      "Pollution data as a table, news as prose, standards as a list",
      "Keep prose but bold every number in the pollution paragraphs",
      "Move the pollution comparison into an appendix of raw data tables"
    ],
    "a": 1,
    "why": "Synthesis output should render each content type in the form that suits it: numeric comparisons such as cost or pollution figures in tables, news in prose, technical findings in lists, instead of forcing one format on everything.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Two of 3 are right, but news coverage reads as prose; a table flattens it."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Bold numbers are easier to spot but still cannot be compared across 6 cities and 4 years."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "This hides the key comparison instead of presenting it in a form readers can use."
      }
    },
    "cite": "Exam guide §5.6; notes/domain-5-context-reliability.md §5.6"
  },
  // A31 · dp 1.1 · adapted from wr4/T01
  {
    "id": "A31",
    "ts": "1.1",
    "s": "dp",
    "block": "dp",
    "q": "The agent's loop runs tools on stop_reason \"tool_use\" and ends on \"end_turn\". Most engineer questions take 4 to 12 tool calls, but questions about the legacy billing module can take up to 35. Last month one run called get_build_status 540 times for a build job that had been deleted, until the API key hit its daily limit. A developer proposes ending each run after 15 tool calls. The team wants protection against any runaway run, not only this one. What should you do instead?",
    "o": [
      "Keep stop_reason as the signal; add an 80-call cap that halts and alerts",
      "Replace the stop_reason check with a 15-call cap on each run",
      "End the run when Claude's reply says it cannot find the build job",
      "Add a prompt line telling Claude to stop after 3 failed tool calls"
    ],
    "a": 0,
    "why": "stop_reason stays the control signal. An iteration cap is a sound safety net when it sits well above the longest normal run (35 calls): it stops a runaway and tells a person, without cutting off real work.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "Makes the cap the main stopping signal, and 15 calls cuts off legacy-billing runs that need up to 35."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Parsing the reply's wording to stop the loop is a named anti-pattern, and it only covers this one failure."
      },
      "D": {
        "trap": "probabilistic",
        "text": "A prompt line is guidance the model may not follow; it gives no guaranteed stop for a runaway run."
      }
    },
    "cite": "Exam guide §1.1; notes/domain-1 §1.1 (caps fine as a safety net, wrong as the control signal); LR-0045 T05"
  },
  // A32 · dp 1.2 · adapted from sim3/N33
  {
    "id": "A32",
    "ts": "1.2",
    "s": "dp",
    "block": "dp",
    "q": "For a refactoring question, the coordinator sends the same prompt, \"find everything related to customs holds\", to 4 explorer subagents in parallel. All 4 search the same 140 files, and 80% of their findings are duplicates the coordinator has to merge. The customs-hold code covers several separate concerns. How should the coordinator split the work?",
    "o": [
      "Give each explorer a distinct customs-hold subtopic with its own search goal",
      "Keep the same prompt and remove duplicates once all 4 explorers finish",
      "Split the 140 files into 4 equal batches of 35 in file-name order",
      "Use 1 explorer only and give it the whole customs-hold question to work on"
    ],
    "a": 0,
    "why": "The coordinator should partition the scope across subagents by distinct subtopic, which minimises duplicated work while keeping the parallelism and keeping each concern whole.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "The duplicated searching still happens; only the cleanup moves."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "It removes overlap but cuts related code apart arbitrarily, so no explorer sees a whole concern."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "It removes duplication by giving up parallel work and loading all 140 files into one context."
      }
    },
    "cite": "Exam guide §1.2; notes/domain-1-agentic-architecture.md §1.2"
  },
  // A33 · dp 1.3 · adapted from sim2/M34
  {
    "id": "A33",
    "ts": "1.3",
    "s": "dp",
    "block": "dp",
    "q": "The coordinator's prompt to the explorer is 14 numbered steps: open Application.java, then AppConfig.java, then each controller, and so on. About 30% of modules use a newer folder layout without those files; there the explorer follows the steps anyway and returns empty sections. The team wants it to find the module's structure whatever the layout. How should the coordinator brief the explorer?",
    "o": [
      "Add steps for the newer layout, with a branch on the folder name",
      "Add a 15th step: 'If a file in a step is missing, skip that step'",
      "State the goal and what good findings look like, not the steps",
      "Check the layout first and send 1 of 2 different step lists"
    ],
    "a": 2,
    "why": "Coordinator prompts should specify the research goal and quality criteria rather than step-by-step procedure, which lets the subagent adapt to what it finds, such as a different layout.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "This handles today's 2 layouts and breaks on the next one."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Skipping missing files still returns empty sections; the explorer is still not looking for the structure."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Two fixed procedures are still procedures, with the coordinator now doing the explorer's job."
      }
    },
    "cite": "Exam guide §1.3; notes/domain-1-agentic-architecture.md §1.3"
  },
  // A34 · dp 1.7 · adapted from sim3/N38
  {
    "id": "A34",
    "ts": "1.7",
    "s": "dp",
    "block": "dp",
    "q": "After a 2-hour session mapping the freight-rating code, a developer wants to compare 2 refactoring approaches: splitting the rater by transport mode, or replacing it with a rules table. The mapping is still current, both attempts should start from it, and neither attempt should affect the other. Re-running the 2-hour mapping for each approach is too slow. What should they use?",
    "o": [
      "Resume the session twice in a row and try one approach in each resume",
      "fork_session to make 2 branches from the mapped session, one per approach",
      "Start 2 new sessions and paste the same short summary of the mapping in each",
      "Try both approaches one after the other in the same session's context"
    ],
    "a": 1,
    "why": "fork_session creates independent branches from a shared analysis baseline, made for comparing divergent approaches without either affecting the other.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Resuming continues the same line, so the second attempt starts with the first one already in its history."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "A fresh start with a summary suits stale context; here the full mapping is current, and a short summary drops most of it."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "The second approach would be shaped by the first; they would not be independent."
      }
    },
    "cite": "Exam guide §1.7; notes/domain-1-agentic-architecture.md §1.7"
  },
  // A35 · dp 2.1 · adapted from d23e/J02
  {
    "id": "A35",
    "ts": "2.1",
    "s": "dp",
    "block": "dp",
    "q": "Your MCP server offers one tool, run_query, described as 'Runs a query'. Engineers use it for 3 jobs, each with different input: SQL against the shipments database, a search string for 18 months of application logs, and a metric name with a time window for the metrics store. In a week of 400 calls, 52 went to the wrong backend, most of them log searches written as SQL. What should you do?",
    "o": [
      "Add a system prompt rule that log searches don't use SQL syntax",
      "Split it into 3 tools, each with its own inputs and description",
      "Return isError when SQL arrives at the log store, with a hint",
      "Put a worked example of each query type in the system prompt"
    ],
    "a": 1,
    "why": "One generic tool covering 3 jobs with 3 different input shapes cannot say clearly what it expects. Splitting it into purpose-specific tools, each with a defined input and a description of when to use it, removes the overlap the model is guessing across.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "A rule for one of the 3 confusions. The single vague tool is still what gets misused."
      },
      "C": {
        "trap": "reactive-too-late",
        "text": "Catches the mistake after the call, for one backend only. The tool still doesn't say what it takes."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Examples in the prompt help, but one tool with one vague description still has to carry 3 different inputs."
      }
    },
    "cite": "Exam guide §2.1; notes/domain-2 §2.1"
  },
  // A36 · dp 2.4 · adapted from sim3/N40
  {
    "id": "A36",
    "ts": "2.4",
    "s": "dp",
    "block": "dp",
    "q": "All 12 developers on the team should use the same MCP server for the shipments database. The server needs a read-only database token, and each developer has their own token in their shell environment as SHIPMENTS_DB_TOKEN. One developer configured the server in their ~/.claude.json, and teammates who cloned the repository do not see it. Where and how should the server be configured?",
    "o": [
      "In each developer's ~/.claude.json, with their own token pasted in directly",
      "In the repository's .mcp.json, with a shared read-only token committed to it",
      "In CLAUDE.md, with instructions that tell Claude how to connect to the server",
      "In the repository's .mcp.json, with the token given as ${SHIPMENTS_DB_TOKEN}"
    ],
    "a": 3,
    "why": "Shared team servers belong in the project-scoped .mcp.json, which is version-controlled. Environment variable expansion such as ${SHIPMENTS_DB_TOKEN} reads each developer's own token at connection time, so no secret is committed.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "That is personal scope: each developer sets it up by hand, and the shared tooling still is not in the repository."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Right file, but it commits a secret to version control."
      },
      "C": {
        "trap": "nonexistent-feature",
        "text": "CLAUDE.md does not configure MCP servers; instructions do not create a connection."
      }
    },
    "cite": "Exam guide §2.4; score-report objectives 14, 28; notes/domain-2-tool-design-mcp.md §2.4; notes/2026-09-docs-delta.md §2.4"
  },
  // A37 · dp 2.4 · adapted from sim3/N39
  {
    "id": "A37",
    "ts": "2.4",
    "s": "dp",
    "block": "dp",
    "q": "Agents waste many calls exploring the shipments database: before answering a question, the explorer typically calls list_tables and then describe_table 10 to 15 times to find the right columns. The schema of the 180 tables changes about once a quarter. The team runs its own MCP server for the database. What should the server add?",
    "o": [
      "A search_tables tool the agent calls to filter tables by keyword",
      "A system prompt note listing the 20 tables the agents use most often",
      "The table schema exposed as an MCP resource that the agents can read",
      "A larger page size for describe_table that returns 15 tables at a time"
    ],
    "a": 2,
    "why": "MCP resources expose content catalogues, such as a database schema, so the agent can see what data exists up front instead of discovering it through repeated tool calls.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Fewer calls per search, but the agent still has to explore by calling tools to learn what exists."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "A hand-kept list covers part of the schema and goes stale when it changes."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "It bundles exploratory calls; the agent still explores blind."
      }
    },
    "cite": "Exam guide §2.4; notes/domain-2-tool-design-mcp.md §2.4"
  },
  // A38 · dp 2.5 · adapted from sim3/N41
  {
    "id": "A38",
    "ts": "2.5",
    "s": "dp",
    "block": "dp",
    "q": "A new developer asks the tool where the fuel surcharge is calculated. The explorer subagent's first step is to Read all 260 files under src/main/java/rating/, and it runs out of context before answering in 1 of 3 attempts. The surcharge code is known to call a function named applyFuelSurcharge. How should the explorer start?",
    "o": [
      "Glob for **/*Surcharge*.java and Read every file it matches before answering",
      "Read the 260 files in 2 batches of 130, then summarise each batch in turn",
      "Use Bash to cat every .java file into one large file and Read that file",
      "Grep for applyFuelSurcharge, then Read the files found and follow imports"
    ],
    "a": 3,
    "why": "Build understanding incrementally: Grep finds entry points by content, such as a function name, then Read follows the imports and flow from there instead of loading every file first.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "File names may not contain \"Surcharge\", and reading every match up front is the same habit at a smaller scale."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "It still reads everything up front; summaries of 130 files lose the detail needed."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "One big file is the same amount of text, so the context still overflows."
      }
    },
    "cite": "Exam guide §2.5; score-report objective 13; notes/domain-2-tool-design-mcp.md §2.5"
  },
  // A39 · dp 2.5 · adapted from sim3/N42
  {
    "id": "A39",
    "ts": "2.5",
    "s": "dp",
    "block": "dp",
    "q": "The doc writer needs a list of every test file in the codebase before it drafts the testing guide. Test files follow the naming pattern *Test.java and sit in 70 folders next to the modules they test. The explorer currently runs Grep for the word \"test\" and returns 4,100 matches, most of them inside ordinary modules. Which tool call fits?",
    "o": [
      "Grep for \"Test\" across the codebase and keep the matching lines",
      "Glob with the pattern **/*Test.java to list the files by name",
      "Bash running ls in each of the 70 folders and joining the output",
      "Read each folder's index file and copy the tests listed there"
    ],
    "a": 1,
    "why": "Glob matches file paths by pattern, so **/*Test.java lists every test file wherever it sits. Grep is for searching inside files.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Grep searches file contents; the need is to find files by name."
      },
      "C": {
        "trap": "over-engineered",
        "text": "It works, but it rebuilds by hand what a single Glob call does."
      },
      "D": {
        "trap": "nonexistent-feature",
        "text": "Nothing in the stem says such index files exist; the names already follow a pattern."
      }
    },
    "cite": "Exam guide §2.5; score-report objective 13; notes/domain-2-tool-design-mcp.md §2.5"
  },
  // A40 · dp 3.1 · adapted from d23c/C13
  {
    "id": "A40",
    "ts": "3.1",
    "s": "dp",
    "block": "dp",
    "q": "The root CLAUDE.md has a '## Monolith only' section with 80 lines of Java and Spring rules and a '## Services only' section with 120 lines of Kotlin coroutine rules. Monolith code lives under monolith/ and the Kotlin services under services/. In services-only sessions Claude still applies monolith patterns, such as blocking JDBC calls, about 1 time in 10. What should change?",
    "o": [
      "Strengthen the headings to say 'apply ONLY when editing files in services/'",
      "Move both sections into each engineer's CLAUDE.local.md at the repo root",
      "Move each section into its own CLAUDE.md, one in monolith/ and one in services/",
      "Turn each section into a skill that engineers run when starting that work"
    ],
    "a": 2,
    "why": "A heading doesn't control where a file loads: the root CLAUDE.md loads in full every session. A CLAUDE.md in a subdirectory loads when Claude reads files there, so each set of rules arrives only with its own code.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "A heading is still text in one file that loads for every session. It can't limit its own reach."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Personal copies of team rules, and both sections still load in every session."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Rules for editing code should apply whenever that code is touched, not when someone remembers a skill."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1; notes/2026-09-docs-delta §3.1 (subdirectory files load when Claude reads files there); LR-0033 (Q20)"
  },
  // A41 · dp 3.2 · adapted from d23c/C16
  {
    "id": "A41",
    "ts": "3.2",
    "s": "dp",
    "block": "dp",
    "q": "The team's /dead-code-audit skill should only read the project and report unused classes. In 2 of its last 30 runs it also moved files it judged unused into an archive/ folder with Bash, and a build broke. The team still wants the report from each run. What should change in the skill?",
    "o": [
      "Set context: fork, which runs the skill in a separate subagent",
      "Set allowed-tools in its frontmatter to Read, Grep and Glob",
      "Set disable-model-invocation, so it runs only when typed",
      "Add a line to SKILL.md asking it never to move or delete files"
    ],
    "a": 1,
    "why": "allowed-tools restricts which tools a skill may use while it runs. Limiting it to read-only tools keeps the report and removes the ability to move files.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Changes where it runs, not what it's allowed to do. The subagent could still move files."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Changes who can start it. A typed run can still move files."
      },
      "D": {
        "trap": "probabilistic",
        "text": "A request inside the skill it already ignored twice."
      }
    },
    "cite": "Exam guide §3.2; notes/domain-3 §3.2"
  },
  // A42 · dp 3.3 · adapted from d23c/C17
  {
    "id": "A42",
    "ts": "3.3",
    "s": "dp",
    "block": "dp",
    "q": "The team added .claude/rules/migrations.md and .claude/rules/kafka.md, 150 lines each, expecting them to load only for that kind of work. Neither file has frontmatter. /memory in a session that only touched UI code shows both loaded. Migration files (*.sql) sit in db/migration/ folders in 30 modules. What should change?",
    "o": [
      "Merge both into the root CLAUDE.md, under separate headings",
      "Put a CLAUDE.md with the migration rules in each of the 30 folders",
      "Add paths: frontmatter, such as **/db/migration/*.sql",
      "Turn both files into skills that engineers run before that work"
    ],
    "a": 2,
    "why": "A rules file without paths frontmatter loads at launch like CLAUDE.md. Adding paths globs makes it load only when Claude reads a matching file, wherever it sits.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "Back to loading both in every session, relying on Claude to pick the heading."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "30 copies that drift, and a new migration folder starts without one."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Conventions should apply whenever matching files are edited, not when someone remembers a skill."
      }
    },
    "cite": "notes/2026-09-docs-delta §3.1 (rules without paths load at launch); Exam guide §3.3; notes/domain-3 §3.3; LR-0033 (Q24)"
  },
  // A43 · dp 3.5 · new (2026-11-01)
  {
    "id": "A43",
    "ts": "3.5",
    "s": "dp",
    "block": "dp",
    "q": "An engineer who has never worked on dangerous-goods shipping must have the agent build a validator for hazardous-cargo bookings. The regulations run to about 300 pages, and the engineer does not yet know which rules matter for the 4 cargo classes Corvane carries. Once built, the validator must be re-checked on every change, as a missed rule can hold a container at port for days. Which approach fits?",
    "o": [
      "Have Claude ask about the 4 classes first, then write tests and share failures",
      "Have Claude ask about the 4 classes first, then build it and review it by hand",
      "Write tests from the engineer's current notes, then share failures each round",
      "Give Claude 3 sample bookings with the result each should get, then fix misses"
    ],
    "a": 0,
    "why": "Two needs, two techniques. The engineer doesn't know the domain yet, so the interview pattern (Claude asks questions first) surfaces the rules and edge cases they haven't thought of. The validator must then be checked on every change, which is what a test suite written first, with failures shared each round, gives.",
    "wrong": {
      "B": {
        "trap": "reactive-too-late",
        "text": "The interview surfaces the rules, but a hand review checks once. Nothing re-checks the rules on each later change."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Tests are right for re-checking, but they encode only the notes of someone who doesn't yet know which rules matter."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "3 examples suit a transformation that prose describes poorly. They can't cover regulations nobody has mapped, and nothing re-checks them on each change."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3-claude-code-config.md §3.5"
  },
  // A44 · dp 4.1 · new (2026-11-01)
  {
    "id": "A44",
    "ts": "4.1",
    "s": "dp",
    "block": "dp",
    "q": "Each week the agent reviews the dependency upgrades waiting to merge and flags 'possible breaking change' on some of them. Engineers dismiss 70% of the flags. A sample shows most dismissed flags are patch releases or libraries used only in tests, but about a third of the dismissed flags share no obvious cause. The prompt says: 'Flag any upgrade that might break something.' What should change?",
    "o": [
      "Name what to flag and what to skip, and post a flag only when it is high-confidence",
      "Keep the prompt, and tag each flag with the pattern behind it for later analysis",
      "Keep the prompt, and post only flags that the model scores above 0.8 confidence",
      "Name what to flag and what to skip, and tag each flag with the pattern behind it"
    ],
    "a": 3,
    "why": "The known false positives (patch releases, test-only libraries) need explicit criteria for what to report and what to skip. The unexplained third needs data: a detected_pattern tag on each flag lets the team group dismissed flags and find their cause.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The criteria help, but 'only high-confidence' is the kind of instruction the guide says fails to improve precision, and it does nothing to explain the unknown third."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Tagging finds the unknown causes, but the vague prompt keeps producing the known false positives meanwhile."
      },
      "C": {
        "trap": "probabilistic",
        "text": "A self-assigned score comes from the same vague standard. It neither names what to skip nor explains the unknown third."
      }
    },
    "cite": "Exam guide §4.1; Exam guide §4.4; notes/domain-4-prompt-engineering.md §4.1, §4.4"
  },
  // A45 · dp 5.4 · adapted from sim2/M45
  {
    "id": "A45",
    "ts": "5.4",
    "s": "dp",
    "block": "dp",
    "q": "To answer 'which modules write to the consignments table?', the main agent read 120 files itself and used about 85% of its context. Its follow-up answers got vaguer, and it began describing 'a typical repository class' instead of the classes it had read. It has already run /compact twice, and each time it lost the module list it had built. How should the next question be handled?",
    "o": [
      "Read only the first 50 lines of each file to save its context",
      "Spawn subagents to investigate and return short summaries",
      "Run /compact before each new follow-up question it gets",
      "Raise max_tokens on each request to fit more of the files in"
    ],
    "a": 1,
    "why": "Subagent delegation isolates verbose exploration: each subagent reads files in its own context and returns a summary, while the main agent keeps the high-level picture. That keeps the main context from filling with raw file contents.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "The write may be past line 50; a fixed cut-off reads less, not more selectively."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "/compact was already tried twice and lost the module list each time."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "max_tokens caps the reply length; it does not enlarge the context window."
      }
    },
    "cite": "Exam guide §5.4; score-report objective 15; notes/domain-5-context-reliability.md §5.4"
  },
  // A46 · ci 3.1 · new (2026-11-01)
  {
    "id": "A46",
    "ts": "3.1",
    "s": "ci",
    "block": "ci",
    "q": "The CI review job runs claude -p from the repository root and has Claude read each changed file before it reviews the change. The 40 lines of Swift review standards live only in the iOS lead's ~/.claude/CLAUDE.md, and the 60 lines of Kotlin standards sit in docs/android-review.md, which no CLAUDE.md references. In CI, reviews of iOS changes ignore the Swift standards and Android reviews ignore the Kotlin ones. The team also wants each app's reviews to load only that app's standards. What should change?",
    "o": [
      "Commit both as files and @import both of them from the root CLAUDE.md",
      "Add both sets of standards to the CI runner's own ~/.claude/CLAUDE.md",
      "Commit both as files and @import each one from its own app's CLAUDE.md",
      "Keep the Swift file where it is, and @import the Kotlin file in android/"
    ],
    "a": 2,
    "why": "A user-level ~/.claude/CLAUDE.md applies only to that user, so CI never sees it, and a file nothing references never loads. Committing both and importing each from its app's CLAUDE.md shares them through version control. An app's CLAUDE.md loads when Claude reads a file in that app's folder, which this job does for every changed file, so each set arrives only with its own code.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "CI now sees both, but the root CLAUDE.md loads in every session, so every review carries both apps' standards."
      },
      "B": {
        "trap": "blame-shifting",
        "text": "Puts team standards outside version control on one machine, and loads both sets for every review."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Fixes Android only. The Swift standards stay in one person's user-level file, which CI never loads."
      }
    },
    "cite": "Exam guide §3.1; Exam guide §3.6; notes/domain-3-claude-code-config.md §3.1 (subdirectory files load lazily when Claude reads files there)"
  },
  // A47 · ci 3.2 · new (2026-11-01)
  {
    "id": "A47",
    "ts": "3.2",
    "s": "ci",
    "block": "ci",
    "q": "Developers want to run, before pushing, the same review the CI job runs. The iOS lead wrote it as a command in their own ~/.claude/commands/, and 6 of the 45 engineers have copied it by hand, each copy now slightly different. Each run prints about 2,000 lines of analysis into the session, after which Claude often loses track of the change the developer was making. What should you set up?",
    "o": [
      "A project command in .claude/commands/, copied as it is from the lead's",
      "A personal skill in each developer's ~/.claude/skills/ with context: fork",
      "A project skill in .claude/skills/ with context: fork in its frontmatter",
      "A project skill in .claude/skills/ with allowed-tools set to Read and Grep"
    ],
    "a": 2,
    "why": "A project skill in .claude/skills/ is shared through version control, which ends the drifting copies. context: fork runs it in an isolated sub-agent context, so the 2,000 lines stay out of the main session and only the result comes back.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Sharing it fixes the drift, but the 2,000 lines still land in the developer's session."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "context: fork fixes the noise, but 45 personal copies are the drifting copies the team already has."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Shared and correct in scope, but allowed-tools limits what the skill may do, not how much it prints into the session."
      }
    },
    "cite": "Exam guide §3.2; notes/domain-3-claude-code-config.md §3.2"
  },
  // A48 · ci 3.5 · adapted from dm/M31
  {
    "id": "A48",
    "ts": "3.5",
    "s": "ci",
    "block": "ci",
    "q": "Claude Code is writing a normalizer for payee account numbers that arrive in 5 formats. After 4 rounds of 'it is still wrong for some numbers, please fix it', each round fixes one format and breaks another. Your test suite now has 11 failing cases. What feedback should you give next?",
    "o": [
      "Send the single most common failing format with a longer prose description of the rules",
      "Ask Claude to rewrite the normalizer from scratch and handle each edge case more carefully",
      "Fix one format per round, re-running the whole test suite after each change to catch regressions",
      "Send all 11 failing cases together, each with its input and the exact output expected"
    ],
    "a": 3,
    "why": "Concrete input/output examples beat prose when descriptions are interpreted inconsistently. Seeing every failure at once stops the fix-one-break-another cycle.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "One format at a time is what produced the cycle. More prose is the channel that was already being misread."
      },
      "B": {
        "trap": "probabilistic",
        "text": "'More carefully' is vague feedback, the same kind that failed for 4 rounds."
      },
      "C": {
        "trap": "reactive-too-late",
        "text": "Catching regressions after each round keeps the cycle going. The fix needs all the cases at once."
      }
    },
    "cite": "Exam guide §3.5; learning record 0017; score report objective 8; lesson 0013"
  },
  // A49 · ci 3.6 · adapted from d23d/H29
  {
    "id": "A49",
    "ts": "3.6",
    "s": "ci",
    "block": "ci",
    "q": "A GitHub Actions job runs claude 'summarise the migrations in this PR' on each pull request. The job never finishes and is killed by the 20-minute timeout, even on PRs with 1 migration. Run by hand in a terminal, the same command prints a summary within a minute. What should change?",
    "o": [
      "Set CLAUDE_HEADLESS=true in the job's environment",
      "Add the -p flag for non-interactive mode",
      "Pipe the PR diff into the command's standard input",
      "Raise the job's timeout, from 20 to 60 minutes"
    ],
    "a": 1,
    "why": "Without -p, Claude Code starts an interactive session and waits for input that never comes in CI. -p runs the prompt, prints the result and exits.",
    "wrong": {
      "A": {
        "trap": "nonexistent-feature",
        "text": "No such variable exists. The non-interactive switch is -p."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Gives it input, but without -p it still starts an interactive session."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "The job is waiting for input, not running slowly."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6 (-p / --print; CLAUDE_HEADLESS does not exist)"
  },
  // A50 · ci 3.6 · adapted from d23e/J23
  {
    "id": "A50",
    "ts": "3.6",
    "s": "ci",
    "block": "ci",
    "q": "The PR review job asks claude -p for findings in prose and parses them with regular expressions to post inline comments. In 1 run in 7 the wording drifts, and comments land on the wrong line or are dropped. The prompt already describes the exact text format to use. What should change?",
    "o": [
      "A stricter prompt with 3 examples of the exact text format",
      "--output-format stream-json to show progress in the log",
      "--output-format json with --json-schema for the findings",
      "A retry of the run whenever the regular expression fails"
    ],
    "a": 2,
    "why": "--output-format json with --json-schema returns machine-parseable findings that match a schema, which the script can post as inline comments without parsing prose.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The prompt already describes the format. More instruction still leaves prose to parse."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Streams progress events. The findings are still prose."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Pays for whole re-runs, and drift that doesn't trip the regex still gets through."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6"
  },
  // A51 · ci 3.6 · adapted from d23d/H30
  {
    "id": "A51",
    "ts": "3.6",
    "s": "ci",
    "block": "ci",
    "q": "A nightly CI job uses one claude -p session to write a fix for each failing test and then, in the same session, review the fix before it is pushed. Over 50 fixes the review approved 49, and engineers later reverted 9 of them. The review prompt already asks for a critical, line-by-line check. What should change?",
    "o": [
      "Make the review prompt stricter, with the 9 reverted fixes as examples",
      "Ask the same session to review each fix twice before approving it",
      "Do the review in a second claude -p instance that didn't write the fix",
      "Use --output-format json and block fixes the review scores below 8"
    ],
    "a": 2,
    "why": "A session that generated code keeps its reasoning context and is less likely to question its own decisions. A separate instance without that context reviews more independently.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The same session still reviews with the reasoning that produced the fix."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Two passes by the same session share the same blind spots."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Changes the format of the verdict, not who gives it."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6 (independent review instance)"
  },
  // A52 · ci 3.6 · adapted from d23e/J22
  {
    "id": "A52",
    "ts": "3.6",
    "s": "ci",
    "block": "ci",
    "q": "The PR review job runs claude -p on each push to a pull request. On one PR with 4 pushes it posted the same 6 findings each time, 24 comments in all, though nobody had changed the lines involved. Developers have started muting the bot. What should change?",
    "o": [
      "Run the review only on the first push of each pull request",
      "Raise the prompt's bar to report only high-severity issues",
      "Have the CI script delete the bot's old comments each run",
      "Pass in the earlier findings and ask for new or open ones"
    ],
    "a": 3,
    "why": "On a re-run, including the prior findings and asking only for new or still-unaddressed issues stops the job repeating what it has already posted.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Later pushes go unreviewed."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Fewer findings, still repeated on every push, and real lower-severity issues are lost."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Removes the history and still posts the same 6 findings on every push."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6"
  },
  // A53 · ci 4.1 · adapted from wr2/V01
  {
    "id": "A53",
    "ts": "4.1",
    "s": "ci",
    "block": "ci",
    "q": "The PR review posts findings in 5 categories: security, migration safety, N+1 queries, missing tests and Kotlin style conventions. Developers act on 88% of the security and migration findings but dismiss 79% of the conventions findings, and many now resolve the bot's whole comment thread without reading it. A prompt line added 2 weeks ago, \"report only conventions issues you are confident about\", moved the dismissal rate from 81% to 79%. What should you do?",
    "o": [
      "Turn off the conventions category while you write report and skip rules for it",
      "Have the model give each conventions finding a 0–1 score and hide those under 0.85",
      "Gather conventions findings into one summary comment at the end of each review",
      "Have a second Claude instance re-check each conventions finding before posting"
    ],
    "a": 0,
    "why": "A category with a high false-positive rate drags down trust in the accurate ones, which is why the security findings are being skipped too. Turning it off restores trust now, while you write explicit criteria for which conventions issues to report and which to skip.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "A score the model gives itself comes from the same judgement as \"only report what you're confident about\", and that line already failed."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Moves the noise to one comment but keeps posting it, and does nothing about what counts as a conventions issue."
      },
      "D": {
        "trap": "over-engineered",
        "text": "A second reviewer checks against the same vague standard; nothing defines which conventions issues matter."
      }
    },
    "cite": "Exam guide §4.1; notes/domain-4 §4.1; LR-0040 M29"
  },
  // A54 · ci 4.1 · adapted from gauntlet/G33
  {
    "id": "A54",
    "ts": "4.1",
    "s": "ci",
    "block": "ci",
    "q": "The PR reviewer flags an average of 14 issues per PR; developers dismiss 40% of them as noise — style nits labelled as bugs, hypothetical race conditions in single-threaded code, and suggestions to add tests to test files. The prompt says find all bugs and problems. Engineers have started ignoring the reviewer. What should change first?",
    "o": [
      "Switch the reviewer to the most capable model available to judge severity better",
      "Cap the reviewer at five findings per PR, the ones it is most confident about",
      "Rewrite the prompt with severity definitions, examples and what not to report",
      "Run three reviewer instances and report only findings that at least two agree on"
    ],
    "a": 2,
    "why": "False positives come from an unbounded instruction: 'all problems' invites everything. Explicit criteria — severity definitions with examples, exclusions, and a required failure scenario — raise precision at the source. A bigger model still has no definition of problem; a cap or a vote hides noise rather than removing it, and consensus filtering can drop real findings.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Capability is not the gap; the criteria are undefined for any model."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Fewer findings, same noise ratio, and real issues past the cap vanish."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Triples the cost to filter noise the prompt should never have produced."
      }
    },
    "cite": "notes/domain-4-prompt-engineering.md §4.1"
  },
  // A55 · ci 4.2 · adapted from wr2/V06
  {
    "id": "A55",
    "ts": "4.2",
    "s": "ci",
    "block": "ci",
    "q": "Each PR review finding is posted as a comment that should give the file and line, the issue, its level and a suggested fix. The prompt has a 14-line section describing that layout. In 100 sampled comments, 38 left out the line or the fix, and some ran to 3 paragraphs. Rewriting the section as a numbered list in capitals changed nothing. What should you add?",
    "o": [
      "A word limit of 80 for each comment, enforced by cutting off longer ones",
      "3 sample comments in the prompt, each following the required layout exactly",
      "A final prompt line asking the model to check its layout before replying",
      "A second Claude call that rewrites each comment into the layout before posting"
    ],
    "a": 1,
    "why": "When detailed instructions alone give inconsistent output, a few examples of the exact layout are the most effective way to get it consistently.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Cutting text off shortens the long comments but does not add the missing line or fix, and may cut them off."
      },
      "C": {
        "trap": "probabilistic",
        "text": "More instruction about the same layout; instructions are what already failed twice."
      },
      "D": {
        "trap": "over-engineered",
        "text": "A second call per comment, and it cannot add a line number or fix that the first comment left out."
      }
    },
    "cite": "Exam guide §4.2; notes/domain-4 §4.2"
  },
  // A56 · ci 4.3 · new (2026-11-01)
  {
    "id": "A56",
    "ts": "4.3",
    "s": "ci",
    "block": "ci",
    "q": "The PR review job returns findings through --json-schema. The schema requires an integer line on every finding and limits category to 5 values: security, performance, correctness, tests and style. For findings about a whole file, such as a missing licence header, Claude fills in line 1, and the bot pins those comments to the first line. About 6% of findings fit no category, such as accessibility problems in layouts, and get forced into style. New kinds of finding keep appearing. What schema changes fit?",
    "o": [
      "Make line optional and nullable, and add \"accessibility\" to the enum",
      "Make line optional and nullable, and add \"other\" with a detail string",
      "Keep line required, and add \"other\" with a detail string to the enum",
      "Keep line required, and tell Claude to give file-level findings line 0"
    ],
    "a": 1,
    "why": "A field the source may not have should be optional and nullable; a required one pushes the model to invent a value, here line 1. An enum for a list that keeps growing needs an \"other\" value plus a detail string, so new kinds of finding are recorded honestly.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "The line fix is right, but adding today's missing category leaves the next new kind forced into style again."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "The category fix is right, but a required line still makes Claude invent one for file-level findings."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "0 is still an invented value in a required field, and the category problem is untouched."
      }
    },
    "cite": "Exam guide §4.3; notes/domain-4-prompt-engineering.md §4.3"
  },
  // A57 · ci 4.4 · adapted from gauntlet/G39
  {
    "id": "A57",
    "ts": "4.4",
    "s": "ci",
    "block": "ci",
    "q": "A CI step on the API service asks Claude to generate tests for changed files and retries until the generated tests pass. One PR looped for 2 hours and 340 model calls on a file whose behaviour is genuinely nondeterministic, and the nightly bill tripled. The team still wants automatic retries for ordinary flakiness. What should the loop do?",
    "o": [
      "Cap retries at three, then fail visibly and queue the file for human review",
      "After three failures, mark the file as covered and move on so the pipeline always completes",
      "Add a cost-prediction model that estimates whether a file is worth retrying before each attempt",
      "Remove nondeterministic files from the test-generation target list by hand whenever one is found"
    ],
    "a": 0,
    "why": "A validation-retry loop needs a bound, and the bound must surface: a cap followed by a visible failure and a review queue turns a runaway into a signal. Marking the file covered hides a real problem; hand-maintained exclusion lists rot; a prediction model is machinery for a counter.",
    "wrong": {
      "B": {
        "trap": "error-suppression",
        "text": "Reports coverage that does not exist so the pipeline looks green."
      },
      "C": {
        "trap": "over-engineered",
        "text": "A model to decide when to stop, instead of a number."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Moves the problem to a manual list that the next nondeterministic file will not be on."
      }
    },
    "cite": "notes/domain-4-prompt-engineering.md §4.4"
  },
  // A58 · ci 4.5 · adapted from wr2/V02
  {
    "id": "A58",
    "ts": "4.5",
    "s": "ci",
    "block": "ci",
    "q": "Two Claude jobs run in the team's CI. The pre-merge review runs about 140 times a day, and a pull request cannot merge until it finishes; developers wait on it. A nightly job writes missing tests for the 30 least-covered files and is read the next morning. Finance asks you to move both jobs to the Message Batches API for the 50% saving. What should you do?",
    "o": [
      "Batch both jobs and let a pull request merge if its review is not back in 1 hour",
      "Batch both jobs, submitting each pre-merge review as its own one-request batch",
      "Batch both jobs and cache the review's shared prompt to shorten its wait",
      "Batch the nightly test job and keep the pre-merge review on the synchronous API"
    ],
    "a": 3,
    "why": "Batch processing suits latency-tolerant work like a nightly job. It has a processing window of up to 24 hours and no latency guarantee, so it does not suit a blocking check that developers wait on.",
    "wrong": {
      "A": {
        "trap": "error-suppression",
        "text": "Turns a slow review into a skipped review: with no latency guarantee, many pull requests would merge unreviewed."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "A batch of one request has the same up-to-24-hour window and no latency guarantee."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Prompt caching cuts the cost and time of processing a request, but a batched review still has the up-to-24-hour window and no latency guarantee."
      }
    },
    "cite": "Exam guide §4.5; notes/domain-4 §4.5; audit r1: D made a near miss"
  },
  // A59 · ci 4.5 · adapted from wr2/V05
  {
    "id": "A59",
    "ts": "4.5",
    "s": "ci",
    "block": "ci",
    "q": "A nightly job handles 40 flaky Android tests. For each one, Claude reads the test, calls a tool that runs the test 20 times, reads the results and proposes a fix. In a trial on the Message Batches API, all 40 responses ended with a tool_use block asking to run the test, and no fixes came back. What change makes the batch work?",
    "o": [
      "Post the test results back into the running batch under each request's custom_id",
      "Run each test 20 times first and put its results in that test's batch request",
      "Raise max_tokens on each request to leave the model room to finish its work",
      "Tell the model in the prompt to skip the tool and propose a fix in batch mode"
    ],
    "a": 1,
    "why": "A batch request cannot run tools mid-request and get the results back. Run the tests first and put their output in the request, so the model has everything it needs in one turn.",
    "wrong": {
      "A": {
        "trap": "nonexistent-feature",
        "text": "custom_id only matches a response to its request; a running batch request cannot take tool results mid-request and carry on."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "The responses stopped to ask for a tool, not because they ran out of tokens."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Gets a response back, but a fix proposed without the run results is a guess about why the test is flaky."
      }
    },
    "cite": "Exam guide §4.5; notes/domain-4 §4.5"
  },
  // A60 · ci 4.6 · adapted from gauntlet/G46
  {
    "id": "A60",
    "ts": "4.6",
    "s": "ci",
    "block": "ci",
    "q": "The CI reviewer receives a 14-file pull request in one pass and returns findings that contradict each other: it flags a helper as unused in one file while praising its use in another, and misses that two files define the same constant differently. The PR is 2,800 lines. What is the right architecture?",
    "o": [
      "Move the reviewer to the model with the largest context window available",
      "Have the reviewer list findings, then re-read the PR and delete contradictions",
      "Add an instruction to the prompt telling the reviewer to be consistent across files",
      "Review each file in its own pass, then run a separate cross-file integration pass"
    ],
    "a": 3,
    "why": "Attention, not context size, is the constraint: one pass over 14 files dilutes focus and produces contradictions. Per-file passes keep attention dense; a dedicated integration pass is where cross-file facts — duplicated constants, a helper used in one file and not another — are actually visible. A bigger window fits more text without attending to it better.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The PR already fits; the failure is attention dilution, not truncation."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Cleans up contradictions after the fact and still misses cross-file duplication."
      },
      "C": {
        "trap": "probabilistic",
        "text": "An instruction to be consistent does not change what one pass can attend to."
      }
    },
    "cite": "notes/domain-4-prompt-engineering.md §4.6"
  },
];

module.exports = { META, Q };
