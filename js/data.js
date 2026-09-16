/* ============================================================
   Gani Design System — Content
   Everything the documentation shows, in one place.
   ============================================================ */
(function (global) {
  "use strict";

  /* ================= ICONS ================= */
  function icon(paths, filled) {
    return '<svg viewBox="0 0 24 24" fill="' + (filled ? "currentColor" : "none") + '" stroke="' + (filled ? "none" : "currentColor") +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }
  var ICONS = {
    plus: icon('<path d="M12 5v14M5 12h14"/>'),
    arrowRight: icon('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    chevronDown: icon('<path d="M6 9l6 6 6-6"/>'),
    chevronRight: icon('<path d="M9 6l6 6-6 6"/>'),
    download: icon('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
    trash: icon('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    heart: icon('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
    heartFilled: icon('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', true),
    check: icon('<path d="M5 12l5 5 9-10"/>'),
    x: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
    search: icon('<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>'),
    info: icon('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    checkCircle: icon('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>'),
    alertTriangle: icon('<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>'),
    alertCircle: icon('<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>'),
    replay: icon('<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4h4"/>'),
    bell: icon('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
    copy: icon('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>')
  };

  /* ================= SECTIONS ================= */
  var SECTIONS = [
    { id: "typography", group: "Foundations", name: "Typography",
      intro: "One typeface, ten styles, two platforms. Hierarchy comes from size and weight — never from a second font." },
    { id: "colors", group: "Foundations", name: "Colors",
      intro: "One accent for everything you can act on, a neutral scale for everything else, and status colours kept strictly for status." },
    { id: "variables", group: "Foundations", name: "Variables",
      intro: "Every value the system is built from, named the way it appears in the design file. Colour variables have a Light and a Dark mode." },
    { id: "buttons", group: "Components", name: "Buttons",
      intro: "Six variants, seven states, three sizes. Every button on this page is real — hover it, press it, tab to it." },
    { id: "components", group: "Components", name: "Components",
      intro: "The core interface kit, each shown in the states you'll need to design for, with the measurements to match." },
    { id: "animations", group: "Motion", name: "Animations",
      intro: "Every named animation, playing. Each card shows its duration and easing. Press replay to watch one again." },
    { id: "curves", group: "Motion", name: "Curves",
      intro: "An easing curve plots how far an animation has travelled against how much time has passed. Drag the handles to shape your own." }
  ];

  /* ================= TYPOGRAPHY ================= */
  var TYPEFACE = {
    name: "IBM Plex Sans",
    weights: [
      { value: 400, name: "Regular" },
      { value: 500, name: "Medium" },
      { value: 600, name: "SemiBold" },
      { value: 700, name: "Bold" }
    ]
  };

  // web / mobile: [size, line height] in px. tracking in %.
  var TYPE_STYLES = [
    { name: "Display", weight: 700, tracking: -1, web: [48, 56], mobile: [34, 40],
      use: "Hero and marketing headlines. One per screen.", sample: "Design that moves" },
    { name: "Heading 1", weight: 700, tracking: -0.5, web: [36, 44], mobile: [28, 34],
      use: "Page titles.", sample: "Motion with intent" },
    { name: "Heading 2", weight: 600, tracking: -0.5, web: [28, 36], mobile: [24, 30],
      use: "Section titles.", sample: "Every curve has a name" },
    { name: "Heading 3", weight: 600, tracking: 0, web: [22, 30], mobile: [20, 26],
      use: "Card and dialog titles.", sample: "Timing functions" },
    { name: "Title", weight: 600, tracking: 0, web: [18, 26], mobile: [17, 24],
      use: "List headers, nav bar titles, emphasised lines.", sample: "Project settings" },
    { name: "Body Large", weight: 400, tracking: 0, web: [16, 26], mobile: [17, 26],
      use: "Intro paragraphs and long reading.", sample: "A curve describes how progress changes over time." },
    { name: "Body", weight: 400, tracking: 0, web: [14, 22], mobile: [16, 24],
      use: "Default interface text and input values.", sample: "Drag the two handles to shape the curve you need." },
    { name: "Label", weight: 600, tracking: 0, web: [13, 18], mobile: [15, 20],
      use: "Buttons, tabs, form labels, menu items.", sample: "Save changes" },
    { name: "Caption", weight: 500, tracking: 0, web: [12, 16], mobile: [13, 18],
      use: "Helper text, metadata, timestamps.", sample: "Edited 2 minutes ago" },
    { name: "Overline", weight: 600, tracking: 8, upper: true, web: [11, 16], mobile: [12, 16],
      use: "Eyebrows above headings, small section labels.", sample: "Foundations" }
  ];

  var PLATFORMS = {
    web: {
      name: "Web",
      frame: "gani.design",
      notes: [
        "Body is 14px — dense, pointer-driven screens read at arm's length.",
        "Headlines run large (Display 48px) because wide screens have room for them.",
        "Use these styles on any screen 640px wide and up."
      ]
    },
    mobile: {
      name: "Mobile",
      frame: "9:41",
      notes: [
        "Body is 16px. Text fields smaller than 16px make iPhones zoom the whole page.",
        "12px is the smallest text on mobile — nothing smaller stays readable in hand.",
        "Headlines are up to 29% smaller so a title fits in two lines on a 360px screen.",
        "Use these styles below 640px wide."
      ]
    }
  };

  /* ================= COLOURS ================= */
  var ACCENT = {
    name: "Gani Teal",
    light: { step: 600, hex: "#0E7C86" },
    dark: { step: 400, hex: "#3FB6BB" }
  };

  var ACCENT_SCALE = [
    { step: 50, hex: "#EEFAFA" }, { step: 100, hex: "#D3F2F2" }, { step: 200, hex: "#A8E4E5" },
    { step: 300, hex: "#72CFD2" }, { step: 400, hex: "#3FB6BB" }, { step: 500, hex: "#1D9AA1" },
    { step: 600, hex: "#0E7C86" }, { step: 700, hex: "#0F636C" }, { step: 800, hex: "#124F56" },
    { step: 900, hex: "#123F45" }, { step: 950, hex: "#07282D" }
  ];

  var NEUTRAL_SCALE = [
    { step: 0, hex: "#FFFFFF" }, { step: 50, hex: "#F6F7F8" }, { step: 100, hex: "#EEF0F2" },
    { step: 200, hex: "#E1E5E8" }, { step: 300, hex: "#C9CFD4" }, { step: 400, hex: "#9AA3AB" },
    { step: 500, hex: "#6B747E" }, { step: 600, hex: "#545C65" }, { step: 700, hex: "#3B4249" },
    { step: 800, hex: "#232A31" }, { step: 900, hex: "#161C23" }, { step: 950, hex: "#10141A" },
    { step: 1000, hex: "#0B0E12" }
  ];

  var ACCENT_USES = [
    { name: "Fill", variable: "accent/default", demo: "fill", note: "Primary buttons, checked controls, progress." },
    { name: "Hover", variable: "accent/hover", demo: "hover", note: "One step darker in light mode, one step lighter in dark." },
    { name: "Pressed", variable: "accent/pressed", demo: "pressed", note: "Two steps from default, only while held." },
    { name: "Tint", variable: "accent/tint", demo: "tint", note: "Selected chips, rows and toggles. A background, never text." },
    { name: "Text & links", variable: "accent/text", demo: "text", note: "A darker step than the fill so text passes contrast." },
    { name: "Focus ring", variable: "focus/ring", demo: "focus", note: "2px outline, 2px away. Keyboard focus only." },
    { name: "On accent", variable: "text/on-accent", demo: "on", note: "Text and icons placed on an accent fill." }
  ];

  var STATUS = [
    { name: "Success", light: "#2E7A4D", dark: "#5FCF8A", badge: "success", icon: "checkCircle",
      use: "Completed actions, valid input, positive change." },
    { name: "Warning", light: "#A8650F", dark: "#E8AC54", badge: "warning", icon: "alertTriangle",
      use: "Needs attention soon. Nothing is broken yet." },
    { name: "Danger", light: "#B83A2C", dark: "#F07A6A", badge: "danger", icon: "alertCircle",
      use: "Errors, failed states and destructive actions." }
  ];

  // [label, css colour] per mode
  var COLOR_VARIABLES = [
    { name: "bg/page", light: ["Neutral 100", "#EEF0F2"], dark: ["Neutral 950", "#10141A"], use: "Page background" },
    { name: "bg/surface", light: ["Neutral 0", "#FFFFFF"], dark: ["Neutral 900", "#161C23"], use: "Cards, inputs, menus" },
    { name: "bg/sunken", light: ["Neutral 100", "#EEF0F2"], dark: ["Neutral 1000", "#0B0E12"], use: "Wells and tracks inside a surface" },
    { name: "bg/hover", light: ["Neutral 200", "#E1E5E8"], dark: ["Neutral 800", "#232A31"], use: "Hover fill on neutral controls" },
    { name: "bg/pressed", light: ["Neutral 300", "#C9CFD4"], dark: ["Neutral 700", "#3B4249"], use: "Pressed fill on neutral controls" },
    { name: "text/primary", light: ["Neutral 900", "#161C23"], dark: ["Neutral 100", "#EEF0F2"], use: "Headings and body" },
    { name: "text/secondary", light: ["Neutral 600", "#545C65"], dark: ["Neutral 300", "#C9CFD4"], use: "Supporting text" },
    { name: "text/tertiary", light: ["Neutral 500", "#6B747E"], dark: ["Neutral 400", "#9AA3AB"], use: "Captions and placeholders" },
    { name: "text/on-accent", light: ["Neutral 0", "#FFFFFF"], dark: ["Neutral 1000", "#0B0E12"], use: "Text on accent fills" },
    { name: "border/default", light: ["Neutral 900 · 12%", "rgba(22,28,35,.12)"], dark: ["White · 10%", "rgba(255,255,255,.10)"], use: "Card edges and dividers" },
    { name: "border/strong", light: ["Neutral 900 · 24%", "rgba(22,28,35,.24)"], dark: ["White · 22%", "rgba(255,255,255,.22)"], use: "Input and button outlines" },
    { name: "accent/default", light: ["Accent 600", "#0E7C86"], dark: ["Accent 400", "#3FB6BB"], use: "The one accent" },
    { name: "accent/hover", light: ["Accent 700", "#0F636C"], dark: ["Accent 300", "#72CFD2"], use: "Accent while hovered" },
    { name: "accent/pressed", light: ["Accent 800", "#124F56"], dark: ["Accent 200", "#A8E4E5"], use: "Accent while pressed" },
    { name: "accent/tint", light: ["Accent 100", "#D3F2F2"], dark: ["Accent 400 · 16%", "rgba(63,182,187,.16)"], use: "Selected backgrounds" },
    { name: "accent/tint-strong", light: ["Accent 200", "#A8E4E5"], dark: ["Accent 400 · 28%", "rgba(63,182,187,.28)"], use: "Pressed selected backgrounds" },
    { name: "accent/text", light: ["Accent 700", "#0F636C"], dark: ["Accent 300", "#72CFD2"], use: "Links and accent labels" },
    { name: "focus/ring", light: ["Accent 500", "#1D9AA1"], dark: ["Accent 300", "#72CFD2"], use: "Keyboard focus outline" },
    { name: "status/success", light: ["Success 600", "#2E7A4D"], dark: ["Success 400", "#5FCF8A"], use: "Success text, icons and fills" },
    { name: "status/warning", light: ["Warning 600", "#A8650F"], dark: ["Warning 400", "#E8AC54"], use: "Warning text, icons and fills" },
    { name: "status/danger", light: ["Danger 600", "#B83A2C"], dark: ["Danger 400", "#F07A6A"], use: "Error text, icons and danger buttons" },
    { name: "status/danger-hover", light: ["Danger 700", "#9C2F23"], dark: ["Danger 300", "#F49A8D"], use: "Danger button while hovered" },
    { name: "state/disabled-bg", light: ["Neutral 200", "#E1E5E8"], dark: ["Neutral 800", "#232A31"], use: "Disabled fills" },
    { name: "state/disabled-text", light: ["Neutral 400", "#9AA3AB"], dark: ["Neutral 600", "#545C65"], use: "Disabled text and icons" },
    { name: "inverse/surface", light: ["Neutral 900", "#161C23"], dark: ["Neutral 100", "#EEF0F2"], use: "Toasts and tooltips" },
    { name: "inverse/text", light: ["Neutral 100", "#EEF0F2"], dark: ["Neutral 900", "#161C23"], use: "Text on inverse surfaces" },
    { name: "overlay/scrim", light: ["Neutral 950 · 48%", "rgba(16,20,26,.48)"], dark: ["Black · 60%", "rgba(0,0,0,.60)"], use: "Behind dialogs and sheets" }
  ];

  // Checked against the surface they actually sit on.
  var CONTRAST_PAIRS = [
    { fg: "text/primary", bg: "bg/page", use: "Body text on the page" },
    { fg: "text/secondary", bg: "bg/surface", use: "Supporting text on cards" },
    { fg: "text/tertiary", bg: "bg/surface", use: "Captions on cards" },
    { fg: "text/on-accent", bg: "accent/default", use: "Primary button label" },
    { fg: "accent/text", bg: "bg/surface", use: "Links on cards" },
    { fg: "accent/text", bg: "accent/tint", use: "Selected chip label", over: "bg/surface" },
    { fg: "status/danger", bg: "bg/surface", use: "Error message" },
    { fg: "inverse/text", bg: "inverse/surface", use: "Toast text" }
  ];

  /* ================= VARIABLES ================= */
  var VARIABLE_COLLECTIONS = [
    { id: "spacing", name: "Spacing", unit: "px", desc: "A 4px base. Most layouts only need 8, 16, 24 and 32.", rows: [
      ["space/1", 4, "Icon to label, tight inline gaps"],
      ["space/2", 8, "Gaps inside controls and between related items"],
      ["space/3", 12, "Padding in compact components"],
      ["space/4", 16, "Default component padding, mobile margins"],
      ["space/5", 20, "Card padding"],
      ["space/6", 24, "Gaps between cards, tablet margins"],
      ["space/8", 32, "Section spacing within a page, desktop margins"],
      ["space/10", 40, "Between page sections"],
      ["space/12", 48, "Large section breaks"],
      ["space/16", 64, "Hero and page-level spacing"]
    ] },
    { id: "radius", name: "Radius", unit: "px", desc: "Corners grow with the size of the thing they round.", rows: [
      ["radius/none", 0, "Tables and full-bleed media"],
      ["radius/xs", 4, "Checkboxes and small tags"],
      ["radius/sm", 6, "Small buttons and tooltips"],
      ["radius/md", 8, "Buttons, inputs and menus"],
      ["radius/lg", 12, "Cards and large buttons"],
      ["radius/xl", 16, "Dialogs and popovers"],
      ["radius/2xl", 24, "Bottom sheets and hero media"],
      ["radius/full", 999, "Pills, avatars and switches"]
    ] },
    { id: "sizing", name: "Sizing", unit: "px", desc: "Control heights sit on an 8px rhythm. Icons come in four sizes.", rows: [
      ["size/control-sm", 32, "Small buttons, compact inputs, chips"],
      ["size/control-md", 40, "Default buttons, inputs and tabs"],
      ["size/control-lg", 48, "Large buttons — the default on touch screens"],
      ["size/touch-min", 44, "Smallest tap area on mobile, even when the visual is smaller"],
      ["size/icon-xs", 14, "Icons in small buttons and chips"],
      ["size/icon-sm", 16, "Icons in default buttons and inputs"],
      ["size/icon-md", 20, "Icons in large buttons, alerts and lists"],
      ["size/icon-lg", 24, "Navigation and standalone icons"]
    ] },
    { id: "border", name: "Border", unit: "px", desc: "One weight for edges, a heavier one for focus and selection.", rows: [
      ["border/width", 1, "All outlines and dividers"],
      ["border/width-strong", 2, "Focus rings and the selected-tab indicator"],
      ["border/focus-offset", 2, "Gap between an element and its focus ring"]
    ] },
    { id: "elevation", name: "Elevation", desc: "Shadows get larger and softer as a surface rises. Dark mode uses deeper shadows.", rows: [
      ["elevation/0", "None", "Flat — part of the page", 0],
      ["elevation/1", "Y 1 · Blur 2 · 8%", "Cards at rest", 1],
      ["elevation/2", "Y 2 · Blur 6 · 8%", "Raised cards and sticky headers", 2],
      ["elevation/3", "Y 8 · Blur 20 · 10%", "Menus, popovers and toasts", 3],
      ["elevation/4", "Y 20 · Blur 48 · 16%", "Dialogs and sheets", 4]
    ] },
    { id: "opacity", name: "Opacity", unit: "%", desc: "For overlays and disabled imagery. Text never uses opacity — use a colour variable instead.", rows: [
      ["opacity/hover", 8, "Dark overlay on images and coloured fills when hovered"],
      ["opacity/pressed", 12, "Dark overlay while pressed"],
      ["opacity/disabled", 40, "Icons and images inside disabled controls"],
      ["opacity/scrim", 48, "Backdrop behind dialogs in light mode"]
    ] },
    { id: "duration", name: "Duration", unit: "ms", desc: "Smaller things move faster. Nothing in the interface takes longer than 600ms.", rows: [
      ["duration/instant", 100, "Colour and opacity changes on hover"],
      ["duration/fast", 150, "Tooltips, checkboxes, switches"],
      ["duration/base", 250, "Menus, tabs, cards — most transitions"],
      ["duration/slow", 400, "Dialogs, drawers and sheets"],
      ["duration/slower", 600, "Full-screen and page transitions"]
    ] },
    { id: "easing", name: "Easing", desc: "Five curves cover every transition. Values paste straight into a custom bezier.", easing: true, rows: [
      ["easing/standard", [0.2, 0, 0, 1], "Elements moving within the screen"],
      ["easing/enter", [0.05, 0.7, 0.1, 1], "Elements arriving — decelerate into place"],
      ["easing/exit", [0.3, 0, 0.8, 0.15], "Elements leaving — accelerate away"],
      ["easing/spring", [0.34, 1.56, 0.64, 1], "Playful confirmations; overshoots then settles"],
      ["easing/linear", [0, 0, 1, 1], "Spinners, progress bars and loops only"]
    ] },
    { id: "type", name: "Typography", desc: "Styles live on the Typography page; these are the values they are built from.", rows: [
      ["font/family", "IBM Plex Sans", "Every style on every platform", 400],
      ["font/weight/regular", "400", "Body Large, Body", 400],
      ["font/weight/medium", "500", "Caption", 500],
      ["font/weight/semibold", "600", "Heading 2, Heading 3, Title, Label, Overline", 600],
      ["font/weight/bold", "700", "Display, Heading 1", 700]
    ] },
    { id: "breakpoints", name: "Breakpoints & grid", desc: "Layouts switch at these widths. Mobile type styles apply below 640px.", grid: true, rows: [
      ["breakpoint/mobile", "0 – 639", "4 columns · 16 margin · 16 gutter", 4],
      ["breakpoint/tablet", "640 – 1023", "8 columns · 24 margin · 24 gutter", 8],
      ["breakpoint/desktop", "1024 – 1439", "12 columns · 32 margin · 24 gutter", 12],
      ["breakpoint/wide", "1440 +", "12 columns · 1280 max width · 24 gutter", 12]
    ] }
  ];

  /* ================= BUTTONS ================= */
  var BUTTON_VARIANTS = [
    { id: "primary", name: "Primary", label: "Save changes",
      use: "The main action on a screen — Save, Continue, Create.", avoid: "More than one on the same surface." },
    { id: "secondary", name: "Secondary", label: "Cancel",
      use: "Actions beside a primary — Cancel, Back, Edit.", avoid: "Using it for the main action to look calmer." },
    { id: "outline", name: "Outline", label: "Preview",
      use: "An alternative that still needs emphasis — Preview, Share.", avoid: "Next to a primary of equal importance." },
    { id: "ghost", name: "Ghost", label: "Skip",
      use: "Low-priority actions in toolbars, card footers and lists.", avoid: "On its own with nothing around it — it gets lost." },
    { id: "danger", name: "Danger", label: "Delete project",
      use: "Destructive actions — Delete, Remove, Revoke. Confirm first.", avoid: "Warnings that aren't destructive." },
    { id: "link", name: "Link", label: "Learn more",
      use: "Navigation inside text or a row — Learn more, View all.", avoid: "Actions that change or save data." }
  ];

  var BUTTON_STATES = [
    { id: "default", name: "Default", cls: "" },
    { id: "hover", name: "Hover", cls: "is-hover" },
    { id: "pressed", name: "Pressed", cls: "is-pressed" },
    { id: "focus", name: "Focused", cls: "is-focus" },
    { id: "selected", name: "Selected", cls: "is-selected" },
    { id: "disabled", name: "Disabled", disabled: true },
    { id: "loading", name: "Loading", cls: "is-loading" }
  ];

  var STATE_RULES = [
    { name: "Hover", timing: "100ms · Standard",
      rule: "Fill moves one step — accent/hover on accent buttons, bg/hover on neutral ones." },
    { name: "Pressed", timing: "Instant",
      rule: "Fill moves two steps — accent/pressed or bg/pressed — and the button drops 1px while held." },
    { name: "Focused", timing: "Instant",
      rule: "A 2px focus/ring outline, 2px outside the button. Keyboard only, never on click." },
    { name: "Selected", timing: "150ms · Standard",
      rule: "For toggles and groups. Neutral buttons take accent/tint with an accent border and label; filled buttons stay pressed; outline fills in." },
    { name: "Disabled", timing: "No motion",
      rule: "state/disabled-bg fill and state/disabled-text label, no border, no hover. Say why nearby when you can." },
    { name: "Loading", timing: "Spinner · 700ms · Linear",
      rule: "A spinner replaces the label and icon. The button keeps its width and ignores taps." }
  ];

  var BUTTON_SIZES = [
    { id: "sm", name: "Small", cls: "btn--sm", height: 32, padding: 12, radius: 6, label: "Caption · SemiBold", icon: 14, gap: 6,
      use: "Tables, toolbars and dense cards." },
    { id: "md", name: "Medium", cls: "", height: 40, padding: 16, radius: 8, label: "Label · SemiBold", icon: 16, gap: 8,
      use: "The default for forms, dialogs and pages." },
    { id: "lg", name: "Large", cls: "btn--lg", height: 48, padding: 20, radius: 12, label: "Body Large · SemiBold", icon: 20, gap: 10,
      use: "Hero actions, and the default size on touch screens." }
  ];

  var ANATOMY = [
    { part: "Container", desc: "Fill, 1px border and radius. Height comes from the size, never from the label." },
    { part: "Leading icon", desc: "Optional. Names what the action creates or affects." },
    { part: "Label", desc: "Label style, SemiBold. A verb, two words at most." },
    { part: "Trailing icon", desc: "Optional. An arrow for forward navigation or a chevron for menus." },
    { part: "Focus ring", desc: "2px, 2px away. Appears only for keyboard focus." }
  ];

  /* ================= ANIMATIONS ================= */
  var MOTION_PRINCIPLES = [
    { name: "Entering", spec: "Enter easing · 250–400ms", text: "Things arrive fast and settle gently. Decelerate into place." },
    { name: "Leaving", spec: "Exit easing · 150–250ms", text: "Things leave faster than they came and accelerate away. Nobody waits for an exit." },
    { name: "Drawing attention", spec: "Use once, never loop", text: "Shakes, pulses and bounces point at one thing. Two at once cancel each other out." }
  ];

  var ANIM_GROUPS = [
    { name: "UI transitions", once: true, desc: "Product motion built on the duration and easing variables. Start here.", items: [
      ["modalIn", "Dialog in"], ["modalOut", "Dialog out"], ["dropdownIn", "Menu open"], ["toastIn", "Toast in"],
      ["drawerIn", "Drawer in"], ["tooltipIn", "Tooltip in"], ["popIn", "Like pop"], ["press", "Button press"],
      ["errorShake", "Error shake"], ["expandIn", "Expand"], ["checkDraw", "Checkmark draw"]
    ] },
    { name: "Loops & loaders", once: false, desc: "Continuous motion for waiting and ambient states. Use Linear for anything that spins.", items: [
      ["spin", "Spin"], ["spinReverse", "Spin reverse"], ["pulseSoft", "Breathe"], ["float", "Float"], ["bob", "Bob"],
      ["ping", "Ping"], ["ripple", "Ripple"], ["glow", "Glow"], ["shimmer", "Skeleton shimmer"], ["typingDots", "Typing dots"],
      ["blink", "Cursor blink"], ["typewriter", "Typewriter"], ["marquee", "Marquee"], ["progressIndeterminate", "Progress"],
      ["morphBlob", "Morph"], ["wiggle", "Wiggle"]
    ] },
    { name: "Attention seekers", once: true, desc: "Point at something already on screen.", items: [
      "bounce", "flash", "pulse", "rubberBand", "shakeX", "shakeY", "headShake", "swing", "tada", "wobble", "jello", "heartBeat"
    ] },
    { name: "Fading entrances", once: true, items: [
      "fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig",
      "fadeInUp", "fadeInUpBig", "fadeInTopLeft", "fadeInTopRight", "fadeInBottomLeft", "fadeInBottomRight"
    ] },
    { name: "Fading exits", once: true, items: [
      "fadeOut", "fadeOutDown", "fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig", "fadeOutRight", "fadeOutRightBig",
      "fadeOutUp", "fadeOutUpBig", "fadeOutTopLeft", "fadeOutTopRight", "fadeOutBottomLeft", "fadeOutBottomRight"
    ] },
    { name: "Sliding entrances", once: true, items: ["slideInDown", "slideInLeft", "slideInRight", "slideInUp"] },
    { name: "Sliding exits", once: true, items: ["slideOutDown", "slideOutLeft", "slideOutRight", "slideOutUp"] },
    { name: "Zooming entrances", once: true, items: ["zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp"] },
    { name: "Zooming exits", once: true, items: ["zoomOut", "zoomOutDown", "zoomOutLeft", "zoomOutRight", "zoomOutUp"] },
    { name: "Bouncing entrances", once: true, items: ["bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp"] },
    { name: "Bouncing exits", once: true, items: ["bounceOut", "bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp"] },
    { name: "Back entrances", once: true, items: ["backInDown", "backInLeft", "backInRight", "backInUp"] },
    { name: "Back exits", once: true, items: ["backOutDown", "backOutLeft", "backOutRight", "backOutUp"] },
    { name: "Rotating entrances", once: true, items: ["rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight"] },
    { name: "Rotating exits", once: true, items: ["rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight"] },
    { name: "Flippers", once: true, items: ["flip", "flipInX", "flipInY", "flipOutX", "flipOutY"] },
    { name: "Lightspeed", once: true, items: ["lightSpeedInRight", "lightSpeedInLeft", "lightSpeedOutRight", "lightSpeedOutLeft"] },
    { name: "Specials", once: true, items: ["hinge", "jackInTheBox", "rollIn", "rollOut"] }
  ];

  /* ================= CURVES ================= */
  var SYSTEM_EASINGS = [
    { name: "Standard", p: [0.2, 0, 0, 1], use: "Moving within the screen" },
    { name: "Enter", p: [0.05, 0.7, 0.1, 1], use: "Arriving" },
    { name: "Exit", p: [0.3, 0, 0.8, 0.15], use: "Leaving" },
    { name: "Spring", p: [0.34, 1.56, 0.64, 1], use: "Playful overshoot" },
    { name: "Linear", p: [0, 0, 1, 1], use: "Loops and progress" }
  ];

  var STANDARD_CURVES = [
    { name: "Linear", p: [0, 0, 1, 1] },
    { name: "Ease", p: [0.25, 0.1, 0.25, 1] },
    { name: "Ease in", p: [0.42, 0, 1, 1] },
    { name: "Ease out", p: [0, 0, 0.58, 1] },
    { name: "Ease in-out", p: [0.42, 0, 0.58, 1] },
    { name: "Step start", steps: "start" },
    { name: "Step end", steps: "end" }
  ];

  function easeOutBounce(x) {
    var n1 = 7.5625, d1 = 2.75;
    if (x < 1 / d1) { return n1 * x * x; }
    if (x < 2 / d1) { x -= 1.5 / d1; return n1 * x * x + 0.75; }
    if (x < 2.5 / d1) { x -= 2.25 / d1; return n1 * x * x + 0.9375; }
    x -= 2.625 / d1; return n1 * x * x + 0.984375;
  }

  // fn: exact formula. bezier: closest cubic bezier, or null when a bezier can't express it.
  var EASING_FAMILIES = [
    { family: "Sine", curves: {
      In: { fn: function (x) { return 1 - Math.cos(x * Math.PI / 2); }, bezier: [0.12, 0, 0.39, 0] },
      Out: { fn: function (x) { return Math.sin(x * Math.PI / 2); }, bezier: [0.61, 1, 0.88, 1] },
      InOut: { fn: function (x) { return -(Math.cos(Math.PI * x) - 1) / 2; }, bezier: [0.37, 0, 0.63, 1] } } },
    { family: "Quad", curves: {
      In: { fn: function (x) { return x * x; }, bezier: [0.11, 0, 0.5, 0] },
      Out: { fn: function (x) { return 1 - (1 - x) * (1 - x); }, bezier: [0.5, 1, 0.89, 1] },
      InOut: { fn: function (x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }, bezier: [0.45, 0, 0.55, 1] } } },
    { family: "Cubic", curves: {
      In: { fn: function (x) { return x * x * x; }, bezier: [0.32, 0, 0.67, 0] },
      Out: { fn: function (x) { return 1 - Math.pow(1 - x, 3); }, bezier: [0.33, 1, 0.68, 1] },
      InOut: { fn: function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }, bezier: [0.65, 0, 0.35, 1] } } },
    { family: "Quart", curves: {
      In: { fn: function (x) { return Math.pow(x, 4); }, bezier: [0.5, 0, 0.75, 0] },
      Out: { fn: function (x) { return 1 - Math.pow(1 - x, 4); }, bezier: [0.25, 1, 0.5, 1] },
      InOut: { fn: function (x) { return x < 0.5 ? 8 * Math.pow(x, 4) : 1 - Math.pow(-2 * x + 2, 4) / 2; }, bezier: [0.76, 0, 0.24, 1] } } },
    { family: "Quint", curves: {
      In: { fn: function (x) { return Math.pow(x, 5); }, bezier: [0.64, 0, 0.78, 0] },
      Out: { fn: function (x) { return 1 - Math.pow(1 - x, 5); }, bezier: [0.22, 1, 0.36, 1] },
      InOut: { fn: function (x) { return x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2; }, bezier: [0.83, 0, 0.17, 1] } } },
    { family: "Expo", curves: {
      In: { fn: function (x) { return x === 0 ? 0 : Math.pow(2, 10 * x - 10); }, bezier: [0.7, 0, 0.84, 0] },
      Out: { fn: function (x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); }, bezier: [0.16, 1, 0.3, 1] },
      InOut: { fn: function (x) { return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2; }, bezier: [0.87, 0, 0.13, 1] } } },
    { family: "Circ", curves: {
      In: { fn: function (x) { return 1 - Math.sqrt(1 - Math.pow(x, 2)); }, bezier: [0.55, 0, 1, 0.45] },
      Out: { fn: function (x) { return Math.sqrt(1 - Math.pow(x - 1, 2)); }, bezier: [0, 0.55, 0.45, 1] },
      InOut: { fn: function (x) { return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2; }, bezier: [0.85, 0, 0.15, 1] } } },
    { family: "Back", curves: {
      In: { fn: function (x) { var c1 = 1.70158, c3 = c1 + 1; return c3 * x * x * x - c1 * x * x; }, bezier: [0.36, 0, 0.66, -0.56] },
      Out: { fn: function (x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }, bezier: [0.34, 1.56, 0.64, 1] },
      InOut: { fn: function (x) { var c1 = 1.70158, c2 = c1 * 1.525; return x < 0.5 ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2; }, bezier: [0.68, -0.6, 0.32, 1.6] } } },
    { family: "Elastic", curves: {
      In: { fn: function (x) { var c4 = (2 * Math.PI) / 3; return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4); }, bezier: null },
      Out: { fn: function (x) { var c4 = (2 * Math.PI) / 3; return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1; }, bezier: null },
      InOut: { fn: function (x) { var c5 = (2 * Math.PI) / 4.5; return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1; }, bezier: null } } },
    { family: "Bounce", curves: {
      In: { fn: function (x) { return 1 - easeOutBounce(1 - x); }, bezier: null },
      Out: { fn: easeOutBounce, bezier: null },
      InOut: { fn: function (x) { return x < 0.5 ? (1 - easeOutBounce(1 - 2 * x)) / 2 : (1 + easeOutBounce(2 * x - 1)) / 2; }, bezier: null } } }
  ];

  global.GANI = {
    ICONS: ICONS,
    SECTIONS: SECTIONS,
    TYPEFACE: TYPEFACE,
    TYPE_STYLES: TYPE_STYLES,
    PLATFORMS: PLATFORMS,
    ACCENT: ACCENT,
    ACCENT_SCALE: ACCENT_SCALE,
    NEUTRAL_SCALE: NEUTRAL_SCALE,
    ACCENT_USES: ACCENT_USES,
    STATUS: STATUS,
    COLOR_VARIABLES: COLOR_VARIABLES,
    CONTRAST_PAIRS: CONTRAST_PAIRS,
    VARIABLE_COLLECTIONS: VARIABLE_COLLECTIONS,
    BUTTON_VARIANTS: BUTTON_VARIANTS,
    BUTTON_STATES: BUTTON_STATES,
    STATE_RULES: STATE_RULES,
    BUTTON_SIZES: BUTTON_SIZES,
    ANATOMY: ANATOMY,
    MOTION_PRINCIPLES: MOTION_PRINCIPLES,
    ANIM_GROUPS: ANIM_GROUPS,
    SYSTEM_EASINGS: SYSTEM_EASINGS,
    STANDARD_CURVES: STANDARD_CURVES,
    EASING_FAMILIES: EASING_FAMILIES
  };
})(window);
