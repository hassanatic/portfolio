"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { agent, nav } from "@/lib/data";
import { cn } from "@/lib/cn";

function LiveClock() {
  const [now, setNow] = useState<string>("--:--:--");
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "UTC" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular text-ink-muted">
      {now}
      <span className="text-ink-dim"> UTC</span>
    </span>
  );
}

function Mark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M9 3.5L14 6.2V11.8L9 14.5L4 11.8V6.2L9 3.5Z" stroke="var(--color-healthy)" strokeWidth="1" opacity="0.5" />
      <circle cx="9" cy="9" r="2.1" fill="var(--color-healthy)" />
      <circle cx="14" cy="6.2" r="1.1" fill="var(--color-data)" />
      <circle cx="4" cy="11.8" r="1.1" fill="var(--color-data)" />
      <line x1="9" y1="9" x2="14" y2="6.2" stroke="var(--color-data)" strokeWidth="0.7" opacity="0.6" />
      <line x1="9" y1="9" x2="4" y2="11.8" stroke="var(--color-data)" strokeWidth="0.7" opacity="0.6" />
    </svg>
  );
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

const SECTION_IDS = nav.map((n) => n.id);
const NAV_LINKS = nav.filter((n) => n.id !== "boot");

export function OpsTopBar() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-9 border-b border-line bg-canvas/75 backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-4 px-3 font-mono text-[11px] sm:px-5">
        {/* brand */}
        <a href="#boot" className="flex min-w-0 items-center gap-2">
          <Mark />
          <span className="truncate text-ink">
            {agent.github}
            <span className="hidden text-ink-dim sm:inline">/control-plane</span>
          </span>
        </a>

        {/* section nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-2.5 py-1 transition-colors",
                active === n.id ? "bg-surface-2 text-ink" : "text-ink-dim hover:text-ink-muted"
              )}
            >
              <span className={cn("text-[9px]", active === n.id ? "text-healthy" : "text-ink-faint")}>{n.hint}</span>
              {n.label}
            </a>
          ))}
        </nav>

        {/* status + cta */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-healthy opacity-60 [animation:pulse-ring_2.4s_ease-out_infinite] motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-healthy" />
            </span>
            <span className="text-healthy">{agent.status}</span>
          </span>

          <span className="hidden xl:block">
            <LiveClock />
          </span>

          <a
            href="#escalate"
            className="group flex items-center gap-1 rounded-sm border border-line-bright bg-surface-2 px-2.5 py-1 text-ink transition-colors hover:border-healthy hover:text-healthy"
          >
            <span>Escalate</span>
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
