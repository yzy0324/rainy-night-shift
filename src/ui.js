// ── UI Renderer ───────────────────────────────────────────────────────────────
// Responsibilities: read a scene object, write to DOM.
// Does NOT contain game logic — delegates navigation to Engine.
// Phase 2: null-checks added for containers; chooseOption receives full choice.
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
        // Disable every button on first click — prevents double-fire.
        container.querySelectorAll("button").forEach(b => {
          b.disabled = true;
        });
        Engine.chooseOption(choice);  // pass full choice object (effects + nextSceneId)
      });

      container.appendChild(btn);
    });
  },

  // Replace the choices area with a static end-of-shift message.
  showEnding() {
    const container = document.getElementById("choices-container");
    if (!container) { console.error("UI: #choices-container not found"); return; }
    container.innerHTML = "";

    const msg = document.createElement("p");
    msg.className   = "ending-message";
    msg.textContent = "— 值班结束。刷新页面重新开始。 —";
    container.appendChild(msg);
  }

};

console.log("ui loaded");
