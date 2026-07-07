"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/* Two little agent-drones that roam the page and cause delight. On-theme (the
   whole site is about agents), pointer-events safe, lg+ only, and fully off
   under prefers-reduced-motion. */

const RANDOM_LINES = [
  "scanning visitor… seems trustworthy",
  "psst, he's available, you know",
  "I do 200 backflips a day, ask me",
  "beep boop (that means hi)",
  "do NOT type rm -rf /, trust me",
  "I'm not procrastinating, I'm idling",
  "unit online, all systems nominal",
  "ooh, you scrolled. fancy.",
  "go ask the terminal something weird",
  "I just keep the nodes company",
  "I've seen the git history. it's solid in there.",
  "I've read his whole CV. twice.",
  "10/10 would orchestrate again",
  "I'm basically the mascot here",
];

const CLICK_LINES = ["ow.", "hey, watch the paint", "boop received", "I felt that", "do that again", "wheee", "I'm telling Hassan"];

const GAG_LINES = ["whoa", "wheee", "show-off mode", "look ma, no hands", "still got it"];

const SECTION_LINES: Record<string, string> = {
  trace: "ooh, the origin story",
  "system-map": "so many skills, my circuits",
  deployments: "he actually shipped these",
  console: "go on, talk to the terminal",
  escalate: "this is where the actual human replies",
};

const TABS = ["Metosin", "Univ. of Oulu", "ACE"];

const randOf = (a: string[]) => a[Math.floor(Math.random() * a.length)];

function Bot({
  side,
  accent,
  speech,
  tabs,
  gag,
  onBoop,
}: {
  side: "left" | "right";
  accent: string;
  speech: string | null;
  tabs: string[] | null;
  gag: number;
  onBoop: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const px = useSpring(0, { stiffness: 130, damping: 13 });
  const py = useSpring(0, { stiffness: 130, damping: 13 });
  const [blink, setBlink] = useState(false);
  const [rot, setRot] = useState(0);

  // pupils track the cursor
  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.42;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const len = Math.hypot(dx, dy) || 1;
        const m = Math.min(1, len / 240);
        px.set((dx / len) * 3.4 * m);
        py.set((dy / len) * 2.6 * m);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [px, py]);

  // blink on an irregular timer
  useEffect(() => {
    let t: number;
    const loop = () => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 130);
      t = window.setTimeout(loop, 2600 + Math.random() * 3000);
    };
    t = window.setTimeout(loop, 1500 + Math.random() * 2000);
    return () => clearTimeout(t);
  }, []);

  // a gag (a quick flip) when the orchestrator nudges us
  useEffect(() => {
    if (gag > 0) setRot((r) => r + 1);
  }, [gag]);

  return (
    <motion.div
      ref={wrapRef}
      className={cn("pointer-events-auto absolute bottom-14 cursor-pointer select-none", side === "left" ? "left-5" : "right-5")}
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: side === "left" ? 0 : 0.9 }}
      onClick={() => {
        setRot((r) => r + 1);
        onBoop();
      }}
      whileHover={{ scale: 1.08 }}
    >
      {/* speech bubble */}
      <AnimatePresence>
        {speech && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute bottom-[70px] w-max max-w-[210px] rounded-md border border-line-bright bg-surface-2 px-2.5 py-1.5 font-mono text-[11px] leading-snug text-ink shadow-[0_12px_34px_-8px_rgba(0,0,0,0.9)]",
              side === "left" ? "left-0" : "right-0"
            )}
          >
            {speech}
            <span className={cn("absolute -bottom-1 h-2 w-2 rotate-45 border-b border-r border-line-bright bg-surface-2", side === "left" ? "left-6" : "right-6")} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* "tabs open up" gag at the experience section */}
      <AnimatePresence>
        {tabs && (
          <div className={cn("absolute bottom-[64px] flex flex-col gap-1", side === "left" ? "left-[50px]" : "right-[50px]")}>
            {tabs.map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: side === "left" ? -10 : 10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.11, duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-1 rounded-sm border border-line-bright bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.9)]"
              >
                <span style={{ color: accent }}>▸</span>
                {t}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* the drone */}
      <motion.div animate={{ rotate: rot * 360 }} transition={{ type: "spring", stiffness: 190, damping: 11 }}>
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="55" rx="13" ry="3.5" fill={accent} opacity="0.22" />
          <line x1="32" y1="14" x2="32" y2="6" stroke={accent} strokeWidth="1.6" />
          <motion.circle cx="32" cy="5" r="2.4" fill={accent} animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
          <rect x="9" y="25" width="5" height="11" rx="2" fill="#0b1426" stroke={accent} strokeWidth="1" />
          <rect x="50" y="25" width="5" height="11" rx="2" fill="#0b1426" stroke={accent} strokeWidth="1" />
          <rect x="14" y="14" width="36" height="30" rx="13" fill="#0b1426" stroke={accent} strokeWidth="1.6" />
          <ellipse cx="32" cy="28" rx="13" ry="10" fill="#04070f" stroke="#1f2b40" strokeWidth="1" />
          <motion.g style={{ x: px, y: py }}>
            <circle cx="32" cy="28" r="4.6" fill={accent} />
            <circle cx="33.6" cy="26.4" r="1.5" fill="#ffffff" opacity="0.85" />
          </motion.g>
          {blink && <rect x="18" y="22" width="28" height="13" rx="6" fill="#0b1426" />}
          <rect x="26" y="40" width="12" height="2" rx="1" fill={accent} opacity="0.45" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export function Companions() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [speechA, setSpeechA] = useState<string | null>(null);
  const [speechB, setSpeechB] = useState<string | null>(null);
  const [tabsOpen, setTabsOpen] = useState(false);
  const [gagA, setGagA] = useState(0);
  const [gagB, setGagB] = useState(0);
  const timers = useRef<number[]>([]);

  const say = useCallback((who: "A" | "B", text: string, dur = 4500) => {
    const set = who === "A" ? setSpeechA : setSpeechB;
    set(text);
    timers.current.push(window.setTimeout(() => set(null), dur));
  }, []);

  useEffect(() => {
    const check = () => setEnabled(window.innerWidth >= 1024 && !reduced);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const push = (t: number) => timers.current.push(t);

    // idle chatter
    const chatter = () => {
      say(Math.random() > 0.5 ? "A" : "B", randOf(RANDOM_LINES));
      push(window.setTimeout(chatter, 10000 + Math.random() * 9000));
    };
    push(window.setTimeout(chatter, 5000));

    // occasional flip gag
    const gag = () => {
      if (Math.random() > 0.5) setGagA((g) => g + 1);
      else setGagB((g) => g + 1);
      say(Math.random() > 0.5 ? "A" : "B", randOf(GAG_LINES), 2200);
      push(window.setTimeout(gag, 11000 + Math.random() * 9000));
    };
    push(window.setTimeout(gag, 9000));

    // section reactions
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const line = SECTION_LINES[e.target.id];
          if (!line) continue;
          if (e.target.id === "trace") {
            // Pop the tabs only (no overlapping bubble), so nothing hides behind a tab.
            setTabsOpen(true);
            push(window.setTimeout(() => setTabsOpen(false), 3600));
          } else {
            say("B", line);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    ["trace", "system-map", "deployments", "console", "escalate"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => {
      obs.disconnect();
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [enabled, say]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <Bot side="left" accent="#22c55e" speech={speechA} tabs={tabsOpen ? TABS : null} gag={gagA} onBoop={() => say("A", randOf(CLICK_LINES))} />
      <Bot side="right" accent="#22d3ee" speech={speechB} tabs={null} gag={gagB} onBoop={() => say("B", randOf(CLICK_LINES))} />
    </div>
  );
}
