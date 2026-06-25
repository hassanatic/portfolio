"use client";

import { useEffect, useState } from "react";
import { MapPin, CalendarCheck2, Clock } from "lucide-react";
import { agent } from "@/lib/data";

export function StatusLine() {
  const [localTime, setLocalTime] = useState<string>("");
  useEffect(() => {
    const tick = () =>
      setLocalTime(
        new Date().toLocaleTimeString("en-GB", {
          hour12: false,
          timeZone: agent.timezone,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000 * 20);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs">
      <span className="flex items-center gap-1.5 rounded-sm border border-healthy/30 bg-healthy/5 px-2.5 py-1 text-healthy">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-healthy opacity-60 [animation:pulse-ring_2.4s_ease-out_infinite] motion-reduce:animate-none" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-healthy" />
        </span>
        AGENT ONLINE
      </span>

      <span className="flex items-center gap-1.5 rounded-sm border border-line bg-surface px-2.5 py-1 text-ink-muted">
        <MapPin className="h-3 w-3 text-ink-dim" />
        {agent.location}
        {localTime && (
          <>
            <span className="text-ink-faint">·</span>
            <Clock className="h-3 w-3 text-ink-dim" />
            <span className="tabular text-data">{localTime}</span>
          </>
        )}
      </span>

      <span className="flex items-center gap-1.5 rounded-sm border border-line bg-surface px-2.5 py-1 text-ink-muted">
        <CalendarCheck2 className="h-3 w-3 text-ink-dim" />
        {agent.availability}
      </span>
    </div>
  );
}
