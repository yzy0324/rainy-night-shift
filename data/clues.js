// ── Clue Metadata ─────────────────────────────────────────────────────────────
// Phase 3: adds clue_static_interference and clue_wrong_number_doubt.
// Phase 4: clue panel displays collected clues to the player.
// Phase 5: all three clues are now active — no orphans remain.
//           clue_static_interference: gates the signal-interference branch in Ch.2.
//           clue_wrong_number_doubt:  gates the truth-ending path in Ch.2.
//           clue_lin_xia_hesitation:  gates the hesitation follow-up in Ch.1 (unchanged).
// No import/export — window global, loaded by plain <script> tag.

window.CLUES = {

  "clue_lin_xia_hesitation": {
    title:       "林夏的迟疑",
    description: "她在回答细节时语气变得迟疑，说不清来者是谁。"
  },

  "clue_static_interference": {
    title:       "通话中的噪音",
    description: "信号断断续续，通话中出现异常的杂音和中断，暗示通话环境并不安全。"
  },

  "clue_wrong_number_doubt": {
    title:       "电话号码可疑",
    description: "来电号码显示并非本地，林夏可能并没有拨到她以为的那个号码。"
  }

};

console.log("clues loaded");
