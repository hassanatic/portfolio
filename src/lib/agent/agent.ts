/* ============================================================================
   AGENT — "understand, retrieve, answer", with personality.
   First it checks for a witty special case (greetings, off-limits questions,
   famous people, do-my-homework). If it's a real question, it retrieves from
   the knowledge base and answers, grounded. No em dashes anywhere a human sees.
   ========================================================================== */

import type { OutLine } from "@/components/terminal/engine";
import { retrieve } from "./retriever";
import { matchSpecial } from "./personality";

export type AgentStep = { kind: "reason" | "tool" | "observe"; text: string };
export type AgentResult = { steps: AgentStep[]; answer: OutLine[]; sources: string[] };

const RELEVANCE_FLOOR = 2.5;

const REASONS = [
  "reading the question",
  "parsing intent, picking a tool",
  "figuring out what you actually mean",
  "routing your question",
];

const FALLBACKS: OutLine[][] = [
  [{ tone: "out", text: "lol I don't actually know that one. Don't tell Hassan, he thinks I'm smart. Try 'projects', 'skills', or 'why hire you'." }],
  [{ tone: "out", text: "Yeah, I've got nothing for that. Hassan clearly forgot to add it to my brain. Ask me about his work or experience instead." }],
  [{ tone: "out", text: "That stumped me, which is honestly embarrassing for an AI. Ask me about his projects, skills or experience and I'll redeem myself." }],
  [{ tone: "out", text: "Drawing a blank here. Either you found my one weakness, or my training data needs a patch. Ask me about his work?" }],
  [{ tone: "out", text: "Hmm. Not in my head. Awkward silence. I'm genuinely great at Hassan facts though, so ask me one of those." }],
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

/** Answer a question. Special-cases first, then grounded retrieval. */
export function ask(query: string): AgentResult {
  const q = query.trim();

  const special = matchSpecial(q);
  if (special) return { steps: special.steps, answer: special.lines, sources: [] };

  const hits = retrieve(q, 3);
  const top = hits[0];

  const steps: AgentStep[] = [
    { kind: "reason", text: rand(REASONS) },
    { kind: "tool", text: `search_knowledge("${truncate(q, 38)}")` },
    {
      kind: "observe",
      text: top ? `${hits.length} source${hits.length > 1 ? "s" : ""} found, best match: ${top.doc.title}` : "nothing solid found",
    },
  ];

  if (!top || top.score < RELEVANCE_FLOOR) {
    return { steps, answer: rand(FALLBACKS), sources: [] };
  }

  return { steps, answer: top.doc.answer, sources: hits.map((h) => h.doc.id) };
}
