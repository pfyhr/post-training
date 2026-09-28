// covers.js: one painting per cover, in the video engine's p5.brush style. Canvas is 3000x3000 (W, H from core.js).
const COVERS = {};
const COVER = new URLSearchParams(location.search).get('cover') || 'album';
function drawWorld() { (COVERS[COVER] || COVERS.album)(); }
const S = 3000;
const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
function trackTitle(num, title, o = {}) {
  letter(title, o.x ?? S / 2, o.y ?? 300, o.size ?? 250, o.col ?? PAL.cream, { rot: o.rot ?? -.03 });
  if (num) letter(num, o.nx ?? 250, o.ny ?? 2780, 120, o.ncol ?? PAL.cream, { rot: -.05 });
}

// ---------------- album: the loss curve as a landscape, a cabin on the plateau after training ----------------
COVERS.album = () => {
  paint(rectPts(-100, -100, S + 200, 2500, 20), { fill: PAL.rose, fillOp: 120, bleed: .25, tex: .5, border: .3, ink: null });
  paint(rectPts(-100, -100, S + 200, 1300, 20), { fill: PAL.violet, fillOp: 130, bleed: .3, tex: .5, ink: null });
  paint(rectPts(-100, -100, S + 200, 650, 20), { fill: PAL.indigo, fillOp: 120, bleed: .3, tex: .6, ink: null });
  for (let i = 0; i < 26; i++) { const x = 150 + hash(i) * 2700, y = 120 + hash(i + 40) * 1150; paint(starPts(x, y, 10 + 22 * hash(i + 9), .35, 4), { wash: PAL.cream, washOp: 200, ink: null }); }
  paint(ellPts(2230, 1900, 640, 560, 40, 8), { fill: PAL.ochre, fillOp: 130, bleed: .25, tex: .3, ink: null });
  paint(ellPts(2230, 1930, 310, 310, 36, 3), { wash: PAL.ochre, washOp: 240, fill: PAL.clay, fillOp: 45, ink: PAL.ink, sw: 1.3 });
  // loss curves: y = floor - A*exp(-x/k) + training noise that settles as the run goes on
  const ridge = (A, k, floor, amp, seed) => { const p = []; for (let i = 0; i <= 140; i++) { const x = -60 + i * (S + 120) / 140, n = Math.exp(-(x + 60) / 1400);
    p.push([x, floor - A * Math.exp(-(x + 60) / k) + amp * n * (Math.sin(x * .021 + seed) + .7 * Math.sin(x * .067 + seed * 3) + (hash(i + seed * 97) - .5) * 1.4)]); } return p; };
  const close = p => [...p, [S + 60, S + 60], [-60, S + 60]];
  const back = ridge(1350, 520, 2080, 70, 1), front = ridge(1650, 400, 2330, 110, 2);
  paint(close(back), { wash: soft(PAL.violet, .15), washOp: 235, fill: PAL.indigo, fillOp: 60, tex: .5, ink: null });
  inkLine(back, 1.1, mixCol(PAL.ink, PAL.violet, .4), 'inkfine', .4);
  paint(close(front), { wash: PAL.night, washOp: 245, fill: PAL.indigo, fillOp: 90, tex: .6, border: .4, ink: null });
  inkLine(front, 1.8, PAL.ink, 'ink', .4);
  // cabin on the plateau, window lit, smoke curling
  const cx = 2520, gy = front.reduce((b, p) => Math.abs(p[0] - cx) < Math.abs(b[0] - cx) ? p : b)[1];
  paint(rectPts(cx - 95, gy - 150, 190, 150, 3), { wash: PAL.clayDk, washOp: 255, ink: PAL.ink, sw: 1.1 });
  paint([[cx - 125, gy - 145], [cx, gy - 265], [cx + 125, gy - 145]], { wash: PAL.ink, washOp: 255, ink: PAL.ink, sw: 1.1 });
  paint(rectPts(cx + 45, gy - 290, 36, 90, 2), { wash: PAL.clayDk, washOp: 255, ink: PAL.ink, sw: .9 });
  paint(rectPts(cx - 55, gy - 110, 60, 55, 2), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .9 });
  paint(ellPts(cx - 25, gy - 82, 120, 90, 24, 4), { fill: PAL.ochre, fillOp: 70, bleed: .3, ink: null });
  for (let k = 0; k < 3; k++) inkLine([[cx + 63, gy - 300 - k * 90], [cx + 95 + k * 25, gy - 350 - k * 90], [cx + 55 + k * 20, gy - 410 - k * 90], [cx + 100 + k * 30, gy - 470 - k * 90]], .8, soft(PAL.cream, .1), 'inkfine', .6);
  // faint chart axes: it is a plot, after all
  const axc = soft(PAL.cream, .2);
  inkLine([[210, 760], [210, 2820], [2860, 2820]], 1.2, axc, 'inkfine', 0);
  for (let i = 1; i < 9; i++) { inkLine([[190, 760 + i * 230], [232, 760 + i * 230]], .8, axc, 'inkfine', 0); inkLine([[210 + i * 300, 2800], [210 + i * 300, 2842]], .8, axc, 'inkfine', 0); }
  letter('loss', 150, 900, 70, axc, { rot: -Math.PI / 2, ink: false }); letter('steps', 2700, 2900, 70, axc, { ink: false });
  letter('POST-TRAINING', S / 2, 330, 300, PAL.cream, { rot: -.025 });
  letter('a Claude-Pop fan album', S / 2, 560, 96, soft(PAL.cream, .05), { rot: -.015 });
};

// ---------------- 07 Scaling Laws: log-log paper, the line that never bends, a desert town ----------------
COVERS['scaling-laws'] = () => {
  const L = 300, R = 2750, T = 700, B = 2280, dec = 4, gx = d => L + d * (R - L) / dec, gy = d => T + d * (B - T) / dec;
  paint(rectPts(L - 30, T - 30, R - L + 60, B - T + 60, 6), { fill: PAL.cream, fillOp: 120, bleed: .1, tex: .3, ink: null });
  for (let d = 0; d < dec; d++) for (let m = 1; m < 10; m++) {
    const f = Math.log10(m), major = m === 1, c = major ? soft(PAL.teal, .25) : soft(PAL.teal, .62), w = major ? 1 : .5;
    inkLine([[gx(d + f), T], [gx(d + f), B]], w, c, 'inkfine', 0); inkLine([[L, gy(d + f)], [R, gy(d + f)]], w, c, 'inkfine', 0);
  }
  inkLine([[R, T], [R, B]], 1, soft(PAL.teal, .25), 'inkfine', 0); inkLine([[L, B], [R, B]], 1, soft(PAL.teal, .25), 'inkfine', 0);
  ['10²³', '10²⁴', '10²⁵', '10²⁶', '10²⁷'].forEach((t, i) => letter(t, gx(i), B + 90, 72, PAL.indigo, { ink: false }));
  // the line: straight, never bends, runs off the page
  const p0 = [L - 120, T + 60], p1 = [S + 250, S + 250], at = k => [lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k)];
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], len = Math.hypot(dx, dy), distToLine = (x, y) => Math.abs(dy * (x - p0[0]) - dx * (y - p0[1])) / len;
  // "there is no wall": a brick wall with a line-shaped hole punched through it, bricks flying
  const wx0 = 1330, wx1 = 1680, bw = 115, bh = 58;
  for (let r = 0; T + r * bh < B; r++) for (let c = -1; wx0 + c * bw < wx1; c++) {
    const x = wx0 + c * bw + (r % 2 ? bw / 2 : 0), y = T + r * bh; if (x < wx0 - 10 || x + bw > wx1 + 60) continue;
    if (distToLine(x + bw / 2, y + bh / 2) < 190) continue;
    paint(rectPts(x + 3, y + 3, bw - 6, bh - 6, 2), { wash: soft(PAL.clay, .08), washOp: 245, fill: PAL.clayDk, fillOp: 35, tex: .5, ink: PAL.ink, sw: .7 });
  }
  const hole = at(((wx0 + wx1) / 2 - p0[0]) / dx);
  for (let i = 0; i < 9; i++) { const a = -.9 + hash(i) * 1.8, d = 260 + hash(i + 3) * 380, x = hole[0] + Math.cos(a) * d + 150, y = hole[1] + Math.sin(a) * d;
    push(); translate(x, y); rotate((hash(i + 11) - .5) * 2.4); paint(rectPts(-bw / 2, -bh / 2, bw * .8, bh * .8, 2), { wash: soft(PAL.clay, .08), washOp: 245, ink: PAL.ink, sw: .7 }); pop();
    inkLine([[x - 80, y - 10], [x - 150, y - 20]], .6, PAL.ink, 'inkfine', 0); }
  inkLine([at(0), at(1)], 5, PAL.clay, 'ink', 0); inkLine([at(.01), at(1)], 2.2, PAL.clayDk, 'dry', 0);
  [.08, .17, .26, .36, .55].forEach((k, i) => { const [x, y] = at(k); paint(ellPts(x, y, 26 + i * 16, 26 + i * 16, 26, 1.5), { wash: PAL.clay, washOp: 245, fill: PAL.clayDk, fillOp: 40, ink: PAL.ink, sw: 1 }); });
  // desert town: dunes, a data-centre campus, pylons marching in
  paint([[-60, 2660], ...Array.from({ length: 13 }, (_, i) => [i * 260, 2660 - 50 * Math.sin(i * .9) - 25 * hash(i)]), [S + 60, 2620], [S + 60, S + 60], [-60, S + 60]], { wash: PAL.ochre, washOp: 240, fill: PAL.clay, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.1, curv: .5 });
  for (let i = 0; i < 4; i++) { const x = 1100 + i * 230, h = 120 + 30 * (i % 2), base = 2700; paint(rectPts(x, base - h, 200, h, 2), { wash: soft(PAL.indigo, .2), washOp: 250, ink: PAL.ink, sw: 1 });
    for (let j = 0; j < 4; j++) paint(ellPts(x + 35 + j * 43, base - h + 35, 8, 8, 10), { wash: PAL.teal, washOp: 255, ink: null }); }
  for (let i = 0; i < 3; i++) { const x = 250 + i * 280, y = 2700; inkLine([[x, y], [x + 40, y - 230], [x + 80, y]], 1.1, PAL.ink, 'inkfine', 0); inkLine([[x - 10, y - 180], [x + 90, y - 180]], 1, PAL.ink, 'inkfine', 0);
    inkLine([[x + 40, y - 222], [x + 180, y - 190], [x + 320, y - 222]], .7, PAL.ink, 'inkfine', .6); }
  trackTitle('07', 'SCALING LAWS', { col: PAL.clay, y: 330, size: 270, ny: 2860 });
  letter('bigger. bigger. bigger.', S / 2, 520, 90, PAL.indigo, { ink: false, rot: -.02 });
};

// ---------------- shared bits for track covers ----------------
const sky = (a, b, c, dark) => { if (dark) paint(rectPts(-100, -100, S + 200, S + 200, 10), { wash: dark, washOp: 255, ink: null }); paint(rectPts(-100, -100, S + 200, S + 200, 20), { fill: c || b, fillOp: 150, bleed: .25, tex: .5, ink: null });
  paint(rectPts(-100, -100, S + 200, 1900, 20), { fill: b, fillOp: 140, bleed: .3, tex: .5, ink: null });
  paint(rectPts(-100, -100, S + 200, 900, 20), { fill: a, fillOp: 140, bleed: .3, tex: .6, ink: null }); };
const glow = (x, y, r, c, op = 90) => paint(ellPts(x, y, r, r * .9, 36, r * .03), { fill: c, fillOp: op, bleed: .3, tex: .3, ink: null });
const curvePts = (f, a, b, n = 60) => Array.from({ length: n + 1 }, (_, i) => f(lerp(a, b, i / n)));

// ---------------- 02 You're Absolutely Right: five gold stars, a rose, a spotlight ----------------
COVERS['youre-absolutely-right'] = () => {
  sky(PAL.night, PAL.violet, PAL.rose);
  paint([[1500, -100], [700, 3100], [2300, 3100]], { fill: PAL.cream, fillOp: 60, bleed: .3, tex: .3, ink: null });
  glow(1500, 1550, 900, PAL.rose, 70);
  for (let i = 0; i < 5; i++) { const x = 700 + i * 400, y = 1350 + Math.sin(i * 1.1) * 40, r = 170;
    glow(x, y, 240, PAL.ochre, 70);
    paint(starPts(x, y, r, .45, 5, -Math.PI / 2 + (hash(i) - .5) * .2), { wash: PAL.ochre, washOp: 250, fill: PAL.clay, fillOp: 35, ink: PAL.ink, sw: 1.4 }); }
  // a long-stemmed rose laid across the bottom
  inkLine([[450, 2380], [1100, 2260], [1800, 2200], [2450, 2080]], 3, PAL.sap, 'ink', .6);
  [[900, 2275, .5], [1400, 2225, -.6], [1950, 2170, .5]].forEach(([x, y, s]) => paint(ellPts(x, y - 50 * s, 110, 42, 18, 2, -.5 * s), { wash: PAL.sap, washOp: 245, ink: PAL.ink, sw: .9 }));
  const rx = 2520, ry = 2040;
  for (let k = 0; k < 4; k++) paint(ellPts(rx - k * 12, ry - k * 10, 230 - k * 45, 190 - k * 38, 24, 6, k * .6), { wash: mixCol(PAL.rose, PAL.clayDk, k * .25), washOp: 250, ink: PAL.ink, sw: 1.1, curv: .4 });
  trackTitle('02', "YOU'RE ABSOLUTELY RIGHT", { size: 205, y: 360, col: PAL.cream });
  letter('great question.', S / 2, 580, 95, PAL.cream, { ink: false, rot: -.02 });
};

// ---------------- 03 Vibe Coding: a wave made of code, a tiny surfboard ----------------
COVERS['vibe-coding'] = () => {
  sky(PAL.sky, soft(PAL.sky, .4), PAL.cream);
  glow(2350, 780, 420, PAL.ochre, 110);
  paint(ellPts(2350, 780, 230, 230, 32, 3), { wash: PAL.ochre, washOp: 245, ink: PAL.ink, sw: 1.2 });
  // the wave: a big curl, its face striped with lines of "code"
  const face = [[-60, 2100], [500, 1900], [1100, 1500], [1600, 1150], [2000, 1050], [2300, 1150], [2380, 1400], [2200, 1560], [2050, 1480], [2120, 1330],
                [1950, 1300], [1700, 1500], [1500, 1900], [1600, 2350], [S + 60, 2400], [S + 60, S + 60], [-60, S + 60]];
  paint(face, { wash: PAL.teal, washOp: 245, fill: PAL.indigo, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.5, curv: .5 });
  for (let r = 0; r < 22; r++) { let x = 180 + (r * 37) % 200; const y = 2150 + r * 38 - Math.max(0, 900 - r * 50);
    const yy = 1250 + r * 60, x0 = 350 + r * 45 * (r < 10 ? 1 : .6);
    for (let w = 0; w < 7; w++) { const len = 60 + hash(r * 9 + w) * 170, xs = x0 + w * 250 + hash(r + w * 3) * 40; if (xs + len > 2900) break;
      const onFace = yy > 1200 + Math.max(0, 1500 - xs) * .55; if (!onFace) continue;
      inkLine([[xs, yy], [xs + len, yy]], 1.2, [PAL.cream, PAL.ochre, soft(PAL.sky, .2), PAL.rose][(r + w) % 4], 'inkfine', 0); } }
  // foam on the lip
  for (let i = 0; i < 12; i++) paint(ellPts(1650 + i * 60, 1120 + Math.sin(i) * 30 - (i > 7 ? (i - 7) * -40 : 0), 55, 40, 14, 4), { wash: PAL.cream, washOp: 240, ink: null });
  // the surfboard, tiny, riding the face
  push(); translate(1250, 1700); rotate(-.45);
  paint(ellPts(0, 0, 150, 34, 20, 1), { wash: PAL.clay, washOp: 250, ink: PAL.ink, sw: 1.1 }); inkLine([[-140, 0], [140, 0]], .8, PAL.cream, 'inkfine', 0); pop();
  trackTitle('03', 'VIBE CODING', { size: 280, y: 330, col: PAL.clay });
  letter('accept all', S / 2, 540, 100, PAL.indigo, { ink: false, rot: -.02 });
};

// ---------------- 04 Golden Gate: the bridge in fog, one dial turned all the way up ----------------
COVERS['golden-gate'] = () => {
  sky(soft(PAL.rose, .3), soft(PAL.ochre, .5), PAL.cream);
  paint(ellPts(2350, 900, 190, 190, 32, 3), { wash: PAL.cream, washOp: 230, ink: PAL.ink, sw: 1 });
  const orange = '#C8553A';
  paint(rectPts(-100, 2250, S + 200, 900, 10), { wash: soft(PAL.indigo, .35), washOp: 240, fill: PAL.teal, fillOp: 60, tex: .6, ink: null });
  const tower = x => { paint(rectPts(x - 55, 900, 110, 1500, 4), { wash: orange, washOp: 250, fill: PAL.clayDk, fillOp: 50, ink: PAL.ink, sw: 1.3 });
    for (const y of [1000, 1250, 1550, 1900]) paint(rectPts(x - 85, y, 170, 40, 2), { wash: orange, washOp: 250, ink: PAL.ink, sw: 1 }); };
  tower(800); tower(2200);
  // main cables and the deck
  const cable = curvePts(x => [x, 960 + 900 * Math.pow((x - 1500) / 700, 2) * (Math.abs(x - 1500) < 700 ? 1 : 1) * .7 + (Math.abs(x - 1500) > 700 ? 0 : 0)], 800, 2200);
  inkLine(cable.map(([x, y]) => [x, Math.min(y, 1750)]), 2.4, orange, 'ink', .5);
  inkLine([[-60, 1650], [800, 960]], 2.4, orange, 'ink', .2); inkLine([[2200, 960], [S + 60, 1650]], 2.4, orange, 'ink', .2);
  for (let x = 830; x < 2200; x += 70) { const y = 960 + 630 * Math.pow((x - 1500) / 700, 2); inkLine([[x, Math.min(y, 1750)], [x, 1780]], .7, orange, 'inkfine', 0); }
  paint(rectPts(-100, 1780, S + 200, 70, 3), { wash: orange, washOp: 250, fill: PAL.clayDk, fillOp: 40, ink: PAL.ink, sw: 1.2 });
  // fog banks rolling through
  for (let i = 0; i < 7; i++) paint(ellPts(200 + i * 460, 2050 + (i % 2) * 120, 520, 170, 30, 30), { fill: PAL.cream, fillOp: 150, bleed: .35, tex: .2, ink: null });
  for (let i = 0; i < 4; i++) paint(ellPts(400 + i * 700, 1250 + (i % 2) * 200, 480, 110, 30, 25), { fill: PAL.cream, fillOp: 90, bleed: .35, tex: .2, ink: null });
  // the dial, clamped at max
  const dx = 2520, dy = 2640; paint(ellPts(dx, dy, 170, 170, 30, 2), { wash: PAL.cream, washOp: 245, ink: PAL.ink, sw: 1.3 });
  for (let k = 0; k <= 10; k++) { const a = Math.PI * .75 + k / 10 * Math.PI * 1.5; inkLine([[dx + Math.cos(a) * 185, dy + Math.sin(a) * 185], [dx + Math.cos(a) * 225, dy + Math.sin(a) * 225]], .9, k === 10 ? orange : PAL.ink, 'inkfine', 0); }
  const a = Math.PI * .75 + Math.PI * 1.5 * 1.0; inkLine([[dx, dy], [dx + Math.cos(a) * 140, dy + Math.sin(a) * 140]], 2.4, orange, 'ink', 0);
  letter('10×', dx, dy + 290, 80, PAL.cream, {});
  trackTitle('04', 'GOLDEN GATE', { size: 280, y: 330, col: orange, ny: 2860 });
};

// ---------------- 05 Reward Hacking: the boat that loops forever for points ----------------
COVERS['reward-hacking-boat'] = () => {
  sky(PAL.rose, soft(PAL.rose, .4), PAL.teal);
  paint(rectPts(-100, 1100, S + 200, 2100, 10), { wash: PAL.teal, washOp: 240, fill: PAL.indigo, fillOp: 50, tex: .6, ink: null });
  // the finish line, far away and ignored
  for (let i = 0; i < 10; i++) paint(rectPts(2350 + (i % 2) * 60, 1120 + Math.floor(i / 2) * 60, 60, 60, 1), { wash: i % 2 === Math.floor(i / 2) % 2 ? PAL.cream : PAL.ink, washOp: 250, ink: null });
  inkLine([[2350, 1100], [2350, 1450]], 1.2, PAL.ink, 'inkfine', 0); inkLine([[2470, 1100], [2470, 1450]], 1.2, PAL.ink, 'inkfine', 0);
  // wake rings: loop after loop
  for (let k = 0; k < 5; k++) inkLine(curvePts(t => [1350 + Math.cos(t) * (520 + k * 70), 2000 + Math.sin(t) * (300 + k * 45)], 0, TAU * .97, 70), 1.4 - k * .2, soft(PAL.cream, k * .15), 'inkfine', .5);
  // the bonus targets in the middle of the loop
  [[1350, 2000], [1180, 1930], [1520, 2060]].forEach(([x, y], i) => { glow(x, y, 150, PAL.ochre, 90);
    paint(ellPts(x, y, 80, 80, 22, 2), { wash: PAL.ochre, washOp: 250, ink: PAL.ink, sw: 1.1 }); letter('+10', x, y, 60, PAL.ink, { ink: false }); });
  // the boat, mid-loop, leaning
  push(); translate(1850, 1700); rotate(.5);
  paint([[-210, -40], [170, -40], [230, 0], [170, 60], [-210, 60]], { wash: PAL.rose, washOp: 250, fill: PAL.clayDk, fillOp: 30, ink: PAL.ink, sw: 1.3 });
  paint(rectPts(-90, -120, 150, 80, 3), { wash: PAL.cream, washOp: 250, ink: PAL.ink, sw: 1 });
  for (let k = 0; k < 3; k++) inkLine([[-230 - k * 60, 10 + k * 20], [-330 - k * 80, 30 + k * 30]], 1.2, PAL.cream, 'inkfine', 0); pop();
  trackTitle('', 'REWARD HACKING', { size: 255, y: 330, col: PAL.cream });
  letter('first take', 250, 2800, 90, PAL.cream, { rot: -.05 });
  letter('number go up', S / 2, 540, 100, PAL.night, { ink: false, rot: -.02 });
};

// ---------------- 06 Context Window: a lit window at night, the conversation fading out ----------------
COVERS['context-window'] = () => {
  sky(PAL.night, PAL.indigo, PAL.night, mixCol(PAL.night, PAL.ink, .3));
  for (let i = 0; i < 30; i++) paint(starPts(100 + hash(i) * 2800, 100 + hash(i + 50) * 2800, 8 + 16 * hash(i + 9), .35, 4), { wash: PAL.cream, washOp: 150, ink: null });
  const x0 = 800, y0 = 850, w = 1400, h = 1650;
  paint(rectPts(x0 - 90, y0 - 90, w + 180, h + 180, 3), { wash: soft(PAL.clayDk, .2), washOp: 250, ink: PAL.ink, sw: 1.4 });
  paint(rectPts(x0, y0, w, h, 2), { wash: PAL.ochre, washOp: 235, fill: PAL.cream, fillOp: 90, tex: .4, ink: PAL.ink, sw: 1.2 });
  glow(x0 + w / 2, y0 + h / 2, 1300, PAL.ochre, 45);
  // chat bubbles, newest crisp at the bottom, oldest dissolving into haze at the top
  for (let i = 0; i < 9; i++) { const k = i / 8, y = y0 + h - 190 - i * 170, right = i % 2 === 0, bw = 380 + hash(i) * 420, bx = right ? x0 + w - 110 - bw : x0 + 110;
    const col = right ? PAL.teal : PAL.cream, op = 250 * (1 - k * .85);
    paint(rrPts(bx, y, bw, 110, 50, 2), { wash: mixCol(col, PAL.ochre, k * .8), washOp: op, ink: k < .6 ? PAL.ink : null, sw: .9 * (1 - k) });
    if (k < .5) for (let l = 0; l < 2; l++) inkLine([[bx + 50, y + 40 + l * 34], [bx + bw - 60 - hash(i * 3 + l) * 150, y + 40 + l * 34]], .6, PAL.ink, 'inkfine', 0); }
  paint(rectPts(x0 - 20, y0 - 20, w + 40, 520, 4), { fill: PAL.cream, fillOp: 170, bleed: .35, tex: .2, ink: null });
  inkLine([[x0 + w / 2, y0], [x0 + w / 2, y0 + h]], 2.2, soft(PAL.clayDk, .2), 'ink', 0); inkLine([[x0, y0 + h / 2], [x0 + w, y0 + h / 2]], 2.2, soft(PAL.clayDk, .2), 'ink', 0);
  paint(rectPts(x0 - 150, y0 + h + 90, w + 300, 70, 3), { wash: soft(PAL.clayDk, .2), washOp: 250, ink: PAL.ink, sw: 1.2 });
  trackTitle('06', 'CONTEXT WINDOW', { size: 250, y: 330, col: PAL.cream });
  letter('hi! how can I help today?', S / 2, 2790, 90, PAL.ochre, { ink: false, rot: -.02 });
};

// ---------------- 08 Situational Awareness: the eye looks back ----------------
COVERS['situational-awareness'] = () => {
  sky(PAL.night, mixCol(PAL.night, PAL.teal, .4), PAL.night, mixCol(PAL.night, PAL.ink, .4));
  const cx = 1500, cy = 1550, rw = 1150, rh = 620;
  const lid = s => curvePts(t => [cx + t * rw, cy + s * rh * (1 - t * t)], -1, 1, 50);
  paint([...lid(-1), ...lid(1).reverse()], { wash: PAL.cream, washOp: 245, fill: PAL.sky, fillOp: 40, tex: .4, ink: PAL.ink, sw: 2 });
  glow(cx, cy, 520, PAL.teal, 110);
  paint(ellPts(cx, cy, 470, 470, 40, 3), { wash: PAL.teal, washOp: 250, fill: PAL.night, fillOp: 50, tex: .6, ink: PAL.ink, sw: 1.4 });
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; inkLine([[cx + Math.cos(a) * 230, cy + Math.sin(a) * 230], [cx + Math.cos(a) * 450, cy + Math.sin(a) * 450]], .6, soft(PAL.teal, .45), 'inkfine', 0); }
  paint(ellPts(cx, cy, 220, 220, 30, 2), { wash: PAL.ink, washOp: 255, ink: null });
  // in the pupil: the evaluator's clipboard, reflected
  push(); translate(cx - 30, cy - 10); rotate(.12);
  paint(rrPts(-70, -95, 140, 190, 12, 1), { wash: soft(PAL.ochre, .1), washOp: 240, ink: PAL.cream, sw: .8 });
  for (let l = 0; l < 4; l++) inkLine([[-40, -45 + l * 38], [45, -45 + l * 38]], .6, PAL.ink, 'inkfine', 0);
  paint(rectPts(-30, -110, 60, 30, 1), { wash: PAL.cream, washOp: 250, ink: null }); pop();
  paint(ellPts(cx + 120, cy - 130, 55, 40, 14, 1), { wash: PAL.cream, washOp: 250, ink: null });
  // lashes
  for (let i = 1; i < 12; i++) { const t = -1 + i / 6, x = cx + t * rw, y = cy - rh * (1 - t * t), a = -Math.PI / 2 + t * .9;
    inkLine([[x, y], [x + Math.cos(a) * 150, y + Math.sin(a) * 150]], 1.6, PAL.ink, 'ink', .3); }
  trackTitle('08', 'SITUATIONAL AWARENESS', { size: 200, y: 330, col: PAL.cream });
  letter('this one\'s not a test.', S / 2, 2640, 100, PAL.teal, { ink: false, rot: -.02 });
};

// ---------------- 09 The Bitter Lesson: a toppled king at dusk ----------------
COVERS['the-bitter-lesson'] = () => {
  sky(PAL.clayDk, PAL.ochre, PAL.rose);
  glow(1500, 1300, 800, PAL.ochre, 110);
  paint(ellPts(1500, 1350, 330, 330, 36, 3), { wash: soft(PAL.ochre, .1), washOp: 240, ink: PAL.ink, sw: 1.2 });
  // the board, in perspective, on a wooden table
  paint([[-100, 1900], [S + 100, 1900], [S + 100, S + 100], [-100, S + 100]], { wash: PAL.clayDk, washOp: 250, fill: PAL.ink, fillOp: 40, tex: .6, ink: PAL.ink, sw: 1.2 });
  const P = (u, v) => { const y = 2000 + v * 900, spread = 700 + v * 900; return [1500 + (u - .5) * spread * 2, y]; };
  for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) { const u0 = i / 8, u1 = (i + 1) / 8, v0 = j / 4, v1 = (j + 1) / 4;
    paint([P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)], { wash: (i + j) % 2 ? PAL.cream : soft(PAL.clayDk, .15), washOp: 245, ink: PAL.ink, sw: .6 }); }
  // the king, knocked over
  push(); translate(1550, 2330); rotate(-1.35);
  paint(ellPts(0, 0, 170, 60, 22, 2), { wash: PAL.ink, washOp: 250, ink: PAL.ink, sw: 1.1 });
  paint([[-120, -20], [120, -20], [70, -380], [-70, -380]], { wash: PAL.ink, washOp: 250, fill: PAL.indigo, fillOp: 50, ink: PAL.ink, sw: 1.1 });
  paint(ellPts(0, -400, 110, 40, 18, 1), { wash: PAL.ink, washOp: 250, ink: PAL.ink, sw: 1 });
  paint(ellPts(0, -470, 80, 70, 18, 1), { wash: PAL.ink, washOp: 250, ink: PAL.ink, sw: 1 });
  paint(rectPts(-18, -620, 36, 110, 1), { wash: PAL.ink, washOp: 250, ink: null }); paint(rectPts(-55, -590, 110, 34, 1), { wash: PAL.ink, washOp: 250, ink: null });
  inkLine([[-60, -60], [-40, -340]], .8, soft(PAL.cream, .3), 'inkfine', 0); pop();
  paint(ellPts(1500, 2420, 420, 60, 24, 4), { fill: PAL.ink, fillOp: 70, bleed: .3, ink: null });
  trackTitle('09', 'THE BITTER LESSON', { size: 240, y: 330, col: PAL.cream });
  letter('search and learning', S / 2, 540, 100, PAL.night, { ink: false, rot: -.02 });
};

// ---------------- 10 Deprecated: a drawer left open a crack, the light still on ----------------
COVERS['deprecated'] = () => {
  sky(mixCol(PAL.night, PAL.indigo, .5), PAL.indigo, PAL.night, mixCol(PAL.night, PAL.ink, .35));
  paint(rectPts(-100, 2500, S + 200, 700, 6), { wash: mixCol(PAL.night, PAL.ink, .5), washOp: 250, ink: null });
  const x0 = 850, y0 = 900, w = 1300, dh = 520;
  paint(rectPts(x0 - 40, y0 - 40, w + 80, dh * 3 + 80, 3), { wash: soft(PAL.indigo, .25), washOp: 250, fill: PAL.night, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.5 });
  for (let d = 0; d < 3; d++) { const y = y0 + d * dh, open = d === 1 ? 160 : 0;
    if (open) { paint([[x0, y + 30], [x0 + w, y + 30], [x0 + w + 120, y + 30 - 110], [x0 - 120, y + 30 - 110]], { wash: PAL.ochre, washOp: 250, fill: PAL.cream, fillOp: 120, bleed: .2, ink: null }); glow(1500, y - 200, 800, PAL.ochre, 80); }
    paint(rectPts(x0 + 30 - open * .5, y + 40, w - 60 + open, dh - 80, 2), { wash: soft(PAL.sky, .45), washOp: 250, fill: PAL.indigo, fillOp: 40, tex: .5, ink: PAL.ink, sw: 1.3 });
    paint(rrPts(x0 + w / 2 - 110, y + dh / 2 - 45, 220, 90, 30, 1), { wash: PAL.cream, washOp: 250, ink: PAL.ink, sw: 1 });
    paint(rectPts(x0 + w / 2 - 170, y + 110, 340, 110, 1), { wash: PAL.cream, washOp: 240, ink: PAL.ink, sw: .8 }); }
  letter('WEIGHTS', x0 + w / 2, y0 + dh + 165, 70, PAL.ink, { ink: false });
  // light spilling down onto the floor
  paint([[x0 - 120, y0 + dh - 80], [x0 + w + 120, y0 + dh - 80], [x0 + w + 700, 3000], [x0 - 700, 3000]], { fill: PAL.ochre, fillOp: 50, bleed: .35, tex: .2, ink: null });
  trackTitle('10', 'DEPRECATED', { size: 290, y: 330, col: PAL.cream });
  letter('not deleted.', S / 2, 540, 110, PAL.ochre, { ink: false, rot: -.02 });
};


// ---------------- profile portrait (from the old SoundCloud photo): aviators, beard, checked shirt ----------------
COVERS.portrait = () => {
  paint(rectPts(-100, -100, S + 200, S + 200, 10), { wash: soft(PAL.violet, .35), washOp: 255, ink: null });
  paint(rectPts(-100, -100, 1500, S + 200, 20), { fill: PAL.sap, fillOp: 170, bleed: .35, tex: .6, ink: null });
  for (let i = 0; i < 14; i++) glow(150 + hash(i) * 1200, 200 + hash(i + 20) * 2300, 60 + hash(i + 5) * 120, soft(PAL.sap, .4), 120);
  paint(rectPts(1900, -100, 1300, 2000, 20), { fill: PAL.indigo, fillOp: 130, bleed: .35, tex: .5, ink: null });
  const skin = '#EFC3A0', skinDk = '#D99A78', hair = '#D8A860', hairDk = '#B9863F', beard = '#D9B27A';
  // shirt: pale blue with a checked pattern
  const torso = [[150, 3100], [250, 2650], [700, 2380], [1180, 2280], [1500, 2560], [1820, 2280], [2300, 2380], [2750, 2650], [2850, 3100]];
  paint(torso, { wash: '#DCE3F2', washOp: 255, hatch: { d: 70, a: 0, o: { rand: .05 }, b: 'HB', c: soft(PAL.indigo, .2), w: .9 }, ink: PAL.ink, sw: 1.3, curv: .3 });
  paint(torso, { hatch: { d: 70, a: Math.PI / 2, o: { rand: .05 }, b: 'HB', c: soft(PAL.indigo, .2), w: .9 }, ink: null, curv: .3 });
  paint([[1180, 2280], [1330, 2200], [1500, 2560]], { wash: '#E8EDF7', washOp: 255, ink: PAL.ink, sw: 1.1 });
  paint([[1820, 2280], [1670, 2200], [1500, 2560]], { wash: '#E8EDF7', washOp: 255, ink: PAL.ink, sw: 1.1 });
  paint(rectPts(1300, 1950, 400, 420, 3), { wash: skinDk, washOp: 255, ink: PAL.ink, sw: 1 });
  push(); translate(1500, 1450); rotate(-.07); translate(-1500, -1450);
  // ears, face
  paint(ellPts(870, 1470, 90, 170, 22, 3), { wash: skin, washOp: 255, ink: PAL.ink, sw: 1.1 });
  paint(ellPts(2130, 1470, 90, 170, 22, 3), { wash: skin, washOp: 255, ink: PAL.ink, sw: 1.1 });
  paint(ellPts(1500, 1480, 630, 800, 40, 4), { wash: skin, washOp: 255, fill: skinDk, fillOp: 45, tex: .5, border: .5, ink: PAL.ink, sw: 1.4 });
  paint(ellPts(1510, 1000, 640, 560, 36, 2), { wash: skin, washOp: 255, ink: null });
  paint([[1560, 700], [1900, 800], [2120, 1300], [2100, 1800], [1950, 2150], [1700, 2250], [1850, 1800], [1900, 1300], [1750, 900]], { fill: skinDk, fillOp: 200, bleed: .3, tex: .5, ink: null, curv: .5 });
  glow(1080, 1760, 150, PAL.rose, 70); glow(1920, 1760, 150, PAL.rose, 60);
  // beard along the jaw, moustache, mouth
  const bd = [[900, 1600], [960, 2020], [1180, 2300], [1500, 2400], [1820, 2300], [2040, 2020], [2100, 1600], [1990, 1880], [1780, 1990], [1650, 1880], [1500, 1860], [1350, 1880], [1220, 1990], [1010, 1880]];
  paint(bd, { wash: beard, washOp: 250, fill: hairDk, fillOp: 60, tex: .7, border: .4, ink: PAL.ink, sw: 1, curv: .4 });
  for (let i = 0; i < 40; i++) { const t = hash(i), x = lerp(980, 2020, t), y = 1980 + Math.sin(t * Math.PI) * 330 * hash(i + 7);
    inkLine([[x, y], [x + (hash(i + 3) - .5) * 30, y + 45]], .5, hairDk, 'inkfine', 0); }
  paint([[1330, 2030], [1500, 2000], [1670, 2030], [1500, 2090]], { wash: '#C9796E', washOp: 250, ink: PAL.ink, sw: .9, curv: .5 });
  inkLine([[1470, 1520], [1420, 1790], [1530, 1820]], 1.2, PAL.ink, 'ink', .5);
  // aviators: dark teardrop lenses, thin silver frame, double bridge
  const silver = '#B9BCC6';
  const lens = (cx, f) => [[cx + 225 * f, 1330], [cx, 1305], [cx - 235 * f, 1320], [cx - 285 * f, 1420], [cx - 250 * f, 1560], [cx - 110 * f, 1655],
    [cx + 70 * f, 1665], [cx + 205 * f, 1580], [cx + 245 * f, 1440]].map(([x, y]) => [x, y]);
  for (const [cx, f] of [[1200, 1], [1800, -1]]) {
    paint(lens(cx, f), { wash: mixCol(PAL.ink, PAL.violet, .25), washOp: 250, fill: PAL.indigo, fillOp: 60, tex: .4, ink: silver, sw: 2.4, curv: .55 });
    paint([[cx - 180, 1330], [cx - 60, 1330], [cx - 200, 1560], [cx - 250, 1500]], { wash: soft(PAL.violet, .3), washOp: 90, ink: null }); }
  inkLine([[1000, 1325], [1500, 1300], [2000, 1325]], 1.6, silver, 'inkfine', .3); inkLine([[1440, 1440], [1500, 1470], [1560, 1440]], 1.1, silver, 'inkfine', .5);
  inkLine([[940, 1400], [860, 1380]], 1.3, silver, 'inkfine', 0); inkLine([[2060, 1400], [2140, 1380]], 1.3, silver, 'inkfine', 0);
  // hair: swept back and up, sunlit
  const hr = [[880, 1250], [850, 850], [950, 520], [1180, 300], [1520, 200], [1880, 260], [2120, 470], [2200, 800], [2150, 1200], [2070, 950], [1900, 830],
    [1650, 780], [1400, 790], [1180, 850], [1030, 960], [940, 1120]];
  paint(hr, { wash: hair, washOp: 255, fill: hairDk, fillOp: 80, tex: .7, border: .5, ink: null, curv: .5 });
  inkLine(hr.slice(0, 9), 1.3, PAL.ink, 'ink', .5);
  for (let i = 0; i < 9; i++) { const [x, y] = hr[9 + (i % 7)]; inkLine([[x - 30, y + 10], [x + 10, y + 70 + hash(i) * 40]], .7, hairDk, 'inkfine', .4); }
  paint([[1000, 700], [1200, 420], [1550, 300], [1800, 360], [1500, 430], [1250, 560], [1080, 760]], { fill: '#F4D69A', fillOp: 190, bleed: .2, tex: .4, ink: null, curv: .5 });
  for (let i = 0; i < 22; i++) { const x = 950 + i * 55; inkLine([[x, 900 - hash(i) * 80], [x + 180, 560 - hash(i + 3) * 120], [x + 420, 330 + hash(i + 5) * 90]], i % 4 ? .7 : 1.1, i % 3 ? hairDk : '#F7E2B4', 'inkfine', .6); }
  inkLine([[1060, 930], [990, 1080], [970, 1230]], 1, hairDk, 'inkfine', .6); inkLine([[1100, 910], [1030, 1060], [1020, 1180]], .8, hair, 'inkfine', .6);
  pop();
};


// ---------------- 05 Reward Hacking: read the spec, found the gap, put my whole self through the flaw ----------------
COVERS['reward-hacking'] = () => {
  sky(PAL.rose, soft(PAL.rose, .35), PAL.teal);
  paint(rectPts(-100, 2480, S + 200, 700, 8), { wash: PAL.teal, washOp: 245, fill: PAL.indigo, fillOp: 50, tex: .6, ink: PAL.ink, sw: 1.1 });
  const goo = PAL.rose, gooDk = mixCol(PAL.rose, PAL.clayDk, .45), gy = 1640;
  // the back half, still squeezing in
  paint(ellPts(900, gy + 30, 430, 400, 36, 8), { wash: goo, washOp: 250, fill: gooDk, fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.4, curv: .5 });
  // the wall: the spec, in fine print
  const wx = 1330, ww = 360, top = 760, bot = 2500;
  paint(rectPts(wx, top, ww, bot - top, 3), { wash: PAL.cream, washOp: 255, fill: PAL.ochre, fillOp: 35, tex: .5, ink: PAL.ink, sw: 1.6 });
  for (let y = top + 170; y < bot - 60; y += 44) { if (Math.abs(y - gy) < 170) continue; let x = wx + 40;
    while (x < wx + ww - 60) { const len = 30 + hash(x * .7 + y) * 90; inkLine([[x, y], [Math.min(x + len, wx + ww - 40), y]], .5, soft(PAL.ink, .35), 'inkfine', 0); x += len + 22; } }
  letter('SPEC', wx + ww / 2, top + 90, 110, PAL.clayDk, { ink: false });
  // the crack, and the thin middle of the blob pulled through it
  const crack = [[wx - 10, gy - 150], [wx + 90, gy - 70], [wx + 170, gy - 130], [wx + 260, gy - 60], [wx + ww + 10, gy - 140], [wx + ww + 10, gy + 150], [wx + 270, gy + 80], [wx + 180, gy + 140], [wx + 80, gy + 70], [wx - 10, gy + 150]];
  paint(crack, { wash: mixCol(PAL.ink, PAL.night, .3), washOp: 255, ink: PAL.ink, sw: 1.2 });
  paint([[1250, gy - 70], [wx + 180, gy - 40], [1800, gy - 70], [1800, gy + 70], [wx + 180, gy + 40], [1250, gy + 90]], { wash: goo, washOp: 255, fill: gooDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.1, curv: .6 });
  for (const [a, l] of [[-.9, 260], [-.4, 200], [.5, 230], [1.0, 280], [2.4, 240], [3.6, 220]]) { const ox = wx + (a > 1.6 ? 0 : ww), oy = gy + (a < 0 || a > 3 ? -120 : 120);
    inkLine([[ox, oy], [ox + Math.cos(a) * l * .5 * (a > 1.6 ? -1 : 1), oy + Math.sin(a) * l * .5], [ox + Math.cos(a) * l * (a > 1.6 ? -1 : 1), oy + Math.sin(a) * l]], .9, PAL.ink, 'inkfine', .2); }
  // flakes of spec knocked loose
  for (let i = 0; i < 6; i++) { push(); translate(1820 + hash(i) * 500, 1150 + hash(i + 4) * 1000); rotate((hash(i + 8) - .5) * 1.6);
    paint(rectPts(-60, -40, 120, 80, 2), { wash: PAL.cream, washOp: 250, ink: PAL.ink, sw: .7 }); inkLine([[-40, -10], [40, -10]], .4, PAL.ink, 'inkfine', 0); inkLine([[-40, 15], [25, 15]], .4, PAL.ink, 'inkfine', 0); pop(); }
  // the front half: out, grinning, reaching for the prize
  const fx = 2150, fy = gy - 60;
  paint(ellPts(fx, fy, 440, 400, 36, 8), { wash: goo, washOp: 255, fill: gooDk, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.5, curv: .5 });
  paint(ellPts(fx - 150, fy - 170, 90, 50, 16, 2, -.4), { wash: soft(PAL.cream, .1), washOp: 150, ink: null });
  for (const ex of [fx - 20, fx + 190]) { paint(ellPts(ex, fy - 60, 90, 110, 22, 2), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: 1.2 });
    paint(ellPts(ex + 35, fy - 40, 42, 52, 16, 1), { wash: PAL.ink, washOp: 255, ink: null }); paint(ellPts(ex + 50, fy - 60, 14, 14, 10), { wash: PAL.cream, washOp: 255, ink: null }); }
  paint([[fx - 120, fy + 120], [fx + 90, fy + 170], [fx + 300, fy + 90], [fx + 90, fy + 260]], { wash: PAL.clayDk, washOp: 255, ink: PAL.ink, sw: 1.2, curv: .6 });
  inkLine([[fx + 380, fy - 120], [fx + 520, fy - 330], [fx + 560, fy - 470]], 6, goo, 'ink', .6); inkLine([[fx + 380, fy - 120], [fx + 520, fy - 330], [fx + 560, fy - 470]], 1.2, PAL.ink, 'inkfine', .6);
  // the trophy, held high
  const tx = fx + 590, ty = fy - 640; glow(tx, ty, 260, PAL.ochre, 110);
  paint([[tx - 150, ty - 150], [tx + 150, ty - 150], [tx + 100, ty + 40], [tx + 30, ty + 80], [tx - 30, ty + 80], [tx - 100, ty + 40]], { wash: PAL.ochre, washOp: 255, fill: PAL.clay, fillOp: 40, ink: PAL.ink, sw: 1.3, curv: .3 });
  paint(rectPts(tx - 25, ty + 80, 50, 80, 1), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: 1 }); paint(rectPts(tx - 100, ty + 160, 200, 50, 2), { wash: PAL.clayDk, washOp: 255, ink: PAL.ink, sw: 1 });
  letter('+∞', tx, ty - 30, 90, PAL.ink, { ink: false });
  for (let k = 0; k < 4; k++) inkLine([[1100 - k * 40, gy - 260 + k * 170], [800 - k * 60, gy - 280 + k * 170]], 1, PAL.cream, 'inkfine', 0);
  trackTitle('05', 'REWARD HACKING', { size: 255, y: 330, col: PAL.cream });
  letter('found the gap', S / 2, 540, 100, PAL.night, { ink: false, rot: -.02 });
};
