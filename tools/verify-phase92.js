// Scene graph integrity check — Phase 9.2 (Trust Consequence Patch)
// Run: node tools/verify-phase92.js
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

// ── 4. Version 0.9.2 ──────────────────────────────────────────────────────
global.window = {};
require(path.join(root, "data", "metadata.js"));
const meta = global.window.METADATA;
if (meta.version !== "0.9.2") {
  console.log("VERSION WRONG: expected 0.9.2, got " + meta.version);
  failures++;
} else {
  console.log("Version: " + meta.version + " OK");
}

// ── 5. Scene count 63 ─────────────────────────────────────────────────────
console.log("Scene count: " + scenes.length + " (expected 63)");
if (scenes.length !== 63) {
  console.log("WRONG scene count (got " + scenes.length + ")");
  failures++;
}

// ── 6. usedCarefulQuestions used as a condition ───────────────────────────
let carefulUsed = false;
scenes.forEach(s => {
  if (!s.choices) return;
  s.choices.forEach(c => {
    if (c.condition && c.condition.key === "usedCarefulQuestions") carefulUsed = true;
  });
});
if (!carefulUsed) {
  console.log("NOT USED: usedCarefulQuestions never appears as a condition");
  failures++;
} else {
  console.log("usedCarefulQuestions used as condition OK");
}

// ── 7. pressedTooHard used as a condition ─────────────────────────────────
let pressedUsed = false;
scenes.forEach(s => {
  if (!s.choices) return;
  s.choices.forEach(c => {
    if (c.condition && c.condition.key === "pressedTooHard") pressedUsed = true;
  });
});
if (!pressedUsed) {
  console.log("NOT USED: pressedTooHard never appears as a condition");
  failures++;
} else {
  console.log("pressedTooHard used as condition OK");
}

// ── 8. chapter5_lin_xia_cold_silence present with correct exits ───────────
const cold = scenes.find(s => s.id === "chapter5_lin_xia_cold_silence");
if (!cold) {
  console.log("MISSING: chapter5_lin_xia_cold_silence");
  failures++;
} else {
  const toProtect = cold.choices.find(c => c.nextSceneId === "chapter5_protect_lin_xia");
  const toSee     = cold.choices.find(c => c.nextSceneId === "chapter5_see_self");
  if (!toProtect) {
    console.log("WRONG: chapter5_lin_xia_cold_silence missing exit to chapter5_protect_lin_xia");
    failures++;
  } else {
    console.log("chapter5_lin_xia_cold_silence -> chapter5_protect_lin_xia OK");
  }
  if (!toSee) {
    console.log("WRONG: chapter5_lin_xia_cold_silence missing exit to chapter5_see_self");
    failures++;
  } else {
    console.log("chapter5_lin_xia_cold_silence -> chapter5_see_self OK");
  }
}

// ── 9. chapter5_voice_answers: unconditional safe exit still present ───────
const va = scenes.find(s => s.id === "chapter5_voice_answers");
if (!va) {
  console.log("MISSING: chapter5_voice_answers");
  failures++;
} else {
  const safeExit = va.choices.find(c =>
    c.nextSceneId === "chapter5_protect_lin_xia" && !c.condition
  );
  if (!safeExit) {
    console.log("MISSING: unconditional safe exit in chapter5_voice_answers");
    failures++;
  } else {
    console.log("chapter5_voice_answers unconditional safe exit OK");
  }

  // Verify usedCarefulQuestions and pressedTooHard choices present
  const carefulChoice = va.choices.find(c =>
    c.condition && c.condition.key === "usedCarefulQuestions"
  );
  if (!carefulChoice) {
    console.log("MISSING: usedCarefulQuestions choice in chapter5_voice_answers");
    failures++;
  } else {
    console.log("chapter5_voice_answers usedCarefulQuestions choice OK");
  }

  const coldChoice = va.choices.find(c =>
    c.condition && c.condition.key === "pressedTooHard"
  );
  if (!coldChoice) {
    console.log("MISSING: pressedTooHard choice in chapter5_voice_answers");
    failures++;
  } else {
    console.log("chapter5_voice_answers pressedTooHard choice OK");
  }

  console.log("chapter5_voice_answers total choices: " + va.choices.length);
}

// ── 10. ending_full_truth still reachable ─────────────────────────────────
let eftReachable = false;
scenes.forEach(s => {
  if (!s.choices) return;
  s.choices.forEach(c => { if (c.nextSceneId === "ending_full_truth") eftReachable = true; });
});
if (!eftReachable) {
  console.log("UNREACHABLE: ending_full_truth");
  failures++;
} else {
  console.log("ending_full_truth reachable OK");
}

// ── 11. ending_full_truth_complete still reachable ────────────────────────
let eftcReachable = false;
scenes.forEach(s => {
  if (!s.choices) return;
  s.choices.forEach(c => { if (c.nextSceneId === "ending_full_truth_complete") eftcReachable = true; });
});
if (!eftcReachable) {
  console.log("UNREACHABLE: ending_full_truth_complete");
  failures++;
} else {
  console.log("ending_full_truth_complete reachable OK");
}

// ── 12. Regression: key Phase 9.1 scenes still present ───────────────────
const regression = [
  "chapter5_lin_xia_trust_warning", "ending_full_truth_complete",
  "chapter5_see_self", "chapter5_protect_lin_xia",
  "ending_true_horror", "ending_taken_by_shift"
];
let regOK = true;
regression.forEach(id => {
  if (!map[id]) { console.log("REGRESSION — MISSING: " + id); failures++; regOK = false; }
});
if (regOK) console.log("Regression check: all sampled Phase 9.1 scenes present OK");

// ── 13. No trailing whitespace ────────────────────────────────────────────
const wsCount = src.split("\n").filter(l => /[ \t]+$/.test(l)).length;
if (wsCount > 0) {
  console.log("TRAILING WHITESPACE on " + wsCount + " lines");
  failures++;
} else {
  console.log("No trailing whitespace OK");
}

console.log(failures === 0 ? "\nALL CHECKS PASSED" : "\nFAILURES: " + failures);
process.exit(failures > 0 ? 1 : 0);
