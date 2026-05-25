# DATA_SCHEMA.md

# Data Schema for Night Shift Dispatch / 雨夜值班室

This document defines the core data structures for the game.

The game is a text interaction / branching narrative mystery game.  
Most gameplay content should be stored as data, not hardcoded directly into engine logic.

---

## 1. Design Goal

The data schema should support:

```text
1. Scene-based story progression
2. Player choices
3. Conditions for showing choices or scenes
4. Effects caused by player choices
5. Flags, stats, trust, clues, and items
6. Multiple endings
7. Local save data
8. Debug-friendly event logs
```

The game engine should read these data objects and decide:

```text
1. What scene to show
2. What choices are available
3. What state changes should happen
4. Whether an ending should trigger
5. What should be saved
```

---

## 2. File Placement

Recommended data files:

```text
data/
├─ metadata.js
├─ scenes.js
├─ characters.js
├─ clues.js
├─ items.js
└─ endings.js
```

Recommended system files that use this schema:

```text
src/
├─ state.js
├─ engine.js
├─ conditions.js
├─ effects.js
├─ save.js
└─ ui.js
```

---

# 3. GameMetadata

## Purpose

`GameMetadata` stores basic information about the whole game.

## Schema

```js
{
  gameId: string,
  title: string,
  version: string,
  language: string,
  startSceneId: string,
  defaultTheme?: string,
  author?: string,
  description?: string
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `gameId` | string | Yes | Unique game ID |
| `title` | string | Yes | Display title |
| `version` | string | Yes | Current game version |
| `language` | string | Yes | Default language, for example `zh-CN` |
| `startSceneId` | string | Yes | First scene ID |
| `defaultTheme` | string | No | Default UI theme |
| `author` | string | No | Author name |
| `description` | string | No | Short game description |

## Example

```js
export const metadata = {
  gameId: "night_shift_dispatch",
  title: "雨夜值班室",
  version: "0.1.0",
  language: "zh-CN",
  startSceneId: "chapter0_start",
  defaultTheme: "terminal-rain",
  author: "",
  description: "A rainy-night text interaction mystery game about emergency calls, clues, and hidden truth."
};
```

---

# 4. GameState

## Purpose

`GameState` stores the current player progress.

It should be saved to `localStorage` later.

## Schema

```js
{
  currentSceneId: string,
  currentChapterId: string,
  visitedSceneIds: string[],
  flags: Flags,
  stats: Stats,
  trust: Trust,
  inventory: string[],
  clues: string[],
  eventLog: EventLog[],
  currentMinute?: number,
  endingId?: string | null,
  saveVersion: string
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `currentSceneId` | string | Yes | Current scene ID |
| `currentChapterId` | string | Yes | Current chapter ID |
| `visitedSceneIds` | string[] | Yes | Scene IDs the player has visited |
| `flags` | object | Yes | Story switches |
| `stats` | object | Yes | Global player/game stats |
| `trust` | object | Yes | Trust values for characters |
| `inventory` | string[] | Yes | Item IDs owned by player |
| `clues` | string[] | Yes | Clue IDs collected by player |
| `eventLog` | object[] | Yes | Player action log |
| `currentMinute` | number | No | In-game time counter |
| `endingId` | string/null | No | Triggered ending ID |
| `saveVersion` | string | Yes | Save data version |

## Initial Example

```js
export const initialGameState = {
  currentSceneId: "chapter0_start",
  currentChapterId: "chapter0",

  visitedSceneIds: [],

  flags: {
    metLinXia: false,
    linXiaSaved: false,
    heardRedLightClue: false,
    taxiDriverTrusted: false,
    policeWarned: false,
    knowsStationConnection: false,
    finalCallUnlocked: false
  },

  stats: {
    stress: 0,
    savedCount: 0,
    failedCount: 0,
    clueScore: 0,
    // accuracy: not used in Phase 1
    // timePressure: not used in Phase 1; use currentMinute for time tracking
  },

  trust: {
    linXia: 0,
    driverZhou: 0,
    officerChen: 0,
    unknownCaller: 0
  },

  inventory: [],
  clues: [],
  eventLog: [],

  currentMinute: 0,
  endingId: null,
  saveVersion: "0.1.0"
};
```

---

# 5. Flags

## Purpose

`flags` record whether important story events have happened.

Flags are mainly boolean values.

## Schema

```js
{
  [flagName: string]: boolean
}
```

## Recommended Initial Flags

```js
{
  metLinXia: false,
  linXiaSaved: false,
  heardRedLightClue: false,
  taxiDriverTrusted: false,
  policeWarned: false,
  knowsStationConnection: false,
  finalCallUnlocked: false
}
```

## Example Use Cases

```text
metLinXia:
Whether the player has received Lin Xia's call.

linXiaSaved:
Whether Lin Xia survived.

heardRedLightClue:
Whether the player heard about the red light clue.

taxiDriverTrusted:
Whether Driver Zhou trusts the player.

policeWarned:
Whether the player warned Officer Chen.

knowsStationConnection:
Whether the player discovered the connection between calls and the abandoned subway station.

finalCallUnlocked:
Whether the final call is unlocked.
```

---

# 6. Stats

## Purpose

`stats` store global numeric values.

## Schema

```js
{
  stress: number,
  accuracy: number,
  savedCount: number,
  failedCount: number,
  clueScore: number,
  timePressure: number
}
```

## Field Explanation

| Field | Type | Initial Value | Description |
|---|---|---:|---|
| `stress` | number | 0 | Player/operator pressure |
| `accuracy` | number | — | Judgment accuracy. **Not used in Phase 1.** |
| `savedCount` | number | 0 | Number of saved people |
| `failedCount` | number | 0 | Number of failed cases |
| `clueScore` | number | 0 | Clue collection score |
| `timePressure` | number | — | Time pressure level. **Not used in Phase 1; use `currentMinute` for time tracking instead.** |

## Example

```js
{
  stress: 1,
  accuracy: 2,
  savedCount: 1,
  failedCount: 0,
  clueScore: 3,
  timePressure: 2
}
```

---

# 7. Trust

## Purpose

`trust` stores how much each main character trusts the player.

Trust should usually range from `-3` to `+3`.

```text
-3 = completely distrusts the player
 0 = neutral
+3 = highly trusts the player
```

## Schema

```js
{
  linXia: number,
  driverZhou: number,
  officerChen: number,
  unknownCaller: number
}
```

## Example

```js
{
  linXia: 2,
  driverZhou: 1,
  officerChen: -1,
  unknownCaller: 0
}
```

## Usage

Trust can affect:

```text
1. Whether a character tells the truth
2. Whether a character gives a key clue
3. Whether a character survives
4. Whether a hidden option appears
5. Which ending can be reached
```

---

# 8. SceneNode

## Purpose

`SceneNode` is the core story unit.

Each scene represents one text segment, such as:

```text
1. A caller speaking
2. A system message
3. A radio broadcast
4. A clue reveal
5. A final ending scene
```

## Schema

```js
{
  id: string,
  chapterId: string,
  speaker?: string,
  text: string,
  type: SceneType,
  mood?: string,
  background?: string,
  sound?: string,
  choices: ChoiceOption[],
  autoEffects?: Effect[],
  conditions?: Condition[],
  notes?: string
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | string | Yes | Unique scene ID |
| `chapterId` | string | Yes | Chapter ID |
| `speaker` | string | No | Current speaker name |
| `text` | string | Yes | Text shown to player |
| `type` | string | Yes | Scene type |
| `mood` | string | No | Current atmosphere |
| `background` | string | No | Background style or image ID |
| `sound` | string | No | Sound effect ID |
| `choices` | ChoiceOption[] | Yes | Player choices |
| `autoEffects` | Effect[] | No | Effects applied when entering scene |
| `conditions` | Condition[] | No | Conditions for entering scene |
| `notes` | string | No | Developer-only note |

## Scene Types

```text
dialogue
system
call
message
broadcast
ending
```

## Example

```js
{
  id: "chapter1_start",
  chapterId: "chapter1",
  speaker: "林夏",
  text: "喂？有人吗？我好像迷路了……这里雨很大，我看见一个废弃地铁口，里面有红色的灯。",
  type: "call",
  mood: "tense",
  background: "rain_terminal",
  sound: "phone_static",

  choices: [
    {
      id: "c1_comfort_lin_xia",
      label: "先安抚她，让她慢慢描述周围。",
      description: "Use a calm and comforting tone.",
      nextSceneId: "chapter1_lin_xia_calmer",
      tone: "comforting",
      riskLevel: "low",
      effects: [
        {
          type: "changeTrust",
          key: "linXia",
          value: 1,
          operation: "add",
          note: "Comforting Lin Xia increases trust."
        }
      ]
    },
    {
      id: "c1_question_red_light",
      label: "追问红色灯光的位置。",
      description: "Ask directly about the red light.",
      nextSceneId: "chapter1_red_light_detail",
      tone: "suspicious",
      riskLevel: "medium",
      effects: [
        {
          type: "addClue",
          key: "clue_red_light",
          value: "clue_red_light",
          operation: "push",
          note: "Player learns about the red light."
        }
      ]
    }
  ],

  autoEffects: [
    {
      type: "setFlag",
      key: "metLinXia",
      value: true,
      operation: "set"
    }
  ],

  notes: "First main call event."
}
```

---

# 9. ChoiceOption

## Purpose

`ChoiceOption` defines one selectable player response.

Each choice can:

```text
1. Move to another scene
2. Change state
3. Add clues
4. Change trust
5. Affect endings
6. Be shown only under conditions
```

## Schema

```js
{
  id: string,
  label: string,
  description?: string,
  nextSceneId: string,
  conditions?: Condition[],
  effects?: Effect[],
  tone?: ChoiceTone,
  riskLevel?: RiskLevel,
  hidden?: boolean,
  onceOnly?: boolean
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | string | Yes | Unique choice ID |
| `label` | string | Yes | Text shown on button |
| `description` | string | No | Optional tooltip/help text |
| `nextSceneId` | string | Yes | Scene to go to after choice |
| `conditions` | Condition[] | No | Conditions for showing this choice |
| `effects` | Effect[] | No | Effects applied after choosing |
| `tone` | string | No | Response tone |
| `riskLevel` | string | No | Risk level |
| `hidden` | boolean | No | Whether this is hidden by default |
| `onceOnly` | boolean | No | Whether it can only be selected once |

## Tone Values

```text
calm
strict
comforting
suspicious
urgent
silent
```

## Risk Values

```text
low
medium
high
unknown
```

## Example

```js
{
  id: "ask_about_broadcast",
  label: "问她广播里具体说了什么。",
  description: "This may reveal a clue, but it may also increase her fear.",
  nextSceneId: "chapter1_broadcast_detail",
  tone: "suspicious",
  riskLevel: "medium",

  conditions: [
    {
      type: "flag",
      key: "metLinXia",
      operator: "equals",
      value: true
    }
  ],

  effects: [
    {
      type: "addClue",
      key: "clue_broadcast_noise",
      value: "clue_broadcast_noise",
      operation: "push"
    },
    {
      type: "changeStat",
      key: "stress",
      value: 1,
      operation: "add"
    }
  ],

  hidden: false,
  onceOnly: true
}
```

---

# 10. Condition

## Purpose

`Condition` determines whether a scene or choice is available.

Conditions are used by `src/conditions.js`.

## Schema

```js
{
  type: ConditionType,
  key: string,
  operator: ConditionOperator,
  value: any
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `type` | string | Yes | What kind of value to check |
| `key` | string | Yes | State key or ID |
| `operator` | string | Yes | How to compare |
| `value` | any | Yes | Expected value |

## Condition Types

```text
flag
stat
trust
clue
item
visited
```

## Operators

```text
equals
notEquals
greaterThan
lessThan
greaterThanOrEquals
lessThanOrEquals
includes
notIncludes
exists
notExists
```

## Examples

### Flag Condition

```js
{
  type: "flag",
  key: "heardRedLightClue",
  operator: "equals",
  value: true
}
```

### Trust Condition

```js
{
  type: "trust",
  key: "officerChen",
  operator: "greaterThanOrEquals",
  value: 2
}
```

### Clue Condition

```js
{
  type: "clue",
  key: "clue_red_light",
  operator: "includes",
  value: true
}
```

### Item Condition

```js
{
  type: "item",
  key: "old_map",
  operator: "includes",
  value: true
}
```

### Visited Scene Condition

```js
{
  type: "visited",
  key: "chapter1_red_light_detail",
  operator: "includes",
  value: true
}
```

---

# 11. Effect

## Purpose

`Effect` describes what changes after entering a scene or choosing an option.

Effects are used by `src/effects.js`.

## Schema

```js
{
  type: EffectType,
  key: string,
  value: any,
  operation: EffectOperation,
  note?: string
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `type` | string | Yes | Effect type |
| `key` | string | Yes | Target field or ID |
| `value` | any | Yes | Value to apply |
| `operation` | string | Yes | Operation type |
| `note` | string | No | Developer note |

## Effect Types

```text
setFlag
changeStat
changeTrust
addClue
removeClue
addItem
removeItem
addLog
unlockScene
triggerEnding
```

## Operations

```text
set
add
subtract
push
remove
```

## Examples

### Set Flag

```js
{
  type: "setFlag",
  key: "linXiaSaved",
  value: true,
  operation: "set",
  note: "Lin Xia survived this event."
}
```

### Change Stat

```js
{
  type: "changeStat",
  key: "stress",
  value: 1,
  operation: "add",
  note: "The player feels more pressure."
}
```

### Change Trust

```js
{
  type: "changeTrust",
  key: "linXia",
  value: 1,
  operation: "add",
  note: "Lin Xia trusts the player more."
}
```

### Add Clue

```js
{
  type: "addClue",
  key: "clue_red_light",
  value: "clue_red_light",
  operation: "push",
  note: "The red light clue is collected."
}
```

### Trigger Ending

```js
{
  type: "triggerEnding",
  key: "ending_bad",
  value: "ending_bad",
  operation: "set",
  note: "The bad ending is triggered."
}
```

---

# 12. Character

## Purpose

`Character` stores information about a story character.

## Schema

```js
{
  id: string,
  name: string,
  role: string,
  firstAppearanceSceneId?: string,
  trustKey?: string,
  status: CharacterStatus,
  description?: string,
  voiceStyle?: string,
  secret?: string
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | string | Yes | Character ID |
| `name` | string | Yes | Display name |
| `role` | string | Yes | Character role |
| `firstAppearanceSceneId` | string | No | First scene where character appears |
| `trustKey` | string | No | Related key in `trust` |
| `status` | string | Yes | Current character status |
| `description` | string | No | Public character description |
| `voiceStyle` | string | No | Writing style for dialogue |
| `secret` | string | No | Hidden story information |

## Character Status Values

```text
unknown
safe
missing
dead
saved
hostile
```

## Example

```js
{
  id: "lin_xia",
  name: "林夏",
  role: "Lost caller",
  firstAppearanceSceneId: "chapter1_start",
  trustKey: "linXia",
  status: "unknown",
  description: "A 17-year-old caller who says she is lost near an abandoned subway entrance.",
  voiceStyle: "nervous, quiet, easily frightened",
  secret: "Her phone time is frozen at 00:17."
}
```

---

# 13. Clue

## Purpose

`Clue` stores information that the player can collect.

Clues are central to this game.

They can:

```text
1. Unlock new choices
2. Help identify lies
3. Affect character survival
4. Affect final ending
```

## Schema

```js
{
  id: string,
  title: string,
  description: string,
  sourceSceneId: string,
  relatedCharacterIds?: string[],
  tags?: string[],
  importance: ClueImportance,
  revealed: boolean,
  usedInEnding?: boolean
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | string | Yes | Clue ID |
| `title` | string | Yes | Display title |
| `description` | string | Yes | Clue description |
| `sourceSceneId` | string | Yes | Scene where the clue is found |
| `relatedCharacterIds` | string[] | No | Related characters |
| `tags` | string[] | No | Search/filter tags |
| `importance` | string | Yes | Importance level |
| `revealed` | boolean | Yes | Whether clue is visible |
| `usedInEnding` | boolean | No | Whether this clue affects endings |

## Importance Values

```text
minor
important
critical
```

## Examples

### Red Light Clue

```js
{
  id: "clue_red_light",
  title: "红色灯光",
  description: "林夏提到废弃地铁口里面亮着红色的灯，但那个地铁口按记录应该已经断电。",
  sourceSceneId: "chapter1_red_light_detail",
  relatedCharacterIds: ["lin_xia"],
  tags: ["station", "red_light", "abnormal"],
  importance: "critical",
  revealed: false,
  usedInEnding: true
}
```

### Broadcast Noise Clue

```js
{
  id: "clue_broadcast_noise",
  title: "广播杂音",
  description: "多个来电者都听到相似的广播杂音，里面像是在重复某个人的名字。",
  sourceSceneId: "chapter1_broadcast_detail",
  relatedCharacterIds: ["lin_xia", "driver_zhou"],
  tags: ["broadcast", "noise", "connection"],
  importance: "important",
  revealed: false,
  usedInEnding: true
}
```

### Frozen Time Clue

```js
{
  id: "clue_frozen_time_0017",
  title: "停在 00:17 的时间",
  description: "林夏说她的手机时间停在 00:17，但系统时间仍然正常流动。",
  sourceSceneId: "chapter1_phone_time",
  relatedCharacterIds: ["lin_xia"],
  tags: ["time", "phone", "abnormal"],
  importance: "critical",
  revealed: false,
  usedInEnding: true
}
```

---

# 14. Item

> **Not required for Phase 1. Implement only after Phase 3 is complete.**

## Purpose

`Item` stores objects the player can collect or use.

MVP can keep this system very small.

## Schema

```js
{
  id: string,
  name: string,
  description: string,
  usable: boolean,
  sourceSceneId?: string,
  effects?: Effect[],
  hidden?: boolean
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | string | Yes | Item ID |
| `name` | string | Yes | Display name |
| `description` | string | Yes | Item description |
| `usable` | boolean | Yes | Whether the item can be used |
| `sourceSceneId` | string | No | Source scene |
| `effects` | Effect[] | No | Effects when item is used |
| `hidden` | boolean | No | Whether item is hidden |

## Example Items

### Recording File

```js
{
  id: "recording_file_0017",
  name: "00:17 录音文件",
  description: "一段自动保存的通话录音，里面有明显的广播杂音。",
  usable: true,
  sourceSceneId: "chapter1_recording_saved",
  effects: [
    {
      type: "addClue",
      key: "clue_broadcast_noise",
      value: "clue_broadcast_noise",
      operation: "push"
    }
  ],
  hidden: false
}
```

### Old Map

```js
{
  id: "old_station_map",
  name: "旧地铁图",
  description: "一张旧地铁线路图，上面标出了一个现在系统里不存在的入口。",
  usable: true,
  sourceSceneId: "chapter2_old_map",
  effects: [
    {
      type: "addClue",
      key: "clue_hidden_station_entrance",
      value: "clue_hidden_station_entrance",
      operation: "push"
    }
  ],
  hidden: false
}
```

---

# 15. Ending

## Purpose

`Ending` defines one possible game ending.

Endings are selected based on conditions.

If multiple endings are valid, the one with the highest `priority` should be chosen.

## Schema

```js
{
  id: string,
  title: string,
  description: string,
  type: EndingType,
  conditions: Condition[],
  priority: number,
  unlockedSummary?: string,
  finalStatsShown?: boolean
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | string | Yes | Ending ID |
| `title` | string | Yes | Ending title |
| `description` | string | Yes | Ending text |
| `type` | string | Yes | Ending type |
| `conditions` | Condition[] | Yes | Conditions required to trigger |
| `priority` | number | Yes | Higher priority wins |
| `unlockedSummary` | string | No | Short ending summary |
| `finalStatsShown` | boolean | No | Whether final stats are displayed |

## Ending Types

```text
bad
normal
good
true
secret
```

## Example Endings

### Bad Ending

```js
{
  id: "ending_bad",
  title: "失败结局：被雨声吞没",
  description: "你做出了错误判断。关键来电者失联，陈警官独自进入废弃地铁站，再也没有回应。第二天的新闻把一切归为通信事故。",
  type: "bad",
  conditions: [
    {
      type: "stat",
      key: "failedCount",
      operator: "greaterThanOrEquals",
      value: 2
    }
  ],
  priority: 1,
  unlockedSummary: "你没能阻止事件扩大。",
  finalStatsShown: true
}
```

### Normal Ending

```js
{
  id: "ending_normal",
  title: "普通结局：部分真相",
  description: "你救下了部分来电者，也发现这些事件之间存在联系。但由于线索不足，废弃地铁站的真正秘密仍然被掩盖。",
  type: "normal",
  conditions: [
    {
      type: "stat",
      key: "savedCount",
      operator: "greaterThanOrEquals",
      value: 1
    }
  ],
  priority: 5,
  unlockedSummary: "你救下了一些人，但没有发现完整真相。",
  finalStatsShown: true
}
```

### True Ending

```js
{
  id: "ending_true",
  title: "真相结局：00:17 的来电",
  description: "你把红色灯光、广播杂音、停在 00:17 的时间和不存在的地铁入口联系起来。最后一通电话不再是威胁，而是证据。你成功让事件曝光。",
  type: "true",
  conditions: [
    {
      type: "clue",
      key: "clue_red_light",
      operator: "includes",
      value: true
    },
    {
      type: "clue",
      key: "clue_broadcast_noise",
      operator: "includes",
      value: true
    },
    {
      type: "clue",
      key: "clue_frozen_time_0017",
      operator: "includes",
      value: true
    },
    {
      type: "flag",
      key: "knowsStationConnection",
      operator: "equals",
      value: true
    }
  ],
  priority: 10,
  unlockedSummary: "你发现了所有来电背后的共同地点。",
  finalStatsShown: true
}
```

---

# 16. EventLog

## Purpose

`EventLog` records player actions.

It is useful for:

```text
1. Debugging
2. Showing a final report
3. Reviewing player choices
4. AI-assisted testing later
```

## Schema

```js
{
  time: number | string,
  sceneId: string,
  choiceId?: string,
  summary: string,
  effectsApplied?: string[]
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `time` | number/string | Yes | In-game time or real timestamp |
| `sceneId` | string | Yes | Scene where action happened |
| `choiceId` | string | No | Selected choice ID |
| `summary` | string | Yes | Short summary of player action |
| `effectsApplied` | string[] | No | List of applied effects |

## Example

```js
{
  time: 17,
  sceneId: "chapter1_start",
  choiceId: "c1_comfort_lin_xia",
  summary: "Player comforted Lin Xia and asked her to describe the area slowly.",
  effectsApplied: [
    "changeTrust:linXia:+1",
    "setFlag:metLinXia:true"
  ]
}
```

---

# 17. SaveData

## Purpose

`SaveData` stores the complete save file.

For MVP, only one autosave is needed.

## Schema

```js
{
  saveId: string,
  createdAt: string,
  updatedAt: string,
  gameVersion: string,
  gameState: GameState,
  currentScenePreview?: string,
  playTimeSeconds?: number
}
```

## Field Explanation

| Field | Type | Required | Description |
|---|---|---:|---|
| `saveId` | string | Yes | Save ID, for example `autosave` |
| `createdAt` | string | Yes | Save creation time |
| `updatedAt` | string | Yes | Last update time |
| `gameVersion` | string | Yes | Game version |
| `gameState` | GameState | Yes | Full game state |
| `currentScenePreview` | string | No | Short preview of current scene |
| `playTimeSeconds` | number | No | Total play time |

## Example

```js
{
  saveId: "autosave",
  createdAt: "2026-05-25T00:00:00.000Z",
  updatedAt: "2026-05-25T00:10:00.000Z",
  gameVersion: "0.1.0",
  gameState: {
    currentSceneId: "chapter1_start",
    currentChapterId: "chapter1",
    visitedSceneIds: ["chapter0_start"],
    flags: {
      metLinXia: true,
      linXiaSaved: false,
      heardRedLightClue: false,
      taxiDriverTrusted: false,
      policeWarned: false,
      knowsStationConnection: false,
      finalCallUnlocked: false
    },
    stats: {
      stress: 1,
      savedCount: 0,
      failedCount: 0,
      clueScore: 0,
      // accuracy: not used in Phase 1
      // timePressure: not used in Phase 1
    },
    trust: {
      linXia: 1,
      driverZhou: 0,
      officerChen: 0,
      unknownCaller: 0
    },
    inventory: [],
    clues: [],
    eventLog: [],
    currentMinute: 5,
    endingId: null,
    saveVersion: "0.1.0"
  },
  currentScenePreview: "林夏的第一通电话正在进行。",
  playTimeSeconds: 600
}
```

---

# 18. Recommended ID Naming Rules

Use clear and consistent IDs.

## Scene IDs

```text
chapter0_start
chapter1_start
chapter1_red_light_detail
chapter2_driver_arrives
chapter3_officer_warning
chapter4_final_call
ending_true_scene
```

## Choice IDs

```text
c1_comfort_lin_xia
c1_question_red_light
c2_warn_driver
c3_tell_officer_truth
c4_cut_system
```

## Character IDs

```text
lin_xia
driver_zhou
officer_chen
unknown_caller
```

## Clue IDs

```text
clue_red_light
clue_broadcast_noise
clue_frozen_time_0017
clue_hidden_station_entrance
clue_police_radio_interference
```

## Item IDs

```text
recording_file_0017
old_station_map
police_channel_log
```

## Ending IDs

```text
ending_bad
ending_normal
ending_true
ending_secret
```

---

# 19. Validation Rules

Before release, the project should validate the data.

## Scene Validation

Check that:

```text
1. Every scene has a unique id.
2. Every scene has a chapterId.
3. Every scene has text.
4. Every scene has a valid type.
5. Every choice has a valid nextSceneId.
6. No scene points to a missing scene.
7. Ending scenes are reachable.
```

## Choice Validation

Check that:

```text
1. Every choice has a unique id inside its scene.
2. Every choice has a label.
3. Every choice has a nextSceneId.
4. Every condition uses a valid type.
5. Every effect uses a valid type.
```

## Clue Validation

Check that:

```text
1. Every clue has a unique id.
2. Every clue has a title.
3. Every clue has a description.
4. Every clue sourceSceneId exists.
5. Clues referenced by effects exist.
```

## Character Validation

Check that:

```text
1. Every character has a unique id.
2. Every character has a name.
3. Every character has a valid status.
4. trustKey matches a key in GameState.trust if provided.
```

## Ending Validation

Check that:

```text
1. Every ending has a unique id.
2. Every ending has conditions.
3. Every ending has a priority.
4. At least one ending is reachable.
5. True ending requires critical clues.
```

---

# 20. MVP Implementation Notes

For Phase 1, only a small part of this schema is needed.

Phase 1 only needs:

```text
1. metadata
2. currentSceneId
3. scenes
4. choices
5. nextSceneId
6. simple effects
7. one ending
```

Phase 1 does not need full support for:

```text
1. items
2. advanced conditions
3. complex save files
4. audio
5. full ending priority logic
6. complex trust display
7. accuracy and timePressure stats
```

Recommended Phase 1 minimum scene shape:

```js
{
  id: "chapter0_start",
  chapterId: "chapter0",
  speaker: "System",
  text: "暴雨夜，你的值班开始了。第一通电话正在接入。",
  type: "system",
  choices: [
    {
      id: "start_shift",
      label: "接入电话",
      nextSceneId: "chapter1_start"
    }
  ]
}
```

Recommended Phase 1 minimum ending scene:

```js
{
  id: "ending_test",
  chapterId: "ending",
  speaker: "System",
  text: "测试结局：你完成了第一个可玩流程。",
  type: "ending",
  choices: []
}
```

---

# 21. Future Extension Ideas

These are not required for MVP.

Possible future additions:

```text
1. Multiple save slots
2. Gallery of unlocked endings
3. Character portrait system
4. Audio manager
5. Typewriter speed setting
6. Accessibility options
7. English localization
8. Steam achievement mapping
9. Branch visualization tool
10. Debug scene jump menu
```

Do not implement these until the MVP is stable.

---

# 22. Summary

This schema is designed to keep the game:

```text
1. Simple
2. Data-driven
3. Easy to test
4. Easy to expand
5. Suitable for Claude Code phase-by-phase implementation
```

The most important data types are:

```text
1. GameState
2. SceneNode
3. ChoiceOption
4. Condition
5. Effect
6. Clue
7. Ending
```

For the first playable prototype, focus only on:

```text
SceneNode + ChoiceOption + basic GameState
```

Then gradually add:

```text
conditions → effects → clues → trust → endings → save
```