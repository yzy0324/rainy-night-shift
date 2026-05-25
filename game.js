// ── Entry Point ───────────────────────────────────────────────────────────────
// Wires together: METADATA, SCENES, GameState, Engine, UI.
// Owns the Begin button handler only — no game logic here.
// No import/export — loaded last by plain <script> tag.

console.log("game loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("game.js ready");

  const startScreen = document.getElementById("start-screen");
  const gameScreen  = document.getElementById("game-screen");
  const beginBtn    = document.getElementById("begin-btn");

  if (!beginBtn) {
    console.error("game.js: #begin-btn not found — check index.html");
    return;
  }

  beginBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    gameScreen.style.display  = "block";
    Engine.init(METADATA, SCENES, UI);
  });
});
