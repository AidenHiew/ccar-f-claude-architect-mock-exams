// tutor/build/data/d23.js — Domains 2 and 3 focused paper (sit 2026-10-22): 30 original questions in 3 scenario blocks.
// Allocation in statements.js (d23): the 7 weak rows after the 2026-10-19 representative mock (2.4, 2.5 ×4, 3.1–3.5 ×3) plus coverage.
// Targets the two LR-0027 habits: heavier mechanism (bp.weight = the key is the light or the heavy option) and personal vs shared
// scope (bp.scope = the key's scope). check.js balances both. Facts only from reference/ccar-f-official-exam-guide.md, notes/, lessons/.
// bp.rank = measured length rank of the key (1 longest). Single-answer only.
'use strict';

const META = {
  "key": "d23",
  "title": "CCA-F Domains 2 and 3 Paper",
  "eyebrow": "Domains 2 and 3 · 30 questions · 3 scenarios",
  "intro": "Thirty exam-level questions on Domains 2 and 3, in three scenario blocks. Every question has one correct answer. Flag questions to return to them before you submit. Labels stay hidden until grading. Sit it once, in exam mode, with the 60-minute timer on.",
  "defaultMode": "exam",
  "timerDefault": true,
  "minutes": 60,
  "storageKey": "ccaf-d23-paper",
  "blocks": [
    {
      "id": 1,
      "title": "Customer Support Resolution Agent",
      "intro": "You are building a support agent on the Claude Agent SDK for a regional broadband provider. It diagnoses faults, books technician visits, applies service credits and hands hard cases to people, through MCP tools such as get_account, check_line_status, book_technician and apply_credit."
    },
    {
      "id": 2,
      "title": "Developer Productivity with Claude",
      "intro": "Your team of 14 engineers maintains a 9-year-old Django warehouse-management system of about 3,100 Python files, and builds internal tooling on Claude Code and the Agent SDK. You own the shared setup: CLAUDE.md files, skills, MCP servers and the agent that explores the code."
    },
    {
      "id": 3,
      "title": "Code Generation with Claude Code",
      "intro": "Your team uses Claude Code on a TypeScript monorepo for an event-ticketing platform: 30 packages covering checkout, seat maps, venue tools and notifications. You own the Claude Code setup, from CLAUDE.md files and rules to skills and the Claude Code jobs in CI."
    }
  ]
};

const Q = [
  {
    "id": "F01",
    "ts": "2.1",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 1,
      "weight": "light"
    },
    "q": "Your broadband support agent has check_line_status, described as 'Checks the customer's line for faults', and check_copper_line, described as 'Runs a fault test on a copper line.' About 30% of customers are still on copper, and for them check_line_status returns 'no fault found' because it only reads fibre equipment. In 19% of copper-line fault chats the agent calls check_line_status, tells the customer their line is healthy, and closes the chat. What is the most effective first fix?",
    "o": [
      "Add a classifier subagent that reads each account's line type and routes the fault check to the matching tool",
      "Rewrite both descriptions to state which line type each tool covers and to name the other tool for the other type",
      "Add 5 few-shot examples to the system prompt showing copper-line customers being sent to check_copper_line",
      "Add a system prompt rule telling the agent to ask each customer whether their line is fibre or copper first"
    ],
    "a": 1,
    "why": "Tool descriptions are the main thing the model uses to choose a tool. check_line_status's description doesn't say it only reads fibre equipment, so the model has no reason to avoid it for copper customers. Stating each tool's boundary and naming the alternative fixes the cause at the lowest cost.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "A routing layer before the descriptions are fixed. The descriptions never say check_line_status is fibre-only, so the cause is in the tool interface, and fixing it there is cheaper and first."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Examples nudge the choice but leave the descriptions silent on the fibre-only boundary, which is the thing the model reads when it picks a tool."
      },
      "D": {
        "trap": "blame-shifting",
        "text": "Moves the decision to customers, many of whom don't know their line type, and still leaves the tool boundary undocumented."
      }
    },
    "cite": "Exam guide §2.1; notes/domain-2 §2.1; lesson 0009 (expand minimal descriptions with boundaries: use this vs that similar tool when…)"
  },
  {
    "id": "F02",
    "ts": "2.1",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 2,
      "weight": "heavy"
    },
    "q": "The agent's run_diagnostic tool takes an account ID and a mode of 'line', 'router' or 'speed', and returns a different result shape for each mode. Its description was expanded twice this quarter with each mode's inputs, outputs and example requests, yet 14% of calls still pick a mode that doesn't match the customer's problem, and the agent then misreads the result it gets back. The router mode also reboots the customer's router, which has dropped 6 live video calls this month. Which change best addresses this?",
    "o": [
      "Expand the description a third time, adding one worked example of each mode's full result shape",
      "Add a PostToolUse hook that rewrites each mode's result into one common shape before the agent reads it",
      "Add a system prompt rule telling the agent to state the mode it chose and why before each call",
      "Split it into test_line, reboot_router and run_speed_test, each with its own description and output"
    ],
    "a": 3,
    "why": "Descriptions were already improved twice, so the remaining errors come from the tool's shape: one generic tool with three purposes, three result contracts and one destructive mode. Splitting it into purpose-specific tools gives each a clear description and its own input/output contract, and keeps the reboot separate from the read-only tests.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "The description has already been expanded twice and the rate held at 14%. The problem is one generic tool doing three jobs with three output contracts, and more text doesn't change that."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Hides the shape mismatch after the wrong mode has already run, including a router reboot nobody asked for. The mode choice itself stays as error-prone as before."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Asks the model to reason harder about the same overloaded choice. It may help a little, but the mismatched contracts and the side-effecting mode are still bundled in one tool."
      }
    },
    "cite": "Exam guide §2.1; notes/domain-2 §2.1; lesson 0009 §4"
  },
  {
    "id": "F03",
    "ts": "2.1",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 2
    },
    "q": "Two MCP tools on the support agent are named get_status and check_status. get_status is described as 'Returns the status for an account' and reports billing standing, while check_status is described as 'Returns account status for the line' and reports the live connection. Across 1,500 chats, 22% of 'is my service down?' questions call get_status and answer from the bill. What should you change first?",
    "o": [
      "Merge them into one get_status tool with a type parameter of billing or connection, chosen per request",
      "Add a system prompt rule saying that service-down questions concern the connection, not the bill",
      "Rename them get_billing_standing and check_connection_live, with descriptions of what each returns",
      "Add a routing step that classifies each question as billing or connection before tools are offered"
    ],
    "a": 2,
    "why": "The two tools have near-identical names and overlapping descriptions, so the model can't tell them apart. Renaming for specificity and describing what each returns removes the overlap at its source.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Billing standing and live connection are different resources with different results. Merging moves the same confusion into the type parameter."
      },
      "B": {
        "trap": "probabilistic",
        "text": "A prompt rule works around two names and descriptions that remain nearly identical. The interface that causes the misroute is unchanged."
      },
      "D": {
        "trap": "over-engineered",
        "text": "An extra classification layer for a problem caused by two vague names and descriptions, which a rename and rewrite fix directly."
      }
    },
    "cite": "Exam guide §2.1; notes/domain-2 §2.1; lesson 0009 (rename for specificity, e.g. analyze_content → extract_web_results)"
  },
  {
    "id": "F04",
    "ts": "2.2",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 1
    },
    "q": "book_technician fails for business-tier accounts because the agent's service credentials aren't allowed to book business visits, which go through the business desk instead. The tool returns isError with the text 'Booking failed', and the agent retries 3 times and then tells the customer there are no free slots this week. This happened in 41 chats last month, and slots were open in each one. What should book_technician return?",
    "o": [
      "isError with errorCategory 'permission', isRetryable false, and a message to book via the business desk",
      "isError with 'Booking failed' as now, plus a prompt rule to stop after one retry and offer a callback",
      "An empty slot list without isError, which the agent already handles by offering next week's slots",
      "isError with errorCategory 'transient' and isRetryable true, with a 30-second backoff between retries"
    ],
    "a": 0,
    "why": "A generic error hides the cause, so the agent retries something that can never succeed and invents a reason. Structured metadata (category permission, isRetryable false, a plain explanation) lets the agent stop retrying and tell the customer the right next step.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Fewer retries, but the agent still can't tell a permission problem from a temporary one, so it still gives the customer the wrong reason and no route to the business desk."
      },
      "C": {
        "trap": "error-suppression",
        "text": "Turns a failure into a fake 'no availability' result. The agent can't recover from what it can't see, and customers get an untrue answer."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Mislabels a permission failure as temporary, which makes the wasted retries longer, not shorter."
      }
    },
    "cite": "Exam guide §2.2; notes/domain-2 §2.2"
  },
  {
    "id": "F05",
    "ts": "2.3",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 4
    },
    "q": "Each chat must start with verify_identity before any account data is discussed, and later turns may use any of the agent's 5 tools or reply in text. With tool_choice set to auto, 6% of first turns answer the customer in text and 2% call get_account first. A system prompt line saying 'verify identity first' was added 3 weeks ago and moved neither number. How should you set tool_choice?",
    "o": [
      "Set tool_choice to any on the first turn, then switch back to auto for the rest of the chat",
      "Force verify_identity with tool_choice type tool on the first turn and on each later turn too",
      "Keep auto on each turn and repeat the verify-first line at the end of the system prompt",
      "Force verify_identity with tool_choice type tool on turn 1, then auto for later turns"
    ],
    "a": 3,
    "why": "Forced tool_choice ({type: 'tool', name: 'verify_identity'}) guarantees that specific tool is called on the first turn. Later turns go back to auto, so the agent can use its other tools or reply in text.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "any guarantees a tool call, not this tool. The 2% that call get_account first would still do so."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Forcing the same tool on later turns stops the agent from doing anything else, including answering the customer."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The same line already failed to move either number. Repeating it is still a request, not a guarantee."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3; lesson 0010"
  },
  {
    "id": "F06",
    "ts": "2.3",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 1
    },
    "q": "To read account data, the support agent was given run_sql, a generic tool that runs any read-only query against the customer database. In an audit of 900 chats, 7 queries returned rows for other customers, and 2 of those details were read out to the wrong person. The agent needs only the current customer's account, plan and last 10 bills, and the security team wants it unable to reach other customers' rows, not just to hide them. What is the best fix?",
    "o": [
      "Add a system prompt rule that run_sql queries must filter on the customer ID taken from the session",
      "Add a PostToolUse hook that drops returned rows whose customer ID doesn't match the session's",
      "Replace run_sql with get_my_account, which takes no customer ID and returns only the session customer's data",
      "Route each run_sql query through a reviewer subagent that checks the WHERE clause before it runs"
    ],
    "a": 2,
    "why": "The agent has a generic tool far wider than its job. Replacing it with a constrained tool scoped to the session customer removes the ability to reach other rows, which is least privilege, and the agent still gets everything it needs.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "Leaves the broad capability in place and relies on the model writing the right WHERE clause each time, which it already fails to do 7 times in 900."
      },
      "B": {
        "trap": "reactive-too-late",
        "text": "Filters after the query already reached other customers' data. The security team asked for no access, and the agent can still query anything."
      },
      "D": {
        "trap": "over-engineered",
        "text": "A second model reviewing SQL is another probabilistic check and adds a hop to each query, while the generic tool keeps its full reach."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3"
  },
  {
    "id": "F07",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3,
      "scope": "personal"
    },
    "q": "One of your 14 engineers wants to try an experimental profiling MCP server that is still unstable. They want it in all 4 repositories they work in, and no teammate should see it or be asked to approve it. The warehouse repository already has a committed .mcp.json with 3 team servers. Where should the server be configured?",
    "o": [
      "In the warehouse repo's committed .mcp.json, with its entry marked as experimental and optional",
      "At user scope in their own ~/.claude.json, added once with claude mcp add --scope user",
      "With claude mcp add run from inside the warehouse repo, leaving the scope at its default setting",
      "In a CLAUDE.local.md in each of the 4 repositories, as the server's launch command"
    ],
    "a": 1,
    "why": "Personal or experimental servers belong at user scope in ~/.claude.json: only this engineer gets them, in each of their projects. Project .mcp.json is for shared team tooling, and local scope covers one project only.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The committed .mcp.json is shared with all 14 engineers, who would all see the server. A note in the entry doesn't change who gets it."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "The default is local scope: private to this engineer, but only for this one project. They want it in all 4 repositories."
      },
      "D": {
        "trap": "nonexistent-feature",
        "text": "CLAUDE.local.md holds instructions, not MCP server configuration. Claude Code doesn't start servers from it."
      }
    },
    "cite": "Exam guide §2.4; notes/domain-2 §2.4 (local → project → user scopes); lesson 0019; reference/scope-map.html"
  },
  {
    "id": "F08",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 4,
      "scope": "shared"
    },
    "q": "Six months ago the tech lead set up the team's read-only warehouse database MCP server with claude mcp add --scope user. Three engineers who joined this month see none of its tools, while the lead and 2 others who copied the lead's config can use it. Each engineer has their own database login, and no login may be committed to the repository. What is the fix?",
    "o": [
      "Move it to the project's committed .mcp.json, with the login read from ${WMS_DB_URL}",
      "Send each new engineer the lead's ~/.claude.json entry to paste into their own user config",
      "Expand the server's tool descriptions in the lead's config to help new sessions discover them",
      "Add a section to the root CLAUDE.md that lists the server's tools and when to use each"
    ],
    "a": 0,
    "why": "The server is team tooling that was put in one person's user scope. Shared servers go in the project's .mcp.json, committed, and ${WMS_DB_URL} lets each engineer supply their own login from their environment, keeping credentials out of the repo. A personal login doesn't make the server personal.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Works for 3 more people, until the next hire. It keeps team tooling in personal files that drift apart, which is how this happened."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Descriptions affect which tool gets chosen, not whether the server is configured. The new engineers' sessions don't load the server at all."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "CLAUDE.md doesn't configure MCP servers. Listing tools the session doesn't have changes nothing."
      }
    },
    "cite": "Exam guide §2.4; notes/domain-2 §2.4; lesson 0019"
  },
  {
    "id": "F09",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 2
    },
    "q": "The agent answers data questions through a Postgres MCP server with run_query, list_tables and describe_table tools. The warehouse schema has 410 tables, and before each query the agent makes 12 to 30 list_tables and describe_table calls to find the right ones, adding about 40 seconds per question. The schema changes about once a month. What is the best improvement?",
    "o": [
      "Paste the full 410-table schema into the root CLAUDE.md, where it loads at the start of each session",
      "Add a schema-explorer subagent that runs the describe calls and returns the relevant tables",
      "Expose the schema as an MCP resource: a catalog of tables, columns and relations visible up front",
      "Merge list_tables and describe_table into one tool returning all 410 tables with their columns"
    ],
    "a": 2,
    "why": "MCP resources expose content catalogs such as database schemas, so the agent sees what data exists without exploratory tool calls. Resources are for catalogs; tools are for actions like run_query.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Puts 410 tables into each session's context, including sessions with no data questions, and the copy goes stale after each monthly change."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Moves the same 12 to 30 exploratory calls into another agent. The agent still has no view of what data exists without exploring."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "One huge tool result per question instead of many small ones. The agent still has to call a tool to find out what exists."
      }
    },
    "cite": "Exam guide §2.4; notes/domain-2 §2.4"
  },
  {
    "id": "F10",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 2,
      "weight": "light"
    },
    "q": "An engineer asks which code reads the setting LABEL_PRINTER_QUEUE before they rename it. The repository has 3,100 Python files, and the setting could be read in any app, not only in files with printer or label in their names. The agent plans to Glob for **/*printer*.py and **/*label*.py and Read the 23 matches. What should it do instead?",
    "o": [
      "Keep the Glob, but widen the patterns to **/*print*.py and **/*queue*.py first",
      "Grep the repository for LABEL_PRINTER_QUEUE, then Read the code around each match",
      "Spawn a subagent to Read all 3,100 files and report each place the setting is used",
      "Read the settings package in full, then Glob for the files that import from it"
    ],
    "a": 1,
    "why": "Finding which code uses a name is a search of file contents, which is Grep's job. Glob finds files by path pattern, and the stem says names won't help. Grep then targeted Reads keeps exploration small.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Glob matches file names. The question is about file contents, and the stem says the setting can be read from a file with any name."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Bulk reading in another context. A single content search finds the same places directly."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Reading the definition doesn't show who reads it, and file names still say nothing about which files use this one setting."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5; lesson 0014"
  },
  {
    "id": "F11",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 2,
      "weight": "light"
    },
    "q": "An engineer asks how a barcode scan becomes a stock movement, starting from the POST /scan/ endpoint. The agent's first move was to Read the 19 files whose names contain scan or stock, and after 11 of them it still hadn't found the request handler. The URL routes for all 40 apps are registered in urls.py files. How should the agent explore instead?",
    "o": [
      "Hand the same 19 files to a subagent that Reads them all and returns one summary of the whole scan flow",
      "Glob for **/views.py across the 40 apps, then Read each one looking for the scan handler",
      "Read the remaining 8 files from the list, then Grep inside them for the word movement",
      "Grep the urls.py files for the scan/ route, Read the view it names, then follow that view's calls"
    ],
    "a": 3,
    "why": "Incremental exploration beats bulk reading: Grep finds the entry point (the route), Read follows it into the view, and each call leads to the next file. That reads a handful of files instead of dozens.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Still reads 19 files chosen by name, which haven't contained the handler so far. A subagent changes whose context fills, not the method."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Swaps one name-based list for a bigger one: 40 files read up front to find one view."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Finishes a bulk read that has already failed for 11 files, on a list built from file names."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5; lesson 0020"
  },
  {
    "id": "F12",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1
    },
    "q": "The constant MAX_TOTE_WEIGHT_KG is set to 18 in one file, and an engineer needs to know when it changed from 23 and in which commit. A Grep for the name finds the current definition and 7 places that use it, none of which mention the old value. The project's git history goes back 9 years. Which tool should the agent use next?",
    "o": [
      "Grep again across the repository, this time for the text 'MAX_TOTE_WEIGHT_KG = 23'",
      "Read the file in full along with the CHANGELOG to find the release that changed the value",
      "Bash, running git log -G with the constant's name to list the commits whose diffs touched it",
      "Glob for **/*.bak and **/*.orig files that may still hold the old value of the constant"
    ],
    "a": 2,
    "why": "Grep, Glob and Read work on the files as they are. The question is about history, which needs a command run through Bash: git log -G lists the commits whose diffs added or removed a line matching the name.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Grep searches the files as they are now. The old value only exists in history, which needs a command like git log."
      },
      "B": {
        "trap": "probabilistic",
        "text": "The CHANGELOG may not mention a constant at all, and the current file only shows the current value."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Backup files, if any exist, don't say when or in which commit the value changed."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5"
  },
  {
    "id": "F13",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1,
      "weight": "light"
    },
    "q": "Claude Code must change the line 'PICK_BATCH_SIZE = 40' to 50 in settings/base.py, a 1,400-line file. The name PICK_BATCH_SIZE appears 4 times in the file, in comments and a validator, but the full line appears once. Last time, the agent Read the whole file and used Write to save a full new copy, and the diff showed 60 unrelated lines reformatted. Code review rejected that change. What should the agent do this time?",
    "o": [
      "Use Edit with the full line 'PICK_BATCH_SIZE = 40' as the match text for the change",
      "Use Edit with PICK_BATCH_SIZE as the match text, the shortest anchor for the change",
      "Read the file, then Write it back with that one line changed and the rest as read",
      "Grep for the line number first, then use Write to replace just that numbered line"
    ],
    "a": 0,
    "why": "Edit makes a targeted change by matching unique text. The bare name appears 4 times and would fail as an anchor, but the full line appears once. Read plus Write is the fallback for when the match text isn't unique, not the default.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "The name appears 4 times, so it isn't a unique match and Edit fails. The full line is the anchor that appears once."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Read plus Write is the fallback for when no unique anchor exists. Here one does, and a full rewrite is what reformatted 60 lines last time."
      },
      "D": {
        "trap": "nonexistent-feature",
        "text": "Write replaces a whole file; it has no replace-line-by-number mode. Targeted changes are what Edit is for."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5"
  },
  {
    "id": "F14",
    "ts": "3.1",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 4,
      "scope": "personal"
    },
    "q": "An engineer wants Claude to write commit messages in their own format: a 50-character summary, then a bullet list. They work in 6 repositories, want it in all of them, and none of the teams in those repositories should be affected. They have started adding the same lines to a CLAUDE.local.md in each repository, one at a time. Where should the instruction live?",
    "o": [
      "In a CLAUDE.local.md in each of the 6 repositories, kept out of git",
      "In their own ~/.claude/CLAUDE.md, loaded in each of their projects",
      "In each repository's root CLAUDE.md, under a heading with their name",
      "In a skill in ~/.claude/skills/ that they invoke before each commit"
    ],
    "a": 1,
    "why": "Two questions: who needs it (just this engineer) and where should it load (in all their projects). Me × all projects is the user-level ~/.claude/CLAUDE.md. CLAUDE.local.md is me × one project.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Works, but CLAUDE.local.md is me × this project. Six copies of one personal preference will drift, and the next repository needs a seventh."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Root CLAUDE.md is shared with each team. A heading doesn't stop teammates' sessions from loading it."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "A skill runs only when invoked. A standing preference for every commit belongs in always-loaded instructions."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1 (who × where); lesson 0019; reference/scope-map.html"
  },
  {
    "id": "F15",
    "ts": "3.1",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3,
      "scope": "shared"
    },
    "q": "The team's coding conventions, 120 lines on Django query patterns and error handling, were written by the tech lead 8 months ago. Two engineers who joined this month say Claude ignores them, and when they run /memory, no loaded file contains the conventions. On the tech lead's machine, /memory shows them in ~/.claude/CLAUDE.md. What is the fix?",
    "o": [
      "Have each new engineer copy them into their own ~/.claude/CLAUDE.md",
      "Have each new engineer save them in a CLAUDE.local.md in their checkout",
      "Turn the conventions into a skill in the tech lead's ~/.claude/skills/",
      "Move the conventions into the project's root CLAUDE.md and commit it"
    ],
    "a": 3,
    "why": "This is the classic diagnosis: team instructions were placed in one person's user-level file, which isn't shared through version control. Team × this project is the project CLAUDE.md, committed.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Fixes 2 people today. Each copy drifts from the others, and the next hire has the same problem."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Still one private copy per person, outside version control, so updates never reach the team."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Still in the tech lead's personal folder, and a skill runs on demand, while conventions should load in each session."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1 (/memory to verify loaded files); lesson 0019"
  },
  {
    "id": "F16",
    "ts": "3.1",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 4
    },
    "q": "The monorepo has 5 Django apps, each with its own CLAUDE.md, and 3 standards files: api.md, testing.md and celery.md. Each app's CLAUDE.md holds pasted copies of the 1 or 2 standards that apply to it, and after 4 months the copies differ from the originals in 9 places. Only the 2 apps that run background jobs need celery.md. What is the best way to organise this?",
    "o": [
      "Have each app's CLAUDE.md @import just the standards files that apply to it",
      "Paste the 3 standards into the root CLAUDE.md, under headings that name their apps",
      "Turn each standards file into a skill that engineers run when they start work in an app",
      "Keep the copies and add a CI check that fails when an app's copy differs from the original"
    ],
    "a": 0,
    "why": "@import lets each CLAUDE.md reference external files, so each app pulls in just the standards it needs from a single source. Nothing to copy, nothing to drift.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Loads all three for each app and relies on Claude inferring which heading applies, instead of each app loading only its own."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Standards should apply whenever Claude works in the app. A skill only applies when someone remembers to run it."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "Detects drift after it happens and keeps 5 copies to maintain. Importing one source removes the copies."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1"
  },
  {
    "id": "F17",
    "ts": "3.2",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3,
      "weight": "heavy",
      "scope": "shared"
    },
    "q": "Six engineers run the same weekly stock-reconciliation check by pasting a 40-line prompt from their own notes. The copies have drifted, and last week 2 engineers flagged discrepancies using different thresholds, 2% and 5%. The team wants one version that anyone can run on demand and that updates for all of them when it changes. What should they do?",
    "o": [
      "Have each engineer save the agreed prompt as a skill in their own ~/.claude/skills/ folder",
      "Add the agreed 40 lines to the root CLAUDE.md under a Reconciliation heading",
      "Make it a project skill in .claude/skills/, committed, with the agreed threshold",
      "Post the agreed prompt on the team wiki and ask everyone to paste it from there each week"
    ],
    "a": 2,
    "why": "A repeatable task that anyone triggers on demand, identical for all and updated in one place, is a project skill in .claude/skills/, committed. Pasting a prompt is lighter but is exactly what drifted; CLAUDE.md is for always-loaded standards.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Six personal copies again. A change has to be made six times, and they drift the same way the notes did."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "CLAUDE.md loads in each session, including the many that aren't reconciliations. A weekly task run on demand is a skill."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Relies on people pasting the current version. That's the habit that produced 2% and 5%."
      }
    },
    "cite": "Exam guide §3.2; notes/domain-3 §3.2; lesson 0021"
  },
  {
    "id": "F18",
    "ts": "3.2",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3,
      "scope": "personal"
    },
    "q": "An engineer has built a /standup skill that summarises their own commits and open pull requests from the last 24 hours. They work in 4 repositories and want it in all of them, and teammates have said they don't want it in the team's skill list. It currently sits uncommitted in one repository's .claude/skills/ folder. Where should it live?",
    "o": [
      "In .claude/skills/ in each of the 4 repositories, committed with a note that it is personal",
      "In ~/.claude/skills/standup/, their personal skills folder, for each of their projects",
      "In CLAUDE.local.md in each repository, as an instruction to summarise their recent work",
      "In ~/.claude/CLAUDE.md, as an instruction to summarise their recent work when asked"
    ],
    "a": 1,
    "why": "Me × all projects, for an on-demand task: a personal skill in ~/.claude/skills/. Project .claude/skills/ is the team's; CLAUDE.md files hold instructions, not skills.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Committed project skills are shared with each team. A note in the file doesn't keep it out of the team's skill list."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "CLAUDE.local.md holds instructions, not skills, and it needs a copy in each repository."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Right scope, wrong mechanism: an always-loaded instruction in each session for a task they invoke once a day."
      }
    },
    "cite": "Exam guide §3.2; notes/domain-3 §3.2; lesson 0019; reference/scope-map.html"
  },
  {
    "id": "F19",
    "ts": "3.2",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 1
    },
    "q": "The team's /backport skill cherry-picks a merged pull request onto a release branch and needs the PR number. In 31 of the last 100 runs engineers invoked it without a number, and the skill guessed the most recent merged PR, twice backporting the wrong change. SKILL.md already says 'If no PR number is given, ask for one', and the rate hasn't changed. What should you change?",
    "o": [
      "Add argument-hint: [pr-number] to the frontmatter, prompting for the number when it is missing",
      "Make the 'ask for a PR number' line in SKILL.md bold and move it to the top of the file",
      "Add allowed-tools to the frontmatter, limiting the skill to Read until a number is given",
      "Set context: fork in the skill's frontmatter to run it in its own isolated subagent"
    ],
    "a": 0,
    "why": "argument-hint in SKILL.md frontmatter prompts the developer for the required parameter when the skill is invoked without it. It's the built-in switch for this exact need.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "The same instruction, made louder. It already failed to change the rate."
      },
      "C": {
        "trap": "nonexistent-feature",
        "text": "allowed-tools restricts which tools the skill may use. It has no condition on arguments, and it can't prompt for a missing one."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "context: fork isolates the skill's output from the main conversation. It has nothing to do with missing arguments."
      }
    },
    "cite": "Exam guide §3.2; notes/domain-3 §3.2; lesson 0021"
  },
  {
    "id": "F20",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2,
      "weight": "heavy"
    },
    "q": "Email templates written in MJML live next to their senders in 18 packages, as files named *.email.mjml. Their conventions sit under a 'Templates' heading in the root CLAUDE.md that says to apply them only when editing templates, and Claude ignores them in about 1 template edit in 4. The heading was reworded last month to be firmer, with no change. What is the best fix?",
    "o": [
      "A .claude/rules/ file with paths set to **/*.email.mjml, holding the template conventions",
      "A CLAUDE.md in each of the 18 packages, each holding its own copy of the template conventions",
      "A firmer root CLAUDE.md heading that names each of the 18 packages holding templates",
      "A templates skill that engineers invoke before they start editing a template file"
    ],
    "a": 0,
    "why": "Conventions for one kind of file spread across many directories are what .claude/rules/ with a paths glob is for: the rule loads deterministically when Claude works on a matching file, and stays out of other sessions.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Directory files can't follow files spread across 18 packages without 18 copies, which drift and get missed in new packages."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Still relies on Claude inferring when a section applies. Firmer wording was already tried and didn't move the rate."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Depends on someone remembering to run it before each template edit, which a path rule does for them."
      }
    },
    "cite": "Exam guide §3.3; notes/domain-3 §3.3; lesson 0021"
  },
  {
    "id": "F21",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 3
    },
    "q": "A .claude/rules/seatmap.md file has its paths set to tests/seatmap/**/*.ts. The seat-map tests aren't in that folder: they sit next to their source as *.spec.ts files in 7 directories under packages/seatmap/. Claude hasn't applied the rule in any of the last 20 test edits. What should change?",
    "o": [
      "Move the rule's contents into a CLAUDE.md file in the tests/seatmap/ folder",
      "Import .claude/rules/seatmap.md from the root CLAUDE.md to load it each session",
      "Set the rule's paths to packages/seatmap/**/*.spec.ts, where the tests live",
      "Move the spec files from the 7 directories into tests/seatmap/ to match the glob"
    ],
    "a": 2,
    "why": "A path rule loads only when Claude works on a file matching its glob. The glob points at a folder with no tests, so it never matches. Pointing it at the co-located *.spec.ts files fixes the cause.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Moves the rules to the same folder the glob already points at, where no tests live."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Loads seat-map test rules into each session, including unrelated work, to fix a pattern that's simply wrong."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Restructures the codebase to suit a config line. The glob should describe where the files are."
      }
    },
    "cite": "Exam guide §3.3; notes/domain-3 §3.3"
  },
  {
    "id": "F22",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2,
      "weight": "light"
    },
    "q": "For a 1-day performance spike, a developer wants Claude to add timing logs around each database call in checkout/reserve.ts, and only in that file. They will try it in today's session only and then discard the changes, and from tomorrow they are back on normal work in that same file, where timing logs must not be added. A teammate suggests a .claude/rules/ file with paths set to checkout/reserve.ts. What is the best way to give Claude the instruction?",
    "o": [
      "Create .claude/rules/spike.md with paths set to reserve.ts, left uncommitted",
      "Say it in today's session prompt and name checkout/reserve.ts as the file",
      "Add it to their CLAUDE.local.md, then delete the line after the spike",
      "Create a /spike-timing skill in ~/.claude/skills/ and run it today"
    ],
    "a": 1,
    "why": "The instruction matters for one session and one file. Saying it in that session's prompt covers it completely. A rules file, CLAUDE.local.md or a skill is standing configuration that outlives the task, even when it stays personal or uncommitted, and tomorrow's normal work in the same file would pick it up unless someone remembers to delete it.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Standing config for a one-session task. It keeps loading in later sessions whenever reserve.ts is read, until someone remembers to delete it, and one git add puts it in front of the team."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Personal, but it loads in each of their sessions in this repo, for any file, until they remember to delete it. The task is one session."
      },
      "D": {
        "trap": "over-engineered",
        "text": "A reusable workflow, kept in their personal folder, for something that happens once and is thrown away."
      }
    },
    "cite": "Exam guide §3.3; notes/domain-3 §3.3; lesson 0020 (needed once → prompt, not a rules file)"
  },
  {
    "id": "F23",
    "ts": "3.4",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2,
      "weight": "heavy"
    },
    "q": "The team must replace the hand-written event bus used by 38 files across checkout, notifications and venue tools with the platform's message queue. There are 2 workable designs, an outbox table written in each transaction or publishing directly after commit, and they differ in how failures are retried. Nobody has chosen between them yet. How should you start in Claude Code?",
    "o": [
      "Direct execution in checkout first, then switch to plan mode if the change gets complex",
      "Direct execution on all 38 files using the outbox design, adding tests as each file changes",
      "The interview pattern on failure modes, then direct edits to the 38 files in one pass",
      "Plan mode: explore all 38 call sites, compare the 2 designs, and agree a plan before edits"
    ],
    "a": 3,
    "why": "Large changes with multiple valid approaches and an architectural decision across many files call for plan mode: explore and design before committing to edits, which avoids costly rework.",
    "wrong": {
      "A": {
        "trap": "reactive-too-late",
        "text": "The complexity is already stated: 38 files, 2 designs, no decision. Starting direct means rework once the design is chosen."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Picks one of two open designs without comparing them, then commits that choice to 38 files."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Interviewing helps surface considerations in an unfamiliar domain, but the open question here is an architectural choice across 38 files, which is what plan mode is for."
      }
    },
    "cite": "Exam guide §3.4; notes/domain-3 §3.4; lesson 0020"
  },
  {
    "id": "F24",
    "ts": "3.4",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 3,
      "weight": "light"
    },
    "q": "A stack trace shows formatSeatLabel in packages/seatmap/labels.ts throwing at line 1,812 when a seat has no row letter. The fix is to return the seat number alone when the row letter is missing, inside that one function. labels.ts is 2,600 lines long and is imported by 14 packages, and a teammate suggests plan mode because of its size. What is the best approach?",
    "o": [
      "Plan mode, to map how the 14 packages call formatSeatLabel before changing anything",
      "An Explore subagent to summarise labels.ts first, then the fix in the main session",
      "Plan mode for the fix, then a second plan for splitting labels.ts into smaller files",
      "Direct execution: fix formatSeatLabel and add a test for a seat with no row letter"
    ],
    "a": 3,
    "why": "A single-function fix with a clear stack trace is a simple, well-scoped change: direct execution. File size and how widely it's imported say how big the file is, not how big the change is. The test is where the care goes.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "The stem names one function, one line and the fix. How many packages import the file doesn't make a one-function guard complex."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Surveys 2,600 lines to make a change the stack trace already located."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Adds a refactor nobody asked for to a bug fix, and plans both."
      }
    },
    "cite": "Exam guide §3.4; notes/domain-3 §3.4; lesson 0020"
  },
  {
    "id": "F25",
    "ts": "3.4",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 1,
      "weight": "heavy"
    },
    "q": "Before planning the event-bus replacement, you need an inventory of how each of the 38 files publishes and handles events. In the first attempt, the discovery reads and Grep output filled about 70% of the context before planning started, and Claude then lost track of constraints agreed at the start. The planning phase still needs those 2 constraints. How should the discovery be done this time?",
    "o": [
      "Run the same discovery in the main session, then run /compact before the planning starts",
      "Delegate it to an Explore subagent that reads all 38 files and returns a short summary of each",
      "Read only the first 10 files in the main session and infer the pattern for the other 28",
      "Paste the agreed constraints into the root CLAUDE.md, then repeat the same discovery"
    ],
    "a": 1,
    "why": "An Explore subagent isolates verbose discovery output and returns a summary, preserving the main conversation's context for the planning phase. The stem says the discovery is genuinely large: 38 files and 70% of the context.",
    "wrong": {
      "A": {
        "trap": "reactive-too-late",
        "text": "Fills the context first and compresses afterwards, losing detail, which is how the constraints got lost last time."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Guesses at 28 files the plan depends on, and still puts the reading in the main context."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Commits a session's working notes to the team's file, and the discovery still floods the main context."
      }
    },
    "cite": "Exam guide §3.4; notes/domain-3 §3.4"
  },
  {
    "id": "F26",
    "ts": "3.5",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2
    },
    "q": "Claude is writing a function that turns an event's start time into the 'doors open' line on tickets. Your prose spec says doors open 45 minutes early, rounded to a friendly time, with midnight shown as 'midnight', and you know the exact line you want for each case. Across 3 attempts Claude read 'friendly' 3 different ways: nearest 5 minutes, nearest 15, and rounding down. What is the most effective next step?",
    "o": [
      "Rewrite the spec in more detail, defining a friendly time in 2 more paragraphs of prose",
      "Use the interview pattern, letting Claude ask you what friendly means before the next attempt",
      "Give 3 concrete examples, each a start time and the exact doors-open line it should produce",
      "Switch to plan mode and have Claude list the possible rounding rules before it codes"
    ],
    "a": 2,
    "why": "When prose is interpreted inconsistently, 2–3 concrete input/output examples are the most effective way to specify a transformation. They remove the ambiguity the word 'friendly' leaves.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Prose is what has been read 3 ways. More prose gives more to interpret."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Interviewing surfaces things you haven't thought of in an unfamiliar domain. You already know the exact output you want."
      },
      "D": {
        "trap": "over-engineered",
        "text": "A planning phase for a small transformation whose correct output you can simply show."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5; lesson 0013"
  },
  {
    "id": "F27",
    "ts": "3.5",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 1,
      "weight": "heavy"
    },
    "q": "Claude is fixing the rule that decides whether two seat holds collide. You have 9 known cases, including holds that touch at an aisle and holds across a section boundary. Over 5 rounds of chat feedback, each round fixed the case you mentioned and broke one that had worked before. What should you do next?",
    "o": [
      "Write a test suite covering all 9 cases and edge cases first, then share its failures each round",
      "Send one long message describing all 9 cases in prose and asking for a fix for all of them",
      "Go back to one case per round, listing the cases already fixed at the end of each message",
      "Start a new session and describe the collision rule from scratch in one fresh prompt"
    ],
    "a": 0,
    "why": "Fixes that keep breaking earlier cases are a regression problem. Test-driven iteration writes the expected behaviour and edge cases as tests first, then iterates on the failures, so every round is checked against all 9 cases.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Gives Claude the cases once, but nothing re-checks the earlier cases after each change, which is exactly where the regressions come from."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "The same round-by-round loop that has regressed 5 times, with a reminder list nothing runs."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "A clean context doesn't stop the next fix breaking an earlier case. There is still no check."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5"
  },
  {
    "id": "F28",
    "ts": "3.5",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 4
    },
    "q": "A review of the notifications package found 3 problems: a typo in the refund email's subject line, SMS sends that time out for numbers in 2 countries, and a calendar attachment that shows the wrong time zone. They are in different files, share no code or data, and fixing one hasn't affected another. How should you hand them to Claude?",
    "o": [
      "One detailed message covering the 3, saying how they connect",
      "Plan mode first, to design one change covering the 3 problems",
      "The SMS timeout first, then the other 2 together in one message",
      "One at a time, checking each fix before raising the next"
    ],
    "a": 3,
    "why": "Independent problems are fixed sequentially: each change stays small and easy to check, and if something breaks you know which fix did it. One detailed message is for problems whose fixes interact.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The stem says they don't connect. Bundling independent problems gives up small, checkable steps."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Three small unrelated fixes don't need a shared design."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Pairs two problems that share nothing, for no reason in the stem."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5; lesson 0018"
  },
  {
    "id": "F29",
    "ts": "3.6",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 4
    },
    "q": "A nightly GitHub Actions job runs claude 'update the changelog from merged PRs' and has hit the 6-hour job timeout on 4 of the last 5 nights. The logs show Claude's opening output and then nothing until the runner kills the job. The same command finishes in 2 minutes when a developer runs it at their desk. What is the fix?",
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
  {
    "id": "F30",
    "ts": "3.6",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 2,
      "weight": "heavy"
    },
    "q": "A CI job asks Claude to fix failing tests and then, in the same session, to review its own diff before the PR opens. Over 50 runs the review step approved each diff, while human reviewers later found 11 real problems in those PRs. The review prompt already asks Claude to be critical and to list at least 3 risks. What change would most improve the review?",
    "o": [
      "Make the review prompt stricter, requiring 5 risks and a severity rating for each of them",
      "Run the review as a separate claude -p instance that sees only the diff and the tests",
      "Ask the same session to review the diff twice and report only issues found both times",
      "Add a CLAUDE.md section listing the review criteria the session should apply"
    ],
    "a": 1,
    "why": "A session that generated code keeps its reasoning context and is unlikely to question its own decisions. An independent instance without the generation context reviews the diff on its own merits.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "A stricter prompt was already in place. The reviewer still carries the reasoning that produced the diff."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Two passes by the same context repeat the same blind spots, and requiring agreement filters out more findings."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Criteria help, but the reviewer is still the session that wrote the fix and won't question its own decisions."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6"
  }
];

module.exports = { META, Q };
