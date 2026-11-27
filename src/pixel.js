// Pixel art drawn from text grids: icons, ores and block textures.
// Each grid row is a string; each character is a palette key ('.' = empty).

export function pixelSVG(rows, pal, { size, cls = '', title } = {}) {
  const h = rows.length, w = rows[0].length;
  let rects = '';
  rows.forEach((row, y) => {
    for (let x = 0; x < w; x++) {
      const c = pal[row[x]];
      if (c) rects += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${c}"/>`;
    }
  });
  const dims = size ? ` width="${size}" height="${Math.round((size * h) / w)}"` : '';
  const a11y = title ? ` role="img" aria-label="${title}"` : ' aria-hidden="true"';
  return `<svg class="px ${cls}" viewBox="0 0 ${w} ${h}"${dims} shape-rendering="crispEdges"${a11y}>${rects}</svg>`;
}

const toURI = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg.replace(' class="px "', ' xmlns="http://www.w3.org/2000/svg"'))}")`;

// ---------- ores (rank drops) ----------
const GEM = [
  '....KKK....',
  '...KHHPK...',
  '..KHHPPPK..',
  '.KHPPPPPSK.',
  'KHPPPPPPPSK',
  'KPPPPPPPPSK',
  '.KPPPPPPSK.',
  '..KPPPPSK..',
  '...KPPSK...',
  '....KSK....',
  '.....K.....',
];
const ROCK = [
  '...........',
  '...KKKKK...',
  '..KHHPPPK..',
  '.KHPPPPPSK.',
  'KHPPPSPPPSK',
  'KPPPPPPPPSK',
  'KPPSPPPPSSK',
  '.KPPPPPSSK.',
  '..KSSSSSK..',
  '...KKKKK...',
  '...........',
];
export const ORES = {
  S: { name: 'Diamond', P: '#3de0e0', H: '#c9fffb', S: '#169e9e' },
  A: { name: 'Gold', P: '#ffcc33', H: '#fff2b3', S: '#c98f00' },
  B: { name: 'Iron', P: '#d8c8b8', H: '#fbf4ec', S: '#a2907f' },
  C: { name: 'Copper', P: '#e07a3d', H: '#ffc39b', S: '#a24c1c' },
  D: { name: 'Stone', P: '#9a9a9a', H: '#cfcfcf', S: '#6a6a6a' },
};
export function oreSVG(rank, size, cls = '') {
  const o = ORES[rank];
  if (!o) return '';
  return pixelSVG(rank === 'D' ? ROCK : GEM, { K: '#1d1d1d', P: o.P, H: o.H, S: o.S }, { size, cls: 'ore ' + cls, title: `${o.name} (${rank})` });
}

// ---------- icons (7x7, drawn in currentColor) ----------
const ICONS = {
  home: ['...#...', '..###..', '.#####.', '#######', '.##.##.', '.##.##.', '.##.##.'],
  undo: ['..#....', '.##....', '#######', '.##...#', '..#...#', '......#', '..####.'],
  clear: ['#.....#', '##...##', '.##.##.', '..###..', '.##.##.', '##...##', '#.....#'],
  skip: ['#..#...', '##.##..', '#######', '#######', '##.##..', '#..#...', '.......'],
  check: ['......#', '.....##', '#...##.', '##.##..', '.###...', '..#....', '.......'],
  gear: ['..#.#..', '.#####.', '###.###', '##...##', '###.###', '.#####.', '..#.#..'],
  play: ['##.....', '####...', '######.', '#######', '######.', '####...', '##.....'],
  next: ['...#...', '...##..', '#######', '#######', '...##..', '...#...', '.......'],
  redo: ['....#..', '....##.', '#######', '#...##.', '#...#..', '#......', '.####..'],
};
export function icon(name, size = 24) {
  return pixelSVG(ICONS[name], { '#': 'currentColor' }, { size, cls: 'ic' });
}

// ---------- tiling block textures (8x8) ----------
const TEX = {
  dirt: {
    rows: ['aaabaaca', 'acaaabaa', 'aaaaaaab', 'baacaaaa', 'aaaaabaa', 'abaaaaca', 'aaacaaaa', 'caaaabaa'],
    pal: { a: '#8a5a3b', b: '#6b4229', c: '#a06a46' },
  },
  grass: {
    rows: ['aabaacaa', 'acaaaaba', 'aaaabaaa', 'baaaaaca', 'aacaabaa', 'aaaaaaaa', 'abaacaab', 'aaaaaaaa'],
    pal: { a: '#5cb83a', b: '#4ea52f', c: '#72cf4c' },
  },
  stone: {
    rows: ['aaabaaaa', 'acaaaaba', 'aaaacaaa', 'baaaaaaa', 'aaaabaac', 'acaaaaaa', 'aaaaacaa', 'abaaaaab'],
    pal: { a: '#8e8e8e', b: '#777777', c: '#a6a6a6' },
  },
  gold: {
    rows: ['aaabaaaa', 'acaaaaba', 'aaaacaaa', 'baaaaaaa', 'aaaabaac', 'acaaaaaa', 'aaaaacaa', 'abaaaaab'],
    pal: { a: '#f4c430', b: '#d9a514', c: '#ffe07a' },
  },
  diamond: {
    rows: ['aaabaaaa', 'acaaaaba', 'aaaacaaa', 'baaaaaaa', 'aaaabaac', 'acaaaaaa', 'aaaaacaa', 'abaaaaab'],
    pal: { a: '#5fd9e0', b: '#3bb8c0', c: '#a8f3f5' },
  },
};

// Cracks that spread across a block as its items get traced (16x16, ink on transparent).
const CRACKS = [
  ['................', '................', '................', '................', '......#.........', '......##........', '.......#........', '.......##.......', '........#.......', '........#.......', '................', '................', '................', '................', '................', '................'],
  ['................', '................', '...#............', '....#...........', '.....##.........', '......##........', '.......#....#...', '.......##..#....', '........###.....', '........#.......', '.......#........', '......#.........', '................', '................', '................', '................'],
  ['..#.........#...', '...#.......#....', '...##.....#.....', '....##...##.....', '.....##.##......', '......###.......', '.##....#....##..', '...##..##.##....', '.....###.##.....', '........#.......', '.......##.##....', '......#....##...', '.....#......#...', '....#........#..', '...#............', '................'],
];

// Publish textures as CSS custom properties (--tex-dirt, --crack-1, ...).
export function installTextures(root = document.documentElement) {
  for (const [k, t] of Object.entries(TEX)) root.style.setProperty('--tex-' + k, toURI(pixelSVG(t.rows, t.pal)));
  CRACKS.forEach((rows, i) => root.style.setProperty('--crack-' + (i + 1), toURI(pixelSVG(rows, { '#': 'rgba(29,29,29,.75)' }))));
}
