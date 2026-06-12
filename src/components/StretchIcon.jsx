// src/components/StretchIcon.jsx
// A simple line pictogram for each stretch, drawn as inline SVG.
// The `id` prop is the exercise index (0–11), matching META / T.s order.

import { C } from "../data/stretches";

export default function StretchIcon({ id, size = 84 }) {
  const p = {
    fill: "none",
    stroke: C.sage,
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const head = (cx, cy, r = 5) => <circle cx={cx} cy={cy} r={r} {...p} />;

  const icons = [
    // 1 Arm swings
    <g key="0">{head(32, 11)}<path d="M32 16 V40 M32 40 L24 56 M32 40 L40 56 M32 24 L14 19 M32 24 L50 19" {...p} /><path d="M10 26 Q14 30 19 28 M54 26 Q50 30 45 28" {...p} strokeDasharray="2 3" /></g>,
    // 2 Shoulder shrugs
    <g key="1">{head(32, 12)}<path d="M22 23 H42 M32 23 V42 M32 42 L25 56 M32 42 L39 56" {...p} /><path d="M17 19 L20 15 L23 19 M41 19 L44 15 L47 19" {...p} /></g>,
    // 3 Arms straight out
    <g key="2">{head(22, 12)}<path d="M22 17 V42 M22 42 L17 56 M22 42 L28 56 M22 24 H50" {...p} /><path d="M44 19 L49 24 L44 29" {...p} strokeDasharray="2 3" /></g>,
    // 4 Hands linked overhead
    <g key="3">{head(32, 18)}<path d="M32 23 V44 M32 44 L25 58 M32 44 L39 58 M28 25 L32 6 M36 25 L32 6" {...p} /></g>,
    // 5 Resisted neck rotation
    <g key="4"><circle cx={32} cy={26} r={10} {...p} /><path d="M18 46 H46 M50 32 L42 28 M50 32 L52 40" {...p} /><path d="M22 12 Q32 4 42 12" {...p} strokeDasharray="2 3" /><path d="M42 12 L42 8 M42 12 L38 12" {...p} strokeDasharray="2 3" /></g>,
    // 6 Hands behind your back
    <g key="5">{head(32, 11)}<path d="M32 16 V42 M32 42 L25 57 M32 42 L39 57 M26 21 Q20 28 30 33 M38 21 Q44 28 34 33" {...p} /></g>,
    // 7 Cat stretch
    <g key="6">{head(12, 35, 4)}<path d="M15 39 Q32 22 50 40 M15 40 V53 M50 40 V53" {...p} /></g>,
    // 8 Sphinx
    <g key="7">{head(19, 28)}<path d="M22 33 L34 45 L55 49 M24 37 V50 M10 52 H56" {...p} /></g>,
    // 9 Child's pose
    <g key="8">{head(24, 42, 4)}<path d="M55 51 L44 51 L43 42 Q36 36 27 45 L11 50" {...p} /><path d="M8 56 H58" {...p} opacity="0.4" /></g>,
    // 10 Knee to chest
    <g key="9">{head(10, 43, 4)}<path d="M14 47 L36 47 L56 47 M36 47 L31 35 L23 41" {...p} /><path d="M6 54 H58" {...p} opacity="0.4" /></g>,
    // 11 Knee to opposite shoulder
    <g key="10">{head(10, 43, 4)}<path d="M14 47 L38 47 M38 47 L28 35 L16 39" {...p} /><path d="M6 54 H58" {...p} opacity="0.4" /></g>,
    // 12 Lying twist
    <g key="11">{head(10, 43, 4)}<path d="M14 46 L34 46 M34 46 L42 34 L52 44" {...p} /><path d="M44 28 Q50 24 54 30" {...p} strokeDasharray="2 3" /><path d="M6 54 H58" {...p} opacity="0.4" /></g>,
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block", margin: "0 auto" }}>
      {icons[id]}
    </svg>
  );
}