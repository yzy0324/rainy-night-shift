// ── Game Metadata ─────────────────────────────────────────────────────────────
// Phase 3: expanded Chapter 0 intro; startSceneId updated to chapter0_arrival.
// Phase 4: version bumped to 0.4.0.
// Phase 5: Chapter 2 added; version bumped to 0.5.0.
// Phase 6: Chapter 3 old-platform investigation added; version bumped to 0.6.0.
// Phase 7: Chapter 3 action tools + Chapter 4 rescue arc added; version bumped to 0.7.0.
// Phase 8: Final evidence-choice gameplay and complete ending set; version bumped to 0.8.0.
// Phase 8.1: ending_failed_interception linked via chapter4_south_gate_route; version bumped to 0.8.1.
// Phase 9:   Chapter 5 horror layer added (16 new scenes); version bumped to 0.9.0.
// Phase 9.1: flag activation + evidence quality + horror escalation gate; version bumped to 0.9.1.
// Phase 9.2: trust consequence patch — usedCarefulQuestions and pressedTooHard now active; version bumped to 0.9.2.
// Phase 9.3: player-guidance patch — removed clue_wrong_number_doubt gate from chapter2_final_choice; version bumped to 0.9.3.
// v1.0:    horror presentation polish — horror-mode visual class, restart button text, Ch.0 atmospheric line.
// v1.1:    ending archive — localStorage-backed ending collection with in-memory fallback.
// v1.1.1:  post-ending atmospheric hints — one system-log line per ending.
// v1.2.0:  second-run horror memory — start screen shifts state after horror endings.
// v1.3.0:  Chen Ming Branch Payoff — challengedChen / connectedVanToChen flags,
//          conditional Ch.2 choice, new chapter2_chen_under_pressure scene.
// v1.4.0:  Chen / Van Evidence Payoff — connectedVanToChen now gates a second
//          route to ending_full_truth_complete via chapter4_chen_van_evidence_note.
// v1.4.1:  mobile archive close fix.
// v1.5.0:  background music support.
// No import/export — window global, loaded by plain <script> tag.

window.METADATA = {
  gameId:      "night-shift-dispatch",
  title:       "雨夜值班室 / Night Shift Dispatch",
  version:     "1.5.0",
  startSceneId: "chapter0_arrival"
};

console.log("metadata loaded");
