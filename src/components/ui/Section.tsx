"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/** Consistent, responsive section frame with an instrument-style header. */
export function Section({
  id,
  index,
  label,
  title,
  intro,
  children,
  headerRight,
  className,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("relative mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-20 sm:px-8 sm:py-28", className)}>
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-9 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          <div className="label-mono mb-3 !text-data">
            // {index} · {label}
          </div>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
          {intro && <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-ink-muted">{intro}</p>}
        </div>
        {headerRight && <div className="shrink-0">{headerRight}</div>}
      </motion.header>
      {children}
    </section>
  );
}
