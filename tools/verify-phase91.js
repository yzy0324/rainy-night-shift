// Scene graph integrity check — Phase 9.1 (Flag Activation & Evidence Quality)
// Run: node tools/verify-phase91.js
const fs   = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

global.window = {};
require(path.join(root, "data", "scenes.js"));
const scenes = global.window.SCENES;
const map    = {};
scenes.forEach(s => { map[s.id] = true; });

let failures = 0;

// ── 1. Broken forward links ────────────────────────────────────────────────
scenes.forEach(s => {
  if (!s.choices) return;
  s.choices.forEach(c => {
    if (!map[c.nextSceneId]) {
      console.log("BROKEN LINK: " + s.id + " -> " + c.nextSceneId);
      failures++;
    }
  });
});

// ── 2. Non-ASCII scene IDs ─────────────────────────────────────────────────
scenes.forEach(s => {
  if (/[^\x00-\x7F]/.test(s.id)) {
    console.log("NON-ASCII ID: " + s.id);
    failures++;
  }
});

// ── 3. No innerHTML ────────────────────────────────────────────────────────
const src = fs.readFileSync(path.join(root, "data", "scenes.js"), "utf8");
if (src.indexOf("innerHTML") !== -1) {
  console.log("FOUND innerHTML in scenes.js");
  failures++;
}

// ── 4. Version 0.9.1 ──────────────────────────────────────────────────────
global.window = {};
require(path.join(root, "data", "metadata.js"));
const meta = global.window.METADATA;
if (meta.version !== "0.9.1") {
  console.log("VERSION WRONG: expected 0.9.1, got " + meta.version);
  failures++;
} else {
  console.log("Version: " + meta.version + " OK");
}

// ── 5. Scene count 62 ─────────────────────────────────────────────────────
console.log("Scene count: " + scenes.length + " (expected 62)");
if (scenes.length !== 62) {
  console.log("WRONG scene count (got " + scenes.length + ")");
  failures++;
}

// ── 6. ending_full_truth still present and reachable ─────────────────────
if (!map["ending_full_truth"]) {
  console.log("MISSING: ending_full_truth");
  failures++;
} else {
  let reachable = false;
  scenes.forEach(s => {
    if (!s.choices) return;
    s.choices.forEach(c => { if (c.nextSceneId === "ending_full_truth") reachable = true; });
  });
  if (!reachable) {
    console.log("UNREACHABLE: ending_full_truth");
    failures++;
  } else {
    console.log("ending_full_truth present and reachable OK");
  }
}

// ── 7. ending_full_truth_complete present, terminal, reachable only via gated choice ──
if (!map["ending_full_truth_complete"]) {
  console.log("MISSING: ending_full_truth_complete");
  failures++;
} else {
  const eftc = scenes.find(s => s.id === "ending_full_truth_complete");
  if (!Array.isArray(eftc.choices) || eftc.choices.length !== 0) {
    console.log("WRONG: ending_full_truth_complete should be terminal");
    failures++;
  } else {
    console.log("ending_full_truth_complete is terminal OK");
  }
  // Verify it's only reachable through a conditioned choice
  let unconditionedIncoming = false;
  scenes.forEach(s => {
    if (!s.choices) return;
    s.choices.forEach(c => {
      if (c.nextSceneId === "ending_full_truth_complete" && !c.condition) {
        unconditionedIncoming = true;
        console.log("WARNING: unconditioned link to ending_full_truth_complete from " + s.id);
      }
    });
  });
  if (!unconditionedIncoming) {
    console.log("ending_full_truth_complete only reachable via conditioned choice OK");
  }
  // Verify the condition is jammerEvidenceSaved
  let gatedCorrectly = false;
  scenes.forEach(s => {
    if (!s.choices) return;
    s.choices.forEach(c => {
      if (c.nextSceneId === "ending_full_truth_complete" &&
          c.condition && c.condition.key === "jammerEvidenceSaved") {
        gatedCorrectly = true;
      }
    });
  });
  if (!gatedCorrectly) {
    console.log("WRONG: ending_full_truth_complete not gated on jammerEvidenceSaved");
    failures++;
  } else {
    console.log("ending_full_truth_complete gated on jammerEvidenceSaved OK");
  }
}

// ── 8. chapter5_lin_xia_trust_warning present ────────────────────────────
if (!map["chapter5_lin_xia_trust_warning"]) {
  console.log("MISSING: chapter5_lin_xia_trust_warning");
  failures++;
} else {
  const lxtw = scenes.find(s => s.id === "chapter5_lin_xia_trust_warning");
  const exit = lxtw.choices && lxtw.choices.find(c => c.nextSceneId === "chapter5_protect_lin_xia");
  if (!exit) {
    console.log("WRONG: chapter5_lin_xia_trust_warning does not route to chapter5_protect_lin_xia");
    failures++;
  } else {
    console.log("chapter5_lin_xia_trust_warning -> chapter5_protect_lin_xia OK");
  }
}

// ── 9. chapter5_voice_answers: zoom_in gated on heardOwnVoice ────────────
const va = scenes.find(s => s.id === "chapter5_voice_answers");
if (!va) {
  console.log("MISSING: chapter5_voice_answers");
  failures++;
} else {
  const zoomIn = va.choices.find(c => c.id === "zoom_in");
  if (!zoomIn) {
    console.log("MISSING choice zoom_in in chapter5_voice_answers");
    failures++;
  } else if (!zoomIn.condition || zoomIn.condition.key !== "heardOwnVoice") {
    console.log("WRONG: zoom_in in chapter5_voice_answers not gated on heardOwnVoice");
    failures++;
  } else {
    console.log("chapter5_voice_answers zoom_in gated on heardOwnVoice OK");
  }
  // Safe exit must exist (unconditional)
  const safeExit = va.choices.find(c => c.nextSceneId === "chapter5_protect_lin_xia" && !c.condition);
  if (!safeExit) {
    console.log("MISSING: unconditional safe exit in chapter5_voice_answers");
    failures++;
  } else {
    console.log("chapter5_voice_answers unconditional safe exit OK");
  }
}

// ── 10. chapter5_voice_answers: trust-warning choice gated on comfortedLinXia ─
if (va) {
  const warnChoice = va.choices.find(c => c.id === "lin_xia_warns");
  if (!warnChoice) {
    console.log("MISSING choice lin_xia_warns in chapter5_voice_answers");
    failures++;
  } else if (!warnChoice.condition || warnChoice.condition.key !== "comfortedLinXia") {
    console.log("WRONG: lin_xia_warns not gated on comfortedLinXia");
    failures++;
  } else {
    console.log("lin_xia_warns gated on comfortedLinXia OK");
  }
}

// ── 11. Trust flags wired into Chapter 1 ─────────────────────────────────
const lxCall = scenes.find(s => s.id === "chapter1_lin_xia_call");
if (lxCall) {
  const comfortChoice = lxCall.choices.find(c => c.id === "comfort_open");
  const hasComforted = comfortChoice && comfortChoice.effects &&
    comfortChoice.effects.some(e => e.key === "comfortedLinXia" && e.value === true);
  if (!hasComforted) {
    console.log("MISSING: comfortedLinXia flag effect on comfort_open");
    failures++;
  } else {
    console.log("comfortedLinXia set on comfort_open OK");
  }
  const pressChoice = lxCall.choices.find(c => c.id === "question_open");
  const hasPressedTooHard = pressChoice && pressChoice.effects &&
    pressChoice.effects.some(e => e.key === "pressedTooHard" && e.value === true);
  if (!hasPressedTooHard) {
    console.log("MISSING: pressedTooHard flag effect on question_open");
    failures++;
  } else {
    console.log("pressedTooHard set on question_open OK");
  }
}

const tensionRises = scenes.find(s => s.id === "chapter1_tension_rises");
if (tensionRises) {
  const midChoice = tensionRises.choices.find(c => c.id === "comfort_mid");
  const hasCareful = midChoice && midChoice.effects &&
    midChoice.effects.some(e => e.key === "usedCarefulQuestions" && e.value === true);
  if (!hasCareful) {
    console.log("MISSING: usedCarefulQuestions flag effect on comfort_mid");
    failures++;
  } else {
    console.log("usedCarefulQuestions set on comfort_mid OK");
  }
}

// ── 12. chapter4_full_truth_bridge has 3 choices ─────────────────────────
const bridge = scenes.find(s => s.id === "chapter4_full_truth_bridge");
if (!bridge) {
  console.log("MISSING: chapter4_full_truth_bridge");
  failures++;
} else if (bridge.choices.length !== 3) {
  console.log("WRONG: chapter4_full_truth_bridge should have 3 choices, has " + bridge.choices.length);
  failures++;
} else {
  console.log("chapter4_full_truth_bridge choices: " + bridge.choices.length + " OK");
}

// ── 13. Regression: key Phase 9 scenes still present ─────────────────────
const regression = [
  "chapter5_broadcast_returns", "chapter5_see_self", "chapter5_protect_lin_xia",
  "ending_true_horror", "ending_taken_by_shift", "ending_lin_xia_left_behind",
  "ending_full_truth", "ending_rescue_but_partial_truth", "ending_silence"
];
let regOK = true;
regression.forEach(id => {
  if (!map[id]) { console.log("REGRESSION — MISSING: " + id); failures++; regOK = false; }
});
if (regOK) console.log("Regression check: all sampled Phase 9 scenes present OK");

// ── 14. No trailing whitespace ────────────────────────────────────────────
const wsCount = src.split("\n").filter(l => /[ \t]+$/.test(l)).length;
if (wsCount > 0) {
  console.log("TRAILING WHITESPACE on " + wsCount + " lines");
  failures++;
} else {
  console.log("No trailing whitespace OK");
}

console.log(failures === 0 ? "\nALL CHECKS PASSED" : "\nFAILURES: " + failures);
process.exit(failures > 0 ? 1 : 0);
