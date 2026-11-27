# Trace Time

A handwriting tracing app for an iPad and Apple Pencil, set in a block world: each category is a block that cracks as you trace, and every finished item drops an ore for its rank (diamond S, gold A, iron B, copper C, stone D). Single letters and numbers start with an animated stroke-order demo.

## Commands

```bash
npm install        # once
npm run dev        # live dev server at http://localhost:5173 (also on your LAN, so the iPad can open it)
npm run build      # writes dist/index.html, one self-contained file (JS, CSS and fonts inlined)
npm run watch      # rebuilds dist/index.html on every save
```

## Getting it onto the iPad

**Recommended: GitHub Pages.** `.github/workflows/pages.yml` builds and publishes on every push to `main`.

1. Create a GitHub repo and push this folder to it.
2. In the repo, go to Settings → Pages → Source and choose **GitHub Actions**.
3. After the first deploy, open the Pages URL in Safari on the iPad, tap Share → **Add to Home Screen**. It opens full screen with the block icon.

Every later push updates the app. Name and settings are kept on the iPad. Progress resets when the page reloads, by design.

**Other options:** AirDrop or copy `dist/index.html`. It has no network dependencies, but the iPad Files app previews HTML without running scripts, so it has to be opened through a browser or a host. `npm run dev` also works on home Wi-Fi: open `http://<this-mac>.local:5173` on the iPad.

## Where things live

| What | File |
|---|---|
| Sentences, punctuation prompts, session sizes, scoring strictness, ranks | `src/data.js` |
| Stroke order for every letter and number (numbered strokes, directions) | `src/strokes.js` |
| Tracing sheet, pen input, scoring, stroke-order animation | `src/tracer.js` |
| Screens, game state, settings | `src/main.js`, `index.html` |
| Look and feel (block world) | `src/styles.css`, pixel art in `src/pixel.js` |
| Fonts (Andika for the letters he traces, Jersey 10 for game titles) | `src/fonts.css` |

To check stroke-order changes, run `npm run dev` and open `http://localhost:5173/dev/strokes.html`. It shows every glyph with its numbered strokes. Files in `dev/` are not part of the build.

## Design context

`PRODUCT.md` (who it's for and what it must do) and `DESIGN.md` (the visual system) are read by the [impeccable](https://github.com/pbakaus/impeccable) design skill. In Claude Code, run `/impeccable critique`, `/impeccable polish`, and so on against this project.
