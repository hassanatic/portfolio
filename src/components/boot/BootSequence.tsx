"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Line = { tag: "ok" | "run"; text: string; value?: string };

export function BootSequence() {
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(0);
  const [trace, setTrace] = useState("00000000");
  const finished = useRef(false);

  const lines: Line[] = [
    { tag: "ok", text: "establishing operator session", value: "ready" },
    { tag: "ok", text: "authenticating visitor", value: "anonymous-operator" },
    { tag: "ok", text: "attaching trace context", value: `0x${trace}` },
    { tag: "ok", text: "loading agent manifest", value: "hassan.abdullah" },
    { tag: "ok", text: "mounting knowledge base", value: "RAG index ready" },
    { tag: "ok", text: "initializing agent runtime", value: "tools online" },
    { tag: "run", text: "agent.hassan", value: "ONLINE" },
  ];

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem("cp-booted", "1");
    } catch {}
    setShow(false);
  }, []);

  // Drive (or skip) the sequence on mount.
  useEffect(() => {
    let booted = false;
    try {
      booted = sessionStorage.getItem("cp-booted") === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (booted || reduced) {
      finished.current = true;
      setShow(false);
      return;
    }

    setTrace(
      Math.floor(Math.random() * 0xffffffff)
        .toString(16)
        .padStart(8, "0")
        .toUpperCase()
    );

    const timers: number[] = [];
    let i = 0;
    const total = lines.length;
    const advance = () => {
      i += 1;
      setStep(i);
      if (i < total) {
        timers.push(window.setTimeout(advance, 150 + Math.random() * 130));
      } else {
        timers.push(window.setTimeout(finish, 700));
      }
    };
    timers.push(window.setTimeout(advance, 260));
    return () => timers.forEach((t) => clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finish]);

  // Any input skips.
  useEffect(() => {
    if (!show) return;
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [show, finish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-canvas px-6"
          role="dialog"
          aria-label="Booting console"
        >
          <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
          <div className="gridlines pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative w-full max-w-xl font-mono text-[13px] leading-relaxed">
            <div className="mb-5 flex items-center justify-between">
              <span className="label-mono !text-healthy">control plane</span>
              <span className="label-mono">boot sequence</span>
            </div>

            <div className="space-y-1.5">
              {lines.slice(0, step).map((l, idx) => {
                const isRun = l.tag === "run";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex items-baseline gap-2"
                  >
                    <span
                      className={
                        isRun
                          ? "text-healthy glow-healthy"
                          : "text-healthy/80"
                      }
                    >
                      [{isRun ? "●●" : " ok "}]
                    </span>
                    <span className={isRun ? "text-ink" : "text-ink-muted"}>
                      {l.text}
                    </span>
                    <span className="flex-1 overflow-hidden text-ink-faint">
                      {" "}
                      {".".repeat(40)}
                    </span>
                    {l.value && (
                      <span
                        className={
                          isRun
                            ? "font-semibold text-healthy glow-healthy"
                            : "text-data"
                        }
                      >
                        {l.value}
                      </span>
                    )}
                  </motion.div>
                );
              })}
              <span className="inline-block h-3.5 w-2 translate-y-0.5 bg-healthy animate-blink" />
            </div>

            {/* progress */}
            <div className="mt-6 h-px w-full bg-line">
              <motion.div
                className="h-full bg-healthy"
                animate={{ width: `${(step / lines.length) * 100}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>
            <div className="mt-3 text-right">
              <span className="label-mono">▸ press any key to skip</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
