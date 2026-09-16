/* ============================================================
   Gani Design System — Documentation app
   Renders every page from js/data.js and handles navigation,
   appearance, search and the interactive demos.
   ============================================================ */
(function () {
  "use strict";

  var D = window.GANI;
  var I = D.ICONS;
  var $ = function (id) { return document.getElementById(id); };

  var current = "typography";
  var platform = "web";

  /* ================= HELPERS ================= */
  function group(title, meta, desc, content) {
    return '<section class="group">' +
      '<header class="group-header">' +
        '<div class="group-head"><h2 class="group-title">' + title + '</h2>' +
          (meta ? '<span class="group-meta">' + meta + '</span>' : '') + '</div>' +
        (desc ? '<p class="group-desc">' + desc + '</p>' : '') +
      '</header>' + content + '</section>';
  }

  function key(parts) { return parts.join(" ").toLowerCase().replace(/"/g, ""); }

  function num(n) { return String(Math.round(n * 100) / 100); }

  function specChips(list) {
    return '<ul class="spec-chips">' + list.map(function (s) {
      return '<li><span>' + s[0] + '</span>' + s[1] + '</li>';
    }).join("") + '</ul>';
  }

  // Replaying a CSS animation means removing it, forcing layout, then restoring it.
  function restart(el) {
    el.style.animation = "none";
    void el.getBoundingClientRect();
    el.style.animation = "";
  }

  /* ---------- colour maths ---------- */
  var VAR = {};
  D.COLOR_VARIABLES.forEach(function (v) { VAR[v.name] = v; });

  function parseColor(str) {
    str = str.trim();
    if (str.charAt(0) === "#") {
      var h = str.slice(1);
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
    }
    var p = str.replace(/rgba?\(|\)/g, "").split(",").map(parseFloat);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }

  function blend(fg, bg) {
    return { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 };
  }

  function luminance(c) {
    var ch = [c.r, c.g, c.b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }

  function contrast(a, b) {
    var l1 = luminance(a), l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  function resolve(name, mode, over) {
    var c = parseColor(VAR[name][mode][1]);
    return c.a < 1 ? blend(c, resolve(over || "bg/surface", mode)) : c;
  }

  function grade(ratio) {
    var cls = ratio >= 4.5 ? "pass" : ratio >= 3 ? "large" : "fail";
    var label = ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA large" : "Fail";
    return '<span class="grade"><span class="tnum">' + ratio.toFixed(1) + ':1</span>' +
      '<span class="grade-badge grade-badge--' + cls + '">' + label + '</span></span>';
  }

  function textOn(hex) {
    var c = parseColor(hex);
    var onWhite = contrast(c, parseColor("#FFFFFF"));
    var onDark = contrast(c, parseColor("#0B0E12"));
    return onWhite >= onDark ? { color: "#FFFFFF", ratio: onWhite } : { color: "#0B0E12", ratio: onDark };
  }

  /* ================= SHELL ================= */
  function renderNav() {
    var groups = [];
    D.SECTIONS.forEach(function (s) {
      var g = groups.filter(function (x) { return x.name === s.group; })[0];
      if (!g) { g = { name: s.group, items: [] }; groups.push(g); }
      g.items.push(s);
    });
    $("nav").innerHTML = groups.map(function (g) {
      return '<div class="nav-group"><span class="nav-label">' + g.name + '</span>' +
        g.items.map(function (s) {
          return '<button class="nav-link" type="button" data-section="' + s.id + '">' +
            '<span>' + s.name + '</span><span class="nav-count" data-count-for="' + s.id + '"></span></button>';
        }).join("") + '</div>';
    }).join("");
  }

  function renderPages() {
    $("pages").innerHTML = D.SECTIONS.map(function (s) {
      return '<section class="page" id="page-' + s.id + '" hidden>' +
        '<header class="page-head">' +
          '<p class="eyebrow">' + s.group + '</p>' +
          '<h1 class="page-title">' + s.name + '</h1>' +
          '<p class="page-intro">' + s.intro + '</p>' +
          '<p class="page-count" data-page-count></p>' +
        '</header>' +
        '<div id="body-' + s.id + '"></div>' +
        '<p class="empty" hidden>Nothing on this page matches your search.</p>' +
      '</section>';
    }).join("");
  }

  function applyFilter() {
    var page = $("page-" + current);
    var q = $("search").value.trim().toLowerCase();
    var total = 0, shown = 0;
    page.querySelectorAll(".group").forEach(function (g) {
      var items = g.querySelectorAll("[data-name]");
      if (!items.length) return;
      var any = false;
      items.forEach(function (item) {
        total++;
        var match = !q || item.getAttribute("data-name").indexOf(q) !== -1;
        item.hidden = !match;
        if (match) { any = true; shown++; }
      });
      g.hidden = !any;
    });
    page.querySelector("[data-page-count]").textContent = q ? shown + " of " + total + " items" : total + " items";
    page.querySelector(".empty").hidden = shown !== 0;
  }

  function show(id) {
    if (!$("page-" + id)) { id = "typography"; }
    current = id;
    D.SECTIONS.forEach(function (s) { $("page-" + s.id).hidden = s.id !== id; });
    document.querySelectorAll(".nav-link").forEach(function (l) {
      if (l.getAttribute("data-section") === id) { l.setAttribute("aria-current", "page"); }
      else { l.removeAttribute("aria-current"); }
    });
    if (location.hash !== "#" + id) { history.replaceState(null, "", "#" + id); }
    try { localStorage.setItem("ganiSection", id); } catch (err) {}
    applyFilter();
  }

  function countItems() {
    D.SECTIONS.forEach(function (s) {
      var n = $("page-" + s.id).querySelectorAll("[data-name]").length;
      document.querySelector('[data-count-for="' + s.id + '"]').textContent = n;
    });
  }

  /* ================= TYPOGRAPHY ================= */
  function weightName(w) {
    return D.TYPEFACE.weights.filter(function (x) { return x.value === w; })[0].name;
  }

  function trackingLabel(t) {
    if (!t) return "0%";
    return (t > 0 ? "+" : "−") + Math.abs(t) + "%";
  }

  function styleCss(s, p) {
    return "font-size:" + s[p][0] + "px;line-height:" + s[p][1] + "px;font-weight:" + s.weight + ";" +
      "letter-spacing:" + (s.tracking / 100) + "em;" + (s.upper ? "text-transform:uppercase;" : "");
  }

  function styleSpec(s, p) {
    return s[p][0] + " / " + s[p][1] + " · " + weightName(s.weight) + " · " + trackingLabel(s.tracking);
  }

  function inUse(p) {
    var S = {};
    D.TYPE_STYLES.forEach(function (s) { S[s.name] = s; });
    return '<div class="in-use' + (p === "mobile" ? " in-use--mobile" : "") + '">' +
      '<span style="' + styleCss(S.Overline, p) + 'color:var(--accent-text)">Motion guide</span>' +
      '<span style="' + styleCss(S["Heading 2"], p) + '">Every curve has a name</span>' +
      '<span style="' + styleCss(S.Body, p) + 'color:var(--text-secondary)">Easing decides whether an interface feels quick, calm or playful. Pick the curve before you pick the duration.</span>' +
      '<span style="' + styleCss(S.Caption, p) + 'color:var(--text-tertiary)">4 min read · Updated today</span>' +
      '<button class="btn btn--primary" type="button" style="--btn-font:' + S.Label[p][0] + 'px">Read the guide</button>' +
    '</div>';
  }

  function renderTypography() {
    var tf = D.TYPEFACE;
    var P = D.PLATFORMS[platform];

    var html = group("Typeface", "1 family", null,
      '<article class="card typeface" data-name="typeface ibm plex sans font family weights characters">' +
        '<div class="typeface-specimen" aria-hidden="true">Aa</div>' +
        '<div class="typeface-info">' +
          '<p class="eyebrow">One family for everything</p>' +
          '<h3 class="typeface-name">' + tf.name + '</h3>' +
          '<p class="doc-text">Headings, body, labels and numbers all use ' + tf.name + '. It is free on Google Fonts and available in Figma. Four weights cover every style.</p>' +
          '<div class="weights">' + tf.weights.map(function (w) {
            return '<div class="weight"><span class="weight-sample" style="font-weight:' + w.value + '">Aa</span>' +
              '<span class="weight-name">' + w.name + ' · ' + w.value + '</span></div>';
          }).join("") + '</div>' +
          '<p class="charset">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 &amp; @ # % ! ? ( ) , . : ;</p>' +
          '<p class="charset-note">Turn on tabular figures wherever numbers need to line up: <span class="tnum">1,284.50 · 972.10</span></p>' +
        '</div>' +
      '</article>');

    var rows = D.TYPE_STYLES.map(function (s) {
      return '<article class="card type-row' + (platform === "mobile" ? " type-row--mobile" : "") + '" data-name="' + key([s.name, s.use]) + '">' +
        '<div class="type-meta">' +
          '<span class="type-name">' + s.name + '</span>' +
          '<span class="type-spec">' + styleSpec(s, platform) + '</span>' +
          '<span class="type-use">' + s.use + '</span>' +
        '</div>' +
        '<div class="type-sample" style="' + styleCss(s, platform) + '">' + s.sample + '</div>' +
      '</article>';
    }).join("");

    var frame = platform === "mobile"
      ? '<div class="device"><div class="device-status"><span>' + P.frame + '</span><span class="device-notch"></span><span>100%</span></div>' +
          '<div class="device-screen">' + rows + '</div></div>'
      : '<div class="browser"><div class="browser-bar"><span class="browser-dots"><i></i><i></i><i></i></span>' +
          '<span class="browser-url">' + P.frame + '</span></div><div class="browser-screen">' + rows + '</div></div>';

    var switcher = '<div class="platform-bar">' +
      '<div class="btn-group" role="group" aria-label="Platform">' +
        ["web", "mobile"].map(function (k) {
          return '<button class="btn btn--secondary btn--sm" type="button" data-platform="' + k + '" aria-pressed="' + (k === platform) + '">' +
            D.PLATFORMS[k].name + '</button>';
        }).join("") +
      '</div>' +
      '<ul class="platform-notes">' + P.notes.map(function (n) { return '<li>' + n + '</li>'; }).join("") + '</ul>' +
    '</div>';

    html += group("Type styles", D.TYPE_STYLES.length + " styles · " + P.name, "Size / line height in px, weight, letter spacing.", switcher + frame);

    html += group("Web vs mobile", "size / line height in px",
      "Headings shrink on mobile while body and labels grow — phones are held closer, but touch needs bigger labels and text fields need 16px.",
      '<article class="card card--pad"><div class="table-scroll"><table class="table">' +
        '<thead><tr><th>Style</th><th>Web</th><th>Mobile</th><th>Change</th><th>Weight</th><th>Letter spacing</th></tr></thead><tbody>' +
        D.TYPE_STYLES.map(function (s) {
          var pct = Math.round((s.mobile[0] - s.web[0]) / s.web[0] * 100);
          return '<tr data-name="' + key([s.name, "web mobile compare"]) + '">' +
            '<td class="strong">' + s.name + '</td>' +
            '<td>' + s.web[0] + ' / ' + s.web[1] + '</td>' +
            '<td>' + s.mobile[0] + ' / ' + s.mobile[1] + '</td>' +
            '<td>' + (pct > 0 ? "+" : pct < 0 ? "−" : "") + Math.abs(pct) + '%</td>' +
            '<td>' + weightName(s.weight) + '</td>' +
            '<td>' + trackingLabel(s.tracking) + '</td>' +
          '</tr>';
        }).join("") +
      '</tbody></table></div></article>');

    html += group("In use", null, "The same article header set in each platform's styles.",
      '<div class="grid grid--2">' + ["web", "mobile"].map(function (p) {
        return '<article class="card" data-name="in use hierarchy example ' + p + '">' +
          '<div class="doc-body"><h3 class="doc-title">' + D.PLATFORMS[p].name + '</h3></div>' + inUse(p) + '</article>';
      }).join("") + '</div>');

    $("body-typography").innerHTML = html;
  }

  /* ================= COLOURS ================= */
  function scaleStrip(list, family, marks) {
    return '<div class="scale">' + list.map(function (it) {
      var t = textOn(it.hex);
      var tag = marks && marks[it.step]
        ? '<span class="scale-tag" style="background:' + t.color + ';color:' + it.hex + '">' + marks[it.step] + '</span>' : "";
      return '<div class="scale-chip" style="background:' + it.hex + ';color:' + t.color + '" data-name="' + key([family, it.step, it.hex]) + '">' +
        '<div class="stack" style="gap:2px"><span class="scale-step">' + it.step + '</span><span class="scale-hex">' + it.hex + '</span></div>' +
        '<div class="stack" style="gap:6px">' + tag + '<span class="scale-ratio">Aa ' + t.ratio.toFixed(1) + ':1</span></div>' +
      '</div>';
    }).join("") + '</div>';
  }

  var USE_DEMOS = {
    fill: '<button class="btn btn--primary" type="button" tabindex="-1">Button</button>',
    hover: '<button class="btn btn--primary is-hover" type="button" tabindex="-1">Button</button>',
    pressed: '<button class="btn btn--primary is-pressed" type="button" tabindex="-1">Button</button>',
    tint: '<span class="chip is-selected">' + I.check + 'Selected</span>',
    text: '<span class="use-link">View details</span>',
    focus: '<button class="btn btn--secondary is-focus" type="button" tabindex="-1">Button</button>',
    on: '<span class="use-on">Aa</span>'
  };

  function modeCard(mode) {
    var roles = ["bg/page", "bg/surface", "text/primary", "text/secondary", "accent/default", "accent/tint", "border/strong", "status/danger"];
    return '<article class="card mode-card" data-theme="' + mode + '" data-name="' + mode + ' mode theme appearance">' +
      '<div class="mode-card-head"><span class="mode-card-title">' + (mode === "light" ? "Light" : "Dark") + '</span></div>' +
      '<div class="mode-card-body">' +
        '<ul class="role-list">' + roles.map(function (n) {
          var v = VAR[n][mode];
          return '<li><span class="role-dot" style="background:' + v[1] + '"></span>' +
            '<span><strong style="color:var(--text);font-weight:600">' + n + '</strong><br>' + v[0] + '</span></li>';
        }).join("") + '</ul>' +
        '<div class="mode-sample">' +
          '<span class="mode-sample-title">Invite your team</span>' +
          '<span class="mode-sample-text">Collaborators can edit every page in this project.</span>' +
          '<div class="row"><button class="btn btn--primary btn--sm" type="button">Send invite</button>' +
          '<button class="btn btn--ghost btn--sm" type="button">Not now</button>' +
          '<span class="badge badge--accent">3 seats left</span></div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function renderColors() {
    var A = D.ACCENT;

    var html = group("Accent", "1 colour", null,
      '<article class="card accent-hero" data-name="accent teal brand gani">' +
        '<div class="accent-hero-swatch">' +
          '<span class="accent-hero-name">' + A.name + '</span>' +
          '<span class="accent-hero-values">Light · Accent ' + A.light.step + ' · ' + A.light.hex + '<br>Dark · Accent ' + A.dark.step + ' · ' + A.dark.hex + '</span>' +
        '</div>' +
        '<div class="accent-hero-text">' +
          '<p class="eyebrow">One accent</p>' +
          '<h3 class="doc-title">Teal means “you can act on this”</h3>' +
          '<p class="doc-text">It is the only accent in the system. Everything else is neutral, so wherever teal appears it points at an action, a selection or focus.</p>' +
          '<ul class="rule-list">' +
            '<li class="yes">' + I.check + '<span>Buttons, links, checked controls, selected items, focus and progress.</span></li>' +
            '<li class="yes">' + I.check + '<span>Accent 600 in light mode, Accent 400 in dark mode.</span></li>' +
            '<li class="no">' + I.x + '<span>Decoration, illustrations, large backgrounds or body text.</span></li>' +
            '<li class="no">' + I.x + '<span>Standing in for success, warning or danger.</span></li>' +
          '</ul>' +
        '</div>' +
      '</article>');

    html += group("Accent scale", D.ACCENT_SCALE.length + " steps",
      "Tagged steps are the accent in each mode. The ratio is the contrast of the label colour on that step.",
      scaleStrip(D.ACCENT_SCALE, "accent", { 600: "Light", 400: "Dark" }));

    html += group("Accent in use", D.ACCENT_USES.length + " roles",
      "The same teal doing different jobs. Each job is its own variable, so every mode can use the right step.",
      '<div class="grid" style="--min:210px">' + D.ACCENT_USES.map(function (u) {
        return '<article class="card" data-name="' + key(["accent", u.name, u.variable, u.note]) + '">' +
          '<div class="use-demo">' + USE_DEMOS[u.demo] + '</div>' +
          '<div class="doc-body"><h3 class="doc-title">' + u.name + '</h3>' +
            '<span class="rule-timing">' + u.variable + '</span>' +
            '<p class="doc-text">' + u.note + '</p></div>' +
        '</article>';
      }).join("") + '</div>');

    html += group("Neutrals", D.NEUTRAL_SCALE.length + " steps",
      "Every surface, text colour and border comes from here. A slight cool tint keeps them in the same family as the accent.",
      scaleStrip(D.NEUTRAL_SCALE, "neutral"));

    html += group("Status", D.STATUS.length + " colours",
      "Reserved for meaning. They never decorate, and they never stand in for the accent.",
      '<div class="grid grid--3">' + D.STATUS.map(function (s) {
        return '<article class="card" data-name="' + key(["status", s.name, s.use]) + '">' +
          '<div class="status-swatches">' +
            '<div class="status-swatch" style="background:' + s.light + ';color:' + textOn(s.light).color + '"><strong>Light</strong>' + s.light + '</div>' +
            '<div class="status-swatch" style="background:' + s.dark + ';color:' + textOn(s.dark).color + '"><strong>Dark</strong>' + s.dark + '</div>' +
          '</div>' +
          '<div class="doc-body">' +
            '<div class="row" style="justify-content:space-between"><h3 class="doc-title">' + s.name + '</h3>' +
              '<span class="badge badge--' + s.badge + '"><span class="badge-dot"></span>' + s.name + '</span></div>' +
            '<p class="doc-text">' + s.use + '</p>' +
          '</div>' +
        '</article>';
      }).join("") + '</div>');

    html += group("Light & dark", "2 modes",
      "Every colour variable has both modes. Switch Appearance in the sidebar to see the whole system change.",
      '<div class="grid grid--2">' + modeCard("light") + modeCard("dark") + '</div>');

    html += group("Contrast", "WCAG 2.1",
      "AA needs 4.5:1 for normal text and 3:1 for large text (18px and up, or 14px bold).",
      '<article class="card card--pad"><div class="table-scroll"><table class="table">' +
        '<thead><tr><th>Where</th><th>Pair</th><th>Light</th><th>Dark</th></tr></thead><tbody>' +
        D.CONTRAST_PAIRS.map(function (p) {
          var light = contrast(resolve(p.fg, "light"), resolve(p.bg, "light", p.over));
          var dark = contrast(resolve(p.fg, "dark"), resolve(p.bg, "dark", p.over));
          return '<tr data-name="' + key([p.use, p.fg, p.bg, "contrast"]) + '">' +
            '<td class="strong">' + p.use + '</td>' +
            '<td>' + p.fg + ' on ' + p.bg + '</td>' +
            '<td>' + grade(light) + '</td>' +
            '<td>' + grade(dark) + '</td>' +
          '</tr>';
        }).join("") +
      '</tbody></table></div></article>');

    $("body-colors").innerHTML = html;
  }

  /* ================= VARIABLES ================= */
  function bezierPath(p) {
    return "M0,100 C" + p[0] * 100 + "," + (100 - p[1] * 100) + " " + p[2] * 100 + "," + (100 - p[3] * 100) + " 100,0";
  }

  function modeValue(v) {
    return v[0] + (v[1].charAt(0) === "#" ? ' · <span class="tnum">' + v[1] + '</span>' : "");
  }

  function varPreview(c, row) {
    var v = row[1];
    switch (c.id) {
      case "spacing": return '<span class="var-bar" style="width:' + v + 'px"></span>';
      case "radius": return '<span class="var-radius" style="width:52px;height:52px;border-radius:' + Math.min(v, 26) + 'px"></span>';
      case "sizing":
        return row[0].indexOf("icon") !== -1
          ? '<span class="var-icon" style="display:block;width:' + v + 'px;height:' + v + 'px">' + I.heartFilled + '</span>'
          : '<span class="var-box" style="width:' + (row[0].indexOf("touch") !== -1 ? v : Math.round(v * 1.4)) + 'px;height:' + v + 'px"></span>';
      case "border":
        return row[0].indexOf("offset") !== -1 ? '<span class="var-focus"></span>' : '<span class="var-line" style="height:' + v + 'px"></span>';
      case "elevation": return '<span class="var-elev" style="box-shadow:' + (row[3] ? "var(--shadow-" + row[3] + ")" : "none") + '"></span>';
      case "opacity": return '<span class="var-opacity"><i style="opacity:' + v / 100 + '"></i></span>';
      case "duration": return '<span class="var-bar" style="width:' + v / 10 + 'px"></span>';
      case "easing":
        return '<svg class="var-curve" viewBox="-8 -24 116 148" aria-hidden="true"><path class="grid-path" d="M0,100 L100,100 M0,0 L0,100"/>' +
          '<path class="curve-path" d="' + bezierPath(v) + '"/></svg>';
      case "type": return '<span class="var-weight" style="font-weight:' + row[3] + '">Aa</span>';
      case "breakpoints": return '<span class="var-grid">' + new Array(row[3] + 1).join("<i></i>") + '</span>';
    }
    return "";
  }

  function varValue(c, row) {
    if (c.easing) return row[1].map(num).join(", ");
    if (row[0] === "radius/full") return "Full";
    if (c.unit) return row[1] + c.unit;
    if (c.grid) return row[1] + " px";
    return row[1];
  }

  function renderVariables() {
    var html = group("Color", D.COLOR_VARIABLES.length + " variables · Light & Dark",
      "Use these in designs — never a raw hex. Each one switches automatically with the mode.",
      '<article class="card var-table var-table--color">' +
        '<div class="var-head"><span></span><span>Name</span><span>Light</span><span>Dark</span><span>Used for</span></div>' +
        D.COLOR_VARIABLES.map(function (v) {
          return '<div class="var-row" data-name="' + key([v.name, v.light[0], v.dark[0], v.light[1], v.dark[1], v.use]) + '">' +
            '<div class="var-preview"><span class="var-pair"><i style="background:' + v.light[1] + '"></i><i style="background:' + v.dark[1] + '"></i></span></div>' +
            '<div class="var-name">' + v.name + '</div>' +
            '<div class="var-mode var-mode--light"><span class="role-dot" style="background:' + v.light[1] + '"></span><span>' + modeValue(v.light) + '</span></div>' +
            '<div class="var-mode var-mode--dark"><span class="role-dot" style="background:' + v.dark[1] + '"></span><span>' + modeValue(v.dark) + '</span></div>' +
            '<div class="var-use">' + v.use + '</div>' +
          '</div>';
        }).join("") +
      '</article>');

    D.VARIABLE_COLLECTIONS.forEach(function (c) {
      html += group(c.name, c.rows.length + " variables", c.desc,
        '<article class="card var-table">' +
          '<div class="var-head"><span></span><span>Name</span><span>Value</span><span>Used for</span></div>' +
          c.rows.map(function (row) {
            return '<div class="var-row" data-name="' + key([c.name, row[0], row[2]]) + '">' +
              '<div class="var-preview">' + varPreview(c, row) + '</div>' +
              '<div class="var-name">' + row[0] + '</div>' +
              '<div class="var-value">' + varValue(c, row) + '</div>' +
              '<div class="var-use">' + row[2] + '</div>' +
            '</div>';
          }).join("") +
        '</article>');
    });

    $("body-variables").innerHTML = html;
  }

  /* ================= BUTTONS ================= */
  function renderButtons() {
    var html = group("States", D.BUTTON_VARIANTS.length + " variants × " + D.BUTTON_STATES.length + " states",
      "Every variant in every state. Selected is for toggles and button groups.",
      '<article class="card card--pad"><div class="table-scroll"><table class="table matrix">' +
        '<thead><tr><th>Variant</th>' + D.BUTTON_STATES.map(function (s) { return '<th>' + s.name + '</th>'; }).join("") + '</tr></thead><tbody>' +
        D.BUTTON_VARIANTS.map(function (v) {
          return '<tr data-name="' + key([v.name, "variant states matrix"]) + '"><th scope="row">' + v.name + '</th>' +
            D.BUTTON_STATES.map(function (s) {
              return '<td><button class="btn btn--' + v.id + (s.cls ? " " + s.cls : "") + '" type="button" tabindex="-1"' +
                (s.disabled ? " disabled" : "") + (s.id === "loading" ? ' aria-busy="true"' : "") + '>' +
                (v.id === "link" ? "Link" : "Button") + '</button></td>';
            }).join("") + '</tr>';
        }).join("") +
      '</tbody></table></div></article>');

    html += group("State rules", null, "What changes in each state, and how fast.",
      '<div class="state-rules">' + D.STATE_RULES.map(function (r) {
        return '<article class="card rule-card" data-name="' + key([r.name, "state rule", r.rule]) + '">' +
          '<div class="principle-head"><h3 class="doc-title">' + r.name + '</h3><span class="rule-timing">' + r.timing + '</span></div>' +
          '<p class="doc-text">' + r.rule + '</p></article>';
      }).join("") + '</div>');

    html += group("Variants", D.BUTTON_VARIANTS.length + " variants", "Pick by importance, not by colour.",
      '<div class="grid grid--3">' + D.BUTTON_VARIANTS.map(function (v) {
        return '<article class="card" data-name="' + key([v.name, "variant", v.use]) + '">' +
          '<div class="doc-demo">' +
            '<button class="btn btn--' + v.id + '" type="button">' + v.label + '</button>' +
            '<button class="btn btn--' + v.id + ' btn--sm" type="button">' + v.label + '</button>' +
          '</div>' +
          '<div class="doc-body">' +
            '<h3 class="doc-title">' + v.name + '</h3>' +
            '<div class="do-dont"><div class="do"><strong>Use for</strong>' + v.use + '</div><div class="dont"><strong>Avoid</strong>' + v.avoid + '</div></div>' +
          '</div>' +
        '</article>';
      }).join("") + '</div>');

    html += group("Sizes", D.BUTTON_SIZES.length + " sizes", "Label sizes follow the platform type styles, so buttons read the same on web and mobile.",
      '<div class="grid grid--3">' + D.BUTTON_SIZES.map(function (s) {
        var c = s.cls ? " " + s.cls : "";
        return '<article class="card" data-name="' + key([s.name, "size", s.height, s.use]) + '">' +
          '<div class="doc-demo">' +
            '<button class="btn btn--primary' + c + '" type="button">' + I.plus + 'Button</button>' +
            '<button class="btn btn--secondary' + c + '" type="button">Button</button>' +
            '<button class="btn btn--secondary btn--icon' + c + '" type="button" aria-label="Add">' + I.plus + '</button>' +
          '</div>' +
          '<div class="doc-body">' +
            '<h3 class="doc-title">' + s.name + '</h3>' +
            '<p class="doc-text">' + s.use + '</p>' +
            specChips([["Height", s.height], ["Padding", s.padding], ["Radius", s.radius], ["Label", s.label], ["Icon", s.icon], ["Gap", s.gap]]) +
          '</div>' +
        '</article>';
      }).join("") + '</div>');

    html += group("Anatomy", D.ANATOMY.length + " parts", null,
      '<article class="card anatomy" data-name="anatomy parts container icon label focus ring">' +
        '<div class="anatomy-stage">' +
          '<button class="btn btn--primary btn--lg is-focus" type="button" tabindex="-1">' +
            '<i class="marker marker--corner"><b>1</b></i>' +
            '<span class="marked">' + I.plus + '<i class="marker"><b>2</b></i></span>' +
            '<span class="marked">New project<i class="marker"><b>3</b></i></span>' +
            '<span class="marked">' + I.arrowRight + '<i class="marker"><b>4</b></i></span>' +
            '<i class="marker marker--focus"><b>5</b></i>' +
          '</button>' +
        '</div>' +
        '<ol class="anatomy-list">' + D.ANATOMY.map(function (a, i) {
          return '<li><b>' + (i + 1) + '</b><div><div class="anatomy-part">' + a.part + '</div><div class="anatomy-desc">' + a.desc + '</div></div></li>';
        }).join("") + '</ol>' +
      '</article>');

    var patterns = [
      { name: "Leading icon", text: "An icon before the label names what the action creates.",
        demo: '<button class="btn btn--primary" type="button">' + I.plus + 'New project</button>' },
      { name: "Trailing icon", text: "A trailing arrow means the action moves you forward.",
        demo: '<button class="btn btn--secondary" type="button">Continue' + I.arrowRight + '</button>' },
      { name: "Icon only", text: "Square — width equals height. Always add a tooltip; on mobile keep the tap area at 44px.",
        demo: '<button class="btn btn--ghost btn--icon" type="button" aria-label="Like">' + I.heart + '</button>' +
          '<button class="btn btn--secondary btn--icon" type="button" aria-label="Download">' + I.download + '</button>' +
          '<button class="btn btn--danger btn--icon" type="button" aria-label="Delete">' + I.trash + '</button>' },
      { name: "Full width", text: "Fills its container. For narrow forms and mobile sheets.",
        demo: '<div style="width:100%;max-width:320px"><button class="btn btn--primary btn--lg btn--block" type="button">Create account</button></div>' },
      { name: "Pill", text: "Fully rounded, for social actions and filters. Works with every variant and size.",
        demo: '<button class="btn btn--primary btn--pill" type="button">Follow</button>' +
          '<button class="btn btn--outline btn--pill is-selected" type="button" tabindex="-1">' + I.check + 'Following</button>' },
      { name: "Button group", text: "One choice from a few options. The chosen one is Selected — click to switch.",
        demo: '<div class="btn-group" role="group" aria-label="Range">' +
          '<button class="btn btn--secondary" type="button" aria-pressed="false">Day</button>' +
          '<button class="btn btn--secondary" type="button" aria-pressed="true">Week</button>' +
          '<button class="btn btn--secondary" type="button" aria-pressed="false">Month</button></div>' },
      { name: "Toggle", text: "Stays selected after a click, like Save or Bold. Click to try it.",
        demo: '<button class="btn btn--secondary" type="button" aria-pressed="false" data-toggle>' + I.heart + 'Save</button>' +
          '<button class="btn btn--ghost" type="button" aria-pressed="true" data-toggle>' + I.heart + 'Saved</button>' },
      { name: "Loading", text: "Click it. The spinner takes the label's place and the width holds still.",
        demo: '<button class="btn btn--primary" type="button" data-demo="load">' + I.download + 'Export</button>' }
    ];

    html += group("Icons & layout", patterns.length + " patterns", null,
      '<div class="grid grid--3">' + patterns.map(function (p) {
        return '<article class="card" data-name="' + key([p.name, "pattern", p.text]) + '">' +
          '<div class="doc-demo">' + p.demo + '</div>' +
          '<div class="doc-body"><h3 class="doc-title">' + p.name + '</h3><p class="doc-text">' + p.text + '</p></div>' +
        '</article>';
      }).join("") + '</div>');

    $("body-buttons").innerHTML = html;
  }

  /* ================= COMPONENTS ================= */
  function doc(o) {
    return '<article class="card' + (o.wide ? " card--wide" : "") + '" data-name="' + key([o.name, o.keys || "", o.text]) + '">' +
      '<div class="doc-demo' + (o.demoCls ? " " + o.demoCls : "") + '">' + o.demo + '</div>' +
      '<div class="doc-body"><h3 class="doc-title">' + o.name + '</h3><p class="doc-text">' + o.text + '</p>' + specChips(o.specs) + '</div>' +
    '</article>';
  }

  function cell(state, inner) {
    return '<div class="state-cell">' + inner + '<span class="state-name">' + state + '</span></div>';
  }

  function textField(id, o) {
    return '<div class="field' + (o.error ? " is-error" : "") + (o.disabled ? " is-disabled" : "") + '">' +
      '<label class="field-label" for="' + id + '">Email</label>' +
      '<input class="input' + (o.cls ? " " + o.cls : "") + '" id="' + id + '" type="email" placeholder="name@company.com"' +
        (o.value ? ' value="' + o.value + '"' : "") + (o.disabled ? " disabled" : "") + '>' +
      '<span class="field-help">' + (o.error ? I.alertCircle + "Enter a full email address." : "We only use it to sign you in.") + '</span>' +
    '</div>';
  }

  function checkbox(id, label, o) {
    return '<label class="check" for="' + id + '"><input type="checkbox" id="' + id + '"' +
      (o.checked ? " checked" : "") + (o.disabled ? " disabled" : "") + (o.indeterminate ? " data-indeterminate" : "") + '>' + label + '</label>';
  }

  function radio(id, name, label, o) {
    return '<label class="check" for="' + id + '"><input type="radio" id="' + id + '" name="' + name + '"' +
      (o.checked ? " checked" : "") + (o.disabled ? " disabled" : "") + '>' + label + '</label>';
  }

  function toggleSwitch(id, label, o) {
    return '<label class="switch" for="' + id + '"><input type="checkbox" role="switch" id="' + id + '"' +
      (o.checked ? " checked" : "") + (o.disabled ? " disabled" : "") + '>' + label + '</label>';
  }

  function menu() {
    return '<div class="menu" role="listbox" aria-label="Date range">' +
      '<button class="menu-item" type="button" role="option">Last 7 days</button>' +
      '<button class="menu-item is-selected" type="button" role="option" aria-selected="true">Last 30 days' + I.check + '</button>' +
      '<button class="menu-item is-active" type="button" role="option">Last 90 days</button>' +
      '<div class="menu-divider"></div>' +
      '<button class="menu-item" type="button" role="option">Custom range…</button>' +
    '</div>';
  }

  function renderComponents() {
    var inputs = [
      doc({ name: "Text field", wide: true, demoCls: "doc-demo--start", keys: "input form email",
        text: "For short, single-line answers. Always show a label; put the rules in the helper text, not the placeholder.",
        demo: '<div class="state-grid">' +
          cell("Default", textField("tf-default", {})) +
          cell("Hover", textField("tf-hover", { cls: "is-hover" })) +
          cell("Focused", textField("tf-focus", { cls: "is-focus", value: "alex@gani" })) +
          cell("Filled", textField("tf-filled", { value: "alex@gani.design" })) +
          cell("Error", textField("tf-error", { error: true, value: "alex@" })) +
          cell("Disabled", textField("tf-disabled", { disabled: true })) +
        '</div>',
        specs: [["Height", 40], ["Radius", 8], ["Padding", 12], ["Label", "Label"], ["Value", "Body"], ["Helper", "Caption"], ["Focus halo", "3px accent/tint"]] }),
      doc({ name: "Select", demoCls: "doc-demo--start", keys: "dropdown menu listbox",
        text: "Pick one option from a list of five or more. For fewer, use radios or a segmented control.",
        demo: '<div class="state-grid">' +
          cell("Closed", '<button class="select" type="button" aria-haspopup="listbox"><span>Last 30 days</span>' + I.chevronDown + '</button>') +
          cell("Open", '<div style="width:100%"><button class="select is-open" type="button" aria-haspopup="listbox" aria-expanded="true"><span>Last 30 days</span>' + I.chevronDown + '</button>' + menu() + '</div>') +
        '</div>',
        specs: [["Height", 40], ["Item", 36], ["Menu radius", 8], ["Menu padding", 4], ["Elevation", 3], ["Opens", "Menu open · 250ms"]] }),
      doc({ name: "Checkbox", demoCls: "doc-demo--start", keys: "check tick",
        text: "Turn independent options on or off. Changes apply when the form is saved.",
        demo: '<div class="state-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">' +
          cell("Unchecked", checkbox("cb-1", "Email updates", {})) +
          cell("Checked", checkbox("cb-2", "Email updates", { checked: true })) +
          cell("Indeterminate", checkbox("cb-3", "All projects", { indeterminate: true })) +
          cell("Disabled", checkbox("cb-4", "Email updates", { disabled: true })) +
          cell("Disabled on", checkbox("cb-5", "Email updates", { checked: true, disabled: true })) +
        '</div>',
        specs: [["Box", 18], ["Radius", 5], ["Gap", 8], ["Mobile tap area", 44]] }),
      doc({ name: "Radio", demoCls: "doc-demo--start", keys: "option choice",
        text: "Choose exactly one from two to five options, all visible at once.",
        demo: '<div class="state-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">' +
          cell("Unselected", radio("rd-1", "plan", "Monthly", {})) +
          cell("Selected", radio("rd-2", "plan", "Yearly", { checked: true })) +
          cell("Disabled", radio("rd-3", "plan-off", "Lifetime", { disabled: true })) +
        '</div>',
        specs: [["Circle", 18], ["Dot", 8], ["Gap", 8], ["Mobile tap area", 44]] }),
      doc({ name: "Switch", demoCls: "doc-demo--start", keys: "toggle on off",
        text: "Settings that take effect immediately, with no save button.",
        demo: '<div class="state-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">' +
          cell("Off", toggleSwitch("sw-1", "Dark mode", {})) +
          cell("On", toggleSwitch("sw-2", "Dark mode", { checked: true })) +
          cell("Disabled", toggleSwitch("sw-3", "Dark mode", { disabled: true })) +
          cell("Disabled on", toggleSwitch("sw-4", "Dark mode", { checked: true, disabled: true })) +
        '</div>',
        specs: [["Track", "36 × 20"], ["Knob", 16], ["Travel", "150ms · Standard"]] })
    ];

    var navigation = [
      doc({ name: "Tabs", keys: "tab bar navigation",
        text: "Switch between views of the same thing. Click to try.",
        demo: '<div class="tabs" role="tablist" aria-label="Project" style="max-width:360px">' +
          '<button class="tab" type="button" role="tab" aria-selected="true">Overview</button>' +
          '<button class="tab" type="button" role="tab" aria-selected="false">Activity</button>' +
          '<button class="tab" type="button" role="tab" aria-selected="false">Settings</button></div>',
        specs: [["Height", 40], ["Indicator", "2px accent"], ["Label", "Label"], ["Padding", 12]] }),
      doc({ name: "Segmented control", keys: "segment toggle group",
        text: "A compact choice between two to four options that changes the view in place.",
        demo: '<div class="segmented" role="group" aria-label="View">' +
          '<button class="segment" type="button" aria-pressed="false">Day</button>' +
          '<button class="segment" type="button" aria-pressed="true">Week</button>' +
          '<button class="segment" type="button" aria-pressed="false">Month</button></div>',
        specs: [["Height", 32], ["Padding", 3], ["Radius", 8], ["Selected", "Surface · Elevation 1"]] }),
      doc({ name: "List", keys: "rows items people",
        text: "Rows of related items. The current row takes accent/tint. Click a row to select it.",
        demo: '<div class="list">' +
          '<button class="list-row" type="button"><span class="avatar" style="--size:32px">AK</span><span class="list-text"><span class="list-title">Ava Kim</span><span class="list-meta">Product design</span></span>' + I.chevronRight + '</button>' +
          '<button class="list-row" type="button" aria-current="true"><span class="avatar" style="--size:32px">LP</span><span class="list-text"><span class="list-title">Leo Park</span><span class="list-meta">Engineering</span></span>' + I.chevronRight + '</button>' +
          '<button class="list-row" type="button"><span class="avatar avatar--neutral" style="--size:32px">MC</span><span class="list-text"><span class="list-title">Mia Chen</span><span class="list-meta">Research</span></span>' + I.chevronRight + '</button>' +
        '</div>',
        specs: [["Row", 56], ["Avatar", 32], ["Padding", 16], ["Divider", "border/default"]] })
    ];

    var feedback = [
      doc({ name: "Alert", wide: true, demoCls: "doc-demo--column", keys: "banner message notice info success warning danger error",
        text: "Inline messages about the page or a task. Accent for information, status colours for everything else.",
        demo: '<div class="grid grid--2" style="width:100%">' +
          '<div class="alert" role="status">' + I.info + '<span class="alert-title">New components available</span><span class="alert-text">Refresh the library to get the latest buttons.</span></div>' +
          '<div class="alert alert--success" role="status">' + I.checkCircle + '<span class="alert-title">Changes saved</span><span class="alert-text">Everyone on the team can see them now.</span></div>' +
          '<div class="alert alert--warning" role="status">' + I.alertTriangle + '<span class="alert-title">Storage almost full</span><span class="alert-text">You have used 92% of your 10 GB.</span></div>' +
          '<div class="alert alert--danger" role="alert">' + I.alertCircle + '<span class="alert-title">Couldn’t publish</span><span class="alert-text">Check your connection and try again.</span></div>' +
        '</div>',
        specs: [["Padding", "12 / 14"], ["Radius", 8], ["Icon", 20], ["Title", "Label"], ["Text", "Body"]] }),
      doc({ name: "Toast", keys: "snackbar notification",
        text: "A short confirmation that disappears on its own after 5 seconds. One action at most.",
        demo: '<div class="toast" role="status">' + I.checkCircle + '<span class="toast-text">Project archived</span>' +
          '<button class="toast-action" type="button">Undo</button></div>',
        specs: [["Radius", 8], ["Elevation", 3], ["Surface", "inverse/surface"], ["Enters", "Toast in · 400ms"]] }),
      doc({ name: "Tooltip", keys: "hint label hover",
        text: "Names an icon-only control. Appears after a 500ms hover; never holds anything you can click.",
        demo: '<div class="tooltip-anchor"><span class="tooltip" role="tooltip">Copy link</span>' +
          '<button class="btn btn--secondary btn--icon" type="button" aria-label="Copy link">' + I.copy + '</button></div>',
        specs: [["Padding", "6 / 8"], ["Radius", 6], ["Text", "Caption"], ["Delay", "500ms"], ["Enters", "Tooltip in · 150ms"]] }),
      doc({ name: "Progress", demoCls: "doc-demo--column", keys: "loader spinner bar loading",
        text: "Show how far along a task is. Use a bar when you know the amount, a spinner when you don't.",
        demo: '<div class="progress-row"><div class="progress-label"><span>Uploading</span><span>64%</span></div>' +
            '<div class="progress" role="progressbar" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100"><span class="progress-bar" style="width:64%"></span></div></div>' +
          '<div class="progress-row"><div class="progress-label"><span>Preparing export</span></div>' +
            '<div class="progress progress--indeterminate" role="progressbar" aria-label="Preparing export"><span class="progress-bar"></span></div></div>' +
          '<div class="row"><span class="spinner" style="--size:16px"></span><span class="spinner"></span><span class="spinner" style="--size:32px"></span></div>',
        specs: [["Track", 6], ["Radius", "full"], ["Spinner", "16 · 24 · 32"], ["Easing", "Linear"]] }),
      doc({ name: "Skeleton", keys: "placeholder loading shimmer",
        text: "Holds the shape of content while it loads, so the layout doesn't jump when it arrives.",
        demo: '<div class="skeleton-card" aria-hidden="true"><span class="skeleton skeleton--circle"></span>' +
          '<div class="skeleton-lines"><span class="skeleton" style="width:60%"></span><span class="skeleton"></span><span class="skeleton" style="width:80%"></span></div></div>',
        specs: [["Line", 10], ["Radius", 6], ["Shimmer", "1.4s · Linear"]] }),
      doc({ name: "Badge", keys: "tag status label count",
        text: "A short status or count. Keep it to one or two words.",
        demo: '<span class="badge">Draft</span><span class="badge badge--accent">New</span><span class="badge badge--solid">Beta</span>' +
          '<span class="badge badge--success"><span class="badge-dot"></span>Live</span><span class="badge badge--warning">Pending</span>' +
          '<span class="badge badge--danger">Failed</span>' +
          '<span class="icon-with-count" aria-label="3 notifications">' + I.bell + '<span class="count">3</span></span>',
        specs: [["Height", 20], ["Padding", 8], ["Text", "Caption · SemiBold"], ["Radius", "full"]] })
    ];

    var content = [
      doc({ name: "Chip", keys: "filter tag pill",
        text: "Filters and multi-select choices. Click a chip to select it.",
        demo: '<button class="chip" type="button" aria-pressed="false" data-chip>Design</button>' +
          '<button class="chip is-hover" type="button" aria-pressed="false" data-chip>Research</button>' +
          '<button class="chip" type="button" aria-pressed="true" data-chip>' + I.check + 'Motion</button>' +
          '<span class="chip">Figma<span class="chip-remove" role="button" tabindex="0" aria-label="Remove Figma">' + I.x + '</span></span>' +
          '<button class="chip" type="button" disabled>Archived</button>',
        specs: [["Height", 32], ["Padding", 12], ["Radius", "full"], ["Label", "Label · Medium"], ["Icon", 14]] }),
      doc({ name: "Avatar", keys: "profile user initials people",
        text: "A person or team. Initials when there's no photo; a status dot for presence.",
        demo: '<span class="avatar" style="--size:24px">AK</span><span class="avatar" style="--size:32px">AK</span>' +
          '<span class="avatar">AK</span><span class="avatar" style="--size:56px">AK<span class="avatar-status"></span></span>' +
          '<span class="avatar-group"><span class="avatar" style="--size:32px">LP</span><span class="avatar" style="--size:32px">MC</span>' +
          '<span class="avatar" style="--size:32px">JS</span><span class="avatar avatar--neutral" style="--size:32px">+3</span></span>',
        specs: [["Sizes", "24 · 32 · 40 · 56"], ["Radius", "full"], ["Initials", "38% of size"], ["Status", "28% of size"]] }),
      doc({ name: "Card", keys: "container tile media",
        text: "Groups one piece of content with its actions. Elevation 1 at rest.",
        demo: '<div class="ui-card"><div class="ui-card-media"></div><div class="ui-card-body">' +
          '<span class="ui-card-overline">Guide</span><span class="ui-card-title">Designing with motion</span>' +
          '<span class="ui-card-text">How to choose durations and curves that feel right.</span></div>' +
          '<div class="ui-card-actions"><button class="btn btn--ghost btn--sm" type="button">Save</button>' +
          '<button class="btn btn--primary btn--sm" type="button">Read</button></div></div>',
        specs: [["Radius", 12], ["Padding", 16], ["Elevation", 1], ["Title", "Title"]] }),
      doc({ name: "Dialog", wide: true, keys: "modal popup confirm",
        text: "Interrupts to confirm something important. The destructive action names exactly what will happen.",
        demo: '<div class="dialog-stage"><div class="dialog" role="dialog" aria-label="Delete project">' +
          '<span class="dialog-title">Delete project?</span>' +
          '<span class="dialog-text">“Aurora redesign” and its 24 files will be deleted for everyone. This can’t be undone.</span>' +
          '<div class="dialog-actions"><button class="btn btn--secondary" type="button">Cancel</button>' +
          '<button class="btn btn--danger" type="button">Delete project</button></div></div></div>',
        specs: [["Max width", 400], ["Radius", 16], ["Padding", 24], ["Elevation", 4], ["Backdrop", "overlay/scrim"], ["Enters", "Dialog in · 400ms"]] })
    ];

    $("body-components").innerHTML =
      group("Inputs", inputs.length + " components", null, '<div class="grid" style="--min:300px">' + inputs.join("") + '</div>') +
      group("Navigation", navigation.length + " components", null, '<div class="grid" style="--min:300px">' + navigation.join("") + '</div>') +
      group("Feedback", feedback.length + " components", null, '<div class="grid" style="--min:300px">' + feedback.join("") + '</div>') +
      group("Content", content.length + " components", null, '<div class="grid" style="--min:300px">' + content.join("") + '</div>');

    document.querySelectorAll("[data-indeterminate]").forEach(function (el) { el.indeterminate = true; });
  }

  /* ================= ANIMATIONS ================= */
  var ANIM_MARKUP = {
    modalIn: '<div class="mini-modal anim-target a-modalIn"><i></i><i></i><b></b></div>',
    modalOut: '<div class="mini-modal anim-target a-modalOut"><i></i><i></i><b></b></div>',
    dropdownIn: '<div class="mini-menu anim-target a-dropdownIn"><i></i><i class="on"></i><i></i></div>',
    toastIn: '<div class="mini-toast anim-target a-toastIn"><i></i><b></b></div>',
    drawerIn: '<div class="mini-drawer-wrap"><div class="mini-drawer anim-target a-drawerIn"><i></i><i></i><i></i></div></div>',
    tooltipIn: '<span class="mini-tip anim-target a-tooltipIn">Tooltip</span>',
    popIn: '<span class="mini-heart anim-target a-popIn">' + I.heartFilled + '</span>',
    press: '<span class="mini-btn anim-target a-press">Button</span>',
    errorShake: '<span class="mini-input anim-target a-errorShake"></span>',
    expandIn: '<div class="mini-accordion anim-target a-expandIn"><i></i><i></i><i></i></div>',
    checkDraw: '<svg class="mini-check" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22"/><path class="anim-target a-checkDraw" d="M14 25l7 7 13-15"/></svg>',
    ping: '<span class="ping-wrap"><span class="ping-ring anim-target a-ping"></span><span class="ping-core"></span></span>',
    ripple: '<span class="ping-wrap"><span class="ping-ring ping-ring--outline anim-target a-ripple"></span><span class="ping-core"></span></span>',
    glow: '<span class="shape anim-target a-glow" style="width:36px;height:36px;border-radius:50%"></span>',
    shimmer: '<div class="mini-skeleton"><i class="anim-target a-shimmer"></i><i class="anim-target a-shimmer"></i><i class="anim-target a-shimmer"></i></div>',
    typingDots: '<div class="typing"><i class="anim-target a-typingDots"></i><i class="anim-target a-typingDots"></i><i class="anim-target a-typingDots"></i></div>',
    blink: '<span class="cursor-demo anim-target a-blink">|</span>',
    typewriter: '<span class="type-demo anim-target a-typewriter">Hello, designer</span>',
    marquee: '<div class="marquee-wrap"><span class="marquee-text anim-target a-marquee">Design · Motion · Colour · Type · Design · Motion · Colour · Type · </span></div>',
    progressIndeterminate: '<div class="mini-progress"><i class="anim-target a-progressIndeterminate"></i></div>'
  };

  var EASE_NAMES = {
    "linear": "Linear", "ease": "Ease", "ease-in": "Ease in", "ease-out": "Ease out", "ease-in-out": "Ease in-out",
    "cubic-bezier(0.2,0,0,1)": "Standard", "cubic-bezier(0.05,0.7,0.1,1)": "Enter",
    "cubic-bezier(0.3,0,0.8,0.15)": "Exit", "cubic-bezier(0.34,1.56,0.64,1)": "Spring"
  };

  function easeName(tf) {
    var k = tf.replace(/\s/g, "");
    if (EASE_NAMES[k]) return EASE_NAMES[k];
    return k.indexOf("steps") === 0 ? "Stepped" : "Custom curve";
  }

  function msLabel(d) {
    var v = parseFloat(d);
    return Math.round(d.indexOf("ms") !== -1 ? v : v * 1000) + "ms";
  }

  function renderAnimations() {
    var total = D.ANIM_GROUPS.reduce(function (n, g) { return n + g.items.length; }, 0);

    var html = group("Choosing motion", null, null,
      '<div class="principles">' + D.MOTION_PRINCIPLES.map(function (p) {
        return '<article class="card principle" data-name="' + key(["principle", p.name, p.text]) + '">' +
          '<div class="principle-head"><h3 class="doc-title">' + p.name + '</h3></div>' +
          '<span class="principle-spec">' + p.spec + '</span>' +
          '<p class="doc-text">' + p.text + '</p></article>';
      }).join("") + '</div>');

    D.ANIM_GROUPS.forEach(function (g) {
      html += '<div class="anim-group"' + (g.once ? " data-once" : "") + '>' + group(g.name, g.items.length + (g.once ? " · plays once" : " · loops"), g.desc || null,
        '<div class="grid" style="--min:190px">' + g.items.map(function (item) {
          var id = typeof item === "string" ? item : item[0];
          var label = typeof item === "string" ? item : item[1];
          return '<article class="card" data-name="' + key([label, id, g.name]) + '">' +
            '<div class="stage">' + (ANIM_MARKUP[id] || '<div class="shape anim-target a-' + id + '"></div>') + '</div>' +
            '<div class="card-foot">' +
              '<div class="card-text"><span class="card-name">' + label + '</span><span class="card-spec" data-spec></span></div>' +
              '<button class="btn btn--ghost btn--sm btn--icon replay" type="button" aria-label="Replay ' + label + '">' + I.replay + '</button>' +
            '</div>' +
          '</article>';
        }).join("") + '</div>') + '</div>';
    });

    $("body-animations").innerHTML = html;

    $("body-animations").querySelectorAll(".card").forEach(function (card) {
      var target = card.querySelector(".anim-target");
      var slot = card.querySelector("[data-spec]");
      if (!target || !slot) return;
      var cs = getComputedStyle(target);
      var loops = cs.animationIterationCount === "infinite";
      slot.textContent = msLabel(cs.animationDuration) + " · " + easeName(cs.animationTimingFunction) + (loops ? " · Loop" : "");
    });

    return total;
  }

  setInterval(function () {
    if (current !== "animations" || document.hidden) return;
    document.querySelectorAll(".anim-group[data-once]").forEach(function (g) {
      g.querySelectorAll(".card:not([hidden]) .anim-target").forEach(function (el, i) {
        setTimeout(function () { restart(el); }, i * 25);
      });
    });
  }, 3400);

  /* ================= CURVES ================= */
  var P1 = [0.2, 0], P2 = [0, 1];
  var dragging = null;

  function linearEasing(fn) {
    var parts = [];
    for (var i = 0; i <= 40; i++) { parts.push(fn(i / 40).toFixed(4)); }
    return "linear(" + parts.join(",") + ")";
  }

  function formulaPath(fn) {
    var d = "";
    for (var i = 0; i <= 60; i++) {
      var t = i / 60;
      d += (i ? " L" : "M") + (t * 100).toFixed(1) + "," + (100 - fn(t) * 100).toFixed(1);
    }
    return d;
  }

  function curveCard(o) {
    return '<article class="card curve-card" data-name="' + key([o.name, o.keys || ""]) + '">' +
      '<div class="curve-stage">' +
        '<svg class="curve-svg" viewBox="-6 -24 112 148" preserveAspectRatio="none" aria-hidden="true">' +
          '<path class="diag-path" vector-effect="non-scaling-stroke" d="M0,100 L100,0"/>' +
          '<path class="curve-path" vector-effect="non-scaling-stroke" d="' + o.path + '"/>' +
        '</svg>' +
        '<div class="mini-track"><span class="mini-dot" style="--tf:' + o.tf + '"></span></div>' +
      '</div>' +
      '<div class="card-foot">' +
        '<div class="card-text"><span class="card-name">' + o.name + '</span><span class="curve-values">' + o.values + '</span></div>' +
        (o.bezier ? '<button class="btn btn--ghost btn--sm" type="button" data-bezier="' + o.bezier.join(",") + '">Edit</button>' : "") +
      '</div>' +
      (o.use ? '<p class="doc-text">' + o.use + '</p>' : "") +
    '</article>';
  }

  function bezierCard(name, p, use, keys) {
    return curveCard({
      name: name, keys: keys, use: use, bezier: p,
      path: bezierPath(p),
      tf: "cubic-bezier(" + p.join(",") + ")",
      values: p.map(num).join(", ")
    });
  }

  function renderCurves() {
    var html = group("Curve editor", null, null,
      '<article class="card plotter">' +
        '<div class="plotter-graph"><svg id="bezSvg" viewBox="-16 -44 136 190" role="img" aria-label="Curve editor — drag the two handles"></svg></div>' +
        '<div class="plotter-side">' +
          '<div class="bezier-values"><span class="state-name">Bezier values</span><div class="bezier-numbers" id="bezNumbers"></div>' +
            '<p class="hint">In Figma: Prototype › Animation › Custom bezier. Drag the round handles to reshape the curve.</p></div>' +
          '<div class="track" aria-hidden="true"><span class="track-dot" id="bezDot"></span></div>' +
          '<div class="row"><button class="btn btn--secondary btn--sm" type="button" id="copyBez">' + I.copy + 'Copy values</button>' +
            '<span class="hint" id="copyState" aria-live="polite"></span></div>' +
          '<div class="stack" style="gap:8px"><span class="state-name">Start from</span><div class="preset-row" id="bezPresets"></div></div>' +
          '<ul class="rule-list">' +
            '<li class="yes">' + I.info + '<span>Horizontal is time, vertical is progress. Steep means fast, flat means slow.</span></li>' +
            '<li class="yes">' + I.info + '<span>Handles may go above or below the box — that is how a curve overshoots.</span></li>' +
          '</ul>' +
        '</div>' +
      '</article>');

    html += group("Gani easings", D.SYSTEM_EASINGS.length + " curves", "The curves behind the easing variables.",
      '<div class="grid grid--3">' + D.SYSTEM_EASINGS.map(function (e) {
        return bezierCard(e.name, e.p, e.use, "gani system variable");
      }).join("") + '</div>');

    html += group("Standard curves", D.STANDARD_CURVES.length + " curves", "Built into browsers and every prototyping tool.",
      '<div class="grid grid--3">' + D.STANDARD_CURVES.map(function (c) {
        if (c.steps) {
          return curveCard({
            name: c.name, keys: "standard steps",
            path: c.steps === "start" ? "M0,100 L0,0 L100,0" : "M0,100 L100,100 L100,0",
            tf: c.steps === "start" ? "step-start" : "step-end",
            values: c.steps === "start" ? "Jumps to the end immediately" : "Waits, then jumps at the end"
          });
        }
        return bezierCard(c.name, c.p, null, "standard");
      }).join("") + '</div>');

    html += group("Named easings", "30 curves",
      "The classic set, each as In, Out and In-out. The values are the closest bezier; Elastic and Bounce can't be drawn with one, so use a spring or keyframes.", "");

    D.EASING_FAMILIES.forEach(function (f) {
      html += group(f.family, "In · Out · In-out", null,
        '<div class="grid grid--3">' + ["In", "Out", "InOut"].map(function (dir) {
          var c = f.curves[dir];
          return curveCard({
            name: "ease" + dir + f.family, keys: f.family + " named",
            path: formulaPath(c.fn),
            tf: linearEasing(c.fn),
            bezier: c.bezier,
            values: c.bezier ? "≈ " + c.bezier.map(num).join(", ") : "<em>No bezier — use a spring</em>"
          });
        }).join("") + '</div>');
    });

    $("body-curves").innerHTML = html;
    renderPresets();
    drawBezier();
    bindPlotter();
  }

  var PRESETS = D.STANDARD_CURVES.filter(function (c) { return c.p; })
    .concat(D.SYSTEM_EASINGS.filter(function (e) { return e.name !== "Linear"; }));

  function renderPresets() {
    $("bezPresets").innerHTML = PRESETS.map(function (p) {
      return '<button class="btn btn--secondary btn--sm" type="button" data-bezier="' + p.p.join(",") + '" data-preset>' + p.name + '</button>';
    }).join("");
  }

  function drawBezier() {
    var svg = $("bezSvg");
    var a = [0, 100], b = [P1[0] * 100, 100 - P1[1] * 100], c = [P2[0] * 100, 100 - P2[1] * 100], d = [100, 0];
    svg.innerHTML =
      '<path class="grid-path" d="M0,100 L100,100 M0,0 L0,100 M0,0 L100,0 M100,0 L100,100"/>' +
      '<path class="diag-path" d="M0,100 L100,0"/>' +
      '<line class="handle-line" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>' +
      '<line class="handle-line" x1="' + d[0] + '" y1="' + d[1] + '" x2="' + c[0] + '" y2="' + c[1] + '"/>' +
      '<path class="curve-path" d="M0,100 C' + b[0] + ',' + b[1] + ' ' + c[0] + ',' + c[1] + ' 100,0"/>' +
      '<circle class="anchor" cx="0" cy="100" r="3"/><circle class="anchor" cx="100" cy="0" r="3"/>' +
      '<text class="axis-label" x="0" y="113">Start</text>' +
      '<text class="axis-label" x="100" y="113" text-anchor="end">Time →</text>' +
      '<text class="axis-label" x="-4" y="3" text-anchor="end">End</text>' +
      '<circle class="handle" data-handle="1" cx="' + b[0] + '" cy="' + b[1] + '" r="6"/>' +
      '<circle class="handle" data-handle="2" cx="' + c[0] + '" cy="' + c[1] + '" r="6"/>';

    var values = [P1[0], P1[1], P2[0], P2[1]];
    $("bezNumbers").innerHTML = ["X1", "Y1", "X2", "Y2"].map(function (l, i) {
      return '<span class="bezier-number"><span>' + l + '</span><strong>' + num(values[i]) + '</strong></span>';
    }).join("");

    var dot = $("bezDot");
    dot.style.setProperty("--tf", "cubic-bezier(" + values.join(",") + ")");
    restart(dot);

    var joined = values.map(num).join(",");
    document.querySelectorAll("[data-preset]").forEach(function (btn) {
      var p = btn.getAttribute("data-bezier").split(",").map(Number).map(num).join(",");
      btn.setAttribute("aria-pressed", p === joined ? "true" : "false");
    });
  }

  function bindPlotter() {
    var svg = $("bezSvg");
    svg.addEventListener("pointerdown", function (e) {
      var h = e.target.closest(".handle");
      if (!h) return;
      dragging = h.getAttribute("data-handle");
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var rect = svg.getBoundingClientRect();
      var vb = svg.viewBox.baseVal;
      var x = ((e.clientX - rect.left) / rect.width) * vb.width + vb.x;
      var y = ((e.clientY - rect.top) / rect.height) * vb.height + vb.y;
      // Time can't run backwards, so x stays inside 0–1; progress may overshoot.
      var pt = [Math.min(1, Math.max(0, x / 100)), Math.min(1.6, Math.max(-0.6, (100 - y) / 100))];
      pt = [Math.round(pt[0] * 100) / 100, Math.round(pt[1] * 100) / 100];
      if (dragging === "1") { P1 = pt; } else { P2 = pt; }
      drawBezier();
    });
    ["pointerup", "pointercancel"].forEach(function (ev) {
      svg.addEventListener(ev, function () { dragging = null; });
    });
  }

  /* ================= APPEARANCE ================= */
  function applyTheme(choice) {
    if (choice === "light" || choice === "dark") { document.documentElement.setAttribute("data-theme", choice); }
    else { document.documentElement.removeAttribute("data-theme"); choice = "system"; }
    document.querySelectorAll("[data-theme-choice]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-theme-choice") === choice ? "true" : "false");
    });
    try { localStorage.setItem("ganiTheme", choice); } catch (err) {}
  }

  /* ================= EVENTS ================= */
  document.addEventListener("click", function (e) {
    var t = e.target;

    var navLink = t.closest(".nav-link");
    if (navLink) { show(navLink.getAttribute("data-section")); window.scrollTo(0, 0); return; }

    var themeBtn = t.closest("[data-theme-choice]");
    if (themeBtn) { applyTheme(themeBtn.getAttribute("data-theme-choice")); return; }

    var platformBtn = t.closest("[data-platform]");
    if (platformBtn) {
      var next = platformBtn.getAttribute("data-platform");
      if (next !== platform) {
        platform = next;
        renderTypography();
        applyFilter();
        document.querySelector('[data-platform="' + next + '"]').focus();
        try { localStorage.setItem("ganiPlatform", next); } catch (err) {}
      }
      return;
    }

    var replay = t.closest(".replay");
    if (replay) { replay.closest(".card").querySelectorAll(".anim-target").forEach(restart); return; }

    var bez = t.closest("[data-bezier]");
    if (bez) {
      var p = bez.getAttribute("data-bezier").split(",").map(Number);
      P1 = [p[0], p[1]];
      P2 = [p[2], p[3]];
      drawBezier();
      if (!bez.hasAttribute("data-preset")) { $("bezSvg").closest(".card").scrollIntoView({ behavior: "smooth", block: "start" }); }
      return;
    }

    if (t.closest("#copyBez")) {
      var text = [P1[0], P1[1], P2[0], P2[1]].map(num).join(", ");
      var state = $("copyState");
      var done = function (msg) { state.textContent = msg; setTimeout(function () { state.textContent = ""; }, 1600); };
      if (navigator.clipboard) { navigator.clipboard.writeText(text).then(function () { done("Copied " + text); }, function () { done("Select and copy the values above"); }); }
      else { done("Select and copy the values above"); }
      return;
    }

    var groupBtn = t.closest(".btn-group > .btn");
    if (groupBtn) {
      groupBtn.parentNode.querySelectorAll(".btn").forEach(function (b) {
        b.setAttribute("aria-pressed", b === groupBtn ? "true" : "false");
      });
      return;
    }

    var toggle = t.closest("[data-toggle]");
    if (toggle) { toggle.setAttribute("aria-pressed", toggle.getAttribute("aria-pressed") === "true" ? "false" : "true"); return; }

    var load = t.closest('[data-demo="load"]');
    if (load && !load.classList.contains("is-loading")) {
      load.classList.add("is-loading");
      load.setAttribute("aria-busy", "true");
      setTimeout(function () { load.classList.remove("is-loading"); load.removeAttribute("aria-busy"); }, 1600);
      return;
    }

    var tab = t.closest('.tabs [role="tab"]');
    if (tab) {
      tab.parentNode.querySelectorAll('[role="tab"]').forEach(function (b) { b.setAttribute("aria-selected", b === tab ? "true" : "false"); });
      return;
    }

    var segment = t.closest(".segment");
    if (segment) {
      segment.parentNode.querySelectorAll(".segment").forEach(function (b) { b.setAttribute("aria-pressed", b === segment ? "true" : "false"); });
      return;
    }

    var chip = t.closest("[data-chip]");
    if (chip) {
      var on = chip.getAttribute("aria-pressed") !== "true";
      chip.setAttribute("aria-pressed", on ? "true" : "false");
      chip.classList.remove("is-hover");
      var first = chip.querySelector("svg");
      if (on && !first) { chip.insertAdjacentHTML("afterbegin", I.check); }
      if (!on && first) { first.remove(); }
      return;
    }

    var row = t.closest(".list-row");
    if (row) {
      row.parentNode.querySelectorAll(".list-row").forEach(function (r) {
        if (r === row) { r.setAttribute("aria-current", "true"); } else { r.removeAttribute("aria-current"); }
      });
    }
  });

  $("search").addEventListener("input", applyFilter);
  window.addEventListener("hashchange", function () { show(location.hash.slice(1)); });

  /* ================= INIT ================= */
  var saved = {};
  try {
    saved.section = localStorage.getItem("ganiSection");
    saved.theme = localStorage.getItem("ganiTheme");
    saved.platform = localStorage.getItem("ganiPlatform");
  } catch (err) {}
  if (saved.platform === "mobile") { platform = "mobile"; }

  renderNav();
  renderPages();
  renderTypography();
  renderColors();
  renderVariables();
  renderButtons();
  renderComponents();
  renderAnimations();
  renderCurves();
  countItems();
  applyTheme(saved.theme);
  show(location.hash.slice(1) || saved.section || "typography");
})();
