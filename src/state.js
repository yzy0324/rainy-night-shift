// ── Game State ────────────────────────────────────────────────────────────────
// Phase 2: adds flags (boolean map) and clues (ID array).
// Phase 3 will add trust, stats — extend this object, do not replace it.
// No import/export — window global, loaded by plain <script> tag.

window.GameState = {
  currentSceneId: null,
  flags:          {},   // e.g. { comfortedLinXia: true }
  clues:          [],   // e.g. [ "clue_lin_xia_hesitation" ]

  reset() {
    this.currentSceneId = null;
    this.flags          = {};
    this.clues          = [];
  }
};

console.log("state loaded");
