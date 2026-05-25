// ── Effects Runner ────────────────────────────────────────────────────────────
// Phase 2: applies a list of effect objects to GameState after a choice is made.
// Supported types: setFlag, addClue.
// No import/export — window global, loaded by plain <script> tag.

window.Effects = {

  // Apply an array of effect objects to the global GameState.
  apply(effects) {
    if (!effects || effects.length === 0) return;

    effects.forEach(effect => {
      switch (effect.type) {

        case "setFlag":
          GameState.flags[effect.key] = effect.value;
          console.log("effect: flag set —", effect.key, "=", effect.value);
          break;

        case "addClue":
          if (!GameState.clues.includes(effect.key)) {
            GameState.clues.push(effect.key);
            console.log("effect: clue added —", effect.key);
          }
          break;

        default:
          console.warn("Effects.apply: unknown type —", effect.type);
      }
    });
  }

};

console.log("effects loaded");
