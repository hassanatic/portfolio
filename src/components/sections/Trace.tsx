"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { spans, education, agent, type Span } from "@/lib/data";
import { cn } from "@/lib/cn";

const dotColor: Record<Span["status"], string> = {
  active: "bg-healthy",
  healthy: "bg-data",
  archived: "bg-ink-dim",
};
const kindColor: Record<Span["status"], string> = {
  active: "text-healthy",
  healthy: "text-data",
  archived: "text-ink-dim",
};

function SpanRow({ span, defaultOpen }: { span: Span; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <li className="hud brackets overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-surface-2/40 sm:gap-4 sm:p-5"
      >
        <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dotColor[span.status])} />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-5">
          <span className="label-mono shrink-0 sm:w-32">{span.period}</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="font-display text-base font-semibold text-ink sm:text-lg">{span.org}</span>
              <span className={cn("label-mono", kindColor[span.status])}>{span.kind}</span>
            </div>
            <div className="mt-0.5 text-sm text-ink-muted">{span.title}</div>
          </div>
        </div>
        <ChevronDown className={cn("mt-1 h-4 w-4 shrink-0 text-ink-dim transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-4 pb-5 pt-4 sm:px-5 sm:pl-[3.75rem]">
              <p className="text-sm leading-relaxed text-ink-muted">{span.summary}</p>
              <ul className="mt-3 space-y-1.5">
                {span.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-ink-muted">
                    <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-data" />
                    <span className="text-pretty">{h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {span.stack.map((s) => (
                  <span key={s} className="rounded-sm border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-ink-dim">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Trace() {
  return (
    <Section id="trace" index="01" label="session trace" title="The path so far" intro={agent.arc}>
      <ol className="space-y-2.5">
        {spans.map((s, i) => (
          <SpanRow key={s.id} span={s} defaultOpen={i === 0} />
        ))}
      </ol>

      <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {education.map((e) => (
          <div key={e.school} className="hud brackets p-4 sm:p-5">
            <div className="label-mono mb-2 !text-signal">education</div>
            <div className="font-display text-base font-semibold text-ink">{e.school}</div>
            <div className="mt-0.5 text-sm text-ink-muted">{e.degree}</div>
            <div className="mt-1.5 font-mono text-[11px] text-ink-dim">
              {e.period} · {e.detail}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
