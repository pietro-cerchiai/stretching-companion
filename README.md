# Stretching Companion

A minimalist stretching timer that guides you through a sequence of stretches,
one at a time, with a large countdown and overtime tracking. Built as a personal
app, accessible from the phone, with optional reading suggestions to enjoy
during a session.

## Features

- **Guided sequence** — 12 stretches (upper & lower body), with body-part pictograms
- **Large countdown** — one stretch on screen at a time, distraction-free
- **Overtime tracking** — hold a stretch past its time and the timer counts up in
  red, recording the overrun, with a per-exercise breakdown at the end
- **Custom session length** — type a total time and every exercise scales
  proportionally; the per-exercise durations update live before you start
  (shown as `m:ss` once over a minute)
- **Reading suggestions** — pick an optional theme and the app finds a few
  Guardian articles whose total reading time lands around your session length,
  opened from a "Reading" panel during the session without interrupting the timer
- **Multilingual** — French, Italian, and English
- **Stays awake** — the screen won't sleep mid-session

## Themes

Reading themes use a hybrid lookup against The Guardian's Open Platform API:
some map to real Guardian sections, others to keyword searches for topics that
have no dedicated section.

- **Keyword search**: Geopolitics, History, Geography, AI
- **Section-based**: Politics, Science, Environment, Technology, Economy,
  Culture, Books, Travel, Society, Film

## Tech stack

- [React](https://react.dev/) with [Vite](https://vite.dev/)
- Deployed on [Vercel](https://vercel.com/), with a serverless function for the
  article search (keeps the API key server-side)
- [The Guardian Open Platform API](https://open-platform.theguardian.com/)
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

> Note: the article search runs as a Vercel serverless function and needs the
> deployed environment to work — it is not available on the local Vite server.

## Environment variables

Set in the Vercel project settings (never committed to the repo):

- `GUARDIAN_API_KEY` — key from the Guardian Open Platform

## Project structure

```
api/
  articles.js        # serverless function: Guardian search + reading-time estimate
src/
  data/
    stretches.js     # exercise metadata (category, duration), palette, scaling
    i18n.js          # all UI translations (fr / it / en) + theme labels
  utils/
    time.js          # time formatting + end-of-exercise cue
  components/
    StretchIcon.jsx  # line pictogram per stretch
    HomeScreen.jsx   # language picker, theme list, session overview
    TimerScreen.jsx  # progress bar, countdown, controls, reading panel
    DoneScreen.jsx   # session summary
  App.jsx            # state owner + timer engine, wires the screens together
```

## Roadmap

- **Podcasts (Spotify)** — for longer sessions (e.g. 15 min+), suggest podcast
  episodes instead of articles, matched by theme and filtered by duration to fit
  the session. Uses the Spotify Client Credentials flow server-side (no user
  login), returning a clickable link that opens the Spotify app — same pattern as
  the article links. Articles for short sessions, podcasts for long ones.
- **Word of the day (language learning)** — instead of picking an article, the
  app surfaces a random word in a chosen language, and each exercise shows a
  different example sentence using that word. Likely powered by AI to generate
  natural, level-appropriate sentences and translations.
- **Article relevance & cleanup** — switch keyword searches to relevance-based
  ordering, and strip stray HTML from article summaries.
- **Persistent session state** — save the running timer so a long detour into an
  article or podcast never loses your place.
- **Progressive body map** — unlock body parts visually as you complete stretches.