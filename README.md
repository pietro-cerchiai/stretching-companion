# Stretching Companion

A minimalist stretching timer that guides you through a sequence of stretches,
one at a time, with a large countdown and overtime tracking. Built as a personal
app, accessible from the phone, with optional reading or listening suggestions to
enjoy during a session.

## Features

- **Guided sequence** — 12 stretches (upper & lower body), with body-part pictograms
- **Large countdown** — one stretch on screen at a time, distraction-free
- **Starts paused** — the session opens paused; you start the timer when ready
- **Overtime tracking** — hold a stretch past its time and the timer counts up in
  red, recording the overrun, with a per-exercise breakdown at the end
- **Custom session length** — type a total time and every exercise scales
  proportionally; the per-exercise durations update live before you start
  (shown as `m:ss` once over a minute)
- **Reading & listening suggestions** — pick an optional theme and the app finds
  content to enjoy during the session, opened from a panel without interrupting
  the timer:
  - **Short sessions (< 15 min)** → a few Guardian articles whose total reading
    time lands around the session length
  - **Long sessions (≥ 15 min)** → relevant Spotify podcasts on the theme
- **Guide** — a button on every screen opens the illustrated stretching guide (PDF)
- **First-visit tutorial** — a step-by-step guided tour on first launch, replayable
  anytime via the "?" button
- **Multilingual** — French, Italian, and English, auto-detected from the device
- **Stays awake** — the screen won't sleep mid-session

## Themes

The same themes drive both articles and podcasts. For articles, a hybrid lookup
against The Guardian maps some themes to real sections and others to keyword
searches. For podcasts, each theme maps to a Spotify keyword search.

Geopolitics, History, Geography, AI, Politics, Science, Environment, Technology,
Economy, Culture, Books, Travel, Society, Film.

## Tech stack

- [React](https://react.dev/) with [Vite](https://vite.dev/)
- Deployed on [Vercel](https://vercel.com/), with serverless functions for the
  article and podcast searches (keeps all API credentials server-side)
- [The Guardian Open Platform API](https://open-platform.theguardian.com/)
- [Spotify Web API](https://developer.spotify.com/) (Client Credentials flow,
  no user login)
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

> Note: the article and podcast searches run as Vercel serverless functions and
> need the deployed environment to work — they are not available on the local
> Vite server.

## Environment variables

Set in the Vercel project settings (never committed to the repo):

- `GUARDIAN_API_KEY` — key from the Guardian Open Platform
- `SPOTIFY_CLIENT_ID` — from the Spotify developer dashboard
- `SPOTIFY_CLIENT_SECRET` — from the Spotify developer dashboard

## Project structure

```
api/
  articles.js        # serverless function: Guardian search + reading-time estimate
  podcasts.js        # serverless function: Spotify podcast (show) search
public/
  guide.pdf          # illustrated stretching guide
src/
  data/
    stretches.js     # exercise metadata (category, duration), palette, scaling
    i18n.js          # all UI translations (fr / it / en), theme labels, tutorial
  utils/
    time.js          # time formatting + end-of-exercise cue
  components/
    StretchIcon.jsx  # line pictogram per stretch
    HomeScreen.jsx   # language picker, theme list, session overview, tutorial button
    TimerScreen.jsx  # progress bar, countdown, controls, guide, reading/listening panel
    DoneScreen.jsx   # session summary
    Tutorial.jsx     # first-visit guided tour (blurred overlay, stepped cards)
  App.jsx            # state owner + timer engine, wires the screens together
```

## Roadmap

- **Word of the day (language learning)** — instead of picking an article, the
  app surfaces a random word in a chosen language, and each exercise shows a
  different example sentence using that word. Likely powered by AI to generate
  natural, level-appropriate sentences and translations.
- **Radio France / France Inter** — add public-radio podcasts as a content source
  (API access requested; mapping themes to specific shows).
- **New York Times** — add NYT as an additional article source alongside the Guardian.
- **Article relevance & cleanup** — switch keyword searches to relevance-based
  ordering, and strip stray HTML from article summaries.
- **Persistent session state** — save the running timer so a long detour into an
  article or podcast never loses your place.
- **Progressive body map** — unlock body parts visually as you complete stretches.