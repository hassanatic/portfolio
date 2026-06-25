import { agent } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-20 pt-4 sm:px-8">
      <div className="hairline mb-6" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-mono text-[11px] text-ink-dim">
          <span className="text-ink-muted">agent.{agent.github}</span> · {agent.location} · {agent.availability}
        </div>
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-ink-dim">
          <a href={agent.links.github} target="_blank" rel="noreferrer noopener" className="transition-colors hover:text-data">
            github
          </a>
          <a href={agent.links.linkedin} target="_blank" rel="noreferrer noopener" className="transition-colors hover:text-data">
            linkedin
          </a>
          <a href={agent.links.email} className="transition-colors hover:text-data">
            email
          </a>
          <a href="#boot" className="transition-colors hover:text-data">
            ↑ back to top
          </a>
        </div>
      </div>
      <div className="label-mono mt-5">built with next.js · framer motion · designed as a control plane</div>
    </footer>
  );
}
