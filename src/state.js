// ── Game State ────────────────────────────────────────────────────────────────
// Phase 1: tracks only the current scene.
// Future phases will add flags, stats, trust, clues — extend this object,
// do not replace it.
// No import/export — window global, loaded by plain <script> tag.

window.GameState = {
  currentSceneId: null,

  reset() {
    this.currentSceneId = null;
  }
};

console.log("state loaded");
