// src/components/HomeScreen.jsx
// Landing screen: language picker, session overview, and the start button.

import { C, META, TOTAL_PLANNED } from "../data/stretches";
import { fmt } from "../utils/time";

export default function HomeScreen({ lang, setLang, t, onStart }) {
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 28, maxWidth: 440, margin: "0 auto", width: "100%" }}>
      {/* Language picker */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {["fr", "it", "en"].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1, textTransform: "uppercase",
              border: `1px solid ${lang === l ? C.sage : C.line}`,
              background: lang === l ? C.sage : "transparent",
              color: lang === l ? C.bg : C.dim,
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div style={{ ...mono, fontSize: 12, letterSpacing: 2, color: C.sage, textTransform: "uppercase" }}>{t.eyebrow}</div>
      <h1 style={{ fontSize: 44, fontWeight: 700, margin: "10px 0 6px", lineHeight: 1.05 }}>{t.title}</h1>
      <div style={{ color: C.dim, fontSize: 16, marginBottom: 28 }}>
        {META.length} {t.exercises} · {fmt(TOTAL_PLANNED)} {t.plannedMin}
      </div>

      <div style={{ background: C.card, borderRadius: 16, padding: "6px 18px", marginBottom: 28 }}>
        {t.s.map((e, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < t.s.length - 1 ? `1px solid ${C.line}` : "none" }}>
            <span style={{ fontSize: 15 }}>{e.name}</span>
            <span style={{ ...mono, fontSize: 13, color: C.dim }}>{META[i].dur}s</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        style={{ padding: "20px 0", borderRadius: 14, border: "none", background: C.sage, color: C.bg, fontSize: 18, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}
      >
        {t.start}
      </button>
    </div>
  );
}