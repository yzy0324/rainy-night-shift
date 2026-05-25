/**
 * AI Game Development Team Council
 * Night Shift Dispatch / 雨夜值班室 — Phase 1 Discussion
 *
 * Roles:
 *   Kimi      → Producer / Project Manager
 *   Gemini    → Game Designer / Narrative Designer
 *   DeepSeek  → Technical Lead / QA Lead
 *   DeepSeek  → Supervisor (final synthesis)
 */

import "dotenv/config";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

const TIMEOUT_MS = Number(process.env.COUNCIL_TIMEOUT_MS || 120000);

function withTimeout(promise, name) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`${name} timed out after ${TIMEOUT_MS}ms`)),
        TIMEOUT_MS
      )
    ),
  ]);
}

// ─── Shared project context ───────────────────────────────────────────────────

const CONTEXT = `
=== PROJECT: Night Shift Dispatch / 雨夜值班室 ===

GENRE: Text interaction, branching narrative mystery
PLATFORM: HTML5 / plain JavaScript (no framework, no build tool)
DEVELOPER: Solo, beginner-to-intermediate level

CONCEPT:
Player is an emergency hotline operator on a stormy night.
Receives calls, picks responses, influences character fates.
All interaction is through clicking text choices.

─── PHASE 1 GOAL ───
Build the smallest possible playable prototype from start screen to one ending.

PHASE 1 MUST INCLUDE:
1. Start screen: game title, short atmosphere text, Begin button
2. Display current scene text and optional speaker name
3. Display 2–3 player choice buttons per scene
4. Clicking a choice moves to the next scene
5. At least one ending scene (no choices, just end text)
6. Minimal scene data only (5 scenes total)
7. Code structure that is easy to extend in Phase 2

PHASE 1 MUST NOT INCLUDE:
1. Save system (no localStorage)
2. Clue panel or clue tracking
3. Trust UI or trust value display
4. Audio
5. Animation or typewriter effect
6. Full chapter story content
7. Items system
8. Condition/effect engine (no conditional choices)
9. Complex styling (basic dark terminal only)
10. Server, database, login, online features

─── PLANNED FILE STRUCTURE ───
  index.html         entry page, start screen, game area
  style.css          dark terminal layout, no animation
  data/metadata.js   exports global METADATA object
  data/scenes.js     exports global SCENES array
  src/state.js       exports global GameState object
  src/engine.js      exports Engine object (init, loadScene, chooseOption)
  src/ui.js          exports UI object (render, renderStory, renderChoices)
  game.js            entry point: DOMContentLoaded, Begin button, Engine.init()

─── MINIMAL DATA SHAPE ───
  METADATA  = { gameId, title, version, startSceneId }
  SCENES    = array of SceneNode
  SceneNode = { id, chapterId, speaker?, text, type, choices[] }
  Choice    = { id, label, nextSceneId }
  GameState = { currentSceneId }

  Script load order (plain <script> tags, NO ES modules):
  metadata.js → scenes.js → state.js → engine.js → ui.js → game.js

─── PLANNED MINIMAL SCENES (5 total) ───
  chapter0_start        type:system  speaker:系统   choices:1  → chapter1_lin_xia_call
  chapter1_lin_xia_call type:call    speaker:林夏   choices:2  → comfort OR question branch
  chapter1_comfort      type:call    speaker:林夏   choices:1  → ending_shift_over
  chapter1_question     type:call    speaker:林夏   choices:1  → ending_shift_over
  ending_shift_over     type:ending  speaker:系统   choices:0  (end of Phase 1)

=== END PROJECT CONTEXT ===
`;

// ─── Role prompts ─────────────────────────────────────────────────────────────

const KIMI_PROMPT = `
${CONTEXT}

=== YOUR ROLE: PRODUCER / PROJECT MANAGER ===

You control scope. You approve or reject what goes into Phase 1.
You protect the developer from building too much too soon.

Produce exactly these five sections:

1. SCOPE JUDGMENT
   What is confirmed in Phase 1? What is confirmed out?
   Any scope items that look risky or unclear?

2. ORDERED TASK LIST FOR CLAUDE CODE
   Break Phase 1 into small sequential tasks.
   Each task: name, files it touches, and one-sentence goal.
   Tasks must be implementable one at a time.

3. ACCEPTANCE CRITERIA
   A numbered checklist. Each item must be pass/fail testable.
   Cover: page load, start screen, scene display, choices, navigation, ending, no errors.

4. SCOPE RISKS / WHAT TO BLOCK
   What might Claude Code accidentally add that does not belong in Phase 1?
   What must be explicitly blocked?

5. WHAT REQUIRES USER APPROVAL BEFORE STARTING
   List any decision that is not already resolved in the plan.

Be concrete. Reject anything outside Phase 1. Do not invent features.
`;

const GEMINI_PROMPT = `
${CONTEXT}

=== YOUR ROLE: GAME DESIGNER / NARRATIVE DESIGNER ===

You make sure Phase 1 feels like the real game, not a generic tech demo.
You review minimal content and atmosphere without expanding scope.

Produce exactly these five sections:

1. GAMEPLAY LOOP JUDGMENT
   Does the Phase 1 loop (start → scene → 2 choices → ending) work as a game experience?
   What is missing vs. what is acceptable for a prototype?

2. SCENE CONTENT REVIEW
   Review the 5 planned scenes. Are they the right scenes?
   Is the branching (comfort vs. question) meaningful enough?
   Suggest minimal text changes only if critical.

3. UI / ATMOSPHERE MINIMUM
   What is the minimum styling and copy needed to make this feel like Night Shift Dispatch?
   Focus only on what is achievable with basic CSS and static text.

4. PLAYER EXPERIENCE CHECK
   Does the player understand what they are doing?
   Does the ending feel like a real stopping point, not a crash?

5. ONE THING THAT MUST FEEL RIGHT
   What single element separates this from a generic HTML prototype?
   Name it specifically. It must be achievable in Phase 1.

Do not suggest audio, animation, clues, trust, or any out-of-scope system.
`;

const DEEPSEEK_PROMPT = `
${CONTEXT}

=== YOUR ROLE: TECHNICAL LEAD / QA LEAD ===

You design the architecture, identify risks, and define how to verify the build.
You ensure Phase 1 code can be extended in Phase 2 without rewriting.

Produce exactly these five sections:

1. ARCHITECTURE JUDGMENT
   Is the planned file structure correct and safe for this project?
   Is the global variable approach (no ES modules) the right call for Phase 1?
   Any structural issues to fix before writing the first line?

2. EXACT FILE LIST WITH RESPONSIBILITIES
   One line per file: filename → what it owns, what it must NOT contain.

3. IMPLEMENTATION RISKS
   List specific risks (not generic advice).
   For each risk: what breaks, how to prevent it, how to detect it.

4. VERIFICATION STEPS
   Exact steps to confirm Phase 1 works after implementation.
   Include how to open the file, what to click, and what to look for in the browser console.

5. PHASE 2 EXTENSION SAFETY
   What will Phase 2 need to add (effects, conditions, clue panel)?
   Does Phase 1's structure allow this without rewriting engine.js or ui.js?
   Identify any Phase 1 design decision that would force a rewrite later.

Be specific. Only plain HTML/JS. No framework, no build tool.
`;

// ─── API callers ──────────────────────────────────────────────────────────────

async function callKimi(prompt) {
  const client = new OpenAI({
    apiKey: process.env.MOONSHOT_API_KEY,
    baseURL: process.env.MOONSHOT_BASE_URL || "https://api.moonshot.cn/v1",
  });
  try {
    const res = await withTimeout(
      client.chat.completions.create({
        model: process.env.MOONSHOT_MODEL || "kimi-k2.5",
        messages: [
          {
            role: "system",
            content:
              "You are Kimi, acting as Producer/Project Manager for a small indie game dev team. You are strict about scope.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 2400,
        thinking: { type: "disabled" },
      }),
      "Kimi"
    );
    return {
      name: "KIMI — Producer / Project Manager",
      ok: true,
      text: res.choices?.[0]?.message?.content ?? "(empty)",
    };
  } catch (err) {
    return { name: "KIMI — Producer / Project Manager", ok: false, text: err.message };
  }
}

async function callGemini(prompt) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await withTimeout(
      ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
        contents: prompt,
        config: { temperature: 0.3, maxOutputTokens: 2400 },
      }),
      "Gemini"
    );
    return {
      name: "GEMINI — Game Designer / Narrative Designer",
      ok: true,
      text: res.text ?? "(empty)",
    };
  } catch (err) {
    return { name: "GEMINI — Game Designer / Narrative Designer", ok: false, text: err.message };
  }
}

async function callDeepSeek(systemMsg, userPrompt, maxTokens = 2400) {
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });
  try {
    const res = await withTimeout(
      client.chat.completions.create({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: maxTokens,
      }),
      "DeepSeek"
    );
    return {
      ok: true,
      text: res.choices?.[0]?.message?.content ?? "(empty)",
    };
  } catch (err) {
    return { ok: false, text: err.message };
  }
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function hr(char = "─", len = 70) {
  return char.repeat(len);
}

function renderMember(result) {
  const lines = [
    "",
    hr("═"),
    `  ${result.name}`,
    hr("═"),
    "",
  ];
  lines.push(result.ok ? result.text : `❌ ERROR: ${result.text}`);
  lines.push("");
  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🎮  Night Shift Dispatch — AI Dev Team Council");
  console.log("    Phase 1 Discussion\n");
  console.log(hr());
  console.log("ROUND 1: Team members analysing Phase 1 independently...");
  console.log(hr());

  const [kimi, gemini, deepSeekRaw] = await Promise.all([
    callKimi(KIMI_PROMPT),
    callGemini(GEMINI_PROMPT),
    callDeepSeek(
      "You are DeepSeek, acting as Technical Lead and QA Lead for a small indie game dev team. You are precise and risk-focused.",
      DEEPSEEK_PROMPT
    ),
  ]);

  const deepSeekResult = {
    name: "DEEPSEEK — Technical Lead / QA Lead",
    ok: deepSeekRaw.ok,
    text: deepSeekRaw.text,
  };

  const round1Text = [
    renderMember(kimi),
    renderMember(gemini),
    renderMember(deepSeekResult),
  ].join("\n");

  console.log(round1Text);

  // ── Supervisor round ─────────────────────────────────────────────────────

  console.log(hr());
  console.log("ROUND 2: DeepSeek Supervisor — synthesising final team decision...");
  console.log(hr());

  const supervisorUserPrompt = `
${CONTEXT}

Below are the Phase 1 analyses from your three team members.

${round1Text}

─────────────────────────────────────────────────────────────
You are now the SUPERVISOR. Read all three analyses.
Resolve any disagreements. Produce ONE final plan the project owner can approve and hand to Claude Code.

Output EXACTLY the following structure (use these exact headings):

## FINAL PHASE 1 IMPLEMENTATION PLAN

### 1. FINAL SCOPE
What is confirmed in Phase 1. What is confirmed out. No ambiguity.

### 2. TASK ORDER FOR CLAUDE CODE
Numbered, ordered list. Each entry: task name, files touched, one-sentence goal.
Tasks must be small enough to do one at a time.

### 3. EXACT FILE LIST
Each file on its own line: filename → one-line responsibility.

### 4. MINIMAL DATA SHAPE
Exact JavaScript object shapes for METADATA, SceneNode, Choice, GameState.
Show a minimal example for one scene.

### 5. VERIFICATION COMMANDS
Step-by-step instructions to open and test the game after Phase 1 is built.
Include what to click and what the correct result looks like.

### 6. ACCEPTANCE CHECKLIST
Numbered pass/fail list. Must cover every Phase 1 deliverable.

### 7. OPEN QUESTIONS FOR USER APPROVAL
Anything not resolved that the owner must decide before implementation starts.

Be final. Be concrete. No optional features. No speculation.
`;

  const supervisor = await callDeepSeek(
    "You are the final supervisor of an indie game dev team. You synthesise team input into one clear, actionable plan.",
    supervisorUserPrompt,
    3200
  );

  if (supervisor.ok) {
    console.log("\n" + hr("═") + "\n  FINAL TEAM DECISION\n" + hr("═") + "\n");
    console.log(supervisor.text);
  } else {
    console.log(`\n❌ Supervisor failed: ${supervisor.text}`);
  }

  console.log("\n" + hr());
  console.log("✅  Team discussion complete. Waiting for owner approval.");
  console.log(hr() + "\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
