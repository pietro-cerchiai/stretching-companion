// src/components/TimerScreen.jsx
// Active session screen: progress bar, current stretch, the large countdown
// (counts up in coral when overtime), and the pause / next controls.

import { C, META } from "../data/stretches";
import { fmt } from "../utils/time";
import StretchIcon from "./StretchIcon";

export default function TimerScreen({ t, idx, remaining, running, overtimes, onToggle, onNext, onQuit }) {
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  const isOver = remaining < 0;
  const totalOver = overtimes.reduce((s, o) => s + o, 0);
  const liveOver = totalOver + (isOver ? -remaining : 0);

  const btn = (primary) => ({
    flex: 1, padding: "18px 0", borderRadius: 14, border: primary ? "none" : `1px solid ${C.line}`,
    background: primary ? C.sage : "transparent", color: primary ? C.bg : C.cream,
    fontSize: 17, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, maxWidth: 440, margin: "0 auto", width: "100%" }}>
      {/* Progress bar: one segment per exercise, coral if overrun on it */}
      <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
        {META.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < idx ? (overtimes[i] > 0 ? C.coral : C.cream) : i === idx ? C.sage : C.line,
          }} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ ...mono, fontSize: 12, letterSpacing: 2, color: C.sage, textTransform: "uppercase" }}>
          {t.cats[META[idx].cat]} · {idx + 1}/{META.length}
        </div>
        <button onClick={onQuit} style={{ background: "none", border: "none", color: C.dim, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>{t.stop}</button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
        <StretchIcon id={idx} />
        <h2 style={{ fontSize: 27, fontWeight: 700, margin: "12px 0 8px", lineHeight: 1.15 }}>{t.s[idx].name}</h2>
        <p style={{ color: C.dim, fontSize: 15, margin: "0 auto", maxWidth: 320, lineHeight: 1.45 }}>{t.s[idx].note}</p>

        <div style={{ ...mono, fontSize: 88, fontWeight: 500, letterSpacing: -2, marginTop: 18, color: isOver ? C.coral : C.cream, fontVariantNumeric: "tabular-nums" }}>
          {isOver ? "+" : ""}{fmt(remaining)}
        </div>
        <div style={{ ...mono, fontSize: 13, color: isOver ? C.coral : C.dim, letterSpacing: 1, minHeight: 18 }}>
          {isOver ? t.overtime : running ? t.remaining : t.paused}
        </div>
        {liveOver > 0 && (
          <div style={{ ...mono, fontSize: 13, color: C.dim, marginTop: 10 }}>
            {t.cumul} : +{fmt(liveOver)}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onToggle} style={btn(false)}>{running ? t.pause : t.resume}</button>
        <button onClick={onNext} style={btn(true)}>{idx + 1 >= META.length ? t.finish : t.next}</button>
      </div>
    </div>
  );
}