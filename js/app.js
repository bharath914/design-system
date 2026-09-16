/* ============================================================
   Gani Design System — Motion reference app
   Renders the specimen grids, runs the bezier plotter and the filter.
   Reads its catalogue from window.GANI (js/data.js).
   ============================================================ */
(function () {
  "use strict";

  var D = window.GANI;

  /* ================= ANIMATION SPECIMENS ================= */
  function animCard(name) {
    var inner = D.SPECIAL_MARKUP[name] || ('<div class="shape k-' + name + '"></div>');
    return '' +
      '<article class="card" data-name="' + name.toLowerCase() + '">' +
        '<div class="stage">' + inner + '</div>' +
        '<div class="card-meta"><code class="mono">' + name + '</code>' +
          '<button class="replay" title="Replay" aria-label="Replay ' + name + '">&#8635;</button>' +
        '</div>' +
      '</article>';
  }

  function renderAnimations() {
    var html = "";
    D.ANIM_GROUPS.forEach(function (g) {
      html += '<section class="group" data-cat="' + g.cat + '">' +
        '<h3>' + g.cat + ' <span class="tally">' + g.items.length + '</span></h3>' +
        '<div class="grid">' + g.items.map(animCard).join("") + '</div>' +
      '</section>';
    });
    document.getElementById("animGroups").innerHTML = html;
  }

  // Removing the animation, forcing a reflow, then restoring it is the only
  // reliable way to replay a CSS animation from its first frame.
  function restartEl(el) {
    if (!el) return;
    var was = el.style.animation;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = was || "";
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".replay");
    if (!btn) return;
    var card = btn.closest(".card");
    restartEl(card.querySelector(".shape, .type-demo, .cursor-demo, .shimmer-demo, .marquee-text, .ripple-ring"));
  });

  setInterval(function () {
    D.AUTOLOOP_CATS.forEach(function (cat) {
      var group = document.querySelector('.group[data-cat="' + cat + '"]');
      if (!group) return;
      group.querySelectorAll(".shape").forEach(function (el, i) {
        setTimeout(function () { restartEl(el); }, i * 35);
      });
    });
  }, 3400);

  /* ================= CURVE SPECIMENS ================= */
  function pathFor(fn) {
    var d = "";
    for (var i = 0; i <= 50; i++) {
      var t = i / 50;
      d += (i === 0 ? "M" : "L") + (t * 100).toFixed(1) + "," + (100 - fn(t) * 100).toFixed(1) + " ";
    }
    return d;
  }

  // Sampling the formula into a CSS linear() keeps every dot driven by real
  // CSS rather than a rAF loop, which browsers throttle in background tabs.
  function toLinearEasing(fn) {
    var n = 32, parts = [];
    for (var i = 0; i <= n; i++) { parts.push(fn(i / n).toFixed(4)); }
    return "linear(" + parts.join(",") + ")";
  }

  function curveCard(name, fn) {
    return '' +
      '<article class="card curve-card">' +
        '<div class="stage curve-stage">' +
          '<svg class="curve-svg" viewBox="-6 -22 112 144" preserveAspectRatio="none">' +
            '<path class="diag-path" d="M0,100 L100,0"></path>' +
            '<path class="curve-path" d="' + pathFor(fn) + '"></path>' +
          '</svg>' +
          '<div class="mini-track"><div class="mini-dot" style="--tf:' + toLinearEasing(fn) + ';"></div></div>' +
        '</div>' +
        '<div class="card-meta"><code class="mono">' + name + '</code></div>' +
      '</article>';
  }

  function renderCurves() {
    var html = "";
    D.FAMILY_ORDER.forEach(function (fam) {
      var f = D.EASE[fam];
      html += '<section class="group">' +
        '<h3>' + fam + ' <span class="tally">In · Out · InOut</span></h3>' +
        '<div class="grid">' +
          curveCard("easeIn" + fam, f.In) +
          curveCard("easeOut" + fam, f.Out) +
          curveCard("easeInOut" + fam, f.InOut) +
        '</div>' +
      '</section>';
    });
    document.getElementById("curveGroups").innerHTML = html;
  }

  function renderKeywords() {
    document.getElementById("keywordGrid").innerHTML = D.KEYWORDS.map(function (k) {
      return '' +
        '<article class="card">' +
          '<div class="stage curve-stage">' +
            '<div class="mini-track" style="margin-top:26px;"><div class="mini-dot" style="--tf:' + k.tf + ';"></div></div>' +
          '</div>' +
          '<div class="card-meta"><code class="mono">' + k.name + '</code></div>' +
        '</article>';
    }).join("");
  }

  /* ================= BEZIER PLOTTER ================= */
  var P1 = [0.25, 0.1], P2 = [0.25, 1];
  var svg = document.getElementById("bezSvg");
  var W = 100, H = 100; // unit square drawn in viewBox coordinates

  function uToPx(ux, uy) { return [ux * W, H - uy * H]; }
  function pxToU(px, py) { return [px / W, (H - py) / H]; }

  function drawBez() {
    var a = uToPx(0, 0), b = uToPx(P1[0], P1[1]), c = uToPx(P2[0], P2[1]), d = uToPx(1, 1);
    svg.innerHTML =
      '<path class="grid-path" d="M0,100 L100,100 M0,0 L0,100"></path>' +
      '<path class="diag-path" d="M0,100 L100,0"></path>' +
      '<line class="handle-line" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"></line>' +
      '<line class="handle-line" x1="' + d[0] + '" y1="' + d[1] + '" x2="' + c[0] + '" y2="' + c[1] + '"></line>' +
      '<path class="curve-path" d="M' + a[0] + ',' + a[1] + ' C' + b[0] + ',' + b[1] + ' ' + c[0] + ',' + c[1] + ' ' + d[0] + ',' + d[1] + '"></path>' +
      '<circle class="anchor" cx="' + a[0] + '" cy="' + a[1] + '" r="3"></circle>' +
      '<circle class="anchor" cx="' + d[0] + '" cy="' + d[1] + '" r="3"></circle>' +
      '<text class="axis-label" x="2" y="112">0</text>' +
      '<text class="axis-label" x="94" y="112">1  time</text>' +
      '<text class="axis-label" x="-13" y="98">0</text>' +
      '<text class="axis-label" x="-13" y="4">1</text>' +
      '<circle class="handle" data-p="1" cx="' + b[0] + '" cy="' + b[1] + '" r="6"></circle>' +
      '<circle class="handle" data-p="2" cx="' + c[0] + '" cy="' + c[1] + '" r="6"></circle>';

    var code = "cubic-bezier(" + P1[0].toFixed(2) + ", " + P1[1].toFixed(2) + ", " + P2[0].toFixed(2) + ", " + P2[1].toFixed(2) + ")";
    document.getElementById("bezCode").textContent = code;
    var dot = document.getElementById("bezDot");
    dot.style.setProperty("--bez", code);
    restartEl(dot);
  }

  function renderPresets() {
    document.getElementById("bezPresets").innerHTML = D.PRESETS.map(function (p) {
      return '<button class="preset" data-preset="' + p.name + '">' + p.name + '</button>';
    }).join("");
  }

  document.getElementById("bezPresets").addEventListener("click", function (e) {
    var btn = e.target.closest(".preset");
    if (!btn) return;
    var preset = D.PRESETS.filter(function (p) { return p.name === btn.getAttribute("data-preset"); })[0];
    if (!preset) return;
    P1 = [preset.p[0], preset.p[1]];
    P2 = [preset.p[2], preset.p[3]];
    drawBez();
  });

  var dragging = null;
  svg.addEventListener("pointerdown", function (e) {
    var t = e.target.closest(".handle");
    if (!t) return;
    dragging = t.getAttribute("data-p");
    svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var rect = svg.getBoundingClientRect();
    var vb = svg.viewBox.baseVal;
    var u = pxToU(
      ((e.clientX - rect.left) / rect.width) * vb.width + vb.x,
      ((e.clientY - rect.top) / rect.height) * vb.height + vb.y
    );
    // x is clamped to 0–1 by the CSS spec; y may overshoot for anticipation.
    var point = [Math.min(1, Math.max(0, u[0])), Math.min(1.6, Math.max(-0.6, u[1]))];
    if (dragging === "1") { P1 = point; } else { P2 = point; }
    drawBez();
  });
  ["pointerup", "pointercancel"].forEach(function (ev) {
    svg.addEventListener(ev, function () { dragging = null; });
  });

  /* ================= FILTER + TABS ================= */
  function applyFilter() {
    var q = document.getElementById("search").value.trim().toLowerCase();
    var panel = document.querySelector(".panel.active");
    var visible = 0;
    panel.querySelectorAll(".group").forEach(function (group) {
      var any = false;
      group.querySelectorAll(".card").forEach(function (card) {
        var name = (card.getAttribute("data-name") || card.querySelector("code").textContent).toLowerCase();
        var match = !q || name.indexOf(q) !== -1;
        card.hidden = !match;
        if (match) { any = true; visible++; }
      });
      group.hidden = !any;
    });
    document.getElementById("counter").textContent = visible + (visible === 1 ? " SIGNAL" : " SIGNALS");
  }

  document.getElementById("search").addEventListener("input", applyFilter);

  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".panel").forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      document.getElementById("panel-" + tab.getAttribute("data-tab")).classList.add("active");
      applyFilter();
      try { localStorage.setItem("ganiMotionTab", tab.getAttribute("data-tab")); } catch (err) {}
    });
  });

  /* ================= INIT ================= */
  renderAnimations();
  renderKeywords();
  renderCurves();
  renderPresets();
  drawBez();

  try {
    if (localStorage.getItem("ganiMotionTab") === "curves") {
      document.querySelector('.tab[data-tab="curves"]').click();
    } else {
      applyFilter();
    }
  } catch (err) {
    applyFilter();
  }
})();
