# Horror Layer Plan — v0.9.0

## 1. Design Goal

The current game is a realistic suspense story about Lin Xia, Chen Ming, the South Gate van, and memory card evidence.
The horror expansion should not destroy this plot.
Instead, it should add a hidden psychological horror layer after the player reaches the best evidence route.

Core idea:
The first half looks like a criminal suspense story.
After the player solves the realistic case, the old Platform 3 begins to behave unnaturally.

## 2. Core Horror Concept

Ten years ago, on a rainy night, an accident happened at Beiqiao Station's old Platform 3.
Official records say there were no casualties.
But the old phone line, station broadcast, CCTV, and duty logs still repeat that night.
Every rainy night, old Platform 3 may "reopen".

## 3. Horror Motifs

- Third phone call
- Old Platform 3 reopens
- Broadcast cannot be turned off
- System clock repeats 23:47
- Old passengers appear on CCTV
- Duty log contains handwriting matching the player
- The voice on the phone is the player's own voice
- Restart / replay can feel like another night shift

## 4. How It Connects to Existing Story

Do not remove existing endings.
Do not remove the criminal-suspense layer.
The horror layer should connect from the current best evidence route.

Recommended approach:
Change the "send evidence immediately" path so it first goes to a bridge scene:
`chapter4_full_truth_bridge`

That scene should show that the realistic case seems solved:
- Evidence is sent
- Lin Xia is safe
- Dispatch confirms patrol arrival
- Grey van suspects are being handled

Then the player gets two choices:
1. End the night and keep the realistic best ending → `ending_full_truth`
2. Check the old broadcast anomaly → `chapter5_broadcast_returns`

This preserves the original realistic best ending while adding an optional hidden horror route.

## 5. New Chapter 5 Direction

Chapter 5 title:
旧站台重新开放 / The Old Platform Reopens

Key scenes:
- `chapter5_broadcast_returns`
- `chapter5_broadcast_wont_stop`
- `chapter5_crowd_on_platform`
- `chapter5_lin_xia_memory`
- `chapter5_system_log`
- `chapter5_logbook_self`
- `chapter5_third_call`
- `chapter5_phone_keeps_ringing`
- `chapter5_phone_unplugged`
- `chapter5_voice_answers`
- `chapter5_see_self`
- `chapter5_protect_lin_xia`

## 6. New Horror Endings

Add:
- `ending_true_horror`
- `ending_taken_by_shift`
- `ending_lin_xia_left_behind`

Ending meanings:

**ending_true_horror:**
The player avoids the third call, protects Lin Xia, and survives the old platform anomaly. The horror is not destroyed, only delayed.

**ending_taken_by_shift:**
The player answers the third call or keeps staring at the "other self" on CCTV. The old platform takes the player into the shift cycle.

**ending_lin_xia_left_behind:**
The player focuses too much on the system/monitor and fails to protect Lin Xia. She appears later on the old platform CCTV and the first phone call repeats.

## 7. Implementation Principles

- Keep changes mostly data-driven.
- Prefer `data/scenes.js` changes.
- Do not rewrite the engine.
- Do not change UI in this phase.
- Do not add new clue total.
- Use flags instead of adding more clue IDs if possible.
- Keep scene IDs ASCII-only.
- Do not use innerHTML.
- Every `nextSceneId` must resolve.

## 8. Likely Files to Change Later

**Modify:**
- `data/scenes.js`
- `data/metadata.js`

**Do not modify:**
- `src/engine.js`
- `src/ui.js`
- `src/conditions.js`
- `src/effects.js`
- `index.html`
- `style.css`

unless a real blocking issue is found.
