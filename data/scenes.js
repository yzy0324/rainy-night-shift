// ── Scene Data ────────────────────────────────────────────────────────────────
// Phase 3: 10 scenes.
// New: chapter0_arrival, chapter0_terminal, chapter1_tension_rises,
//      chapter1_comfort_alt.
// Choices carry optional effects and condition fields.
//   effects   — array applied when the choice is selected.
//   condition — single object; choice hidden if condition returns false.
// Scene IDs are ASCII only.
// No import/export — window global, loaded by plain <script> tag.

window.SCENES = [

  // ── Chapter 0: arrival ────────────────────────────────────────────────────
  {
    id:        "chapter0_arrival",
    chapterId: "chapter0",
    type:      "system",
    speaker:   "系统",
    text:      "雨夜。你推开值班室的铁门，雨水顺着伞尖滴落。荧光灯在头顶嗡嗡作响，空气中弥漫着潮湿的金属味。",
    choices: [
      {
        id:          "enter",
        label:       "进入值班室",
        nextSceneId: "chapter0_terminal",
        effects: [
          { type: "setFlag", key: "arrivedAtStation", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 0: terminal boot ──────────────────────────────────────────────
  {
    id:        "chapter0_terminal",
    chapterId: "chapter0",
    type:      "system",
    speaker:   "系统",
    text:      "你坐到旧转椅上，按下显示器电源。屏幕闪烁着亮起，一串字符快速滚动。系统加载完毕。",
    choices: [
      {
        id:          "start_shift",
        label:       "开始值班",
        nextSceneId: "chapter0_start"
      }
    ]
  },

  // ── Chapter 0: phone rings ────────────────────────────────────────────────
  {
    id:        "chapter0_start",
    chapterId: "chapter0",
    type:      "system",
    speaker:   "系统",
    text:      "窗外雨点敲打着玻璃，汇成一片模糊的灰色。值班室里只有老旧的荧光灯发出低鸣。一声突兀的电话铃声打破了寂静。",
    choices: [
      {
        id:          "answer",
        label:       "接听电话",
        nextSceneId: "chapter1_lin_xia_call"
      }
    ]
  },

  // ── Chapter 1: Lin Xia's call ─────────────────────────────────────────────
  // Both choices funnel to chapter1_tension_rises.
  // "别怕" explicitly sets pressedForDetails:false so the condition check at
  // chapter1_tension_rises never tests against undefined.
  {
    id:        "chapter1_lin_xia_call",
    chapterId: "chapter1",
    type:      "call",
    speaker:   "林夏",
    text:      "喂？是这里吗？我……我有点害怕。外面好像有人……",
    choices: [
      {
        id:          "comfort_open",
        label:       "别怕，告诉我情况。",
        nextSceneId: "chapter1_tension_rises",
        effects: [
          { type: "setFlag", key: "pressedForDetails", value: false, operation: "set" }
        ]
      },
      {
        id:          "question_open",
        label:       "你是谁？电话是从哪里打来的？",
        nextSceneId: "chapter1_tension_rises",
        effects: [
          { type: "setFlag", key: "pressedForDetails", value: true,  operation: "set" },
          { type: "addClue", key: "clue_lin_xia_hesitation",         operation: "push" }
        ]
      }
    ]
  },

  // ── Chapter 1: tension rises (mandatory middle) ───────────────────────────
  // "别慌" / "(察觉语气)" are mutually exclusive via pressedForDetails flag.
  // All three choices add clue_static_interference; doubt path also adds
  // clue_wrong_number_doubt.
  {
    id:        "chapter1_tension_rises",
    chapterId: "chapter1",
    type:      "call",
    speaker:   "林夏",
    text:      "我……我不知道。信号不太好，声音断断续续的。我听到门外有刮擦声。你……你相信我吗？",
    choices: [
      {
        id:          "comfort_mid",
        label:       "别慌，我在这里。慢慢说。",
        nextSceneId: "chapter1_comfort",
        condition: { type: "flag", key: "pressedForDetails", operator: "equals", value: false },
        effects: [
          { type: "addClue", key: "clue_static_interference", operation: "push" }
        ]
      },
      {
        id:          "comfort_alt_mid",
        label:       "（她察觉到了你的语气变化……）",
        nextSceneId: "chapter1_comfort_alt",
        condition: { type: "flag", key: "pressedForDetails", operator: "equals", value: true },
        effects: [
          { type: "addClue", key: "clue_static_interference", operation: "push" }
        ]
      },
      {
        id:          "doubt_mid",
        label:       "你确定这不是恶作剧？电话号码显示不是本地。",
        nextSceneId: "chapter1_question",
        effects: [
          { type: "addClue", key: "clue_static_interference",  operation: "push" },
          { type: "addClue", key: "clue_wrong_number_doubt",   operation: "push" }
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
    text:      "谢谢你……我只是有点紧张。你这么说我就安心多了。",
    choices: [
      {
        id:          "to_end",
        label:       "我会一直守着电话，别挂断。",
        nextSceneId: "ending_shift_over"
      },
      {
        id:          "ask_detail",
        label:       "你还能回忆起其他细节吗？",
        nextSceneId: "ending_clue_bonus"
      }
    ]
  },

  // ── Chapter 1 branch A-alt: comfort after pressing for details ────────────
  // Reached only when pressedForDetails is true. Lin Xia noticed the
  // dispatcher's earlier interrogative tone and challenges the sudden shift.
  {
    id:        "chapter1_comfort_alt",
    chapterId: "chapter1",
    type:      "call",
    speaker:   "林夏",
    text:      "你……刚才追问的时候语气不太一样。现在又让我别慌？我到底该相信什么？",
    choices: [
      {
        id:          "apologize",
        label:       "抱歉，我只是想帮你。请相信我。",
        nextSceneId: "ending_clue_bonus"
      },
      {
        id:          "let_decide",
        label:       "你不需要相信我——你自己判断。",
        nextSceneId: "ending_shift_over"
      }
    ]
  },

  // ── Chapter 1 branch B: question ──────────────────────────────────────────
  // The conditional choice "追问她的迟疑" is visible only when
  // clue_lin_xia_hesitation was collected (requires the investigative path
  // through chapter1_lin_xia_call before reaching chapter1_tension_rises).
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
    text:      "雨声渐息。值班室重归寂静，只有荧光灯依旧嗡嗡作响。今夜的余温仍在，但更多的是一种未解的平静。",
    choices:   []
  },

  // ── Ending B: something lingers ───────────────────────────────────────────
  {
    id:        "ending_clue_bonus",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "雨声渐息。值班室重归寂静。林夏的迟疑，以及她那难以言说的恐惧，如同阴影般在你心头萦绕。她说不清的，也许并不只是恐惧，而是更深层的秘密。",
    choices:   []
  }

];

console.log("scenes loaded — count:", window.SCENES.length);
