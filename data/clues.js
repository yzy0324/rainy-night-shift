// ── Clue Metadata ─────────────────────────────────────────────────────────────
// Phase 2: clue title and description for console / debug use.
// No UI panel — clues exist in GameState only, not displayed to the player.
// No import/export — window global, loaded by plain <script> tag.

window.CLUES = {
  "clue_lin_xia_hesitation": {
    title:       "林夏的迟疑",
    description: "她在回答细节时语气变得迟疑，说不清来者是谁。"
  }
};

console.log("clues loaded");
