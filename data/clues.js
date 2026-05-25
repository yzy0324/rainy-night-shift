// ── Clue Metadata ─────────────────────────────────────────────────────────────
// Phase 3: adds clue_static_interference and clue_wrong_number_doubt.
// No UI panel — clues exist in GameState only, not displayed to the player.
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
