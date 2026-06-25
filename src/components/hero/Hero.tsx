"use client";

import { motion } from "motion/react";
import { ChevronDown, Sparkles } from "lucide-react";
import { NodeField } from "./NodeField";
import { ScrambleText } from "./ScrambleText";
import { StatusLine } from "./StatusLine";
import { KpiGrid } from "./KpiGrid";
import { agent } from "@/lib/data";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

function Corner({ className, pos }: { className: string; pos: "tl" | "tr" | "bl" | "br" }) {
  const borders = { tl: "border-l border-t", tr: "border-r border-t", bl: "border-l border-b", br: "border-r border-b" }[pos];
  return <span aria-hidden className={`pointer-events-none absolute hidden h-5 w-5 border-line-bright sm:block ${borders} ${className}`} />;
}

export function Hero() {
  return (
    <section id="boot" className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <NodeField className="h-full w-full" />
      </div>
      {/* focal vignette keeps text legible over the field */}
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(58%_55%_at_36%_46%,rgba(2,6,23,0.82),transparent_72%)]" />

      <Corner className="left-4 top-14" pos="tl" />
      <Corner className="right-4 top-14" pos="tr" />
      <Corner className="bottom-12 left-4" pos="bl" />
      <Corner className="bottom-12 right-4" pos="br" />

      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl">
          {/* eyebrow */}
          <motion.div variants={item} className="mb-5 flex flex-wrap items-center gap-3">
            <span className="label-mono !text-healthy">// agent manifest</span>
            <span className="hidden h-px w-10 bg-line-bright sm:block" />
            <span className="label-mono">{agent.role}</span>
          </motion.div>

          {/* name */}
          <motion.h1 variants={item} className="font-display text-[clamp(2.6rem,9vw,7rem)] font-semibold leading-[0.92] tracking-tight">
            <ScrambleText
              text={agent.name}
              className="bg-gradient-to-br from-white via-ink to-ink-muted bg-clip-text text-transparent"
              delay={0.35}
              duration={1}
            />
          </motion.h1>

          {/* positioning line */}
          <motion.div variants={item} className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-data sm:text-base">
            {agent.disciplines.map((d, i) => (
              <span key={d} className="flex items-center gap-2">
                {i > 0 && <span className="text-ink-faint">/</span>}
                <span>{d}</span>
              </span>
            ))}
          </motion.div>

          {/* summary */}
          <motion.p variants={item} className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
            {agent.summary}
          </motion.p>

          {/* focus chips */}
          <motion.div variants={item} className="mt-6 flex flex-wrap gap-1.5">
            {agent.focus.map((f) => (
              <span key={f} className="flex items-center gap-1.5 rounded-sm border border-line bg-surface/60 px-2.5 py-1 font-mono text-[11px] text-ink-muted">
                <span className="text-healthy">◆</span>
                {f}
              </span>
            ))}
          </motion.div>

          {/* live status */}
          <motion.div variants={item} className="mt-8">
            <StatusLine />
          </motion.div>

          {/* kpis */}
          <motion.div variants={item} className="mt-10">
            <KpiGrid />
          </motion.div>

          {/* scroll → talk to the agent */}
          <motion.a
            variants={item}
            href="#console"
            className="group mt-12 inline-flex items-center gap-2 rounded-sm border border-line bg-surface/50 px-3.5 py-2 font-mono text-xs text-ink-muted transition-colors hover:border-data/50 hover:text-data"
          >
            <Sparkles className="h-3.5 w-3.5 text-data" />
            <span>talk to the agent, ask it anything</span>
            <ChevronDown className="h-3.5 w-3.5 animate-bounce motion-reduce:animate-none" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
