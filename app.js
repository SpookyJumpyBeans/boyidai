// Renders the page from data.js. No framework: the page is static apart from
// the index filters and a fade-in as sections scroll into view.

const { SITE, CASE_STUDIES, PROJECTS, CONTRIBUTIONS } = window;
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const ext = (href, label) => `<a class="link-arrow" href="${href}" target="_blank" rel="noopener">${esc(label)} ↗</a>`;
const pad = (n) => String(n).padStart(2, "0");

// -- hero --------------------------------------------------------------------

$("kicker").textContent = `${SITE.place} · ${SITE.school} · Computer Engineering`;
$("headline").innerHTML = `${esc(SITE.headline[0])} <span class="soft">${esc(SITE.headline[1])}</span>`;
$("intro").textContent = SITE.intro;
$("hero-links").innerHTML = SITE.links.map((l) => ext(l.href, l.label)).join("");
$("nav-links").innerHTML = SITE.links.map((l) => `<a class="keep" href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("");

const [done, total] = SITE.now.phase;
$("now").innerHTML = `
  <div class="now-head"><span>Currently</span><span>${pad(done)} / ${pad(total)}</span></div>
  <div class="now-body">
    <div class="now-label">Now building</div>
    <div class="now-title">${esc(SITE.now.project)}</div>
    <div class="now-line">${esc(SITE.now.line)}<br>Phase ${done} of ${total} · ${esc(SITE.now.step)}</div>
  </div>
  <div class="now-bar"><i style="width:${(done / total) * 100}%"></i></div>`;

// -- case studies ------------------------------------------------------------

$("cases").innerHTML = CASE_STUDIES.map((c, i) => `
  <article class="case reveal" id="case-${c.id}">
    <div class="case-head"><span>${pad(i + 1)} / Case study</span><span>${esc(c.year)}</span></div>
    <div class="case-main">
      <div class="case-text">
        <h3 class="case-title">${esc(c.title)}</h3>
        <div class="case-kicker">${esc(c.kicker)}</div>
        <p class="case-lede">${esc(c.lede)}</p>
      </div>
      <figure class="case-figure"><img src="${c.image}" alt="${esc(c.caption)}" loading="lazy"><figcaption>${esc(c.caption)}</figcaption></figure>
    </div>
    <div class="stats">${c.stats.map((s) => `<div class="stat"><div class="stat-value">${esc(s.value)}</div><div class="stat-label">${esc(s.label)}</div></div>`).join("")}</div>
    <div class="case-cols">
      <div class="case-col"><h4>Problem</h4>${esc(c.problem)}</div>
      <div class="case-col"><h4>What I built</h4>${esc(c.built)}</div>
      <div class="case-col"><h4>Stack</h4><div class="tags">${c.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
        <div class="case-links">${ext(c.repo, "Code")}</div></div>
    </div>
  </article>`).join("");

// -- index -------------------------------------------------------------------

const AREAS = ["All", ...new Set(PROJECTS.flatMap((p) => p.area))];
const KINDS = ["All", "Project", "Course"];
const YEARS = ["All", ...[...new Set(PROJECTS.map((p) => p.year))].sort((a, b) => b - a)];
const filter = { area: "All", kind: "All", year: "All" };

function renderFilters() {
  const group = (key, title, values) => `<div class="filter"><h4>${title}</h4>${values.map((v) =>
    `<button class="${String(filter[key]) === String(v) ? "on" : ""}" data-key="${key}" data-value="${v}" aria-pressed="${String(filter[key]) === String(v)}">[${esc(v)}]</button>`).join("")}</div>`;
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
    <div class="fact"><h4>Education</h4><p>${esc(SITE.school)}</p><p class="sub">${esc(SITE.degree)}</p></div>
    <div class="fact"><h4>Interests</h4><p>${SITE.interests.map(esc).join(" · ")}</p></div>
    <div class="fact"><h4>Languages</h4><p>${SITE.languages.map(esc).join(" · ")}</p></div>
    <div class="fact"><h4>Tools</h4><p>${SITE.tools.map(esc).join(" · ")}</p></div>
  </div>`;

$("footer").innerHTML = `<span>${esc(SITE.name)} · ${new Date().getFullYear()}</span>
  <nav>${SITE.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}</nav>`;

// -- motion ------------------------------------------------------------------

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) { entry.target.classList.add("in"); observer.unobserve(entry.target); }
  }
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const nav = document.querySelector(".nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });

// A link straight to a section (…/#index) arrives before the page is drawn,
// so the browser's own jump lands short. Jump again now that it exists.
if (location.hash.length > 1) {
  const target = document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView({ behavior: "instant" });
}
