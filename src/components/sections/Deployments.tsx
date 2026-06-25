"use client";

import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Section } from "@/components/ui/Section";
import { projects, type Project } from "@/lib/data";
import { Sparkline } from "@/components/ui/Sparkline";
import { cn } from "@/lib/cn";

const statusMeta: Record<Project["status"], { dot: string; text: string; label: string }> = {
  live: { dot: "bg-healthy", text: "text-healthy", label: "LIVE" },
  flagship: { dot: "bg-data", text: "text-data", label: "FLAGSHIP" },
  active: { dot: "bg-healthy", text: "text-healthy", label: "ACTIVE" },
  archived: { dot: "bg-ink-dim", text: "text-ink-dim", label: "ARCHIVED" },
};

function Tile({ project, i }: { project: Project; i: number }) {
  const m = statusMeta[project.status];
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="hud brackets group relative flex flex-col overflow-hidden p-4 transition-colors hover:border-line-bright sm:p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", m.dot)} />
          <span className={cn("label-mono", m.text)}>{m.label}</span>
        </div>
        <div className={cn("h-7 w-20 opacity-70", m.text)}>
          <Sparkline seed={project.seed} className="h-full w-full" />
        </div>
      </div>

      <h3 className="font-display text-lg font-semibold leading-tight text-ink">{project.name}</h3>
      <p className="mt-1 text-sm text-data/90">{project.tagline}</p>
      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink-muted">{project.description}</p>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((s) => (
          <span key={s} className="rounded-sm border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-ink-dim">
            {s}
          </span>
        ))}
        {project.stack.length > 5 && <span className="px-1 py-0.5 font-mono text-[10px] text-ink-dim">+{project.stack.length - 5}</span>}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="min-w-0 truncate font-mono text-[11px] text-ink-dim">{project.context}</span>
        <div className="flex shrink-0 gap-2">
          {project.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-1 rounded-sm border border-line bg-surface-2 px-2 py-1 font-mono text-[11px] text-ink-muted transition-colors hover:border-data/50 hover:text-data"
            >
              {l.label.toLowerCase().includes("git") ? <GithubIcon className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function Deployments() {
  return (
    <Section
      id="deployments"
      index="03"
      label="deployments"
      title="Things I've built"
      intro="A bit of everything I've shipped: AI agents, RAG systems, distributed model serving, and full-stack apps in production. The thesis is just one of them."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Tile key={p.id} project={p} i={i} />
        ))}
      </div>
    </Section>
  );
}
