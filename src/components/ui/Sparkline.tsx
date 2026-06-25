/** Deterministic mini sparkline (seeded → SSR-safe, no hydration drift). */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Sparkline({ seed, points = 26, className }: { seed: number; points?: number; className?: string }) {
  const rng = mulberry32(seed * 9301 + 49297);
  const w = 120;
  const h = 30;
  let prev = 0.5;
  const ys: number[] = [];
  for (let i = 0; i < points; i++) {
    prev = Math.min(1, Math.max(0.06, prev + (rng() - 0.5) * 0.5));
    ys.push(prev);
  }
  const pts = ys.map((y, i) => `${((i / (points - 1)) * w).toFixed(1)},${(h - y * (h - 4) - 2).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className} aria-hidden>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
