// src/components/Tutorial.jsx
// First-visit guided tour: a blurred overlay with a centered card that steps
// through the app's features. Receives the steps (already translated) and
// reports when the user finishes or skips.

import { useState } from "react";
import { C } from "../data/stretches";

export default function Tutorial({ t, onClose }) {
  const steps = t.tutorial;            // array of { title, body }
  const [step, setStep] = useState(0); // current step index
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  const next = () => {
    if (isLast) onClose();
    else setStep(step + 1);
  };
  const prev = () => {
    if (!isFirst) setStep(step - 1);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(10,16,14,0.6)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: C.card, borderRadius: 20, padding: 28,
          width: "100%", maxWidth: 360,
          border: `1px solid ${C.line}`,
          fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
        }}
      >
        {/* Step counter + skip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1, color: C.sage }}>
            {step + 1} / {steps.length}
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: C.dim, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
          >
            {t.tutorialSkip}
          </button>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? C.sage : C.line,
            }} />
          ))}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 10px", color: C.cream, lineHeight: 1.15 }}>
          {steps[step].title}
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.5, color: C.dim, margin: "0 0 26px" }}>
          {steps[step].body}
        </p>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12 }}>
          {!isFirst && (
            <button
              onClick={prev}
              style={{
                flex: 1, padding: "14px 0", borderRadius: 12,
                border: `1px solid ${C.line}`, background: "transparent",
                color: C.cream, fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
              }}
            >
              {t.tutorialPrev}
            </button>
          )}
          <button
            onClick={next}
            style={{
              flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
              background: C.sage, color: C.bg, fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
            }}
          >
            {isLast ? t.tutorialDone : t.tutorialNext}
          </button>
        </div>
      </div>
    </div>
  );
}