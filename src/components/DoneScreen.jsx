// src/components/DoneScreen.jsx
// Summary screen: planned vs actual time, total overtime, and a per-exercise
// breakdown of where time was exceeded.

import { C, TOTAL_PLANNED } from "../data/stretches";
import { fmt } from "../utils/time";

// Small labeled row used inside the summary card.
function Row({ label, value, color, mono, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: last ? "none" : `1px solid ${C.line}` }}>
      <span style={{ color: C.dim, fontSize: 15 }}>{label}</span>
      <span style={{ ...mono, fontSize: 16, color: color || C.cream }}>{value}</span>
    </div>
  );
}

export default function DoneScreen({ t, overtimes, onHome }) {
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  const totalOver = overtimes.reduce((s, o) => s + o, 0);
  const totalReal = TOTAL_PLANNED + totalOver;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 28, maxWidth: 440, margin: "0 auto", width: "100%" }}>
      <div style={{ ...mono, fontSize: 12, letterSpacing: 2, color: C.sage, textTransform: "uppercase" }}>{t.doneEyebrow}</div>
      <h1 style={{ fontSize: 38, fontWeight: 700, margin: "10px 0 26px" }}>{t.doneTitle}</h1>

      <div style={{ background: C.card, borderRadius: 16, padding: 22, marginBottom: 18 }}>
        <Row label={t.planned} value={fmt(TOTAL_PLANNED)} mono={mono} />
        <Row label={t.real} value={fmt(totalReal)} mono={mono} />
        <Row label={t.overruns} value={totalOver > 0 ? `+${fmt(totalOver)}` : "0:00"} color={totalOver > 0 ? C.coral : undefined} mono={mono} last />
      </div>

      {totalOver > 0 && (
        <div style={{ background: C.card, borderRadius: 16, padding: "6px 18px", marginBottom: 26 }}>
          {t.s.map((e, i) => overtimes[i] > 0 ? (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
              <span style={{ fontSize: 14, color: C.dim }}>{e.name}</span>
              <span style={{ ...mono, fontSize: 13, color: C.coral }}>+{fmt(overtimes[i])}</span>
            </div>
          ) : null)}
        </div>
      )}

      <button
        onClick={onHome}
        style={{ padding: "18px 0", borderRadius: 14, border: "none", background: C.sage, color: C.bg, fontSize: 17, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}
      >
        {t.home}
      </button>
    </div>
  );
}