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
