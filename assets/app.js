(function () {
  "use strict";

  var DATA = window.CHECKLIST;
  var STORE_KEY = "bbchecklist_state_v1";
  var domains = Object.keys(DATA);
  var current = domains[0];

  var state = loadState();

  var tabsEl = document.getElementById("tabs");
  var overviewEl = document.getElementById("overview");
  var phasesEl = document.getElementById("phases");
  var searchEl = document.getElementById("search");
  var resetBtn = document.getElementById("resetBtn");
  var progressFill = document.getElementById("progressFill");
  var progressCount = document.getElementById("progressCount");
  var progressLabel = document.getElementById("progressLabel");

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function itemId(domain, phaseIdx, itemIdx) {
    return domain + ":" + phaseIdx + ":" + itemIdx;
  }

  function countDomain(domain) {
    var total = 0;
    var done = 0;
    DATA[domain].phases.forEach(function (ph, pi) {
      ph.items.forEach(function (it, ii) {
        total++;
        if (state[itemId(domain, pi, ii)]) done++;
      });
    });
    return { total: total, done: done };
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    domains.forEach(function (d) {
      var c = countDomain(d);
      var btn = document.createElement("button");
      btn.className = "tab" + (d === current ? " active" : "");
      btn.setAttribute("role", "tab");
      btn.innerHTML =
        DATA[d].label +
        '<span class="tab_count">' + c.done + " / " + c.total + "</span>";
      btn.addEventListener("click", function () {
        current = d;
        searchEl.value = "";
        renderAll();
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderOverview() {
    overviewEl.innerHTML =
      "<strong>" + DATA[current].label + ".</strong> " + DATA[current].blurb;
  }

  function renderProgress() {
    var c = countDomain(current);
    var pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
    progressFill.style.width = pct + "%";
    progressCount.textContent = c.done + " of " + c.total + " complete";
    progressLabel.textContent = DATA[current].label + " progress " + pct + " percent";
  }

  function renderPhases() {
    var filter = searchEl.value.trim().toLowerCase();
    phasesEl.innerHTML = "";
    var anyVisible = false;

    DATA[current].phases.forEach(function (ph, pi) {
      var matchItems = ph.items
        .map(function (it, ii) { return { it: it, ii: ii }; })
        .filter(function (o) {
          if (!filter) return true;
          return (
            o.it.t.toLowerCase().indexOf(filter) !== -1 ||
            (o.it.d && o.it.d.toLowerCase().indexOf(filter) !== -1)
          );
        });

      if (matchItems.length === 0) return;
      anyVisible = true;

      var done = 0;
      ph.items.forEach(function (it, ii) {
        if (state[itemId(current, pi, ii)]) done++;
      });

      var phase = document.createElement("section");
      var collapsed = state["_collapsed:" + current + ":" + pi];
      phase.className = "phase" + (collapsed && !filter ? " collapsed" : "");

      var head = document.createElement("div");
      head.className = "phase_head";
      head.innerHTML =
        '<span class="phase_title">' + ph.name + "</span>" +
        '<span class="phase_right">' +
        '<span class="phase_badge">' + done + " / " + ph.items.length + "</span>" +
        '<span class="phase_chevron">v</span>' +
        "</span>";
      head.addEventListener("click", function () {
        var key = "_collapsed:" + current + ":" + pi;
        state[key] = !state[key];
        saveState();
        renderPhases();
      });
      phase.appendChild(head);

      var body = document.createElement("div");
      body.className = "phase_body";

      matchItems.forEach(function (o) {
        var id = itemId(current, pi, o.ii);
        var checked = !!state[id];
        var row = document.createElement("label");
        row.className = "item" + (checked ? " done" : "");

        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "item_check";
        cb.checked = checked;
        cb.addEventListener("change", function () {
          state[id] = cb.checked;
          saveState();
          row.classList.toggle("done", cb.checked);
          renderTabs();
          renderProgress();
          var d = 0;
          ph.items.forEach(function (x, k) {
            if (state[itemId(current, pi, k)]) d++;
          });
          head.querySelector(".phase_badge").textContent =
            d + " / " + ph.items.length;
        });

        var bodyDiv = document.createElement("div");
        bodyDiv.className = "item_body";
        bodyDiv.innerHTML =
          '<div class="item_title"></div>' +
          (o.it.d ? '<div class="item_detail"></div>' : "");
        bodyDiv.querySelector(".item_title").textContent = o.it.t;
        if (o.it.d) bodyDiv.querySelector(".item_detail").textContent = o.it.d;

        row.appendChild(cb);
        row.appendChild(bodyDiv);
        body.appendChild(row);
      });

      phase.appendChild(body);
      phasesEl.appendChild(phase);
    });

    if (!anyVisible) {
      phasesEl.innerHTML = '<div class="empty">No items match that filter.</div>';
    }
  }

  function renderAll() {
    renderTabs();
    renderOverview();
    renderProgress();
    renderPhases();
  }

  searchEl.addEventListener("input", renderPhases);

  resetBtn.addEventListener("click", function () {
    if (!confirm("Clear all checklist progress on this device?")) return;
    state = {};
    saveState();
    renderAll();
  });

  renderAll();
})();
