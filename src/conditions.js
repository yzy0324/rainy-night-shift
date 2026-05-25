// ── Condition Checker ─────────────────────────────────────────────────────────
// Phase 2: evaluates a single condition object against GameState.
// Returns true (show choice) or false (hide choice).
// No AND/OR nesting — one condition per choice only.
// No import/export — window global, loaded by plain <script> tag.

window.Conditions = {

  // Returns true if the condition is met, or if no condition is given.
  check(condition) {
    if (!condition) return true;  // no condition = always visible

    const { type, key, operator, value } = condition;

    switch (type) {

      case "flag":
        if (operator === "equals") {
          return GameState.flags[key] === value;
        }
        break;

      case "clue":
        if (operator === "includes") {
          return GameState.clues.includes(key) === value;
        }
        break;

      default:
        console.warn("Conditions.check: unknown type —", type);
    }

    // Safe fallback: show the choice if operator/type is unrecognised.
    return true;
  }

};

console.log("conditions loaded");
