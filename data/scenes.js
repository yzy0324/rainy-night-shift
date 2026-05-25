// ── Scene Data ────────────────────────────────────────────────────────────────
// Phase 2: 6 scenes. Choices may carry optional effects and condition fields.
// effects  — array of effect objects applied when this choice is selected.
// condition — single condition object; choice is hidden if condition is false.
// Scene IDs are ASCII only.
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
        nextSceneId: "chapter1_comfort",
        effects: [
          { type: "setFlag", key: "comfortedLinXia", value: true, operation: "set" }
        ]
      },
      {
        id:          "question",
        label:       "询问细节",
        nextSceneId: "chapter1_question",
        effects: [
          { type: "setFlag", key: "pressedForDetails", value: true, operation: "set" },
          { type: "addClue", key: "clue_lin_xia_hesitation", operation: "push" }
        ]
      }
    ]
  },

  // ── Chapter 1 branch A: comfort ───────────────────────────────────────────
  {
    id:        "chapter1_comfort",
    chapterId: "chapter1",
    type:      "call",
    speaker:   "林夏",
    text:      "谢谢你……我只是有点紧张。你在就好。",
    choices: [
      {
        id:          "to_end",
        label:       "继续值班",
        nextSceneId: "ending_shift_over"
      }
    ]
  },

  // ── Chapter 1 branch B: question ──────────────────────────────────────────
  // The conditional choice "追问她的迟疑" appears only when the hesitation
  // clue has been collected — which happens the moment the player picks
  // "询问细节". This demonstrates the condition system on a live playthrough.
  {
    id:        "chapter1_question",
    chapterId: "chapter1",
    type:      "call",
    speaker:   "林夏",
    text:      "细节……我，我有点说不清。总觉得有人在盯着我，但又看不到人。",
    choices: [
      {
        id:          "to_end",
        label:       "继续值班",
        nextSceneId: "ending_shift_over"
      },
      {
        id:          "press_hesitation",
        label:       "追问她的迟疑",
        nextSceneId: "ending_clue_bonus",
        // Visible only when the hesitation clue is in GameState.clues.
        condition: {
          type:     "clue",
          key:      "clue_lin_xia_hesitation",
          operator: "includes",
          value:    true
        }
      }
    ]
  },

  // ── Ending A: standard shift over ─────────────────────────────────────────
  {
    id:        "ending_shift_over",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "雨声渐息。值班室重归寂静，但今夜的余温仍在。",
    choices:   []
  },

  // ── Ending B: clue bonus (reached only via 追问她的迟疑) ───────────────────
  {
    id:        "ending_clue_bonus",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "雨声渐息。林夏的迟疑还悬在你心头——她说不清的，也许并不只是恐惧。",
    choices:   []
  }

];

console.log("scenes loaded — count:", window.SCENES.length);
