import './fonts.css';
import './styles.css';
import { SIZES, CAPS, LOWER, NUMS, PUNCT, SENT, CATS, RANKS } from './data.js';
import { createTracer } from './tracer.js';
import { icon, oreSVG, ORES, installTextures } from './pixel.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

installTextures();

// Pixel icons on the buttons (icon first, label after).
for (const [id, name] of Object.entries({ setBtn: 'gear', back: 'home', watch: 'play', clear: 'clear', undo: 'undo', skip: 'skip', done: 'check', again: 'redo', next: 'next' })) {
  $(id).insertAdjacentHTML('afterbegin', icon(name));
}

const store = {
  get(k, d) { try { const v = localStorage.getItem('tt_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('tt_' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
};
const S = {
  name: store.get('name', ''),
  size: store.get('size', 'quick'),
  diff: store.get('diff', 'normal'),
  finger: store.get('finger', true),
  demo: store.get('demo', true),
};

// Each category is a block of a different material in the world.
const MATERIAL = { caps: 'grass', lower: 'grass', nums: 'stone', punct: 'stone', name: 'gold', sent: 'diamond' };
const RANK_COLOR = { S: 'var(--diamond)', A: 'var(--gold)', B: 'var(--iron)', C: 'var(--copper)', D: 'var(--stone)' };

const rankOf = (s) => RANKS.find((r) => s >= r[0]);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rep = (c) => `${c}  ${c}  ${c}`;
const nameItems = () => (S.name ? Array.from({ length: SIZES[S.size].name }, () => ({ text: S.name, label: '' })) : []);
const avgOf = (a) => { const d = a.filter((x) => x != null); return d.length ? d.reduce((s, x) => s + x, 0) / d.length : null; };

let plan = {}, best = {}, cur = null;
let lastRanks = {};
const t0 = Date.now();

function build() {
  const z = SIZES[S.size];
  plan.caps = shuffle(CAPS).slice(0, z.caps).map((c) => ({ text: rep(c), label: '' }));
  plan.lower = shuffle(LOWER).slice(0, z.lower).map((c) => ({ text: rep(c), label: '' }));
  plan.nums = shuffle(NUMS).slice(0, z.nums).map((c) => ({ text: rep(c), label: '' }));
  plan.punct = shuffle(PUNCT).slice(0, z.punct).map(([t, l]) => ({ text: t, label: 'Find the ' + l }));
  plan.name = nameItems();
  plan.sent = shuffle(SENT).slice(0, z.sent).map((t) => ({ text: t, label: '' }));
  CATS.forEach((c) => (best[c.id] = plan[c.id].map(() => null)));
  lastRanks = {};
}

const flat = () => CATS.flatMap((c) => plan[c.id].map((_, i) => [c.id, i]));
function nextAfter(cat, i) {
  const f = flat();
  const p = cat == null ? -1 : f.findIndex(([c, j]) => c === cat && j === i);
  for (let k = 1; k <= f.length; k++) {
    const [c, j] = f[(p + k + f.length) % f.length];
    if (best[c][j] == null) return [c, j];
  }
  return null;
}

// ---------- home: the block world ----------
function renderHome() {
  let tot = 0, dn = 0;
  const all = [];
  $('blocks').innerHTML = CATS.map((c) => {
    const b = best[c.id], n = b.length, d = b.filter((x) => x != null).length;
    tot += n; dn += d; all.push(...b);
    const a = avgOf(b), r = a == null ? null : rankOf(a)[1];
    const fresh = r && lastRanks[c.id] !== r;
    lastRanks[c.id] = r;
    const sign = `<span class="sign">${c.name}</span>`;
    if (c.id === 'name' && !n) {
      return `<div class="slot">${sign}<button class="blk empty" data-cat="name"><span class="samp">Add your name</span></button></div>`;
    }
    const sample = c.id === 'name' ? S.name : c.sample;
    const mined = n && d === n;
    const crack = mined ? 0 : Math.min(3, Math.ceil((d / n) * 3));
    const badge = r ? oreSVG(r, 44, 'badge') : '';
    const cnt = mined ? 'Mined!' : `${d} / ${n}`;
    const label = `${c.name}: ${d} of ${n} done${r ? ', ' + ORES[r].name + ' rank' : ''}`;
    return `<div class="slot">${sign}<button class="blk${mined ? ' mined' : ''}${fresh ? ' fresh' : ''}" data-cat="${c.id}" data-mat="${MATERIAL[c.id]}" data-crack="${crack}" aria-label="${esc(label)}"><span class="samp">${esc(sample)}</span>${badge}<span class="cnt">${cnt}</span></button></div>`;
  }).join('');

  // ore tally: one ore per finished item
  const counts = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  all.forEach((s) => { if (s != null) counts[rankOf(s)[1]]++; });
  $('tally').innerHTML = Object.keys(counts).map((k) => `<span class="${counts[k] ? '' : 'zero'}">${oreSVG(k, 30)}${counts[k]}</span>`).join('');

  const a = avgOf(all), m = Math.floor((Date.now() - t0) / 60000);
  $('allBar').style.width = (tot ? (dn / tot) * 100 : 0) + '%';
  $('allTxt').textContent = `${dn} of ${tot} mined`;
  $('allMeta').textContent = [m < 1 ? 'Just started' : `${m} min of practice`, a == null ? '' : `average score ${Math.round(a)}`].filter(Boolean).join(' · ');
  $('greet').textContent = S.name ? `Hi ${S.name}! Trace letters to mine blocks.` : 'Trace letters to mine blocks.';
  $('nameBtn').textContent = S.name || 'Add name';

  const fin = tot && dn === tot;
  const nx = nextAfter(null);
  $('goTxt').textContent = fin ? 'NEW WORLD' : dn ? 'KEEP GOING' : 'PLAY';
  $('goSub').textContent = fin
    ? `You mined it all! Rank ${rankOf(a)[1]}`
    : nx ? `Next: ${CATS.find((c) => c.id === nx[0]).name}` : '';
}

function show(v) {
  $('home').hidden = v !== 'home';
  $('trace').hidden = v !== 'trace';
  document.body.classList.toggle('on-trace', v === 'trace');
  document.body.classList.toggle('on-home', v === 'home');
  if (v === 'home') renderHome();
}

// ---------- tracing ----------
const stage = $('stage');
const tracer = createTracer({ stage, guideCanvas: $('cg'), demoCanvas: $('cd'), inkCanvas: $('ci'), settings: () => S });

function setProgress() {
  const b = best[cur.cat];
  $('tBar').style.width = (b.filter((x) => x != null).length / b.length) * 100 + '%';
}

function openItem(cat, i) {
  cur = { cat, i };
  tracer.load({ ...plan[cat][i], cat });
  $('result').hidden = true;
  hideBigDrop();
  show('trace');
  const c = CATS.find((x) => x.id === cat), b = best[cat];
  $('tCat').textContent = c.name;
  $('tHint').textContent = plan[cat][i].label;
  $('tCount').textContent = `${i + 1} / ${b.length}`;
  setProgress();
  $('watch').hidden = !tracer.canDemo();
  requestAnimationFrame(() => {
    tracer.resize();
    if (S.demo && tracer.canDemo()) tracer.demo();
  });
}

let toastT;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg; t.hidden = false;
  t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  clearTimeout(toastT);
  toastT = setTimeout(() => (t.hidden = true), 1800);
}
function reset() {
  const wasScored = tracer.locked;
  tracer.clear();
  $('result').hidden = true;
  hideBigDrop();
  if (wasScored && tracer.canDemo()) tracer.demo();
}
function goNext() {
  const n = nextAfter(cur.cat, cur.i);
  if (n) return openItem(n[0], n[1]);
  if (cur.i + 1 < plan[cur.cat].length) return openItem(cur.cat, cur.i + 1);
  show('home');
}

// The signature moment: the block breaks and its ore drops. A big ore pops
// over the sheet with block chips flying out, then falls into the result bar.
let dropT;
function chipsHTML(n, spread, size) {
  const chipColor = { grass: 'var(--grass)', stone: 'var(--stone)', gold: '#f4c430', diamond: '#5fd9e0' }[MATERIAL[cur.cat]];
  let out = '';
  for (let k = 0; k < n; k++) {
    const ang = (k / n) * Math.PI * 2 + Math.random() * 0.5;
    const dist = spread * (0.75 + Math.random() * 0.5);
    const c = k % 2 ? 'var(--dirt)' : chipColor;
    out += `<i class="chip" style="--dx:${Math.cos(ang) * dist}px;--dy:${Math.sin(ang) * dist}px;--r:${(Math.random() * 180) | 0}deg;--c:${c};width:${size}px;height:${size}px"></i>`;
  }
  return out;
}
function dropOre(rank) {
  const big = $('bigdrop');
  clearTimeout(dropT);
  $('drop').innerHTML = oreSVG(rank, 48);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  big.className = 'bigdrop';
  big.innerHTML = chipsHTML(14, 190, 18) + oreSVG(rank, 180);
  big.hidden = false;
  dropT = setTimeout(() => {
    big.classList.add('away');
    dropT = setTimeout(hideBigDrop, 450);
  }, 1100);
}
function hideBigDrop() { clearTimeout(dropT); $('bigdrop').hidden = true; $('bigdrop').innerHTML = ''; }

$('done').onclick = () => {
  if (tracer.locked) return;
  if (!tracer.hasInk()) return toast('Trace the gray letters first!');
  const s = tracer.score(), r = rankOf(s), b = best[cur.cat];
  b[cur.i] = Math.max(b[cur.i] ?? 0, s);
  $('rRank').textContent = r[1];
  $('rRank').style.setProperty('--rc', RANK_COLOR[r[1]]);
  $('rMsg').textContent = r[2];
  $('rScore').textContent = `${ORES[r[1]].name}! Score ${s} out of 100`;
  dropOre(r[1]);
  setProgress();
  $('result').hidden = false;
};
$('undo').onclick = () => { if (tracer.locked) return reset(); tracer.undo(); };
$('clear').onclick = reset;
$('again').onclick = reset;
$('next').onclick = goNext;
$('watch').onclick = () => { if (tracer.locked) reset(); tracer.demo(); };
$('skip').onclick = () => {
  const f = flat(), p = f.findIndex(([c, j]) => c === cur.cat && j === cur.i);
  const [c, j] = f[(p + 1) % f.length];
  openItem(c, j);
};
$('back').onclick = () => show('home');
$('go').onclick = () => {
  let n = nextAfter(null);
  if (!n) { build(); n = nextAfter(null); }
  if (n) openItem(n[0], n[1]);
};
$('blocks').onclick = (e) => {
  const b = e.target.closest('.blk');
  if (!b) return;
  const c = b.dataset.cat;
  if (!plan[c].length) return openSets(true);
  const j = best[c].findIndex((x) => x == null);
  openItem(c, j < 0 ? 0 : j);
};

// ---------- settings ----------
function openSets(focusName) {
  $('nameIn').value = S.name; $('sizeIn').value = S.size; $('diffIn').value = S.diff;
  $('fingerIn').checked = S.finger; $('demoIn').checked = S.demo;
  $('sets').hidden = false;
  if (focusName) setTimeout(() => $('nameIn').focus(), 50);
}
function saveSets() {
  const nm = $('nameIn').value.trim().slice(0, 20), sz = $('sizeIn').value;
  S.diff = $('diffIn').value; S.finger = $('fingerIn').checked; S.demo = $('demoIn').checked;
  if (sz !== S.size) { S.size = sz; S.name = nm; build(); }
  else if (nm !== S.name) { S.name = nm; plan.name = nameItems(); best.name = plan.name.map(() => null); }
  for (const key of ['name', 'size', 'diff', 'finger', 'demo']) store.set(key, S[key]);
  $('sets').hidden = true;
}
$('setBtn').onclick = () => openSets(false);
$('nameBtn').onclick = () => openSets(true);
$('closeSet').onclick = () => { saveSets(); show('home'); };
$('reshuffle').onclick = () => { saveSets(); build(); show('home'); };
$('sets').onclick = (e) => { if (e.target === $('sets')) $('sets').hidden = true; };
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('sets').hidden) $('sets').hidden = true; });
$('nameIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') { saveSets(); show('home'); } });

// Re-layout the sheet when the stage changes size (rotation, split view).
let lastSize = '';
new ResizeObserver(() => {
  if ($('trace').hidden || !cur) return;
  const r = stage.getBoundingClientRect(), key = Math.round(r.width) + 'x' + Math.round(r.height);
  if (key === lastSize) return;
  lastSize = key;
  tracer.load({ ...plan[cur.cat][cur.i], cat: cur.cat });
  $('result').hidden = true;
  tracer.resize();
  if (S.demo && tracer.canDemo()) tracer.demo();
}).observe(stage);
setInterval(() => { if (!$('home').hidden) renderHome(); }, 30000);

build();
renderHome();
const ready = document.fonts
  ? Promise.race([Promise.all([document.fonts.load('400 100px Andika'), document.fonts.load("400 20px 'Jersey 10'")]), new Promise((r) => setTimeout(r, 2500))])
  : Promise.resolve();
ready.then(() => tracer.remeasure(), () => tracer.remeasure()).then(() => { if (!S.name) openSets(true); });
