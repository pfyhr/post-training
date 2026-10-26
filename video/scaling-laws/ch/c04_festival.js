// c04_festival.js: 75.06-97.55, bars 41-52, chorus 1. The line has just smashed through the brick wall; we fly through
// the hole onto a desert festival stage at night. The lead Clawd DJs in a chrome robot helmet, the choir waves glow
// sticks on risers, the loss curve on the LED screen turns into a waterslide, pylons dance in over the dunes, a campus
// rises out of the sand, Clawd plugs the whole festival into a dune, and it all ends in confetti, pulled far out.
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { HARD, labCoat } = SL;
  const SKY = '#22163E', SKY_LT = '#4B2C6E', DUNE = '#3E2656', DUNE_LT = '#5E3A6E', SAND_N = '#6A4466', NEON = '#3FF0D8', PINK = '#F06AA8';
  const DECK = '#4A2F66', DECK_DK = '#24163C', STEELV = '#B4ACD6', BRICK = '#9B4B3A', MORTAR = '#4A2230';
  const CHROME = '#C9CED8', CHROME_DK = '#8C93A3', VISOR = '#1C1A2E';

  // ---------------- the robot helmet (chapters 7 and 9 copy this) ----------------
  // A chrome dome from the brow up, with a dark horizon reflection, a pale highlight and a darker lower rim; ear discs
  // at the sides; a dark visor band across the eyes with a neon LED stripe that brightens with `glow` (0..1).
  const robotHelmet = (glow = 0) => (u, sw) => {
    const cy = -7.5 * u, rx = 5.5 * u, ry = 4.7 * u, xAt = y => rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2));
    const d = []; for (let i = 0; i <= 18; i++) { const a = Math.PI + i / 18 * Math.PI; d.push([Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    paint(d, { wash: CHROME, washOp: 255, fill: CHROME_DK, fillOp: 50, tex: .3, ink: PAL.ink, sw: sw * .9 });
    // chrome: a dark horizon band bowed with the dome, and a sky streak above it
    const band = [], y1 = -9.1 * u, y2 = -8.35 * u;
    for (let i = 0; i <= 8; i++) { const k = i / 8 * 2 - 1, x = k * xAt(y1) * .97; band.push([x, y1 - .5 * u * (1 - k * k)]); }
    for (let i = 8; i >= 0; i--) { const k = i / 8 * 2 - 1, x = k * xAt(y2) * .98; band.push([x, y2 - .35 * u * (1 - k * k)]); }
    paint(band, { wash: '#6E7290', washOp: 235, ink: null });
    paint(ellPts(-2.1 * u, -10.6 * u, 1.5 * u, .55 * u, 14, 0, -.32), { wash: '#F4F6FA', washOp: 235, ink: null });
    paint(starPts(2.5 * u, -10.9 * u, .7 * u, .25, 4), { wash: '#FFFFFF', washOp: 230, ink: null });
    paint(rectPts(-5.55 * u, -8.05 * u, 11.1 * u, .7 * u, 0), { wash: CHROME_DK, washOp: 255, ink: PAL.ink, sw: sw * .7 });   // lower rim
    for (const s of [-1, 1]) paint(ellPts(s * 5.45 * u, -6.3 * u, .75 * u, 1.25 * u, 14), { wash: CHROME_DK, washOp: 255, ink: PAL.ink, sw: sw * .7 });
    // visor and its LED stripe
    paint(rrPts(-5.25 * u, -7.45 * u, 10.5 * u, 2.3 * u, .9 * u), { wash: VISOR, washOp: 255, ink: PAL.ink, sw: sw * .9 });
    inkLine([[-4.4 * u, -7.1 * u], [-1.5 * u, -7.15 * u]], sw * .7, '#5A5478', 'inkfine', 0);
    paint(rrPts(-4.7 * u, -6.75 * u, 9.4 * u, 1.1 * u, .5 * u), { fill: NEON, fillOp: 40 + 150 * glow, bleed: .25, tex: .2, ink: null });
    paint(rrPts(-4.2 * u, -6.45 * u, 8.4 * u, .5 * u, .25 * u), { wash: mixCol('#17605A', NEON, .3 + .7 * glow), washOp: 255, ink: null });
    if (glow > .55) paint(rrPts(-3.6 * u, -6.33 * u, 7.2 * u, .24 * u, .12 * u), { wash: '#E6FFFB', washOp: 255 * (glow - .55) / .45, ink: null });
    if (u > 14) for (let i = -3; i <= 3; i++) paint(rectPts(i * 1.1 * u - .07 * u, -6.5 * u, .14 * u, .6 * u, 0), { wash: VISOR, washOp: 220, ink: null });
  };
  const helmetGlow = t => .25 + .75 * pulse(t, 5);

  // a glow stick in Clawd's right hand, drawn after the Clawd (an arm hook would hide behind the body): pass the same
  // ground point, unit, right-arm angle and dy as the clawd() call
  const handStick = (x, y, u, a, col, dy = 0) => {
    const hx = x + (4.9 + 2.2 * Math.cos(a)) * u, hy = y + dy * u - (4.5 + 2.2 * Math.sin(a)) * u;
    paint(ellPts(hx, hy - 1.8 * u, 1.5 * u, 2.6 * u, 12), { fill: col, fillOp: 110, bleed: .2, ink: null });
    paint(rrPts(hx - .3 * u, hy - 3.4 * u, .6 * u, 3.6 * u, .3 * u), { wash: mixCol(col, '#FFFFFF', .35), washOp: 255, ink: PAL.ink, sw: Math.max(.4, u * .04) });
  };

  // ---------------- background pieces ----------------
  function sky(x0, x1, hz) {
    paint(rectPts(x0, -1600, x1 - x0, hz + 1700), { wash: SKY, washOp: 255, fill: PAL.violet, fillOp: 60, bleed: .2, tex: .5, ink: null });
    paint(ellPts((x0 + x1) / 2, hz, (x1 - x0) * .6, 300, 26, 10), { fill: PAL.rose, fillOp: 70, bleed: .3, tex: .4, ink: null });
    paint(ellPts((x0 + x1) / 2, hz, (x1 - x0) * .5, 140, 26, 8), { fill: PAL.clay, fillOp: 70, bleed: .3, tex: .4, ink: null });
    for (let i = 0; i < 22; i++) {
      const x = x0 + hash(i * 1.3 + 2) * (x1 - x0), y = hz - 120 - hash(i * 2.7 + 5) * 1400, r = 2 + 3 * hash(i + 9);
      if (x > 1680 && x < 1900 && y > 50 && y < 290) continue;          // corner meter
      paint(ellPts(x, y, r, r, 6), { wash: PAL.cream, washOp: 200, ink: null });
    }
  }
  function dunes(x0, x1, hz, lit = 1) {
    for (let l = 0; l < 2; l++) {
      const pts = [[x0, hz + 200]], n = 10;
      for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); pts.push([x, hz - (l ? 10 : 50) - (l ? 40 : 70) * hash(i * 3.3 + l * 11)]); }
      pts.push([x1, hz + 200]);
      paint(pts, { wash: l ? DUNE : DUNE_LT, washOp: 255, fill: PAL.clay, fillOp: 25 * lit, tex: .5, ink: PAL.ink, sw: .7, curv: .7 });
    }
  }

  // log-log grid + the loss line, inside a rectangle
  function logGrid(x, y, w, h, lod, col) {
    for (let d = 0; d < 3; d++) for (let m = 1; m < 10; m++) {
      if (lod === 'far' && m > 1) continue;
      const k = (d + Math.log10(m)) / 3, a = m === 1 ? 1 : .45;
      inkLine([[x + k * w, y], [x + k * w, y + h]], .5 + .6 * a, mixCol(VISOR, col, .3 + .4 * a), 'inkfine', 0);
      if (d < 2) { const ky = (d + Math.log10(m)) / 2; inkLine([[x, y + ky * h], [x + w, y + ky * h]], .5 + .6 * a, mixCol(VISOR, col, .3 + .4 * a), 'inkfine', 0); }
    }
  }
  function ledScreen(t, lod, lit = 1) {
    paint(rectPts(588, 108, 744, 464, 2), { wash: '#3A3150', washOp: 255, ink: PAL.ink, sw: 1.3 });
    paint(rectPts(604, 122, 712, 436, 1), { wash: '#130F28', washOp: 255, fill: PAL.indigo, fillOp: 40, tex: .4, ink: null });
    if (lit < .1) return;
    logGrid(616, 134, 688, 412, lod, NEON);
    const A = [640, 170], B = [1280, 520], g = 1 + .4 * pulse(t, 6);
    paint([[A[0], A[1] - 24 * g], [B[0], B[1] - 24 * g], [B[0], B[1] + 24 * g], [A[0], A[1] + 24 * g]], { fill: PAL.clay, fillOp: 90 * lit, bleed: .3, ink: null });
    inkLine([A, B], lod === 'far' ? 1.5 : 3, PAL.clayLt, 'ink', 0);
    const k = frac(t / (8 * BEAT)), p = [lerp(A[0], B[0], k), lerp(A[1], B[1], k)];
    paint(ellPts(p[0], p[1], 14, 14, 12), { wash: PAL.cream, washOp: 255 * lit, ink: null });
  }
  function truss(t, lit, lod) {
    for (const x of [540, 1350]) {
      paint(rectPts(x, 92, 30, 610, 1), { wash: '#3A3150', washOp: 255, ink: PAL.ink, sw: .9 });
      if (lod !== 'far') for (let y = 100; y < 690; y += 40) inkLine([[x + 3, y], [x + 27, y + 40]], .6, STEELV, 'inkfine', 0);
    }
    paint(rectPts(520, 78, 880, 28, 1), { wash: '#3A3150', washOp: 255, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 7; i++) {
      const x = 590 + i * 120, on = lit * (.4 + .6 * pulse(t + i * BEAT * .5 * (i % 2), 5)), col = i % 2 ? NEON : PINK;
      paint(rrPts(x - 16, 104, 32, 26, 6), { wash: '#2A2340', washOp: 255, ink: PAL.ink, sw: .7 });
      paint(ellPts(x, 132, 14, 7, 10), { wash: mixCol('#2A2340', col, on), washOp: 255, ink: null });
      if (on > .05) paint([[x - 12, 134], [x + 12, 134], [x + 120, 690], [x - 120, 690]], { fill: col, fillOp: 30 * on, bleed: .05, tex: .2, ink: null });
    }
  }
  function lasers(t, lit) {
    if (lit < .1) return;
    for (let i = 0; i < 8; i++) {
      const sx = i < 4 ? 555 : 1365, a = -Math.PI / 2 + (i < 4 ? -1 : 1) * (.25 + .18 * (i % 4)) + .22 * wob(t, .23, i * .37);
      let ex = sx + Math.cos(a) * 1500, ey = 90 + Math.sin(a) * 1500;
      if (ex > 1620) { const k = (1620 - sx) / (ex - sx); ex = 1620; ey = 90 + (ey - 90) * k; }      // keep the corner meter clear
      const op = lit * (40 + 80 * pulse(t + (i % 2) * BEAT * .5, 4)), col = i % 2 ? NEON : PINK, n = [-(ey - 90), ex - sx], nl = Math.hypot(...n);
      const w0 = 3 / nl, w1 = 22 / nl;
      paint([[sx + n[0] * w0, 90 + n[1] * w0], [ex + n[0] * w1, ey + n[1] * w1], [ex - n[0] * w1, ey - n[1] * w1], [sx - n[0] * w0, 90 - n[1] * w0]], { fill: col, fillOp: op, bleed: .1, tex: .2, ink: null });
    }
  }

  // ---------------- the choir on risers, the hero at the decks, the crowd ----------------
  const RISER = [{ x0: 30, x1: 520 }, { x0: 1400, x1: 1890 }], TIERS = [{ y: 540, u: 10 }, { y: 612, u: 11 }, { y: 684, u: 12 }];
  function risers(t, mode, lod) {
    RISER.forEach((R, side) => TIERS.forEach((T, ti) => {
      paint(rectPts(R.x0 - ti * 12, T.y, R.x1 - R.x0 + ti * 24, 760 - T.y, 2), { wash: ti % 2 ? '#7C4A2C' : '#9A6440', washOp: 255, fill: PAL.ink, fillOp: 40, tex: .5, ink: PAL.ink, sw: .9 });
      paint(rectPts(R.x0 - ti * 12, T.y, R.x1 - R.x0 + ti * 24, 6, 0), { wash: NEON, washOp: 150, ink: null });
      for (let j = 0; j < 4; j++) {
        const x = R.x0 + 70 + j * (R.x1 - R.x0 - 140) / 3, id = side * 12 + ti * 4 + j, coat = (j + ti) % 2 === 1;
        const chant = frac(bpOf(t)) < .45;
        if (lod === 'far') { paint(rectPts(x - 5 * T.u, T.y - 8 * T.u - 4 * pulse(t, 8), 10 * T.u, 6 * T.u, 0), { wash: PAL.clay, washOp: 255, ink: null }); continue; }
        let pose;
        if (mode === 'chant') pose = { ...move('roof', t, 0), mouth: chant ? 'O' : 'smile', eyes: chant ? 'closed' : 'happy' };
        else pose = { ...move('sway', t + id * .07, id), rot: 0, aR: .5 + .4 * Math.sin(bpOf(t) * Math.PI + id), mouth: chant ? 'O' : 'smile', eyes: 'happy' };
        clawd(x + (pose.dx || 0) * T.u, T.y + 4, T.u, { ...pose, draw: coat ? labCoat : HARD, noShadow: true });
        if (mode !== 'chant') handStick(x + (pose.dx || 0) * T.u, T.y + 4, T.u, pose.aR, id % 3 ? NEON : PINK, pose.dy);
      }
    }));
  }
  function stageDeck(lit) {
    paint([[300, 690], [1620, 690], [1660, 770], [260, 770]], { wash: DECK, washOp: 255, fill: PAL.violet, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.1 });
    paint(rectPts(260, 770, 1400, 60, 1), { wash: DECK_DK, washOp: 255, ink: PAL.ink, sw: 1.1 });
    paint(rectPts(270, 776, 1380, 6, 0), { wash: mixCol(DECK_DK, NEON, .3 + .7 * lit), washOp: 255, ink: null });
  }
  function booth(t, lod) {
    paint(rectPts(760, 626, 400, 20, 1), { wash: '#3A3150', washOp: 255, ink: PAL.ink, sw: 1 });
    for (const [x, ph] of [[860, 0], [1060, 1.7]]) {
      paint(ellPts(x, 624, 78, 15, 18), { wash: '#16122A', washOp: 255, ink: PAL.ink, sw: .8 });
      const a = t * 9 + ph; paint(ellPts(x + Math.cos(a) * 40, 624 + Math.sin(a) * 7, 7, 3, 8), { wash: PAL.clay, ink: null });
    }
    paint(rectPts(925, 608, 70, 18, 1), { wash: '#4B4466', washOp: 255, ink: PAL.ink, sw: .6 });
    paint(rectPts(780, 646, 360, 130, 2), { wash: '#2A1F45', washOp: 255, fill: PAL.indigo, fillOp: 40, tex: .4, ink: PAL.ink, sw: 1.1 });
    inkLine([[784, 650], [1136, 650]], 1.6, NEON, 'ink', 0);
    // the decal: a little log-log chart with the line
    paint(rectPts(895, 672, 130, 80, 1), { wash: PAL.cream, washOp: 230, ink: PAL.ink, sw: .7 });
    if (lod !== 'far') for (let i = 1; i < 4; i++) { inkLine([[895 + i * 32, 674], [895 + i * 32, 750]], .4, PAL.teal, 'inkfine', 0); inkLine([[897, 672 + i * 20], [1023, 672 + i * 20]], .4, PAL.teal, 'inkfine', 0); }
    inkLine([[905, 682], [1015, 742]], 3, PAL.clay, 'ink', 0);
  }
  function hero(t, o = {}) {
    const glow = o.glow ?? helmetGlow(t), sc = .5 + .5 * Math.sin(bpOf(t) * Math.PI * 2);
    const chant = frac(bpOf(t)) < .45;
    clawd(960, 700, 30, { draw: robotHelmet(glow), aL: -.35 + .25 * sc, aR: -.35 + .25 * (1 - sc), dy: -.35 * pulse(t, 7), sq: .06 * pulse(t, 8),
      mouth: chant ? 'O' : 'grin', noShadow: true, ...o.pose });
    if (glow > .4) paint(ellPts(960, 700 - 6.3 * 30 - 10.5 * pulse(t, 7), 230, 46, 18, 4), { fill: NEON, fillOp: 90 * (glow - .4), bleed: .3, ink: null });
  }
  // crowd: Clawd silhouettes, rim-lit, jumping so they land on the beat; some wave glow sticks
  const SIL = [[-5, -8], [5, -8], [5, -2], [4, -2], [4, 0], [3, 0], [3, -2], [2, -2], [2, 0], [1, 0], [1, -2], [-1, -2], [-1, 0], [-2, 0],
               [-2, -2], [-3, -2], [-3, 0], [-4, 0], [-4, -2], [-5, -2]];                 // a Clawd outline with its four legs
  // crowd: backlit Clawd silhouettes facing the stage, arms up, jumping so they land on the beat; many wave glow sticks
  function crowd(t, rows) {
    rows.forEach((r, ri) => {
      const col = mixCol('#1A0F30', SKY_LT, r.haze ?? .3 * (rows.length - 1 - ri) / Math.max(1, rows.length - 1));
      for (let i = 0; i < r.n; i++) {
        const sd = ri * 31 + i, x = lerp(r.x0, r.x1, (i + .5 * hash(sd)) / r.n), u = r.u * (.9 + .2 * hash(sd + 3));
        const ph = hash(sd + 7) < .5 ? 0 : .5, hop = Math.sin(frac(bpOf(t) + ph) * Math.PI) * u * (1.2 + hash(sd + 1));
        const y = r.y - hop, aa = 1.0 + .4 * Math.sin(bpOf(t) * Math.PI + sd), rim = sd % 2 ? PINK : NEON;
        for (const s of [-1, 1]) {
          const bx = x + s * 4.5 * u, by = y - 5 * u, ex = bx + s * Math.cos(aa) * 3 * u, ey = by - Math.sin(aa) * 3 * u;
          paint([[bx, by - .5 * u], [ex, ey - .5 * u], [ex, ey + .5 * u], [bx, by + .5 * u]], { wash: col, washOp: 255, ink: null });
          if (s > 0 && hash(sd + 13) < .55) {
            paint(ellPts(ex, ey - 1.3 * u, 1.4 * u, 2 * u, 10), { fill: rim, fillOp: 120, bleed: .2, ink: null });
            paint(rrPts(ex - .3 * u, ey - 2.8 * u, .6 * u, 2.8 * u, .25 * u), { wash: mixCol(rim, '#FFFFFF', .3), washOp: 255, ink: null });
          }
        }
        paint(SIL.map(([a, b]) => [x + a * u, y + b * u]), { wash: col, washOp: 255, ink: null });
        inkLine([[x - 4.7 * u, y - 7.85 * u], [x + 4.7 * u, y - 7.85 * u]], Math.max(.8, u * .1), mixCol(col, rim, .75), 'inkfine', 0);
      }
    });
  }
  // a front row of real Clawds, cheering at the camera (for close crowd shots)
  function fans(t, y, u, n, x0, x1) {
    for (let i = 0; i < n; i++) {
      const x = lerp(x0, x1, (i + .5) / n), m = move(i % 3 ? 'hop' : 'roof', t + (i % 2) * BEAT * .5, i);
      const aR = .55 + .35 * Math.sin(bpOf(t) * Math.PI + i);
      clawd(x + m.dx * u, y, u, { ...m, rot: 0, aR, eyes: i % 3 ? 'happy' : 'closed',
        mouth: frac(bpOf(t)) < .45 ? 'O' : 'grin', blush: i % 2 === 0, noShadow: true });
      handStick(x + m.dx * u, y, u, aR, i % 2 ? NEON : PINK, m.dy);
    }
  }

  // the whole festival in one 1920x1080 frame (stage floor at y 770). o: lit 0..1, lod, wide, mode, hero
  function festival(t, o = {}) {
    const lit = o.lit ?? 1, lod = o.lod || 'near';
    if (!o.noBg) { sky(-2000, 3900, 650); dunes(-2000, 3900, 700); }
    if (o.wide) wideSurround(t, lit);
    lasers(t, lit);
    truss(t, lit, lod);
    ledScreen(t, lod, lit);
    if (!o.noBg) paint(rectPts(-2000, 760, 5900, 1200, 0), { wash: SAND_N, washOp: 255, fill: DUNE, fillOp: 80, tex: .5, ink: null });
    else paint(rectPts(200, 760, 1520, 120, 0), { wash: SAND_N, washOp: 255, ink: null });
    risers(t, o.mode || 'stick', lod);
    stageDeck(lit);
    if (lod === 'far') paint(rectPts(960 - 150, 700 - 240, 300, 180, 0), { wash: PAL.clay, washOp: 255, ink: null });
    else hero(t, o.hero || {});
    booth(t, lod);
    if (o.crowd !== false && lod !== 'far') crowd(t, o.crowdRows || [{ y: 900, u: 9, n: 15, x0: 120, x1: 1800 }, { y: 990, u: 11, n: 13, x0: 40, x1: 1880 }]);
  }

  // ---------------- the desert around the festival: pylons and the campus ----------------
  function pylon(x, y, h, kick = 0, lit = 1, col = STEELV) {
    const w = h * .34, wy = y - h * .6, sw = Math.max(.8, h / 130);
    // legs: the kicking one swings up from the waist like a chorus-line kick
    for (const s of [-1, 1]) {
      const a = s === (kick > 0 ? 1 : -1) ? Math.abs(kick) * 1.1 * s : 0, hx = x + s * w * .12;
      const fx = hx + Math.sin(a) * h * .62 + s * w * .38 * Math.cos(a), fy = wy + Math.cos(a) * h * .6;
      inkLine([[hx, wy], [fx, fy]], sw * 1.4, col, 'ink', 0);
      inkLine([[x, wy], [fx - s * w * .1, fy]], sw * .7, col, 'inkfine', 0);
    }
    inkLine([[x - w * .12, wy], [x - w * .05, y - h]], sw * 1.2, col, 'ink', 0);
    inkLine([[x + w * .12, wy], [x + w * .05, y - h]], sw * 1.2, col, 'ink', 0);
    for (let k = 0; k < 3; k++) { const y0 = wy - k * h * .13; inkLine([[x - w * .11, y0], [x + w * .1, y0 - h * .13]], sw * .6, col, 'inkfine', 0); }
    const arms = [[y - h * .8, w * .62], [y - h * .93, w * .45]];
    for (const [ay, aw] of arms) {
      paint([[x - aw, ay], [x + aw, ay], [x, ay - h * .06]], { ink: col, sw: sw * .9 });
      for (const s of [-1, 1]) paint(ellPts(x + s * aw, ay + h * .025, h * .012, h * .025, 8), { wash: lit > .5 ? NEON : '#6B6590', washOp: 255, ink: null });
    }
    return arms.map(([ay, aw]) => [[x - aw, ay + h * .05], [x + aw, ay + h * .05]]);
  }
  function cable(a, b, sag, lit) {
    inkLine([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag], b], 1.4, lit > .5 ? mixCol(STEELV, NEON, .5) : STEELV, 'inkfine', .9);
  }
  function building(x, y, w, h, rise, lit) {
    const top = y - h * rise;
    paint(rectPts(x, top, w, h, 1), { wash: '#4E4670', washOp: 255, fill: PAL.indigo, fillOp: 50, tex: .4, ink: PAL.ink, sw: 1 });
    for (let r = 0; r < 3; r++) { const wy = top + h * (.2 + r * .25); if (wy > y - 6) continue;
      paint(rectPts(x + w * .1, wy, w * .8, h * .1, 0), { wash: lit > .5 ? NEON : '#2A2440', washOp: lit > .5 ? 230 : 255, ink: null }); }
    for (let i = 0; i < Math.floor(w / 50); i++) paint(rectPts(x + 10 + i * 50, top - 14, 34, 14, 1), { wash: '#6B6590', washOp: 255, ink: PAL.ink, sw: .6 });
  }
  // the area around the stage for the wide finale: pylons and the campus, all lit
  function wideSurround(t, lit) {
    for (const [x0, dir] of [[-1300, 1], [2400, -1]]) {
      for (let i = 0; i < 4; i++) building(x0 + i * 190 * dir - (dir < 0 ? 160 : 0), 740, 160, 130 + 60 * hash(i + (dir > 0 ? 0 : 9)), 1, lit);
    }
    let prev = null;
    for (let i = 0; i < 5; i++) {
      const x = -1200 + i * 280, kick = Math.max(0, Math.sin(bpOf(t) * Math.PI)) * (i % 2 ? 1 : -1) * .5;
      const arms = pylon(x, 640, 300, kick, lit); if (prev) cable(prev[0][1], arms[0][0], 6, lit); prev = arms;
    }
    prev = null;
    for (let i = 0; i < 5; i++) {
      const x = 2000 + i * 280, kick = Math.max(0, Math.sin(bpOf(t) * Math.PI)) * (i % 2 ? 1 : -1) * .5;
      const arms = pylon(x, 640, 300, kick, lit); if (prev) cable(prev[0][1], arms[0][0], 6, lit); prev = arms;
    }
  }

  // ---------------- 75.06 – 77.40: through the hole in the wall onto the stage ----------------
  const HC = [960, 470], HOLE = Array.from({ length: 22 }, (_, i) => { const a = i / 22 * TAU, r = 310 * (.78 + .4 * hash(i * 3.1 + 7)); return [Math.cos(a) * r, Math.sin(a) * r * .9]; });
  const holeAt = sc => HOLE.map(([x, y]) => [HC[0] + x * sc, HC[1] + y * sc]);
  function spanAt(pts, y) {                                   // left/right x of the hole at height y, or null
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      if ((a[1] - y) * (b[1] - y) > 0 || a[1] === b[1]) continue;
      const x = a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]); lo = Math.min(lo, x); hi = Math.max(hi, x);
    }
    return lo < hi ? [lo, hi] : null;
  }
  function wall(t, sc) {
    const pts = holeAt(sc);
    irisShape(pts, BRICK);
    const bh = 64 * sc, bw = 150 * sc;
    for (let r = -14; r <= 14; r++) {
      const y = HC[1] + (r * 64 + 10) * sc; if (y < -10 || y > H + 10) continue;
      const sp = spanAt(pts, y), segs = sp ? [[-40, sp[0]], [sp[1], W + 40]] : [[-40, W + 40]];
      for (const [a, b] of segs) if (b - a > 4) inkLine([[a, y], [b, y]], 2.2, MORTAR, 'ink', 0);
      const ym = y + bh / 2, sm = spanAt(pts, ym);
      for (let c = -12; c <= 12; c++) {
        const x = HC[0] + (c * 150 + (r % 2 ? 75 : 0) + 30) * sc; if (x < -10 || x > W + 10) continue;
        if (sm && x > sm[0] - 6 && x < sm[1] + 6) continue;
        inkLine([[x, y], [x, y + bh]], 2, MORTAR, 'ink', 0);
        if (hash(r * 40 + c) < .25) paint(rectPts(x + 6 * sc, y + 6 * sc, bw - 12 * sc, bh - 12 * sc, 0), { wash: '#7E3A2E', washOp: 140, ink: null });
      }
    }
    paint(pts, { ink: PAL.ink, sw: 2.4 });
  }
  function bricksFlying(age) {
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * TAU + hash(i) * .4, sp = 900 + 900 * hash(i + 3), k = age * (1.2 + hash(i + 5));
      const d = 320 + sp * age, s = .8 + 1.1 * k * k, x = HC[0] + Math.cos(a) * d, y = HC[1] + Math.sin(a) * d * .85 + 300 * age * age;
      if (x < -300 || x > W + 300 || y < -300 || y > H + 300) continue;
      push(); translate(x, y); rotate(a + age * (3 + 4 * hash(i + 9)));
      paint(rectPts(-38 * s, -18 * s, 76 * s, 36 * s, 2), { wash: BRICK, washOp: 255, fill: '#6A2E25', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.4 });
      pop();
    }
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * TAU + .3, r = 60 + 160 * age, x = HC[0] + Math.cos(a) * (330 + 120 * age), y = HC[1] + Math.sin(a) * (300 + 120 * age);
      paint(ellPts(x, y, r, r * .8, 14, 8), { fill: soft(PAL.rose, .4), fillOp: 120 * (1 - clamp(age / 1.1)), bleed: .3, ink: null });
    }
  }
  function throughWall(t, lt) {
    const thru = easeIn(seg(t, bt(160) + .25, bt(162) + .1)), sc = 1 + 9 * thru;
    const zoom = lerp(1.55, 1.0, ease(seg(t, bt(160) + .1, bt(163))));
    const [sx, sy] = shakeXY(t, 12 * (1 - seg(lt, 0, .6)) + 2 * pulse(t, 8));
    camBegin(960 + sx, lerp(470, 540, ease(seg(t, bt(160), bt(163)))) + sy, zoom * (1 + .015 * pulse(t, 7)));
    festival(t, { hero: { pose: lt < .5 ? { eyes: 'normal', mouth: 'o' } : {} } });
    camEnd();
    if (sc < 9.5) wall(t, sc);
    if (lt < 1.4) bricksFlying(lt);
  }

  // ---------------- 77.40 – 81.15: the loss curve becomes a waterslide ----------------
  const P0 = [230, 170], P1 = [1610, 830], ANG = Math.atan2(P1[1] - P0[1], P1[0] - P0[0]);
  const along = k => [lerp(P0[0], P1[0], k), lerp(P0[1], P1[1], k)];
  function waterslide(t, lt) {
    const [sx, sy] = shakeXY(t, 2 * pulse(t, 8)), grow = easeOut(seg(lt, 0, .45));
    camBegin(960 + sx + lt * 8, 540 + sy, 1.02 + .02 * lt + .015 * pulse(t, 7));
    sky(-200, 2100, 900);
    // the screen fills the back, grid lit
    paint(rectPts(100, 60, 1480, 760, 2), { wash: '#3A3150', washOp: 255, ink: PAL.ink, sw: 1.4 });
    paint(rectPts(120, 78, 1440, 724, 1), { wash: '#130F28', washOp: 255, fill: PAL.indigo, fillOp: 40, tex: .4, ink: null });
    logGrid(140, 96, 1400, 690, 'near', NEON);
    lasers(t, 1);
    // the slide: the clay line is its rail, water rushes down it
    const n = [-Math.sin(ANG), Math.cos(ANG)], wd = 34 * grow, end = along(1);
    const off = (p, d) => [p[0] + n[0] * d, p[1] + n[1] * d];
    paint([off(P0, -wd), off(end, -wd), off(end, 26), off(P0, 26)], { fill: PAL.clay, fillOp: 80, bleed: .3, ink: null });
    if (grow > .02) {
      paint([off(P0, -wd), off(end, -wd), off(end, 6), off(P0, 6)], { wash: '#5FD3E4', washOp: 235, fill: NEON, fillOp: 60, tex: .4, ink: null });
      for (let i = 0; i < 9; i++) { const k = frac(i / 9 + lt * .9), a = along(k), b = along(Math.min(1, k + .05));
        inkLine([off(a, -wd * (.3 + .4 * hash(i))), off(b, -wd * (.3 + .4 * hash(i)))], 1.4, '#E9FFFC', 'inkfine', 0); }
      inkLine([off(P0, -wd - 4), off(end, -wd - 4)], 3, PAL.clayLt, 'ink', 0);
    }
    inkLine([off(P0, 8), off(end, 8)], 4, PAL.clay, 'ink', 0);                    // the line itself, now the rail
    // top platform with the queue
    paint(rectPts(60, 190, 210, 26, 2), { wash: '#9A6440', washOp: 255, ink: PAL.ink, sw: 1 });
    for (const x of [80, 240]) inkLine([[x, 216], [x, 820]], 3, '#7C4A2C', 'ink', 0);
    for (let i = 0; i < 4; i++) inkLine([[80, 300 + i * 130], [240, 300 + i * 130]], 2, '#7C4A2C', 'ink', 0);
    // the splash pool and crowd at the bottom right
    paint(ellPts(1650, 900, 330, 70, 22, 6), { wash: '#5FD3E4', washOp: 230, fill: NEON, fillOp: 50, tex: .4, ink: PAL.ink, sw: 1 });
    crowd(t, [{ y: 960, u: 10, n: 9, x0: 1240, x1: 1980 }, { y: 1040, u: 12, n: 14, x0: -40, x1: 1980 }]);
    // sliders: a pair launches on every beat, slides for three beats and splashes in on the beat
    const nq = Math.max(0, 2 - Math.floor((t - bt(170)) / BEAT));
    for (let q = 0; q < 2 + Math.min(2, nq); q++) clawd(110 + q * 52, 190, 9, { draw: q % 2 ? labCoat : HARD, ...move('bounce', t + q * .1, q), mouth: 'smile', eyes: 'happy', noShadow: true });
    for (let k = 0; k < 6; k++) {
      const t0 = bt(165 + k), s = (t - t0) / (3 * BEAT); if (s < -.05 || s > 1.9) continue;
      for (let m = 0; m < 2; m++) {
        const id = k * 2 + m;
        if (s < 1) {
          const kk = clamp(.04 + easeIn(clamp(s)) * .96 - m * .035), p = off(along(kk), -wd * .5 + m * 3);
          clawd(p[0], p[1] + 10, 15, { rot: ANG, draw: id % 2 ? labCoat : HARD, aL: 1.4, aR: 1.4, mouth: 'O', eyes: m ? 'happy' : 'closed', noShadow: true, noLegs: true });
        } else {
          const a = s - 1, p = [P1[0] + 120 * a * 3 + m * 40, 900 - 200 * Math.sin(Math.min(1, a * 2.5) * Math.PI) * (1 - a)];
          if (a < .5) clawd(p[0], p[1], 15, { rot: ANG + a * 6, draw: id % 2 ? labCoat : HARD, aL: 1.5, aR: 1.5, mouth: 'O', eyes: 'happy', noShadow: true, noLegs: true });
          for (let d = 0; d < 9; d++) { const da = -Math.PI * (.15 + .7 * d / 8), r = 40 + 360 * a, dx = P1[0] + 40 + Math.cos(da) * r, dy = 890 + Math.sin(da) * r * .8 + 500 * a * a;
            if (a < .7) paint(ellPts(dx, dy, 9 + 6 * hash(d + id), 12 + 6 * hash(d + id), 8), { wash: '#BDF6F2', washOp: 230 * (1 - a / .7), ink: null }); }
        }
      }
    }
    camEnd();
    if (lt > 3 * BEAT && lt < 3 * BEAT + .7) sfx('SPLOOSH!', 1560, 700, 76, '#BDF6F2', lt - 3 * BEAT, { life: .7, rot: .08 });
  }

  // ---------------- 81.15 – 84.43: in the crowd; the visor flashes; tilt out to the dunes ----------------
  function crowdShot(t, lt) {
    const out = ease(seg(t, barT(45) + 2 * BEAT, barT(46)));
    const [sx, sy] = shakeXY(t, 3 * pulse(t, 8) * (1 - out));
    camBegin(lerp(960, 1700, out) + sx, lerp(630, 520, out) + sy, lerp(1.3, .62, out) * (1 + .02 * pulse(t, 7)), -.06 * out);
    festival(t, { crowd: false, hero: { glow: helmetGlow(t) } });
    // a big burst from the visor on every beat
    const g = pulse(t, 7); paint(ellPts(960, 700 - 6.2 * 30, 200 + 160 * g, 50 + 40 * g, 20, 4), { fill: NEON, fillOp: 110 * g, bleed: .3, tex: .2, ink: null });
    crowd(t, [{ y: 830, u: 11, n: 12, x0: 240, x1: 1680 }, { y: 885, u: 14, n: 10, x0: 220, x1: 1700 }]);
    fans(t, 985, 17, 7, 260, 1660);
    camEnd();
  }

  // ---------------- 84.43 – 88.18: pylons march in over the dunes; a campus rises; BZZT ----------------
  const ZAP = barT(47) + 2 * BEAT;
  function pylonsShot(t, lt) {
    const [sx, sy] = shakeXY(t, 2 * pulse(t, 8) + 10 * Math.max(0, 1 - (t - ZAP) * 4) * (t > ZAP));
    camBegin(1060 + sx, 590 + sy, lerp(1.24, 1.14, ease(seg(lt, 0, 3.7))));
    sky(-200, 2100, 600);
    dunes(-200, 2100, 640);
    // the festival, far off on the left, still pumping
    push(); translate(430, 700); scale(.24); translate(-960, -780); festival(t, { noBg: true, lod: 'far', crowd: false }); pop();
    // pylons: a step on every beat, kicking like a chorus line
    const nb = (t - barT(46)) / BEAT, stepX = (Math.floor(nb) + easeOut(clamp(frac(nb) * 2.5))) * 64;
    let prev = null;
    for (let i = 0; i < 7; i++) {
      const x = 1560 + i * 250 - stepX, kick = (i % 2 ? 1 : -1) * Math.sin(clamp(frac(nb) * 2) * Math.PI) * .7;
      if (x > 2300) continue;
      const lit = t > ZAP ? 1 : 0, y = 700 - 8 * Math.sin(Math.PI * clamp(frac(nb) * 2));
      const arms = pylon(x, y, 300, kick, lit);
      if (prev) { const sag = lerp(80, 0, elasticOut(seg(t, ZAP, ZAP + .6)));
        cable(arms[0][1], prev[0][0], sag, lit); cable(arms[1][1], prev[1][0], sag * .8, lit); }
      prev = arms;
      if (t > ZAP && t < ZAP + .5) for (const a of arms) for (const p of a) paint(starPts(p[0], p[1], 26 * (1 - (t - ZAP) * 2), .3, 6, t * 5), { wash: '#E6FFFB', washOp: 255, ink: null });
    }
    // the campus: one building per beat out of the sand
    const B = [[620, 150, 150], [790, 200, 190], [1000, 170, 230], [1190, 150, 170], [1360, 190, 140], [880, 120, 120]];
    B.forEach(([x, w, h], j) => {
      const r = backOut(seg(t, bt(181 + j) - .12, bt(181 + j) + .25));
      if (r > 0) building(x, 760, w, h, r, t > ZAP ? 1 : 0);
      const age = t - bt(181 + j);
      if (age > -.1 && age < .8) for (let p = 0; p < 4; p++) paint(ellPts(x + w * (p / 3), 760 - 20 - 40 * age, 40 + 80 * age, 24 + 30 * age, 12, 5), { fill: soft(SAND_N, .3), fillOp: 140 * (1 - age / .8), bleed: .3, ink: null });
    });
    paint(rectPts(-200, 760, 2400, 600, 0), { wash: SAND_N, washOp: 255, fill: DUNE, fillOp: 60, tex: .5, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 7; i++) { const x = 100 + i * 300 + 80 * hash(i), y = 800 + 40 * (i % 3); inkLine([[x, y], [x + 110, y - 10], [x + 220, y]], .8, soft(SAND_N, .3), 'inkfine', .8); }
    camEnd();
    if (t > ZAP) { flash(.35 * Math.max(0, 1 - (t - ZAP) * 3), NEON); sfx('BZZT!', 1180, 300, 110, NEON, t - ZAP, { life: 1.1, rot: -.1 }); }
  }

  // ---------------- 88.18 – 92.39: Clawd shoves a bus-sized plug into the dune; every light comes on ----------------
  const JAM = bt(194);
  function plugShot(t, lt) {
    const on = t >= JAM, lit = on ? 1 : 0;
    const nb = (t - barT(48)) / BEAT, prog = on ? 1 : clamp((Math.floor(nb) + easeOut(clamp(frac(nb) * 2.2))) / 6);
    const px = lerp(440, 940, prog) + (on ? 0 : 0), [sx, sy] = shakeXY(t, on ? 14 * Math.max(0, 1 - (t - JAM) * 3) : 2 * pulse(t, 8));
    camBegin(960 + sx, 520 + sy, 1.0);
    sky(-200, 2100, 620);
    dunes(-200, 2100, 660, lit);
    push(); translate(260, 700); scale(.36); translate(-960, -780); festival(t, { noBg: true, lod: 'far', crowd: false, lit }); pop();
    // the socket dune on the right
    paint([[1260, 780], [1380, 380], [1640, 300], [1960, 340], [2100, 780]], { wash: DUNE_LT, washOp: 255, fill: PAL.clay, fillOp: 30, tex: .5, ink: PAL.ink, sw: 1.1, curv: .6 });
    paint(rrPts(1560, 430, 230, 300, 26), { wash: PAL.cream, washOp: 255, fill: soft(PAL.ochre, .5), fillOp: 50, tex: .4, ink: PAL.ink, sw: 1.6 });
    for (const y of [500, 620]) paint(rrPts(1600, y, 90, 34, 8), { wash: PAL.ink, washOp: 255, ink: null });
    paint(rectPts(-200, 760, 2400, 600, 0), { wash: SAND_N, washOp: 255, fill: DUNE, fillOp: 60, tex: .5, ink: PAL.ink, sw: .8 });
    if (!on) flash(.45, '#0E0A1E');
    // the cable, from the stage to the plug
    inkLine([[330, 760], [px - 220, 860], [px - 40, 760], [px + 20, 650]], 7, '#2A2340', 'ink', .7);
    // the plug: prongs out front, grip ridges
    const pw = 520, ph = 270, py = 480, x0 = px + 40;
    for (const y of [512, 632]) paint(rectPts(x0 + pw - 10, y, 170, 30, 1), { wash: '#D8C9A0', washOp: 255, fill: PAL.ochre, fillOp: 60, ink: PAL.ink, sw: 1.2 });
    paint(rrPts(x0, py, pw, ph, 40), { wash: '#ECE4D4', washOp: 255, fill: STEELV, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.6 });
    paint(rrPts(x0 - 40, py + 70, 60, 130, 18), { wash: '#BDB4CE', washOp: 255, ink: PAL.ink, sw: 1.2 });
    for (let i = 1; i < 5; i++) inkLine([[x0 + i * 70, py + 25], [x0 + i * 70, py + ph - 25]], 2, '#A79FBE', 'ink', 0);
    // Clawd shoving from behind
    const strain = !on;
    const m = mood(t, [[0, 'narrow', 'sweat'], [JAM, 'happy', '!!']]);
    clawd(px - 90, 770, 21, { draw: robotHelmet(on ? helmetGlow(t) : .35), ...m, rot: strain ? .14 : 0, aR: strain ? .1 : 1.5, aL: strain ? .3 : 1.5,
      walk: strain ? nb * .5 : null, mouth: strain ? 'wobble' : 'O', dy: on ? -2 * Math.sin(Math.PI * clamp((t - JAM) / .45)) : 0, sq: strain ? .05 * pulse(t, 8) : 0 });
    camEnd();
    if (on) {
      flash(.75 * Math.max(0, 1 - (t - JAM) * 3), PAL.cream);
      sfx('CLUNK!', 1300, 300, 110, PAL.ochre, t - JAM, { life: 1.1, rot: -.08 });
    }
  }

  // ---------------- 92.39 – 97.55: unison chant, confetti cannons, pull way out ----------------
  const FIRE = [bt(197), barT(51), barT(52), barT(52) + 2 * BEAT];
  const CONF = [NEON, PINK, PAL.ochre, PAL.clay, PAL.cream, '#B79BE8'];
  function confetti(t) {
    FIRE.forEach((f, b) => {
      const age = t - f; if (age < 0 || age > 4) return;
      for (const [cx, dir] of [[300, 1], [1620, -1]]) {
        if (age < .4) { const r = 50 * (1 - age / .4); paint(starPts(cx + dir * 50, 600, r + 20, .4, 8), { wash: PAL.cream, washOp: 230 * (1 - age / .4), ink: null }); }
        for (let i = 0; i < 34; i++) {
          const s = b * 97 + i + (dir > 0 ? 0 : 500), vx = dir * (150 + 650 * hash(s)), vy = -(900 + 900 * hash(s + 1)), k = 2.6, vt = 160;
          const e = (1 - Math.exp(-k * age)) / k, x = cx + vx * e + 30 * Math.sin(age * 5 + s), y = 620 + vt * age + (vy - vt) * e;
          if (y > 1000) continue;
          push(); translate(x, y); rotate(age * (4 + 6 * hash(s + 2)) + s);
          paint(rectPts(-14, -8 * Math.cos(age * 9 + s), 28, 16 * Math.abs(Math.cos(age * 9 + s)) + 3, 0), { wash: CONF[(s * 7) % 6], washOp: 255, ink: null });
          pop();
        }
      }
    });
  }
  function cannons() {
    for (const [cx, dir] of [[300, 1], [1620, -1]]) {
      push(); translate(cx, 690); rotate(dir * .5);
      paint(rrPts(-28, -110, 56, 120, 12), { wash: '#4B4466', washOp: 255, fill: PAL.violet, fillOp: 40, ink: PAL.ink, sw: 1.2 });
      paint(ellPts(0, -110, 30, 9, 12), { wash: PAL.ink, washOp: 255, ink: null });
      pop();
    }
  }
  function finale(t, lt, dur) {
    const k = ease(seg(t, bt(197), 97.6)), [sx, sy] = shakeXY(t, 3 * pulse(t, 8));
    camBegin(960 + sx, lerp(540, 470, k) + sy, lerp(1.0, .6, k) * (1 + .015 * pulse(t, 7)));
    festival(t, { mode: 'chant', wide: true, hero: { pose: { aL: .55 + .35 * pulse(t, 6), aR: .55 + .35 * pulse(t, 6), dy: -1.2 * pulse(t, 6), mouth: 'O' } } });
    cannons();
    confetti(t);
    camEnd();
  }

  chapter('festival', barT(41), 97.55, [[barT(41), throughWall], [bt(165), waterslide], [bt(173), crowdShot], [barT(46), pylonsShot], [barT(48), plugShot], [bt(197), finale]]);
})();
