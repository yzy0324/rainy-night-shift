# GAME_SPEC.md

## 1. Project Overview
- Game title: 雨夜值班室 / Night Shift Dispatch
- Genre: Text interaction, branching narrative, mystery, light clue management
- Platform: HTML5 / JavaScript web game
- Target: Solo developer MVP

## 2. Core Concept
玩家扮演暴雨夜的应急热线接线员，通过接听电话、选择回复、收集线索、判断真假信息，影响角色命运和最终结局。

## 3. Core Gameplay Loop
1. Receive a call
2. Read dialogue
3. Choose a response
4. Gain clues or change state
5. Move to the next scene
6. Reach different endings

## 4. Player Role
玩家不能直接行动，只能通过电话回复、询问、安抚、质疑、报警、记录线索来影响剧情。

## 5. Full MVP / Complete Deliverable Scope
MVP includes:
- Start screen
- 3 call events
- 3-5 scene nodes per event
- 2-4 choices per node
- Basic state variables
- Clue system
- 2-3 endings
- Local save
- Simple text UI

MVP excludes:
- Voice acting
- Complex animation
- Online server
- Login system
- Database
- Achievement system
- Complex assets

### Phase 1 Scope

Phase 1 produces a bare playable prototype only. It is not the full MVP.

Phase 1 includes:
- index.html entry page with start screen (title, atmosphere text, Begin button)
- Dark terminal CSS layout
- Minimal scene data (Chapter 0 start + one short branch + one test ending)
- Scene navigation (click choice → load next scene)
- Basic game state (currentSceneId only)

Phase 1 excludes:
- Save system
- Clue panel
- Trust UI
- Audio
- Animation
- Multiple chapters
- Full ending logic
- Conditional choices
- Effects system

## 6. Story Structure
- Chapter 0: 值班开始
- Chapter 1: 迷路的女孩
- Chapter 2: 出租车司机
- Chapter 3: 失联巡逻员
- Chapter 4: 最后一通电话

## 7. Main Systems
- Scene node system
- Choice system
- State variable system
- Clue system
- Trust system
- Time pressure system
- Ending system

## 8. UI Direction
- Left side: story/chat text
- Right side: clues, character status, time, stress
- Bottom: choice buttons

## 9. Visual Style
- Rainy night
- Old emergency hotline terminal
- Black background
- Green/white terminal text
- Red warning light
- Light CRT effect

## 10. Audio Direction
Optional for MVP:
- Phone ring
- Rain ambience
- Radio noise
- Keyboard typing
- Warning beep