"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Node = { x: number; y: number; vx: number; vy: number; kind: 0 | 1 | 2; r: number };
type Packet = { ax: number; ay: number; bx: number; by: number; t: number; speed: number; green: boolean };

const LINK_DIST = 132;

/**
 * Ambient distributed-system field. Nodes drift, link when close, react to the
 * cursor, and pass "message" packets along edges. Canvas 2D for performance;
 * pauses on tab-hide; renders a single static frame under reduced-motion.
 */
export function NodeField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    // Non-null-typed locals so the animation closures below stay narrowed.
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let last = 0;
    let packetTimer = 0;

    const colorFor = (k: number, a: number) =>
      k === 1 ? `rgba(34,197,94,${a})` : k === 2 ? `rgba(34,211,238,${a})` : `rgba(148,163,184,${a})`;

    function measure() {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = Math.max(1, parent.clientWidth);
      h = Math.max(1, parent.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      const count = Math.min(120, Math.max(34, Math.floor((w * h) / 15000)));
      nodes = Array.from({ length: count }, () => {
        const rnd = Math.random();
        const kind: 0 | 1 | 2 = rnd > 0.92 ? 1 : rnd > 0.83 ? 2 : 0;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          kind,
          r: kind === 0 ? Math.random() * 0.8 + 0.6 : Math.random() * 1.1 + 1.2,
        };
      });
      packets = [];
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // edges
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const d = Math.sqrt(d2);
            ctx.strokeStyle = `rgba(148,163,184,${(1 - d / LINK_DIST) * 0.13})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // cursor links
      if (mouse.active) {
        const R = 160;
        for (const n of nodes) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2);
            ctx.strokeStyle = `rgba(34,211,238,${(1 - d / R) * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        if (n.kind !== 0) {
          ctx.shadowColor = colorFor(n.kind, 0.8);
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = colorFor(n.kind, n.kind === 0 ? 0.5 : 0.9);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // packets
      for (const p of packets) {
        const x = p.ax + (p.bx - p.ax) * p.t;
        const y = p.ay + (p.by - p.ay) * p.t;
        const c = p.green ? "rgba(34,197,94,0.95)" : "rgba(34,211,238,0.95)";
        ctx.fillStyle = c;
        ctx.shadowColor = c;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function spawnPacket() {
      if (!nodes.length) return;
      const a = nodes[(Math.random() * nodes.length) | 0];
      let b: Node | null = null;
      for (let t = 0; t < 6; t++) {
        const c = nodes[(Math.random() * nodes.length) | 0];
        if (c === a) continue;
        const dx = a.x - c.x;
        const dy = a.y - c.y;
        if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) {
          b = c;
          break;
        }
      }
      if (!b) return;
      packets.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, t: 0, speed: 0.9 + Math.random() * 0.6, green: Math.random() > 0.5 });
    }

    function step(ts: number) {
      const dt = last ? Math.min(40, ts - last) : 16;
      last = ts;
      const k = dt / 16.67;

      for (const n of nodes) {
        n.x += n.vx * k;
        n.y += n.vy * k;
        if (n.x < -12) n.x = w + 12;
        else if (n.x > w + 12) n.x = -12;
        if (n.y < -12) n.y = h + 12;
        else if (n.y > h + 12) n.y = -12;

        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          const R = 120;
          if (d2 < R * R && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = ((1 - d / R) * 0.5) / d;
            n.x += dx * f * k;
            n.y += dy * f * k;
          }
        }
      }

      packetTimer += dt;
      if (packetTimer > 620 && packets.length < 10) {
        packetTimer = 0;
        spawnPacket();
      }
      for (const p of packets) p.t += (dt / 1000) * p.speed;
      packets = packets.filter((p) => p.t < 1);

      draw();
      raf = requestAnimationFrame(step);
    }

    measure();
    init();
    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(step);
    }

    // Debounced rescale — keep existing nodes, just remap to the new size.
    // Prevents the field from re-randomising (and flickering) on every resize tick.
    let resizeT = 0;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = window.setTimeout(() => {
        const oldW = w;
        const oldH = h;
        measure();
        if (oldW > 0 && oldH > 0 && nodes.length) {
          const sx = w / oldW;
          const sy = h / oldH;
          for (const n of nodes) {
            n.x *= sx;
            n.y *= sy;
          }
        } else {
          init();
        }
        if (reduced) draw();
      }, 120);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = e.clientY - r.top >= 0 && e.clientY - r.top <= h;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduced) {
        last = 0;
        raf = requestAnimationFrame(step);
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeT);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
