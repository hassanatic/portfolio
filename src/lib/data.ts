/* ============================================================================
   AGENT MANIFEST — single source of truth for the Control Plane.
   Every field is grounded in reference-docs/ (master-cv-v1.md, updated linkedin,
   thesis documentation, github.md). Reused across hero, terminal, and all
   Phase-2 sections (trace / system map / deployments / contact).
   ========================================================================== */

export const agent = {
  callsign: "hassan.abdullah",
  name: "Hassan Abdullah",
  github: "hassanatic",
  role: "Software & AI Engineer",
  roleLong: "Software & AI Engineer",
  focus: ["AI Agents, RAG & LLMs", "Backend & Distributed Systems", "Full-Stack (Web & Mobile)", "Production at Scale"],
  disciplines: ["Software Engineering", "AI / ML & Agents", "Distributed Systems"],
  // Public professional address from CV / LinkedIn. Change here to update everywhere.
  email: "hassanraja.dev@gmail.com",
  phone: "+358 41 7298 463",
  location: "Oulu, Finland",
  region: "EU-NORTH / OULU-FI",
  timezone: "Europe/Helsinki",
  availability: "Available now",
  availabilityLong: "Available now for full-time roles across Finland",
  status: "ONLINE",
  links: {
    github: "https://github.com/hassanatic",
    linkedin: "https://www.linkedin.com/in/hassan-abdullah-dev/",
    email: "mailto:hassanraja.dev@gmail.com",
  },
  /** One-paragraph bio, in my own voice. */
  summary:
    "I'm a software engineer who fell hard for AI. For 4+ years I've shipped production systems that real people actually use, including fintech that serves millions, and these days I build LLM agents, multi-agent systems and RAG pipelines, plus the distributed plumbing that keeps them alive. Backend, full-stack, AI, and the messy bits in between. I like the hard parts.",
  /** The story arc, for the Trace intro. */
  arc: "Pakistan to Finland. From shipping fintech for millions of users, to AI research, to a thesis on keeping autonomous agents in line. It wasn't a straight line, but here's how I got here.",
  /** What I'm doing now (evergreen). */
  now: "Wrapping up my MSc in Finland and building in the open: agents, RAG, and the infrastructure that holds it all together.",
} as const;

export type Kpi = {
  label: string;
  value: string;
  suffix?: string;
  detail: string;
  /** numeric target for the count-up animation; omit for non-numeric values */
  to?: number;
  accent: "healthy" | "data" | "warn" | "signal";
};

export const kpis: Kpi[] = [
  { label: "AI systems built", value: "6", suffix: "+", to: 6, detail: "agents · RAG · model serving", accent: "data" },
  { label: "Users served", value: "1", suffix: "M+", to: 1, detail: "fintech platform @ ACE", accent: "healthy" },
  { label: "Production tenure", value: "4", suffix: "+ yrs", to: 4, detail: "shipping and operating live systems", accent: "data" },
  { label: "MSc thesis", value: "5", suffix: "/5", to: 5, detail: "AI-agent governance, graded Excellent", accent: "healthy" },
  { label: "MSc GPA", value: "4.38", to: 4.38, detail: "Applied Computing & AI", accent: "signal" },
];

export type Span = {
  id: string;
  org: string;
  title: string;
  kind: "FLAGSHIP" | "RESEARCH" | "PRODUCTION" | "FOUNDATION";
  start: string; // ISO-ish for ordering
  end: string;
  period: string;
  location: string;
  status: "active" | "healthy" | "archived";
  summary: string;
  highlights: string[];
  stack: string[];
};

export const spans: Span[] = [
  {
    id: "metosin",
    org: "Metosin",
    title: "Thesis Worker · Runtime Governance for AI Agents",
    kind: "FLAGSHIP",
    start: "2026-01",
    end: "2026-05",
    period: "Jan 2026 – May 2026",
    location: "Finland · Hybrid",
    status: "active",
    summary:
      "I built a runtime governance and observability framework for autonomous AI coding agents (Claude Code and Gemini CLI) at one of Finland's top software consultancies, without touching the agents themselves. It became my MSc thesis, graded 5/5 (Excellent).",
    highlights: [
      "Captured agent lifecycle events via native hooks, routed through durable Temporal workflows into self-hosted Langfuse.",
      "Real-time policy enforcement: blocked destructive commands, force-pushes & credential exposure at the hook layer.",
      "Behavioural anomaly detection, LLM-as-judge goal assessment, hallucination detection & per-session data lineage.",
      "11-service containerised deployment; Spec-Driven Development in a small, senior team.",
    ],
    stack: ["Go", "Python", "Temporal", "Langfuse", "ClickHouse", "PostgreSQL", "Redis", "Docker", "gRPC", "MCP"],
  },
  {
    id: "oulu-ra",
    org: "University of Oulu",
    title: "Research Assistant · Multi-Agent Research System",
    kind: "RESEARCH",
    start: "2025-06",
    end: "2025-08",
    period: "Jun 2025 – Aug 2025",
    location: "Oulu, Finland · Hybrid",
    status: "healthy",
    summary:
      "I built a multi-agent system for automating scientific-literature research, and owned it end to end, from the server layer all the way up to the agents.",
    highlights: [
      "Specialised agents for searching, retrieval, summarising & citing over a RAG pipeline.",
      "Built MCP servers & clients connecting agents to external tools and paper sources.",
      "Ran across distributed systems, handling agent concurrency and message passing.",
    ],
    stack: ["Python", "LLMs", "Multi-Agent", "RAG", "MCP", "Vector Search", "Distributed Systems"],
  },
  {
    id: "ace",
    org: "ACE Money Transfer",
    title: "Software Developer · Fintech Platform",
    kind: "PRODUCTION",
    start: "2022-01",
    end: "2025-05",
    period: "Jan 2022 – May 2025",
    location: "Kharian, Pakistan · Hybrid",
    status: "archived",
    summary:
      "Full-stack developer at a global money-transfer company moving international remittances at scale. I started on tickets and became the generalist people pulled in when a problem crossed teams or stacks, working across three production systems at once.",
    highlights: [
      "Built & maintained much of the API layer behind the flagship app serving millions of users.",
      "End to end across React, Next.js, Laravel and .NET; partnered with the AI team on a RAG chatbot's APIs.",
      "Built 2FA & account-security flows for cross-border payments.",
      "Heavy query optimisation under live load (indexing, stored-procedure redesign); CI/CD on Azure & AWS.",
    ],
    stack: ["PHP", "Laravel", "React", "Next.js", ".NET", "TypeScript", "MySQL", "PostgreSQL", "Docker", "Azure", "AWS"],
  },
  {
    id: "ace-intern",
    org: "ACE Money Transfer",
    title: "Software Developer Intern",
    kind: "FOUNDATION",
    start: "2021-10",
    end: "2021-12",
    period: "Oct 2021 – Dec 2021",
    location: "Pakistan · On-site",
    status: "archived",
    summary:
      "My first role on a real engineering team. I built features with the MVC pattern (PHP and Laravel) under regular code review, and learned how production software actually ships.",
    highlights: ["MVC feature work under code review", "Bug-fixing, testing, shadowing senior developers"],
    stack: ["PHP", "Laravel", "MySQL", "Git", "MVC"],
  },
];

export type Project = {
  id: string;
  name: string;
  tagline: string;
  status: "live" | "flagship" | "active" | "archived";
  featured?: boolean;
  context: string;
  description: string;
  stack: string[];
  links: { label: string; href: string }[];
  /** synthetic telemetry seeds for the deployment tiles' sparklines */
  seed: number;
};

export const projects: Project[] = [
  {
    id: "governance",
    name: "Agentic AI Governance & Observability",
    tagline: "A control plane for autonomous AI coding agents.",
    status: "flagship",
    featured: true,
    context: "MSc Thesis · Metosin · grade 5/5",
    description:
      "Self-hosted governance and observability platform for Claude Code and Gemini CLI. It captures every prompt, tool call, model response and token cost into Langfuse via native hooks routed through durable Temporal workflows, enforces real-time policy that audits and blocks risky actions, and adds LLM-as-judge goal assessment, anomaly detection, extended-thinking capture and per-session data lineage, all without modifying the agents.",
    stack: ["Python", "Go", "Temporal", "Langfuse", "ClickHouse", "PostgreSQL", "Redis", "Docker", "gRPC", "MCP"],
    links: [{ label: "GitHub", href: "https://github.com/hassanatic/agentic-governance-thesis" }],
    seed: 7,
  },
  {
    id: "financefile",
    name: "FinanceFile",
    tagline: "Bookkeeping & VAT for Finnish sole traders.",
    status: "live",
    featured: true,
    context: "Personal · Live in production",
    description:
      "Turns everyday income & expenses into the figures Finnish sole traders (toiminimi) actually file: OmaVero VAT returns, income statement, general ledger, balance sheet and a filing calendar. Multi-line, multi-VAT-rate transactions, receipt uploads, per-user isolation via Postgres RLS, EN/FI/SV interface.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Supabase", "PostgreSQL", "Drizzle", "Tailwind", "Vercel"],
    links: [{ label: "Live app", href: "https://financefile.vercel.app/" }],
    seed: 3,
  },
  {
    id: "echo",
    name: "Echo Agent",
    tagline: "A private, local-first personal AI agent.",
    status: "active",
    context: "Personal",
    description:
      "A self-hosted 'Jarvis' you talk to over Telegram. Learns your habits, connects to email, calendar & tasks. Runs fully locally via Ollama for privacy, or on cloud LLMs (Groq, Gemini) for speed. Each install is fully isolated.",
    stack: ["Python", "LLMs", "AI Agents", "Ollama", "Groq", "Gemini", "Telegram"],
    links: [{ label: "GitHub", href: "https://github.com/hassanatic/echo-agent" }],
    seed: 11,
  },
  {
    id: "gpt2",
    name: "Distributed GPT-2 Inference",
    tagline: "GPT-2's 12 layers, split across worker nodes.",
    status: "archived",
    context: "Academic / Personal",
    description:
      "A distributed text-generation system that splits GPT-2's transformer layers across worker nodes using PyTorch RPC. A FastAPI master orchestrates nodes, serves a chat UI, and persists conversations in MongoDB, with Prometheus + Grafana observability.",
    stack: ["Python", "PyTorch", "PyTorch RPC", "FastAPI", "MongoDB", "Docker", "Kubernetes", "Prometheus", "Grafana"],
    links: [{ label: "GitHub", href: "https://github.com/hassanatic/ds_project" }],
    seed: 5,
  },
  {
    id: "llm-serving",
    name: "Distributed LLM Serving",
    tagline: "Low-latency model serving over gRPC + Kafka.",
    status: "archived",
    context: "Academic / Personal",
    description:
      "Serves LLMs using gRPC for low-latency inter-service calls and Kafka to decouple producers/consumers for scalable asynchronous inference; service interfaces defined with Protocol Buffers.",
    stack: ["Python", "gRPC", "Apache Kafka", "Protocol Buffers", "Microservices"],
    links: [{ label: "GitHub", href: "https://github.com/hassanatic/distributed_llm_system" }],
    seed: 9,
  },
  {
    id: "doctors",
    name: "Doctors on Hand",
    tagline: "Find nearby doctors on live maps.",
    status: "archived",
    context: "Final-year project",
    description:
      "A Flutter app that helps patients find nearby doctors using live maps, geolocation and route polylines, backed by Firebase (Auth, Firestore, Storage).",
    stack: ["Flutter", "Dart", "Firebase", "Google Maps", "Geolocation"],
    links: [{ label: "GitHub", href: "https://github.com/hassanatic/doctorsonhand" }],
    seed: 4,
  },
];

/** Skill graph — clustered for the System Map (Phase 2) and `skills` terminal cmd. */
export type SkillCluster = { id: string; label: string; accent: "healthy" | "data" | "warn" | "signal"; skills: string[] };

export const skillClusters: SkillCluster[] = [
  {
    id: "languages",
    label: "Languages",
    accent: "data",
    skills: ["Python", "Go", "TypeScript", "JavaScript", "PHP", "C#/.NET", "Kotlin", "Dart", "SQL", "Bash"],
  },
  {
    id: "ai",
    label: "AI / ML",
    accent: "healthy",
    skills: ["PyTorch", "Hugging Face", "LLMs", "RAG", "Multi-Agent", "MCP", "LangChain", "Ollama", "Groq", "Gemini", "Embeddings", "LLM-as-Judge"],
  },
  {
    id: "distributed",
    label: "Distributed Systems",
    accent: "signal",
    skills: ["gRPC", "Protocol Buffers", "Apache Kafka", "Temporal", "WebSockets", "PyTorch RPC", "Microservices"],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    accent: "data",
    skills: ["FastAPI", "Node.js", "Laravel", ".NET", "Django", "Flask", "REST", "GraphQL"],
  },
  {
    id: "data",
    label: "Data & Stores",
    accent: "warn",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Supabase", "Firebase", "pgvector", "ClickHouse", "Drizzle"],
  },
  {
    id: "infra",
    label: "Cloud / DevOps",
    accent: "healthy",
    skills: ["Docker", "Kubernetes", "CI/CD", "Azure", "AWS", "GCP", "Vercel", "Nginx", "Linux"],
  },
  {
    id: "observability",
    label: "Observability",
    accent: "data",
    skills: ["Prometheus", "Grafana", "Langfuse", "ClickHouse", "OpenTelemetry-style tracing"],
  },
  {
    id: "frontend",
    label: "Frontend / Mobile",
    accent: "signal",
    skills: ["Next.js", "React", "Tailwind", "Flutter", "Jetpack Compose", "Unity"],
  },
];

export const education = [
  {
    school: "University of Oulu",
    degree: "M.Sc. (Tech) · Computer Science & Engineering",
    period: "2024 – 2026",
    detail: "GPA 4.38/5 · Applied Computing & AI · Thesis 5/5 (Excellent)",
  },
  {
    school: "University of Gujrat",
    degree: "B.Sc. · Software Engineering",
    period: "2019 – 2023",
    detail: "GPA 3.08/4 · Software Engineering Society",
  },
];

export const nav = [
  { id: "boot", label: "Hero", hint: "00" },
  { id: "trace", label: "Trace", hint: "01" },
  { id: "system-map", label: "System Map", hint: "02" },
  { id: "deployments", label: "Deployments", hint: "03" },
  { id: "console", label: "Console", hint: "04" },
  { id: "escalate", label: "Escalate", hint: "05" },
];
