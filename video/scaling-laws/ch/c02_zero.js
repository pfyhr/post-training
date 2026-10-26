// c02_zero.js: 37.57-59.1, bars 21-32 (verse 1, "Add a zero"). Clawd rides the line down the loss a decade at a time: at 10²³ it
// is small and writes a heart-covered poem that the Researcher pins on a fridge; at 10²⁵ it is person-sized, typing
// with four arms while the Researcher is rolled off into a hammock; then it jumps through zero-hoops, a size bigger
// each time, and a carpenter checks the line with a spirit level. Last, it hugs a roll of paper, erases a wobble at
// the paper's edge and winks, just as a Skeptic's megaphone squeals in. Lab night warming to amber.
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { NIGHT, GRID, STEEL, STEEL_DK, HARD, labCoat } = SL;
  const S = .16, ANG = Math.atan(S);                       // the line's slope on the paper (falling: loss goes down)
  // shots 2-4 keep the line as a level floor in world space and tilt the camera by ANG, so on screen the grid is square
  // and the line descends left to right (characters lean with it; the spirit level lies along the line)
  const WARM = '#5A3A2C', HEART = '#E2476E', WOOD = '#9A6440', WOOD_DK = '#6E4228';
  const bgCol = w => mixCol(NIGHT, WARM, w);
  const gridCol = (w, a) => mixCol(bgCol(w), mixCol(GRID, PAL.ochre, w * .5), a);
  const SUP = { 23: '²³', 24: '²⁴', 25: '²⁵' };

  // ---------------- shared pieces ----------------
  // night paper with a lamp pool that grows warmer through the chapter (w 0 → 1); screen space
  function backdrop(w, gx, gy, gr, col = bgCol(w)) {
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, washOp: 255, fill: mixCol(PAL.indigo, PAL.clayDk, w), fillOp: 60, bleed: .2, tex: .5, ink: null });
    paint(ellPts(gx, gy, gr, gr * .75, 30, 6), { fill: PAL.ochre, fillOp: 25 + 70 * w, bleed: .3, tex: .2, border: 0, ink: null });
  }
  // log-log grid: decades D apart with 2..9 minor lines, origin (ox, oy) on a decade corner, rotated by rot, covering a
  // radius R around world point (cx, cy). `edge` cuts the paper off at paper-x = edge.
  function logGrid(w, ox, oy, D, rot, cx, cy, R, edge = 1e9) {
    const c = Math.cos(rot), s = Math.sin(rot), dx = cx - ox, dy = cy - oy;
    const px = dx * c - dy * s, py = dx * s + dy * c;
    const x0 = px - R, x1 = Math.min(px + R, edge), y0 = py - R, y1 = py + R;
    push(); translate(ox, oy); rotate(-rot);
    for (let d = Math.floor(-y1 / D); d * D <= -y0; d++) for (let k = 1; k <= 9; k++) {
      const y = -(d + Math.log10(k)) * D; if (y < y0 || y > y1) continue;
      { const sw = k === 1 ? 1.5 : .7, col = gridCol(w, k === 1 ? 1 : .62), xm = Math.min(px, x1); inkLine([[xm, y], [x0, y]], sw, col, 'inkfine', 0); if (x1 > xm) inkLine([[xm, y], [x1, y]], sw, col, 'inkfine', 0); }
    }
    for (let d = Math.floor(x0 / D); d * D <= x1; d++) for (let k = 1; k <= 9; k++) {
      const x = (d + Math.log10(k)) * D; if (x < x0 || x > x1) continue;
      { const sw = k === 1 ? 1.5 : .7, col = gridCol(w, k === 1 ? 1 : .62); inkLine([[x, py], [x, y0]], sw, col, 'inkfine', 0); inkLine([[x, py], [x, y1]], sw, col, 'inkfine', 0); }
    }
    pop();
  }
  // a polyline thickened into a filled band (filled, so it holds up in the close-up)
  function band(pts, th) {
    const a = [], b = [];
    pts.forEach((p, i) => {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[Math.min(pts.length - 1, i + 1)];
      const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L * th / 2, ny = dx / L * th / 2;
      a.push([p[0] + nx, p[1] + ny]); b.push([p[0] - nx, p[1] - ny]);
    });
    return a.concat(b.reverse());
  }
  // The Line: clay, thick, a soft glow under it, a darker underside
  function theLine(pts, th = 22, glow = .5) {
    paint(band(pts, th * 3.5), { fill: PAL.ochre, fillOp: 30 + 60 * glow, bleed: .2, tex: .2, border: 0, ink: null });
    paint(band(pts, th), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 50, tex: .5, ink: null });
    paint(band(pts.map(p => [p[0], p[1] + th * .32]), th * .3), { wash: PAL.clayDk, washOp: 220, ink: null });
  }
  // a decade tick across the line, with its label below it
  function tick(x, y, n, pop = 1, rot = 0) {
    inkLine([[x + Math.sin(rot) * 26, y - Math.cos(rot) * 26], [x - Math.sin(rot) * 26, y + Math.cos(rot) * 26]], 1.8, PAL.cream, 'ink', 0);
    letter('10' + SUP[n], x + 6, y + 64, 46, soft(PAL.ochre, .15), { pop, rot: rot - .04 });
  }
  // a stretchy extra arm from (x0, y0) to (x1, y1), with a round hand
  function armTo(x0, y0, x1, y1, u) {
    const L = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0), sw = clamp(u / 15, .45, 2.4) * .8;
    push(); translate(x0, y0); rotate(a);
    paint(rectPts(0, -.5 * u, L, u, u * .05), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 60, tex: .5, ink: PAL.ink, sw });
    paint(ellPts(L, 0, .62 * u, .62 * u, 12), { wash: PAL.clay, washOp: 255, ink: PAL.ink, sw });
    pop();
  }

  // ---------------- 37.57 – 44.6: 10²³, the poem ----------------
  const LY1 = x => 720 + S * x, X23 = 560, X24 = 1460, X25 = 2360;
  function fridge(x0, x1, base) {
    const h = 400, w = x1 - x0, top = base - h, door = top + h * .36;
    paint(rrPts(x0, top, w, h, 24, 2), { wash: '#E4DED0', washOp: 255, fill: PAL.sky, fillOp: 45, tex: .5, ink: PAL.ink, sw: 1.3 });
    paint(ellPts(x0 + w * .35, top + 40, w * .25, 18, 14, 2), { fill: PAL.cream, fillOp: 120, bleed: .2, ink: null });
    inkLine([[x0 + 4, door], [x1 - 4, door]], 1, PAL.ink, 'ink', 0);
    for (const [y0, y1] of [[top + 40, door - 24], [door + 26, door + 150]]) paint(rrPts(x1 - 30, y0, 13, y1 - y0, 6), { wash: STEEL, washOp: 255, ink: PAL.ink, sw: .7 });
    paint(ellPts(x0 + 36, door + 60, 10, 10, 12), { wash: PAL.teal, ink: PAL.ink, sw: .6 });
    paint(starPts(x0 + 70, door + 200, 13, .45, 5), { wash: PAL.ochre, ink: PAL.ink, sw: .6 });
    paint(rectPts(x0 + 10, base - 6, w - 20, 10, 1), { wash: PAL.ink, ink: null });
  }
  function poem(x, y, sc, lines, rot = 0) {
    push(); translate(x, y); rotate(rot); scale(sc);
    paint(rectPts(-36, -46, 72, 92, 1.5), { wash: PAL.cream, washOp: 255, fill: PAL.rose, fillOp: 30, tex: .4, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < lines; i++) { const y = -26 + i * 12, l = 42 - (i % 3) * 9; inkLine([[-22, y], [-22 + l * .5, y - 2], [-22 + l, y + 1]], .55, PAL.indigo, 'inkfine', .6); }
    [[-27, -36], [27, -36], [-28, 37], [28, 37], [0, -40], [0, 40]].forEach(([hx, hy], i) => paint(heartPts(hx, hy, i < 4 ? 8 : 6), { wash: HEART, ink: null }));
    paint(heartPts(16, 26, 9), { wash: HEART, ink: PAL.ink, sw: .5 });
    pop();
  }
  function pencil(x, y, a) {                               // tip at (x, y), pointing along a
    push(); translate(x, y); rotate(a);
    paint([[0, 0], [10, -4], [10, 4]], { wash: '#F2D2A8', ink: PAL.ink, sw: .5 });
    paint(rectPts(10, -4, 46, 8, .5), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .6 });
    paint(rectPts(56, -4, 8, 8, .5), { wash: PAL.rose, ink: PAL.ink, sw: .5 });
    pop();
  }
  function poemShot(t, lt) {
    const bp = bpOf(t);
    // Clawd: two hops along the line from beat 92 (10²³ → 10²⁴ → off toward 10²⁵), a size bigger each time
    const cx = kf(t, [[bt(92), X23], [bt(93.6), X24], [bt(94), X24], [bt(95.6), X25]]);
    const ph = t >= bt(92) && t < bt(93.6) ? seg(t, bt(92), bt(93.6)) : t >= bt(94) ? seg(t, bt(94), bt(95.6)) : -1;
    const hop = ph < 0 ? 0 : Math.sin(Math.PI * ph);
    const u = kf(t, [[bt(92), 14], [bt(93.6), 17], [bt(94), 17], [bt(95.6), 21]]), cy = LY1(cx);
    const cam = kf(t, [[bt(80), [600, 690, 1.45]], [bt(86), [760, 650, 1.12]], [bt(92), [800, 650, 1.08]],
                       [bt(93.6), [X24 + 120, LY1(X24) - 220, 1.0]], [bt(95), [2150, LY1(2150) - 240, .94]]]);
    const [sx, sy] = shakeXY(t, 2 * pulse(t, 8));
    backdrop(.05 + .15 * seg(t, bt(80), bt(95)), 860, 560, 620);
    camBegin(cam[0] + sx, cam[1] + sy, cam[2] * (1 + .015 * pulse(t, 7)));
    logGrid(.05, X23 - 900, LY1(X23), 900, 0, cam[0], cam[1], 1150 / cam[2]);
    theLine([[-900, LY1(-900)], [3800, LY1(3800)]], 18, .35);
    const r = ANG;
    tick(X23, LY1(X23), 23, 1, r); tick(X24, LY1(X24), 24, clamp((t - bt(93.4)) * 4), r); tick(X25, LY1(X25), 25, clamp((t - bt(95)) * 4), r);

    // the fridge and, once it is pinned, the poem on it
    const FX = 830, pin = [905, LY1(FX) - 300];
    if (cam[0] < 1900) fridge(FX, 1010, LY1(FX));
    const held = [cx + 4, cy - 3.6 * u], up = [cx, cy - 15.5 * u], lines = Math.min(5, Math.floor(seg(t, bt(80), bt(84.6)) * 6));
    let pp = held, psc = .85, prot = 0;
    if (t >= bt(85) && t < bt(87)) { const k = backOut(seg(t, bt(85), bt(85.7))); pp = [lerp(held[0], up[0], k), lerp(held[1], up[1], k)]; psc = lerp(.85, 1.3, k); prot = .07 * wob(t, 2); }
    else if (t >= bt(87)) { const k = ease(seg(t, bt(87), bt(88))); pp = [lerp(up[0], pin[0], k), lerp(up[1], pin[1], k) - Math.sin(Math.PI * k) * 90]; psc = lerp(1.3, 1.05, k); prot = lerp(0, -.07, k); }
    const pinned = t >= bt(88);
    if (pinned) {
      poem(pp[0], pp[1], psc, 5, prot);
      paint(heartPts(pin[0] - 4, pin[1] - 46, 12 * backOut(seg(t, bt(88), bt(88.4)))), { wash: HEART, fill: PAL.rose, fillOp: 80, ink: PAL.ink, sw: .7 });
    }

    // the Researcher walks in, admires it, pins it, pats Clawd's head, waves goodbye
    const rx = kf(t, [[bt(82), 1460], [bt(86), 690]], x => x), walking = t > bt(82) && t < bt(86);
    const pat = t >= bt(88.5) && t < bt(91.2), pinning = t >= bt(87) && t < bt(88.5), bye = t >= bt(91.2);
    researcher(rx, LY1(rx), 30, {
      walk: walking ? bp / 2 : undefined, dy: walking ? -.15 * Math.abs(Math.sin(bp * Math.PI)) : -.12 * pulse(t, 8),
      eyes: pinning || pat ? 'closed' : t >= bt(86) && t < bt(87) ? 'wide' : bye ? 'look' : 'dot', lookX: 1,
      mouth: t >= bt(86) && t < bt(87) ? 'O' : 'smile', brows: t >= bt(86) && t < bt(87) ? 'up' : null, blush: pat,
      aL: pat ? -.42 - .22 * pulse(t, 8) : t >= bt(86) && t < bt(87) ? .2 : -1.25,
      aR: pinning ? lerp(-1.25, .32, backOut(seg(t, bt(87), bt(87.6)))) : bye ? 1.1 + .4 * Math.sin(bp * TAU) : -1.25,
      emote: pat ? 'heart' : null, emoteK: seg(t, bt(88.6), bt(89)) });

    // Clawd: writes, holds it up, watches it pinned, gets patted, crouches, hops
    const m = mood(t, [[0, 'look'], [bt(85), 'happy', 'spark'], [bt(87), 'look'], [bt(88.5), 'closed', 'heart'], [bt(91), 'happy']]);
    const writing = t < bt(85), holding = t >= bt(85) && t < bt(87), crouch = t >= bt(91) && t < bt(92) ? ease(seg(t, bt(91), bt(92))) : 0;
    clawd(cx, cy, u, { draw: HARD, ...m, lookX: writing ? .3 : .9, lookY: writing ? .8 : -.3, rot: ANG * .6,
      dy: -hop * 170 / u - (holding ? .5 * pulse(t, 6) : 0), sq: crouch * .28 + (t >= bt(88.5) && t < bt(91) ? .14 * pulse(t, 8) : 0) - hop * .1,
      aL: writing ? -.4 : holding ? 1.35 : hop > 0 ? 1.3 : .1, aR: writing ? -.25 + .25 * pulse2(t, 5) : holding ? 1.35 : hop > 0 ? 1.3 : .1,
      mouth: writing ? 'cat' : holding ? 'grin' : hop > 0 ? 'O' : pinning ? 'o' : 'smile', blush: !writing && t < bt(92) });
    if (!pinned) {
      poem(pp[0], pp[1], psc, lines, prot);
      if (writing) { const k = frac(bp * 2); pencil(pp[0] - 20 + 40 * k, pp[1] - 26 + Math.max(0, lines - .5) * 10, -2.2 + .2 * k); }
    }
    // little hearts float off the poem, one per beat while it is written and shown off
    for (let j = beatN(t) - 3; j <= beatN(t); j++) {
      if (j < 81 || j > 88) continue;
      const age = bp - j, hx = pp[0] + (hash(j) - .5) * 90 + wob(t, .8, j) * 8, hy = pp[1] - 50 - age * 60, rr = 9 * (1 - age / 4) * backOut(age * 3);
      if (rr > 1) paint(heartPts(hx, hy, rr), { wash: HEART, ink: PAL.ink, sw: .5 });
    }
    camEnd();
  }

  // ---------------- 44.6 – 51.16: 10²⁵, four arms, the Researcher retires to a hammock, STAMP ----------------
  const FL2 = 830, CX2 = 1230, U2 = 26, CY2 = 702;
  function officeChair(x, seatY, s) {
    paint(rrPts(x - 2.1 * s, seatY - 5.6 * s, 4.2 * s, 5 * s, 1.2 * s, 1.5), { wash: STEEL_DK, washOp: 255, fill: PAL.night, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
    paint(rectPts(x - .25 * s, seatY, .5 * s, FL2 - 26 - seatY, .5), { wash: STEEL, ink: PAL.ink, sw: .7 });
    inkLine([[x - 2.2 * s, FL2 - 16], [x, FL2 - 28], [x + 2.2 * s, FL2 - 16]], 2, PAL.ink, 'ink', 0);
    for (const k of [-2.2, 0, 2.2]) paint(ellPts(x + k * s, FL2 - 9, 8, 8, 10), { wash: PAL.ink, ink: null });
  }
  function chairSeat(x, seatY, s) { paint(rrPts(x - 2.6 * s, seatY - .3 * s, 5.2 * s, .9 * s, .4 * s), { wash: STEEL_DK, washOp: 255, ink: PAL.ink, sw: 1 }); }
  function hammockBack(dx) {
    for (const px of [220, 670]) paint(rectPts(px - 9, 450, 18, FL2 - 450, 1.5), { wash: WOOD_DK, washOp: 255, ink: PAL.ink, sw: 1 });
    inkLine([[220, 470], [270 + dx, 590]], 1, PAL.cream, 'inkfine', 0); inkLine([[670, 470], [620 + dx, 590]], 1, PAL.cream, 'inkfine', 0);
    paint([[265 + dx, 585], [445 + dx, 640], [625 + dx, 585], [625 + dx, 600], [445 + dx, 705], [265 + dx, 600]], { wash: PAL.rose, washOp: 255, fill: PAL.clayDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1, curv: .5 });
  }
  function hammockFront(dx) {
    paint([[285 + dx, 612], [445 + dx, 662], [605 + dx, 612], [605 + dx, 622], [445 + dx, 708], [285 + dx, 622]], { wash: PAL.rose, washOp: 255, fill: PAL.clayDk, fillOp: 40, tex: .5, ink: PAL.ink, sw: 1, curv: .5 });
    for (const k of [-.5, 0, .5]) inkLine([[445 + dx + k * 300, 640 + 50 * (1 - k * k * 2.2)], [445 + dx + k * 300, 655 + 50 * (1 - k * k * 2.2)]], 1, PAL.cream, 'inkfine', 0);
  }
  const mug = (s, sw) => {
    paint(rrPts(-.55 * s, -1.6 * s, 1.1 * s, 1.3 * s, .2 * s), { wash: PAL.teal, washOp: 255, ink: PAL.ink, sw: sw * .6 });
    inkLine([[.55 * s, -1.3 * s], [.95 * s, -1.0 * s], [.55 * s, -.6 * s]], sw * .7, PAL.ink, 'ink', .6);
    inkLine([[-.1 * s, -1.9 * s], [.15 * s, -2.4 * s], [-.1 * s, -2.9 * s]], sw * .5, PAL.cream, 'inkfine', .7);
  };
  function desk() {
    paint(rectPts(1000, 650, 22, FL2 - 650, 1), { wash: WOOD_DK, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rectPts(1660, 650, 22, FL2 - 650, 1), { wash: WOOD_DK, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rectPts(1022, 662, 638, 110, 1.5), { wash: WOOD_DK, washOp: 255, fill: PAL.ink, fillOp: 30, tex: .5, ink: PAL.ink, sw: .9 });
    paint(rectPts(975, 636, 730, 26, 2), { wash: WOOD, washOp: 255, fill: PAL.ochre, fillOp: 50, tex: .6, ink: PAL.ink, sw: 1.1 });
  }
  function monitor(t) {
    push(); translate(100, 0);
    paint(rectPts(1480, 590, 26, 48, 1), { wash: STEEL_DK, ink: PAL.ink, sw: .8 }); paint(rectPts(1440, 630, 106, 10, 1), { wash: STEEL_DK, ink: PAL.ink, sw: .8 });
    paint(ellPts(1495, 515, 190, 150, 20, 4), { fill: PAL.teal, fillOp: 60, bleed: .3, ink: null });
    paint(rrPts(1395, 430, 200, 165, 10, 1.5), { wash: STEEL_DK, washOp: 255, ink: PAL.ink, sw: 1.1 });
    paint(rectPts(1408, 443, 174, 139, .5), { wash: '#1F4F5C', washOp: 255, fill: PAL.teal, fillOp: 90, tex: .4, ink: null });
    inkLine([[1420, 455], [1570, 570]], 2.4, PAL.clay, 'ink', 0);
    const sc = frac(bpOf(t) / 2);
    for (let i = 0; i < 4; i++) { const y = 452 + ((i * 30 - sc * 30) % 120 + 120) % 120; inkLine([[1420, y], [1420 + 40 + 60 * hash(i + Math.floor(bpOf(t) / 2)), y]], 1, PAL.cream, 'inkfine', 0); }
    pop();
  }
  function keyboard(t) {
    paint(rectPts(CX2 - 9 * U2, 622, 18 * U2, 16, 1), { wash: STEEL, washOp: 255, ink: PAL.ink, sw: .8 });
    const e = Math.floor(bpOf(t) * 4);
    for (let i = 0; i < 18; i++) paint(rectPts(CX2 - 9 * U2 + 8 + i * 25.5, 625, 18, 7, 0), { wash: hash(e * 11 + i) > .78 ? PAL.cream : STEEL_DK, ink: null });
  }
  function stamp(x, y) {                                     // hand on the knob at (x, y); rubber at y + 86
    paint(ellPts(x, y, 20, 16, 14), { wash: WOOD, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rectPts(x - 8, y + 12, 16, 46, 1), { wash: WOOD_DK, washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rectPts(x - 42, y + 56, 84, 20, 1), { wash: WOOD, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rectPts(x - 38, y + 76, 76, 10, 1), { wash: PAL.clayDk, washOp: 255, ink: PAL.ink, sw: .7 });
  }
  function deskShot(t, lt) {
    const bp = bpOf(t), w = .3 + .25 * seg(t, bt(95), bt(109));
    const z = lerp(1.13, 1.04, ease(lt / 6.5)), [sx, sy] = shakeXY(t, 2 * pulse(t, 8) + 9 * Math.exp(-Math.max(0, t - bt(106)) * 9) * (t > bt(106) ? 1 : 0));
    backdrop(w, 1250, 470, 720);
    camBegin(1040 + sx, 610 + sy, z * (1 + .012 * pulse(t, 7)), ANG);
    logGrid(w, CX2, FL2, 700, ANG, 1040, 610, 1250 / z);
    theLine([[-600, FL2], [2600, FL2]], 20, .5);
    tick(CX2, FL2, 25); tick(CX2 - 700, FL2, 24);

    // the number on the wall: 1000000, and on beat 106 a stamped 0 makes it 10000000
    paint(rectPts(1335, 192, 430, 132, 2), { wash: PAL.cream, washOp: 255, fill: PAL.ochre, fillOp: 35, tex: .5, ink: PAL.ink, sw: 1.1 });
    paint(ellPts(1550, 196, 9, 9, 10), { wash: PAL.rose, ink: PAL.ink, sw: .6 });
    for (let i = 0; i < 7; i++) letter(i ? '0' : '1', 1376 + i * 46, 262, 74, PAL.ink, { ink: false });
    const stampAge = t - bt(106);
    if (stampAge >= 0) {
      paint(ellPts(1700, 262, 34 + 8 * backOut(stampAge * 4), 44, 16, 3), { fill: PAL.rose, fillOp: 70, bleed: .3, ink: null });
      letter('0', 1698, 262, 78, PAL.clayDk, { ink: false, pop: stampAge * 4, rot: .06 });
    }
    hammockBack(0);

    // Researcher: on a rolling chair, pushed gently away, tipped into the hammock with a coffee
    const s = 24, chairX = kf(t, [[bt(97), 930], [bt(100.5), 780]]), seatY = FL2 - 100;
    const tip = seg(t, bt(100.5), bt(101.6)), te = ease(tip), swing = tip >= 1 ? 10 * Math.sin((t - bt(101.6)) * 2.4) : 0;
    officeChair(chairX, seatY, s);
    if (tip < 1) {
      const rxp = lerp(chairX, 580, te), ryp = lerp(seatY + 2.3 * s, 628, te) - Math.sin(Math.PI * te) * 110;
      researcher(rxp, ryp, s, { sit: tip < .3, rot: -1.45 * te, eyes: t < bt(97) ? 'wide' : tip > 0 ? 'wide' : 'dot', brows: t >= bt(97) ? 'worried' : 'up',
        mouth: tip > 0 ? 'O' : 'smile', aL: -.9 + 1.6 * te, aR: .1, handR: mug, noShadow: tip > 0, hairUp: Math.sin(Math.PI * te) });
    }
    chairSeat(chairX, seatY, s);
    if (tip >= 1) {
      hammockBack(swing);
      const sip = Math.exp(-Math.abs(bp - 104) * 3) + Math.exp(-Math.abs(bp - 107.5) * 3);
      researcher(580 + swing, 628, s, { rot: -1.45, eyes: 'closed', brows: 'worried', mouth: sip > .3 ? 'o' : 'smile', aR: .55 + .5 * sip, aL: -.4, noShadow: true,
        handR: (ss, sw) => { push(); rotate(1.45 - .55 - .5 * sip); mug(ss, sw); pop(); },
        emote: 'sweat', emoteK: seg(t, bt(102), bt(102.5)) });
      hammockFront(swing);
    }

    // Clawd at the desk: four arms on the keyboard; the lower-left one rolls the chair away, the lower-right one stamps
    const m = mood(t, [[0, 'look'], [bt(96.6), 'happy'], [bt(98.6), 'look'], [bt(104.4), 'happy', 'spark'], [bt(107.6), 'look']]);
    const e8 = Math.floor(bp * 2) % 2, tap = pulse2(t, 9);
    clawd(CX2, CY2, U2, { draw: HARD, ...m, lookX: t > bt(96.6) && t < bt(98.6) ? -1 : .9, noLegs: true, noShadow: true, dy: -.25 * pulse(t, 7),
      aL: e8 ? .55 - .5 * tap : -.4, aR: e8 ? -.4 : .55 - .5 * tap, mouth: t > bt(104.4) && t < bt(107.6) ? 'grin' : 'smile', blush: t > bt(104.4) && t < bt(107.6) });
    desk(); keyboard(t); monitor(t);
    const shL = [CX2 - 4.4 * U2, CY2 - 3.7 * U2], shR = [CX2 + 4.4 * U2, CY2 - 3.7 * U2];
    // lower-left arm: typing, then out to the chair back and push
    const push1 = seg(t, bt(96.4), bt(97)) * (1 - seg(t, bt(100.5), bt(101.3)));
    const kL = [CX2 - 7.8 * U2, 628 - 12 * (e8 ? 0 : tap)], cL = [chairX + 2.1 * s, seatY - 3.4 * s];
    armTo(shL[0], shL[1], lerp(kL[0], cL[0], ease(push1)), lerp(kL[1], cL[1], ease(push1)), U2 * .9);
    // lower-right arm: typing, then up to the stamp, SLAM on beat 106, back down
    const kR = [CX2 + 7.8 * U2, 628 - 12 * (e8 ? tap : 0)];
    const sy0 = 82, sy1 = 176, sY = t < bt(106) ? lerp(sy0, sy1, easeIn(seg(t, bt(105.4), bt(106)))) : lerp(sy1, sy0, ease(seg(t, bt(106.8), bt(107.4))));
    const up = ease(seg(t, bt(104), bt(104.8))) * (1 - ease(seg(t, bt(107.4), bt(108.2))));
    const hR = [lerp(kR[0], 1700, up), lerp(kR[1], sY, up)];
    if (up > .05) stamp(hR[0], hR[1]);
    armTo(shR[0], shR[1], hR[0], hR[1], U2 * .9);
    if (stampAge >= 0) sfx('KA-CHUNK!', 1480, 120, 70, PAL.ochre, stampAge, { life: .9, rot: -.1 });
    camEnd();
  }

  // ---------------- 51.16 – 55.38: add a zero, add a zero: hoops, then the spirit level ----------------
  const FL3 = 800, CX3 = 620, V3 = 1000 / (2 * BEAT), TC = [110, 112, 114].map(bt);
  const uOf = i => 20 + 6 * i, ROut = i => 7 * uOf(i) + 45;
  const LX = 1170, LW = 440, LH = 36;
  const carpenter = (u, sw) => {
    HARD(u, sw);
    push(); translate(5.2 * u, -7 * u); rotate(-.9); paint(rectPts(-.3 * u, -2.2 * u, .6 * u, 3 * u, 0), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .5 }); pop();
    paint(rectPts(-5.1 * u, -3 * u, 10.2 * u, .9 * u, u * .03), { wash: '#7A5030', washOp: 255, ink: PAL.ink, sw: sw * .6 });    // tool belt
    paint(rectPts(2.4 * u, -2.6 * u, 1.4 * u, 1.3 * u, u * .03), { wash: '#7A5030', washOp: 255, ink: PAL.ink, sw: sw * .5 });
    paint(rectPts(2.8 * u, -3.5 * u, .35 * u, 1.2 * u, 0), { wash: STEEL, ink: null });
  };
  function hoopHalf(x, y, R, a0, a1, roll) {
    const r = R * .8, pts = [];
    for (let i = 0; i <= 14; i++) { const a = lerp(a0, a1, i / 14); pts.push([x + Math.cos(a) * R, y + Math.sin(a) * R]); }
    for (let i = 14; i >= 0; i--) { const a = lerp(a0, a1, i / 14); pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
    paint(pts, { wash: PAL.cream, washOp: 255, fill: PAL.ochre, fillOp: 80, tex: .5, ink: PAL.ink, sw: 1.3 });
    for (let j = 0; j < 4; j++) {                           // stripes that turn as it rolls
      const a = roll + j * TAU / 4, aa = ((a - a0) % TAU + TAU) % TAU; if (aa > a1 - a0) continue;
      paint([[x + Math.cos(a - .07) * R, y + Math.sin(a - .07) * R], [x + Math.cos(a + .07) * R, y + Math.sin(a + .07) * R],
             [x + Math.cos(a + .07) * r, y + Math.sin(a + .07) * r], [x + Math.cos(a - .07) * r, y + Math.sin(a - .07) * r]], { wash: PAL.clay, ink: null });
    }
  }
  function hoopX(i, t) { const tr = TC[i] - 2 * BEAT; return t < tr ? CX3 + 2 * BEAT * V3 + 30 + 14 * Math.sin(seg(t, tr - .5, tr) * Math.PI) : CX3 + (TC[i] - t) * V3; }
  function level(lyC, bub) {
    paint(rrPts(LX - LW / 2 - 3, lyC - LH / 2 - 3, LW + 6, LH + 6, 8), { wash: PAL.ink, washOp: 255, ink: null });
    paint(rrPts(LX - LW / 2, lyC - LH / 2, LW, LH, 6), { wash: '#F2C53D', washOp: 255, fill: PAL.ochre, fillOp: 60, tex: .4, ink: null });
    paint(rectPts(LX - LW / 2 + 4, lyC + LH / 2 - 9, LW - 8, 6, 0), { wash: '#C88F1A', washOp: 255, ink: null });
    for (const k of [-.36, .36]) paint(ellPts(LX + k * LW, lyC, 9, 9, 12), { wash: '#C88F1A', washOp: 255, ink: null });
    paint(rrPts(LX - 40, lyC - 13, 80, 26, 8), { wash: PAL.ink, washOp: 255, ink: null });
    paint(rrPts(LX - 37, lyC - 10.5, 74, 21, 7), { wash: '#B6D86A', washOp: 255, fill: PAL.sap, fillOp: 60, tex: .3, ink: null });
    paint(ellPts(LX + bub, lyC - 1, 11, 7, 16), { wash: PAL.cream, washOp: 255, ink: null });
    paint(ellPts(LX + bub - 3.5, lyC - 3, 3.2, 1.8, 10), { wash: '#FFFFFF', washOp: 220, ink: null });
    for (const k of [-15, 15]) paint(rectPts(LX + k - .9, lyC - 10.5, 1.8, 21, 0), { wash: PAL.ink, washOp: 255, ink: null });
  }
  function hoopShot(t, lt) {
    const bp = bpOf(t), w = .55 + .2 * seg(t, bt(109), bt(118));
    const lyC = t < bt(115) ? lerp(FL3 - 160, FL3 - 11 - LH / 2, easeIn(seg(t, bt(114.6), bt(115)))) : FL3 - 11 - LH / 2;
    const bub = t < bt(115) ? 0 : 34 * Math.exp(-(t - bt(115)) * 3.2) * Math.cos((t - bt(115)) * 13);
    const zk = ease(seg(t, bt(116), bt(117.5))), zoom = lerp(1, 5.4, zk) * (1 + .012 * pulse(t, 7));
    const [sx, sy] = shakeXY(t, 2 * pulse(t, 8) * (1 - zk) + 7 * Math.exp(-Math.max(0, t - bt(115)) * 10) * (t > bt(115) ? 1 : 0));
    const ccx = lerp(1000, LX, zk), ccy = lerp(615, lyC, zk);
    backdrop(w, 900, 480, 760);
    camBegin(ccx + sx / zoom, ccy + sy / zoom, zoom, ANG);
    logGrid(w, CX3, FL3, 700, ANG, ccx, ccy, 1250 / zoom);
    theLine([[-600, FL3], [2600, FL3]], 22, .6);
    const far = zoom < 2.2;
    // Clawd: grows a size each time it passes through a 0
    const grow = TC.reduce((a, c) => a + backOut(seg(t, c + .05, c + .3)), 0), u = 20 + 6 * grow;
    let jump = 0, inside = -1;
    TC.forEach((c, i) => { const k = seg(t, c - .24, c + .24); if (k > 0 && k < 1) { jump = Math.max(jump, (ROut(i) - 6.3 * uOf(i)) * Math.sin(Math.PI * k)); } if (Math.abs(hoopX(i, t) - CX3) < ROut(i) * 1.05) inside = i; });
    const hoops = [0, 1, 2].filter(i => far && hoopX(i, t) > -400 && t > TC[i] - 4 * BEAT);
    hoops.forEach(i => { const x = hoopX(i, t), R = ROut(i), y = FL3 - 11 - R, roll = -x / R;
      if (i === inside) hoopHalf(x, y, R, Math.PI / 2, Math.PI * 1.5, roll); else { hoopHalf(x, y, R, Math.PI / 2, Math.PI * 1.5, roll); hoopHalf(x, y, R, -Math.PI / 2, Math.PI / 2, roll); } });
    if (far) {
      // the bowlers on the right: a lab-coat Clawd rolls each hoop on the beat, a hard-hat one chants
      const rel = TC.map(c => c - 2 * BEAT), lastRel = rel.filter(r => r <= t + .15).pop() ?? -9, swing = Math.exp(-Math.max(0, t - lastRel) * 5) * (t > lastRel - .15 ? 1 : 0);
      clawd(1880, FL3, 18, { draw: HARD, ...move('stomp', t), mouth: frac(bp) < .45 ? 'O' : 'flat', eyes: 'happy', flip: true });
      clawd(1760, FL3, 18, { draw: labCoat, eyes: 'happy', mouth: 'grin', rot: -.25 * swing, aL: lerp(.2, -.6, swing), aR: lerp(.2, 1.2, swing), sq: .1 * pulse(t, 8) });
    }
    if (far) {
      const look = t > bt(114.4);
      clawd(CX3, FL3, u, { draw: HARD, dy: -jump / u - .3 * pulse(t, 8), sq: jump > 0 ? -.1 : .12 * pulse(t, 8), aL: jump > 0 ? 1.4 : .4, aR: jump > 0 ? 1.4 : .4,
        eyes: look ? 'look' : 'happy', lookX: 1, mouth: jump > 0 ? 'O' : 'grin' });
      TC.forEach(c => { const a = t - c - .05; if (a > 0 && a < .4) paint(starPts(CX3, FL3 - 6 * u, (60 + 260 * a) , .3, 8, a * 2), { fill: PAL.cream, fillOp: 160 * (1 - a / .4), bleed: .2, ink: null }); });
    }
    if (inside >= 0 && far) { const x = hoopX(inside, t), R = ROut(inside); hoopHalf(x, FL3 - 11 - R, R, -Math.PI / 2, Math.PI / 2, -x / R); }
    // the carpenter walks in with a spirit level and sets it on the line: dead centre
    if (far) {
      const kx = kf(t, [[bt(112.5), 2050], [bt(114.4), 1480]], x => x), walking = t > bt(112.5) && t < bt(114.4);
      clawd(kx, FL3, 20, { draw: carpenter, walk: walking ? bp / 2 : undefined, eyes: t > bt(115.2) ? 'happy' : 'narrow', mouth: t > bt(115.4) ? 'grin' : 'flat',
        aL: t < bt(115) ? .05 : -.4, aR: t > bt(115.6) ? 1.3 + .2 * Math.sin(bp * TAU) : .2, dy: walking ? -.3 * Math.abs(Math.sin(bp * Math.PI)) : 0 });
    }
    if (t > bt(112.5)) {
      const lx = t < bt(114.4) ? kf(t, [[bt(112.5), 2050], [bt(114.4), 1480]], x => x) - (1480 - LX) : LX;
      push(); translate(lx - LX, 0); level(lyC, bub); pop();
    }
    if (t > bt(115) && t < bt(115) + .5 && far) sfx('CLUNK', LX - 120, FL3 - 130, 84, PAL.cream, t - bt(115), { life: .5 });
    const dAge = t - bt(116.4);
    if (dAge > 0) {
      paint(starPts(LX + 15, lyC - 9, 5 * backOut(dAge * 3), .35, 4, dAge), { wash: PAL.cream, washOp: 255, ink: null });
      sfx('ding!', LX + 2, lyC - 22, 9, PAL.cream, dAge, { life: 1.2, rot: -.06 });
    }
    camEnd();
  }

  // ---------------- 55.38 – 59.1: never lied... not yet, just wait ----------------
  const FL4 = 760, EDGE = 1480, CX4 = 1000, U4 = 34;
  function roll(x, y, u, a) {
    push(); translate(x, y); rotate(a);
    const L = 13 * u, r = 1.25 * u;
    paint(rrPts(-L / 2, -r, L, 2 * r, .5 * u, 1), { wash: PAL.cream, washOp: 255, fill: PAL.sky, fillOp: 35, tex: .4, ink: PAL.ink, sw: 1.2 });
    for (let i = 1; i < 8; i++) inkLine([[-L / 2 + i * L / 8, -r + 3], [-L / 2 + i * L / 8, r - 3]], .5, PAL.teal, 'inkfine', 0);
    inkLine([[-L / 2 + 6, -r * .25], [L / 2 - 6, -r * .25]], .5, PAL.teal, 'inkfine', 0);
    paint(ellPts(-L / 2, 0, .55 * r, r, 16), { wash: '#EFE4CC', washOp: 255, ink: PAL.ink, sw: 1 });
    const sp = []; for (let k = 0; k < 18; k++) { const aa = k * .75, rr = (k / 18) * .85; sp.push([-L / 2 + Math.cos(aa) * .5 * r * rr, Math.sin(aa) * r * rr]); }
    inkLine(sp, .6, PAL.clay, 'inkfine', .6);
    pop();
  }
  function eraser(x, y, a) {
    push(); translate(x, y); rotate(a);
    paint(rrPts(-34, -16, 68, 32, 7, 1), { wash: '#F08CA0', washOp: 255, fill: PAL.rose, fillOp: 60, tex: .4, ink: PAL.ink, sw: 1 });
    paint(rectPts(4, -16, 30, 32, .5), { wash: PAL.sky, washOp: 255, ink: PAL.ink, sw: .8 });
    pop();
  }
  function megaphone(x, y, k) {                             // opening at x facing left, a trench-coat sleeve from the right
    paint(rectPts(x + 225, y - 40, W + 300 - x, 84, 2), { wash: '#B89B6E', washOp: 255, fill: '#7A6040', fillOp: 40, tex: .5, ink: PAL.ink, sw: 1.3 });
    inkLine([[x + 262, y - 40], [x + 262, y + 44]], 1.2, '#7A6040', 'ink', 0);
    paint([[x, y - 100], [x + 235, y - 26], [x + 235, y + 26], [x, y + 100]], { wash: '#F3EBDC', washOp: 255, fill: PAL.ochre, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.4 });
    paint(rectPts(x + 150, y + 30, 22, 60, 1), { wash: PAL.ink, washOp: 255, ink: null });
    paint(ellPts(x, y, 26, 102, 20, 1), { wash: '#C8643C', washOp: 255, ink: PAL.ink, sw: 1.3 });
    paint(ellPts(x + 4, y, 15, 84, 18, 1), { wash: '#4A2A2A', washOp: 255, ink: null });
    for (let i = 0; i < 3; i++) {                           // squeal waves
      const a = clamp(k * 3 - i * .5), r = 140 + i * 70 + 50 * frac(k * 4);
      if (a > 0) inkLine([[x - r * .55, y - r * .8], [x - r * .78, y], [x - r * .55, y + r * .8]], 2.2 - i * .5, mixCol(PAL.rose, PAL.cream, i * .3), 'ink', .7);
    }
  }
  function waitShot(t, lt) {
    const bp = bpOf(t), w = .85 + .15 * seg(t, bt(118), bt(126));
    const cam = kf(t, [[bt(118), [1090, 560, 1.14]], [bt(123.8), [1100, 545, 1.0]], [59.1, [1160, 520, .8]]]);
    const [sx, sy] = shakeXY(t, 2 * pulse(t, 8));
    backdrop(1, 1300, 380, 800, '#B27A46');                 // the desk the paper lies on, under the lamp
    camBegin(cam[0] + sx, cam[1] + sy, cam[2] * (1 + .012 * pulse(t, 7)), ANG);
    // the sheet of log-log paper, cut off at the right, with a shadow on the desk; the grain of the desk beyond
    push(); translate(EDGE, FL4); rotate(-ANG);
    for (let i = 0; i < 6; i++) inkLine([[30, -900 + i * 170], [1600, -880 + i * 170 + 30 * hash(i)]], .8, WOOD_DK, 'inkfine', .3);
    paint(rectPts(0, -2400, 34, 4800, 0), { fill: PAL.ink, fillOp: 90, bleed: .2, ink: null });
    paint(rectPts(-5000, -2400, 5000, 4800, 0), { wash: bgCol(w), washOp: 255, fill: PAL.clayDk, fillOp: 50, bleed: .1, tex: .5, ink: null });
    pop();
    logGrid(w, EDGE, FL4, 700, ANG, cam[0], cam[1], 1200 / cam[2], 0);
    paint(ellPts(1000, 520, 700, 520, 30, 6), { fill: PAL.ochre, fillOp: 70, bleed: .3, tex: .2, border: 0, ink: null });
    // the line: straight up to the edge of the paper, except for a hair of a wobble at the end, erased by beat 123.6
    const wob4 = 13 * ease(seg(t, bt(120), bt(120.5))) * (1 - ease(seg(t, bt(122.2), bt(123.6))));
    const pts = [[-1500, FL4]];
    for (let x = 1230; x <= EDGE - 6; x += 12) { const k = (x - 1230) / (EDGE - 1230); pts.push([x, FL4 + wob4 * Math.sin(k * 9 + t * 8) * Math.sin(Math.PI * k)]); }
    theLine(pts, 22, .7);
    const erasing = t >= bt(122) && t < bt(123.8);
    // crumbs
    if (erasing) for (let i = 0; i < 10; i++) {
      const e = Math.floor(bp * 4) - i, age = bp * 4 - Math.floor(bp * 4) + i; if (e < 122 * 4) continue;
      paint(ellPts(1380 + (hash(e) - .5) * 160 + (hash(e + 3) - .5) * age * 40, FL4 - 20 - age * 22 + age * age * 4, 4, 3, 8), { wash: '#F08CA0', ink: null });
    }
    // Clawd hugs the roll, notices, glances around, erases, winks
    const m = mood(t, [[0, 'closed', 'heart'], [bt(120.2), 'scared', '!'], [bt(121), 'look'], [bt(122), 'narrow'], [bt(124), 'wink', 'spark']]);
    const glance = t < bt(121.5) ? -1 : t < bt(122) ? 1 : .8, hug = t < bt(120.2);
    const lean = erasing ? .08 : 0;
    clawd(CX4, FL4, U4, { draw: HARD, ...m, lookX: glance, lookY: t >= bt(121) && t < bt(122) ? 0 : .5,
      rot: hug ? .07 * Math.sin(bp * Math.PI) : t >= bt(124) ? -.06 : lean, dy: -.3 * pulse(t, 8), sq: .1 * pulse(t, 8) + (m.eyes === 'wink' ? -.08 * Math.exp(-(t - bt(124)) * 4) : 0),
      aL: -.8, aR: t >= bt(124) ? 1.2 + .15 * pulse(t, 6) : -.8, blush: hug || t >= bt(124),
      mouth: hug ? 'smile' : t < bt(121) ? 'o' : t < bt(122) ? 'flat' : t < bt(124) ? 'cat' : 'grin' });
    roll(CX4 - .3 * U4, FL4 - 2.75 * U4 - .3 * pulse(t, 8) * U4, U4, hug ? .07 * Math.sin(bp * Math.PI) - .05 : -.05);
    if (t >= bt(121.8) && t < bt(124)) {
      const out = ease(seg(t, bt(121.8), bt(122.1))) * (1 - ease(seg(t, bt(123.6), bt(124)))), ex = 1400 + 55 * Math.sin(bp * TAU * 2), ey = FL4 - 22;
      const sh = [CX4 + 4.4 * U4, FL4 - 3.6 * U4], hx = lerp(sh[0] + 20, ex, out), hy = lerp(sh[1], ey, out);
      if (out > .3) { push(); translate(hx, hy); scale(1.5); eraser(0, 0, .2 + .1 * Math.sin(bp * TAU * 2)); pop(); }
      armTo(sh[0], sh[1], hx, hy, U4 * .9);
    }
    camEnd();
    // the Skeptics' megaphone pokes in from the right on beat 125 and squeals; dusk light creeps in with it
    const mk = t - bt(125);
    if (mk > -.1) {
      const k = backOut(clamp(mk / .28));
      paint(ellPts(1900, 420, 700, 520, 26, 8), { fill: PAL.rose, fillOp: 90 * clamp(mk * 3), bleed: .3, tex: .3, ink: null });
      megaphone(lerp(2160, 1620, k), 420, clamp(mk));
      if (mk > .08) sfx('SKREEEE!', 1360, 210, 92, PAL.rose, mk - .08, { life: 1, rot: -.12 });
    }
  }

  chapter('zero', 37.57, 59.1, [[37.57, poemShot], [bt(95), deskShot], [bt(109), hoopShot], [bt(118), waitShot]]);
})();
