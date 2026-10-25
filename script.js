(() => {
  "use strict";

  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const syncThemeButton = () => {
    if (!themeBtn) return;
    const dark = root.dataset.theme !== "light";
    themeBtn.textContent = dark ? "☀️" : "🌙";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  };
  syncThemeButton();
  themeBtn?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) { /* private mode */ }
    syncThemeButton();
  });

  const N = 8; // leaves; root covers [0, N-1]
  const INTERNAL = N - 1;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const STEP_MS = () => (reduceMotion.matches ? 0 : 380);

  // Heap-indexed nodes: 1 = root, children of i are 2i and 2i+1.
  const META = {
    1: { label: "lazybit7" },
    2: { label: "pro" },
    3: { label: "fun" },
    4: { label: "about", section: "about" },
    5: { label: "resume", section: "resume" },
    6: { label: "sports", section: "sports" },
    7: { label: "photos", section: "photos" },
    8: { emoji: "📍", fact: "based in Sunnyvale, CA" },
    9: { emoji: "🧑‍💻", fact: "Staff Software Engineer @ LinkedIn" },
    10: { emoji: "📣", fact: "10+ years in ads · AMA" },
    11: { emoji: "📜", fact: "Inventor! U.S. Patent 10,997,624", href: "https://patents.google.com/patent/US10997624B2/en" },
    12: { emoji: "🏸", fact: "badminton · tennis · table tennis" },
    13: { emoji: "⛷️", fact: "learning to ski" },
    14: { emoji: "📷", fact: "photos: first frames coming soon" },
    15: { emoji: "📝", fact: "photography notes: coming soon" },
  };

  const tree = document.getElementById("tree");
  if (!tree) return;
  const svg = tree.querySelector(".tree-edges");
  const logEl = document.getElementById("log");
  const countEl = document.getElementById("push-count");

  const depthOf = (i) => Math.floor(Math.log2(i));
  const isLeaf = (i) => i >= N;
  const rangeOf = (i) => {
    const d = depthOf(i);
    const span = N >> d;
    const lo = (i - (1 << d)) * span;
    return [lo, lo + span - 1];
  };
  const fmt = (i) => `[${rangeOf(i).join(",")}]`;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const nodes = {};
  const edges = {};
  let pending;
  let fresh;
  let pushes;

  function build() {
    const levels = Math.log2(N) + 1;
    for (let i = 1; i < 2 * N; i++) {
      const d = depthOf(i);
      const x = ((i - (1 << d) + 0.5) / (1 << d)) * 100;
      const y = 10 + (d * 80) / (levels - 1);
      const meta = META[i];

      if (i > 1) {
        const p = i >> 1;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", nodes[p].x);
        line.setAttribute("y1", nodes[p].y);
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
        line.classList.add("edge");
        svg.appendChild(line);
        edges[i] = line;
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "node";
      btn.style.left = `${x}%`;
      btn.style.top = `${y}%`;
      btn.dataset.node = i;
      if (i === 1) btn.classList.add("is-root");
      if (meta.section) btn.classList.add("is-section");

      if (isLeaf(i)) {
        btn.classList.add("is-leaf");
        btn.innerHTML = `<span class="leaf-value">?</span>`;
      } else {
        btn.innerHTML =
          `<span class="node-label">${meta.label}</span>` +
          `<span class="node-range">${fmt(i)}</span>` +
          `<span class="node-tag" aria-hidden="true">+lazy</span>`;
      }
      btn.addEventListener("click", () => enqueue(i, { scroll: true }));
      tree.appendChild(btn);
      nodes[i] = { el: btn, x, y };
    }
  }

  function label(i) {
    const meta = META[i];
    const state = pending.has(i) ? "pending lazy tag" : fresh.has(i) ? "up to date" : "stale";
    if (isLeaf(i)) {
      return fresh.has(i) ? `Leaf ${rangeOf(i)[0]}: ${meta.fact}` : `Leaf ${rangeOf(i)[0]}: not loaded yet`;
    }
    const what = meta.section ? `, opens ${meta.label} section` : "";
    return `Node ${meta.label} ${fmt(i)}${what} (${state})`;
  }

  function render(i) {
    const { el } = nodes[i];
    el.classList.toggle("is-fresh", fresh.has(i));
    el.classList.toggle("is-pending", pending.has(i));
    if (isLeaf(i)) {
      el.querySelector(".leaf-value").textContent = fresh.has(i) ? META[i].emoji : "?";
    }
    if (edges[i]) edges[i].classList.toggle("is-fresh", fresh.has(i));
    el.setAttribute("aria-label", label(i));
  }

  function log(html) {
    const li = document.createElement("li");
    li.innerHTML = html;
    logEl.appendChild(li);
    while (logEl.children.length > 5) logEl.firstElementChild.remove();
  }

  function logCompletion() {
    log(`Fully propagated. <a href="#lazy">→ The trick behind the tree</a>`);
  }

  async function pushDown(i, animate = true) {
    if (!pending.has(i) || isLeaf(i)) return;
    const kids = [2 * i, 2 * i + 1];
    pending.delete(i);
    pushes++;
    countEl.textContent = pushes;
    render(i);

    if (animate && STEP_MS()) {
      kids.forEach((c) => edges[c].classList.add("is-flowing"));
      await sleep(STEP_MS());
      kids.forEach((c) => edges[c].classList.remove("is-flowing"));
    }
    for (const c of kids) {
      fresh.add(c);
      if (!isLeaf(c)) pending.add(c);
      render(c);
      if (animate && STEP_MS()) {
        nodes[c].el.classList.remove("is-pop");
        void nodes[c].el.offsetWidth;
        nodes[c].el.classList.add("is-pop");
      }
    }
    log(`push_down(<span class="hl">${fmt(i)}</span>) → ${kids.map(fmt).join(" ")}`);
  }

  function openSection(id, { scroll, pushHistory }) {
    const section = document.getElementById(id);
    if (!section) return;
    section.classList.add("is-revealed");
    document.querySelectorAll(".node.is-open").forEach((n) => n.classList.remove("is-open"));
    const nodeId = Object.keys(META).find((k) => META[k].section === id);
    if (nodeId) nodes[nodeId].el.classList.add("is-open");
    document.querySelectorAll(".nav-list a").forEach((a) => {
      if (a.getAttribute("href") === `#${id}`) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    if (scroll) {
      if (pushHistory && location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
      section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });
      section.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
    }
  }

  async function query(target, { scroll = false, animate = true, pushHistory = true } = {}) {
    const path = [];
    for (let n = target; n >= 1; n >>= 1) path.unshift(n);

    let pushed = 0;
    for (const n of path) {
      if (n !== target && pending.has(n)) {
        await pushDown(n, animate);
        pushed++;
      }
    }
    if (!isLeaf(target) && pending.has(target)) {
      await pushDown(target, animate);
      pushed++;
    }

    const meta = META[target];
    if (isLeaf(target)) {
      const fact = meta.href
        ? `<a href="${meta.href}" target="_blank" rel="noopener">${meta.fact}</a>`
        : meta.fact;
      log(`query(${rangeOf(target)[0]}) = ${meta.emoji} <span class="hl">${fact}</span>`);
    } else if (!pushed) {
      log(`query(${fmt(target)}): already fresh — nothing to push 😴`);
    }
    if (meta.section) openSection(meta.section, { scroll, pushHistory });
    if (pushed && pushes === INTERNAL) logCompletion();
  }

  let queue = Promise.resolve();
  function enqueue(i, opts) {
    queue = queue.then(() => query(i, opts)).catch(() => {});
    return queue;
  }

  async function eager() {
    log(`be_eager(): pushing everything…`);
    for (let i = 1; i <= INTERNAL; i++) await pushDown(i, true);
    Object.values(META).filter((meta) => meta.section).forEach((meta) =>
      document.getElementById(meta.section).classList.add("is-revealed")
    );
    document.querySelectorAll(".nav-list a").forEach((a) => a.removeAttribute("aria-current"));
    document.querySelectorAll(".node.is-open").forEach((n) => n.classList.remove("is-open"));
    logCompletion();
  }

  function reset() {
    pending = new Set([1]);
    fresh = new Set([1]);
    pushes = 0;
    countEl.textContent = "0";
    for (let i = 1; i < 2 * N; i++) {
      nodes[i].el.classList.remove("is-open", "is-pop");
      render(i);
    }
    document.querySelectorAll(".lazy-section").forEach((s) => s.classList.remove("is-revealed"));
    document.querySelectorAll(".nav-list a").forEach((a) => a.removeAttribute("aria-current"));
    logEl.innerHTML = "";
    log(`update(<span class="hl">[0,7]</span>, reveal) → tagged root only. waiting for a query…`);
  }

  build();
  reset();

  document.getElementById("eager-btn").addEventListener("click", () => {
    queue = queue.then(eager);
  });
  document.getElementById("reset-btn").addEventListener("click", () => {
    queue = queue.then(() => {
      reset();
      if (location.hash) history.replaceState(null, "", location.pathname);
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    });
  });
  document.getElementById("print-btn").addEventListener("click", () => window.print());

  const isModifiedClick = (e) =>
    e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

  document.querySelectorAll("a[data-node]").forEach((a) => {
    a.addEventListener("click", (e) => {
      if (isModifiedClick(e)) return;
      e.preventDefault();
      enqueue(Number(a.dataset.node), { scroll: true });
    });
  });

  document.addEventListener("click", (e) => {
    if (isModifiedClick(e) || !(e.target instanceof Element) || !e.target.closest('a[href="#lazy"]')) return;
    e.preventDefault();
    queue = queue.then(() => openSection("lazy", { scroll: true, pushHistory: true }));
  });

  function revealFromHash() {
    if (location.hash === "#lazy") {
      queue = queue.then(() => openSection("lazy", { scroll: true, pushHistory: false }));
      return;
    }
    const fromHash = Object.keys(META).find((k) => META[k].section && `#${META[k].section}` === location.hash);
    if (fromHash) enqueue(Number(fromHash), { scroll: true, animate: false, pushHistory: false });
  }

  window.addEventListener("hashchange", revealFromHash);
  root.classList.add("js");
  revealFromHash();
})();
