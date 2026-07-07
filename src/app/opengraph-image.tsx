import { ImageResponse } from "next/og";
import { agent } from "@/lib/data";

export const alt = `${agent.name} · ${agent.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Social share card in the Control Plane aesthetic: dark canvas, operator
   green, mono labels. Rendered at build time, no runtime cost. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#020617",
          color: "#e2e8f0",
          padding: 72,
          fontFamily: "monospace",
        }}
      >
        {/* top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#64748b" }}>
          <div style={{ width: 16, height: 16, borderRadius: 999, background: "#22c55e", display: "flex" }} />
          <div style={{ display: "flex", color: "#22c55e", letterSpacing: 4 }}>STATUS: ONLINE</div>
          <div style={{ display: "flex" }}>· {agent.region}</div>
        </div>

        {/* name + role */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color: "#f8fafc" }}>{agent.name}</div>
          <div style={{ display: "flex", fontSize: 40, color: "#22d3ee" }}>{agent.role}</div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #1e293b",
            paddingTop: 32,
            fontSize: 26,
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex" }}>{agent.focus.slice(0, 2).join(" · ")}</div>
          <div style={{ display: "flex", color: "#22c55e" }}>{agent.location}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
