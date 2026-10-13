// Everything the site says lives here. Every number is from a README or a
// benchmark recorded in the project's own repository.

const GH = "https://github.com/SpookyJumpyBeans";

window.SITE = {
  name: "Boyi Dai",
  place: "Charlottesville, VA",
  school: "University of Virginia",
  degree: "B.S. Computer Engineering",
  headline: ["Systems, built from scratch", "to understand them."],
  intro: "I write the layer underneath the framework: an LLM inference engine, a tensor compiler for it, a SQL engine, an 8-bit CPU. Each one is checked against a reference before it moves on.",
  bio: [
    "I'm a Computer Engineering student at the University of Virginia, interested in systems, infrastructure and compilers. I learn a layer by building it: when a framework does something I can't explain, I write my own version and check it against the real one until they agree.",
    "That habit shows up in how I measure. Results are taken on the machine they ran on, compared within one run, and published whichever way they land, including the ones that came out slower than I hoped.",
  ],
  interests: ["Systems", "Infrastructure", "Compilers", "ML inference"],
  languages: ["Python", "Rust", "C", "C++", "VHDL", "TypeScript", "JavaScript", "Java"],
  tools: ["NumPy", "WebGPU", "Pyodide", "Jupyter", "FPGA (Cyclone V)", "KiCad", "React", "PostgreSQL"],
  links: [
    { label: "GitHub", href: GH },
    // { label: "LinkedIn", href: "https://www.linkedin.com/in/..." },
    // { label: "Email", href: "mailto:..." },
  ],
  now: { project: "nanocompile", line: "A tensor compiler for nanoinfer", phase: [3, 8], step: "Kernel fusion done; AVX2 schedules next" },
};

window.CASE_STUDIES = [
  {
    id: "nanoinfer",
    title: "nanoinfer",
    kicker: "LLM inference engine",
    year: "2026",
    lede: "An inference engine for a 494M-parameter language model, written from scratch: no transformers, no llama.cpp, and NumPy as the only runtime dependency.",
    stats: [
      { value: "1.44–1.63×", label: "Faster decode than llama.cpp Q8_0" },
      { value: "+0.13%", label: "INT8 perplexity cost (llama.cpp: +0.87%)" },
      { value: "6.2e-05", label: "Max logit error vs transformers" },
      { value: "10k/10k", label: "Tokenizer agreement, exact" },
    ],
    problem: "Frameworks hide the layer where inference time actually goes. I wanted to know what a token costs, so I wrote that layer myself, from the raw weight file up.",
    built: "A BPE tokenizer, the forward pass, a KV cache, sampling, and INT8 and INT4 quantization, each checked against Hugging Face transformers before the next began. Then AVX2 and AVX-VNNI kernels in Rust, and a benchmark against llama.cpp on the same machine, judged with an exact sign test.",
    stack: ["Python", "NumPy", "Rust", "AVX-VNNI", "WebGPU"],
    image: "assets/nanoinfer.jpg",
    caption: "The engine's browser view: the candidates behind every token.",
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

// The index: everything, filterable. `area` drives the category filter.
window.PROJECTS = [
  { id: "nanoinfer", title: "nanoinfer", year: 2026, kind: "Project", area: ["Systems", "ML"], stack: ["Python", "Rust"],
    line: "LLM inference engine from scratch. 1.44–1.63× faster decode than llama.cpp.", image: "assets/nanoinfer.jpg",
    repo: `${GH}/nanoinfer`, live: null },
  { id: "nanocompile", title: "nanocompile", year: 2026, kind: "Project", area: ["Compilers", "ML"], stack: ["Python", "C"],
    line: "Tensor compiler for nanoinfer's model. Fusion bitwise identical to unfused code.", image: "assets/nanocompile.jpg",
    repo: `${GH}/nanocompile`, live: null },
  { id: "tinyquery", title: "tinyquery", year: 2026, kind: "Project", area: ["Data"], stack: ["Python", "Pyodide"],
    line: "SQL engine: parser, iterator plans, hash join, a cost-based planner. Runs in the browser.", image: "assets/tinyquery.jpg",
    repo: `${GH}/tinyquery`, live: "https://spookyjumpybeans.github.io/tinyquery/" },
  { id: "tinydelta", title: "tinydelta", year: 2026, kind: "Project", area: ["Data"], stack: ["Python"],
    line: "Table format: atomic JSON commit log, time travel, optimistic concurrency.", image: "assets/tinydelta.jpg",
    repo: `${GH}/tinydelta`, live: "https://spookyjumpybeans.github.io/tinyquery/" },
  { id: "toy-cpu", title: "toy-cpu", year: 2025, kind: "Course", area: ["Hardware"], stack: ["VHDL", "FPGA"],
    line: "8-bit multi-cycle CPU in structural VHDL. 73 ALMs on a Cyclone V, with a cycle-by-cycle visualizer.", image: "assets/toy-cpu.jpg",
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
