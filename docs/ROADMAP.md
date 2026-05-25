# ROADMAP.md

## Phase 0: Planning Documents

### Goal
Only create planning documents. Do not write game code.

### Deliverables
- docs/GAME_SPEC.md
- docs/ROADMAP.md
- docs/TASKS.md
- docs/DATA_SCHEMA.md

### Acceptance Criteria
- Game concept is clear
- MVP scope is defined
- Data schema is planned
- Phase 1 tasks are small enough
- No gameplay code is changed

---

## Phase 1: Minimal Playable Prototype

### Goal
Create a simple playable text prototype from start to one ending.

### Scope
- Load initial scene
- Display story text
- Display choices
- Click choice to move to next scene
- Apply simple flags
- Trigger one ending

Note: Chapter 0 tutorial scenes are introduced here as minimal scene data (Task 1.3) and verified/expanded in Phase 3.

### Not Included
- Complex UI
- Save system
- Audio
- Multiple chapters
- Animation

### Acceptance Criteria
- Player can start the game
- Player can choose options
- Choices move to different scenes
- At least one ending is reachable
- No console errors

---

## Phase 2: State and Clue System

### Goal
Make choices affect the game state.

### Scope
- flags
- stats
- trust
- clues
- conditional choices
- automatic effects

### Acceptance Criteria
- Some choices only appear after clues are found
- Trust affects scene direction
- Clues appear in the clue panel
- Ending can change based on state

---

## Phase 3: Full MVP Story

### Goal
Complete the full MVP story.

### Scope
- Chapter 0 tutorial
- Chapter 1 lost girl
- Chapter 2 taxi driver
- Chapter 3 missing officer
- Chapter 4 final call
- At least 3 endings

### Acceptance Criteria
- Full story can be completed
- 3 endings are reachable
- Main characters have status changes
- Key clues affect the final ending

---

## Phase 4: UI and Experience Polish

### Goal
Make the game feel like a finished small project.

### Scope
- Chat-style story panel
- Choice panel
- Status panel
- Clue panel
- Character panel
- Ending screen
- Typewriter effect
- Autosave notice

### Acceptance Criteria
- UI is readable
- Player knows what is happening
- Choices are easy to click
- Clues and status are easy to view
- Visual style is consistent

---

## Phase 5: Testing and Release Preparation

### Goal
Make the game stable and ready to publish.

### Scope
- Validate all scene IDs
- Validate nextSceneId links
- Validate clue IDs
- Check ending reachability
- Test save/load
- Fix typos
- Prepare README

### Acceptance Criteria
- No dead-end scene
- No missing ID
- No JavaScript error
- All endings can be reached
- README explains how to play