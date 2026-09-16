# Gani Design System

The motion foundation for Gani products: a browsable reference of every named animation
and easing curve in the system, plus the drop-in CSS that produces them.

## Run it

```bash
npm run dev
```

Opens a static server on <http://localhost:4321>. There is no build step — the site is
plain HTML, CSS and JavaScript, so you can also just open `index.html` in a browser.

## What's inside

**Animations tab** — 42 named keyframe animations grouped by how they're used:

| Group | Count | Examples |
| --- | --- | --- |
| Entrances | 10 | `fadeInUp`, `zoomIn`, `bounceIn`, `flipInX` |
| Exits | 8 | `fadeOutUp`, `zoomOut`, `rotateOut`, `lightSpeedOut` |
| Attention Seekers | 10 | `pulse`, `shake`, `tada`, `heartBeat`, `rubberBand` |
| Continuous | 8 | `spin`, `float`, `breathe`, `ping`, `morphBlob` |
| Special | 6 | `typewriter`, `blink`, `shimmer`, `marquee`, `ripple` |

**Curves tab** — a draggable `cubic-bezier()` plotter, the 7 native CSS timing keywords,
and the 30 named easing functions (Sine through Bounce, each as In / Out / InOut), every
one plotted as a graph with a dot travelling on that exact timing.

## Using the animation library elsewhere

`css/animations.css` is standalone. Copy it into any project and apply the class:

```html
<link rel="stylesheet" href="css/animations.css">

<div class="k-fadeInUp">Slides up as it fades in</div>
<button class="k-pulse">Look at me</button>
<span class="k-spin">◐</span>
```

Every animation name in the reference has a matching `.k-<name>` class. The only token it
needs from `css/tokens.css` is `--accent-soft`, used by `k-glow`.

## Structure

```
Gani Design System/
├── index.html          reference page
├── css/
│   ├── tokens.css      colours, type, durations, light + dark themes
│   ├── base.css        document shell and typography
│   ├── components.css  top bar, specimen cards, curve plotter
│   └── animations.css  the 42 keyframes + .k-* utility classes
└── js/
    ├── data.js         animation catalogue, easing formulas, CSS presets
    └── app.js          rendering, plotter interaction, filtering
```

## Notes on the motion itself

- Curve dots are driven by CSS `linear()` timing functions sampled from each formula, not
  a JavaScript animation loop — browsers throttle `requestAnimationFrame` in background
  tabs, and CSS keeps running.
- The plotter's ball uses the live `cubic-bezier()` you drag, so what you see is the
  browser's own interpolation, not an approximation.
- Everything respects `prefers-reduced-motion: reduce`.
