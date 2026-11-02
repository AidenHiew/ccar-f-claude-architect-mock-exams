// tutor/build/data/sim3.js — Third representative full mock: 60 original questions in 4 scenario blocks of 15 (built 2026-10-23).
// The booking-gate readiness read. Allocation = sim exactly (statements.js sim3 = { ...sim }); same SIM_BLOCKS matrix; all-new settings and stems.
// obj = score-report objectives each record is authored to test (attempt-1 score report, not public); [] = untagged.
// bp.weight / bp.scope / bp.trigger on the D3 configuration items, as in sim2. bp.rank = measured length rank of the key (1 longest).
// Facts only from reference/ccar-f-official-exam-guide.md, notes/ and lessons/. Single-answer only.
'use strict';

const META = {
  "key": "sim3",
  "title": "CCA-F Representative Mock 3",
  "eyebrow": "Full mock · 60 questions · 4 scenarios",
  "intro": "Sixty new exam-level questions in four scenario blocks of fifteen, shaped like the real exam: mixed domains inside each block, domain shares matching the published weights, and every objective from one candidate's score report tested at least once. None of these questions has appeared on an earlier paper. Every question has one correct answer. Flag questions to return to them before you submit. Labels stay hidden until grading. Sit it once, in exam mode, with the 120-minute timer.",
  "defaultMode": "exam",
  "timerDefault": true,
  "minutes": 120,
  "storageKey": "ccaf-sim3-representative",
  "blocks": [
    {
      "id": 1,
      "title": "Customer Support Resolution Agent",
      "intro": "You are building a customer support resolution agent on the Claude Agent SDK for a hotel group with 85 properties and 2.1 million loyalty members. It handles booking changes, cancellations, refunds, billing disputes and loyalty-point problems through MCP tools including get_guest, lookup_booking, process_refund, adjust_points and escalate_to_human. The target is 80% first-contact resolution while still escalating the cases that need a person."
    },
    {
      "id": 2,
      "title": "Code Generation with Claude Code",
      "intro": "Your team of 14 engineers uses Claude Code on a car-park operator's payments platform: Python FastAPI services, a Flutter driver app and Terraform for the cloud setup, about 2,400 files in one repository. You own the setup: CLAUDE.md files, rules, skills and commands, hooks, and the Claude Code review job in CI."
    },
    {
      "id": 3,
      "title": "Developer Productivity with Claude",
      "intro": "You are building an internal developer productivity tool on the Claude Agent SDK for a mortgage lender's loan-servicing system: a 13-year-old Perl and PostgreSQL codebase of about 3,200 files. A coordinator delegates to subagents that explore code, trace dependencies and draft documentation, using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) and MCP servers."
    },
    {
      "id": 4,
      "title": "Structured Data Extraction",
      "intro": "You are building an extraction system for a commercial solar installer that completes about 3,500 installations a year. Claude extracts fields from supplier invoices, council building permits and site inspection reports using tool use and JSON schemas. Output feeds accounts payable, permit tracking and warranty records, and a team of 3 reviewers checks part of it."
    }
  ]
};

const Q = [
  // ───────────── Block 1 · Customer Support Resolution Agent ─────────────
  {
    "id": "N01", "ts": "1.1", "s": "cs", "block": 1, "obj": [6], "bp": { "rank": 3 },
    "q": "The agent's loop code checks each response for a text block and returns it to the guest as soon as one appears. On 9% of cancellation chats the response holds a sentence such as \"Let me check that booking\" together with a lookup_booking call, and the guest receives that sentence as the final answer. The tool is never run. What should the loop check to decide whether to continue?",
    "o": [
      "Whether stop_reason is \"end_turn\" or the response holds any text block",
      "Whether the content array holds more than 1 block of type \"text\"",
      "The stop_reason: run the tools on \"tool_use\", return on \"end_turn\"",
      "Whether the loop has run 5 iterations or stop_reason is \"max_tokens\""
    ],
    "a": 2,
    "why": "A response can hold text and a tool_use block together, so the presence of text says nothing about whether the model is done. stop_reason is the loop's control signal: \"tool_use\" means run the requested tool and send the result back; \"end_turn\" means the model has finished. Checking for assistant text as a completion indicator is one of the named anti-patterns.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "The \"or any text\" half is today's bug: a response with text and a tool call would still be returned to the guest." },
      "B": { "trap": "wrong-problem", "text": "The number of text blocks is not a completion signal; one text block next to a tool_use block is exactly the failing case." },
      "D": { "trap": "symptom-fix", "text": "An iteration cap as the stopping rule is a named anti-pattern, and \"max_tokens\" means the reply was cut off, not that the model is done." }
    },
    "cite": "Exam guide §1.1; notes/domain-1-agentic-architecture.md §1.1"
  },
  {
    "id": "N02", "ts": "1.1", "s": "cs", "block": 1, "obj": [6], "bp": { "rank": 4 },
    "q": "After lookup_booking runs, the loop code sends the next request with only the original guest message and a note saying \"tool succeeded\". The model then asks for the same booking again, and 14% of refund chats repeat lookup_booking 3 or more times. The tool returns correct data each time. What is the fix?",
    "o": [
      "Append the tool_result block with the returned data to the next request",
      "Raise max_tokens and give the model more room to recall the earlier booking lookup",
      "Add a system prompt line telling the model not to call lookup_booking twice",
      "Cache lookup_booking results in the MCP server and return them faster on repeats"
    ],
    "a": 0,
    "why": "The model only knows what is in the messages it is sent. Each tool result has to be appended to the conversation as a tool_result block, so the next iteration can reason about the data and choose the next step. A bare \"tool succeeded\" note gives it nothing to work with.",
    "wrong": {
      "B": { "trap": "wrong-problem", "text": "max_tokens limits the length of the reply. The booking data was never sent back, so there is nothing to recall." },
      "C": { "trap": "symptom-fix", "text": "This stops the repeat call but leaves the model without the booking data, so it answers without the facts it asked for." },
      "D": { "trap": "wrong-problem", "text": "Speed is not the problem. The result still never reaches the model's context, so it keeps asking." }
    },
    "cite": "Exam guide §1.1; notes/domain-1-agentic-architecture.md §1.1"
  },
  {
    "id": "N03", "ts": "1.3", "s": "cs", "block": 1, "obj": [], "bp": { "rank": 2 },
    "q": "The coordinator agent spawns a billing subagent through the Task tool to investigate disputed charges. Before spawning it, the coordinator has verified the guest and identified the booking and the 2 disputed charges. In 31% of disputes the billing subagent then asks the guest for the booking number again. The billing subagent's AgentDefinition has a short system prompt and the right tools. What fixes this?",
    "o": [
      "Add get_guest to the billing subagent's tools and let it look the details up again",
      "Turn on shared memory between the coordinator and its subagents in the settings",
      "Tell the billing subagent's system prompt to read the coordinator's history first",
      "Write everything the coordinator has confirmed into the Task prompt that it sends"
    ],
    "a": 3,
    "why": "Subagents run with isolated context: they do not inherit the coordinator's conversation. Anything the subagent needs, here the verified identity, the booking number and the disputed charges, must be written into the prompt the coordinator passes through the Task tool.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "It could fetch the identity again, but it would repeat work and still not know which 2 charges the coordinator already found in dispute." },
      "B": { "trap": "nonexistent-feature", "text": "There is no such setting; subagents do not share memory with the coordinator or with each other." },
      "C": { "trap": "nonexistent-feature", "text": "A subagent cannot read the coordinator's conversation. An instruction to do so does not give it access." }
    },
    "cite": "Exam guide §1.3; notes/domain-1-agentic-architecture.md §1.3"
  },
  {
    "id": "N04", "ts": "1.4", "s": "cs", "block": 1, "obj": [1], "bp": { "rank": 3 },
    "q": "Session logs show that 4% of chats end with no resolution and no escalation: the loop hits the max_tokens limit, a tool times out twice, or the guest stops replying while a tool call is pending. In each case the guest's issue is simply dropped. The system prompt already tells the agent to escalate when it cannot finish. What design makes sure every chat ends in a resolution or a handoff?",
    "o": [
      "Repeat the escalate-when-stuck rule at the start and end of the system prompt",
      "Code that runs after the loop ends and passes unresolved chats to a person",
      "Raise max_tokens and the tool timeout until these early endings become rare",
      "Have the agent tell the guest its progress before each tool call it makes"
    ],
    "a": 1,
    "why": "The failures happen when the loop itself ends abnormally, so nothing inside the loop, including the model following its prompt, can be relied on to catch them. A safeguard in the orchestration code checks the outcome of every session after the loop exits and escalates any that ended unresolved, however the loop stopped.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "The rule is already in the prompt. In these chats the loop has stopped, so the model gets no further turn in which to follow any rule." },
      "C": { "trap": "symptom-fix", "text": "Fewer early endings still leaves some, and the ones left are still dropped with no handoff." },
      "D": { "trap": "wrong-problem", "text": "Progress messages do not change how a chat ends; a chat that stops still has no resolution and no escalation." }
    },
    "cite": "Score-report objective 1; exam guide §1.4; notes/domain-1-agentic-architecture.md §1.4"
  },
  {
    "id": "N05", "ts": "1.4", "s": "cs", "block": 1, "obj": [2], "bp": { "rank": 2 },
    "q": "When a refund exceeds the agent's limit, it calls escalate_to_human with the message \"Guest needs help with a refund, please review.\" Human agents cannot see the chat transcript. They spend an average of 7 minutes re-asking guests for details the agent had already confirmed, and most often they re-run the identity check the agent had already passed. What should the escalation pass?",
    "o": [
      "Guest ID and booking, verified status, root cause, amount and next step",
      "Guest ID and booking, root cause, refund amount and recommended action",
      "Guest ID and booking plus the last 10 messages of the chat as a transcript",
      "Guest ID and booking, the guest's sentiment and a priority from 1 to 5"
    ],
    "a": 0,
    "why": "A structured handoff carries what the agent has established, including authorisation state such as verified identity, in fields the human can act on at once: who, which booking, what went wrong, how much, and what to do next. The human then continues the case instead of restarting it.",
    "wrong": {
      "B": { "trap": "symptom-fix", "text": "This carries most of the facts but not the one the humans re-check most: that identity was already verified." },
      "C": { "trap": "over-engineered", "text": "The human has to dig the facts out of raw messages, and the verification may have happened earlier than the last 10." },
      "D": { "trap": "wrong-problem", "text": "Sentiment and a priority score tell the human how urgent the case feels, not what has been established." }
    },
    "cite": "Exam guide §1.4; score-report objective 2; notes/domain-1-agentic-architecture.md §1.4"
  },
  {
    "id": "N06", "ts": "1.4", "s": "cs", "block": 1, "obj": [5], "bp": { "rank": 1 },
    "q": "Policy says a goodwill adjustment above 20,000 points needs a duty manager's approval. The system prompt states the limit, and the agent gets it right in most chats, but an audit found 17 adjustments above 20,000 points last month made with no manager involved. The group wants the limit to hold in every chat, and the guest's request should still reach someone who can approve it. What should you change?",
    "o": [
      "A PostToolUse hook that flags adjust_points results over 20,000 for a manager",
      "An adjust_points description saying amounts over 20,000 need a manager first",
      "A PreToolUse hook that blocks adjust_points over 20,000 and routes to escalation",
      "A PreToolUse hook that caps every adjust_points call at 20,000 and lets it run"
    ],
    "a": 2,
    "why": "When a business rule must hold every time, a hook that intercepts the outgoing tool call enforces it in code, and it can redirect the blocked request to the escalation workflow. A prompt or description is followed most of the time, not every time.",
    "wrong": {
      "A": { "trap": "reactive-too-late", "text": "PostToolUse runs after the points have moved; the manager sees the adjustment only once it is already made." },
      "B": { "trap": "probabilistic", "text": "A description is guidance like the system prompt line that already fails in 17 cases a month." },
      "D": { "trap": "wrong-problem", "text": "It stops the large adjustment but quietly changes what the guest gets, with no manager deciding." }
    },
    "cite": "Exam guide §1.5, §1.4; score-report objective 5; notes/domain-1-agentic-architecture.md §1.4–1.5; notes/2026-09-docs-delta.md §1.4/1.5"
  },
  {
    "id": "N07", "ts": "1.5", "s": "cs", "block": 1, "obj": [], "bp": { "rank": 2 },
    "q": "lookup_booking comes from the booking vendor's MCP server, which the team cannot modify. It returns each booking's status in the hotel's own code: some hotels send numbers such as \"3\", others send words such as \"CXL\" or \"HELD\". In 5% of chats the agent tells a guest that a cancelled booking is still active. A system prompt table of the codes cut the rate only from 6% to 5%. What should you add?",
    "o": [
      "A fuller system prompt table of every hotel's status codes and meanings",
      "A PostToolUse hook that maps every status in the result to 1 shared code set",
      "A PostToolUse hook that adds each hotel's name next to its raw status code",
      "A PreToolUse hook that adds a plain-status request to each lookup_booking call"
    ],
    "a": 1,
    "why": "A PostToolUse hook intercepts each tool result before the model sees it, so code can translate every hotel's status into one shared set. The model then never has to interpret mixed codes.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "A prompt table was already tried and barely moved the rate; the model still has to translate each code itself." },
      "C": { "trap": "symptom-fix", "text": "Right hook, wrong transformation: the model still has to translate every hotel's codes itself." },
      "D": { "trap": "wrong-problem", "text": "PreToolUse changes the call going out; the vendor's server still returns its own codes." }
    },
    "cite": "Exam guide §1.5; notes/domain-1-agentic-architecture.md §1.5"
  },
  {
    "id": "N08", "ts": "2.1", "s": "cs", "block": 1, "obj": [27], "bp": { "rank": 1 },
    "q": "The agent has 2 tools with near-identical descriptions: lookup_booking (\"Gets booking information\") and search_stays (\"Finds stay information\"). lookup_booking takes a confirmation code for an upcoming booking; search_stays takes a member ID and date range for past stays. In 17% of chats about future bookings the agent calls search_stays first and gets nothing back. What is the most effective fix?",
    "o": [
      "Rename search_stays to search_past_stays and keep both descriptions",
      "Split search_stays into a tool for past stays and one for cancelled stays",
      "Expand lookup_booking's description and leave search_stays as it is",
      "Rewrite both descriptions: each one's input and when to use the other tool"
    ],
    "a": 3,
    "why": "Tool descriptions are the main thing the model uses to choose a tool. When two overlap, both descriptions need the input format and an explicit boundary saying when to use the other tool instead.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "A clearer name helps a little, but neither description yet says what input it takes or where its boundary with the other tool lies." },
      "B": { "trap": "wrong-problem", "text": "It adds a third similar tool; the overlap with lookup_booking is untouched." },
      "C": { "trap": "symptom-fix", "text": "search_stays still claims \"stay information\" in general, so it still competes for future-booking requests." }
    },
    "cite": "Exam guide §2.1; score-report objective 27; notes/domain-2-tool-design-mcp.md §2.1"
  },
  {
    "id": "N09", "ts": "2.2", "s": "cs", "block": 1, "obj": [26], "bp": { "rank": 1 },
    "q": "process_refund returns the same error text, \"Refund failed\", whether the payment gateway timed out, the booking was on a non-refundable rate, or the amount was above what the guest paid. The agent retries every failure up to 3 times and then tells the guest to try again tomorrow. That includes the 40% of failures that are non-refundable bookings, which no retry can fix. What should process_refund return instead?",
    "o": [
      "isError with an errorCategory, an isRetryable flag and a reason for the guest",
      "isError with a per-type HTTP status (504, 409 or 422) and no other fields",
      "isError with errorCategory \"transient\" and a 30-second retry delay",
      "isError with isRetryable false on every failure and a reason for the guest"
    ],
    "a": 0,
    "why": "A structured error tells the agent what kind of failure it is (transient, validation, business), whether retrying can help, and what to tell the guest. The values must differ by cause: the timeout is retryable, the non-refundable rate is not and needs an explanation.",
    "wrong": {
      "B": { "trap": "symptom-fix", "text": "A code per type is closer, but the agent gets no retryable flag and no explanation for the guest, and has to guess what each code means." },
      "C": { "trap": "wrong-problem", "text": "Calling policy and input failures transient tells the agent to wait and retry what can never succeed." },
      "D": { "trap": "symptom-fix", "text": "It stops wasted retries but also stops retries of gateway timeouts, which a retry would fix." }
    },
    "cite": "Exam guide §2.2; score-report objective 26; notes/domain-2-tool-design-mcp.md §2.2"
  },
  {
    "id": "N10", "ts": "2.3", "s": "cs", "block": 1, "obj": [29], "bp": { "rank": 2 },
    "q": "Every chat must start with a get_guest call, because the other tools all need the member ID it returns. In 12% of chats the first response is plain text asking the guest a question their member record already answers. The first request in each chat is sent with tool_choice \"auto\". What change makes get_guest the first call in every chat?",
    "o": [
      "Set tool_choice to \"any\" on the first request of each new chat session",
      "Put get_guest first in the tools array and describe it as the first step",
      "Add a system prompt rule that the first action in a chat is to call get_guest",
      "Force get_guest with tool_choice on the first request, then use \"auto\" after"
    ],
    "a": 3,
    "why": "Forced tool selection, tool_choice {\"type\": \"tool\", \"name\": \"get_guest\"}, makes the model call that specific tool, so the prerequisite data exists before anything depends on it. Later turns go back to \"auto\" and the model chooses freely.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "\"any\" guarantees some tool call, not get_guest; the model could still call lookup_booking first without a member ID." },
      "B": { "trap": "probabilistic", "text": "Order and wording make the right first call more likely, not certain." },
      "C": { "trap": "probabilistic", "text": "A prompt rule is guidance; with \"auto\" the model can still reply in text first." }
    },
    "cite": "Exam guide §2.3; score-report objective 29; notes/domain-2-tool-design-mcp.md §2.3"
  },
  {
    "id": "N11", "ts": "4.2", "s": "cs", "block": 1, "obj": [], "bp": { "rank": 2 },
    "q": "The system prompt lists 7 rules for choosing between goodwill points, a partial refund and a full refund when a guest complains about a stay. Clear cases are handled well, but on mixed complaints, such as a noisy room plus a late check-in, duty managers reviewing the chats disagreed with the agent's remedy 35% of the time. Adding 2 more rules last month did not change that rate. What is the most effective next step?",
    "o": [
      "Add an eighth rule that covers complaints with more than one issue in them",
      "Have the model rate each complaint's severity from 1 to 5 and map scores to remedies",
      "Add 3 worked mixed-complaint examples that explain why one remedy beat the others",
      "Set temperature to 0 for remedy decisions on complaints with mixed issues"
    ],
    "a": 2,
    "why": "When detailed instructions still give poor results on ambiguous cases, a few targeted examples that show the reasoning (why this remedy over the other two plausible ones) are the most effective fix. They let the model generalise the judgement to new mixed cases. A self-assigned severity score adds a number but no criteria.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "More rules were tried last month and did not move the rate; another rule leaves the same judgement unshown." },
      "B": { "trap": "probabilistic", "text": "The model writes the number from the same unclear judgement, so the disagreement moves into the score instead of going away." },
      "D": { "trap": "symptom-fix", "text": "It makes runs repeat themselves, not agree with the managers; a consistent wrong remedy is still wrong." }
    },
    "cite": "Exam guide §4.2; notes/domain-4-prompt-engineering.md §4.2"
  },
  {
    "id": "N12", "ts": "5.1", "s": "cs", "block": 1, "obj": [17], "bp": { "rank": 3 },
    "q": "A developer rebuilt the chat backend to cut costs, and each request to the Messages API now carries only the system prompt and the guest's newest message. Since the change, 22% of multi-turn chats end with the agent asking for a booking code the guest gave 2 turns earlier. The agent's prompts and tools did not change. What restores coherence?",
    "o": [
      "Store the booking code in the MCP server and let the model fetch it back later",
      "Send the full prior conversation, tool calls and results, with every request",
      "Turn on the API's session mode and let it keep the conversation between calls",
      "Add a system prompt line asking the model to remember details given earlier"
    ],
    "a": 1,
    "why": "The Messages API keeps no state between requests. Conversation coherence depends on the caller sending the complete history, including earlier tool calls and results, with every request.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "That saves one fact. Everything else the guest said, and every earlier tool result, is still missing from each request." },
      "C": { "trap": "nonexistent-feature", "text": "The Messages API is stateless and has no such mode; the caller must send the history." },
      "D": { "trap": "probabilistic", "text": "The model cannot remember what it is not sent; each request is all it sees." }
    },
    "cite": "Exam guide §5.1; score-report objective 17; notes/domain-5-context-reliability.md §5.1"
  },
  {
    "id": "N13", "ts": "5.2", "s": "cs", "block": 1, "obj": [18], "bp": { "rank": 4 },
    "q": "A guest writes: \"I've been charged twice for the same night. I want to speak to a person, not a bot.\" The double charge is a known gateway issue that process_refund fixes in under a minute, and the agent resolves 92% of such cases on its own. Logs show the agent currently replies by starting its own investigation. What should the agent do?",
    "o": [
      "Call escalate_to_human now with the charge details, before investigating",
      "Fix the double charge first, then offer the guest a transfer if still unhappy",
      "Explain that it can fix this in a minute and escalate only if the guest insists",
      "Check sentiment and escalate only if the guest's message scores as very angry"
    ],
    "a": 0,
    "why": "An explicit request for a human is honoured immediately, without first attempting investigation, even when the agent could fix the issue. Passing the charge details in the escalation saves the human from asking again.",
    "wrong": {
      "B": { "trap": "wrong-problem", "text": "The guest asked for a person in plain words; working the case first overrides that request." },
      "C": { "trap": "wrong-problem", "text": "Offering to resolve fits a frustrated guest who has not asked for a person. This guest already asked, so the agent should hand over." },
      "D": { "trap": "probabilistic", "text": "Sentiment is an unreliable escalation trigger, and the guest's explicit request is the trigger here." }
    },
    "cite": "Exam guide §5.2; score-report objective 18; notes/domain-5-context-reliability.md §5.2"
  },
  {
    "id": "N14", "ts": "5.2", "s": "cs", "block": 1, "obj": [18], "bp": { "rank": 4 },
    "q": "Group policy lets guests cancel free of charge up to 48 hours before check-in, and lets a hotel waive the late fee for documented medical emergencies. A guest asks to cancel 20 hours before check-in because a storm has closed the only road to the hotel. In 55% of such chats the agent treats the storm as a medical emergency and waives the fee. What should the agent do?",
    "o": [
      "Charge the late-cancellation fee, the policy's default when no exception fits",
      "Waive the fee under the medical exception, the closest rule in the written policy",
      "Ask the guest for proof of the road closure, then waive the fee once it arrives",
      "Escalate to a person with the details, without deciding on the fee itself"
    ],
    "a": 3,
    "why": "The policy covers medical emergencies and is silent on travel disruption, so this is a policy gap, which is an escalation trigger. The agent should not invent an exception or apply a default; a person decides and the agent hands over the facts.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "The agent would be deciding a case the policy does not cover; a gap in policy is a reason to escalate, not to pick a default." },
      "B": { "trap": "symptom-fix", "text": "This is the current behaviour: stretching an exception the policy wrote for something else." },
      "C": { "trap": "wrong-problem", "text": "Evidence of the storm does not create an exception the policy lacks; someone with authority still has to decide." }
    },
    "cite": "Exam guide §5.2; notes/domain-5-context-reliability.md §5.2"
  },
  {
    "id": "N15", "ts": "5.3", "s": "cs", "block": 1, "obj": [], "bp": { "rank": 4 },
    "q": "When the loyalty subagent's points-history API times out, the subagent returns an empty list as a successful result. The coordinator then tells the guest that no points are missing from their account. This happened in 140 chats last week, and 38 of those guests did have missing points. Most empty results, though, are real: the member simply has no recent activity. What should change?",
    "o": [
      "Have the coordinator re-run the loyalty subagent on every empty result it gets",
      "Report the timeout as an error, kept apart from a successful empty result",
      "Raise the subagent's retries from 2 to 10 before it returns the empty list",
      "Have the coordinator ask the guest to check their own statement on each empty"
    ],
    "a": 1,
    "why": "An access failure (the API timed out) and a valid empty result (the query worked and found nothing) need different handling, so the subagent must report them differently. A structured error with the attempted query lets the coordinator retry or tell the guest it could not check; an empty success means there is nothing to find.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "Most empty results are real, so this wastes runs on them and still cannot tell a timeout from a true no-match." },
      "C": { "trap": "symptom-fix", "text": "More retries help some timeouts, but a failure that outlasts them is still reported as \"no activity\"." },
      "D": { "trap": "blame-shifting", "text": "The guest cannot tell a system timeout from a real empty result either; the subagent knows which one happened." }
    },
    "cite": "Exam guide §5.3; notes/domain-5-context-reliability.md §5.3"
  },
  // ───────────── Block 2 · Code Generation with Claude Code ─────────────
  {
    "id": "N16", "ts": "1.5", "s": "cc", "block": 2, "obj": [12], "bp": { "rank": 1, "weight": "heavy" },
    "q": "The root CLAUDE.md tells Claude to run the formatter (ruff format) after editing any Python file. In 9 of 30 sessions reviewed last week Claude skipped it, and CI then failed on formatting. Moving the line to the top of CLAUDE.md and adding \"IMPORTANT\" made no measurable difference. What makes formatting happen after each edit?",
    "o": [
      "A .claude/rules/python.md file with paths for **/*.py that repeats the line",
      "A PostToolUse hook on Edit and Write that runs ruff format on the changed file",
      "A PreToolUse hook on Edit that runs ruff format before Claude changes the file",
      "A /format command in .claude/commands/ that developers run after each edit"
    ],
    "a": 1,
    "why": "A PostToolUse hook runs after every matching tool call, in code, whatever the model decides. Hooking Edit and Write to run the formatter makes the step happen every time, which an instruction in CLAUDE.md or a rules file cannot promise.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "A path rule loads the same instruction at a better moment, but it is still guidance the model can skip." },
      "C": { "trap": "wrong-problem", "text": "It formats the old file; the new code Claude then writes is still unformatted." },
      "D": { "trap": "symptom-fix", "text": "It moves the step from the model to people; anyone who forgets still pushes unformatted code." }
    },
    "cite": "Exam guide §1.5; score-report objective 12; notes/domain-3-claude-code-config.md §3.1; notes/2026-09-docs-delta.md §1.4/1.5"
  },
  {
    "id": "N17", "ts": "3.1", "s": "cc", "block": 2, "obj": [10], "bp": { "rank": 3, "weight": "heavy", "scope": "shared", "trigger": "session" },
    "q": "The root CLAUDE.md says: \"Do not read files in secrets/ or run terraform apply.\" A security review found 3 sessions in the last month where Claude ran terraform apply against staging while fixing a module, one of them by a developer who joined the team that week. The team wants this to stop for everyone who works in the repository, new joiners included. What should you change?",
    "o": [
      "Add deny rules to each developer's ~/.claude/settings.json on their machine",
      "A PostToolUse hook on Bash that alerts the team when terraform apply runs",
      "Move the line to a .claude/rules/security.md file with no paths field",
      "Add deny rules to the project's .claude/settings.json, committed to git"
    ],
    "a": 3,
    "why": "CLAUDE.md and rules files are guidance delivered to the model; they cannot stop a command. Permission deny rules in settings are checked before any tool runs. Putting them in the project settings file in git, not in user settings, applies them to everyone who clones the repository.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "User settings would block it, but only on machines someone has set up by hand; the new joiner would not have them." },
      "B": { "trap": "reactive-too-late", "text": "PostToolUse fires after the command has run; staging has already been changed." },
      "C": { "trap": "probabilistic", "text": "A rule with no paths loads at launch like CLAUDE.md, and it is guidance just the same." }
    },
    "cite": "Score-report objective 10; exam guide §3.1; notes/domain-3-claude-code-config.md §3.1; notes/2026-09-docs-delta.md §1.4/1.5 (deny rules in the permission chain)"
  },
  {
    "id": "N18", "ts": "3.1", "s": "cc", "block": 2, "obj": [16], "bp": { "rank": 2, "weight": "light", "scope": "personal", "trigger": "prompt" },
    "q": "A developer is fixing one bug in the tariff calculator today and wants Claude to work from the 2 pages of the council's tariff rules saved at docs/tariffs/zone-b.md. Nobody else needs that file, and it will not be needed after this fix. Last time, the developer pasted 200 lines of it into the chat by hand. What is the best way to give Claude this context?",
    "o": [
      "Reference it with @docs/tariffs/zone-b.md in the prompt for today's fix",
      "Import it with @docs/tariffs/zone-b.md in the project's root CLAUDE.md",
      "Copy the tariff rules into a CLAUDE.local.md at the root of the project",
      "Add a .claude/rules/tariffs.md rule with paths for the calculator folder"
    ],
    "a": 0,
    "why": "An @ reference in the prompt pulls the file into this conversation only. That fits context that is specific to one task and not needed again; CLAUDE.md, CLAUDE.local.md and rules are for context that should load across sessions.",
    "wrong": {
      "B": { "trap": "over-engineered", "text": "That loads the file into every session for the whole team, long after this one fix." },
      "C": { "trap": "over-engineered", "text": "CLAUDE.local.md loads in every session this developer runs in the project, not just for this task." },
      "D": { "trap": "over-engineered", "text": "A committed rule is a lasting team setting for what is a one-off need." }
    },
    "cite": "Score-report objective 16; exam guide §3.1; notes/domain-3-claude-code-config.md §3.1"
  },
  {
    "id": "N19", "ts": "3.2", "s": "cc", "block": 2, "obj": [7], "bp": { "rank": 4, "scope": "personal", "trigger": "demand" },
    "q": "The team's project skill /release lives in .claude/skills/release/ and runs a 6-step deploy checklist. One developer wants a version that also drafts release notes in their own style, without changing what teammates get from /release. Last week they edited the team's SKILL.md directly, and 2 teammates' releases picked up the change. The repository's .claude/skills/ folder is kept for team-approved workflows only. Where should the developer's version go?",
    "o": [
      "Copy it to ~/.claude/skills/release/ under the same name and edit it",
      "Add a CLAUDE.local.md section telling Claude to change /release for them",
      "Copy it to ~/.claude/skills/ under a new name, such as my-release",
      "Create .claude/skills/my-release/ in the repository next to the team skill"
    ],
    "a": 2,
    "why": "Personal variants of a team skill go in ~/.claude/skills/ with a different name. The user-level location keeps it out of version control, and the new name avoids changing what teammates' /release does.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Reusing the name sets up a clash with the team skill, and which /release a session runs is no longer clear." },
      "B": { "trap": "probabilistic", "text": "An instruction that rewrites a skill on the fly is guidance, and the team skill itself is unchanged and still runs." },
      "D": { "trap": "wrong-problem", "text": "A skill in the repository's .claude/skills/ is shared with everyone through git." }
    },
    "cite": "Exam guide §3.2; score-report objective 7; notes/domain-3-claude-code-config.md §3.2"
  },
  {
    "id": "N20", "ts": "3.2", "s": "cc", "block": 2, "obj": [], "bp": { "rank": 3, "scope": "shared", "trigger": "demand" },
    "q": "The team's /trace-payments skill walks every module that touches card payments and prints about 3,000 lines of findings into the session. Developers usually run it before starting a change, and afterwards Claude often loses track of the change it was asked to make. They only need the 20-line summary at the end. Which line should you add to the skill's SKILL.md frontmatter?",
    "o": [
      "model: haiku",
      "allowed-tools: Read",
      "argument-hint: [module]",
      "context: fork"
    ],
    "a": 3,
    "why": "context: fork runs the skill in an isolated sub-agent context. Its verbose working output stays there, and only the result comes back, keeping the main conversation focused on the change.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "A smaller model may run faster, but its 3,000 lines still land in the main session." },
      "B": { "trap": "wrong-problem", "text": "This limits which tools the skill may use; the volume of output it returns is unchanged." },
      "C": { "trap": "symptom-fix", "text": "A prompt for a module name may narrow some runs, but whatever the skill prints still fills the main conversation." }
    },
    "cite": "Exam guide §3.2; notes/domain-3-claude-code-config.md §3.2; notes/2026-09-docs-delta.md §3.2 (frontmatter keys)"
  },
  {
    "id": "N21", "ts": "3.3", "s": "cc", "block": 2, "obj": [11], "bp": { "rank": 2, "weight": "light", "scope": "shared", "trigger": "file" },
    "q": "Database migrations are .sql files in a migrations/ folder inside each of 7 services, and the same services hold about 300 other .sql query files. Last month the migration rules moved from the root CLAUDE.md into .claude/rules/migrations.md to cut context, but /memory shows the file loading in every session, including the 80% that never touch a migration. What change makes the rules load only for migration work?",
    "o": [
      "Add paths: [\"**/migrations/**\"] to the frontmatter of migrations.md",
      "Move the file into a .claude/rules/db/ subfolder of its own",
      "Add paths: [\"**/*.sql\"] to the frontmatter of migrations.md",
      "Put a copy of the rules in a CLAUDE.md inside each migrations/ folder"
    ],
    "a": 0,
    "why": "A rule file with no paths field loads at launch in every session. Adding a paths glob makes it load only when Claude works on matching files, and \"**/migrations/**\" matches the migration folders in every service without catching the other .sql files.",
    "wrong": {
      "B": { "trap": "wrong-problem", "text": "Rule files are found in subfolders too, and without a paths field the file still loads at launch." },
      "C": { "trap": "over-engineered", "text": "The pattern is too broad: it also matches the 300 ordinary query files, so the rules load for work that is not migrations." },
      "D": { "trap": "symptom-fix", "text": "It would load near migrations, but 7 copies of the same rules drift apart as people edit them." }
    },
    "cite": "Exam guide §3.3; score-report objective 11; notes/domain-3-claude-code-config.md §3.3; notes/2026-09-docs-delta.md §3.1/3.3 (rules without paths load at launch)"
  },
  {
    "id": "N22", "ts": "3.3", "s": "cc", "block": 2, "obj": [11], "bp": { "rank": 4, "weight": "light", "trigger": "file" },
    "q": "A rule file at .claude/rules/flutter.md has paths: [\"app/*.dart\"] in its frontmatter. The Flutter code sits under app/lib/ in about 600 files across 40 subfolders, and developers report that the rule never seems to apply when Claude edits widgets in app/lib/screens/. The rule's content is correct. What should you change?",
    "o": [
      "Move the rule's text into app/CLAUDE.md, a directory file loaded at launch",
      "Change the pattern to \"app/**/*.dart\" to match files in all subfolders",
      "Remove the paths field and let the rule load at launch in every session",
      "Add a PostToolUse hook that prints the rule after each edit to a Dart file"
    ],
    "a": 1,
    "why": "A single * matches within one folder level, so \"app/*.dart\" only matches Dart files directly inside app/. \"**\" crosses folder levels, so \"app/**/*.dart\" matches every Dart file under app/.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "A subdirectory CLAUDE.md loads when Claude reads files there, not at launch, and this swaps a fixable rule for a second mechanism." },
      "C": { "trap": "over-engineered", "text": "It would then apply, but to every session, including the ones that never touch Dart." },
      "D": { "trap": "over-engineered", "text": "A hook that re-sends text is heavy machinery for a pattern typo, and it arrives after the edit." }
    },
    "cite": "Exam guide §3.3; notes/domain-3-claude-code-config.md §3.3; notes/2026-09-docs-delta.md §3.1/3.3"
  },
  {
    "id": "N23", "ts": "3.4", "s": "cc", "block": 2, "obj": [9], "bp": { "rank": 2, "weight": "heavy" },
    "q": "The team must move card payments from one provider's SDK to another's before the current contract ends in 9 weeks. The old SDK is called from 52 files across 6 services, and there are 2 ways to do it: an adapter layer or a rewrite of each call site. Nobody has yet mapped which services depend on the old SDK's retry behaviour. Which workflow fits?",
    "o": [
      "Direct execution on the smallest service first, then repeat the pattern",
      "Explore subagent to map the call sites, then direct execution on all 52",
      "Plan mode to map call sites and choose an approach, then direct execution",
      "Direct execution with a prompt that lists all 52 files and the adapter design"
    ],
    "a": 2,
    "why": "Many files, two valid approaches and an unmapped dependency are what plan mode is for: explore and design before changing code. Once the approach is chosen, direct execution carries out the plan.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "The pattern from one small service may not fit the others; the unmapped retry dependencies surface late, as rework." },
      "B": { "trap": "symptom-fix", "text": "Mapping the call sites is half of it; the choice between the 2 approaches is never designed or reviewed before the edits start." },
      "D": { "trap": "wrong-problem", "text": "It commits to the adapter before anyone knows which services rely on the retry behaviour." }
    },
    "cite": "Exam guide §3.4; score-report objective 9; notes/domain-3-claude-code-config.md §3.4"
  },
  {
    "id": "N24", "ts": "3.4", "s": "cc", "block": 2, "obj": [9], "bp": { "rank": 4, "weight": "light" },
    "q": "A driver reported that the Flutter app shows a parking fee of $0.00 when a session lasts exactly 60 minutes. The stack trace points to one comparison in fee_calculator.dart, and the developer has already written a failing test for the case. A teammate suggests starting in plan mode because it is payment code. How should the developer handle this fix?",
    "o": [
      "Make the one-line fix directly and run the test the developer wrote",
      "Use plan mode first: payment code changes need a plan approved up front",
      "Run the Explore subagent over the payments folder before touching code",
      "Use plan mode to list other places that might hold the same off-by-one"
    ],
    "a": 0,
    "why": "Direct execution fits a well-understood change with clear scope, such as a single-file bug fix with a clear stack trace. The subject being payments does not make a one-line, tested fix architectural.",
    "wrong": {
      "B": { "trap": "over-engineered", "text": "The scope is one condition in one file with a test ready; a plan adds a step without reducing any risk here." },
      "C": { "trap": "over-engineered", "text": "The stack trace already points to the line; broad discovery is not needed." },
      "D": { "trap": "wrong-problem", "text": "That is a different, open-ended task; the reported bug is located and has a test." }
    },
    "cite": "Exam guide §3.4; score-report objective 9; notes/domain-3-claude-code-config.md §3.4"
  },
  {
    "id": "N25", "ts": "3.5", "s": "cc", "block": 2, "obj": [8], "bp": { "rank": 1 },
    "q": "A developer asked Claude to convert free-text parking rules from the council's API, such as \"Mon-Fri 8am-6pm, 2P\", into the app's JSON time-slot format. After 3 rounds of prose corrections (\"2P means two hours\", \"ranges are inclusive\"), each new attempt fixes one case and breaks another. About 40 rule strings must be converted. What should the developer do next?",
    "o": [
      "Write a longer prose description covering every rule format they have seen",
      "Ask Claude to convert 1 string at a time and correct each one as it goes",
      "Switch to plan mode and have Claude write a plan for the conversion first",
      "Give 3 rule strings with the exact JSON each should become, edge cases included"
    ],
    "a": 3,
    "why": "When prose descriptions are interpreted inconsistently, 2–3 concrete input/output examples are the most effective way to show the expected transformation, including the edge cases that keep breaking.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "Prose has been tried 3 times and is being read inconsistently; more of it repeats the failure." },
      "B": { "trap": "symptom-fix", "text": "This is the same correction loop, 40 times over, with no shared picture of the target." },
      "C": { "trap": "wrong-problem", "text": "The issue is not design; Claude does not know exactly what output each input should give." }
    },
    "cite": "Exam guide §3.5; score-report objective 8; notes/domain-3-claude-code-config.md §3.5"
  },
  {
    "id": "N26", "ts": "3.5", "s": "cc", "block": 2, "obj": [8], "bp": { "rank": 2 },
    "q": "Code review found 3 problems in Claude's new refund endpoint: it rounds fees before applying the discount, the discount is applied twice when a voucher is used, and the response omits the tax line. The rounding and the double discount both live in calculate_total() and change each other's results. The tax line is in a separate serializer and is unrelated. How should the developer ask for the fixes?",
    "o": [
      "Send the 3 problems one at a time and wait for each fix before the next",
      "One message for the rounding and discount together, then the tax line alone",
      "Send all 3 problems in a single message and have Claude fix them together",
      "Fix the tax line first, then send the rounding and discount fixes separately"
    ],
    "a": 1,
    "why": "Interacting problems belong in one detailed message so the fixes are designed together; independent problems are better fixed one at a time. Here 2 issues interact and 1 does not.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "The rounding and discount fixes change each other's results; fixing them one after the other invites the second to undo the first." },
      "C": { "trap": "wrong-problem", "text": "Batching suits issues that interact; the unrelated tax line only adds noise to that change." },
      "D": { "trap": "symptom-fix", "text": "The order of the tax fix is fine, but splitting the 2 interacting fixes is the mistake." }
    },
    "cite": "Exam guide §3.5; score-report objective 8; notes/domain-3-claude-code-config.md §3.5"
  },
  {
    "id": "N27", "ts": "3.6", "s": "cc", "block": 2, "obj": [], "bp": { "rank": 1 },
    "q": "The CI job runs claude -p with a review prompt, and a script turns the output into inline PR comments. The script parses Claude's prose with regular expressions and fails on about 1 run in 8 when the wording changes. The team wants findings with file, line and message that the script can read on every run. What should the job use?",
    "o": [
      "--output-format json alone, then read the findings from the result field",
      "--output-format stream-json and a script that parses each streamed event",
      "--output-format json with a --json-schema defining file, line and message",
      "--verbose with -p and a script that parses the full turn-by-turn log"
    ],
    "a": 2,
    "why": "--output-format json with --json-schema makes the CLI return structured output that matches the schema, which a script can parse reliably and post as inline comments.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "The JSON envelope is reliable, but without a schema the result inside is still free text the script has to parse." },
      "B": { "trap": "wrong-problem", "text": "stream-json streams events for progress; without a schema the findings inside are still free text." },
      "D": { "trap": "wrong-problem", "text": "More log detail gives the script more prose to parse, not a fixed structure." }
    },
    "cite": "Exam guide §3.6; notes/domain-3-claude-code-config.md §3.6; notes/2026-09-docs-delta.md §3.6 (structured_output)"
  },
  {
    "id": "N28", "ts": "3.6", "s": "cc", "block": 2, "obj": [], "bp": { "rank": 1 },
    "q": "The review job runs on every push to a pull request. On one PR that received 4 pushes, the job re-posted most of its earlier comments on each push: 31 comments in all for 9 distinct issues. The same issue is worded differently on each run. Developers have started muting the bot. What change should you make to the review step?",
    "o": [
      "Add the earlier findings to the prompt and ask for only new or open issues",
      "Have the script post only comments whose text differs from the last run",
      "Delete all earlier bot comments on the PR before each new review posts",
      "Run a second Claude instance that removes duplicates from the comments"
    ],
    "a": 0,
    "why": "When re-running a review after new commits, include the prior findings in context and instruct Claude to report only new or still-unaddressed issues. That removes the duplicates at the source, however they are worded.",
    "wrong": {
      "B": { "trap": "symptom-fix", "text": "Each run words the same issue differently, so reworded duplicates pass a text comparison." },
      "C": { "trap": "symptom-fix", "text": "The thread looks cleaner, but each push still re-reports old issues and loses the history of what was raised." },
      "D": { "trap": "over-engineered", "text": "A second pass cleans up output the first pass should not have produced; the review still lacks its earlier findings." }
    },
    "cite": "Exam guide §3.6; notes/domain-3-claude-code-config.md §3.6"
  },
  {
    "id": "N29", "ts": "4.1", "s": "cc", "block": 2, "obj": [], "bp": { "rank": 4 },
    "q": "The review job's prompt asks Claude to \"check that logging is appropriate\". Developers dismiss 70% of the logging findings, most of which object to wording or log level, and they have begun ignoring the job's correct security findings too. A teammate already added \"only report findings you are highly confident in\", and the dismissal rate did not move. What should you change?",
    "o": [
      "Have Claude score each finding from 0 to 1 and post only those above 0.85",
      "Have a second Claude pass check each logging finding before it is posted",
      "Move logging checks into a separate job that runs once a week overnight",
      "Report a log line only if it records card data or swallows an error"
    ],
    "a": 3,
    "why": "Explicit categorical criteria, saying exactly what to report, improve precision; general instructions such as \"high confidence\" do not, whether written as words or as a score threshold. A noisy category also drags down trust in accurate ones, so tightening it matters beyond logging.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "The score comes from the same vague \"appropriate\" judgement; it is the high-confidence instruction that already failed, written as a number." },
      "B": { "trap": "over-engineered", "text": "A second reviewer with the same vague brief has no better idea what counts as a finding." },
      "C": { "trap": "wrong-problem", "text": "Moving the noisy findings elsewhere keeps them noisy; the criterion is still undefined." }
    },
    "cite": "Exam guide §4.1; notes/domain-4-prompt-engineering.md §4.1"
  },
  {
    "id": "N30", "ts": "4.6", "s": "cc", "block": 2, "obj": [], "bp": { "rank": 3 },
    "q": "A developer uses one long Claude Code session to write a new pricing module and then asks the same session to review it. The review approved the code, but 2 days later QA found that weekend surcharges were applied twice, a case the session had reasoned about while writing. The team wants to catch this kind of issue before merge. What should they do?",
    "o": [
      "Ask the same session to review again with extended thinking turned on",
      "Add \"be critical of your own code\" to the review prompt in that session",
      "Have a fresh Claude instance with no writing context review the module",
      "Run the same session's review 3 times and keep findings it reports twice"
    ],
    "a": 2,
    "why": "A model reviewing its own work in the same session keeps the reasoning that led to its decisions and is less likely to question them. An independent instance without that context reviews the code as written.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "More thinking in the same session still starts from the reasoning that produced the bug." },
      "B": { "trap": "probabilistic", "text": "An instruction does not remove the generation context that makes self-review approve its own decisions." },
      "D": { "trap": "probabilistic", "text": "Repeating a biased reviewer repeats the bias; requiring agreement can also drop real findings." }
    },
    "cite": "Exam guide §4.6; notes/domain-4-prompt-engineering.md §4.6; exam guide §3.6"
  },
  // ───────────── Block 3 · Developer Productivity with Claude ─────────────
  {
    "id": "N31", "ts": "1.2", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 2 },
    "q": "Every question goes through all 4 subagents in order: explorer, dependency tracer, test runner and doc writer. A question such as \"which file defines the late-fee rate?\" takes 6 minutes and 4 subagent runs, though the explorer alone answers it. About 70% of questions are lookups like this. What should change?",
    "o": [
      "Have the coordinator run all 4 subagents in parallel for each question",
      "Add a fifth subagent that answers short lookups before the pipeline starts",
      "Let the explorer skip its work when it judges a question to be simple",
      "Have the coordinator choose which subagents each question needs, if any"
    ],
    "a": 3,
    "why": "Part of the coordinator's job is to analyse each query and invoke only the subagents it needs, instead of routing everything through the full pipeline.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "It is faster, but every lookup still pays for 4 subagent runs it does not need." },
      "B": { "trap": "over-engineered", "text": "Another agent in front of the pipeline duplicates what the coordinator should already decide." },
      "C": { "trap": "wrong-problem", "text": "The explorer is the one subagent these questions do need; the others still run." }
    },
    "cite": "Exam guide §1.2; notes/domain-1-agentic-architecture.md §1.2"
  },
  {
    "id": "N32", "ts": "1.2", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 1 },
    "q": "Asked to document how a loan payoff is calculated, the system produced a draft that covers interest and fees but says nothing about prepayment penalties. The coordinator's log shows the explorer was never asked about penalties, and the doc writer is told only to write up what it receives. The other 3 sections are accurate. What should the coordinator do?",
    "o": [
      "Check the draft for gaps, send the explorer a penalty query, then rerun the writer",
      "Tell the doc writer to add a prepayment penalty section from what it knows",
      "Rerun all 4 subagents on the whole payoff question with a longer prompt",
      "Ask the explorer to read every file in the payoff module and resend it all"
    ],
    "a": 0,
    "why": "In an iterative refinement loop the coordinator evaluates the output for gaps, re-delegates targeted queries to the right subagent, and re-invokes the writer until coverage is sufficient.",
    "wrong": {
      "B": { "trap": "probabilistic", "text": "The writer has no findings on penalties; it would write a section from general knowledge, not this codebase." },
      "C": { "trap": "over-engineered", "text": "The 3 accurate sections are redone, and nothing makes sure penalties are covered this time." },
      "D": { "trap": "symptom-fix", "text": "It floods the pipeline with everything instead of asking the one question that is missing." }
    },
    "cite": "Exam guide §1.2; notes/domain-1-agentic-architecture.md §1.2"
  },
  {
    "id": "N33", "ts": "1.2", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 1 },
    "q": "For a refactoring question, the coordinator sends the same prompt, \"find everything related to escrow accounts\", to 4 explorer subagents in parallel. All 4 search the same 140 files, and 80% of their findings are duplicates the coordinator has to merge. The escrow code covers several separate concerns. How should the coordinator split the work?",
    "o": [
      "Keep the same prompt and remove duplicates once all 4 explorers finish",
      "Split the 140 files into 4 equal batches of 35 in file-name order",
      "Give each explorer a distinct escrow subtopic with its own search goal",
      "Use 1 explorer only and give it the whole escrow question to work on"
    ],
    "a": 2,
    "why": "The coordinator should partition the scope across subagents by distinct subtopic, which minimises duplicated work while keeping the parallelism and keeping each concern whole.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "The duplicated searching still happens; only the cleanup moves." },
      "B": { "trap": "wrong-problem", "text": "It removes overlap but cuts related code apart arbitrarily, so no explorer sees a whole concern." },
      "D": { "trap": "wrong-problem", "text": "It removes duplication by giving up parallel work and loading all 140 files into one context." }
    },
    "cite": "Exam guide §1.2; notes/domain-1-agentic-architecture.md §1.2"
  },
  {
    "id": "N34", "ts": "1.3", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 4 },
    "q": "The coordinator needs 4 independent traces, one for each of 4 payment channels, before it can draft a summary. It currently spawns one tracer subagent per turn and waits for each to finish, and the whole job takes 22 minutes. Each trace needs only its channel name and the shared module map. How should the coordinator spawn the tracers?",
    "o": [
      "Spawn one tracer that handles all 4 channels in a single long subagent run",
      "Spawn all 4 tracers through Task calls in a single coordinator response",
      "Spawn the tracers across 4 turns, as now, with a shorter prompt for each",
      "Give the tracers fork_session copies of the coordinator to run side by side"
    ],
    "a": 1,
    "why": "Parallel subagents are spawned by emitting several Task tool calls in a single coordinator response, each prompt carrying the context that tracer needs.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "One subagent doing 4 traces in turn is still sequential, and it carries all 4 traces in one context." },
      "C": { "trap": "symptom-fix", "text": "Shorter prompts save little; the 4 runs still wait on each other." },
      "D": { "trap": "wrong-problem", "text": "fork_session branches a session to compare divergent approaches; it is not how subagents are spawned." }
    },
    "cite": "Exam guide §1.3; notes/domain-1-agentic-architecture.md §1.3"
  },
  {
    "id": "N35", "ts": "1.6", "s": "dp", "block": 3, "obj": [4], "bp": { "rank": 2 },
    "q": "The team asked the tool to find out why month-end interest totals differ from the general ledger by a few cents on some loans. The coordinator wrote a fixed 8-step plan up front and ran it in order. Step 3 found that 2 batch jobs round interest in different ways, but steps 4 to 8 continued as planned and the final report never compared the 2 jobs. What decomposition fits this task better?",
    "o": [
      "Keep the 8 fixed steps and add a review step at the very end of the run",
      "Write a longer fixed plan of 16 steps that covers more possible causes",
      "Re-plan after each step and follow up on whatever that step discovered",
      "Run all 8 steps in parallel and merge their reports at the very end"
    ],
    "a": 2,
    "why": "An open-ended investigation needs dynamic decomposition: the next subtasks are generated from what each step discovers. A fixed sequence runs on regardless of intermediate findings.",
    "wrong": {
      "A": { "trap": "reactive-too-late", "text": "A final review finds the gap after every step has run without following the lead." },
      "B": { "trap": "symptom-fix", "text": "A longer fixed plan is still fixed; it cannot react to what step 3 found." },
      "D": { "trap": "wrong-problem", "text": "Parallel fixed steps still ignore each other's findings." }
    },
    "cite": "Exam guide §1.6; score-report objective 4; notes/domain-1-agentic-architecture.md §1.6"
  },
  {
    "id": "N36", "ts": "1.6", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 2 },
    "q": "Each month the tool reviews about 30 changed Perl modules for the same 3 things: SQL injection risks, rounding of money values, and logging of borrower data. The checks never change and do not depend on each other's findings. A single pass over all 30 modules gives shallow, uneven comments, and the team wants deeper and steadier results. Which decomposition fits?",
    "o": [
      "A dynamic plan where the coordinator invents new subtasks from each finding",
      "One pass over all 30 modules with a longer prompt covering the 3 checks",
      "One pass per check, each pass reading all 30 modules at the same time",
      "A fixed chain: each module reviewed on its own, then one cross-module pass"
    ],
    "a": 3,
    "why": "Predictable, multi-aspect reviews suit prompt chaining: a fixed sequence of focused passes, one per module for local issues, then an integration pass for issues that cross modules. That avoids attention dilution.",
    "wrong": {
      "A": { "trap": "over-engineered", "text": "The checks are known and stable; an adaptive plan adds unpredictability where a fixed sequence fits." },
      "B": { "trap": "symptom-fix", "text": "A longer prompt does not fix attention spread across 30 modules at once." },
      "C": { "trap": "symptom-fix", "text": "Splitting by check narrows the question but still spreads attention over 30 modules per pass." }
    },
    "cite": "Exam guide §1.6; notes/domain-1-agentic-architecture.md §1.6"
  },
  {
    "id": "N37", "ts": "1.7", "s": "dp", "block": 3, "obj": [3], "bp": { "rank": 3 },
    "q": "On Monday a developer ran a named session, \"arrears-audit\", that analysed 40 files in the arrears module. On Tuesday a teammate changed 3 of those files; the other 37 are unchanged. The developer wants to continue the audit on Wednesday without paying again for the 37 unchanged files. What should they do?",
    "o": [
      "Resume \"arrears-audit\" and tell it which 3 files changed for re-analysis",
      "Resume \"arrears-audit\" and carry on as if nothing has changed since Monday",
      "Start a new session and ask it to re-read all 40 files of the module again",
      "Fork the session and have the fork re-explore the whole arrears module"
    ],
    "a": 0,
    "why": "When most prior context is still valid, resume the named session and tell it exactly which files changed so it re-analyses only those.",
    "wrong": {
      "B": { "trap": "wrong-problem", "text": "The session still holds Monday's view of the 3 changed files and will reason from stale results." },
      "C": { "trap": "over-engineered", "text": "It repeats the analysis of 37 files that are still valid." },
      "D": { "trap": "wrong-problem", "text": "Forking is for exploring divergent approaches; this re-explores everything as well." }
    },
    "cite": "Exam guide §1.7; score-report objective 3; notes/domain-1-agentic-architecture.md §1.7"
  },
  {
    "id": "N38", "ts": "1.7", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 2 },
    "q": "After a 2-hour session mapping the payment-allocation code, a developer wants to compare 2 refactoring approaches: splitting the allocator by loan type, or replacing it with a rules table. The mapping is still current, both attempts should start from it, and neither attempt should affect the other. Re-running the 2-hour mapping for each approach is too slow. What should they use?",
    "o": [
      "Resume the session twice in a row and try one approach in each resume",
      "fork_session to make 2 branches from the mapped session, one per approach",
      "Start 2 new sessions and paste the same short summary of the mapping in each",
      "Try both approaches one after the other in the same session's context"
    ],
    "a": 1,
    "why": "fork_session creates independent branches from a shared analysis baseline, made for comparing divergent approaches without either affecting the other.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Resuming continues the same line, so the second attempt starts with the first one already in its history." },
      "C": { "trap": "symptom-fix", "text": "A fresh start with a summary suits stale context; here the full mapping is current, and a short summary drops most of it." },
      "D": { "trap": "wrong-problem", "text": "The second approach would be shaped by the first; they would not be independent." }
    },
    "cite": "Exam guide §1.7; notes/domain-1-agentic-architecture.md §1.7"
  },
  {
    "id": "N39", "ts": "2.4", "s": "dp", "block": 3, "obj": [], "bp": { "rank": 2 },
    "q": "Agents waste many calls exploring the database: before answering a question, the explorer typically calls list_tables and then describe_table 10 to 15 times to find the right columns. The schema of the 180 tables changes about once a quarter. The team runs its own MCP server for the database. What should the server add?",
    "o": [
      "A search_tables tool the agent calls to filter tables by keyword",
      "A system prompt note listing the 20 tables the agents use most often",
      "A larger page size for describe_table that returns 15 tables at a time",
      "The table schema exposed as an MCP resource that the agents can read"
    ],
    "a": 3,
    "why": "MCP resources expose content catalogues, such as a database schema, so the agent can see what data exists up front instead of discovering it through repeated tool calls.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "Fewer calls per search, but the agent still has to explore by calling tools to learn what exists." },
      "B": { "trap": "wrong-problem", "text": "A hand-kept list covers part of the schema and goes stale when it changes." },
      "C": { "trap": "symptom-fix", "text": "It bundles exploratory calls; the agent still explores blind." }
    },
    "cite": "Exam guide §2.4; notes/domain-2-tool-design-mcp.md §2.4"
  },
  {
    "id": "N40", "ts": "2.4", "s": "dp", "block": 3, "obj": [14,28], "bp": { "rank": 4 },
    "q": "All 12 developers on the team should use the same MCP server for the loan-servicing database. The server needs a read-only database token, and each developer has their own token in their shell environment as LOANS_DB_TOKEN. One developer configured the server in their ~/.claude.json, and teammates who cloned the repository do not see it. Where and how should the server be configured?",
    "o": [
      "In each developer's ~/.claude.json, with their own token pasted in directly",
      "In the repository's .mcp.json, with the token given as ${LOANS_DB_TOKEN}",
      "In the repository's .mcp.json, with a shared read-only token committed to it",
      "In CLAUDE.md, with instructions that tell Claude how to connect to the server"
    ],
    "a": 1,
    "why": "Shared team servers belong in the project-scoped .mcp.json, which is version-controlled. Environment variable expansion such as ${LOANS_DB_TOKEN} reads each developer's own token at connection time, so no secret is committed.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "That is personal scope: each developer sets it up by hand, and the shared tooling still is not in the repository." },
      "C": { "trap": "symptom-fix", "text": "Right file, but it commits a secret to version control." },
      "D": { "trap": "nonexistent-feature", "text": "CLAUDE.md does not configure MCP servers; instructions do not create a connection." }
    },
    "cite": "Exam guide §2.4; score-report objectives 14, 28; notes/domain-2-tool-design-mcp.md §2.4; notes/2026-09-docs-delta.md §2.4"
  },
  {
    "id": "N41", "ts": "2.5", "s": "dp", "block": 3, "obj": [13], "bp": { "rank": 2 },
    "q": "A new developer asks the tool where the late-payment fee is calculated. The explorer subagent's first step is to Read all 260 files under lib/Loan/, and it runs out of context before answering in 1 of 3 attempts. The fee code is known to call a function named apply_late_fee. How should the explorer start?",
    "o": [
      "Grep for apply_late_fee, then Read the files found and follow imports",
      "Glob for **/*Fee*.pm and Read every file it matches before answering",
      "Read the 260 files in 2 batches of 130, then summarise each batch in turn",
      "Use Bash to cat every .pm file into one large file and Read that file"
    ],
    "a": 0,
    "why": "Build understanding incrementally: Grep finds entry points by content, such as a function name, then Read follows the imports and flow from there instead of loading every file first.",
    "wrong": {
      "B": { "trap": "wrong-problem", "text": "File names may not contain \"Fee\", and reading every match up front is the same habit at a smaller scale." },
      "C": { "trap": "symptom-fix", "text": "It still reads everything up front; summaries of 130 files lose the detail needed." },
      "D": { "trap": "symptom-fix", "text": "One big file is the same amount of text, so the context still overflows." }
    },
    "cite": "Exam guide §2.5; score-report objective 13; notes/domain-2-tool-design-mcp.md §2.5"
  },
  {
    "id": "N42", "ts": "2.5", "s": "dp", "block": 3, "obj": [13], "bp": { "rank": 4 },
    "q": "The doc writer needs a list of every test file in the codebase before it drafts the testing guide. Test files follow the naming pattern *_test.t and sit in 70 folders next to the modules they test. The explorer currently runs Grep for the word \"test\" and returns 4,100 matches, most of them inside ordinary modules. Which tool call fits?",
    "o": [
      "Grep for \"_test\" across the codebase and keep the matching lines",
      "Glob with the pattern **/*_test.t to list the files by name",
      "Bash running ls in each of the 70 folders and joining the output",
      "Read each folder's index file and copy the tests listed there"
    ],
    "a": 1,
    "why": "Glob matches file paths by pattern, so **/*_test.t lists every test file wherever it sits. Grep is for searching inside files.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Grep searches file contents; the need is to find files by name." },
      "C": { "trap": "over-engineered", "text": "It works, but it rebuilds by hand what a single Glob call does." },
      "D": { "trap": "nonexistent-feature", "text": "Nothing in the stem says such index files exist; the names already follow a pattern." }
    },
    "cite": "Exam guide §2.5; score-report objective 13; notes/domain-2-tool-design-mcp.md §2.5"
  },
  {
    "id": "N43", "ts": "2.5", "s": "dp", "block": 3, "obj": [13], "bp": { "rank": 2 },
    "q": "The team wants every caller of the legacy calc_interest function before deleting it. Grep for calc_interest finds only 3 callers, but tests fail in 11 other files after a trial removal. A wrapper module, Loan::Rates, re-exports calc_interest under 2 other names, compute_rate and rate_for_term. How should the explorer find all the callers?",
    "o": [
      "Grep for \"use Loan::Rates\" and treat each importing file as a caller",
      "Grep again for calc_interest with case-insensitive matching turned on",
      "Find the names Loan::Rates exports, then Grep for each of those names",
      "Glob for every file under lib/ with Rates in its name and Read them all"
    ],
    "a": 2,
    "why": "To trace usage through a wrapper module, first identify every name it exports for the function, then search the codebase for each of those names.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Importing the module is not calling this function; files that use other Loan::Rates functions would be counted too." },
      "B": { "trap": "symptom-fix", "text": "The callers use different names, not different capitals; this finds the same 3." },
      "D": { "trap": "wrong-problem", "text": "Callers are not named after the module they call; file names say nothing about usage." }
    },
    "cite": "Exam guide §2.5; score-report objective 13; notes/domain-2-tool-design-mcp.md §2.5"
  },
  {
    "id": "N44", "ts": "5.4", "s": "dp", "block": 3, "obj": [15], "bp": { "rank": 3 },
    "q": "A 3-day exploration of the loan-servicing system runs in one long session. By day 2 the agent refers to \"the usual repository pattern\" instead of the LoanLedger and EscrowBook classes it found on day 1, and twice it gives different answers to the same question. Running /compact once a day has not stopped this. What should the agent do?",
    "o": [
      "Keep key findings in a scratchpad file and check it for later questions",
      "Run /compact every hour instead of once a day across the 3-day session",
      "Add a system prompt line telling it to name specific classes, not patterns",
      "Re-read all the files from day 1 each morning before taking new questions"
    ],
    "a": 0,
    "why": "Context degrades in long sessions: answers drift to \"typical patterns\" and contradict earlier ones. A scratchpad file keeps key findings outside the context, and the agent refers back to it for later questions.",
    "wrong": {
      "B": { "trap": "symptom-fix", "text": "Compaction was tried; doing it more often compresses the specific findings further." },
      "C": { "trap": "probabilistic", "text": "The model cannot name classes it no longer holds in context." },
      "D": { "trap": "over-engineered", "text": "It refills the context with raw files, the cause of the degradation, every day." }
    },
    "cite": "Exam guide §5.4; score-report objective 15; notes/domain-5-context-reliability.md §5.4"
  },
  {
    "id": "N45", "ts": "5.4", "s": "dp", "block": 3, "obj": [15], "bp": { "rank": 1 },
    "q": "The coordinator runs 5 explorer subagents over a weekend to document the batch jobs. On Sunday the process crashed after 3 explorers had finished. The restarted coordinator had no record of their findings, and all 5 were run again for another 9 hours. What design avoids repeating finished work after a crash?",
    "o": [
      "Have the coordinator save one summary of all findings when the run ends",
      "Have each explorer keep its findings in its own context until asked again",
      "Explorers save results to files; on restart the coordinator reads an index",
      "Have the coordinator log each explorer's start time and rerun unfinished"
    ],
    "a": 2,
    "why": "Crash recovery needs structured state outside the process: each agent exports its state to a known location, and on restart the coordinator loads the index of what finished, injects those findings, and runs only the rest.",
    "wrong": {
      "A": { "trap": "reactive-too-late", "text": "A crash before the end leaves nothing saved, which is exactly what happened." },
      "B": { "trap": "nonexistent-feature", "text": "A subagent's context does not outlive its run, let alone a crash of the whole process." },
      "D": { "trap": "wrong-problem", "text": "Start times say who began, not what they found; the finished explorers' findings are still lost." }
    },
    "cite": "Exam guide §5.4; score-report objective 15; notes/domain-5-context-reliability.md §5.4"
  },
  // ───────────── Block 4 · Structured Data Extraction ─────────────
  {
    "id": "N46", "ts": "2.1", "s": "de", "block": 4, "obj": [27], "bp": { "rank": 4 },
    "q": "The extraction agent has 2 tools: extract_invoice for supplier invoices and extract_permit for council permits, each with a detailed description of its inputs and examples. The system prompt says \"For anything mentioning a council or a fee, use extract_invoice\", written when council fees came only on invoices. Now 28% of permits, which mention council fees, go to extract_invoice. What should you fix first?",
    "o": [
      "Rewrite the system prompt line that maps \"fee\" to extract_invoice",
      "Add 4 more permit examples to the extract_permit tool's description text",
      "Merge both tools into one extract_document tool that takes any document",
      "Add a classifier that labels each document's type before the model sees it"
    ],
    "a": 0,
    "why": "Keyword-sensitive wording in a system prompt can create tool associations that override well-written tool descriptions. Reviewing and fixing that line removes the cause.",
    "wrong": {
      "B": { "trap": "symptom-fix", "text": "The descriptions are already detailed; the prompt's keyword rule overrides them." },
      "C": { "trap": "wrong-problem", "text": "It removes the choice instead of fixing the instruction that forces the wrong one." },
      "D": { "trap": "over-engineered", "text": "New machinery around a one-line cause in the system prompt." }
    },
    "cite": "Exam guide §2.1; score-report objective 27; notes/domain-2-tool-design-mcp.md §2.1"
  },
  {
    "id": "N47", "ts": "2.2", "s": "de", "block": 4, "obj": [26], "bp": { "rank": 3 },
    "q": "The lookup_supplier tool checks each invoice's supplier against the vendor register. When the register is down for its nightly 20-minute maintenance, the tool returns an empty result, and the agent marks those invoices \"unknown supplier\" and sends them to reviewers. Last month 310 invoices from known suppliers were sent this way. What should the tool return during maintenance?",
    "o": [
      "An empty result with a note in its description field that it may be down",
      "The last cached supplier list, with no sign that the register was offline",
      "isError with a transient category, isRetryable true and a retry time",
      "isError with a validation category and the supplier ID that was sent"
    ],
    "a": 2,
    "why": "A failed lookup is an access failure, not an empty match. Marking it as a transient, retryable error lets the agent wait and retry instead of treating known suppliers as unknown.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "It is still shaped like a valid empty result, so the agent reads it as \"no such supplier\"." },
      "B": { "trap": "error-suppression", "text": "It hides the outage; a supplier added since the cache was taken would be marked unknown." },
      "D": { "trap": "wrong-problem", "text": "Validation means the input was wrong; it would make the agent change a correct supplier ID." }
    },
    "cite": "Exam guide §2.2; score-report objective 26; notes/domain-2-tool-design-mcp.md §2.2"
  },
  {
    "id": "N48", "ts": "2.3", "s": "de", "block": 4, "obj": [23,29], "bp": { "rank": 3 },
    "q": "The pipeline has 3 extraction tools, one each for invoices, permits and inspection reports, and documents arrive with no type label. With tool_choice \"auto\", 5% of responses are plain text such as \"This looks like a permit\" with no tool call, and the downstream parser fails on them. Every document is one of the 3 types. What should the request set?",
    "o": [
      "Force extract_invoice with tool_choice, the most common document type",
      "Set tool_choice to \"any\" on every extraction request in the pipeline",
      "Keep tool_choice \"auto\" and tell the model to call a tool every time",
      "Keep tool_choice \"auto\" and retry each response that has no tool call"
    ],
    "a": 1,
    "why": "tool_choice \"any\" makes the model call a tool but lets it choose which one, which is what is needed when several extraction schemas exist and the document type is unknown.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Forcing one tool sends permits and inspection reports through the invoice schema." },
      "C": { "trap": "probabilistic", "text": "With \"auto\" the model may still answer in text; an instruction lowers the rate but does not remove it." },
      "D": { "trap": "reactive-too-late", "text": "It recovers after the failure instead of preventing it, and each retry can fail the same way." }
    },
    "cite": "Exam guide §2.3, §4.3; score-report objectives 23, 29; notes/domain-2-tool-design-mcp.md §2.3"
  },
  {
    "id": "N49", "ts": "4.1", "s": "de", "block": 4, "obj": [], "bp": { "rank": 2 },
    "q": "The prompt asks Claude to flag \"any safety concerns\" in site inspection reports. Reviewers find that 3 of every 4 flags are routine notes such as \"cable ties weathered\", while 2 real roof-penetration leaks were missed last quarter. Adding \"focus on serious issues\" to the prompt changed little. What change should you make?",
    "o": [
      "Add 3 examples of serious defects to the prompt as few-shot examples",
      "Run the same prompt twice per report and keep flags found in both runs",
      "Ask for routine notes in a second list beside the safety flags",
      "Add to the prompt what to flag, such as roof leaks, and what to skip"
    ],
    "a": 3,
    "why": "Specific categorical criteria, naming what to report and what to skip, improve precision and recall where vague instructions such as \"any concerns\" or \"serious issues\" do not.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "Examples of serious defects alone show what to catch but not where the line falls; routine notes have nothing telling the model to skip them." },
      "B": { "trap": "probabilistic", "text": "Agreement between 2 runs of a vague prompt filters noise at random and can drop the rare real leak." },
      "C": { "trap": "wrong-problem", "text": "Sorting output into two lists needs the same missing criterion to decide which list a note goes in." }
    },
    "cite": "Exam guide §4.1; notes/domain-4-prompt-engineering.md §4.1"
  },
  {
    "id": "N50", "ts": "4.2", "s": "de", "block": 4, "obj": [24], "bp": { "rank": 1 },
    "q": "Supplier invoices come from about 60 suppliers, and the panel quantity appears in different places: a line-item table, a sentence in the notes (\"supplied 24 x 410W panels\"), or a packing summary on page 2. The extraction returns null for panel_quantity on 18% of invoices where a person can find it. The prompt already describes all 3 layouts in prose. What should you add?",
    "o": [
      "Make panel_quantity required in the schema and remove the null option",
      "3 examples showing the quantity extracted from each layout, with the source",
      "A longer prose description of where the quantity tends to appear",
      "A retry with the error \"panel_quantity missing\" whenever it is null"
    ],
    "a": 1,
    "why": "Few-shot examples that show correct extraction from each document structure are the documented fix for empty or null extraction of fields that are present in varied formats.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "A required field forces a value even when the model cannot find one, which invites made-up quantities." },
      "C": { "trap": "symptom-fix", "text": "The layouts are already described in prose; more prose repeats what has not worked." },
      "D": { "trap": "symptom-fix", "text": "The retry gets no new information about where to look, so the same layouts fail again." }
    },
    "cite": "Exam guide §4.2; score-report objective 24; notes/domain-4-prompt-engineering.md §4.2"
  },
  {
    "id": "N51", "ts": "4.3", "s": "de", "block": 4, "obj": [21], "bp": { "rank": 2 },
    "q": "The current pipeline asks Claude to \"reply with JSON only\" and parses the reply. About 2% of replies fail to parse: a trailing comma, a missing quote, or a sentence before the JSON. At 3,500 permits a year that is 70 manual fixes. Which method makes the output schema-compliant most reliably?",
    "o": [
      "An extraction tool with the record as its input schema; read the tool_use",
      "Add 3 examples of valid JSON output to the prompt to show the exact format",
      "Prefill the assistant turn with an opening brace before each response",
      "Run a JSON repair library on each reply before passing it to the parser"
    ],
    "a": 0,
    "why": "Tool use with a JSON schema is the most reliable way to get schema-compliant structured output: the model fills in the tool's input, the response carries it as a tool_use block, and JSON syntax errors are eliminated.",
    "wrong": {
      "B": { "trap": "probabilistic", "text": "Examples make valid JSON more likely; they do not remove syntax errors." },
      "C": { "trap": "symptom-fix", "text": "It stops text before the JSON but not commas or quotes inside it, and newer models do not support prefill." },
      "D": { "trap": "symptom-fix", "text": "It patches broken output after the fact and can guess the wrong repair." }
    },
    "cite": "Exam guide §4.3; score-report objective 21; notes/domain-4-prompt-engineering.md §4.3; notes/2026-09-docs-delta.md §2.3 (prefill not supported on Claude 4.6+)"
  },
  {
    "id": "N52", "ts": "4.3", "s": "de", "block": 4, "obj": [22], "bp": { "rank": 3 },
    "q": "The permit schema makes approval_date a required string. About 1 in 10 permits is still pending and has no approval date, and on those Claude fills in the lodgement date or today's date. Permit tracking then shows pending permits as approved. What schema change fixes this?",
    "o": [
      "Add a prompt rule telling Claude not to guess approval_date for pending permits",
      "Keep approval_date required and add an example of a pending permit's record",
      "Make approval_date an enum of the 12 months plus a value named \"pending\"",
      "Make approval_date optional and nullable, with null when no date is shown"
    ],
    "a": 3,
    "why": "When the source may not contain a value, the field should be optional and nullable. A required field pushes the model to fabricate a value to satisfy the schema.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "The schema still demands a value; a prompt rule fights the required field." },
      "B": { "trap": "symptom-fix", "text": "A required field still has to be filled, so the example has to show a value that does not exist." },
      "C": { "trap": "wrong-problem", "text": "It throws away the day and year to make room for one status value." }
    },
    "cite": "Exam guide §4.3; score-report objective 22; notes/domain-4-prompt-engineering.md §4.3"
  },
  {
    "id": "N53", "ts": "4.3", "s": "de", "block": 4, "obj": [22], "bp": { "rank": 2 },
    "q": "The inspection schema has a defect_type enum with 6 values: roofing, wiring, inverter, mounting, earthing and labelling. About 7% of defects fit none of them, such as bird nests under panels, and Claude forces each into the closest value, mostly \"mounting\". Warranty claims are then filed with the wrong supplier. New kinds of defect appear every few months. What schema change fits?",
    "o": [
      "Add bird_nest as a seventh enum value and keep the rest of the schema",
      "Replace the enum with a free-text defect_type string for every defect",
      "Add an \"other\" enum value plus a defect_detail string for the description",
      "Make defect_type nullable and leave it empty when no value fits the defect"
    ],
    "a": 2,
    "why": "An \"other\" value plus a detail string keeps the fixed categories for routing while letting the model describe anything new honestly, which suits a category list that keeps growing.",
    "wrong": {
      "A": { "trap": "symptom-fix", "text": "It fixes today's case; the next new kind of defect is forced into a wrong value again." },
      "B": { "trap": "wrong-problem", "text": "It loses the fixed categories warranty routing relies on for the 93% that fit." },
      "D": { "trap": "error-suppression", "text": "The defect is recorded with no type and no description, so it is lost to warranty." }
    },
    "cite": "Exam guide §4.3; score-report objective 22; notes/domain-4-prompt-engineering.md §4.3"
  },
  {
    "id": "N54", "ts": "4.4", "s": "de", "block": 4, "obj": [25], "bp": { "rank": 2 },
    "q": "Reviewers correct about 15% of invoice extractions, and they type each fix straight into accounts payable. The team wants to improve the prompt and few-shot examples, but nobody can say which fields or invoice layouts cause the corrections. Last quarter's prompt edit was based on one reviewer's memory and made 2 suppliers worse. What should the team build?",
    "o": [
      "A self-assigned 1 to 10 confidence score on each record, with low ones flagged",
      "A log of each fix with field, supplier layout and error type, reviewed monthly",
      "A second Claude pass that re-extracts every invoice and compares the 2 results",
      "A rule that reviewers write a short note in the chat each time they fix a value"
    ],
    "a": 1,
    "why": "A feedback loop captures structured metadata about each error, such as which field, which layout and what kind of mistake, so the patterns can be analysed and used to fix the prompt, schema or examples where they actually fail.",
    "wrong": {
      "A": { "trap": "probabilistic", "text": "The model's own number says nothing about which layouts or fields cause errors, so it cannot guide a prompt change." },
      "C": { "trap": "over-engineered", "text": "It doubles the cost and shows disagreement, not the pattern behind the reviewers' fixes." },
      "D": { "trap": "symptom-fix", "text": "Free-text notes are hard to count; the patterns stay buried." }
    },
    "cite": "Exam guide §4.4; score-report objective 25; notes/domain-4-prompt-engineering.md §4.4"
  },
  {
    "id": "N55", "ts": "4.4", "s": "de", "block": 4, "obj": [], "bp": { "rank": 1 },
    "q": "A validation check rejects inspection records that have no inverter_serial, and the pipeline retries each rejected record up to 3 times with the error message appended. For about 120 records a month all 3 retries fail. Spot checks show those reports were written before the inverter was fitted, and the serial appears only on a later commissioning sheet that is not sent with the report. What should change?",
    "o": [
      "Accept a null serial for these, flag the record as missing it, and skip the retry",
      "Raise the retry limit to 6 with a stronger error message on each attempt",
      "Add the commissioning-sheet format to the few-shot examples in the prompt",
      "Lower the temperature on each retry to make the model's output more stable"
    ],
    "a": 0,
    "why": "Retry with error feedback works for format and structure mistakes. It cannot work when the information is absent from the source; then the record should carry a null and a flag for follow-up instead of burning retries.",
    "wrong": {
      "B": { "trap": "symptom-fix", "text": "Retries cannot find a value the document does not contain; 6 attempts fail like 3." },
      "C": { "trap": "wrong-problem", "text": "The commissioning sheet is not sent, so an example of its format changes nothing." },
      "D": { "trap": "probabilistic", "text": "Steadier output is still output without the serial." }
    },
    "cite": "Exam guide §4.4; notes/domain-4-prompt-engineering.md §4.4"
  },
  {
    "id": "N56", "ts": "4.5", "s": "de", "block": 4, "obj": [20], "bp": { "rank": 3 },
    "q": "Each weekend the pipeline re-checks 3,500 permits for an audit report due on Monday morning. For each permit, Claude calls a check_register tool that looks the permit up in the council register, then finishes the extraction from the result. Finance wants to move the job to the Message Batches API for the 50% saving. What should you do?",
    "o": [
      "Submit the job as a batch as it is, with check_register in each request",
      "Keep it on the synchronous API; batches are unsuitable for weekend jobs",
      "Fetch the register data first, put it in each prompt, then batch them",
      "Submit as a batch and poll every hour until all the tool calls finish"
    ],
    "a": 2,
    "why": "The job is latency-tolerant, so batch processing fits, but the Message Batches API does not support multi-turn tool calling within a request. Doing the register lookups first and putting the results in each prompt makes every request single-turn.",
    "wrong": {
      "A": { "trap": "nonexistent-feature", "text": "A batch request cannot run a tool mid-request and send the result back; the lookups would never happen." },
      "B": { "trap": "wrong-problem", "text": "A weekend job with a Monday deadline is latency-tolerant, the kind of work batches suit." },
      "D": { "trap": "nonexistent-feature", "text": "Polling checks when results are ready; it does not add tool calling to a batch request." }
    },
    "cite": "Exam guide §4.5; score-report objective 20; notes/domain-4-prompt-engineering.md §4.5"
  },
  {
    "id": "N57", "ts": "4.5", "s": "de", "block": 4, "obj": [], "bp": { "rank": 1 },
    "q": "Inspection reports arrive at random times through the day, and warranty records must be updated within 36 hours of a report arriving. The team will collect reports and submit them to the Message Batches API at fixed intervals, and must assume each batch can take the full 24-hour processing window. What is the longest interval between submissions that still meets the 36-hour limit?",
    "o": [
      "Every 4 hours",
      "Every 12 hours",
      "Every 18 hours",
      "Every 36 hours"
    ],
    "a": 1,
    "why": "The worst case is a report that arrives just after a submission: it waits one full interval, then up to 24 hours of processing. Interval + 24 must be at most 36, so the longest interval is 12 hours.",
    "wrong": {
      "A": { "trap": "over-engineered", "text": "4 + 24 = 28 hours meets the limit, but it is not the longest interval that does." },
      "C": { "trap": "wrong-problem", "text": "A report that arrives just after a submission waits 18 hours, then up to 24 more: 42 hours." },
      "D": { "trap": "wrong-problem", "text": "This ignores the processing window: up to 36 + 24 = 60 hours." }
    },
    "cite": "Exam guide §4.5; notes/domain-4-prompt-engineering.md §4.5"
  },
  {
    "id": "N58", "ts": "5.5", "s": "de", "block": 4, "obj": [19], "bp": { "rank": 1 },
    "q": "The model outputs a confidence score for each extracted field, and the team plans to auto-approve fields scored above 0.9 and send the rest to the 3 reviewers. A check against 400 hand-labelled invoices shows that fields scored above 0.9 are wrong 11% of the time for one supplier's layout and under 1% for the others. What should the team do before using the scores for routing?",
    "o": [
      "Drop the scores and send a random 10% of all invoices to the reviewers",
      "Use 0.9 for all suppliers, as planned, and review the misses each month",
      "Ask the model to be more careful when it scores that supplier's fields",
      "Set thresholds per layout from the labelled set; send lower ones to review"
    ],
    "a": 3,
    "why": "Field-level confidence is useful for routing once it is calibrated: thresholds are set against a labelled validation set, here separately for the layout where scores run high, and fields below the threshold go to the reviewers. The score is checked against known answers before it decides anything.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "Random sampling ignores the signal the labelled check shows is useful for most layouts." },
      "B": { "trap": "reactive-too-late", "text": "The labelled set already shows one layout's high scores are wrong 11% of the time; those errors would pass unchecked until the monthly review." },
      "C": { "trap": "probabilistic", "text": "An instruction does not calibrate a score; only comparison with labelled data shows what a score means." }
    },
    "cite": "Exam guide §5.5; score-report objective 19; notes/domain-5-context-reliability.md §5.5"
  },
  {
    "id": "N59", "ts": "5.5", "s": "de", "block": 4, "obj": [19], "bp": { "rank": 1 },
    "q": "After 6 months, extraction accuracy is 97% overall, and the team proposes to stop human review of all records the model scores as high-confidence. Inspection reports make up only 8% of volume, and nobody has measured their accuracy separately. The reviewers can check about 150 records a week. What should the team do before cutting review?",
    "o": [
      "Cut review and spot-check a random 10% of all records each week",
      "Keep reviewing every record of every type for another 6 months first",
      "Check accuracy by type and field first, then keep a stratified sample",
      "Review only the low-confidence records and stop all other spot checks"
    ],
    "a": 2,
    "why": "Aggregate accuracy can mask poor performance on specific document types or fields. Validate by type and field before reducing review, and keep stratified random sampling of high-confidence records to measure error rates and catch new patterns.",
    "wrong": {
      "A": { "trap": "wrong-problem", "text": "A plain random sample is dominated by invoices; at 8% of volume the inspection reports barely appear, so a weak segment can stay hidden." },
      "B": { "trap": "over-engineered", "text": "The reviewers cannot check everything, and waiting does not show where the errors are." },
      "D": { "trap": "reactive-too-late", "text": "With no sampling of high-confidence records, new error patterns there go unseen." }
    },
    "cite": "Exam guide §5.5; score-report objective 19; notes/domain-5-context-reliability.md §5.5"
  },
  {
    "id": "N60", "ts": "5.6", "s": "de", "block": 4, "obj": [], "bp": { "rank": 4 },
    "q": "A warranty summary merges 2 inspection reports for the same site. The March report lists 4 failed panels and the September report lists 9, and the summary step writes \"the sources disagree on failed panels\" and keeps the March figure. Both reports are accurate for their dates. What should the extracted data include?",
    "o": [
      "Each figure with its report and date, read as a change over time",
      "Only the September figure, the most recent report on the site's panels",
      "The average of the 2 figures, labelled as an estimate of failed panels",
      "Both figures marked as a conflict for a person to resolve by hand"
    ],
    "a": 0,
    "why": "Requiring dates in structured outputs lets later steps read the difference correctly. Here the two counts are not a contradiction but two points in time.",
    "wrong": {
      "B": { "trap": "wrong-problem", "text": "Dropping March loses the history that shows panels failing over the season." },
      "C": { "trap": "wrong-problem", "text": "An average of two counts from different dates describes neither date." },
      "D": { "trap": "symptom-fix", "text": "Both are right for their dates; calling it a conflict sends reviewers a non-problem." }
    },
    "cite": "Exam guide §5.6; notes/domain-5-context-reliability.md §5.6"
  }
];

module.exports = { META, Q };
