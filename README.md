# Stretching Companion

A minimalist stretching timer that guides you through a sequence of stretches,
one at a time, with a large countdown and overtime tracking. Built as a personal
app, accessible from the phone.

## Features

- **Guided sequence** — 12 stretches (upper & lower body), 30 seconds each
- **Large countdown** — one stretch on screen at a time, distraction-free
- **Overtime tracking** — when you hold a stretch past its time, the timer counts
  up in red and records the overrun, with a per-exercise breakdown at the end
- **Multilingual** — French, Italian, and English
- **Pictograms** — a simple line icon for each stretch
- **Stays awake** — the screen won't sleep mid-session

## Tech stack

- [React](https://react.dev/) with [Vite](https://vite.dev/)
- No external UI libraries — styling is inline, icons are hand-drawn SVG

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
```

To open it on your phone (same Wi-Fi network):

```bash
npm run dev -- --host
```

Then visit the `Network:` address shown in the terminal from your phone's browser.

## Project structure

```
src/
  data/
    stretches.js     # exercise metadata (category, duration) + color palette
    i18n.js          # all UI translations (fr / it / en)
  utils/
    time.js          # time formatting + end-of-exercise cue
  components/
    StretchIcon.jsx  # line pictogram per stretch
    HomeScreen.jsx   # language picker + session overview
    TimerScreen.jsx  # progress bar, countdown, controls
    DoneScreen.jsx   # session summary
  App.jsx            # state owner + timer engine, wires the screens together
```

## Roadmap

- **V1** — optional custom session length, durations scaled proportionally
- **V2** — pre-session content suggestions, progressive body-map unlocking