(function () {
  "use strict";

  var DATA = window.CHECKLIST;
  var STORE_KEY = "bbchecklist_state_v2";
  var RING_C = 327; // 2 * pi * 52
  var domains = Object.keys(DATA);
  var current = domains[0];
  var state = loadState();
  var observer = null;

  var el = {
    track: document.getElementById("track"),
    overview: document.getElementById("overview"),
    phases: document.getElementById("phases"),
    phaseNav: document.getElementById("phaseNav"),
    search: document.getElementById("search"),
    resetBtn: document.getElementById("resetBtn"),
    heroStats: document.getElementById("heroStats"),
    ringFg: document.getElementById("ringFg"),
    ringPct: document.getElementById("ringPct"),
    ringMeta: document.getElementById("ringMeta")
  };

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function id(d, p, i) { return d + ":" + p + ":" + i; }

  function count(domain) {
    var total = 0, done = 0;
    DATA[domain].phases.forEach(function (ph, pi) {
      ph.items.forEach(function (it, ii) {
        total++;
        if (state[id(domain, pi, ii)]) done++;
      });
    });
    return { total: total, done: done };
  }
  function countPhase(domain, pi) {
    var ph = DATA[domain].phases[pi], done = 0;
    ph.items.forEach(function (it, ii) { if (state[id(domain, pi, ii)]) done++; });
    return { total: ph.items.length, done: done };
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function renderTrack() {
    el.track.innerHTML = "";
    domains.forEach(function (d) {
      var b = document.createElement("button");
      b.className = "track_btn" + (d === current ? " active" : "");
      b.type = "button";
      b.textContent = DATA[d].label;
      b.addEventListener("click", function () {
        if (current === d) return;
        current = d;
        el.search.value = "";
        renderAll();
        window.scrollTo({ top: document.querySelector(".layout").offsetTop - 80, behavior: "smooth" });
      });
      el.track.appendChild(b);
    });
  }

  function renderHeroStats() {
    var grand = { total: 0, done: 0 };
    domains.forEach(function (d) { var c = count(d); grand.total += c.total; grand.done += c.done; });
    var cards = [
      { n: grand.total, l: "total checks" },
      { n: grand.done, l: "completed" },
      { n: grand.total - grand.done, l: "remaining" }
    ];
    el.heroStats.innerHTML = cards.map(function (c) {
      return '<div class="stat"><div class="stat_num">' + c.n + '</div><div class="stat_lbl">' + c.l + '</div></div>';
    }).join("");
  }

  function renderOverview() {
    el.overview.innerHTML = "<strong>" + DATA[current].label + ".</strong> " + DATA[current].blurb;
  }

  function renderRing() {
    var c = count(current);
    var pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
    el.ringFg.style.strokeDashoffset = RING_C - (RING_C * pct) / 100;
    el.ringPct.textContent = pct;
    el.ringMeta.textContent = c.done + " of " + c.total + " checks";
  }

  function renderPhaseNav() {
    el.phaseNav.innerHTML = "";
    DATA[current].phases.forEach(function (ph, pi) {
      var c = countPhase(current, pi);
      var a = document.createElement("a");
      a.className = "pnav_item";
      a.href = "#phase-" + pi;
      a.dataset.phase = pi;
      a.innerHTML =
        '<span class="pnav_num">' + pad(pi + 1) + '</span>' +
        '<span class="pnav_text">' + shortName(ph.name) + '</span>' +
        '<span class="pnav_done' + (c.done === c.total ? " full" : "") + '"></span>';
      el.phaseNav.appendChild(a);
    });
  }

  function shortName(name) {
    // Drop the leading "Phase N." label for the nav, keep the topic.
    return name.replace(/^Phase\s+\d+\.\s*/i, "");
  }

  function updatePhaseNavDots() {
    var dots = el.phaseNav.querySelectorAll(".pnav_item");
    dots.forEach(function (a) {
      var pi = +a.dataset.phase;
      var c = countPhase(current, pi);
      var dot = a.querySelector(".pnav_done");
      dot.classList.toggle("full", c.done === c.total);
    });
  }

  function renderPhases() {
    var filter = el.search.value.trim().toLowerCase();
    el.phases.innerHTML = "";
    var anyVisible = false;

    DATA[current].phases.forEach(function (ph, pi) {
      var matches = ph.items
        .map(function (it, ii) { return { it: it, ii: ii }; })
        .filter(function (o) {
          if (!filter) return true;
          return o.it.t.toLowerCase().indexOf(filter) !== -1 ||
            (o.it.d && o.it.d.toLowerCase().indexOf(filter) !== -1);
        });
      if (!matches.length) return;
      anyVisible = true;

      var c = countPhase(current, pi);
      var collapsed = state["_c:" + current + ":" + pi] && !filter;

      var sec = document.createElement("section");
      sec.className = "phase" + (collapsed ? " collapsed" : "");
      sec.id = "phase-" + pi;

      var pct = c.total ? (c.done / c.total) * 100 : 0;
      var head = document.createElement("div");
      head.className = "phase_head";
      head.innerHTML =
        '<span class="phase_ghost">' + pad(pi + 1) + '</span>' +
        '<span class="phase_left">' +
          '<span class="phase_chip">P' + pad(pi + 1) + '</span>' +
          '<span class="phase_title">' + shortName(ph.name) + '</span>' +
        '</span>' +
        '<span class="phase_right">' +
          '<span class="phase_bar"><span class="phase_bar_fill" style="width:' + pct + '%"></span></span>' +
          '<span class="phase_badge">' + c.done + " / " + c.total + '</span>' +
          '<span class="phase_chevron"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>' +
        '</span>';
      head.addEventListener("click", function () {
        var k = "_c:" + current + ":" + pi;
        state[k] = !state[k];
        saveState();
        sec.classList.toggle("collapsed");
      });
      sec.appendChild(head);

      var body = document.createElement("div");
      body.className = "phase_body";

      matches.forEach(function (o) {
        var key = id(current, pi, o.ii);
        var checked = !!state[key];
        var row = document.createElement("label");
        row.className = "item" + (checked ? " done" : "");

        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "item_check";
        cb.checked = checked;
        cb.addEventListener("change", function () {
          state[key] = cb.checked;
          saveState();
          row.classList.toggle("done", cb.checked);
          var pc = countPhase(current, pi);
          head.querySelector(".phase_badge").textContent = pc.done + " / " + pc.total;
          head.querySelector(".phase_bar_fill").style.width =
            (pc.total ? (pc.done / pc.total) * 100 : 0) + "%";
          renderRing();
          renderHeroStats();
          updateTrackHint();
          updatePhaseNavDots();
        });

        var bd = document.createElement("div");
        bd.className = "item_body";
        bd.innerHTML = '<div class="item_title"></div>' + (o.it.d ? '<div class="item_detail"></div>' : "");
        bd.querySelector(".item_title").textContent = o.it.t;
        if (o.it.d) bd.querySelector(".item_detail").textContent = o.it.d;

        row.appendChild(cb);
        row.appendChild(bd);
        body.appendChild(row);
      });

      sec.appendChild(body);
      el.phases.appendChild(sec);
    });

    if (!anyVisible) {
      el.phases.innerHTML = '<div class="empty">No checks match that filter.</div>';
    }
    setupScrollSpy();
  }

  function updateTrackHint() {
    // Reserved hook for future per track indicators; keeps track active state fresh.
    var btns = el.track.querySelectorAll(".track_btn");
    btns.forEach(function (b) {
      b.classList.toggle("active", b.textContent === DATA[current].label);
    });
  }

  function setupScrollSpy() {
    if (observer) observer.disconnect();
    var navItems = {};
    el.phaseNav.querySelectorAll(".pnav_item").forEach(function (a) {
      navItems[a.getAttribute("href")] = a;
    });
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var key = "#" + en.target.id;
          Object.keys(navItems).forEach(function (k) {
            navItems[k].classList.toggle("active", k === key);
          });
        }
      });
    }, { rootMargin: "-80px 0px -65% 0px", threshold: 0 });
    el.phases.querySelectorAll(".phase").forEach(function (p) { observer.observe(p); });
  }

  function renderAll() {
    renderTrack();
    renderHeroStats();
    renderOverview();
    renderRing();
    renderPhaseNav();
    renderPhases();
  }

  el.search.addEventListener("input", renderPhases);
  el.resetBtn.addEventListener("click", function () {
    if (!confirm("Clear all checklist progress on this device?")) return;
    state = {};
    saveState();
    renderAll();
  });

  // Keyboard: slash focuses search, escape clears it.
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== el.search) {
      e.preventDefault();
      el.search.focus();
    } else if (e.key === "Escape" && document.activeElement === el.search) {
      el.search.value = "";
      el.search.blur();
      renderPhases();
    }
  });

  renderAll();
})();
