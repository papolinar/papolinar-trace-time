// The tracing sheet: lays out guide text on ruled lines, captures pen/finger
// strokes, and scores how well the strokes cover the letters.
import { TOL } from './data.js';
import { STROKES, fitStrokes, badgeSpots } from './strokes.js';

export const GUIDE = {
  paper: '#fffef8',
  margin: 'rgba(224,82,63,.5)',
  top: '#7aa6dd',
  mid: '#9dbde6',
  base: '#3b7dd8',
  desc: '#c9d9ee',
  fill: '#dfe6f0',
  dash: '#8fa3bd',
  ink: '#22324a',
  demo: '#2fa31a',
  demoDot: '#ffcc33',
  demoEdge: '#1d1d1d',
};

export const FONT = (fs) => `400 ${fs}px Andika, "Chalkboard SE", "Comic Sans MS", sans-serif`;
const SINGLE_LINE = new Set(['caps', 'lower', 'nums']);

export function createTracer({ stage, guideCanvas, demoCanvas, inkCanvas, settings }) {
  const cg = guideCanvas;
  const cd = demoCanvas;
  const ci = inkCanvas;
  let gx = cg.getContext('2d');
  let dx = cd.getContext('2d');
  let ix = ci.getContext('2d');
  let demoRun = 0, demoState = 'off'; // off | playing | shown
  let W = 0, H = 0, L = null, M100 = null;
  let strokes = [], active = null, penSeen = false, locked = false;
  let item = null;

  function measure() {
    gx.font = FONT(100);
    const m = (s) => gx.measureText(s);
    M100 = {
      asc: m('Hbdhkl').actualBoundingBoxAscent,
      xh: m('xvwz').actualBoundingBoxAscent,
      de: m('gjpqy').actualBoundingBoxDescent,
    };
  }

  function layout(text, cat) {
    const M = M100;
    gx.font = FONT(100);
    const mw = (t) => gx.measureText(t).width / 100;
    const maxW = W - Math.max(40, W * 0.1);
    const k = (M.asc + M.de) / 100 + 0.42;
    const rowH = (fs) => k * fs;
    const wrap = (fs) => {
      if (SINGLE_LINE.has(cat)) return [text];
      const out = [];
      let line = '';
      for (const w of text.split(' ')) {
        const t = line ? line + ' ' + w : w;
        if (!line || mw(t) * fs <= maxW) line = t;
        else { out.push(line); line = w; }
      }
      out.push(line);
      return out;
    };
    const mk = (lines, fs) => {
      const rh = rowH(fs);
      const y0 = (H - lines.length * rh) / 2;
      return {
        fs,
        lines: lines.map((t, i) => {
          const top = y0 + i * rh + fs * 0.21;
          const base = top + (M.asc * fs) / 100;
          return { t, x: (W - mw(t) * fs) / 2, top, base, mid: base - (M.xh * fs) / 100, desc: base + (M.de * fs) / 100 };
        }),
      };
    };
    const fit = (wrapFn) => {
      for (let fs = Math.min((H * 0.7) / k, 320); fs > 22; fs *= 0.95) {
        const lines = wrapFn(fs);
        if (lines.every((l) => mw(l) * fs <= maxW) && lines.length * rowH(fs) <= H * 0.94) return mk(lines, fs);
      }
      return mk(wrapFn(22), 22);
    };
    if (!SINGLE_LINE.has(cat)) return fit(wrap);
    // Single letters ("A  A  A"): on a tall sheet, stacking the copies on
    // more ruled rows makes them much bigger; keep whichever is largest.
    const copies = text.split(/\s+/);
    let bestL = null;
    for (let rows = 1; rows <= copies.length; rows++) {
      const per = Math.ceil(copies.length / rows);
      const lines = [];
      for (let i = 0; i < copies.length; i += per) lines.push(copies.slice(i, i + per).join('  '));
      const cand = fit(() => lines);
      if (!bestL || cand.fs > bestL.fs * 1.08) bestL = cand;
    }
    return bestL;
  }

  function hline(y, color, w, dash) {
    gx.strokeStyle = color; gx.lineWidth = w; gx.setLineDash(dash);
    gx.beginPath(); gx.moveTo(0, y); gx.lineTo(W, y); gx.stroke(); gx.setLineDash([]);
  }

  function drawGuide() {
    const g = gx;
    g.clearRect(0, 0, W, H);
    g.fillStyle = GUIDE.paper; g.fillRect(0, 0, W, H);
    const mx = Math.max(14, W * 0.035);
    g.strokeStyle = GUIDE.margin; g.lineWidth = 2;
    g.beginPath(); g.moveTo(mx, 0); g.lineTo(mx, H); g.stroke();
    for (const r of L.lines) {
      hline(r.top, GUIDE.top, 2, []);
      hline(r.mid, GUIDE.mid, 1.6, [10, 8]);
      hline(r.base, GUIDE.base, 3, []);
      hline(r.desc, GUIDE.desc, 1.2, [3, 6]);
    }
    g.font = FONT(L.fs); g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
    for (const r of L.lines) {
      g.fillStyle = GUIDE.fill; g.fillText(r.t, r.x, r.base);
      g.setLineDash([L.fs * 0.035, L.fs * 0.045]);
      g.lineWidth = Math.max(1.2, L.fs * 0.012);
      g.strokeStyle = GUIDE.dash; g.strokeText(r.t, r.x, r.base);
      g.setLineDash([]);
    }
  }

  const inkW = () => Math.max(4, L.fs * 0.075);

  function path(ctx, pts, w, color) {
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); ctx.lineTo(pts[0].x + 0.01, pts[0].y);
    for (const p of pts) ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function redrawInk() {
    ix.clearRect(0, 0, W, H);
    for (const s of strokes) path(ix, s, inkW(), GUIDE.ink);
  }

  function resize() {
    if (!item) return;
    const r = stage.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    W = r.width; H = r.height;
    for (const c of [cg, cd, ci]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    gx = cg.getContext('2d'); dx = cd.getContext('2d'); ix = ci.getContext('2d');
    for (const x of [gx, dx, ix]) x.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!M100) measure();
    L = layout(item.text, item.cat);
    drawGuide(); redrawInk();
    if (demoState !== 'off') playDemo(demoState === 'shown');
  }

  // ---- stroke-order demo ----
  // Animates the numbered strokes over the first letter on the sheet, then
  // leaves a faint copy as a reminder while he traces.
  function demoStrokes() {
    if (!item || !SINGLE_LINE.has(item.cat) || !L) return null;
    const ch = item.text[0];
    const def = STROKES[ch];
    if (!def) return null;
    gx.font = FONT(L.fs);
    return fitStrokes(gx, ch, item.cat === 'lower', L.lines[0], L.fs);
  }

  const plen = (pts) => pts.reduce((s, p, i) => (i ? s + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y) : 0), 0);

  function drawDemo(paths, upto, frac, faint) {
    const w = Math.max(5, L.fs * 0.06);
    const badgeR = Math.max(13, L.fs * 0.075);
    dx.clearRect(0, 0, W, H);
    dx.save();
    dx.globalAlpha = faint ? 0.45 : 1;
    dx.lineCap = 'round'; dx.lineJoin = 'round';
    for (let s = 0; s <= upto && s < paths.length; s++) {
      const pts = paths[s];
      const n = s < upto ? pts.length : Math.max(1, Math.round(pts.length * frac));
      const seg = pts.slice(0, n);
      dx.strokeStyle = '#ffffff'; dx.lineWidth = w + 4; strokePts(seg);
      dx.strokeStyle = GUIDE.demo; dx.lineWidth = w; strokePts(seg);
      if (s < upto || frac >= 1) {
        // Closed shapes (o, 0, 8) end where they start, under the number
        // badge, so show their direction partway round instead.
        const p0 = pts[0], pe = pts[pts.length - 1];
        if (Math.hypot(pe.x - p0.x, pe.y - p0.y) < badgeR * 2.5) arrow(pts.slice(0, Math.round(pts.length * 0.38)), w);
        else arrow(pts, w);
      }
    }
    // number badges sit on each stroke's starting point
    const spots = badgeSpots(paths, badgeR);
    for (let s = 0; s <= upto && s < paths.length; s++) {
      const p = spots[s];
      if (p.lead) { // leader tick from an off-stroke badge to where its stroke starts
        dx.strokeStyle = GUIDE.demoEdge; dx.lineWidth = 3; dx.setLineDash([]);
        dx.beginPath(); dx.moveTo(p.x, p.y); dx.lineTo(p.lead.x, p.lead.y); dx.stroke();
        dx.fillStyle = GUIDE.demoEdge;
        dx.beginPath(); dx.arc(p.lead.x, p.lead.y, 4, 0, Math.PI * 2); dx.fill();
      }
      dx.fillStyle = GUIDE.demoDot; dx.strokeStyle = GUIDE.demoEdge; dx.lineWidth = 3;
      dx.beginPath(); dx.arc(p.x, p.y, badgeR, 0, Math.PI * 2); dx.fill(); dx.stroke();
      dx.fillStyle = GUIDE.demoEdge;
      dx.font = `700 ${Math.round(badgeR * 1.3)}px Andika, sans-serif`;
      dx.textAlign = 'center'; dx.textBaseline = 'middle';
      dx.fillText(String(s + 1), p.x, p.y + 1);
    }
    // the moving pencil tip
    if (!faint && upto < paths.length && frac < 1) {
      const pts = paths[upto];
      const tip = pts[Math.max(0, Math.round((pts.length - 1) * frac))];
      dx.fillStyle = GUIDE.demoDot; dx.strokeStyle = GUIDE.demoEdge; dx.lineWidth = 3;
      dx.beginPath(); dx.arc(tip.x, tip.y, w * 0.9, 0, Math.PI * 2); dx.fill(); dx.stroke();
    }
    dx.restore();
  }
  function strokePts(pts) {
    if (!pts.length) return;
    dx.beginPath(); dx.moveTo(pts[0].x, pts[0].y);
    for (const p of pts) dx.lineTo(p.x, p.y);
    dx.stroke();
  }
  function arrow(pts, w) {
    if (pts.length < 2) return;
    const b = pts[pts.length - 1];
    let a = pts[pts.length - 2];
    for (let i = pts.length - 2; i >= 0 && Math.hypot(b.x - a.x, b.y - a.y) < w; i--) a = pts[i];
    const ang = Math.atan2(b.y - a.y, b.x - a.x), s = w * 1.8;
    dx.fillStyle = GUIDE.demo; dx.strokeStyle = '#fff'; dx.lineWidth = 2;
    dx.beginPath();
    dx.moveTo(b.x + Math.cos(ang) * s * 0.6, b.y + Math.sin(ang) * s * 0.6);
    dx.lineTo(b.x + Math.cos(ang + 2.5) * s, b.y + Math.sin(ang + 2.5) * s);
    dx.lineTo(b.x + Math.cos(ang - 2.5) * s, b.y + Math.sin(ang - 2.5) * s);
    dx.closePath(); dx.fill(); dx.stroke();
  }

  function playDemo(instant = false) {
    const paths = demoStrokes();
    const run = ++demoRun;
    if (!paths) { demoState = 'off'; dx.clearRect(0, 0, W, H); return false; }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (instant || reduce) { demoState = 'shown'; drawDemo(paths, paths.length, 1, true); return true; }
    demoState = 'playing';
    const durs = paths.map((p) => Math.min(1400, Math.max(500, (plen(p) / L.fs) * 650)));
    const PAUSE = 280;
    let s = 0, t0 = performance.now();
    const tick = (now) => {
      if (run !== demoRun) return;
      const frac = Math.min(1, (now - t0) / durs[s]);
      drawDemo(paths, s, frac, false);
      if (frac >= 1 && now - t0 >= durs[s] + PAUSE) {
        s++; t0 = now;
        if (s >= paths.length) {
          setTimeout(() => { if (run === demoRun) { demoState = 'shown'; drawDemo(paths, paths.length, 1, true); } }, 700);
          return;
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return true;
  }
  function settleDemo() {
    if (demoState === 'playing') playDemo(true);
  }
  function hideDemo() { demoRun++; demoState = 'off'; dx.clearRect(0, 0, W, H); }

  // ---- input ----
  const pos = (e) => { const r = ci.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const allowed = (e) => {
    if (e.pointerType === 'pen') { penSeen = true; return true; }
    if (e.pointerType === 'touch') return settings().finger && !penSeen;
    return true;
  };
  ci.addEventListener('pointerdown', (e) => {
    if (locked || !L || !allowed(e)) return;
    e.preventDefault();
    settleDemo();
    try { ci.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    // A palm touch that started just before the pencil landed: drop it.
    if (e.pointerType === 'pen' && active && active.type === 'touch') { strokes.pop(); redrawInk(); }
    active = { id: e.pointerId, type: e.pointerType, pts: [pos(e)] };
    strokes.push(active.pts);
    path(ix, active.pts, inkW(), GUIDE.ink);
  });
  ci.addEventListener('pointermove', (e) => {
    if (!active || e.pointerId !== active.id) return;
    e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    ix.strokeStyle = GUIDE.ink; ix.lineWidth = inkW(); ix.lineCap = 'round';
    for (const ev of evs) {
      const p = pos(ev), q = active.pts[active.pts.length - 1];
      if (Math.hypot(p.x - q.x, p.y - q.y) < 1) continue;
      active.pts.push(p);
      ix.beginPath(); ix.moveTo(q.x, q.y); ix.lineTo(p.x, p.y); ix.stroke();
    }
  });
  const endStroke = (e) => { if (active && e.pointerId === active.id) active = null; };
  ci.addEventListener('pointerup', endStroke);
  ci.addEventListener('pointercancel', endStroke);
  ci.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });

  // ---- scoring ----
  // Rasterises letters and ink at reduced resolution and compares coverage
  // (how much of the letter was traced) with precision (how much ink stayed
  // inside the tolerance band). Paints feedback: orange = missed, red = outside.
  function score() {
    const k = 0.35;
    const w = Math.max(1, Math.ceil(W * k)), h = Math.max(1, Math.ceil(H * k));
    const tol = L.fs * TOL[settings().diff];
    const mk = (f) => {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d'); x.setTransform(k, 0, 0, k, 0, 0); f(x);
      return x.getImageData(0, 0, w, h).data;
    };
    const text = (x, extra) => {
      x.font = FONT(L.fs); x.fillStyle = x.strokeStyle = '#000'; x.lineJoin = 'round';
      for (const r of L.lines) {
        x.fillText(r.t, r.x, r.base);
        if (extra) { x.lineWidth = extra; x.strokeText(r.t, r.x, r.base); }
      }
    };
    const A = mk((x) => text(x, 0));
    const Z = mk((x) => text(x, tol * 2));
    const I = mk((x) => strokes.forEach((s) => path(x, s, inkW(), '#000')));
    const D = mk((x) => strokes.forEach((s) => path(x, s, inkW() + tol * 2, '#000')));
    const fb = document.createElement('canvas'); fb.width = w; fb.height = h;
    const fx = fb.getContext('2d'), img = fx.createImageData(w, h), px = img.data;
    let a = 0, ac = 0, n = 0, nin = 0;
    for (let i = 3; i < A.length; i += 4) {
      if (A[i] > 110) {
        a++;
        if (D[i] > 110) ac++;
        else { px[i - 3] = 245; px[i - 2] = 150; px[i - 1] = 30; px[i] = 200; }
      }
      if (I[i] > 110) {
        n++;
        if (Z[i] > 110) nin++;
        else { px[i - 3] = 224; px[i - 2] = 50; px[i - 1] = 40; px[i] = 230; }
      }
    }
    fx.putImageData(img, 0, 0);
    ix.save(); ix.globalAlpha = 0.8; ix.imageSmoothingEnabled = true;
    ix.drawImage(fb, 0, 0, w, h, 0, 0, W, H); ix.restore();
    const cov = a ? ac / a : 0, prec = n ? nin / n : 0;
    return Math.round(100 * Math.min(1, cov / 0.95) ** 1.2 * Math.min(1, prec / 0.93));
  }

  return {
    load(next) { item = next; strokes = []; active = null; locked = false; hideDemo(); },
    resize,
    remeasure() { measure(); },
    hasInk: () => strokes.length > 0,
    undo() { strokes.pop(); redrawInk(); },
    clear() { strokes = []; locked = false; redrawInk(); },
    score() { locked = true; hideDemo(); return score(); },
    get locked() { return locked; },
    canDemo: () => !!(item && SINGLE_LINE.has(item.cat) && STROKES[item.text[0]]),
    demo: () => playDemo(false),
  };
}
