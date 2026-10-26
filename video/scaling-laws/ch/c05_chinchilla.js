// c05_chinchilla.js: 97.55-119.2, verse 2. A lecture hall in chalk green, cream and ochre. The Chinchilla professor
// (a fluffy grey chinchilla in a mortarboard, our own drawing) waddles to the podium and taps the board; puts an
// overfed model Clawd on a diet by scooping data onto the other pan of a balance until it levels at 20:1; works an
// abacus at blinding speed and sweeps the old ratio off the board with its tail. Clawd thinks longer and longer until a
// third axis pops up out of the page; then every line becomes a roller-coaster track and the lab rides off the board.
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { HARD, HARD_LAMP, labCoat } = SL;
  // lecture-hall palette: chalk green slate, cream chalk, ochre wood
  const SLATE = '#2E5B48', SLATE_DK = '#21443A', CHALK = '#EEEBD6', CHALK_DIM = '#9DB7A6', WALL = '#E7D3A6', WOOD = '#A8703F', WOOD_DK = '#74482A', WOOD_LT = '#C99560';
  // the chinchilla
  const FUR = '#A6A3B3', FUR_DK = '#76738A', FUR_LT = '#DEDBE6', EAR_IN = '#EBA3B0', FOOT = '#C8AEB8', CAP = '#2A2740', CAP_DK = '#1A1830';

  // ---------------- the Chinchilla professor ----------------
  // a scalloped "fluffy" ellipse: every other point pokes out a tuft, smoothed with curv so the edge reads as fur
  const fluff = (cx, cy, rx, ry, n, tuft, seed = 0, rot = 0) => {
    const p = [];
    for (let i = 0; i < n; i++) {
      const a = rot + i / n * TAU, k = (i % 2 ? 1 - tuft * .4 : 1 + tuft) * (1 + .05 * (hash(i * 7.3 + seed) - .5));
      p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return p;
  };
  // the bushy tail: a spine that curls, fattening toward the tip, outlined as one tufted shape
  function tail(s, sw, a0, curl, len, seed) {
    const N = 8, seg = 1.05 * s * len, sp = []; let p = [-3.2 * s, -2.6 * s], a = a0;
    for (let k = 0; k <= N; k++) { sp.push([p[0], p[1], a]); p = [p[0] + Math.cos(a) * seg, p[1] + Math.sin(a) * seg]; a += curl; }
    const rad = k => s * lerp(.8, 2.0, Math.pow(k / N, .7));
    const L = [], R = [];
    sp.forEach(([x, y, aa], k) => {
      const nx = -Math.sin(aa), ny = Math.cos(aa), r = rad(k), tf = k % 2 ? 1.12 : .96;
      L.push([x + nx * r * tf, y + ny * r * tf]); R.push([x - nx * r * (2.08 - tf), y - ny * r * (2.08 - tf)]);
    });
    const [tx, ty, ta] = sp[N], cap = [];
    for (let i = 1; i < 9; i++) { const b = ta + Math.PI / 2 - i / 9 * Math.PI, r = rad(N) * (i % 2 ? 1.12 : .98); cap.push([tx + Math.cos(b) * r, ty + Math.sin(b) * r]); }
    const outline = [...L, ...cap, ...R.reverse()];
    paint(outline, { wash: FUR, washOp: 255, fill: FUR_DK, fillOp: 70, bleed: .1, tex: .6, ink: PAL.ink, sw: sw * .8, curv: .5 });
    for (let k = 2; k < N; k++) { const [x, y, aa] = sp[k], r = rad(k) * .5;                // fur flicks along the spine
      inkLine([[x - Math.cos(aa) * r, y - Math.sin(aa) * r], [x + Math.cos(aa + .5) * r, y + Math.sin(aa + .5) * r]], sw * .5, FUR_DK, 'inkfine', .5); }
  }
  // chinchilla(x, y, s, o): (x, y) is the ground point between the feet, s the unit; about 17s tall to the ear tips.
  // Front-facing. o: flip, dy, rot, sq, sx, walk (phase), aL/aR (arm angles, Clawd convention), pawL/pawR (hooks at the
  // paw, arm space), eyes ('normal','closed','happy','focus','wide','look' + lookX), mouth ('w','O','smile'),
  // hatTilt, hatLift, hatDx, tassel (swing angle), tailA/tailCurl/tailLen, earWig, blush, noShadow.
  function chinchilla(x, y, s, o = {}) {
    const sw = clamp(s / 15, .5, 2.2), sq = o.sq || 0, seed = o.seed || 0;
    if (!o.noShadow) paint(ellPts(x, y + s * .2, s * 4.8, s * .9, 20), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null });
    push(); translate(x, y + (o.dy || 0) * s); if (o.rot) rotate(o.rot);
    scale((o.flip ? -1 : 1) * (1 + sq * .5) * (o.sx ?? 1), 1 - sq);

    tail(s, sw, o.tailA ?? Math.PI + .3, o.tailCurl ?? .25, o.tailLen ?? 1, seed);
    // feet
    for (const side of [-1, 1]) {
      const lift = o.walk != null ? Math.max(0, Math.sin((o.walk + (side > 0 ? .5 : 0)) * TAU)) * .9 : 0;
      paint(ellPts(side * 1.9 * s, (-.4 - lift) * s, 1.45 * s, .62 * s, 14), { wash: FOOT, washOp: 255, ink: PAL.ink, sw: sw * .7 });
      for (const tx of [-.5, 0, .5]) inkLine([[side * 1.9 * s + tx * s, (-.15 - lift) * s], [side * 1.9 * s + tx * s * 1.1, (.05 - lift) * s]], sw * .5, PAL.ink, 'inkfine', 0);
    }
    // body: a fluffy pear, pale belly, a few chest tufts
    paint(fluff(0, -4.9 * s, 4.3 * s, 4.9 * s, 38, .07, seed), { wash: FUR, washOp: 255, fill: FUR_DK, fillOp: 60, bleed: .1, tex: .6, border: .6, ink: PAL.ink, sw, curv: .5 });
    paint(fluff(0, -4.2 * s, 2.9 * s, 3.5 * s, 26, .06, seed + 3), { wash: FUR_LT, washOp: 235, ink: null, curv: .5 });
    for (const [tx, ty] of [[-1, -6.2], [.2, -5.4], [1.2, -6.3], [-.5, -3.6], [.9, -2.8]]) inkLine([[(tx - .3) * s, ty * s], [tx * s, (ty + .35) * s], [(tx + .3) * s, ty * s]], sw * .5, FUR_DK, 'inkfine', 0);
    // arms: short fluffy stubs with pale paws; hooks at the paw
    const arm = (side, a, hook) => {
      push(); translate(side * 3.4 * s, -6.7 * s); rotate(side < 0 ? a : -a);
      paint(rrPts(side < 0 ? -2.4 * s : 0, -.7 * s, 2.4 * s, 1.4 * s, .65 * s), { wash: FUR, washOp: 255, fill: FUR_DK, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .8 });
      paint(ellPts(side * 2.35 * s, 0, .8 * s, .72 * s, 12), { wash: FUR_LT, washOp: 255, ink: PAL.ink, sw: sw * .7 });
      if (hook) { translate(side * 2.35 * s, 0); if (side < 0) scale(-1, 1); hook(s, sw); }
      pop();
    };
    // ears: big round satellite dishes, drawn before the head
    for (const side of [-1, 1]) {
      push(); translate(side * 2.9 * s, -14.1 * s); rotate(side * (.42 + (o.earWig || 0) * .15 * side));
      paint(ellPts(0, 0, 2.05 * s, 2.95 * s, 26), { wash: FUR, washOp: 255, fill: FUR_DK, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .85 });
      paint(ellPts(0, .3 * s, 1.35 * s, 2.15 * s, 22), { wash: EAR_IN, washOp: 255, fill: '#D27C8C', fillOp: 60, bleed: .15, tex: .5, ink: null });
      pop();
    }
    // head
    paint(fluff(0, -10.4 * s, 4.0 * s, 3.5 * s, 40, .06, seed + 7), { wash: FUR, washOp: 255, fill: FUR_DK, fillOp: 40, bleed: .1, tex: .5, border: .7, ink: PAL.ink, sw, curv: .5 });
    paint(ellPts(0, -8.9 * s, 2.3 * s, 1.35 * s, 20), { wash: FUR_LT, washOp: 220, ink: null });          // pale muzzle
    for (const bx of [-2.6, 2.6]) paint(ellPts(bx * s, -9.6 * s, .8 * s, .45 * s, 12), { fill: PAL.rose, fillOp: o.blush ? 170 : 90, bleed: .2, ink: null });
    // eyes: big glossy black beads
    const e = o.eyes || 'normal', blink = e === 'normal' && ((T * .8 + seed * 1.3) % 3.1) < .11;
    for (const side of [-1, 1]) {
      const ex = side * 1.55 * s, ey = -10.9 * s;
      if (e === 'closed' || blink) inkLine([[ex - .7 * s, ey], [ex, ey + .35 * s], [ex + .7 * s, ey]], sw * 1.1, PAL.ink, 'ink', .5);
      else if (e === 'happy') inkLine([[ex - .7 * s, ey + .3 * s], [ex, ey - .4 * s], [ex + .7 * s, ey + .3 * s]], sw * 1.2, PAL.ink, 'ink', .4);
      else {
        const ry = e === 'focus' ? .5 : e === 'wide' ? 1.1 : .95, rx = e === 'wide' ? .9 : .8, lx = e === 'look' ? (o.lookX || 0) * .25 * s : 0;
        paint(ellPts(ex, ey, rx * s, ry * s, 16), { wash: '#1E1A26', washOp: 255, ink: null });
        paint(ellPts(ex + lx + .25 * s, ey - .32 * ry * s, .27 * s, .27 * s, 10), { wash: PAL.cream, washOp: 255, ink: null });
        paint(ellPts(ex + lx - .25 * s, ey + .4 * ry * s, .12 * s, .12 * s, 8), { wash: PAL.cream, washOp: 200, ink: null });
        if (e === 'focus') inkLine([[ex - .9 * s, ey - .9 * s], [ex + .8 * s, ey - .65 * s]], sw * 1.1, PAL.ink, 'ink', 0);   // stern brow
      }
    }
    // nose, mouth, whiskers
    paint([[-.45 * s, -9.65 * s], [.45 * s, -9.65 * s], [0, -9.25 * s]], { wash: '#D9788A', washOp: 255, ink: PAL.ink, sw: sw * .45, curv: .4 });
    if (o.mouth === 'O') paint(ellPts(0, -8.55 * s, .45 * s, .55 * s, 12), { wash: '#4A1F2A', ink: PAL.ink, sw: sw * .5 });
    else inkLine([[-.6 * s, -8.85 * s], [-.3 * s, -8.6 * s], [0, -8.85 * s], [.3 * s, -8.6 * s], [.6 * s, -8.85 * s]], sw * .6, PAL.ink, 'inkfine', .5);
    inkLine([[0, -9.25 * s], [0, -8.85 * s]], sw * .5, PAL.ink, 'inkfine', 0);
    const tw = Math.sin(T * 9 + seed) * .12;
    for (const side of [-1, 1]) for (let k = 0; k < 3; k++) {
      const y0 = -9.35 * s + k * .22 * s;
      inkLine([[side * .9 * s, y0], [side * 3.4 * s, y0 + (k - 1.2) * .5 * s + tw * s], [side * 6 * s, y0 + (k - 1) * 1.1 * s + tw * 2 * s]], sw * .55, PAL.ink, 'inkfine', .6);
    }
    // bow tie
    for (const side of [-1, 1]) paint([[0, -7.15 * s], [side * 1.4 * s, -7.75 * s], [side * 1.4 * s, -6.45 * s]], { wash: PAL.clay, washOp: 255, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(0, -7.1 * s, .38 * s, .38 * s, 10), { wash: PAL.clayDk, ink: PAL.ink, sw: sw * .5 });
    arm(-1, o.aL ?? -.7, o.pawL); arm(1, o.aR ?? -.7, o.pawR);

    // mortarboard: skullcap, a flat square board seen from a little above, gold button and a swinging tassel
    push(); translate((o.hatDx || 0) * s, -13.7 * s - (o.hatLift || 0) * s); rotate(o.hatTilt || 0);
    const cap = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; cap.push([Math.cos(a) * 2.9 * s, .9 * s + Math.sin(a) * 1.2 * s]); }
    paint(cap, { wash: CAP, washOp: 255, ink: PAL.ink, sw: sw * .8 });
    paint([[-4.3 * s, 0], [0, 1.15 * s], [4.3 * s, 0], [4.3 * s, .45 * s], [0, 1.6 * s], [-4.3 * s, .45 * s]], { wash: CAP_DK, washOp: 255, ink: PAL.ink, sw: sw * .8 });
    paint([[-4.3 * s, 0], [0, -1.15 * s], [4.3 * s, 0], [0, 1.15 * s]], { wash: CAP, washOp: 255, fill: PAL.indigo, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
    inkLine([[-2.8 * s, -.35 * s], [-.4 * s, -.95 * s]], sw * .9, '#4A4870', 'inkfine', 0);            // sheen
    const sway = (o.tassel || 0) + Math.sin(T * 5 + seed) * .12, tx = 3.1 * s, ty = .35 * s, bx = tx + Math.sin(sway) * 2.2 * s, by = ty + Math.cos(sway) * 2.2 * s;
    inkLine([[0, 0], [1.6 * s, .1 * s], [tx, ty]], sw * 1.1, PAL.ochre, 'ink', .4);
    inkLine([[tx, ty], [bx, by]], sw * 1.1, PAL.ochre, 'ink', 0);
    push(); translate(bx, by); rotate(-sway);
    paint([[-.3 * s, 0], [.3 * s, 0], [.55 * s, 1.5 * s], [-.55 * s, 1.5 * s]], { wash: PAL.ochre, washOp: 255, fill: PAL.clay, fillOp: 50, ink: PAL.ink, sw: sw * .6 });
    pop();
    paint(ellPts(0, 0, .45 * s, .3 * s, 10), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .5 });
    pop();
    pop();
  }
  // the pointer stick, for a paw hook: wooden, tapering, chalk-white tip
  const pointer = (len = 9, ang = 0) => (s, sw) => {
    push(); rotate(-ang);
    paint([[-.6 * s, -.17 * s], [len * s, -.07 * s], [len * s, .07 * s], [-.6 * s, .17 * s]], { wash: WOOD_DK, washOp: 255, ink: PAL.ink, sw: sw * .5 });
    paint([[(len - .8) * s, -.09 * s], [(len + .1) * s, -.07 * s], [(len + .1) * s, .07 * s], [(len - .8) * s, .09 * s]], { wash: CHALK, washOp: 255, ink: null });
    pop();
  };

  // ---------------- the hall ----------------
  function hall(t, o = {}) {
    paint(rectPts(-800, -600, W + 1600, 2400), { wash: WALL, washOp: 255, fill: PAL.ochre, fillOp: 50, bleed: .2, tex: .5, ink: null });
    // wood wainscot and the stage floor
    paint(rectPts(-800, 640, W + 1600, 240, 2), { wash: WOOD_LT, washOp: 255, fill: WOOD, fillOp: 70, tex: .6, ink: PAL.ink, sw: .9 });
    for (let x = -800; x < W + 800; x += 160) paint(rrPts(x + 14, 660, 132, 196, 10, 1), { fill: WOOD_DK, fillOp: 50, bleed: .05, tex: .5, ink: PAL.ink, sw: .5 });
    paint(rectPts(-800, 870, W + 1600, 900, 2), { wash: WOOD, washOp: 255, fill: WOOD_DK, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 7; i++) inkLine([[-800, 900 + i * i * 9], [W + 800, 900 + i * i * 9]], .6, WOOD_DK, 'inkfine', 0);
    // tall windows with warm light at the far ends
    for (const wx of [-520, 2220]) {
      paint(rrPts(wx, 60, 300, 520, 140, 2), { wash: '#F7E7B8', washOp: 255, fill: PAL.ochre, fillOp: 60, bleed: .2, ink: PAL.ink, sw: 1.2 });
      inkLine([[wx + 150, 70], [wx + 150, 580]], 1.2, WOOD_DK, 'ink', 0); inkLine([[wx, 320], [wx + 300, 320]], 1.2, WOOD_DK, 'ink', 0);
    }
  }
  // the chalkboard: slate in a wooden frame, a faint log-log grid, chalk scribbles and the straight line
  function board(x, y, w, h, t, o = {}) {
    paint(rectPts(x - 26, y - 26, w + 52, h + 52, 2), { wash: WOOD, washOp: 255, fill: WOOD_DK, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.3 });
    paint(rectPts(x, y, w, h, 2), { wash: SLATE, washOp: 255, fill: SLATE_DK, fillOp: 90, bleed: .2, tex: .8, border: .5, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 5; i++) paint(ellPts(x + w * (.15 + .18 * i), y + h * (.3 + .4 * hash(i + 4)), 160, 50, 16, 4, .2), { fill: CHALK_DIM, fillOp: 35, bleed: .3, ink: null });  // old smudges
    if (o.grid !== false) {
      for (let d = 0; d < 3; d++) for (let k = 1; k < 10; k++) {
        const f = (d + Math.log10(k)) / 3, gx = x + 40 + f * (w - 80), gy = y + h - 40 - f * (h - 80);
        inkLine([[gx, y + 30], [gx, y + h - 30]], k === 1 ? .7 : .35, CHALK_DIM, 'inkfine', 0);
        inkLine([[x + 30, gy], [x + w - 30, gy]], k === 1 ? .7 : .35, CHALK_DIM, 'inkfine', 0);
      }
      inkLine([[x + 40, y + 30], [x + 40, y + h - 40], [x + w - 30, y + h - 40]], 1.6, CHALK, 'charcoal', 0);   // axes
    }
    // chalk ledge
    paint(rectPts(x - 30, y + h + 18, w + 60, 18, 1), { wash: WOOD_DK, washOp: 255, ink: PAL.ink, sw: .8 });
    for (const cx of [x + 80, x + 130, x + w - 160]) paint(rectPts(cx, y + h + 10, 34, 9, 1), { wash: CHALK, ink: PAL.ink, sw: .4 });
  }
  // a student seen from behind: a clay block with a hard hat or the cream coat
  function student(x, y, u, coat, bob, sw = clamp(u / 15, .45, 2.4)) {
    push(); translate(x, y - bob * u);
    for (const s of [-1, 1]) paint(rectPts(s * 5.3 * u - (s > 0 ? 1.4 * u : 0), -5.4 * u, 1.4 * u, 2.4 * u, u * .05), { wash: PAL.clayDk, washOp: 255, ink: PAL.ink, sw: sw * .7 });
    paint(rectPts(-5 * u, -8 * u, 10 * u, 8.5 * u, u * .06), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 60, tex: .5, ink: PAL.ink, sw });
    if (coat) { paint(rectPts(-5.15 * u, -3.7 * u, 10.3 * u, 4.4 * u, u * .05), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .7 }); inkLine([[0, -3.7 * u], [0, .5 * u]], sw * .6, PAL.ink, 'inkfine', 0); }
    else HARD(u, sw);
    pop();
  }
  function audience(t, y0 = 940) {
    const rows = [{ y: y0, u: 13, n: 9, dx: 230, off: 60 }, { y: y0 + 130, u: 17, n: 7, dx: 300, off: -40 }];
    rows.forEach((r, ri) => {
      for (let i = 0; i < r.n; i++) {
        const x = 960 + r.off + (i - (r.n - 1) / 2) * r.dx, bob = .35 * pulse(t, 7) * (1 + hash(i + ri * 9) * .5) + .15 * Math.sin(t * 2 + i);
        student(x, r.y, r.u, (i + ri) % 2 === 1, bob);
      }
      paint(rectPts(-400, r.y - 2 * r.u, W + 800, 4 * r.u, 2), { wash: WOOD_DK, washOp: 255, fill: PAL.ink, fillOp: 40, tex: .5, ink: PAL.ink, sw: 1 });   // desk row
    });
  }
  const chalkPuff = (x, y, age, r = 40) => {
    if (age < 0 || age > .5) return; const k = easeOut(age / .5);
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .4; paint(ellPts(x + Math.cos(a) * r * k, y + Math.sin(a) * r * k, 9 + 10 * k, 9 + 10 * k, 10, 1), { fill: CHALK, fillOp: 160 * (1 - k), bleed: .3, ink: null }); }
  };

  // ---------------- 97.55 - 103.8: the professor waddles to the podium, fixes its hat, taps the board ----------------
  const ARRIVE = bt(214), FIX = bt(215), TAPS = [bt(217), bt(218), bt(219), bt(220), bt(221)];
  function lecture(t, lt) {
    const z = lerp(1, 1.12, ease(seg(t, 97.55, 103.8))), [sx, sy] = shakeXY(t, 1.5 * pulse(t, 9));
    camBegin(lerp(960, 1080, ease(seg(t, 97.55, 103.8))) + sx, 520 + sy, z);
    hall(t);
    board(240, 110, 1180, 470, t);
    // the line on the board, already drawn; each tap makes a chalk dot pop on it
    inkLine([[290, 540], [1380, 150]], 5, PAL.clay, 'ink', 0);
    const tapAt = i => { const px = 1180 + i * 40; return [px, 540 - (px - 290) * 390 / 1090]; };
    TAPS.forEach((tp, i) => { const age = t - tp, [px, py] = tapAt(i);
      if (age >= 0) paint(ellPts(px, py, 13 * backOut(age / .2), 13 * backOut(age / .2), 12, 1), { wash: CHALK, ink: PAL.ink, sw: .6 }); chalkPuff(px, py, age); });
    // waddle in from the right; one step per beat
    const walkK = seg(t, 97.55, ARRIVE), x = lerp(2050, 1640, easeOut(walkK * 1.05)), walking = walkK < 1;
    const bp = bpOf(t), step = Math.abs(Math.sin(bp * Math.PI));
    // hat: crooked from the walk, then the pointer nudges it straight with a boing
    const fixAge = t - FIX, tilt = fixAge < 0 ? .32 : .32 * (1 - elasticOut(fixAge / .6)), lift = fixAge > 0 && fixAge < .4 ? Math.sin(fixAge / .4 * Math.PI) * 1.4 : 0;
    // arm: hangs, raises to nudge the hat, then taps (the arm snaps up to the board on each beat)
    let aR = -.6, ptrA = 0, ptrL = 9;
    if (fixAge > -.25 && fixAge < .55) { const k = ease(seg(fixAge, -.25, 0)) * (1 - ease(seg(fixAge, .25, .55))); aR = lerp(-.6, 1.5, k); ptrA = lerp(0, .55, k); ptrL = lerp(9, 6.5, k); }
    if (t > TAPS[0] - .3) {                                       // aim the stick so its tip lands on the next chalk dot, on the beat
      let i = 0; while (i < 4 && t >= TAPS[i + 1] - .3) i++;
      const hit = Math.exp(-frac(bpOf(t)) * 9), s = 33; aR = .85;
      const pv = [x - 3.4 * s, 900 - 6.7 * s], paw = [pv[0] - 2.35 * s * Math.cos(aR), pv[1] - 2.35 * s * Math.sin(aR)], [tx, ty] = tapAt(i);
      ptrA = Math.atan2(paw[1] - ty, paw[0] - tx) - aR + (1 - hit) * .06; ptrL = Math.hypot(paw[0] - tx, paw[1] - ty) / s * (1 - .08 * (1 - hit));
    }
    const em = mood(t, [[0, 'normal'], [FIX + .45, 'happy'], [TAPS[0] - .2, 'focus']]);
    chinchilla(x, 900, 33, { flip: true, walk: walking ? bp / 2 : null, dy: walking ? -step * .5 : 0, rot: walking ? Math.sin(bp * Math.PI) * .07 : 0,
      sq: walking ? .05 * pulse(t, 8) : 0, eyes: em.eyes, hatTilt: tilt, hatLift: lift, tassel: walking ? Math.sin(bp * Math.PI) * .5 : tilt,
      aR, aL: walking ? -.4 + .3 * Math.sin(bp * Math.PI) : -.3, pawR: pointer(ptrL, ptrA), seed: 1 });
    // the podium in front
    paint([[1500, 700], [1790, 700], [1760, 880], [1530, 880]], { wash: WOOD, washOp: 255, fill: WOOD_DK, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.3 });
    paint(rectPts(1480, 684, 330, 26, 2), { wash: WOOD_LT, washOp: 255, ink: PAL.ink, sw: 1.1 });
    paint(rrPts(1585, 740, 120, 70, 12, 1), { fill: WOOD_DK, fillOp: 70, ink: PAL.ink, sw: .7 });
    paint(ellPts(1645, 775, 22, 22, 14), { wash: PAL.ochre, ink: PAL.ink, sw: .7 });            // brass crest
    if (fixAge > 0 && fixAge < .6) sfx('boing', x + 40, 340, 50, PAL.cream, fixAge, { life: .6 });
    TAPS.forEach(tp => { if (t - tp >= 0 && t - tp < .35) sfx('tap', 1250 + 30 * hash(tp), 230, 44, CHALK, t - tp, { life: .35, rot: .1 }); });
    audience(t, 990);
    camEnd();
  }

  // ---------------- 103.8 - 108.4: the diet: a balance, a fat model and a plate of data ----------------
  // scoops 1-4 on the beat, then 16 frantic ones on sixteenths: 20 in all, the last as the beam levels
  const SC0 = bt(222), SC4 = bt(226), BAL = bt(230);
  const scoopTime = k => k < 4 ? SC0 + k * BEAT : SC4 + (k - 4) * BEAT / 4;
  const scoopsBy = t => { let n = 0; for (let k = 0; k < 20; k++) if (t >= scoopTime(k) + .08) n++; return n; };
  function token(x, y, r, rot, i) {
    push(); translate(x, y); rotate(rot);
    paint(rectPts(-r, -r * .75, 2 * r, 1.5 * r, r * .05), { wash: i % 3 ? PAL.cream : '#F6E2B8', washOp: 255, ink: PAL.ink, sw: .5 });
    inkLine([[-r * .6, -r * .2], [r * .6, -r * .2]], .5, i % 2 ? PAL.teal : PAL.clay, 'inkfine', 0);
    inkLine([[-r * .6, r * .25], [r * .3, r * .25]], .5, PAL.ink, 'inkfine', 0);
    pop();
  }
  function pile(x, y, n) {               // a mound of tokens on a plate, growing with n scoops
    paint(ellPts(x, y + 6, 92, 16, 20), { wash: PAL.cream, washOp: 255, fill: PAL.sky, fillOp: 50, ink: PAL.ink, sw: 1 });   // the plate
    if (n <= 0) { token(x, y - 4, 9, .2, 1); return; }
    const w = 40 + 5.2 * n, h = 12 + 9.5 * n;
    const m = []; for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; m.push([x + Math.cos(a) * w, y + Math.sin(a) * h]); }
    paint(m, { wash: '#F2DDB0', washOp: 255, fill: PAL.ochre, fillOp: 60, tex: .5, ink: PAL.ink, sw: .9, curv: .4 });
    const c = Math.min(46, 4 + n * 3);
    for (let i = 0; i < c; i++) {
      const a = Math.PI + (.08 + .84 * hash(i * 3.1)) * Math.PI, r = .35 + .6 * hash(i * 5.7);
      token(x + Math.cos(a) * w * r, y + Math.sin(a) * h * r, 9, hash(i) * 1.4 - .7, i);
    }
  }
  function balance(t, th, fat, n) {
    const P = [960, 300], L = 470, ends = [-1, 1].map(s => [P[0] + s * L * Math.cos(th), P[1] - s * L * Math.sin(th)]);
    // base and post
    paint([[860, 880], [1060, 880], [1010, 840], [910, 840]], { wash: WOOD_DK, washOp: 255, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(940, 300, 40, 545, 2), { wash: PAL.ochre, washOp: 255, fill: PAL.clayDk, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.1 });
    // pans hang under each end (strings stay vertical)
    ends.forEach(([ex, ey], i) => {
      const py = ey + 280;
      inkLine([[ex, ey], [ex - 150, py]], 1, PAL.ink, 'inkfine', 0); inkLine([[ex, ey], [ex + 150, py]], 1, PAL.ink, 'inkfine', 0);
      if (i === 0) fat(ex, py); else pile(ex, py - 4, n);
      const pan = []; for (let k = 0; k <= 12; k++) { const a = k / 12 * Math.PI; pan.push([ex + Math.cos(a) * 170, py + Math.sin(a) * 34]); }
      paint(pan, { wash: PAL.ochre, washOp: 255, fill: PAL.clayDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.2 });
      inkLine([[ex - 170, py], [ex + 170, py]], 1.6, PAL.clayDk, 'ink', 0);
    });
    // the beam and the pointer needle
    push(); translate(P[0], P[1]); rotate(-th);
    paint(rrPts(-L - 20, -14, 2 * L + 40, 28, 12, 1), { wash: PAL.ochre, washOp: 255, fill: PAL.clay, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.3 });
    paint([[-10, 0], [10, 0], [0, -130]], { wash: PAL.clayDk, washOp: 255, ink: PAL.ink, sw: .9 });
    pop();
    paint(ellPts(P[0], P[1], 24, 24, 14), { wash: PAL.clayDk, ink: PAL.ink, sw: 1 });
    // the dial behind the needle: centre mark
    inkLine([[P[0], P[1] - 150], [P[0], P[1] - 168]], 2, PAL.ink, 'ink', 0);
  }
  // the overfed model: puffy, with a napkin bib and a blush
  const bib = (u, sw) => {
    paint([[-2.6 * u, -3.9 * u], [2.6 * u, -3.9 * u], [0, -1.6 * u]], { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .6 });
    for (let i = 0; i < 3; i++) paint(ellPts((-1.2 + i * 1.2) * u, -3.4 * u + (i % 2) * .5 * u, .25 * u, .25 * u, 8), { wash: PAL.clay, ink: null });
  };
  function diet(t, lt) {
    const n = scoopsBy(t);
    const k = n / 20, wobble = n > 0 ? Math.sin((t - scoopTime(n - 1)) * 18) * Math.exp(-(t - scoopTime(n - 1)) * 5) * .03 : 0;
    const th = .3 * (1 - k) + wobble + (t > BAL ? Math.sin((t - BAL) * 14) * Math.exp(-(t - BAL) * 4) * .03 : 0);
    const [sx, sy] = shakeXY(t, 1.2 * pulse(t, 9));
    camBegin(960 + sx, 520 + sy, lerp(1.04, 1, ease(lt / 4.6)));
    hall(t);
    board(140, 70, 1640, 470, t, { grid: false });
    letter('20 : 1', 1300, 170, 100, CHALK, { ink: false, pop: seg(t, BAL, BAL + .25) * 1.2, rot: -.04 });
    const balanced = t > BAL - .05;
    balance(t, th, (x, y) => {
      const pf = 1 + .03 * Math.sin(t * 6);                                  // the puff: a bulging belly behind the box
      paint(fluff(x, y - 5 * 24 * 1.08, 6.5 * 24 * 1.5 * pf, 3.4 * 24 * 1.08 * pf, 30, .02, 9), { wash: '#E2825F', washOp: 255, fill: PAL.clayDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.4, curv: .5 });
      clawd(x, y, 24, { sx: 1.5, sy: 1.08, blush: true, eyes: balanced ? 'happy' : 'closed', mouth: balanced ? 'smile' : 'cat', draw: bib,
        sq: .04 * pulse(t, 7), aL: -.2 + .2 * Math.sin(t * 3), aR: .1, noShadow: true, col: '#E2825F' });
    }, n);
    // the professor scoops from a sack: arm low in the sack, high over the plate, tip at the scoop time
    const panX = 960 + 470 * Math.cos(th), panY = 300 - 470 * Math.sin(th) + 280;
    let ph;    // 0 at the sack .. 1 over the plate .. tip
    { let kk = 0; while (kk < 19 && t >= scoopTime(kk + 1) - (kk + 1 < 4 ? .3 : .06)) kk++;
      const tt = scoopTime(kk), span = kk < 4 ? .3 : .06, d = t - (tt - span);
      ph = d < 0 ? 0 : d < span ? ease(d / span) : 1 - ease(clamp((d - span) / (kk < 4 ? .18 : .05))); }
    if (t < SC0 - .3) ph = 0;
    paint([[1280, 880], [1240, 760], [1290, 700], [1410, 705], [1450, 770], [1420, 880]], { wash: '#C9A36A', washOp: 255, fill: WOOD_DK, fillOp: 60, tex: .7, ink: PAL.ink, sw: 1.1, curv: .4 });  // sack
    for (let i = 0; i < 5; i++) token(1290 + i * 26, 712 + 6 * hash(i), 10, hash(i + 3) - .5, i);
    const frantic = t > SC4 - .1 && t < BAL;
    chinchilla(1690, 880, 26, { flip: true, eyes: frantic ? 'focus' : balanced ? 'happy' : 'normal', aR: lerp(-.55, 1.0, ph), aL: frantic ? .4 + .5 * Math.sin(t * 40) : -.3,
      dy: -.4 * pulse(t, 8), sq: .06 * pulse(t, 8), tassel: Math.sin(t * 12) * (frantic ? .6 : .2), earWig: frantic ? Math.sin(t * 30) : 0, mouth: balanced ? 'O' : null, seed: 2,
      pawR: (s, sw) => {                                                     // a long-handled scoop
        push(); rotate(-lerp(.25, 0, ph));
        paint([[-.4 * s, -.18 * s], [7.3 * s, -.12 * s], [7.3 * s, .12 * s], [-.4 * s, .18 * s]], { wash: WOOD_DK, washOp: 255, ink: PAL.ink, sw: sw * .5 });
        const cup = []; for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI; cup.push([8.4 * s + Math.cos(a) * 1.4 * s, Math.sin(a) * 1.1 * s]); }
        paint(cup, { wash: '#C9CED8', washOp: 255, fill: PAL.indigo, fillOp: 40, ink: PAL.ink, sw: sw * .7 });
        if (ph > .2 && ph < .98) token(8.4 * s, -.4 * s, .45 * s, .3, 2);
        pop();
      } });
    if (frantic) for (let i = 0; i < 6; i++) {                               // a stream of tokens in the air
      const q = frac(t * 4.2 + i / 6), x = lerp(1440, panX, q), y = lerp(640, panY - 60, q) - Math.sin(q * Math.PI) * 160;
      token(x, y, 10, q * 6 + i, i);
    }
    // the tally: one chalk number per scoop
    if (n > 0 && t < BAL) letter('×' + n, panX + 20, panY - 170 - 9 * n, 54 + n, CHALK, { pop: clamp((t - scoopTime(n - 1)) * 8) + .3, rot: .06 });
    if (t >= BAL && t < BAL + .7) sfx('DING!', 640, 220, 90, PAL.ochre, t - BAL, { life: .7 });
    camEnd();
  }

  // ---------------- 108.4 - 112.0: the abacus, the tail sweep, and Clawd starts thinking ----------------
  const LEAP = bt(235), LAND = bt(236) + .12, NEW = bt(237);
  function abacus(t, x, y, fast) {
    paint(rectPts(x, y, 520, 380, 2), { wash: WOOD, washOp: 255, fill: WOOD_DK, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.4 });
    paint(rectPts(x + 26, y + 26, 468, 328, 1), { wash: '#F1DDB0', washOp: 255, fill: PAL.ochre, fillOp: 40, ink: PAL.ink, sw: 1 });
    paint(rectPts(x + 26, y + 110, 468, 14, 0), { wash: WOOD_DK, washOp: 255, ink: PAL.ink, sw: .6 });     // the bar
    for (const lx of [x + 40, x + 460]) paint(rectPts(lx, y + 380, 22, 120, 1), { wash: WOOD_DK, washOp: 255, ink: PAL.ink, sw: 1 });
    const f = Math.floor(t * 24);
    for (let r = 0; r < 7; r++) {
      const rx = x + 70 + r * 63; inkLine([[rx, y + 28], [rx, y + 352]], 1.4, WOOD_DK, 'ink', 0);
      for (let b = 0; b < 6; b++) {
        const top = b < 1, lo = top ? y + 40 : y + 140, hi = top ? y + 96 : y + 330, slot = top ? 0 : b - 1;
        const up = fast ? hash(f * 13.1 + r * 7 + b) > .5 : (b + r) % 3 === 0;
        const by = top ? (up ? lo + 10 : hi - 10) : (up ? lo + 14 + slot * 34 : hi - 14 - (4 - slot) * 34);
        const col = [PAL.clay, PAL.ochre, PAL.teal, PAL.rose][(r + b) % 4];
        if (fast) paint(ellPts(rx, by + (up ? 14 : -14), 26, 22, 14), { fill: col, fillOp: 70, bleed: .2, ink: null });   // motion smear
        paint(ellPts(rx, by, 26, 15, 16), { wash: col, washOp: 255, ink: PAL.ink, sw: .8 });
      }
    }
  }
  const OLD = ['D', ':', 'N', '=', '1', '.', '7'];
  function sweep(t, lt) {
    const [sx, sy] = shakeXY(t, 1.5 * pulse(t, 9) + (t > LAND && t < LAND + .25 ? 8 : 0));
    camBegin(980 + sx, 520 + sy, lerp(1.1, 1.0, ease(lt / 3.6)));
    hall(t);
    board(150, 70, 1620, 520, t, { grid: false });
    // the professor: at the abacus, then a leap to the left with the tail out straight, wiping the board
    const lk = seg(t, LEAP, LAND), leaping = lk > 0 && lk < 1;
    const cx = t < LEAP ? 1390 : t < LAND ? lerp(1390, 330, ease(lk)) : 330;
    const cy = t < LEAP ? 880 : t < LAND ? 880 - Math.sin(lk * Math.PI) * 400 : 880;
    // the old ratio: each letter is wiped as the tail passes over it; a chalk smear trails behind
    OLD.forEach((c, i) => { const lx = 720 + i * 80; if (!(t > LEAP && cx + 140 < lx) || t < LEAP) letter(c, lx, 250, 120, CHALK, { ink: false, rot: -.03 }); });
    if (t > LEAP) {
      const x0 = Math.max(cx + 120, 640), x1 = 1300;
      if (x1 > x0) paint([[x0, 180], [x1, 190], [x1 + 20, 320], [x0, 310]], { fill: CHALK_DIM, fillOp: 90, bleed: .3, tex: .7, ink: null, hatch: { d: 14, a: .1, o: { rand: .4 }, b: 'charcoal', c: CHALK_DIM, w: .7 } });
    }
    if (t > NEW) letter('20 : 1', 1010, 260, 150, CHALK, { ink: false, pop: seg(t, NEW, NEW + .3), rot: -.04 });
    flushLetters();                                              // the chalk sits on the board, under the leaping professor
    abacus(t, 770, 470, t < LEAP);
    const fast = t < LEAP;
    chinchilla(cx, cy, 24, { flip: t < LEAP ? true : t < LAND, rot: leaping ? -.35 * (1 - lk * 2) : 0, sq: leaping ? -.12 : .05 * pulse(t, 8),
      tailA: leaping ? Math.PI - .15 : undefined, tailCurl: leaping ? .02 : undefined, tailLen: leaping ? 2.4 : 1,
      eyes: fast ? 'focus' : t > NEW ? 'happy' : 'wide', aR: fast ? .9 + .5 * Math.sin(t * 47) : leaping ? 1.3 : -.4, aL: fast ? .9 + .5 * Math.sin(t * 53 + 1) : leaping ? 1.3 : -.3,
      earWig: fast ? Math.sin(t * 40) : 0, tassel: leaping ? 1.2 : Math.sin(t * 20) * .4, hatTilt: leaping ? .25 : 0, seed: 3 });
    if (fast) for (let i = 0; i < 6; i++) { const a = -2.4 + i * .3; inkLine([[1390 + Math.cos(a) * 250, 650 + Math.sin(a) * 250], [1390 + Math.cos(a) * 320, 650 + Math.sin(a) * 320]], 2, PAL.ink, 'ink', 0); }   // busy lines
    if (fast) sfx('clackclackclack', 1030, 420, 46, PAL.clayDk, (t - 108.4) % .8, { life: .8, rot: -.05 });
    if (t > LEAP && t < LEAP + .6) sfx('SWISH!', 900, 400, 90, PAL.cream, t - LEAP, { life: .6 });
    // Clawd in the front row starts thinking
    const thinkK = seg(t, 111.2, 111.5);
    clawd(1730, 960, 21, { draw: HARD, eyes: thinkK > 0 ? 'look' : 'happy', lookX: -.6, lookY: -1, mouth: thinkK > 0 ? 'flat' : 'smile', aL: thinkK > 0 ? 1.1 : .2, aR: .1, dy: -.3 * pulse(t, 8), noShadow: true,
      armL: (u, sw) => { if (thinkK > 0) paint(ellPts(0, 0, .7 * u, .7 * u, 10), { wash: PAL.clay, ink: PAL.ink, sw: sw * .6 }); } });
    [[1640, 700, 12, 111.4], [1590, 640, 18, 111.6], [1520, 565, 26, 111.8]].forEach(([bx, by, r, tb]) => {
      const k = backOut(seg(t, tb, tb + .18)); if (k > .02) paint(ellPts(bx, by, r * k, r * k, 14, 1), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: 1 }); });
    camEnd();
  }

  // ---------------- 112.0 - 116.0: thinking longer, the page creaks, a third axis pops up ----------------
  // the page lies flat in perspective; uv in [0,1]^2 (u right along the front edge, v into the depth)
  const PG = { FL: [60, 900], FR: [1860, 900], BL: [430, 400], BR: [1490, 400] };
  const pg = (u, v) => { const vv = v * 1.25 / (1 + .25 * v);             // a little foreshortening into the depth
    return [lerp(lerp(PG.FL[0], PG.FR[0], u), lerp(PG.BL[0], PG.BR[0], u), vv), lerp(PG.FL[1], PG.BL[1], vv)]; };
  const POP = bt(245), CREAK = bt(244);
  function think(t, lt) {
    const creak = t > CREAK && t < POP ? 1 : 0, [sx, sy] = shakeXY(t, 1.2 * pulse(t, 9) + creak * 4 + (t > POP && t < POP + .2 ? 10 : 0));
    const up = ease(seg(t, POP + .3, 116));
    const pan = ease(seg(t, POP, POP + .6));
    camBegin(lerp(980, 760, pan) + sx, lerp(560, 470, up) + sy, lerp(1.05, .9, ease(lt / 4)) * lerp(1, .9, pan));
    // a desk under the page
    paint(rectPts(-600, -600, W + 1200, 2400), { wash: '#3B4F45', washOp: 255, fill: SLATE_DK, fillOp: 90, bleed: .2, tex: .6, ink: null });
    paint([[-600, 1200], [-600, 330], [W + 600, 330], [W + 600, 1200]], { wash: WOOD, washOp: 255, fill: WOOD_DK, fillOp: 60, tex: .6, ink: null });
    for (let i = 0; i < 6; i++) inkLine([[-600, 360 + i * i * 22], [W + 600, 360 + i * i * 22]], .6, WOOD_DK, 'inkfine', 0);
    // the page: cream, a log-log grid in teal, axes and the clay line
    const bend = creak ? Math.sin(t * 60) * 4 : 0;
    paint([PG.FL, PG.FR, [PG.BR[0], PG.BR[1] + bend], [PG.BL[0], PG.BL[1] - bend]], { wash: PAL.cream, washOp: 255, fill: PAL.paper, fillOp: 80, tex: .4, ink: PAL.ink, sw: 1.3 });
    for (let d = 0; d < 3; d++) for (let k = 1; k < 10; k++) {
      const f = .06 + .9 * (d + Math.log10(k)) / 3, wgt = k === 1 ? .9 : .4, col = mixCol(PAL.teal, PAL.cream, k === 1 ? .1 : .5);
      inkLine([pg(f, .02), pg(f, .98)], wgt, col, 'inkfine', 0); inkLine([pg(.02, f), pg(.98, f)], wgt, col, 'inkfine', 0);
    }
    inkLine([pg(.06, .06), pg(.97, .06)], 2, PAL.ink, 'ink', 0); inkLine([pg(.06, .06), pg(.06, .97)], 2, PAL.ink, 'ink', 0);
    inkLine([pg(.08, .1), pg(.95, .92)], 6, PAL.clay, 'ink', 0);
    if (creak) { sfx('CREAK', 700, 330, 70, PAL.clayDk, t - CREAK, { life: POP - CREAK + .1, rot: .08 });
      for (let i = 0; i < 3; i++) inkLine([pg(.06 + i * .02, .1), pg(.07 + i * .02, .5)], .8, PAL.ink, 'inkfine', .3); }
    // the pop-up: a grid panel folds up along the left edge, its front edge is the new axis
    const pk = t < POP ? 0 : backOut(seg(t, POP, POP + .35)), O = pg(.06, .06), B = pg(.06, .97), Hh = 500 * pk;
    if (pk > .01) {
      const lean = (1 - clamp(pk)) * 160;
      paint([O, B, [B[0] - lean * .6, B[1] - Hh * .9], [O[0] - lean, O[1] - Hh]], { wash: '#F6EBD2', washOp: 255, fill: PAL.ochre, fillOp: 40, tex: .4, ink: PAL.ink, sw: 1.1 });
      for (let k = 1; k < 6; k++) { const q = k / 6; inkLine([[lerp(O[0] - lean, O[0], 0) + (B[0] - O[0]) * 0, O[1] - Hh * q], [B[0] - lean * .6 * q, B[1] - Hh * .9 * q]], .5, mixCol(PAL.teal, PAL.cream, .4), 'inkfine', 0); }
      for (let k = 1; k < 5; k++) { const q = k / 5, a = [lerp(O[0], B[0], q), lerp(O[1], B[1], q)]; inkLine([a, [a[0] - lean * lerp(1, .6, q), a[1] - Hh * lerp(1, .9, q)]], .5, mixCol(PAL.teal, PAL.cream, .4), 'inkfine', 0); }
      // the third axis: a thick arrow, filled so it holds up
      const top = [O[0] - lean, O[1] - 840 * pk];
      paint([[O[0] - 10, O[1]], [O[0] + 10, O[1]], [top[0] + 10, top[1] + 60], [top[0] - 10, top[1] + 60]], { wash: PAL.ink, washOp: 255, ink: null });
      paint([[top[0], top[1]], [top[0] + 38, top[1] + 75], [top[0] - 38, top[1] + 75]], { wash: PAL.ink, washOp: 255, ink: null });
      for (let k = 1; k < 6; k++) paint(rectPts(lerp(O[0], top[0], k / 6) - 24, lerp(O[1], top[1] + 60, k / 6) - 3, 48, 7, 0), { wash: PAL.ink, ink: null });
      if (t < POP + .6) sfx('POP!', O[0] + 200, O[1] - 520, 90, PAL.clay, t - POP, { life: .6 });
    }
    // Clawd sits on the page and thinks; the thought bubble stretches longer each beat, then becomes the axis
    const climb = seg(t, POP + .4, 116), grow = clamp((Math.floor((t - bt(239)) / BEAT) + 1 + easeOut(frac((t - bt(239)) / BEAT) * 3)) / 5);
    const cxy = pg(.24, .3), cxClimb = O[0] + 116, cyClimb = lerp(O[1] - 20, O[1] - 380, ease(climb));
    if (t < POP + .4) {
      const m = mood(t, [[0, 'look'], [CREAK, 'scared', '!']]);
      clawd(cxy[0], cxy[1], 26, { draw: HARD, ...m, lookX: .7, lookY: -1, mouth: t > CREAK ? 'o' : 'flat', aR: 1.0, aL: -.1, dy: -.25 * pulse(t, 8), sq: .04 * pulse(t, 8) });
      const pop = t > POP ? 1 - seg(t, POP, POP + .2) : 1;
      if (pop > .02) {
        const hx = cxy[0] + 150, hy = cxy[1] - 300;
        [[cxy[0] + 80, cxy[1] - 230, 12], [cxy[0] + 120, cxy[1] - 270, 18]].forEach(([bx, by, r]) => paint(ellPts(bx, by, r * pop, r * pop, 12, 1), { wash: PAL.cream, ink: PAL.ink, sw: 1 }));
        const len = lerp(160, 1300, grow) * pop, bh = 130 * pop;
        paint(rrPts(hx, hy - bh, len, bh * 2, bh * .95, 3), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: 1.4 });
        // inside: a chain of thoughts, one more dot-and-arrow per beat
        const nIdeas = Math.floor(len / 150);
        for (let i = 0; i < nIdeas; i++) {
          const ix = hx + 90 + i * 150, iy = hy + Math.sin(i * 1.7) * 18;
          paint(ellPts(ix, iy, 22 * pop, 22 * pop, 12, 1), { wash: [PAL.teal, PAL.ochre, PAL.clay][i % 3], ink: PAL.ink, sw: .8 });
          if (i < nIdeas - 1) inkLine([[ix + 30, iy], [ix + 120, hy + Math.sin((i + 1) * 1.7) * 18]], 1.2, PAL.ink, 'ink', 0);
        }
      }
    } else {
      const m = move('walk', t, 0);
      clawd(cxClimb, cyClimb, 22, { draw: HARD, eyes: 'happy', mouth: 'grin', walk: t * 3, aL: 1.6 + .5 * Math.sin(t * 14), aR: 1.6 - .5 * Math.sin(t * 14), rot: -.08, noShadow: climb > .05 });
    }
    camEnd();
  }

  // ---------------- 116.0 - 119.2: every line becomes a track; the lab rides off the edge of the board ----------------
  const RIDE0 = bt(248), EDGE = 118.62;
  const A = [380, 840], B = [1820, 200];                  // the line, board coords: it runs right off the top-right corner
  const ANG = Math.atan2(B[1] - A[1], B[0] - A[0]);
  const along = (k, off = 0) => [lerp(A[0], B[0], k) - Math.sin(ANG) * off, lerp(A[1], B[1], k) + Math.cos(ANG) * off];
  // a chalk line turning into a coaster track: ties march along it, then the two rails run out over them
  function track(p0, p1, t0, t, main = false) {
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), a = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), c = Math.cos(a), sn = Math.sin(a), nx = -sn, ny = c;
    const k = seg(t, t0, t0 + .6), kr = seg(t, t0 + .25, t0 + .8), n = Math.floor(len / 40), w = main ? 28 : 18, g = main ? 17 : 11;
    if (main) inkLine([p0, p1], 7, PAL.clay, 'ink', 0); else inkLine([p0, p1], 1.6, CHALK, 'inkfine', 0);
    for (let i = 0; i <= n * k; i++) {
      const q = i / n, x = lerp(p0[0], p1[0], q), y = lerp(p0[1], p1[1], q);
      paint([[x + nx * w - c * 4, y + ny * w - sn * 4], [x + nx * w + c * 4, y + ny * w + sn * 4], [x - nx * w + c * 4, y - ny * w + sn * 4], [x - nx * w - c * 4, y - ny * w - sn * 4]],
        { wash: main ? WOOD_DK : CHALK, washOp: main ? 255 : 200, ink: null });
    }
    if (kr > 0) for (const sd of [-1, 1]) { const e = [lerp(p0[0], p1[0], kr), lerp(p0[1], p1[1], kr)], o = g * sd;
      inkLine([[p0[0] + nx * o, p0[1] + ny * o], [e[0] + nx * o, e[1] + ny * o]], main ? 2.4 : 1.4, main ? '#8C93A3' : CHALK, main ? 'ink' : 'inkfine', 0); }
  }
  function cart(x, y, a, t) {
    push(); translate(x, y); rotate(a);
    const riders = [[-185, labCoat], [-65, HARD], [55, labCoat], [185, HARD_LAMP]];
    riders.forEach(([rx, hat], i) => {
      const m = move('roof', t + i * .05, i);
      clawd(rx, -30, i === 3 ? 18 : 13.5, { noLegs: true, noShadow: true, draw: hat, aL: 1.3 + .3 * Math.sin(t * 12 + i), aR: 1.3 + .3 * Math.sin(t * 12 + i + 1),
        eyes: i === 3 ? 'spark' : 'happy', mouth: 'O', dy: -.3 * Math.abs(Math.sin(t * 9 + i)) });
    });
    paint(rrPts(-265, -60, 530, 70, 22, 2), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.4 });
    paint(rectPts(-255, -55, 510, 12, 1), { wash: PAL.ochre, washOp: 255, ink: null });
    for (const wx of [-190, 190]) { paint(ellPts(wx, 14, 24, 24, 16), { wash: PAL.ink, ink: null }); paint(ellPts(wx, 14, 9, 9, 10), { wash: '#C9CED8', ink: null }); }
    pop();
  }
  function coaster(t, lt) {
    const ride = t < RIDE0 ? 0 : easeIn(seg(t, RIDE0, EDGE)) * .98, off = t > EDGE ? t - EDGE : 0;
    let [px, py] = along(ride);
    if (off > 0) { const v = 2400; px += Math.cos(ANG) * v * off; py += Math.sin(ANG) * v * off + 1800 * off * off; }
    const z = lerp(1.25, .74, ease(seg(t, 116, EDGE + .1))), [sx, sy] = shakeXY(t, 2 * pulse(t, 8) + 4 * seg(t, 117.5, EDGE));
    camBegin(lerp(lerp(700, 960, seg(t, 116, 117)), 960, ease(seg(t, 117, EDGE))) + sx, lerp(660, 520, ease(seg(t, 116, EDGE))) + sy, z);
    hall(t);
    board(140, 60, 1680, 940, t, { grid: false });
    // the other lines on the board turn into tracks one after another
    [[[220, 940], [1100, 300], 116.0], [[600, 960], [1780, 520], 116.2], [[220, 520], [900, 120], 116.35], [[1100, 960], [1780, 760], 116.5]].forEach(([p0, p1, t0]) => track(p0, p1, t0, t));
    track(A, B, 116.1, t, true);
    cart(px, py - 28, ANG, t);
    // the professor cheers from the board's corner
    chinchilla(1720, 1060, 15, { eyes: 'happy', aR: 1.5 + .4 * Math.sin(t * 9), aL: 1.2, pawR: pointer(8, 0), mouth: 'O', dy: -.6 * Math.abs(Math.sin(bpOf(t) * Math.PI)), seed: 4 });
    if (t > RIDE0 && t < RIDE0 + .8) sfx('WHEEE!', px - 100, py - 260, 70, PAL.ochre, t - RIDE0, { life: .8 });
    camEnd();
    // handoff: a megaphone noses in from the left and squeals; the light turns to dusk
    const mk = seg(t, 118.82, 119.0);
    if (mk > 0) {
      flash(.35 * seg(t, 118.8, 119.2), PAL.rose);
      const mx = lerp(-420, 0, backOut(mk)), my = 560;
      paint([[mx - 200, my - 40], [mx + 280, my - 190], [mx + 280, my + 190], [mx - 200, my + 40]], { wash: PAL.cream, washOp: 255, fill: PAL.ochre, fillOp: 40, tex: .4, ink: PAL.ink, sw: 1.6 });
      paint(ellPts(mx + 280, my, 46, 190, 22), { wash: PAL.clay, washOp: 255, ink: PAL.ink, sw: 1.6 });
      paint(ellPts(mx + 285, my, 26, 150, 20), { wash: PAL.ink, washOp: 220, ink: null });
      for (let i = 0; i < 3; i++) { const r = 280 + i * 70; inkLine([[mx + r, my - 180 - i * 50], [mx + r + 40, my - 90 - i * 25], [mx + r, my], [mx + r + 40, my + 90 + i * 25], [mx + r, my + 180 + i * 50]], 2, PAL.clayDk, 'ink', 0); }
      sfx('SKREEEE!', 1000, 380, 130, PAL.rose, t - 118.85, { life: .5, rot: -.1, screen: true });
    }
  }

  chapter('chinchilla', 97.55, 119.2, [[97.55, lecture], [103.8, diet], [108.4, sweep], [112.0, think], [116.0, coaster]]);
})();
