"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Cinematic CRT overlay: scanlines + vignette + (motion-safe) flicker.
 * Fixed, pointer-events-none, sits above everything. Toggleable; respects
 * prefers-reduced-motion (no flicker).
 */
export function ScanlineOverlay({ enabled }: { enabled: boolean }) {
  const reduced = usePrefersReducedMotion();
  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[60]",
        !reduced && "animate-flicker"
      )}
    >
      <div className="scanlines absolute inset-0" />
      {/* corner vignette to deepen the cinematic frame */}
      <div className="absolute inset-0 [background:radial-gradient(120%_100%_at_50%_50%,transparent_62%,rgba(2,6,23,0.55))]" />
    </div>
  );
}
