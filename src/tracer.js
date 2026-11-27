// The tracing sheet: lays out guide text on ruled lines, captures pen/finger
// strokes, and scores how well the strokes cover the letters.
import { TOL } from './data.js';

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
};

export const FONT = (fs) => `400 ${fs}px Andika, "Chalkboard SE", "Comic Sans MS", sans-serif`;
const SINGLE_LINE = new Set(['caps', 'lower', 'nums']);

export function createTracer({ stage, guideCanvas, inkCanvas, settings }) {
  const cg = guideCanvas;
  const ci = inkCanvas;
  let gx = cg.getContext('2d');
  let ix = ci.getContext('2d');
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
    for (let fs = Math.min((H * 0.7) / k, 320); fs > 22; fs *= 0.95) {
      const lines = wrap(fs);
      if (lines.every((l) => mw(l) * fs <= maxW) && lines.length * rowH(fs) <= H * 0.94) return mk(lines, fs);
    }
    return mk(wrap(22), 22);
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
    for (const c of [cg, ci]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    gx = cg.getContext('2d'); ix = ci.getContext('2d');
    gx.setTransform(dpr, 0, 0, dpr, 0, 0); ix.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!M100) measure();
    L = layout(item.text, item.cat);
    drawGuide(); redrawInk();
  }

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
    load(next) { item = next; strokes = []; active = null; locked = false; },
    resize,
    remeasure() { measure(); },
    hasInk: () => strokes.length > 0,
    undo() { strokes.pop(); redrawInk(); },
    clear() { strokes = []; locked = false; redrawInk(); },
    score() { locked = true; return score(); },
    get locked() { return locked; },
  };
}
