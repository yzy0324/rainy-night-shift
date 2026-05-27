// ── UI Renderer ───────────────────────────────────────────────────────────────
// Responsibilities: read a scene object, write to DOM.
// Does NOT contain game logic — delegates navigation to Engine.
// Phase 2: null-checks added for containers; chooseOption receives full choice.
// Phase 4: fixed button selector; added renderClues(); rewrote showEnding() with
//          clue count, clue list, and restart button; all text via textContent.
// Redesign Pass: Added structural optimizations to align layout elements safely.
// No import/export — window global, loaded by plain <script> tag.

window.UI = {

  // Entry point called by Engine after every scene load.
  render(scene) {
    this.renderStory(scene.speaker, scene.text);
    this.renderChoices(scene.choices);
  },

  // Write speaker + text to the story panel.
  // textContent is used — never innerHTML — to prevent HTML injection.
  renderStory(speaker, text) {
    const container = document.getElementById("story-container");
    if (!container) { console.error("UI: #story-container not found"); return; }
    container.textContent = (speaker ? speaker + "：" : "") + text;
  },

  // Build choice buttons, or show the ending message if choices is empty.
  renderChoices(choices) {
    const container = document.getElementById("choices-container");
    if (!container) { console.error("UI: #choices-container not found"); return; }
    container.innerHTML = "";

    if (!choices || choices.length === 0) {
      this.showEnding();
      return;
    }

    choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className   = "choice-btn";
      btn.textContent = choice.label;

      btn.addEventListener("click", () => {
        // Phase 4 fix: was querySelectorAll("button") — now correctly targets
        // only .choice-btn so unrelated buttons are never accidentally disabled.
        container.querySelectorAll("button.choice-btn").forEach(b => {
          b.disabled = true;
        });
        Engine.chooseOption(choice);  // pass full choice object (effects + nextSceneId)
      });

      container.appendChild(btn);
    });
  },

  // Replace the choices area with ending info: clue count, clue list, restart.
  // All text set via textContent — no innerHTML for any dynamic content.
  showEnding() {
    const container = document.getElementById("choices-container");
    if (!container) { console.error("UI: #choices-container not found"); return; }
    container.innerHTML = "";

    // ── Clue progress hint ──
    const clueCount = GameState.clues.length;
    const progress   = document.createElement("p");
    progress.className   = "ending-clue-count";
    progress.textContent = "🔍 线索收集进度：" + clueCount + " / 3";
    container.appendChild(progress);

    // ── Collected clue titles ──
    if (clueCount > 0) {
      GameState.clues.forEach(clueId => {
        const clue = CLUES[clueId];
        if (!clue) return;
        const item = document.createElement("p");
        item.className   = "ending-clue-item";
        item.textContent = "・ " + clue.title;
        container.appendChild(item);
      });
    }

    // ── End-of-shift separator ──
    const sep = document.createElement("p");
    sep.className   = "ending-message";
    sep.textContent = "— 信号中断 / 值班结束 —";
    container.appendChild(sep);

    // ── Restart button ──
    const restartBtn = document.createElement("button");
    restartBtn.className   = "choice-btn restart-btn";
    restartBtn.textContent = "重置系统 RESTART";
    restartBtn.addEventListener("click", () => {
      // Re-initialise engine with the same globals — game screen stays visible.
      Engine.init(METADATA, SCENES, UI, CLUES);
    });
    container.appendChild(restartBtn);
  },

  // Rebuild the clue panel from GameState.clues.
  // Called by Engine.loadScene() on every scene transition.
  // Each clue title is clickable to expand/collapse the description.
  renderClues() {
    const panel = document.getElementById("clue-list");
    if (!panel) { console.error("UI: #clue-list not found"); return; }

    // Clear existing items.
    while (panel.firstChild) { panel.removeChild(panel.firstChild); }

    if (GameState.clues.length === 0) {
      // Leave panel empty — heading "线索" is already visible.
      return;
    }

    GameState.clues.forEach(clueId => {
      const clue = CLUES[clueId];
      if (!clue) { console.warn("UI: unknown clue id —", clueId); return; }

      const item = document.createElement("div");
      item.className = "clue-item";

      const titleEl = document.createElement("div");
      titleEl.className   = "clue-title";
      titleEl.textContent = clue.title;

      const descEl = document.createElement("p");
      descEl.className   = "clue-desc";
      descEl.textContent = clue.description;
      descEl.style.display = "none";   // collapsed by default

      item.appendChild(titleEl);
      item.appendChild(descEl);

      // Toggle description on click.
      item.addEventListener("click", () => {
        descEl.style.display = (descEl.style.display === "none") ? "block" : "none";
      });

      panel.appendChild(item);
    });
  }

};

console.log("ui loaded");