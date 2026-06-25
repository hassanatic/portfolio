"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* Two little creatures that roam the page with spring-physics movement (so they
   accelerate, coast and settle instead of gliding robotically). They're aware
   of your content: cards and headings are walls — they patrol the gaps and
   margins, bonk into a card and shake it off, and scramble aside when content
   scrolls into them. They chase, brawl with a rod, plant bombs, breathe fire,
   hide at the edges to peek at you, and open portals to teleport and ambush
   each other. lg+ only, off under reduced-motion, never blocks a click. */

const TAUNTS = ["lol nice cursor", "you've been here a while", "10 credits says you won't hire him", "we see you", "stop reading, start hiring", "psst, scroll down"];
const FIGHT_WORDS = ["BONK", "WHACK", "BOP", "POW", "KAPOW"];
const FLEE = ["aaah!", "not the rod!", "help!", "wait wait", "noooo"];
const CHASE = ["get back here!", "come hereee", "grrr", "you're toast", "i'll get you"];
const LAUGH = ["HA!", "lmao", "hehe", "worth it"];
const COOL = ["ok ok truce", "rematch later", "ow.", "that hurt"];
const PEEK = ["psst", "i'm watching you", "shh", "boo", "still here"];
const BUMP = ["oof", "ow!", "hey!", "watch it", "rude", "ouch", "who put that there"];
const PORTAL_OPEN = ["miss me?", "peekaboo", "surprise!", "boo!", "guess who"];
const PORTAL_REACT = ["AH!", "what the", "how—", "not again", "gah!"];

type View = { say: string | null; prop: "rod" | "bomb" | "fire" | null; mood: "angry" | null; dazed: boolean; hidden: boolean };
const EMPTY: View = { say: null, prop: null, mood: null, dazed: false, hidden: false };

type Bot = {
  key: "A" | "B";
  x: number; y: number; tx: number; ty: number; vx: number; vy: number;
  face: 1 | -1; moving: boolean; maxV: number; accel: number; shakeUntil: number; bumpCd: number;
};
type Rect = { l: number; t: number; r: number; b: number };

const rand = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const nowMs = () => performance.now();

function Char() {
  return (
    <div className="gb-flip">
      <div className="gb-char">
        <span className="gb-arm gb-arm-a" />
        <span className="gb-arm gb-arm-b" />
        <span className="gb-leg gb-leg-a" />
        <span className="gb-leg gb-leg-b" />
        <span className="gb-body" />
        <span className="gb-head">
          <span className="gb-eye" />
        </span>
      </div>
    </div>
  );
}

function BotView({ botRef, accent, view }: { botRef: React.RefObject<HTMLDivElement | null>; accent: string; view: View }) {
  return (
    <div ref={botRef} className="absolute left-0 top-0 w-8 will-change-transform" style={{ "--gb": accent } as React.CSSProperties}>
      <div className="relative h-[42px] w-8">
        {view.say && (
          <div className="absolute bottom-full left-1/2 mb-2 w-max max-w-[160px] -translate-x-1/2 rounded-md border border-line-bright bg-surface-2 px-2 py-1 text-center font-mono text-[10px] leading-snug text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,0.9)]">
            {view.say}
            <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border-b border-r border-line-bright bg-surface-2" />
          </div>
        )}
        <div style={{ opacity: view.hidden ? 0 : 1, transition: "opacity 0.12s" }}>
          {view.prop === "rod" && <span className="cb-rod" style={{ background: accent }} />}
          {view.prop === "bomb" && <span className="cb-bomb" />}
          {view.prop === "fire" && <span className="cb-fire" />}
          {view.mood === "angry" && <span className="cb-anger">!</span>}
          {view.dazed && (
            <span className="cb-stars">
              <span className="cb-star" style={{ transform: "rotate(0deg) translateX(9px) rotate(45deg)" }} />
              <span className="cb-star" style={{ transform: "rotate(120deg) translateX(9px) rotate(45deg)" }} />
              <span className="cb-star" style={{ transform: "rotate(240deg) translateX(9px) rotate(45deg)" }} />
            </span>
          )}
          <Char />
        </div>
      </div>
    </div>
  );
}

export function GroundBots() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const aEl = useRef<HTMLDivElement>(null);
  const bEl = useRef<HTMLDivElement>(null);
  const [va, setVa] = useState<View>(EMPTY);
  const [vb, setVb] = useState<View>(EMPTY);
  const [boom, setBoom] = useState<{ x: number; y: number; word: string; big: boolean; n: number } | null>(null);
  const [portals, setPortals] = useState<{ a: { x: number; y: number } | null; b: { x: number; y: number } | null }>({ a: null, b: null });

  useEffect(() => {
    const check = () => setEnabled(window.innerWidth >= 360 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const elA = aEl.current;
    const elB = bEl.current;
    if (!elA || !elB) return;
    const flipA = elA.querySelector(".gb-flip") as HTMLElement | null;
    const flipB = elB.querySelector(".gb-flip") as HTMLElement | null;
    if (!flipA || !flipB) return;

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    let scrollFrac = 0;
    let obstacles: Rect[] = [];
    let raf = 0;
    let last = nowMs();
    let roaming = false;
    let boomN = 0;
    let mode: "free" | "chase" = "free";
    const timers: number[] = [];
    const intervals: number[] = [];

    const A: Bot = { key: "A", x: W() * 0.3, y: 200, tx: 0, ty: 0, vx: 0, vy: 0, face: 1, moving: false, maxV: 4.4, accel: 0.05, shakeUntil: 0, bumpCd: 0 };
    const B: Bot = { key: "B", x: W() * 0.6, y: 280, tx: 0, ty: 0, vx: 0, vy: 0, face: -1, moving: false, maxV: 4.4, accel: 0.05, shakeUntil: 0, bumpCd: 0 };
    const botOf = (w: Bot) => w;

    const band = () => Math.max(120, Math.min(H() - 150, H() * (0.16 + scrollFrac * 0.6)));
    const setView = (key: "A" | "B", p: Partial<View>) => (key === "A" ? setVa : setVb)((v) => ({ ...v, ...p }));
    const gap = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const sayWho = (bot: Bot, text: string, dur = 2200) => {
      setView(bot.key, { say: text });
      gap(dur, () => setView(bot.key, { say: null }));
    };
    const roles = () => (Math.random() < 0.5 ? [A, B] : [B, A]);

    const updateObstacles = () => {
      const pad = 22;
      const vh = H();
      const next: Rect[] = [];
      document.querySelectorAll(".hud, h1, h2").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 24 || r.height < 16 || r.bottom < -40 || r.top > vh + 40) return;
        next.push({ l: r.left - pad, t: r.top - pad, r: r.right + pad, b: r.bottom + pad });
      });
      obstacles = next;
    };
    updateObstacles();
    let obsTimer = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - H();
      scrollFrac = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      clearTimeout(obsTimer);
      obsTimer = window.setTimeout(updateObstacles, 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateObstacles);
    onScroll();

    const bump = (w: Bot) => {
      const t = nowMs();
      w.shakeUntil = t + 430;
      if (t < w.bumpCd) return;
      w.bumpCd = t + 900;
      if (Math.random() < 0.6) sayWho(botOf(w), rand(BUMP), 1200);
      if (mode === "free") {
        w.tx = openX();
        w.ty = band() + (Math.random() - 0.5) * 130;
      }
    };

    const resolve = (w: Bot) => {
      for (const o of obstacles) {
        if (w.x > o.l && w.x < o.r && w.y > o.t && w.y < o.b) {
          const dl = w.x - o.l;
          const dr = o.r - w.x;
          const dt = w.y - o.t;
          const db = o.b - w.y;
          const m = Math.min(dl, dr, dt, db);
          if (m === dl) { w.x = o.l; w.vx = -Math.abs(w.vx) * 0.4; }
          else if (m === dr) { w.x = o.r; w.vx = Math.abs(w.vx) * 0.4; }
          else if (m === dt) { w.y = o.t; w.vy = -Math.abs(w.vy) * 0.4; }
          else { w.y = o.b; w.vy = Math.abs(w.vy) * 0.4; }
          bump(w);
        }
      }
    };

    const move = (w: Bot, k: number) => {
      w.vx += (w.tx - w.x) * w.accel * k;
      w.vy += (w.ty - w.y) * w.accel * k;
      const damp = Math.pow(0.8, k);
      w.vx *= damp;
      w.vy *= damp;
      const sp = Math.hypot(w.vx, w.vy);
      // slower on small screens (same px/frame crosses a narrow phone much faster)
      const cap = w.maxV * Math.max(0.5, Math.min(1, window.innerWidth / 1280));
      if (sp > cap) {
        w.vx *= cap / sp;
        w.vy *= cap / sp;
      }
      w.x += w.vx * k;
      w.y += w.vy * k;
      w.moving = sp > 0.25;
      if (Math.abs(w.vx) > 0.2) w.face = w.vx < 0 ? -1 : 1;
      const ww = W();
      if (w.x > ww + 50) { w.x -= ww + 100; w.tx -= ww + 100; }
      else if (w.x < -50) { w.x += ww + 100; w.tx += ww + 100; }
      resolve(w);
    };

    const place = (el: HTMLElement, flip: HTMLElement, w: Bot, t: number) => {
      // w.x/w.y are the bot's CENTER; offset the element so its centre lands there.
      const s = window.innerWidth < 640 ? 1 : 1.3;
      el.style.transform = `translate3d(${w.x - 16}px, ${w.y - 21}px, 0) scale(${s})`;
      flip.style.transform = `scaleX(${w.face})`;
      el.classList.toggle("gb-walk", w.moving);
      el.classList.toggle("gb-shake", t < w.shakeUntil);
    };

    // ---- scenes -------------------------------------------------------------
    // Prefer the margins beside the centred content column, so they "walk by the sides".
    const openX = () => {
      const colW = Math.min(1152, W() - 48);
      const cl = (W() - colW) / 2;
      const cr = cl + colW;
      if (cl > 50 && Math.random() < 0.62) {
        return Math.random() < 0.5 ? 24 + Math.random() * Math.max(8, cl - 34) : cr + 10 + Math.random() * Math.max(8, W() - cr - 34);
      }
      return 60 + Math.random() * (W() - 120);
    };
    const setRoamTargets = () => {
      A.maxV = B.maxV = 4.2;
      A.tx = openX();
      A.ty = band() + (Math.random() - 0.5) * 130;
      B.tx = openX();
      B.ty = band() + (Math.random() - 0.5) * 130;
    };
    const roamTick = () => {
      if (!roaming) return;
      setRoamTargets();
      if (Math.random() < 0.4) sayWho(rand([A, B]), rand(TAUNTS));
      gap(2400 + Math.random() * 1300, roamTick);
    };
    const startRoam = (dur: number, then: () => void) => {
      roaming = true;
      mode = "free";
      setView("A", EMPTY);
      setView("B", EMPTY);
      roamTick();
      gap(dur, () => {
        roaming = false;
        then();
      });
    };

    const chase = (chaser: Bot, fleer: Bot, dur: number, then: () => void) => {
      mode = "chase";
      fleer.maxV = 6.4;
      chaser.maxV = 5.9;
      let dir = Math.random() < 0.5 ? 1 : -1;
      sayWho(fleer, rand(FLEE));
      sayWho(chaser, rand(CHASE));
      const id = window.setInterval(() => {
        fleer.tx = fleer.x + dir * 520;
        fleer.ty = band() + (Math.random() - 0.5) * 50;
        chaser.tx = fleer.x - dir * 24;
        chaser.ty = fleer.y;
        if (Math.random() < 0.04) dir *= -1;
      }, 90);
      intervals.push(id);
      gap(dur, () => {
        clearInterval(id);
        mode = "free";
        A.maxV = B.maxV = 4.2;
        then();
      });
    };

    const attack = (att: Bot, vic: Bot, prop: "rod" | "fire", word: string, then: () => void) => {
      mode = "chase";
      att.maxV = 5.2;
      vic.maxV = 2;
      vic.tx = vic.x;
      vic.ty = vic.y;
      att.tx = vic.x;
      att.ty = vic.y;
      gap(1250, () => {
        setView(att.key, { prop });
        setBoom({ x: vic.x + 8, y: vic.y + 6, word, big: false, n: ++boomN });
        setView(vic.key, { mood: "angry" });
        sayWho(att, rand(LAUGH), 1400);
        gap(750, () => {
          setView(att.key, { prop: null });
          setBoom(null);
          chase(vic, att, 3600, () => {
            setView(vic.key, { mood: null });
            sayWho(rand([att, vic]), rand(COOL), 1800);
            then();
          });
        });
      });
    };

    const bomb = (att: Bot, vic: Bot, then: () => void) => {
      mode = "chase";
      att.maxV = 5.4;
      vic.tx = vic.x;
      vic.ty = vic.y;
      att.tx = vic.x;
      att.ty = vic.y;
      gap(1250, () => {
        setView(vic.key, { prop: "bomb" });
        sayWho(att, rand(["tick tick…", "heh", "oops", "for you"]), 1400);
        att.maxV = 6.4;
        att.tx = att.x + (Math.random() < 0.5 ? 1 : -1) * 380;
        gap(1500, () => {
          setView(vic.key, { prop: null, dazed: true });
          setBoom({ x: vic.x + 8, y: vic.y + 6, word: "BOOM", big: true, n: ++boomN });
          sayWho(att, rand(["HA!", "lmao", "bye"]), 1600);
          gap(700, () => setBoom(null));
          gap(2100, () => setView(vic.key, { dazed: false }));
          gap(1000, () => { mode = "free"; then(); });
        });
      });
    };

    const portal = (prankster: Bot, target: Bot, then: () => void) => {
      mode = "chase";
      prankster.maxV = 0.5;
      prankster.tx = prankster.x;
      prankster.ty = prankster.y;
      setPortals({ a: { x: prankster.x, y: prankster.y + 4 }, b: null });
      gap(480, () => {
        const ex = target.x > W() / 2 ? target.x - 52 : target.x + 52;
        setPortals({ a: { x: prankster.x, y: prankster.y + 4 }, b: { x: ex, y: target.y + 4 } });
        setView(prankster.key, { hidden: true });
        gap(260, () => {
          prankster.x = ex;
          prankster.y = target.y;
          prankster.vx = prankster.vy = 0;
          prankster.tx = ex;
          prankster.ty = target.y;
          setView(prankster.key, { hidden: false });
          sayWho(prankster, rand(PORTAL_OPEN), 1500);
          setView(target.key, { mood: "angry" });
          sayWho(target, rand(PORTAL_REACT), 1500);
          setBoom({ x: target.x, y: target.y - 4, word: "BOO!", big: false, n: ++boomN });
          gap(650, () => { setPortals({ a: null, b: null }); setBoom(null); });
          gap(1200, () => { setView(target.key, { mood: null }); mode = "free"; then(); });
        });
      });
    };

    const peek = (then: () => void) => {
      A.maxV = B.maxV = 5.5;
      A.tx = -8;
      A.ty = band();
      B.tx = W() - 22;
      B.ty = band();
      gap(1500, () => {
        A.face = 1;
        B.face = -1;
        sayWho(A, rand(PEEK));
        sayWho(B, rand(PEEK));
        gap(2300, then);
      });
    };

    const nextScene = () => {
      startRoam(5000 + Math.random() * 4000, () => {
        const [x, y] = roles();
        const r = Math.random();
        if (r < 0.26) chase(x, y, 4000, nextScene);
        else if (r < 0.44) attack(x, y, "rod", rand(FIGHT_WORDS), nextScene);
        else if (r < 0.6) bomb(x, y, nextScene);
        else if (r < 0.74) attack(x, y, "fire", "FWOOSH", nextScene);
        else if (r < 0.9) portal(x, y, nextScene);
        else peek(nextScene);
      });
    };

    A.tx = A.x;
    A.ty = band();
    A.y = A.ty;
    B.tx = B.x;
    B.ty = band();
    B.y = B.ty;
    nextScene();

    const loop = () => {
      const t = nowMs();
      const k = Math.min(2.6, (t - last) / 16);
      last = t;
      move(A, k);
      move(B, k);
      place(elA, flipA, A, t);
      place(elB, flipB, B, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { last = nowMs(); raf = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateObstacles);
      clearTimeout(obsTimer);
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {portals.a && (
        <div className="cb-portal" style={{ left: portals.a.x, top: portals.a.y }} />
      )}
      {portals.b && (
        <div className="cb-portal" style={{ left: portals.b.x, top: portals.b.y }} />
      )}
      <BotView botRef={aEl} accent="#22c55e" view={va} />
      <BotView botRef={bEl} accent="#f59e0b" view={vb} />
      {boom && (
        <div className="absolute left-0 top-0" style={{ transform: `translate3d(${boom.x}px, ${boom.y}px, 0)` }}>
          <div className="-translate-x-1/2 -translate-y-1/2">
            <span key={boom.n} className={boom.big ? "cb-boom-big inline-block text-[22px]" : "cb-boom inline-block text-[16px]"} style={{ color: boom.big ? "#f59e0b" : "#f43f5e", textShadow: "0 0 14px rgba(245,158,11,0.6)" }}>
              {boom.word}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
