# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + vite-plugin-singlefile, vanilla JS. `npm run build` emits one self-contained `dist/index.html` (JS, CSS and fonts inlined) so it runs offline on an iPad. Delivery: delegated, "recommend one" (static hosting URL added to the iPad Home Screen).

## Users

One 7-year-old boy practicing handwriting on an iPad with an Apple Pencil (fingers allowed as a fallback). He is into video games, Minecraft-style worlds, levels and power-ups. Sometimes he uses it alone (opens it, picks what to trace, goes); sometimes a parent sits beside him and picks the set. The parent sets his name, session size and scoring strictness once.

## Product Purpose

Make handwriting practice something he chooses to do. He traces capital and lowercase letters, numbers, punctuation, his own name and silly sentences over guide text on ruled writing lines, presses Done, and gets an instant score with a rank and a picture of what he missed. Success: he finishes a set without being nagged and wants to beat his rank next time.

## Positioning

A real handwriting sheet (top line, dashed midline, baseline, descender line) scored by how well his strokes cover the letters and stay inside the lines, with visible feedback (missed spots vs. outside the lines), wrapped in a game loop a 7-year-old already understands.

## Operating Context

iPad, landscape or portrait, held or flat on a table, Apple Pencil. Short sessions (about 3 to 6 minutes). Progress lives only until the page reloads; each reload deals a new random set. Name and settings persist in localStorage.

## Capabilities and Constraints

- Categories: Capital letters, Lowercase letters, Numbers, Punctuation (with a hint naming the mark), My name, Silly sentences.
- Session sizes: Quick, Standard, Everything. Scoring strictness: Easy, Normal, Hard.
- Ranks S / A / B / C / D from a 0–100 score, best score per item kept; per-category and overall rank on home.
- Tracing controls: Undo, Clear, Skip, Done; result offers Again / Next.
- Pencil palm rejection: once the Pencil touches, finger/palm touches are ignored.
- The tracing sheet's guide font is Andika (a literacy font with school-style letterforms); scoring depends on the canvas text rendering, so the tracing font must stay a clear school hand.
- Must work fully offline as one HTML file; no network fonts or assets.

## Evidence on Hand

~100 original silly sentences and 11 punctuation prompts in `src/data.js`. No characters, mascots, logos or artwork exist yet.

## Product Principles

1. The writing sheet is the hero; nothing competes with the letters while he traces.
2. A 7-year-old can read every screen he uses alone: few words, big targets, obvious next step.
3. Feedback is honest but never shaming; a low score points to what to try next.
4. Parent controls stay out of his way but are one tap away.

## Accessibility & Inclusion

Early reader: short words, large text, icon plus label on actions. Touch targets at least 56px for his controls. Respect reduced motion.
