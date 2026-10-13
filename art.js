// Line drawings for the index tiles: one per project, one style for all.
// Each says what the project is in a single figure, drawn on a 320 × 200
// canvas in the page's own colors, so the grid reads as one set.

window.ART = (() => {
  const INK = "currentColor";
  const W = 320, H = 200;

  const dots = () => {
    let s = "";
    for (let x = 12; x < W; x += 16) for (let y = 12; y < H; y += 16) s += `<circle cx="${x}" cy="${y}" r=".8"/>`;
    return `<g fill="#2a2a2a">${s}</g>`;
  };

  const caption = (text) =>
    `<text x="16" y="188" font-family="JetBrains Mono, Consolas, monospace" font-size="9.5" letter-spacing="1.2" fill="#5c5c5c">${text.toUpperCase()}</text>`;

  const figures = {
    // A causal attention pattern: each token sees itself and everything before it.
    nanoinfer() {
      let s = "";
      const n = 8, cell = 15, x0 = 100, y0 = 26;
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        const seen = c <= r;
        const o = seen ? (c === r ? 0.95 : 0.2 + 0.55 * (((r * 5 + c * 3) % 7) / 7)) : 0;
        s += seen
          ? `<rect x="${x0 + c * cell}" y="${y0 + r * cell}" width="${cell - 3}" height="${cell - 3}" rx="1.5" fill="${INK}" fill-opacity="${o.toFixed(2)}"/>`
          : `<rect x="${x0 + c * cell + .5}" y="${y0 + r * cell + .5}" width="${cell - 4}" height="${cell - 4}" rx="1.5" fill="none" stroke="#2a2a2a"/>`;
      }
      return s + caption("causal attention");
    },
    // Graph IR, then loops, then C.
    nanocompile() {
      const box = (x, label, dashed = false) =>
        `<rect x="${x}" y="72" width="74" height="44" rx="4" fill="#0a0a0a" stroke="${INK}" stroke-width="1.2" ${dashed ? 'stroke-dasharray="3 3"' : ""}/>
         <text x="${x + 37}" y="99" text-anchor="middle" font-family="JetBrains Mono, Consolas, monospace" font-size="11" fill="${INK}">${label}</text>`;
      const arrow = (x) => `<path d="M${x} 94h22" stroke="${INK}" stroke-width="1.2"/><path d="M${x + 17} 90l5 4-5 4" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
      return box(24, "graph") + arrow(102) + box(126, "loops") + arrow(204) + box(228, "C")
        + `<path d="M61 72v-26h202v26" fill="none" stroke="#5c5c5c" stroke-dasharray="2 3"/>`
        + `<text x="160" y="40" text-anchor="middle" font-family="JetBrains Mono, Consolas, monospace" font-size="9.5" fill="#8b8b8b">checked against nanoinfer</text>`
        + caption("graph → loops → c");
    },
    // A query plan: aggregate over a join of two scans.
    tinyquery() {
      const node = (x, y, label) =>
        `<rect x="${x - 40}" y="${y - 12}" width="80" height="24" rx="3" fill="#0a0a0a" stroke="${INK}" stroke-width="1.2"/>
         <text x="${x}" y="${y + 4}" text-anchor="middle" font-family="JetBrains Mono, Consolas, monospace" font-size="10" fill="${INK}">${label}</text>`;
      return `<path d="M160 44v22M160 78v18M160 108l-58 28M160 108l58 28" stroke="#8b8b8b" stroke-width="1.2" fill="none"/>`
        + node(160, 32, "aggregate") + node(160, 72, "filter") + node(160, 104, "hash join")
        + node(102, 146, "scan a") + node(218, 146, "scan b") + caption("query plan");
    },
    // The commit log: versions on a line, the latest one live.
    tinydelta() {
      const heights = [6, 34, 58, 78, 58, 78];
      const labels = ["create", "append", "append", "append", "overwrite", "restore"];
      let s = `<path d="M40 136H286" stroke="#2a2a2a" stroke-width="2"/>`;
      heights.forEach((h, i) => {
        const x = 48 + i * 46, last = i === heights.length - 1;
        s += `<rect x="${x - 9}" y="${126 - h}" width="18" height="${h}" rx="2" fill="${INK}" fill-opacity="${last ? 0.95 : 0.3}"/>
              <circle cx="${x}" cy="136" r="${last ? 4 : 3}" fill="${last ? INK : "#5c5c5c"}"/>
              <text x="${x}" y="156" text-anchor="middle" font-family="JetBrains Mono, Consolas, monospace" font-size="9" fill="${last ? "#ededed" : "#5c5c5c"}">v${i}</text>`;
      });
      return s + caption("commit log, v0 to v5");
    },
    // A DIP package with its pins.
    "toy-cpu"() {
      let pins = "";
      for (let i = 0; i < 8; i++) {
        const x = 104 + i * 16;
        pins += `<path d="M${x} 46v14M${x} 124v14" stroke="${INK}" stroke-width="1.5"/>`;
      }
      return pins + `<rect x="94" y="60" width="132" height="64" rx="4" fill="#0a0a0a" stroke="${INK}" stroke-width="1.4"/>
        <circle cx="108" cy="74" r="3.5" fill="none" stroke="${INK}"/>
        <text x="160" y="97" text-anchor="middle" font-family="JetBrains Mono, Consolas, monospace" font-size="12" fill="${INK}">8-BIT CPU</text>
        <text x="160" y="112" text-anchor="middle" font-family="JetBrains Mono, Consolas, monospace" font-size="9" fill="#8b8b8b">73 ALMs</text>` + caption("structural vhdl");
    },
    // Pitch snapped to a note grid.
    raptor() {
      let grid = "";
      for (let y = 44; y <= 148; y += 13) grid += `<path d="M28 ${y}H292" stroke="#1f1f1f"/>`;
      return grid
        + `<path d="M28 120c22-6 30-34 52-30s20 30 44 6 24-52 48-44 20 36 46 18 22-30 46-34 18 10 28 4" fill="none" stroke="#5c5c5c" stroke-width="1.4"/>`
        + `<path d="M28 122h26v-31h40v15h32v-49h44v39h36v-26h46v-8h40" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`
        + caption("pitch → note grid");
    },
    // Low-pass and high-pass responses crossing at the band edge.
    "audio-analyzer"() {
      return `<path d="M28 64H292" stroke="#2a2a2a" stroke-dasharray="3 3"/>
        <path d="M28 52c60 0 96 0 120 10s44 80 144 90" fill="none" stroke="${INK}" stroke-width="2"/>
        <path d="M28 152c100-10 120-80 144-90s60-10 120-10" fill="none" stroke="#8b8b8b" stroke-width="2"/>
        <text x="292" y="78" text-anchor="end" font-family="JetBrains Mono, Consolas, monospace" font-size="9" fill="#5c5c5c">−3 dB</text>`
        + caption("two-band response");
    },
  };

  return (id) => `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${dots()}${(figures[id] || (() => ""))()}</svg>`;
})();
