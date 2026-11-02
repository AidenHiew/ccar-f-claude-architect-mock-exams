// tutor/build/data/d2.js — Domain 2 exam-style drill: 11 original questions (18% of a 60-question paper).
// Allocation in statements.js (d2). Facts only from reference/ccar-f-official-exam-guide.md §2.1–2.5 and
// notes/domain-2-tool-design-mcp.md. bp.rank = required length rank of the correct option (1 longest … 4 shortest).
// 2026-10-16: served 2026-10-09, then failed the later purpose-clause gate (keys 2/11 vs distractors 12/33).
// The candidate chose the exam-best fix: D09's three distractors lost their "so that" clauses (D09 was solvable by
// striking clause-padded options). Now 2/11 vs 9/33, gate passes; served version is in git history (fac4a26).
// 2026-11-02: failed the trailing-clause gate (keys 0/11 vs distractors 4/33). D09 B's ", leaving …" became "; … is then",
// same meaning and length band. Now 0/11 vs 3/33.
'use strict';

const META = {
  key: 'd2',
  title: 'CCA-F Domain 2 Drill',
  eyebrow: 'Tool Design and MCP Integration · 11 questions',
  intro: 'Eleven exam-style questions on Domain 2, the share of a 60-question paper it carries at 18%. Weighted toward the two objectives that scored 0% on attempt 1: tool descriptions (2.1) and tool_choice and sequencing (2.3). Exam mode, 22 minutes, matches the real per-question pace.',
  defaultMode: 'exam',
  timerDefault: true,
  minutes: 22,
  storageKey: 'ccaf-d2-drill',
};

const Q = [
  // ───────────────────────── Customer Support Resolution Agent ─────────────────────────
  {
    id: 'D01', ts: '2.1', s: 'cs', bp: { rank: 1 },
    q: "Your support agent has two MCP tools: lookup_order, described as 'Looks up an order', and search_orders, described as 'Searches orders'. Over 2,000 conversations, 9% of lookup_order calls fail validation because the agent passes a customer email or a value like '#A1042' instead of the 10-character order ID. When it does have an email, it rarely uses search_orders. What change most directly addresses the root cause?",
    o: [
      "Rewrite both descriptions: lookup_order states the exact ID format with an example and says to use search_orders when only an email or name is known; search_orders states its inputs and that it returns candidate IDs",
      "Add server-side normalization to lookup_order that strips '#' and other symbols and, when it receives an email address, quietly runs the search_orders logic itself and returns the first matching order",
      "Add a rule to the system prompt listing every accepted order-ID format and telling the agent to search first whenever the customer mentions an order, then call lookup_order on the ID it gets back",
      "Force tool_choice to search_orders on every turn that mentions an order, so lookup_order is only ever called later on an ID that the search has already returned and confirmed as valid",
    ],
    a: 0,
    why: "Tool descriptions are the primary signal the model uses to choose a tool and shape its input. These descriptions state neither the input format nor when to use one tool versus the other, so the agent guesses. Stating the ID format with an example, and the boundary ('only an email? use search_orders'), fixes both symptoms at the source.",
    wrong: {
      B: { trap: 'symptom-fix', text: "Silently rewriting bad input hides the selection error, and returning the 'first match' for an email can attach the wrong order to the customer. The agent still never learns when search_orders is the right tool." },
      C: { trap: 'wrong-problem', text: "Moves tool-selection guidance out of the descriptions and into a keyword-triggered system prompt rule ('whenever the customer mentions an order'). That is the pattern the guide warns can create unintended tool associations, and it forces a search even when a valid ID is already in hand." },
      D: { trap: 'over-engineered', text: "Forcing a tool on every order-related turn removes the model's judgment for the many cases where it already has a valid ID, adds a call to each one, and still leaves both descriptions too thin to explain the inputs." },
    },
    cite: 'Exam guide §2.1; notes/domain-2 §2.1',
  },
  {
    id: 'D02', ts: '2.2', s: 'cs', bp: { rank: 3 },
    q: "Your process_refund MCP tool returns isError with the text 'Refund failed' for every failure. Refunds above the 500-dollar policy limit always fail this way, and the agent retries them 3 times before telling the customer there is a technical problem and to try again tomorrow. Separately, 6% of refund failures are backend timeouts that succeed on a second attempt. What should the tool return?",
    o: [
      "A message instructing the agent never to retry process_refund, so that policy rejections stop looping and every refund failure is escalated to a human straight away",
      "isError set to false with the policy text in the result body, so the agent treats the rejection as a normal outcome and reads it out",
      "isError plus an errorCategory, an isRetryable flag, and a description: business errors not retryable, with a customer-facing reason; transient ones retryable",
      "A shorter retry policy for the tool: one automatic retry for every failure, then an apology and a handoff to the escalate_to_human tool if the second attempt fails",
    ],
    a: 2,
    why: "The agent cannot recover well because every failure looks the same. Structured metadata lets it act per category: a business-rule violation is not retryable and carries a customer-friendly explanation (refunds over the limit need approval), while a timeout is transient and worth retrying. One response format serves both cases.",
    wrong: {
      A: { trap: 'symptom-fix', text: "Stops the policy loop but throws away the 6% of timeouts that a single retry would have fixed, and sends them to humans. The real defect, an undifferentiated error, is untouched." },
      B: { trap: 'error-suppression', text: "Reporting a failed refund as a success hides the failure from the agent's control flow. The isError flag exists so failures are distinguishable from results." },
      D: { trap: 'symptom-fix', text: "Still treats every failure alike: it wastes a retry on every policy rejection and the customer still hears 'technical problem' instead of the actual policy reason." },
    },
    cite: 'Exam guide §2.2; notes/domain-2 §2.2',
  },

  // ───────────────────────── Multi-Agent Research System ─────────────────────────
  {
    id: 'D03', ts: '2.1', s: 'ma', bp: { rank: 2 },
    q: "Your document-analysis subagent has two tools, analyze_content for web pages and analyze_document for uploaded PDFs. Two weeks ago you rewrote both descriptions with input formats, example queries, and a line on when to use each; misrouting fell from 31% to 19% and then stopped improving. In 17 of every 19 remaining misroutes, the coordinator's request contains the phrase 'analyze the content of'. The subagent's system prompt says: 'Whenever content needs analysis, start with your content analysis tool.' What is the most effective next step?",
    o: [
      "Add four few-shot examples to the system prompt showing web pages routed to analyze_content and PDFs routed to analyze_document",
      "Reword that system prompt line so it names no tool by keyword and leaves the routing to the two rewritten tool descriptions",
      "Merge both tools into a single analyze tool that inspects the input type and then dispatches internally to the right logic",
      "Put a lightweight classifier before the subagent that tags each request as web or PDF and rewrites its wording to match",
    ],
    a: 1,
    why: "The descriptions are already good and the residue is concentrated on one phrase that matches a keyword-sensitive instruction in the system prompt. That instruction is overriding the descriptions. Removing the keyword association fixes the cause directly at zero cost.",
    wrong: {
      A: { trap: 'probabilistic', text: "Examples layered on top of a conflicting instruction leave the conflict in place. The model still sees 'content' mapped to the content tool, and the examples only partly counteract it." },
      C: { trap: 'over-engineered', text: "Collapsing two tools hides the selection problem rather than fixing it and discards two clean input contracts. The evidence points at one sentence in the prompt, not at the tool split." },
      D: { trap: 'over-engineered', text: "Adds a new component to rewrite requests around a problem that one sentence of the system prompt is causing." },
    },
    cite: 'Exam guide §2.1; notes/domain-2 §2.1',
  },
  {
    id: 'D04', ts: '2.1', s: 'ma', bp: { rank: 4 },
    q: "Your analysis subagent has one tool, analyze_document(document, instructions), used for three jobs: pulling statistics, summarizing, and checking whether a source supports a claim. The synthesis step validates each job's output against its own fixed schema, and 14% of claim checks break it because the tool returns free prose instead of a verdict. Its description is already two paragraphs long with examples for all 3 jobs. What is the best redesign?",
    o: [
      "Add a mode parameter with three allowed values to analyze_document, and describe the output that each mode is expected to produce",
      "Keep the tool and validate each claim-check result in the synthesis step, retrying with the parse error until a verdict comes back",
      "Expand the description again with more claim-check examples, each one showing the exact verdict wording the parser expects",
      "Split it into extract_data_points, summarize_content, and verify_claim_against_source, each with its own output contract",
    ],
    a: 3,
    why: "A generic tool doing three jobs has no stable output contract, so better wording cannot make one of its outputs reliably structured. Splitting into purpose-specific tools gives each job a defined input and output, including a verdict-shaped result for claim checks.",
    wrong: {
      A: { trap: 'symptom-fix', text: "Closest distractor. A mode flag keeps one tool with one loosely typed output and relies on prose to describe three shapes, so the contract is still not defined per job. Splitting is the pattern the guide names." },
      B: { trap: 'reactive-too-late', text: "Validation and retry catch the failure after it happens and spend extra calls each time. The ambiguity that produces prose in the first place remains." },
      C: { trap: 'wrong-problem', text: "The description is already long. The failure is an output-shape problem caused by one tool serving three purposes, not a selection problem." },
    },
    cite: 'Exam guide §2.1',
  },
  {
    id: 'D05', ts: '2.2', s: 'ma', bp: { rank: 2 },
    q: "Your web-search subagent catches every exception and returns an empty result list with a success status. In 8% of research runs, the final report states that 'no published research exists' on a subtopic; logs show each of those was a search API timeout. Other subtopics genuinely return zero results and are reported correctly. What should the search subagent do?",
    o: [
      "Retry the timeout itself; if it still fails, return an error marked transient with what was tried and any partial results, and keep true empty results as a success",
      "Keep returning empty lists, and have the coordinator re-run every search that comes back with zero results, twice, before the synthesis agent is allowed to write the report",
      "Return a single uniform 'search failed' error for any problem, including empty results, so the coordinator never mistakes a failure for a real answer",
      "Keep retrying each timed-out search until it returns at least one result, so that the coordinator only ever receives non-empty and usable results",
    ],
    a: 0,
    why: "Two things are wrong: a failure is disguised as a success, and the subagent does not attempt its own recovery. Transient failures are retried locally; only what cannot be resolved goes to the coordinator, with the error category, what was attempted, and any partial results. A real zero-hit query remains a valid empty result.",
    wrong: {
      B: { trap: 'reactive-too-late', text: "Treats every genuine empty result as a suspected failure and doubles their cost, while the subagent keeps hiding real timeouts as successes." },
      C: { trap: 'error-suppression', text: "Collapses access failures and valid empty results into one generic error, which is the uniform-error pattern the guide says prevents good recovery decisions." },
      D: { trap: 'wrong-problem', text: "A subtopic that truly has no sources would never return a result, so the subagent loops forever. 'Non-empty' is not the definition of success." },
    },
    cite: 'Exam guide §2.2; notes/domain-2 §2.2',
  },
  {
    id: 'D06', ts: '2.3', s: 'ma', bp: { rank: 1 },
    q: "Your document-analysis subagent has a general fetch_url tool so it can open the papers a source cites, about 40 times per run. In 7% of runs it also fetches news pages and blog posts, which then leak into the analysis as if they were primary documents. A teammate proposes removing the tool and having the coordinator fetch every cited paper instead. What is the best change?",
    o: [
      "Remove fetch_url and route every cited-paper fetch through the coordinator, which already has web access and can decide each time what counts as a document",
      "Keep fetch_url and add a system prompt instruction that the subagent must fetch only academic papers and must never open news sites or blog posts",
      "Keep fetch_url and add a filter after each call that discards the fetched content if it does not look like a document before analysis starts",
      "Replace fetch_url with a load_document tool that validates the target is a document from an accepted source before fetching it, and describe exactly what it accepts and rejects",
    ],
    a: 3,
    why: "The subagent legitimately needs to open cited papers, often, so the capability stays; what is wrong is that the tool is generic. A constrained replacement that validates document URLs keeps the high-frequency need local while making the misuse impossible.",
    wrong: {
      A: { trap: 'over-engineered', text: "Adds a coordinator round trip to about 40 fetches per run to fix a 7% misuse. Scoped access means keeping the common need local with a narrower tool." },
      B: { trap: 'probabilistic', text: "An instruction leaves a general tool in place and hopes the model complies. The guide's fix is to replace the generic tool with a constrained one." },
      C: { trap: 'reactive-too-late', text: "The wrong page has already been fetched and paid for before the filter runs, and 'looks like a document' is a heuristic the validated tool does not need." },
    },
    cite: 'Exam guide §2.3',
  },

  // ───────────────────────── Structured Data Extraction ─────────────────────────
  {
    id: 'D07', ts: '2.3', s: 'de', bp: { rank: 4 },
    q: "Your extraction service offers three schema tools, extract_invoice, extract_receipt, and extract_contract, and the document type is not known before the call. With tool_choice set to auto, 3% of responses are plain text such as 'This appears to be a receipt from a hardware store' and the downstream parser rejects them. The model picks the right tool whenever it does call one. What is the most reliable fix?",
    o: [
      "Force tool_choice to extract_invoice, since invoices are the most common type, and handle receipts and contracts in a follow-up turn",
      "Add a line to the system prompt saying the model must always respond by calling one of the three extraction tools, never with text",
      "Set tool_choice to any, so the model must call one of the tools while still choosing which schema fits the document",
      "Detect plain-text replies in the parser and re-send those requests with the error text until a tool call is returned",
    ],
    a: 2,
    why: "auto permits a text reply; any requires a tool call but leaves the choice of tool to the model. The model already chooses correctly, so any closes the 3% gap without removing that choice.",
    wrong: {
      A: { trap: 'wrong-problem', text: "Forcing one named tool guarantees a call but to the wrong schema for every receipt and contract. Forced selection is for when you know which tool must run." },
      B: { trap: 'probabilistic', text: "An instruction makes text replies rarer but cannot guarantee their absence, which is what a parser needs. tool_choice enforces it at the API." },
      D: { trap: 'reactive-too-late', text: "Retries recover failures after the fact and cost an extra call each time, when one parameter change prevents them." },
    },
    cite: "Exam guide §2.3; notes/domain-2 §2.3",
  },
  {
    id: 'D08', ts: '2.3', s: 'de', bp: { rank: 3 },
    q: "Your enrichment pipeline has extract_metadata, lookup_vendor, and classify_spend. lookup_vendor and classify_spend both need the vendor name and amounts that extract_metadata produces, but with tool_choice set to auto, 11% of runs call lookup_vendor first with a vendor name the model guessed. Wrong vendor matches then flow into 2 downstream reports. How should you configure the calls?",
    o: [
      "Add a numbered instruction to the system prompt: call extract_metadata first, then lookup_vendor, then finally classify_spend",
      "Force extract_metadata on the first request, then handle lookup_vendor and classify_spend in follow-up turns",
      "Set tool_choice to any for every turn, so the model is required to call a tool before it writes any reply",
      "Force tool_choice to extract_metadata on every turn, so that its fields are always present before any enrichment runs",
    ],
    a: 1,
    why: "The prerequisite must be guaranteed to run first, which is what forced selection does. After that turn the metadata exists, and the dependent tools are handled in follow-up turns where the model can choose them.",
    wrong: {
      A: { trap: 'probabilistic', text: "Ordering by instruction is exactly what is failing 11% of the time today. An instruction cannot guarantee sequence." },
      C: { trap: 'wrong-problem', text: "any guarantees that some tool is called, not which one, so lookup_vendor can still go first." },
      D: { trap: 'over-engineered', text: "Forcing the same tool on every turn means lookup_vendor and classify_spend can never be called. Force only the first step." },
    },
    cite: 'Exam guide §2.3',
  },

  // ───────────────────────── Developer Productivity with Claude ─────────────────────────
  {
    id: 'D09', ts: '2.4', s: 'dp', bp: { rank: 3 },
    q: "Your team added a code-intelligence MCP server to the project's .mcp.json; its tool search_code is symbol-aware, spans all 12 company repositories, and returns call sites with file paths. Its description reads 'Searches code.' In 80% of 'find all callers' requests the agent uses the built-in Grep instead and misses callers in other repositories. The server connects and its tools are listed. What should you change?",
    o: [
      "Expand the search_code description: symbol-aware, covers all 12 repositories, returns call sites with paths, and when to prefer it over Grep",
      "Deny the built-in Grep tool in project settings; search_code is then the only tool the agent can use for any code search",
      "Move the server into each developer's user-scope ~/.claude.json, where its tools load earlier in every session and are offered before Grep is",
      "Expose the repository index as an MCP resource the agent can browse to see the list of repositories before it decides which search tool to use",
    ],
    a: 0,
    why: "Discovery works, so the issue is selection. With a two-word description, the model cannot tell the MCP tool is more capable than Grep. The guide's fix is to describe the MCP tool's capabilities and outputs in detail.",
    wrong: {
      B: { trap: 'over-engineered', text: "Removes a tool that is the right choice for local text search, such as error strings, to compensate for a description problem." },
      C: { trap: 'nonexistent-feature', text: "Tools from all configured servers are discovered at connection time and available at the same time. Scope changes who gets the server, not its priority, and shared team tooling belongs in the project scope." },
      D: { trap: 'wrong-problem', text: "Resources reduce exploratory calls by showing what data exists. They do not tell the model what search_code can do or when to choose it over Grep." },
    },
    cite: 'Exam guide §2.4',
  },
  {
    id: 'D10', ts: '2.5', s: 'dp', bp: { rank: 2 },
    q: "An engineer asks the agent to find every caller of chargeCard in a legacy service with 3,000 files. Grep for 'chargeCard(' finds 6 call sites, but the module payments/index.ts re-exports the function under 2 other names, charge and legacyCharge, and production logs show far more traffic than 6 callers explain. Context budget is tight. What is the best approach?",
    o: [
      "Use Glob to list every TypeScript file in the service and Read each one in order, so that no indirect call made through any of the aliases is missed",
      "Grep for the broader pattern 'charge' across the whole service, which matches the original name and both aliases in a single search",
      "Read payments/index.ts to list every name the function is exported under, then Grep for each of those names across the whole codebase",
      "Read every file that imports from payments/index.ts and check each one by hand for calls that go through any of the aliased names",
    ],
    a: 2,
    why: "Tracing through a wrapper module is a two-step pattern: first enumerate every exported name, then search for each name. It is complete and costs a handful of targeted searches rather than bulk reads.",
    wrong: {
      A: { trap: 'over-engineered', text: "Reading 3,000 files upfront is exactly the context-exhausting approach incremental exploration avoids." },
      B: { trap: 'symptom-fix', text: "'charge' also matches charges, discharge, surcharge and many unrelated strings, which floods context and still needs manual sorting." },
      D: { trap: 'wrong-problem', text: "Callers may import through other wrappers, not this file, and reading every importer in full is costly. Search by name first and read only what the search finds." },
    },
    cite: 'Exam guide §2.5',
  },

  // ───────────────────────── Code Generation with Claude Code ─────────────────────────
  {
    id: 'D11', ts: '2.5', s: 'cc', bp: { rank: 4 },
    q: "Claude Code must change the timeout in only the third of 4 identical retry stanzas in a 600-line YAML file. Each stanza is byte-for-byte the same, including the lines around it, so Edit fails because its match text is not unique. Claude has retried the same Edit 3 times. What should it do next?",
    o: [
      "Call Edit with replace_all set to true so the match no longer needs to be unique, then review the diff afterwards",
      "Read the whole file, then Write the full contents back with only the third timeout changed",
      "Use Grep with line numbers to locate the third stanza, then pass that line number to Edit as its target",
      "Run sed through Bash to substitute the new timeout wherever the timeout pattern matches in the YAML file",
    ],
    a: 1,
    why: "Edit needs unique anchor text, and here no unique anchor exists. The documented fallback is Read the full file, then Write the modified content, which lets Claude change exactly one occurrence.",
    wrong: {
      A: { trap: 'wrong-problem', text: "replace_all changes all 4 stanzas when only one should change. Reviewing the diff afterward does not undo that." },
      C: { trap: 'nonexistent-feature', text: "Edit matches on text, not line numbers. There is no line-number target to pass." },
      D: { trap: 'symptom-fix', text: "A pattern substitution hits every matching line, the same problem as replace_all, and moves a file edit into Bash where it is harder to review." },
    },
    cite: 'Exam guide §2.5',
  },
];

module.exports = { META, Q };
