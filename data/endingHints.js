// ── Post-ending Atmospheric Hints ─────────────────────────────────────────────
// One short system-log line per ending. Rendered after the clue summary and
// before the restart / archive buttons. Tone: cold station-system record.
// Hints suggest that something could have gone differently — no routes, no flags.
// No import/export — window global, loaded by plain <script> tag.

window.ENDING_HINTS = {

  "ending_loose_ends":
    "系统记录：本次值班未提交异常事件报告。",

  "ending_silence":
    "系统记录：一段监控文件从未上传。",

  "ending_bad_alone":
    "系统记录：值班室曾短暂失去响应。",

  "ending_rescue_but_partial_truth":
    "系统记录：南门车辆离站时间仍未确认。",

  "ending_failed_interception":
    "系统记录：南门监控在关键时间段出现雪花。",

  "ending_full_truth":
    "系统记录：案件已归档，但旧三号站台仍无维修记录。",

  "ending_full_truth_complete":
    "系统记录：证据链完整，旧站台异常未纳入案件。",

  "ending_true_horror":
    "系统记录：旧三号站台末班车未进站，等待下一次雨夜。",

  "ending_taken_by_shift":
    "系统记录：下一班值班员已登记。",

  "ending_lin_xia_left_behind":
    "系统记录：旧三号站台新增一名未登记乘客。"

};

console.log("ending hints loaded");
