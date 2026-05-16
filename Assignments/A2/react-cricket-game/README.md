# Bat-ter Up — React Cricket Game

Concise, single-player cricket batting game built with React and Vite. This README explains the game's purpose, how the UI maps to the code, the core game logic (probabilities and the power-bar), the tech stack, and how to run the project locally.

## Purpose & Concept

- Purpose: A small, interactive demo that teaches probability-driven gameplay. The player chooses a batting style (Aggressive or Defensive), bowls the ball (starts the slider), and clicks the power bar to attempt a shot. Outcomes (0,1,2,3,4,6 or W) are determined probabilistically.
- Educational angle: Shows how probability distributions map to visible UI segments (power bar), how state flows in a React app, and how time-based animations (requestAnimationFrame) synchronize visual feedback with game logic.

## What you see (UI) and where in the code

- Full-screen field and sprites: `src/components/GroundScene.jsx` — draws the pitch, batsman, bowler, fielders, and the animated ball.
- Scoreboard: `src/components/Scoreboard.jsx` — shows runs/wickets/overs, ball tracker and best score.
- Power bar (probability slider): `src/components/PowerBar.jsx` — visual segments proportional to probabilities and a moving slider; clicking the bar triggers the shot.
- Batting style picker: `src/components/BattingStylePicker.jsx` — choose `Aggressive` or `Defensive` (changes probability table and batter visuals).
- Commentary & result flash: `src/components/CommentaryBox.jsx` and `src/components/ResultFlash.jsx` — textual and large visual feedback after each ball.
- Game orchestration: `src/pages/GameScreen.jsx` — main state machine, outcome resolution, animations, and score updates.
- Constants & probabilities: `src/utils/constants.js` — contains `aggressiveprobs`, `defensiveprobs`, `commentary`, `speedmap`, and other game constants.
- Audio hook: `src/audios/useSounds.js` — small WebAudio + audio file logic for effects (six/four/wicket/crowd).

File map (quick links):

- `src/pages/GameScreen.jsx` — main game logic and state
- `src/components/GroundScene.jsx` — field SVG and sprites
- `src/components/PowerBar.jsx` — probability bar + slider animation
- `src/components/Scoreboard.jsx` — scoreboard UI
- `src/components/BattingStylePicker.jsx` — style selector
- `src/utils/constants.js` — probability distributions and commentary

## Core game logic (short)

- Probability tables (in `src/utils/constants.js`) define discrete outcomes and probabilities. Example (aggressive):
	- W: 0.30, 0: 0.10, 1: 0.10, 2: 0.10, 3: 0.05, 4: 0.15, 6: 0.20 (sums to 1.0)
- Power bar segments are drawn with widths proportional to those probabilities. The slider oscillates across 0–100 and the numeric position maps into the cumulative distribution to pick an outcome.
- `getoutcome(pos, probs)` converts slider position to a decimal (pos/100) and returns the first segment whose cumulative probability exceeds that number. A small epsilon avoids floating point edge cases.

## State & animation overview

- The main `GameScreen` component uses React state (via `useState`) for game variables like `runs`, `wickets`, `ballsbowled`, `phase`, and animation state (`ballx`, `bally`, `ballvisible`, `swinging`, `running`, `ballscale`).
- The power bar animation uses `requestAnimationFrame` to smoothly update the slider position and writes into a `useRef` (`slideref`) to avoid re-rendering every frame. The click reads `slideref.current` for the exact moment value.
- Ball and outcome animations are time-based with different durations (delivery: ~250ms, outcome: 500–1200ms depending on runs). These are driven by `requestAnimationFrame` loops inside `GameScreen`.

## Tech stack

- Framework: React 19 (functional components + hooks)
- Bundler/dev server: Vite
- Styling: inline styles and Tailwind config available in the repo (UI uses custom inline CSS for component visuals)
- Audio: WebAudio + packaged MP3 in `src/audios`
- Icons: inline SVG elements (no external icon package required)

## How to run (development)

1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run dev
```

3. Open the app

By default, Vite prints a local URL such as `http://localhost:5173`. Open it in your browser.

## Configuration available in UI

- Overs, wickets and game speed can be adjusted from the Settings screen in the app. These values are passed as `config` into `GameScreen` (e.g., `config.overs`, `config.wickets`, `config.speed`).

## Quick developer notes (viva prep)

- `slideref` is intentionally a `useRef` to store high-frequency slider updates without forcing React re-renders.
- `phase` is a simple state machine: `'idle'` → `'bowling'` → `'animating'` → (back to `'idle'`) or `'gameover'`.
- `getoutcome()` uses cumulative probability mapping — be ready to explain this on the viva with an example slider position.
- The power bar's visual widths = `prob * 100%`. Larger segments mean higher probability.

## Suggested talking points for demo

- Show how changing batting style impacts the power bar colors and segment sizes.
- Demonstrate clicking the bar at different positions and explain how the slider position maps to outcomes.
- Explain why `useRef` is chosen for slider vs `useState` (performance).
- Walk through the animation phases when a ball is bowled (bowler run-in → delivery → outcome trajectory → scoreboard update).

## Contributing / Notes

This repo is a student assignment/demo. If you update probabilities or speed settings, keep the probability arrays normalized (sum to 1.0).

If you want, I can also:
- add inline comments in `src/utils/constants.js` explaining each probability entry,
- add a short `VIVA.md` with Q&A pairs derived from the rubric,
- or add a small screenshot gallery to the README showing key UI states.

---
Happy demoing — tell me which follow-up you want (VIVA.md, inline comments, or screenshots). 
