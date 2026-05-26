// ── Scene Data ────────────────────────────────────────────────────────────────
// Phase 3: 10 scenes (chapter0 + chapter1 arc).
// Phase 4: removed arrivedAtStation flag.
// Phase 5: 8 new scenes — Chapter 2 arc (chapter2_*) + 2 new endings.
//           Former bridge scenes (ending_shift_over, ending_clue_bonus) now
//           continue into Chapter 2 instead of terminating.
//           clue_wrong_number_doubt gates the Chapter 2 truth-ending path.
//           clue_static_interference gates the signal-interference branch.
//           clue_lin_xia_hesitation gates the hesitation follow-up (Ch. 1, unchanged).
// Phase 6: 7 new scenes — Chapter 3 old-platform investigation arc.
//           ending_truth_uncovered converted from terminal ending to Ch. 3 bridge.
//           New scenes: chapter3_dispatch_call, chapter3_monitor_room,
//           chapter3_platform3, chapter3_south_tunnel, chapter3_power_corridor,
//           chapter3_go_alone_warning, ending_bad_alone.
//           New flags: dispatchWarned, foundLinXiaTrace, vanConfirmedOnCamera,
//           wetFootprintsFound.  Total scenes: 25.
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
        nextSceneId: "chapter0_terminal"
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

  // ── Chapter 1: tension rises (mandatory hub) ──────────────────────────────
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
        id:          "to_bridge",
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
  // The conditional choice "追问她的迟疑" requires clue_lin_xia_hesitation.
  {
    id:        "chapter1_question",
    chapterId: "chapter1",
    type:      "call",
    speaker:   "林夏",
    text:      "细节……我，我有点说不清。总觉得有人在盯着我，但又看不到人。",
    choices: [
      {
        id:          "to_bridge",
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

  // ── Chapter 1 → Chapter 2 bridge A ───────────────────────────────────────
  // Phase 5: was a terminal ending; now a narrative beat bridging into Chapter 2.
  // Preserves the original atmospheric text; adds a single forced choice forward.
  {
    id:        "ending_shift_over",
    chapterId: "chapter2",
    type:      "system",
    speaker:   "系统",
    text:      "雨声渐息。值班室重归寂静，只有荧光灯依旧嗡嗡作响。今夜的余温仍在，但更多的是一种未解的平静。",
    choices: [
      {
        id:          "continue_shift",
        label:       "值班还未结束。",
        nextSceneId: "chapter2_intro"
      }
    ]
  },

  // ── Chapter 1 → Chapter 2 bridge B ───────────────────────────────────────
  // Phase 5: was a terminal ending; now a narrative beat bridging into Chapter 2.
  {
    id:        "ending_clue_bonus",
    chapterId: "chapter2",
    type:      "system",
    speaker:   "系统",
    text:      "雨声渐息。值班室重归寂静。林夏的迟疑，以及她那难以言说的恐惧，如同阴影般在你心头萦绕。她说不清的，也许并不只是恐惧，而是更深层的秘密。",
    choices: [
      {
        id:          "investigate_further",
        label:       "你决定继续追查。",
        nextSceneId: "chapter2_intro"
      }
    ]
  },

  // ── Chapter 2: intro ──────────────────────────────────────────────────────
  // Narrative beat: rain eases, the dispatcher logs Lin Xia's call. A second
  // phone — the external-report line — rings before they can leave.
  {
    id:        "chapter2_intro",
    chapterId: "chapter2",
    type:      "system",
    speaker:   "系统",
    text:      "雨渐小了。你在值班日志上写下林夏来电的简要记录，合上了本子。就在你放下笔的瞬间，桌上另一部电话响起——那部专门用于接收外部报案的副机。",
    choices: [
      {
        id:          "pick_up",
        label:       "拿起副机",
        nextSceneId: "chapter2_second_call"
      }
    ]
  },

  // ── Chapter 2: second call ────────────────────────────────────────────────
  // Chen Ming, a taxi driver who was near the area, calls in. He immediately
  // uses Lin Xia's full name — which is suspicious if the player already holds
  // clue_wrong_number_doubt (they noticed the non-local number in Chapter 1).
  // That conditional choice is only visible when the clue is held.
  {
    id:        "chapter2_second_call",
    chapterId: "chapter2",
    type:      "call",
    speaker:   "陈明",
    text:      "喂，是值班室吗？我是陈明，出租车司机，今晚在江北路那一带。你们刚才……是不是接到一个女士的电话了？那个女士，叫林夏。",
    choices: [
      {
        id:          "ask_how_knows",
        label:       "你怎么知道她的名字？",
        nextSceneId: "chapter2_chen_cornered",
        condition: {
          type:     "clue",
          key:      "clue_wrong_number_doubt",
          operator: "includes",
          value:    true
        }
      },
      {
        id:          "ask_what_saw",
        label:       "你在那一带看到了什么？",
        nextSceneId: "chapter2_chen_details"
      }
    ]
  },

  // ── Chapter 2: Chen cornered ──────────────────────────────────────────────
  // Reached only if the player held clue_wrong_number_doubt and challenged
  // Chen on knowing Lin Xia's name. Chen deflects without answering directly.
  // Single forced choice — the player presses the point and continues.
  {
    id:        "chapter2_chen_cornered",
    chapterId: "chapter2",
    type:      "call",
    speaker:   "陈明",
    text:      "我……这一带的事，周围的人都知道一些。你们记录了她的位置了吗？那个地方……不太对劲。",
    choices: [
      {
        id:          "press_on",
        label:       "你绕开了我的问题。你是怎么知道她名字的？",
        nextSceneId: "chapter2_final_choice"
      }
    ]
  },

  // ── Chapter 2: Chen gives details ─────────────────────────────────────────
  // Chen describes a figure he watched outside the building. He asks whether
  // the earlier call had signal interference — which opens a conditional choice
  // for players who hold clue_static_interference (collected on all Ch.1 paths,
  // so this branch is always reachable; the condition enforces narrative logic).
  {
    id:        "chapter2_chen_details",
    chapterId: "chapter2",
    type:      "call",
    speaker:   "陈明",
    text:      "我看到有人从那栋楼出来，步伐很快，在楼门口停了一会儿——一直盯着某一层的窗。等他走了，大概两三分钟，我才看到楼里的窗帘动了一下。那通电话……接起来信号有问题吗？",
    choices: [
      {
        id:          "confirm_interference",
        label:       "有，信号断断续续，还有杂音。",
        nextSceneId: "chapter2_static_lead",
        condition: {
          type:     "clue",
          key:      "clue_static_interference",
          operator: "includes",
          value:    true
        }
      },
      {
        id:          "ask_description",
        label:       "那个人有什么特征？",
        nextSceneId: "chapter2_final_choice"
      }
    ]
  },

  // ── Chapter 2: signal lead ────────────────────────────────────────────────
  // The player connects the call interference to Chen's sighting. Chen confirms
  // a suspicious vehicle with signal-disruption equipment. Converges to final choice.
  {
    id:        "chapter2_static_lead",
    chapterId: "chapter2",
    type:      "call",
    speaker:   "陈明",
    text:      "我就知道。那辆停在路边的白色厢型车——车里有设备，天线很多。等那辆车开走之后，信号恢复了吗？那个人……可能是在刻意干扰通话。",
    choices: [
      {
        id:          "connect_dots",
        label:       "这些需要一并记录下来。",
        nextSceneId: "chapter2_final_choice"
      }
    ]
  },

  // ── Chapter 2: final decision ─────────────────────────────────────────────
  // All Chapter 2 paths converge here. Filing the anomaly report requires
  // clue_wrong_number_doubt — the player must have questioned the phone number
  // back in Chapter 1. Without it, only the quiet exit is available.
  {
    id:        "chapter2_final_choice",
    chapterId: "chapter2",
    type:      "call",
    speaker:   "陈明",
    text:      "我把我知道的都告诉你了。你觉得……今晚的事，只是一场误会吗？",
    choices: [
      {
        id:          "file_report",
        label:       "不是误会。我要提交异常事件报告。",
        nextSceneId: "ending_truth_uncovered",
        condition: {
          type:     "clue",
          key:      "clue_wrong_number_doubt",
          operator: "includes",
          value:    true
        }
      },
      {
        id:          "end_shift",
        label:       "也许是，也许不是。值班结束了。",
        nextSceneId: "ending_loose_ends"
      }
    ]
  },

  // ── Chapter 2 → Chapter 3 bridge: truth uncovered ────────────────────────
  // Phase 5: was a terminal ending gated by clue_wrong_number_doubt.
  // Phase 6: converted to Chapter 3 entry point. Player connects all three
  //          clues, then the old-platform monitor briefly flickers — showing
  //          a figure running past the maintenance door. Investigation begins.
  {
    id:        "ending_truth_uncovered",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "你把今夜所有线索列在脑中。林夏的电话来自一个三年前已停用的旧站台内部号码——她根本不可能在站外打进来。陈明在你没有提起名字之前就已经知道「林夏」是谁。南门的灰色面包车，断续的静电声，刻意制造的干扰。林夏最后说的那句话突然变得清晰：「如果有人打电话说见过我……不要马上信。」\n\n陈明的电话不是为了帮她。是为了让你停止追查。\n\n值班室的旧站台监控画面突然亮了一秒。画面里，一个女人从维修门后面跑过。她手里攥着一个透明袋子。",
    choices: [
      {
        id:          "open_monitor",
        label:       "打开旧站台监控",
        nextSceneId: "chapter3_monitor_room"
      },
      {
        id:          "call_dispatch",
        label:       "先通知调度中心",
        nextSceneId: "chapter3_dispatch_call"
      }
    ]
  },

  // ── Chapter 3: dispatch call ──────────────────────────────────────────────
  // Player reaches internal dispatch line despite interference. Dispatcher
  // confirms the old platform is sealed and no official staff have entered the
  // station in the last ten minutes — whoever is in there is unauthorised.
  // Sets dispatchWarned flag on either choice (player knows help is coming).
  {
    id:        "chapter3_dispatch_call",
    chapterId: "chapter3",
    type:      "call",
    speaker:   "调度",
    text:      "内线勉强接通。调度员的声音里带着杂音。\n\n「北桥站旧站台区域已封闭，无人有权限进入。你不要独自前往——我会通知附近的巡逻人员。」\n\n停顿。\n\n「最近十分钟内，没有任何正式维修人员申请进入北桥站。如果旧站台里有人，他们不是官方人员。」",
    choices: [
      {
        id:          "stay_and_monitor",
        label:       "留在值班室，通过监控引导",
        nextSceneId: "chapter3_monitor_room",
        effects: [
          { type: "setFlag", key: "dispatchWarned", value: true, operation: "set" }
        ]
      },
      {
        id:          "go_alone",
        label:       "拿南门钥匙，独自前往旧站台",
        nextSceneId: "chapter3_go_alone_warning",
        effects: [
          { type: "setFlag", key: "dispatchWarned", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 3: monitor room hub ───────────────────────────────────────────
  // Central investigation hub. Three camera feeds visible; player decides which
  // area to check first. Each sub-scene returns here. Also allows player to
  // choose to go alone (leading to the bad ending via go_alone_warning).
  {
    id:        "chapter3_monitor_room",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "你切换到旧站台的监控画面。信号很差，但还能分辨。屏幕上三个区域同时显示：旧3号站台、南门维修通道、配电间走廊。林夏可能在其中一个区域。画面里的某个角落，也可能有另一个人。",
    choices: [
      {
        id:          "check_platform3",
        label:       "查看旧3号站台画面",
        nextSceneId: "chapter3_platform3"
      },
      {
        id:          "check_south_tunnel",
        label:       "查看南门维修通道画面",
        nextSceneId: "chapter3_south_tunnel"
      },
      {
        id:          "check_power_corridor",
        label:       "查看配电间走廊画面",
        nextSceneId: "chapter3_power_corridor"
      },
      {
        id:          "go_alone_from_monitor",
        label:       "离开监控台，独自前往旧站台",
        nextSceneId: "chapter3_go_alone_warning"
      }
    ]
  },

  // ── Chapter 3: old platform 3 camera ─────────────────────────────────────
  // White shoe under a seat matches Chen's description of Lin Xia's clothing.
  // A dark figure is searching the area — confirming a second person is present.
  // Sets foundLinXiaTrace when the player returns to the monitor hub.
  {
    id:        "chapter3_platform3",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "旧3号站台的画面粒噪很重。一排旧座椅靠墙摆着，灯光昏黄。其中一张椅子下方，有一只白色球鞋——和陈明描述的一致。\n\n画面角落里有一个黑影。他正弯着腰翻动座椅，在寻找什么。",
    choices: [
      {
        id:          "return_to_monitor",
        label:       "返回监控台，查看其他区域",
        nextSceneId: "chapter3_monitor_room",
        effects: [
          { type: "setFlag", key: "foundLinXiaTrace", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 3: south tunnel camera ───────────────────────────────────────
  // Grey van at the south gate with its back door half-open. The blue indicator
  // light inside pulses in a rhythm matching the static heard during Lin Xia's
  // call — confirming the van is the source of the signal interference.
  // Sets vanConfirmedOnCamera when the player returns to the monitor hub.
  {
    id:        "chapter3_south_tunnel",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "南门维修通道的画面里，雨水正沿着门缝流进来。通道外停着一辆灰色面包车，后车门半开。从这个角度，可以看到车内有设备指示灯，蓝色，一闪一闪。这个节奏和今夜电话里的静电声很像。",
    choices: [
      {
        id:          "return_to_monitor_s",
        label:       "返回监控台",
        nextSceneId: "chapter3_monitor_room",
        effects: [
          { type: "setFlag", key: "vanConfirmedOnCamera", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 3: power corridor camera ─────────────────────────────────────
  // Wet footprints lead from the south gate toward the old platform — still
  // fresh, meaning someone passed through within the last few minutes.
  // Sets wetFootprintsFound on either choice (both paths record the discovery).
  {
    id:        "chapter3_power_corridor",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "配电间走廊空无一人。但地板上有一排湿脚印，从南门方向延伸，通向旧站台。积水还没有干——说明有人在最近几分钟内刚刚经过。",
    choices: [
      {
        id:          "check_platform3_from_corridor",
        label:       "去查旧3号站台画面",
        nextSceneId: "chapter3_platform3",
        effects: [
          { type: "setFlag", key: "wetFootprintsFound", value: true, operation: "set" }
        ]
      },
      {
        id:          "return_to_monitor_p",
        label:       "返回监控台",
        nextSceneId: "chapter3_monitor_room",
        effects: [
          { type: "setFlag", key: "wetFootprintsFound", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 3: go-alone warning ───────────────────────────────────────────
  // Final checkpoint before the bad ending. Player has picked up the south-gate
  // key. The system warns them that leaving the control room means losing all
  // remote tools: cameras, broadcast, and the dispatch line.
  {
    id:        "chapter3_go_alone_warning",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "你拿起了南门钥匙。值班室门口的指示灯闪了一下。\n\n你不是警察。如果现在离开值班室，你将失去对监控画面的控制，失去广播系统，失去调度线路。黑暗里有一个人，一辆车，还有林夏——但没有人能看见你在哪里。",
    choices: [
      {
        id:          "go_alone_confirm",
        label:       "仍然独自前往旧站台",
        nextSceneId: "ending_bad_alone"
      },
      {
        id:          "return_to_monitor_w",
        label:       "放回钥匙，回到监控台",
        nextSceneId: "chapter3_monitor_room"
      }
    ]
  },

  // ── Ending: bad — went alone ──────────────────────────────────────────────
  // Player abandoned the control room. All remote advantages are gone.
  // The shift desk sits empty; the phone rings unanswered.
  {
    id:        "ending_bad_alone",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "旧站台的通道比你想象的更深。灯光一闪一闪，随时可能彻底熄灭。\n\n远处传来一声：\n\n「值班员？」\n\n你回头。身后的门已经关上了，没有把手。电话没有信号。监控看不见这里。\n\n最后一帧画面，停在值班室空着的椅子上。\n\n电话铃声一直响。没有人接。",
    choices:   []
  },

  // ── Ending: loose ends ────────────────────────────────────────────────────
  // Reached by players who missed clue_wrong_number_doubt or chose to let go.
  // Something lingers, but without the key clue it cannot be named.
  {
    id:        "ending_loose_ends",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "你搁下了今夜的值班记录，拉开椅子站起身来。外面的雨已经停了，街上安静得像什么都没有发生过。也许真的什么都没发生。只是——那个外地号码，还在记录本的最后一页上，没有解释。",
    choices:   []
  }

];

console.log("scenes loaded — count:", window.SCENES.length);
