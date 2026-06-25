"use client";

import { useState } from "react";
import { MotionConfig } from "motion/react";
import { ScanlineOverlay } from "./ScanlineOverlay";
import { OpsTopBar } from "./OpsTopBar";
import { OpsBottomBar } from "./OpsBottomBar";
import { BootSequence } from "@/components/boot/BootSequence";
import { Companions } from "@/components/companions/Companions";
import { GroundBots } from "@/components/companions/GroundBots";

/**
 * The persistent console frame. Holds shared chrome state (scanline FX) and
 * wraps the page in the fixed top/bottom instrument bars + boot overlay.
 */
export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const [scanlines, setScanlines] = useState(true);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-12 focus:z-[200] focus:rounded-sm focus:bg-data focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-canvas"
      >
        Skip to content
      </a>

      <ScanlineOverlay enabled={scanlines} />
      <BootSequence />
      <OpsTopBar />

      <main id="main" className="relative z-10 pt-9">
        {children}
      </main>

      <OpsBottomBar
        scanlines={scanlines}
        onToggleScanlines={() => setScanlines((s) => !s)}
      />

      <Companions />
      <GroundBots />
    </MotionConfig>
  );
}
