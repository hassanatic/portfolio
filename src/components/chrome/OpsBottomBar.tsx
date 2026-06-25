"use client";

import { useEffect, useState } from "react";
import { Activity, ScanLine, Gauge } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { agent } from "@/lib/data";
import { cn } from "@/lib/cn";

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

/** A small readout that drifts within a band — pure ambience, mount-gated. */
function Readout({
  icon: Icon,
  label,
  base,
  jitter,
  unit,
  className,
}: {
  icon: typeof Activity;
  label: string;
  base: number;
  jitter: number;
  unit: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const mounted = useMounted();
  const [v, setV] = useState(base);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setV(base + Math.round((Math.random() - 0.5) * 2 * jitter)),
      1600
    );
    return () => clearInterval(id);
  }, [base, jitter, reduced]);

  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <Icon className="h-3 w-3 text-ink-dim" />
      <span className="label-mono">{label}</span>
      <span className="tabular text-ink-muted">
        {mounted ? v : base}
        {unit}
      </span>
    </span>
  );
}

export function OpsBottomBar({
  scanlines,
  onToggleScanlines,
}: {
  scanlines: boolean;
  onToggleScanlines: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const mounted = useMounted();
  const [trace, setTrace] = useState("········");

  useEffect(() => {
    const hex = Math.floor(Math.random() * 0xffffffff)
      .toString(16)
      .padStart(8, "0")
      .toUpperCase();
    setTrace(hex);
  }, []);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 h-8 border-t border-line bg-canvas/75 backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-4 px-3 font-mono text-[11px] sm:px-5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5" title="Session trace id — decorative, part of the observability theme">
            <span className="label-mono">trace</span>
            <span className="tabular text-data">0x{trace}</span>
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="label-mono">region</span>
            <span className="text-ink-muted">{agent.region}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Readout icon={Gauge} label="lat" base={12} jitter={4} unit="ms" className="hidden sm:flex" />
          <Readout icon={Activity} label="evt/s" base={48} jitter={9} unit="" className="hidden md:flex" />

          <span className="hidden items-center gap-1.5 lg:flex">
            <span className="label-mono">motion</span>
            <span className={cn("tabular", reduced ? "text-warn" : "text-healthy")}>
              {mounted ? (reduced ? "REDUCED" : "FULL") : "··"}
            </span>
          </span>

          <button
            type="button"
            onClick={onToggleScanlines}
            aria-pressed={scanlines}
            title="Toggle the retro CRT scanline effect"
            className={cn(
              "flex items-center gap-1.5 rounded-sm border px-2 py-0.5 transition-colors",
              scanlines
                ? "border-line-bright text-ink-muted hover:text-ink"
                : "border-line text-ink-dim hover:text-ink-muted"
            )}
          >
            <ScanLine className="h-3 w-3" />
            <span className="label-mono">crt</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
