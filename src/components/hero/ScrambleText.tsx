"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&_/<>{}0123456789";

/**
 * "Decoding" reveal: resolves from scrambled glyphs into the final text,
 * left to right. SSR renders the real text (no CLS, SEO-safe); the scramble
 * runs only on the client and is skipped under reduced-motion.
 */
export function ScrambleText({
  text,
  className,
  duration = 0.9,
  delay = 0,
}: {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(text);
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    let start = 0;
    const dur = duration * 1000;
    const run = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      const revealed = Math.floor(p * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") out += " ";
        else if (i < revealed) out += ch;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
      if (p < 1) raf.current = requestAnimationFrame(run);
      else setDisplay(text);
    };
    const id = window.setTimeout(() => {
      raf.current = requestAnimationFrame(run);
    }, delay * 1000);
    return () => {
      clearTimeout(id);
      cancelAnimationFrame(raf.current);
    };
  }, [text, reduced, duration, delay]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
