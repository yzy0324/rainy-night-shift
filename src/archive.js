// ── Ending Archive ─────────────────────────────────────────────────────────────
// Tracks which endings the player has reached across sessions.
// Uses localStorage with a silent in-memory fallback (quota errors, private
// browsing, storage disabled). No DOM access — data layer only.
// No import/export — window global, loaded by plain <script> tag.

window.Archive = (function () {

  // ── Ending catalogue ────────────────────────────────────────────────────────
  // Display order matters. Titles / descriptions are revealed when an entry is
  // unlocked; locked entries show only a redacted placeholder, so horror ending
  // names are never exposed before the player finds the horror layer.
  const ENDING_CATALOGUE = [
    {
      id:          "ending_loose_ends",
      title:       "也许是，也许不是",
      description: "值班结束。信号中断，记录存档。"
    },
    {
      id:          "ending_silence",
      title:       "信号静默",
      description: "没有报告，没有记录。"
    },
    {
      id:          "ending_bad_alone",
      title:       "独自承担",
      description: "报告提交了，但没有人来。"
    },
    {
      id:          "ending_rescue_but_partial_truth",
      title:       "救援，不完整",
      description: "林夏安全了，但案子并未终结。"
    },
    {
      id:          "ending_failed_interception",
      title:       "拦截失败",
      description: "来不及了。"
    },
    {
      id:          "ending_full_truth",
      title:       "完整的真相",
      description: "案件记录封存。"
    },
    {
      id:          "ending_full_truth_complete",
      title:       "完整证据链",
      description: "一切都被记录下来了。"
    },
    {
      id:          "ending_true_horror",
      title:       "旧三号站台",
      description: "天亮了，但不是所有人都等到了。"
    },
    {
      id:          "ending_lin_xia_left_behind",
      title:       "林夏不见了",
      description: "你放开了她的手。"
    },
    {
      id:          "ending_taken_by_shift",
      title:       "你成为了值班室",
      description: "下一个值班员会发现一切如常。"
    }
  ];

  // ── Storage key ─────────────────────────────────────────────────────────────
  const STORAGE_KEY = "nsd-archive-v1";

  // ── O(1) catalogue membership check ────────────────────────────────────────
  const _knownIds = {};
  ENDING_CATALOGUE.forEach(function (e) { _knownIds[e.id] = true; });

  // ── In-memory store — lazily initialised on first access ────────────────────
  // null = not yet loaded. After first access: always an Array (possibly empty).
  let _unlocked = null;

  // Read from localStorage. Returns [] on any error (missing, corrupt, blocked).
  function _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  // Persist to localStorage. Silently swallows quota / security errors.
  function _save(ids) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      // Storage unavailable — in-memory state remains correct for this session.
    }
  }

  // Return the live in-memory array, loading from storage on first call.
  function _getUnlocked() {
    if (_unlocked === null) _unlocked = _load();
    return _unlocked;
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  // Record an ending as seen. Silently ignores unknown IDs and duplicates.
  function unlock(endingId) {
    if (!_knownIds[endingId]) return;
    const ids = _getUnlocked();
    if (ids.indexOf(endingId) !== -1) return;
    ids.push(endingId);
    _save(ids);
  }

  // Return true if the given ending has been unlocked this session or before.
  function isUnlocked(endingId) {
    return _getUnlocked().indexOf(endingId) !== -1;
  }

  // Return a copy of the catalogue with an `unlocked` boolean on each entry.
  function getAll() {
    const ids = _getUnlocked();
    return ENDING_CATALOGUE.map(function (entry) {
      return {
        id:          entry.id,
        title:       entry.title,
        description: entry.description,
        unlocked:    ids.indexOf(entry.id) !== -1
      };
    });
  }

  // Return the count of catalogue endings the player has unlocked.
  // Ignores any stored IDs that are not in the catalogue (forward-compat).
  function getCount() {
    return _getUnlocked().filter(function (id) { return _knownIds[id]; }).length;
  }

  return {
    ENDING_CATALOGUE: ENDING_CATALOGUE,
    unlock:           unlock,
    isUnlocked:       isUnlocked,
    getAll:           getAll,
    getCount:         getCount
  };

}());

console.log("archive loaded");
