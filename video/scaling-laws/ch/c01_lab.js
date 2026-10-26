// c01_lab.js: 30.07-37.57, bars 17-20. The kick lands. Out of chapter 0's cream flash: the choir stomps on every
// beat, dust jumps off the risers, and a giant log-log chart drops in behind them like a stage backdrop. Whip pan to
// the lead Clawd at a desk-sized chalkboard: it sharpens a ruler-long pencil on the beat, flips onto a ruler laid
// across the graph paper and rules the loss line corner to corner in one stroke (top left down to
// bottom right, riding it down), then the camera pushes into the paper.
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { NIGHT, GRID, STEEL, STEEL_DK, HARD, HARD_LAMP, labCoat } = SL;
  const WALL_GRID = mixCol(NIGHT, GRID, .45);
  const L10 = Math.log10;

  // ---------------- shared bits ----------------
  // log-log graph paper inside (x0, y0, w, h): nx decades across, ny decades up; decade lines heavier
  function logGrid(x0, y0, w, h, nx, ny, colMaj, colMin, wMaj = 1.1, wMin = .45) {
    for (let i = 0; i <= nx; i++) for (let k = 1; k <= (i === nx ? 1 : 9); k++) {
      const x = x0 + (i + L10(k)) * w / nx, maj = k === 1;
      inkLine([[x, y0], [x, y0 + h]], maj ? wMaj : wMin, maj ? colMaj : colMin, 'inkfine', 0);
    }
    for (let j = 0; j <= ny; j++) for (let k = 1; k <= (j === ny ? 1 : 9); k++) {
      const y = y0 + h - (j + L10(k)) * h / ny, maj = k === 1;
      inkLine([[x0, y], [x0 + w, y]], maj ? wMaj : wMin, maj ? colMaj : colMin, 'inkfine', 0);
    }
  }
  // the line as a filled band (stroke weights don't scale with the camera, and shot 2 ends in a big push)
  function band(a, b, hw, o = {}) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * hw, ny = dx / l * hw;
    paint([[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]], o);
  }
  function theLine(a, b, hw, glow, gw = 2.4) {
    if (glow > .02) band(a, b, hw * gw, { fill: PAL.ochre, fillOp: 90 * glow, bleed: .06, tex: .3, border: .1, ink: null });
    band(a, b, hw, { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 45, bleed: .04, tex: .5, ink: null });
  }
  // whip-pan smear, screen space: long horizontal streaks over a darkening wash
  function whip(k) {
    if (k < .02) return;
    flash(.45 * k, NIGHT);
    for (let i = 0; i < 16; i++) {
      const y = hash(i + 3) * H, h = 5 + 24 * hash(i + 11), x = -200 + 600 * hash(i + 7) - 400 * k;
      paint(rectPts(x, y, W + 400, h, 0), { fill: i % 3 ? PAL.cream : PAL.indigo, fillOp: 130 * k, bleed: .05, tex: .2, ink: null });
    }
  }

  // ---------------- 30.07 - 33.82: the choir stomps, the chart drops in ----------------
  const ROWS = [{ y: 600, u: 10, n: 11, dx: 140 }, { y: 760, u: 12.5, n: 9, dx: 170 }, { y: 930, u: 15, n: 7, dx: 215 }];
  const DROP0 = bt(65), DROP1 = bt(66);                    // the backdrop falls for a beat and lands on beat 66

  function backWall() {                                    // chapter 0's back wall, the grown line still on it
    paint(rectPts(-600, -600, W + 4200, H + 1200), { wash: NIGHT, washOp: 255, fill: PAL.indigo, fillOp: 60, bleed: .2, tex: .5, ink: null });
    for (let x = 0; x <= W + 2800; x += 96) inkLine([[x, -20], [x, 640]], .5, WALL_GRID, 'inkfine', 0);
    for (let y = 0; y <= 640; y += 96) inkLine([[-20, y], [W + 2800, y]], .5, WALL_GRID, 'inkfine', 0);
    inkLine([[120, 80], [1800, 560]], 5, PAL.clay, 'ink', 0);   // the loss line, falling left to right
  }
  // the backdrop chart, hung from a batten; oy = drop offset, r = swing
  const BD = { x: 110, y: 52, w: 1700, h: 570 };
  function backdrop(t, oy, r) {
    push(); translate(960, BD.y + oy); rotate(r); translate(-960, -BD.y);
    for (const rx of [330, 1590]) inkLine([[rx, -900], [rx, BD.y - 14]], 1.2, soft(PAL.ink, .5), 'inkfine', 0);   // fly lines
    paint(rectPts(BD.x + 8, BD.y + 10, BD.w, BD.h, 2), { fill: PAL.ink, fillOp: 120, bleed: .1, ink: null });      // drop shadow on the wall
    paint(rectPts(BD.x, BD.y, BD.w, BD.h, 3), { wash: PAL.cream, washOp: 255, fill: PAL.paper, fillOp: 110, bleed: .1, tex: .6, ink: PAL.ink, sw: 1.4 });
    logGrid(BD.x + 30, BD.y + 26, BD.w - 60, BD.h - 52, 5, 3, mixCol(PAL.teal, PAL.cream, .1), mixCol(PAL.teal, PAL.cream, .5), 1.3, .5);
    const A = [BD.x + 60, BD.y + 50], B = [BD.x + BD.w - 60, BD.y + BD.h - 50];   // loss falls left to right
    theLine(A, B, 9, .5 + .5 * pulse(t, 5), 2);
    // a glint rides the line, one sweep per beat
    const f = frac(bpOf(t)), gx = lerp(A[0], B[0], f), gy = lerp(A[1], B[1], f);
    paint(ellPts(gx, gy, 40, 40, 18, 2), { fill: PAL.cream, fillOp: 140 * (1 - f), bleed: .3, ink: null });
    paint(starPts(gx, gy, 22 * (1 - f * .6), .3, 4), { wash: PAL.cream, washOp: 230, ink: null });
    // batten pipe with clamps, and a weighted hem along the bottom
    paint(rectPts(BD.x - 30, BD.y - 18, BD.w + 60, 20, 2), { wash: STEEL, washOp: 255, fill: STEEL_DK, fillOp: 60, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 6; i++) paint(rectPts(BD.x + 40 + i * 320, BD.y - 22, 26, 34, 2), { wash: STEEL_DK, washOp: 255, ink: PAL.ink, sw: .7 });
    pop();
  }
  function riserChoir(t) {
    const fall = t >= DROP0 - .1 && t < DROP1 + .05;           // heads tip up while the chart comes down
    ROWS.forEach((r, ri) => {
      paint(rectPts(-600, r.y, W + 4200, ri === 2 ? 600 : 170, 3), { wash: ri % 2 ? '#7C4A2C' : '#9A6440', washOp: 255, fill: PAL.ink, fillOp: 30, tex: .5, ink: PAL.ink, sw: 1 });
      for (let i = 0; i < r.n; i++) {
        const x = 960 + (i - (r.n - 1) / 2) * r.dx, coat = (i + ri) % 2 === 1;
        const m = move('stomp', t, 0), on = frac(bpOf(t)) < .45;
        clawd(x, r.y + 4, r.u, { ...m, draw: coat ? labCoat : HARD, noShadow: true,
          eyes: fall ? 'look' : on ? 'closed' : 'happy', lookY: -1, lookX: (x - 960) / -1400, mouth: fall ? 'o' : on ? 'O' : 'grin' });
      }
    });
  }
  // dust jumps off the riser boards on every stomp
  function dust(t) {
    const age = frac(bpOf(t)) * BEAT; if (age > .4) return;
    const k = age / .4;
    ROWS.forEach((r, ri) => {
      for (let i = 0; i < r.n; i++) {
        const x = 960 + (i - (r.n - 1) / 2) * r.dx, s = r.u / 12;
        for (const side of [-1, 1]) {
          const rr = (6 + 26 * easeOut(k)) * s;
          paint(ellPts(x + side * (5.5 * r.u + 14 * s * k), r.y + 2 - 22 * s * easeOut(k), rr, rr * .6, 12, 1), { wash: soft(PAL.ochre, .35), washOp: 170 * (1 - k), fill: PAL.cream, fillOp: 90 * (1 - k), bleed: .25, tex: .4, ink: null });
        }
      }
    });
  }
  // the big billow when the chart hits bottom behind the top riser
  function landDust(t) {
    const age = t - DROP1; if (age < 0 || age > .9) return;
    const k = age / .9;
    for (let i = 0; i < 9; i++) {
      const x = 180 + i * 195 + 40 * hash(i), rr = (50 + 90 * easeOut(k)) * (.8 + .4 * hash(i + 4));
      paint(ellPts(x, 590 - 70 * easeOut(k), rr, rr * .55, 16, 4), { fill: soft(PAL.ochre, .3), fillOp: 170 * (1 - k), bleed: .3, tex: .5, ink: null });
    }
  }
  function conductor(t, x, y, u, raise = 0) {               // chapter 0's lead Clawd, baton beating time
    const beatArm = .35 + .9 * Math.max(0, Math.sin(bpOf(t) * Math.PI));
    clawd(x, y, u, { draw: HARD_LAMP, eyes: 'happy', mouth: 'O', aR: lerp(beatArm, 1.9, raise), aL: lerp(.2, 1.2, raise), dy: -.4 * pulse(t, 8),
      armR: (uu, sw) => { inkLine([[0, 0], [3.4 * uu, -.4 * uu]], sw * 1.2, PAL.cream, 'ink', 0); paint(ellPts(3.5 * uu, -.42 * uu, .3 * uu, .3 * uu, 10), { wash: PAL.ochre, ink: null }); } });
  }

  function stomp(t, lt, dur) {
    const fallK = Math.pow(seg(t, DROP0, DROP1), 1.6), landAge = t - DROP1;
    const oy = landAge < 0 ? lerp(-760, 0, fallK) : -26 * Math.exp(-landAge * 7) * Math.abs(Math.sin(landAge * 20));
    const swing = landAge < 0 ? .015 : .02 * Math.exp(-landAge * 2.5) * Math.sin(landAge * 9);
    const wk = easeIn(seg(t, bt(71.4), bt(72)));               // whip pan out to the right
    const hit = landAge >= 0 && landAge < .5 ? 16 * Math.exp(-landAge * 8) : 0;
    const [sx, sy] = shakeXY(t, 3 + 5 * pulse(t, 8) + hit);
    const z = lerp(.96, .9, ease(seg(t, DROP1, bt(71.4)))) * (1 + .025 * pulse(t, 7));
    camBegin(960 + sx + 2600 * wk, lerp(600, 570, ease(seg(t, DROP1, bt(70)))) + sy, z);
    backWall();
    if (oy > -740) backdrop(t, oy, swing);
    [300, 760, 1160, 1620].forEach((x, i) => spotlight(x + 40 * wob(t, .25, i * .3), i % 2 ? PAL.cream : soft(PAL.ochre, .2), -60));
    landDust(t);
    riserChoir(t);
    dust(t);
    conductor(t, 300, 1130, 34, 1 - easeOut(seg(lt, 0, .12)));
    camEnd();
    if (landAge >= 0) sfx('THUD!', 1500, 200, 110, PAL.cream, landAge, { life: .9, rot: .07 });
    flash(1 - ease(seg(lt, 0, .3)), PAL.cream);                 // coming out of chapter 0's white-out
    whip(wk);
  }

  // ---------------- 33.82 - 37.57: the chalkboard: sharpen, flip, rule the line, push in ----------------
  const BOARD = { x: 620, y: 205, w: 1200, h: 650 }, PAPER = { x: 700, y: 262, w: 1040, h: 528 };
  const A = [740, 285], B = [1700, 760];                       // the loss line: upper left down to lower right
  const DX = B[0] - A[0], DY = B[1] - A[1], LEN = Math.hypot(DX, DY), D = [DX / LEN, DY / LEN], N = [D[1], -D[0]], ANG = Math.atan2(DY, DX);
  const at = (s, up = 0) => [A[0] + D[0] * s + N[0] * up, A[1] + D[1] * s + N[1] * up];   // point on the line, `up` px above it
  const RW = 54, RB = 11, U = 24, PEN = 15 * U, TIPX = 6 * U;           // ruler width, hero unit, pencil length, pencil tip ahead of the feet
  const GROUND = 880, X0 = 166;                                // where Clawd stands to sharpen
  const S0 = -TIPX, S1 = LEN - TIPX;                           // feet travel along the ruler while the tip runs A..B
  const GRIND0 = bt(77), GRIND1 = bt(78), PUSH0 = bt(78.5);

  function room(t) {
    paint(rectPts(-1400, -1400, W + 2800, H + 2800), { wash: NIGHT, washOp: 255, fill: PAL.indigo, fillOp: 60, bleed: .2, tex: .5, ink: null });
    for (let x = -960; x <= W + 960; x += 96) inkLine([[x, -400], [x, GROUND]], .5, WALL_GRID, 'inkfine', 0);
    for (let y = -384; y <= GROUND; y += 96) inkLine([[-1400, y], [W + 1400, y]], .5, WALL_GRID, 'inkfine', 0);
    paint(ellPts(1100, 470, 900, 520, 28, 8), { fill: PAL.ochre, fillOp: 30 + 35 * pulse(t, 5), bleed: .3, tex: .2, border: .05, ink: null });   // lamp pool, bumps with the kick
    paint(rectPts(-1400, GROUND, W + 2800, 900, 2), { wash: '#6A4128', washOp: 255, fill: PAL.ink, fillOp: 40, tex: .5, ink: PAL.ink, sw: 1.1 });
    for (let i = 0; i < 4; i++) inkLine([[-1400, GROUND + 40 + i * 52], [W + 1400, GROUND + 40 + i * 52]], .6, '#4A2C1C', 'inkfine', 0);
  }
  function board(t) {
    const { x, y, w, h } = BOARD;
    for (const lx of [x + 120, x + w - 120]) paint(rectPts(lx - 14, y + h - 10, 28, GROUND - y - h + 12, 1), { wash: '#7C4A2C', washOp: 255, ink: PAL.ink, sw: .9 });   // stand legs
    paint(rectPts(x - 6, y - 6, w + 12, h + 12, 2), { fill: PAL.ink, fillOp: 110, bleed: .1, ink: null });
    paint(rectPts(x, y, w, h, 2), { wash: '#9A6440', washOp: 255, fill: '#7C4A2C', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.3 });
    paint(rectPts(x + 22, y + 22, w - 44, h - 44, 2), { wash: '#2E4B3F', washOp: 255, fill: '#3E6152', fillOp: 70, bleed: .15, tex: .6, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 5; i++) paint(ellPts(x + 120 + i * 250, y + 70 + 470 * hash(i + 2), 120, 30, 14, 6, .2), { fill: PAL.cream, fillOp: 22, bleed: .3, tex: .7, ink: null });   // chalk smudges
    // chalk tray with three sticks
    paint(rectPts(x + 30, y + h - 6, w - 60, 18, 1), { wash: '#7C4A2C', washOp: 255, ink: PAL.ink, sw: .8 });
    [[x + 860, PAL.cream], [x + 920, PAL.rose], [x + 1010, PAL.cream]].forEach(([cx, c]) => paint(rrPts(cx, y + h - 16, 52, 12, 5), { wash: c, washOp: 255, ink: PAL.ink, sw: .5 }));
    // a little chalk arrow down and to the right in the margin, labelled "loss"
    inkLine([[x + 1124, y + 300], [x + 1160, y + 360]], 1.8, PAL.cream, 'dry', 0);
    inkLine([[x + 1142, y + 356], [x + 1160, y + 360], [x + 1162, y + 341]], 1.8, PAL.cream, 'dry', 0);
    letter('loss', x + 1140, y + 280, 22, PAL.cream, { ink: false, rot: -.1 });
    // the sheet of log-log paper, taped on
    const P = PAPER;
    paint(rectPts(P.x + 6, P.y + 8, P.w, P.h, 1), { fill: PAL.ink, fillOp: 90, bleed: .1, ink: null });
    paint(rectPts(P.x, P.y, P.w, P.h, 2), { wash: PAL.cream, washOp: 255, fill: PAL.paper, fillOp: 110, bleed: .1, tex: .6, ink: PAL.ink, sw: .9 });
    logGrid(P.x + 20, P.y + 18, P.w - 40, P.h - 36, 4, 2, mixCol(PAL.teal, PAL.cream, .05), mixCol(PAL.teal, PAL.cream, .5), 1.2, .5);
    for (const [tx, ty, r] of [[P.x, P.y, -.6], [P.x + P.w, P.y, .6], [P.x, P.y + P.h, .6], [P.x + P.w, P.y + P.h, -.6]])
      paint(ellPts(tx, ty, 36, 13, 4, 1, r).map(([px, py]) => [px, py]), { wash: soft(PAL.ochre, .55), washOp: 210, ink: null });
    ['²¹', '²²', '²³', '²⁴', '²⁵'].forEach((s, i) => letter('10' + s, P.x + 20 + i * (P.w - 40) / 4 + (i === 0 ? 26 : i === 4 ? -26 : 0), P.y + P.h + 4, 30, mixCol(PAL.teal, PAL.ink, .5), { ink: false }));
  }
  function ruler() {
    const s0 = -150, s1 = LEN + 130, a = at(s0, RB), b = at(s1, RB), c = at(s1, RW), d = at(s0, RW);
    paint([at(s0 - 6, RB - 9), at(s1 + 6, RB - 9), at(s1 + 6, RW - 4), at(s0 - 6, RW - 4)], { fill: PAL.ink, fillOp: 90, bleed: .1, ink: null });
    paint([a, b, c, d], { wash: '#E9C27A', washOp: 255, fill: PAL.ochre, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
    for (let s = s0 + 20, i = 0; s < s1 - 10; s += 26, i++) {     // tick marks as thin filled slivers (they get pushed into)
      const l = i % 5 === 0 ? 18 : 9, p = at(s, RW - 2), q = at(s, RW - 2 - l), e = 1.2;
      paint([[p[0] - D[0] * e, p[1] - D[1] * e], [p[0] + D[0] * e, p[1] + D[1] * e], [q[0] + D[0] * e, q[1] + D[1] * e], [q[0] - D[0] * e, q[1] - D[1] * e]], { wash: '#6A4128', washOp: 230, ink: null });
    }
  }
  function sharpener(t) {
    const x = 538, y = 732, ph = (bpOf(t) + .25) * TAU;          // crank turns once a beat
    paint(rectPts(x + 70, y + 16, 22, 44, 1), { wash: STEEL_DK, washOp: 255, ink: PAL.ink, sw: .8 });            // clamp on the frame
    paint(rrPts(x, y, 84, 82, 10), { wash: '#9AA3BC', washOp: 255, fill: STEEL, fillOp: 70, tex: .4, ink: PAL.ink, sw: 1.1 });
    paint(rectPts(x + 6, y + 64, 72, 16, 2), { wash: '#6E5A8A', washOp: 255, ink: PAL.ink, sw: .7 });            // shavings drawer
    paint(ellPts(x + 30, y + 40, 15, 15, 14), { wash: PAL.ink, washOp: 255, ink: null });                          // pencil hole
    const hx = x + 50, hy = y + 26, ex = hx + Math.cos(ph) * 30, ey = hy + Math.sin(ph) * 30;
    paint(ellPts(hx, hy, 9, 9, 10), { wash: STEEL_DK, ink: PAL.ink, sw: .6 });
    inkLine([[hx, hy], [ex, ey]], 2.2, STEEL_DK, 'ink', 0);
    paint(ellPts(ex, ey, 9, 9, 10), { wash: PAL.clay, washOp: 255, ink: PAL.ink, sw: .7 });
  }
  // shavings curl out of the sharpener on every beat
  function shavings(t) {
    for (let b = 72; b <= 76; b++) {
      const age = t - bt(b); if (age < 0 || age > .9 || b > 75) continue;
      for (let i = 0; i < 7; i++) {
        const h1 = hash(b * 13 + i), h2 = hash(b * 7 + i * 3), vx = -260 + 520 * h1, vy = -240 - 260 * h2;
        const x = 575 + vx * age, y = Math.min(GROUND - 6, 735 + vy * age + 900 * age * age);
        const r = 8 + 6 * h2, rot = age * (6 + 8 * h1);
        paint(ellPts(x, y, r, r * .55, 10, 1, rot), { wash: i % 3 ? '#F1D3A1' : PAL.ochre, washOp: 255 * (1 - seg(age, .65, .9)), ink: PAL.ink, sw: .4 });
      }
    }
  }
  // the pencil, along +x from the eraser (0) to the tip (len); ph twists the hexagonal body
  function pencilShape(len, w, ph) {
    paint(rrPts(-.02 * len, -w / 2, .12 * len, w, w * .35), { wash: PAL.rose, washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rectPts(.09 * len, -w / 2 - 1, .07 * len, w + 2, 0), { wash: '#C9CED8', washOp: 255, ink: PAL.ink, sw: .7 });
    paint(rectPts(.16 * len, -w / 2, .66 * len, w, 0), { wash: PAL.ochre, washOp: 255, fill: '#C98A1E', fillOp: 50, tex: .4, ink: PAL.ink, sw: .9 });
    for (let k = 0; k < 6; k++) {                              // facet edges of the hex body roll as it twists
      const a = ph + k * Math.PI / 3; if (Math.sin(a) < 0) continue;
      const y = Math.cos(a) * w / 2; if (Math.abs(y) > w / 2 - 2) continue;
      paint(rectPts(.16 * len, y - 1.2, .66 * len, 2.4, 0), { wash: '#B9761A', washOp: 230, ink: null });
    }
    paint([[.82 * len, -w / 2], [len, 0], [.82 * len, w / 2]], { wash: '#F1D3A1', washOp: 255, ink: PAL.ink, sw: .7 });
    paint([[.94 * len, -w * .17], [len, 0], [.94 * len, w * .17]], { wash: PAL.ink, washOp: 255, ink: null });
  }
  const handAt = aR => [(4.9 + 2.2 * Math.cos(aR)) * U, (-4.5 - 2.2 * Math.sin(aR)) * U];
  // pencil poses in Clawd's own frame: angle and grip (px from the eraser to the hand)
  const SHARP = { aR: 0, th: 0, g: 4.2 * U }, RAISED = { aR: 1.3, th: -1.25, g: 5 * U };
  const GRIND = (() => { const aR = -.25, [hx, hy] = handAt(aR), vx = TIPX - hx, vy = RW - hy; return { aR, th: Math.atan2(vy, vx), g: PEN - Math.hypot(vx, vy) }; })();
  const mixPose = (p, q, k) => ({ aR: lerp(p.aR, q.aR, k), th: lerp(p.th, q.th, k), g: lerp(p.g, q.g, k) });

  function hero(t) {
    let x = X0, y = GROUND, rot = 0, dy = 0, sq = 0, pen = SHARP, insert = 0, ph = 0, aL = .3;
    const sharpen = t < bt(75.3);
    if (sharpen) {                                             // twist on every beat: push in, roll the pencil, squash
      const bp = bpOf(t), bf = frac(bp), hit = Math.exp(-bf * 7);
      insert = 10 * hit; ph = (Math.floor(bp) + easeOut(bf * 3)) * Math.PI / 3;
      rot = .05 * hit * (Math.floor(bp) % 2 ? 1 : -1); sq = .14 * hit; aL = .2 + .5 * hit;
    } else if (t < GRIND0) {
      const k = seg(t, bt(75.3), bt(75.9)), j = seg(t, bt(76), GRIND0);
      pen = j > 0 ? mixPose(RAISED, GRIND, ease(seg(j, .35, .9))) : mixPose(SHARP, RAISED, backOut(k));
      insert = -40 * ease(k); aL = lerp(.3, 1.1, ease(k));
      if (j > 0) {                                             // front flip from the floor onto the end of the ruler
        const [px, py] = at(S0, RW), e = ease(j);
        x = lerp(X0, px, e); y = lerp(GROUND, py, e) - 170 * Math.sin(Math.PI * j);
        rot = lerp(0, ANG, e) + TAU * ease(seg(j, .1, .85)); sq = -.12 * Math.sin(Math.PI * j);
      } else sq = .12 * Math.exp(-seg(t, bt(75.9), bt(76)) * 4) * (t > bt(75.9) ? 1 : 0);
    } else {
      const g = seg(t, GRIND0, GRIND1), s = lerp(S0, S1, ease(g));
      [x, y] = at(s, RW); rot = ANG; pen = GRIND;
      if (t >= GRIND1) { const age = t - GRIND1; sq = .2 * Math.exp(-age * 9) - .08 * pulse(t, 8); aL = lerp(.3, 1.5, backOut(seg(age, 0, .25))); }
      else { sq = -.06; aL = -.6; }
    }
    const m = mood(t, [[bt(72) - .3, 'narrow'], [bt(75.6), 'happy', 'spark'], [GRIND0, 'narrow'], [GRIND1, 'happy', '!!']]);
    clawd(x, y, U, { draw: HARD_LAMP, rot, dy, sq, aR: pen.aR, aL, ...m, mouth: t < bt(75.6) ? 'flat' : t < GRIND1 && t > GRIND0 ? 'grin' : 'O' });
    // the pencil, in Clawd's frame
    push(); translate(x, y); rotate(rot);
    const [hx, hy] = handAt(pen.aR); translate(hx + insert * Math.cos(pen.th), hy + insert * Math.sin(pen.th)); rotate(pen.th); translate(-pen.g, 0);
    pencilShape(PEN, 1.15 * U, ph);
    pop();
    // tip position in world space, for sparks
    const lx = hx + (PEN - pen.g + insert) * Math.cos(pen.th), ly = hy + (PEN - pen.g + insert) * Math.sin(pen.th);
    return [x + lx * Math.cos(rot) - ly * Math.sin(rot), y + lx * Math.sin(rot) + ly * Math.cos(rot)];
  }

  function chalkboard(t, lt, dur) {
    const arrive = 1 - easeOut(seg(lt, 0, .32));                    // tail of the whip pan
    const g = ease(seg(t, GRIND0 - .2, GRIND1 + .2)), push_ = Math.pow(seg(t, PUSH0, END + .15), 2);
    const tgt = at(LEN * .45);
    const wide = ease(seg(t, bt(75.9), bt(77)));                   // tight on the sharpening, then pull back for the stroke
    let cx = lerp(lerp(400, 980, wide), 1040, g) - 2200 * arrive, cy = lerp(lerp(700, 420, wide), 450, g);   // framed high: the ride starts top left
    let z = lerp(lerp(1.65, .9, wide), .92, g) * (1 + .018 * pulse(t, 7));
    cx = lerp(cx, tgt[0], ease(push_ * 1.4)); cy = lerp(cy, tgt[1], ease(push_ * 1.4)); z *= lerp(1, 7, push_);
    const [sx, sy] = shakeXY(t, (2 + 3 * pulse(t, 8)) * (1 - push_));
    camBegin(cx + sx, cy + sy, z);
    room(t);
    board(t);
    // the line: ruled from A down to the pencil tip, then it glows on the beat
    const k = t < GRIND0 ? 0 : ease(seg(t, GRIND0, GRIND1));
    const tipS = k * LEN;
    ruler();
    if (tipS > 2) theLine(A, at(tipS), 9, t >= GRIND1 ? .6 + .4 * pulse(t, 5) : .5);
    sharpener(t);
    if (t < GRIND0 && t >= bt(72)) shavings(t);
    if (t > GRIND0 && t < GRIND1) {                            // speed lines behind Clawd as it grinds down the ruler
      const p = at(lerp(S0, S1, ease(seg(t, GRIND0, GRIND1))), RW + 90);
      for (let i = 0; i < 4; i++) { const a = [p[0] - D[0] * (60 + i * 18) + N[0] * (i * 28 - 40), p[1] - D[1] * (60 + i * 18) + N[1] * (i * 28 - 40)];
        band(a, [a[0] - D[0] * 220, a[1] - D[1] * 220], 3, { fill: PAL.cream, fillOp: 150, bleed: .1, ink: null }); }
    }
    const tip = hero(t);
    if (t > GRIND0 && t < GRIND1 + .05) for (let i = 0; i < 6; i++) {   // sparks off the graphite
      const a = hash(Math.floor(t * 24) * 7 + i) * Math.PI - Math.PI, r = 20 + 30 * hash(i + Math.floor(t * 24));
      paint(starPts(tip[0] + Math.cos(a) * r - D[0] * 20, tip[1] + Math.sin(a) * r * .6 - D[1] * 20, 8, .35, 4), { wash: i % 2 ? PAL.ochre : PAL.cream, washOp: 255, ink: null });
    }
    const shing = t - bt(76);
    if (shing > 0 && shing < .45) {
      const r = 46 * backOut(seg(shing, 0, .12)) * (1 - seg(shing, .25, .45));
      paint(starPts(tip[0], tip[1], r, .22, 4, wob(t, 2) * .3), { wash: PAL.cream, washOp: 255, ink: null });
    }
    if (t >= GRIND1) {                                         // a sparkle where the line meets the corner
      const r = 34 * backOut(seg(t, GRIND1, GRIND1 + .15)) * (.7 + .3 * pulse(t, 6));
      paint(starPts(B[0], B[1], r, .25, 4), { wash: PAL.cream, washOp: 255, ink: null });
    }
    camEnd();
    sfx('SHING!', 1120, 190, 92, PAL.cream, shing, { life: .8, rot: -.1 });
    whip(arrive);
  }
  const END = barT(21);

  chapter('lab', barT(17), END, [[barT(17), stomp], [bt(72), chalkboard]]);
})();
