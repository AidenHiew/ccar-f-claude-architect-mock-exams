// tutor/build/data/fresh1.js — Fresh Paper 1: 15 questions checked against the whole answered history (built late October 2026).
// Booking check after sim4 was abandoned (51/60 near-copies): 6 angles no past key used + 9 two-fact items (the key needs 2 stem facts together).
// Not a sim set: no obj/blocks matrix gate. bp.rank = measured length rank of the key (1 longest).
// Facts only from reference/ccar-f-official-exam-guide.md, notes/ and lessons/. Single-answer only.
'use strict';

const META = {
  "key": "fresh1",
  "title": "CCA-F Fresh Paper 1",
  "eyebrow": "Mixed domains · 15 questions · 4 scenarios",
  "intro": "Fifteen new exam-level questions in four scenario blocks, across all five domains. They were checked against every question you have answered before, and none repeats an earlier situation. Every question has one correct answer. Flag questions to return to them before you submit. Labels stay hidden until grading. Sit it once, cold, in exam mode, with the 30-minute timer.",
  "defaultMode": "exam",
  "timerDefault": true,
  "minutes": 30,
  "storageKey": "ccaf-fresh1",
  "blocks": [
    {
      "id": 1,
      "title": "Customer Support Resolution Agent",
      "intro": "You are building a support agent on the Claude Agent SDK for a gym chain with 60 clubs and 210,000 members. It handles memberships, freezes, cancellations, billing and family accounts through MCP tools including verify_member, get_member, get_invoice, waive_fee and escalate_to_human. The target is 80% first-contact resolution while still escalating the cases that need a person."
    },
    {
      "id": 2,
      "title": "Code Generation with Claude Code",
      "intro": "Your team of 9 engineers uses Claude Code on a regional weather bureau's forecast platform: Python data services, a TypeScript web front end and about 1,700 files in one repository. You own the Claude Code setup: CLAUDE.md files, rules, skills and commands."
    },
    {
      "id": 3,
      "title": "Multi-Agent Research System",
      "intro": "You are building a research system on the Claude Agent SDK for a policy think tank studying urban heat. A coordinator delegates to subagents that search the web, analyse documents, synthesise findings and write reports with citations."
    },
    {
      "id": 4,
      "title": "Structured Data Extraction",
      "intro": "You are building an extraction system for a recruitment agency that places about 2,500 contractors. Claude extracts fields from weekly timesheets, placement contracts and client purchase orders using tool use and JSON schemas, and the output feeds payroll and client invoicing."
    }
  ]
};

const Q = [
  // ───────────── Block 1 · Customer Support Resolution Agent ─────────────
  {
    "id": "F01", "ts": "1.1", "s": "cs", "block": 1, "bp": {"rank": 1},
    "q": "After each tool call, the membership agent's loop code adds only the word \"OK\" to the conversation, and the model keeps requesting the same get_member lookup. A developer's first fix appended the full get_member result, but each result has 52 fields, of which the agent uses 6, and long chats then hit the context limit by turn 15. What should the loop send back after each tool call?",
    "o": [
      "The tool_result block with all 52 fields, as in the first fix",
      "The tool_result block, trimmed to the 6 fields the agent uses",
      "The \"OK\", plus the 6 fields placed in the system prompt",
      "The \"OK\" only, with the context limit raised for long chats"
    ],
    "a": 1,
    "why": "Two facts decide it. Tool results must be appended to the conversation so the model can reason with them (1.1). Verbose tool output should be trimmed to the relevant fields before it accumulates in context (5.1).",
    "wrong": {
      "A": {
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
  {
    "id": "F02", "ts": "1.4", "s": "cs", "block": 1, "bp": {"rank": 3},
    "q": "Policy says that waiving a cancellation fee above $200 needs a club manager's approval. The system prompt states the rule, yet 3% of waivers above $200 went through without approval last quarter. When the agent does hand a case over, managers cannot see the chat; chats average 40 turns, and managers spend about 8 minutes finding the cause and amount. Which change addresses both problems?",
    "o": [
      "A hook blocking waivers above $200 that escalates with the full chat transcript",
      "A firmer prompt rule for waivers above $200, plus a structured summary on handoff",
      "A firmer prompt rule for waivers above $200, plus the transcript on handoff",
      "A hook blocking waivers above $200 that escalates with a structured summary"
    ],
    "a": 3,
    "why": "A business rule that must hold every time needs programmatic enforcement: a hook that intercepts the waiver call and blocks amounts above $200, redirecting to escalation. A human who cannot see the chat needs a structured handoff (member, root cause, amount, recommended action), not a transcript to reread.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "The hook fixes the breaches, but managers still have to read a whole chat to rebuild the case."
      },
      "B": {
        "trap": "probabilistic",
        "text": "The handoff improves, but a prompt rule is what already lets 3% through."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Neither half changes the mechanism behind either problem."
      }
    },
    "cite": "Exam guide §1.4; exam guide §1.5; notes/domain-1-agentic-architecture.md §1.4–1.5"
  },
  {
    "id": "F03", "ts": "2.1", "s": "cs", "block": 1, "bp": {"rank": 3},
    "q": "The agent has get_invoice (\"Gets invoice\") and get_payment_plan (\"Gets plan\"). Members asking \"why was I charged twice?\" are routed to get_payment_plan in 19% of chats, although the answer is on the invoice. The system prompt also contains the line \"For anything about payments, use get_payment_plan.\" A teammate proposes adding routing examples to the prompt. What should you change?",
    "o": [
      "Expand both tool descriptions and keep the prompt line as it is",
      "Remove the \"payments\" line and add 6 routing examples to the prompt",
      "Expand both descriptions and delete the prompt's payments line",
      "Keep the prompt line and add 6 routing examples to the prompt"
    ],
    "a": 2,
    "why": "The stem shows 2 causes. Minimal descriptions give the model nothing to tell the tools apart, so they need inputs, examples and boundaries. A keyword-sensitive prompt line ties \"payments\" to one tool and can override even good descriptions, so it must go too.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Better descriptions help, but the prompt line sends any payment question to get_payment_plan and overrides them."
      },
      "B": {
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
  {
    "id": "F04", "ts": "2.3", "s": "cs", "block": 1, "bp": {"rank": 4},
    "q": "The membership agent sees 15 tools, including staff tools such as override_access and edit_roster, and called a staff tool in 4% of chats last month. Separately, every chat must begin with verify_member, and in 7% of chats the first response is plain text asking the member a question instead. Staff tools are still needed by the staff agent. What should you configure?",
    "o": [
      "Limit it to its 5 member tools and add a prompt rule to verify first",
      "Keep all 15 tools and force verify_member on the first turn",
      "Only its 5 member tools, and verify_member forced first",
      "Keep all 15 tools and set tool_choice to \"any\" on the first turn"
    ],
    "a": 2,
    "why": "Each agent should get only the tools its role needs, which removes the staff-tool misuse. To guarantee a specific tool is called first, force it with tool_choice {\"type\": \"tool\", \"name\": \"verify_member\"} on the first turn, then continue with \"auto\".",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "Scoping fixes the staff-tool calls, but a prompt rule cannot guarantee the first call."
      },
      "B": {
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
  {
    "id": "F05", "ts": "5.2", "s": "cs", "block": 1, "bp": {"rank": 2},
    "q": "A member asks to transfer the rest of their annual membership to a friend. The written policy covers freezes and cancellations but says nothing about transfers. get_member, searched by the name the member gave, returns 2 accounts: a \"Sam Lee\" in Leeds and another in York. What should the agent do?",
    "o": [
      "Ask for another identifier, then refuse, as transfers are not listed",
      "Ask for another identifier, then escalate the transfer as a policy gap",
      "Pick the account at the club nearest the member, then escalate it",
      "Pick the account at the club nearest the member, then apply freeze rules"
    ],
    "a": 1,
    "why": "Two separate 5.2 rules apply. Multiple matches call for asking the member for another identifier rather than choosing by heuristic. A request the policy is silent on is an escalation trigger, not something the agent decides by stretching another rule.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Identifying the account first is right, but silence in the policy is a gap for a person to decide, not a refusal rule."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Escalating the gap is right, but choosing between matches by a heuristic can put the case on the wrong member."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Both halves guess: one at the account, one at a policy that does not cover transfers."
      }
    },
    "cite": "Exam guide §5.2; notes/domain-5-context-reliability.md §5.2"
  },
  // ───────────── Block 2 · Code Generation with Claude Code ─────────────
  {
    "id": "F06", "ts": "3.1", "s": "cc", "block": 2, "bp": {"rank": 4},
    "q": "A developer wants 2 changes. First, the team has agreed that all new endpoints must return errors in the bureau's standard JSON shape, and new hires keep missing it. Second, the developer alone is trying an experimental MCP server for a radar-imagery API this month and doesn't want teammates to get it. Where should each go?",
    "o": [
      "The error rule in the project CLAUDE.md; the server in the project .mcp.json",
      "The error rule in the project CLAUDE.md; the server in their ~/.claude.json",
      "The error rule in their ~/.claude/CLAUDE.md; the server in their ~/.claude.json",
      "The error rule in their ~/.claude/CLAUDE.md; the server in the project .mcp.json"
    ],
    "a": 1,
    "why": "Two facts decide it: who needs each item. A team standard goes in project-level CLAUDE.md, shared through version control. A personal, experimental MCP server goes in the user's own ~/.claude.json, not the project's .mcp.json.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The rule's place is right, but a project .mcp.json is shared with every teammate."
      },
      "C": {
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
  {
    "id": "F07", "ts": "3.3", "s": "cc", "block": 2, "bp": {"rank": 1},
    "q": "The root CLAUDE.md holds 80 lines of conventions for the database migration files, which sit in 6 services' db/ folders as V*.sql, and a 30-line procedure for creating a new migration that developers run about once a week. Both load in every session, including the many that never touch the database. Where should each part go?",
    "o": [
      "Conventions in a **/db/V*.sql paths rule; procedure in a project skill",
      "Conventions in a **/db/V*.sql paths rule; procedure in that rule too",
      "Conventions in a project skill; procedure in a project skill too",
      "Conventions in a project skill; procedure in a **/db/V*.sql paths rule"
    ],
    "a": 0,
    "why": "Two kinds of guidance need 2 mechanisms. Conventions that apply when editing certain files belong in a .claude/rules/ file whose paths glob loads it only for those files. A task-specific procedure run on request belongs in a skill, invoked on demand.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Path loading suits the conventions, but the procedure is needed when creating a migration, before any V*.sql file is open."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "An on-demand skill suits the procedure, but conventions in a skill apply only when someone remembers to run it."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Each part is in the other's mechanism."
      }
    },
    "cite": "Exam guide §3.3; exam guide §3.2; notes/domain-3-claude-code-config.md §3.2–3.3"
  },
  {
    "id": "F08", "ts": "3.5", "s": "cc", "block": 2, "bp": {"rank": 1},
    "q": "A developer must add severe-weather alerts that fan out to SMS and app-push providers from the 4 Python services and the front end. They have never built alerting and don't know the providers' sending limits, how duplicate alerts should be suppressed, or what happens when a provider is down. The change will touch about 30 files and has more than one possible design. How should they start in Claude Code?",
    "o": [
      "Give Claude 3 input/output examples of alerts, then design in plan mode",
      "Have Claude interview them on the alert needs, then build it directly",
      "Have Claude interview them on the alert needs, then design in plan mode",
      "Give Claude 3 input/output examples of alerts, then build it directly"
    ],
    "a": 2,
    "why": "Two facts decide it. The domain is unfamiliar and the considerations are unknown, so the interview pattern (Claude asks the questions) surfaces them first (3.5). The change is multi-file with several valid designs, so the design work belongs in plan mode before implementation (3.4).",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Plan mode suits a 30-file design, but examples cannot answer the sending-limit, duplicate and outage questions the developer has not thought through."
      },
      "B": {
        "trap": "reactive-too-late",
        "text": "The interview is right, but a 30-file change with several designs needs planning before edits."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Neither part fits an unfamiliar, multi-file design problem."
      }
    },
    "cite": "Exam guide §3.5; exam guide §3.4; notes/domain-3-claude-code-config.md §3.4–3.5"
  },
  // ───────────── Block 3 · Multi-Agent Research System ─────────────
  {
    "id": "F09", "ts": "1.3", "s": "ma", "block": 3, "bp": {"rank": 1},
    "q": "The coordinator's allowedTools list holds only the web-search and document tools, so it runs all 4 searches for an urban-heat report itself: heat deaths, tree cover, cooling-centre use and building codes. The team has defined a search subagent and wants the 4 searches to run as separate subagents at the same time. None of them depends on another's results. What should change?",
    "o": [
      "Add \"Task\" to allowedTools and emit 1 Task call per coordinator turn",
      "Keep allowedTools as it is and emit the 4 Task calls in a single response",
      "Add \"Task\" to allowedTools and emit the 4 Task calls in a single response",
      "Keep allowedTools as it is and give the coordinator 4 more search tools"
    ],
    "a": 2,
    "why": "Two facts decide it. A coordinator can spawn subagents only if \"Task\" is in its allowedTools. Subagents run in parallel when the coordinator emits several Task calls in one response, not one per turn.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "The coordinator can now spawn subagents, but one per turn runs the 4 searches one after another."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Parallel emission is right, but without \"Task\" in allowedTools the coordinator cannot call it at all."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "More tools keep the coordinator doing the searches itself, one context and no subagents."
      }
    },
    "cite": "Exam guide §1.3; notes/domain-1-agentic-architecture.md §1.3"
  },
  {
    "id": "F10", "ts": "5.1", "s": "ma", "block": 3, "bp": {"rank": 3},
    "q": "The synthesis subagent receives the findings of 30 search tasks pasted one after another into a single 40-page input. Its reports reliably cover findings from the first and last few tasks but leave out findings from the middle in about 1 report in 3, even when those findings are strong. The input's total size is within limits. What should change in how the input is assembled?",
    "o": [
      "Shuffle the order of the 30 tasks' findings on each run",
      "A key-findings summary first, and a header for each task",
      "Cut the input down to the 10 tasks that had the most findings",
      "Tell the synthesis subagent to read the whole input carefully"
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
  {
    "id": "F11", "ts": "5.3", "s": "ma", "block": 3, "bp": {"rank": 2},
    "q": "In 1 run of 4, the search subagent for cooling-centre data fails after 2 retries because the city's data portal is down, and it reports this to the coordinator with what it tried. The coordinator continues, and the final report covers the other 3 topics well but says nothing about cooling centres. Readers assume none of the sources mentioned them. What should the report include?",
    "o": [
      "Notes on which findings are solid and which topics have gaps",
      "Nothing; the run should have stopped when the portal failed",
      "The cooling-centre section, written from general knowledge",
      "Only the subagent's error report, passed on to the coordinator"
    ],
    "a": 0,
    "why": "When a source is unavailable, synthesis output should carry coverage annotations: which findings are well supported and which topic areas have gaps because sources were unavailable. Silence reads as \"nothing found\".",
    "wrong": {
      "B": {
        "trap": "over-engineered",
        "text": "Stopping wastes 3 good topics; proceeding with partial results is right if the gap is shown."
      },
      "C": {
        "trap": "error-suppression",
        "text": "This fills a gap with unsourced content and hides that the data was unavailable."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "The error reached the coordinator but not the readers; the report itself must show the gap."
      }
    },
    "cite": "Exam guide §5.3; notes/domain-5-context-reliability.md §5.3"
  },
  {
    "id": "F12", "ts": "5.6", "s": "ma", "block": 3, "bp": {"rank": 3},
    "q": "The report subagent turns everything into prose. A comparison of cooling costs across 6 cities and 4 years now reads as 3 paragraphs of numbers, and reviewers cannot compare the cities. News coverage of a 2025 heatwave and a list of technical design standards are also written as running prose. What should the report subagent do?",
    "o": [
      "Cost data as a table, news as a table, standards as a list",
      "Keep prose but bold every number in the cost paragraphs",
      "Move the cost comparison into an appendix of raw data tables",
      "Cost data as a table, news as prose, standards as a list"
    ],
    "a": 3,
    "why": "Synthesis output should render each content type in the form that suits it: figures in tables, news in prose, technical findings in lists, instead of forcing one format on everything.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Two of 3 are right, but news coverage reads as prose; a table flattens it."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Bold numbers are easier to spot but still cannot be compared across 6 cities and 4 years."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "This hides the key comparison instead of presenting it in a form readers can use."
      }
    },
    "cite": "Exam guide §5.6; notes/domain-5-context-reliability.md §5.6"
  },
  // ───────────── Block 4 · Structured Data Extraction ─────────────
  {
    "id": "F13", "ts": "4.2", "s": "de", "block": 4, "bp": {"rank": 1},
    "q": "Claude extracts \"special conditions\" from placement contracts for the payroll team. The prompt says \"list any unusual clauses\", and 50% of listed items are standard terms such as notice periods. The listed items also come in mixed shapes, although a sentence naming the 3 fields payroll needs was added last week: some give the clause number and the effect on pay, many give neither. Payroll needs only clauses that change pay, each with those fields: clause number, effect on pay and amount. What should you add to the prompt?",
    "o": [
      "An instruction to list only clauses it is confident about, plus 2 examples",
      "Criteria for which clauses count, plus a sentence naming the 3 fields",
      "An instruction to list only confident clauses, and a sentence on the fields",
      "Criteria for which clauses count, plus 2 examples in the needed output shape"
    ],
    "a": 3,
    "why": "Two separate problems. Too many standard clauses means the instruction is vague: explicit criteria for what counts (clauses that change pay) cut the false positives (4.1). Inconsistent output shape is what few-shot examples fix best: 2 examples in the exact output shape (4.2).",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "Examples fix the shape, but confidence filtering does not define which clauses count."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Criteria fix the noise, but a sentence naming the fields was already tried and the shapes stayed mixed."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Neither part changes the mechanism behind either problem."
      }
    },
    "cite": "Exam guide §4.1; exam guide §4.2; notes/domain-4-prompt-engineering.md §4.1–4.2"
  },
  {
    "id": "F14", "ts": "4.3", "s": "de", "block": 4, "bp": {"rank": 2},
    "q": "Timesheets record hours as \"7.5h\", \"7:30\", \"450 min\" or \"seven and a half\". Payroll needs decimal hours straight from the extractor, the schema has hours as a number, and every record passes validation. But 9% of records are wrong, most often \"7:30\" extracted as 7.3. What should be added?",
    "o": [
      "Prompt rules converting each hours format to decimals",
      "A schema limit keeping hours between 0 and 24 per day",
      "A retry whenever an hours value fails schema validation",
      "A string type for hours, copied exactly as written"
    ],
    "a": 0,
    "why": "A strict schema controls the output's type, not how inconsistent source formats are interpreted. Format normalisation rules in the prompt, alongside the schema, tell the model how to convert each format.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "7.3 is within range; the bound cannot catch a misread format."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "The wrong values pass validation, so no retry is triggered."
      },
      "D": {
        "trap": "blame-shifting",
        "text": "This passes the mixed formats to downstream systems to sort out."
      }
    },
    "cite": "Exam guide §4.3; notes/domain-4-prompt-engineering.md §4.3"
  },
  {
    "id": "F15", "ts": "4.5", "s": "de", "block": 4, "bp": {"rank": 4},
    "q": "Each quarter the agency re-extracts 40,000 archived timesheets with the Message Batches API for an audit due in 2 weeks. Last quarter's first batch used a new prompt untested at scale: 18% of results failed validation, and resubmitting and fixing them nearly doubled the cost. This quarter's prompt has also changed. What should the team do before submitting the 40,000?",
    "o": [
      "Refine the prompt on a sample of a few hundred first",
      "Submit all 40,000 and resubmit failures by custom_id afterwards",
      "Use the synchronous API for all 40,000 to see failures sooner",
      "Split the 40,000 into 4 batches of 10,000 sent the same day"
    ],
    "a": 0,
    "why": "Refining the prompt on a sample set before batch-processing large volumes raises the first-pass success rate and cuts resubmission costs. The batch API still suits the job itself, which has a 2-week deadline.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Resubmitting by custom_id is right for failures, but last quarter shows this path nearly doubles the cost."
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
  }
];

module.exports = { META, Q };
