// A portfolio laid out like a music app: projects are playlists, their
// phases are tracks, the player bar steps through projects, the queue is the
// roadmap, and upstream pull requests are the liked songs.

const { SITE, PROJECTS, CONTRIBUTIONS, GENRES } = window;
const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// -- icons (drawn for this site) ---------------------------------------------

const ICON = {
  home: '<path d="M3 10.6 12 3l9 7.6V21h-6.5v-6.5h-5V21H3z" fill="currentColor"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="m15.5 15.5 5 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  library: '<path d="M4 3.5v17M9.5 3.5v17M14.5 4.5l5.5 15.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>',
  play: '<path d="M7 4.5v15L19.5 12z" fill="currentColor"/>',
  prev: '<path d="M6 5v14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M19 5 8.5 12 19 19z" fill="currentColor"/>',
  next: '<path d="M18 5v14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M5 5l10.5 7L5 19z" fill="currentColor"/>',
  shuffle: '<path d="M3 7h3.5c4 0 6 10 10 10H21M3 17h3.5c1.6 0 2.8-1.6 3.9-3.6M13.6 9.6C14.7 8 15.6 7 17 7h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="m18.5 4.5 2.5 2.5-2.5 2.5M18.5 14.5l2.5 2.5-2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  queue: '<path d="M4 6h16M4 12h16M4 18h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 15.5v5l4-2.5z" fill="currentColor"/>',
  notes: '<path d="M4.5 4.5h15v11H10l-5.5 4z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M8 8.5h8M8 11.5h5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  back: '<path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  fwd: '<path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5.5H4.5V6H10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  school: '<path d="M2 9.5 12 4.5l10 5-10 5z" fill="currentColor"/><path d="M6 11.6v4.6c3.2 2.6 8.8 2.6 12 0v-4.6M21 10v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  pin: '<path d="M8 3h8l-1.5 6 3.5 3.5V14h-5v7l-1 1-1-1v-7H6v-1.5L9.5 9z" fill="currentColor"/>',
  merge: '<circle cx="7" cy="5.5" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="7" cy="18.5" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 8v8M7 8c0 4 3 4 7.5 4" fill="none" stroke="currentColor" stroke-width="2"/>',
};
const icon = (name, cls = "") => `<svg viewBox="0 0 24 24" class="${cls}" aria-hidden="true">${ICON[name]}</svg>`;

// -- cover art ---------------------------------------------------------------
// Each project gets a generated cover: its two colors and a motif that says
// what it is, the way a playlist cover says what is on it.

function motif(kind) {
  const w = "rgba(255,255,255,";
  switch (kind) {
    case "attention": {      // a causal attention pattern
      let s = "";
      for (let r = 0; r < 6; r++) for (let c = 0; c <= r; c++) {
        const o = c === r ? 0.9 : 0.15 + 0.6 * ((r * 7 + c * 3) % 5) / 5;
        s += `<rect x="${92 + c * 17}" y="${18 + r * 17}" width="14" height="14" rx="2" fill="${w}${o.toFixed(2)})"/>`;
      }
      return s;
    }
    case "pipeline":         // model, compiler, silicon
      return `<rect x="104" y="18" width="70" height="22" rx="5" fill="${w}.85)"/>
        <rect x="104" y="58" width="70" height="22" rx="5" fill="${w}.55)"/>
        <rect x="104" y="98" width="70" height="22" rx="5" fill="none" stroke="${w}.6)" stroke-width="2" stroke-dasharray="4 3"/>
        <path d="M139 42v12M139 82v12" stroke="${w}.7)" stroke-width="2"/>`;
    case "tree": {           // a query plan
      const n = (x, y, o) => `<circle cx="${x}" cy="${y}" r="7" fill="${w}${o})"/>`;
      return `<path d="M140 28 112 62M140 28l28 34M112 62l-16 34M112 62l16 34" stroke="${w}.55)" stroke-width="2.5"/>`
        + n(140, 28, .95) + n(112, 62, .8) + n(168, 62, .6) + n(96, 96, .6) + n(128, 96, .6);
    }
    case "log":              // versions in a commit log
      return [0, 1, 2, 3, 4].map((i) => `<circle cx="104" cy="${24 + i * 22}" r="5" fill="${w}${i === 4 ? .95 : .5})"/>
        <rect x="116" y="${21 + i * 22}" width="${46 + (i * 19) % 30}" height="6" rx="3" fill="${w}.35)"/>`).join("")
        + `<path d="M104 29v84" stroke="${w}.3)" stroke-width="2"/>`;
    case "chip": {           // a DIP package
      let pins = "";
      for (let i = 0; i < 5; i++) pins += `<rect x="${106 + i * 14}" y="20" width="5" height="10" fill="${w}.6)"/><rect x="${106 + i * 14}" y="96" width="5" height="10" fill="${w}.6)"/>`;
      return pins + `<rect x="98" y="30" width="80" height="66" rx="5" fill="${w}.85)"/><circle cx="110" cy="42" r="4" fill="rgba(0,0,0,.25)"/>`;
    }
    case "staircase":        // pitch snapped to notes
      return `<path d="M88 104h16V84h18V96h14V58h16V72h14V34h16" fill="none" stroke="${w}.9)" stroke-width="5" stroke-linejoin="round"/>
        <path d="M88 108c10-6 14-26 30-22s14 18 30-12 14-34 34-40" fill="none" stroke="${w}.35)" stroke-width="2.5"/>`;
    case "bandpass":         // a filter's response
      return `<path d="M86 110c20 0 24-70 52-70s32 70 54 70" fill="none" stroke="${w}.9)" stroke-width="5" stroke-linecap="round"/>
        <path d="M86 58h106" stroke="${w}.35)" stroke-width="2" stroke-dasharray="5 4"/>`;
    case "merge":
      return `<g transform="translate(96 22) scale(3.6)" color="white">${ICON.merge}</g>`;
    default:
      return "";
  }
}

function cover({ colors, motif: kind, title }, { round = false, label = true } = {}) {
  const id = "g" + Math.random().toString(36).slice(2, 8);
  const size = title.length > 11 ? 20 : 25;
  return `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(title)} cover">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs>
    <rect width="200" height="200" fill="url(#${id})"/>
    ${round ? "" : motif(kind)}
    ${label && !round ? `<text x="16" y="178" font-family="Figtree, system-ui, sans-serif" font-weight="800" font-size="${size}" fill="#fff" letter-spacing="-0.5">${esc(title)}</text>` : ""}
    ${round ? `<text x="100" y="118" text-anchor="middle" font-family="Figtree, system-ui, sans-serif" font-weight="800" font-size="56" fill="#fff">BD</text>` : ""}
  </svg>`;
}

const CONTRIB_COVER = { colors: ["#4a2fd1", "#8fd9c0"], motif: "merge", title: "Contributions" };
const ME_COVER = { colors: ["#9b7bf0", "#e8833a"], motif: "", title: SITE.name };
const art = (p, opts) => cover(p, opts);

// -- state -------------------------------------------------------------------

const state = {
  current: SITE.nowPlaying,          // the project in the player bar
  filter: "all",
  showQueue: false,
};

const order = PROJECTS.map((p) => p.id);
const step = (delta) => {
  const i = order.indexOf(state.current);
  const next = order[(i + delta + order.length) % order.length];
  location.hash = `#/p/${next}`;
};

// -- sidebar -----------------------------------------------------------------

function renderLibrary() {
  const filters = [["all", "All"], ["Project", "Projects"], ["Course project", "Course projects"], ["contrib", "Contributions"]];
  $("#chips").innerHTML = filters.map(([key, label]) =>
    `<button class="chip ${state.filter === key ? "on" : ""}" data-filter="${key}">${label}</button>`).join("");

  const route = location.hash;
  const items = [];
  if (state.filter === "all" || state.filter === "contrib") {
    items.push(`<a class="lib-item ${route === "#/contributions" ? "active" : ""}" href="#/contributions">
      <div class="art">${art(CONTRIB_COVER, { label: false })}</div>
      <div><div class="name">Upstream Contributions</div>
      <div class="meta">${icon("pin")}Playlist · ${CONTRIBUTIONS.length} pull requests</div></div></a>`);
  }
  if (state.filter === "all") {
    items.push(`<a class="lib-item ${route === "#/about" ? "active" : ""}" href="#/about">
      <div class="art round">${art(ME_COVER, { round: true })}</div>
      <div><div class="name">${esc(SITE.name)}</div><div class="meta">Artist</div></div></a>`);
  }
  for (const p of PROJECTS) {
    if (state.filter !== "all" && state.filter !== p.type) continue;
    items.push(`<a class="lib-item ${route === `#/p/${p.id}` ? "active" : ""}" href="#/p/${p.id}">
      <div class="art">${art(p, { label: false })}</div>
      <div style="min-width:0"><div class="name">${esc(p.title)}</div>
      <div class="meta">${p.type} · ${p.year}</div></div></a>`);
  }
  $("#library-list").innerHTML = items.join("");
}

// -- views -------------------------------------------------------------------

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? "Good evening" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function card(p) {
  return `<a class="card" href="#/p/${p.id}">
    <div class="art">${art(p)}</div>
    <div class="name">${esc(p.title)}</div>
    <div class="sub">${esc(p.highlight)}</div>
    <span class="play" aria-hidden="true">${icon("play")}</span></a>`;
}

function viewHome() {
  const tiles = [
    `<a class="tile" href="#/p/${SITE.nowPlaying}"><div class="art">${art(byId[SITE.nowPlaying], { label: false })}</div><div class="name">${esc(byId[SITE.nowPlaying].title)}</div><span class="play" aria-hidden="true">${icon("play")}</span></a>`,
    `<a class="tile" href="#/contributions"><div class="art">${art(CONTRIB_COVER, { label: false })}</div><div class="name">Upstream Contributions</div><span class="play" aria-hidden="true">${icon("play")}</span></a>`,
    ...PROJECTS.filter((p) => p.id !== SITE.nowPlaying).slice(0, 4).map((p) =>
      `<a class="tile" href="#/p/${p.id}"><div class="art">${art(p, { label: false })}</div><div class="name">${esc(p.title)}</div><span class="play" aria-hidden="true">${icon("play")}</span></a>`),
  ];
  const projects = PROJECTS.filter((p) => p.type === "Project");
  const courses = PROJECTS.filter((p) => p.type !== "Project");
  return {
    color: byId[SITE.nowPlaying].colors[1],
    html: `<div class="view">
      <h1 class="greeting">${greeting()}</h1>
      <div class="tiles">${tiles.join("")}</div>
      <section class="shelf"><div class="shelf-head"><h2>Made by ${esc(SITE.name.split(" ")[0])}</h2><a href="#/search">Show all</a></div>
        <div class="cards">${projects.map(card).join("")}</div></section>
      <section class="shelf"><div class="shelf-head"><h2>From class</h2></div>
        <div class="cards">${courses.map(card).join("")}</div></section>
      <section class="shelf"><div class="shelf-head"><h2>Browse by topic</h2><a href="#/search">Show all</a></div>
        <div class="genres">${GENRES.slice(0, 4).map(genreTile).join("")}</div></section>
    </div>`,
  };
}

function viewProject(id) {
  const p = byId[id];
  if (!p) return viewMissing();
  state.current = id;
  const [done, total] = p.progress;
  const rows = p.tracks.map((t, i) => {
    const isNow = !t.upcoming && p.tracks[i + 1]?.upcoming;
    return `<tr class="row ${t.upcoming ? "upcoming" : ""} ${isNow ? "now" : ""}">
      <td class="num">${isNow ? '<span class="eq" aria-label="latest"><i></i><i></i><i></i></span>' : i + 1}</td>
      <td><div class="t-title">${esc(t.title)}${t.upcoming ? '<span class="tag-soon">SOON</span>' : ""}</div><div class="t-sub">${esc(t.detail)}</div></td>
      <td class="area-col">${esc(t.area)}</td>
      <td class="result">${esc(t.result || "")}</td></tr>`;
  }).join("");
  const primary = p.live || p.repo;
  const progressText = total > 1 ? `${done} done` : "complete";
  const more = PROJECTS.filter((q) => q.id !== id && q.tags.some((t) => p.tags.includes(t))).slice(0, 5);
  return {
    color: p.colors[0],
    html: `<div class="view">
      <header class="phead">
        <div class="art">${art(p)}</div>
        <div>
          <div class="ptype">${esc(p.type)}</div>
          <h1 class="ptitle">${esc(p.title)}</h1>
          <p class="pdesc">${esc(p.summary)}</p>
          <div class="pmeta"><span class="who"><span class="avatar">BD</span>${esc(SITE.name)}</span>
            <span class="dot">•</span><span class="soft">${p.year}</span>
            <span class="dot">•</span><span class="soft">${p.tracks.length} ${total > 1 ? "phases" : "parts"}, ${progressText}</span></div>
        </div>
      </header>
      <div class="actions">
        <a class="play big" href="${primary}" target="_blank" rel="noopener" aria-label="${p.live ? "Open the live demo" : "Open the repository"}">${icon("play")}</a>
        <a class="icon-btn small" href="${p.repo}" target="_blank" rel="noopener">${icon("code")}Code</a>
        ${p.live ? `<a class="icon-btn small" href="${p.live}" target="_blank" rel="noopener">${icon("external")}Live demo</a>` : ""}
        <a class="icon-btn small" href="#/notes/${p.id}">${icon("notes")}Notes</a>
        <div class="highlight"><b>${esc(p.highlight)}</b>${p.stack.join(" · ")}</div>
      </div>
      <table class="tracks">
        <thead><tr><th class="num">#</th><th>Title</th><th class="area-col">Area</th><th class="result">Result</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${p.canvas ? `<section class="canvas"><img src="${p.canvas}" alt="${esc(p.canvasCaption)}" loading="lazy">
        <div><h3>${esc(p.title)}</h3><p>${esc(p.canvasCaption)}</p><div class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div></div></section>` : ""}
      ${more.length ? `<section class="shelf" style="margin-top:40px"><div class="shelf-head"><h2>More like this</h2></div>
        <div class="cards">${more.map(card).join("")}</div></section>` : ""}
    </div>`,
  };
}

function viewAbout() {
  const merged = CONTRIBUTIONS.filter((c) => c.status === "merged").length;
  const popular = PROJECTS.slice(0, 5).map((p, i) => `<tr onclick="location.hash='#/p/${p.id}'" style="cursor:pointer">
    <td class="num" style="width:32px">${i + 1}</td>
    <td style="width:52px"><div class="art">${art(p, { label: false })}</div></td>
    <td class="t-title">${esc(p.title)}</td><td>${esc(p.highlight)}</td></tr>`).join("");
  return {
    color: "#3a2a6b",
    html: `<div class="view">
      <header class="banner">
        <div class="verified">${icon("school")}${esc(SITE.tagline)}</div>
        <h1>${esc(SITE.name)}</h1>
        <div class="listeners">${PROJECTS.length} projects · ${merged} merged upstream pull requests</div>
      </header>
      <div class="actions">
        <a class="play big" href="#/p/${SITE.nowPlaying}" aria-label="Go to what I am building now">${icon("play")}</a>
        ${SITE.links.map((l) => `<a class="icon-btn small" href="${l.href}" target="_blank" rel="noopener">${icon("external")}${esc(l.label)}</a>`).join("")}
      </div>
      <section class="shelf"><div class="shelf-head"><h2>Popular</h2></div><table class="popular"><tbody>${popular}</tbody></table></section>
      <section class="shelf"><div class="shelf-head"><h2>Appears on</h2></div>
        <div class="cards">${[...new Set(CONTRIBUTIONS.map((c) => c.repo))].map((repo) => `<a class="card" href="#/contributions">
          <div class="art">${art({ ...CONTRIB_COVER, title: repo.split("/")[1] })}</div>
          <div class="name">${esc(repo)}</div>
          <div class="sub">${CONTRIBUTIONS.filter((c) => c.repo === repo).length} pull request(s)</div></a>`).join("")}</div></section>
      <section class="shelf"><div class="shelf-head"><h2>About</h2></div>
        <div class="about-card">${SITE.bio.map((b) => `<p>${esc(b)}</p>`).join("")}
          <div class="chips">${SITE.interests.map((i) => `<span class="chip">${esc(i)}</span>`).join("")}</div></div></section>
    </div>`,
  };
}

function viewContributions() {
  const merged = CONTRIBUTIONS.filter((c) => c.status === "merged").length;
  const rows = CONTRIBUTIONS.map((c, i) => `<tr class="row" onclick="window.open('https://github.com/${c.repo}/pull/${c.number}','_blank','noopener')" style="cursor:pointer">
    <td class="num">${i + 1}</td>
    <td><div class="t-title">${esc(c.title)}</div><div class="t-sub">${esc(c.repo)} #${c.number}</div></td>
    <td class="area-col">${esc(c.repo.split("/")[1])}</td>
    <td class="area-col">${new Date(c.date + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
    <td class="result"><span class="status ${c.status}">${c.status}</span></td></tr>`).join("");
  return {
    color: "#4a2fd1",
    html: `<div class="view">
      <header class="phead">
        <div class="art">${art(CONTRIB_COVER, { label: false })}</div>
        <div><div class="ptype">Playlist</div><h1 class="ptitle">Upstream Contributions</h1>
          <p class="pdesc">Pull requests to other people's projects: a numerical library, an electromagnetics solver from AWS Labs, Apache Solr, a self-hosted music database.</p>
          <div class="pmeta"><span class="who"><span class="avatar">BD</span>${esc(SITE.name)}</span><span class="dot">•</span>
            <span class="soft">${CONTRIBUTIONS.length} pull requests, ${merged} merged</span></div></div>
      </header>
      <table class="tracks" style="margin-top:16px">
        <thead><tr><th class="num">#</th><th>Title</th><th class="area-col">Project</th><th class="area-col">Date</th><th class="result">Status</th></tr></thead>
        <tbody>${rows}</tbody></table>
    </div>`,
  };
}

function genreTile(g) {
  const p = PROJECTS.find((q) => q.tags.includes(g.id));
  return `<a class="genre" href="#/topic/${g.id}" style="background:${g.color}"><span>${esc(g.title)}</span>
    ${p ? `<div class="art">${art(p, { label: false })}</div>` : ""}</a>`;
}

function viewSearch(query = "") {
  const q = query.trim().toLowerCase();
  const hits = q ? PROJECTS.filter((p) =>
    [p.title, p.summary, p.highlight, ...p.stack, ...p.tags, ...p.tracks.map((t) => t.title)].join(" ").toLowerCase().includes(q)) : [];
  return {
    color: "#222",
    html: `<div class="view">
      <label class="searchbox">${icon("search")}<input id="q" placeholder="What do you want to see?" value="${esc(query)}" aria-label="Search projects"></label>
      ${q ? (hits.length ? `<div class="cards">${hits.map(card).join("")}</div>` : `<p class="empty">Nothing matches “${esc(query)}”.</p>`)
          : `<h2 style="font-size:22px;margin:0 0 16px">Browse all</h2><div class="genres">${GENRES.map(genreTile).join("")}</div>`}
    </div>`,
  };
}

function viewTopic(id) {
  const g = GENRES.find((x) => x.id === id);
  if (!g) return viewMissing();
  const list = PROJECTS.filter((p) => p.tags.includes(id));
  return {
    color: g.color,
    html: `<div class="view">
      <header class="phead" style="padding-top:60px"><div><div class="ptype">Topic</div><h1 class="ptitle">${esc(g.title)}</h1>
        <div class="pmeta"><span class="soft">${list.length} project${list.length === 1 ? "" : "s"}</span></div></div></header>
      <div class="cards">${list.map(card).join("")}</div></div>`,
  };
}

function viewNotes(id) {
  // The lyrics view: the project's story, line by line, on its own color.
  const p = byId[id];
  if (!p) return viewMissing();
  state.current = id;
  const lines = [p.summary, p.highlight + ".", ...p.tracks.filter((t) => !t.upcoming).map((t) =>
    `${t.title}: ${t.detail}${t.result ? `, ${t.result}` : ""}.`)];
  if (p.queue) lines.push(`Next: ${p.queue[0]}.`);
  return {
    color: p.colors[0], solid: true,
    html: `<div class="lyrics" style="background:${p.colors[0]}">
      <div class="ptype" style="margin-bottom:24px;color:#fff">Notes · ${esc(p.title)}</div>
      ${lines.map((l, i) => `<p class="line ${i < 2 ? "lit" : ""}">${esc(l)}</p>`).join("")}
      <a class="pill" href="${p.repo}" target="_blank" rel="noopener" style="margin-top:12px">${icon("code")}Read the full write-up</a>
    </div>`,
  };
}

function viewLibrary() {    // the phone's library tab
  return { color: "#222", html: `<div class="view"><h1 class="greeting">Your Library</h1><div class="library-list" id="mobile-lib">${$("#library-list").innerHTML}</div></div>` };
}

function viewMissing() {
  return { color: "#222", html: `<div class="view"><h1 class="greeting">Nothing here</h1><p class="empty">That page does not exist. <a href="#/" style="text-decoration:underline">Go home</a>.</p></div>` };
}

// -- queue and player --------------------------------------------------------

function renderQueue() {
  const p = byId[state.current];
  const i = order.indexOf(state.current);
  const upNext = [1, 2, 3].map((k) => byId[order[(i + k) % order.length]]);
  $("#queue").innerHTML = `<h3>Queue <button class="icon-btn small" data-action="queue" aria-label="Close the queue">✕</button></h3>
    <h4>Now playing</h4>
    <a class="q-item now" href="#/p/${p.id}"><div class="art">${art(p, { label: false })}</div><div><div class="name">${esc(p.title)}</div><div class="meta">${esc(p.highlight)}</div></div></a>
    ${p.queue ? `<h4>Next in ${esc(p.title)}</h4>${p.queue.map((q, k) => `<div class="q-step"><span class="n">${k + 1}</span><span><b>${esc(q)}</b></span></div>`).join("")}` : ""}
    <h4>Next up</h4>
    ${upNext.map((q) => `<a class="q-item" href="#/p/${q.id}"><div class="art">${art(q, { label: false })}</div><div><div class="name">${esc(q.title)}</div><div class="meta">${q.type}</div></div></a>`).join("")}`;
}

function renderPlayer() {
  const p = byId[state.current];
  const [done, total] = p.progress;
  const pct = Math.round((done / total) * 100);
  $("#player").innerHTML = `
    <div class="np"><div class="art">${art(p, { label: false })}</div>
      <div style="min-width:0"><a class="name" href="#/p/${p.id}">${esc(p.title)}</a><div class="by">${esc(SITE.name)} · ${esc(p.type)}</div></div></div>
    <div class="controls">
      <div class="buttons">
        <button class="icon-btn" data-action="shuffle" aria-label="A random project">${icon("shuffle")}</button>
        <button class="icon-btn keep" data-action="prev" aria-label="Previous project">${icon("prev")}</button>
        <a class="main-btn" href="${p.live || p.repo}" target="_blank" rel="noopener" aria-label="Open ${esc(p.title)}">${icon("play")}</a>
        <button class="icon-btn keep" data-action="next" aria-label="Next project">${icon("next")}</button>
        <a class="icon-btn" href="#/notes/${p.id}" aria-label="Notes">${icon("notes")}</a>
      </div>
      <div class="progress" title="${total > 1 ? `Phase ${done} of ${total}` : "Complete"}">
        <span>${total > 1 ? `phase ${done}` : "done"}</span><div class="bar"><i style="width:${pct}%"></i></div><span>${total > 1 ? total : ""}</span>
      </div>
    </div>
    <div class="extras">
      <a class="icon-btn" href="#/notes/${p.id}" aria-label="Notes">${icon("notes")}</a>
      <button class="icon-btn ${state.showQueue ? "on" : ""}" data-action="queue" aria-label="Queue">${icon("queue")}</button>
      <a class="icon-btn" href="${p.repo}" target="_blank" rel="noopener" aria-label="Code">${icon("code")}</a>
    </div>`;
}

// -- routing -----------------------------------------------------------------

function route() {
  const hash = location.hash || "#/";
  const [path, query = ""] = hash.slice(1).split("?");
  const parts = path.split("/").filter(Boolean);
  let view;
  if (parts.length === 0) view = viewHome();
  else if (parts[0] === "p") view = viewProject(parts[1]);
  else if (parts[0] === "about") view = viewAbout();
  else if (parts[0] === "contributions") view = viewContributions();
  else if (parts[0] === "search") view = viewSearch(new URLSearchParams(query).get("q") || "");
  else if (parts[0] === "topic") view = viewTopic(parts[1]);
  else if (parts[0] === "notes") view = viewNotes(parts[1]);
  else if (parts[0] === "library") view = viewLibrary();
  else view = viewMissing();

  const scroll = $("#scroll");
  $("#view").innerHTML = view.html;
  $("#hero").style.background = view.solid ? "none" : `linear-gradient(${view.color}, ${view.color}00 340px)`;
  scroll.scrollTop = 0;
  document.title = parts[0] === "p" && byId[parts[1]] ? `${byId[parts[1]].title} · ${SITE.name}` : SITE.name;

  for (const a of document.querySelectorAll("[data-nav]")) {
    a.classList.toggle("active", a.dataset.nav === (parts[0] || "home"));
  }
  renderLibrary();
  renderPlayer();
  renderQueue();

  bindSearch();
}

// Typing re-renders the results under the box without leaving the page.
function bindSearch() {
  const input = $("#q");
  if (!input) return;
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
  input.addEventListener("input", function onInput() {
    history.replaceState(null, "", `#/search?q=${encodeURIComponent(input.value)}`);
    $("#view").innerHTML = viewSearch(input.value).html;
    bindSearch();
  });
}

// -- events ------------------------------------------------------------------

document.addEventListener("click", (e) => {
  const chip = e.target.closest("[data-filter]");
  if (chip) { state.filter = chip.dataset.filter; renderLibrary(); return; }
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "prev") step(-1);
  if (action === "next") step(1);
  if (action === "shuffle") {
    const others = order.filter((id) => id !== state.current);
    location.hash = `#/p/${others[Math.floor(Math.random() * others.length)]}`;
  }
  if (action === "queue") {
    state.showQueue = !state.showQueue;
    $(".app").classList.toggle("show-queue", state.showQueue);
    renderPlayer();
  }
  if (action === "back") history.back();
  if (action === "fwd") history.forward();
});

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea")) return;
  if (e.key === "ArrowRight" && e.altKey) step(1);
  if (e.key === "ArrowLeft" && e.altKey) step(-1);
  if (e.key === "/") { e.preventDefault(); location.hash = "#/search"; }
});

$("#scroll").addEventListener("scroll", (e) => {
  $(".topbar").classList.toggle("solid", e.target.scrollTop > 60);
});

window.addEventListener("hashchange", route);
route();
