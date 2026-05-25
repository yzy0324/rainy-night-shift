# TASKS.md

## Rules for Claude Code

1. Do one small task at a time.
2. Before editing, list the files that will change.
3. Do not modify gameplay files unless asked.
4. Do not rewrite the whole project.
5. Do not add frameworks unless necessary.
6. Do not add online features.
7. Keep the game simple and playable first.

---

## Phase 0 Tasks

### Task 0.1: Create Planning Documents
Files:
- docs/GAME_SPEC.md
- docs/ROADMAP.md
- docs/TASKS.md
- docs/DATA_SCHEMA.md

Acceptance:
- Files are created
- No game code is changed
- No assets are created

---

## Phase 1 Tasks

### Task 1.1: Create Basic HTML Entry and Start Screen
Likely files:
- index.html

Goal:
Create the game entry page. The page must include a start screen that shows the game title, a short atmosphere line, and a Begin button. Clicking Begin hides the start screen and reveals the main game area (story panel and choice panel). The start screen is the first thing the player sees.

Acceptance:
- Page loads in browser
- Start screen is visible on load with game title, a short atmosphere line, and a Begin button
- Clicking Begin hides the start screen and enters the first scene
- Story area is present
- Choice area is present

---

### Task 1.2: Create Basic Styling
Likely files:
- style.css

Goal:
Add dark terminal-style UI.

Acceptance:
- Text is readable
- Buttons are visible
- Layout works on desktop

---

### Task 1.3: Create Minimal Scene Data
Likely files:
- data/scenes.js
- data/metadata.js

Goal:
Add a tiny test story with start, one choice branch, and one ending.

Acceptance:
- Scene IDs are unique
- Each choice has a valid nextSceneId
- At least one ending exists

---

### Task 1.4: Create Basic Game Engine
Likely files:
- src/engine.js
- src/state.js
- game.js

Goal:
Load current scene and move between scenes. game.js is the entry point only: it imports and wires engine.js, state.js, and ui.js together, then calls Engine.init(). It does not contain rendering logic. Rendering is Task 1.5's responsibility.

Acceptance:
- Current scene displays
- Choice click changes scene
- Ending scene can be reached

---

### Task 1.5: Create Basic UI Renderer
Likely files:
- src/ui.js

Goal:
Render story text and choices. All rendering logic lives in src/ui.js. game.js already exists from Task 1.4; this task only adds calls into ui.js from game.js — it does not add new logic to game.js itself.

Acceptance:
- Story text updates correctly
- Choice buttons update correctly
- No console errors

---

## Phase 2 Tasks

### Task 2.1: Add Effects System
Likely files:
- src/effects.js
- src/state.js
- data/scenes.js

Goal:
Choices can change flags, stats, trust, and clues.

Acceptance:
- Effects apply after choice click
- State changes can be logged

---

### Task 2.2: Add Conditions System
Likely files:
- src/conditions.js
- src/ui.js
- data/scenes.js

Goal:
Choices can appear or disappear based on state.

Acceptance:
- Clue-based choices work
- Trust-based choices work
- Flag-based choices work

---

### Task 2.3: Add Clue Panel
Likely files:
- src/ui.js
- data/clues.js
- style.css

Goal:
Show collected clues.

Acceptance:
- New clues appear after being collected
- Clue title and description are readable

---

## Phase 3 Tasks

### Task 3.1: Expand Chapter 0 and Chapter 1 Narrative
Files:
- data/metadata.js
- data/scenes.js
- data/clues.js

Goal:
Expand the opening into a richer Chapter 0 + Chapter 1 arc.
New Chapter 0: chapter0_arrival (entering station) and chapter0_terminal (booting terminal).
New Chapter 1 middle scene: chapter1_tension_rises (mandatory, reached by both initial choices).
New Chapter 1 alt branch: chapter1_comfort_alt (shown when pressedForDetails flag is true).
New clues: clue_static_interference, clue_wrong_number_doubt.
Polish existing scene texts.
startSceneId updated to chapter0_arrival.

Acceptance:
- Game starts at chapter0_arrival, not chapter0_start
- Chapter 0 three-scene intro plays through to phone ring
- Both chapter1_lin_xia_call choices reach chapter1_tension_rises
- chapter1_tension_rises shows two mutually exclusive comfort choices based on pressedForDetails flag
- Player who pressed for details reaches chapter1_comfort_alt; gentle player reaches chapter1_comfort
- chapter1_comfort_alt text differs from chapter1_comfort
- clue_static_interference added via all chapter1_tension_rises paths
- clue_wrong_number_doubt added only via the doubt path
- chapter1_question conditional "追问她的迟疑" still works (clue_lin_xia_hesitation added on investigative path)
- All scene links valid; no broken nextSceneId references
- No JS errors in console on any playthrough

---

### Task 3.2: Add Chapter 2 Story (DEFERRED — Phase 4+)
Goal:
Implement the taxi driver call. Deferred until trust/save system is designed.

---

### Task 3.3: Add Chapter 3 Story (DEFERRED — Phase 4+)
Files:
- data/scenes.js
- data/clues.js

Goal:
Implement the missing officer call.

Acceptance:
- Officer Chen reacts to previous clues
- Trust affects his outcome

---

### Task 3.4: Add Final Call and Endings
Likely files:
- data/scenes.js
- data/endings.js

Goal:
Add final decision and multiple endings.

Acceptance:
- Normal ending reachable
- Bad ending reachable
- True ending reachable

---

## Phase 4 Tasks

Detailed tasks TBD after Phase 3 is complete.

### Task 4.1: Implement Save System (Placeholder)
Likely files:
- src/save.js

Goal:
Implement autosave to localStorage and load-on-start. Do not begin this task until Phase 3 is complete.

Acceptance:
- Game autosaves current state after each choice
- Save loads correctly on page reload
- Save version is validated against game version on load
- Mismatched save version is discarded gracefully

---

## Phase 5 Tasks

Detailed tasks TBD after Phase 3 is complete.