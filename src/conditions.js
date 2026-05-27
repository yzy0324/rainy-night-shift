// ── Condition Checker ─────────────────────────────────────────────────────────
// Phase 2: evaluates a single condition object against GameState.
// Phase 4: fixed fallthrough — unknown type/operator now returns false (safe hide).
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

    // Safe fallback: hide the choice if operator/type is unrecognised.
    // Phase 4 fix: was incorrectly returning true (show), now returns false (hide).
    return false;
  }

};

console.log("conditions loaded");
