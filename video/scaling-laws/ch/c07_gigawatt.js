// c07_gigawatt.js: 135.04-157.53, bars 73-84. Chorus 2. The gold flood from the broken dam drains away and the
// festival is ten times bigger: a stage on the roof of the campus, a building-sized lead Clawd in the chrome robot
// helmet, a crowd of thousands of dots. The loss line is a ski run, lightning lights the town to the horizon, the
// lead Clawd hugs a power station while the choir pedals generators, and the choir holds up their falling-loss
// placards until everything snaps to black on the last syllable.
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { STEEL, STEEL_DK, HARD, labCoat } = SL;
  const GOLD = '#F2B33D', GOLD_LT = '#FFD978', NEON = '#3FF0D8', PINK = '#FF5FA2', PLUM = '#2B1E5C', DUSK = '#3E2A4E';
  const T0 = barT(73), T1 = 157.53, BLACK = 157.3;
  const chant = t => frac(bpOf(t)) < .45;

  // the robot helmet is shared by the three choruses (sl_cast.js); here it catches the gold
  const robotHelmet = glow => SL.robotHelmet(glow, { tint: GOLD }), visor = SL.helmetGlow;
  // the lead Clawd: robot helmet, chants on the beat
  // the helmet is drawn after the arms, so raised arms are painted again on top, with the engine's arm geometry
  const overArm = SL.overArm;
  const lead = (t, x, y, u, o = {}) => {
    const q = { draw: robotHelmet(visor(t)), mouth: chant(t) ? 'O' : 'grin', ...o };
    for (const k of ['aL', 'aR']) if (q[k] > .95) q[k] = .95 + (q[k] - .95) * .25;   // raised arms in a V, clear of the body
    clawd(x, y, u, q);
    if (!o.noOver) for (const [side, a] of [[-1, q.aL ?? .2], [1, q.aR ?? .2]]) if (a > .35) overArm(x, y, u, side, a, q);
  };

  // ---------------- a 2D dot layer: thousands of tiny things (crowd, town lights, confetti) cheaply ----------------
  // Drawn with plain canvas calls in world space (cam = {cx, cy, z} as camBegin) and composited into the painting.
  let DG = null;
  function dotLayer(cam, fn) {
    if (!DG) { DG = createGraphics(W, H); DG.pixelDensity(1); }
    DG.clear(); const c = DG.drawingContext; c.save();
    if (cam) c.setTransform(cam.z, 0, 0, cam.z, 960 - cam.cx * cam.z, 540 - cam.cy * cam.z); else c.setTransform(1, 0, 0, 1, 0, 0);
    fn(c); c.restore();
    push(); resetMatrix(); translate(-W / 2, -H / 2);
    brush.noStroke(); brush.noHatch(); brush.noWash(); brush.fill('#000000', 1); brush.fillBleed(0); brush.fillTexture(0, 0);
    brush.polygon([[-50, -50], [-40, -50], [-40, -40]]); brush.noFill();
    image(DG, 0, 0); pop();
  }
  const CROWD = ['#D97757', '#E8896A', '#C8664A', '#F2A283', '#D97757', '#B95A42'];
  // a field of tiny Clawds from row y0 (far, size s0) to y1 (near, size s1); everyone lands on the beat, a ripple
  // runs outward from (ox, oy). skip(x, y) leaves holes.
  function crowd(c, t, x0, x1, y0, y1, s0, s1, o = {}) {
    const bp = bpOf(t), ox = o.ox ?? 960, oy = o.oy ?? y0;
    let y = y0, row = 0;
    while (y < y1) {
      const k = (y - y0) / (y1 - y0), s = lerp(s0, s1, k), dx = s * (o.gap ?? 2.5);
      for (let x = x0 + hash(row * 7.3) * dx, i = 0; x < x1; x += dx, i++) {
        const id = row * 997 + i, px = x + (hash(id) - .5) * s * .7, py = y + (hash(id + .5) - .5) * s * .5;
        if (o.skip && o.skip(px, py)) continue;
        const ph = hash(id + 3) * .12 + Math.hypot(px - ox, py - oy) * .00025;
        const jump = s * (o.jump ?? 1) * Math.abs(Math.sin((bp - ph) * Math.PI)), by = py - jump;
        c.fillStyle = CROWD[Math.floor(hash(id + 9) * CROWD.length)];
        c.fillRect(px - s * .8, by - s, s * 1.6, s * .95);
        if (s > 4.5) { c.fillStyle = '#2B2233'; c.fillRect(px - s * .5, by - s * .78, s * .16, s * .26); c.fillRect(px + s * .28, by - s * .78, s * .16, s * .26); }
        if (s > 6) { c.fillStyle = '#A84D33'; c.fillRect(px - s * .7, by - s * .05, s * .22, s * .25); c.fillRect(px + s * .45, by - s * .05, s * .22, s * .25); }
        const h = hash(id + 21);
        if (h > .8) {                                        // glow sticks
          const sway = Math.sin((bp + hash(id)) * Math.PI) * s * .5;
          c.strokeStyle = h > .93 ? PINK : h > .86 ? NEON : GOLD_LT; c.lineWidth = Math.max(1, s * .24); c.lineCap = 'round';
          c.beginPath(); c.moveTo(px + s * .8, by - s * .6); c.lineTo(px + s * 1.05 + sway, by - s * 1.9); c.stroke();
        }
      }
      y += s * (o.rowGap ?? 1.45); row++;
    }
  }
  // town lights strung along the horizon; `lit` 0..1 is the share switched on
  function townLights(c, t, hz, x0, x1, lit) {
    for (let i = 0, x = x0; x < x1; i++, x += 5 + 6 * hash(i * 3.1)) {
      const d = hash(i + .7), y = hz - 1.5 - d * d * 12, on = hash(i + 40) < lit;
      c.fillStyle = on ? (hash(i + 2) > .3 ? GOLD_LT : '#FFF5E2') : '#3A2A4A';
      const s = on ? 1.6 + 1.6 * hash(i + 5) : 1.5; c.fillRect(x, y - s, s * (1 + hash(i + 8)), s);
    }
  }

  // ---------------- sky and ground: festival night lit gold from the horizon ----------------
  function sky(hz, t, glow = 1) {
    paint(rectPts(-1400, -1400, W + 2800, hz + 1420), { wash: PLUM, washOp: 255, fill: PAL.violet, fillOp: 90, bleed: .2, tex: .5, ink: null });
    paint(ellPts(960, hz, 2300, 760, 40, 10), { wash: '#5A2E72', washOp: 255, fill: PAL.violet, fillOp: 60, bleed: .3, tex: .4, ink: null });
    paint(ellPts(960, hz, 1800, 520, 40, 10), { wash: '#B8487A', washOp: 255, fill: PAL.rose, fillOp: 90, bleed: .3, tex: .5, ink: null });
    paint(ellPts(960, hz, 1350, 330, 40, 8), { wash: '#EE8248', washOp: 255, fill: PAL.ochre, fillOp: 100, bleed: .3, tex: .5, ink: null });
    paint(ellPts(960, hz, 950, 190, 36, 6), { wash: GOLD, washOp: 255, fill: GOLD_LT, fillOp: 120 * glow, bleed: .3, tex: .4, ink: null });
    paint(ellPts(960, hz, 520, 85, 30, 4), { wash: GOLD_LT, washOp: 230, ink: null });
    for (let i = 0; i < 14; i++) {                          // a few stars high up
      const x = -300 + hash(i + 70) * 2500, y = hz - 380 - hash(i + 90) * 900, r = 3 + 3 * hash(i) + 2 * pulse(t + hash(i), 4);
      paint(starPts(x, y, r * 1.8, .35), { wash: '#FFF5E2', washOp: 220, ink: null });
    }
  }
  function ground(hz, pool = [960, hz + 160, 1100, 280]) {
    paint(rectPts(-1400, hz, W + 2800, 2400), { wash: DUSK, washOp: 255, fill: '#5B3A5A', fillOp: 90, bleed: .1, tex: .6, ink: null });
    paint(ellPts(pool[0], pool[1], pool[2], pool[3], 30, 8), { fill: GOLD, fillOp: 110, bleed: .3, tex: .5, ink: null });
    for (let i = 0; i < 5; i++) paint([[-900 + i * 700, hz + 2], [-560 + i * 700, hz - 30 - 26 * hash(i + 3)], [-120 + i * 700, hz + 2]], { wash: '#6B3E5E', washOp: 255, fill: '#4A2E48', fillOp: 70, ink: null, curv: .7 });
    inkLine([[-1400, hz], [W + 1400, hz]], .8, PAL.ink, 'inkfine', 0);
  }
  // a lattice pylon, base (x, y), height h
  function pylon(x, y, h, glow = 0) {
    const sw = clamp(h / 260, .35, 1.8), c = mixCol('#2B2233', NEON, glow * .6);
    if (glow > .02) paint(ellPts(x, y - h * .8, h * .5, h * .4, 20, 3), { fill: NEON, fillOp: 140 * glow, bleed: .3, ink: null });
    const L = [[x - .2 * h, y], [x - .07 * h, y - .62 * h], [x - .04 * h, y - h]], R = L.map(([px, py]) => [2 * x - px, py]);
    inkLine(L, sw * 1.2, c, 'ink', 0); inkLine(R, sw * 1.2, c, 'ink', 0);
    const zz = []; for (let k = 0; k <= 7; k++) { const f = k / 7, yy = y - f * .62 * h, w = lerp(.2, .07, f) * h; zz.push([x + (k % 2 ? w : -w), yy]); }
    inkLine(zz, sw * .7, c, 'inkfine', 0);
    for (const [ay, aw] of [[.8, .34], [.64, .26]]) {
      inkLine([[x - aw * h, y - ay * h], [x + aw * h, y - ay * h]], sw, c, 'ink', 0);
      inkLine([[x - aw * h, y - ay * h], [x, y - (ay + .1) * h], [x + aw * h, y - ay * h]], sw * .6, c, 'inkfine', 0);
    }
  }

  // ---------------- the festival on the campus roof ----------------
  const HZ = 520;
  function beams(t, origins) {
    origins.forEach(([x, y, base], i) => {
      const a = base + .22 * Math.sin(t * .9 + i * 1.7), L = 1700, dx = Math.sin(a), dy = -Math.cos(a), nx = -dy, ny = dx, w0 = 8, w1 = 150;
      paint([[x + nx * w0, y + ny * w0], [x + dx * L + nx * w1, y + dy * L + ny * w1], [x + dx * L - nx * w1, y + dy * L - ny * w1], [x - nx * w0, y - ny * w0]],
        { fill: i % 2 ? PINK : NEON, fillOp: 40 + 70 * pulse(t, 4), bleed: .08, tex: .2, border: .1, ink: null });
    });
  }
  function hall(x, y, w, h, rows, lit = 1) {
    paint(rectPts(x, y, w, h, 2), { wash: '#4B4F7A', washOp: 255, fill: PAL.indigo, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(x - 8, y - 12, w + 16, 16, 1), { wash: STEEL, washOp: 255, ink: PAL.ink, sw: .9 });
    for (let k = 0; k < rows; k++) {
      const yy = y + h * (k + .6) / (rows + .4);
      paint(rectPts(x + 22, yy, w - 44, h * .12, 1), { wash: lit ? GOLD_LT : '#2E2A4E', washOp: 255, ink: PAL.ink, sw: .6 });
      for (let j = 1; j < Math.floor((w - 44) / 60); j++) paint(rectPts(x + 22 + j * 60, yy, 2.5, h * .12, 0), { wash: '#4B4F7A', ink: null });
    }
    paint(rectPts(x, y + h - 6, w, 6, 0), { wash: STEEL_DK, ink: null });
  }
  function stage(t) {
    // truss and the LED screen behind the hero
    paint(rectPts(650, 112, 620, 300, 2), { wash: '#1C1A2E', washOp: 255, ink: PAL.ink, sw: 1.1 });
    for (let i = 1; i < 7; i++) inkLine([[650 + i * 88.6, 118], [650 + i * 88.6, 406]], .6, mixCol('#1C1A2E', PAL.teal, .7), 'inkfine', 0);
    for (let i = 1; i < 5; i++) inkLine([[656, 112 + i * 60], [1264, 112 + i * 60]], .6, mixCol('#1C1A2E', PAL.teal, .7), 'inkfine', 0);
    paint([[660, 122], [690, 122], [1262, 386], [1262, 408], [1226, 408], [660, 152]], { fill: PAL.clay, fillOp: 120 + 80 * pulse(t, 5), bleed: .2, ink: null });
    inkLine([[666, 132], [1256, 398]], 6, PAL.clayLt, 'ink', 0);
    for (const tx of [575, 1311]) {
      paint(rectPts(tx, 70, 34, 350, 1), { wash: '#9AA3BC', washOp: 255, ink: PAL.ink, sw: .9 });
      const z = []; for (let k = 0; k <= 13; k++) z.push([tx + (k % 2 ? 30 : 4), 76 + k * 26]); inkLine(z, .7, STEEL_DK, 'inkfine', 0);
    }
    paint(rectPts(575, 66, 770, 30, 1), { wash: '#9AA3BC', washOp: 255, ink: PAL.ink, sw: .9 });
    const z = []; for (let k = 0; k <= 28; k++) z.push([579 + k * 27, k % 2 ? 92 : 70]); inkLine(z, .7, STEEL_DK, 'inkfine', 0);
    for (let i = 0; i < 7; i++) { const x = 640 + i * 107; paint(rrPts(x - 12, 94, 24, 22, 5), { wash: '#2B2233', ink: PAL.ink, sw: .6 });
      paint(ellPts(x, 116, 9, 5, 10), { wash: i % 2 ? PINK : NEON, washOp: 160 + 95 * pulse(t, 5), ink: null }); }
    // speakers, cones kicking on the beat
    for (const sx of [600, 1248]) {
      paint(rectPts(sx, 296, 72, 124, 2), { wash: '#2B2233', washOp: 255, fill: PAL.violet, fillOp: 40, ink: PAL.ink, sw: .9 });
      for (const [cy, r] of [[324, 16], [378, 26]]) { const k = r * (1 + .14 * pulse(t, 7)); paint(ellPts(sx + 36, cy, k, k, 16), { wash: '#4A4060', ink: PAL.ink, sw: .6 }); paint(ellPts(sx + 36, cy, k * .35, k * .35, 10), { wash: '#1C1A2E', ink: null }); }
    }
  }
  function decks(t) {
    paint(rectPts(760, 372, 400, 48, 2), { wash: '#2B2233', washOp: 255, fill: PAL.violet, fillOp: 50, ink: PAL.ink, sw: 1 });
    paint(rectPts(760, 376, 400, 5, 0), { wash: NEON, washOp: 150 + 100 * pulse(t, 5), ink: null });
    for (const cx of [850, 1070]) { paint(ellPts(cx, 372, 60, 10, 18), { wash: '#C9CED8', ink: PAL.ink, sw: .7 }); paint(ellPts(cx, 372, 42, 7, 16), { wash: '#1C1A2E', ink: null }); paint(ellPts(cx, 371, 5, 2, 8), { wash: PINK, ink: null }); }
    paint(rectPts(936, 362, 48, 14, 1), { wash: STEEL, ink: PAL.ink, sw: .6 });
    for (let i = 0; i < 6; i++) paint(rectPts(800 + i * 58, 396, 30, 8, 0), { wash: i % 2 ? PINK : GOLD_LT, washOp: 120 + 130 * pulse(t - i * .05, 6), ink: null });
  }
  // the whole festival in world space; cam = {cx, cy, z}; o.town 0..1 (lit share of the horizon), o.hero (pose)
  function festival(t, cam, o = {}) {
    camBegin(cam.cx, cam.cy, cam.z, cam.rot || 0);
    sky(HZ, t);
    ground(HZ, [960, 700, 1250, 260]);
    for (let i = 0; i < 6; i++) { const x = -260 + i * 120; pylon(x, HZ + 4, 46 - i * 3); }
    for (let i = 0; i < 6; i++) { const x = 2180 - i * 120; pylon(x, HZ + 4, 46 - i * 3); }
    beams(t, [[592, 70, -.55], [1328, 70, .55], [700, 418, -.2], [1220, 418, .2]]);
    camEnd();
    dotLayer(cam, c => { townLights(c, t, HZ, -1400, 3300, o.town ?? .25); crowd(c, t, -1400, 3300, HZ + 6, HZ + 128, 1.4, 3.6, { oy: 650, jump: .8 }); });
    camBegin(cam.cx, cam.cy, cam.z, cam.rot || 0);
    hall(120, 530, 360, 122, 2); hall(1440, 530, 360, 122, 2);
    hall(520, 440, 880, 212, 3);
    stage(t);
    lead(t, 960, 420, 29, { noShadow: true, ...(o.hero || {}) });
    decks(t);
    paint(rectPts(556, 418, 808, 24, 1), { wash: '#2B2233', washOp: 255, ink: PAL.ink, sw: 1 });            // roof deck
    paint(rectPts(556, 436, 808, 5, 0), { wash: PINK, washOp: 160 + 95 * pulse(t, 5), ink: null });
    camEnd();
    dotLayer(cam, c => crowd(c, t, -1400, 3300, 662, 1500, 5, 17, { oy: 650, gap: 2.6, rowGap: 1.7, skip: (x, y) => Math.abs(x - 960) > 560 + (y - 650) * 2.6 + 90 * Math.sin(y * .05) }));
  }

  // ---------------- 135.04: the flood of gold drains away; the festival, ten times bigger ----------------
  function reveal(t, lt, dur) {
    const k = easeOut(seg(lt, 0, dur)), [sx, sy] = shakeXY(t, 4 * pulse(t, 8));
    const cam = { cx: 960 + sx, cy: lerp(250, 470, k) + sy, z: lerp(2.0, 1.0, k) };
    const up = backOut(seg(lt, 0, .35));
    festival(t, cam, { hero: { aL: lerp(-.2, 1.5, up) + .2 * pulse(t, 6), aR: lerp(-.2, 1.5, up) + .2 * pulse(t, 6), dy: -.6 * pulse(t, 7), sq: .1 * pulse(t, 8) } });
    // the gold light from the dam, draining
    const g = 1 - ease(seg(lt, 0, .55));
    if (g > .01) {
      paint(rectPts(-60, -60, W + 120, H + 120), { wash: GOLD_LT, washOp: 255 * g, ink: null });
      paint(ellPts(960, 540, 1100, 700, 30, 10), { wash: '#FFE9A8', washOp: 255 * g * g, ink: null });
    }
  }

  // ---------------- 136.91: the loss line is a mountain ski run; the choir skis down it two by two ----------------
  const S0 = [460, 352], S1 = [1440, 790], SANG = Math.atan2(S1[1] - S0[1], S1[0] - S0[0]);
  const skis = hat => (u, sw) => {
    hat(u, sw);
    paint([[-6.6 * u, .05 * u], [6.2 * u, .05 * u], [7.4 * u, -.9 * u], [7.7 * u, -.55 * u], [6.6 * u, .6 * u], [-6.6 * u, .6 * u]], { wash: PINK, washOp: 255, ink: PAL.ink, sw: sw * .6 });
  };
  function skier(t, a, i, side) {                            // a = time since launch
    const D = 2.3 * BEAT, F = 1.25 * BEAT, coat = (i + side) % 2 === 1, draw = skis(coat ? labCoat : HARD);
    if (a < 0) return;
    if (a < D) {
      const p = Math.pow(a / D, 1.5), x = lerp(S0[0], S1[0], p) - side * 34, y = lerp(S0[1], S1[1], p) - side * 34 * Math.tan(SANG);
      for (let k = 1; k <= 3; k++) if (p > .08) { const q = Math.max(0, p - k * .03); paint(ellPts(lerp(S0[0], S1[0], q) - side * 34, lerp(S0[1], S1[1], q) - side * 34 * Math.tan(SANG) - 10, 26 - k * 5, 12 - k * 2, 12, 3), { fill: '#FFFFFF', fillOp: 150 - k * 30, bleed: .3, ink: null }); }
      clawd(x, y, 12, { draw, rot: SANG, noShadow: true, aL: 1.0, aR: -.4, eyes: p > .4 ? 'spark' : 'happy', mouth: 'O', dy: -.15 * pulse(t, 8) });
    } else if (a < D + F) {
      const f = (a - D) / F, x = lerp(1470, 1800, f) - side * 34, y = 792 - 300 * 4 * f * (1 - f) + 150 * f;
      clawd(x, y, 12, { draw, rot: SANG - f * TAU, noShadow: true, aL: 1.6, aR: 1.6, eyes: 'happy', mouth: 'O' });
    }
  }
  function mountain(t) {
    paint([[-300, 1300], [-300, 470], [120, 360], [S0[0], S0[1]], [S1[0], S1[1]], [1530, 806], [1600, 772], [1620, 830], [2300, 900], [2300, 1300]],
      { wash: '#FFF2DC', washOp: 255, fill: GOLD_LT, fillOp: 90, bleed: .1, tex: .6, ink: PAL.ink, sw: 1.4 });
    // log-log paper on the snow: decade lines thicken every tenth
    const slopeX = y => S0[0] + (y - S0[1]) / Math.tan(SANG);
    for (let d = 0; d < 3; d++) for (let k = 1; k <= 9; k++) {
      const x = 120 + (d + Math.log10(k)) * 520; if (x > 1680) continue;
      const top = x < S0[0] ? 360 : S0[1] + (x - S0[0]) * Math.tan(SANG);
      inkLine([[x, top + 4], [x, 1200]], k === 1 ? 1.1 : .5, mixCol('#FFF2DC', PAL.teal, k === 1 ? .7 : .45), 'inkfine', 0);
    }
    for (let d = 0; d < 2; d++) for (let k = 1; k <= 9; k++) {
      const y = 1180 - (d + Math.log10(k)) * 420; if (y < 370) continue;
      inkLine([[-280, y], [Math.min(2280, slopeX(y)) - 4, y]], k === 1 ? 1.1 : .5, mixCol('#FFF2DC', PAL.teal, k === 1 ? .7 : .45), 'inkfine', 0);
    }
    // the Line itself is the run: thicker and glowier than last chorus
    const g = 1 + .4 * pulse(t, 5), n = [-Math.sin(SANG), Math.cos(SANG)];
    paint([[S0[0] - n[0] * 26 * g, S0[1] - n[1] * 26 * g], [S1[0] - n[0] * 26 * g, S1[1] - n[1] * 26 * g], [S1[0] + n[0] * 10, S1[1] + n[1] * 10], [S0[0] + n[0] * 10, S0[1] + n[1] * 10]],
      { fill: PAL.clay, fillOp: 150, bleed: .25, tex: .3, ink: null });
    inkLine([[S0[0] - 60, S0[1] + 2], S0, S1, [1530, 806], [1600, 772]], 8, PAL.clay, 'ink', 0);
    // the kicker
    paint([[1500, 812], [1604, 768], [1612, 830]], { wash: '#9A6440', washOp: 255, ink: PAL.ink, sw: 1 });
    // start gate flags
    for (const [x, c] of [[400, PINK], [520, NEON]]) { inkLine([[x, 356], [x, 266]], 1.4, PAL.ink, 'ink', 0); paint([[x, 266], [x + 44, 280], [x, 296]], { wash: c, ink: PAL.ink, sw: .7 }); }
  }
  function skiRun(t, lt, dur) {
    const [sx, sy] = shakeXY(t, 3 * pulse(t, 8)), z = lerp(1.0, 1.06, ease(lt / dur));
    camBegin(980 + sx, 540 + sy, z);
    sky(760, t, .8);
    for (let i = 0; i < 4; i++) paint([[-200 + i * 620, 800], [180 + i * 620, 330 + 80 * hash(i + 2)], [620 + i * 620, 800]], { wash: '#6B3E78', washOp: 255, fill: PAL.violet, fillOp: 60, ink: null, curv: .25 });
    beams(t, [[1300, 820, -.25], [1750, 820, .2]]);
    camEnd();
    const cam = { cx: 980 + sx, cy: 540 + sy, z };
    camBegin(cam.cx, cam.cy, cam.z);
    mountain(t);
    // the lead at the top of the run, sending each pair off on the beat
    const push1 = pulse(t, 6);
    lead(t, 230, 362, 24, { aR: lerp(1.3, -.1, push1), aL: .5 + .3 * push1, dy: -.3 * push1, sq: .08 * pulse(t, 9) });
    const b0 = beatN(t);
    for (let k = b0 - 4; k <= b0; k++) for (const side of [0, 1]) skier(t, t - bt(k) - side * .07, k, side);
    camEnd();
    dotLayer(cam, c => crowd(c, t, 1600, 2500, 830, 1300, 7, 13, { ox: 1800, oy: 900, jump: 1.3 }));
    // splash: each landing throws the crowd a little cheer
    const land = frac(bpOf(t) - 3.55 + 1);
    if (land < .5) sfx('WHEE!', 1640, 560, 64, PINK, land * BEAT, { life: .3, rot: .1 });
  }

  // ---------------- 140.66: the big wide: building-sized lead, thousands jumping, tilt out ----------------
  function crowdWide(t, lt, dur) {
    const k = ease(lt / dur), [sx, sy] = shakeXY(t, 3 * pulse(t, 8));
    const roof = move('roof', t);
    festival(t, { cx: 960 + sx, cy: lerp(430, 540, k) + sy, z: lerp(1.18, .8, k), rot: lerp(.02, -.015, k) },
      { town: .3, hero: { ...roof, dy: roof.dy * .6, aL: roof.aL + .2, aR: roof.aR + .2 } });
  }

  // ---------------- 144.41: lightning hits a pylon on the downbeat; the town lights block by block ----------------
  const THZ = 360, RK = .55, rowY = r => THZ + 540 / (1 + RK * r), rowF = r => 1 / (1 + RK * r);
  const spread = t => { const b = (t - barT(78)) / BEAT; if (b < 0) return -1; const bb = Math.floor(b) + easeOut(clamp(frac(b) * 3)); return 1.7 * Math.pow(bb + .6, 2); };
  const ringOf = (c, r) => Math.hypot(c + 1.8, r * 1.6);
  const BOLT = [[480, -80], [300, 20], [440, 100], [286, 180], [404, 240], [326, 290], [362, 318]];
  const PYL = [[360, 950, 620], [760, 712, 330], [1040, 610, 200], [1230, 548, 128], [1370, 508, 84], [1470, 482, 56], [1545, 463, 38]];
  function block(x, y, f, lit, flare) {
    const w = 150 * f, h = 70 * f, rh = 44 * f;
    paint([[x - w / 2, y - h], [x - w / 2 + 14 * f, y - h - rh], [x + w / 2 + 14 * f, y - h - rh], [x + w / 2, y - h]], { wash: lit ? '#8E6A7E' : '#4A3A66', washOp: 255, ink: PAL.ink, sw: .5 + .4 * f });
    paint(rectPts(x - w / 2, y - h, w, h, f), { wash: lit ? '#6E4A66' : '#2A2042', washOp: 255, ink: PAL.ink, sw: .5 + .5 * f });
    if (lit) {
      if (f > .3) paint(ellPts(x, y - h * .4, w * .9, h * 1.2, 16, 2), { fill: GOLD, fillOp: 90 + 120 * flare, bleed: .3, ink: null });
      for (let j = 0; j < 3; j++) paint(rectPts(x - w / 2 + w * (.12 + j * .3), y - h * .75, w * .18, h * .4, 0), { wash: flare > .3 ? '#FFF5E2' : GOLD_LT, washOp: 255, ink: null });
    }
  }
  function lightning(t, lt, dur) {
    const a = lt, [sx, sy] = shakeXY(t, 14 * Math.exp(-a * 5) + 2 * pulse(t, 8)), z = lerp(1.06, .94, ease(lt / dur));
    const cam = { cx: 960 + sx, cy: lerp(540, 500, ease(lt / dur)) + sy, z }, sp = spread(t);
    camBegin(cam.cx, cam.cy, cam.z);
    sky(THZ, t, .7);
    paint(rectPts(-800, THZ, W + 1600, 1600), { wash: '#33223F', washOp: 255, fill: DUSK, fillOp: 80, tex: .6, ink: null });
    inkLine([[-800, THZ], [W + 800, THZ]], .7, PAL.ink, 'inkfine', 0);
    // the storm cloud the bolt drops out of
    for (let i = 0; i < 5; i++) paint(ellPts(260 + i * 70, 20 + 18 * Math.sin(i * 2.1), 110, 60, 18, 4), { wash: '#2A2050', washOp: 255, fill: PAL.indigo, fillOp: 80, ink: i === 2 ? PAL.ink : null, sw: .8 });
    camEnd();
    // the far town, to the horizon
    dotLayer(cam, c => {
      for (let r = 60; r >= 5; r--) {
        const f = rowF(r), y = rowY(r), n = Math.ceil(1500 / (260 * f));
        for (let ci = -n; ci <= n; ci++) {
          if (hash(r * 131 + ci) < .18) continue;
          const x = 960 + (ci - .5) * 260 * f, w = 150 * f, h = 70 * f + 44 * f, on = ringOf(ci, r) < sp;
          c.fillStyle = on ? '#6E4A66' : '#2A2042'; c.fillRect(x - w / 2, y - h, w, h);
          if (on) { c.fillStyle = hash(r + ci * 3) > .4 ? GOLD_LT : '#FFF5E2'; c.fillRect(x - w * .35, y - h * .55, w * .7, Math.max(1, h * .25)); }
        }
      }
    });
    camBegin(cam.cx, cam.cy, cam.z);
    for (let r = 4; r >= 0; r--) {
      const f = rowF(r), y = rowY(r), n = Math.ceil(1300 / (260 * f));
      for (let ci = -n; ci <= n; ci++) {
        const x = 960 + (ci - .5) * 260 * f; if (r <= 1 && Math.abs(x - 360) < 170) continue;
        if (hash(r * 131 + ci) < .12) continue;
        const ring = ringOf(ci, r), on = ring < sp, flare = on ? 1 - clamp((sp - ring) / 3) : 0;
        block(x, y, f, on, flare);
      }
    }
    // pylons marching into town, cables glowing as the power runs along them
    const hit = Math.exp(-a * 2.2);
    PYL.forEach(([x, y, h], i) => {
      const live = clamp((sp - i * 2.2) / 2);
      if (i) { const [px, py, ph] = PYL[i - 1]; inkLine([[px + .34 * ph, py - .8 * ph], [(px + x) / 2 + 20, (py - .8 * ph + y - .8 * h) / 2 + 26 * (h / 300)], [x - .34 * h, y - .8 * h]], .5 + h / 300, mixCol('#2B2233', NEON, live), 'inkfine', .6); }
      pylon(x, y, h, i === 0 ? Math.max(hit, .3 * pulse(t, 4)) : live * .6 * pulse(t, 3));
    });
    // a spark of current riding the cable on each beat
    if (sp > 0) { const q = frac(bpOf(t)), i = Math.min(PYL.length - 2, Math.floor(bpOf(t) - bpOf(barT(78))) % (PYL.length - 1)), [x0, y0, h0] = PYL[i], [x1, y1, h1] = PYL[i + 1];
      const px = lerp(x0 + .34 * h0, x1 - .34 * h1, q), py = lerp(y0 - .8 * h0, y1 - .8 * h1, q);
      paint(ellPts(px, py, 22, 22, 14, 2), { fill: NEON, fillOp: 200, bleed: .3, ink: null }); paint(ellPts(px, py, 6, 6, 10), { wash: '#E9FFFB', ink: null }); }
    // the bolt
    const on = a < .3 && !(a > .08 && a < .13);
    if (on) {
      const band = k => { const L = [], R = []; BOLT.forEach(([x, y], i) => { const w = k * lerp(30, 10, i / (BOLT.length - 1)); L.push([x - w, y]); R.unshift([x + w, y]); }); return [...L, ...R]; };
      paint(band(2.2), { fill: NEON, fillOp: 200, bleed: .3, ink: null });
      paint(ellPts(362, 318, 160, 110, 20, 6), { fill: '#E9FFFB', fillOp: 160, bleed: .3, ink: null });
      paint(band(.7), { wash: '#FFF5E2', washOp: 255, ink: PAL.ink, sw: .9 });
    }
    // strike bloom round the pylon (a full-frame white flash washed the dark town out to lavender)
    const bl = Math.exp(-a * 7);
    if (bl > .05) paint(ellPts(362, 330, 420 * (1.4 - .4 * bl), 300 * (1.4 - .4 * bl), 24, 6), { fill: NEON, fillOp: 120 * bl, bleed: .35, ink: null });
    camEnd();
    sfx('BZZT!', 600, 230, 120, NEON, a, { life: 1.1, rot: -.12 });
  }

  // ---------------- 148.16: the lead hugs a power station; the choir pedals generators, just to be sure ----------------
  const PHZ = 640;
  // a cooling tower: hyperbolic waist, clay band near the top
  function tower(cx, base, w, h) {
    const prof = f => w * (.36 + .1 * Math.pow((f - .62) / .62, 2) * 4 * (f < .62 ? .4 : 1) + .14 * f * f);
    const pts = []; for (let i = 0; i <= 10; i++) { const f = i / 10; pts.push([cx - prof(f), base - h + f * h]); }
    for (let i = 10; i >= 0; i--) { const f = i / 10; pts.push([cx + prof(f), base - h + f * h]); }
    paint(pts, { wash: '#DCD3C6', washOp: 255, fill: '#A89C8E', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.4, curv: .4 });
    paint(rectPts(cx - prof(.12) + 4, base - h * .86, prof(.12) * 2 - 8, h * .06, 0), { wash: PAL.clay, washOp: 230, ink: null });
    paint(ellPts(cx - prof(.5) * .45, base - h * .45, prof(.5) * .25, h * .32, 14), { fill: '#FFFFFF', fillOp: 90, bleed: .2, ink: null });
    paint(ellPts(cx, base - h, prof(0), w * .1, 16), { wash: '#6E6458', ink: PAL.ink, sw: 1 });
  }
  function station(t, sq) {
    push(); translate(1420, 860); scale(1 - sq * .6, 1 + sq * .3); translate(-1420, -860);
    paint(rectPts(1180, 690, 470, 170, 2), { wash: '#B9AFA0', washOp: 255, fill: '#8E8476', fillOp: 50, tex: .6, ink: PAL.ink, sw: 1.4 });
    paint(rectPts(1170, 676, 490, 18, 1), { wash: STEEL, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 5; i++) paint(rectPts(1206 + i * 88, 720, 52, 34, 1), { wash: GOLD_LT, washOp: 255, ink: PAL.ink, sw: .7 });
    paint(rectPts(1400, 790, 64, 70, 1), { wash: STEEL_DK, ink: PAL.ink, sw: .8 });
    paint(rectPts(1590, 420, 34, 260, 1), { wash: '#C8BBA8', washOp: 255, ink: PAL.ink, sw: 1 });                         // chimney
    for (let k = 0; k < 3; k++) paint(rectPts(1590, 440 + k * 30, 34, 10, 0), { wash: k % 2 ? PAL.cream : PAL.clay, ink: null });
    tower(1500, 690, 150, 330);
    tower(1280, 700, 170, 380);
    pop();
  }
  // a stationary bike generator: the rider sits over the wheel, legs churning in sync; a bulb lights on every stroke
  function bike(t, x, y, i) {
    const bp = bpOf(t), ph = bp * TAU * .5, wx = x - 54, wy = y - 38, R = 36;
    inkLine([[x - 100, y], [x + 76, y]], 3, '#2B2233', 'ink', 0);                                                      // floor rail
    paint(ellPts(wx, wy, R, R, 24), { wash: '#2B2233', washOp: 255, ink: PAL.ink, sw: 1 });
    paint(ellPts(wx, wy, R - 7, R - 7, 22), { wash: '#6B4A6A', washOp: 255, ink: null });
    for (let k = 0; k < 4; k++) { const aa = ph + k * TAU / 4; inkLine([[wx - Math.cos(aa) * (R - 8), wy - Math.sin(aa) * (R - 8)], [wx + Math.cos(aa) * (R - 8), wy + Math.sin(aa) * (R - 8)]], .8, PAL.cream, 'inkfine', 0); }
    paint(rectPts(wx - 12, wy - 10, 24, 20, 1), { wash: STEEL, ink: PAL.ink, sw: .7 });                                 // generator on the hub
    inkLine([[wx, wy], [x - 8, y - 74]], 4, PINK, 'ink', 0);                                                             // frame
    inkLine([[x - 8, y - 74], [x + 14, y - 30], [x + 54, y - 96]], 4, PINK, 'ink', 0);
    inkLine([[x + 14, y - 30], [x + 40, y]], 3, PINK, 'ink', 0);
    paint(rrPts(x + 40, y - 102, 34, 9, 4), { wash: '#2B2233', ink: null });                                             // handlebar
    const lit = .25 + .75 * pulse(t, 4);
    inkLine([[wx, wy - 10], [wx - 6, wy - 74]], 1, PAL.ink, 'ink', 0);
    paint(ellPts(wx - 6, wy - 86, 30, 30, 16, 2), { fill: GOLD_LT, fillOp: 230 * lit, bleed: .3, ink: null });
    paint(ellPts(wx - 6, wy - 84, 10, 12, 12), { wash: mixCol('#9A8A6A', '#FFF5E2', lit), ink: PAL.ink, sw: .7 });
    clawd(x, y - 40, 11, { draw: i % 2 ? labCoat : HARD, walk: bp * .5, noShadow: true, dy: -.2 * Math.abs(Math.sin(bp * Math.PI)), sq: .06 * pulse(t, 8),
      aL: -.3, aR: .25, eyes: 'narrow', mouth: chant(t) ? 'O' : 'flat', emote: i === 2 ? 'sweat' : null, emoteK: 1 });
  }
  function hug(t, lt, dur) {
    const [sx, sy] = shakeXY(t, 2 * pulse(t, 8)), z = lerp(1.06, .97, ease(lt / dur));
    const cam = { cx: 960 + sx, cy: 540 + sy, z };
    camBegin(cam.cx, cam.cy, cam.z);
    sky(PHZ, t, .9);
    ground(PHZ, [1100, 780, 900, 200]);
    paint(ellPts(220, PHZ, 380, 80, 22, 4), { fill: GOLD, fillOp: 160, bleed: .3, ink: null });                       // the festival, far off
    beams(t, [[140, PHZ - 10, -.3], [300, PHZ - 10, .3]]);
    camEnd();
    dotLayer(cam, c => townLights(c, t, PHZ, -600, 2600, .9));
    camBegin(cam.cx, cam.cy, cam.z);
    // steam puffs from the towers, one per beat
    for (let k = 3; k >= 0; k--) {
      const b = bpOf(t) - k, age = frac(b), n = Math.floor(b), g = (age + k) / 4;
      for (const [cx, top] of [[1280, 320], [1500, 360]]) {
        const r = 40 + 70 * g, x = cx + 40 * g + 20 * (hash(n + cx) - .5), y = top - 30 - 260 * g;
        paint(ellPts(x, y, r, r * .78, 18, 5), { wash: '#FFF5E2', washOp: 250 * (1 - g * g), fill: PAL.cream, fillOp: 80, bleed: .3, ink: null });
      }
    }
    const lean = .16 + .04 * Math.sin(bpOf(t) * Math.PI / 2), sq = .06 * pulse(t, 6);
    const pose = { rot: lean, sq };
    station(t, .05 * pulse(t, 6));
    lead(t, 1010, 870, 40, { ...pose, aL: .9 + .2 * pulse(t, 6), aR: -.6, blush: true, mouth: 'smile', emote: 'heart', emoteK: .4 + .6 * pulse(t, 4), noOver: true });
    overArm(1010, 870, 40, 1, .52 - .1 * pulse(t, 6), pose, 4.4);                                                       // wrapped round the tower
    for (let k = 0; k < 3; k++) {                                                                                         // little hearts float up
      const a = frac(bpOf(t) / 2 + k / 3), x = 1120 + 60 * k + 30 * Math.sin(a * 6 + k), y = 520 - 260 * a;
      paint(heartPts(x, y, 18 * backOut(clamp(a * 4)) * (1 - a * .4)), { wash: '#E2476E', washOp: 255 * (1 - a), ink: PAL.ink, sw: .7 });
    }
    // cables from the bikes to the station, current running along them
    for (let i = 0; i < 4; i++) {
      const bx = 150 + i * 190 - 54, by = 892, ex = 1200, ey = 840, mid = 950 + 8 * i;
      inkLine([[bx, by], [(bx + ex) / 2, mid], [ex, ey]], 1.6, PAL.clayDk, 'ink', .6);
      const q = frac(bpOf(t) + i * .1), qx = lerp(bx, ex, q), qy = lerp(by, ey, q) + 4 * (mid - (by + ey) / 2) * q * (1 - q);
      paint(ellPts(qx, qy, 12, 12, 12, 2), { fill: GOLD_LT, fillOp: 220, bleed: .3, ink: null });
    }
    for (let i = 0; i < 4; i++) bike(t, 150 + i * 190, 935, i);
    camEnd();
  }

  // ---------------- 152.38: everyone holds up the falling-loss placards (mini log-log charts); snap to black on the last syllable ----------------
  function placard(x, y, u, t, i) {
    const lift = -u * (1.2 + 1.2 * pulse(t - i * .03, 6)), cx = x + Math.sin(bpOf(t) * Math.PI + i) * u * .3, cy = y - 13.5 * u + lift;
    inkLine([[x, y - 6 * u], [cx, cy + 2 * u]], 1.6, '#7C4A2C', 'ink', 0);
    paint(rrPts(cx - 4.2 * u, cy - 2.7 * u, 8.4 * u, 5.4 * u, .5 * u, 1), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: 1.1 });
    // a mini log-log chart: ink axes, faint decade lines, and the Line falling thick from upper-left to lower-right
    const L = cx - 3.2 * u, R = cx + 3.4 * u, Tp = cy - 2.0 * u, B = cy + 1.9 * u, grid = mixCol(PAL.cream, PAL.teal, .55);
    for (const f of [.33, .66]) {
      inkLine([[lerp(L, R, f), Tp], [lerp(L, R, f), B]], .6, grid, 'inkfine', 0);
      inkLine([[L, lerp(Tp, B, f)], [R, lerp(Tp, B, f)]], .6, grid, 'inkfine', 0);
    }
    inkLine([[L, Tp - .2 * u], [L, B], [R + .2 * u, B]], 1.4, PAL.ink, 'ink', 0);
    const ax = L + .5 * u, ay = Tp + .4 * u, bx = R - .3 * u, by = B - .8 * u, ang = Math.atan2(by - ay, bx - ax), n = [-Math.sin(ang) * .42 * u, Math.cos(ang) * .42 * u];
    paint([[ax - n[0] * 1.8, ay - n[1] * 1.8], [bx - n[0] * 1.8, by - n[1] * 1.8], [bx + n[0] * 1.8, by + n[1] * 1.8], [ax + n[0] * 1.8, ay + n[1] * 1.8]],
      { fill: PAL.clay, fillOp: 70 + 60 * pulse(t, 5), bleed: .2, ink: null });                                          // glow
    paint([[ax - n[0], ay - n[1]], [bx - n[0], by - n[1]], [bx + n[0], by + n[1]], [ax + n[0], ay + n[1]]], { wash: PAL.clay, washOp: 255, ink: PAL.ink, sw: .6 });
  }
  function finale(t, lt, dur) {
    if (t >= BLACK) { flash(1, PAL.ink); return; }
    const k = ease(lt / dur), [sx, sy] = shakeXY(t, 3 * pulse(t, 8)), cam = { cx: 960 + sx, cy: lerp(560, 600, k) + sy, z: lerp(.96, .7, k) };
    const point = t > 154.7, roof = move('roof', t);
    festival(t, cam, { town: 1, hero: point ? { aL: .4 + .3 * pulse(t, 6), aR: .75 + .1 * pulse(t, 6), dy: -.4 * pulse(t, 7), sq: .08 * pulse(t, 8) }
                                            : { ...roof, aL: roof.aL + .3, aR: roof.aR + .3 } });
    // the front row of the choir, placards up on every beat
    const XS = [150, 410, 670, 1250, 1510, 1770];
    XS.forEach((x, i) => {
      const u = 16, m = move('stomp', t);
      clawd(x, 945, u, { draw: i % 2 ? labCoat : HARD, sq: m.sq, dy: m.dy * .5, rot: m.rot, aL: 1.35, aR: 1.35, eyes: point ? 'happy' : 'closed', mouth: chant(t) ? 'O' : 'smile' });
      placard(x, 945, u, t, i);
    });
    // confetti
    dotLayer(null, c => {
      for (let i = 0; i < 260; i++) {
        const born = 152.38 + (i % 9) * BEAT, a = t - born; if (a < 0) continue;
        const x0 = hash(i) * W, x = x0 + Math.sin(a * 3 + i) * 40, y = -40 + a * (140 + 90 * hash(i + 1)) + 600 * hash(i + 2) * Math.min(1, a * 3) - 300;
        if (y > H) continue;
        c.save(); c.translate(x, y); c.rotate(a * 6 * (hash(i + 3) - .5) * 2); c.fillStyle = [PINK, NEON, GOLD_LT, PAL.cream, PAL.clay][i % 5];
        c.fillRect(-6, -3.5 * Math.abs(Math.cos(a * 7 + i)) - 1, 12, 7 * Math.abs(Math.cos(a * 7 + i)) + 2); c.restore();
      }
    });
  }

  chapter('gigawatt', T0, T1, [[T0, reveal], [barT(74), skiRun], [barT(76), crowdWide], [barT(78), lightning], [barT(80), hug], [barT(82) + BEAT, finale]]);
})();
