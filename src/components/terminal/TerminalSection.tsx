"use client";

import { motion } from "motion/react";
import { Terminal } from "./Terminal";

export function TerminalSection() {
  return (
    <section id="console" className="relative mx-auto w-full max-w-5xl scroll-mt-16 px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-6">
          <div className="label-mono mb-3 !text-data">// 04 · console</div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Talk to the agent</h2>
          <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-ink-muted">
            Ask me anything and I&apos;ll try to answer your questions. Go professional, go nosy, go weird. Just don&apos;t ask me to do your homework, that&apos;s a different AI.
          </p>
        </div>

        <Terminal />

        <p className="mt-4 font-mono text-[11px] text-ink-dim">
          ▸ try: &quot;what&apos;s your experience?&quot; · &quot;do you know AWS?&quot; · &quot;why should we hire you?&quot;
        </p>
      </motion.div>
    </section>
  );
}
