// Everything the site says lives here. Work entries come from the résumé;
// project numbers come from each repository's README and benchmark results.
// Nothing here is taken from employer or client internal material.

const GH = "https://github.com/SpookyJumpyBeans";

window.SITE = {
  name: "Boyi Dai",
  place: "Charlottesville, VA",
  school: "University of Virginia",
  degree: "B.S. Computer Engineering, Minor in Statistics",
  graduation: "Aug 2024 to May 2028",
  headline: ["Infrastructure, systems,", "and the layer underneath."],
  intro: "Computer Engineering at UVA. I've built cloud alerting at Capital One, benchmarked frontier models for Oracle's public sector group, and an LLM inference engine and a compiler from scratch.",
  bio: [
    "I'm a Computer Engineering student at the University of Virginia, minoring in statistics, interested in systems, infrastructure and compilers. I learn a layer by building it: when a framework does something I can't explain, I write my own version and check it against the real one until they agree.",
    "That habit shows up in how I measure. Results are taken on the machine they ran on, compared within one run, and published whichever way they land.",
  ],
  // Shown as "name [at] domain [dot] edu" so the address is not trivially scraped.
  email: { user: "fpm9tr", domain: "virginia", tld: "edu" },
  links: [
    { label: "GitHub", href: GH },
    // { label: "LinkedIn", href: "https://www.linkedin.com/in/..." },
  ],
  coursework: ["Compilers", "Computer Systems and Organization", "Embedded Computer Systems", "Data Structures and Algorithms", "Digital Logic Design", "Signals and Systems"],
  certifications: ["AWS Certified Cloud Practitioner"],
  programs: ["Databricks BrickFest", "Point72 Academy Spring Sessions"],
  languages: ["Python", "Go", "C/C++", "Rust", "Java", "TypeScript", "SQL", "VHDL"],
  tools: ["AWS", "PostgreSQL", "Docker", "Kubernetes", "Terraform", "React", "Next.js", "Angular", "PyTorch"],
};

// The rotating card in the hero: what is true right now.
window.SIGNAL = [
  { label: "Now", title: "TSG", line: "Director of Technology, since Aug 2026" },
  { label: "Building", title: "nanocompile", line: "Tensor compiler for nanoinfer · phase 3 of 8", progress: 3 / 8 },
  { label: "This summer", title: "Capital One", line: "Software Engineering Intern · Richmond, VA" },
];

window.EXPERIENCE = [
  { company: "Capital One", role: "Software Engineering Intern", detail: "Cloud cost alerting API in Go on AWS",
    dates: "Jun 2026 to Aug 2026", place: "Richmond, VA", href: "#case-capital-one" },
  { company: "TSG (Technology Strategy Group)", role: "Director of Technology", detail: "Promoted from Technology Consultant in Aug 2026. Oracle public sector LLM benchmark; MVPs for YC-backed founders",
    dates: "Aug 2025 to Present", place: "Charlottesville, VA", href: "#case-oracle" },
  { company: "Polylabs", role: "AI Engineering Intern", detail: "TogetherX, a founder product discovery platform, grown to 30+ revenue-generating clients",
    dates: "Aug 2025 to Feb 2026", place: "Palo Alto, CA", href: null },
  { company: "YellowRed Company LLC", role: "Lead Software Engineer", detail: "i.Lab Startup Accelerator: $18K non-dilutive funding, 400+ monthly active users",
    dates: "Jan 2025 to Mar 2025", place: "Charlottesville, VA", href: null },
];

// Selected work: case studies from jobs and client engagements.
window.WORK = [
  {
    id: "capital-one",
    org: "Capital One",
    title: "Cloud cost alerting API",
    year: "2026",
    lede: "An alerting service that tells teams when their cloud spend crosses a line, for more than 20,000 internal users.",
    stats: [
      { value: "20,000+", label: "Internal users" },
      { value: "8", label: "Endpoints across 2 services, one dispatcher" },
      { value: "10", label: "Go workers sending Slack and email alerts" },
      { value: "0", label: "Duplicate emails, with at-least-once delivery" },
    ],
    problem: "Spend dashboards showed what cloud resources cost, but nothing told an owner when that cost crossed a threshold they cared about, on the schedule they cared about.",
    built: "An API in Go on AWS Lambda behind a shared ALB, routing CRUD and scheduled-evaluation endpoints through one event dispatcher, on Postgres through RDS Proxy. Fixed-dollar and period-over-period thresholds on daily, weekly and monthly EventBridge schedules; a pool of 10 workers sending Slack and email alerts, configured from an Angular modal in the spend dashboards; idempotent sends so every alert arrives at least once and never twice.",
    stack: ["Go", "AWS Lambda", "ALB", "EventBridge", "PostgreSQL", "RDS Proxy", "Angular"],
    image: "assets/capital-one.svg",
    caption: "The shape of the system, drawn from its public description.",
  },
  {
    id: "oracle",
    org: "Oracle · via TSG",
    title: "Frontier LLMs for public sector work",
    year: "2026",
    lede: "An independent evaluation, for Oracle's public sector group, of which frontier models fit government and defense workloads.",
    stats: [
      { value: "24", label: "Tasks in a custom defense and government dataset" },
      { value: "8", label: "Domains, from procurement to intelligence analysis" },
      { value: "3", label: "Frontier models: Grok, Gemini, GPT-5.2" },
      { value: "2×", label: "Latency gap measured between models" },
    ],
    problem: "Standard benchmarks test general knowledge and coding. The question here was whether a model can do government work: read an intelligence report, write a cited procurement memo, call the right tools in the right order.",
    built: "With a five-person team, a 24-task benchmark across eight government and defense domains, half reasoning and half agentic, scored on accuracy, reasoning and tool execution, and timed. It measured a 2× latency differential and a wide gap in how reliably the models carried out agentic tasks rather than describing them.",
    stack: ["Benchmark design", "LLM evaluation", "Agentic tool use"],
    image: "assets/oracle.svg",
    caption: "The method. The scores and recommendations stay with the client.",
  },
];

// Projects with a full write-up.
window.CASE_STUDIES = [
  {
    id: "nanoinfer",
    title: "nanoinfer",
    kicker: "LLM inference engine",
    year: "2026",
    lede: "An inference engine for Qwen2.5-0.5B written from scratch: no transformers, no llama.cpp, and NumPy as the only runtime dependency.",
    stats: [
      { value: "1.4×", label: "Faster decode than llama.cpp Q8_0" },
      { value: "+0.13%", label: "INT8 perplexity cost (llama.cpp: +0.87%)" },
      { value: "6.2e-05", label: "Max logit error vs Hugging Face" },
      { value: "728", label: "Tests against the reference" },
    ],
    problem: "Frameworks hide the layer where inference time actually goes. I wanted to know what a token costs, so I wrote that layer myself, from the raw weight file up.",
    built: "A zero-copy mmap loader, a BPE tokenizer exact on 10,000 strings, grouped-query attention, a KV cache and sampling, each checked against Hugging Face before the next began. Then INT8 kernels in Rust with AVX2 that cut the weights 4×, and a live inspection UI streaming attention heatmaps over Server-Sent Events.",
    stack: ["Python", "NumPy", "Rust", "AVX2", "JavaScript"],
    image: "assets/nanoinfer.jpg",
    caption: "The engine's inspection UI: the candidates behind every token.",
    repo: `${GH}/nanoinfer`,
  },
  {
    id: "nanocompile",
    title: "nanocompile",
    kicker: "Tensor compiler · in progress",
    year: "2026",
    lede: "A compiler for the same model nanoinfer runs by hand: a graph IR, fusion, schedules and C code generation, each phase gated on agreement with nanoinfer.",
    stats: [
      { value: "0", label: "Logit difference vs nanoinfer (bitwise)" },
      { value: "62 → 13", label: "Kernels per transformer block" },
      { value: "17× → 1×", label: "Times each cached token is moved per step" },
      { value: "3 / 8", label: "Phases done" },
    ],
    problem: "nanoinfer's kernels are written and tuned by hand. How close does a small compiler get to them, and where can it beat them?",
    built: "A graph IR with symbolic shapes and a NumPy reference interpreter; a loop IR that emits C through gcc, with buffers planned by liveness; and kernel fusion that is bitwise identical to the unfused code. Next: AVX2 schedules, autotuning and INT8.",
    stack: ["Python", "C", "gcc", "AVX2"],
    image: "assets/nanocompile.jpg",
    caption: "Code nanocompile generated: rms_norm, fused into one kernel.",
    repo: `${GH}/nanocompile`,
  },
];

// The index: every project, filterable.
window.PROJECTS = [
  { id: "nanoinfer", title: "nanoinfer", year: 2026, kind: "Project", area: ["Systems", "ML"], stack: ["Python", "Rust"],
    line: "LLM inference engine from scratch. 1.4× faster decode than llama.cpp Q8_0.", image: "assets/nanoinfer.jpg",
    repo: `${GH}/nanoinfer`, live: null },
  { id: "nanocompile", title: "nanocompile", year: 2026, kind: "Project", area: ["Compilers", "ML"], stack: ["Python", "C"],
    line: "Tensor compiler for nanoinfer's model. Fusion bitwise identical to unfused code.", image: "assets/nanocompile.jpg",
    repo: `${GH}/nanocompile`, live: null },
  { id: "tinyquery", title: "tinyquery", year: 2026, kind: "Project", area: ["Data"], stack: ["Python", "Pyodide"],
    line: "SQL engine with a recursive descent parser and Volcano iterators. Hash joins 954× faster than nested loops at 8K rows.", image: "assets/tinyquery.jpg",
    repo: `${GH}/tinyquery`, live: "https://spookyjumpybeans.github.io/tinyquery/" },
  { id: "tinydelta", title: "tinydelta", year: 2026, kind: "Project", area: ["Data"], stack: ["Python"],
    line: "ACID table format: an atomic JSON commit log, time travel and optimistic concurrency.", image: "assets/tinydelta.jpg",
    repo: `${GH}/tinydelta`, live: "https://spookyjumpybeans.github.io/tinyquery/" },
  { id: "toy-cpu", title: "toy-cpu", year: 2025, kind: "Course", area: ["Hardware"], stack: ["VHDL", "FPGA"],
    line: "8-bit CPU from 15 gate-level VHDL entities: 73 ALMs and 67 registers on a Cyclone V, with a cycle-accurate visualizer.", image: "assets/toy-cpu.jpg",
    repo: `${GH}/toy-cpu`, live: "https://spookyjumpybeans.github.io/toy-cpu/" },
  { id: "raptor", title: "RAPTOR", year: 2026, kind: "Course", area: ["Signals"], stack: ["Python", "NumPy"],
    line: "Autotune from scratch: STFT pitch tracking and note quantization. Signals and Systems final project.", image: "assets/raptor.jpg", light: true,
    repo: `${GH}/RAPTOR`, live: null },
  { id: "audio-analyzer", title: "audio-analyzer", year: 2026, kind: "Course", area: ["Hardware", "Signals"], stack: ["KiCad", "Analog"],
    line: "Two-band Sallen-Key analog audio analyzer, built and measured within 3.7% of theory.", image: "assets/audio-analyzer.jpg",
    repo: `${GH}/audio-analyzer`, live: null },
];

window.CONTRIBUTIONS = [
  { repo: "apache/solr", number: 5114, title: "CREATESNAPSHOT reports success when a shard has no active replica", status: "open", date: "2026-10-13" },
  { repo: "scipy/scipy", number: 26079, title: "Remove API reference links from the User Guide index", status: "merged", date: "2026-09-02" },
  { repo: "awslabs/palace", number: 891, title: "Fix validate-config script name in the docs", status: "merged", date: "2026-08-27" },
  { repo: "krateng/maloja", number: 464, title: "Accept /apis/audioscrobbler/2.0 without a trailing slash", status: "open", date: "2026-08-23" },
  { repo: "awslabs/palace", number: 885, title: "Clarify how the elapsed time report is interpreted", status: "merged", date: "2026-08-21" },
  { repo: "krateng/maloja", number: 463, title: "Fix outdated ListenBrainz docs link", status: "open", date: "2026-08-20" },
];
