"use client";

import { motion } from "motion/react";
import { kpis, type Kpi } from "@/lib/data";
import { Counter } from "./Counter";
import { cn } from "@/lib/cn";

const accentText: Record<Kpi["accent"], string> = {
  healthy: "text-healthy",
  data: "text-data",
  warn: "text-warn",
  signal: "text-signal",
};
const accentBar: Record<Kpi["accent"], string> = {
  healthy: "bg-healthy",
  data: "bg-data",
  warn: "bg-warn",
  signal: "bg-signal",
};

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const tile = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function KpiGrid() {
  return (
    <motion.div
      variants={grid}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
    >
      {kpis.map((k, i) => (
        <motion.div
          key={k.label}
          variants={tile}
          className="brackets hud group relative overflow-hidden px-3.5 py-3 transition-colors hover:border-line-bright"
        >
          <div className="label-mono mb-2 truncate">{k.label}</div>
          <div className="font-display text-3xl font-semibold leading-none tracking-tight text-ink sm:text-4xl">
            <span className="tabular">
              <Counter to={k.to ?? 0} delay={0.2 + i * 0.08} />
            </span>
            {k.suffix && <span className={cn("ml-0.5 text-2xl", accentText[k.accent])}>{k.suffix}</span>}
          </div>
          <div className="mt-2 text-[11px] leading-snug text-ink-dim">{k.detail}</div>

          {/* animated accent baseline */}
          <motion.div
            className={cn("absolute bottom-0 left-0 h-0.5", accentBar[k.accent])}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.7, delay: 0.35 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
