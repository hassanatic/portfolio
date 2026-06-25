"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Eased count-up to a target. Jumps to the value under reduced-motion. */
export function Counter({
  to,
  duration = 1.2,
  delay = 0,
}: {
  to: number;
  duration?: number;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const decimals = Number.isInteger(to) ? 0 : 2;
  const [v, setV] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) {
      setV(to);
      return;
    }
    let start = 0;
    const dur = duration * 1000;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const run = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setV(to * ease(p));
      if (p < 1) raf.current = requestAnimationFrame(run);
      else setV(to);
    };
    const id = window.setTimeout(() => {
      raf.current = requestAnimationFrame(run);
    }, delay * 1000);
    return () => {
      clearTimeout(id);
      cancelAnimationFrame(raf.current);
    };
  }, [to, duration, delay, reduced]);

  return <>{v.toFixed(decimals)}</>;
}
