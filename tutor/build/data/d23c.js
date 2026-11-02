// tutor/build/data/d23c.js — Domains 2 and 3 Paper 3 (sit 2026-10-23): 30 original questions in 3 scenario blocks (6/12/12).
// Allocation in statements.js (d23c): weighted to the weak rows after Paper 2 (LR-0033). Targets the Paper 2 miss shapes in new settings:
// two-constraint least privilege, folder CLAUDE.md vs skill, rules without paths, headings don't limit reach, /memory first,
// interview pattern, existing tests in CI context, two agents' tool counts. bp.weight / bp.scope / bp.trigger as in d23b.
// Facts only from reference/ccar-f-official-exam-guide.md, notes/, lessons/. bp.rank = measured length rank of the key. Single-answer only.
'use strict';

const META = {
  "key": "d23c",
  "title": "CCA-F Domains 2 and 3 Paper 3",
  "eyebrow": "Domains 2 and 3 · 30 questions · 3 scenarios",
  "intro": "Thirty new exam-level questions on Domains 2 and 3, in three scenario blocks. Every question has one correct answer. Flag questions to return to them before you submit. Labels stay hidden until grading. Sit it once, in exam mode, with the 60-minute timer on.",
  "defaultMode": "exam",
  "timerDefault": true,
  "minutes": 60,
  "storageKey": "ccaf-d23-paper3",
  "blocks": [
    {
      "id": 1,
      "title": "Multi-Agent Research System",
      "intro": "You are building a due-diligence research system for a law firm on the Claude Agent SDK. A coordinator delegates to a search subagent, a document-analysis subagent and a synthesis subagent, which research companies the firm's clients plan to buy, using MCP tools over court records, company filings and each deal's data room."
    },
    {
      "id": 2,
      "title": "Developer Productivity with Claude",
      "intro": "Your team of 25 engineers builds a mobile game: a 6-year-old C# codebase of about 4,000 files, with a Unity client and .NET services. You own the shared Claude Code setup and the internal agent tooling, from CLAUDE.md files and skills to MCP servers."
    },
    {
      "id": 3,
      "title": "Code Generation with Claude Code",
      "intro": "Your team uses Claude Code on a bank's mobile app monorepo: an Android app in Kotlin, an iOS app in Swift and a shared Kotlin module, about 2,200 files. You own the Claude Code setup, from CLAUDE.md files and rules to skills and the Claude Code jobs in CI."
    }
  ]
};

const Q = [
  {
    "id": "C01",
    "ts": "2.1",
    "s": "ma",
    "block": 1,
    "bp": {
      "rank": 1
    },
    "q": "The search subagent has 4 court-record tools: search_cases_by_party, search_cases_by_number, search_cases_by_court and search_cases_by_date. Each is described as 'Searches court cases', and they share one backend that accepts all 4 filters together. In 14% of runs the subagent picks by_party when the request gives a case number, or runs 2 tools where one combined query would do. What change best addresses this?",
    "o": [
      "Rename the 4 tools with clearer verbs, such as find_by_party and lookup_by_number, and keep them separate",
      "Replace the 4 tools with a single search_cases tool that takes optional party, number, court and date filters",
      "Add a system prompt table telling the subagent which of the 4 tools to use for which kind of request",
      "Add a router subagent that reads the request and passes it to the right one of the 4 search tools"
    ],
    "a": 1,
    "why": "The 4 tools overlap almost completely: one backend, one description, filters that combine. Consolidating them into one tool with optional filters removes the selection problem and lets one call carry several filters.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Clearer names for four tools that still overlap, and a request with 2 filters still needs 2 calls."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Routing instructions on top of four overlapping tools, when one tool with filters removes the choice."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Another model call to choose between tools that shouldn't be separate in the first place."
      }
    },
    "cite": "Exam guide §2.1; notes/2026-09-docs-delta §2.1 (consolidate overlapping tools); notes/domain-2 §2.1"
  },
  {
    "id": "C02",
    "ts": "2.1",
    "s": "ma",
    "block": 1,
    "bp": {
      "rank": 4
    },
    "q": "The synthesis subagent has verify_claim, described as 'Checks a claim'. It actually compares one sentence against the source document cited for it and returns supported, contradicted or not found. In 60 reports, the subagent called it 23 times to check arithmetic such as revenue growth rates, and each time got 'not found' and dropped the figure. What should you change first?",
    "o": [
      "Add a calculate tool for arithmetic, and keep verify_claim's description as it is today",
      "Expand the description to list the source types it can open, such as filings and judgments",
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
  {
    "id": "C03",
    "ts": "2.2",
    "s": "ma",
    "block": 1,
    "bp": {
      "rank": 3
    },
    "q": "search_court_records returns an empty list in 2 cases: when no records match, and when the matching case is sealed, which this firm's credentials can't open. In 9 of 140 reports the synthesis subagent wrote 'no litigation found' for a company that had a sealed case. The lawyers want sealed cases flagged for a manual request. What should the tool return for a sealed case?",
    "o": [
      "isError, errorCategory 'permission', isRetryable false, noting a sealed match",
      "An empty list, as now, with the word 'sealed' added to the tool's description",
      "isError with errorCategory 'transient' and isRetryable true, to make the agent retry",
      "An empty list, plus a coordinator rule to treat each empty result as possibly sealed"
    ],
    "a": 0,
    "why": "An empty result means the query succeeded with no matches. An access failure is different and needs its own signal. A permission error that isn't retryable, noting that a sealed case matched, lets the agent flag it for the manual request.",
    "wrong": {
      "B": {
        "trap": "error-suppression",
        "text": "Still reports an access failure as an empty result, so the agent can't tell it apart from no matches."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Retrying won't open a sealed case. The category tells the agent the wrong thing."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Makes every genuine 'no records' doubtful and still hides which results were sealed."
      }
    },
    "cite": "Exam guide §2.2; notes/domain-2 §2.2"
  },
  {
    "id": "C04",
    "ts": "2.3",
    "s": "ma",
    "block": 1,
    "bp": {
      "rank": 1
    },
    "q": "The document-analysis subagent reads the target company's data room through run_shell, a general shell tool. In 300 runs it once read files from another client's data room folder and once deleted a temporary folder the coordinator still needed. The subagent only needs to read documents from the current deal's data room. The partners want it unable to do anything else. What is the best fix?",
    "o": [
      "Add a PreToolUse hook that blocks rm and rmdir commands in run_shell for this subagent",
      "Add a PostToolUse hook that strips output from paths outside the current deal's folder",
      "Replace run_shell with read_deal_document, which reads only files in the current deal's data room",
      "Add a system prompt rule naming the current deal's folder and forbidding all other paths"
    ],
    "a": 2,
    "why": "The stem names two problems: reading another client's files, and deleting a folder. A hook can block one of them. A constrained read tool scoped to the current deal removes both, and everything else a shell can do, which is least privilege.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Stops the deletion but not the read of another client's files, which the partners also ruled out."
      },
      "B": {
        "trap": "reactive-too-late",
        "text": "The other client's files have already been read, and the shell can still delete things."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Leaves a full shell in place and relies on the model staying inside the rule."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3; LR-0031 (F06); LR-0033 (Q4)"
  },
  {
    "id": "C05",
    "ts": "2.3",
    "s": "ma",
    "block": 1,
    "bp": {
      "rank": 3
    },
    "q": "The search subagent has 11 tools, 4 of them read-only filing lookups. The synthesis subagent has 3 tools and loses focus when given more than 5. In 80% of reports, synthesis needs a filing's date, which it gets by asking the coordinator to send the search subagent; each round trip adds about 30 seconds. What should you do to cut the delay?",
    "o": [
      "Give the synthesis subagent the search subagent's 4 filing lookups",
      "Give the synthesis subagent all 11 search tools, plus a prompt rule",
      "Add a 4th subagent for dates that synthesis can call without the coordinator",
      "Give the synthesis subagent a get_filing_date tool for this lookup"
    ],
    "a": 3,
    "why": "A narrow scoped tool covers the frequent cross-role need: synthesis goes from 3 to 4 tools, under its limit of 5, and the round trip disappears. Read each number against the agent it belongs to: 11 and 4 are the search subagent's; 3 and 5 are synthesis's.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Read-only, but 3 + 4 = 7 tools, past the 5 where synthesis loses focus, for one recurring lookup."
      },
      "B": {
        "trap": "probabilistic",
        "text": "14 tools and full search access, kept in line only by a request."
      },
      "C": {
        "trap": "over-engineered",
        "text": "A new agent and a new hop for one lookup a single tool covers."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3; LR-0033 (Q5)"
  },
  {
    "id": "C06",
    "ts": "2.3",
    "s": "ma",
    "block": 1,
    "bp": {
      "rank": 4
    },
    "q": "The synthesis subagent has 4 tools: get_filing_date, verify_claim, lookup_entity and submit_report. Its final step must call submit_report with the structured report, but in 5% of runs it ends with a prose summary instead, and the pipeline drops those reports. The request for that final step is sent with tool_choice set to auto. What should the final request use?",
    "o": [
      "tool_choice set to any, which makes it call one of its 4 tools on that request",
      "tool_choice set to type tool, with name submit_report, on that final request",
      "tool_choice left at auto, with a prompt line saying always end with submit_report",
      "tool_choice left at auto, with a retry whenever the reply comes back as prose"
    ],
    "a": 1,
    "why": "Forced tool choice, type tool with a name, makes the model call that specific tool. 'any' only guarantees some tool call, which with 4 tools isn't enough. auto allows text.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Guarantees a tool call, but it could be verify_claim or lookup_entity instead of submit_report."
      },
      "C": {
        "trap": "probabilistic",
        "text": "auto still allows plain text, and a prompt line is a request, not a guarantee."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "Pays for a failed run first, and the retry can end in prose again."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3"
  },
  {
    "id": "C07",
    "ts": "2.3",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1
    },
    "q": "The studio's internal agent has a code-review subagent and a release subagent. For convenience, the review subagent was also given the release subagent's publish_build tool, and twice in 6 weeks it published a build to the test store after approving a change. Reviews never need to publish anything. What is the best fix?",
    "o": [
      "Remove publish_build from the review subagent and leave it with the release subagent only",
      "Keep publish_build on the review subagent behind a PreToolUse hook asking for approval",
      "Add a system prompt rule that the review subagent reviews code and doesn't publish builds",
      "Rename publish_build to publish_build_release_only so the review subagent avoids it"
    ],
    "a": 0,
    "why": "Each agent should get only its role's tools. Reviews never publish, so the review subagent shouldn't have publish_build at all. Removing it is least privilege and makes the mistake impossible.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Adds a gate to a tool the role never needs. Each review still carries the ability to publish."
      },
      "C": {
        "trap": "probabilistic",
        "text": "A request to the agent that already published twice, with the tool still in reach."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Relies on the name to steer the model away from a tool it shouldn't have at all."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3"
  },
  {
    "id": "C08",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1
    },
    "q": "The team's Unity asset MCP server has find_asset_refs, which resolves references stored as GUIDs in .meta and .prefab files. Its description reads 'Finds asset references'. When engineers ask what uses a texture, the agent runs Grep on the texture's file name 85% of the time and misses every reference made by GUID. What should change?",
    "o": [
      "Add a CLAUDE.md line telling Claude to prefer MCP tools over Grep for asset questions",
      "Block Grep with a PreToolUse hook whenever the search term ends in an image extension",
      "Expand find_asset_refs' description to say it resolves GUID references that text search misses",
      "Rewrite find_asset_refs to also search file names, making Grep unnecessary for this job"
    ],
    "a": 2,
    "why": "When the agent prefers a built-in tool over a more capable MCP tool, the fix is the MCP tool's description: say what it resolves and outputs that the built-in can't.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "A blanket preference that doesn't tell the model what this tool does better."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Blocks a useful tool by guesswork, and the description still doesn't explain the better one."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "The tool already does the harder part. The model avoids it because the description doesn't say so."
      }
    },
    "cite": "Exam guide §2.4; notes/domain-2 §2.4"
  },
  {
    "id": "C09",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1,
      "scope": "shared"
    },
    "q": "All 25 engineers need the build-farm MCP server, which queues and inspects builds. So far 6 engineers have each added it with claude mcp add at the default scope, using their own access token, and the other 19 don't have it. New hires join every month. How should it be configured?",
    "o": [
      "Ask the other 19 to run the same claude mcp add command, as the first 6 did",
      "In the project's .mcp.json, committed, with the token read from ${BUILD_FARM_TOKEN}",
      "Have each engineer add it with --scope user, available across their projects",
      "Add a CLAUDE.md line telling Claude how to start the build-farm server itself"
    ],
    "a": 1,
    "why": "Shared team tooling belongs in the project's .mcp.json, committed, with each engineer's token read from an environment variable. Everyone, new hires included, gets it on clone.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "25 private copies, and each new hire has to find and run the command."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Still personal config, one per engineer, and new hires still start without it."
      },
      "D": {
        "trap": "nonexistent-feature",
        "text": "CLAUDE.md holds instructions. Claude Code doesn't start MCP servers from it."
      }
    },
    "cite": "Exam guide §2.4; notes/domain-2 §2.4"
  },
  {
    "id": "C10",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 4
    },
    "q": "Before changing the IDamageable interface, an engineer asks for every class that implements it. Implementing classes are spread across 4,000 C# files, and their file names follow no pattern: Barrel.cs, Wolf.cs, ShieldWall.cs. A teammate's first attempt used Glob for **/*Damageable*.cs and found 2 files. What should the agent do?",
    "o": [
      "Glob again with a wider pattern, such as **/*Dam*.cs and **/*Health*.cs",
      "Grep for class names containing Damage, such as class .*Damage, then Read them",
      "Bash, listing the files changed in the last 6 months that mention damage",
      "Grep the .cs files for IDamageable, then Read each declaration"
    ],
    "a": 3,
    "why": "Which classes implement an interface is in file contents, not names. Grep searches contents; Glob matches names, which is why the first attempt found 2. The search has to be for the interface itself, not for a name pattern.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Still matching file names, which the stem says follow no pattern."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Right tool, wrong pattern: it still keys on class names, which the stem says follow no pattern. Barrel and Wolf would be missed."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Old implementers that haven't changed recently would be missed."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5; lesson 0014"
  },
  {
    "id": "C11",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3
    },
    "q": "A physics bug appeared between release tags v4.2 and v4.3, which are 186 commits apart. A test, RagdollStabilityTest, fails on v4.3 and passes on v4.2. The engineer wants the commit that introduced the bug. Which step should the agent take?",
    "o": [
      "Read the diffs of the 186 commits one by one, looking for physics changes",
      "Grep the current code for ragdoll and read the files the search turns up",
      "Bash, running git bisect between the 2 tags with that test as the check",
      "Glob for files under Physics/ and read the ones with recent changes"
    ],
    "a": 2,
    "why": "This is a question about history, answered by a command: git bisect runs the failing test across the commits between the 2 tags and finds the first bad one in about 8 steps. Commands run through Bash.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Bulk reading, when a search over history can test the commits for you."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Shows today's code, not which commit changed the behaviour."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "File names and current content can't say which of 186 commits broke it."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5; LR-0031 (F12)"
  },
  {
    "id": "C12",
    "ts": "3.1",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 2,
      "weight": "light"
    },
    "q": "The team's committed CLAUDE.md bans LINQ in per-frame code. Two of the 25 engineers say Claude keeps writing LINQ in Update methods for them, and both switched to a new terminal setup last week. Everyone else's sessions follow the rule. One of the two asks whether to paste the rule into their own CLAUDE.local.md. What should they do first?",
    "o": [
      "Run /memory in an affected session first, to check what loads",
      "Paste the rule into their CLAUDE.local.md, as they suggest",
      "Add a PostToolUse hook that rejects LINQ in any Update method",
      "Move the rule to the top of CLAUDE.md, in capitals with examples"
    ],
    "a": 0,
    "why": "When the same rule works for most people and not for a few, check what their sessions actually load before adding config. /memory shows the loaded memory files.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "A copy that may hide whatever stops the team file loading, and it will drift."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Builds enforcement before finding out why 2 setups differ."
      },
      "D": {
        "trap": "probabilistic",
        "text": "23 people's sessions follow it as written. Emphasis doesn't explain the 2."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1 (/memory to verify loaded files); LR-0033 (Q16)"
  },
  {
    "id": "C13",
    "ts": "3.1",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1,
      "scope": "shared",
      "trigger": "file"
    },
    "q": "The root CLAUDE.md has a '## Server only' section with 80 lines of .NET rules and a '## Client only' section with 120 lines of Unity rules. Server code lives under Server/ and client code under Client/. In Unity-only sessions Claude still applies server patterns, such as async database calls, about 1 time in 10. What should change?",
    "o": [
      "Strengthen the headings to say 'apply ONLY when editing files in Client/'",
      "Move each section into its own CLAUDE.md, one in Server/ and one in Client/",
      "Move both sections into each engineer's CLAUDE.local.md at the repo root",
      "Turn each section into a skill that engineers run when starting that work"
    ],
    "a": 1,
    "why": "A heading doesn't control where a file loads: the root CLAUDE.md loads in full every session. A CLAUDE.md in a subdirectory loads when Claude reads files there, so each set of rules arrives only with its own code.",
    "wrong": {
      "A": {
        "trap": "probabilistic",
        "text": "A heading is still text in one file that loads for every session. It can't limit its own reach."
      },
      "C": {
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
  {
    "id": "C14",
    "ts": "3.1",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3,
      "scope": "personal",
      "trigger": "session"
    },
    "q": "An engineer works on an older laptop where the full test suite takes 40 minutes. They want Claude, in this repository only, to run just the fast test category after each change. Their other 2 repositories have quick suites, and none of their 24 teammates should get the instruction. Where should it live?",
    "o": [
      "In their ~/.claude/CLAUDE.md, under a heading for this repository",
      "In the root CLAUDE.md, under a heading with the engineer's name",
      "In a ~/.claude/skills/ skill they run before asking for any change",
      "In a CLAUDE.local.md at this repository's root, kept out of git"
    ],
    "a": 3,
    "why": "Who: just this engineer. Where: this repository only. When: every session. That's CLAUDE.local.md.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "That file loads in full in all 3 repositories. A heading doesn't stop it."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Committed and shared: all 24 teammates' sessions load it."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "A skill works when invoked. This is a standing preference for every session in one repository."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1 (CLAUDE.local.md = me × this project); lesson 0019; lesson 0023"
  },
  {
    "id": "C15",
    "ts": "3.2",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 2,
      "scope": "personal",
      "trigger": "demand"
    },
    "q": "An engineer wrote a /perf-capture skill that profiles the open scene and summarises the 10 slowest systems. Only they use it, about twice a week, and they want it in the main game repository and in 2 prototype repositories. Teammates shouldn't see it. Where should the skill live?",
    "o": [
      "In .claude/skills/perf-capture/ in each of the 3 repositories",
      "In a CLAUDE.local.md in each repository, as the profiling steps",
      "In ~/.claude/skills/perf-capture/, their personal skills folder",
      "In their ~/.claude/CLAUDE.md, as the steps for profiling a scene"
    ],
    "a": 2,
    "why": "Who: just me. Where: all my repositories. When: when I start it. That's a personal skill in ~/.claude/skills/.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Project skills are shared: teammates in all 3 repositories would see it."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Loads in every session for something used twice a week, and as 3 copies."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Personal and in all 3 repos, but loaded in every session for an on-demand task."
      }
    },
    "cite": "Exam guide §3.2; notes/domain-3 §3.2; lesson 0023"
  },
  {
    "id": "C16",
    "ts": "3.2",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3
    },
    "q": "The team's /asset-audit skill should only read the project and report unused assets. In 2 of its last 30 runs it also moved files it judged unused into an Archive/ folder with Bash, and a build broke. The team still wants the report from each run. What should change in the skill?",
    "o": [
      "Set allowed-tools in its frontmatter to Read, Grep and Glob",
      "Set context: fork, which runs the skill in a separate subagent",
      "Set disable-model-invocation, so it runs only when typed",
      "Add a line to SKILL.md asking it never to move or delete files"
    ],
    "a": 0,
    "why": "allowed-tools restricts which tools a skill may use while it runs. Limiting it to read-only tools keeps the report and removes the ability to move files.",
    "wrong": {
      "B": {
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
  {
    "id": "C17",
    "ts": "3.3",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 4,
      "scope": "shared",
      "trigger": "file"
    },
    "q": "The team added .claude/rules/shaders.md and .claude/rules/netcode.md, 150 lines each, expecting them to load only for that kind of work. Neither file has frontmatter. /memory in a session that only touched UI code shows both loaded. Shader files (*.shader, *.hlsl) sit in 30 folders. What should change?",
    "o": [
      "Merge both into the root CLAUDE.md, under separate headings",
      "Put a CLAUDE.md with the shader rules in each of the 30 folders",
      "Add paths: frontmatter, such as **/*.shader, **/*.hlsl",
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
        "text": "30 copies that drift, and a new shader folder starts without one."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Conventions should apply whenever matching files are edited, not when someone remembers a skill."
      }
    },
    "cite": "notes/2026-09-docs-delta §3.1 (rules without paths load at launch); Exam guide §3.3; notes/domain-3 §3.3; LR-0033 (Q24)"
  },
  {
    "id": "C18",
    "ts": "3.3",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3,
      "scope": "shared",
      "trigger": "demand"
    },
    "q": "A 90-line procedure for exporting strings for a new language sits in Localization/CLAUDE.md. The export happens when the producer requests a new language, about every 2 months, and starts from that request, before any file in Localization/ is opened. Meanwhile the procedure loads in each session that touches a string table. Where should it live?",
    "o": [
      "A .claude/rules/ file with paths set to Localization/**",
      "A project skill, /export-language, in .claude/skills/",
      "The root CLAUDE.md, where it loads at session start",
      "Localization/CLAUDE.md as now, with the procedure on top"
    ],
    "a": 1,
    "why": "The procedure is needed when someone decides to start an export, not when a file is read. A folder CLAUDE.md and a paths rule both fire on file access. A project skill fires on demand and is shared through .claude/skills/.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "The same trigger as the folder CLAUDE.md: it fires on file access, not when the export starts."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Fixes the timing by paying for 90 lines in every session, for a task every 2 months."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Still loads only when files there are read, which is after the export has started."
      }
    },
    "cite": "Exam guide §3.2; Exam guide §3.3; notes/domain-3 §3.2, §3.3; LR-0033 (Q25)"
  },
  {
    "id": "C19",
    "ts": "3.1",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2,
      "scope": "personal",
      "trigger": "session"
    },
    "q": "A developer wants Claude to ask before running any Gradle task expected to take more than 5 minutes. They want this in each of the 3 repositories they work in, and their teammates shouldn't be affected. So far they have added the line to a CLAUDE.local.md in 1 of the repositories, and they expect to join 2 more repositories this quarter. They want to set it up once. Where should the instruction live?",
    "o": [
      "In a CLAUDE.local.md in each of the 3 repositories, as they started",
      "In the root CLAUDE.md of each repository, under a heading with their name",
      "In a skill in ~/.claude/skills/ that they run before asking for a build",
      "In their own ~/.claude/CLAUDE.md, which loads in each of their projects"
    ],
    "a": 3,
    "why": "Who: just me. Where: all my repositories. When: every session. That's the user-level ~/.claude/CLAUDE.md.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Works, but CLAUDE.local.md covers one project. Three copies drift, and a fourth repo needs another."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Committed and shared, so every teammate's sessions load it."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "A standing preference should apply in every session, not only when a skill runs."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1; lesson 0023; LR-0031 (F14)"
  },
  {
    "id": "C20",
    "ts": "3.1",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 4,
      "trigger": "session"
    },
    "q": "At the start of each long session, developers paste 6 team rules into the chat, such as 'use the Money type for amounts'. After /compact runs, often about 2 hours in, Claude starts ignoring them. The rules apply to all work in this repository, for every developer. What is the best fix?",
    "o": [
      "Put the 6 rules in the root CLAUDE.md, re-read after /compact",
      "Paste the 6 rules into the chat again whenever /compact has run",
      "Put the 6 rules in a CLAUDE.md file inside the shared Kotlin module",
      "Put the 6 rules in each developer's own CLAUDE.local.md at the root"
    ],
    "a": 0,
    "why": "Instructions given only in chat are lost when the conversation is compacted. The project-root CLAUDE.md is re-read from disk after /compact and is shared with the team, so standing rules belong there.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Repeats the fragile step: instructions given only in chat are lost at the next compaction."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Nested files reload only when files there are read again, and the rules apply to all work."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Personal copies of team rules that drift, and new developers start without them."
      }
    },
    "cite": "notes/2026-09-docs-delta §3.1 (project-root CLAUDE.md survives /compact; chat-only instructions are lost); Exam guide §3.1; notes/domain-3 §3.1"
  },
  {
    "id": "C21",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 3,
      "scope": "shared",
      "trigger": "file"
    },
    "q": "Jetpack Compose screens are named *Screen.kt and live in 40 feature modules. Their 70 lines of UI conventions are in the root CLAUDE.md. A teammate proposes moving them to ui.md with an @ui.md line in the root CLAUDE.md, but most sessions are backend or iOS work. Where should the conventions go?",
    "o": [
      "ui.md, imported from the root CLAUDE.md with @ui.md",
      "A CLAUDE.md in each of the 40 feature modules",
      "A .claude/rules/ file with paths **/*Screen.kt",
      "A /compose-ui skill developers run before UI work"
    ],
    "a": 2,
    "why": "Conventions for one kind of file, spread across 40 modules, should load when Claude reads a matching file. A paths glob does that; an import loads in every session.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Tidier, but an import still loads at launch in each session."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "40 copies that drift, and new modules start without one."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Conventions should apply whenever a screen is edited, not when someone remembers a skill."
      }
    },
    "cite": "Exam guide §3.3; notes/domain-3 §3.3; lesson 0023"
  },
  {
    "id": "C22",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 4,
      "weight": "light",
      "trigger": "prompt"
    },
    "q": "Today a security auditor is pairing with a developer for a single 3-hour session. During that session, Claude should explain each Keychain call it reads or writes in the iOS code. After the session, nothing about the audit should remain in the repository or the developer's setup. How should the developer give Claude the instruction?",
    "o": [
      "In their CLAUDE.local.md, removed after the session",
      "In this session's prompt, at the start",
      "A rules file with paths set to **/*Keychain*.swift",
      "In their ~/.claude/CLAUDE.md, for the rest of today"
    ],
    "a": 1,
    "why": "This instruction is for one session only. The prompt covers that exactly and leaves nothing behind. Every file-based option fires again later.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Standing config for one session, left behind until someone remembers to delete it."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Fires in later sessions whenever those files are read, until it's deleted."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Loads in all their projects, and stays until someone removes it."
      }
    },
    "cite": "Exam guide §3.3; notes/domain-3 §3.1; lesson 0023; LR-0031 (F22)"
  },
  {
    "id": "C23",
    "ts": "3.4",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 1,
      "weight": "heavy"
    },
    "q": "The iOS app's networking layer is used by 70 files. The team must replace it, either by rewriting each call site with async/await or by keeping the old API as an adapter over a new client. The choice changes how 3 shared modules are touched, and nobody has listed which call sites use the retry and caching options. How should Claude Code start?",
    "o": [
      "Direct execution, converting the call sites one module at a time",
      "Direct execution, moving to plan mode if the work becomes complex",
      "Plan mode for 1 call site, then direct execution for the 69 others",
      "Plan mode to map the call sites, compare both approaches and agree one"
    ],
    "a": 3,
    "why": "Many files, two valid approaches and unknown dependencies call for plan mode: explore and design before editing, which avoids costly rework. The complexity is in the stem, so start there.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Starts editing before the approach is chosen, and the choice changes the shared modules."
      },
      "B": {
        "trap": "probabilistic",
        "text": "The complexity is already stated: 70 files, 2 approaches, unmapped options."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Plans one conversion, not the choice between approaches, and one call site won't show the options in use."
      }
    },
    "cite": "Exam guide §3.4; notes/domain-3 §3.4"
  },
  {
    "id": "C24",
    "ts": "3.4",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 1,
      "weight": "light"
    },
    "q": "A crash report shows a force-unwrap failing at line 41 of AmountFormatter.swift when an account's currency code is nil. The team has agreed the fix: fall back to the account's home currency. The formatter is used on every balance screen, about 30 of them. How should Claude Code make the change?",
    "o": [
      "Direct execution with the fallback and a test for a nil currency code",
      "Plan mode, as the formatter is on about 30 balance screens",
      "An Explore subagent mapping the 30 screens first, then plan mode",
      "Plan mode limited to the formatter, then direct execution of the fix"
    ],
    "a": 0,
    "why": "A single-line fix with a clear crash report and an agreed change is direct execution. How widely the formatter is used raises the stakes, not the complexity, and a test covers that.",
    "wrong": {
      "B": {
        "trap": "over-engineered",
        "text": "Reach isn't complexity. The cause, the line and the fix are known."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Investigation for a fix that is already located and agreed."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Planning adds nothing here: the cause, the line and the fix are already agreed."
      }
    },
    "cite": "Exam guide §3.4; notes/domain-3 §3.4; LR-0027 (S24)"
  },
  {
    "id": "C25",
    "ts": "3.5",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2,
      "weight": "heavy"
    },
    "q": "A developer new to payments must add a check that warns when the payee name doesn't match the account. The ticket says only 'add name matching like the other banks'. The developer can't yet say how close a name must be, or what happens with joint and business accounts, which make up 18% of payments. What should they do first?",
    "o": [
      "Give Claude 3 example names along with the result that they should get",
      "Write tests for the exact-match and no-match cases, then build it",
      "Ask Claude to interview them about the matching before writing code",
      "Ask Claude to build it from the ticket, then review what it wrote"
    ],
    "a": 2,
    "why": "When the developer can't yet say what matters, the interview pattern has Claude ask questions that surface the cases they haven't thought of, before implementing.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Examples pin down rules you already know. Here the rules aren't known yet."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Tests the 2 cases they know, and leaves joint and business accounts unexamined."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "The gaps show up after the code is written."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5; LR-0033 (Q29)"
  },
  {
    "id": "C26",
    "ts": "3.5",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 4,
      "weight": "light"
    },
    "q": "Claude is writing a function that formats IBANs for display. The developer knows exactly what the output should look like and described it in prose: 'groups of 4, uppercase, no trailing space'. Across 3 attempts Claude handled short final groups and lowercase input differently each time. What should the developer do next?",
    "o": [
      "Ask Claude to interview them about the formatting rules",
      "Give Claude 3 IBANs and the exact output for each",
      "Reword the prose with more detail and try a 4th attempt at it",
      "Ask Claude to list every IBAN format it knows, then pick"
    ],
    "a": 1,
    "why": "When the developer knows the right output but prose is interpreted inconsistently, 2–3 concrete input/output examples are the most effective specification.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The developer already knows the rules. The problem is that the prose is read inconsistently."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Three rounds of prose have already been read 3 ways."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Adds research when the desired output is already known."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5; lesson 0013"
  },
  {
    "id": "C27",
    "ts": "3.5",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2,
      "weight": "heavy"
    },
    "q": "Claude is rewriting the overdraft fee rule. The team has 12 known cases, including fees capped at 3 per day and accounts that go overdrawn by 1 cent. Over 4 rounds of chat feedback, each fix has broken a case that an earlier round fixed, including the last round, when all 12 cases were pasted in one message. What should the developer do now?",
    "o": [
      "Paste the 12 cases into one message again, with more detail",
      "Ask Claude to interview them about the overdraft rules",
      "Start a fresh session and describe the overdraft fee rule from scratch",
      "Write tests for the 12 cases, then iterate by sharing the failures"
    ],
    "a": 3,
    "why": "When the cases are known and fixes keep breaking each other, test-driven iteration catches each regression: write the tests first, then share the failures.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "That was the last round, and it still broke 2 cases. Nothing checks that earlier cases stay fixed."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "The cases are already known. The problem is regressions between rounds."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Resets the context, but the next round can break a case again."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5"
  },
  {
    "id": "C28",
    "ts": "3.6",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 1
    },
    "q": "A CI job runs claude -p to generate unit tests for changed Kotlin classes. 35% of the generated tests don't compile, because they build objects by hand instead of using the team's test fixtures and builder helpers. Those conventions are written down only in a wiki page. The prompt says 'follow our testing conventions'. What should change?",
    "o": [
      "Put the test conventions and fixture helpers in the project's CLAUDE.md",
      "Retry the job until the generated tests compile, up to 3 times",
      "Make the prompt line stronger: 'you MUST follow our conventions'",
      "Run with --output-format json and drop tests that fail to compile"
    ],
    "a": 0,
    "why": "CLAUDE.md gives CI runs project context, such as testing standards and fixture conventions. Claude can't follow conventions it can't see, and a wiki page isn't loaded.",
    "wrong": {
      "B": {
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
  {
    "id": "C29",
    "ts": "3.6",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 4
    },
    "q": "Another CI job suggests missing tests for the iOS module changed in each pull request. It receives only the diff, and 1 in 3 of its suggestions already exists as an XCTest case in that module, often under a different name. What should change?",
    "o": [
      "Drop suggestions that match an existing test name before posting",
      "List the module's test names in the prompt and ask to skip those",
      "Include the module's existing test files in its context",
      "Run the job with --json-schema to give each suggestion a name"
    ],
    "a": 2,
    "why": "To avoid duplicate test suggestions, give Claude the existing tests in context. It can only skip what it can see.",
    "wrong": {
      "A": {
        "trap": "reactive-too-late",
        "text": "Catches only exact names, after generation, and the stem says many duplicates have different names."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Names alone don't show what each test covers, and the duplicates often have different names."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Structures the output but doesn't tell Claude what exists."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6; LR-0033 (Q30)"
  },
  {
    "id": "C30",
    "ts": "3.6",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 4
    },
    "q": "A nightly job runs claude -p with --output-format json to refactor deprecated API calls, which takes about 15 minutes. The CI runner kills any job that prints nothing for 10 minutes, and a script must parse the final result. The job is now killed most nights before it finishes. What should change?",
    "o": [
      "Use --output-format text, which prints progress as the job runs",
      "Use --output-format stream-json and parse its final event",
      "Drop -p to run interactively, which shows the steps as they happen",
      "Keep json and split the refactor into 2 jobs of about 7 minutes"
    ],
    "a": 1,
    "why": "stream-json streams structured events as the job runs, which keeps the log active, and still ends with a parseable result in its final event. Plain json prints only at the end; text has no parseable result.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Shows progress, but the script loses a parseable result."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Without -p the job waits for input and hangs."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Works around the watchdog by restructuring the task."
      }
    },
    "cite": "notes/domain-3 §3.6 (stream-json: live events plus a parseable final result); notes/2026-09-docs-delta §3.6; Exam guide §3.6"
  }
];

module.exports = { META, Q };
