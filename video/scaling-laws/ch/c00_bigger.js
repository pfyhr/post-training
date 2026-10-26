// c00_bigger.js: 0-30.07, bars 1-16. A lamp clicks on over one chip; every bar of "Bigger" the camera pulls back a
// decade (chip, board, rack, hall, building, campus, desert) while Clawd stays the same size on screen and hops onto
// each bigger thing. Then the reveal: the lab is a choir of Clawds in hard hats and lab coats, chanting.
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { NIGHT, GRID, SAND, STEEL, STEEL_DK, HARD, HARD_LAMP, labCoat } = SL;
  const STEPS = [3, 4, 5, 6, 7, 8].map(barT);            // one decade per bar
  const zoomAt = t => STEPS.reduce((z, s) => z + ease(seg(t, s - .06, s + .5)), 0);

  // ---------------- graph paper: a self-similar grid, so the decades read as they pass ----------------
  function paper(z) {
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: NIGHT, washOp: 255, fill: PAL.indigo, fillOp: 70, bleed: .2, tex: .5, ink: null });
    const f = frac(z);
    for (let d = -1; d <= 1; d++) {
      const sp = 190 * Math.pow(10, d - f);                   // grid pitch for this decade, in px
      if (sp < 34 || sp > 2400) continue;
      const a = clamp((sp - 34) / 160) * (d === 1 ? 1 : .8), col = mixCol(NIGHT, GRID, .25 + .45 * a), w = .35 + .5 * a;
      for (let x = 960 % sp - sp; x < W + sp; x += sp) inkLine([[x, -20], [x, H + 20]], w, col, 'inkfine', 0);
      for (let y = 540 % sp - sp; y < H + sp; y += sp) inkLine([[-20, y], [W + 20, y]], w, col, 'inkfine', 0);
    }
  }

  // ---------------- the seven levels, each drawn in its own 1920x1080 frame; the child sits at the centre at 1/10 ----------------
  const L = [];
  L[0] = () => {                                            // the chip: Clawd's seat, centre 960,540
    paint(rectPts(740, 320, 440, 440, 3), { wash: '#2E3550', washOp: 255, fill: PAL.night, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.4 });
    for (let i = 0; i < 9; i++) for (const side of [0, 1, 2, 3]) {
      const k = 770 + i * 47; const p = [[k, 304, 16, 18], [k, 758, 16, 18], [724, k - 450 + 20, 18, 16], [1178, k - 450 + 20, 18, 16]][side];
      paint(rectPts(p[0], p[1], p[2], p[3], 1), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .6 });
    }
    paint(rectPts(830, 410, 260, 260, 3), { wash: '#8A93B8', washOp: 255, fill: PAL.sky, fillOp: 90, tex: .6, ink: PAL.ink, sw: 1.1 });
    paint(ellPts(900, 470, 70, 40, 18, 2, -.5), { fill: PAL.cream, fillOp: 140, bleed: .2, ink: null });
    for (let i = 0; i < 5; i++) inkLine([[850, 440 + i * 48], [1070, 440 + i * 48]], .5, STEEL_DK, 'inkfine', 0);
  };
  L[1] = () => {                                            // the board: chip socket in the middle
    paint(rectPts(160, 340, 1600, 400, 4), { wash: '#2F6E5A', washOp: 255, fill: PAL.sap, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.3 });
    for (let i = 0; i < 14; i++) { const y = 360 + i * 27; inkLine([[180, y], [700 + 40 * hash(i), y]], .6, soft(PAL.ochre, .2), 'inkfine', 0); inkLine([[1220 - 40 * hash(i + 5), y], [1740, y]], .6, soft(PAL.ochre, .2), 'inkfine', 0); }
    paint(rectPts(932, 512, 56, 56, 1), { ink: soft(PAL.ochre, .2), sw: .5 });                             // socket
    for (let i = 0; i < 4; i++) paint(rectPts(1300 + i * 70, 380, 38, 320, 2), { wash: PAL.night, washOp: 255, fill: PAL.indigo, fillOp: 60, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 4; i++) paint(rectPts(300 + i * 70, 380, 38, 320, 2), { wash: PAL.night, washOp: 255, fill: PAL.indigo, fillOp: 60, ink: PAL.ink, sw: .9 });
    paint(rectPts(600, 600, 140, 90, 3), { wash: STEEL, washOp: 255, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 6; i++) inkLine([[610, 610 + i * 13], [730, 610 + i * 13]], .6, PAL.ink, 'inkfine', 0);
  };
  // a rack of 4U servers; `full` fills the middle slot too (ours leaves it open for the zoomed board)
  const rack = full => {
    paint(rectPts(850, 255, 220, 570, 4), { wash: STEEL_DK, washOp: 255, fill: PAL.night, fillOp: 80, tex: .5, ink: PAL.ink, sw: 1.3 });
    for (const rx of [862, 1046]) {                       // rails with a hole every 1U (10 px)
      paint(rectPts(rx, 262, 12, 556, 1), { wash: STEEL, washOp: 255, ink: PAL.ink, sw: .5 });
      for (let k = 0; k < 56; k++) paint(rectPts(rx + 4, 264 + k * 10, 4, 4, 0), { wash: PAL.ink, ink: null });
    }
    for (let i = -6; i <= 7; i++) inkLine([[876, 520 + i * 40], [1044, 520 + i * 40]], .8, PAL.ink, 'inkfine', 0);   // 4U dividers
    for (let i = -6; i <= 6; i++) {
      if (i === 0 && !full) continue; const y = 522 + i * 40;
      paint(rectPts(885, y, 150, 36, 1.5), { wash: '#4A5578', washOp: 255, fill: PAL.night, fillOp: 40, tex: .4, ink: PAL.ink, sw: .6 });
      for (let b = 0; b < 6; b++) paint(rectPts(892 + b * 17, y + 6, 13, 24, .5), { wash: STEEL_DK, washOp: 255, ink: PAL.ink, sw: .3 });   // drive bays
      for (let v = 0; v < 3; v++) inkLine([[1000, y + 9 + v * 8], [1022, y + 9 + v * 8]], .4, PAL.ink, 'inkfine', 0);                     // vents
      paint(ellPts(1028, y + 8, 2.6, 2.6, 8), { wash: hash(i + (full ? 17 : 0)) > .3 ? PAL.sap : PAL.ochre, ink: null });
    }
    paint(rectPts(860, 825, 200, 14, 2), { wash: PAL.ink, ink: null });
  };
  // the same rack seen from across the hall: same footprint as rack() at 1/10 (x 949-971, y 511.5-568.5), filled
  // shapes only, since stroke weights don't shrink with the zoom
  const rackFar = (cx, s) => {
    paint(rectPts(cx - 11, 511.5, 22, 57, 0), { wash: PAL.ink, washOp: 255, ink: null });
    paint(rectPts(cx - 10.4, 512.1, 20.8, 55.8, 0), { wash: STEEL_DK, washOp: 255, ink: null });
    if (s < 2) {                                          // whole hall in view: a box and its 4U bars are all that reads
      for (let i = -6; i <= 6; i += 2) paint(rectPts(cx - 8, 540 + (520 + i * 40 - 540) * .1, 16, .7, 0), { wash: '#4A5578', washOp: 255, ink: null });
      return;
    }
    for (const rx of [cx - 9.8, cx + 8.6]) paint(rectPts(rx, 512.2, 1.2, 55.6, 0), { wash: STEEL, washOp: 255, ink: null });
    for (let i = -6; i <= 6; i++) {
      const y = 540 + (522 + i * 40 - 540) * .1;
      paint(rectPts(cx - 6.5, y, 15, 3.6, 0), { wash: '#4A5578', washOp: 255, ink: null });
      paint(rectPts(cx - 6.5, y + 3.6, 15, .5, 0), { wash: PAL.ink, washOp: 200, ink: null });
      paint(ellPts(cx + 6.8, y + .8, .35, .35, 6), { wash: hash(i + 17) > .3 ? PAL.sap : PAL.ochre, ink: null });
    }
  };
  L[2] = () => rack(false);
  L[3] = s => {                                             // the hall: a row of racks under cable trays
    paint(rectPts(250, 420, 1420, 152, 3), { wash: '#232A52', washOp: 255, fill: PAL.teal, fillOp: 35, tex: .4, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(240, 405, 1440, 22, 2), { wash: STEEL, washOp: 255, ink: PAL.ink, sw: 1 });              // roof slab
    paint(rectPts(240, 570.4, 1440, 14, 2), { wash: STEEL_DK, washOp: 255, ink: PAL.ink, sw: .8 });        // floor
    for (let i = -24; i <= 24; i++) {
      if (i === 0) continue; const x = 960 + i * 28; if (x < 270 || x > 1650) continue;
      if (s > 2.5 && Math.abs(i) <= 5) { push(); translate(x, 540); scale(.1); translate(-960, -540); rack(true); pop(); }
      else rackFar(x, s);
    }
    inkLine([[260, 452], [1660, 452]], 1.2, PAL.ochre, 'inkfine', 0); inkLine([[260, 462], [1660, 462]], .8, soft(PAL.ochre, .3), 'inkfine', 0);
    for (let i = 0; i < 6; i++) paint(ellPts(380 + i * 240, 436, 26, 8, 12), { fill: PAL.cream, fillOp: 90, bleed: .2, ink: null });
  };
  L[4] = () => {                                            // the building: the hall is the long lit window
    // steel-blue cladding with panel seams (filled, so they hold up when the wall is seen at 10x around the hall)
    paint(rectPts(460, 390, 1000, 310, 4), { wash: '#7F8BAE', washOp: 255, fill: PAL.indigo, fillOp: 40, tex: .6, ink: PAL.ink, sw: 1.4 });
    for (let x = 500; x < 1460; x += 40) paint(rectPts(x, 392, 1.6, 306, 0), { wash: '#5D6A8C', washOp: 255, ink: null });
    paint(rectPts(882, 523, 156, 26, 0), { wash: PAL.ink, washOp: 255, ink: null });                       // the hall's window
    paint(rectPts(884, 525, 152, 22, 0), { wash: '#232A52', washOp: 255, ink: null });
    const win = (x, y, w, h) => { paint(rectPts(x - 2, y - 2, w + 4, h + 4, 0), { wash: PAL.ink, washOp: 255, ink: null });
      paint(rectPts(x, y, w, h, 0), { wash: PAL.teal, washOp: 235, fill: PAL.cream, fillOp: 40, ink: null }); };
    for (const y of [450, 610]) for (let i = 0; i < 7; i++) win(510 + i * 132, y, 100, 26);
    for (const x of [540, 740, 1100, 1300]) win(x, 523, 120, 24);
    for (let i = 0; i < 6; i++) { const x = 530 + i * 150; paint(rectPts(x, 352, 110, 40, 3), { wash: STEEL, washOp: 255, ink: PAL.ink, sw: .9 }); paint(ellPts(x + 30, 352, 20, 6, 12), { wash: STEEL_DK, ink: PAL.ink, sw: .5 }); paint(ellPts(x + 80, 352, 20, 6, 12), { wash: STEEL_DK, ink: PAL.ink, sw: .5 }); }
    paint(rectPts(400, 698, 1120, 6, 1), { wash: PAL.ink, ink: null });
  };
  const ground = (hz, col = SAND) => {
    paint(rectPts(-2000, hz, W + 4000, 3000, 0), { wash: col, washOp: 255, fill: PAL.clay, fillOp: 50, bleed: .1, tex: .6, ink: null });
    inkLine([[-2000, hz], [W + 2000, hz]], 1, PAL.ink, 'inkfine', 0);
  };
  const box = (x, y, w, h, roof = '#C9BFAE') => {           // a small building seen from far away, base at y
    paint(rectPts(x - w / 2, y - h, w, h, 1), { wash: roof, washOp: 255, ink: PAL.ink, sw: .6 });
    for (let i = 0; i < Math.floor(w / 14); i++) paint(rectPts(x - w / 2 + 5 + i * 14, y - h * .6, 8, h * .2, .5), { wash: PAL.teal, ink: null });
  };
  const pylon = (x, y, h) => {
    inkLine([[x - h * .22, y], [x, y - h], [x + h * .22, y]], .9, PAL.ink, 'inkfine', 0);
    inkLine([[x - h * .3, y - h * .78], [x + h * .3, y - h * .78]], .8, PAL.ink, 'inkfine', 0);
  };
  L[5] = () => {                                            // the campus on the sand
    ground(556);
    [[-430, 34], [-300, 40], [-170, 30], [170, 30], [300, 40], [430, 34]].forEach(([dx, h]) => box(960 + dx, 556, 100, h));
    paint(rectPts(560, 556, 800, 6, 1), { wash: STEEL_DK, ink: null });
    for (let i = 0; i < 6; i++) { const x = 1460 + i * 90; pylon(x, 556, 70); if (i) inkLine([[x - 90 + 15, 502], [x - 45, 512], [x - 15, 502]], .5, PAL.ink, 'inkfine', .6); }
    for (let i = 0; i < 4; i++) paint(rectPts(1380 + i * 22, 530, 16, 26, 1), { wash: STEEL, ink: PAL.ink, sw: .5 });
  };
  L[6] = () => {                                            // the desert: campuses, pylon lines, a town, dunes
    ground(541.6);
    for (let i = 0; i < 6; i++) paint(ellPts(120 + i * 360, 700 + 120 * hash(i), 300, 46, 22, 3), { fill: PAL.clayDk, fillOp: 55, bleed: .2, ink: null });
    for (let i = 0; i < 4; i++) paint([[-100 + i * 560, 541.6], [160 + i * 560, 490 - 30 * hash(i + 3)], [460 + i * 560, 541.6]], { wash: soft(SAND, .1), washOp: 255, fill: PAL.clay, fillOp: 40, tex: .5, ink: PAL.ink, sw: .6, curv: .6 });
    [[-700, 110], [-420, 80], [380, 90], [640, 120]].forEach(([dx, w], k) => { for (let j = 0; j < 5; j++) box(960 + dx + j * (w / 5), 541.6, w / 6, 10 + 8 * hash(k * 5 + j)); });
    for (let i = 0; i < 9; i++) { const x = 1080 + i * 95; pylon(x, 541.6, 48); if (i) inkLine([[x - 95 + 10, 504], [x - 47, 512], [x - 10, 504]], .5, PAL.ink, 'inkfine', .6); }
    for (let i = 0; i < 18; i++) box(1500 + i * 22, 541.6, 16, 10 + 18 * hash(i + 40), soft(PAL.clay, .3));
    for (let i = 0; i < 14; i++) paint(ellPts(1500 + i * 28, 530 - 14 * hash(i + 7), 3, 3, 6), { wash: PAL.ochre, ink: null });
  };

  function levels(z) {
    for (let k = 6; k >= 0; k--) {
      const s = Math.pow(10, k - z);
      if (s > 10.5 || s < .03) continue;
      push(); translate(960, 540); scale(s); translate(-960, -540); L[k](s); pop();
    }
  }

  // where Clawd stands on each level, in screen space at the moment that level is at native size
  const SPOT = [[960, 322], [960, 342], [960, 256], [960, 406], [960, 392], [1250, 640], [1300, 760]];
  function hero(t, z, o = {}) {
    const i = Math.min(5, Math.floor(z)), k = z - i, a = SPOT[i], b = SPOT[Math.min(6, i + 1)];
    const x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k), hop = Math.sin(Math.PI * k);
    const chant = frac(bpOf(t)) < .45 && t > barT(3) - .1;
    clawd(x, y, 22, { draw: HARD, dy: -hop * 3.5, sq: (1 - hop) * .14 * pulse(t, 8), aL: .3 + hop * 1.2 + .3 * pulse(t), aR: .3 + hop * 1.2 + .3 * pulse(t),
      mouth: chant ? 'O' : 'flat', eyes: hop > .2 ? 'happy' : 'normal', ...o });
  }
  const SUP = ['²¹', '²²', '²³', '²⁴', '²⁵', '²⁶', '²⁷'];
  function decadeTag(t, z) {
    const i = Math.round(z), age = t - (i > 0 ? STEPS[i - 1] + .3 : 0);
    letter('10' + SUP[i], 1720, 120, 64, PAL.ochre, { screen: true, pop: clamp(age * 3 + .2), rot: -.05 });
    letter('FLOP', 1720, 182, 26, soft(PAL.ochre, .3), { screen: true, ink: false });
  }

  // A proper hard hat (the engine's 'hard' reads as a yellow beanie): tall dome, raised centre ridge, wide flat brim
  // with a dark underside, a headband under the brim, a shine, and an optional headlamp. Body-local, for o.draw.

  // ---------------- 0 – 3.83: dark, the lamp clicks on, Clawd wakes up on the chip ----------------
  function lamp(t, lt) {
    const zoom = lerp(1.18, 1.0, ease(seg(t, barT(2), barT(3)))), on = barT(2);
    camBegin(960, 520, zoom);
    paper(0); levels(0);
    const m = mood(t, [[0, 'closed', 'zzz'], [bt(6), 'normal', '!'], [bt(7) + .2, 'happy']]);
    const tap = t > bt(7) ? pulse(t, 10) : 0;
    clawd(960, 322, 22, { draw: HARD, ...m, dy: -.3 * m.take, aR: .2 - tap * .6, mouth: t > bt(7) ? 'smile' : null });
    camEnd();
    // lamp: flicker, then a warm pool of light
    const fl = t < on ? 0 : t < on + .08 ? 1 : t < on + .16 ? .15 : t < on + .24 ? 1 : 1;
    const r = fl * lerp(700, 1500, ease(seg(t, on + .24, on + 1.5)));
    paint(ellPts(960, 480, 520, 420, 30, 6), { fill: PAL.ochre, fillOp: 60 * fl, bleed: .3, tex: .3, ink: null });
    if (r < 4) iris(960, 480, 0, PAL.ink); else irisShape(ellPts(960, 480, r, r * .78, 36, 10), PAL.ink);
    if (t >= on && t < on + .5) sfx('click', 1250, 260, 54, PAL.cream, t - on, { life: .5 });
  }

  // ---------------- 3.83 – 15.08: Powers of Ten, a decade a bar ----------------
  function powers(t) {
    const z = zoomAt(t), [sx, sy] = shakeXY(t, 3 * pulse(t, 8));
    camBegin(960 + sx, 540 + sy, 1 + .02 * pulse(t, 7));
    paper(z); levels(z);
    hero(t, z);
    camEnd();
    decadeTag(t, z);
  }

  // ---------------- 15.08 – 30.07: the reveal: the lab is a choir ----------------
  const ROWS = [{ y: 600, u: 10, n: 11, dx: 140 }, { y: 760, u: 12.5, n: 9, dx: 170 }, { y: 930, u: 15, n: 7, dx: 215 }];
  function choir(t, build) {
    paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: NIGHT, washOp: 255, fill: PAL.indigo, fillOp: 60, bleed: .2, tex: .5, ink: null });
    for (let x = 0; x <= W; x += 96) inkLine([[x, -20], [x, 640]], .5, mixCol(NIGHT, GRID, .45), 'inkfine', 0);
    for (let y = 0; y <= 640; y += 96) inkLine([[-20, y], [W + 20, y]], .5, mixCol(NIGHT, GRID, .45), 'inkfine', 0);
    // the line on the back wall grows a notch on every chanted "Bigger" (32 beats, bars 9-16), dots pop as it passes
    const nb = (t - barT(9)) / BEAT, grow = clamp((Math.floor(nb) + easeOut(frac(nb) * 2.5)) / 32);
    const A = [120, 560], B = [1800, 80], at = k => [lerp(A[0], B[0], k), lerp(A[1], B[1], k)], tip = at(grow);
    if (grow > .005) inkLine([A, tip], 3 + 2 * build, PAL.clay, 'ink', 0);
    [.12, .27, .42, .57, .72, .87].forEach((k, i) => { const age = (grow - k) * 32 * BEAT; if (age < 0) return;
      const [x, y] = at(k), r = (9 + 2 * i) * backOut(clamp(age / .25)); paint(ellPts(x, y, r, r, 14, 1), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 40, ink: PAL.ink, sw: .8 }); });
    if (grow > .005 && grow < 1) {
      const g = 44 + 30 * pulse(t, 7);
      paint(ellPts(tip[0], tip[1], g, g, 20, 3), { fill: PAL.ochre, fillOp: 150, bleed: .3, ink: null });
      paint(ellPts(tip[0], tip[1], g * .45, g * .45, 16, 2), { wash: PAL.ochre, washOp: 200, ink: null });
      paint(ellPts(tip[0], tip[1], 11, 11, 12), { wash: PAL.cream, ink: PAL.ink, sw: .6 });
    }
    const spots = build > .5 ? [300, 760, 1160, 1620] : [560, 1360];
    spots.forEach((x, i) => spotlight(x + 40 * wob(t, .25, i * .3), i % 2 ? PAL.cream : soft(PAL.ochre, .2), -60));
    ROWS.forEach((r, ri) => {
      paint(rectPts(-600, r.y, W + 1200, ri === 2 ? 600 : 170, 3), { wash: ri % 2 ? '#7C4A2C' : '#9A6440', washOp: 255, fill: PAL.ink, fillOp: 30, tex: .5, ink: PAL.ink, sw: 1 });
      for (let i = 0; i < r.n; i++) {
        const x = 960 + (i - (r.n - 1) / 2) * r.dx, coat = (i + ri) % 2 === 1, roof = build > .5;
        const m = move(roof ? 'roof' : 'stomp', t + (roof ? 0 : 0), 0), chant = frac(bpOf(t)) < .45;
        clawd(x, r.y + 4, r.u, { ...m, draw: coat ? labCoat : HARD, mouth: chant ? 'O' : 'flat',
          eyes: chant ? 'closed' : 'happy', noShadow: true });
      }
    });
  }
  function conductor(t, x, y, u, raise = 0) {
    const beatArm = .35 + .9 * Math.max(0, Math.sin(bpOf(t) * Math.PI));
    clawd(x, y, u, { draw: HARD_LAMP, flip: false, eyes: raise > .5 ? 'narrow' : 'happy', mouth: raise > .5 ? 'grin' : 'O',
      aR: lerp(beatArm, 1.9, raise), aL: lerp(.2, 1.2, raise), dy: -.4 * pulse(t, 8),
      armR: (uu, sw) => { inkLine([[0, 0], [3.4 * uu, -.4 * uu]], sw * 1.2, PAL.cream, 'ink', 0); paint(ellPts(3.5 * uu, -.42 * uu, .3 * uu, .3 * uu, 10), { wash: PAL.ochre, ink: null }); } });
  }
  function choirWide(t, lt) {
    const z = lerp(1.0, 1.12, ease(seg(t, barT(9), barT(13)))), [sx, sy] = shakeXY(t, 2 * pulse(t, 8));
    const reveal = 1 - ease(seg(lt, 0, .5));                   // the last campus frame shrinks away into the back wall
    camBegin(960 + sx, 600 + sy, z);
    choir(t, t > barT(11) ? .6 : 0);
    conductor(t, 300, 1130, 34);
    camEnd();
    if (reveal > .02) flash(reveal * .8, PAL.cream);
  }
  // bars 13-16: cuts get faster, a bar, then two beats, then a beat
  const CUTS = [[barT(13), 960, 900, 1.9], [barT(14), 330, 880, 1.7], [barT(15), 700, 720, 2.1], [bt(58), 1260, 560, 2.4],
                [bt(60), 960, 900, 1.9], [bt(62), 330, 880, 1.6]];
  function choirCuts(t) {
    let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k;
    const lt = t - c[0], [sx, sy] = shakeXY(t, 4 * pulse(t, 8));
    camBegin(c[1] + sx + lt * 12, c[2] + sy, c[3] * (1 + .03 * lt));
    choir(t, t > barT(15) ? .6 : 0);
    conductor(t, 300, 1130, 34);
    camEnd();
  }
  function finale(t, lt, dur) {                             // bar 16: pull back, arms up, baton high, white out
    const k = seg(t, barT(16), barT(17)), [sx, sy] = shakeXY(t, 2 + 10 * k);
    camBegin(960 + sx, 600 + sy, lerp(1.25, .96, easeOut(k)));
    choir(t, 1);
    conductor(t, 300, 1130, 34, ease(seg(t, barT(16), bt(63) + .2)));
    camEnd();
    flash(easeIn(seg(t, barT(17) - .3, barT(17))), PAL.cream);
  }

  chapter('bigger', 0, barT(17), [[0, lamp], [barT(3) - .06, powers], [barT(9), choirWide], [barT(13), choirCuts], [barT(16), finale]]);
})();
