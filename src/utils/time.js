// src/utils/time.js
// Small reusable helpers: time formatting and the end-of-exercise cue.

// Format a number of seconds as "M:SS" (always positive, sign handled by caller).
export function fmt(s) {
  const v = Math.abs(Math.round(s));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
}

// Short beep + vibration, played when an exercise timer reaches zero.
export function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 660;
    o.type = "sine";
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    o.start();
    o.stop(ctx.currentTime + 0.5);
  } catch (e) {}
  try {
    navigator.vibrate && navigator.vibrate(200);
  } catch (e) {}
}