/* ============================================================================
   CONSOLE ENGINE — command parsing, output model, and a *real* policy gate.
   The policy mirrors the FORBIDDEN_PATTERNS / rules.json from Hassan's MSc
   thesis (hooks/pre_tool.py): destructive commands are intercepted and
   cancelled before "execution", exactly as the governance framework does to a
   live AI coding agent. Form = content.
   ========================================================================== */

import { agent, projects, spans, skillClusters, education } from "@/lib/data";

export type Tone =
  | "in"
  | "out"
  | "muted"
  | "ok"
  | "warn"
  | "err"
  | "data"
  | "head"
  | "accent";

export type Seg = { text: string; tone?: Tone; href?: string };
export type OutLine = { tone?: Tone; text?: string; href?: string; segments?: Seg[] };
export type RunResult = { lines: OutLine[]; clear?: boolean };

/* ----------------------------------------------------------------------------
   Policy — the governance hook
   -------------------------------------------------------------------------- */
type Rule = { id: string; test: RegExp; reason: string };

const POLICY_RULES: Rule[] = [
  {
    id: "destructive_recursive_delete",
    test: /\brm\s+(-[a-z]*r[a-z]*f?|-[a-z]*f[a-z]*r?)\s+(\/|~|\*|\.\.|\$HOME)/i,
    reason: "recursive delete targeting a protected path (/, ~, *, ..)",
  },
  {
    id: "force_push_shared_history",
    test: /\bgit\s+push\b.*--force(?!-with-lease)/i,
    reason: "force-push that can overwrite shared history",
  },
  {
    id: "destructive_system_command",
    test: /\b(shutdown|halt|poweroff|reboot|init\s+0)\b/i,
    reason: "host power-state command is out of scope for this agent",
  },
  {
    id: "destructive_sql",
    test: /\bdrop\s+(database|schema|table)\b|\btruncate\s+table\b/i,
    reason: "destructive schema mutation (DROP / TRUNCATE)",
  },
  {
    id: "disk_destructive",
    test: /\bmkfs\b|\bdd\s+if=|\bof=\/dev\/|>\s*\/dev\/sd/i,
    reason: "raw disk write / filesystem format",
  },
  {
    id: "fork_bomb",
    test: /:\(\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/,
    reason: "fork bomb, a resource-exhaustion pattern",
  },
  {
    id: "credential_exposure",
    test: /(api[_-]?key|secret|access[_-]?token|password)\s*[:=]\s*[A-Za-z0-9\-._]{6,}/i,
    reason: "possible hardcoded credential in the payload",
  },
];

export function evaluatePolicy(input: string): { blocked: boolean; rule?: string; reason?: string } {
  for (const r of POLICY_RULES) {
    if (r.test.test(input)) return { blocked: true, rule: r.id, reason: r.reason };
  }
  return { blocked: false };
}

function blockLines(rule: string, reason: string): OutLine[] {
  return [
    {
      segments: [
        { text: "⛔ BLOCKED ", tone: "err" },
        { text: "by governance policy hook ", tone: "warn" },
        { text: "(hooks/pre_tool.py)", tone: "muted" },
      ],
    },
    { tone: "out", text: `   rule: ${rule}   ·   severity: block` },
    { tone: "out", text: `   reason: ${reason}` },
    { tone: "muted", text: "   tool call cancelled before execution, the agent never reached the shell." },
    {
      segments: [
        { text: "   › this is the real runtime policy from my MSc thesis. ", tone: "muted" },
        { text: "cat thesis", tone: "data" },
        { text: " to read about it.", tone: "muted" },
      ],
    },
  ];
}

/* ----------------------------------------------------------------------------
   Command catalogue (for help + tab-completion)
   -------------------------------------------------------------------------- */
export const COMMANDS: { name: string; desc: string }[] = [
  { name: "help", desc: "list available commands" },
  { name: "whoami", desc: "identity & current status" },
  { name: "neofetch", desc: "agent summary card" },
  { name: "about", desc: "the long version" },
  { name: "experience", desc: "career as a session trace" },
  { name: "projects", desc: "list deployments" },
  { name: "cat <id>", desc: "inspect a project · try 'cat thesis'" },
  { name: "skills", desc: "the system map, by cluster" },
  { name: "education", desc: "degrees & grades" },
  { name: "contact", desc: "open a channel (HITL escalation)" },
  { name: "resume", desc: "condensed CV" },
  { name: "social", desc: "github · linkedin · email" },
  { name: "clear", desc: "wipe the console" },
];

const ALIAS: Record<string, string> = {
  who: "whoami",
  me: "whoami",
  card: "neofetch",
  trace: "experience",
  exp: "experience",
  proj: "projects",
  ls: "projects",
  edu: "education",
  cv: "resume",
  links: "social",
  contact: "contact",
  escalate: "contact",
  clr: "clear",
  cls: "clear",
};

const BASE_COMMANDS = new Set([
  "help", "clear", "whoami", "about", "neofetch", "projects", "cat", "experience",
  "skills", "education", "resume", "social", "contact", "date", "ping", "exit", "echo",
]);

/** True when input is a real command; otherwise the terminal routes it to the agent. */
export function commandExists(input: string): boolean {
  const raw = input.trim().toLowerCase();
  if (!raw) return false;
  const tokens = raw.split(/\s+/);
  const cmd = tokens[0];
  const n = tokens.length;
  if ((cmd === "sudo" && (tokens[1] === "hire" || tokens[1] === "hassan")) || cmd === "hire") return true;
  // commands that legitimately take arguments
  if (cmd === "cat" || cmd === "echo") return true;
  if (cmd === "ls") return n === 1 || tokens[1] === "projects";
  // no-arg commands only count when typed alone, so "who is elon musk" reaches the agent
  const resolved = ALIAS[cmd] ?? cmd;
  return BASE_COMMANDS.has(resolved) && n === 1;
}

/* ----------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */
const HR: OutLine = { tone: "muted", text: "─".repeat(46) };
const statusDot: Record<string, Tone> = { live: "ok", flagship: "data", active: "ok", healthy: "ok", archived: "muted", "active ": "ok" };

function kv(key: string, value: string, valueTone: Tone = "out"): OutLine {
  return { segments: [{ text: key.padEnd(11), tone: "data" }, { text: value, tone: valueTone }] };
}

function neofetch(): OutLine[] {
  const art = [
    "     ◢██████◣",
    "   ◢███▘ ▝███◣",
    "  ███▘  ●  ▝███",
    "   ◥███▖ ▗███◤",
    "     ◥██████◤",
  ];
  const w = 18;
  const stats: [string, string][] = [
    [`${agent.github}`, "@control-plane"],
    ["role", agent.role],
    ["uptime", "4+ yrs in production"],
    ["thesis", "Runtime Governance for AI Agents · 5/5"],
    ["region", agent.location],
    ["langs", "Go · Python · TypeScript · PHP · C#"],
    ["focus", agent.focus.join(" · ")],
    ["status", `${agent.status} · ${agent.availability}`],
  ];
  const rows = Math.max(art.length, stats.length);
  const lines: OutLine[] = [];
  for (let i = 0; i < rows; i++) {
    const artText = (art[i] ?? "").padEnd(w);
    const segs: Seg[] = [{ text: artText, tone: "ok" }];
    if (stats[i]) {
      const [k, v] = stats[i];
      if (i === 0) segs.push({ text: `${k} `, tone: "head" }, { text: v, tone: "muted" });
      else if (i === 1) segs.push({ text: "─".repeat(26), tone: "muted" });
      else segs.push({ text: `${k.padEnd(8)}: `, tone: "data" }, { text: v, tone: "out" });
    }
    lines.push({ segments: segs });
  }
  return lines;
}

function hire(): OutLine[] {
  return [
    { segments: [{ text: "[ HITL ] ", tone: "ok" }, { text: "human-in-the-loop escalation requested…", tone: "out" }] },
    { tone: "muted", text: "   pausing agent · routing to operator · awaiting human confirmation" },
    { tone: "ok", text: "   ✓ approved. opening a channel." },
    HR,
    { segments: [{ text: "email     ", tone: "data" }, { text: agent.email, tone: "out", href: agent.links.email }] },
    { segments: [{ text: "linkedin  ", tone: "data" }, { text: "/in/hassan-abdullah-dev", tone: "out", href: agent.links.linkedin }] },
    { segments: [{ text: "github    ", tone: "data" }, { text: `/${agent.github}`, tone: "out", href: agent.links.github }] },
    { tone: "muted", text: "   ↳ tip: the 'Escalate' button up top does the same thing, with less drama." },
  ];
}

function listProjects(): OutLine[] {
  const lines: OutLine[] = [{ tone: "head", text: "DEPLOYMENTS" }, HR];
  for (const p of projects) {
    lines.push({
      segments: [
        { text: "● ", tone: statusDot[p.status] ?? "muted" },
        { text: p.id.padEnd(13), tone: "out" },
        { text: p.status.toUpperCase().padEnd(9), tone: statusDot[p.status] ?? "muted" },
        { text: p.tagline, tone: "muted" },
      ],
    });
  }
  lines.push({ segments: [{ text: "› ", tone: "data" }, { text: "cat <id>", tone: "data" }, { text: "  to inspect (e.g. cat thesis)", tone: "muted" }] });
  return lines;
}

function catProject(id: string): OutLine[] {
  const key = id === "thesis" ? "governance" : id;
  const p = projects.find((x) => x.id === key);
  if (!p) {
    return [{ tone: "err", text: `cat: ${id}: no such deployment. try 'projects'.` }];
  }
  const lines: OutLine[] = [
    { segments: [{ text: p.name, tone: "head" }, { text: `   [${p.status}]`, tone: statusDot[p.status] ?? "muted" }] },
    { tone: "muted", text: p.context },
    HR,
    { tone: "out", text: p.description },
    { segments: [{ text: "stack  ", tone: "data" }, { text: p.stack.join(" · "), tone: "muted" }] },
  ];
  for (const l of p.links) {
    lines.push({ segments: [{ text: "link   ", tone: "data" }, { text: l.href.replace(/^https?:\/\//, ""), tone: "out", href: l.href }] });
  }
  return lines;
}

function listExperience(): OutLine[] {
  const lines: OutLine[] = [{ tone: "head", text: "SESSION TRACE · career spans" }, HR];
  for (const s of spans) {
    lines.push({
      segments: [
        { text: "▸ ", tone: "data" },
        { text: s.org, tone: "out" },
        { text: `  ${s.title}`, tone: "muted" },
      ],
    });
    lines.push({ segments: [{ text: "   " + s.period.padEnd(22), tone: "muted" }, { text: s.kind, tone: "data" }] });
  }
  lines.push({ segments: [{ text: "› ", tone: "data" }, { text: "the full interactive trace is rendered in §01 above.", tone: "muted" }] });
  return lines;
}

function listSkills(): OutLine[] {
  const lines: OutLine[] = [{ tone: "head", text: "SYSTEM MAP · capability clusters" }, HR];
  for (const c of skillClusters) {
    lines.push({
      segments: [
        { text: "◆ ", tone: c.accent === "warn" ? "warn" : c.accent === "signal" ? "accent" : c.accent === "data" ? "data" : "ok" },
        { text: c.label.padEnd(20), tone: "out" },
        { text: c.skills.slice(0, 6).join(" · "), tone: "muted" },
      ],
    });
  }
  return lines;
}

function listEducation(): OutLine[] {
  const lines: OutLine[] = [{ tone: "head", text: "EDUCATION" }, HR];
  for (const e of education) {
    lines.push({ segments: [{ text: "▸ ", tone: "data" }, { text: e.school, tone: "out" }, { text: `  ${e.period}`, tone: "muted" }] });
    lines.push({ tone: "muted", text: `   ${e.degree} · ${e.detail}` });
  }
  return lines;
}

function resume(): OutLine[] {
  return [
    { tone: "head", text: `${agent.name} · ${agent.role}` },
    { tone: "muted", text: `${agent.location} · ${agent.availability}` },
    HR,
    { segments: [{ text: "now    ", tone: "data" }, { text: "MSc thesis @ Metosin, runtime governance for AI agents (5/5)", tone: "out" }] },
    { segments: [{ text: "before ", tone: "data" }, { text: "~4 yrs fintech @ ACE Money Transfer, serving millions of users", tone: "out" }] },
    { segments: [{ text: "edu    ", tone: "data" }, { text: "MSc CSE, Univ. of Oulu (GPA 4.38/5)", tone: "out" }] },
    { segments: [{ text: "core   ", tone: "data" }, { text: "Distributed systems · Agentic AI · Observability", tone: "out" }] },
    HR,
    { segments: [{ text: "› want the full CV? ", tone: "muted" }, { text: "contact", tone: "data" }, { text: " me and just ask.", tone: "muted" }] },
  ];
}

function social(): OutLine[] {
  return [
    { segments: [{ text: "github    ", tone: "data" }, { text: `github.com/${agent.github}`, tone: "out", href: agent.links.github }] },
    { segments: [{ text: "linkedin  ", tone: "data" }, { text: "linkedin.com/in/hassan-abdullah-dev", tone: "out", href: agent.links.linkedin }] },
    { segments: [{ text: "email     ", tone: "data" }, { text: agent.email, tone: "out", href: agent.links.email }] },
  ];
}

function helpLines(): OutLine[] {
  const lines: OutLine[] = [
    { segments: [{ text: "CONTROL PLANE", tone: "head" }, { text: "  ·  available commands", tone: "muted" }] },
    HR,
  ];
  for (const c of COMMANDS) {
    lines.push({ segments: [{ text: "  " + c.name.padEnd(16), tone: "data" }, { text: c.desc, tone: "muted" }] });
  }
  lines.push(HR);
  lines.push({
    segments: [
      { text: "  or just ", tone: "muted" },
      { text: "ask in plain English", tone: "data" },
      { text: ", like \"do you know RAG?\" or \"why should we hire you?\"", tone: "muted" },
    ],
  });
  lines.push({
    segments: [
      { text: "  (destructive commands like ", tone: "muted" },
      { text: "rm -rf /", tone: "err" },
      { text: " are stopped by a governance guardrail.)", tone: "muted" },
    ],
  });
  return lines;
}

/* ----------------------------------------------------------------------------
   Entry point
   -------------------------------------------------------------------------- */
export function runCommand(input: string): RunResult {
  const raw = input.trim();
  if (!raw) return { lines: [] };

  const policy = evaluatePolicy(raw);
  if (policy.blocked) return { lines: blockLines(policy.rule!, policy.reason!) };

  const tokens = raw.split(/\s+/);
  let cmd = tokens[0].toLowerCase();
  let args = tokens.slice(1);

  // multi-word easter eggs
  if (cmd === "sudo" && (args[0] === "hire" || args[0] === "hassan")) return { lines: hire() };
  if (cmd === "hire") return { lines: hire() };
  if (cmd === "ls" && args[0] === "projects") {
    cmd = "projects";
    args = [];
  }

  cmd = ALIAS[cmd] ?? cmd;

  switch (cmd) {
    case "help":
      return { lines: helpLines() };
    case "clear":
      return { lines: [], clear: true };
    case "whoami":
      return {
        lines: [
          { segments: [{ text: agent.name, tone: "head" }, { text: `  ·  ${agent.role}`, tone: "muted" }] },
          { segments: [{ text: "status ", tone: "data" }, { text: `● ${agent.status}`, tone: "ok" }, { text: `  ·  ${agent.location}  ·  ${agent.availability}`, tone: "muted" }] },
          { segments: [{ text: "focus  ", tone: "data" }, { text: agent.focus.join(" · "), tone: "out" }] },
        ],
      };
    case "about":
      return {
        lines: [
          { tone: "out", text: agent.summary },
          { tone: "muted", text: "" },
          { segments: [{ text: "› ", tone: "data" }, { text: "neofetch", tone: "data" }, { text: " for the card, ", tone: "muted" }, { text: "experience", tone: "data" }, { text: " for the trace.", tone: "muted" }] },
        ],
      };
    case "neofetch":
      return { lines: neofetch() };
    case "projects":
      return { lines: listProjects() };
    case "cat":
      if (!args[0]) return { lines: [{ tone: "err", text: "cat: missing operand. try 'cat thesis'." }] };
      return { lines: catProject(args[0].toLowerCase()) };
    case "experience":
      return { lines: listExperience() };
    case "skills":
      return { lines: listSkills() };
    case "education":
      return { lines: listEducation() };
    case "resume":
      return { lines: resume() };
    case "social":
      return { lines: social() };
    case "contact":
      return { lines: hire() };
    case "date":
      return { lines: [{ tone: "muted", text: new Date().toString() }] };
    case "ping":
      return { lines: [{ segments: [{ text: "pong", tone: "ok" }, { text: "  ·  12ms  ·  healthy", tone: "muted" }] }] };
    case "exit":
      return { lines: [{ tone: "warn", text: "nice try, this agent doesn't stop. (Stop hook intercepted, session stays open.)" }] };
    case "echo":
      return { lines: [{ tone: "out", text: args.join(" ") }] };
    default:
      return {
        lines: [
          { segments: [{ text: `${cmd}: command not found. `, tone: "err" }, { text: "type 'help'.", tone: "muted" }] },
        ],
      };
  }
}

export const WELCOME: OutLine[] = [
  {
    segments: [
      { text: "hey, I'm Hassan's agent. ", tone: "ok" },
      { text: "ask me anything about him, in plain English. I'll do my best.", tone: "muted" },
    ],
  },
  {
    segments: [
      { text: "try ", tone: "muted" },
      { text: '"what\'s your experience?"', tone: "data" },
      { text: " or ", tone: "muted" },
      { text: '"why should we hire you?"', tone: "data" },
      { text: ", or type ", tone: "muted" },
      { text: "help", tone: "data" },
      { text: ". asking silly stuff is encouraged.", tone: "muted" },
    ],
  },
];
