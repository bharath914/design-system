/* ============================================================
   Gani Design System — Motion Data
   The catalogue: animation names by category, easing formulas,
   native CSS timing keywords and the spec's exact bezier presets.
   Exposed as window.GANI so app.js can read it without a bundler.
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------- animation catalogue ---------- */
  var ANIM_GROUPS = [
    { cat: "Entrances", items: ["fadeIn", "fadeInUp", "fadeInDown", "fadeInLeft", "fadeInRight", "zoomIn", "slideInUp", "bounceIn", "rotateIn", "flipInX"] },
    { cat: "Exits", items: ["fadeOut", "fadeOutUp", "zoomOut", "slideOutDown", "bounceOut", "rotateOut", "flipOutX", "lightSpeedOut"] },
    { cat: "Attention Seekers", items: ["pulse", "shake", "headShake", "swing", "tada", "wobble", "jello", "heartBeat", "flash", "rubberBand"] },
    { cat: "Continuous", items: ["spin", "spinReverse", "float", "bob", "glow", "breathe", "ping", "morphBlob"] },
    { cat: "Special", items: ["typewriter", "blink", "shimmer", "marquee", "ripple", "skewPulse"] }
  ];

  // Names whose demo needs something other than a plain square.
  var SPECIAL_MARKUP = {
    typewriter: '<div class="type-demo k-typewriter">craft_motion();</div>',
    blink: '<span class="cursor-demo k-blink">|</span>',
    shimmer: '<div class="shimmer-demo k-shimmer"></div>',
    marquee: '<div class="marquee-wrap"><span class="marquee-text k-marquee">keep&nbsp;moving&nbsp;•&nbsp;keep&nbsp;moving&nbsp;•&nbsp;</span></div>',
    ripple: '<div class="ripple-demo"><span class="ripple-ring k-ripple"></span><span class="ripple-core"></span></div>'
  };

  // Categories that play once and are restarted on a timer. The rest loop in CSS.
  var AUTOLOOP_CATS = ["Entrances", "Exits", "Attention Seekers"];

  /* ---------- easing formulas (easings.net reference set) ---------- */
  function easeOutBounce(x) {
    var n1 = 7.5625, d1 = 2.75;
    if (x < 1 / d1) { return n1 * x * x; }
    else if (x < 2 / d1) { x -= 1.5 / d1; return n1 * x * x + 0.75; }
    else if (x < 2.5 / d1) { x -= 2.25 / d1; return n1 * x * x + 0.9375; }
    else { x -= 2.625 / d1; return n1 * x * x + 0.984375; }
  }

  var EASE = {
    Sine: {
      In: function (x) { return 1 - Math.cos(x * Math.PI / 2); },
      Out: function (x) { return Math.sin(x * Math.PI / 2); },
      InOut: function (x) { return -(Math.cos(Math.PI * x) - 1) / 2; }
    },
    Quad: {
      In: function (x) { return x * x; },
      Out: function (x) { return 1 - (1 - x) * (1 - x); },
      InOut: function (x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
    },
    Cubic: {
      In: function (x) { return x * x * x; },
      Out: function (x) { return 1 - Math.pow(1 - x, 3); },
      InOut: function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    },
    Quart: {
      In: function (x) { return Math.pow(x, 4); },
      Out: function (x) { return 1 - Math.pow(1 - x, 4); },
      InOut: function (x) { return x < 0.5 ? 8 * Math.pow(x, 4) : 1 - Math.pow(-2 * x + 2, 4) / 2; }
    },
    Quint: {
      In: function (x) { return Math.pow(x, 5); },
      Out: function (x) { return 1 - Math.pow(1 - x, 5); },
      InOut: function (x) { return x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2; }
    },
    Expo: {
      In: function (x) { return x === 0 ? 0 : Math.pow(2, 10 * x - 10); },
      Out: function (x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); },
      InOut: function (x) { return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2; }
    },
    Circ: {
      In: function (x) { return 1 - Math.sqrt(1 - Math.pow(x, 2)); },
      Out: function (x) { return Math.sqrt(1 - Math.pow(x - 1, 2)); },
      InOut: function (x) { return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2; }
    },
    Back: {
      In: function (x) { var c1 = 1.70158, c3 = c1 + 1; return c3 * x * x * x - c1 * x * x; },
      Out: function (x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
      InOut: function (x) { var c1 = 1.70158, c2 = c1 * 1.525; return x < 0.5 ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2; }
    },
    Elastic: {
      In: function (x) { var c4 = (2 * Math.PI) / 3; return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4); },
      Out: function (x) { var c4 = (2 * Math.PI) / 3; return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1; },
      InOut: function (x) { var c5 = (2 * Math.PI) / 4.5; return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1; }
    },
    Bounce: {
      In: function (x) { return 1 - easeOutBounce(1 - x); },
      Out: easeOutBounce,
      InOut: function (x) { return x < 0.5 ? (1 - easeOutBounce(1 - 2 * x)) / 2 : (1 + easeOutBounce(2 * x - 1)) / 2; }
    }
  };

  var FAMILY_ORDER = ["Sine", "Quad", "Cubic", "Quart", "Quint", "Expo", "Circ", "Back", "Elastic", "Bounce"];

  /* ---------- native CSS timing functions ---------- */
  var KEYWORDS = [
    { name: "linear", tf: "linear" },
    { name: "ease", tf: "ease" },
    { name: "ease-in", tf: "ease-in" },
    { name: "ease-out", tf: "ease-out" },
    { name: "ease-in-out", tf: "ease-in-out" },
    { name: "step-start", tf: "step-start" },
    { name: "step-end", tf: "step-end" }
  ];

  // Exact control points the CSS spec assigns to each keyword.
  var PRESETS = [
    { name: "linear", p: [0, 0, 1, 1] },
    { name: "ease", p: [0.25, 0.1, 0.25, 1] },
    { name: "ease-in", p: [0.42, 0, 1, 1] },
    { name: "ease-out", p: [0, 0, 0.58, 1] },
    { name: "ease-in-out", p: [0.42, 0, 0.58, 1] }
  ];

  global.GANI = {
    ANIM_GROUPS: ANIM_GROUPS,
    SPECIAL_MARKUP: SPECIAL_MARKUP,
    AUTOLOOP_CATS: AUTOLOOP_CATS,
    EASE: EASE,
    FAMILY_ORDER: FAMILY_ORDER,
    KEYWORDS: KEYWORDS,
    PRESETS: PRESETS
  };
})(window);
