/* ============================================================================
   RETRIEVER — understands the query and finds the most relevant doc(s).
   Default: lexical + synonym scoring over the knowledge base (sync, $0, no deps).
   Designed as a drop-in interface: a real in-browser embeddings retriever
   (transformers.js / MiniLM) can replace `retrieve` without touching the agent
   or the terminal — same signature, just async.
   ========================================================================== */

import { DOCS, type Doc } from "./knowledge";

export type Hit = { doc: Doc; score: number };

const STOP = new Set([
  "the", "a", "an", "is", "are", "do", "does", "did", "you", "your", "yours", "of", "to",
  "and", "or", "what", "whats", "tell", "me", "about", "i", "in", "on", "for", "with",
  "how", "can", "could", "would", "ever", "have", "has", "any", "please", "give", "show",
  "us", "we", "it", "that", "this", "be", "been", "am", "so", "if", "at", "by",
]);

// Expand a token into related terms so meaning survives paraphrase.
const SYN: Record<string, string[]> = {
  ai: ["ai", "ml", "machine", "learning", "artificial", "intelligence", "model", "models"],
  ml: ["ml", "ai", "machine", "learning", "model"],
  llm: ["llm", "ai", "language", "model", "gpt"],
  neural: ["neural", "deep", "learning", "network"],
  agent: ["agent", "agents", "agentic", "autonomous", "echo"],
  agents: ["agents", "agent", "agentic", "autonomous"],
  rag: ["rag", "retrieval", "embeddings", "vector", "semantic"],
  retrieval: ["retrieval", "rag", "embeddings", "vector"],
  distributed: ["distributed", "scale", "microservices", "grpc", "kafka"],
  hire: ["hire", "hiring", "available", "contact", "recruit", "job", "opportunity"],
  contact: ["contact", "hire", "email", "reach", "connect"],
  experience: ["experience", "career", "work", "history", "roles"],
  projects: ["projects", "work", "built", "shipped", "deployments"],
  skills: ["skills", "stack", "tech", "technologies", "tools"],
  strengths: ["strengths", "why", "best", "good", "value"],
  finland: ["finland", "oulu", "location", "based", "relocate"],
  software: ["software", "engineer", "engineering", "developer", "systems", "build"],
  backend: ["backend", "api", "apis", "server", "rest"],
  frontend: ["frontend", "web", "ui", "react", "mobile"],
  database: ["database", "databases", "sql", "postgres", "data"],
  databases: ["databases", "database", "sql", "postgres", "data"],
  devops: ["devops", "docker", "kubernetes", "cloud", "deploy", "infra"],
  cloud: ["cloud", "aws", "azure", "docker", "kubernetes"],
  language: ["language", "languages", "programming"],
  languages: ["languages", "language", "programming"],
  go: ["go", "golang"],
  finnish: ["finnish", "finland", "language", "speak"],
  speak: ["speak", "language", "english", "urdu", "finnish"],
  available: ["available", "availability", "hire", "contact"],
  observability: ["observability", "monitoring", "grafana", "prometheus", "langfuse"],
};

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));
}

function expand(tokens: string[]): string[] {
  const out = new Set<string>();
  for (const t of tokens) {
    out.add(t);
    for (const s of SYN[t] ?? []) out.add(s);
  }
  return [...out];
}

function scoreDoc(query: string, tokens: string[], doc: Doc): number {
  const q = query.toLowerCase();
  let score = 0;

  // multi-word keyword phrase hits (strong signal)
  for (const kw of doc.keywords) {
    if (q.includes(kw)) score += 3 + kw.length * 0.08;
  }

  // expanded token overlap with the doc's text + keywords
  const hay = new Set(tokenize(`${doc.title} ${doc.text} ${doc.keywords.join(" ")}`));
  for (const t of expand(tokens)) {
    if (hay.has(t)) score += 1;
  }
  return score;
}

/** Default lexical retriever. Returns top-k docs above zero, best first. */
export function retrieve(query: string, k = 3): Hit[] {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  return DOCS.map((doc) => ({ doc, score: scoreDoc(query, tokens, doc) }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
