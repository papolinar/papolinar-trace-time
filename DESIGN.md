---
name: Trace Time
description: Handwriting practice as mining in a voxel block world.
colors:
  sky: "#7ec8ff"
  ink: "#1d1d1d"
  cloud-white: "#ffffff"
  grass: "#5cb83a"
  grass-hi: "#8be064"
  grass-lo: "#3f8f24"
  dirt: "#8a5a3b"
  dirt-lo: "#4a2f1d"
  cave: "#2b1d14"
  stone: "#8e8e8e"
  stone-hi: "#c4c4c4"
  stone-lo: "#5c5c5c"
  gold-block: "#f4c430"
  diamond-block: "#5fd9e0"
  night-panel: "#2e2e2e"
  diamond: "#3de0e0"
  gold: "#ffcc33"
  iron: "#d8c8b8"
  copper: "#e07a3d"
  xp: "#7dff5a"
  xp-lo: "#43c41f"
  miss: "#f5961e"
  out: "#e03228"
  paper: "#fffef8"
  rule-top: "#7aa6dd"
  rule-mid: "#9dbde6"
  rule-base: "#3b7dd8"
  rule-desc: "#c9d9ee"
  guide-fill: "#dfe6f0"
  guide-dash: "#8fa3bd"
  pencil-ink: "#22324a"
  demo-stroke: "#2fa31a"
typography:
  display-hero:
    fontFamily: "'Jersey 10', ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(73px, 8vw, 106px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  display:
    fontFamily: "'Jersey 10', ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(56px, 6vw, 90px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
  headline:
    fontFamily: "'Jersey 10', ui-rounded, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1.1
  label-button:
    fontFamily: "'Jersey 10', ui-rounded, system-ui, sans-serif"
    fontSize: "31px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.03em"
  glyph-sample:
    fontFamily: "Andika, 'Chalkboard SE', system-ui, sans-serif"
    fontSize: "clamp(28px, 4.2vw, 50px)"
    fontWeight: 700
    lineHeight: 1
  title:
    fontFamily: "Andika, 'Chalkboard SE', system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Andika, 'Chalkboard SE', system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Andika, 'Chalkboard SE', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  none: "0px"
spacing:
  u: "4px"
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-stone:
    backgroundColor: "{colors.stone}"
    textColor: "{colors.cloud-white}"
    typography: "{typography.label-button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "60px"
  button-grass:
    backgroundColor: "{colors.grass}"
    textColor: "{colors.cloud-white}"
    typography: "{typography.label-button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "60px"
  button-square:
    backgroundColor: "{colors.stone}"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.none}"
    size: "60px"
  play-block:
    backgroundColor: "{colors.dirt}"
    textColor: "{colors.cloud-white}"
    typography: "{typography.display-hero}"
    rounded: "{rounded.none}"
    padding: "18px 24px 26px"
    width: "min(520px, 86vw)"
  category-block:
    backgroundColor: "{colors.dirt}"
    textColor: "{colors.cloud-white}"
    typography: "{typography.glyph-sample}"
    rounded: "{rounded.none}"
  category-block-mined:
    backgroundColor: "{colors.cave}"
    rounded: "{rounded.none}"
  xp-bar:
    backgroundColor: "{colors.cave}"
    textColor: "{colors.cloud-white}"
    height: "40px"
    rounded: "{rounded.none}"
  result-bar:
    backgroundColor: "{colors.night-panel}"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.none}"
    padding: "8px 10px"
  rank-chip:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    size: "36px"
  text-input:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "52px"
---

# Design System: Trace Time

## Overview

**Creative North Star: "Block World"**

Practice is mining. The app is a voxel landscape seen side-on: open sky on top, a grass-capped dirt ground below, and every piece of interface is a block of some material. A category of letters is a block that cracks as he traces it; finishing it breaks the block and drops an ore, and the ore's kind is the rank. Nothing is a card, a pill or a soft panel; things are stone, grass, dirt, gold or diamond, outlined in ink and lit from the top-left.

The system is dense with texture but sparse with words. Surfaces carry 8x8 pixel textures rendered crisp (`image-rendering: pixelated`), outlines are thick and square, shadows are hard steps with zero blur, and the one celebratory motion is a 0.4s pop with a single overshoot. Two typefaces split the work cleanly: a pixel display face for the world's voice, and a school literacy face for anything a seven-year-old must read or copy.

The writing sheet is the exception that proves the rule. Inside its stone frame it is real lined school paper, off-white with blue rulings and an Andika guide, because that is where the scoring happens and nothing may compete with the letters.

**Key Characteristics:**
- Everything is a block: square corners, ink outlines (3-6px), bevel highlight top-left and shade bottom-right.
- Pixel textures on every material surface; flat color only on paper, panels and ink.
- Ores are reserved for rank and state; materials are reserved for place and category.
- Jersey 10 for world words; Andika for reading text, every numeral and every glyph he traces.
- One motion: 0.4s, one overshoot. Ambient loops are slow and switch off under reduced motion.

## Colors

A saturated daylight palette taken from the ground up, sky to grass to dirt to stone, with ore colors held back for meaning.

### Primary
- **Grass** (grass): the go-forward material. Grass-faced buttons (Done, Next, Save), the cap on the PLAY block and on the ground strip, and the cap of letter blocks. Its lighter (grass-hi) and deeper (grass-lo) steps form the cap's inner edge and focus caret.
- **Sky** (sky): the home backdrop and the browser theme color. Clouds drift across it in cloud-white.

### Secondary
- **Dirt** (dirt): the ground. Fills the home ground strip, the PLAY block body and the side of every category block. Dirt-lo darkens the tracing screen behind the stone frame; cave is the hole a mined block leaves and the empty track of every progress bar.
- **Stone** (stone): the neutral working material. Default buttons (Home, Show me, Clear, Undo, Skip, Again), the frame around the writing sheet, the settings header, and the Numbers and Punctuation blocks. Stone-hi and stone-lo are its bevel steps.
- **Gold Block / Diamond Block** (gold-block, diamond-block): block faces for My name and Silly sentences. These are materials, deliberately a shade off the gold and diamond ores, so a block never reads as a rank.

### Tertiary (ores and feedback)
- **Diamond** (diamond): rank S. **Gold** (gold): rank A, plus the focus outline and text selection. **Iron** (iron): rank B. **Copper** (copper): rank C. Rank D is plain stone. Each ore is drawn as a pixel gem with its own highlight and shade.
- **XP Green** (xp, xp-lo): progress fill, in hard-stop segments of xp with a thin xp-lo seam.
- **Missed** (miss) and **Outside** (out): the two feedback marks painted on his tracing and keyed in the result legend.

### Neutral
- **Ink** (ink): every outline, every hard drop shadow, every text shadow, and text on light materials (gold, diamond, iron, paper).
- **Cloud White** (cloud-white): text on all textured materials and dark panels, clouds, input fields.
- **Night Panel** (night-panel): the result bar and toast; a dark stone slab that sits over the controls without hiding the sheet.
- **Paper** (paper): the writing sheet. Its rulings are rule-top (solid), rule-mid (dashed), rule-base (heaviest, solid) and rule-desc (dotted); the guide letter is guide-fill with a guide-dash dashed edge; his strokes are pencil-ink; the stroke-order demo draws in demo-stroke behind a gold pencil dot.

### Named Rules
**The Ore Means Rank Rule.** Diamond, gold, iron, copper and stone ores appear only to say how well something went (rank chip, tally, block badge, drop). A material block in a gold or diamond face uses gold-block or diamond-block, never the ore token.

**The Daylight Rule.** The world is always lit: sky above, ground below. There is no dark mode and no night palette; dark surfaces (cave, night-panel) are holes and slabs inside the daylight world.

## Typography

**Display Font:** Jersey 10 (with ui-rounded, system-ui)
**Body Font:** Andika (with Chalkboard SE, system-ui)

**Character:** Jersey 10 is the game's voice: chunky pixel caps with unambiguous C/O and digit shapes, always white with a hard ink drop. Andika is the school hand: the literacy face whose letterforms he is learning, so it carries every sentence, every number and every letter he traces. Both fonts ship inlined as Latin woff2 subsets; nothing loads from the network.

### Hierarchy
- **Display Hero** (400, clamp(73px, 8vw, 106px), 1, +0.04em): the PLAY / KEEP GOING word on the launch block; 5px ink drop.
- **Display** (400, clamp(56px, 6vw, 90px), 1, +0.02em): the app title; one-unit ink drop. 50px under 520px.
- **Headline** (400, 36px, 1.1): category name on the trace bar, result message, and (45px) the settings header. Toasts use 28px.
- **Button Label** (400, 31px, 1, +0.03em): every pixel button; 40px on the primary big button; 2px ink drop.
- **Glyph Sample** (Andika 700, clamp(28px, 4.2vw, 50px), 1): the sample on each category block (ABC, abc, 123, his name), outlined in ink on all sides.
- **Title** (Andika 700, 22px, 1.2): greeting, ore tally counts, rank letter (24px).
- **Body** (Andika 400, 18px, 1.45): settings labels and text, block signs (700), hints (17px).
- **Label** (Andika 700, 15-17px): block counts, XP meta, legend, footer. Counts use tabular numerals.

### Named Rules
**The Readable Glyph Rule.** Any letter or digit he must recognize, compare or copy (traced items, block samples, counts, scores, rank letters) is set in Andika. Jersey 10 sets whole words of the world's voice only. This rule exists because a pixel face rendered C as O and 2/3 as 8 for an early reader.

**The Ink Drop Rule.** White text on any material or panel carries a hard ink text-shadow offset down-right (2px for small labels, one unit for titles, 5px on the hero). Zero blur, always.

## Layout

Home is a side-on landscape in three bands. The header row (title and greeting left, ore tally and stone buttons right) sits in the sky; the middle holds the single PLAY block, centered and gently bobbing; the category blocks stand in a row on the grass line, and the ground strip below them carries the XP bar and status lines. Side gutters are max(4vw, 20px) and honor safe-area insets.

Category blocks sit in a grid of six columns up to 168px wide, three columns under 1000px, two under 520px; gaps clamp(12px, 2vw, 24px). Each block is square (aspect-ratio 1) with its sign above it.

The trace screen is full height with no page scroll: a slim header bar, the stone frame with the paper sheet taking all remaining space, then the controls row (grid 1fr .4fr 1fr 1fr 1.5fr, Clear isolated by a gap column, Done widest). Under 760px the controls collapse to four equal icon-first buttons and the header buttons become 60px squares. The result bar docks exactly over the controls row so the marks on the sheet stay visible.

Spacing is built from a 4px world unit (u) with working steps of 6, 8, 12, 16 and 24px. Touch targets never drop below 56px; pixel buttons are 60px, tracing controls 68px.

## Elevation & Depth

Depth is voxel lighting, not ambient shadow. Every block carries an inset bevel (white at 20-35% top-left, black at 25-30% bottom-right, 4-8px), and a raised block stands on a hard ink drop below it with zero blur. Pressing a button sinks it by the drop height and inverts its bevel, so press feedback is a physical push, not a color change.

### Shadow Vocabulary
- **Button bevel + stand** (`inset 4px 4px 0 rgba(255,255,255,.35), inset -4px -4px 0 rgba(0,0,0,.3), 0 4px 0 #1d1d1d`): every pixel button at rest.
- **Button pressed** (`inset 4px 4px 0 rgba(0,0,0,.25), inset -4px -4px 0 rgba(255,255,255,.2)`, translateY 4px): active state.
- **Big block bevel + stand** (`inset 8px 8px 0 rgba(255,255,255,.22), inset -8px -8px 0 rgba(0,0,0,.3), 0 10px 0 #1d1d1d`): the PLAY block and the settings sheet.
- **Block bevel** (`inset 8px 8px 0 rgba(255,255,255,.2), inset -8px -8px 0 rgba(0,0,0,.28)`): category blocks, which stand on the ground instead of a drop.
- **Hole** (`inset 10px 10px 0 rgba(0,0,0,.45)`): a mined block's cavity; also the recessed ore slot in the result bar.
- **Drop shadow on loose objects** (`drop-shadow(0 3px 0 rgba(0,0,0,.35))` to `0 8px 0`): ores and badges floating free.

### Named Rules
**The Zero-Blur Rule.** Every shadow in the world is a hard step: bevels are inset offsets, stands are solid ink, drops are offset with no blur radius. A blurred shadow does not exist in a voxel world.

## Shapes

Square everything (0 radius), including inputs, selects, checkbox frames and the select chevron, which is itself a 5x3 pixel SVG. Outlines are ink at 3px (inputs, small chips, progress), 4px (buttons, frames, panels, the world unit) and 5-6px (category blocks, PLAY block, settings sheet, ground edge). Materials stack in bands: a textured cap (grass or stone, about 30% of the height) over a textured body, separated by a darker inner edge. Icons are 7x7 pixel grids drawn in currentColor; ores are pixel gems on a 12-cell grid; cracks are 16x16 ink pixel overlays that spread in three stages. Clouds are rectangles assembled from 24px squares.

## Components

### Pixel Buttons
Tactile stone and grass slabs that sink when pressed.
- **Shape:** square, 4px ink outline, 60px tall (68px in the tracing controls, 56px in the result bar).
- **Stone (default):** stone texture tiled at 32px over stone, white Jersey 10 label with ink drop, 7x7 pixel icon before the label.
- **Grass (go):** same build in grass; used for the one forward action on a screen (Done, Next, Save). The big variant raises the label to 40px.
- **Square:** 60px icon-only (settings, and Home / Show me on narrow screens).
- **Pressed:** sinks one unit (0.08s), bevel inverts, stand disappears.
- **Focus:** 4px gold outline, 3px offset. **Disabled:** grayscale(.7) brightness(.85).

### PLAY Block (signature)
A giant grass-capped dirt block that is the home screen's only primary action: textured cap over textured body, 6px ink outline, 10px ink stand, a hero word and a cream subline naming what comes next. Bobs 6px every 2.4s; pressing sinks it 8px.

### Category Blocks (signature)
One square block per category, standing on the grass line with an Andika sign above. Material encodes category (grass for letters, stone for numbers and punctuation, gold-block for his name, diamond-block for sentences). A cap band sits over the body; cracks spread across it in three stages as items are traced. A dark count tag ("1 / 4") sits at the bottom; the best rank ore badges the top-right corner and pops in when fresh. A finished block becomes a cave-colored hole with its ore floating inside. An unavailable category is a dashed, translucent outline.

### Ore Tally and XP Bar
The tally is a dark slab of five ores with counts in Andika; zero counts fade to 45%. The XP bar is a 40px cave track with segmented xp fill and a centered white count; the tracing screen uses an 18px version.

### Writing Sheet
Real lined paper inside a 4px stone frame with a bevel. Rulings, guide letter and his ink come only from the sheet colors (paper, rule-*, guide-*, pencil-ink). Before single letters and numbers, the stroke-order demo draws each numbered stroke in demo-stroke led by a gold pencil dot with an ink edge.

### Ore Drop and Result Bar
On Done, the block's debris chips burst out and the rank ore pops large over the center of the sheet (0.4s, one overshoot), then falls away toward the controls as the result bar pops in over them: recessed ore slot, rank chip filled with the rank's ore color, Jersey 10 message, Andika score with a missed / outside legend, then Again (stone) and Next (grass, big).

### Settings Sheet
For the grown-up: a pale slab with a 6px ink outline and 10px stand, headed by a stone-textured title band. Inputs and selects are 52px, 3px ink outline, white, square, with a gold focus outline and grass caret; checkboxes are 26px in grass. Text is selectable here and nowhere else.

## Do's and Don'ts

### Do:
- **Do** build every new surface as a material block: texture, ink outline, top-left bevel, hard ink stand.
- **Do** use grass for the single forward action on a screen and stone for everything else.
- **Do** set every letter, digit, count and score in Andika, and keep Jersey 10 to words of the world's voice.
- **Do** use the ore colors only for rank, and the material block colors (gold-block, diamond-block) for places.
- **Do** animate with the one motion (0.4s, cubic-bezier(.2, 1.5, .4, 1)) and drop every animation and transition under prefers-reduced-motion.
- **Do** keep touch targets at 56px or more and pair every action icon with a label wherever width allows.
- **Do** keep the writing sheet plain school paper; only the sheet palette appears inside the stone frame.

### Don't:
- **Don't** round corners or blur shadows anywhere.
- **Don't** use smooth gradients; color steps are flat bands, pixel textures or hard-stop segments.
- **Don't** put an ore on a surface that is not reporting a rank or a result.
- **Don't** set traced letters or numerals in a pixel or display face.
- **Don't** let anything overlap the writing sheet while he traces, except the ore drop after Done and short toasts.
