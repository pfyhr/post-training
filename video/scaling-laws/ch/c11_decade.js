// c11_decade.js: 219.39-241.2, bars 118-126 plus the tail and a silent end card. The outro: one last Powers of Ten. Every "Bigger" pulls back
// another level (planet, moon, solar system, galaxy) while Clawd surfs the line, which stays dead straight through it
// all. The galaxy shrinks to one clay data point on a sheet of log-log paper pinned to the Researcher's drafting board:
// the cover painting. The line runs off the edge, the Researcher sighs and tapes on a fresh sheet, Clawd rules the
// line onward and winks. The desk lamp clicks off (bookending chapter 0) and the end card comes up.
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { HARD } = SL;
  const SPACE = '#141A3E';
  // The line goes through the zoom centre, so it is the same line at every scale. on(d): point d px along it.
  const A = .44, CA = Math.cos(A), SA = Math.sin(A), NX = -SA, NY = CA;
  const on = d => [960 + d * CA, 540 + d * SA];
  const band = (a, b, hw) => { const [ax, ay] = on(a), [bx, by] = on(b);
    return [[ax + NX * hw, ay + NY * hw], [bx + NX * hw, by + NY * hw], [bx - NX * hw, by - NY * hw], [ax - NX * hw, ay - NY * hw]]; };

  // ---------------- the zoom: levels in their own 1920x1080 frames, each child at 1/10 about the centre ----------------
  // 0 planet, 1 planet + moon, 2 solar system, 3 galaxy, 4 the desk. The desk is only 10^.35 out from the paper level,
  // so the sheet (in desk coordinates) is where the galaxy is a dot of radius 67.
  const O = [0, 1, 2, 3, 4.35];
  const ZK = [[219.39, 221.2, .1], [barT(119) - .1, barT(119) + 1.35, .9], [barT(120) - .1, barT(120) + 1.35, 1],
              [barT(121) - .1, barT(121) + 1.35, 1], [barT(122) - .1, barT(122) + 1.45, 1], [barT(123) - .1, barT(123) + 1.6, .35]];
  const zoomAt = t => ZK.reduce((z, [a, b, d]) => z + d * ease(seg(t, a, b)), 0);
  const hopAt = t => ZK.slice(1).reduce((h, [a, b]) => Math.max(h, Math.sin(Math.PI * seg(t, a, b))), 0);
  const P = (s, x, y) => [960 + (x - 960) * s, 540 + (y - 540) * s];
  const circ = (s, x, y, r, n = 24, j = 0) => { const [cx, cy] = P(s, x, y); return ellPts(cx, cy, r * s, r * s, n, j); };
  const R = (s, x, y, w, h, j = 0) => { const [a, b] = P(s, x, y); return rectPts(a, b, w * s, h * s, j); };
  const onScreen = (x, y, r) => x + r > -40 && x - r < W + 40 && y + r > -40 && y - r < H + 40;
  // a thin orbit ring in screen space (strokes never scale), drawn only where it crosses the frame
  function ring(cx, cy, r, sw, col) {
    if (r < 4 || r > 60000 || !onScreen(cx, cy, r)) return;
    const n = Math.round(clamp(r * TAU / 30, 48, 900)); let run = [];
    for (let i = 0; i <= n; i++) {
      const a = i / n * TAU, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      if (x > -80 && x < W + 80 && y > -80 && y < H + 80) run.push([x, y]);
      else { if (run.length > 1) inkLine(run, sw, col, 'inkfine', .3); run = []; }
    }
    if (run.length > 1) inkLine(run, sw, col, 'inkfine', .3);
  }

  // ---------------- space: a self-similar starfield (a set of stars per decade, like c00's grid) ----------------
  function spaceBg(t) {
    paint(rectPts(-80, -80, W + 160, H + 160), { wash: SPACE, washOp: 255, ink: null });
    paint(ellPts(380 + 40 * wob(t, .05), 260, 700, 360, 24, 20, .3), { wash: PAL.violet, washOp: 45, ink: null, curv: .5 });
    paint(ellPts(1560, 820 + 30 * wob(t, .04, .3), 620, 320, 24, 20, -.4), { wash: PAL.rose, washOp: 28, ink: null, curv: .5 });
  }
  function starfield(z, k) {
    if (k < .02) return;
    const f = frac(z), Z = Math.floor(z);
    for (let d = -1; d <= 1; d++) {
      const m = Math.pow(10, d - f), D = Z + d, a = 255 * k * clamp((m - .03) / .15);
      if (a < 8) continue;
      for (let i = 0; i < 34; i++) {
        const h = D * 97 + i, rx = (hash(h) - .5) * 2200, ry = (hash(h + .5) - .5) * 1240;
        if (Math.abs(rx) < 110 && Math.abs(ry) < 62) continue;
        const x = 960 + rx * m, y = 540 + ry * m; if (!onScreen(x, y, 0)) continue;
        const r = (1.3 + 3 * hash(h + .3) ** 2) * clamp(.35 + m * .5, .35, 1.4), col = hash(h + .9) > .7 ? '#FFE3A8' : PAL.cream;
        paint(hash(h + .7) > .82 ? starPts(x, y, r * 2.6, .3, 4) : ellPts(x, y, r, r, 6), { wash: col, washOp: a, ink: null });
      }
    }
  }

  // ---------------- 0: the planet, lights all back on after the CLUNK ----------------
  const SUN = [-CA, -SA], SUN_P = [SA, -CA];                // sunlight comes from the upper left, down the line
  const CONT = [[-120, -60, 120, 80, .4], [90, 60, 140, 90, -.3], [-40, 170, 90, 50, .2], [150, -150, 70, 50, .8], [-170, 110, 60, 70, 0]];
  const TOWNS = [[-110, -40], [-60, -90], [70, 40], [130, 80], [40, 110], [-40, 160], [-150, 120], [170, -130], [120, -170], [-20, 175]];
  function planet(t, s) {
    const r = 300 * s; if (r < .8) return;
    if (r < 7) { paint(ellPts(960, 540, Math.max(r, 1.6), Math.max(r, 1.6), 10), { wash: PAL.sky, washOp: 255, ink: null }); return; }
    const lit = 1 + 1.6 * Math.exp(-(t - 219.39) * 4) + .3 * pulse(t, 7);
    paint(ellPts(960, 540, r * 1.14, r * 1.14, 32), { fill: PAL.sky, fillOp: 80, bleed: .3, tex: .3, ink: null });
    paint(ellPts(960, 540, r, r, 40, r * .004), { wash: '#24356F', washOp: 255, fill: PAL.teal, fillOp: 55, tex: .5, border: .5, ink: r > 40 ? PAL.ink : null, sw: 1.3 });
    for (const [x, y, rx, ry, rot] of CONT) paint(ellPts(960 + x * s, 540 + y * s, rx * s, ry * s, 16, r * .01, rot), { wash: '#7A6A48', washOp: 255, fill: PAL.ochre, fillOp: 40, tex: .5, ink: null });
    // the day side: a crescent along the sunward limb
    const cr = []; for (let i = 0; i <= 20; i++) { const ph = -Math.PI / 2 + i / 20 * Math.PI; cr.push([960 + r * (Math.cos(ph) * SUN[0] + Math.sin(ph) * SUN_P[0]), 540 + r * (Math.cos(ph) * SUN[1] + Math.sin(ph) * SUN_P[1])]); }
    for (let i = 20; i >= 0; i--) { const ph = -Math.PI / 2 + i / 20 * Math.PI; cr.push([960 + r * (.42 * Math.cos(ph) * SUN[0] + Math.sin(ph) * SUN_P[0]), 540 + r * (.42 * Math.cos(ph) * SUN[1] + Math.sin(ph) * SUN_P[1])]); }
    paint(cr, { wash: '#E9C98A', washOp: 150, fill: PAL.cream, fillOp: 80, bleed: .2, ink: null, curv: .3 });
    if (r < 25) return;
    // desert towns, lit: a glow each, and specks when close enough to see them
    TOWNS.forEach(([x, y], i) => {
      const cx = 960 + x * s, cy = 540 + y * s;
      paint(ellPts(cx, cy, 34 * s, 28 * s, 12), { fill: PAL.ochre, fillOp: clamp(60 * lit, 0, 200), bleed: .3, ink: null });
      if (r > 90) for (let j = 0; j < 6; j++) { const a = hash(i * 7 + j) * TAU, d = hash(i * 7 + j + .4) * 20 * s, q = Math.max(1.3, 3.2 * s);
        paint(ellPts(cx + Math.cos(a) * d, cy + Math.sin(a) * d, q, q, 6), { wash: j % 3 ? PAL.ochre : PAL.cream, washOp: 255, ink: null }); }
    });
  }

  // ---------------- 1: planet and moon ----------------
  const MOON = [960 + 260 * Math.cos(2.6), 540 + 260 * Math.sin(2.6)];
  function moon(t, s) {
    const r = 27 * s; if (r < .8) return;
    ring(960, 540, 260 * s, .5, soft(PAL.sky, .3));
    const [x, y] = P(s, ...MOON); if (!onScreen(x, y, r)) return;
    paint(ellPts(x, y, Math.max(r, 1.2), Math.max(r, 1.2), 18), { wash: '#CFC6B4', washOp: 255, fill: PAL.cream, fillOp: 60, tex: .5, ink: r > 14 ? PAL.ink : null, sw: .9 });
    if (r > 10) for (const [cx, cy, cr] of [[-.3, -.2, .25], [.35, .2, .18], [-.05, .45, .14]]) paint(ellPts(x + cx * r, y + cy * r, cr * r, cr * r, 10), { wash: '#A99F8C', washOp: 255, ink: null });
  }

  // ---------------- 2: the solar system (the sun sits on the line too) ----------------
  const SUNP = on(-600);
  const ORB = [[170, 9, PAL.rose, 1.2], [330, 14, PAL.ochre, 2.6], [880, 11, PAL.clay, 4.1], [1300, 44, '#E0B080', 5.3, 1], [1750, 30, PAL.sky, .6]];
  function solar(t, s) {
    if (s < .004) return;
    const [sx, sy] = P(s, ...SUNP), rs = 70 * s;
    ring(sx, sy, 600 * s, .7, soft(PAL.clay, .25));         // our orbit, through the centre
    ORB.forEach(([or, pr, col, a0, ringed], i) => {
      ring(sx, sy, or * s, .5, soft(PAL.sky, .45));
      const a = a0 + (t - 219.39) * .06 * (i + 1) * .4, x = sx + Math.cos(a) * or * s, y = sy + Math.sin(a) * or * s, r = Math.max(1.2, pr * s);
      if (!onScreen(x, y, r * 2.4) || r > 3000) return;
      if (ringed && r > 4) paint(ellPts(x, y, r * 2.1, r * .55, 22, 0, -.3), { wash: soft(PAL.ochre, .3), washOp: 200, ink: r > 15 ? PAL.ink : null, sw: .7 });
      paint(ellPts(x, y, r, r, 16), { wash: col, washOp: 255, fill: PAL.clayDk, fillOp: 40, tex: .4, ink: r > 15 ? PAL.ink : null, sw: .9 });
    });
    if (rs < 6000 && onScreen(sx, sy, rs * 4)) {
      paint(ellPts(sx, sy, rs * 4, rs * 4, 32), { fill: PAL.clayLt, fillOp: 70, bleed: .3, tex: .3, ink: null });
      paint(ellPts(sx, sy, Math.max(rs, 1.8), Math.max(rs, 1.8), 30, rs * .01), { wash: '#FFD27A', washOp: 255, fill: PAL.ochre, fillOp: 80, tex: .4, ink: rs > 15 ? PAL.ink : null, sw: 1.1 });
      if (rs > 8) paint(ellPts(sx - rs * .25, sy - rs * .25, rs * .45, rs * .35, 14), { wash: PAL.cream, washOp: 170, ink: null });
    }
  }

  // ---------------- 3: the galaxy, in a disc of space that becomes the clay dot on the paper ----------------
  const GAL = on(350), GR = 1500;
  function galaxy(t, s) {
    if (s > 30) return;
    const dot = clamp((.16 - s) / .1), [gx, gy] = P(s, ...GAL);
    if (s < 1.02) paint(ellPts(gx, gy, GR * s, GR * s, 40, 1), { wash: mixCol(SPACE, PAL.clay, dot), washOp: 255, fill: dot > .5 ? PAL.clayDk : PAL.indigo, fillOp: 50, tex: .4,
      ink: s < .7 ? PAL.ink : null, sw: 1 });
    if (s < .045) return;
    const al = (1 - dot * .85) * clamp((5 - s) / 3), rot = .89 + (t - 219.39) * .03;
    if (s < 1.02 && s > .2) for (let i = 0; i < 40; i++) {                   // field stars inside the disc
      const a = hash(i + 300) * TAU, d = Math.sqrt(hash(i + 301)) * 1400, x = gx + Math.cos(a) * d * s, y = gy + Math.sin(a) * d * s;
      if (onScreen(x, y, 0)) paint(ellPts(x, y, 2, 2, 6), { wash: PAL.cream, washOp: 200, ink: null });
    }
    const blob = (x, y, r, o) => { const [a, b] = P(s, x, y); if (r * s < 5000 && onScreen(a, b, r * s)) paint(ellPts(a, b, r * s, r * s * .8, 18, 0, rot), { curv: .5, ...o }); };
    blob(GAL[0], GAL[1], 1150, { wash: PAL.violet, washOp: 35 * al, ink: null });
    // two spiral arms, each a soft band with a brighter core, along r = 120 e^(0.4 th)
    const armBand = (arm, wk, col, op) => { const out = [], inn = [];
      for (let i = 0; i <= 30; i++) { const th = rot + arm * Math.PI + i * .17, r = 120 * Math.exp(i * .0675), hw = (22 + r * .13) * wk * Math.min(1, i / 4 + .3, (30 - i) / 8 + .15);
        out.push(P(s, GAL[0] + Math.cos(th) * (r + hw), GAL[1] + Math.sin(th) * (r + hw))); inn.unshift(P(s, GAL[0] + Math.cos(th) * (r - hw), GAL[1] + Math.sin(th) * (r - hw))); }
      // a spiral is far from convex, so paint it as short quads (one big polygon fills wrongly)
      for (let i = 0; i < 30; i += 2) { const j = Math.min(30, i + 2), q = [out[i], out[i + 1], out[j], inn[30 - j], inn[30 - i - 1], inn[30 - i]];
        if (q.some(p => onScreen(p[0], p[1], 0))) paint(q, { wash: col, washOp: op * al, ink: null }); } };
    for (const arm of [0, 1]) { armBand(arm, 1.7, PAL.sky, 40); armBand(arm, .7, PAL.rose, 45); armBand(arm, .28, PAL.cream, 130); }
    for (const arm of [0, 1]) for (let i = 0; i < 15; i++) {
      const th = rot + arm * Math.PI + i * .34, r = 120 * Math.exp(i * .135);
      if (s > .2) for (let j = 0; j < 3; j++) { const q = r + (hash(i * 3 + j + arm * 50) - .5) * 90, a2 = th + (hash(i * 3 + j + 9) - .5) * .25,
        [x, y] = P(s, GAL[0] + Math.cos(a2) * q, GAL[1] + Math.sin(a2) * q); if (onScreen(x, y, 0)) paint(ellPts(x, y, 2.2, 2.2, 6), { wash: PAL.cream, washOp: 230 * al, ink: null }); }
    }
    blob(GAL[0], GAL[1], 260, { wash: PAL.clayLt, washOp: 70 * al, ink: null });
    blob(GAL[0], GAL[1], 120, { wash: '#FFE6B0', washOp: 90 * al, ink: null }); blob(GAL[0], GAL[1], 55, { wash: '#FFF2D0', washOp: 210 * al, ink: null });
  }

  // ---------------- 4: the desk, in screen coordinates at its native scale ----------------
  const SH = { x: 120, y: 120, w: 980, h: 760 };           // the sheet: 4 decades across, 3 up
  const D_IN = (SH.x - 960) / CA, D_OUT = (SH.x + SH.w - 960) / CA;
  // data points along the line, before the galaxy. All of them sit further up the line than Clawd (D_CLAWD = -380): the
  // final zoom slides each dot in toward the centre, so a dot closer in than Clawd would pass right under it.
  const DOTS = [[-880, 20], [-720, 30], [-545, 42]];
  const NEW = { x: 1110, y: 150, w: 380, h: 730 };          // the fresh sheet, taped to the right edge
  function grid(s, x0, y0, w, h, nx, ny, cw = w) {
    for (let d = 0; d < nx; d++) for (let m = 1; m < 10; m++) {
      if (!d && m === 1) continue;
      const X = 960 + (x0 + (d + Math.log10(m)) * w / nx - 960) * s, lw = Math.min(5, Math.max(.8, (m === 1 ? 2 : .9) * s));
      if (X < -10 || X > W + 10 || X > 960 + (x0 + cw - 960) * s - 2) continue; const [, a] = P(s, 0, y0), [, b] = P(s, 0, y0 + h);
      paint(rectPts(X - lw / 2, Math.max(a, -20), lw, Math.min(b, H + 20) - Math.max(a, -20)), { wash: m === 1 ? soft(PAL.teal, .2) : soft(PAL.teal, .55), washOp: 255, ink: null });
    }
    for (let d = 0; d < ny; d++) for (let m = 1; m < 10; m++) {
      if (!d && m === 1) continue;
      const Y = 540 + (y0 + h - (d + Math.log10(m)) * h / ny - 540) * s, lw = Math.min(5, Math.max(.8, (m === 1 ? 2 : .9) * s));
      if (Y < -10 || Y > H + 10 || Y < 540 + (y0 - 540) * s + 2) continue; const [a] = P(s, x0, 0), [b] = P(s, x0 + cw, 0);
      paint(rectPts(Math.max(a, -20), Y - lw / 2, Math.min(b, W + 20) - Math.max(a, -20), lw), { wash: m === 1 ? soft(PAL.teal, .2) : soft(PAL.teal, .55), washOp: 255, ink: null });
    }
  }
  function room(s) {
    if (s > 3.6) return;
    paint(rectPts(-80, -80, W + 160, H + 160), { wash: '#7A5A46', washOp: 255, fill: PAL.clayDk, fillOp: 50, tex: .5, ink: null });
    paint(R(s, 108, 92, 1620, 960, 3), { wash: '#B98552', washOp: 255, fill: PAL.clayDk, fillOp: 45, tex: .6, border: .5, ink: PAL.ink, sw: 1.2 });     // drafting board
    for (let i = 0; i < 7; i++) paint(R(s, 130, 160 + i * 128 + 30 * hash(i), 1580, 3), { wash: '#9C6A3E', washOp: 200, ink: null });            // grain
  }
  function sheet(s) {
    paint(R(s, SH.x + 8, SH.y + 10, SH.w, SH.h), { wash: PAL.ink, washOp: 80, ink: null });
    paint(R(s, SH.x, SH.y, SH.w, SH.h, s < 4 ? 1 : 0), { wash: PAL.cream, washOp: 255, fill: PAL.paper, fillOp: 90, tex: .4, ink: s < 4 ? PAL.ink : null, sw: .8 });
    grid(s, SH.x, SH.y, SH.w, SH.h, 4, 3);
    if (s < 3) ['10²³', '10²⁴', '10²⁵', '10²⁶'].forEach((l, i) => { const [x, y] = P(s, SH.x + 16 + i * SH.w / 4, SH.y + SH.h - 22); letter(l, x + 28 * s, y, 24 * s, PAL.indigo, { ink: false }); });
    for (const [d, r] of DOTS) { const [x, y] = P(s, ...on(d)); if (onScreen(x, y, r * s)) paint(ellPts(x, y, r * s, r * s, 20, 1), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 40, tex: .4, ink: PAL.ink, sw: .9 }); }
  }
  // the desk lamp, clamped to the top of the board, shade aimed at the sheet
  function lampProp(s, t) {
    const q = (x, y) => P(s, x, y), seg2 = (a, b, w) => { const [ax, ay] = q(...a), [bx, by] = q(...b), dx = by - ay, dy = ax - bx, l = Math.hypot(dx, dy) / (w * s / 2);
      return [[ax + dx / l, ay + dy / l], [bx + dx / l, by + dy / l], [bx - dx / l, by - dy / l], [ax - dx / l, ay - dy / l]]; };
    paint(R(s, 150, 80, 56, 44, 1), { wash: PAL.indigo, washOp: 255, ink: PAL.ink, sw: .9 });                 // clamp
    paint(seg2([178, 84], [270, 8], 14), { wash: '#4A5578', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(seg2([270, 8], [450, 40], 14), { wash: '#4A5578', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(circ(s, 270, 8, 12, 12), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .7 });
    const sh = [[420, 30], [480, 14], [560, 130], [440, 168]].map(p => q(...p));
    paint(sh, { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.1 });
  }
  function bulb(s, k) {
    if (k < .02) return;
    paint(circ(s, 503, 152, 30, 14), { wash: '#FFF2C8', washOp: 255 * k, ink: null });
    paint(circ(s, 503, 152, 100, 18), { fill: PAL.ochre, fillOp: 120 * k, bleed: .3, ink: null });
  }

  // ---------------- the Researcher, the fresh sheet, tape and ruler (desk only, native scale) ----------------
  const T_SIGH = barT(124), T_RIP = bt(Math.round(bpOf(231.57))), T_FLY = 232.0, T_TAPE = [barT(125), barT(125) + BEAT], T_OFF = barT(126);
  const padHook = (s, sw) => {
    paint(rectPts(-1.2 * s, -1.6 * s, 2.6 * s, 3.4 * s, s * .03), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .7 });
    for (let i = 1; i < 4; i++) { inkLine([[-1.2 * s + i * .65 * s, -1.5 * s], [-1.2 * s + i * .65 * s, 1.7 * s]], sw * .4, soft(PAL.teal, .3), 'inkfine', 0);
      inkLine([[-1.1 * s, -1.6 * s + i * .85 * s], [1.3 * s, -1.6 * s + i * .85 * s]], sw * .4, soft(PAL.teal, .3), 'inkfine', 0); }
  };
  const heldSheet = (s, sw) => {
    paint(rectPts(-.4 * s, -4.4 * s, 3.4 * s, 4.8 * s, s * .05), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .8 });
    for (let i = 1; i < 4; i++) inkLine([[-.4 * s + i * .85 * s, -4.3 * s], [-.4 * s + i * .85 * s, .3 * s]], sw * .4, soft(PAL.teal, .3), 'inkfine', 0);
  };
  function prof(t, s) {
    const x = 960 + (1725 - 960) * s, y = 540 + (1075 - 540) * s, u = 46 * s;
    if (x - 3 * u > W + 40) return;
    const m = mood(t, [[0, 'look'], [T_SIGH, 'closed', 'sweat'], [T_RIP - .25, 'look'], [233.0, 'look'], [233.85, 'dot']]);
    let aR = -1.15, aL = -.55, mouth = 'o', brows = 'worried', dy = 0;
    if (t >= T_SIGH && t < T_RIP - .25) { mouth = 'wobble'; dy = .12 * ease(seg(t, T_SIGH, T_SIGH + .3)); aR = -1.25; aL = -.7; }
    if (t >= T_RIP - .25) { brows = 'angry'; mouth = 'flat'; aR = kf(t, [[T_RIP - .25, -1.15], [T_RIP, .95], [T_FLY, .95], [T_FLY + .2, .1], [233.0, .05], [233.3, -1.1]], easeOut); }
    if (t >= 233.0) { brows = null; mouth = 'smile'; }
    if (t >= 233.85) mouth = 'grin';
    const lookX = t < 233.85 ? 1 : 0, lookY = t < 233.85 ? .4 : 0;
    researcher(x, y, u, { ...m, flip: true, aR, aL, mouth, brows, dy, lookX, lookY, blush: t >= 233.85, noShadow: true,
      handL: padHook, handR: t >= T_RIP && t < T_FLY ? heldSheet : null, sq: .05 * pulse(t, 8) });
    if (t >= T_SIGH && t < T_SIGH + 1) sfx('sigh…', x + 30, y - 15.5 * u, 46, PAL.cream, t - T_SIGH, { life: 1, rot: .06 });
    if (t >= T_RIP && t < T_RIP + .6) sfx('RRRIP', x - 240, y - 13 * u, 70, PAL.cream, t - T_RIP, { life: .6 });
  }
  function freshSheet(t) {
    if (t < T_FLY) return;
    const k = backOut(seg(t, T_FLY, T_FLY + .3)), c0 = [1560, 500], c1 = [NEW.x + NEW.w / 2, NEW.y + NEW.h / 2];
    const cx = lerp(c0[0], c1[0], k), cy = lerp(c0[1], c1[1], k), w = lerp(160, NEW.w, k), h = lerp(230, NEW.h, k), rot = lerp(-.35, -.012, k);
    const rp = (dx, dy) => [cx + dx * Math.cos(rot) - dy * Math.sin(rot), cy + dx * Math.sin(rot) + dy * Math.cos(rot)];
    const quad = (o, ww, hh) => [rp(-ww / 2 + o, -hh / 2 + o), rp(ww / 2 + o, -hh / 2 + o), rp(ww / 2 + o, hh / 2 + o), rp(-ww / 2 + o, hh / 2 + o)];
    paint(quad(7, w, h), { wash: PAL.ink, washOp: 70, ink: null });
    paint(quad(0, w, h), { wash: PAL.cream, washOp: 255, fill: PAL.paper, fillOp: 70, tex: .4, ink: PAL.ink, sw: .8 });
    if (k > .97) grid(1, NEW.x, NEW.y, SH.w / 4 * 2, NEW.h, 2, 3, NEW.w);
  }
  function tape(t) {
    T_TAPE.forEach((tt, i) => { if (t < tt) return; const p = backOut(seg(t, tt, tt + .18)), [x, y] = i ? [1106, 830] : [1106, 200];
      push(); translate(x, y); rotate(i ? -.18 : .22); scale(p);
      paint(rectPts(-46, -15, 92, 30, 1.5), { wash: '#F1DE9C', washOp: 215, ink: PAL.ink, sw: .5 }); pop();
      if (t - tt < .4) sfx('rrt', x + 40, y - 46, 40, PAL.cream, t - tt, { life: .4 }); });
  }
  const RUL0 = 70, RUL1 = 590;
  function ruler(t) {
    if (t < T_TAPE[0]) return;
    const k = backOut(seg(t, T_TAPE[0], T_TAPE[0] + .3)), off = 26 + 140 * (1 - k);
    push(); translate(NX * off, NY * off);
    paint(band(RUL0, RUL1, 17), { wash: '#E6C277', washOp: 255, fill: PAL.ochre, fillOp: 50, tex: .4, ink: PAL.ink, sw: .9 });
    for (let d = RUL0 + 10; d < RUL1; d += 20) { const [x, y] = on(d), l = (d - RUL0) % 100 === 10 ? 16 : 8;
      inkLine([[x - NX * 17, y - NY * 17], [x - NX * (17 - l), y - NY * (17 - l)]], .5, PAL.ink, 'inkfine', 0); }
    pop();
  }
  const extTip = t => lerp(D_OUT, 540, ease(seg(t, 232.75, 233.75)));

  // ---------------- the line itself: glowing in space, ink on paper, ending at the sheet's edge ----------------
  function theLine(t, z, s) {
    const d0 = Math.max(D_IN * s, -2600), d1 = Math.min((D_OUT + 12) * s, 2600), w = Math.min(18, 8 * s), g = clamp(1 - (z - 3.2) / .8);
    if (g > .02) { const gl = (60 + 50 * pulse(t, 6)) * g; paint(band(d0, d1, w * 2.2), { wash: PAL.clayLt, washOp: gl * .45, ink: null }); paint(band(d0, d1, w * 1.3), { wash: PAL.clayLt, washOp: gl * .7, ink: null }); }
    paint(band(d0, d1, w / 2), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 50, tex: .4, ink: null });
    if (g > .02) paint(band(d0, d1, w * .13), { wash: PAL.cream, washOp: 150 * g, ink: null });
    if (t > 232.75) paint(band(D_OUT, extTip(t), 4), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 50, tex: .4, ink: null });
  }

  // ---------------- Clawd rides the line the whole way, the same size on screen ----------------
  const D_CLAWD = -380, PTIP = 160;                       // PTIP: how far ahead of Clawd's feet the pencil touches the line
  function hero(t, z) {
    const m = mood(t, [[0, 'happy'], [229.95, 'look'], [231.3, 'scared', '!'], [232.25, 'spark'], [232.7, 'look'], [233.85, 'wink', 'spark']]);
    let d = D_CLAWD, o = {}, rot = A;
    const chant = frac(bpOf(t)) < .45;
    if (t < 229.95) {
      const hop = hopAt(t);
      o = { dy: -hop * 3, sq: (1 - hop) * .14 * pulse(t, 8), aL: .6 + hop * 1 + .3 * pulse(t), aR: .6 + hop * 1 + .3 * pulse(t), mouth: chant ? 'O' : 'smile',
        eyes: chant && !hop ? 'closed' : 'happy' };
    } else if (t < 231.3) {
      d = lerp(D_CLAWD, D_OUT - 26, ease(seg(t, 229.95, 231.3)));
      o = { walk: t * 3.2, dy: -.5 * Math.abs(Math.sin(t * 3.2 * TAU)), aL: .3, aR: .3, lookX: 1, mouth: 'smile' };
    } else if (t < 232.75) {
      d = D_OUT - 26;
      const teeter = t < 232.25 ? 1 : 0;
      o = { aL: teeter ? 1.2 + .7 * Math.sin(t * 22) : .5, aR: teeter ? 1.2 - .7 * Math.sin(t * 22) : .5, mouth: teeter ? 'O' : 'grin', lookX: 1, lookY: .6 };
      rot = A + teeter * .14 * Math.sin(t * 9);
    } else {
      d = t < 233.85 ? extTip(t) - PTIP : 540 - PTIP;
      const drawing = t < 233.85;
      o = { walk: drawing && t < 233.75 ? t * 3 : null, aR: drawing ? -.35 : 1.3 + .2 * pulse(t, 8), aL: drawing ? .3 : .4, lookX: drawing ? 1 : 0, lookY: drawing ? .5 : 0,
        mouth: drawing ? 'cat' : 'grin', dy: drawing ? 0 : -1.2 * Math.abs(Math.sin(bpOf(t) * Math.PI)) };
    }
    const [x, y] = on(d);
    clawd(x, y, 20, { draw: HARD, noShadow: true, rot, ...m, ...o });
    if (t > 232.75 && t < 233.85) {                         // a big pencil from the hand down to the tip of the new line
      const u = 20, aR = o.aR, hl = [(4.9 + 2.2 * Math.cos(aR)) * u, (-4.5 - 2.2 * Math.sin(aR)) * u];
      const h = [x + hl[0] * CA - hl[1] * SA, y + hl[0] * SA + hl[1] * CA], tp = on(extTip(t));
      const dx = tp[0] - h[0], dy = tp[1] - h[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux;
      const P = (a, b) => [tp[0] - ux * a + px * b, tp[1] - uy * a + py * b], len = L + 40, hw = 9;
      paint([P(len, -hw), P(22, -hw), P(22, hw), P(len, hw)], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .7 });
      paint([P(len + 12, -hw), P(len, -hw), P(len, hw), P(len + 12, hw)], { wash: PAL.rose, washOp: 255, ink: PAL.ink, sw: .6 });
      paint([P(22, -hw), P(0, 0), P(22, hw)], { wash: '#F2D2A8', washOp: 255, ink: PAL.ink, sw: .6 });
      paint([P(7, -3), P(0, 0), P(7, 3)], { wash: PAL.ink, washOp: 255, ink: null });
    }
  }

  // a Powers-of-Ten scale tag, in metres
  const TAGS = [[0, '10⁷ m'], [1, '10⁹ m'], [2, '10¹³ m'], [3, '10²¹ m'], [4.35, '1 m']];
  function scaleTag(t, z) {
    let i = 0; for (let j = 0; j < TAGS.length; j++) if (z > TAGS[j][0] - .45) i = j;
    const tt = [219.39, barT(119) + .5, barT(120) + .5, barT(121) + .5, barT(123) + .6][i], age = t - tt;
    letter(TAGS[i][1], 1730, 110, 60, i === 4 ? PAL.cream : PAL.ochre, { screen: true, pop: clamp(age * 3 + .25), rot: -.05 });
  }

  // ---------------- one continuous scene: every shot below is a window onto it ----------------
  function scene(t) {
    const z = zoomAt(t), s = O.map(o => Math.pow(10, o - z)), kick = t < T_OFF;
    const [sx, sy] = kick ? shakeXY(t, 2.5 * pulse(t, 8)) : [0, 0];
    camBegin(960 + sx, 540 + sy, 1 + (kick ? .014 * pulse(t, 7) : 0));
    if (s[3] >= 1.02) spaceBg(t);
    else { room(s[4]); sheet(s[4]); }
    if (s[4] < 3.6) lampProp(s[4], t);
    starfield(z, 1 - seg(z, 2.8, 3.0));
    galaxy(t, s[3]); solar(t, s[2]); moon(t, s[1]); planet(t, s[0]);
    const desk = t > 229.8;
    if (desk) { freshSheet(t); ruler(t); }
    theLine(t, z, s[4]);
    if (desk) tape(t);
    if (s[4] < 2.6) prof(t, s[4]);
    hero(t, z);
    // lamp light: a warm pool on the sheet and dimmer corners, once we're back at the desk
    const lk = clamp((2.2 - s[4]) / 1.2);
    if (lk > .02) {
      paint(ellPts(800, 520, 820, 560, 30, 8), { fill: PAL.ochre, fillOp: 45 * lk, bleed: .3, tex: .3, ink: null });
      for (const [cx, cy] of [[-100, 1100], [2050, -60], [2050, 1150]]) paint(ellPts(cx, cy, 700, 500, 24, 10), { fill: PAL.ink, fillOp: 60 * lk, bleed: .3, tex: .3, ink: null });
      bulb(s[4], lk);
    }
    camEnd();
    if (t < T_OFF) scaleTag(t, z);
    // the CLUNK: everything lights up at once as the wipe clears
    flash(.55 * Math.exp(-Math.max(0, t - 219.6) * 5) * (t > 219.39 ? 1 : 0), '#FFF2C8');
  }

  function cosmos(t) { scene(t); }
  function desk(t) { scene(t); }
  // 234.38: the lamp clicks off (flicker, dark), then the end card on the dark room
  function endCard(t, lt) {
    const dark = lt < .06 ? 1 : lt < .13 ? .25 : 1;
    scene(t);
    flash(dark * .9, '#15122A');
    if (lt < .5) sfx('click', 620, 110, 80, PAL.cream, lt, { life: .5 });
    if (lt > .2) {                                           // the line keeps a faint glow in the dark
      const g = ease(seg(lt, .2, .9));
      paint(band(D_IN, 540, 16), { wash: PAL.clay, washOp: 35 * g, ink: null });
      paint(band(D_IN, 540, 3), { wash: PAL.clay, washOp: 120 * g, ink: null });
    }
    const pop = a => clamp((lt - a) * 3);
    letter('Scaling Laws', 960, 390, 150, PAL.clay, { pop: pop(.35), rot: -.03 });
    letter('Post-Training · track 07', 960, 530, 54, PAL.cream, { pop: pop(.65), rot: -.015 });
    letter('a fan album in the Claude-Pop style', 960, 600, 32, soft(PAL.cream, .2), { pop: pop(.8), ink: false });
    letter('video pipeline: John Heibel / PDoomVideo', 960, 690, 42, PAL.cream, { pop: pop(1.0), rot: -.01 });
    letter('github.com/JohnHeibel/PDoomVideo', 960, 742, 28, mixCol(PAL.teal, PAL.cream, .35), { pop: pop(1.1), ink: false });
    letter('youtu.be/8j-hR4fJywU', 960, 784, 28, mixCol(PAL.teal, PAL.cream, .35), { pop: pop(1.2), ink: false });
    letter('album, lyrics and this video', 960, 866, 42, PAL.cream, { pop: pop(1.3), rot: -.01 });
    letter('github.com/pfyhr/post-training', 960, 918, 28, mixCol(PAL.teal, PAL.cream, .35), { pop: pop(1.4), ink: false });
  }

  chapter('decade', 219.39, DUR, [[219.39, cosmos], [229.8, desk], [T_OFF, endCard]]);
})();
