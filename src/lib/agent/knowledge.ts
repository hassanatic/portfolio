/* ============================================================================
   AGENT KNOWLEDGE BASE
   Written in Hassan's own voice (first person), for visitors. Human, a little
   funny, no em dashes. `text` + `keywords` drive retrieval; `answer` is what
   gets shown. Every fact traces to reference-docs/.
   ========================================================================== */

import type { OutLine, Tone } from "@/components/terminal/engine";
import { agent } from "@/lib/data";

const L = (text: string, tone: Tone = "out"): OutLine => ({ tone, text });
const H = (text: string): OutLine => ({ tone: "head", text });
const dot = (text: string): OutLine => ({ segments: [{ text: "• ", tone: "data" }, { text, tone: "out" }] });
const row = (k: string, v: string): OutLine => ({ segments: [{ text: k.padEnd(9), tone: "data" }, { text: v, tone: "out" }] });
const link = (k: string, label: string, href: string): OutLine => ({
  segments: [{ text: k.padEnd(7), tone: "data" }, { text: label, tone: "out", href }],
});

export type Doc = {
  id: string;
  title: string;
  keywords: string[];
  text: string;
  answer: OutLine[];
};

export const DOCS: Doc[] = [
  {
    id: "identity",
    title: "Who is Hassan",
    keywords: ["who are you", "who is hassan", "yourself", "introduce", "tell me about you", "about hassan", "your name", "what do you do", "your background", "bio"],
    text: "who is hassan abdullah software ai engineer introduction about yourself name what do you do background bio story",
    answer: [
      { segments: [{ text: agent.name, tone: "head" }, { text: `  ${agent.role}`, tone: "muted" }] },
      L(agent.summary),
      row("based", "Oulu, Finland (originally from Pakistan)"),
      row("focus", agent.focus.join(", ")),
      L("Ask me about my work, my projects, or how to hire me. Or ask something silly and find out what happens.", "muted"),
    ],
  },
  {
    id: "software",
    title: "Software engineering",
    keywords: ["software engineer", "software engineering", "software", "engineer", "developer", "coding", "build software", "systems", "backend developer", "full stack", "fullstack"],
    text: "software engineer engineering developer coding production systems backend full-stack distributed reliable maintainable apis services scale shipping",
    answer: [
      H("Software engineering is my foundation"),
      L("Before the AI buzzwords, I'm a software engineer. I've spent 4+ years shipping and operating real production systems, and I'm comfortable end to end."),
      dot("Backend services and APIs that have to stay up, stay fast, and not lose anyone's money."),
      dot("Full-stack web and mobile, plus the distributed systems and infra underneath."),
      dot("I'm the person teams pull in when a problem crosses stacks and nobody else wants it."),
      L("AI is what I specialise in. Software engineering is how I actually ship it.", "muted"),
    ],
  },
  {
    id: "ai",
    title: "AI / ML experience",
    keywords: ["ai", "ml", "machine learning", "artificial intelligence", "deep learning", "neural", "genai", "generative ai", "llm", "models", "data science"],
    text: "ai ml machine learning artificial intelligence deep learning neural networks llm large language models generative ai pytorch hugging face nlp computer vision applied ml",
    answer: [
      H("The AI side"),
      L("I build LLM agents, multi-agent systems and RAG pipelines, plus the infrastructure to serve and govern models in production."),
      row("agents", "Echo (my personal agent), a multi-agent research system, and a governance layer for coding agents."),
      row("rag", "retrieval, embeddings and grounding, including an enterprise RAG assistant and a research RAG with citations."),
      row("infra", "distributed model serving over gRPC and Kafka, and GPT-2 split across worker nodes with PyTorch RPC."),
      row("ml", "Machine Learning (5/5), Deep Learning, NLP and Machine Vision at MSc level. PyTorch and Hugging Face."),
    ],
  },
  {
    id: "agents",
    title: "Agents and agentic systems",
    keywords: ["agent", "agents", "agentic", "autonomous", "echo", "jarvis", "assistant", "tool use", "mcp", "orchestration", "copilot"],
    text: "ai agents agentic autonomous echo personal assistant jarvis telegram ollama multi-agent orchestration mcp model context protocol tool use claude code gemini cli",
    answer: [
      H("Agents are my favourite thing to build"),
      L("A few I've shipped:"),
      { segments: [{ text: "Echo ", tone: "data" }, { text: "a private, local-first personal agent on Telegram. Runs on Ollama for privacy or Groq and Gemini for speed.", tone: "out" }] },
      { segments: [{ text: "Research swarm ", tone: "data" }, { text: "a multi-agent system that searches, retrieves, summarises and cites papers (RAG plus MCP servers).", tone: "out" }] },
      { segments: [{ text: "Governance ", tone: "data" }, { text: "a runtime layer that keeps autonomous coding agents observable and in line. My thesis, graded 5/5.", tone: "out" }] },
      L("Try 'cat echo' or 'cat thesis' for the details.", "muted"),
    ],
  },
  {
    id: "rag",
    title: "RAG and retrieval",
    keywords: ["rag", "retrieval", "retrieval augmented", "embeddings", "vector", "semantic search", "knowledge base", "citations", "grounding", "pgvector", "langchain"],
    text: "rag retrieval augmented generation embeddings vector search semantic search pgvector reranking citations grounding langchain knowledge base ingestion",
    answer: [
      H("RAG, end to end"),
      L("I've built retrieval systems from ingestion all the way to grounded, citation-tracked answers."),
      dot("A multi-agent research RAG over scientific papers, with MCP servers and vector search."),
      dot("An enterprise RAG knowledge assistant with re-ranking and streaming citations."),
      dot("The API layer behind a RAG chatbot at a fintech company."),
      L("Funny enough, this console you're typing into runs retrieval too. All in your browser, no server.", "muted"),
    ],
  },
  {
    id: "multiagent",
    title: "Multi-agent systems",
    keywords: ["multi agent", "multi-agent", "multiagent", "swarm", "specialized agents", "coordination", "message passing", "concurrency"],
    text: "multi-agent systems swarm specialized agents search retrieval summarize cite coordination concurrency message passing distributed orchestration",
    answer: [
      H("Multi-agent systems"),
      L("At the University of Oulu I built a multi-agent system for scientific literature research, and owned it from the server layer up to the agents."),
      dot("Specialised agents for searching, retrieval, summarising and citing."),
      dot("A RAG pipeline behind them: ingestion, embeddings, retrieval, grounding."),
      dot("MCP servers connecting agents to real tools, with concurrency and message passing across nodes."),
    ],
  },
  {
    id: "distributed",
    title: "Distributed systems and model serving",
    keywords: ["distributed", "distributed systems", "scale", "scaling", "microservices", "grpc", "kafka", "temporal", "rpc", "serving", "inference", "throughput", "latency", "protobuf"],
    text: "distributed systems model serving microservices grpc kafka temporal pytorch rpc inference throughput latency protocol buffers gpt-2 worker nodes kubernetes",
    answer: [
      H("Distributed systems"),
      L("The infrastructure side of things is where I'm happiest."),
      dot("Distributed GPT-2 inference: I split the transformer layers across worker nodes with PyTorch RPC."),
      dot("Distributed LLM serving: gRPC for low-latency calls, Kafka to decouple producers and consumers."),
      dot("Durable Temporal workflows across an 11-service deployment in my thesis."),
    ],
  },
  {
    id: "backend",
    title: "Backend and APIs",
    keywords: ["backend", "back end", "api", "apis", "rest", "graphql", "server", "fastapi", "laravel", "node", "dotnet", ".net", "django", "flask", "microservice"],
    text: "backend apis rest graphql grpc fastapi laravel node.js .net django flask server side authentication jwt 2fa query optimization",
    answer: [
      H("Backend and APIs"),
      L("This is bread and butter for me. I've designed and shipped APIs end to end."),
      row("stacks", "FastAPI, Laravel, .NET, Node.js, Django, Flask."),
      row("apis", "REST and GraphQL, plus gRPC and Protocol Buffers for service-to-service."),
      row("hard", "auth and 2FA for cross-border payments, and heavy query optimisation under live production load."),
    ],
  },
  {
    id: "frontend",
    title: "Frontend, web and mobile",
    keywords: ["frontend", "front end", "web", "ui", "react", "next", "nextjs", "next.js", "tailwind", "mobile", "flutter", "app", "interface", "css"],
    text: "frontend web mobile react next.js tailwind ui ux flutter jetpack compose kotlin android interface responsive this website portfolio",
    answer: [
      H("Frontend, web and mobile"),
      L("I'm full-stack, so I happily live on the frontend too."),
      row("web", "Next.js, React, TypeScript and Tailwind. This site is one of mine, by the way."),
      row("mobile", "Flutter and Dart, plus Kotlin with Jetpack Compose for Android."),
      L("I also did a UX and Usability course at MSc level and got a 5/5, so I promise the buttons work.", "muted"),
    ],
  },
  {
    id: "languages",
    title: "Programming languages",
    keywords: ["languages", "programming languages", "go", "golang", "python", "typescript", "javascript", "php", "c#", "csharp", "kotlin", "dart", "java", "rust", "what languages"],
    text: "programming languages go golang python typescript javascript php c# .net kotlin dart java c c++ sql bash which languages do you use",
    answer: [
      H("Languages I work in"),
      L("I move across languages depending on the job, not the trend."),
      row("daily", "Python, Go, TypeScript and JavaScript."),
      row("also", "PHP, C# / .NET, Kotlin, Dart, SQL and Bash."),
      L("Go and Python are my comfort zone for backend and AI. TypeScript when there's a frontend in play.", "muted"),
    ],
  },
  {
    id: "databases",
    title: "Databases and data",
    keywords: ["database", "databases", "data", "postgres", "postgresql", "mysql", "mongodb", "mongo", "redis", "supabase", "firebase", "sql", "nosql", "vector database", "pgvector", "clickhouse"],
    text: "databases data postgresql mysql mongodb redis supabase firebase pgvector clickhouse drizzle orm query optimization indexing stored procedures",
    answer: [
      H("Databases"),
      row("sql", "PostgreSQL and MySQL, with real query optimisation, indexing and stored-procedure work under load."),
      row("nosql", "MongoDB, Redis, Firebase."),
      row("vector", "pgvector for embeddings, plus ClickHouse for columnar analytics."),
      row("stack", "Supabase and Drizzle ORM on my newer projects."),
    ],
  },
  {
    id: "devops",
    title: "DevOps, cloud and infra",
    keywords: ["devops", "cloud", "docker", "kubernetes", "k8s", "ci", "cd", "ci/cd", "aws", "azure", "gcp", "vercel", "nginx", "linux", "deploy", "infrastructure", "container"],
    text: "devops cloud docker kubernetes ci cd pipelines aws azure gcp vercel nginx linux deployment infrastructure containers observability",
    answer: [
      H("DevOps and cloud"),
      L("I build it, then I keep it running, including the 2am incident part."),
      row("containers", "Docker, Docker Compose and Kubernetes."),
      row("ci/cd", "GitHub Actions, GitLab CI and Jenkins."),
      row("cloud", "Azure and AWS at work, GCP, Vercel and Nginx elsewhere."),
      row("ops", "on-call log analysis and incident response on live systems."),
    ],
  },
  {
    id: "observability",
    title: "Observability",
    keywords: ["observability", "monitoring", "prometheus", "grafana", "langfuse", "tracing", "telemetry", "metrics", "logs", "logging"],
    text: "observability monitoring prometheus grafana langfuse clickhouse tracing telemetry metrics logs logging spans traces opentelemetry",
    answer: [
      H("Observability"),
      L("This whole site is themed as a control plane for a reason. I care a lot about making systems observable."),
      row("stack", "Prometheus and Grafana for metrics, Langfuse for LLM tracing, ClickHouse for storage."),
      L("My thesis is basically observability and governance for AI agents, so this is a genuine soft spot.", "muted"),
    ],
  },
  {
    id: "thesis",
    title: "MSc thesis: AI agent governance",
    keywords: ["thesis", "governance", "metosin", "langfuse", "hooks", "policy", "guardrails", "claude code", "gemini cli", "anomaly", "hallucination", "masters thesis"],
    text: "msc thesis runtime governance observability autonomous ai coding agents metosin langfuse temporal hooks policy enforcement anomaly detection hallucination llm-as-judge guardrails",
    answer: [
      H("My MSc thesis"),
      L("Graded 5/5 (Excellent) at the University of Oulu, done with Metosin, one of Finland's top software consultancies."),
      L("It makes autonomous coding agents (Claude Code, Gemini CLI) observable and policy-governed, without touching the agents themselves. Native hooks feed durable Temporal workflows and Langfuse, plus real-time policy enforcement, anomaly detection, an LLM-as-judge, and hallucination detection."),
      link("repo", "github.com/hassanatic/agentic-governance-thesis", "https://github.com/hassanatic/agentic-governance-thesis"),
      L("Fun fact: the guardrail that blocks 'rm -rf /' in this console is the real policy from that thesis.", "muted"),
    ],
  },
  {
    id: "production",
    title: "Production experience (fintech)",
    keywords: ["production", "fintech", "ace", "money transfer", "remittance", "scale", "millions", "experience at scale", "real users", "banking", "payments"],
    text: "production fintech ace money transfer remittance scale millions of users backend api 2fa security query optimization laravel react next.js .net azure aws ci/cd",
    answer: [
      H("Production, at real scale"),
      L("I spent close to four years at ACE Money Transfer, a global fintech moving international remittances. I started on tickets and became the generalist people pulled in when something crossed teams."),
      dot("Built much of the API layer behind the flagship app, which serves millions of users."),
      dot("Worked end to end across React, Next.js, Laravel and .NET."),
      dot("Built 2FA and account-security flows for cross-border payments, where bugs cost real money."),
      dot("Heavy query optimisation under live load, plus CI/CD on Azure and AWS."),
    ],
  },
  {
    id: "projects",
    title: "Projects overview",
    keywords: ["projects", "portfolio", "built", "shipped", "repos", "github", "deployments", "what have you made", "show me your work", "what have you built"],
    text: "projects portfolio built shipped repositories github deployments work financefile echo distributed gpt-2 llm serving rag doctors",
    answer: [
      H("A few things I've built"),
      dot("Governance and observability for AI agents (my thesis, 5/5)."),
      dot("FinanceFile, a bookkeeping and VAT app, live in production."),
      dot("Echo, a local-first personal AI agent."),
      dot("Distributed GPT-2 inference and distributed LLM serving."),
      dot("A healthcare app, a geolocation API, and more."),
      L("Type 'projects' for the full list, or 'cat <id>' to dig into one.", "muted"),
    ],
  },
  {
    id: "skills",
    title: "Skills and stack",
    keywords: ["skills", "stack", "tech", "technologies", "tools", "what do you use", "tech stack", "toolbox"],
    text: "skills stack technologies languages tools go python typescript pytorch fastapi next.js react docker kubernetes postgres temporal grpc",
    answer: [
      H("My stack, the short version"),
      row("langs", "Go, Python, TypeScript, JavaScript, PHP, C# / .NET, Kotlin, Dart."),
      row("ai", "PyTorch, Hugging Face, LLMs, RAG, MCP, LangChain, Ollama."),
      row("infra", "Docker, Kubernetes, gRPC, Kafka, Temporal, Azure, AWS, Vercel."),
      row("data", "PostgreSQL, MongoDB, Redis, Supabase, pgvector, ClickHouse."),
      L("Type 'skills' for the full system map.", "muted"),
    ],
  },
  {
    id: "experience",
    title: "Career and experience",
    keywords: ["experience", "career", "work history", "jobs", "roles", "employment", "where have you worked", "cv", "resume"],
    text: "experience career work history jobs roles employment metosin university of oulu ace money transfer thesis research assistant software developer",
    answer: [
      H("Where I've worked"),
      row("2026", "Thesis Worker at Metosin, AI-agent governance (5/5)."),
      row("2025", "Research Assistant at the University of Oulu, multi-agent research system."),
      row("2022-25", "Software Developer at ACE Money Transfer, fintech at scale."),
      L("Type 'experience' for the full timeline.", "muted"),
    ],
  },
  {
    id: "education",
    title: "Education",
    keywords: ["education", "degree", "university", "oulu", "gujrat", "gpa", "masters", "msc", "study", "grades", "student", "bachelors"],
    text: "education degree university of oulu gujrat gpa masters msc bachelors computer science engineering applied computing artificial intelligence grades",
    answer: [
      H("Education"),
      row("MSc", "Computer Science and Engineering, University of Oulu. GPA 4.38/5."),
      L("   Applied Computing and AI. Thesis graded 5/5 (Excellent).", "muted"),
      row("BSc", "Software Engineering, University of Gujrat. GPA 3.08/4."),
    ],
  },
  {
    id: "coursework",
    title: "ML coursework and grades",
    keywords: ["coursework", "courses", "grades", "machine learning course", "deep learning course", "nlp course", "computer vision", "marks"],
    text: "coursework courses grades machine learning deep learning nlp natural language processing machine vision distributed systems big data human computer interaction ux",
    answer: [
      H("Relevant coursework (5.0 scale)"),
      row("ai/ml", "Machine Learning (5), Deep Learning (4), Machine Vision (4), NLP (3)."),
      row("systems", "Distributed Systems (3), Big Data (4), IoT (4)."),
      row("design", "Human-Computer Interaction (5), UX and Usability (5), Creative Design (4)."),
    ],
  },
  {
    id: "learning",
    title: "How and where I learned things",
    keywords: [
      "where did you learn", "how did you learn", "where learn", "self taught", "self-taught", "taught yourself",
      "learn aws", "learn azure", "learn cloud", "learn go", "learn python", "learn react", "learn ai", "learn kubernetes", "learn docker",
      "how do you know", "where did you pick", "pick up", "how come you know",
    ],
    text: "where did you learn how did you learn self taught aws azure cloud kubernetes docker go python react ai on the job at ace money transfer university coursework oulu picked up shipping building",
    answer: [
      H("How I learned all this"),
      L("Mostly by shipping. I pick tools up by using them on real things, then backfill the theory afterwards."),
      row("work", "Cloud (AWS and Azure), CI/CD, Docker and most of my backend came from my years at ACE Money Transfer."),
      row("uni", "Machine learning, deep learning, NLP and distributed systems came from my MSc at the University of Oulu."),
      row("solo", "Agents, RAG, Go and most of my side projects are self-taught and built in the open on GitHub."),
      L("Short version: if it's on this site, I learned it by building something real with it.", "muted"),
    ],
  },
  {
    id: "workstyle",
    title: "How I work",
    keywords: ["how do you work", "work style", "collaborate", "team", "process", "code review", "agile", "communication", "soft skills"],
    text: "how do you work work style collaborate team process code review agile scrum spec-driven development communication documentation generalist",
    answer: [
      H("How I work"),
      L("I'm the connector. I tend to be the person who bridges the gaps between teams and stacks that others find awkward."),
      dot("Code reviews, Spec-Driven Development, and documentation that humans (and agents) can actually follow."),
      dot("I care about systems being reliable, observable and clear to whoever maintains them next."),
      dot("Agentic coding workflows are part of my daily toolkit, not a novelty."),
    ],
  },
  {
    id: "why",
    title: "Strengths / why hire me",
    keywords: [
      "why hire", "why hire you", "why should we hire", "should we hire", "should i hire", "hire you", "reasons to hire",
      "why you", "strengths", "good at", "stand out", "what makes you", "superpower", "value add",
    ],
    text: "why hire you should we hire strengths good at best special unique stand out fit value generalist connect the pieces ship end to end ai systems production",
    answer: [
      H("Why me"),
      L("Honestly? I'm the rare combo of three things in one person: AI, distributed systems, and production reliability."),
      dot("I ship end to end, from PyTorch internals and gRPC services to Next.js apps and the observability around them."),
      dot("I've run systems at real scale (millions of users) and built the governance to keep AI agents safe."),
      dot("I learn fast, I document well, and I'm the one who picks up the problem nobody else wants."),
      L("That, and I built a whole talking portfolio instead of a PDF. Effort counts.", "muted"),
    ],
  },
  {
    id: "echo",
    title: "Echo (personal AI agent)",
    keywords: ["echo", "personal agent", "telegram", "ollama", "jarvis", "local-first"],
    text: "echo personal ai agent telegram ollama groq gemini local-first private habits calendar email tasks",
    answer: [
      H("Echo, my personal AI agent"),
      L("A private, local-first agent I talk to on Telegram. It learns my habits, connects to email, calendar and tasks, and runs fully on Ollama for privacy or on Groq and Gemini for speed. Every install is isolated, so the data never leaves your machine."),
      link("repo", "github.com/hassanatic/echo-agent", "https://github.com/hassanatic/echo-agent"),
    ],
  },
  {
    id: "financefile",
    title: "FinanceFile",
    keywords: ["financefile", "finance", "bookkeeping", "vat", "accounting", "saas", "supabase", "live app", "toiminimi"],
    text: "financefile bookkeeping vat accounting finnish sole traders toiminimi omavero next.js supabase live production saas",
    answer: [
      H("FinanceFile, live in production"),
      L("It turns income and expenses into the figures Finnish sole traders actually file: VAT returns, ledgers, a filing calendar. Next.js 16, React 19, Supabase and Drizzle, with per-user isolation via Postgres RLS and an English, Finnish and Swedish interface."),
      link("live", "financefile.vercel.app", "https://financefile.vercel.app/"),
    ],
  },
  {
    id: "gpt2",
    title: "Distributed GPT-2 inference",
    keywords: ["gpt-2", "gpt2", "distributed gpt", "pytorch rpc", "inference system", "split model"],
    text: "distributed gpt-2 inference pytorch rpc transformer layers worker nodes fastapi mongodb kubernetes prometheus grafana",
    answer: [
      H("Distributed GPT-2 inference"),
      L("I split GPT-2's transformer layers across multiple worker nodes using PyTorch RPC. A FastAPI master orchestrates the nodes, serves a chat UI and stores conversations in MongoDB, with Prometheus and Grafana watching it all."),
      link("repo", "github.com/hassanatic/ds_project", "https://github.com/hassanatic/ds_project"),
    ],
  },
  {
    id: "doctors",
    title: "Doctors on Hand",
    keywords: ["doctors", "healthcare", "flutter app", "maps", "geolocation", "final year"],
    text: "doctors on hand healthcare flutter dart firebase google maps geolocation route polylines final year project",
    answer: [
      H("Doctors on Hand"),
      L("A Flutter app that helps patients find nearby doctors using live maps, geolocation and route polylines, backed by Firebase. My final-year project, and proof I've shipped mobile too."),
      link("repo", "github.com/hassanatic/doctorsonhand", "https://github.com/hassanatic/doctorsonhand"),
    ],
  },
  {
    id: "opensource",
    title: "Open source",
    keywords: ["open source", "github", "repos", "repositories", "code public", "your github"],
    text: "open source github repositories public code build in the open distributed llm rag agents",
    answer: [
      H("I build in the open"),
      L("A lot of my systems work lives on GitHub: distributed LLM serving, GPT-2 inference, agents, RAG, and more."),
      link("github", "github.com/hassanatic", "https://github.com/hassanatic"),
    ],
  },
  {
    id: "contact",
    title: "Contact / hire",
    keywords: ["contact", "hire", "hiring", "email", "reach", "available", "availability", "recruit", "job", "opportunity", "connect", "linkedin", "get in touch", "work with you", "talk to you"],
    text: "contact hire hiring email reach available availability recruit job opportunity connect linkedin get in touch escalate human in the loop talk",
    answer: [
      H("Let's talk"),
      L(agent.availabilityLong + ".", "muted"),
      link("email", agent.email, agent.links.email),
      link("link", "linkedin.com/in/hassan-abdullah-dev", agent.links.linkedin),
      link("git", "github.com/" + agent.github, agent.links.github),
      L("Or just hit the Escalate button up top. Same thing, less typing.", "muted"),
    ],
  },
  {
    id: "location",
    title: "Location and availability",
    keywords: ["location", "where", "based", "oulu", "finland", "relocate", "remote", "visa", "authorization", "available", "when", "move", "country"],
    text: "location where based oulu finland relocate remote visa work authorization available full-time europe move country",
    answer: [
      H("Where I am"),
      row("based", "Oulu, Finland."),
      row("work", "Authorized to work in Finland, no visa sponsorship needed."),
      row("avail", agent.availability + ", full-time, open across Finland."),
    ],
  },
  {
    id: "finland",
    title: "Why Finland",
    keywords: ["why finland", "finland", "move to finland", "pakistan to finland", "relocated", "why oulu", "immigrant"],
    text: "why finland oulu pakistan moved relocated msc university studies cold weather northern europe",
    answer: [
      H("Why Finland"),
      L("I came to Oulu for my MSc and stayed for the engineering culture (and, against all advice, the winters). Pakistan to Finland is a big jump, but it's where I went deep on AI and systems work."),
    ],
  },
  {
    id: "spoken",
    title: "Spoken languages",
    keywords: ["spoken languages", "languages you speak", "english", "finnish", "urdu", "speak", "fluent", "do you speak"],
    text: "spoken languages english urdu finnish professional native basic learning suomi",
    answer: [
      H("Languages I speak"),
      row("English", "professional working proficiency."),
      row("Urdu", "native."),
      row("Finnish", "basic and improving. I've survived Survival Finnish, which is exactly as dramatic as it sounds."),
    ],
  },
  {
    id: "volunteering",
    title: "Volunteering and community",
    keywords: ["volunteer", "volunteering", "community", "polar bear pitching", "ubiss", "events", "outside work", "hobbies", "free time"],
    text: "volunteer volunteering community polar bear pitching ubiss summer school startup events outside work hobbies free time",
    answer: [
      H("Outside the code"),
      L("I volunteer at events around Oulu, including UBISS summer school and Polar Bear Pitching, a startup event where founders pitch from a hole cut into a frozen sea. Finland is a lot."),
      L("The rest of my free time is mostly learning Finnish and building side projects I probably didn't need to build.", "muted"),
    ],
  },
  {
    id: "metosin-exp",
    title: "What Metosin was like",
    keywords: ["what was metosin like", "how was metosin", "metosin experience", "what was it like at metosin", "tell me about metosin", "working at metosin", "how is metosin"],
    text: "what was it like at metosin how was metosin experience working consultancy senior team code review spec driven development thesis pretty cool",
    answer: [
      H("Metosin? Pretty great, honestly"),
      L("Small, senior team, proper code reviews, Spec-Driven Development. It's one of Finland's best software consultancies and it showed."),
      L("Best part: they handed me something genuinely novel, governing autonomous AI agents, and trusted me to own it end to end. That's rare, and I didn't waste it."),
    ],
  },
  {
    id: "ace-exp",
    title: "What ACE was like",
    keywords: ["what was ace like", "how was ace", "ace experience", "what was it like at ace", "working at ace", "tell me about ace"],
    text: "what was it like at ace money transfer how was working fintech scale production trial by fire generalist",
    answer: [
      H("ACE was my trial by fire"),
      L("Fintech at scale: real money, real users, real consequences. I learned more there about production reliability than anywhere else."),
      L("I started on tickets and became the person people called when something broke across teams or stacks. Close to four years of that will teach you fast."),
    ],
  },
  {
    id: "oulu-exp",
    title: "What studying in Oulu was like",
    keywords: ["what was oulu like", "how was oulu", "studying in finland", "university experience", "what was it like at oulu", "msc experience", "student life", "how is finland"],
    text: "what was it like at university of oulu studying finland msc experience cold dark research distributed systems machine learning",
    answer: [
      H("Oulu leveled me up"),
      L("It's where I went from 'can code' to 'can build systems'. The MSc pushed me deep into ML, distributed systems and research."),
      L("It's also very cold and very dark in winter, which builds character and excellent focus.", "muted"),
    ],
  },
  {
    id: "weaknesses",
    title: "Weaknesses",
    keywords: ["weakness", "weaknesses", "what are you bad at", "your flaws", "biggest weakness", "what do you struggle with", "areas to improve", "where can you improve"],
    text: "weakness weaknesses what are you bad at flaws struggle improve interview honest timeboxing perfectionism deadline",
    answer: [
      H("My weaknesses (the honest version)"),
      L("I go deep on problems I find interesting, sometimes deeper than the deadline wants. I've gotten a lot better at timeboxing."),
      L("I'd also rather build the robust version than the quick hack. Usually the right call, occasionally not for a tight deadline. I know when to flex it now."),
    ],
  },
  {
    id: "favorite",
    title: "Favourite project",
    keywords: ["favorite project", "favourite project", "most proud", "best project", "proudest", "which project", "favorite work", "favourite work"],
    text: "favorite favourite project most proud best proudest thesis echo this site personal agent",
    answer: [
      H("My favourites"),
      L("The governance thesis is the hardest thing I've built and it got 5/5, so there's real pride there."),
      L("But Echo, my personal agent, is the one I actually use every day. And this site was stupidly, irresponsibly fun to make."),
    ],
  },
  {
    id: "why-site",
    title: "Why I built this site",
    keywords: ["why did you build this", "why this site", "how did you build this", "why a portfolio like this", "what is this site", "who built this site", "how does this work", "how was this made"],
    text: "why did you build this site portfolio agent control plane prove a point pdf resume boring weekend talking",
    answer: [
      H("Why this site exists"),
      L("Because a PDF resume is boring, and I wanted to prove a point: I build AI agents and observable systems, so my portfolio should be one too."),
      L("Also I had a weekend and questionable priorities. Worth it.", "muted"),
    ],
  },
  {
    id: "achievement",
    title: "Biggest achievement",
    keywords: ["biggest achievement", "proudest moment", "accomplishment", "greatest achievement", "what are you proud of", "achievement", "proud of"],
    text: "biggest achievement proudest accomplishment thesis 5/5 production millions moving countries new field",
    answer: [
      H("Proudest of"),
      L("Shipping a 5/5 master's thesis that's actually novel, while having already built production systems used by millions."),
      L("Moving countries and leveling up in a whole new field at the same time wasn't a bad run either."),
    ],
  },
  {
    id: "challenge",
    title: "Hardest problem solved",
    keywords: ["hardest problem", "biggest challenge", "tell me about a hard problem", "difficult problem", "toughest", "hardest thing", "challenge you solved", "hard problem"],
    text: "hardest problem biggest challenge difficult toughest governance observable agents hooks temporal reliability under failure",
    answer: [
      H("The hardest thing I've built"),
      L("Making autonomous AI agents observable and governable without modifying them. Native hooks, durable Temporal workflows, an LLM-as-judge, the whole stack."),
      L("Getting it reliable under infrastructure failure was the real challenge. That's the part that earned the 5/5."),
    ],
  },
];
