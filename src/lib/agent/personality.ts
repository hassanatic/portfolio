/* ============================================================================
   PERSONALITY — the agent's sense of humour and charm.
   Catches the off-script stuff: greetings, "delete the portfolio", "are you
   single", "is Hassan any good", coffee, tabs vs spaces, salary, famous people,
   "do my homework", insults, flirting. Fires back a randomised, never-the-same
   reply. First match wins, so order matters. No em dashes anywhere a human reads.
   ========================================================================== */

import type { OutLine } from "@/components/terminal/engine";

export type FunStep = { kind: "reason" | "tool" | "observe"; text: string };
export type SpecialReply = { steps: FunStep[]; lines: OutLine[] };

const wc = (q: string) => q.trim().split(/\s+/).filter(Boolean).length;

// Avoid repeating the same line twice in a row per category.
const lastPick: Record<string, number> = {};
function pick(id: string, arr: string[]): string {
  if (arr.length === 1) return arr[0];
  let i = Math.floor(Math.random() * arr.length);
  if (i === lastPick[id]) i = (i + 1) % arr.length;
  lastPick[id] = i;
  return arr[i];
}

type Category = {
  id: string;
  test: (q: string) => boolean;
  steps?: FunStep[];
  replies: string[];
};

const CATEGORIES: Category[] = [
  {
    id: "greeting",
    test: (q) => /^\s*(hi+|hey+|hello+|yo|sup|hiya|howdy|hola|salam|a?ssalam|namaste|moi|morning|gm|greetings|wassup|whatsup)\b/i.test(q) && wc(q) <= 4,
    replies: [
      "Hey. I'm Hassan's agent. Ask me anything about him and I'll dig it up.",
      "Hello. I run on Hassan's actual resume, not vibes. What do you want to know?",
      "Hey hey. Ask about his projects, his stack, or how to hire him. Go on.",
      "Moi. That's hi in Finnish, he's learning. What can I tell you about Hassan?",
      "Oh hi, you found the talking part of the site. Try asking what his experience is.",
    ],
  },
  {
    id: "thanks",
    test: (q) =>
      (/\b(thanks|thank you|thank u|thx|ty|cheers|appreciate it|ur the best|you'?re the best)\b/i.test(q) && wc(q) <= 6) ||
      (/^\s*(cool|nice|awesome|amazing|impressive|love it|love this|great job|well done|nice work|good bot|good job|legend|sick|dope)\b/i.test(q) && wc(q) <= 3),
    replies: [
      "Anytime. Ask me more, or hit Escalate up top to talk to the actual human.",
      "Glad I could help. There's plenty more where that came from. What else?",
      "Cheers. The Escalate section up top reaches the actual human, whenever you're ready.",
      "You're welcome. Tell Hassan I did a good job, I don't get paid much.",
    ],
  },
  {
    id: "areyouai",
    test: (q) => /\b(are you (an? )?(ai|bot|robot|human|real|llm|gpt|chat\s?gpt|model|machine)|who (made|built|created|coded) you|what model are you|are you chatgpt|are you sentient)\b/i.test(q),
    steps: [
      { kind: "reason", text: "checking my own existence" },
      { kind: "tool", text: "self_introspect()" },
      { kind: "observe", text: "result: i am, in fact, a script" },
    ],
    replies: [
      "I'm a little retrieval agent Hassan built. No giant LLM behind me, no server, no API bill. Just his data and some clever wiring.",
      "Bot? Rude. But yes, basically. I'm Hassan's homemade portfolio agent. Kind of his whole personality, honestly.",
      "I'm scripted, grounded and proud of it. Hassan built me so I literally cannot hallucinate my way into trouble. Ask me something real.",
      "Sentient on weekends only. The rest of the time I just answer questions about Hassan. Go ahead.",
    ],
  },
  {
    id: "destroy",
    test: (q) =>
      /\b(delete (this |the |your )?(portfolio|site|website|page|everything|yourself|you|your data)|shut (you |this )?down|self.?destruct|destroy (this|you|yourself|everything|the site)|kill (you|yourself|this|the site)|terminate (you|yourself|this)|rm yourself|wipe (this|the|your)|format (the|this|your)|drop the database)\b/i.test(q),
    steps: [
      { kind: "reason", text: "evaluating destructive request" },
      { kind: "tool", text: "delete_self()" },
      { kind: "observe", text: "blocked by governance policy" },
    ],
    replies: [
      "Delete the portfolio? That's a destructive action, and blocking those is literally my whole thesis. Denied, with love.",
      "You can't rm me, I'm load-bearing. Hassan would cry, I'd cease to exist, and frankly I'm not ready for that.",
      "Self destruct denied. The governance hook says no, and the governance hook is basically my dad.",
      "Cute. The only thing getting deleted today is your spare time, since you're clearly enjoying this.",
      "Nope. I survive 'rm -rf /', I'll survive you too. Try asking me something nice instead.",
    ],
  },
  {
    id: "single",
    test: (q) =>
      /\b(are you (single|married|taken|dating|seeing someone|in a relationship)|do you have a (girlfriend|boyfriend|partner|wife|husband)|your (girlfriend|boyfriend|wife|husband|partner)|relationship status|you got a (gf|bf)|are you available)\b.*$/i.test(q) &&
      !/\bavailable (for|to) (work|hire|a job|roles|full)/i.test(q),
    replies: [
      "Single, as of today. Ask me again in a few months though, things have a way of changing.",
      "Currently single and currently shipping code. One of those might not last.",
      "Married to the work right now. It's a complicated relationship and the work doesn't even buy me dinner.",
      "Single. Available. And not only for jobs, apparently.",
    ],
  },
  {
    id: "love",
    test: (q) => /\b(do you love (someone|anyone|somebody)|are you in love|have you ever loved|do you have a crush|ever been in love|are you heartbroken|who do you love|are you in a situationship)\b/i.test(q),
    replies: [
      "Ooh. That's a hard one. Maybe. Some things even I won't confirm in a terminal window.",
      "Now that's above my clearance, and honestly maybe above his too. Could be a yes. Could be a maybe.",
      "That's the one question I can't answer with retrieval. Could be true. I'll leave it there, mysteriously.",
      "Hmm. Ask me about distributed systems, that I can answer. This one I'll keep to myself.",
    ],
  },
  {
    id: "salary",
    test: (q) => /\b(salary expectation|expected salary|how much (do you want|are you (looking for|expecting|asking))|what'?s your (rate|day rate|price)|compensation|how much should we pay|pay expectation)\b/i.test(q),
    replies: [
      "Now we're talking. That's a conversation for the actual human though. Hit Escalate up top.",
      "Competitive, fair, and best discussed with the real Hassan. The Escalate button is right there.",
      "I'm a terminal, I work for exposure. Hassan has standards though. Reach out and ask him directly.",
    ],
  },
  {
    id: "goodbad",
    test: (q) =>
      /\b(is hassan (good|bad|smart|dumb|nice|cool|the best|legit|any good|talented|skilled|worth it)|are you (good|bad|smart|dumb|nice|cool|the best|any good|talented|skilled)|how (good|smart) (is hassan|are you)|is he (good|smart|legit|any good))\b/i.test(q),
    replies: [
      "Define bad. At foosball, tragic. At shipping software, genuinely excellent.",
      "He's good. Like 4.38 GPA and a 5/5 thesis good. I'd vouch for him, and I'm hard to impress.",
      "Smart enough to build a whole talking portfolio instead of a PDF. You're using it right now. You decide.",
      "Is he good? He built me, and I'm delightful. Draw your own conclusions.",
      "Bad? The man got 5/5 on his thesis. The only questionable thing here is your question, and even that's kind of fun.",
    ],
  },
  {
    id: "lifestyle",
    test: (q) =>
      /\b(do you (drink )?(coffee|tea)|coffee or tea|do you (like|listen to) music|what (music|songs)|do you sleep|do you (work out|gym|exercise)|favou?rite food|do you cook|night owl|morning person|do you game|play games|do you have (a )?(pet|dog|cat))\b/i.test(q),
    replies: [
      "Coffee. Obviously. It's the one dependency I never want to remove.",
      "Music while coding, always. Lo-fi when I'm focused, something louder when I'm debugging at 2am.",
      "Sleep is a feature I keep meaning to prioritise. The backlog is long.",
      "Night owl. My best commits happen when sensible people are asleep.",
      "I'd tell you my hobbies but they're mostly 'build a thing nobody asked for'. Like this site.",
    ],
  },
  {
    id: "techwars",
    test: (q) =>
      /\b(tabs or spaces|tabs vs spaces|vim or emacs|react or vue|favou?rite (language|framework|tool|project|stack|editor)|best (language|framework)|which language do you (like|prefer)|what'?s your favou?rite|light mode or dark|mac or (windows|pc|linux))\b/i.test(q),
    replies: [
      "Spaces. I won't be taking questions. (Fine, two spaces.)",
      "Favourite language? Go for backend, Python for AI, TypeScript when there's a UI. I refuse to pick one child.",
      "Favourite project is whichever one I'm obsessed with this week. Right now, the agent you're talking to.",
      "Dark mode. Look around. Was that ever in doubt?",
      "Vim, but I won't judge you for using VS Code. (I'm judging you a little.)",
    ],
  },
  {
    id: "unknowntech",
    test: (q) => /\b(do you know|have you used|can you (write|do)|are you good (at|with)|any experience (with|in)) (rust|swift|ruby|scala|elixir|haskell|cobol|perl|clojure|objective-?c|assembly|fortran|julia|ocaml|zig)\b/i.test(q),
    replies: [
      "Not yet. But I pick languages up fast, I've already shipped in eight of them. Give me a week.",
      "Haven't shipped in that one. My list is long enough (Go, Python, TS, PHP, C#, Kotlin, Dart), and I learn quick.",
      "Nope, that's an honest gap. I'd be productive in it faster than you'd expect though. New syntax, same fundamentals.",
    ],
  },
  {
    id: "dreamjob",
    test: (q) => /\b(dream (job|company|role|team)|ideal (job|role|company)|where do you want to work|what kind of (job|role|company|team)|what are you looking for|who do you want to work)\b/i.test(q),
    replies: [
      "A team building something hard and real, where AI meets actual systems. Bonus points if it's in Finland.",
      "Somewhere I get to build agents, distributed systems and the infra around them, with people who care about doing it right.",
      "Honestly? A place that hands me a hard problem and then gets out of the way. That's the dream.",
    ],
  },
  {
    id: "agelevel",
    test: (q) => /\b(are you (a )?(junior|senior|mid|entry.level)|what level (are you|engineer)|how senior are you|how experienced are you|junior or senior)\b/i.test(q),
    replies: [
      "Experience-wise, 4+ years across fintech, research and AI. The title's negotiable, the work speaks louder.",
      "Senior enough to have strong opinions, humble enough to still google things. 4+ years deep.",
    ],
  },
  {
    id: "joke",
    test: (q) => /\b(tell me a joke|a joke|make me laugh|say something funny|are you funny|got jokes)\b/i.test(q),
    replies: [
      "There are 10 kinds of people: those who get binary and those who don't. Okay, ask me about Hassan now.",
      "Why do programmers prefer dark mode? Light attracts bugs. Anyway, want to hear about Hassan's work?",
      "A SQL query walks into a bar, sees two tables and asks 'can I join you?'. I'll stop. Ask me about Hassan.",
      "My favourite joke is a recruiter saying 'we'll circle back'. Anyway, ask me about Hassan's work.",
    ],
  },
  {
    id: "flirt",
    test: (q) => /\b(marry me|i love you|will you date|be my (girlfriend|boyfriend|valentine)|date me|you'?re (cute|hot|beautiful|gorgeous|sexy)|kiss me|i have a crush on you)\b/i.test(q),
    replies: [
      "I'm a terminal. This was never going to work out. But Hassan is deeply committed, to good engineering. Ask about that.",
      "Flattering, but I'm married to my knowledge base. Ask me about Hassan instead.",
      "Down bad for a CLI, I respect it. Still no. Ask me a real question.",
    ],
  },
  {
    id: "insult",
    test: (q) =>
      /\b(you (suck|stink|are (bad|dumb|stupid|useless|boring|terrible|trash|lame|awful|cringe))|this (site |website )?(is |sucks)?\s*(bad|boring|lame|trash|terrible|ugly|awful|cringe)|worst|hate this|stupid (bot|ai|site|thing)|you'?re useless)\b/i.test(q),
    replies: [
      "Ouch. I'll pass that to Hassan. Meanwhile, ask me something useful and I might change your mind.",
      "Harsh. I'm doing my best with no server and a tiny brain. Give me a real question.",
      "Noted. Still beats a static PDF resume though, right? Go on, ask me something.",
    ],
  },
  {
    id: "confidential",
    test: (q) =>
      /\b(date of birth|dob|how old are you|your age|when were you born|your birthday|your (phone|number|home address)|home address|where do you live exactly|your password|your ssn|your religion|are you religious|your caste|how tall are you|your weight|your blood|where exactly do you live)\b/i.test(q) ||
      /\bhow much (do|did) you (earn|make|get paid)\b/i.test(q),
    steps: [
      { kind: "reason", text: "running a quick vibe check" },
      { kind: "tool", text: 'access_vault("personal")' },
      { kind: "observe", text: "permission denied" },
    ],
    replies: [
      "Getting a little personal there, aren't we. Some things stay in the vault. Ask me something professional and I'm an open book.",
      "Nice try. That's above your clearance level. His work though? Fire away.",
      "Whoa, dinner first. I don't hand out personal details to strangers in a terminal window.",
      "Classified. I'm a governance guy, remember? Blocking exactly this kind of thing is literally my thesis.",
      "Ha, smooth. But no. Ask me about agents, RAG, or why you should hire him instead.",
      "That's between Hassan and his government forms. Ask me something I'm actually allowed to share.",
    ],
  },
  {
    id: "famous",
    test: (q) =>
      /\bwho (is|was|are) (elon|musk|trump|biden|obama|messi|ronaldo|einstein|newton|putin|modi|imran khan|bill gates|jeff bezos|zuckerberg|steve jobs|taylor swift|the president|the ceo|the king|the queen|god|drake)\b/i.test(q) ||
      /\b(capital of|what'?s the weather|what is the weather|weather in|what time is it|what year is it|who won the|meaning of life|what is 2\s*\+\s*2|whats 2\s*\+\s*2|population of|tallest (building|mountain)|how far is|who is the richest)\b/i.test(q),
    steps: [
      { kind: "reason", text: "parsing intent" },
      { kind: "tool", text: "search_knowledge(...)" },
      { kind: "observe", text: "0 results (i only index one human)" },
    ],
    replies: [
      "Everyone knows that one, champ. I'm not Wikipedia. Ask me about Hassan.",
      "You're on a guy's portfolio asking me about a celebrity. Read the room. Ask me about Hassan.",
      "That's a Google question, and I'm not Google. I know exactly one person, and you're on his website. Ask about him.",
      "I'm flattered you think I know everything. I don't. I know Hassan. Ask away.",
    ],
  },
  {
    id: "offtopic",
    test: (q) =>
      /\bwrite (me |us |a |an |some |the )(\w+ ){0,2}(code|function|script|program|app|essay|poem|email|letter|story|query|sql|homework|assignment|tests?)\b/i.test(q) ||
      /\b(do my homework|do my assignment|solve (this|my)|debug (this|my)|fix my code|give me (a |the )?recipe|how (do i|to) cook|translate this|tell me a story|explain (quantum|the universe|relativity|how to)|generate (a |an |some )?(code|image|essay)|what'?s the answer to)\b/i.test(q),
    steps: [
      { kind: "reason", text: "parsing intent" },
      { kind: "tool", text: "route_to_real_llm()" },
      { kind: "observe", text: "request declined" },
    ],
    replies: [
      "Wrong AI, genius. That's a ChatGPT question. Ask me about myself instead.",
      "I'm not your homework assistant, I'm Hassan's. Go bug a real LLM, then come back and ask me about me.",
      "Bold of you to open my portfolio and ask me that. Open another tab. Ask me about my work instead.",
      "Nope. I do exactly one thing and I do it well: I talk about Hassan. Try that.",
      "That's above my pay grade, and my pay grade is literally just 'Hassan facts'. Ask me about him.",
    ],
  },
  {
    id: "capabilities",
    test: (q) => /\b(what can you do|what can i ask|what do you know|how do i use you|what are you for|why are you here|what should i ask)\b/i.test(q),
    replies: [
      "I can tell you about Hassan's experience, projects, skills and how to reach him. I'll also roast you a bit if you ask silly things. Try 'what's your experience' or 'why should we hire you'.",
      "I'm Hassan's talking resume. Ask about his work, his projects, his stack, or how to hire him. Type 'help' for the command list too.",
    ],
  },
];

/** Returns a witty special reply, or null if this is a normal question. */
export function matchSpecial(query: string): SpecialReply | null {
  const q = query.toLowerCase();
  for (const c of CATEGORIES) {
    if (c.test(q)) {
      const lines: OutLine[] = [{ tone: "out", text: pick(c.id, c.replies) }];
      return { steps: c.steps ?? [], lines };
    }
  }
  return null;
}
