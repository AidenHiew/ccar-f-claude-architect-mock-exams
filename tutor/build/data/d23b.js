// tutor/build/data/d23b.js — Domains 2 and 3 Paper 2 (sit 2026-10-22): 30 original questions in 3 scenario blocks (6/12/12).
// Allocation in statements.js (d23b): weighted to the grid after the d23 result (LR-0031). Targets: the personal-location map,
// "when does it fire?" (bp.trigger = the key's trigger: session | file | demand | prompt), two-constraint stems, git history.
// bp.weight / bp.scope as in d23. Facts only from reference/ccar-f-official-exam-guide.md, notes/, lessons/.
// bp.rank = measured length rank of the key (1 longest). Single-answer only.
'use strict';

const META = {
  "key": "d23b",
  "title": "CCA-F Domains 2 and 3 Paper 2",
  "eyebrow": "Domains 2 and 3 · 30 questions · 3 scenarios",
  "intro": "Thirty new exam-level questions on Domains 2 and 3, in three scenario blocks. Every question has one correct answer. Flag questions to return to them before you submit. Labels stay hidden until grading. Sit it once, in exam mode, with the 60-minute timer on.",
  "defaultMode": "exam",
  "timerDefault": true,
  "minutes": 60,
  "storageKey": "ccaf-d23-paper2-attempt2",
  "blocks": [
    {
      "id": 1,
      "title": "Structured Data Extraction",
      "intro": "You are building a claims-intake system for a pet-insurance company on the Claude Agent SDK. Claude extracts structured fields from vet invoices, treatment notes and policy schedules, and the pipeline calls MCP tools to look up policies, check cover and file each claim."
    },
    {
      "id": 2,
      "title": "Developer Productivity with Claude",
      "intro": "Your team of 18 engineers maintains the payroll system for an accounting firm: a 10-year-old Java Spring Boot codebase of about 2,600 files on Postgres. You own the shared Claude Code setup and the internal agent tooling, from CLAUDE.md files and skills to MCP servers."
    },
    {
      "id": 3,
      "title": "Code Generation with Claude Code",
      "intro": "Your team uses Claude Code on a Python monorepo for a grocery chain's demand forecasting: Airflow DAGs, dbt models, a FastAPI service and shared libraries, about 1,800 files. You own the Claude Code setup, from CLAUDE.md files and rules to skills and the Claude Code jobs in CI."
    }
  ]
};

const Q = [
  {
    "id": "P01",
    "ts": "2.1",
    "s": "de",
    "block": 1,
    "bp": {
      "rank": 1,
      "weight": "light"
    },
    "q": "The claims agent has get_policy, described as 'Gets a policy', and find_pet, described as 'Finds a pet record'. get_policy takes a policy number such as PP-204-118, while find_pet takes a 15-digit microchip number and returns the pet with its policy number. Many vet invoices show only the microchip number, and in 12% of claims the agent passes it to get_policy, gets 'not found' and marks the claim as uninsured. What should you change first?",
    "o": [
      "Expand both descriptions with what each tool returns, plus 2 sample outputs from each of the tools",
      "Add 4 few-shot examples to the system prompt pairing invoice ID formats with the right tool",
      "Expand both descriptions with each input format, a sample value, and when to use the other tool first",
      "Have get_policy return 'not found' as an isError result, not as an ordinary empty result"
    ],
    "a": 2,
    "why": "Tool descriptions are the main input the model uses to choose a tool. Neither description says what kind of number its tool takes, so the agent has no reason to look the pet up first. Stating each input format, an example value and when to use the other tool fixes the cause at the lowest cost. Describing outputs alone leaves the input confusion in place.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Right tool, wrong content. The confusion is over which number each tool takes, and output samples don't say that."
      },
      "B": {
        "trap": "probabilistic",
        "text": "Examples nudge the choice but leave both descriptions silent on input formats, which is what the model reads when it picks a tool."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "A clearer error doesn't change which tool gets picked. The agent still sends microchip numbers to get_policy."
      }
    },
    "cite": "Exam guide §2.1; notes/domain-2 §2.1 (expand descriptions with input formats, examples, boundaries); lesson 0009"
  },
  {
    "id": "P02",
    "ts": "2.1",
    "s": "de",
    "block": 1,
    "bp": {
      "rank": 3,
      "weight": "light"
    },
    "q": "Last month you rewrote the descriptions of check_exclusions and check_waiting_period with their inputs, outputs and when to use each. Questions about excluded conditions now route correctly, but 17% of claims for an illness first seen within 14 days of the policy start still go to check_exclusions. The system prompt, written before the rewrite, says 'For any new condition, check exclusions first.' What is the most likely cause, and the fix?",
    "o": [
      "The prompt line ties new conditions to check_exclusions; remove it and let the descriptions decide",
      "The descriptions are still too short; add worked examples of claims inside the 14-day waiting window",
      "The two checks overlap; merge them into one check_eligibility tool that runs both per claim",
      "The model is ignoring descriptions for new conditions; force check_waiting_period through tool_choice"
    ],
    "a": 0,
    "why": "System prompt wording can override good descriptions. 'For any new condition, check exclusions first' ties a keyword to one tool, and that wins over the rewritten descriptions. Removing or rewording the line lets the descriptions do their job.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "The descriptions were rewritten a month ago and fixed the other routing. The remaining errors follow the prompt's wording, not the descriptions."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Merging hides the conflict instead of removing it, and runs a check most claims don't need."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Forcing one tool breaks the claims that do need the exclusions check, and the application can't tell which applies without the judgment the model is making."
      }
    },
    "cite": "Exam guide §2.1; notes/domain-2 §2.1; lesson 0009"
  },
  {
    "id": "P03",
    "ts": "2.2",
    "s": "de",
    "block": 1,
    "bp": {
      "rank": 2,
      "weight": "heavy"
    },
    "q": "file_claim rejects claims sent more than 90 days after treatment, which is a policy rule. It returns 'Request failed' both for that and for database timeouts. For 40 late claims last month, the agent retried 3 times and then told each owner 'We had a temporary problem, please try again later', and 11 owners resubmitted. What should file_claim return for a late claim?",
    "o": [
      "isError with errorCategory 'transient', isRetryable true, and a note in the text that the claim is late",
      "A success result carrying status 'rejected', with the 90-day reason written to the server log",
      "isError with isRetryable false, and the internal rule code ERR_WINDOW_90 as its only text",
      "isError with errorCategory 'business', isRetryable false, and a plain reason the owner can be told"
    ],
    "a": 3,
    "why": "A business-rule violation isn't retryable, and the agent needs to know that. Structured metadata (a category, isRetryable false and a human-readable reason) stops the wasted retries and gives the agent a customer-friendly explanation to pass on.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "A policy rule won't pass on a retry. Marking it transient and retryable keeps the 3 wasted retries."
      },
      "B": {
        "trap": "error-suppression",
        "text": "Reports a failed action as success and puts the reason where neither the agent nor the owner can see it."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Stops the retries, but gives no category and nothing the agent can explain to the owner in plain words."
      }
    },
    "cite": "Exam guide §2.2; notes/domain-2 §2.2"
  },
  {
    "id": "P04",
    "ts": "2.3",
    "s": "de",
    "block": 1,
    "bp": {
      "rank": 1
    },
    "q": "The extraction agent saves its results with update_claim, a general tool that can set any field on any claim. In 1,200 runs it changed approved_payout 4 times, overwriting amounts adjusters had approved, and once edited a different claim with a similar number. Its job is to fill the 11 extraction fields on the claim it is processing. The adjusters want it unable to change anything else, not just warned. What is the best fix?",
    "o": [
      "Add a PreToolUse hook that blocks any update_claim call whose input sets approved_payout",
      "Replace update_claim with save_extraction, which takes only the 11 fields for the current claim",
      "Add a PostToolUse hook that reverts changes to approved_payout and alerts the adjuster",
      "Add a system prompt rule that only adjusters set payouts, with 2 examples of correct saves"
    ],
    "a": 1,
    "why": "The tool is far wider than the job. A constrained tool that accepts only the extraction fields for the current claim makes every other change impossible, which is least privilege. The PreToolUse option covers only part of the requirement: the payout field, but not other fields or other claims.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Blocks one field, but update_claim can still change other fields and other claims, which the stem also rules out."
      },
      "C": {
        "trap": "reactive-too-late",
        "text": "Undoes the change after it was made, and leaves the tool's reach to every field and every claim in place."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Leaves the broad tool in place and relies on the model following a rule it already breaks."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3"
  },
  {
    "id": "P05",
    "ts": "2.3",
    "s": "de",
    "block": 1,
    "bp": {
      "rank": 4
    },
    "q": "Claims run through a coordinator and 3 subagents. In 70% of claims the extraction subagent must confirm the treating clinic is registered, and today it does that by handing back to the coordinator, which asks the registry subagent; each round trip adds about 40 seconds. The registry subagent's 9 tools include 5 read tools plus update_clinic and suspend_clinic, and the extraction subagent, which has 4 tools, lost accuracy the last time it had more than 6. You need to cut the delay without letting the extraction subagent change registry data. What should you do?",
    "o": [
      "Give the extraction subagent the registry's 9 tools, with a prompt rule against the 2 edit tools",
      "Give the extraction subagent the registry's 5 read tools, leaving out update and suspend",
      "Give the extraction subagent one read-only check_clinic_registered tool for this lookup",
      "Cache each clinic's registry answer in the coordinator for 24 hours to skip repeat lookups"
    ],
    "a": 2,
    "why": "For a frequent cross-role need, a narrow scoped tool covers the common case and keeps least privilege: the extraction subagent gets one read-only check, not the registry's edit tools. Both requirements are met: less delay, and no way to change registry data, without loading the subagent with tools it rarely needs.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "Cuts the delay but hands over update and suspend. A prompt rule is a request, not a limit."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Read-only, but 9 tools in all, past the point where its accuracy fell, for a need one narrow check covers."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Helps only clinics seen recently. Each first lookup still makes the 40-second round trip."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3"
  },
  {
    "id": "P06",
    "ts": "2.3",
    "s": "de",
    "block": 1,
    "bp": {
      "rank": 3
    },
    "q": "The extraction agent started with 4 tools: 3 extraction tools and lookup_policy. Over two quarters other teams added send_owner_email, issue_payment, update_crm_contact and 8 more, for 15 in total, though extraction needs none of them. Each description is detailed and accurate, yet in 5% of runs the agent now emails an owner or updates a contact mid-extraction, and field accuracy has fallen from 97% to 91%. What should you change?",
    "o": [
      "Cut the agent back to its 4 extraction tools and give the other 11 to the agents that use them",
      "Add a PreToolUse hook that blocks the 11 non-extraction tools whenever this agent tries to call them",
      "Add a system prompt section listing the 11 tools that the agent must not call during an extraction",
      "Set tool_choice to any, which makes the agent call a tool on each turn of the extraction"
    ],
    "a": 0,
    "why": "Too many tools degrades selection, and tools outside an agent's role get misused. The descriptions are already good, so the fix is scoped access: give the extraction agent only the tools its role needs.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Stops the stray calls but leaves 15 tools for the agent to choose among, which is what pulled accuracy down."
      },
      "C": {
        "trap": "probabilistic",
        "text": "A request the model can still miss, on top of the same 15-tool choice."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Forces some tool call but says nothing about which one, and the stray calls are already tool calls."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3"
  },
  {
    "id": "P07",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1,
      "scope": "personal"
    },
    "q": "An engineer keeps a personal sandbox copy of the payroll database and wants an MCP server for it when working in the payroll repository. They also work in 2 other repositories, where that sandbox server would point at the wrong data. No teammate should see the server or be asked to approve it. How should they add it?",
    "o": [
      "Run claude mcp add --scope user, which adds it once across their projects",
      "Add it to the committed .mcp.json, with its URL read from ${SANDBOX_DB_URL}",
      "Add it with --scope project, then keep the new .mcp.json file out of git by hand",
      "Run claude mcp add from inside the payroll repo and leave the scope at its default, local"
    ],
    "a": 3,
    "why": "Local scope, the default, is me × this project: stored in the engineer's own ~/.claude.json against this project only, and not shared. User scope would reach the 2 other repositories, and a project .mcp.json is meant to be shared.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "User scope reaches all their projects, including the 2 repositories where the sandbox is the wrong data."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "The committed .mcp.json goes to all 18 engineers, who would see the server and be asked to approve it."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Works until someone commits the file. Local scope gives the same result with nothing in the working tree to leak."
      }
    },
    "cite": "Exam guide §2.4; notes/domain-2 §2.4 (local → project → user scopes); lesson 0019; lesson 0023"
  },
  {
    "id": "P08",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1,
      "scope": "shared"
    },
    "q": "The team's .mcp.json, committed to the repository, configures a payroll-rules MCP server whose API key is written into the file in plain text. Security wants the key out of git within a week, and all 18 engineers must keep the server, each with the personal key they were issued. A teammate suggests each engineer re-add the server at user scope. What should change?",
    "o": [
      "Have each engineer re-add the server at user scope with their own key, then delete .mcp.json",
      "Keep the server in .mcp.json, with the key read from ${PAYROLL_RULES_KEY} set by each engineer",
      "Keep the key in .mcp.json, add the file to .gitignore, and send it to engineers directly",
      "Have each engineer add it at local scope with their own key passed in, and remove .mcp.json"
    ],
    "a": 1,
    "why": ".mcp.json supports environment variable expansion. The shared config stays committed for the whole team, and each engineer supplies their own key from their environment, with no secret in git.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Takes the key out of git but turns one shared config into 18 private copies, and new joiners get nothing."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Takes the shared server out of version control, and the key still sits in a file being passed around."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Keeps keys out of git, but 18 private configs replace one shared one, and new joiners get no server."
      }
    },
    "cite": "Exam guide §2.4; notes/domain-2 §2.4"
  },
  {
    "id": "P09",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 2
    },
    "q": "The team's pay-rules MCP server offers search_rules and get_rule over 140 award and pay-code rules. Before most answers the agent calls search_rules 5 to 8 times with guessed terms, just to learn which rules exist, and those calls use about 30% of each session's tokens. The rule list changes about once a quarter. What should the server add?",
    "o": [
      "A resource listing the 140 rules with each one's name and a one-line summary",
      "A list_rules tool that the agent is told to call at the start of each session",
      "A longer search_rules description listing the 20 most common terms to try",
      "A server-side cache for search_rules results, making repeated calls cheaper"
    ],
    "a": 0,
    "why": "MCP resources expose content catalogs, so the agent can see what data exists without exploratory tool calls. Resources are for content and catalogs; tools are for actions.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "One call instead of eight, but still an exploratory call the model has to decide to make. A resource shows the catalog without one."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Better guesses are still guesses, and the agent still searches to learn what exists."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Makes the guessing cheaper, but the agent still guesses."
      }
    },
    "cite": "Exam guide §2.4; notes/domain-2 §2.4"
  },
  {
    "id": "P10",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1,
      "scope": "personal"
    },
    "q": "An engineer has written a small MCP server that reads their own task list, and wants it in each of the 5 repositories they work in, including ones they join later. It holds nothing the team needs, and teammates shouldn't see it. So far they have added it with claude mcp add in 2 of the repositories, one at a time. Where should it be configured?",
    "o": [
      "With claude mcp add in the 3 remaining repos, at the default local scope, as before",
      "In the committed .mcp.json of the 5 repos, with its token left unset for teammates",
      "Once at user scope, with claude mcp add --scope user, stored in their ~/.claude.json",
      "In their ~/.claude/CLAUDE.md, as the command that starts the server at launch"
    ],
    "a": 2,
    "why": "Personal × all projects is user scope: added once, available in each of their projects, invisible to teammates. Local scope is personal too, but one project per entry.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Works, but local scope covers one project per entry, and each new repository needs another."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Project .mcp.json is shared. Teammates would see the server and be asked to approve it."
      },
      "D": {
        "trap": "nonexistent-feature",
        "text": "CLAUDE.md holds instructions. Claude Code doesn't start MCP servers from it."
      }
    },
    "cite": "Exam guide §2.4; notes/domain-2 §2.4; lesson 0023"
  },
  {
    "id": "P11",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3
    },
    "q": "A method, applyHolidayLoading, used to add a 15% loading to public-holiday shifts. It no longer exists anywhere in the 2,600 files, and the payroll manager wants to know in which commit it was removed and what replaced it. A Grep for the name returns 0 matches. Which step should the agent take next?",
    "o": [
      "Grep again for 'holiday' across the files, to find the code that took over from the method",
      "Bash, running git log -S applyHolidayLoading to find the commits that added or removed it",
      "Glob for **/*Holiday*.java and Read each match to find where the method used to live",
      "Read docs/CHANGELOG.md to find the release notes that mention removing the holiday loading"
    ],
    "a": 1,
    "why": "Grep, Glob and Read work on the current files. A removed method exists only in history, which needs a command run through Bash: git log -S lists the commits whose diffs add or remove that string, and git show on that commit shows what replaced it.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Finds current code that mentions holidays, but can't say when the method went or in which commit."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Glob and Read see the files as they are now. The method only exists in history."
      },
      "D": {
        "trap": "probabilistic",
        "text": "May not mention an internal method at all, and gives a release, not the commit."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5"
  },
  {
    "id": "P12",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3
    },
    "q": "A reviewer asks why line 212 of TaxBracketTable.java hard-codes 0.325, and who added it. The agent has read the file: the line has no comment, and the lines around it don't explain it either. The value 0.325 appears in 9 other files. What should the agent do next?",
    "o": [
      "Grep for 0.325 across the codebase and Read the 9 other files to find an explanation",
      "Read the whole of TaxBracketTable.java again, looking for a comment further from line 212",
      "Glob for docs/**/*tax*.md and Read the matches to find where the 32.5% rate is explained",
      "Bash, running git blame on line 212, then git show on that commit to read its message"
    ],
    "a": 3,
    "why": "Who changed a line, and why, is history, not current file content. git blame names the commit for that line, and git show gives its author and message. Both are commands, so the tool is Bash.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Finds where else the number is used today, not who added this line or why."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "The file has already been read. The reason for a change lives in the commit that made it."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Docs may describe the rate, but they won't say who added this line or in which change."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5"
  },
  {
    "id": "P13",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 4
    },
    "q": "The team's rule is that integration tests are the files whose names end in IT.java, and the agent must list them across 9 Maven modules. It first ran Grep for the annotation @Tag('integration') and found 31 files, but 12 older integration tests have no tag, and 4 unit tests carry it by mistake. What should it use instead?",
    "o": [
      "Grep for @SpringBootTest, which most of the integration tests use",
      "Bash, running grep -rl 'IT.java' to list the integration test files",
      "Glob with the pattern **/*IT.java across the repository",
      "Glob with the pattern *IT.java, run from the repository's root"
    ],
    "a": 2,
    "why": "The defining property is the file name, and Glob finds files by name pattern. Grep searches file contents, which is why the tag search both missed and over-matched. The pattern needs **/ to reach into the 9 modules.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Still selects by file contents, and unit tests can use the annotation too. The rule is about file names."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "grep searches inside files. It lists files that mention IT.java, not the files whose names end in it."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Right tool, wrong pattern: without **/ it matches only the root folder, and the tests sit inside 9 modules."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5; lesson 0014"
  },
  {
    "id": "P14",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 2
    },
    "q": "Before renaming the setting payroll.sftp.host, an engineer asks for each place it is used. The team knows of 3 kinds: Java fields with @Value, YAML files under 4 config folders, and 2 deploy shell scripts. A teammate's first attempt searched only the *.java files and missed the scripts. What should the agent do?",
    "o": [
      "Grep the whole repo for payroll.sftp.host, then Read the code around each match",
      "Bash, running grep on the *.yml and *.sh files for the setting's name",
      "Grep the *.java files for @Value annotations, then Read the ones naming the setting",
      "Read application.yml and follow each import it names until the setting turns up"
    ],
    "a": 0,
    "why": "Finding each use of a string across file types is a content search: Grep the whole repository, not one file type, then Read around each match.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "A content search, but only over YAML and scripts: it skips the Java fields the stem lists, the same gap as the first attempt in reverse."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Repeats the first attempt: the Java fields only, missing the YAML files and scripts."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Following imports traces one flow. It won't reach the deploy scripts or the other config folders."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5"
  },
  {
    "id": "P15",
    "ts": "3.1",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 2,
      "scope": "personal",
      "trigger": "session"
    },
    "q": "An engineer new to Spring wants Claude to explain each Spring annotation it adds, but only in the payroll repository. Their other 2 repositories are in Go, where the note is noise, and none of the 17 teammates should get it. They expect to want it for the next 3 months. Where should the instruction live?",
    "o": [
      "In their own ~/.claude/CLAUDE.md, which loads across their projects",
      "In a CLAUDE.local.md at the payroll repository's root, kept out of git",
      "In a personal skill in ~/.claude/skills/, run when touching Spring code",
      "In each session's opening prompt, naming the payroll repo as its scope"
    ],
    "a": 1,
    "why": "Ask who (just this engineer), where (this repository only) and when (every session, for months). Me × this project × every session is CLAUDE.local.md.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Personal, but it reaches the 2 Go repositories too."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "A skill applies when it's invoked or judged relevant, not in each session. This is a standing preference for one repository."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Works for one session, but for 3 months it means retyping it each day."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1 (CLAUDE.local.md = me × this project); lesson 0019; lesson 0023"
  },
  {
    "id": "P16",
    "ts": "3.1",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3,
      "weight": "light"
    },
    "q": "In one engineer's sessions Claude keeps using field injection, which the team's committed CLAUDE.md forbids. The other 17 engineers on the same branch don't see this, and the engineer says they have the file. A teammate suggests they copy the rule into their CLAUDE.local.md as well. What should they do first?",
    "o": [
      "Copy the rule into their CLAUDE.local.md, as the teammate suggests",
      "Rewrite the rule in capitals at the top of the CLAUDE.md, with 2 examples of it",
      "Add a PostToolUse hook that rejects any edit that adds field injection back",
      "Run /memory in a session of theirs to see which memory files actually load"
    ],
    "a": 3,
    "why": "/memory shows which memory files a session has loaded. When behaviour differs between people on the same branch, check what's loaded before changing anything.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "A second copy may mask a cause that is still unknown, and it will drift from the team's."
      },
      "B": {
        "trap": "probabilistic",
        "text": "17 people's sessions already follow it as written. Emphasis doesn't explain why one doesn't."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Builds enforcement before finding out why one engineer's sessions differ."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1 (/memory to verify loaded files)"
  },
  {
    "id": "P17",
    "ts": "3.2",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 4,
      "trigger": "demand"
    },
    "q": "The team's /rerun-payroll skill re-sends a pay run's bank file for a given date. Last week an engineer typed 'the March 14 pay run looks wrong, can you check it?', Claude judged the skill relevant and started it, and a reviewer stopped it 2 minutes before the file went to the bank. The team still wants the skill, started only when someone types /rerun-payroll. What should change?",
    "o": [
      "Add allowed-tools to its frontmatter, limiting it to Read and Grep",
      "Set context: fork, which runs the skill in a separate subagent",
      "Set disable-model-invocation: true in the skill's frontmatter",
      "Add a CLAUDE.md line telling Claude not to start /rerun-payroll itself"
    ],
    "a": 2,
    "why": "Skills load on demand: when someone invokes them, or when Claude judges them relevant. disable-model-invocation removes the second path, so the skill runs only when a person types the command.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Stops the skill doing its job when it's meant to run, and doesn't change who can start it."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Changes where the skill runs, not who can start it."
      },
      "D": {
        "trap": "probabilistic",
        "text": "A request the model may still misjudge, for a skill that sends bank files."
      }
    },
    "cite": "notes/2026-09-docs-delta §3.2 (frontmatter disable-model-invocation; skills load when invoked or judged relevant); notes/domain-3 §3.2; lesson 0021"
  },
  {
    "id": "P18",
    "ts": "3.2",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 2,
      "scope": "shared",
      "trigger": "demand"
    },
    "q": "Onboarding a new client's pay codes follows a 90-line procedure: import the code list, map each code, run the checks. It happens about twice a month, whenever someone picks up an onboarding ticket, and any of the 18 engineers may do it. Today the procedure sits in the root CLAUDE.md and loads in each session. Where should it go?",
    "o": [
      "A skill in the tech lead's ~/.claude/skills/, shared by link when someone asks",
      "A project skill in .claude/skills/, committed, run by whoever takes the ticket",
      "A .claude/rules/ file with paths set to clients/**, where the pay code files live",
      "The root CLAUDE.md as now, with the procedure moved under its own heading"
    ],
    "a": 1,
    "why": "Ask who (the whole team), where (this repository) and when (on demand, when someone starts an onboarding). That's a project skill, committed in .claude/skills/.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "On demand, but personal: the other engineers don't get it."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Fires when client files are read, not when someone starts an onboarding, which begins from a ticket."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Still loads in each session for a task done twice a month."
      }
    },
    "cite": "Exam guide §3.2; notes/domain-3 §3.2; lesson 0023"
  },
  {
    "id": "P19",
    "ts": "3.1",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 1,
      "scope": "shared",
      "trigger": "session"
    },
    "q": "The repository has a 140-line AGENTS.md that 2 other coding tools read, kept current by the platform team. Claude Code sessions don't follow it, and a teammate proposes pasting its contents into the root CLAUDE.md. The platform team will keep editing AGENTS.md about once a week. What is the best fix?",
    "o": [
      "Add the line @AGENTS.md to the root CLAUDE.md, importing the file as it is",
      "Paste the contents into the root CLAUDE.md, as the teammate suggests",
      "Rename AGENTS.md to CLAUDE.md, which Claude Code reads at launch",
      "Copy it into a .claude/rules/agents.md file with paths set to **/*"
    ],
    "a": 0,
    "why": "Claude Code doesn't read AGENTS.md. An @ import in CLAUDE.md pulls in the file as it stands: one source, nothing to copy, and it loads in each session like the rest of CLAUDE.md.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Works today, but the copy drifts each time the platform team edits AGENTS.md."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Fixes Claude Code and breaks the 2 tools that read AGENTS.md."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Still a copy that drifts, inside a path rule that matches every file anyway."
      }
    },
    "cite": "notes/2026-09-docs-delta §3.1 (AGENTS.md is not read; use @AGENTS.md); Exam guide §3.1; notes/domain-3 §3.1"
  },
  {
    "id": "P20",
    "ts": "3.1",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 1,
      "scope": "personal",
      "trigger": "session"
    },
    "q": "A developer wants 2 things from Claude: Google-style docstrings in each of the 4 repositories they work in, and, in this monorepo only, tests run against their personal Airflow connection dev_local_ag. Teammates must get neither. Where should each instruction live?",
    "o": [
      "Both in their own ~/.claude/CLAUDE.md, under a heading per repository",
      "Both in this repo's CLAUDE.local.md, copied to the other 3 repos later",
      "Docstrings in a ~/.claude/skills/ skill, the connection in CLAUDE.local.md",
      "Docstrings in ~/.claude/CLAUDE.md, the connection in this repo's CLAUDE.local.md"
    ],
    "a": 3,
    "why": "Ask who, where and when for each. Docstrings: me × all my projects × every session, which is ~/.claude/CLAUDE.md. The connection: me × this project × every session, which is CLAUDE.local.md.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The connection would load in the other 3 repositories too. A heading doesn't stop that."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Right for the connection. For the docstrings, it's four copies of one preference, and they drift."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Right for the connection, but a docstring style should apply whenever Claude writes code, not only when a skill runs."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1 (who × where); lesson 0019; lesson 0023"
  },
  {
    "id": "P21",
    "ts": "3.2",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 3,
      "scope": "personal",
      "trigger": "demand"
    },
    "q": "The team's /backfill skill reruns a DAG for a date range. A data scientist wants their own version that also opens a notebook with the results, but still wants the team's /backfill for routine runs. None of the other 11 engineers' /backfill may change. What should they do?",
    "o": [
      "Copy it to ~/.claude/skills/backfill/ and add the notebook step to that personal copy",
      "Add a line to their CLAUDE.local.md saying to open a notebook after each /backfill",
      "Copy it to ~/.claude/skills/backfill-nb/ under the new name and edit the copy",
      "Add the notebook step to the team's skill, behind a check of who runs it"
    ],
    "a": 2,
    "why": "A personal variant of a team skill goes in ~/.claude/skills/ under a different name. A same-name personal skill overrides the project one for that engineer.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Same name: their personal copy takes over /backfill in their sessions, and the team's version is gone for them."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Applies to each backfill they run, including the routine ones they want unchanged."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Edits the shared skill for one person's preference, and the team's /backfill changes with it."
      }
    },
    "cite": "Exam guide §3.2; notes/domain-3 §3.2; lesson 0021"
  },
  {
    "id": "P22",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 3,
      "scope": "shared",
      "trigger": "file"
    },
    "q": "Airflow DAG files are named *_dag.py and sit in 11 directories across the monorepo, next to about 300 helper .py files. Their 90 lines of conventions are in the root CLAUDE.md, loaded in each session, and a teammate proposes moving them to dags.md with an @dags.md line in the root CLAUDE.md. Most sessions never touch a DAG. Where should the conventions go?",
    "o": [
      "A dags.md file, imported with @dags.md from the root CLAUDE.md, as proposed",
      "A .claude/rules/ file with paths set to **/*_dag.py in its frontmatter",
      "A .claude/rules/ file with paths set to **/*.py in its frontmatter",
      "A /dag-conventions skill that engineers run before they edit any DAG file"
    ],
    "a": 1,
    "why": "Conventions for one kind of file, spread across 11 directories, should load when Claude reads a matching file. A paths glob does exactly that; an import loads in each session.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Tidier, but an import still loads at launch in each session, DAG or not."
      },
      "C": {
        "trap": "over-engineered",
        "text": "The right mechanism with too wide a glob: it fires for the 300 helper files and nearly every session."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Conventions should apply whenever a DAG is edited, not only when someone remembers to run a skill."
      }
    },
    "cite": "Exam guide §3.3; notes/domain-3 §3.3; notes/2026-09-docs-delta §3.1 (paths rules load when a matching file is read); lesson 0023"
  },
  {
    "id": "P23",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2,
      "weight": "light",
      "trigger": "prompt"
    },
    "q": "This afternoon a developer is checking why the stockout_forecast DAG drops 3% of stores. For this one session, Claude should print row counts after each task when it runs the DAG locally. From tomorrow, local runs of that DAG should print nothing extra, and nothing should be left behind that someone has to remember to remove. How should the developer give Claude the instruction?",
    "o": [
      "Say it in this session's prompt, naming the stockout_forecast DAG",
      "Add it to their CLAUDE.local.md and remove the line this evening",
      "A .claude/rules/ file with paths set to the DAG's file, uncommitted",
      "Add it to ~/.claude/CLAUDE.md for today, then take it out tonight"
    ],
    "a": 0,
    "why": "This instruction is for this session only. The session prompt covers that completely. Anything written to a file is standing configuration that fires again tomorrow unless someone remembers to remove it.",
    "wrong": {
      "B": {
        "trap": "over-engineered",
        "text": "Personal, but standing: it loads in each session in this repo until someone remembers to delete it."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Fires whenever that file is read, tomorrow included, until it's deleted."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Loads in each of their projects, and stays until someone removes it."
      }
    },
    "cite": "Exam guide §3.3; notes/domain-3 §3.1; lesson 0023"
  },
  {
    "id": "P24",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 1,
      "scope": "shared",
      "trigger": "file"
    },
    "q": "A teammate split the 600-line root CLAUDE.md into 9 topic files in .claude/rules/: dbt.md, airflow.md, fastapi.md and 6 more, none with frontmatter. Sessions that only touch the FastAPI service still load all 600 lines at startup. The dbt, Airflow and FastAPI conventions each apply to their own files only. What should change?",
    "o": [
      "Move the 9 files into ~/.claude/rules/, out of the project's own folder",
      "Turn the 9 files into skills that engineers run for that kind of work",
      "Add paths: frontmatter to the file-specific rules, such as models/**/*.sql for dbt.md",
      "Merge them back into CLAUDE.md under a clear heading for each part of the repo"
    ],
    "a": 2,
    "why": "Rules files without paths frontmatter load at launch, with the same priority as CLAUDE.md, so splitting alone saves nothing. Adding paths globs makes each rule load only when a matching file is read.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Makes them personal, so teammates lose them, and without paths they still load at launch."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Conventions should apply whenever matching files are edited, not when someone remembers a skill."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Back to 600 lines at each launch, relying on Claude to pick the right heading."
      }
    },
    "cite": "notes/2026-09-docs-delta §3.1 (rules without paths load at launch; with paths, when a matching file is read); Exam guide §3.3; notes/domain-3 §3.3"
  },
  {
    "id": "P25",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 4,
      "scope": "shared",
      "trigger": "demand"
    },
    "q": "A 70-line procedure for regenerating forecast test fixtures sits in a .claude/rules/ file with paths set to tests/fixtures/**. It's needed about once a month, when someone decides a model's features have changed. The rule loads in 40% of sessions because tests read fixtures, yet regenerations start from a ticket, before any fixture is opened, and Claude often lacks the procedure. Where should it live?",
    "o": [
      "The same rule, with its paths widened to tests/** to load sooner",
      "The root CLAUDE.md, where it loads at the start of each session",
      "A CLAUDE.md inside tests/fixtures/, loaded when Claude works there",
      "A project skill, /regen-fixtures, committed in .claude/skills/"
    ],
    "a": 3,
    "why": "The procedure is needed when someone decides to start a regeneration, not when a file is read. That's on demand: a project skill, shared through .claude/skills/.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Loads in even more sessions, and a regeneration still starts before any test file is read."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Fixes the timing by paying for 70 lines in each session, for a monthly task."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Also fires on file access, which is the wrong trigger for a task someone decides to start."
      }
    },
    "cite": "Exam guide §3.2; Exam guide §3.3; notes/domain-3 §3.2, §3.3; lesson 0021 (Q6); lesson 0023"
  },
  {
    "id": "P26",
    "ts": "3.4",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2,
      "weight": "light"
    },
    "q": "The forecast API returns HTTP 500 for stores that opened this month. The traceback points to a ZeroDivisionError at line 88 of compute_baseline in services/api/baseline.py when a store has 0 weeks of sales, and the agreed fix is to return a zero baseline in that case. The API feeds automatic orders for 640 stores. How should Claude Code approach the change?",
    "o": [
      "Plan mode first: the API places the orders for 640 stores",
      "Direct execution with the zero-weeks guard and a test for a new store",
      "An Explore subagent to map compute_baseline's callers, then plan mode",
      "Direct execution, catching any exception in the division and returning 0"
    ],
    "a": 1,
    "why": "A single-function fix with a clear stack trace and an agreed change is direct execution. The 640 stores raise the stakes, not the complexity, and a test for the new-store case covers the risk.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Importance isn't complexity. The cause, the line and the fix are already known."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Investigation for a fix the stem has already located and agreed."
      },
      "D": {
        "trap": "error-suppression",
        "text": "Hides every future error on that line, not just the known empty-history case."
      }
    },
    "cite": "Exam guide §3.4; notes/domain-3 §3.4; lesson 0020"
  },
  {
    "id": "P27",
    "ts": "3.4",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 1,
      "weight": "heavy"
    },
    "q": "The team must move 52 DAGs from the old operator style to Airflow's TaskFlow API. Two approaches are on the table: a shim that lets old and new styles run side by side, or rewriting each DAG in place, and the choice changes how the 9 shared operator modules are touched. Nobody has mapped which DAGs use which operators. How should Claude Code start?",
    "o": [
      "Direct execution: convert the DAGs one at a time and test as you go",
      "Direct execution, switching to plan mode if the conversion gets complex",
      "Plan mode to map the DAGs and operators, compare both approaches and agree one",
      "Plan mode for 1 DAG, then direct execution for the 51 others using it"
    ],
    "a": 2,
    "why": "Large multi-file work with two valid approaches and unknown dependencies is what plan mode is for: explore and design before editing, which avoids costly rework. The complexity is stated up front, so start there.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Starts editing before the approach is chosen, and that choice changes how the shared modules are touched."
      },
      "B": {
        "trap": "probabilistic",
        "text": "The complexity is already in the stem: 52 DAGs, 2 approaches, unmapped dependencies."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Plans one conversion, not the choice between approaches, and one DAG can't show how the shared modules are used."
      }
    },
    "cite": "Exam guide §3.4; notes/domain-3 §3.4"
  },
  {
    "id": "P28",
    "ts": "3.5",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 3
    },
    "q": "The weekly bucketing function has 3 problems. It converts timestamps to UTC before bucketing, which moves late-Sunday sales into Monday; it starts weeks on Monday while stores report Sunday to Saturday; and it applies holiday shifts after bucketing, which double-counts 2 holidays. Fixing any one changes the outputs the other two produce: an earlier attempt fixed the UTC step alone, which moved 2 holiday weeks and broke the next fix. How should you give Claude the fixes?",
    "o": [
      "In one detailed message covering the 3 problems and how they interact",
      "One at a time, checking each fix works before raising the next problem",
      "In 3 parallel sessions, one per problem, then merge the 3 diffs",
      "Ask Claude to rewrite the whole function, without describing the problems"
    ],
    "a": 0,
    "why": "Interacting problems go in one detailed message, so Claude can fix them together. Sequential fixes suit independent problems.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "Right for independent problems. These interact, so each fix shifts what the next one sees."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Three sessions each changing a function whose parts depend on each other."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Hopes a rewrite lands right without saying what right is."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5; lesson 0018"
  },
  {
    "id": "P29",
    "ts": "3.5",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 4,
      "weight": "heavy"
    },
    "q": "A developer who has never worked on retail forecasting must add promotion handling to the demand model. The ticket says only 'account for promotions'. On a similar ticket last quarter, the first version missed 2 effects the merchandising team cared about and was rewritten twice. The developer can't yet say which promotion effects matter. What should the developer do first?",
    "o": [
      "Ask Claude to implement it from the ticket, then review the result",
      "Ask Claude to interview them about promotions before any code",
      "Write tests first for the promotion cases they already know about",
      "Give Claude 3 examples of promotion weeks and the expected output"
    ],
    "a": 1,
    "why": "In an unfamiliar domain, the interview pattern has Claude ask you questions that surface considerations you hadn't anticipated, before it implements anything.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Repeats last quarter: the gaps show up after the code is written."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Tests-first is strong when the cases are known. Here the gap is the cases nobody has thought of yet."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Examples pin down a known transformation, not effects the developer hasn't anticipated."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5; lesson 0020"
  },
  {
    "id": "P30",
    "ts": "3.6",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 2
    },
    "q": "A CI job runs claude -p on each pull request to suggest missing tests for the changed modules. Over 60 PRs, 40% of its suggestions duplicate tests that already exist, and engineers have started ignoring the job. The prompt already says 'Do not suggest tests that already exist.' What should change?",
    "o": [
      "Repeat the instruction at the end of the prompt as well, in capitals",
      "Filter out suggestions whose names match an existing test before posting",
      "Switch to --output-format json and post the suggestions one by one",
      "Include the existing test files for the changed modules in its context"
    ],
    "a": 3,
    "why": "To avoid duplicate test suggestions, give Claude the existing tests in context. An instruction alone can't help when Claude can't see what exists.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "The line is already there. Claude can't avoid tests it hasn't seen."
      },
      "B": {
        "trap": "reactive-too-late",
        "text": "Catches only exact names, after generation; duplicates under new names still get through."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Changes the output's shape, not whether Claude knows which tests exist."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6"
  }
];

module.exports = { META, Q };
