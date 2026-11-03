// tutor/build/data/d23d.js — Domains 2 and 3 Paper 4 (sit 2026-10-21): 30 original questions in 3 scenario blocks (6/12/12).
// Allocation in statements.js (d23d): exam-weighted (D2 14 / D3 16), the candidate's pick over weak-row weighting.
// bp.weight / bp.scope / bp.trigger as in d23b.
// Facts only from reference/ccar-f-official-exam-guide.md, notes/, lessons/. bp.rank = measured length rank of the key. Single-answer only.
'use strict';

const META = {
  "key": "d23d",
  "title": "CCA-F Domains 2 and 3 Paper 4",
  "eyebrow": "Domains 2 and 3 · 30 questions · 3 scenarios",
  "intro": "Thirty new exam-level questions on Domains 2 and 3, in three scenario blocks. Every question has one correct answer. Flag questions to return to them before you submit. Labels stay hidden until grading. Sit it once, in exam mode, with the 60-minute timer on.",
  "defaultMode": "exam",
  "timerDefault": true,
  "minutes": 60,
  "storageKey": "ccaf-d23-paper4",
  "blocks": [
    {
      "id": 1,
      "title": "Customer Support Resolution Agent",
      "intro": "You are building a support agent on the Claude Agent SDK for a car-rental company with 140 branches. It answers customers about reservations, rental agreements, extensions, charges and refunds, using MCP tools over the booking system, the fleet system and a payments provider."
    },
    {
      "id": 2,
      "title": "Developer Productivity with Claude",
      "intro": "Your team of 20 engineers maintains an online furniture store: a 7-year-old PHP Laravel codebase of about 3,400 files on MySQL. You own the shared Claude Code setup and the internal agent tooling, from CLAUDE.md files and skills to MCP servers."
    },
    {
      "id": 3,
      "title": "Code Generation with Claude Code",
      "intro": "Your team uses Claude Code on a hospital lab-results platform: Rust services that ingest results from analysers, a TypeScript web portal for clinicians and SQL migrations, about 1,900 files in one repository. You own the Claude Code setup, from CLAUDE.md files and rules to skills and the Claude Code jobs in CI."
    }
  ]
};

const Q = [
  {
    "id": "H01",
    "ts": "2.1",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 2
    },
    "q": "The agent has get_reservation, described as 'Gets a reservation', and get_rental_agreement, described as 'Gets an agreement'. Reservations cover bookings not yet collected; an agreement is created at pickup and holds the fuel, mileage and damage charges. In 21% of chats about charges on a car already collected, the agent calls get_reservation, finds no charges and tells the customer there are none. What should you change first?",
    "o": [
      "Merge them into one get_booking tool that returns the reservation and the agreement together",
      "Rewrite both descriptions to say what each holds and when it exists, naming the other tool",
      "Add a system prompt rule that questions about charges always go to get_rental_agreement",
      "Have get_reservation return an isError result whenever it holds no charges"
    ],
    "a": 1,
    "why": "Tool descriptions are the main input the model uses to pick a tool. Neither description says what the record holds or when it exists, so nothing tells the agent to use the agreement once a car is collected. Expanding both, including when to use the other, fixes the cause first.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "They are different records from different stages. Merging them is a redesign when the descriptions simply don't say which one holds charges."
      },
      "C": {
        "trap": "probabilistic",
        "text": "A keyword rule on top of descriptions that still don't say what each tool holds. Other agreement questions still misroute."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "No charges is a valid result for a booking. The problem is which tool gets picked."
      }
    },
    "cite": "Exam guide §2.1; notes/domain-2 §2.1 (expand descriptions first: inputs, boundaries, when to use each)"
  },
  {
    "id": "H02",
    "ts": "2.1",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 4
    },
    "q": "Two teams added tools to the agent: the payments team's check_status, described as 'Returns the current status', and the fleet team's get_status, described as 'Returns status details'. One reports on a payment or refund, the other on a vehicle. In 38 of 500 chats the agent checked a vehicle when the customer asked whether a refund had gone through. What is the best fix?",
    "o": [
      "Remove the fleet team's tool, and have the agent ask a colleague about vehicles",
      "Add a system prompt line saying refund questions go to check_status",
      "Detect the word refund in code, then force check_status with tool_choice",
      "Rename both by service and describe what each one reports on"
    ],
    "a": 3,
    "why": "Two tools with near-identical names and descriptions can't be told apart. Names that say which service and record each covers, with descriptions to match, remove the ambiguity where the model reads it.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Takes away a tool the agent needs, to fix a naming problem."
      },
      "B": {
        "trap": "probabilistic",
        "text": "The two names and descriptions still say the same thing, so the rule has to beat the tool list on every call."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Keyword detection in code to force one tool, when the clash is in the names and descriptions."
      }
    },
    "cite": "notes/2026-09-docs-delta §2.1 (namespace tool names; detailed descriptions); notes/domain-2 §2.1 (rename for specificity)"
  },
  {
    "id": "H03",
    "ts": "2.2",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 2
    },
    "q": "extend_rental fails when the car is booked by another customer from the next morning. Today it returns isError with the text 'Request failed'. In 1 week the agent retried 63 such extensions 3 times each, then told customers the system was down. What should the tool return?",
    "o": [
      "isError, category 'business', isRetryable false, and when the car is next booked",
      "isError with errorCategory 'transient' and isRetryable true, plus a 30-second wait",
      "A normal result with extended set to false and no error flag",
      "isError with 'Request failed', and a prompt rule to retry no more than once"
    ],
    "a": 0,
    "why": "A booking clash is a business-rule failure: retrying won't change it. A category, isRetryable false and a reason the agent can explain let it stop retrying and offer another car or an earlier return.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "Marks a fixed booking clash as temporary, which is the retry loop it already has."
      },
      "C": {
        "trap": "error-suppression",
        "text": "Hides the failure, and still gives no reason the agent can pass on."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Fewer retries, but the agent still can't tell the customer why or offer another car."
      }
    },
    "cite": "Exam guide §2.2; notes/domain-2 §2.2 (errorCategory, isRetryable, customer-friendly reason)"
  },
  {
    "id": "H04",
    "ts": "2.3",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 2
    },
    "q": "Every chat must end with a case log for reporting, written by one of 3 tools: log_resolved, log_escalated or log_abandoned. The closing request is sent with only those 3 tools attached and tool_choice set to auto. In 7% of chats the agent ends with a goodbye message and no log. Which of the 3 to call depends on how the chat went. What should the closing request use?",
    "o": [
      "tool_choice set to type tool, with name log_resolved, on that request",
      "tool_choice left at auto, with a prompt line saying always finish with a log",
      "tool_choice set to any on the closing request that carries the 3 log tools",
      "tool_choice set to none, with code writing the log from the transcript"
    ],
    "a": 2,
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
      "D": {
        "trap": "wrong-problem",
        "text": "none stops tool calls altogether, and code would have to guess the outcome the agent judged."
      }
    },
    "cite": "Exam guide §2.3; notes/2026-09-docs-delta §2.3 (auto / any / tool / none); notes/domain-2 §2.3"
  },
  {
    "id": "H05",
    "ts": "2.3",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 1,
      "weight": "heavy"
    },
    "q": "The agent has send_sms, which can text any phone number with any message. It is meant only for sending customers their own pickup details. In 2,000 chats it twice texted a number the customer typed in, and once included a card's last 4 digits in the message. Compliance wants it unable to text anyone but the customer on the reservation, or anything but the pickup details. What is the best fix?",
    "o": [
      "Add a PreToolUse hook that blocks send_sms when the number isn't the one on the reservation",
      "Replace send_sms with a notify_pickup tool that takes only a reservation ID and texts the standard pickup message to its phone",
      "Add a system prompt rule to text only the number on the reservation, with the pickup details",
      "Log every send_sms call and have compliance review the log at the end of each week"
    ],
    "a": 1,
    "why": "The tool can do far more than the job. A tool that takes only a reservation ID and sends the fixed pickup text to the phone on file makes other recipients and other content impossible. The hook covers the number but not what the message says.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Stops other recipients, but send_sms can still send any content to the right number."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Leaves the broad tool in place and relies on the model following a rule it already breaks."
      },
      "D": {
        "trap": "reactive-too-late",
        "text": "Finds the bad texts after customers and strangers have received them."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3 (constrained alternatives, least privilege)"
  },
  {
    "id": "H06",
    "ts": "2.3",
    "s": "cs",
    "block": 1,
    "bp": {
      "rank": 1,
      "weight": "light"
    },
    "q": "Last month an engineer set tool_choice to any on every request, after the agent twice quoted a charge without looking up the booking. Since then, when a customer's first message is unclear, such as 'my car', the agent calls get_reservation with a guessed ID instead of asking which booking they mean, and even 'thanks, that's all' triggers a lookup. Wrong lookups rose from 1% to 6% of chats. What should change?",
    "o": [
      "Keep any, and have get_reservation return isError for unknown IDs",
      "Keep any, and add a prompt rule to ask before looking anything up",
      "Force get_reservation on the first request of every chat",
      "Go back to auto for every ordinary turn, as it was before last month"
    ],
    "a": 3,
    "why": "any forces a tool call on every request, so the agent can never reply in text, even to ask a question or say goodbye. auto lets it call a tool or reply. A tool should be forced only on a step that must call one, not on every turn to fix 2 bad quotes.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Flags the bad guess after it is made, and the agent still can't reply in text, to ask or to close the chat."
      },
      "B": {
        "trap": "probabilistic",
        "text": "any still requires a tool call on every turn, so the rule can't be followed by asking in text."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Makes the guessed lookup certain, on the turn where it does the most harm."
      }
    },
    "cite": "Exam guide §2.3; notes/domain-2 §2.3 (auto: tool or text; any: must call a tool)"
  },
  {
    "id": "H07",
    "ts": "2.1",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 4
    },
    "q": "Your in-house MCP server has query_orders, which takes a filter string in the team's own syntax, such as status:shipped AND total:500+. Its description already names every field and operator. In 40 sessions, 11 of its calls used SQL syntax such as WHERE status = 'shipped' and came back with a parse error. What should you add first?",
    "o": [
      "input_examples in the tool definition, with 3 valid filter strings",
      "A retry that resends each failed call with the parse error, up to 3 times",
      "SQL support in the server, translated into the team syntax before parsing",
      "A new tool name, query_orders_custom_syntax, with the description unchanged"
    ],
    "a": 0,
    "why": "For a tool with an unusual input format, schema-valid input_examples show the model exactly what a correct call looks like. The description already lists the fields; what's missing is a worked call.",
    "wrong": {
      "B": {
        "trap": "reactive-too-late",
        "text": "Fixes calls after they fail, every time, instead of showing the right syntax up front."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Builds a second parser instead of showing the model the one syntax it should use."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Hints that the syntax is unusual but doesn't show what a correct call looks like."
      }
    },
    "cite": "notes/2026-09-docs-delta §2.1 (input_examples: schema-valid examples for complex tools)"
  },
  {
    "id": "H08",
    "ts": "2.2",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1
    },
    "q": "The get_stock_history tool on your MCP server takes dates as YYYY-MM-DD. When an engineer's agent passes 03/11/2026, the tool returns isError with the text 'Operation failed'. In 25 sessions the agent then gave up and told the engineer the stock service was down. What should the tool return for a bad date?",
    "o": [
      "isError with errorCategory 'transient' and isRetryable set to true",
      "An empty history, as if no stock moved on that date",
      "isError with errorCategory 'validation', naming the field and the format it expects",
      "isError with 'Operation failed', plus a prompt rule that dates use YYYY-MM-DD"
    ],
    "a": 2,
    "why": "A generic failure gives the agent nothing to act on, so it assumes an outage. A validation category that names the field and the expected format tells it the input was wrong and how to correct it before calling again.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Says the same bad date might work later, so the agent retries an input that will never parse."
      },
      "B": {
        "trap": "error-suppression",
        "text": "Turns a bad input into a false 'nothing happened'."
      },
      "D": {
        "trap": "probabilistic",
        "text": "Might prevent some bad dates, but when one gets through the agent still can't tell what went wrong."
      }
    },
    "cite": "Exam guide §2.2; notes/domain-2 §2.2 (error taxonomy: transient, validation, business, permission)"
  },
  {
    "id": "H09",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 3,
      "scope": "personal"
    },
    "q": "The project's committed .mcp.json defines a server named shop-db that points at the shared staging database. One engineer wants their sessions in this repository to use their own local database instead, without changing the committed file or anyone else's setup. Their 2 other projects should be unaffected. What should they do?",
    "o": [
      "Edit the url in .mcp.json on their machine and simply never commit that change",
      "Add their own shop-db server at user scope in ~/.claude.json",
      "Add a line to CLAUDE.local.md telling Claude to use their database",
      "Add their own shop-db server at local scope for this project"
    ],
    "a": 3,
    "why": "Same-named servers resolve by scope: local first, then project, then user. A local-scope server is stored for this project only and isn't shared, so it overrides the team's entry for this engineer alone.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Works until the change is committed or overwritten by a pull, and their copy of a shared file now differs."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Project scope wins over user scope for the same name, so the staging server is still used here."
      },
      "C": {
        "trap": "probabilistic",
        "text": "An instruction can't change which server a tool connects to."
      }
    },
    "cite": "notes/2026-09-docs-delta §2.4 (scopes and precedence: local → project → user)"
  },
  {
    "id": "H10",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 2,
      "scope": "shared"
    },
    "q": "Your committed .mcp.json points the catalog server at the team's shared catalog API through a hard-coded url. 3 engineers who work on the catalog want to point it at their own local API while they work, and everyone else should keep the shared one with no setup. Today those 3 edit the file and keep forgetting to undo it. What should the url be?",
    "o": [
      "${CATALOG_URL}, with every engineer setting it in their own shell",
      "${CATALOG_URL:-https://catalog.internal}, with the shared API as the default",
      "The shared API, plus a same-named server in the 3 engineers' ~/.claude.json",
      "The shared API, plus a committed .mcp.local.json that Claude Code reads first"
    ],
    "a": 1,
    "why": "${VAR:-default} expands to the variable when it is set and to the default otherwise. Engineers who set CATALOG_URL get their own API; everyone else gets the shared one, with no setup and no edits to the committed file.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Everyone now needs setup, and the server fails for anyone who hasn't set it."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Project scope wins over user scope for the same name, so the shared API is still used."
      },
      "D": {
        "trap": "nonexistent-feature",
        "text": "There is no .mcp.local.json override file."
      }
    },
    "cite": "notes/2026-09-docs-delta §2.4 (${VAR} and ${VAR:-default} expansion in url)"
  },
  {
    "id": "H11",
    "ts": "2.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 4,
      "scope": "personal"
    },
    "q": "An engineer has written a lint MCP server that runs on their machine with node tools/lint-server.js. They want it in this repository's sessions only, and the 7 teammates on their squad shouldn't see it. They ran claude mcp add --scope project --transport http lint node tools/lint-server.js. The server failed to connect, and the command also added an entry to .mcp.json. Which command should they have run?",
    "o": [
      "claude mcp add lint -- node tools/lint-server.js",
      "claude mcp add --scope user lint -- node tools/lint-server.js",
      "claude mcp add --scope project lint -- node tools/lint-server.js",
      "claude mcp add --transport http lint http://localhost:3000"
    ],
    "a": 0,
    "why": "With no --scope, claude mcp add stores the server at local scope: this project only, not shared. Given a command after the -- separator, it uses stdio, the default for a server started as a local command.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "Right transport, but user scope adds it to every one of their projects."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Fixes the transport, but project scope still writes it to the shared .mcp.json."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Right scope, but the server is started as a command, not served over HTTP."
      }
    },
    "cite": "notes/2026-09-docs-delta §2.4 (local is the default scope; stdio is the default when a command is given; -- before the command)"
  },
  {
    "id": "H12",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 4
    },
    "q": "Before a redesign, an engineer wants a list of every Blade view used in checkout. The 3,400 files include about 600 views, and the checkout ones sit in 9 different folders but all end in .blade.php and have checkout in the file name. They need the paths, not the contents. Which approach fits best?",
    "o": [
      "Grep for the word checkout across all of the .blade.php files",
      "Read the main views folder, then each of the 9 folders in turn",
      "Glob with the pattern **/*checkout*.blade.php",
      "Bash with ls on each of the 9 folders that hold checkout views"
    ],
    "a": 2,
    "why": "The question is about file names, and the names follow a pattern. Glob matches paths by pattern across every folder and returns just the paths; Grep searches contents.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Searches contents, so it also returns every view that merely links to checkout."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "Reads contents to answer a question about names."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Needs the 9 folders known in advance and misses any added later."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5 (Glob for path/name patterns)"
  },
  {
    "id": "H13",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 2
    },
    "q": "A teammate's agent searches the codebase by running grep -rn through Bash. Each search stops to ask the engineer for permission, about 30 times in a typical session, and engineers have started approving without reading. The agent only needs to find text in files inside the repository. What should change?",
    "o": [
      "Add an allow rule for every Bash command in the project's shared settings file",
      "Run the agent in bypassPermissions mode, but only while it is searching",
      "Have it Read every file in the folder, one by one, instead of searching",
      "Switch to the built-in Grep tool for searching files inside the repository"
    ],
    "a": 3,
    "why": "Read-only tools such as Grep, Glob and Read don't prompt inside the working directory, while Bash prompts outside a small read-only allowlist. Searching file contents is Grep's job anyway.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Removes the prompt by allowing every shell command, far more than searching needs."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Turns off every permission check to save a prompt on a read-only search."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "Bulk reading in place of a search, with far more context used."
      }
    },
    "cite": "notes/2026-09-docs-delta §2.5 (read-only tools never prompt in the working directory; Bash prompts)"
  },
  {
    "id": "H14",
    "ts": "2.5",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 4
    },
    "q": "Customers report the message 'Your basket was updated because an item sold out' when nothing sold out. The team doesn't know which of the 3,400 files produces it, and the code around it could use any names. An engineer asks the agent to find where the message comes from. What should the agent do first?",
    "o": [
      "Glob for files with basket in their names, then Read each of them",
      "Grep for the exact message text, then Read around each match",
      "Read the basket controller and follow its calls until the text turns up",
      "Bash, running git log for the last 30 days on the basket folder"
    ],
    "a": 1,
    "why": "Grep searches file contents, which is where a message lives. Matching the exact text finds every place it is produced, and Read on each match shows the condition behind it.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Guesses from file names; the text could live in a language file or a service with any name."
      },
      "C": {
        "trap": "probabilistic",
        "text": "Assumes where it lives and reads until it appears."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Finds recent changes, not where the text is produced today."
      }
    },
    "cite": "Exam guide §2.5; notes/domain-2 §2.5 (Grep for contents such as error messages)"
  },
  {
    "id": "H15",
    "ts": "3.1",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1,
      "scope": "shared",
      "trigger": "session"
    },
    "q": "The root CLAUDE.md says 'Store prices as integers in pence'. The team that owns app/Legacy/ added app/Legacy/CLAUDE.md saying 'Prices here are decimals in pounds', expecting it to replace the root rule inside that folder. When Claude edits files in app/Legacy/, 1 in 4 of its changes now mixes the two formats. What should the team change?",
    "o": [
      "Reword the root rule to name app/Legacy/ as the exception, with its own format",
      "Add override: true to the frontmatter of app/Legacy/CLAUDE.md",
      "Move the legacy rule into the root CLAUDE.md, under an app/Legacy heading",
      "Put the legacy rule in a CLAUDE.local.md inside app/Legacy/ instead"
    ],
    "a": 0,
    "why": "CLAUDE.md files are concatenated, not overridden: in app/Legacy/, Claude reads the root file and the folder file together and sees 2 rules that contradict each other. Making them agree, with the root rule naming the exception, removes the conflict.",
    "wrong": {
      "B": {
        "trap": "nonexistent-feature",
        "text": "There is no override setting. Both files load, and their contents are combined."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The 2 contradicting rules still load together, and the heading leaves Claude to work out which applies."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Personal and kept out of git, and it still loads alongside the root rule."
      }
    },
    "cite": "notes/2026-09-docs-delta §3.1 (contents are concatenated, not overridden); notes/domain-3 §3.1"
  },
  {
    "id": "H16",
    "ts": "3.2",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1
    },
    "q": "The repository has had .claude/commands/release.md for 2 years. Last week an engineer added .claude/skills/release/SKILL.md with a new 9-step release process, meant as a draft for review. Since then, everyone who types /release gets the new steps. Why?",
    "o": [
      "The file that was modified most recently is the one a command runs",
      "Files in .claude/commands/ stopped working once skills were introduced",
      "A skill and a command with the same name both create /release, and the skill wins",
      "Claude invoked the skill on its own because its description mentions releases"
    ],
    "a": 2,
    "why": "Custom commands have been merged into skills: .claude/commands/release.md and .claude/skills/release/SKILL.md both create /release, and the skill wins on a name conflict. Until it is approved, the draft needs a different name.",
    "wrong": {
      "A": {
        "trap": "nonexistent-feature",
        "text": "File dates play no part. Skills and commands have a fixed rule for a name clash."
      },
      "B": {
        "trap": "nonexistent-feature",
        "text": "Old command files still work. This one is shadowed by a skill with the same name."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "People typed /release themselves. The question is which file that name runs."
      }
    },
    "cite": "notes/2026-09-docs-delta §3.2 (commands merged into skills; the skill wins on a name conflict)"
  },
  {
    "id": "H17",
    "ts": "3.2",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1,
      "scope": "shared",
      "trigger": "demand"
    },
    "q": "The project CLAUDE.md holds a 110-line procedure for importing a supplier's new catalogue, which happens about once a month when a buyer sends a spreadsheet. The procedure loads in every session, including the 95% that never touch an import. Any engineer may be asked to run it. Where should the procedure live?",
    "o": [
      "A .claude/rules/ file with paths set to app/Imports/**",
      "A CLAUDE.md inside app/Imports/, next to the import code",
      "In each engineer's ~/.claude/skills/, copied from a shared doc",
      "A project skill in .claude/skills/ that runs on a buyer's request"
    ],
    "a": 3,
    "why": "The import starts when a buyer sends a spreadsheet and someone decides to run it, not when a file is read. A project skill loads on demand and is shared through the repository, and the 110 lines leave every other session.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Loads when import files are read, not when a buyer's request starts the work."
      },
      "B": {
        "trap": "wrong-problem",
        "text": "The same file-access trigger: it loads only once that folder is touched."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Right trigger, but personal copies drift for a procedure the whole team shares."
      }
    },
    "cite": "notes/domain-3 §3.2 (skills on demand vs CLAUDE.md always loaded); notes/2026-09-docs-delta §3.2"
  },
  {
    "id": "H18",
    "ts": "3.4",
    "s": "dp",
    "block": 2,
    "bp": {
      "rank": 1,
      "weight": "heavy"
    },
    "q": "The team must move from Laravel's old queue driver to a new one. The change touches about 70 job classes across 12 modules, and there are 2 ways to handle jobs already in the queue during the switch, each with different risks. Nothing has been changed yet. How should the engineer start?",
    "o": [
      "Plan mode first, and make edits once 1 of the 2 approaches is agreed",
      "Direct execution, converting the job classes one module at a time",
      "Direct execution on 1 module, then decide the rest from how it goes",
      "An Explore subagent that reads all 70 job classes and reports back"
    ],
    "a": 0,
    "why": "The complexity is clear from the start: many files and 2 valid approaches with different risks. Plan mode explores and agrees an approach before any edits, which avoids reworking 70 files.",
    "wrong": {
      "B": {
        "trap": "wrong-problem",
        "text": "Starts editing before choosing how to handle the jobs already queued."
      },
      "C": {
        "trap": "probabilistic",
        "text": "The complexity is already known: 70 jobs and 2 options with different risks."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Gathers facts but doesn't choose between the 2 approaches or plan the change."
      }
    },
    "cite": "Exam guide §3.4; notes/domain-3 §3.4 (plan mode when complexity is already evident)"
  },
  {
    "id": "H19",
    "ts": "3.1",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 4,
      "trigger": "prompt"
    },
    "q": "This afternoon, one developer is fixing a bug in the legacy HL7 parser, which only builds with cargo test --features legacy-hl7. No other task this month needs the flag, and nobody else is working on the parser. They want Claude to use the flag for every test run in this session. Tomorrow's merge removes the legacy build, and from then on the flag breaks every test run. Where should the instruction go?",
    "o": [
      "In the root CLAUDE.md, under a heading for the HL7 parser",
      "In a CLAUDE.local.md file at the repository root",
      "In the prompt at the start of this session",
      "In a .claude/rules/ file with paths set to services/hl7/**"
    ],
    "a": 2,
    "why": "One developer, one session, one task: the prompt is the lightest place, and it ends with the session. Every file-based option keeps loading after the fix is done.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "Loads in every developer's sessions, and a heading doesn't limit where it applies."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Keeps loading in all their sessions here after tomorrow's merge, when the flag breaks every test run."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Lasts beyond today and applies to anyone who touches the parser."
      }
    },
    "cite": "Exam guide §3.1; notes/domain-3 §3.1"
  },
  {
    "id": "H20",
    "ts": "3.1",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2
    },
    "q": "services/ingest/CLAUDE.md contains the line @docs/error-codes.md, meant to import the shared list at the repository root, docs/error-codes.md. When Claude works in services/ingest, it doesn't know any of the 40 error codes. /memory shows services/ingest/CLAUDE.md loaded but no error-codes file. What is the most likely cause?",
    "o": [
      "Imports only work in the root CLAUDE.md and are ignored in nested files",
      "The path is resolved from services/ingest/, not the repository root",
      "Imported files longer than 30 lines are skipped, without a warning",
      "The import is past the maximum depth of 4 hops for imports"
    ],
    "a": 1,
    "why": "Relative paths in an @import resolve against the file that contains them. From services/ingest/CLAUDE.md, @docs/error-codes.md points at services/ingest/docs/error-codes.md. Writing @../../docs/error-codes.md fixes it.",
    "wrong": {
      "A": {
        "trap": "nonexistent-feature",
        "text": "Any CLAUDE.md can import other files."
      },
      "C": {
        "trap": "nonexistent-feature",
        "text": "No such limit exists."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "This is a single import from one file, 1 hop deep."
      }
    },
    "cite": "notes/2026-09-docs-delta §3.1 (imports resolve against the importing file; max depth 4 hops)"
  },
  {
    "id": "H21",
    "ts": "3.2",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 3
    },
    "q": "The team's /new-migration skill creates a SQL migration file and its test. Its SKILL.md says 'Name the migration add_column', and developers edit that line before each use, 3 or 4 times a week. Twice last month someone committed the edited SKILL.md by mistake. What should change?",
    "o": [
      "Add argument-hint: [name] to the frontmatter and keep the fixed name",
      "Copy the skill into each developer's ~/.claude/skills/ to edit freely",
      "Set context: fork in the frontmatter and keep editing the name line",
      "Put $ARGUMENTS where the name goes and run /new-migration add_units"
    ],
    "a": 3,
    "why": "Skills take arguments: $ARGUMENTS in SKILL.md is replaced by whatever follows the command. The name is passed at each use and the file never changes.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "The hint shows what to type after the command, but the body still says add_column."
      },
      "B": {
        "trap": "symptom-fix",
        "text": "Avoids bad commits, but everyone still edits a file before each use, and the copies drift."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "fork runs the skill in a separate context; it has nothing to do with passing a name."
      }
    },
    "cite": "notes/2026-09-docs-delta §3.2 (arguments: $ARGUMENTS, $0/$1, $name)"
  },
  {
    "id": "H22",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 3,
      "trigger": "file"
    },
    "q": "A rules file, .claude/rules/rust-errors.md, has paths set to services/*.rs. The 6 Rust services keep their code in folders such as services/ingest/src/parser.rs. In 2 weeks the rule loaded 0 times, even in sessions that edited Rust files. What should paths be?",
    "o": [
      "services/**/*.rs",
      "services/*/*.rs",
      "services/ingest/src/*.rs",
      "Remove paths and load the rule at launch"
    ],
    "a": 0,
    "why": "* matches within one folder level; **/ matches any number of folders. services/**/*.rs matches every .rs file under services/, however deep.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Matches one folder down, such as services/ingest/main.rs, but not services/ingest/src/parser.rs."
      },
      "C": {
        "trap": "symptom-fix",
        "text": "Fixes one service and misses the other 5."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Loads the Rust rule in every session, including portal work."
      }
    },
    "cite": "notes/domain-3 §3.3 (paths globs such as **/*.test.tsx); notes/2026-09-docs-delta §3.3"
  },
  {
    "id": "H23",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 1,
      "trigger": "file"
    },
    "q": "Each of the 6 services keeps SQL migrations in its own migrations/ folder, and the portal has 1 more, 7 folders in all. The migration conventions sit as a copy in a CLAUDE.md inside each migrations/ folder, and 3 of the 7 copies now differ. New services are added about twice a year. Where should the conventions live?",
    "o": [
      "Keep the 7 CLAUDE.md files, and add a CI check that they match",
      "One section of the root CLAUDE.md, headed Migrations",
      "One rule file in .claude/rules/ with paths set to **/migrations/*.sql",
      "A project skill, /migration-rules, run before writing a migration"
    ],
    "a": 2,
    "why": "One rules file with a glob loads whenever a matching file is read, wherever it sits, and covers new services without another copy. Per-folder copies drift; a root section loads everywhere.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Catches drift after it happens and still needs a new copy for each new service."
      },
      "B": {
        "trap": "probabilistic",
        "text": "Loads in every session, and the heading relies on Claude working out when it applies."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Conventions should apply whenever a migration file is edited, not when someone remembers a skill."
      }
    },
    "cite": "Exam guide §3.3; notes/domain-3 §3.3 (glob rules for files spread across many directories)"
  },
  {
    "id": "H24",
    "ts": "3.3",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 3,
      "trigger": "demand"
    },
    "q": "When a lab manager asks for corrected results to be re-sent to a clinic, about 3 times a month, a developer follows a 70-line procedure kept in .claude/rules/resend.md with paths set to services/resend/**. Its first 4 steps check the clinic's contact record in the portal database, so Claude often starts them without the procedure loaded. Any developer may be asked to do a re-send. What is the best home for the procedure?",
    "o": [
      "Widen paths to the portal's database files, as well as services/resend/**",
      "A committed project skill that runs for each re-send request",
      "Remove paths and let the rule load at launch in every session",
      "A skill in each developer's own ~/.claude/skills/ folder"
    ],
    "a": 1,
    "why": "The work starts when someone asks for a re-send, not when a file is read. A project skill loads on demand and is shared through the repository; a paths rule waits for a matching file and loads during unrelated edits.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Loads it in more unrelated sessions and still waits for a file to be read."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Pays for 70 lines in every session for a task done 3 times a month."
      },
      "D": {
        "trap": "symptom-fix",
        "text": "Right trigger, but personal copies drift for a procedure the whole team uses."
      }
    },
    "cite": "notes/domain-3 §3.2, §3.3; notes/2026-09-docs-delta §3.2, §3.3"
  },
  {
    "id": "H25",
    "ts": "3.4",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2,
      "weight": "light"
    },
    "q": "Clinicians report that the portal shows results dated 1 day early for samples taken after 23:00. The stack trace and a failing test both point to formatResultDate in portal/src/dates.ts, which drops the time zone before formatting. The fix is a single line, and the team agrees on it. How should the developer run this?",
    "o": [
      "Plan mode, to review every date function in the portal first",
      "An Explore subagent to map date handling across the portal",
      "Plan mode for the fix, then direct execution for the test",
      "Direct execution of the fix, with a test for a 23:30 sample"
    ],
    "a": 3,
    "why": "A single-file fix with a clear cause and an agreed change is what direct execution is for. Plan mode adds cost without reducing any risk here.",
    "wrong": {
      "A": {
        "trap": "over-engineered",
        "text": "Planning for a one-line fix whose cause is already known."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Discovery work for a cause the stack trace already gives."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Splits a one-line change into phases with nothing to plan."
      }
    },
    "cite": "Exam guide §3.4; notes/domain-3 §3.4 (direct execution for simple, well-scoped changes)"
  },
  {
    "id": "H26",
    "ts": "3.5",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 2
    },
    "q": "A developer has asked Claude 3 times, in prose, to format reference ranges for the portal the way clinicians expect. Each attempt handled a range like 3.5 to 5.0 differently: once as 3.5-5.0, once as 3.5 - 5, once dropping the trailing zero. Open-ended ranges such as over 60 also came out 3 different ways. What should the developer do next?",
    "o": [
      "Give 3 ranges with the exact text each should become, 1 open-ended",
      "Rewrite the prose request in much more detail and try a 4th attempt",
      "Ask Claude to interview them about range formats before coding",
      "Write the formatter by hand, then ask Claude to review it"
    ],
    "a": 0,
    "why": "When prose is read inconsistently, 2 to 3 concrete input and output examples are the most effective way to pin down a transformation.",
    "wrong": {
      "B": {
        "trap": "symptom-fix",
        "text": "Prose is what's being read inconsistently."
      },
      "C": {
        "trap": "wrong-problem",
        "text": "The developer already knows the format. The problem is conveying it exactly."
      },
      "D": {
        "trap": "wrong-problem",
        "text": "Gives up on the tool instead of fixing how the format is specified."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5 (concrete input/output examples)"
  },
  {
    "id": "H27",
    "ts": "3.5",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 3
    },
    "q": "The ingest service's new parser handles 98% of analyser messages, but it crashes on results whose units field is empty. The developer has told Claude twice to handle empty units properly, and each fix changed how valid units are parsed instead. They have 1 real message that crashes it and know the output it should give. What should they give Claude?",
    "o": [
      "A third prose request that names the units field explicitly",
      "All 2,000 of yesterday's messages, with a request to fix any that fail",
      "That message as a test case, with the output it should produce",
      "A request to wrap the parser in a catch that skips bad messages"
    ],
    "a": 2,
    "why": "For an edge-case bug, a specific test case with the example input and the expected output shows exactly what correct means, and it stays as a check that the fix holds.",
    "wrong": {
      "A": {
        "trap": "symptom-fix",
        "text": "Prose has already failed twice to pin down the case."
      },
      "B": {
        "trap": "over-engineered",
        "text": "Floods the context with messages that already parse."
      },
      "D": {
        "trap": "error-suppression",
        "text": "Drops lab results instead of parsing them."
      }
    },
    "cite": "notes/domain-3 §3.5 (edge-case bugs: a specific test case with example input and expected output)"
  },
  {
    "id": "H28",
    "ts": "3.5",
    "s": "cc",
    "block": 3,
    "bp": {
      "rank": 1,
      "weight": "light"
    },
    "q": "After a release, a developer found 3 problems in the portal: a misspelt column header on the results page, a slow query on the audit screen and a broken link in the help footer. They are in different files and don't affect each other. The developer wants each fix checked before moving on. How should they raise them with Claude?",
    "o": [
      "All 3 in one detailed message, handled as a single task",
      "Separately and in turn, checking each of the 3 fixes first",
      "In 3 parallel sessions, all started at the same time",
      "The slow query in plan mode, then the other 2 together"
    ],
    "a": 1,
    "why": "Independent problems are best fixed one at a time; one detailed message is for problems that interact. Raising them in turn lets each fix be checked before the next.",
    "wrong": {
      "A": {
        "trap": "wrong-problem",
        "text": "One message suits problems that interact. These don't, and each is to be checked in turn."
      },
      "C": {
        "trap": "over-engineered",
        "text": "Three setups for three small, separate fixes, and none is checked before the next starts."
      },
      "D": {
        "trap": "over-engineered",
        "text": "Plans a fix nobody has shown is complex, and still bundles the other 2."
      }
    },
    "cite": "Exam guide §3.5; notes/domain-3 §3.5 (independent problems → sequential; interacting → one message)"
  },
  {
    "id": "H29",
    "ts": "3.6",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 4,
      "weight": "light"
    },
    "q": "A CI job runs claude 'summarise the migrations in this PR' on each pull request. The job never finishes and is killed by the 20-minute timeout, even on PRs with 1 migration. Run by hand in a terminal, the same command prints a summary within a minute. What should change?",
    "o": [
      "Add the -p flag for non-interactive mode",
      "Set CLAUDE_HEADLESS=true in the job's environment",
      "Pipe the PR diff into the command's standard input",
      "Raise the job's timeout, from 20 to 60 minutes"
    ],
    "a": 0,
    "why": "Without -p, Claude Code starts an interactive session and waits for input that never comes in CI. -p runs the prompt, prints the result and exits.",
    "wrong": {
      "B": {
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
  {
    "id": "H30",
    "ts": "3.6",
    "s": "ci",
    "block": 3,
    "bp": {
      "rank": 1
    },
    "q": "A CI job uses one claude -p session to write a fix for each failing test and then, in the same session, review the fix before it is pushed. Over 50 fixes the review approved 49, and engineers later reverted 9 of them. The review prompt already asks for a critical, line-by-line check. What should change?",
    "o": [
      "Make the review prompt stricter, with the 9 reverted fixes as examples",
      "Ask the same session to review each fix twice before approving it",
      "Use --output-format json and block fixes the review scores below 8",
      "Do the review in a second claude -p instance that didn't write the fix"
    ],
    "a": 3,
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
      "C": {
        "trap": "wrong-problem",
        "text": "Changes the format of the verdict, not who gives it."
      }
    },
    "cite": "Exam guide §3.6; notes/domain-3 §3.6 (independent review instance)"
  }
];

module.exports = { META, Q };
