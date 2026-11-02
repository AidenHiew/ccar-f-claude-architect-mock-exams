# Domain 2: Tool Design & MCP Integration (18%)

## 2.1 Tool interface design

- **Tool descriptions are the primary mechanism for tool selection.** Minimal descriptions ("Retrieves customer information") → unreliable selection among similar tools. The high-leverage first fix is almost always: **expand the descriptions** with input formats, example queries, edge cases, and boundaries ("use this vs that similar tool when…").
- Ambiguous/overlapping descriptions cause misrouting (`analyze_content` vs `analyze_document` with near-identical text). Fixes:
  - **Rename** for specificity (e.g., `analyze_content` → `extract_web_results` with a web-specific description)
  - **Split** generic tools into purpose-specific ones with defined input/output contracts (`analyze_document` → `extract_data_points`, `summarize_content`, `verify_claim_against_source`)
- **System prompt wording can override good descriptions:** keyword-sensitive instructions create unintended tool associations. Review the system prompt when selection misbehaves despite good descriptions.

## 2.2 Structured error responses (MCP)

- MCP uses the **`isError` flag** to signal tool failure back to the agent.
- Error taxonomy: **transient** (timeouts, service unavailable — retryable), **validation** (bad input), **business** (policy violations), **permission**.
- Return structured metadata: `errorCategory`, `isRetryable` boolean, human-readable description. For business-rule violations, include `retriable: false` plus a **customer-friendly explanation** so the agent can communicate appropriately.
- Generic "Operation failed" prevents good recovery decisions; missing `isRetryable` wastes retry attempts on non-retryable errors.
- **Local recovery first:** subagents retry transient failures themselves; propagate to the coordinator only what they can't resolve — with partial results and what was attempted.
- **Empty ≠ error:** distinguish access failures (need a retry decision) from valid empty results (successful query, no matches).

## 2.3 Tool distribution & tool_choice

- **Too many tools degrades selection.** ~4–5 relevant tools per agent beats 18. Agents with out-of-specialty tools tend to misuse them (a synthesis agent attempting web searches).
- **Scoped tool access:** give each agent only its role's tools. For high-frequency cross-role needs, add a **narrow scoped tool** (e.g., `verify_fact` for the synthesis agent handling the 85% simple case) while complex cases still route through the coordinator. This is "least privilege" — the exam rewards it over both full access and pure round-tripping.
- Replace generic tools with constrained alternatives (`fetch_url` → `load_document` that validates document URLs).
- **`tool_choice` options:**
  - `"auto"` — model may call a tool OR return text
  - `"any"` — model MUST call a tool, its choice which (guarantees structured output when multiple schemas exist)
  - `{"type": "tool", "name": "..."}` — forced: model must call that specific tool (e.g., force `extract_metadata` first, then handle later steps in follow-up turns)

## 2.4 MCP server integration in Claude Code

- **Scoping:**
  - Project-level `.mcp.json` — shared team tooling, committed to version control
  - User-level `~/.claude.json` — personal/experimental servers
- **Expanding environment variables** inside `.mcp.json` (e.g., `${GITHUB_TOKEN}`) → credentials without committing secrets.
- Tools from **all configured servers are discovered at connection time and available simultaneously**.
- If the agent prefers built-in tools (Grep) over a more capable MCP tool → **enhance the MCP tool's description** to explain its capabilities and outputs.
- Prefer **existing community MCP servers** for standard integrations (Jira etc.); build custom only for team-specific workflows.
- **MCP resources** expose content catalogs (issue summaries, doc hierarchies, DB schemas) so the agent sees what data exists **without exploratory tool calls**. Rule of thumb: resources = content/catalogs, tools = actions.
- **Full scope list (docs-delta §2.4):** **local** (default; `~/.claude.json`, this project only, not shared) → **project** (`.mcp.json` at repo root, git-shared) → **user** (`~/.claude.json`, all projects) → plugin → claude.ai connectors.
- **Transport:** `claude mcp add [--transport http|sse|stdio] … <name> <url | -- command>` — **stdio is the default when a command is given** (the `--` separator is required before the command).
- **MCP control model (spec):** Resources are **application-driven** (the host decides how to incorporate them), Prompts are **user-controlled**, Tools are **model-controlled**.
- Sampling: server asks the **client** for a model completion, so model access/selection stay client-side and no server-held API key is needed. **Deprecated as of protocol 2026-07-28 (SEP-2577)** — stays in spec ≥12 months; new implementations SHOULD NOT adopt it, existing ones SHOULD call provider APIs directly. (modelcontextprotocol.io/docs/concepts/sampling, fetched 2026-09-16)
- Resources are **application-driven** (host decides how to include them as context); tools are model-invoked actions. Shared read-only record = resource; appending = tool. (modelcontextprotocol.io/docs/concepts/resources)

## 2.5 Built-in tools (Read, Write, Edit, Bash, Grep, Glob)

| Tool | Use for |
|---|---|
| **Grep** | Searching file *contents* — function callers, error messages, imports |
| **Glob** | Finding files by *path/name pattern* — `**/*.test.tsx` |
| **Read / Write** | Full-file operations |
| **Edit** | Targeted modification via **unique text match**; if the anchor text isn't unique, Edit fails → fall back to **Read + Write** |
| **Bash** | Command execution |

- **Incremental exploration beats bulk reading:** Grep to find entry points → Read to follow imports and trace flows. Don't read all files upfront.
- Tracing usage across wrapper modules: identify all exported names first, then search for each name across the codebase.

---

## Exam traps for this domain

| Trap | Correct instinct |
|---|---|
| Misrouting between similar tools → add few-shot examples or a routing layer | First fix the **tool descriptions** (root cause, low effort) |
| One mega-tool or 18 fine-grained tools | 4–5 well-described, purpose-specific tools per agent |
| Generic "search unavailable" errors | Structured: category, retryable flag, what was attempted, partial results |
| Returning empty results as "success" on failure | Never suppress errors; distinguish empty-result-success from access failure |
| Committing tokens in `.mcp.json` | `${ENV_VAR}` expansion |
| Personal experiment in project `.mcp.json` | User scope: `~/.claude.json` |
| Need guaranteed JSON but using `tool_choice: "auto"` | `"any"` (or forced) — auto may return plain text. On Fable 5.1 / Mythos 5.1 those return 400 → `auto` + `strict: true` or native structured outputs |
| HTTP transport for a server launched locally as a command | stdio — the default when `claude mcp add` is given a command |
| Model-invoked tool taking a user ID to gate which data is visible | MCP resources — application-driven |
