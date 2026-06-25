"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, CornerDownLeft, ExternalLink, Loader2 } from "lucide-react";
import { runCommand, commandExists, evaluatePolicy, COMMANDS, WELCOME, type OutLine, type Tone } from "./engine";
import { ask, type AgentStep } from "@/lib/agent/agent";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const TONE: Record<Tone, string> = {
  in: "text-ink",
  out: "text-ink-muted",
  muted: "text-ink-dim",
  ok: "text-healthy",
  warn: "text-warn",
  err: "text-block",
  data: "text-data",
  head: "text-ink font-semibold",
  accent: "text-signal",
};

type Entry = { input?: string; lines: OutLine[] };

const SUGGESTIONS = ["what's your AI experience?", "tell me about your agents", "why hire you?", "neofetch", "cat thesis", "rm -rf /"];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function stepLine(step: AgentStep): OutLine {
  const mark = step.kind === "reason" ? "◇" : step.kind === "tool" ? "⚙" : "▸";
  const label = step.kind === "tool" ? "tool_call" : step.kind;
  return {
    segments: [
      { text: `  ${mark} `, tone: "data" },
      { text: label.padEnd(10), tone: "muted" },
      { text: step.text, tone: step.kind === "tool" ? "data" : "muted" },
    ],
  };
}

function LineView({ line }: { line: OutLine }) {
  const base = TONE[line.tone ?? "out"];
  if (line.segments) {
    return (
      <div className="whitespace-pre-wrap break-words">
        {line.segments.map((s, i) =>
          s.href ? (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(TONE[s.tone ?? "out"], "underline decoration-dotted underline-offset-2 hover:text-data")}
            >
              {s.text}
              <ExternalLink className="ml-0.5 inline h-3 w-3 align-baseline" />
            </a>
          ) : (
            <span key={i} className={TONE[s.tone ?? "out"]}>
              {s.text}
            </span>
          )
        )}
      </div>
    );
  }
  if (line.href) {
    return (
      <a href={line.href} target="_blank" rel="noreferrer noopener" className={cn(base, "underline decoration-dotted underline-offset-2 hover:text-data")}>
        {line.text}
      </a>
    );
  }
  return <div className={cn("whitespace-pre-wrap break-words", base)}>{line.text || " "}</div>;
}

export function Terminal() {
  const reduced = usePrefersReducedMotion();
  const [entries, setEntries] = useState<Entry[]>([{ lines: WELCOME }]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const commandNames = useMemo(() => COMMANDS.map((c) => c.name.split(" ")[0]), []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  const pushToLast = (line: OutLine) =>
    setEntries((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      copy[copy.length - 1] = { ...last, lines: [...last.lines, line] };
      return copy;
    });

  async function runAgent(input: string, query: string) {
    setBusy(true);
    setEntries((prev) => [...prev, { input, lines: [] }]);
    const result = ask(query);

    for (const step of result.steps) {
      if (!reduced) await delay(230);
      pushToLast(stepLine(step));
    }
    if (!reduced) await delay(260);
    pushToLast({ tone: "muted", text: "" });
    for (const line of result.answer) {
      pushToLast(line);
      if (!reduced) await delay(45);
    }
    setBusy(false);
    inputRef.current?.focus();
  }

  async function submit(raw: string) {
    const input = raw.trim();
    if (!input || busy) return;
    setHistory((prev) => [...prev, input]);
    setHIndex(null);
    setValue("");

    // 1) governance guardrail applies to ALL input
    if (evaluatePolicy(input).blocked) {
      setEntries((prev) => [...prev, { input, lines: runCommand(input).lines }]);
      return;
    }

    // 2) explicit command
    const isAsk = input.toLowerCase().startsWith("ask ");
    if (!isAsk && commandExists(input)) {
      const r = runCommand(input);
      if (r.clear) setEntries([]);
      else setEntries((prev) => [...prev, { input, lines: r.lines }]);
      return;
    }

    // 3) natural-language → agent
    await runAgent(input, isAsk ? input.slice(4).trim() : input);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = hIndex === null ? history.length - 1 : Math.max(0, hIndex - 1);
      setHIndex(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex === null) return;
      const next = hIndex + 1;
      if (next >= history.length) {
        setHIndex(null);
        setValue("");
      } else {
        setHIndex(next);
        setValue(history[next]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const token = value.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
      if (!token) return;
      const matches = commandNames.filter((c) => c.startsWith(token));
      if (matches.length === 1) setValue(matches[0] + " ");
      else if (matches.length > 1) setEntries((prev) => [...prev, { lines: [{ tone: "muted", text: matches.join("   ") }] }]);
    } else if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
      e.preventDefault();
      setEntries([]);
    }
  }

  return (
    <div className="brackets hud overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
      {/* title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex shrink-0 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-block/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-healthy/80" />
          </span>
          <span className="ml-1 truncate font-mono text-[11px] text-ink-dim sm:ml-2">
            <span className="hidden sm:inline">operator@control-plane: </span>~/agents/hassan
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-healthy">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">pre_tool.py · </span>ARMED
        </span>
      </div>

      {/* body */}
      <div
        ref={bodyRef}
        onClick={() => inputRef.current?.focus()}
        role="log"
        aria-live="polite"
        aria-busy={busy}
        aria-label="Console output"
        className="h-[clamp(340px,54vh,560px)] overflow-y-auto bg-canvas/60 p-4 font-mono text-[13px] leading-relaxed"
      >
        {entries.map((entry, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16 }} className="mb-2">
            {entry.input !== undefined && (
              <div className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="shrink-0 text-healthy">operator@hassan</span>
                <span className="text-ink-dim">:</span>
                <span className="text-data">~</span>
                <span className="text-ink-dim">$</span>
                <span className="min-w-0 break-all text-ink">{entry.input}</span>
              </div>
            )}
            {entry.lines.map((line, j) => (
              <LineView key={j} line={line} />
            ))}
          </motion.div>
        ))}

        {/* live input row */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
          className="flex items-baseline gap-1.5"
        >
          <span className="shrink-0 text-healthy">operator@hassan</span>
          <span className="text-ink-dim">:</span>
          <span className="text-data">~</span>
          <span className="text-ink-dim">$</span>
          {busy ? (
            <span className="flex items-center gap-2 text-ink-dim">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-data motion-reduce:animate-none" />
              agent is thinking…
            </span>
          ) : (
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Console input"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-ink caret-healthy outline-none placeholder:text-ink-faint"
              placeholder="ask a question, or type a command…"
            />
          )}
        </form>
      </div>

      {/* suggestion chips */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-line bg-surface-2/60 px-3 py-2.5">
        <span className="mr-1 hidden items-center gap-1 font-mono text-[10px] text-ink-dim sm:flex">
          <CornerDownLeft className="h-3 w-3" /> try
        </span>
        {SUGGESTIONS.map((s) => {
          const danger = s.includes("rm ");
          return (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => submit(s)}
              className={cn(
                "rounded-sm border px-2 py-0.5 font-mono text-[11px] transition-colors disabled:opacity-40",
                danger
                  ? "border-block/30 text-block/80 hover:border-block hover:bg-block/10 hover:text-block"
                  : "border-line text-ink-muted hover:border-data/50 hover:text-data"
              )}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
