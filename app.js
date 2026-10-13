// Renders the page from data.js. No framework: the page is static apart from
// the rotating signal card, the index filters, and a fade-in on scroll.

const { SITE, SIGNAL, EXPERIENCE, WORK, CASE_STUDIES, PROJECTS, CONTRIBUTIONS } = window;
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const ext = (href, label) => `<a class="link-arrow" href="${href}" target="_blank" rel="noopener">${esc(label)} ↗</a>`;
const pad = (n) => String(n).padStart(2, "0");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// The address is assembled here and shown spelled out, so it is not sitting
// in the HTML for scrapers.
const { user, domain, tld } = SITE.email;
const mailto = `mailto:${user}@${domain}.${tld}`;
const spelled = `${user} [at] ${domain} [dot] ${tld}`;

// -- hero --------------------------------------------------------------------

$("kicker").textContent = `${SITE.place} · ${SITE.school} · Computer Engineering`;
$("headline").innerHTML = `${esc(SITE.headline[0])} <span class="soft">${esc(SITE.headline[1])}</span>`;
$("intro").textContent = SITE.intro;
$("hero-email").innerHTML = `<a class="link-arrow" href="${mailto}">${esc(spelled)}</a>`;
$("nav-links").innerHTML = SITE.links.map((l) => `<a class="keep" href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")
  + `<a class="keep" href="${mailto}">Email ↗</a>`;

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
    <span class="xp-main"><span class="xp-company">${esc(x.company)}</span>
      <span class="xp-role">${esc(x.role)}</span><span class="xp-detail">${esc(x.detail)}</span></span>
    <span class="xp-dates">${esc(x.dates)}</span>
    <span class="xp-place">${esc(x.place)}</span>
    <span class="xp-arrow">${x.href ? "↓" : ""}</span></${tag}></li>`;
}).join("");

// -- case studies ------------------------------------------------------------

function caseStudy(c, i, kicker) {
  return `
  <article class="case reveal" id="case-${c.id}">
    <div class="case-head"><span>${pad(i + 1)} / Case study</span><span>${esc(c.year)}</span></div>
    <div class="case-main">
      <div class="case-text">
        <div class="case-kicker">${esc(kicker)}</div>
        <h3 class="case-title">${esc(c.title)}</h3>
        <p class="case-lede">${esc(c.lede)}</p>
      </div>
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
      <a class="tile-img${p.light ? " light" : ""}" href="${p.live || p.repo}" target="_blank" rel="noopener" aria-label="${esc(p.title)}"><img src="${p.image}" alt="" loading="lazy"></a>
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

$("about-body").innerHTML = `
  <div class="reveal">
    <p class="about-lead">Computer Engineering at UVA. I learn a layer by building it.</p>
    ${SITE.bio.map((b) => `<p>${esc(b)}</p>`).join("")}
  </div>
  <div class="facts reveal">
    <div class="fact"><h4>Education</h4><p>${esc(SITE.school)}</p><p class="sub">${esc(SITE.degree)}<br>${esc(SITE.graduation)}</p></div>
    <div class="fact"><h4>Coursework</h4><p class="sub">${SITE.coursework.map(esc).join(" · ")}</p></div>
    <div class="fact"><h4>Certifications and programs</h4><p class="sub">${[...SITE.certifications, ...SITE.programs].map(esc).join(" · ")}</p></div>
    <div class="fact"><h4>Toolkit</h4><p>${SITE.languages.map(esc).join(" · ")}</p><p class="sub">${SITE.tools.map(esc).join(" · ")}</p></div>
  </div>`;

$("footer").innerHTML = `<span>${esc(SITE.name)} · ${new Date().getFullYear()}</span>
  <nav>${SITE.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}
  <a href="${mailto}">Email ↗</a></nav>`;

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
