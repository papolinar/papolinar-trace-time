// Stroke order for single letters and numbers, in the ball-and-stick
// handwriting model taught in early grades: top to bottom, left to right,
// circles start at about 1-2 o'clock and go counter-clockwise.
//
// Coordinates live in a box fitted to the glyph on the sheet:
//   x: 0 = left edge of the glyph's ink, 1 = right edge
//   y: 0 = top line, 0.5 = dashed midline, 1 = baseline, 1.5 = descender line
// Each glyph is a list of strokes; each stroke is a list of ops:
//   ['M', x, y]                      move (start of the stroke)
//   ['L', x, y]                      line to
//   ['A', cx, cy, rx, ry, a0, a1]    elliptical arc from angle a0 to a1 (degrees;
//                                    0 = right, 90 = down, -90 = up; a0 > a1
//                                    runs counter-clockwise on screen)
//   ['Q', cx, cy, x, y]              quadratic curve
// Tweak a letter here and the demo follows; nothing else depends on it.

export const STROKES = {
  // ---------- capitals (0 = top line, 1 = baseline) ----------
  A: [[['M', .5, 0], ['L', 0, 1]], [['M', .5, 0], ['L', 1, 1]], [['M', .2, .64], ['L', .8, .64]]],
  B: [[['M', 0, 0], ['L', 0, 1]], [['M', 0, 0], ['L', .55, 0], ['A', .55, .25, .4, .25, -90, 90], ['L', 0, .5], ['L', .6, .5], ['A', .6, .75, .4, .25, -90, 90], ['L', 0, 1]]],
  C: [[['A', .5, .5, .5, .5, -40, -320]]],
  D: [[['M', 0, 0], ['L', 0, 1]], [['M', 0, 0], ['L', .4, 0], ['A', .4, .5, .6, .5, -90, 90], ['L', 0, 1]]],
  E: [[['M', 0, 0], ['L', 0, 1]], [['M', 0, 0], ['L', 1, 0]], [['M', 0, .5], ['L', .8, .5]], [['M', 0, 1], ['L', 1, 1]]],
  F: [[['M', 0, 0], ['L', 0, 1]], [['M', 0, 0], ['L', 1, 0]], [['M', 0, .5], ['L', .8, .5]]],
  G: [[['A', .5, .5, .5, .5, -40, -345]], [['M', .55, .56], ['L', 1, .56], ['L', 1, .95]]],
  H: [[['M', 0, 0], ['L', 0, 1]], [['M', 1, 0], ['L', 1, 1]], [['M', 0, .5], ['L', 1, .5]]],
  I: [[['M', .5, 0], ['L', .5, 1]], [['M', 0, 0], ['L', 1, 0]], [['M', 0, 1], ['L', 1, 1]]],
  J: [[['M', .8, 0], ['L', .8, .72], ['A', .42, .72, .38, .28, 0, 165]]],
  K: [[['M', 0, 0], ['L', 0, 1]], [['M', 1, 0], ['L', 0, .58]], [['M', .28, .42], ['L', 1, 1]]],
  L: [[['M', 0, 0], ['L', 0, 1]], [['M', 0, 1], ['L', 1, 1]]],
  M: [[['M', 0, 0], ['L', 0, 1]], [['M', 0, 0], ['L', .5, .9], ['L', 1, 0]], [['M', 1, 0], ['L', 1, 1]]],
  N: [[['M', 0, 0], ['L', 0, 1]], [['M', 0, 0], ['L', 1, 1]], [['M', 1, 1], ['L', 1, 0]]],
  O: [[['A', .5, .5, .5, .5, -90, -450]]],
  P: [[['M', 0, 0], ['L', 0, 1]], [['M', 0, 0], ['L', .55, 0], ['A', .55, .27, .45, .27, -90, 90], ['L', 0, .54]]],
  Q: [[['A', .5, .5, .5, .5, -90, -450]], [['M', .62, .72], ['L', 1, 1.05]]],
  R: [[['M', 0, 0], ['L', 0, 1]], [['M', 0, 0], ['L', .55, 0], ['A', .55, .26, .42, .26, -90, 90], ['L', 0, .52]], [['M', .45, .52], ['L', 1, 1]]],
  S: [[['A', .5, .25, .46, .25, -25, -270], ['A', .5, .75, .48, .25, -90, 150]]],
  T: [[['M', .5, 0], ['L', .5, 1]], [['M', 0, 0], ['L', 1, 0]]],
  U: [[['M', 0, 0], ['L', 0, .68], ['A', .5, .68, .5, .32, 180, 0], ['L', 1, 0]]],
  V: [[['M', 0, 0], ['L', .5, 1], ['L', 1, 0]]],
  W: [[['M', 0, 0], ['L', .25, 1], ['L', .5, .05], ['L', .75, 1], ['L', 1, 0]]],
  X: [[['M', 0, 0], ['L', 1, 1]], [['M', 1, 0], ['L', 0, 1]]],
  Y: [[['M', 0, 0], ['L', .5, .5]], [['M', 1, 0], ['L', .5, .5], ['L', .5, 1]]],
  Z: [[['M', 0, 0], ['L', 1, 0], ['L', 0, 1], ['L', 1, 1]]],

  // ---------- lowercase (0.5 = midline, 1 = baseline, 1.5 = descender) ----------
  a: [[['A', .45, .75, .45, .25, -20, -380]], [['M', 1, .5], ['L', 1, 1]]],
  b: [[['M', 0, 0], ['L', 0, 1]], [['A', .5, .75, .5, .25, 180, 540]]],
  c: [[['A', .5, .75, .5, .25, -40, -320]]],
  d: [[['A', .45, .75, .45, .25, -20, -380]], [['M', 1, 0], ['L', 1, 1]]],
  e: [[['M', 0, .75], ['L', 1, .75], ['A', .5, .75, .5, .25, 0, -320]]],
  f: [[['A', .62, .18, .32, .16, -15, -180], ['L', .3, 1]], [['M', 0, .5], ['L', .85, .5]]],
  g: [[['A', .45, .75, .45, .25, -20, -380]], [['M', 1, .5], ['L', 1, 1.3], ['A', .5, 1.3, .5, .2, 0, 160]]],
  h: [[['M', 0, 0], ['L', 0, 1]], [['M', 0, .72], ['A', .5, .72, .5, .22, 180, 360], ['L', 1, 1]]],
  i: [[['M', .5, .5], ['L', .5, 1]], [['M', .5, .25], ['L', .5, .27]]],
  j: [[['M', .75, .5], ['L', .75, 1.3], ['A', .38, 1.3, .37, .2, 0, 160]], [['M', .75, .25], ['L', .75, .27]]],
  k: [[['M', 0, 0], ['L', 0, 1]], [['M', 1, .5], ['L', 0, .8]], [['M', .3, .7], ['L', 1, 1]]],
  l: [[['M', .5, 0], ['L', .5, 1]]],
  m: [[['M', 0, .5], ['L', 0, 1]], [['M', 0, .72], ['A', .25, .72, .25, .22, 180, 360], ['L', .5, 1]], [['M', .5, .72], ['A', .75, .72, .25, .22, 180, 360], ['L', 1, 1]]],
  n: [[['M', 0, .5], ['L', 0, 1]], [['M', 0, .72], ['A', .5, .72, .5, .22, 180, 360], ['L', 1, 1]]],
  o: [[['A', .5, .75, .5, .25, -90, -450]]],
  p: [[['M', 0, .5], ['L', 0, 1.5]], [['A', .5, .75, .5, .25, 180, 540]]],
  q: [[['A', .45, .75, .45, .25, -20, -380]], [['M', 1, .5], ['L', 1, 1.5]]],
  r: [[['M', 0, .5], ['L', 0, 1]], [['M', 0, .72], ['A', .55, .72, .55, .22, 180, 310]]],
  s: [[['A', .5, .625, .46, .125, -25, -270], ['A', .5, .875, .48, .125, -90, 150]]],
  t: [[['M', .35, .2], ['L', .35, .85], ['A', .65, .85, .3, .15, 180, 90]], [['M', 0, .5], ['L', .9, .5]]],
  u: [[['M', 0, .5], ['L', 0, .8], ['A', .5, .8, .5, .2, 180, 0], ['L', 1, .5]], [['M', 1, .5], ['L', 1, 1]]],
  v: [[['M', 0, .5], ['L', .5, 1], ['L', 1, .5]]],
  w: [[['M', 0, .5], ['L', .25, 1], ['L', .5, .55], ['L', .75, 1], ['L', 1, .5]]],
  x: [[['M', 0, .5], ['L', 1, 1]], [['M', 1, .5], ['L', 0, 1]]],
  y: [[['M', 0, .5], ['L', .5, 1]], [['M', 1, .5], ['L', .2, 1.5]]],
  z: [[['M', 0, .5], ['L', 1, .5], ['L', 0, 1], ['L', 1, 1]]],

  // ---------- numbers (0 = top line, 1 = baseline) ----------
  0: [[['A', .5, .5, .5, .5, -90, -450]]],
  1: [[['M', .15, .22], ['L', .55, 0], ['L', .55, 1]]],
  2: [[['A', .5, .28, .45, .28, 195, 360], ['L', 0, 1], ['L', 1, 1]]],
  3: [[['A', .5, .25, .45, .25, -160, 90], ['A', .5, .75, .48, .25, -90, 160]]],
  4: [[['M', .75, 0], ['L', 0, .68], ['L', 1, .68]], [['M', .75, 0], ['L', .75, 1]]],
  5: [[['M', .15, 0], ['L', .1, .46], ['A', .5, .68, .46, .32, -135, 150]], [['M', .15, 0], ['L', .95, 0]]],
  6: [[['M', .85, .04], ['Q', .02, .2, .05, .72], ['A', .5, .72, .45, .28, 180, -180]]],
  7: [[['M', 0, 0], ['L', 1, 0], ['L', .35, 1]]],
  8: [[['A', .5, .25, .4, .25, -30, -270], ['A', .5, .75, .48, .25, -90, 270], ['A', .5, .25, .4, .25, 90, -30]]],
  9: [[['A', .5, .3, .48, .3, -10, -370]], [['M', .98, .3], ['L', .98, 1]]],
};

// Turn one stroke into a polyline of {x, y} points in box units.
export function sampleStroke(ops) {
  const pts = [];
  let cur = null;
  const push = (x, y) => { pts.push({ x, y }); cur = { x, y }; };
  for (const op of ops) {
    if (op[0] === 'M') push(op[1], op[2]);
    else if (op[0] === 'L') {
      const [, x, y] = op;
      const from = cur || { x, y };
      const n = 12;
      for (let i = 1; i <= n; i++) push(from.x + ((x - from.x) * i) / n, from.y + ((y - from.y) * i) / n);
    } else if (op[0] === 'A') {
      const [, cx, cy, rx, ry, a0, a1] = op;
      const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) / 6));
      for (let i = 0; i <= n; i++) {
        const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
        push(cx + rx * Math.cos(a), cy + ry * Math.sin(a));
      }
    } else if (op[0] === 'Q') {
      const [, qx, qy, x, y] = op;
      const from = cur;
      const n = 20;
      for (let i = 1; i <= n; i++) {
        const t = i / n, u = 1 - t;
        push(u * u * from.x + 2 * u * t * qx + t * t * x, u * u * from.y + 2 * u * t * qy + t * t * y);
      }
    }
  }
  return pts;
}

// Place a glyph's strokes over the letter drawn on the sheet. `ctx.font` must
// already be the sheet font; `line` holds the ruled-line y positions
// (top, mid, base, desc) and `x`, the pen position of the glyph.
export function fitStrokes(ctx, ch, lower, line, fs) {
  const def = STROKES[ch];
  if (!def) return null;
  const m = ctx.measureText(ch);
  // The ink box measures outer edges; strokes run down the middle of the
  // letter's lines, so pull every edge in by half a stem width.
  const half = fs * 0.045;
  const left = line.x - m.actualBoundingBoxLeft + half, right = line.x + m.actualBoundingBoxRight - half;
  const top = line.base - m.actualBoundingBoxAscent + half, base = line.base - half;
  const mapY = (y) => {
    if (!lower) return top + y * (base - top); // capitals and numbers: glyph top to baseline
    const lt = line.top + half, ld = line.desc - half;
    if (y <= 0.5) return lt + (line.mid - lt) * (y / 0.5);
    if (y <= 1) return line.mid + (base - line.mid) * ((y - 0.5) / 0.5);
    return base + (ld - base) * ((y - 1) / 0.5);
  };
  return def.map((ops) => sampleStroke(ops).map((p) => ({ x: left + p.x * (right - left), y: mapY(p.y) })));
}

// Where to draw each stroke's number badge (radius R). Strokes that share a
// start point (the 1 and 2 of B, D, E ...) would hide each other or read as
// "12". A later badge first moves forward along its own stroke so it sits on
// the line it numbers; only if that is blocked does it step back or aside,
// and then `lead` marks that a short tick should join it to the stroke start.
export function badgeSpots(paths, R) {
  const placed = [];
  const clear = (p) => placed.every((q) => Math.hypot(p.x - q.x, p.y - q.y) >= R * 2.8);
  for (const pts of paths) {
    const p0 = pts[0];
    let spot = clear(p0) ? { x: p0.x, y: p0.y } : null;
    if (!spot) { // forward along the stroke, 1.6R to 3.2R past its start
      for (const p of pts) {
        const d = Math.hypot(p.x - p0.x, p.y - p0.y);
        if (d > R * 3.2) break;
        if (d >= R * 1.6 && clear(p)) { spot = { x: p.x, y: p.y }; break; }
      }
    }
    if (!spot) {
      const ahead = pts.find((p) => Math.hypot(p.x - p0.x, p.y - p0.y) > R) || pts[pts.length - 1];
      let dx = ahead.x - p0.x, dy = ahead.y - p0.y;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len; dy /= len;
      const dirs = [[-dx, -dy], [-dy, dx], [dy, -dx]];
      for (let step = 1.6; !spot && step <= 4.2; step += 0.6) {
        for (const [ux, uy] of dirs) {
          const c = { x: p0.x + ux * R * step, y: p0.y + uy * R * step };
          if (clear(c)) { spot = { ...c, lead: p0 }; break; }
        }
      }
    }
    placed.push(spot || { x: p0.x, y: p0.y });
  }
  return placed;
}
