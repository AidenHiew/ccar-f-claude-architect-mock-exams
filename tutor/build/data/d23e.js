// tutor/build/data/d23e.js — Domains 2 and 3 Paper 5 (built 2026-10-21): 23 original questions in 3 scenario blocks (11/8/4).
// Allocation in statements.js (d23e): exam proportion (D2 11 / D3 12), not weighted toward weak rows.
// bp.weight / bp.scope / bp.trigger as in d23b.
// Facts only from reference/ccar-f-official-exam-guide.md, notes/, lessons/. bp.rank = measured length rank of the key. Single-answer only.
'use strict';

const META = {
  "key": "d23e",
  "title": "CCA-F Domains 2 and 3 Paper 5",
  "eyebrow": "Domains 2 and 3 · 23 questions · 3 scenarios",
  "intro": "Twenty-three new exam-level questions on Domains 2 and 3, in three scenario blocks, in the exam's proportions. Every question has one correct answer. Flag questions to return to them before you submit. Labels stay hidden until grading. Sit it once, in exam mode, with the 46-minute timer on.",
  "defaultMode": "exam",
  "timerDefault": true,
  "minutes": 46,
  "storageKey": "ccaf-d23-paper5",
  "blocks": [
    {
      "id": 1,
      "title": "Developer Productivity with Claude",
      "intro": "Your team of 16 engineers maintains a ferry operator's booking system: a 9-year-old Elixir Phoenix codebase of about 2,300 files on Postgres. You also run an internal developer agent on the Claude Agent SDK, with MCP servers for the code, application logs, incidents and deploys, and you own the shared Claude Code setup."
    },
    {
      "id": 2,
      "title": "Code Generation with Claude Code",
      "intro": "Your team of 11 developers uses Claude Code on a water utility's smart-metering platform: Kotlin services that collect meter readings, an Angular customer portal and SQL migrations, about 1,700 files in one repository. You own the Claude Code setup, from CLAUDE.md files and rules to skills."
    },
    {
      "id": 3,
      "title": "Claude Code for CI",
      "intro": "Your team runs a podcast-hosting platform: a Node.js API and Python transcoding workers, about 1,200 files. Developers use Claude Code day to day, and a Claude Code job in CI reviews every pull request."
    }
  ]
};

const Q = [
  {
    "id": "J01",
    "ts": "2.1",
    "s": "dp",
    "block": 1,
    "bp": {
      "rank": 1
    },
    "q": "The developer agent has get_deploy_log, described as returning the build and deploy output for one release, and search_incidents, described as searching production incident reports by service and date. Both descriptions were rewritten last month with example queries and a line on when to use the other tool, and misrouting barely moved, from 27% to 25% of sessions about a production failure. The system prompt holds 14 lines of guidance, one added in March: 'For anything about a failure, start from the release that shipped it.' In those sessions the agent reads deploy logs and never searches incidents. What should you change first?",
    "o": [
      "Add input_examples of failure questions to search_incidents",
      "Merge the 2 tools into one get_failure_context tool",
      "Force search_incidents with tool_choice on failure questions",
      "Reword the March line about starting from a failure's release"
    ],
    "a": 3,
    "why": "Keyword-sensitive wording in a system prompt can override well-written tool descriptions. The descriptions were already improved and barely moved the rate. The March line ties every failure question to the release, which is what get_deploy_log returns. Rewording that line fixes the cause.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The descriptions already gained examples, and the rate barely moved. More examples still compete with a system prompt line that points the other way."
      },
      "B": {
        "trap": "over-engineered",
        "text": "They are different data sources. Merging them hides the conflict instead of removing the line behind it."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Detecting failure questions in code to force one tool, when the cause is one line of the system prompt. Some failure questions do need deploy logs."
      }
    },
    "cite": "Exam guide §2.1; notes/domain-2 §2.1"
  },
  {
    "id": "J02",
    "ts": "2.1",
    "s": "dp",
    "block": 1,
    "bp": {
      "rank": 1
    },
    "q": "Your MCP server offers one tool, run_query, described as 'Runs a query'. Engineers use it for 3 jobs, each with different input: SQL against the booking database, a search string for 18 months of application logs, and a metric name with a time window for the metrics store. In a week of 400 calls, 52 went to the wrong backend, most of them log searches written as SQL. What should you do?",
    "o": [
      "Split it into 3 tools, each with its own inputs and description",
      "Add a system prompt rule that log searches don't use SQL syntax",
      "Return isError when SQL arrives at the log store, with a hint",
      "Put a worked example of each query type in the system prompt"
    ],
    "a": 0,
    "why": "One generic tool covering 3 jobs with 3 different input shapes cannot say clearly what it expects. Splitting it into purpose-specific tools, each with a defined input and a description of when to use it, removes the overlap the model is guessing across.",
    "wrong": {
      "B": {
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
  {
    "id": "J03",
    "ts": "2.2",
    "s": "dp",
    "block": 1,
    "bp": {
      "rank": 4
    },
    "q": "search_incidents returns an empty list both when no incident matches and when the incident database times out. During a 2-hour database outage last week, the agent told engineers 'no open incidents' 17 times, while 40 incidents were open. What should the tool return when the database times out?",
    "o": [
      "An empty list with a note field saying the results may be partial",
      "isError with errorCategory 'validation' and isRetryable false",
      "isError with errorCategory 'transient' and isRetryable true",
      "An empty list, plus a prompt rule to double-check empty results"
    ],
    "a": 2,
    "why": "A timeout is an access failure, not a valid empty result. isError with a transient category and isRetryable true tells the agent the query didn't run and can be retried, instead of reporting that nothing is open.",
    "wrong": {
      "A": {
        "trap": "error-suppression",
        "text": "Still looks like a successful search. The agent has to notice a side field to learn that nothing was searched."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "The input was fine. Validation and not retryable tell the agent to stop, when a retry after a timeout may work."
      },
      "D": {
        "trap": "probabilistic",
        "text": "The tool keeps hiding the failure, and checking again can't tell a real empty result from a timeout."
      }
    },
    "cite": "Exam guide §2.2; notes/domain-2 §2.2"
  },
  {
    "id": "J04",
    "ts": "2.2",
    "s": "dp",
    "block": 1,
    "bp": {
      "rank": 1
    },
    "q": "The coordinator sends a log-search subagent to collect errors from 6 services. When 1 service's log store is briefly unavailable, the subagent returns 'Search failed' for the whole task, and the coordinator reruns all 6 searches. About 1 task in 10 hits this, and the outage usually clears within a minute. What should the subagent do?",
    "o": [
      "Mark the whole task isError, with errorCategory 'transient'",
      "Retry locally, then return the 5 results and what still failed",
      "Have the coordinator rerun the whole task up to 3 times",
      "Skip the failed service and report the 5 results as complete"
    ],
    "a": 1,
    "why": "Transient failures are best retried where they happen. If the service is still down after that, the subagent passes up the 5 results it has, plus what it tried and what failed, and the coordinator decides about 1 service, not 6.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Better metadata, but it still throws away 5 good results and pushes a local retry up to the coordinator."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Reruns 5 searches that already worked, each time 1 service blips."
      },
      "D": {
        "trap": "error-suppression",
        "text": "Hides a gap. The coordinator would treat incomplete results as complete."
      }
    },
    "cite": "Exam guide §2.2; notes/domain-2 §2.2"
  },
  {
    "id": "J05",
    "ts": "2.3",
    "s": "dp",
    "block": 1,
    "bp": {
      "rank": 4,
      "weight": "light"
    },
    "q": "The review agent was given all 21 tools from the team's 4 MCP servers. Its job is reviewing pull requests, which needs 4 of them: read the diff, read files, search code and post a comment. In 200 review sessions it called deploy or incident tools 25 times, and once restarted a staging service mid-review. What is the best change?",
    "o": [
      "Give the review agent only the 4 tools its job needs",
      "Add a system prompt line that reviews don't use deploy tools",
      "Add a hook that blocks the restart tool during reviews",
      "Rewrite all 21 descriptions with when-to-use guidance"
    ],
    "a": 0,
    "why": "Too many tools, most of them outside the agent's role, degrade selection and invite misuse. Scoping the agent to the 4 tools its role needs takes the wrong choices away.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Asks the agent not to use tools it still has. 17 out-of-role tools stay in front of it."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Blocks the worst call, but the other 24 stray deploy and incident calls still happen."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Better descriptions for 17 tools the agent shouldn't have at all."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3"
  },
  {
    "id": "J06",
    "ts": "2.3",
    "s": "dp",
    "block": 1,
    "bp": {
      "rank": 1
    },
    "q": "Every triage run must start by loading the incident record with get_incident, because the later steps (search logs, check deploys, write a summary) need its service name and time window. With tool_choice set to 'auto', 14% of runs began with a log search on a guessed service name. What should the first request use?",
    "o": [
      "tool_choice 'any' on the first request and each turn after it",
      "A system prompt line asking it to call get_incident first",
      "tool_choice forced to get_incident on each turn of the run",
      "tool_choice forced to get_incident, then 'auto' for later turns"
    ],
    "a": 3,
    "why": "Forced tool selection guarantees the first call is get_incident. The later steps then run in follow-up turns with 'auto', where the agent can pick the next tool or write the summary.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "'any' guarantees some tool call, not which one. The guessed log search is still allowed."
      },
      "B": {
        "trap": "probabilistic",
        "text": "Makes the right first call more likely. With 'auto' it can still start with a guess."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Forcing it on every turn calls get_incident again and again. The run could never search logs or write the summary."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3"
  },
  {
    "id": "J07",
    "ts": "2.4",
    "s": "dp",
    "block": 1,
    "bp": {
      "rank": 3,
      "scope": "shared"
    },
    "q": "Yesterday the team committed a schedules server to the project's .mcp.json. 15 of the 16 engineers now see its tools. The 16th says Claude keeps answering sailing-time questions from old docs, and in their terminal claude mcp list shows schedules as ⏸ Pending approval (run `claude` to approve). What should they do first?",
    "o": [
      "Add schedules again with claude mcp add --scope project",
      "Run claude in the repo and approve the schedules server",
      "Add a CLAUDE.local.md line telling Claude to use schedules",
      "Run claude mcp get schedules to see why it failed to connect"
    ],
    "a": 1,
    "why": "Pending approval means the entry is already there and Claude Code is waiting for this person's yes: it asks each person before it uses a server from a project's .mcp.json. The status line names the step. Running claude in the project shows the approval question.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The entry is already in the committed .mcp.json. Adding it again doesn't give the approval that's missing."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "An instruction can't connect a server. Until the server is approved, its tools aren't there to use."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "It hasn't failed to connect. claude mcp list already says what's needed: approval."
      }
    },
    "cite": "Lesson 26 §4 (claude mcp list statuses; ⏸ Pending approval; run claude in the project to approve); exam guide §2.4"
  },
  {
    "id": "J08",
    "ts": "2.4",
    "s": "dp",
    "block": 1,
    "bp": {
      "rank": 2,
      "scope": "personal"
    },
    "q": "The committed .mcp.json defines a server named incidents that points at the production incident API. One engineer wants their sessions in this repository to use the read-only replica instead, while their 3 other projects and the rest of the team keep production. Last week they added 'Use the incidents replica, not production' to their CLAUDE.local.md, and 9 of their 10 sessions since still called production. What should they do?",
    "o": [
      "Move the line into the root CLAUDE.md under an incidents heading",
      "Add their own incidents server at user scope for the replica",
      "Add their own incidents server at local scope for the replica",
      "Repeat the line near the top of CLAUDE.local.md, in capitals"
    ],
    "a": 2,
    "why": "Which server Claude connects to is set by server entries, not by instructions. A same-named incidents server at local scope beats the project entry, for this person in this project only, and the whole local entry is used.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Still an instruction, now shown to the whole team. It can't change the connection."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "User scope reaches all their projects, and project scope beats user scope, which leaves the team entry winning here."
      },
      "D": {
        "trap": "probabilistic",
        "text": "A louder instruction is still an instruction. The connection stays on production."
      }
    },
    "cite": "Lesson 26 §1–2 (scopes; same-name precedence local > project > user; whole entry used; a server entry, never a CLAUDE.md line, changes the connection); exam guide §2.4"
  },
  {
    "id": "J09",
    "ts": "2.4",
    "s": "dp",
    "block": 1,
    "bp": {
      "rank": 2,
      "scope": "personal"
    },
    "q": "An engineer wrote an experimental MCP server that searches their own design notes, started with node ~/tools/notes-server.js. They want it in all 5 of their projects, and none of their 15 teammates should see it. Which command should they run?",
    "o": [
      "claude mcp add --scope user notes -- node ~/tools/notes-server.js",
      "claude mcp add notes -- node ~/tools/notes-server.js",
      "claude mcp add --scope project notes -- node ~/tools/notes-server.js",
      "A notes entry in a ~/.mcp.json file in their home folder"
    ],
    "a": 0,
    "why": "User scope is for personal or experimental servers across all of a person's projects, saved in ~/.claude.json. With no --scope the server is local: this person, this project only. --scope project writes it into the committed .mcp.json for the whole team.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "No --scope means local scope: only this project, not all 5."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Writes it into this project's committed .mcp.json: every teammate gets it, and the other 4 projects don't."
      },
      "D": {
        "trap": "nonexistent-feature",
        "text": "There is no ~/.mcp.json. Servers are saved in .mcp.json at a project root (project scope) or in ~/.claude.json (local and user scope)."
      }
    },
    "cite": "Exam guide §2.4; lesson 26 §1 (scope table) and §5; notes/domain-2 §2.4"
  },
  {
    "id": "J10",
    "ts": "2.5",
    "s": "dp",
    "block": 1,
    "bp": {
      "rank": 1
    },
    "q": "lib/pay.ex wraps the payments library and re-exports its functions under new names chosen by the booking team. An engineer asks the agent to find every place in the 2,300 files that takes, refunds or holds a payment through the wrapper. The agent grepped for the library's original function names and found 4 matches, all inside lib/pay.ex. What should it do next?",
    "o": [
      "Grep for the payments library's module name across the files",
      "Glob for files with pay in their names, then Read each one",
      "Read all 2,300 files in turn and note each payment call",
      "Read the wrapper to list its exported names, then Grep for each"
    ],
    "a": 3,
    "why": "Callers use the wrapper's names, not the library's: the first search found matches only inside the wrapper. Listing every name the wrapper exports, then searching for each across the codebase, finds the callers.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Callers go through the wrapper. The library's name turns up where the wrapper uses it, not at the call sites."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "File names don't say which code calls the wrapper. Callers can be in any file."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Reads 2,300 files when 2 targeted steps find the callers."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5"
  },
  {
    "id": "J11",
    "ts": "2.5",
    "s": "dp",
    "block": 1,
    "bp": {
      "rank": 1
    },
    "q": "An engineer wants every migration that changed the sailings table. The 300 files in priv/repo/migrations/ have timestamp names such as 20240311_add_column.exs, and none of the names mention a table. Each migration names its table in the body, as in alter table(:sailings). Which approach fits best?",
    "o": [
      "Glob for priv/repo/migrations/*sailings*.exs to list them",
      "Grep for :sailings in priv/repo/migrations/ to list the files",
      "Read the 300 migration files in turn and note each match",
      "Bash with git log on the migrations folder for the past year"
    ],
    "a": 1,
    "why": "The table name is in the file contents, not in the file names. Grep searches contents and lists the files that match.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Glob matches file names, and none of the names mention a table. It finds nothing."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Reads 300 files to do what one content search does."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Lists commits by date, not which files change the sailings table."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5"
  },
  {
    "id": "J12",
    "ts": "3.1",
    "s": "cc",
    "block": 2,
    "bp": {
      "rank": 4,
      "scope": "shared",
      "trigger": "session"
    },
    "q": "Six months ago a senior developer wrote the team's 30-line Kotlin error-handling guide into their own ~/.claude/CLAUDE.md. The 4 developers who joined since get code that ignores it, while the senior's sessions follow it. /memory in a new developer's session shows the project CLAUDE.md loaded and no guide. What should the team do?",
    "o": [
      "Have each new developer copy the guide into ~/.claude/CLAUDE.md",
      "Put the guide in a CLAUDE.local.md at the repository root",
      "Move the guide into the project CLAUDE.md and commit it",
      "Add @~/.claude/CLAUDE.md to the project CLAUDE.md as an import"
    ],
    "a": 2,
    "why": "A user-level CLAUDE.md applies only to that user and isn't shared through git. Team standards belong in the project CLAUDE.md, committed, where every developer's sessions load it at launch.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Works until the guide changes. Then 5 personal copies drift apart."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "CLAUDE.local.md is personal and kept out of git. New developers still wouldn't get it."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "~ is each person's own home folder, and the new developers' files don't contain the guide."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1"
  },
  {
    "id": "J13",
    "ts": "3.1",
    "s": "cc",
    "block": 2,
    "bp": {
      "rank": 2,
      "scope": "shared"
    },
    "q": "The project CLAUDE.md says 'Do not read files in secrets/', a folder of 6 credential files used by local test setup. In 2 of the last 300 sessions, Claude still read secrets/billing.env while debugging a failed test. The team wants reading that folder blocked in all developers' sessions. What should they change?",
    "o": [
      "Add a permission deny rule for secrets/ to the shared settings",
      "Move the line to the top of CLAUDE.md and mark it as critical",
      "Add the line to each developer's own CLAUDE.local.md as well",
      "A .claude/rules/ file with the line, with paths set to secrets/**"
    ],
    "a": 0,
    "why": "CLAUDE.md is guidance, and compliance isn't guaranteed. A deny rule in settings is enforced by the permission system whatever the model decides. An instruction file can't change what Claude is allowed to do.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "Louder guidance is still guidance. Some sessions will still read the file."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Another copy of the same instruction, in personal files the team can't check."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "The rule loads when a matching file is read, after Claude has opened it, and it is still only guidance."
      }
    },
    "cite": "notes/domain-3 §3.1 (CLAUDE.md is guidance, not enforcement; deny rules evaluated deterministically) and its traps table (security boundary → permission deny rules); notes/docs-delta §3.1 (path rules load when a matching file is read)"
  },
  {
    "id": "J14",
    "ts": "3.2",
    "s": "cc",
    "block": 2,
    "bp": {
      "rank": 2,
      "scope": "shared",
      "trigger": "demand"
    },
    "q": "About twice a month, when the billing team asks, a developer regenerates the tariff tables: a 12-step procedure that reads the new tariff spreadsheet, writes a migration and updates 3 test fixtures. Each time it is for a different tariff year, such as 2027. Today the procedure is a 90-line section of the project CLAUDE.md, loaded in sessions that never touch tariffs. Any of the 11 developers may be asked. Where should it live?",
    "o": [
      "A .claude/rules/ file with paths set to the tariff folders",
      "A project skill that takes the tariff year as $ARGUMENTS",
      "The CLAUDE.md section, with the tariff year as a heading",
      "A skill in that developer's own ~/.claude/skills/ folder"
    ],
    "a": 1,
    "why": "A person decides when this runs, which makes it a project skill (or command): committed for all 11, loaded only when invoked, with the year typed after the command and passed in through $ARGUMENTS. CLAUDE.md and rules files are for standards that load on their own.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Loads when tariff files are read, not when the billing team asks. The procedure starts from a spreadsheet, before any tariff file is open."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Keeps 90 lines loaded in every session, and the year still has to be edited in each time."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Personal: the other 10 developers don't have it."
      }
    },
    "cite": "Exam guide §3.2; notes/docs-delta §3.2 ($ARGUMENTS)"
  },
  {
    "id": "J15",
    "ts": "3.2",
    "s": "cc",
    "block": 2,
    "bp": {
      "rank": 4,
      "scope": "personal",
      "trigger": "prompt"
    },
    "q": "This morning one developer must reproduce a meter-reading bug against yesterday's database snapshot, which means adding --profile snapshot to each of about 40 Gradle runs in this session. Nobody else needs it. The snapshot is deleted at 18:00 today, and from then on --profile snapshot makes each Gradle run fail. A teammate suggests a project skill for it. Where should the instruction go?",
    "o": [
      "A project skill, /snapshot-run, taking the profile as $ARGUMENTS",
      "A line in CLAUDE.local.md at the repository root, for them only",
      "A personal skill in their own ~/.claude/skills/ folder",
      "In the prompt at the start of this morning's session"
    ],
    "a": 3,
    "why": "A one-off instruction for one person and one session belongs in the prompt. It ends with the session, which is what is wanted when the profile breaks Gradle from 18:00.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Commits a workflow the whole team gets, for a task that ends today."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Loads in all their sessions in this repo until someone deletes it. After 18:00 it makes each of their Gradle runs fail."
      },
      "C": {
        "trap": "over-engineered",
        "text": "A saved workflow that outlives the task, and they still have to remember to run it in this session."
      }
    },
    "cite": "Exam guide §3.2; lesson 23 (when it fires: this prompt only)"
  },
  {
    "id": "J16",
    "ts": "3.3",
    "s": "cc",
    "block": 2,
    "bp": {
      "rank": 4,
      "trigger": "file"
    },
    "q": "Integration tests sit next to the code in 23 folders, and all of them end in IT.kt, such as MeterReadIT.kt. Their conventions (Testcontainers setup, no mocks of the database) are copied into a CLAUDE.md in 4 of those folders, and 2 of the copies now differ. About 80% of sessions never touch an integration test. Where should the conventions live?",
    "o": [
      "A CLAUDE.md in all 23 folders, generated from one source file",
      "One section of the root CLAUDE.md, headed Integration tests",
      "One .claude/rules/ file with paths set to **/*IT.kt",
      "One .claude/rules/ file with no paths, loaded at launch"
    ],
    "a": 2,
    "why": "A rule with a paths glob loads only when Claude reads a matching file, wherever it sits. One file covers all 23 folders and any new ones, and stays out of the 80% of sessions with no integration tests.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "23 files and a generator to do what one glob does."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Loads in every session, including the 80% that never need it, and relies on the model to see when the section applies."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "A rule with no paths loads at launch in every session, the cost the team wants to avoid."
      }
    },
    "cite": "Exam guide §3.3; notes/docs-delta §3.1 (rules without paths load at launch)"
  },
  {
    "id": "J17",
    "ts": "3.3",
    "s": "cc",
    "block": 2,
    "bp": {
      "rank": 4,
      "trigger": "file"
    },
    "q": "The rule file .claude/rules/sql-style.md has no frontmatter. A developer meant it to load only for the SQL migrations, which sit in a db/ folder inside each of the 9 Kotlin modules. /memory shows it loaded in every session, including the 70% that never touch SQL. What should they change?",
    "o": [
      "Add paths: **/db/**/*.sql to the rule file's frontmatter",
      "Move it into a CLAUDE.md inside each of the 9 db/ folders",
      "Add 'Apply this only to SQL files' to the top of the rule",
      "Move the rule file into ~/.claude/rules/ on their machine"
    ],
    "a": 0,
    "why": "A rules file with no paths loads at launch, like the project CLAUDE.md. A paths glob makes it load only when Claude reads a matching file, across all 9 modules.",
    "wrong": {
      "B": {
        "trap": "over-engineered",
        "text": "9 copies of one rule, which will drift. One glob covers all the modules."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The rule still loads in every session. The line only asks the model to ignore it."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Makes it personal, and it still loads in every one of their sessions."
      }
    },
    "cite": "notes/docs-delta §3.1 (rules without paths load at launch; with paths, when a matching file is read; ~/.claude/rules/); exam guide §3.3"
  },
  {
    "id": "J18",
    "ts": "3.4",
    "s": "cc",
    "block": 2,
    "bp": {
      "rank": 3,
      "weight": "light"
    },
    "q": "Yesterday a developer and the billing lead agreed a plan in plan mode for moving 52 files across 8 services to the new meter vendor's SDK, with the mapping for each reading type written out. Nothing has been edited yet, and no open questions remain. Today the developer will make the changes. How should they run today's work?",
    "o": [
      "Plan mode again, re-exploring the 52 files before editing",
      "Direct execution of the agreed plan, a service at a time",
      "An Explore subagent that re-reads all 8 services first",
      "Plan mode for each service, approving a fresh plan each time"
    ],
    "a": 1,
    "why": "Plan mode is for investigation and design, and the plan is already agreed. Plan mode for planning, then direct execution of the planned implementation, is the intended pattern.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Repeats the investigation that produced the agreed plan."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Discovery is done. More exploration adds nothing to an agreed plan."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Re-plans 8 times what was planned once."
      }
    },
    "cite": "Exam guide §3.4; notes/domain-3 §3.4"
  },
  {
    "id": "J19",
    "ts": "3.4",
    "s": "cc",
    "block": 2,
    "bp": {
      "rank": 2,
      "weight": "heavy"
    },
    "q": "Billing wants meter readings in the customer portal within 1 minute instead of after the nightly batch. Last week the developer spiked a 40-line version that polls the database every 30 seconds; the tech lead would rather reuse the message broker the alerts service runs, and ops hasn't said which it will support. The change reaches the ingest service, the portal API and the deploy config. How should the developer start?",
    "o": [
      "Direct execution of the 40-line polling spike, the smaller one",
      "Direct execution on the ingest service, then decide the rest",
      "An Explore subagent to read the services, then direct edits",
      "Plan mode, comparing polling and the broker before any edits"
    ],
    "a": 3,
    "why": "Polling and the broker are 2 valid approaches with different infrastructure, nobody has chosen, and the change spans 3 parts of the system. That is the case plan mode is for: explore and choose before committing to changes.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The spike makes polling feel done, but nobody has chosen it. If the broker wins, the polling work is rework."
      },
      "B": {
        "trap": "reactive-too-late",
        "text": "Starts editing before the approach is chosen. The first service's changes may not fit the one picked."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Exploring helps, but going straight to edits still skips choosing between polling and the broker."
      }
    },
    "cite": "Exam guide §3.4; notes/domain-3 §3.4"
  },
  {
    "id": "J20",
    "ts": "3.5",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 1,
      "weight": "heavy"
    },
    "q": "A developer found 3 problems in the transcoding worker: the bitrate setting is read after the encoder starts, the output path is built from that bitrate, and the upload step names files from the same path. Last week they asked Claude to fix the bitrate problem on its own, and uploads then failed with missing files. All 3 are now open. How should they raise them?",
    "o": [
      "One at a time again, checking each fix before the next",
      "In 3 parallel sessions, one problem in each session",
      "All 3 in one detailed message that says how they connect",
      "Ask Claude to interview them about the worker's design"
    ],
    "a": 2,
    "why": "Interacting problems belong in one detailed message, where the fix can account for how they depend on each other. Here the path depends on the bitrate and the upload on the path, and fixing one alone already broke the upload.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Already tried for the bitrate, and uploads broke. With linked problems, a separate fix shifts what the next one needs."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Separate sessions can't see each other's fixes. The 3 changes would conflict."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "The developer already knows the problems. The interview pattern surfaces considerations nobody has thought of yet."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5"
  },
  {
    "id": "J21",
    "ts": "3.5",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 2
    },
    "q": "A developer has been asked to add a cache in front of the RSS feed API, which serves about 40,000 podcast apps. They have never built a cache, and don't know how quickly a cached feed must change after a new episode is published, or what should happen when the cache is down. What should they do before Claude writes any code?",
    "o": [
      "Ask Claude to interview them about the feed's needs first",
      "Ask for the cache in one long and detailed prose request",
      "Have Claude build the cache, then review how it refreshes",
      "Write 3 example feeds with the exact cached output of each"
    ],
    "a": 0,
    "why": "In an unfamiliar domain, the interview pattern has Claude ask the developer questions that surface things like invalidation and failure modes before anything is built.",
    "wrong": {
      "B": {
        "trap": "probabilistic",
        "text": "More detail on what they already know can't cover what they haven't thought of."
      },
      "C": {
        "trap": "reactive-too-late",
        "text": "Finds the design gaps after the code is written."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Examples pin down a transformation. The open questions are about refreshing and failure, which 3 sample feeds don't answer."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5"
  },
  {
    "id": "J22",
    "ts": "3.6",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 3
    },
    "q": "The CI review job runs claude -p on each push to a pull request. On one PR with 4 pushes it posted the same 6 findings each time, 24 comments in all, though nobody had changed the lines involved. Developers have started muting the bot. What should change?",
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
  {
    "id": "J23",
    "ts": "3.6",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 2
    },
    "q": "The CI review job asks claude -p for findings in prose and parses them with regular expressions to post inline comments. In 1 run in 7 the wording drifts, and comments land on the wrong line or are dropped. The prompt already describes the exact text format to use. What should change?",
    "o": [
      "A stricter prompt with 3 examples of the exact text format",
      "--output-format json with --json-schema for the findings",
      "--output-format stream-json to show progress in the log",
      "A retry of the run whenever the regular expression fails"
    ],
    "a": 1,
    "why": "--output-format json with --json-schema returns machine-parseable findings that match a schema, which the script can post as inline comments without parsing prose.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The prompt already describes the format. More instruction still leaves prose to parse."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Streams progress events. The findings are still prose."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Pays for whole re-runs, and drift that doesn't trip the regex still gets through."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6"
  }
];

module.exports = { META, Q };
