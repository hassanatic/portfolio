"use client";

import { motion } from "motion/react";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Section } from "@/components/ui/Section";
import { agent } from "@/lib/data";

const channels = [
  { icon: Mail, label: "Email", value: agent.email, href: agent.links.email },
  { icon: LinkedinIcon, label: "LinkedIn", value: "in/hassan-abdullah-dev", href: agent.links.linkedin },
  { icon: GithubIcon, label: "GitHub", value: `@${agent.github}`, href: agent.links.github },
];

export function Escalate() {
  return (
    <Section
      id="escalate"
      index="05"
      label="human-in-the-loop"
      title="Escalate to a human"
      intro="The agent handles the small talk. Hiring decisions are above its pay grade, so open a channel and you'll reach the actual human. I read everything that comes through."
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.15fr]">
        <div className="hud brackets flex min-w-0 flex-col justify-between gap-8 p-6 sm:p-8">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-healthy opacity-60 [animation:pulse-ring_2.4s_ease-out_infinite] motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-healthy" />
              </span>
              <span className="label-mono !text-healthy">status: online</span>
            </div>
            <p className="text-pretty text-lg leading-relaxed text-ink">{agent.availabilityLong}.</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {agent.location} · authorized to work in Finland, no sponsorship required.
            </p>
          </div>
          <a
            href={agent.links.email}
            className="group inline-flex w-fit max-w-full items-center gap-2 rounded-sm bg-healthy px-4 py-2.5 font-mono text-sm font-medium text-canvas transition-transform hover:scale-[1.02]"
          >
            <Mail className="h-4 w-4 shrink-0" />
            <span className="min-w-0 truncate">{agent.email}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid min-w-0 grid-cols-1 content-start gap-2.5">
          {channels.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer noopener"
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="hud brackets group flex items-center gap-4 p-4 transition-colors hover:border-line-bright sm:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-line bg-surface-2 text-ink-muted transition-colors group-hover:border-data/50 group-hover:text-data">
                <c.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="label-mono">{c.label}</div>
                <div className="truncate font-mono text-sm text-ink">{c.value}</div>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-dim transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-data" />
            </motion.a>
          ))}
        </div>
      </div>
    </Section>
  );
}
