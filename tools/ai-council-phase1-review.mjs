/**
 * AI Game Dev Team — Phase 1 Code Review
 * Night Shift Dispatch / 雨夜值班室
 *
 * Reads all Phase 1 implementation files and planning docs,
 * then asks each team member to review from their role perspective.
 *
 * Roles:
 *   Kimi      → Producer: scope compliance, milestone fit
 *   Gemini    → Game Designer: playability, UX, story clarity
 *   DeepSeek  → Tech Lead / QA: code quality, bugs, maintainability
 *   DeepSeek  → Supervisor: final commit decision
 */

import "dotenv/config";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ROOT     = process.cwd();
const TIMEOUT  = Number(process.env.COUNCIL_TIMEOUT_MS || 120000);

function readFile(rel) {
  try   { return fs.readFileSync(path.join(ROOT, rel), "utf8"); }
  catch { return `[FILE NOT FOUND: ${rel}]`; }
}

function withTimeout(promise, name) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${name} timed out`)), TIMEOUT)
    ),
  ]);
}

// ─── Load context ─────────────────────────────────────────────────────────────

const GAME_SPEC = readFile("docs/GAME_SPEC.md");
const ROADMAP   = readFile("docs/ROADMAP.md");
const TASKS     = readFile("docs/TASKS.md");

// DATA_SCHEMA is 1600 lines; include only Section 20 (Phase 1 notes) + Section 8-9 (SceneNode, Choice)
const fullSchema = readFile("docs/DATA_SCHEMA.md");
const schemaLines = fullSchema.split("\n");
// Extract sections 8, 9, and 20 by finding their headers
function extractSection(lines, secNum) {
  const start = lines.findIndex(l => l.startsWith(`# ${secNum}.`));
  if (start === -1) return "";
  const end = lines.findIndex((l, i) => i > start && /^# \d+\./.test(l));
  return lines.slice(start, end === -1 ? start + 80 : end).join("\n");
}
const DATA_SCHEMA_EXCERPT = [
  extractSection(schemaLines, 8),   // SceneNode
  extractSection(schemaLines, 9),   // ChoiceOption
  extractSection(schemaLines, 20),  // Phase 1 notes
].join("\n\n---\n\n");

const IMPL = `
=== PLANNING DOCS ===

--- docs/GAME_SPEC.md ---
${GAME_SPEC}

--- docs/ROADMAP.md ---
${ROADMAP}

--- docs/TASKS.md ---
${TASKS}

--- docs/DATA_SCHEMA.md (Phase 1 relevant sections: SceneNode, ChoiceOption, MVP Notes) ---
${DATA_SCHEMA_EXCERPT}

=== IMPLEMENTATION (all files are new — Phase 1 was built from scratch) ===

--- index.html ---
${readFile("index.html")}

--- style.css ---
${readFile("style.css")}

--- data/metadata.js ---
${readFile("data/metadata.js")}

--- data/scenes.js ---
${readFile("data/scenes.js")}

--- src/state.js ---
${readFile("src/state.js")}

--- src/engine.js ---
${readFile("src/engine.js")}

--- src/ui.js ---
${readFile("src/ui.js")}

--- game.js ---
${readFile("game.js")}

=== KNOWN FACTS FROM PRE-REVIEW CHECKS ===
- node --check: all 6 JS files pass (exit 0)
- git diff --check: exit 0
- Scene count: 5 (verified by Node eval)
- All nextSceneId links resolve to existing scene IDs
- No import/export statements, no type="module", no localStorage, no audio,
  no CSS transitions/animations, no Chinese characters in scene IDs
`;

// ─── Role prompts ─────────────────────────────────────────────────────────────

const KIMI_PROMPT = `
${IMPL}

=== YOUR ROLE: PRODUCER / PROJECT MANAGER ===

Review the Phase 1 implementation against the planning documents.

Answer exactly these questions:

1. SPEC MATCH
   Does the implementation match docs/GAME_SPEC.md Phase 1 Scope?
   List each Phase 1 item and whether it is present. List each forbidden item and confirm it is absent.

2. ROADMAP MATCH
   Does it satisfy docs/ROADMAP.md Phase 1 acceptance criteria?
   Quote each criterion and mark PASS or FAIL.

3. TASKS MATCH
   Were all Tasks 1.1–1.5 from docs/TASKS.md completed?
   For each task, state: DONE / PARTIAL / MISSING.

4. SCOPE VIOLATIONS
   Are any features present that were explicitly forbidden from Phase 1?
   Be specific. If none, say "None found."

5. MILESTONE VERDICT
   Is this implementation complete enough to commit as "Phase 1 complete"?
   If not, list the exact blockers.

Be concrete. Quote file names and line numbers where relevant.
`;

const GEMINI_PROMPT = `
${IMPL}

=== YOUR ROLE: GAME DESIGNER / NARRATIVE DESIGNER ===

Review the Phase 1 implementation for player experience, story clarity, and atmosphere.

Answer exactly these questions:

1. GAMEPLAY LOOP
   Does start screen → scene → choices → ending work as a coherent micro-experience?
   Is there anything that would confuse or frustrate a first-time player?

2. STORY CONTENT
   Review the 5 scene texts. Are they appropriate for this game's tone?
   Does the branching (安慰她 vs 询问细节) feel like a real choice, even if both branches lead to the same ending?
   Is the ending text satisfying as a stopping point?

3. UX CLARITY
   Does a player immediately understand what to do?
   Is the speaker label format (林夏：text) clear?
   Is the ending message ("值班结束。刷新页面重新开始。") sufficient?

4. ATMOSPHERE
   Does the start screen (title, subtitle, atmosphere line, Begin button) establish the game's identity?
   Does the CSS (dark terminal, monospace, flat buttons) match the intended feel?

5. DESIGN VERDICT
   Is this Phase 1 prototype good enough to demonstrate the game concept?
   What is the single most important thing to improve in Phase 2 for player experience?

Be direct. Focus on what a player actually sees and feels, not what is possible in future phases.
`;

// Leaner context for DeepSeek — implementation files only, no full planning docs
const IMPL_CODE_ONLY = `
=== PHASE 1 IMPLEMENTATION — ALL NEW FILES ===

Phase 1 rules: plain <script> tags, window globals, no ES modules, no save, no audio,
no animation, no conditions engine, no effects engine, no localStorage.
Architecture: METADATA → SCENES → GameState → Engine → UI → game.js (load order).

--- index.html ---
${readFile("index.html")}

--- style.css ---
${readFile("style.css")}

--- data/metadata.js ---
${readFile("data/metadata.js")}

--- data/scenes.js ---
${readFile("data/scenes.js")}

--- src/state.js ---
${readFile("src/state.js")}

--- src/engine.js ---
${readFile("src/engine.js")}

--- src/ui.js ---
${readFile("src/ui.js")}

--- game.js ---
${readFile("game.js")}

=== PRE-REVIEW CHECKS (already passed) ===
- node --check: all 6 JS files exit 0
- git diff --check: exit 0
- Scene count: exactly 5 (verified)
- All nextSceneId links resolve
- No import/export, no type=module, no localStorage, no audio, no CSS animation
`;

const DEEPSEEK_REVIEW_PROMPT = `
${IMPL_CODE_ONLY}

=== YOUR ROLE: TECHNICAL LEAD / QA LEAD ===

Review the Phase 1 implementation for code quality, bugs, and maintainability.

Answer exactly these questions:

1. ARCHITECTURE CORRECTNESS
   Is the global variable approach (METADATA, SCENES, GameState, Engine, UI on window) implemented correctly?
   Is the script load order in index.html correct and safe?
   Does each file stay within its stated responsibility?

2. BUG HUNT
   List every JavaScript bug or risky pattern you can find.
   For each: which file, which line(s), what breaks, how likely.
   If none, say "No bugs found."

3. DEFENSIVE CODE
   Is the fallback error scene implemented correctly?
   Is the button double-click guard implemented correctly?
   Are there any missing null checks that could crash the game?

4. PHASE 2 READINESS
   Can effects be added to Engine.chooseOption() without rewriting it?
   Can conditions be added to filter choices before UI.renderChoices() without rewriting it?
   Can a clue panel be added to UI without touching Engine?
   Is GameState.reset() sufficient for Phase 2, or will it need updating?

5. CODE QUALITY
   Is the code simple and readable for a beginner/intermediate developer?
   Are there any over-engineered patterns, or conversely, anything too fragile?
   Is the comment quality adequate?

6. QA VERDICT
   Is this code safe to commit?
   List any bugs that MUST be fixed before commit (blockers).
   List any issues that can wait for Phase 2 (non-blockers).

Be precise. Quote file names and line numbers.
`;

// ─── API callers ──────────────────────────────────────────────────────────────

async function callKimi(prompt) {
  const client = new OpenAI({
    apiKey:  process.env.MOONSHOT_API_KEY,
    baseURL: process.env.MOONSHOT_BASE_URL || "https://api.moonshot.cn/v1",
  });
  try {
    const res = await withTimeout(
      client.chat.completions.create({
        model:      process.env.MOONSHOT_MODEL || "kimi-k2.5",
        messages: [
          { role: "system", content: "You are Kimi, acting as Producer/PM for an indie game dev team. You are strict about scope and milestone criteria." },
          { role: "user",   content: prompt },
        ],
        temperature: 0.6,          // kimi-k2.5 requires exactly 0.6
        max_tokens:  2400,
        thinking: { type: "disabled" },
      }),
      "Kimi"
    );
    return { name: "KIMI — Producer / PM", ok: true, text: res.choices?.[0]?.message?.content ?? "(empty)" };
  } catch (err) {
    return { name: "KIMI — Producer / PM", ok: false, text: err.message };
  }
}

async function callGemini(prompt) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await withTimeout(
      ai.models.generateContent({
        model:    process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
        contents: prompt,
        config:   { temperature: 0.3, maxOutputTokens: 2800 },
      }),
      "Gemini"
    );
    return { name: "GEMINI — Game Designer", ok: true, text: res.text ?? "(empty)" };
  } catch (err) {
    return { name: "GEMINI — Game Designer", ok: false, text: err.message };
  }
}

async function callDeepSeek(systemMsg, userPrompt, maxTokens = 2800) {
  const client = new OpenAI({
    apiKey:  process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });
  try {
    const res = await withTimeout(
      client.chat.completions.create({
        model:       process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: [
          { role: "system", content: systemMsg },
          { role: "user",   content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens:  maxTokens,
      }),
      "DeepSeek"
    );
    return { ok: true, text: res.choices?.[0]?.message?.content ?? "(empty)" };
  } catch (err) {
    return { ok: false, text: err.message };
  }
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function hr(c = "─", n = 70) { return c.repeat(n); }

function renderMember(result) {
  return [
    "",
    hr("═"),
    `  ${result.name}`,
    hr("═"),
    "",
    result.ok ? result.text : `❌ ERROR: ${result.text}`,
    "",
  ].join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🔍  Night Shift Dispatch — Phase 1 Code Review");
  console.log("    AI Dev Team\n");
  console.log(hr());
  console.log("ROUND 1: Team members reviewing implementation independently...");
  console.log(hr());

  const [kimi, gemini, deepSeekRaw] = await Promise.all([
    callKimi(KIMI_PROMPT),
    callGemini(GEMINI_PROMPT),
    callDeepSeek(
      "You are DeepSeek, Technical Lead and QA Lead for an indie game dev team. You are precise, risk-focused, and cite specific file names and line numbers.",
      DEEPSEEK_REVIEW_PROMPT
    ),
  ]);

  const deepSeek = { name: "DEEPSEEK — Tech Lead / QA", ok: deepSeekRaw.ok, text: deepSeekRaw.text };
  const round1   = [kimi, gemini, deepSeek].map(renderMember).join("\n");

  console.log(round1);

  // ── Supervisor synthesis ──────────────────────────────────────────────────

  console.log(hr());
  console.log("ROUND 2: DeepSeek Supervisor — final commit decision...");
  console.log(hr());

  const supervisorPrompt = `
You are the SUPERVISOR for the Phase 1 code review of Night Shift Dispatch.

Here are the three team member reviews:

${round1}

Produce ONE final review summary using EXACTLY this structure:

## PHASE 1 REVIEW — FINAL DECISION

### 1. SCOPE & MILESTONE COMPLIANCE
(From Kimi's review: did it match GAME_SPEC, ROADMAP, and TASKS? Any violations?)

### 2. PLAYER EXPERIENCE VERDICT
(From Gemini's review: does it work as a game? Any UX issues?)

### 3. CODE QUALITY VERDICT
(From DeepSeek's review: any bugs? Is the architecture correct? Phase 2 safe?)

### 4. BLOCKER LIST
List only issues that MUST be fixed before commit. If none, write "No blockers."

### 5. NON-BLOCKER NOTES
Issues acceptable to defer to Phase 2 or later.

### 6. COMMIT DECISION
One of:
  ✅ APPROVED — safe to commit as Phase 1 complete
  ⚠️  APPROVED WITH NOTES — safe to commit, but note the following
  ❌ BLOCKED — fix these issues before committing

State the decision clearly on its own line. Then give the exact reason.
`;

  const supervisor = await callDeepSeek(
    "You are the final supervisor of an indie game dev team code review. You synthesise team findings into one clear, actionable decision.",
    supervisorPrompt,
    2400
  );

  console.log("\n" + hr("═") + "\n  FINAL REVIEW DECISION\n" + hr("═") + "\n");
  console.log(supervisor.ok ? supervisor.text : `❌ Supervisor error: ${supervisor.text}`);
  console.log("\n" + hr());
  console.log("✅  Review complete.");
  console.log(hr() + "\n");
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
