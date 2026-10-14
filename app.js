// Renders the page from data.js. No framework: the page is static apart from
// the rotating signal card, the index filters, and a fade-in on scroll.

const { SITE, SIGNAL, EXPERIENCE, WORK, CASE_STUDIES, PROJECTS, CONTRIBUTIONS } = window;
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const ext = (href, label) => `<a class="link-arrow" href="${href}" target="_blank" rel="noopener">${esc(label)} ↗</a>`;
const pad = (n) => String(n).padStart(2, "0");
// A company mark: a Simple Icons logo when there is one, else a monogram tile.
const ICONS = "https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons";
function logo(l, size = "") {
  if (!l) return "";
  if (l.icon) return `<span class="logo ${size}" style="background:${l.color}"><img src="${ICONS}/${l.icon}.svg" alt="" style="filter:invert(1)"></span>`;
  if (l.src) return `<span class="logo ${size} ${l.fit || ""}" style="background:${l.bg || "transparent"}"><img src="${l.src}" alt=""></span>`;
  return `<span class="logo ${size} mono" style="background:${l.color}" aria-hidden="true">${esc(l.mark)}</span>`;
}
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// The address is assembled here, so it is not sitting in the HTML for scrapers.
const { user, domain, tld } = SITE.email;
const address = `${user}@${domain}.${tld}`;
const mailto = `mailto:${address}`;

// -- hero --------------------------------------------------------------------

$("hero-name").textContent = SITE.name;
$("kicker").textContent = `${SITE.place} · ${SITE.school} · Computer Engineering`;
// Each word rises in on load, one after another.
let word = 0;
const words = (line) => line.split(" ").map((w) => `<span class="w" style="--i:${word++}">${esc(w)}</span>`).join(" ");
$("headline").innerHTML = `${words(SITE.headline[0])} <span class="soft">${words(SITE.headline[1])}</span>`;
$("hero-email").innerHTML = `<a class="link-arrow" href="${mailto}">${esc(address)}</a>`;
$("nav-links").innerHTML = SITE.links.map((l) => `<a class="keep" href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")
  + `<a class="keep" href="${mailto}">Contact ↗</a>`;

// -- the dot field behind the hero -------------------------------------------
// A faint grid that brightens around the pointer. Static on touch screens and
// for reduced motion.

(() => {
  const canvas = $("dots");
  const ctx = canvas.getContext("2d");
  const GAP = 26, REACH = 170;
  let w = 0, h = 0, px = -1e4, py = -1e4, queued = false;

  function draw() {
    queued = false;
    ctx.clearRect(0, 0, w, h);
    for (let x = GAP / 2; x < w; x += GAP) {
      for (let y = GAP / 2; y < h; y += GAP) {
        const d = Math.hypot(x - px, y - py);
        const t = d < REACH ? 1 - d / REACH : 0;
        ctx.fillStyle = `rgba(237, 237, 237, ${0.13 + 0.6 * t * t})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.9 + 0.9 * t, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };

  function resize() {
    const r = canvas.getBoundingClientRect(), dpr = devicePixelRatio || 1;
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  addEventListener("resize", resize);
  resize();
  if (reducedMotion || !matchMedia("(pointer: fine)").matches) return;
  const shell = canvas.parentElement;
  shell.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    px = e.clientX - r.left; py = e.clientY - r.top;
    request();
  });
  shell.addEventListener("pointerleave", () => { px = py = -1e4; request(); });
})();

// -- the current-signal card -------------------------------------------------

let signalIndex = 0;
let signalTimer = null;
const SIGNAL_MS = 5000;

function renderSignal() {
  const s = SIGNAL[signalIndex];
  $("signal").innerHTML = `
    <div class="now-head"><span>Current signal</span><span>${pad(signalIndex + 1)} / ${pad(SIGNAL.length)}</span></div>
    <button class="now-body" type="button" aria-label="Next signal">
      <span class="now-num">${pad(signalIndex + 1)}</span>
      <span>
        <span class="now-label">${esc(s.label)}</span>
        <span class="now-title">${esc(s.title)}</span>
        <span class="now-line">${esc(s.line)}</span>
        ${s.progress != null ? `<span class="now-mini"><i style="width:${s.progress * 100}%"></i></span>` : ""}
      </span>
    </button>
    <div class="now-bar"><i id="signal-bar"></i></div>`;
  const bar = $("signal-bar");
  if (reducedMotion) { bar.style.width = "100%"; return; }
  bar.style.transition = "none";
  bar.style.width = "0%";
  requestAnimationFrame(() => requestAnimationFrame(() => {
    bar.style.transition = `width ${SIGNAL_MS}ms linear`;
    bar.style.width = "100%";
  }));
}

function advance(step = 1) {
  signalIndex = (signalIndex + step + SIGNAL.length) % SIGNAL.length;
  renderSignal();
  schedule();
}

function schedule() {
  clearTimeout(signalTimer);
  if (!reducedMotion) signalTimer = setTimeout(advance, SIGNAL_MS);
}

$("signal").addEventListener("click", (e) => { if (e.target.closest(".now-body")) advance(); });
$("signal").addEventListener("mouseenter", () => clearTimeout(signalTimer));
$("signal").addEventListener("mouseleave", () => { renderSignal(); schedule(); });
renderSignal();
schedule();

// -- experience --------------------------------------------------------------

$("xp").innerHTML = EXPERIENCE.map((x, i) => {
  const tag = x.href ? "a" : "div";
  return `<li><${tag} class="xp-row" ${x.href ? `href="${x.href}"` : ""}>
    <span class="xp-n">${pad(i + 1)}</span>
    <span class="xp-main"><span class="xp-company">${logo(x.logo)}${esc(x.company)}</span>
      <span class="xp-role">${esc(x.role)}</span><span class="xp-detail">${esc(x.detail)}</span></span>
    <span class="xp-dates">${esc(x.dates)}</span>
    <span class="xp-place">${esc(x.place)}</span>
    <span class="xp-arrow">${x.href ? "↓" : ""}</span></${tag}></li>`;
}).join("");

// -- case studies ------------------------------------------------------------

function caseStudy(c, i, kicker) {
  return `
  <article class="case reveal" id="case-${c.id}">
    <header class="case-head">
      <span class="case-label">${pad(i + 1)} / Deep dive</span>
      ${c.logo ? logo(c.logo, "big") : `<span aria-hidden="true"></span>`}
      <div class="case-heading">
        <div class="case-kicker">${esc(kicker)}</div>
        <h3 class="case-title">${esc(c.title)}</h3>
      </div>
      <span class="case-year">${esc(c.year)}</span>
    </header>
    <div class="case-main">
      <div class="case-text"><p class="case-lede">${esc(c.lede)}</p></div>
      <figure class="case-figure"><img src="${c.image}" alt="${esc(c.caption)}" loading="lazy"><figcaption>${esc(c.caption)}</figcaption></figure>
    </div>
    <div class="stats">${c.stats.map((s) => `<div class="stat"><div class="stat-value">${esc(s.value)}</div><div class="stat-label">${esc(s.label)}</div></div>`).join("")}</div>
    <div class="case-cols">
      <div class="case-col"><h4>Problem</h4>${esc(c.problem)}</div>
      <div class="case-col"><h4>What I built</h4>${esc(c.built)}</div>
      <div class="case-col"><h4>Stack</h4><div class="tags">${c.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
        ${c.repo ? `<div class="case-links">${ext(c.repo, "Code")}</div>` : ""}</div>
    </div>
  </article>`;
}

$("work-cases").innerHTML = WORK.map((c, i) => caseStudy(c, i, c.org)).join("");
$("cases").innerHTML = CASE_STUDIES.map((c, i) => caseStudy(c, i, c.kicker)).join("");

// -- index -------------------------------------------------------------------

const AREAS = ["All", ...new Set(PROJECTS.flatMap((p) => p.area))];
const KINDS = ["All", "Project", "Course"];
const YEARS = ["All", ...[...new Set(PROJECTS.map((p) => p.year))].sort((a, b) => b - a)];
const filter = { area: "All", kind: "All", year: "All" };

function renderFilters() {
  const group = (key, title, values) => `<div class="filter"><h4>${title}</h4>${values.map((v) => {
    const on = String(filter[key]) === String(v);
    return `<button class="${on ? "on" : ""}" data-key="${key}" data-value="${v}" aria-pressed="${on}">[${esc(v)}]</button>`;
  }).join("")}</div>`;
  $("filters").innerHTML = group("area", "Category", AREAS) + group("kind", "Kind", KINDS) + group("year", "Year", YEARS);
}

function renderGrid() {
  const shown = PROJECTS.filter((p) =>
    (filter.area === "All" || p.area.includes(filter.area)) &&
    (filter.kind === "All" || p.kind === filter.kind) &&
    (filter.year === "All" || String(p.year) === String(filter.year)));
  $("grid").innerHTML = shown.length ? shown.map((p) => `
    <article class="tile">
      <a class="tile-img art" href="${p.live || p.repo}" target="_blank" rel="noopener" aria-label="${esc(p.title)}">${window.ART(p.id)}</a>
      <div class="tile-body">
        <div class="tile-top"><span class="tile-title">${esc(p.title)}</span><span class="meta">${p.year} · ${esc(p.kind)}</span></div>
        <div class="tile-line">${esc(p.line)}</div>
        <div class="meta">${p.stack.map(esc).join(" · ")}</div>
        <div class="tile-links">${ext(p.repo, "Code")}${p.live ? ext(p.live, "Live") : ""}</div>
      </div>
    </article>`).join("") : `<div class="empty">[0] Nothing matches those filters.</div>`;
}

$("filters").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-key]");
  if (!b) return;
  filter[b.dataset.key] = b.dataset.value;
  renderFilters();
  renderGrid();
});
renderFilters();
renderGrid();

// -- open source -------------------------------------------------------------

$("prs").innerHTML = CONTRIBUTIONS.map((c, i) => `
  <li><a href="https://github.com/${c.repo}/pull/${c.number}" target="_blank" rel="noopener">
    <span class="n">${pad(i + 1)}</span>
    <span class="repo">${esc(c.repo)} #${c.number}</span>
    <span class="title">${esc(c.title)}</span>
    <span class="status ${c.status}">${c.status}</span>
    <span class="date">${new Date(c.date + "T12:00").toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
    <span class="arrow">↗</span></a></li>`).join("");

// -- about -------------------------------------------------------------------

// How far through the degree, from the start and end months in SITE.graduation.
const [startText, endText] = SITE.graduation.split(" to ");
const month = (t) => { const [m, y] = t.split(" "); return new Date(`${m} 1, ${y}`); };
const start = month(startText), end = month(endText);
const done = Math.min(1, Math.max(0, (Date.now() - start) / (end - start)));
const year = Math.min(4, Math.floor(done * 4) + 1);

const chips = (xs, cls = "") => `<div class="chips ${cls}">${xs.map((x) => `<span>${esc(x)}</span>`).join("")}</div>`;
const rows = (xs) => `<ol class="rows">${xs.map((x, i) => `<li><span class="n">${pad(i + 1)}</span><span>${esc(x.text)}</span><span class="r">${esc(x.right || "")}</span></li>`).join("")}</ol>`;

$("about-body").innerHTML = `
  <div class="card card-intro reveal">
    <h4>About</h4>
    <p class="statement">${esc(SITE.statement)}</p>
    <div class="bio">${SITE.bio.map((b) => `<p>${esc(b)}</p>`).join("")}</div>
  </div>
  <div class="card card-school reveal">
    <h4>Education</h4>
    <p class="school-name">${esc(SITE.school)}</p>
    <p class="sub">${esc(SITE.degree)}</p>
    <p class="class-of">Class of ${end.getFullYear()}</p>
    <div class="progress">
      <div class="progress-bar"><i style="--w:${(done * 100).toFixed(1)}%"></i></div>
      <div class="progress-meta"><span>${esc(startText)}</span><span>Year ${year} of 4</span><span>${esc(endText)}</span></div>
    </div>
  </div>
  <div class="card card-side reveal">
    <h4>Certifications and programs</h4>${rows([...SITE.certifications, ...SITE.programs].map((text) => ({ text })))}
  </div>
  <div class="card card-half reveal">
    <h4>Languages</h4>${chips(SITE.languages)}
    <h4>Tools</h4>${chips(SITE.tools, "dim")}
  </div>
  <div class="card card-half reveal">
    <h4>Coursework</h4>${chips(SITE.coursework)}
  </div>`;

// A soft light that follows the pointer across each card.
document.querySelectorAll(".card").forEach((card) => card.addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
}));

$("footer").innerHTML = `<span>${esc(SITE.name)} · ${new Date().getFullYear()}</span>
  <nav>${SITE.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}
  <a href="${mailto}">Contact ↗</a></nav>`;

// -- motion ------------------------------------------------------------------

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) { entry.target.classList.add("in"); observer.unobserve(entry.target); }
  }
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const nav = document.querySelector(".nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });

// A link straight to a section (…/#work) arrives before the page is drawn,
// so the browser's own jump lands short. Jump again now that it exists.
if (location.hash.length > 1) {
  const target = document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView({ behavior: "instant" });
}
