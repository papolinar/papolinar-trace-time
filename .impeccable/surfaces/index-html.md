---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["src/styles.css","src/main.js"]
---

# Trace Time app (home + tracing sheet + settings)

Scope: the whole single-page app, index.html + src/styles.css + src/main.js UI. Mode: Operate (a 7-year-old completes tracing tasks; a parent adjusts settings).
Audience/job: one 7-year-old boy who loves voxel sandbox games, iPad + Apple Pencil, 3-6 minute sessions, sometimes alone, sometimes with a parent.
Constraints: tracing sheet keeps real ruled lines and the Andika guide letters (scoring depends on them); offline single file; 56px+ touch targets; reduced motion respected.
Added request: single letters and numbers show an animated stroke-order demo (numbered strokes with direction, ball-and-stick handwriting model) when the item loads; not for words/sentences.

## Direction contract

THESIS: Practice is mining. Each category is a block in a voxel world; tracing an item breaks it and drops an ore whose kind is the rank. Refuses the rounded-pastel learning-app grid and generic kid gradients.
OWN-WORLD: sky #7ec8ff over grass #5cb83a / dirt #8a5a3b / stone #8e8e8e, ink #1d1d1d; ores carry state only: diamond #3de0e0 (S), gold #ffcc33 (A), iron #d8c8b8 (B), copper #e07a3d (C), stone (D). Square corners, 4-5px ink outlines, bevel light top-left and shade bottom-right, hard 0-blur drop shadows. Jersey 10 for display (titles, buttons; replaced Pixelify Sans, whose C read as O and 2/3 as 8 for an early reader), Andika for reading text, all numerals and the sheet. No gradients except the flat block bands.
STORY: He sees his world, knows how many blocks are mined, taps PLAY, watches the letter get demonstrated stroke by stroke, traces it, taps Done, sees a big ore drop over the sheet that settles into a result bar over the controls (feedback marks stay visible), taps Next.
FIRST VIEWPORT: Home: header with title + greeting left, ore tally + settings block right; middle a big grass-block PLAY button; lower third a ground strip of six category blocks standing on grass, each labeled with x of y and its rank ore; XP bar along the bottom. Trace: slim header bar (Home, category, progress), the paper sheet fills the screen inside a stone frame, controls row of blocks below with Clear isolated.
FORM: Block World, position 1 on my ordered list (pick card over assigned index 3). seed:a9cf35dd10664e5a
SIGNATURE: Done shatters the pixel block into an ore drop that pops in (0.4s, one overshoot); stroke-order demo draws each numbered stroke in a moving pencil-dot before tracing starts.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
