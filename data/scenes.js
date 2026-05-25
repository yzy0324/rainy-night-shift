// ── Scene Data ────────────────────────────────────────────────────────────────
// Phase 1: exactly 5 scenes.
// Scene IDs are ASCII only.
// No effects, no conditions — plain navigation only.
// No import/export — window global, loaded by plain <script> tag.

window.SCENES = [

  // ── Chapter 0: shift begins ───────────────────────────────────────────────
  {
    id:        "chapter0_start",
    chapterId: "chapter0",
    type:      "system",
    speaker:   "系统",
    text:      "雨夜值班室。寂静的电话，未知的来电。",
    choices: [
      {
        id:          "answer",
        label:       "接听电话",
        nextSceneId: "chapter1_lin_xia_call"
      }
    ]
  },

  // ── Chapter 1: Lin Xia's call ─────────────────────────────────────────────
  {
    id:        "chapter1_lin_xia_call",
    chapterId: "chapter1",
    type:      "call",
    speaker:   "林夏",
    text:      "喂？是这里吗？我……我有点害怕。",
    choices: [
      {
        id:          "comfort",
        label:       "安慰她",
        nextSceneId: "chapter1_comfort"
      },
      {
        id:          "question",
        label:       "询问细节",
        nextSceneId: "chapter1_question"
      }
    ]
  },

  // ── Chapter 1 branch A: comfort ───────────────────────────────────────────
  {
    id:        "chapter1_comfort",
    chapterId: "chapter1",
    type:      "call",
    speaker:   "林夏",
    text:      "没事的，我在这里。你慢慢说。",
    choices: [
      {
        id:          "to_end",
        label:       "继续值班",
        nextSceneId: "ending_shift_over"
      }
    ]
  },

  // ── Chapter 1 branch B: question ──────────────────────────────────────────
  {
    id:        "chapter1_question",
    chapterId: "chapter1",
    type:      "call",
    speaker:   "林夏",
    text:      "请告诉我具体情况，我需要了解。",
    choices: [
      {
        id:          "to_end",
        label:       "继续值班",
        nextSceneId: "ending_shift_over"
      }
    ]
  },

  // ── Ending ────────────────────────────────────────────────────────────────
  {
    id:        "ending_shift_over",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "雨声渐息。值班室重归寂静，但今夜的余温仍在。",
    choices:   []
  }

];

console.log("scenes loaded — count:", window.SCENES.length);
