// src/data/stretches.js

// App color palette
export const C = {
  bg: "#14201C",
  card: "#1C2B26",
  cream: "#F4EFE6",
  dim: "#8FA39A",
  sage: "#8FB99F",
  coral: "#FF7059",
  line: "#2A3B35",
};

// Exercise metadata (language-independent)
// cat: 0 = upper body, 1 = lower body · dur: duration in seconds
export const META = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1].map((cat) => ({
  cat,
  dur: 30,
}));

// Total planned session time (sum of all durations)
export const TOTAL_PLANNED = META.reduce((s, e) => s + e.dur, 0);