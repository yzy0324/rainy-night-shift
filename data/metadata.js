// ── Game Metadata ─────────────────────────────────────────────────────────────
// Phase 1: title, version, and the first scene to load.
// No import/export — window global, loaded by plain <script> tag.

window.METADATA = {
  gameId:      "night-shift-dispatch",
  title:       "雨夜值班室 / Night Shift Dispatch",
  version:     "0.1.0",
  startSceneId: "chapter0_start"
};

console.log("metadata loaded");
