// ── Game Engine ───────────────────────────────────────────────────────────────
// Responsibilities: init, scene lookup (O(1) map), navigate between scenes.
// Does NOT manipulate the DOM — delegates all rendering to UI.
// Phase 2 extension points: chooseOption() is where effects/conditions hook in.
// No import/export — window global, loaded by plain <script> tag.

window.Engine = {

  _scenesMap: {},
  _ui:        null,

  // Called once by game.js when the player clicks Begin.
  init(metadata, scenes, ui) {
    this._ui = ui;

    // Build O(1) scene lookup map from the flat array.
    this._scenesMap = {};
    scenes.forEach(scene => {
      this._scenesMap[scene.id] = scene;
    });

    console.log("engine: init — scenes indexed:", Object.keys(this._scenesMap).length);

    GameState.currentSceneId = metadata.startSceneId;
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
    this._ui.render(scene);
  },

  // Called by UI when the player clicks a choice button.
  // Phase 2: apply effects and evaluate conditions here before navigating.
  chooseOption(nextSceneId) {
    console.log("engine: chooseOption →", nextSceneId);
    this.loadScene(nextSceneId);
  }

};

console.log("engine loaded");
