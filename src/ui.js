// ── UI Renderer ───────────────────────────────────────────────────────────────
// Responsibilities: read a scene object, write to DOM.
// Does NOT contain game logic — delegates navigation to Engine.
// Phase 2: null-checks added for containers; chooseOption receives full choice.
// Phase 4: fixed button selector; added renderClues(); rewrote showEnding() with
//          clue count, clue list, and restart button; all text via textContent.
// Redesign Pass: Added structural optimizations to align layout elements safely.
// No import/export — window global, loaded by plain <script> tag.

window.UI = {

  _toggleWired:  false,
  _currentScene: null,
  _archiveWired: false,

  // Entry point called by Engine after every scene load.
  render(scene) {
    this._currentScene = scene;
    this._setHorrorMode(scene);
    this.renderStory(scene.speaker, scene.text);
    this.renderChoices(scene.choices);
  },

  // Apply or remove the horror-mode class on #game-screen.
  // Called on every scene load — guarantees clean removal when normal scenes reload after restart.
  _setHorrorMode(scene) {
    const screen = document.getElementById("game-screen");
    if (!screen) return;
    const isHorror = scene.chapterId === "chapter5"           ||
                     scene.id === "ending_true_horror"         ||
                     scene.id === "ending_taken_by_shift"      ||
                     scene.id === "ending_lin_xia_left_behind";
    screen.classList.toggle("horror-mode", isHorror);
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
    // Record this ending in the archive before touching the DOM.
    if (typeof Archive !== "undefined" && this._currentScene) {
      Archive.unlock(this._currentScene.id);
    }

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

    // ── Atmospheric hint ──
    // One system-log line per ending — non-spoiler, cold, station-record tone.
    const hintText = (typeof ENDING_HINTS !== "undefined") &&
                     this._currentScene &&
                     ENDING_HINTS[this._currentScene.id];
    if (hintText) {
      const hintEl = document.createElement("p");
      hintEl.className   = "ending-hint";
      hintEl.textContent = hintText;
      container.appendChild(hintEl);
    }

    // ── Restart button ──
    const horrorEndingIds  = ["ending_true_horror", "ending_taken_by_shift", "ending_lin_xia_left_behind"];
    const isHorrorEnding   = this._currentScene && horrorEndingIds.indexOf(this._currentScene.id) !== -1;
    const restartBtn = document.createElement("button");
    restartBtn.className   = "choice-btn restart-btn";
    restartBtn.textContent = isHorrorEnding ? "重新接班 RESET_SHIFT" : "重置系统 RESTART";
    restartBtn.addEventListener("click", () => {
      // Re-initialise engine with the same globals — game screen stays visible.
      Engine.init(METADATA, SCENES, UI, CLUES);
    });
    container.appendChild(restartBtn);

    // ── Archive link ──
    const archiveBtn = document.createElement("button");
    archiveBtn.className   = "choice-btn archive-btn";
    archiveBtn.textContent = "[ 档案记录 RECORDS ]";
    archiveBtn.addEventListener("click", () => { this.showArchive(); });
    container.appendChild(archiveBtn);
  },

  // ── Archive ───────────────────────────────────────────────────────────────

  // Wire the static archive controls. Idempotent — runs only once per page load.
  _wireArchiveControls() {
    if (this._archiveWired) return;
    const openBtn  = document.getElementById("archive-open-btn");
    const closeBtn = document.getElementById("archive-close");
    if (!openBtn || !closeBtn) return;
    openBtn.addEventListener("click",  () => { this.showArchive(); });
    closeBtn.addEventListener("click", () => { this.hideArchive(); });
    // Escape key closes the overlay when it is visible.
    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      const overlay = document.getElementById("archive-overlay");
      if (overlay && overlay.style.display !== "none") this.hideArchive();
    });
    this._archiveWired = true;
  },

  // Populate #archive-list and update #archive-count from Archive data.
  renderArchive() {
    const list  = document.getElementById("archive-list");
    const count = document.getElementById("archive-count");
    if (!list || !count) return;

    const unlockCount = (typeof Archive !== "undefined") ? Archive.getCount() : 0;
    count.textContent = "已记录 / RECORDS: " + unlockCount + " / 10";

    while (list.firstChild) { list.removeChild(list.firstChild); }

    const entries = (typeof Archive !== "undefined") ? Archive.getAll() : [];
    entries.forEach(entry => {
      const row = document.createElement("div");
      row.className = "archive-entry " + (entry.unlocked ? "is-unlocked" : "is-locked");

      const dot = document.createElement("span");
      dot.className   = "archive-indicator";
      dot.textContent = entry.unlocked ? "●" : "○";

      const body = document.createElement("div");
      body.className = "archive-entry-body";

      const titleEl = document.createElement("div");
      titleEl.className = "archive-entry-title";

      if (entry.unlocked) {
        titleEl.textContent = entry.title;
        const descEl = document.createElement("p");
        descEl.className   = "archive-entry-desc";
        descEl.textContent = entry.description;
        body.appendChild(titleEl);
        body.appendChild(descEl);
      } else {
        titleEl.textContent = "─ ─ ─ ─ ─ ─ ─ ─ ─ ─  [SEALED]";
        body.appendChild(titleEl);
      }

      row.appendChild(dot);
      row.appendChild(body);
      list.appendChild(row);
    });
  },

  // Open the archive overlay, closing the mobile clue drawer first if open.
  showArchive() {
    const cluePanel  = document.getElementById("clue-panel");
    const clueToggle = document.getElementById("clue-toggle");
    if (cluePanel && cluePanel.classList.contains("is-open")) {
      cluePanel.classList.remove("is-open");
      if (clueToggle) clueToggle.setAttribute("aria-expanded", "false");
    }
    this.renderArchive();
    const overlay = document.getElementById("archive-overlay");
    if (overlay) overlay.style.display = "flex";
  },

  // Close the archive overlay.
  hideArchive() {
    const overlay = document.getElementById("archive-overlay");
    if (overlay) overlay.style.display = "none";
  },

  // Apply second-run horror-memory state to the start screen.
  // Called once at UI boot. Cosmetic only — does not touch click handlers or
  // game logic. Safe no-op if Archive is unavailable or no horror ending has
  // been reached. Persists automatically because it reads from existing
  // Archive / localStorage data; no new storage key is introduced.
  _initStartScreen() {
    if (typeof Archive === "undefined") return;
    const horrorIds = [
      "ending_taken_by_shift",
      "ending_lin_xia_left_behind",
      "ending_true_horror"
    ];
    if (!Archive.hasAnyUnlocked(horrorIds)) return;

    const screen = document.getElementById("start-screen");
    if (screen) screen.classList.add("has-horror-memory");

    const tag = document.querySelector(".system-status-tag");
    if (tag) tag.textContent = "STATION SYSTEM v4.02 // SHIFT ON RECORD";

    const atm = document.getElementById("atmosphere-text");
    if (atm) atm.textContent = "又是这里。电话会响的。";

    const btn = document.getElementById("begin-btn");
    if (btn) btn.textContent = "重新接班 RUN_SYSTEM";
  },

  // Wire the mobile clue-toggle button. Idempotent — runs only once per page load.
  _wireClueToggle() {
    if (this._toggleWired) return;
    const toggleBtn = document.getElementById("clue-toggle");
    const cluePanel = document.getElementById("clue-panel");
    if (!toggleBtn || !cluePanel) return;
    toggleBtn.addEventListener("click", () => {
      const opening = !cluePanel.classList.contains("is-open");
      cluePanel.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(opening));
    });
    const closeBtn = document.getElementById("clue-panel-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        cluePanel.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    }
    this._toggleWired = true;
  },

  // Rebuild the clue panel from GameState.clues.
  // Called by Engine.loadScene() on every scene transition.
  // Each clue title is clickable to expand/collapse the description.
  renderClues() {
    this._wireClueToggle();
    this._wireArchiveControls();

    // Keep the floating toggle button text in sync with the current clue count.
    const toggleBtn = document.getElementById("clue-toggle");
    if (toggleBtn) {
      toggleBtn.textContent = "线索 " + GameState.clues.length + " / 3";
    }

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

// Wire static archive controls immediately — the start-screen open button must
// work before Engine.init() is ever called. _wireArchiveControls is idempotent,
// so the later call from renderClues() is a safe no-op.
UI._wireArchiveControls();
UI._initStartScreen();

console.log("ui loaded");