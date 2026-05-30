// ── Canonical Integrity Check — v1.4.1 ───────────────────────────────────
// Run: node tools/verify-all.js
//
// Sections:
//   1. Structural integrity   — broken links, duplicate IDs, ASCII IDs,
//                               innerHTML, trailing whitespace
//   2. Metadata               — version 1.4.1, startSceneId resolves
//   3. Scene count & endings  — count 65, all ending-type scenes terminal
//   4. Required endings       — 10 endings present and reachable
//   5. Chapter 5 scenes       — all 14 scenes present
//   6. Clue system            — count 3, all addClue keys resolve
//   7. Game-logic invariants  — phase-critical conditions preserved
//   8. Archive catalogue      — 10 entries, no dupes, all IDs resolve,
//                               hasAnyUnlocked is a function
//   9. Ending hints           — 10 hints, non-empty, no spoiler keywords
//  10. Chen Ming branch       — v1.3 flags, new scene, conditional choice
//  11. Chen/van evidence      — v1.4 conditional bridge choice, note scene

const fs   = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

// ── Load data ─────────────────────────────────────────────────────────────

global.window = {};
require(path.join(root, "data", "scenes.js"));
const scenes = global.window.SCENES;

global.window = {};
require(path.join(root, "data", "clues.js"));
const CLUES = global.window.CLUES;

global.window = {};
require(path.join(root, "data", "metadata.js"));
const meta = global.window.METADATA;

const src = fs.readFileSync(path.join(root, "data", "scenes.js"), "utf8");

// Build scene-by-ID lookup and incoming-link (reachability) set once.
const map       = {};
const reachable = new Set();
let   totalLinks = 0;

scenes.forEach(s => { map[s.id] = s; });
scenes.forEach(s => {
  if (!s.choices) return;
  s.choices.forEach(c => {
    reachable.add(c.nextSceneId);
    totalLinks++;
  });
});

// ── Helpers ───────────────────────────────────────────────────────────────

let failures = 0;
function fail(msg) { console.log("FAIL  " + msg); failures++; }
function pass(msg) { console.log("  ok  " + msg); }
function section(title) {
  console.log("\n── " + title + " " + "─".repeat(Math.max(0, 60 - title.length)));
}

// ═════════════════════════════════════════════════════════════════════════
section("1. Structural integrity");

// Duplicate scene IDs
const seen = {};
let dupeCount = 0;
scenes.forEach(s => {
  if (seen[s.id]) { fail("duplicate ID: " + s.id); dupeCount++; }
  else seen[s.id] = true;
});
if (dupeCount === 0) pass("no duplicate scene IDs (" + scenes.length + " scenes)");

// Non-ASCII scene IDs
const badIds = scenes.filter(s => /[^\x00-\x7F]/.test(s.id));
if (badIds.length) badIds.forEach(s => fail("non-ASCII ID: " + s.id));
else pass("all scene IDs are ASCII");

// Broken forward links
let brokenLinks = 0;
scenes.forEach(s => {
  if (!s.choices) return;
  s.choices.forEach(c => {
    if (!map[c.nextSceneId]) {
      fail("broken link: " + s.id + " -> " + c.nextSceneId);
      brokenLinks++;
    }
  });
});
if (brokenLinks === 0) pass("no broken forward links (" + totalLinks + " links checked)");

// No innerHTML
if (src.indexOf("innerHTML") !== -1) fail("innerHTML found in scenes.js");
else pass("no innerHTML in scenes.js");

// No trailing whitespace
const wsLines = src.split("\n").filter(l => /[ \t]+$/.test(l)).length;
if (wsLines > 0) fail("trailing whitespace on " + wsLines + " line(s) in scenes.js");
else pass("no trailing whitespace in scenes.js");

// ═════════════════════════════════════════════════════════════════════════
section("2. Metadata");

if (meta.version !== "1.4.1")
  fail("version expected 1.4.1, got " + meta.version);
else
  pass("version " + meta.version);

if (!map[meta.startSceneId])
  fail("startSceneId '" + meta.startSceneId + "' not found in scene map");
else
  pass("startSceneId '" + meta.startSceneId + "' resolves");

// ═════════════════════════════════════════════════════════════════════════
section("3. Scene count and ending structure");

const EXPECTED_SCENE_COUNT = 65;
if (scenes.length !== EXPECTED_SCENE_COUNT)
  fail("scene count " + scenes.length + " (expected " + EXPECTED_SCENE_COUNT + ")");
else
  pass("scene count " + scenes.length);

// Every scene whose type is "ending" must be terminal — choices must be empty.
let nonTerminalCount = 0;
const endingTypeScenes = scenes.filter(s => s.type === "ending");
endingTypeScenes.forEach(s => {
  if (!Array.isArray(s.choices) || s.choices.length > 0) {
    fail("non-terminal ending: " + s.id +
         " (choices: " + (s.choices ? s.choices.length : "missing") + ")");
    nonTerminalCount++;
  }
});
if (nonTerminalCount === 0)
  pass("all " + endingTypeScenes.length + " ending-type scenes are terminal");

// ═════════════════════════════════════════════════════════════════════════
section("4. Required endings — present and reachable");

const REQUIRED_ENDINGS = [
  "ending_full_truth",
  "ending_full_truth_complete",
  "ending_rescue_but_partial_truth",
  "ending_silence",
  "ending_failed_interception",
  "ending_bad_alone",
  "ending_loose_ends",
  "ending_true_horror",
  "ending_taken_by_shift",
  "ending_lin_xia_left_behind"
];

REQUIRED_ENDINGS.forEach(id => {
  if (!map[id])
    fail("required ending missing: " + id);
  else if (!reachable.has(id))
    fail("required ending unreachable: " + id);
  else
    pass("present and reachable: " + id);
});

// ═════════════════════════════════════════════════════════════════════════
section("5. Chapter 5 scenes present");

const CHAPTER5_SCENES = [
  "chapter5_broadcast_returns",
  "chapter5_broadcast_wont_stop",
  "chapter5_crowd_on_platform",
  "chapter5_lin_xia_memory",
  "chapter5_system_log",
  "chapter5_logbook_self",
  "chapter5_third_call",
  "chapter5_phone_keeps_ringing",
  "chapter5_phone_unplugged",
  "chapter5_voice_answers",
  "chapter5_lin_xia_trust_warning",
  "chapter5_lin_xia_cold_silence",
  "chapter5_see_self",
  "chapter5_protect_lin_xia"
];

let ch5Missing = 0;
CHAPTER5_SCENES.forEach(id => {
  if (!map[id]) { fail("chapter5 scene missing: " + id); ch5Missing++; }
});
if (ch5Missing === 0)
  pass("all " + CHAPTER5_SCENES.length + " chapter5 scenes present");

// ═════════════════════════════════════════════════════════════════════════
section("6. Clue system");

const EXPECTED_CLUE_COUNT = 3;
const clueKeys = Object.keys(CLUES);
if (clueKeys.length !== EXPECTED_CLUE_COUNT)
  fail("clue count " + clueKeys.length + " (expected " + EXPECTED_CLUE_COUNT + ")");
else
  pass("clue count " + clueKeys.length + ": " + clueKeys.join(", "));

// Every addClue effect key must resolve to a known clue.
let badClueRefs = 0;
scenes.forEach(s => {
  if (!s.choices) return;
  s.choices.forEach(c => {
    if (!c.effects) return;
    c.effects.forEach(e => {
      if (e.type === "addClue" && !CLUES[e.key]) {
        fail("unresolved addClue key '" + e.key + "' in scene " + s.id);
        badClueRefs++;
      }
    });
  });
});
if (badClueRefs === 0) pass("all addClue effect keys resolve");

// ═════════════════════════════════════════════════════════════════════════
section("7. Game-logic invariants");

// Phase 9.3: the two core choices (report / end-shift) must stay unconditional.
// v1.3: a third conditional choice (press_for_answer) is now expected and allowed.
const fc = map["chapter2_final_choice"];
if (!fc) {
  fail("chapter2_final_choice missing");
} else {
  const reportC   = fc.choices.find(c => c.id === "report_abnormal_event");
  const endShiftC = fc.choices.find(c => c.id === "end_shift_as_uncertain");
  const unexpected = fc.choices.filter(
    c => c.condition && c.id !== "press_for_answer"
  );
  if (reportC && !reportC.condition && endShiftC && !endShiftC.condition && unexpected.length === 0)
    pass("chapter2_final_choice: core choices unconditional, optional conditional allowed");
  else
    fail("chapter2_final_choice: core choices unexpectedly conditional or unexpected gated choice present");
}

// Phase 9.2: chapter5_voice_answers must always offer the safe exit.
const va = map["chapter5_voice_answers"];
if (!va) {
  fail("chapter5_voice_answers missing");
} else {
  const safe = va.choices.find(
    c => c.nextSceneId === "chapter5_protect_lin_xia" && !c.condition
  );
  if (!safe)
    fail("chapter5_voice_answers: unconditional exit to chapter5_protect_lin_xia missing");
  else
    pass("chapter5_voice_answers: unconditional safe exit present (" +
         va.choices.length + " choices total)");
}

// Phase 9.1: ending_full_truth_complete must stay gated on jammerEvidenceSaved.
let ftcGated = false;
scenes.forEach(s => {
  if (!s.choices) return;
  s.choices.forEach(c => {
    if (c.nextSceneId === "ending_full_truth_complete" &&
        c.condition && c.condition.key === "jammerEvidenceSaved") {
      ftcGated = true;
    }
  });
});
if (!ftcGated)
  fail("ending_full_truth_complete not gated on jammerEvidenceSaved");
else
  pass("ending_full_truth_complete gated on jammerEvidenceSaved");

// ═════════════════════════════════════════════════════════════════════════
section("8. Archive catalogue");

try {
  global.window = {};
  require(path.join(root, "src", "archive.js"));
  const Archive = global.window.Archive;

  if (!Archive || !Array.isArray(Archive.ENDING_CATALOGUE)) {
    fail("Archive.ENDING_CATALOGUE not found — check src/archive.js");
  } else {
    const cat = Archive.ENDING_CATALOGUE;

    // Length
    if (cat.length !== 10)
      fail("catalogue length " + cat.length + " (expected 10)");
    else
      pass("catalogue length " + cat.length);

    // No duplicate IDs
    const catSeen = {};
    let catDupes = 0;
    cat.forEach(e => {
      if (catSeen[e.id]) { fail("duplicate catalogue ID: " + e.id); catDupes++; }
      else catSeen[e.id] = true;
    });
    if (catDupes === 0) pass("no duplicate catalogue IDs");

    // Every catalogue ID must exist as a scene
    let catMissing = 0;
    cat.forEach(e => {
      if (!map[e.id]) { fail("catalogue ID not found in scenes: " + e.id); catMissing++; }
    });
    if (catMissing === 0) pass("all catalogue IDs resolve to scenes");

    // Every required ending must appear in the catalogue
    const catIds = {};
    cat.forEach(e => { catIds[e.id] = true; });
    let reqMissing = 0;
    REQUIRED_ENDINGS.forEach(id => {
      if (!catIds[id]) { fail("required ending absent from catalogue: " + id); reqMissing++; }
    });
    if (reqMissing === 0) pass("all required endings present in catalogue");

    // Every catalogue ending must have at least one incoming link
    let catUnreachable = 0;
    cat.forEach(e => {
      if (!reachable.has(e.id)) {
        fail("catalogue ending unreachable: " + e.id);
        catUnreachable++;
      }
    });
    if (catUnreachable === 0) pass("all catalogue endings are reachable");

    // Archive.hasAnyUnlocked must be a function (v1.2.0)
    if (typeof Archive.hasAnyUnlocked !== "function")
      fail("Archive.hasAnyUnlocked is not a function");
    else
      pass("Archive.hasAnyUnlocked is a function");
  }
} catch (e) {
  fail("failed to load src/archive.js: " + e.message);
}

// ═════════════════════════════════════════════════════════════════════════
section("9. Ending hints");

try {
  global.window = {};
  require(path.join(root, "data", "endingHints.js"));
  const ENDING_HINTS = global.window.ENDING_HINTS;

  if (!ENDING_HINTS || typeof ENDING_HINTS !== "object" || Array.isArray(ENDING_HINTS)) {
    fail("ENDING_HINTS not found or wrong type in data/endingHints.js");
  } else {
    const hintKeys = Object.keys(ENDING_HINTS);

    // Count
    if (hintKeys.length !== 10)
      fail("hint count " + hintKeys.length + " (expected 10)");
    else
      pass("hint count " + hintKeys.length);

    // Every required ending has a hint
    let missingHints = 0;
    REQUIRED_ENDINGS.forEach(id => {
      if (!ENDING_HINTS[id]) { fail("no hint for required ending: " + id); missingHints++; }
    });
    if (missingHints === 0) pass("all required endings have hints");

    // Every hint key must resolve to a known scene
    let badHintKeys = 0;
    hintKeys.forEach(id => {
      if (!map[id]) { fail("hint key not a scene: " + id); badHintKeys++; }
    });
    if (badHintKeys === 0) pass("all hint keys resolve to scenes");

    // All hints are non-empty strings
    let emptyHints = 0;
    hintKeys.forEach(id => {
      if (typeof ENDING_HINTS[id] !== "string" || ENDING_HINTS[id].trim() === "") {
        fail("empty or non-string hint for: " + id);
        emptyHints++;
      }
    });
    if (emptyHints === 0) pass("all hints are non-empty strings");

    // No hint contains spoiler / route-revealing keywords
    const forbidden = ["选择", "flag", "condition", "解锁方式"];
    let spoilerCount = 0;
    hintKeys.forEach(id => {
      forbidden.forEach(word => {
        if (ENDING_HINTS[id].indexOf(word) !== -1) {
          fail("hint for '" + id + "' contains forbidden word: '" + word + "'");
          spoilerCount++;
        }
      });
    });
    if (spoilerCount === 0) pass("no hints contain spoiler keywords");
  }
} catch (e) {
  fail("failed to load data/endingHints.js: " + e.message);
}

// ═════════════════════════════════════════════════════════════════════════
section("10. Chen Ming branch (v1.3)");

// New scene present and reachable
if (!map["chapter2_chen_under_pressure"])
  fail("chapter2_chen_under_pressure missing");
else
  pass("chapter2_chen_under_pressure present");

if (!reachable.has("chapter2_chen_under_pressure"))
  fail("chapter2_chen_under_pressure unreachable");
else
  pass("chapter2_chen_under_pressure reachable");

// challengedChen flag seeded on press_on
const corneredScene = map["chapter2_chen_cornered"];
if (!corneredScene) {
  fail("chapter2_chen_cornered missing");
} else {
  const pressOn = corneredScene.choices.find(c => c.id === "press_on");
  if (!pressOn) {
    fail("press_on choice missing from chapter2_chen_cornered");
  } else {
    const seedsChallenged = Array.isArray(pressOn.effects) &&
      pressOn.effects.some(e => e.type === "setFlag" &&
                                e.key  === "challengedChen" &&
                                e.value === true);
    if (!seedsChallenged)
      fail("press_on does not set challengedChen = true");
    else
      pass("press_on sets challengedChen = true");
  }
}

// connectedVanToChen flag seeded on connect_dots
const staticLeadScene = map["chapter2_static_lead"];
if (!staticLeadScene) {
  fail("chapter2_static_lead missing");
} else {
  const connectDots = staticLeadScene.choices.find(c => c.id === "connect_dots");
  if (!connectDots) {
    fail("connect_dots choice missing from chapter2_static_lead");
  } else {
    const seedsVan = Array.isArray(connectDots.effects) &&
      connectDots.effects.some(e => e.type === "setFlag" &&
                                    e.key  === "connectedVanToChen" &&
                                    e.value === true);
    if (!seedsVan)
      fail("connect_dots does not set connectedVanToChen = true");
    else
      pass("connect_dots sets connectedVanToChen = true");
  }
}

// chapter2_final_choice: press_for_answer conditional choice present and correct
const finalChoiceScene = map["chapter2_final_choice"];
if (!finalChoiceScene) {
  fail("chapter2_final_choice missing");
} else {
  const pfa = finalChoiceScene.choices.find(c => c.id === "press_for_answer");
  if (!pfa) {
    fail("press_for_answer choice missing from chapter2_final_choice");
  } else {
    const gatedCorrectly = pfa.condition &&
      pfa.condition.type     === "flag" &&
      pfa.condition.key      === "challengedChen" &&
      pfa.condition.operator === "equals" &&
      pfa.condition.value    === true;
    if (!gatedCorrectly)
      fail("press_for_answer not gated on challengedChen = true");
    else
      pass("press_for_answer gated on challengedChen = true");

    if (pfa.nextSceneId !== "chapter2_chen_under_pressure")
      fail("press_for_answer does not go to chapter2_chen_under_pressure");
    else
      pass("press_for_answer goes to chapter2_chen_under_pressure");
  }

  // Existing choices must remain unconditional
  const reportChoice    = finalChoiceScene.choices.find(c => c.id === "report_abnormal_event");
  const endShiftChoice  = finalChoiceScene.choices.find(c => c.id === "end_shift_as_uncertain");

  if (reportChoice && !reportChoice.condition)
    pass("report_abnormal_event remains unconditional");
  else
    fail("report_abnormal_event missing or has become conditional");

  if (endShiftChoice && !endShiftChoice.condition)
    pass("end_shift_as_uncertain remains unconditional");
  else
    fail("end_shift_as_uncertain missing or has become conditional");
}

// ═════════════════════════════════════════════════════════════════════════
section("11. Chen / van evidence payoff (v1.4)");

// New note scene present and reachable
if (!map["chapter4_chen_van_evidence_note"])
  fail("chapter4_chen_van_evidence_note missing");
else
  pass("chapter4_chen_van_evidence_note present");

if (!reachable.has("chapter4_chen_van_evidence_note"))
  fail("chapter4_chen_van_evidence_note unreachable");
else
  pass("chapter4_chen_van_evidence_note reachable");

// chapter4_full_truth_bridge: all choices intact and new choice correct
const bridgeScene = map["chapter4_full_truth_bridge"];
if (!bridgeScene) {
  fail("chapter4_full_truth_bridge missing");
} else {
  // New conditional choice
  const chenVan = bridgeScene.choices.find(c => c.id === "submit_chen_van_evidence");
  if (!chenVan) {
    fail("submit_chen_van_evidence missing from chapter4_full_truth_bridge");
  } else {
    const gatedCorrectly = chenVan.condition &&
      chenVan.condition.type     === "flag"           &&
      chenVan.condition.key      === "connectedVanToChen" &&
      chenVan.condition.operator === "equals"         &&
      chenVan.condition.value    === true;
    if (!gatedCorrectly)
      fail("submit_chen_van_evidence not gated on connectedVanToChen = true");
    else
      pass("submit_chen_van_evidence gated on connectedVanToChen = true");

    if (chenVan.nextSceneId !== "chapter4_chen_van_evidence_note")
      fail("submit_chen_van_evidence does not target chapter4_chen_van_evidence_note");
    else
      pass("submit_chen_van_evidence targets chapter4_chen_van_evidence_note");
  }

  // Regression: existing choices unchanged
  const endShift = bridgeScene.choices.find(c => c.id === "end_shift");
  if (!endShift || endShift.nextSceneId !== "ending_full_truth")
    fail("end_shift missing or no longer targets ending_full_truth");
  else
    pass("end_shift still targets ending_full_truth");

  const submitComplete = bridgeScene.choices.find(c => c.id === "submit_complete_evidence");
  if (!submitComplete ||
      !submitComplete.condition ||
      submitComplete.condition.key !== "jammerEvidenceSaved" ||
      submitComplete.nextSceneId   !== "ending_full_truth_complete")
    fail("submit_complete_evidence missing, ungated, or wrong destination");
  else
    pass("submit_complete_evidence still gated on jammerEvidenceSaved OK");

  const checkBroadcast = bridgeScene.choices.find(c => c.id === "check_broadcast");
  if (!checkBroadcast || checkBroadcast.nextSceneId !== "chapter5_broadcast_returns")
    fail("check_broadcast missing or no longer targets chapter5_broadcast_returns");
  else
    pass("check_broadcast still targets chapter5_broadcast_returns");
}

// Note scene exit: submit_and_end → ending_full_truth_complete
const noteScene = map["chapter4_chen_van_evidence_note"];
if (noteScene) {
  const submitAndEnd = noteScene.choices.find(c => c.id === "submit_and_end");
  if (!submitAndEnd || submitAndEnd.nextSceneId !== "ending_full_truth_complete")
    fail("submit_and_end missing or does not target ending_full_truth_complete");
  else
    pass("submit_and_end targets ending_full_truth_complete");
}

// ═════════════════════════════════════════════════════════════════════════
console.log("");
console.log(failures === 0 ? "ALL CHECKS PASSED" : "FAILURES: " + failures);
process.exit(failures > 0 ? 1 : 0);
