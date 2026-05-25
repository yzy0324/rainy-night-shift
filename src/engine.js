// ── Game Engine ───────────────────────────────────────────────────────────────
// Responsibilities: init, scene lookup (O(1) map), navigate between scenes.
// Does NOT manipulate the DOM — delegates all rendering to UI.
// Phase 2: applies effects and filters choices via conditions.
// No import/export — window global, loaded by plain <script> tag.

window.Engine = {

  _scenesMap: {},
  _ui:        null,

  // Called once by game.js when the player clicks Begin.
  init(metadata, scenes, ui, clues) {
    GameState.reset();   // ← Phase 1 non-blocker fix: clear stale state on init
    this._ui = ui;

    // Build O(1) scene lookup map from the flat array.
    this._scenesMap = {};
    scenes.forEach(scene => {
      this._scenesMap[scene.id] = scene;
    });

    console.log("engine: init — scenes indexed:", Object.keys(this._scenesMap).length);

    // Optional: log clue IDs for validation.
    if (clues) {
      console.log("engine: clues registered:", Object.keys(clues).join(", "));
    }

    this.loadScene(metadata.startSceneId);
  },

  // Load and display a scene by ID.
  loadScene(sceneId) {
    console.log("engine: loadScene →", sceneId);

    const scene = this._scenesMap[sceneId];

    if (!scene) {
      console.error("engine: scene not found:", sceneId);
      // Fallback error scene — never leaves the player on a blank screen.
      this._ui.render({
        id:        "_error",
        chapterId: "error",
        type:      "system",
        speaker:   "系统",
        text:      "场景加载失败，请刷新页面重试。",
        choices:   []
      });
      return;
    }

    GameState.currentSceneId = sceneId;

    // Filter out choices whose conditions are not met.
    // Use a shallow copy — do not mutate the original scene object.
    const visibleChoices = (scene.choices || []).filter(
      choice => Conditions.check(choice.condition)
    );

    this._ui.render({
      id:        scene.id,
      chapterId: scene.chapterId,
      type:      scene.type,
      speaker:   scene.speaker,
      text:      scene.text,
      choices:   visibleChoices
    });
  },

  // Called by UI when the player clicks a choice button.
  // Applies effects from the choice, then navigates to the next scene.
  chooseOption(choice) {
    console.log("engine: chooseOption →", choice.nextSceneId);
    Effects.apply(choice.effects);
    this.loadScene(choice.nextSceneId);
  }

};

console.log("engine loaded");
