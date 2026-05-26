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
// Phase 7: 14 new scenes — Chapter 3 action tools + Chapter 4 rescue arc.
//           chapter3_platform3 and chapter3_south_tunnel updated with new choices.
//           New Ch.3 scenes: chapter3_broadcast_coded, chapter3_platform_wait,
//           chapter3_turn_on_lights, chapter3_lock_south_gate,
//           chapter3_van_observe, chapter3_dispatch_update.
//           New Ch.4 scenes: chapter4_guide_lin_xia, chapter4_south_gate_route,
//           chapter4_redirect_from_south, chapter4_staff_route,
//           chapter4_open_b_door, chapter4_risky_entry, chapter4_close_after_entry.
//           Temporary ending: ending_rescue_pending (converted in Phase 8).
//           New flags: codedBroadcastUsed, linXiaSeenAlive, southGateLocked,
//           jammerSeen, jammerEvidenceSaved, patrolOnWay, chaserBlocked,
//           linXiaRescued.  Total scenes: 39.
// Phase 8: 5 new scenes — final evidence choice + complete ending set.
//           ending_rescue_pending converted from terminal to bridge.
//           chapter4_guide_lin_xia: wait_for_patrol rerouted to partial truth.
//           New scenes: chapter4_evidence_choice, ending_full_truth,
//           ending_rescue_but_partial_truth, ending_silence,
//           ending_failed_interception (future-use, unlinked at time of writing).
//           Total scenes: 44.
// Phase 8.1: logic polish — no new scenes.
//           chapter4_south_gate_route: second choice added (let_her_through_south
//           → ending_failed_interception). ending_failed_interception now reachable.
//           send_evidence choice comment added (full-truth gating deferred).
// Phase 9:  16 new scenes — Chapter 4 bridge + Chapter 5 horror layer.
//           chapter4_evidence_choice: send_evidence now leads to chapter4_full_truth_bridge.
//           New bridge: chapter4_full_truth_bridge (realistic case resolved + horror fork).
//           New Ch.5 scenes: chapter5_broadcast_returns, chapter5_broadcast_wont_stop,
//           chapter5_crowd_on_platform, chapter5_lin_xia_memory, chapter5_system_log,
//           chapter5_logbook_self, chapter5_third_call, chapter5_phone_keeps_ringing,
//           chapter5_phone_unplugged, chapter5_voice_answers, chapter5_see_self,
//           chapter5_protect_lin_xia.
//           New horror endings: ending_true_horror, ending_taken_by_shift,
//           ending_lin_xia_left_behind.
//           New flags: sawOldPassengers, heardOwnVoice, answeredThirdCall.
//           Total scenes: 60.
// Phase 9.1: flag activation + evidence quality + horror escalation gate.
//           Trust flags wired into Ch.1 effects: comfortedLinXia, usedCarefulQuestions,
//           pressedTooHard. chapter4_full_truth_bridge: third choice added, gated on
//           jammerEvidenceSaved → ending_full_truth_complete. chapter5_voice_answers:
//           zoom_in gated on heardOwnVoice; trust-warning choice added (comfortedLinXia).
//           New scenes: chapter5_lin_xia_trust_warning, ending_full_truth_complete.
//           Total scenes: 62.
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
          { type: "setFlag", key: "pressedForDetails", value: false, operation: "set" },
          // Phase 9.1: seed high-trust flag used by Chapter 5 warning branch.
          { type: "setFlag", key: "comfortedLinXia",   value: true }
        ]
      },
      {
        id:          "question_open",
        label:       "你是谁？电话是从哪里打来的？",
        nextSceneId: "chapter1_tension_rises",
        effects: [
          { type: "setFlag", key: "pressedForDetails", value: true,  operation: "set" },
          // Phase 9.1: seed low-trust flag.
          { type: "setFlag", key: "pressedTooHard",    value: true },
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
          { type: "addClue", key: "clue_static_interference", operation: "push" },
          // Phase 9.1: careful-questions flag — reinforces high-trust path.
          { type: "setFlag", key: "usedCarefulQuestions",     value: true }
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
  // Phase 7: added coded-broadcast and lights choices; foundLinXiaTrace is set
  // on ALL exits so it records the discovery regardless of path taken.
  {
    id:        "chapter3_platform3",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "旧3号站台的画面粒噪很重。一排旧座椅靠墙摆着，灯光昏黄。其中一张椅子下方，有一只白色球鞋——和陈明描述的一致。\n\n画面角落里有一个黑影。他正弯着腰翻动座椅，在寻找什么。",
    choices: [
      {
        id:          "use_broadcast",
        label:       "用广播提醒林夏不要出声",
        nextSceneId: "chapter3_broadcast_coded",
        effects: [
          { type: "setFlag", key: "foundLinXiaTrace", value: true, operation: "set" }
        ]
      },
      {
        id:          "turn_on_lights",
        label:       "打开旧站台灯光",
        nextSceneId: "chapter3_turn_on_lights",
        effects: [
          { type: "setFlag", key: "foundLinXiaTrace", value: true, operation: "set" }
        ]
      },
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
  // Phase 7: added lock-gate and observe-van choices; vanConfirmedOnCamera is
  // set on ALL exits so it records the discovery regardless of path taken.
  {
    id:        "chapter3_south_tunnel",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "南门维修通道的画面里，雨水正沿着门缝流进来。通道外停着一辆灰色面包车，后车门半开。从这个角度，可以看到车内有设备指示灯，蓝色，一闪一闪。这个节奏和今夜电话里的静电声很像。",
    choices: [
      {
        id:          "lock_south_gate",
        label:       "锁死南门电子门",
        nextSceneId: "chapter3_lock_south_gate",
        effects: [
          { type: "setFlag", key: "vanConfirmedOnCamera", value: true, operation: "set" }
        ]
      },
      {
        id:          "observe_van",
        label:       "继续观察车内动静",
        nextSceneId: "chapter3_van_observe",
        effects: [
          { type: "setFlag", key: "vanConfirmedOnCamera", value: true, operation: "set" }
        ]
      },
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

  // ── Chapter 3: coded broadcast ────────────────────────────────────────────
  // Player uses a coded station announcement that sounds like routine maintenance
  // but signals Lin Xia that someone is watching and helping her.
  // codedBroadcastUsed is set on ALL exits from this scene.
  {
    id:        "chapter3_broadcast_coded",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "你拿起广播话筒。不能直接说出林夏的名字——那个人也会听见。\n\n你用站内广播说：\n\n「旧3号站台设备巡检即将开始。请无关人员立即离开黄色警戒区域。」\n\n话音落下，站台里短暂地安静了一秒。林夏的画面里，她的头微微动了一下——她听到了，她明白了。",
    choices: [
      {
        id:          "turn_on_lights_from_broadcast",
        label:       "打开旧站台灯光",
        nextSceneId: "chapter3_turn_on_lights",
        effects: [
          { type: "setFlag", key: "codedBroadcastUsed", value: true, operation: "set" }
        ]
      },
      {
        id:          "keep_watching",
        label:       "继续观察画面",
        nextSceneId: "chapter3_platform_wait",
        effects: [
          { type: "setFlag", key: "codedBroadcastUsed", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 3: platform wait ──────────────────────────────────────────────
  // Player watches without acting. The dark figure inches closer to Lin Xia's
  // hiding spot, ratcheting up tension and reinforcing the cost of delay.
  {
    id:        "chapter3_platform_wait",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "你盯着旧3号站台的画面。\n\n画面角落里的黑影慢慢接近座椅。他的动作变得更谨慎，像是在避开某个看不见的视角。\n\n林夏还没有动。她可能还不确定广播是不是给她的信号。时间不多了。",
    choices: [
      {
        id:          "broadcast_again",
        label:       "再次使用广播",
        nextSceneId: "chapter3_broadcast_coded"
      },
      {
        id:          "turn_on_lights_from_wait",
        label:       "打开旧站台灯光",
        nextSceneId: "chapter3_turn_on_lights"
      },
      {
        id:          "return_to_monitor_from_wait",
        label:       "返回监控台主画面",
        nextSceneId: "chapter3_monitor_room"
      }
    ]
  },

  // ── Chapter 3: turn on old platform lights ────────────────────────────────
  // Lights flood the platform. The dark figure retreats into the shadows.
  // Lin Xia looks up at the camera and raises the transparent bag — she's alive
  // and she knows someone is watching.
  // linXiaSeenAlive is set on ALL exits from this scene.
  {
    id:        "chapter3_turn_on_lights",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "你打开旧站台照明开关。灯光一排排亮起，把整个站台照得清晰。\n\n黑影被迫缩进立柱后面。\n\n林夏从座椅后面慢慢抬起头。她看向监控摄像头方向，举起手里的透明袋子——袋子里是一张小小的存储卡。\n\n她知道有人在看。",
    choices: [
      {
        id:          "guide_lin_xia_now",
        label:       "引导林夏撤离",
        nextSceneId: "chapter4_guide_lin_xia",
        effects: [
          { type: "setFlag", key: "linXiaSeenAlive", value: true, operation: "set" }
        ]
      },
      {
        id:          "lock_gate_first",
        label:       "先锁南门，防止对方进入或逃跑",
        nextSceneId: "chapter3_lock_south_gate",
        effects: [
          { type: "setFlag", key: "linXiaSeenAlive", value: true, operation: "set" }
        ]
      },
      {
        id:          "dispatch_from_lights",
        label:       "通知调度中心林夏已找到",
        nextSceneId: "chapter3_dispatch_update",
        effects: [
          { type: "setFlag", key: "linXiaSeenAlive", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 3: lock South Gate ────────────────────────────────────────────
  // Player locks the South Gate via the duty-room panel. Someone outside
  // tries to pull it open — and cannot. Sets southGateLocked on ALL exits.
  {
    id:        "chapter3_lock_south_gate",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "你从值班系统控制面板找到南门电子锁，按下锁定按钮。屏幕显示：\n\n「南门：已锁定。」\n\n几秒后，南门监控画面里有人猛地拉动门把手。他拉了两三次，门纹丝不动。他退开几步，掏出手机联系别人。",
    choices: [
      {
        id:          "dispatch_from_gate",
        label:       "通知调度中心南门情况",
        nextSceneId: "chapter3_dispatch_update",
        effects: [
          { type: "setFlag", key: "southGateLocked", value: true, operation: "set" }
        ]
      },
      {
        id:          "back_to_lights",
        label:       "回到旧站台画面",
        nextSceneId: "chapter3_turn_on_lights",
        effects: [
          { type: "setFlag", key: "southGateLocked", value: true, operation: "set" }
        ]
      },
      {
        id:          "observe_van_from_gate",
        label:       "观察面包车内情况",
        nextSceneId: "chapter3_van_observe",
        effects: [
          { type: "setFlag", key: "southGateLocked", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 3: observe the van ────────────────────────────────────────────
  // A close look at the grey van confirms the interference source: a device
  // with a blue indicator light blinking in the same rhythm as the static in
  // Lin Xia's call. Player can optionally save a screenshot as evidence.
  // jammerSeen is set on ALL exits; jammerEvidenceSaved only on the record choice.
  {
    id:        "chapter3_van_observe",
    chapterId: "chapter3",
    type:      "system",
    speaker:   "系统",
    text:      "你盯着南门外灰色面包车的画面。\n\n车里有人正在摆弄一台小型设备。设备上有一排蓝色指示灯，一闪一闪。这个闪烁节奏和今夜电话里的静电声完全吻合——这就是干扰源。",
    choices: [
      {
        id:          "record_device",
        label:       "截取设备画面存档",
        nextSceneId: "chapter3_lock_south_gate",
        effects: [
          { type: "setFlag", key: "jammerSeen",          value: true, operation: "set" },
          { type: "setFlag", key: "jammerEvidenceSaved", value: true, operation: "set" }
        ]
      },
      {
        id:          "lock_gate_from_van",
        label:       "锁死南门",
        nextSceneId: "chapter3_lock_south_gate",
        effects: [
          { type: "setFlag", key: "jammerSeen", value: true, operation: "set" }
        ]
      },
      {
        id:          "return_from_van",
        label:       "返回监控台",
        nextSceneId: "chapter3_monitor_room",
        effects: [
          { type: "setFlag", key: "jammerSeen", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 3: dispatch update ────────────────────────────────────────────
  // Player calls dispatch with a full situation report: Lin Xia confirmed alive,
  // grey van with jammer, unauthorised person on the platform. Patrol is now
  // en route — five minutes out. Sets patrolOnWay on ALL exits.
  {
    id:        "chapter3_dispatch_update",
    chapterId: "chapter3",
    type:      "call",
    speaker:   "调度",
    text:      "你再次接通调度内线。\n\n「林夏还在旧3号站台，我从监控里确认了。她手里有证据——存储卡。南门外有一辆灰色面包车，车里有信号干扰设备。旧站台内还有一个人在追她。」\n\n调度员沉默了几秒。\n\n「巡逻车已经转向北桥站。五分钟内到达。你坚持住。」",
    choices: [
      {
        id:          "guide_from_dispatch",
        label:       "马上引导林夏撤离",
        nextSceneId: "chapter4_guide_lin_xia",
        effects: [
          { type: "setFlag", key: "patrolOnWay", value: true, operation: "set" }
        ]
      },
      {
        id:          "keep_monitoring",
        label:       "继续通过监控跟踪情况",
        nextSceneId: "chapter3_monitor_room",
        effects: [
          { type: "setFlag", key: "patrolOnWay", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 4: guide Lin Xia ──────────────────────────────────────────────
  // Central decision: which route to guide Lin Xia out of the old platform.
  // South Gate: short but the grey van is right outside.
  // Staff corridor: longer but leads to the safe internal area.
  // Wait for patrol: safe only if dispatch has been updated.
  {
    id:        "chapter4_guide_lin_xia",
    chapterId: "chapter4",
    type:      "system",
    speaker:   "系统",
    text:      "旧3号站台的灯光还亮着。林夏还在那里——她在等你的指引。\n\n你面前有三条路：\n\n南门：距离最近，但灰色面包车就停在外面。\n值班区侧门：需要穿过配电走廊，路线更长，但通向内部安全区域。\n等待巡逻：如果调度已经通知了，几分钟内会有支援到达。",
    choices: [
      {
        id:          "guide_south_gate",
        label:       "引导林夏从南门出去",
        nextSceneId: "chapter4_south_gate_route"
      },
      {
        id:          "guide_staff_corridor",
        label:       "引导林夏走值班区侧门",
        nextSceneId: "chapter4_staff_route"
      },
      {
        id:          "wait_for_patrol",
        label:       "让林夏留在原地等待巡逻",
        nextSceneId: "ending_rescue_but_partial_truth"
      }
    ]
  },

  // ── Chapter 4: South Gate route ───────────────────────────────────────────
  // Lin Xia heads toward South Gate, but the van is still outside — dangerous.
  // Two choices: safe broadcast redirect (good path) or stay silent and let
  // her continue south toward the van (leads to ending_failed_interception).
  {
    id:        "chapter4_south_gate_route",
    chapterId: "chapter4",
    type:      "system",
    speaker:   "系统",
    text:      "林夏在旧站台里开始移动，向南门方向走去。\n\n监控里，南门外的灰色面包车还停在原处——后车门仍然半开。那个方向很危险，但林夏还不知道。\n\n你手里有广播的控制权。",
    choices: [
      {
        id:          "redirect_to_staff",
        label:       "通过广播把她引向值班区侧门",
        nextSceneId: "chapter4_redirect_from_south"
      },
      {
        id:          "let_her_through_south",
        label:       "什么都不说——让她继续往南门走",
        nextSceneId: "ending_failed_interception"
      }
    ]
  },

  // ── Chapter 4: redirect from South Gate ──────────────────────────────────
  // Lin Xia reaches the locked South Gate and panics. Player uses a calm
  // broadcast announcement to redirect her to the staff-side corridor.
  {
    id:        "chapter4_redirect_from_south",
    chapterId: "chapter4",
    type:      "system",
    speaker:   "系统",
    text:      "林夏跑到南门前，用力推了几下，门没有动。她在画面里停下来，脚步开始乱了。\n\n你拿起广播话筒：\n\n「南门维修封闭中，请从值班区侧门进入。维修通道在您左手边，请绕行。」\n\n她迟疑了一秒，然后转向左边，开始朝配电走廊方向跑去。",
    choices: [
      {
        id:          "switch_to_staff_cam",
        label:       "切换到配电走廊监控",
        nextSceneId: "chapter4_staff_route"
      }
    ]
  },

  // ── Chapter 4: staff-side corridor ───────────────────────────────────────
  // Lin Xia runs through the staff corridor. A dark figure follows close behind.
  // Two doors: Door A blocks the chaser; Door B is Lin Xia's exit. One chance.
  {
    id:        "chapter4_staff_route",
    chapterId: "chapter4",
    type:      "system",
    speaker:   "系统",
    text:      "配电走廊的监控画面里，林夏正在快速移动——她记住了广播里说的方向。\n\n但画面右侧，黑影也追过来了。他的步速比林夏快。\n\n走廊另一头有两道门：A门通向配电区，可以将追踪者隔断；B门通向值班区，是林夏的出口。\n\n只有一次机会。",
    choices: [
      {
        id:          "close_door_a_first",
        label:       "先关A门，拦住追踪者",
        nextSceneId: "chapter4_open_b_door"
      },
      {
        id:          "open_door_b_first",
        label:       "先开B门，让林夏进来",
        nextSceneId: "chapter4_risky_entry"
      }
    ]
  },

  // ── Chapter 4: Door A closed first — safe route ───────────────────────────
  // Player closes Door A before opening Door B. The chaser is blocked; Lin Xia
  // reaches Door B safely. Sets chaserBlocked and linXiaRescued on exit.
  {
    id:        "chapter4_open_b_door",
    chapterId: "chapter4",
    type:      "system",
    speaker:   "系统",
    text:      "你先关上A门。\n\n重型金属门在走廊里发出沉闷的撞击声。黑影被拦在另一侧，用力撞了两下，门纹丝不动。\n\n林夏跑到B门前，回头看了一眼，然后看向摄像头方向。\n\n你打开B门。她冲了进来。",
    choices: [
      {
        id:          "bring_lin_xia_in",
        label:       "把林夏带到值班室",
        nextSceneId: "ending_rescue_pending",
        effects: [
          { type: "setFlag", key: "chaserBlocked", value: true, operation: "set" },
          { type: "setFlag", key: "linXiaRescued", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 4: Door B opened first — risky route ──────────────────────────
  // Player opens Door B first. Lin Xia enters but the chaser is right behind.
  // A last-second door close keeps the situation from collapsing.
  // Sets linXiaRescued on exit.
  {
    id:        "chapter4_risky_entry",
    chapterId: "chapter4",
    type:      "system",
    speaker:   "系统",
    text:      "你先打开B门。\n\n林夏冲了进来——但黑影已经到了走廊口，还有几步就能跟上。\n\n你按下A门关闭按钮。门轨道发出低鸣，缓缓合拢。黑影伸出手——\n\n砰。差了不到半秒，门关上了。",
    choices: [
      {
        id:          "secure_duty_room",
        label:       "确认值班区门已全部锁好",
        nextSceneId: "chapter4_close_after_entry",
        effects: [
          { type: "setFlag", key: "linXiaRescued", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 4: secured after risky entry ──────────────────────────────────
  // Corridor goes quiet. Lin Xia is safe but shaken. The transparent bag and
  // memory card are still in her hands. What happens next is Phase 8.
  // Sets linXiaRescued on exit (idempotent with risky_entry's exit effect).
  {
    id:        "chapter4_close_after_entry",
    chapterId: "chapter4",
    type:      "system",
    speaker:   "系统",
    text:      "走廊那边安静下来。\n\n林夏靠着值班区的墙慢慢滑落，坐在地上。手还在抖。透明袋子攥在手里，存储卡还在。\n\n荧光灯嗡嗡响着，窗外的雨声填满了整个房间。她抬起头，看向监控屏幕这边的摄像头。",
    choices: [
      {
        id:          "let_her_recover",
        label:       "先让她缓一缓",
        nextSceneId: "ending_rescue_pending",
        effects: [
          { type: "setFlag", key: "linXiaRescued", value: true, operation: "set" }
        ]
      }
    ]
  },

  // ── Chapter 4 → evidence bridge: rescue pending ─────────────────────────
  // Phase 7: was a terminal ending.
  // Phase 8: converted to bridge scene — leads to chapter4_evidence_choice
  //          where the player decides what to do with Lin Xia's memory card.
  {
    id:        "ending_rescue_pending",
    chapterId: "chapter4",
    type:      "system",
    speaker:   "系统",
    text:      "林夏在值班室里。她活着，她安全了——至少在这一刻。\n\n透明袋子放在桌上，存储卡还在里面。里面的视频，据她所说，记录了旧维修通道被非法使用的全过程。\n\n把证据交给谁？怎样保护林夏不被追踪？南门外的面包车，陈明，还有幕后的人——这一切都还没有结束。",
    choices: [
      {
        id:          "face_evidence",
        label:       "面对存储卡，做出最后的决定",
        nextSceneId: "chapter4_evidence_choice"
      }
    ]
  },

  // ── Chapter 4: evidence choice ───────────────────────────────────────────
  // Lin Xia is physically present and explains what is on the memory card.
  // The player makes the final moral decision: expose everything, protect her
  // first, or step back entirely.
  {
    id:        "chapter4_evidence_choice",
    chapterId: "chapter4",
    type:      "system",
    speaker:   "林夏",
    text:      "林夏把透明袋子放到桌上，取出存储卡。\n\n「这里面有他们进出旧维修通道的视频。车牌、面孔、时间戳，全都有。如果这些交到警方手里，他们就完了。」\n\n她停顿了一下，看向窗外。\n\n「但如果现在直接发出去——他们会知道是我拍的。我还没有离开这里。」\n\n存储卡放在桌上。等待你的决定。",
    choices: [
      // NOTE: Ideal gate — linXiaRescued=true AND (dispatchWarned=true OR patrolOnWay=true).
      // conditions.js supports only one condition per choice (no AND/OR nesting).
      // Full-truth gating is deferred until the condition system is extended.
      // Phase 9: now leads to chapter4_full_truth_bridge (bridge → ending_full_truth
      // or optional horror route chapter5_broadcast_returns).
      {
        id:          "send_evidence",
        label:       "立刻把证据发给调度和警方",
        nextSceneId: "chapter4_full_truth_bridge"
      },
      {
        id:          "protect_first",
        label:       "先保护林夏，本地保存一份副本",
        nextSceneId: "ending_rescue_but_partial_truth"
      },
      {
        id:          "return_evidence",
        label:       "证据还给林夏，我不能卷进去",
        nextSceneId: "ending_silence"
      }
    ]
  },

  // ── Ending: full truth ────────────────────────────────────────────────────
  // Best ending. Lin Xia is rescued, evidence submitted, patrol acts in time.
  // All three threads — the van, Chen Ming, the suspect — reach resolution.
  // Still reachable via end_shift choice in chapter4_full_truth_bridge.
  {
    id:        "ending_full_truth",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "调度中心收到了视频。\n\n十分钟后，巡逻车抵达北桥站。南门外，灰色面包车的两名人员被控制，信号干扰设备被扣押，车牌被记录在案。陈明也被找到了。他没有逃跑，主动向警方说明了情况——他是被威胁参与的，不是主谋。\n\n天快亮的时候，林夏还坐在值班室里，手里捧着热水，头发还是湿的。\n\n她说：「我以为今晚不会有人信我。」\n\n北桥站的广播第一次恢复清晰，播报第一班早班列车进站。\n\n雨停了。",
    choices:   []
  },

  // ── Ending: full truth (complete evidence chain) ──────────────────────────
  // Phase 9.1: enhanced ending — reachable only when jammerEvidenceSaved = true.
  // The player recorded the interference device on camera in chapter3_van_observe.
  // That footage closes all three threads and makes the case bury-proof.
  // The old-platform anomaly persists — a reminder it is a separate problem.
  {
    id:        "ending_full_truth_complete",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "调度中心收到了完整的视频文件，连同干扰设备的画面截图和南门车牌的局部记录。\n\n十分钟后，巡逻车抵达北桥站。南门外，灰色面包车的两名人员被控制。信号干扰设备作为实物证据被扣押——摄像头记录的型号与面包车内安装位置，形成了完整的证据链。车牌后两位与调度中心记录吻合，确认了今晚的干扰来源。\n\n陈明没有逃跑。他主动向警方说明了所有情况，并供出了幕后的组织者。这一次，整个案子难以被压下去了。\n\n天快亮的时候，林夏还坐在值班室里，手里捧着热水，头发还是湿的。\n\n她说：「我以为今晚不会有人信我。我以为就算信了，也没有用。」\n\n北桥站的广播第一次恢复清晰，播报第一班早班列车进站。\n\n雨停了。旧三号站台的监控画面，仍然是黑的。",
    choices:   []
  },

  // ── Ending: rescue but partial truth ─────────────────────────────────────
  // Good but incomplete. Lin Xia survives. Some suspects escape. Evidence is
  // preserved locally but the main threat remains unresolved.
  // Reached from: evidence_choice (protect first) OR guide_lin_xia (wait patrol).
  {
    id:        "ending_rescue_but_partial_truth",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "林夏活了下来。\n\n灰色面包车在巡逻车到达之前离开了。陈明的电话打不通。证据只有一部分，不足以确认幕后的组织者。真相只剩了一半。\n\n几天后，林夏离开了这座城市，没有留下联系方式。\n\n你收到一条陌生号码的短信，只有一句话：「谢谢你。但他们还没有结束。」\n\n北桥站的值班室继续运转。夜班还是你的。",
    choices:   []
  },

  // ── Ending: silence ───────────────────────────────────────────────────────
  // Moral grey ending. Lin Xia survives but leaves with the evidence.
  // Official record says no major incident. Rainy nights still carry static.
  {
    id:        "ending_silence",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "林夏拿回了存储卡。\n\n她没有怪你。她只是说：「我明白。你也只是想活得安稳。」\n\n几天后，北桥站旧站台被彻底封闭，南门监控系统被更换。值班室的交接记录上，那一晚显示「无异常」。\n\n你继续值夜班。\n\n每逢下雨天，电话偶尔会响一声。接起来，只有静电声。然后断线。",
    choices:   []
  },

  // ── Ending: failed interception ───────────────────────────────────────────
  // Bad route ending — player stays silent and lets Lin Xia continue south.
  // Triggered by: chapter4_south_gate_route → let_her_through_south.
  {
    id:        "ending_failed_interception",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "林夏跑向南门。监控里，灰色面包车的车门打开了。一个人快步走向她——\n\n下一秒，南门画面变成雪花。\n\n几分钟后，值班电话响起。陈明的声音从听筒里传来：\n\n「我说过，不要查南门。」\n\n电话挂断了。值班日志上没有这条记录。",
    choices:   []
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
  },

  // ── Chapter 4 bridge: full truth resolved ────────────────────────────────
  // Reached from chapter4_evidence_choice → send_evidence.
  // The realistic criminal case appears fully resolved. A brief broadcast
  // anomaly offers the player an optional horror continuation (chapter5).
  // Choosing to end the night preserves ending_full_truth unchanged.
  {
    id:        "chapter4_full_truth_bridge",
    chapterId: "chapter4",
    type:      "system",
    speaker:   "系统",
    text:      "调度中心确认收到了视频文件。\n\n值班室窗外，巡逻车的蓝光扫过雨中的南门。灰色面包车的两名人员已被带走。信号干扰设备被扣押，陈明也将配合警方说明情况。\n\n林夏坐在你对面。她还没说话，但她在值班室里，是安全的。存储卡已经不在她手里了。\n\n雨还在下。广播系统的指示灯忽然亮了一下——然后灭掉了。",
    choices: [
      {
        id:          "end_shift",
        label:       "结束值班，今晚的事就到这里",
        nextSceneId: "ending_full_truth"
      },
      {
        // Phase 9.1: enhanced ending — only visible when jammer footage was recorded.
        id:          "submit_complete_evidence",
        label:       "提交完整证据链，结束今晚",
        condition:   { type: "flag", key: "jammerEvidenceSaved", operator: "equals", value: true },
        nextSceneId: "ending_full_truth_complete"
      },
      {
        id:          "check_broadcast",
        label:       "去查一下那个广播异常",
        nextSceneId: "chapter5_broadcast_returns"
      }
    ]
  },

  // ── Chapter 5: 旧站台重新开放 / The Old Platform Reopens ─────────────────
  // Horror layer — optional continuation from chapter4_full_truth_bridge.
  // The realistic case is resolved. Something older is beginning.

  {
    id:        "chapter5_broadcast_returns",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "系统",
    text:      "你走向广播控制台。\n\n指示灯是灭的。系统日志显示最后一次广播在二十分钟前——那是你用来引导林夏的那条。此后没有任何操作记录。\n\n但广播里传来一句话：\n\n「旧三号站台末班列车即将进站，请旅客做好乘车准备。」\n\n声音非常清晰，比今晚任何一次广播都清晰。\n\n林夏从椅子上抬起头。她说：「我进旧站台之前……也听到了这句话。」",
    choices: [
      {
        id:          "turn_off_broadcast",
        label:       "尝试关掉广播系统",
        nextSceneId: "chapter5_broadcast_wont_stop"
      },
      {
        id:          "check_platform3_cctv",
        label:       "调出旧三号站台监控",
        nextSceneId: "chapter5_crowd_on_platform"
      },
      {
        id:          "ask_lin_xia",
        label:       "问林夏她记得什么",
        nextSceneId: "chapter5_lin_xia_memory"
      }
    ]
  },

  {
    id:        "chapter5_broadcast_wont_stop",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "系统",
    text:      "你把广播系统的主电源关掉。\n\n控制台显示：广播关闭。\n\n广播还在响。\n\n同样的那句话，重复了第二次。声音没有变小，也没有任何杂音。\n\n第三次播出的时候，声音变了。\n\n不是录音。是一个人在实时说话——语调、停顿、甚至犹豫的位置，都和今晚你引导林夏时一模一样。\n\n是你的声音。",
    choices: [
      {
        id:          "check_system_log",
        label:       "查看系统日志",
        effects:     [{ type: "setFlag", key: "heardOwnVoice", value: true }],
        nextSceneId: "chapter5_system_log"
      },
      {
        id:          "back_to_cctv",
        label:       "回到监控台",
        effects:     [{ type: "setFlag", key: "heardOwnVoice", value: true }],
        nextSceneId: "chapter5_crowd_on_platform"
      }
    ]
  },

  {
    id:        "chapter5_crowd_on_platform",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "系统",
    text:      "你把旧三号站台的监控画面调出来。\n\n今晚你已经在这个画面里确认过林夏的位置。那时画面是模糊的，雪花很多。\n\n现在画面非常清晰。\n\n站台上站着一群人。他们衣服是湿的，像是刚淋过很久的雨。他们面对摄像头，一动不动。\n\n前排有一个小孩，手里拿着一张纸质车票，票面朝向镜头。\n\n你能看清时间：23:47。",
    choices: [
      {
        id:          "check_system_time",
        label:       "查看系统时间",
        effects:     [{ type: "setFlag", key: "sawOldPassengers", value: true }],
        nextSceneId: "chapter5_system_log"
      },
      {
        id:          "ask_about_passengers",
        label:       "问林夏关于站台上的人",
        effects:     [{ type: "setFlag", key: "sawOldPassengers", value: true }],
        nextSceneId: "chapter5_lin_xia_memory"
      },
      {
        id:          "cut_feed",
        label:       "关掉画面，保护林夏",
        effects:     [{ type: "setFlag", key: "sawOldPassengers", value: true }],
        nextSceneId: "chapter5_protect_lin_xia"
      }
    ]
  },

  {
    id:        "chapter5_lin_xia_memory",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "林夏",
    text:      "林夏看了一眼你调出的监控画面，然后把视线移开了。\n\n「他们问我有没有来接班。」\n\n你问：那些人？\n\n「他们站在站台上，排队的样子。其中一个走过来问我，说值班员要来了，让我先等着。」\n\n她停了一下。\n\n「我以为他们是真实的旅客。直到我意识到那个站台十年前就关掉了，最后一班列车不可能再来了。」",
    choices: [
      {
        id:          "check_logbook",
        label:       "去查值班日志",
        nextSceneId: "chapter5_logbook_self"
      },
      {
        id:          "protect_lin_xia_memory",
        label:       "让林夏不要再看监控",
        nextSceneId: "chapter5_protect_lin_xia"
      }
    ]
  },

  {
    id:        "chapter5_system_log",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "系统",
    text:      "你调出今晚的系统操作日志。\n\n最近一条是你关掉广播系统的记录，时间正确。\n\n但往前翻，你发现了一段你没有操作过的记录：\n\n23:47 — 值班员确认末班列车进站\n23:47 — 值班员确认末班列车进站\n23:47 — 值班员确认末班列车进站\n\n同一行记录，重复了很多次。时间戳都是 23:47。\n\n你今晚从来没有操作过这个确认功能。",
    choices: [
      {
        id:          "open_accident_record",
        label:       "打开旧事故档案",
        nextSceneId: "chapter5_logbook_self"
      },
      {
        id:          "delete_log",
        label:       "尝试删除这条记录",
        nextSceneId: "chapter5_broadcast_wont_stop"
      }
    ]
  },

  {
    id:        "chapter5_logbook_self",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "系统",
    text:      "你翻开今晚的值班日志。\n\n前几页是你写的，字迹是你的，内容是你的。\n\n最后一页有一行字，你没有写过：\n\n「第三通电话，不要接。」\n\n字迹也是你的。\n\n这时，值班电话响了。\n\n来电显示：旧三号站台 — 值班岗亭",
    choices: [
      {
        id:          "answer_phone",
        label:       "接起电话",
        nextSceneId: "chapter5_third_call"
      },
      {
        id:          "ignore_phone",
        label:       "不接",
        nextSceneId: "chapter5_phone_keeps_ringing"
      },
      {
        id:          "unplug_phone",
        label:       "拔掉电话线",
        nextSceneId: "chapter5_phone_unplugged"
      }
    ]
  },

  {
    id:        "chapter5_third_call",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "系统",
    text:      "你拿起话筒。\n\n电话那边是雨声。是今晚一直在下的那种雨声，但密度更大，像是从更深的地方传来的。背景里有很多人均匀的呼吸声，像是一群人在等待。\n\n然后一个声音说：\n\n「值班员，列车已经进站，请确认。」\n\n你认得这个声音。\n\n这是你自己的声音。",
    choices: [
      {
        id:          "ask_who",
        label:       "问：你是谁",
        effects:     [{ type: "setFlag", key: "answeredThirdCall", value: true }],
        nextSceneId: "chapter5_voice_answers"
      },
      {
        id:          "hang_up",
        label:       "挂断电话",
        effects:     [{ type: "setFlag", key: "answeredThirdCall", value: true }],
        nextSceneId: "chapter5_phone_keeps_ringing"
      }
    ]
  },

  {
    id:        "chapter5_phone_keeps_ringing",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "系统",
    text:      "电话继续响。\n\n不是普通的铃声——它没有暂停，没有间隔，只是持续的、低沉的震动声。\n\n林夏走到你身边。她说：「不要接。」\n\n监控画面里，旧三号站台的那群人开始移动了。他们朝站台入口的方向走去，走得很慢，但方向很明确。",
    choices: [
      {
        id:          "protect_lin_xia_ring",
        label:       "保护林夏，不再管它",
        nextSceneId: "chapter5_protect_lin_xia"
      },
      {
        id:          "answer_after_all",
        label:       "还是接起来",
        nextSceneId: "chapter5_third_call"
      }
    ]
  },

  {
    id:        "chapter5_phone_unplugged",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "系统",
    text:      "你找到电话线，从墙上拔下来。\n\n值班室安静了一秒。\n\n然后铃声从站台广播系统里响起来。一模一样的声音，从你刚刚关掉的那个广播系统里传出来。\n\n控制台上，广播系统的指示灯仍然是灭的。",
    choices: [
      {
        id:          "protect_lin_xia_unplug",
        label:       "保护林夏",
        nextSceneId: "chapter5_protect_lin_xia"
      },
      {
        id:          "follow_voice_monitor",
        label:       "顺着声音查看监控",
        nextSceneId: "chapter5_voice_answers"
      }
    ]
  },

  {
    id:        "chapter5_voice_answers",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "系统",
    text:      "你继续等待，或者顺着声音查看监控。\n\n旧三号站台的画面里，一个穿着深色值班制服的人从站台末端走来。制服上有北桥站的标志，但是旧款式的，十年前就改版了。\n\n这个人走路的方式你很熟悉，因为那就是你走路的方式。\n\n那个人停在摄像头正下方，慢慢抬起头。",
    choices: [
      {
        id:          "look_away",
        label:       "不看那个人的脸，去保护林夏",
        nextSceneId: "chapter5_protect_lin_xia"
      },
      {
        // Phase 9.1: trust branch — Lin Xia warns the player.
        // Visible only to players who comforted Lin Xia in Chapter 1.
        id:          "lin_xia_warns",
        label:       "（林夏注意到你盯着监控——）",
        condition:   { type: "flag", key: "comfortedLinXia", operator: "equals", value: true },
        nextSceneId: "chapter5_lin_xia_trust_warning"
      },
      {
        // Phase 9.1: escalation gate — must have heard own voice first.
        // Safe exit (look_away) always remains available above.
        id:          "zoom_in",
        label:       "放大画面，确认那是谁",
        condition:   { type: "flag", key: "heardOwnVoice", operator: "equals", value: true },
        nextSceneId: "chapter5_see_self"
      }
    ]
  },

  // ── Chapter 5: Lin Xia trust warning ─────────────────────────────────────
  // Phase 9.1: reached from chapter5_voice_answers when comfortedLinXia = true.
  // Lin Xia notices the player staring and intervenes — high-trust players get a
  // moment of rescue before the most dangerous choice. Routes to protect_lin_xia.
  {
    id:        "chapter5_lin_xia_trust_warning",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "林夏",
    text:      "林夏注意到你凝视监控的眼神，走到你身边。\n\n她没有问你看到了什么。她只是轻声说：\n\n「别看它。你不是它。」\n\n她的手碰了一下你的手臂，然后站在你旁边。\n\n你把视线从屏幕上移开了。",
    choices: [
      {
        id:          "turn_away",
        label:       "转过身，不再看",
        nextSceneId: "chapter5_protect_lin_xia"
      }
    ]
  },

  {
    id:        "chapter5_see_self",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "系统",
    text:      "你放大了画面。\n\n那个人转过来。\n\n不是模糊的，不是相似，就是你的脸。监控画面比今晚任何时候都要清晰。\n\n那个人开口，值班室的广播同步响起：\n\n「旧三号站台末班列车即将进站。」\n\n林夏在你身后低声说：「不要继续看了。」",
    choices: [
      {
        id:          "cut_monitor",
        label:       "关掉监控，去保护林夏",
        nextSceneId: "chapter5_protect_lin_xia"
      },
      {
        id:          "keep_watching",
        label:       "继续盯着看",
        nextSceneId: "ending_taken_by_shift"
      }
    ]
  },

  {
    id:        "chapter5_protect_lin_xia",
    chapterId: "chapter5",
    type:      "system",
    speaker:   "系统",
    text:      "你把林夏拉离监控台，让她背对屏幕，站在值班室门口。\n\n广播还在响，但你不再操作任何设备。不再查看监控，不再接电话，不再确认任何列车进站。\n\n这是值班室的规矩之一：不能确认的信号，不要回应。\n\n窗外，天色开始有些变化。你不确定是不是快天亮了，还是只是雨停了一会儿。\n\n林夏没有再说话。你们就这样一直等着。",
    choices: [
      {
        id:          "wait_for_dawn",
        label:       "等到天亮，什么都不再确认",
        nextSceneId: "ending_true_horror"
      },
      {
        id:          "check_if_crowd_gone",
        label:       "查看那群人有没有离开站台",
        nextSceneId: "ending_lin_xia_left_behind"
      }
    ]
  },

  // ── Horror endings ────────────────────────────────────────────────────────

  // Best horror ending. Player refuses the third call and stays with Lin Xia
  // until dawn. The old platform is not destroyed — only delayed one more night.
  {
    id:        "ending_true_horror",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "天亮了。\n\n旧三号站台的监控画面变成了黑屏，和今晚最开始时一样。\n\n广播系统的日志里有最后一条自动生成的记录：\n\n「旧三号站台：末班列车未进站。候客区无人员。等待下次确认。」\n\n下次确认的条件：下一个雨夜。\n\n林夏看了一眼日志，什么也没说。她拿起包，走到值班室门口，推开门。\n\n外面的光是真实的，雨停了。\n\n你坐在椅子上，窗外，北桥站的天空开始有了颜色。",
    choices:   []
  },

  // Bad horror ending. Player stares at the other self and is absorbed into the
  // shift cycle. The next worker finds everything in order — except the handwriting.
  {
    id:        "ending_taken_by_shift",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "你没有停下来。\n\n监控里那个人和你对视了很久。\n\n然后一切都安静下来了。广播停了，电话不再响，林夏的声音也消失了——你不确定她什么时候离开的。\n\n次日早班的接班员走进值班室，发现椅子上有人。\n\n交接记录本的最后一行，是今晚的日期，还有一行字：\n\n「值班员已交接，新值班员在岗。」\n\n字迹不是你平时的字迹。但签名是你的名字。\n\n值班室的窗外，雨还在下。",
    choices:   []
  },

  // Bad/loop ending. Player breaks from protecting Lin Xia to check the monitor.
  // She disappears into the old platform. The first call begins again.
  {
    id:        "ending_lin_xia_left_behind",
    chapterId: "ending",
    type:      "ending",
    speaker:   "系统",
    text:      "你打开了监控画面。\n\n旧三号站台上，那群人已经不在了。站台是空的。\n\n然后你看见了一个熟悉的身影。\n\n黑色外套，白色鞋，手里攥着透明袋子。\n\n林夏站在旧三号站台的候车区，面对摄像头，一动不动。\n\n广播响了一声：\n\n「值班员，列车即将进站，请确认候车人数。」\n\n你转身，值班室里只剩你一个人了。\n\n然后值班电话响了。\n\n来电显示：外线\n\n你拿起话筒。那头是一个女生的声音，很慌张。\n\n「你是……北桥站的值班员吗？」",
    choices:   []
  }

];

console.log("scenes loaded — count:", window.SCENES.length);
