// c03_wall.js: 59.1-75.06, pre-chorus 1, dusk (rose, ochre). The Skeptics (fedoras, trench coats, megaphones) say
// we'd hit a wall: the wall is a painted sheet that blows off and lands on them. Data's gone: a photocopier fountains
// books onto the shelves and buries them. Money's dry: a moth flies out of a wallet. Kick out: a dump truck tips a
// mountain of gold on them. Then the real wall, enormous; the line presses into it through the snare roll and on
// 75.06 punches a line-shaped hole, bricks flying at camera (chapter 4 opens through that hole).
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { GRID, SAND, STEEL, STEEL_DK, HARD, labCoat } = SL;
  const T1 = 59.1, T2 = 62.75, T3 = 66.15, T4 = barT(37), T5 = 70.15, END = barT(41);   // kick drops at T4 (67.56)

  // ---------------- the Skeptics (chapter 6 copies this look) ----------------
  // Grey-brown fedora with a pinched crown and a low brim, beige trench coat with popped collar, lapels and belt,
  // and a cream cone megaphone with a clay rim. All body-local draw hooks for clawd().
  const FED = '#4A4038', FED_BAND = '#2A2420', TRENCH = '#B89B6E', TRENCH_DK = '#97794C', BELT = '#7A6040';
  const MEGA = '#F3EBDC', MEGA_RIM = '#C8643C';
  const fedora = (u, sw) => {
    push(); translate(0, -8 * u); rotate(-.08); translate(0, 8 * u);
    paint([[-2.9 * u, -8.3 * u], [-2.7 * u, -10.4 * u], [-1.4 * u, -11.15 * u], [0, -10.55 * u], [1.4 * u, -11.15 * u], [2.7 * u, -10.4 * u], [2.9 * u, -8.3 * u]],
      { wash: FED, washOp: 255, fill: FED_BAND, fillOp: 40, tex: .4, ink: PAL.ink, sw: sw * .8, curv: .25 });
    paint(ellPts(-1.7 * u, -10.1 * u, .5 * u, .8 * u, 10, 0, .3), { wash: mixCol(FED, PAL.cream, .35), washOp: 170, ink: null });   // shine
    inkLine([[-1 * u, -10.65 * u], [0, -10.05 * u], [1 * u, -10.65 * u]], sw * .6, FED_BAND, 'inkfine', .4);                        // pinch
    paint(rectPts(-2.95 * u, -9.3 * u, 5.9 * u, .95 * u), { wash: FED_BAND, washOp: 255, ink: null });                               // band
    paint([[-5.9 * u, -8.05 * u], [-3.1 * u, -8.95 * u], [3.1 * u, -8.95 * u], [5.9 * u, -8.05 * u], [4.7 * u, -7.5 * u], [-4.7 * u, -7.5 * u]],
      { wash: FED, washOp: 255, ink: PAL.ink, sw: sw * .8, curv: .4 });                                                               // brim
    pop();
  };
  const trench = (u, sw) => {
    const p = (x, y) => [x * u, y * u];
    paint([p(-5.35, -3.9), p(-1.4, -3.9), p(0, -2.5), p(1.4, -3.9), p(5.35, -3.9), p(5.85, -1.15), p(-5.85, -1.15)],
      { wash: TRENCH, washOp: 255, fill: TRENCH_DK, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .8 });
    for (const s of [-1, 1]) {
      paint([p(1.4 * s, -3.9), p(2.7 * s, -3.9), p(.85 * s, -2.75), p(0, -2.5)], { wash: TRENCH_DK, washOp: 255, ink: PAL.ink, sw: sw * .5 });   // lapel
      paint([p(5.45 * s, -3.8), p(6.05 * s, -5.8), p(4.15 * s, -4.65), p(3.1 * s, -3.8)],
        { wash: TRENCH, washOp: 255, fill: TRENCH_DK, fillOp: 70, ink: PAL.ink, sw: sw * .6 });                                         // popped collar
      for (const by of [-3.35, -2.85]) paint(ellPts(2.15 * s * u, by * u, .17 * u, .17 * u, 8), { wash: BELT, ink: null });            // buttons
    }
    paint(rectPts(-5.7 * u, -2.4 * u, 11.4 * u, .6 * u), { wash: BELT, washOp: 255, ink: PAL.ink, sw: sw * .5 });                       // belt
    paint(rectPts(.8 * u, -2.5 * u, .95 * u, .8 * u), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: sw * .4 });                       // buckle
    paint([p(1.75, -2.3), p(2.6, -2.2), p(2.4, -1.4), p(2.05, -1.45)], { wash: BELT, washOp: 255, ink: PAL.ink, sw: sw * .4 });           // belt tail
    inkLine([p(0, -1.8), p(0, -1.15)], sw * .5, PAL.ink, 'inkfine', 0);
  };
  // megaphone held at the arm tip (arm space, +x outward); `blare` 0..1 sends sound arcs out of the bell
  const megaphone = (blare = 0) => (u, sw) => {
    paint(rectPts(.3 * u, .2 * u, .55 * u, 1.25 * u), { wash: '#3A3340', washOp: 255, ink: PAL.ink, sw: sw * .4 });                       // grip
    paint([[-.3 * u, -.45 * u], [3.6 * u, -1.6 * u], [3.6 * u, 1.6 * u], [-.3 * u, .45 * u]],
      { wash: MEGA, washOp: 255, fill: '#D6C8B0', fillOp: 70, tex: .4, ink: PAL.ink, sw: sw * .8 });
    paint(rectPts(-.65 * u, -.38 * u, .45 * u, .76 * u), { wash: '#3A3340', washOp: 255, ink: null });                                     // mouthpiece
    paint(ellPts(3.6 * u, 0, .45 * u, 1.65 * u, 16), { wash: MEGA_RIM, washOp: 255, ink: PAL.ink, sw: sw * .7 });
    paint(ellPts(3.7 * u, 0, .22 * u, 1.25 * u, 14), { wash: '#5A2A20', washOp: 255, ink: null });
    if (blare > .05) for (let i = 0; i < 3; i++) {
      const r = (1.3 + i * 1.2 + blare * 1.4) * u, a = [];
      for (let k = -4; k <= 4; k++) a.push([4.1 * u + Math.cos(k * .15) * r, Math.sin(k * .15) * r * 1.5]);
      inkLine(a, sw * (1.6 - i * .35), i % 2 ? PAL.cream : MEGA_RIM, 'ink', .6);
    }
  };
  function skeptic(x, y, u, o = {}) {
    const { blare = 0, mega = true, draw, ...rest } = o;
    clawd(x, y, u, { eyes: 'narrow', mouth: 'flat', aR: .35, aL: -.4, armR: mega ? megaphone(blare) : null, ...rest,
      draw: (uu, sw) => { trench(uu, sw); fedora(uu, sw); if (draw) draw(uu, sw); } });
  }
  // the lab, small, on a riser
  function choirRow(t, x0, x1, y, u, n, o = {}) {
    for (let i = 0; i < n; i++) {
      const x = lerp(x0, x1, n > 1 ? i / (n - 1) : .5), coat = i % 2 === 1, m = move(o.style || 'stomp', t, i);
      clawd(x, y, u, { ...m, draw: coat ? labCoat : HARD, mouth: o.mouth || 'flat', eyes: o.eyes || 'happy', noShadow: true, ...(o.extra || {}) });
    }
  }

  // ---------------- dusk set ----------------
  const DUSK = mixCol(PAL.rose, PAL.violet, .45);
  function sky(hz, o = {}) {
    const top = mixCol(DUSK, PAL.night, o.dark || 0);
    paint(rectPts(-1400, -1400, W + 2800, hz + 1400), { wash: top, washOp: 255, ink: null });
    paint(rectPts(-1400, hz - 460, W + 2800, 460), { fill: PAL.rose, fillOp: 150, bleed: .25, tex: .4, ink: null });
    paint(ellPts(o.sunX ?? 1500, hz, 1400, 300, 30, 10), { fill: PAL.ochre, fillOp: 170, bleed: .3, tex: .3, ink: null });
    if (o.sun !== false) paint(ellPts(o.sunX ?? 1500, hz - 20, 105, 105, 24, 2), { wash: mixCol(PAL.ochre, PAL.cream, .45), washOp: 230, ink: null });
    if (o.grid !== false) {                                 // the log-log paper carries on up into the sky
      const gc = mixCol(top, GRID, .4);
      for (let x = -120; x <= W + 120; x += 120) inkLine([[x, -40], [x, hz]], .45, gc, 'inkfine', 0);
      for (let y = hz - 120; y > -40; y -= 120) inkLine([[-40, y], [W + 40, y]], .45, gc, 'inkfine', 0);
    }
  }
  function ground(hz, x0 = -600, x1 = W + 600) {
    paint(rectPts(x0, hz, x1 - x0, 1400), { wash: mixCol(SAND, PAL.rose, .25), washOp: 255, fill: PAL.clay, fillOp: 60, bleed: .1, tex: .6, ink: null });
    inkLine([[x0, hz], [x1, hz]], 1, PAL.ink, 'inkfine', 0);
  }
  // the line as a filled band (survives camera zoom); glow behind it
  function lineBand(A, B, w, glow = 1) {
    const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    const q = (k, s) => [[A[0] + nx * k, A[1] + ny * k], [B[0] + nx * k, B[1] + ny * k], [B[0] - nx * k, B[1] - ny * k], [A[0] - nx * k, A[1] - ny * k]];
    if (glow > 0) paint(q(w * 1.8), { fill: PAL.ochre, fillOp: 70 * glow, bleed: .25, tex: .3, ink: null });
    paint(q(w / 2), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 50, tex: .5, ink: null });
    paint(q(w * .12).map(([x, y]) => [x - nx * w * .18, y - ny * w * .18]), { wash: PAL.clayLt, washOp: 200, ink: null });
  }
  const bump = t => t < T4 ? pulse(t, 7) : 0;

  // ---------------- 59.1: "They said we'd hit a wall" / "(there is no wall)" ----------------
  // The wall is a painted sheet; the choir shouts, it ripples like cloth, flies off and lands draped over the Skeptics.
  const SK1 = [420, 650, 880], OFF_T = barT(34), LAND = bt(133);          // 61.94 lift-off, 62.40 lands
  const lumpH = (x, t) => { let h = 14; SK1.forEach((sx, i) => { const d = (x - sx) / 128; h = Math.max(h, (225 + 10 * Math.sin(t * 11 + i * 2)) * Math.exp(-d * d * d * d) + 60 * Math.exp(-d * d * .3)); }); return h; };
  function clothPt(u, v, t) {
    const amp = 18 * ease(seg(t, 61.05, 61.85)) * (1 + .6 * pulse(t, 6));
    const ux = lerp(1080, 1400, u) + amp * Math.sin(v * 9 - t * 15 + u * 3) * v, uy = 822 - v * 640 + amp * .3 * Math.sin(u * 7 - t * 13);
    const dx = lerp(320, 990, u), dy = 824 - v * lumpH(dx, t);
    const k = seg(t, OFF_T, LAND), m = ease(k), air = Math.sin(Math.PI * k);
    return [lerp(ux, dx, m) - air * 60 * v, lerp(uy, dy, m) - air * (200 + 140 * v) + air * 46 * Math.sin(u * 6 - t * 20 + v * 4)];
  }
  function cloth(t) {
    const edge = [], N = 14;
    for (let i = 0; i <= N; i++) edge.push(clothPt(i / N, 0, t));
    for (let i = 1; i <= N; i++) edge.push(clothPt(1, i / N, t));
    for (let i = N - 1; i >= 0; i--) edge.push(clothPt(i / N, 1, t));
    for (let i = N - 1; i > 0; i--) edge.push(clothPt(0, i / N, t));
    paint(edge, { wash: '#8C5446', washOp: 255, ink: null, curv: .5 });                                                  // mortar
    const R = 13, C = 4;
    for (let r = 0; r < R; r++) for (let c = -1; c < C; c++) {
      const off = r % 2 ? .5 : 0, u0 = clamp((c + off) / C + .012), u1 = clamp((c + off + 1) / C - .012), v0 = r / R + .012, v1 = (r + 1) / R - .012;
      if (u1 - u0 < .02) continue;
      paint([clothPt(u0, v0, t), clothPt(u1, v0, t), clothPt(u1, v1, t), clothPt(u0, v1, t)],
        { wash: mixCol('#B5553A', '#D27A52', hash(r * 7 + c)), washOp: 255, ink: null });
    }
    paint(edge, { fill: PAL.violet, fillOp: 40, bleed: .1, tex: .6, ink: PAL.ink, sw: 1.3, curv: .5 });
  }
  function noWall(t, lt) {
    const [sx, sy] = shakeXY(t, 2 * bump(t) + 6 * seg(t, LAND, LAND + .05) * (1 - seg(t, LAND + .05, LAND + .3)));
    camBegin(1000 + sx, 590 + sy - 10 * ease(seg(t, T1, OFF_T)), lerp(1.24, 1.16, ease(seg(t, T1, T2))) + .012 * bump(t));
    sky(822, { sunX: 1250 });
    lineBand([-100, 960], [2050, 150], 26);
    ground(822);
    // the choir on a riser to the right, shouting back on "there is no wall"
    const shout = seg(t, 60.92, 61.0) * (1 - seg(t, 62.6, 62.7));
    paint(rectPts(1420, 708, 340, 120, 3), { wash: '#9A6440', washOp: 255, fill: PAL.ink, fillOp: 30, tex: .5, ink: PAL.ink, sw: 1 });
    choirRow(t, 1470, 1700, 712, 10, 5, { style: shout > .5 ? 'roof' : 'stomp', mouth: shout > .5 && frac(bpOf(t)) < .6 ? 'O' : 'flat', eyes: shout > .5 ? 'closed' : 'happy' });
    choirRow(t, 1460, 1700, 830, 13, 4, { style: shout > .5 ? 'roof' : 'stomp', mouth: shout > .5 && frac(bpOf(t)) < .6 ? 'O' : 'flat', eyes: shout > .5 ? 'closed' : 'happy' });
    if (shout > .5) for (let i = 0; i < 3; i++) {                                             // shout arcs rolling at the wall
      const ph = frac(bpOf(t) + i / 3), x = lerp(1440, 1400, ph) - ph * 30, a = [];
      for (let k = -4; k <= 4; k++) a.push([x - Math.cos(k * .16) * (60 + ph * 120) + 130, 640 + Math.sin(k * .16) * (90 + ph * 170)]);
      inkLine(a, 2.2 * (1 - ph) + .4, PAL.cream, 'ink', .6);
    }
    // the Skeptics: blaring at the wall, then flinching as the sheet comes for them
    const k = seg(t, OFF_T, LAND);
    if (k < .82) [...SK1].reverse().forEach((x, j) => {                                     // right to left, so every megaphone is in front
      const i = 2 - j, flinch = ease(seg(t, OFF_T + .05, OFF_T + .3)), say = t < 60.9 && frac(bpOf(t)) < .55;
      skeptic(x, 826, 19, { blare: t < 60.95 ? 1 - frac(bpOf(t) + i * .1) : 0, mouth: say ? 'O' : 'flat',
        eyes: flinch > .3 ? 'scared' : 'narrow', lookY: -1, aR: lerp(.62 + .1 * bump(t), -.9, flinch), aL: lerp(-.4, 1.2, flinch),
        sq: .1 * bump(t), emote: flinch > .3 && i === 1 ? '!' : null, emoteK: flinch });
    });
    cloth(t);
    if (t > LAND) {                                                                            // muffled, poking out from under
      const age = t - LAND;
      push(); translate(1000 + 40 * ease(seg(age, .05, .25)), 800); rotate(-.15); megaphone(frac(bpOf(t)) < .5 ? .5 : 0)(15, 1.1); pop();
      for (let i = 0; i < 6; i++) { const a = age * 2.5; paint(ellPts(380 + i * 130, 812 - a * 60, 40 + a * 120, 16 + a * 30, 14, 3), { fill: soft(SAND, .2), fillOp: 140 * (1 - seg(age, 0, .35)), bleed: .3, ink: null }); }
      sfx('FWUMP', 700, 500, 96, PAL.cream, age, { life: .5, rot: -.06 });
    }
    camEnd();
  }

  // ---------------- 62.75: "data's gone" / "(synthesize it all)" ----------------
  const CASE = { x: 130, y: 196, w: 520, h: 630, rows: 5, per: 8 }, rowH = CASE.h / CASE.rows;
  const BOOKC = [PAL.teal, PAL.rose, PAL.ochre, PAL.sap, PAL.violet, PAL.clay, PAL.indigo, PAL.sky];
  const NB = 64, B0 = barT(35) + .08, DT = .026, FLY = .5, SK2 = [800, 990, 1180];
  const isPile = i => [2, 5, 7].includes(i % 8);
  const shelfIdx = i => { let n = 0; for (let j = 0; j < i; j++) if (!isPile(j)) n++; return n; };
  const pileIdx = i => { let n = 0; for (let j = 0; j < i; j++) if (isPile(j)) n++; return n; };
  const NPILE = Array.from({ length: NB }, (_, i) => i).filter(isPile).length;
  const slot = j => { const r = CASE.rows - 1 - Math.floor(j / CASE.per), c = j % CASE.per;
    return [CASE.x + 30 + c * 58 + 23, CASE.y + (r + 1) * rowH - 2, 72 + 26 * hash(j * 3.3)]; };
  const pileH = t => { let n = 0; for (let i = 0; i < NB; i++) if (isPile(i) && t > B0 + i * DT + FLY) n++; return 132 * n / NPILE; };
  const pileY = (x, H) => { const d = clamp((Math.abs(x - 990) - 230) / 150); return 832 - H * (1 - d * d); };
  function book(x, y, w, h, rot, col, sw = .7) {
    push(); translate(x, y); rotate(rot);
    paint(rectPts(-w / 2, -h, w, h, 1), { wash: col, washOp: 255, fill: PAL.ink, fillOp: 25, tex: .4, ink: PAL.ink, sw });
    paint(rectPts(-w / 2, -h * .78, w, h * .12), { wash: PAL.cream, washOp: 200, ink: null });
    pop();
  }
  function copier(x, y, t, run) {
    for (const wx of [-120, 120]) paint(ellPts(x + wx, y - 10, 13, 13, 12), { wash: PAL.ink, ink: null });   // casters
    paint(rectPts(x - 150, y - 250, 300, 236, 4), { wash: '#DCD5C6', washOp: 255, fill: STEEL, fillOp: 40, tex: .5, ink: PAL.ink, sw: 1.3 });
    for (let i = 0; i < 2; i++) paint(rectPts(x - 130, y - 150 + i * 62, 260, 50, 2), { wash: '#C4BBA8', washOp: 255, ink: PAL.ink, sw: .8 });   // paper trays
    for (let i = 0; i < 2; i++) inkLine([[x - 30, y - 128 + i * 62], [x + 30, y - 128 + i * 62]], 1.4, PAL.ink, 'ink', 0);
    paint(rectPts(x - 160, y - 280, 320, 34, 3), { wash: STEEL, washOp: 255, ink: PAL.ink, sw: 1.1 });                        // lid
    if (run) paint(rectPts(x - 150, y - 252, 300, 10), { wash: PAL.cream, washOp: 255, fill: PAL.cream, fillOp: 160, bleed: .3, ink: null });
    if (run) paint(ellPts(x, y - 248, 220, 34, 20), { fill: soft(PAL.teal, .3), fillOp: 120 * pulse2(t, 5), bleed: .3, ink: null });
    paint(rectPts(x + 40, y - 236, 100, 46, 2), { wash: STEEL_DK, washOp: 255, ink: PAL.ink, sw: .8 });                    // panel
    paint(ellPts(x + 116, y - 213, 15, 15, 14), { wash: run ? '#5BD17A' : PAL.sap, washOp: 255, ink: PAL.ink, sw: .8 });   // big green button
    paint([[x - 150, y - 200], [x - 250, y - 214], [x - 250, y - 196], [x - 150, y - 178]], { wash: '#C4BBA8', washOp: 255, ink: PAL.ink, sw: 1 });   // output tray
  }
  function library(t, lt) {
    const [sx, sy] = shakeXY(t, 2.5 * bump(t));
    camBegin(960 + sx, 590 + sy, lerp(1.1, 1.16, ease(seg(t, T2, T3))) + .012 * bump(t));
    sky(832, { sunX: 1700, grid: true });
    ground(832);
    // the bookcase
    paint(rectPts(CASE.x - 20, CASE.y - 24, CASE.w + 40, CASE.h + 30, 3), { wash: '#7C4A2C', washOp: 255, fill: PAL.ink, fillOp: 25, tex: .6, ink: PAL.ink, sw: 1.4 });
    paint(rectPts(CASE.x, CASE.y, CASE.w, CASE.h - 4, 2), { wash: '#4E2E22', washOp: 255, fill: PAL.violet, fillOp: 30, tex: .5, ink: null });
    for (let r = 1; r <= CASE.rows; r++) paint(rectPts(CASE.x - 4, CASE.y + r * rowH - 2, CASE.w + 8, 14, 1), { wash: '#9A6440', washOp: 255, ink: PAL.ink, sw: .8 });
    if (t < B0 + .4) {                                                                          // cobweb in the empty corner
      inkLine([[CASE.x + 4, CASE.y + 70], [CASE.x + 60, CASE.y + 4]], .6, PAL.cream, 'inkfine', .3);
      inkLine([[CASE.x + 4, CASE.y + 38], [CASE.x + 34, CASE.y + 6]], .6, PAL.cream, 'inkfine', .3);
      inkLine([[CASE.x + 4, CASE.y + 4], [CASE.x + 48, CASE.y + 40]], .6, PAL.cream, 'inkfine', 0);
    }
    for (let i = 0; i < NB; i++) if (!isPile(i) && t > B0 + i * DT + FLY) { const j = shelfIdx(i), [x, y, h] = slot(j); book(x, y, 46, h, (hash(j) - .5) * .06, BOOKC[j % 8]); }
    // the Skeptics, sinking into the pile
    const H = pileH(t), gripe = t < 64.3;
    SK2.forEach((x, i) => skeptic(x, 834, 20, { flip: true, blare: gripe && i !== 1 ? 1 - frac(bpOf(t) + i * .2) : 0, mega: i !== 1,
      aR: i === 1 ? 1.1 : .45 + .1 * bump(t), aL: i === 1 ? 1.1 : -.4, mouth: gripe && frac(bpOf(t)) < .5 ? 'O' : 'flat',
      eyes: 'narrow', sq: .08 * bump(t), emote: H > 50 && i === 2 ? 'anger' : null, emoteK: seg(H, 50, 70) }));
    if (H > 2) {
      const pts = []; for (let x = 640; x <= 1340; x += 35) pts.push([x, pileY(x, H)]); pts.push([1340, 840], [640, 840]);
      paint(pts, { wash: '#A88A6A', washOp: 255, fill: PAL.ink, fillOp: 30, tex: .5, ink: PAL.ink, sw: 1 });
      for (let r = 0; r * 26 < H - 8; r++) for (let x = 660 + (r % 2) * 30; x < 1320; x += 62) {
        const y = 832 - r * 26; if (y - 24 < pileY(x + 28, H) || y - 24 < pileY(x, H)) continue;
        paint(rectPts(x, y - 24, 56, 22, 1), { wash: BOOKC[(r * 5 + Math.floor(x / 62)) % 8], washOp: 255, ink: PAL.ink, sw: .6 });
      }
    }
    // the lead Clawd wheels in the photocopier, slaps the button on the downbeat
    const cx = kf(t, [[T2, 2100], [barT(35) - .25, 1420]], easeOut), run = t > barT(35);
    copier(cx, 836, t, run);
    const slap = t > barT(35) - .25 && t < barT(35) + .35;
    clawd(cx + 270, 836, 21, { draw: HARD, flip: true, walk: t < barT(35) - .25 ? bpOf(t) * .9 : null, aR: slap ? kf(t, [[barT(35) - .25, 1.4], [barT(35), -.2]], easeIn) : .1 + .2 * bump(t),
      aL: .2, eyes: run ? 'happy' : 'normal', mouth: run ? 'grin' : 'smile', dy: run ? -1.2 * Math.abs(Math.sin(bpOf(t) * Math.PI)) : 0, rot: t < barT(35) - .25 ? -.1 : 0 });
    if (t >= barT(35) && t < barT(35) + .5) sfx('CLUNK', cx + 130, 520, 60, PAL.cream, t - barT(35), { life: .5 });
    // the fountain of books
    const O = [cx - 250, 630];
    for (let i = 0; i < NB; i++) {
      const s = (t - B0 - i * DT) / FLY; if (s <= 0 || s >= 1) continue;
      let T;
      if (isPile(i)) { const x = 700 + 580 * hash(i * 3.1); T = [x, pileY(x, pileH(B0 + i * DT + FLY))]; }
      else { const [x, y] = slot(shelfIdx(i)); T = [x, y]; }
      const hgt = 300 + 160 * hash(i * 1.7), x = lerp(O[0], T[0], s), y = lerp(O[1], T[1], s) - 4 * hgt * s * (1 - s);
      book(x, y + 38, 54, 76, (1 - s) * (3 + 4 * hash(i)) * (hash(i + 9) > .5 ? 1 : -1), BOOKC[i % 8], .6);
    }
    camEnd();
  }

  // ---------------- 66.15: "money's dry": the wallet, and a moth ----------------
  function wallet(t, lt) {
    const [sx, sy] = shakeXY(t, 2 * bump(t));
    camBegin(960 + sx, 540 + sy, lerp(1.06, 1.12, seg(t, T3, T4)) + .01 * bump(t));
    sky(990, { sunX: 400, grid: true });
    paint(ellPts(900, 980, 900, 90, 24, 4), { fill: soft(PAL.clay, .3), fillOp: 120, bleed: .2, ink: null });
    const x = 830, y = 930, u = 46, open = ease(seg(t, 66.48, 66.66)), lift = ease(seg(t, T3, 66.45));
    const mothK = seg(t, 66.68, T4 + .1);
    const m = mood(t, [[T3, 'narrow'], [66.72, 'look', 'sweat']]);
    const aR = lerp(-.5, .25, lift);
    skeptic(x, y, u, { mega: false, aR, aL: -.4, ...m, lookX: .6 - 1.2 * mothK, lookY: -1, mouth: t > 66.72 ? 'wobble' : 'flat', sq: .05 * bump(t),
      armR: (uu, sw) => {                                                                       // the wallet, opening on a cobweb
        push(); rotate(-aR - .1);
        const w = 2.4 * uu, h = 1.5 * uu;
        if (open < .05) paint(rrPts(0, -h / 2, w, h, .2 * uu, 1), { wash: '#6B4430', washOp: 255, fill: PAL.ink, fillOp: 30, tex: .5, ink: PAL.ink, sw: sw * .8 });
        else {
          paint(rrPts(0, -h / 2 - open * .9 * h, w, h, .2 * uu, 1), { wash: '#8A5C40', washOp: 255, ink: PAL.ink, sw: sw * .8 });
          paint(rrPts(0, -h / 2, w, h, .2 * uu, 1), { wash: '#6B4430', washOp: 255, fill: PAL.ink, fillOp: 30, tex: .5, ink: PAL.ink, sw: sw * .8 });
          paint(rrPts(.2 * uu, -h / 2 - open * .9 * h + .2 * uu, w - .4 * uu, h * .5, .1 * uu), { wash: '#3B2420', washOp: 255, ink: null });
          for (let k = 0; k < 3; k++) inkLine([[.3 * uu + k * .7 * uu, -h / 2 - open * .9 * h + .25 * uu], [1.2 * uu, -h / 2 - open * .5 * h]], sw * .4, PAL.cream, 'inkfine', .2);
        }
        pop();
      } });
    // the moth: out of the wallet, fluttering up and off
    if (mothK > 0) {
      const tip = [x + 4.9 * u + Math.cos(aR) * 3.5 * u, y - 4.5 * u - Math.sin(aR) * 3.5 * u - u];
      const mx = lerp(tip[0], 520, mothK) + 70 * Math.sin(mothK * 9), my = lerp(tip[1], 200, easeOut(mothK)) + 30 * Math.sin(mothK * 17);
      const flap = Math.abs(Math.sin(t * 38)); push(); translate(mx, my); scale(1.7); translate(-mx, -my);
      for (const s of [-1, 1]) {
        paint([[mx, my], [mx + s * 34, my - 28 * flap - 4], [mx + s * 40, my + 6]], { wash: '#C9BBA0', washOp: 255, fill: PAL.ink, fillOp: 20, ink: PAL.ink, sw: .7 });
        paint([[mx, my + 2], [mx + s * 22, my + 22 * flap + 6], [mx + s * 6, my + 16]], { wash: '#B0A285', washOp: 255, ink: PAL.ink, sw: .6 });
      }
      paint(ellPts(mx, my + 4, 5, 15, 10), { wash: '#6B5A48', washOp: 255, ink: PAL.ink, sw: .6 });
      inkLine([[mx - 2, my - 9], [mx - 9, my - 22]], .6, PAL.ink, 'inkfine', .4); inkLine([[mx + 2, my - 9], [mx + 9, my - 22]], .6, PAL.ink, 'inkfine', .4); pop();
      for (let i = 0; i < 4; i++) { const d = (mothK * 3 + i * .25) % 1; paint(ellPts(lerp(tip[0], mx, d * .6) + 14 * hash(i), lerp(tip[1], my, d * .6) + 20, 3, 3, 6), { wash: '#D8CCB4', washOp: 200 * (1 - d), ink: null }); }   // dust
    }
    camEnd();
  }

  // ---------------- 67.56: kick out. "(five hundred bil')": the dump truck ----------------
  const TRUCK = '#3E8C8A', TRUCK_DK = '#2B6461', GOLD = '#E8B23A', GOLD_DK = '#B47C1E', SK4 = [560, 760, 960];
  const tipA = t => .72 * ease(seg(t, 69.0, 69.6));
  const moundH = t => 380 * easeOut(seg(t, 69.28, 70.12));
  const moundY = (x, H, cx) => { const d = clamp(Math.abs(x - cx) / (240 + H * 1.1)); return 842 - H * Math.pow(1 - d * d, .9); };
  function coin(x, y, r, a = 0) {
    paint(ellPts(x, y, r, r * (.45 + .55 * Math.abs(Math.cos(a))), 12), { wash: GOLD, washOp: 255, fill: GOLD_DK, fillOp: 50, ink: PAL.ink, sw: .6 });
  }
  function truck(R, t) {                                                                       // facing right, backing left; R = rear end x
    const a = tipA(t), gy = 842;
    for (const wx of [90, 220, 560]) { paint(ellPts(R + wx, gy - 44, 46, 46, 18), { wash: PAL.ink, washOp: 255, ink: null }); paint(ellPts(R + wx, gy - 44, 20, 20, 12), { wash: STEEL, washOp: 255, ink: null }); }
    paint(rectPts(R - 10, gy - 120, 680, 40, 2), { wash: '#3A3340', washOp: 255, ink: PAL.ink, sw: 1 });                        // chassis
    // cab
    paint([[R + 450, gy - 100], [R + 450, gy - 330], [R + 600, gy - 330], [R + 680, gy - 220], [R + 690, gy - 100]],
      { wash: TRUCK, washOp: 255, fill: TRUCK_DK, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.3 });
    paint([[R + 480, gy - 300], [R + 590, gy - 300], [R + 650, gy - 220], [R + 480, gy - 220]], { wash: soft(PAL.sky, .2), washOp: 255, fill: PAL.cream, fillOp: 60, ink: PAL.ink, sw: .9 });
    clawd(R + 545, gy - 222, 8, { draw: HARD, noLegs: true, noShadow: true, eyes: 'happy', mouth: 'grin', aR: .9, flip: true });   // the driver, looking back
    const beep = t < 68.95 ? pulse(t, 9) : 0;
    paint(rectPts(R + 520, gy - 352, 44, 22, 2), { wash: beep > .4 ? '#FFC24A' : '#B8862A', washOp: 255, ink: PAL.ink, sw: .8 });
    if (beep > .4) paint(ellPts(R + 542, gy - 342, 90, 60, 18), { fill: '#FFC24A', fillOp: 120 * beep, bleed: .3, ink: null });
    // the bed, hinged at its rear bottom corner
    push(); translate(R, gy - 120); rotate(-a);
    const heap = 1 - seg(t, 69.2, 70.1);
    if (heap > 0) {
      const hp = []; for (let i = 0; i <= 10; i++) { const k = i / 10; hp.push([10 + k * 410, -230 - Math.sin(k * Math.PI) * 120 * heap]); } hp.push([420, -200], [10, -200]);
      paint(hp, { wash: GOLD, washOp: 255, fill: GOLD_DK, fillOp: 60, tex: .5, ink: PAL.ink, sw: .9, curv: .4 });
      for (let i = 0; i < 12; i++) { const k = .1 + .8 * hash(i * 3.7); coin(10 + k * 410, -232 - Math.sin(k * Math.PI) * 120 * heap * hash(i * 1.3), 12, i); }
    }
    paint([[0, 0], [430, 0], [445, -240], [-15, -240]], { wash: TRUCK, washOp: 255, fill: TRUCK_DK, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.3 });
    for (let i = 1; i < 5; i++) paint(rectPts(i * 86 - 6, -236, 12, 232, 1), { wash: TRUCK_DK, washOp: 255, ink: null });          // ribs
    pop();
    // "$500B" on the bed side, following the tip
    const c = Math.cos(-a), s = Math.sin(-a), bx = 215, by = -125;
    letter('$500B', R + bx * c - by * s, gy - 120 + bx * s + by * c, 74, PAL.ochre, { rot: -a });
    if (beep > .3) sfx('beep', R + 640, gy - 420, 40, PAL.cream, (bpOf(t) - beatN(t)) * BEAT, { life: .3, rot: .08 });
  }
  function gold(t, lt) {
    const drift = seg(t, T4, T5);
    camBegin(960 + 60 * drift, 520 - 10 * drift, lerp(1.0, .94, ease(drift)));                  // no kick: a slow drift, no bumps
    sky(842, { sunX: 300 });
    ground(842);
    const R = kf(t, [[T4, 2150], [68.92, 1180]], easeOut), H = moundH(t), cx = 860;
    const scared = t > 69.2;
    SK4.forEach((x, i) => skeptic(x, 846, 20, { mega: i !== 1, eyes: scared ? 'scared' : 'narrow', lookX: .8, lookY: scared ? -1 : 0, mouth: scared ? 'O' : 'flat',
      aR: scared ? 1.3 : .2, aL: scared ? 1.3 : -.4, emote: scared && i === 1 ? '!!' : null, emoteK: seg(t, 69.2, 69.4),
      armR: i === 1 && !scared ? (uu, sw) => { paint(rrPts(0, -.8 * uu, 2.2 * uu, 1.4 * uu, .2 * uu), { wash: '#6B4430', washOp: 255, ink: PAL.ink, sw: sw * .8 }); } : undefined }));
    truck(R, t);
    if (H > 2) {
      const pts = []; for (let x = cx - 700; x <= cx + 700; x += 40) pts.push([x, moundY(x, H, cx)]); pts.push([cx + 700, 850], [cx - 700, 850]);
      paint(pts, { wash: GOLD, washOp: 255, fill: GOLD_DK, fillOp: 70, bleed: .1, tex: .6, ink: PAL.ink, sw: 1.2 });
      for (let i = 0; i < 46; i++) {                                                             // coins on the surface
        const x = cx + (hash(i * 2.3) - .5) * 2 * (220 + H), y = moundY(x, H, cx);
        const yy = lerp(y + 8, 842, hash(i * 5.1) * .7); if (yy > 842) continue;
        coin(x, yy, 13, hash(i) * 3);
      }
      paint(ellPts(cx - 60, 842 - H * .75, 120, 50, 16), { fill: PAL.cream, fillOp: 90, bleed: .3, ink: null });
      if (H > 300) { const hx = cx + 10, hy = moundY(hx, H, cx) + 4, pk = backOut(seg(t, 69.85, 70.05));   // one fedora on top
        push(); translate(hx, hy + 150 - 40 * (1 - pk)); scale(pk); fedora(20, 1.2); pop(); }
      for (let i = 0; i < 6; i++) { const tw = frac(t * 1.5 + hash(i)); paint(starPts(cx + (hash(i * 9) - .5) * 600, 842 - H * (.3 + .6 * hash(i * 4)), 16 * Math.sin(tw * Math.PI), .3), { wash: PAL.cream, washOp: 255, ink: null }); }
    }
    // the pour
    const a = tipA(t);
    if (t > 69.2) for (let i = 0; i < 34; i++) {
      const ph = frac(t * 2.4 + hash(i * 1.3)), S = [R - 220 * Math.sin(a) + 20, 842 - 120 - 240 * Math.cos(a) + 120 * hash(i)];
      const Tx = cx + (hash(i * 7.7) - .3) * 500, Ty = moundY(Tx, H, cx);
      const x = lerp(S[0], Tx, ph), y = lerp(S[1], Ty, ph * ph) - 80 * Math.sin(ph * Math.PI);
      coin(x, y, 12, t * 9 + i);
    }
    camEnd();
  }

  // ---------------- 70.15: "They said we'd hit a wall..." the real one ----------------
  const P = [1000, 520], DIR = [.924, -.383], BRK = { w: 128, h: 52, top: -200, bot: 900 };
  const SMASH0 = END - .14;
  const rate = t => t < barT(39) ? 1 : t < barT(40) ? 2 : t < barT(40) + 2 * BEAT ? 4 : 8;   // the snare roll speeds up
  const roll = t => Math.exp(-frac(bpOf(t) * rate(t)) * 5);
  const build = t => seg(t, T5, SMASH0);
  const camAt = t => kf(t, [[T5, [960, 600, 1.12]], [barT(39), [960, 330, .62]], [SMASH0, [P[0] + 60, P[1] - 10, 2.3]], [END, [P[0] + 60, P[1] - 10, 2.45]]],
    x => x < 0 ? 0 : ease(x));
  const crackPath = (sgn, L, seed) => {                                                        // a jagged crack along +-DIR
    const pts = [[P[0], P[1]]], n = Math.max(1, Math.floor(L / 46));
    for (let i = 1; i <= n; i++) { const d = i * L / n, o = (hash(seed + i * 3.7) - .5) * 44; pts.push([P[0] + sgn * DIR[0] * d - DIR[1] * o, P[1] + sgn * DIR[1] * d + DIR[0] * o]); }
    return pts;
  };
  const strip = (pts, w0, w1) => {                                                             // tapered filled stroke, safe under zoom
    const L = [], Rr = [];
    pts.forEach((p, i) => {
      const q = pts[Math.min(pts.length - 1, i + 1)], r = pts[Math.max(0, i - 1)], dx = q[0] - r[0], dy = q[1] - r[1], l = Math.hypot(dx, dy) || 1, w = lerp(w0, w1, i / (pts.length - 1 || 1)) / 2;
      L.push([p[0] - dy / l * w, p[1] + dx / l * w]); Rr.push([p[0] + dy / l * w, p[1] - dx / l * w]);
    });
    return L.concat(Rr.reverse());
  };
  function bigWall(t, view) {
    paint(rectPts(-1400, BRK.top, W + 2800, BRK.bot - BRK.top), { wash: '#6E3A34', washOp: 255, ink: null });             // mortar
    for (let r = 0; BRK.top + r * BRK.h < BRK.bot; r++) {
      const y = BRK.top + r * BRK.h; if (y > view[3] || y + BRK.h < view[1]) continue;
      for (let c = -14; c < 30; c++) {
        const x = c * BRK.w + (r % 2 ? BRK.w / 2 : 0) - 700; if (x > view[2] || x + BRK.w < view[0]) continue;
        paint(rectPts(x + 4, y + 4, BRK.w - 8, BRK.h - 8, 1.2), { wash: mixCol('#A9493A', '#CF7650', hash(r * 37 + c)), washOp: 255, ink: null });
        if (view[2] - view[0] < 1400 && hash(r * 11 + c * 3) > .7) paint(rectPts(x + 8, y + 6, BRK.w * .5, 6), { wash: '#E39A72', washOp: 150, ink: null });   // lit top edge
      }
    }
    paint(rectPts(-1400, BRK.top - 26, W + 2800, 30, 2), { wash: '#8C5446', washOp: 255, ink: null });                     // coping
    paint(rectPts(-1400, BRK.bot - 260, W + 2800, 260), { fill: PAL.night, fillOp: 70, bleed: .2, tex: .4, ink: null });    // shade at the foot
    paint(rectPts(-1400, BRK.top, W + 2800, 220), { fill: PAL.rose, fillOp: 60, bleed: .2, tex: .4, ink: null });           // dusk on the top
  }
  function hole(t, k) {                                                                         // the line-shaped hole and the night beyond
    const a = 160 + 120 * k, b = 260 + 900 * easeOut(k), w = 40 + 170 * easeOut(k), pts = [];
    const n = 12, at = (d, o) => [P[0] + DIR[0] * d - DIR[1] * o, P[1] + DIR[1] * d + DIR[0] * o];
    for (let i = 0; i <= n; i++) pts.push(at(lerp(-a, b, i / n), -w / 2 - 34 * hash(i * 5.3) * k));
    pts.push(at(b + 60 * k, 0));
    for (let i = n; i >= 0; i--) pts.push(at(lerp(-a, b, i / n), w / 2 + 34 * hash(i * 2.9) * k));
    pts.push(at(-a - 40, 0));
    paint(pts, { wash: '#1C1A3E', washOp: 255, fill: PAL.violet, fillOp: 120, bleed: .2, tex: .5, ink: null });
    // a glimpse of the festival: teal beams and stars through the gap
    for (const [bx, sk] of [[P[0] + 120, -.4], [P[0] + 360, .3]]) paint([[bx - 4, P[1] + 200], [bx + 4, P[1] + 200], [bx + 120 * sk + 22, P[1] - 400], [bx + 120 * sk - 22, P[1] - 400]], { wash: '#3FF0D8', washOp: 110 * k, ink: null });
    for (let i = 0; i < 10; i++) { const d = lerp(-a, b, hash(i * 3.3)), o = (hash(i * 8.1) - .5) * w * .8, [x, y] = at(d, o); paint(starPts(x, y, 6, .35), { wash: PAL.cream, washOp: 255, ink: null }); }
    lineBand(P, at(b + 60, 0), 34, .6);                                                         // the line carries on through
  }
  function wall(t, lt) {
    const B = build(t), hit = roll(t), [cx, cy, z] = camAt(t), k = seg(t, SMASH0, END);
    const [sx, sy] = shakeXY(t, (1.5 + 13 * B * B) * hit + 4 * B + 30 * k);
    camBegin(cx + sx / z, cy + sy / z, z * (1 + .006 * hit * B));
    const hw = 1000 / z, hh = 580 / z, view = [cx - hw, cy - hh, cx + hw, cy + hh];
    sky(BRK.bot, { dark: .35, sun: false, grid: z < 1.4, sunX: 960 });
    bigWall(t, view);
    ground(BRK.bot, -1400, W + 1400);
    // cracks along the line's path, growing with the roll; light from the far side leaks through near the end
    const L = 30 + 820 * Math.pow(B, 1.6) * (.9 + .1 * hit);
    const leak = seg(t, barT(40), SMASH0);
        if (B > .02) {
      const crackCol = mixCol('#2A1C30', '#7FE8DA', leak * (.5 + .5 * hit));
      if (leak > 0) paint(strip(crackPath(1, L, 1), 60 / Math.min(z, 1.6), 10), { fill: '#3FF0D8', fillOp: 70 * leak * (.5 + .5 * hit), bleed: .3, ink: null });
      paint(strip(crackPath(1, L, 1), 16 / Math.min(z, 1.6), 2), { wash: crackCol, washOp: 255, ink: null });
      paint(strip(crackPath(-1, L * .45, 7), 14 / Math.min(z, 1.6), 2), { wash: crackCol, washOp: 255, ink: null });
      for (let j = 0; j < 6; j++) {                                                             // branches
        const st = crackPath(j % 2 ? -1 : 1, L * (j % 2 ? .45 : 1), j % 2 ? 7 : 1), bi = Math.min(st.length - 1, 1 + Math.floor(hash(j * 4.4) * (st.length - 1))), o = st[bi];
        if (bi < 1) continue;
        const ang = Math.atan2(DIR[1], DIR[0]) + (hash(j * 6.1) > .5 ? 1 : -1) * (.7 + .8 * hash(j)), bl = L * .22 * (.6 + hash(j * 2.2));
        const pts = [o]; for (let q = 1; q <= 3; q++) pts.push([o[0] + Math.cos(ang) * bl * q / 3 + (hash(j + q) - .5) * 16, o[1] + Math.sin(ang) * bl * q / 3 + (hash(j * q) - .5) * 16]);
        paint(strip(pts, 9 / Math.min(z, 1.6), 1.5), { wash: crackCol, washOp: 255, ink: null });
      }
    }
    if (k > 0) hole(t, k);
    // the line, pressing into the wall; its tip glows hotter with every snare hit
    lineBand([-700, 1000 + 1700 * .414], P, 34 + 18 * (1 - seg(z, 1, 2)), 1 + B);
    const g = 40 + 40 * B + 30 * hit * B;
    if (k < .5) { paint(ellPts(P[0], P[1], g * 1.4, g * 1.4, 20, 2), { fill: PAL.ochre, fillOp: 130, bleed: .3, ink: null }); paint(ellPts(P[0], P[1], 20, 20, 14), { wash: PAL.cream, washOp: 255, ink: null }); }
    // falling dust from the mortar on each hit
    if (B > .1) for (let i = 0; i < 14; i++) { const ph = frac(t * 1.3 + hash(i)), x = P[0] + (hash(i * 5.5) - .5) * L * 1.6, y = P[1] - 200 + ph * 500; paint(ellPts(x, y, 4 + 3 * hash(i), 4 + 3 * hash(i), 6), { wash: '#C99A80', washOp: 220 * (1 - ph) * B, ink: null }); }
    // the Skeptics, tiny on top of the wall, one last time through the megaphones
    if (z < 1.2) [880, 960, 1040].forEach((x, i) => skeptic(x, BRK.top - 26, 9, { blare: t < 72 ? 1 - frac(bpOf(t) + i * .3) : 0, aR: -.3, noShadow: true, mouth: t < 72 && frac(bpOf(t)) < .5 ? 'O' : 'flat' }));
    // the lab, in silhouette, holding its breath (wide eyes, puffed up)
    const sil = '#3A2440';
    for (let i = 0; i < 14; i++) clawd(-300 + i * 190, 985, 10, { col: sil, dk: '#2A1A30', lt: '#4A3050', eyes: 'scared', lookY: -1, lookX: .3, mouth: null,
      sx: 1.04 + .02 * hit * B, dy: -.3 * hit * B, noShadow: true });
    for (let i = 0; i < 11; i++) clawd(-420 + i * 260, 1060, 13, { col: sil, dk: '#2A1A30', lt: '#4A3050', eyes: 'scared', lookY: -1, lookX: -.2, mouth: null, sx: 1.05, noShadow: true });
    camEnd();
    // SMASH: bricks burst out of the hole at the camera
    if (k > 0) {
      const ps = [W / 2 + (P[0] - cx) * z, H / 2 + (P[1] - cy) * z], ke = easeOut(k);
      for (let i = 0; i < 22; i++) {
        const along = (hash(i * 3.1) - .3) * 500, o = [ps[0] + DIR[0] * along, ps[1] + DIR[1] * along];
        const ang = hash(i * 7.3) * TAU, sp = 500 + 900 * hash(i * 1.9), s = 1 + ke * (2 + 5 * hash(i * 4.2));
        const x = o[0] + Math.cos(ang) * sp * ke, y = o[1] + Math.sin(ang) * sp * ke * .8;
        push(); translate(x, y); rotate((hash(i) - .5) * 6 * ke); scale(s);
        paint(rectPts(-38, -14, 76, 28, 1), { wash: mixCol('#A9493A', '#CF7650', hash(i * 9)), washOp: 255, ink: PAL.ink, sw: 1.4 });
        paint(rectPts(-38, 8, 76, 6), { wash: '#6E3A34', washOp: 255, ink: null });
        pop();
      }
      for (let i = 0; i < 6; i++) { const ang = i / 6 * TAU + .3; paint(ellPts(ps[0] + Math.cos(ang) * 260 * ke, ps[1] + Math.sin(ang) * 200 * ke, 120 * ke + 20, 80 * ke + 14, 16, 6), { fill: soft(PAL.rose, .4), fillOp: 150 * (1 - k * .5), bleed: .3, ink: null }); }
      flash(.35 * Math.sin(Math.PI * clamp(k * 1.6)), PAL.cream);
      sfx('SMASH!', 1240, 300, 210, PAL.ochre, (t - SMASH0) * 3, { life: 3, rot: -.12 });
    }
  }

  chapter('wall', T1, END, [[T1, noWall], [T2, library], [T3, wallet], [T4, gold], [T5, wall]]);
})();
