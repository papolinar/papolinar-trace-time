import './fonts.css';
import './styles.css';
import { SIZES, CAPS, LOWER, NUMS, PUNCT, SENT, CATS, RANKS } from './data.js';
import { createTracer } from './tracer.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const store = {
  get(k, d) { try { const v = localStorage.getItem('tt_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('tt_' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
};
const S = {
  name: store.get('name', ''),
  size: store.get('size', 'quick'),
  diff: store.get('diff', 'normal'),
  finger: store.get('finger', true),
};

const rankOf = (s) => RANKS.find((r) => s >= r[0]);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rep = (c) => `${c}  ${c}  ${c}`;
const nameItems = () => (S.name ? Array.from({ length: SIZES[S.size].name }, () => ({ text: S.name, label: '' })) : []);
const avgOf = (a) => { const d = a.filter((x) => x != null); return d.length ? d.reduce((s, x) => s + x, 0) / d.length : null; };

let plan = {}, best = {}, cur = null;
const t0 = Date.now();

function build() {
  const z = SIZES[S.size];
  plan.caps = shuffle(CAPS).slice(0, z.caps).map((c) => ({ text: rep(c), label: '' }));
  plan.lower = shuffle(LOWER).slice(0, z.lower).map((c) => ({ text: rep(c), label: '' }));
  plan.nums = shuffle(NUMS).slice(0, z.nums).map((c) => ({ text: rep(c), label: '' }));
  plan.punct = shuffle(PUNCT).slice(0, z.punct).map(([t, l]) => ({ text: t, label: 'Look for the ' + l }));
  plan.name = nameItems();
  plan.sent = shuffle(SENT).slice(0, z.sent).map((t) => ({ text: t, label: '' }));
  CATS.forEach((c) => (best[c.id] = plan[c.id].map(() => null)));
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

// ---------- home ----------
function renderHome() {
  let tot = 0, dn = 0;
  const all = [];
  $('cards').innerHTML = CATS.map((c) => {
    const b = best[c.id], n = b.length, d = b.filter((x) => x != null).length;
    tot += n; dn += d; all.push(...b);
    const a = avgOf(b), r = a == null ? '–' : rankOf(a)[1];
    const sample = c.id === 'name' ? S.name || 'Name' : c.sample;
    const sub = c.id === 'name' && !n ? 'Tap to add your name' : d === n && n ? 'All done! Tap to redo' : `${d} of ${n} done`;
    return `<button class="card" data-cat="${c.id}"><span class="samp">${esc(sample)}</span><span class="cbody"><b>${c.name}</b><span class="bar"><i style="width:${n ? (d / n) * 100 : 0}%"></i></span><span class="mute">${sub}</span></span><span class="sticker sm" data-r="${r}">${r}</span></button>`;
  }).join('');
  const a = avgOf(all), r = a == null ? '–' : rankOf(a)[1], m = Math.floor((Date.now() - t0) / 60000);
  $('allRank').textContent = r; $('allRank').dataset.r = r;
  $('allBar').style.width = (tot ? (dn / tot) * 100 : 0) + '%';
  $('allTxt').textContent = `${dn} of ${tot} done · ${m < 1 ? 'just started' : m + ' min so far'}${a == null ? '' : ' · score ' + Math.round(a)}`;
  $('greet').textContent = S.name ? `Hi ${S.name}!` : 'Hi there!';
  $('nameBtn').textContent = S.name || 'Add name';
  const fin = tot && dn === tot;
  $('heroTitle').textContent = fin ? `All done! You got ${r} rank` : "Today's practice";
  $('go').textContent = fin ? 'Do a new set' : dn ? 'Keep tracing' : 'Start tracing';
}

function show(v) {
  $('home').hidden = v !== 'home';
  $('trace').hidden = v !== 'trace';
  document.body.classList.toggle('tracing', v === 'trace');
  if (v === 'home') renderHome();
}

// ---------- tracing ----------
const stage = $('stage');
const tracer = createTracer({ stage, guideCanvas: $('cg'), inkCanvas: $('ci'), settings: () => S });

function openItem(cat, i) {
  cur = { cat, i };
  tracer.load({ ...plan[cat][i], cat });
  $('result').hidden = true;
  show('trace');
  const c = CATS.find((x) => x.id === cat), b = best[cat];
  $('tCat').textContent = c.name;
  $('tHint').textContent = plan[cat][i].label;
  $('tBar').style.width = (b.filter((x) => x != null).length / b.length) * 100 + '%';
  $('tCount').textContent = `${i + 1} / ${b.length}`;
  requestAnimationFrame(() => tracer.resize());
}

let toastT;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => (t.hidden = true), 1800);
}
function reset() { tracer.clear(); $('result').hidden = true; }
function goNext() {
  const n = nextAfter(cur.cat, cur.i);
  if (n) return openItem(n[0], n[1]);
  if (cur.i + 1 < plan[cur.cat].length) return openItem(cur.cat, cur.i + 1);
  show('home');
}

$('done').onclick = () => {
  if (tracer.locked) return;
  if (!tracer.hasInk()) return toast('Trace the gray letters first!');
  const s = tracer.score(), r = rankOf(s), b = best[cur.cat];
  b[cur.i] = Math.max(b[cur.i] ?? 0, s);
  $('rRank').textContent = r[1]; $('rRank').dataset.r = r[1];
  $('rMsg').textContent = r[2];
  $('rScore').textContent = `Score ${s} out of 100`;
  $('tBar').style.width = (b.filter((x) => x != null).length / b.length) * 100 + '%';
  const rr = $('rRank');
  rr.style.animation = 'none'; void rr.offsetWidth; rr.style.animation = '';
  $('result').hidden = false;
};
$('undo').onclick = () => { if (tracer.locked) return reset(); tracer.undo(); };
$('clear').onclick = reset;
$('again').onclick = reset;
$('next').onclick = goNext;
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
$('cards').onclick = (e) => {
  const b = e.target.closest('.card');
  if (!b) return;
  const c = b.dataset.cat;
  if (!plan[c].length) return openSets(true);
  const j = best[c].findIndex((x) => x == null);
  openItem(c, j < 0 ? 0 : j);
};

// ---------- settings ----------
function openSets(focusName) {
  $('nameIn').value = S.name; $('sizeIn').value = S.size; $('diffIn').value = S.diff; $('fingerIn').checked = S.finger;
  $('sets').hidden = false;
  if (focusName) setTimeout(() => $('nameIn').focus(), 50);
}
function saveSets() {
  const nm = $('nameIn').value.trim().slice(0, 20), sz = $('sizeIn').value;
  S.diff = $('diffIn').value; S.finger = $('fingerIn').checked;
  if (sz !== S.size) { S.size = sz; S.name = nm; build(); }
  else if (nm !== S.name) { S.name = nm; plan.name = nameItems(); best.name = plan.name.map(() => null); }
  for (const key of ['name', 'size', 'diff', 'finger']) store.set(key, S[key]);
  $('sets').hidden = true;
}
$('setBtn').onclick = () => openSets(false);
$('nameBtn').onclick = () => openSets(true);
$('closeSet').onclick = () => { saveSets(); show('home'); };
$('reshuffle').onclick = () => { saveSets(); build(); show('home'); };
$('sets').onclick = (e) => { if (e.target === $('sets')) $('sets').hidden = true; };
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
}).observe(stage);
setInterval(() => { if (!$('home').hidden) renderHome(); }, 30000);

build();
renderHome();
const ready = document.fonts
  ? Promise.race([document.fonts.load('400 100px Andika'), new Promise((r) => setTimeout(r, 2500))])
  : Promise.resolve();
ready.then(() => tracer.remeasure(), () => tracer.remeasure()).then(() => { if (!S.name) openSets(true); });
