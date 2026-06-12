// src/App.jsx
// The orchestrator: owns all state, runs the timer engine, and hands data +
// callbacks down to the three screens. The screens only display and report clicks.

import { useState, useEffect, useRef } from "react";
import { C, META, scaleDurations } from "./data/stretches";
import { T } from "./data/i18n";
import { beep } from "./utils/time";
import HomeScreen from "./components/HomeScreen";
import TimerScreen from "./components/TimerScreen";
import DoneScreen from "./components/DoneScreen";

export default function App() {
  const [lang, setLang] = useState("fr");
  const [screen, setScreen] = useState("home"); // "home" | "timer" | "done"
  const [idx, setIdx] = useState(0); // current exercise index
  const [remaining, setRemaining] = useState(META[0].dur); // seconds left (negative = overtime)
  const [running, setRunning] = useState(false);
  const [overtimes, setOvertimes] = useState([]); // recorded overrun per finished exercise
  const [minutes, setMinutes] = useState(""); // custom total length in minutes ("" = default)
  const [theme, setTheme] = useState(null); // selected reading theme (null = none)
  const [articles, setArticles] = useState([]); // fetched articles for this session
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Durations actually used this session, derived from the custom length.
  const durations = scaleDurations(Number(minutes));

  const lastTick = useRef(null); // wall-clock timestamp of the previous tick
  const beeped = useRef(false); // ensures the zero-cue fires only once per exercise
  const wakeLock = useRef(null); // keeps the screen awake during a session

  const t = T[lang];

  // Timer engine: ticks against the real clock to avoid drift.
  useEffect(() => {
    if (!running) return;
    lastTick.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = (now - lastTick.current) / 1000;
      lastTick.current = now;
      setRemaining((r) => {
        const next = r - dt;
        if (r > 0 && next <= 0 && !beeped.current) {
          beeped.current = true;
          beep();
        }
        return next;
      });
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  // Keep the screen on while the timer screen is visible.
  useEffect(() => {
    if (screen === "timer" && "wakeLock" in navigator) {
      navigator.wakeLock.request("screen").then((l) => (wakeLock.current = l)).catch(() => {});
    }
    return () => {
      wakeLock.current && wakeLock.current.release().catch(() => {});
      wakeLock.current = null;
    };
  }, [screen]);

  // Fetch articles from our serverless function for the chosen theme + length.
  const fetchArticles = async () => {
    if (!theme) {
      setArticles([]); // no theme picked → no articles
      return;
    }
    setLoadingArticles(true);
    setArticles([]);
    try {
      const min = Number(minutes) || 6; // session length, default 6
      const res = await fetch(`/api/articles?theme=${theme}&minutes=${min}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (e) {
      setArticles([]); // on failure, just show none
    } finally {
      setLoadingArticles(false);
    }
  };
  
  // Start a fresh session from the first exercise.
  const start = () => {
    setIdx(0);
    setRemaining(durations[0]);
    setOvertimes([]);
    beeped.current = false;
    setRunning(true);
    setScreen("timer");
    fetchArticles(); // kick off the article search in the background
  };

  // Record this exercise's overrun, then advance or finish.
  const next = () => {
    const over = remaining < 0 ? -remaining : 0;
    const newOver = [...overtimes, over];
    if (idx + 1 >= META.length) {
      setOvertimes(newOver);
      setRunning(false);
      setScreen("done");
    } else {
      setOvertimes(newOver);
      setIdx(idx + 1);
      setRemaining(durations[idx + 1]);
      beeped.current = false;
    }
  };

  const quit = () => {
    setRunning(false);
    setScreen("home");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.cream,
        fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        button:active { transform: scale(0.98); }
        body { margin: 0; }
      `}</style>

      {screen === "home" && (
        <HomeScreen
          lang={lang}
          setLang={setLang}
          t={t}
          minutes={minutes}
          setMinutes={setMinutes}
          theme={theme}
          setTheme={setTheme}
          onStart={start}
        />
      )}

      {screen === "timer" && (
        <TimerScreen
          t={t}
          idx={idx}
          remaining={remaining}
          running={running}
          overtimes={overtimes}
          articles={articles}
          loadingArticles={loadingArticles}
          onToggle={() => setRunning(!running)}
          onNext={next}
          onQuit={quit}
        />
      )}

      {screen === "done" && (
        <DoneScreen t={t} overtimes={overtimes} onHome={() => setScreen("home")} />
      )}
    </div>
  );
}