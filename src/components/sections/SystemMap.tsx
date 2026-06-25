"use client";

import { motion } from "motion/react";
import { Section } from "@/components/ui/Section";
import { skillClusters, type SkillCluster } from "@/lib/data";
import { cn } from "@/lib/cn";

const accentDot: Record<SkillCluster["accent"], string> = {
  healthy: "bg-healthy",
  data: "bg-data",
  warn: "bg-warn",
  signal: "bg-signal",
};

export function SystemMap() {
  return (
    <Section
      id="system-map"
      index="02"
      label="system map"
      title="The stack, by cluster"
      intro="Grouped the way I actually use them: languages, AI and ML, distributed systems, and the infrastructure that ties it all together."
    >
      <div className="gridlines relative rounded-sm border border-line p-2 sm:p-3">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {skillClusters.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="hud group relative overflow-hidden p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", accentDot[c.accent])} />
                  <span className="font-display text-sm font-semibold text-ink">{c.label}</span>
                </div>
                <span className="label-mono">{String(c.skills.length).padStart(2, "0")}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-sm border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-ink-muted transition-colors group-hover:border-line-bright"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className={cn("absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100", accentDot[c.accent])} />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
