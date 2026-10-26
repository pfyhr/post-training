// c06_walls.js: 119.2-135.04, pre-chorus 2. Chapter 3's gags, a size bigger, under a darker dusk. The line skewers
// three walls in a row like a kebab; a factory belt of Clawds stamps books that rain on the Skeptics until only their
// hats show; the empty wallet gets answered by a line of gold trucks honking to the horizon. Then the kick drops out:
// the wall is now a dam the size of a mountain, the choir climbs onto the lead Clawd's shoulders in a tower holding the
// line, the camera rises with it, and on 135.04 the line goes through the dam and gold light floods out.
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { GRID, HARD, HARD_LAMP, labCoat } = SL;
  const D_TOP = '#1E1A3E', D_MID = '#5A3566', D_LOW = '#B8566E', D_HZ = '#E0894E';      // darker dusk than chapter 3
  const DIRT = '#7A4B3E', ROCK = '#5E3B3C';
  const GOLD = '#FFC94A', GOLD_LT = '#FFE9A0';
  const BOOKS = [PAL.teal, PAL.rose, PAL.ochre, PAL.sap, PAL.violet, PAL.sky, PAL.clay];

  // ---------------- the Skeptics (same look as chapter 3): fedora, trench coat, megaphone ----------------
  const HAT_S = '#4A4038', HAT_B = '#2A2420', COAT = '#B89B6E', BELT = '#7A6040', MEG = '#F3EBDC', RIM = '#C8643C';
  const fedora = (u, sw, lift = 0, tilt = 0) => {
    push(); translate(0, -8 * u - lift * u); rotate(tilt);
    paint(ellPts(0, -.15 * u, 5.4 * u, .85 * u, 22), { wash: HAT_S, washOp: 255, ink: PAL.ink, sw: sw * .8 });          // brim
    paint([[-3.2 * u, -.2 * u], [-2.9 * u, -3.2 * u], [-1.3 * u, -3.9 * u], [0, -3.3 * u], [1.3 * u, -3.9 * u], [2.9 * u, -3.2 * u], [3.2 * u, -.2 * u]],
      { wash: HAT_S, washOp: 255, fill: HAT_B, fillOp: 50, tex: .4, ink: PAL.ink, sw: sw * .8, curv: .2 });            // pinched crown
    paint(rectPts(-3.15 * u, -1.35 * u, 6.3 * u, .95 * u), { wash: HAT_B, washOp: 255, ink: null });                    // band
    inkLine([[0, -3.2 * u], [.1 * u, -2.1 * u]], sw * .5, HAT_B, 'inkfine', 0);                                         // crease
    const fr = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI; fr.push([Math.cos(a) * 5.4 * u, -.15 * u + Math.sin(a) * .85 * u]); }
    paint(fr, { wash: HAT_S, washOp: 255, ink: PAL.ink, sw: sw * .8 });                                                // front of the brim
    pop();
  };
  const trench = (u, sw) => {
    paint(rectPts(-5.15 * u, -4.3 * u, 10.3 * u, 2.45 * u), { wash: COAT, washOp: 255, fill: BELT, fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .7 });
    for (const s of [-1, 1]) {
      paint([[s * 5.2 * u, -4.3 * u], [s * 5.7 * u, -5.6 * u], [s * 3.6 * u, -4.3 * u]], { wash: COAT, washOp: 255, ink: PAL.ink, sw: sw * .6 });  // popped collar
      paint([[s * 3.4 * u, -4.3 * u], [0, -2.9 * u], [s * 1.2 * u, -4.3 * u]], { wash: mixCol(COAT, BELT, .4), washOp: 255, ink: PAL.ink, sw: sw * .5 }); // lapels
      paint(ellPts(s * .9 * u, -3.45 * u, .22 * u, .22 * u, 8), { wash: BELT, ink: null });                                                            // buttons
    }
    paint(rectPts(-5.15 * u, -2.75 * u, 10.3 * u, .55 * u), { wash: BELT, washOp: 255, ink: PAL.ink, sw: sw * .5 });                                    // belt
    paint(rectPts(-.45 * u, -2.85 * u, .9 * u, .75 * u), { wash: '#C9A24A', washOp: 255, ink: PAL.ink, sw: sw * .4 });                                 // buckle
  };
  const megaphone = (u, sw) => {
    paint([[-.2 * u, -.45 * u], [3.6 * u, -1.5 * u], [3.6 * u, 1.5 * u], [-.2 * u, .45 * u]], { wash: MEG, washOp: 255, fill: PAL.ochre, fillOp: 25, tex: .4, ink: PAL.ink, sw: sw * .7 });
    paint([[1.3 * u, -.85 * u], [1.8 * u, -.98 * u], [1.8 * u, .98 * u], [1.3 * u, .85 * u]], { wash: RIM, washOp: 200, ink: null });
    paint(ellPts(3.6 * u, 0, .45 * u, 1.55 * u, 16), { wash: RIM, washOp: 255, ink: PAL.ink, sw: sw * .7 });
    paint(ellPts(3.72 * u, 0, .2 * u, 1.1 * u, 12), { wash: '#5A3A30', washOp: 255, ink: null });
  };
  // o.hatLift (body units) / o.hatTilt pop the fedora off the head; o.aR aims the megaphone
  function skeptic(x, y, u, o = {}) {
    const lift = o.hatLift || 0, tilt = o.hatTilt || 0;
    clawd(x, y, u, { eyes: 'narrow', mouth: 'flat', aR: .35, aL: -.3, armR: megaphone, ...o,
      draw: (uu, sw) => { trench(uu, sw); fedora(uu, sw, lift, tilt); } });
  }
  // the screen/world point of the megaphone bell for a skeptic at (x, y) with arm angle a (unflipped)
  const bell = (x, y, u, a, dy = 0) => [x + 4.9 * u + Math.cos(a) * 5.9 * u, y + dy * u - 4.5 * u - Math.sin(a) * 5.9 * u];
  // shouting: arcs leaving the bell on every beat
  function shout(p, a, u, t, col = PAL.cream, k = 1) {
    const ph = frac(bpOf(t) * 2);
    for (let i = 0; i < 3; i++) {
      const d = (i + ph) * 1.6 * u, r = (1.2 + (i + ph) * .7) * u, al = 1 - (i + ph) / 3; if (al < .05) continue;
      const pts = []; for (let j = -3; j <= 3; j++) { const b = a + j * .16; pts.push([p[0] + Math.cos(a) * d + Math.cos(b) * r * .5 - Math.cos(a) * r * .5, p[1] - Math.sin(a) * d - Math.sin(b) * r * .5 + Math.sin(a) * r * .5]); }
      inkLine(pts.map(([px, py]) => [px, py]), (1.4 + u * .08) * al * k, col, 'ink', .6);
    }
  }

  // ---------------- backgrounds ----------------
  function dusk(top, hz, x0 = -1600, x1 = W + 1600) {
    paint(rectPts(x0, top - 2000, x1 - x0, hz - top + 2100), { wash: D_TOP, washOp: 255, fill: PAL.indigo, fillOp: 50, bleed: .2, tex: .5, ink: null });
    const cx = (x0 + x1) / 2, h = hz - top, w = (x1 - x0) / 2;
    paint(ellPts(cx, hz, w * 1.1, h * .8, 30, 10), { fill: D_MID, fillOp: 210, bleed: .2, tex: .4, ink: null });
    paint(ellPts(cx, hz, w * .95, h * .45, 30, 10), { fill: D_LOW, fillOp: 200, bleed: .2, tex: .4, ink: null });
    paint(ellPts(cx, hz, w * .7, h * .18, 26, 6), { fill: D_HZ, fillOp: 190, bleed: .2, tex: .4, ink: null });
    for (let i = 0; i < 26; i++) { const sx = x0 + hash(i * 3.1) * (x1 - x0), sy = top + hash(i * 7.7) * h * .45, r = 1.5 + 2 * hash(i);
      paint(ellPts(sx, sy, r, r, 6), { wash: PAL.cream, washOp: 200, ink: null }); }
  }
  // log-log ticks on the sky: the graph paper the whole video lives on
  function logGrid(x0, x1, y0, y1, dec, col, w = .6) {
    for (let x = x0 - dec; x < x1; x += dec) for (let k = 1; k < 10; k++) { const gx = x + dec * Math.log10(k); if (gx > x0 && gx < x1) inkLine([[gx, y0], [gx, y1]], k === 1 ? w * 1.6 : w, col, 'inkfine', 0); }
    for (let y = y1; y > y0 - dec; y -= dec) for (let k = 1; k < 10; k++) { const gy = y - dec * Math.log10(k); if (gy > y0 && gy < y1) inkLine([[x0, gy], [x1, gy]], k === 1 ? w * 1.6 : w, col, 'inkfine', 0); }
  }
  const ground = (hz, x0 = -1600, x1 = W + 1600, col = DIRT) => {
    paint(rectPts(x0, hz, x1 - x0, 3000, 0), { wash: col, washOp: 255, fill: PAL.night, fillOp: 50, bleed: .1, tex: .6, ink: null });
    inkLine([[x0, hz], [x1, hz]], 1.1, PAL.ink, 'inkfine', 0);
  };
  // the line: a thick straight clay beam with a glow, from a to b (never bends)
  function beam(a, b, th, glow = 1) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * th / 2, ny = dx / l * th / 2;
    const q = (k, s) => [[a[0] + nx * k, a[1] + ny * k], [b[0] + nx * k + dx / l * s, b[1] + ny * k + dy / l * s], [b[0] - nx * k + dx / l * s, b[1] - ny * k + dy / l * s], [a[0] - nx * k, a[1] - ny * k]];
    paint(q(2, th * .6), { fill: PAL.clayLt, fillOp: Math.min(110, 70 * glow), bleed: .25, tex: .3, ink: null });
    paint(q(1, 0), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 50, tex: .4, ink: PAL.ink, sw: 1.4 });
    paint(q(.3, 0).map(([x, y]) => [x - nx * .35, y - ny * .35]), { wash: PAL.clayLt, washOp: 170, ink: null });
    paint(ellPts(b[0], b[1], th * .9, th * .9, 18, 2), { fill: GOLD, fillOp: 160 * glow, bleed: .3, ink: null });
    paint(ellPts(b[0], b[1], th * .32, th * .32, 12), { wash: GOLD_LT, washOp: 255, ink: null });
  }
  function rock(x, top, w, h) {
    paint([[x - 40, top + h], [x, top + 30], [x + 60, top], [x + w - 80, top - 6], [x + w, top + 40], [x + w + 70, top + h]],
      { wash: ROCK, washOp: 255, fill: PAL.night, fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.2, curv: .3 });
    paint([[x + 20, top + 30], [x + 60, top + 8], [x + w - 80, top + 2], [x + w - 30, top + 36]], { wash: soft(ROCK, .25), washOp: 200, ink: null, curv: .4 });
    for (let i = 0; i < 4; i++) inkLine([[x + 60 + i * 120, top + 50 + 30 * hash(i)], [x + 90 + i * 120, top + 120 + 40 * hash(i + 3)]], .7, PAL.ink, 'inkfine', .5);
  }

  // ======================= 119.2 – 122.39: three walls, one skewer =======================
  // the line comes in from the upper left over the Skeptics' hats and drives DOWN through three walls that step down with it
  const S1 = 119.2, HIT = [bt(257), bt(258), bt(259)], HZ1 = 840;
  const WALLS = [{ x: 860, w: 230, top: 170 }, { x: 1220, w: 240, top: 315 }, { x: 1580, w: 250, top: 455 }];
  const SLOPE = 140 / 360, lineY = x => 380 + (x - 860) * SLOPE, LA = [-400, lineY(-400)];
  const LANG1 = Math.atan(SLOPE);
  const BRICK = ['#A8553A', '#B8664A', '#94472F', '#B05A3E'], MORTAR = '#5A3A34';
  // the hole: bricks gone out to a ragged radius; the mortar behind breaks a little closer in, so a dark broken rim
  // frames a slot of open sky the line passes through
  const backEdge = (i, x, side) => lineY(x) + side * (50 + 16 * hash(i * 13 + Math.round(x / 14) * 7 + (side > 0 ? 3 : 0)));
  const tipXAt = t => kf(t, [[S1, 560], [barT(65) - .1, 600], [HIT[0], 1010], [HIT[1], 1375], [HIT[2], 1740], [HIT[2] + .5, 1930]], ease);
  function wall(i, t, tipX) {
    const w = WALLS[i], hit = HIT[i] - .05, age = t - hit, x0 = w.x - w.w / 2, x1 = w.x + w.w / 2, cut = Math.min(x1, tipX);
    const jolt = age > 0 ? Math.sin(age * 30) * Math.exp(-age * 7) : 0;
    push(); translate(w.x, HZ1); rotate(jolt * .015); translate(-w.x + jolt * 8, -HZ1);
    // the mortar backing, with the slot cut out behind the tip
    const ink = { wash: MORTAR, washOp: 255, fill: PAL.night, fillOp: 30, tex: .4, ink: PAL.ink, sw: 1.3 };
    if (cut <= x0) paint(rectPts(x0, w.top, w.w, HZ1 - w.top, 2), ink);
    else {
      const xs = []; for (let x = x0; x < cut - 4; x += 14) xs.push(x); xs.push(cut);
      const up = xs.map(x => [x, backEdge(i, x, -1)]), dn = xs.map(x => [x, backEdge(i, x, 1)]);
      if (cut >= x1) {                                  // pierced right through: two pieces
        paint([[x0, w.top], [x1, w.top], ...up.slice().reverse()], ink);
        paint([...dn, [x1, HZ1], [x0, HZ1]], ink);
      } else paint([[x0, w.top], [x1, w.top], [x1, HZ1], [x0, HZ1], ...dn, [Math.min(cut + 30, x1 - 2), lineY(Math.min(cut + 30, x1 - 2))], ...up.slice().reverse()], ink);
    }
    const bh = 34, bw = 62;
    for (let r = 0, y = HZ1 - bh; y > w.top - 1; r++, y -= bh) {
      for (let x = x0 + (r % 2 ? -bw / 2 : 0); x < x1; x += bw) {
        const a = Math.max(x, x0) + 2, b = Math.min(x + bw, x1) - 2; if (b - a < 8) continue;
        const mx = (a + b) / 2, my = y + bh / 2, hb = hash(i * 97 + r * 13 + x);
        if (a < cut && Math.abs(my - lineY(mx)) < 82 + 34 * hash(i * 7 + r * 3 + x * .1)) continue;   // knocked out
        paint(rectPts(a, y + 2, b - a, bh - 4, 1), { wash: BRICK[Math.floor(hb * 4)], washOp: 255, ink: null });
      }
    }
    paint(rectPts(x0 - 6, w.top - 14, w.w + 12, 16, 2), { wash: '#8C6A5A', washOp: 255, ink: PAL.ink, sw: 1 });        // coping
    // cracks running out from the hole into the bricks
    if (cut > x0 + 20) for (let k = 0; k < 6; k++) {
      const cx = x0 + 20 + (Math.min(cut, x1) - x0 - 40) * hash(i * 5 + k), s = k % 2 ? 1 : -1, pts = [[cx, lineY(cx) + s * 92]];
      for (let j = 1; j < 4; j++) pts.push([cx + 18 * (hash(i + k * 3 + j) - .5) * j, lineY(cx) + s * (92 + j * (26 + 14 * hash(k + j * 5)))]);
      inkLine(pts, 1, PAL.ink, 'inkfine', 0);
    }
    pop();
    return { x0, x1, cut, age };
  }
  // the line inside the wall sits in the hole's shadow, so it reads as passing through, not lying on top
  function tunnelShade(i, cut) {
    const w = WALLS[i], x0 = w.x - w.w / 2, x1 = Math.min(cut, w.x + w.w / 2); if (x1 <= x0) return;
    const h = 21;
    paint([[x0, lineY(x0) - h], [x1, lineY(x1) - h], [x1, lineY(x1) + h], [x0, lineY(x0) + h]], { fill: '#1E1426', fillOp: 120, bleed: .05, ink: null });
  }
  function debris(i, t) {
    const w = WALLS[i], age = t - (HIT[i] - .05); if (age < 0 || age > 1.3) return;
    const x0 = w.x + w.w / 2, y0 = lineY(x0);
    // a gold spark and dust bursting off the far face
    if (age < .35) paint(ellPts(x0, y0, 120 * easeOut(age * 3), 120 * easeOut(age * 3), 20, 4), { fill: GOLD, fillOp: 190 * (1 - age / .35), bleed: .3, ink: null });
    if (age < .6) paint(ellPts(x0 + 60 * easeOut(age * 2), y0, 40 + 140 * easeOut(age * 2), 30 + 110 * easeOut(age * 2), 18, 6), { fill: '#D8C2B0', fillOp: 150 * (1 - age / .6), bleed: .3, ink: null });
    for (let k = 0; k < 16; k++) {
      const h1 = hash(i * 31 + k), h2 = hash(i * 17 + k * 5 + 3), ang = LANG1 + (h2 - .5) * 1.8, sp = 500 + 800 * h1;
      const x = x0 + Math.cos(ang) * sp * age, y = y0 + Math.sin(ang) * sp * age - 250 * age + 1500 * age * age; if (y > HZ1 + 40) continue;
      const s = k < 10 ? 1 : .55;
      push(); translate(x, y); rotate(age * (6 + 8 * h1) * (k % 2 ? 1 : -1));
      paint(rectPts(-15 * s, -8 * s, 30 * s, 16 * s, 1), { wash: BRICK[k % 4], washOp: 255, ink: PAL.ink, sw: .8 });
      pop();
    }
  }
  function choirRow(t, y, u, x0, x1, n, shoutK) {
    for (let i = 0; i < n; i++) {
      const x = lerp(x0, x1, i / (n - 1)), coat = i % 2 === 1, chant = frac(bpOf(t)) < .45;
      const m = move(shoutK > .5 ? 'roof' : 'stomp', t, i);
      clawd(x, y, u, { ...m, draw: coat ? labCoat : HARD, mouth: chant || shoutK > .5 ? 'O' : 'flat', eyes: shoutK > .5 ? 'closed' : 'happy', noShadow: true });
    }
  }
  function skewer(t, lt) {
    const zoom = kf(t, [[S1, 1.5], [S1 + .3, 1.45], [barT(65) + .1, 1.0]]), c = kf(t, [[S1, [360, 470]], [S1 + .3, [380, 470]], [barT(65) + .1, [960, 540]]]);
    const [sx, sy] = shakeXY(t, 3 * pulse(t, 8) + (t > HIT[0] - .1 && t < HIT[2] + .3 ? 4 : 0));
    camBegin(c[0] + sx, c[1] + sy, zoom * (1 + .015 * pulse(t, 7)));
    dusk(-200, HZ1);
    logGrid(-200, W + 200, -300, HZ1, 520, mixCol(D_MID, GRID, .45), .5);
    ground(HZ1);
    const tipX = tipXAt(t), tip = [tipX, lineY(tipX)];
    // the walls get a line-shaped hole punched behind the tip; the line runs through the holes, shaded inside the wall
    WALLS.forEach((_, i) => wall(i, t, tipX));
    beam(LA, tip, 46, 1 + .4 * pulse(t, 5));
    WALLS.forEach((_, i) => tunnelShade(i, tipX));
    WALLS.forEach((_, i) => debris(i, t));
    // Skeptics on the rock ledge, megaphones at the walls
    rock(-80, 560, 620, 420);
    const hat = h => { let l = 0; for (const x of HIT) if (t > x) l += 3 * Math.sin(Math.PI * seg(t, x, x + .4)); return l; };
    const m = mood(t, [[S1, 'narrow'], [HIT[0], 'scared', '!'], [HIT[2] + .35, 'swirl']]);
    [[110, 0], [290, 1], [470, 2]].forEach(([x, k]) => {
      const a = .32 + .1 * k + (t < HIT[0] ? .08 * pulse(t, 6) : -.25 * ease(seg(t, HIT[0], HIT[0] + .3)));
      const lf = hat() * (1 + .3 * k);
      skeptic(x, 562, 17, { ...m, emote: k === 1 ? m.emote : null, aR: a, dy: -.4 * pulse(t, 8), hatLift: lf, hatTilt: lf * .05 * (k - 1),
        mouth: t < HIT[0] ? (frac(bpOf(t) * 2) < .5 ? 'O' : 'wobble') : 'wobble' });
      if (t < HIT[0] + .2) shout(bell(x, 562, 17, a), a, 17, t, PAL.cream, 1 - seg(t, HIT[0], HIT[0] + .2));
    });
    // the choir in front: stomping, then "there is no wall" with arms up
    choirRow(t, 905, 10, 700, 1800, 9, seg(t, bt(258) - .05, bt(258) + .05));
    camEnd();
    if (lt < .7) sfx('SKREEE', 640, 330, 70, PAL.cream, lt, { life: .7, rot: -.1 });
    HIT.forEach((h, i) => { if (t >= h - .05 && t < h + .55) sfx(i < 2 ? 'THUNK' : 'THUNK!', WALLS[i].x + 40, WALLS[i].top - 80 - 10 * i, 60 + 18 * i, PAL.cream, t - h + .05, { life: .55, rot: -.12 + .1 * i }); });
  }

  // ======================= 122.39 – 126.0: the book factory buries the Skeptics =======================
  const S2 = bt(261), BELT_Y = 640, HZ2 = 880, ST = [250, 550, 850, 1150], SK2 = [1500, 1665, 1830];
  const P = t => { const bp = bpOf(t); return Math.floor(bp) + ease(seg(frac(bp), .25, .85)); };   // indexing belt, still on the beat
  const stampOff = t => { const f = frac(bpOf(t)); return f < .12 ? 0 : f < .5 ? 110 * easeOut((f - .12) / .38) : f < .82 ? 110 : 110 * (1 - easeIn((f - .82) / .18)); };
  const book = (x, y, w, h, c, rot = 0) => {
    push(); translate(x, y); rotate(rot);
    paint(rectPts(-w / 2, -h / 2, w, h, 1), { wash: c, washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rectPts(-w / 2 + 4, -h / 2 + 3, w - 12, h * .35, 0), { wash: PAL.cream, washOp: 230, ink: null });
    paint(rectPts(w / 2 - 12, -h / 2, 5, h, 0), { wash: mixCol(c, PAL.ink, .35), washOp: 255, ink: null });
    pop();
  };
  const flyBook = (x, y, c, rot) => {                    // a book seen face-on, tumbling
    push(); translate(x, y); rotate(rot);
    paint(rectPts(-24, -31, 48, 62, 1), { wash: c, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rectPts(-24, -31, 9, 62, 0), { wash: mixCol(c, PAL.ink, .35), washOp: 255, ink: null });
    paint(rectPts(-8, -18, 26, 12, 0), { wash: PAL.cream, washOp: 230, ink: null });
    pop();
  };
  const pileH = (x, t) => { const ph = 160 * ease(seg(t, S2 + 1, 125.75)); return ph * clamp(1 - Math.pow((x - 1665) / 330, 2) * .7); };
  function factory(t, lt) {
    const [sx, sy] = shakeXY(t, 2 * pulse(t, 8));
    camBegin(lerp(930, 1020, ease(lt / 3.6)) + sx, 560 + sy, lerp(1.0, 1.06, ease(lt / 3.6)) * (1 + .012 * pulse(t, 7)));
    dusk(-200, HZ2);
    logGrid(-200, W + 200, -300, HZ2, 520, mixCol(D_MID, GRID, .45), .5);
    ground(HZ2);
    // a platform behind the belt; a Clawd on it at each station holds a T-handled stamp, jumps, and slams it down on the beat
    const off = stampOff(t), bp = bpOf(t), CU2 = 22, FEET = BELT_Y - 60, dn = 1 - off / 110;
    paint(rectPts(30, FEET, 1300, 18, 1), { wash: SL.STEEL, washOp: 255, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 5; i++) paint(rectPts(80 + i * 300, FEET + 18, 14, 50, 0), { wash: SL.STEEL_DK, washOp: 255, ink: PAL.ink, sw: .6 });
    ST.forEach((x, k) => clawd(x, FEET, CU2, { draw: k % 2 ? labCoat : HARD, aL: -.5, aR: -.5, dy: -off / CU2, sq: dn > .9 ? (dn - .9) * 1.8 : -.06,
      eyes: dn > .7 ? 'closed' : 'happy', mouth: dn > .7 ? 'O' : 'grin', noShadow: true }));
    // the belt
    for (let i = 0; i < 6; i++) paint(rectPts(110 + i * 245, BELT_Y + 40, 16, HZ2 - BELT_Y - 40, 1), { wash: SL.STEEL_DK, washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rrPts(60, BELT_Y, 1270, 42, 20, 1), { wash: '#3B3550', washOp: 255, fill: PAL.night, fillOp: 50, tex: .4, ink: PAL.ink, sw: 1.2 });
    for (let i = 0; i < 16; i++) { const rx = 85 + i * 82; paint(ellPts(rx, BELT_Y + 21, 12, 12, 10), { wash: SL.STEEL, washOp: 255, ink: PAL.ink, sw: .6 });
      inkLine([[rx, BELT_Y + 21], [rx + 10 * Math.cos(t * 9), BELT_Y + 21 + 10 * Math.sin(t * 9)]], .6, PAL.ink, 'inkfine', 0); }
    // stacks riding the belt: a blank sheet gains a book at each stamp
    const pp = P(t), j0 = Math.floor(bp) - 6;
    for (let j = j0; j <= Math.floor(bp) + 1; j++) {
      const x = ST[0] + 300 * (pp - j); if (x < 0 || x > 1335) continue;
      const n = clamp(Math.floor(bp - j + .02) + 1, 0, 4);
      paint(rectPts(x - 68, BELT_Y - 5, 136, 5, 0), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .5 });
      for (let m = 0; m < n; m++) book(x, BELT_Y - 12 - m * 14, 130, 14, BOOKS[(j * 3 + m) % 7]);
    }
    // the stamps: a crossbar in both grips, a handle, the block and its inked rubber
    ST.forEach((x, k) => {
      const ty = FEET - 3.45 * CU2 - off, by = BELT_Y - 5 - 14 * (k + 1) - off;
      paint(rectPts(x - 11, ty, 22, by - 40 - ty, 1), { wash: '#C08A50', washOp: 255, ink: PAL.ink, sw: .9 });
      paint(rrPts(x - 6.3 * CU2, ty - 11, 12.6 * CU2, 22, 10), { wash: '#4A2E20', washOp: 255, ink: PAL.ink, sw: 1.1 });
      paint(rectPts(x - 74, by - 42, 148, 36, 3), { wash: '#C08A50', washOp: 255, fill: '#7C4A2C', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.2 });
      paint(rectPts(x - 70, by - 8, 140, 9, 1), { wash: '#C8324A', washOp: 255, ink: PAL.ink, sw: .8 });
      if (off < 4) paint(ellPts(x, by + 2, 100, 16, 14, 3), { fill: PAL.cream, fillOp: 130, bleed: .2, ink: null });
    });
    // Skeptics on the right, then the pile buries them to the hat
    const m = mood(t, [[S2, 'narrow'], [S2 + 1.1, 'scared', 'sweat'], [125.3, 'flat']]);
    SK2.forEach((x, k) => {
      const a = lerp(.3, 1.35, ease(seg(t, 124.6, 125.4))) + .1 * k;
      const bonk = Math.max(0, Math.sin(Math.PI * seg(frac(bpOf(t) + k * .33), 0, .35))) * (t > S2 + 1 ? 1 : 0);
      skeptic(x, HZ2, 16, { ...m, emote: k === 1 ? m.emote : null, aR: a, flip: false, hatLift: bonk * .8, hatTilt: bonk * .1 * (k - 1), noShadow: true,
        mouth: t < S2 + 1 ? (frac(bpOf(t) * 2) < .5 ? 'O' : 'flat') : 'wobble' });
    });
    for (let c = 0; c < 9; c++) {
      const x = 1430 + c * 60, h = pileH(x, t);
      for (let r = 0; r * 14 < h; r++) book(x + 10 * (hash(c * 13 + r) - .5), HZ2 - 7 - r * 14, 76, 14, BOOKS[(c * 5 + r * 3) % 7], (hash(c + r * 7) - .5) * .12);
    }
    // the fountain off the end of the belt, plus books raining from the sky
    for (let j = Math.floor(bp) - 8; j <= Math.floor(bp); j++) {
      const tl = OFF + (j + 3.58) * BEAT; if (tl < S2 + .2) continue;
      for (let m = 0; m < 4; m++) {
        const s = (t - tl - m * .05) / .8; if (s < 0 || s > 1) continue;
        const x1 = 1430 + 480 * hash(j * 7 + m), y1 = HZ2 - pileH(x1, t) - 8;
        const x = lerp(1330, x1, s), y = lerp(BELT_Y - 12 - m * 14, y1, s) - 420 * 4 * s * (1 - s);
        flyBook(x, y, BOOKS[(j * 3 + m) % 7], s * (4 + 3 * hash(m + j)) * (m % 2 ? 1 : -1));
      }
    }
    for (let i = 0; i < 26; i++) {
      const ti = S2 + .9 + i * .1, age = t - ti; if (age < 0) continue;
      const x = 1440 + 460 * hash(i * 5.3), y = -80 + 1400 * age * age + 300 * age, yl = HZ2 - pileH(x, t) - 8; if (y > yl) continue;
      flyBook(x, y, BOOKS[i % 7], age * 5 * (i % 2 ? 1 : -1));
    }
    camEnd();
    if (t > 125.2 && t < 125.95) sfx('THUD', 1665, 600, 64, PAL.cream, t - 125.2, { life: .75, rot: .08 });
  }

  // ======================= 126.0 – 127.54: the empty wallet, answered by five hundred trucks =======================
  const S3 = 126.0, FLIP = bt(269), HONK = [bt(270), bt(271)], VP = [1290, 560];
  function truck(x, y, s, t, bounce) {
    y -= bounce * 10 * s;
    const R = (a, b, w, h, o) => paint(rectPts(x + a * s, y + b * s, w * s, h * s, s > .3 ? 1 : 0), o);
    const ink = s > .25 ? PAL.ink : null, sw = clamp(s * 1.4, .5, 1.4);
    R(-180, -150, 360, 110, { wash: '#E3A92E', washOp: 255, ink, sw });                                                  // dump bed
    paint([[x - 175 * s, y - 150 * s], [x - 120 * s, y - 230 * s], [x - 10 * s, y - 250 * s], [x + 110 * s, y - 228 * s], [x + 175 * s, y - 150 * s]],
      { wash: GOLD, washOp: 255, fill: PAL.ochre, fillOp: 80, tex: .4, ink, sw, curv: .5 });                            // heap of coins
    if (s > .3) for (let i = 0; i < 9; i++) { const cx = x + (-130 + 260 * hash(i * 3.3)) * s, cy = y - (165 + 60 * hash(i * 9.1)) * s;
      paint(ellPts(cx, cy, 14 * s, 9 * s, 10), { wash: GOLD_LT, washOp: 255, ink: PAL.clayDk, sw: .5 }); }
    R(-300, -170, 120, 130, { wash: PAL.clay, washOp: 255, ink, sw });                                                    // cab
    R(-285, -155, 70, 50, { wash: PAL.sky, washOp: 230, ink: s > .25 ? PAL.ink : null, sw: sw * .7 });
    R(-310, -50, 500, 30, { wash: '#3B3550', washOp: 255, ink: null });
    for (const wx of [-240, 60, 130]) { paint(ellPts(x + wx * s, y - 18 * s, 34 * s, 34 * s, 14), { wash: PAL.ink, washOp: 255, ink: null });
      if (s > .3) paint(ellPts(x + wx * s, y - 18 * s, 13 * s, 13 * s, 10), { wash: SL.STEEL, washOp: 255, ink: null }); }
  }
  function money(t, lt) {
    const out = ease(seg(t, HONK[0] - .12, HONK[0] + .3));
    const zoom = lerp(1.75, 1.0, out) * (1 + .015 * pulse(t, 7)), [sx, sy] = shakeXY(t, 2 + 4 * out * pulse(t, 6));
    camBegin(lerp(470, 960, out) + sx, lerp(640, 560, out) + sy, zoom);
    dusk(-260, VP[1]);
    ground(VP[1]);
    paint([[VP[0] - 6, VP[1]], [VP[0] + 6, VP[1]], [2300, 1300], [700, 1300]], { wash: '#4A3A44', washOp: 255, fill: PAL.night, fillOp: 50, tex: .4, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 9; i++) { const k0 = Math.pow(.62, i + frac(t * .5)), k1 = k0 * .8;
      paint([[lerp(VP[0], 1500, k0) - 6 * k0, lerp(VP[1], 1300, k0)], [lerp(VP[0], 1500, k0) + 6 * k0, lerp(VP[1], 1300, k0)], [lerp(VP[0], 1500, k1) + 6 * k1, lerp(VP[1], 1300, k1)], [lerp(VP[0], 1500, k1) - 6 * k1, lerp(VP[1], 1300, k1)]], { wash: PAL.cream, washOp: 200, ink: null }); }
    // the line of trucks, far to near
    const hk = HONK.reduce((a, h) => t >= h ? Math.max(a, Math.exp(-(t - h) * 7)) : a, 0);
    for (let j = 44; j >= 0; j--) {
      const s = 1 / (1 + j * .45), x = lerp(VP[0], 1560, s), y = lerp(VP[1], 960, s);
      if (s < .06) { paint(rectPts(x - 3, y - 4, 7, 4, 0), { wash: GOLD, washOp: 255, ink: null }); continue; }
      truck(x, y, s * .95, t, hk * Math.sin(Math.PI * clamp((t - HONK[0]) * 8 - j * .08)) * 0 + hk * (1 - j / 45));
      if (hk > .2 && s > .15) for (let r = 0; r < 3; r++) inkLine([[x - 320 * s - (14 + r * 14) * s, y - 150 * s - r * 18 * s], [x - 320 * s - (40 + r * 22) * s, y - 170 * s - r * 30 * s]], 2.4 * s + .6, PAL.cream, 'ink', 0);
    }
    // the Skeptic and the wallet, in the foreground
    const flip = ease(seg(t, FLIP - .15, FLIP + .12));
    const m = mood(t, [[S3, 'narrow'], [FLIP + .2, 'flat'], [HONK[0] + .05, 'scared', '!']]);
    skeptic(430, 930, 38, { ...m, aR: .55, aL: -.25, armR: null, dy: -.15 * pulse(t, 8), hatLift: 2.5 * hk, hatTilt: -.15 * hk, mouth: t > HONK[0] ? 'O' : 'flat' });
    // the wallet, held up at the arm tip, falls open: empty lining, empty card slots
    const op = ease(seg(t, FLIP - .12, FLIP + .08)), WX = 700, WY = 650;
    const half = (sgn, w) => {                              // one half of the wallet: leather, then the lining when open
      const xa = WX, xb = WX + sgn * w;
      paint([[xa, WY - 60], [xb, WY - 62], [xb, WY + 58], [xa, WY + 60]], { wash: '#6B4430', washOp: 255, fill: PAL.ink, fillOp: 30, tex: .5, ink: PAL.ink, sw: 1.3 });
      if (op > .3) { const xi = WX + sgn * 8, xo = WX + sgn * (w - 10);
        paint([[xi, WY - 50], [xo, WY - 52], [xo, WY + 48], [xi, WY + 50]], { wash: '#E9C9A0', washOp: 255, ink: PAL.ink, sw: .7 });
        for (let r = 0; r < 3; r++) inkLine([[xi, WY - 30 + r * 26], [xo, WY - 31 + r * 26]], .9, '#9A7A5A', 'inkfine', 0); }
    };
    half(-1, 85); half(1, 85 * (op * 2 - 1) * (op > .5 ? 1 : 0) + (op <= .5 ? 85 * (1 - op * 2) * 0 : 0));
    if (op < .5) paint([[WX, WY - 60], [WX + 6, WY - 61], [WX + 6, WY + 59], [WX, WY + 60]], { wash: '#4A2E20', washOp: 255, ink: PAL.ink, sw: 1 });
    // the moth
    const ma = t - FLIP; if (ma > 0) {
      const mx = WX + 140 * ma + 40 * Math.sin(ma * 8), my = WY - 30 - 330 * ma - 30 * Math.abs(Math.sin(ma * 12)), fl = Math.abs(Math.sin(ma * 36));
      for (const sg of [-1, 1]) {
        paint(ellPts(mx + sg * 24, my - 8, 26, 12 + 14 * fl, 12, 0, sg * .45), { wash: '#C9BCA8', washOp: 255, ink: PAL.ink, sw: 1 });
        paint(ellPts(mx + sg * 28, my - 8, 5, 4, 8), { wash: '#7A6A58', washOp: 255, ink: null });
        paint(ellPts(mx + sg * 16, my + 8, 13, 8, 10, 0, -sg * .4), { wash: '#B0A28C', washOp: 255, ink: PAL.ink, sw: .8 });
      }
      paint(ellPts(mx, my, 6, 16, 10), { wash: '#6B5A4A', washOp: 255, ink: PAL.ink, sw: .8 });
      for (const sg of [-1, 1]) inkLine([[mx, my - 14], [mx + sg * 10, my - 30]], .9, PAL.ink, 'inkfine', .4);
      for (let i = 0; i < 5; i++) paint(ellPts(WX + 70 * hash(i) - 35, WY + 60 + ma * 220 * (1 + hash(i + 2)), 3, 3, 6), { wash: '#C9BCA8', washOp: 220, ink: null });
    }
    camEnd();
    HONK.forEach((h, i) => { if (t >= h - .02 && t < h + .5) sfx('HONK', 980 + 120 * i, 300 + 30 * i, 74 + 14 * i, GOLD_LT, t - h + .02, { life: .5, rot: -.08 + .12 * i }); });
  }

  // ======================= 127.54 – 135.04: breakdown, the dam, the tower, the SMASH =======================
  const S4 = barT(69), END = barT(73), IMPACT = END - .2, GROUND = 1000, BASE_X = 560, BU = 44, CU = 22, NCL = 10;
  const land = k => bt(273 + k);                         // climber k lands on beat 1..10 of the breakdown
  const STRIDE = 8 * CU + 18;
  const feetY = k => GROUND - 8 * BU - k * STRIDE;       // where climber k stands
  // height of the tower top (feet of the next climber), eased as each one lands
  const towerTop = t => { let y = feetY(0) + 0; for (let k = 0; k < NCL; k++) y -= STRIDE * ease(seg(t, land(k) - .05, land(k) + .2)); return y; };
  // the line slopes DOWN from the tower top toward the dam; it tilts steeper as the tower lifts its tail (still dead straight)
  // where the line rests: on top of whoever is on top of the tower (a hard hat sits higher than a bare lab-coat head),
  // lifting to each new climber as they land
  const restY = k => k < 0 ? GROUND - 12.5 * BU - 34 : feetY(k) - (k % 2 ? 8 : 12.5) * CU - 34;
  const holdY = t => { let y = restY(-1); for (let k = 0; k < NCL; k++) y = lerp(y, restY(k), ease(seg(t, land(k), land(k) + .15))); return y; };
  const LLEN = 1450, lAng = t => lerp(.06, .25, clamp((feetY(0) - towerTop(t)) / (NCL * STRIDE)));
  function damScene(t, zinv) {
    dusk(-3200, 1000, -3000, 6500);
    logGrid(-3000, 6500, -3600, 1000, 1400, mixCol(D_MID, GRID, .4), .8);
    // far mountains
    paint([[-3000, 1000], [-1800, -900], [-600, -300], [600, -1500], [1400, -600], [1400, 1000]], { wash: '#4A2F4E', washOp: 255, fill: PAL.night, fillOp: 60, tex: .5, ink: null });
    paint([[4000, 1000], [4500, -1400], [5400, -2400], [6500, -1200], [6500, 1000]], { wash: '#4A2F4E', washOp: 255, fill: PAL.night, fillOp: 60, tex: .5, ink: null });
    // the dam: a concrete wall between two mountains, crest at -2100
    const DAM = [[1450, 1000], [1900, -2100], [4550, -2100], [5000, 1000]];
    paint(DAM, { wash: '#8A8E9E', washOp: 255, fill: PAL.indigo, fillOp: 60, tex: .7, ink: PAL.ink, sw: 1.6 });
    paint([[1880, -1950], [1900, -2100], [4550, -2100], [4570, -1950]], { wash: '#A4A8B6', washOp: 200, ink: null });      // evening light on the top
    for (let i = 1; i < 12; i++) {                          // curved lift lines: an arch dam bowing toward us
      const y = -2100 + i * 260, xl = lerp(1900, 1450, i * 260 / 3100), xr = lerp(4550, 5000, i * 260 / 3100), pts = [];
      for (let k = 0; k <= 10; k++) pts.push([lerp(xl, xr, k / 10), y + 70 * Math.sin(Math.PI * k / 10)]);
      inkLine(pts, 1.2, '#5D6278', 'inkfine', .5);
    }
    for (let i = 0; i < 7; i++) { const x = 2350 + i * 380; paint([[x - 26, -2080], [x + 26, -2080], [x + 50, 1000], [x - 50, 1000]], { wash: '#767A8E', washOp: 200, fill: PAL.night, fillOp: 30, ink: null }); }
    paint(rectPts(1880, -2190, 2690, 100, 0), { wash: '#6E7286', washOp: 255, ink: PAL.ink, sw: 1.4 });           // crest walkway
    for (let i = 0; i < 38; i++) paint(rectPts(1900 + i * 71, -2240, 8, 50, 0), { wash: '#5D6278', washOp: 255, ink: null });
    paint(rectPts(1890, -2244, 2670, 9, 0), { wash: '#5D6278', washOp: 255, ink: null });
    for (let i = 0; i < 5; i++) paint(rectPts(2500 + i * 400, -1900, 200, 220, 2), { wash: '#5D6278', washOp: 255, fill: PAL.night, fillOp: 40, ink: PAL.ink, sw: 1.2 });  // sluice gates
    // near mountains hide the dam's ends
    paint([[300, 1000], [900, -700], [1500, -2500], [1850, -1500], [1950, 1000]], { wash: '#6B3F4E', washOp: 255, fill: ROCK, fillOp: 90, tex: .6, ink: PAL.ink, sw: 1.4 });
    paint([[4350, 1000], [4500, -1700], [4900, -2900], [5700, -1200], [6100, 1000]], { wash: '#6B3F4E', washOp: 255, fill: ROCK, fillOp: 90, tex: .6, ink: PAL.ink, sw: 1.4 });
    paint([[1500, -2500], [1360, -2170], [1550, -2260], [1660, -2200]], { wash: PAL.cream, washOp: 220, ink: null });   // snowcaps
    paint([[4900, -2900], [4750, -2550], [4920, -2620], [5080, -2500]], { wash: PAL.cream, washOp: 220, ink: null });
    ground(GROUND, -3000, 6500);
  }
  // a tapered filled stroke along pts (ink lines vanish at this zoom; filled shapes hold)
  const strip = (pts, w0, w1) => {
    const L = [], R = [];
    pts.forEach((p, i) => {
      const q = pts[Math.min(pts.length - 1, i + 1)], r = pts[Math.max(0, i - 1)], dx = q[0] - r[0], dy = q[1] - r[1], l = Math.hypot(dx, dy) || 1, w = lerp(w0, w1, i / (pts.length - 1)) / 2;
      L.push([p[0] - dy / l * w, p[1] + dx / l * w]); R.push([p[0] + dy / l * w, p[1] - dx / l * w]);
    });
    return L.concat(R.reverse());
  };
  function cracks(hit, t, k) {                           // dark cracks fanning into the dam from the impact point, gold light inside
    for (let i = 0; i < 9; i++) {
      const a = -1.35 + (i + .3 * hash(i * 3.7)) / 9 * 2.7, len = (1500 + 2400 * hash(i + 11)) * k; if (len < 30) continue;
      const pts = [[hit[0], hit[1]]]; let x = hit[0], y = hit[1];
      for (let s = 1; s <= 5; s++) { const aa = a + (hash(i * 9 + s) - .5) * .9; x += Math.cos(aa) * len / 5; y += Math.sin(aa) * len / 5; pts.push([x, y]); }
      paint(strip(pts, 180 * Math.min(1, k), 20), { fill: GOLD, fillOp: 90, bleed: .3, ink: null });
      paint(strip(pts, 75 * Math.min(1, k) + 15, 10), { wash: '#2A1C30', washOp: 255, ink: null });
      paint(strip(pts, 25 * Math.min(1, k) + 5, 4), { wash: GOLD_LT, washOp: 255, ink: null });
    }
  }
  function climber(k, t) {
    const L = land(k), y1 = feetY(k + 1) + STRIDE - STRIDE, coat = k % 2 === 1;
    if (t < L - BEAT) {                                  // waiting in line at the foot of the tower
      const qx = BASE_X + 330 + (k - Math.max(0, Math.floor((t - S4) / BEAT))) * 200;
      if (qx > 2200) return;
      clawd(qx, GROUND, CU, { draw: coat ? labCoat : HARD, eyes: 'narrow', mouth: 'flat', aL: .5, aR: .5, flip: true, walk: frac(t * 1.5) });
      return;
    }
    const s = clamp((t - (L - BEAT)) / BEAT), ty = feetY(k) - 8 * BU * 0 - 0;
    const x0 = BASE_X + 330, x = lerp(x0, BASE_X, easeOut(s)), y = s < 1 ? lerp(GROUND, feetY(k) - 0, s) - 900 * 4 * s * (1 - s) * (1 + k * .15) * .3 : feetY(k);
    return [x, Math.min(y, GROUND)];
  }
  function tower(t, tail, windup) {
    const top = towerTop(t), held = [];
    // lead Clawd at the base, holding the tower up
    clawd(BASE_X, GROUND, BU, { draw: HARD_LAMP, eyes: 'narrow', mouth: 'flat', aL: 1.35, aR: 1.35, sq: .03 * Math.sin(t * 3), emote: t > S4 + 2 ? 'sweat' : null, emoteK: 1 });
    for (let k = 0; k < NCL; k++) {
      const L = land(k);
      if (t < L - BEAT) { climber(k, t); continue; }
      const p = climber(k, t), landed = t >= L, isTop = landed && (k === NCL - 1 || t < land(k + 1));
      const sq = landed ? .2 * Math.exp(-(t - L) * 8) : -.15;
      const flying = !landed;
      clawd(p[0], p[1], CU, { draw: k % 2 ? labCoat : HARD, sq, noShadow: true,
        aL: flying ? 1.6 : 1.3, aR: flying ? 1.6 : 1.3, eyes: flying ? 'happy' : isTop ? 'narrow' : 'closed', mouth: flying ? 'O' : 'flat',
        rot: landed ? .02 * Math.sin(t * 2 + k) : (1 - clamp((t - (L - BEAT)) / BEAT)) * -.6 });
    }
    return top;
  }
  function damBreak(t, lt) {
    // camera: rise with the tower, then pull all the way back to see the dam; the snare roll shakes it harder and faster
    const top = towerTop(t), follow = [1150, Math.min(420, top + 380)], far = [1800, -600];
    const k = ease(seg(t, barT(71) - .2, barT(72) + .4));
    const zoom = lerp(.68, .25, k) * (1 + .03 * ease(seg(t, barT(72) + .4, IMPACT)));
    const bp = bpOf(t), rate = t < barT(71) ? 1 : t < barT(72) ? 2 : t < barT(72) + BAR / 2 ? 4 : 8;
    const roll = Math.exp(-frac(bp * rate) * 6) * seg(t, barT(70), IMPACT);
    const amt = (1 + 16 * Math.pow(seg(t, barT(71), IMPACT), 2)) * (.4 + .6 * roll) + (t > IMPACT ? 40 : 0);
    const [sx, sy] = shakeXY(t, amt / zoom);
    camBegin(lerp(follow[0], far[0], k) + sx, lerp(follow[1], far[1], k) + sy, zoom);
    damScene(t);
    // the Skeptics on the dam crest, megaphones down at the tower
    const sm = mood(t, [[S4, 'narrow'], [IMPACT, 'scared', '!']]);
    [2700, 2930, 3160].forEach((x, i) => { const a = -.35;
      skeptic(x, -2190, 34, { ...sm, flip: true, aR: a, dy: -.3 * roll, mouth: frac(bpOf(t) * 2) < .5 ? 'O' : 'wobble' });
      if (t < IMPACT) shout(bell(-x, -2190, 34, a).map((v, j) => j ? v : -v), Math.PI - a, 34, t, PAL.cream, .8); });
    // cracks creep across the dam on each roll hit in the last bar
    const pre = seg(t, barT(71), IMPACT);
    // the line, held by the top of the tower; wind up, then thrust
    const wind = ease(seg(t, IMPACT - .55, IMPACT - .12)), thrust = easeIn(seg(t, IMPACT - .12, IMPACT));
    const DIR = [Math.cos(lAng(t)), Math.sin(lAng(t))];
    const push_ = 180 * wind - 600 * thrust, tail = [BASE_X + 40 - DIR[0] * push_, holdY(t) - DIR[1] * push_];
    const tip = [tail[0] + DIR[0] * LLEN, tail[1] + DIR[1] * LLEN];
    if (pre > 0) cracks([tip[0] + 30, tip[1]], t, .6 * pre * (.75 + .25 * roll));
    beam([tail[0] - DIR[0] * 3000, tail[1] - DIR[1] * 3000], tip, 70, 1 + 1.5 * pre);
    tower(t);
    if (t >= IMPACT) {
      const a = seg(t, IMPACT, END), hit = tip;
      cracks(hit, t, .7 + 1.2 * a);
      // the flood: gold light pours out of the hole and down the dam face, rays burst out behind it
      for (let i = 0; i < 14; i++) { const ang = i / 14 * TAU + .2, r = 1500 + 4000 * a;
        paint([[hit[0], hit[1]], [hit[0] + Math.cos(ang - .07) * r, hit[1] + Math.sin(ang - .07) * r], [hit[0] + Math.cos(ang + .07) * r, hit[1] + Math.sin(ang + .07) * r]], { fill: GOLD_LT, fillOp: 150 + 80 * a, bleed: .1, ink: null }); }
      const fw = 250 + 1600 * easeOut(a), fall = Math.min(GROUND, hit[1] + 3200 * easeOut(a * 1.6));
      paint([[hit[0] - 120, hit[1]], [hit[0] + 120, hit[1]], [hit[0] + fw, fall], [hit[0] - fw * .8, fall]], { wash: GOLD, washOp: 230, fill: GOLD_LT, fillOp: 120, bleed: .2, ink: null });
      paint(ellPts(hit[0], hit[1], 300 + 2000 * a, 300 + 2000 * a, 30, 30), { fill: GOLD, fillOp: 200, bleed: .25, ink: null });
      paint(ellPts(hit[0], hit[1], 160 + 600 * a, 160 + 600 * a, 24, 10), { wash: GOLD_LT, washOp: 240, ink: null });
    }
    camEnd();
    if (t > barT(72) && t < IMPACT) flash(.12 * roll * pre, GOLD);
    if (t >= IMPACT) {
      const a = seg(t, IMPACT, END);
      flash(.2 + .75 * ease(a * 1.2), GOLD);
      flash(.3 * a, GOLD_LT);
      sfx('SMASH', 960, 470, 220, PAL.cream, t - IMPACT + .08, { life: .8, rot: -.08 });
    }
  }

  chapter('walls', S1, END, [[S1, skewer], [S2, factory], [S3, money], [S4, damBreak]]);
})();
