// c08_prophecy.js: 157.53-191.27, bars 85-102, the bridge. Starlight: deep indigo sky, cream stars, one clay line.
// The Researcher and a small Clawd sit on a dune at night. A ruler lines the stars up into a straight constellation,
// Clawd's shadow grows into a planet-sized constellation Clawd that nods back, and a power line lights one pylon per
// whispered "bigger". Then the build (181.9): the Powers-of-Ten pull-back again, faster each bar, dune -> desert ->
// continent at night -> a dark globe with a straight line of lights across it, everything shaking, white flash.
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { HARD } = SL;
  const END = barT(103), BUILD = barT(98);
  const SKY = '#131735', SAND_N = '#5A4B6C', SAND_LT = '#8C7590', DUNE = '#3C3253', SIL = '#0C0F27', OCEAN = '#10163A', LAMP = '#FFE7B0';
  const HZ = 540, GIANT = mixCol(PAL.clay, '#131735', .5);                                           // the horizon of the dune world (the L0 frame)

  // ---------------- sky: a fixed starfield in screen space (the stars are infinitely far, so they never zoom) ----------------
  const STARS = Array.from({ length: 170 }, (_, i) => ({ x: hash(i * 3.17 + .1) * W, y: hash(i * 7.31 + 2.3) * H, r: .7 + 2.4 * Math.pow(hash(i * 5.13 + 4.1), 4), ph: hash(i * 9.7 + .4) }));
  function sky(t) {
    paint(rectPts(-80, -80, W + 160, H + 160), { wash: SKY, washOp: 255, fill: PAL.indigo, fillOp: 70, bleed: .25, tex: .5, ink: null });
    paint(ellPts(1050, 300, 1300, 190, 30, 30, -.32), { fill: PAL.violet, fillOp: 38, bleed: .4, tex: .7, ink: null });   // milky way
    for (const s of STARS) {
      const tw = .65 + .35 * Math.sin(t * (1.3 + s.ph * 2) + s.ph * TAU);
      if (s.r > 2.2) {
        paint(ellPts(s.x, s.y, s.r * 3.2, s.r * 3.2, 10), { fill: PAL.cream, fillOp: 35, bleed: .2, ink: null });
        paint(starPts(s.x, s.y, s.r * 2.3 * tw, .3, 4), { wash: PAL.cream, washOp: 255, ink: null });
      } else paint(ellPts(s.x, s.y, s.r, s.r, 6), { wash: PAL.cream, washOp: 110 + 130 * tw, ink: null });
    }
  }
  const moon = () => {                                      // low on the left, so shadows fall to the right
    paint(ellPts(-90, 330, 150, 150, 24, 4), { fill: PAL.cream, fillOp: 40, bleed: .35, ink: null });
    paint(ellPts(-90, 330, 52, 52, 22, 1), { wash: PAL.cream, washOp: 255, fill: PAL.ochre, fillOp: 30, tex: .5, ink: PAL.ink, sw: .7 });
    paint(ellPts(-78, 318, 10, 8, 10), { wash: soft(PAL.ochre, .6), ink: null });
  };

  // ---------------- the dune world (L0, a 1920x1080 frame, horizon at y 540) ----------------
  const CREST = [[-400, 690], [-100, 672], [150, 655], [330, 643], [470, 637], [600, 641], [760, 662], [950, 708], [1100, 790], [1200, 900], [1260, 1400]];
  const crestY = x => { for (let i = 1; i < CREST.length; i++) if (x <= CREST[i][0]) { const [a, b] = [CREST[i - 1], CREST[i]]; return lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0])); } return 1400; };
  const RX = 575, CX = 360, RS = 15, CU = 21;              // where the Researcher and Clawd sit, and their sizes
  function groundW() {                                      // the desert floor for the dune-world shots (the globe does this in the build)
    atmo(); paint(rectPts(-3000, HZ, W + 6000, 3000, 0), { wash: SAND_N, washOp: 255, ink: null });
  }
  // the air glow over the horizon (the planet's limb in the build): two thin washes
  const atmo = (cx = 960, cy = HZ + 1e5, R = 1e5, g = 46) => { for (const k of [1, .45]) paint(planetPts(cx, cy, R + g * k), { wash: PAL.sky, washOp: 34, ink: null }); };
  function L0(s = 1) {
    // far ripples and the dune; all filled shapes, so it can shrink. Pulling back, the dune body melts into the desert
    // (colour and opacity), so its big flat edges never cut the desert rows below as hard seams; the starlit crest stays.
    const fade = seg(s, .97, .5), dk = mixCol(DUNE, SAND_N, fade), dOp = 255 * (1 - fade);
    for (let i = 0; i < 7; i++) {
      const y = 552 + 26 * i + 9 * i * i, x = 960 + (i % 2 ? 1 : -1) * (180 + 260 * hash(i + 3)), w = (y - 540) * 4.5 + 60;
      paint(ellPts(x, y, w, (y - 540) * .14 + 2, 20, 0), { wash: i % 2 ? SAND_LT : DUNE, washOp: 90, ink: null });
    }
    if (dOp > 2) {
      if (s < .95) paint([[-1400, 700], [-380, 690], [-380, 2600], [-1400, 2600]], { wash: dk, washOp: dOp, ink: null });   // the dune runs on past the frame
      paint([[-400, 2600], ...CREST, [1500, 2600]], { wash: dk, washOp: dOp, fill: PAL.violet, fillOp: 30 * (1 - fade), tex: .6, ink: null, curv: .4 });
    }
    const rim = []; for (const [x, y] of CREST.slice(0, 9)) rim.push([x, y - 1]); for (const [x, y] of CREST.slice(0, 9).reverse()) rim.push([x, y + 14 + (x > 700 ? (x - 700) * .02 : 0)]);
    paint(rim, { wash: SAND_LT, washOp: 200, ink: null, curv: .4 });                                 // starlit crest
    if (s > .4) for (let i = 0; i < 5; i++) paint(ellPts(150 + i * 170, 760 + 60 * hash(i + 9), 90, 9, 12, 2, -.06), { wash: SAND_LT, washOp: 70, ink: null }); // wind ripples
  }

  // ---------------- the power line: pylons on a straight ray from the horizon point, self-similar under the zoom ----------------
  // Lamp j sits D_j = 540*10^(-j/6) below the horizon (6 per decade, in L0 units), base at (960+D, 540+D), top 0.42 D up.
  // Pylon frames exist for j >= 0 (the dune's own line); j < 0 are the bigger world's lights that slide in as we pull back.
  const DJ = j => 540 * Math.pow(10, -j / 6);
  const pylon = (bx, by, h) => {
    const sw = clamp(h / 150, .3, 1.3), c = PAL.ink;
    inkLine([[bx - .17 * h, by], [bx - .04 * h, by - h]], sw, c, 'inkfine', 0);
    inkLine([[bx + .17 * h, by], [bx + .04 * h, by - h]], sw, c, 'inkfine', 0);
    inkLine([[bx - .3 * h, by - .8 * h], [bx + .3 * h, by - .8 * h]], sw, c, 'inkfine', 0);
    if (h > 40) {
      inkLine([[bx - .2 * h, by - .62 * h], [bx + .2 * h, by - .62 * h]], sw * .8, c, 'inkfine', 0);
      inkLine([[bx - .14 * h, by - .05 * h], [bx + .1 * h, by - .45 * h]], sw * .6, c, 'inkfine', 0);
      inkLine([[bx + .14 * h, by - .05 * h], [bx - .1 * h, by - .45 * h]], sw * .6, c, 'inkfine', 0);
      for (const k of [-1, 1]) paint(rectPts(bx + k * .29 * h - .015 * h, by - .8 * h, .03 * h, .07 * h, 0), { wash: PAL.ink, ink: null });   // insulators
    }
  };
  // litAt(j): when lamp j comes on. s0: scale of the L0 frame about (960,540). inside(x, y): clip to the planet.
  function powerLine(t, s0, litAt, inside = () => true) {
    const j0 = Math.ceil(-6 * Math.log10(1700 / (540 * s0))), j1 = Math.floor(-6 * Math.log10(1.4 / (540 * s0)));
    const P = [];
    for (let j = j0; j <= j1; j++) {
      const d = s0 * DJ(j), bx = 960 + d, by = 540 + d, top = [bx, by - .42 * d];
      if (!inside(top[0], top[1])) continue;
      P.push({ j, d, bx, by, top, age: t - litAt(j) });
    }
    // the cable through the lit tops: the Line, dead straight
    const lit = P.filter(p => p.age >= 0);
    if (lit.length > 1) {
      const far = lit[lit.length - 1].top, near = lit[0].top, w = clamp(near[0] - 960, 0, 1e5) * .02 + 2;
      paint([[far[0], far[1] - 1], [near[0], near[1] - w], [near[0], near[1] + w]], { wash: PAL.clayLt, washOp: 70, ink: null });
      inkLine([far, near], 1.8, PAL.clay, 'ink', 0);
    }
    for (const p of P) {
      const h = .42 * p.d;
      if (p.j >= 0 && h > 7) pylon(p.bx, p.by, h);
      const r = clamp(.06 * p.d, 1.6, 34);
      if (p.age < 0) { if (h > 7) paint(ellPts(p.top[0], p.top[1], r * .5, r * .5, 8), { wash: PAL.ink, ink: null }); continue; }
      const pop = backOut(clamp(p.age / .25)), fl = Math.exp(-p.age * 5);
      paint(ellPts(p.top[0], p.top[1], r * (3 + 4 * fl) * pop, r * (3 + 4 * fl) * pop, 14), { wash: PAL.clay, washOp: 70, ink: null });
      paint(ellPts(p.top[0], p.top[1], r * 1.9 * pop, r * 1.9 * pop, 12), { wash: LAMP, washOp: 110, ink: null });
      paint(ellPts(p.top[0], p.top[1], r * pop, r * pop, 10), { wash: LAMP, washOp: 255, ink: null });
    }
  }
  // the whispers: one lamp every two beats from 175.8, near to far; the rest race to the horizon on the build downbeat
  const WHISPER = j => bt(375 + 2 * j);
  const litAt = j => j < 0 ? -1e9 : j < 7 ? WHISPER(j) : BUILD + Math.min(j - 7, 12) * .05;

  // ---------------- the constellation: stars that slide onto the ruler's line ----------------
  // The loss line: it falls left to right (the same slope as the power cable, so sky and earth rhyme). It runs from the
  // top-left of the sky down to the Researcher's ruler, which he holds up at arm's length and sights along.
  const TH = .52, DIR = [Math.cos(TH), Math.sin(TH)];        // the line falls down and to the right
  const handAt = (x, y, s, a, side) => [x + side * (1.75 * s + 3.2 * s * Math.cos(a)), y - 7.6 * s - 3.2 * s * Math.sin(a)];   // cast.js arm geometry
  const A_W = .9, CA = handAt(RX, crestY(RX) + 1.1 * RS, RS, A_W, 1);   // the ruler hand at arm's length (wide shots)
  const onLine = k => [CA[0] + DIR[0] * k, CA[1] + DIR[1] * k];
  const CON = Array.from({ length: 9 }, (_, i) => {
    const k = -400 - i * 72 - 20 * hash(i + 50), [tx, ty] = onLine(k);
    return { tx, ty, sx: tx + (hash(i + 7) - .5) * 260, sy: Math.min(ty + (hash(i + 13) - .5) * 220, 470), r: 7 + 5 * hash(i + 21), at: .5 + i * .24 };
  });
  const conTop = onLine(-1700), conLow = onLine(-128);      // the inked line: from off the top-left down to just short of the ruler
  // gather 0..1 pulls the stars onto the line; draw 0..1 inks the line downhill between them; glow 0..1 turns it clay
  function constellation(t, gather, draw, glow, o = {}) {
    // stagger so even the last star (at 2.42) lands on the line by gather = 1
    const pts = CON.map((c, i) => { const k = ease(clamp((gather - c.at * .8 / 3) * 3)); return [lerp(c.sx, c.tx, k), lerp(c.sy, c.ty, k), c.r, k]; });
    if (draw > 0) {
      const lo = o.ruler ? conLow : [CON[0].tx, CON[0].ty];   // down to the ruler while he holds it, else to the lowest star
      const a = conTop, b = [lerp(a[0], lo[0], draw), lerp(a[1], lo[1], draw)];
      if (glow > 0) for (const [w, op] of [[16, 40], [7, 80]]) paint([[a[0] - DIR[1] * w, a[1] + DIR[0] * w], [b[0] - DIR[1] * w, b[1] + DIR[0] * w], [b[0] + DIR[1] * w, b[1] - DIR[0] * w], [a[0] + DIR[1] * w, a[1] - DIR[0] * w]],
        { wash: PAL.clayLt, washOp: op * glow, ink: null });
      inkLine([a, b], 1 + 2.4 * glow, mixCol(PAL.cream, PAL.clay, glow), 'ink', 0);
    }
    pts.forEach(([x, y, r, k], i) => {
      const tw = 1 + .25 * Math.sin(t * 3 + i * 1.7) + (o.flare ? o.flare(x) : 0);
      paint(ellPts(x, y, r * 2.4 * tw, r * 2.4 * tw, 12), { fill: k > .98 && glow > 0 ? PAL.clayLt : PAL.cream, fillOp: 60, bleed: .3, ink: null });
      paint(starPts(x, y, r * 1.5 * tw, .32, 4), { wash: PAL.cream, washOp: 255, ink: null });
    });
  }

  // ---------------- the two of them on the crest ----------------
  // the ruler, drawn in world space over the face (he sights along it): from the hand up the line toward the stars
  const ruler = (hx, hy, s) => {
    const sw = clamp(s / 13, .45, 2.2);
    push(); translate(hx, hy); rotate(TH + Math.PI);
    paint(rectPts(-2.4 * s, -.38 * s, 9.5 * s, .76 * s, 0), { wash: '#E9C98A', washOp: 255, ink: PAL.ink, sw: sw * .7 });
    for (let i = 0; i < 12; i++) inkLine([[-2.1 * s + i * .78 * s, -.38 * s], [-2.1 * s + i * .78 * s, (i % 2 ? -.12 : .05) * s]], sw * .4, PAL.ink, 'inkfine', 0);
    paint(ellPts(0, -.1 * s, .5 * s, .42 * s, 12), { wash: '#F2C9A8', ink: PAL.ink, sw: sw * .6 });      // the fingers over it
    pop();
  };
  function researcherAt(x, s, o = {}) { const y = crestY(x); researcher(x, y + 1.1 * s, s, { sit: true, noShadow: true, ...o }); }
  function clawdAt(x, u, o = {}) { clawd(x, crestY(x) + 1, u, { draw: HARD, noShadow: true, ...o }); }

  // ---------------- 157.53 - 160.8: a lone dune at night; Clawd points out a star ----------------
  function dune(t, lt) {
    sky(t);
    camBegin(lerp(660, 690, ease(lt / 3.3)), 460, lerp(1.45, 1.6, ease(lt / 3.3)));
    moon(); groundW(); L0(); powerLine(t, 1, () => 1e9);
    const point = ease(seg(t, 158.95, 159.3)), flare = Math.exp(-Math.max(0, t - 159.25) * 2.5) * (t > 159.25);
    paint(starPts(880, 250, 18 + 40 * flare, .2, 4), { wash: PAL.cream, washOp: 255, ink: null });
    paint(ellPts(880, 250, 30 + 60 * flare, 30 + 60 * flare, 14), { fill: PAL.cream, fillOp: 70, bleed: .3, ink: null });
    researcherAt(RX, RS, { eyes: 'look', lookX: .6 * point, lookY: -1, aL: -1.0, aR: -1.0 });
    clawdAt(CX, CU, { eyes: 'look', lookX: .5 * point, lookY: -1, aL: .1, aR: lerp(.1, 1.3, point), mouth: point > .5 ? 'o' : 'smile', dy: -.4 * Math.sin(lt * 2) ** 2 });
    camEnd();
  }

  // ---------------- 160.8 - 164.3: the ruler at arm's length; the stars line up along it ----------------
  function rulerShot(t, lt) {
    sky(t);
    camBegin(lerp(480, 440, ease(lt / 3.5)), lerp(380, 350, ease(lt / 3.5)), lerp(1.22, 1.12, ease(lt / 3.5)));
    moon(); groundW(); L0(); powerLine(t, 1, () => 1e9);
    const raise = backOut(seg(lt, .1, .55)), a = lerp(-1.1, A_W, raise);
    constellation(t, seg(lt, .4, 2.6), seg(t, 163.3, 164.1), 0, { ruler: true });
    researcherAt(RX, RS, { eyes: 'look', lookX: -.7, lookY: -1, aR: a, aL: -1, mouth: 'o' });
    if (raise > .2) ruler(...handAt(RX, crestY(RX) + 1.1 * RS, RS, a, 1), RS);
    clawdAt(CX, CU, { eyes: 'look', lookX: -.2, lookY: -1, aL: .2, aR: .2, mouth: lt > 2.3 ? 'O' : 'o' });
    camEnd();
  }

  // ---------------- 164.3 - 166.9: the line glows; Clawd's eyes go starry; a shooting star runs it off the sky ----------------
  function prophecy(t, lt) {
    sky(t);
    // the camera puts the world line exactly through the close-up ruler hand, so the ruler still lies on it
    const k = ease(lt / 2.6), Z = 1.2, PH = handAt(PRX, PRY, PRS, PA, -1), Q = onLine(lerp(-60, -90, k));
    camBegin(Q[0] - (PH[0] - 960) / Z, Q[1] - (PH[1] - 540) / Z, Z);
    const shoot = seg(lt, .5, 1.7), sk = lerp(-1500, -60, shoot * shoot * .6 + shoot * .4), [sx, sy] = onLine(sk);   // it runs downhill to the ruler
    constellation(t, 1, 1, ease(seg(lt, 0, .4)), { ruler: true, flare: x => .9 * Math.exp(-Math.abs(x - sx) / 60) });
    if (shoot > 0 && shoot < 1) {
      const L = 420, tx = sx - DIR[0] * L, ty = sy - DIR[1] * L;
      paint([[sx + DIR[1] * 18, sy - DIR[0] * 18], [tx, ty], [sx - DIR[1] * 18, sy + DIR[0] * 18]], { wash: PAL.clayLt, washOp: 120, ink: null });
      paint([[sx + DIR[1] * 7, sy - DIR[0] * 7], [tx + DIR[0] * L * .4, ty + DIR[1] * L * .4], [sx - DIR[1] * 7, sy + DIR[0] * 7]], { wash: PAL.cream, washOp: 255, ink: null });
      paint(ellPts(sx, sy, 34, 34, 14), { wash: PAL.cream, washOp: 90, ink: null });
      paint(starPts(sx, sy, 40, .25, 4, -Math.PI / 2 + t * 4), { wash: PAL.cream, washOp: 255, ink: null });
    }
    camEnd();
    // close on the two faces, low in frame, tipped back to look up: Clawd left, the Researcher right with the ruler raised
    paint([[-60, 900], [600, 862], [1200, 850], [1980, 880], [1980, 1140], [-60, 1140]], { wash: DUNE, washOp: 255, fill: PAL.violet, fillOp: 30, tex: .6, ink: null, curv: .5 });
    paint([[-60, 898], [600, 860], [1200, 848], [1980, 878], [1980, 892], [1200, 862], [600, 875], [-60, 912]], { wash: SAND_LT, washOp: 200, ink: null, curv: .5 });
    const m = mood(t, [[164.3, 'look'], [164.75, 'spark', 'spark']]);
    clawd(560, 884, 40, { draw: HARD, ...m, lookX: -.5, lookY: -1, mouth: t > 164.8 ? 'O' : 'o', aL: .2 + .5 * seg(lt, .6, 1), aR: .2 + .5 * seg(lt, .6, 1), rot: .05, dy: -.25 * m.take, noShadow: true });
    researcher(PRX, PRY, PRS, { eyes: t > 164.95 ? 'star' : 'look', lookX: -.7, lookY: -1, aL: PA, aR: -1.1, mouth: t > 164.95 ? 'O' : 'o', noShadow: true });
    ruler(...PH, PRS);
  }
  const PRX = 1400, PRY = 990, PRS = 30, PA = 1.0;            // the close-up Researcher and his raised (left) arm

  // ---------------- the planet-sized constellation Clawd: a dark silhouette in the sky, stars on its corners ----------------
  function skyClawd(x, y, u, o = {}) {
    const k = o.k ?? 1; if (k < .02) return;
    const line = mixCol(PAL.cream, SKY, .35), star = (px, py, r) => { paint(ellPts(px, py, r * 2.6, r * 2.6, 10), { fill: PAL.cream, fillOp: 50 * k, bleed: .3, ink: null }); paint(starPts(px, py, r * 1.6, .3, 4), { wash: PAL.cream, washOp: 255 * k, ink: null }); };
    push(); translate(x, y + (o.dy || 0) * u); rotate(o.rot || 0);
    const arms = [[-1, o.aL ?? .2], [1, o.aR ?? .2]], tips = [];
    for (const [side, a] of arms) {
      push(); translate(side * 4.9 * u, -4.5 * u); rotate(side < 0 ? a : -a);
      paint(rectPts(side < 0 ? -2.2 * u : 0, -.5 * u, 2.2 * u, u, 0), { wash: GIANT, washOp: 200 * k, ink: null });
      pop();
      tips.push([side * 4.9 * u + side * 2.2 * u * Math.cos(a), -4.5 * u - 2.2 * u * Math.sin(a), side * 4.9 * u, -4.5 * u]);
    }
    for (const lx of [-4, -2, 1, 3]) paint(rectPts(lx * u, -2.4 * u, u, 2.4 * u, 0), { wash: GIANT, washOp: 200 * k, ink: null });
    paint(rectPts(-5 * u, -8 * u, 10 * u, 6 * u, 0), { wash: GIANT, washOp: 200 * k, fill: PAL.clay, fillOp: 50 * k, bleed: .1, tex: .6, ink: null });
    paint(ellPts(-1.6 * u, -6.4 * u, 3.4 * u, 1.5 * u, 18, 0, -.08), { fill: PAL.clayLt, fillOp: 60 * k, bleed: .25, tex: .8, ink: null });
    for (let i = 0; i < 16; i++) paint(ellPts((hash(i + 60) - .5) * 9.4 * u, -7.7 * u + hash(i + 70) * 5.4 * u, 2.2, 2.2, 6), { wash: PAL.cream, washOp: 200 * k, ink: null });
    // a hard hat of starlight: dome, ridge, brim
    const dome = []; for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; dome.push([Math.cos(a) * 3.9 * u, -8.5 * u + Math.sin(a) * 3.9 * u]); }
    paint(dome, { wash: mixCol(SL.HAT, SKY, .25), washOp: 210 * k, fill: SL.HAT_LT, fillOp: 50 * k, bleed: .1, tex: .5, ink: null });
    paint([[-6 * u, -8.75 * u], [6 * u, -8.75 * u], [5.6 * u, -7.95 * u], [-5.6 * u, -7.95 * u]], { wash: mixCol(SL.HAT, SKY, .35), washOp: 210 * k, ink: null });
    if (k > .3) {
      inkLine([...dome, [-3.9 * u, -8.5 * u]], .9, mixCol(PAL.cream, SKY, .35), 'inkfine', 0);
      [[-3.9, -8.5], [0, -12.4], [3.9, -8.5], [-6, -8.75], [6, -8.75]].forEach(([a, b], i) => star(a * u, b * u, 7 + 3 * hash(i + 80)));
      const V = [[-5, -8], [5, -8], [5, -2], [-5, -2], [-5, -8]].map(([a, b]) => [a * u, b * u]);
      inkLine(V, 1, line, 'inkfine', 0);
      for (const tp of tips) inkLine([[tp[2], tp[3]], [tp[0], tp[1]]], .9, line, 'inkfine', 0);
      V.slice(0, 4).forEach(([a, b], i) => star(a, b, 9 + 3 * hash(i)));
      tips.forEach(tp => star(tp[0], tp[1], 10));
      // eyes: two tall slits of starlight
      const lx = (o.lookX || 0) * .5 * u, ly = (o.lookY || 0) * .4 * u, blink = o.blink || 0;
      for (const ex of [-3, 2]) {
        paint(rectPts(ex * u + lx, -7 * u + ly + blink * .9 * u, u, 2 * u * (1 - blink * .9), 0), { wash: SIL, washOp: 255 * k, ink: null });
        if (!blink) paint(ellPts(ex * u + lx + .32 * u, -7 * u + ly + .45 * u, .17 * u, .24 * u, 10), { wash: PAL.cream, washOp: 255 * k, ink: null });
      }
    }
    pop();
  }
  // Clawd's shadow on the sand: the silhouette laid flat and stretched away from the moon (local x across, h up, in u)
  const SHAPE = [[-5, 8], [5, 8], [5, 2], [4, 2], [4, 0], [3, 0], [3, 2], [2, 2], [2, 0], [1, 0], [1, 2], [-1, 2], [-1, 0], [-2, 0], [-2, 2], [-3, 2], [-3, 0], [-4, 0], [-4, 2], [-5, 2]];
  // ang: direction from the feet to the head (0 = lying along the sand to the right, -PI/2 = standing up); sq squashes the width
  function shadow(fx, fy, u, ang, sq, op) {
    if (op < .02) return;
    const hd = [Math.cos(ang), Math.sin(ang)], wd = [-Math.sin(ang), Math.cos(ang)];
    const map = ([x, h]) => [fx + h * u * hd[0] + x * u * sq * wd[0], fy + h * u * hd[1] + x * u * sq * wd[1]];
    paint(SHAPE.map(map), { wash: '#1E1832', washOp: 200 * op, ink: null });
    for (const sd of [-1, 1]) paint([[sd * 5, 4], [sd * 7.2, 3.2], [sd * 7.2, 4.8], [sd * 5, 5.2]].map(map), { wash: '#1E1832', washOp: 200 * op, ink: null });
    paint([[-6, 8], [-3.9, 8.5], [-3.4, 10.4], [-1.8, 11.9], [0, 12.4], [1.8, 11.9], [3.4, 10.4], [3.9, 8.5], [6, 8], [6, 7.6], [-6, 7.6]].map(map), { wash: '#1E1832', washOp: 200 * op, ink: null });
  }

  const GX = 1320, GY = 552, GU = 56;                       // the giant's feet, standing on the horizon
  // ---------------- 166.9 - 171.0: the shadow stretches across the dune and stands up as a planet-sized Clawd ----------------
  function shadowShot(t, lt) {
    sky(t);
    camBegin(lerp(820, 900, ease(lt / 4.1)), lerp(470, 400, ease(lt / 4.1)), lerp(1.08, .93, ease(lt / 4.1)));
    moon();
    constellation(t, 1, 1, .7);
    const rise = ease(seg(t, 169.7, 170.4));
    atmo();
    skyClawd(GX, GY, GU, { k: rise, lookX: -.6, lookY: .4, aL: .2, aR: .2 });
    paint(rectPts(-3000, HZ, W + 6000, 3000, 0), { wash: SAND_N, washOp: 255, ink: null });
    L0(); powerLine(t, 1, () => 1e9);
    // it grows along the sand, then swings up off the ground and stands on the horizon at planet size
    const grow = easeIn(seg(t, 167.0, 168.5)), up = ease(seg(t, 168.5, 169.8)), F0 = [CX + 40, crestY(CX) + 2];
    shadow(lerp(F0[0], GX, up), lerp(F0[1], GY, up), lerp(CU * (1 + 1.6 * grow), GU, up), lerp(.1, -Math.PI / 2, up), lerp(.4, 1, up), 1 - ease(seg(t, 169.9, 170.5)));
    researcherAt(RX, RS, { eyes: 'look', lookX: 1, lookY: lerp(0, -1, rise), aR: -1, aL: -1, brows: rise > .3 ? 'up' : null });
    const m = mood(t, [[166.9, 'look'], [168.3, 'look', '!'], [169.6, 'look', '?']]);
    clawdAt(CX, CU, { ...m, lookX: 1, lookY: lerp(.7, -1, rise), aL: .2, aR: .2, mouth: 'o' });
    camEnd();
  }

  // ---------------- 171.0 - 175.3: the giant looks down at the small one, nods, and they wave together ----------------
  function nod(t, lt) {
    sky(t);
    camBegin(lerp(900, 880, ease(lt / 4.3)), lerp(400, 420, ease(lt / 4.3)), lerp(.93, .97, ease(lt / 4.3)));
    moon();
    constellation(t, 1, 1, .7);
    atmo();
    const look = ease(seg(t, 171.2, 171.7)), nd = t > 173.4 && t < 174.3 ? Math.sin(seg(t, 173.4, 174.3) * Math.PI * 2) ** 2 : 0;
    const wave = seg(t, 174.3, 174.55), wv = .8 + .4 * Math.sin((t - 174.3) * TAU * 2.6);       // Clawd arms hide behind the body above ~1.1 rad
    skyClawd(GX, GY, GU, { lookX: -1 * look, lookY: lerp(.4, 1, look), rot: -.07 * nd, dy: .35 * nd, aL: lerp(.2, wv, wave), aR: .2, blink: t > 172.6 && t < 172.75 ? 1 : 0 });
    paint(rectPts(-3000, HZ, W + 6000, 3000, 0), { wash: SAND_N, washOp: 255, ink: null });
    L0(); powerLine(t, 1, () => 1e9);
    researcherAt(RX, RS, { eyes: t > 173.6 ? 'heart' : 'wide', lookX: 1, lookY: -1, aR: -1, aL: -1, mouth: t > 173.6 ? 'smile' : 'O' });
    const m = mood(t, [[171, 'look'], [173.65, 'happy']]);
    clawdAt(CX, CU, { ...m, lookX: 1, lookY: -1, aL: .2, aR: lerp(.2, wv, wave), dy: -.6 * nd, mouth: t > 173.65 ? 'smile' : 'o' });
    camEnd();
  }

  // ---------------- 175.4 - 181.88: whispered "bigger": the pylons light one by one, near to far ----------------
  function pylonsShot(t, lt, dur) {
    sky(t);
    const k = ease(lt / dur);
    camBegin(lerp(900, 960, k), lerp(580, 540, k), lerp(1.12, 1, k));
    moon(); groundW();
    constellation(t, 1, 1, .45);
    L0(); powerLine(t, 1, litAt);
    let last = -9; for (let j = 0; j < 7; j++) if (t >= WHISPER(j)) last = WHISPER(j);
    const hop = Math.exp(-(t - last) * 7) * (t - last < 1);
    researcherAt(RX, RS, { eyes: 'look', lookX: 1, lookY: .3, aR: -1, aL: -1, mouth: 'smile' });
    clawdAt(CX, CU, { eyes: 'look', lookX: 1, lookY: .3, dy: -1.6 * hop, sq: -.1 * hop, aL: .2 + .8 * hop, aR: .2 + .8 * hop, mouth: hop > .3 ? 'O' : 'smile' });
    camEnd();
  }

  // ---------------- 181.88 - 191.27: the build. Powers of Ten again, faster each bar, out to the globe ----------------
  // Every level is drawn in its own 1920x1080 frame; the child sits at the centre at 1/10 (the frames share the horizon
  // point 960,540, which is the top of the planet). The planet itself is one circle in screen space: centre
  // (960, 540 + 300 s3), radius 300 s3, where s3 = 10^(3-z) is the globe level's scale, so at z = 0 it is a flat horizon.
  const ZK = [[BUILD, 0], [barT(99) - .05, .12], [barT(99) + .85, 1], [barT(100) - .05, 1.07], [barT(100) + .55, 2], [barT(101) - .05, 2.05], [barT(101) + .4, 3], [END, 3.08]];
  const clampDisc = (pts, cx, cy, R) => pts.map(([x, y]) => { const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy); return d > R * .985 ? [cx + dx / d * R * .985, cy + dy / d * R * .985] : [x, y]; });
  const blob = (cx, cy, rx, ry, seed, n = 22) => { const p = []; for (let i = 0; i < n; i++) { const a = i / n * TAU, r = 1 + .22 * (hash(seed + i * 1.3) - .5) + .12 * Math.sin(a * 3 + seed); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p; };
  const town = (x, y, n, r, seed, s) => {                   // a cluster of lit windows with one warm glow over it
    paint(ellPts(x, y, r * 7, r * 3, 12), { fill: PAL.ochre, fillOp: 80, bleed: .3, ink: null });
    if (s * r < .9) return;
    for (let i = 0; i < n; i++) paint(ellPts(x + (hash(seed + i) - .5) * r * 9, y + (hash(seed + i * 2.1) - .5) * r * 3, r * .45, r * .45, 6), { wash: LAMP, washOp: 255, ink: null });
  };
  const LV = [];
  LV[0] = (s, t) => {                                       // the dune, the two of them and their constellation
    if (s > .2) constellation(t, 1, 1, .45 * seg(s, .2, .6));
    L0(s);
    const up = ease(seg(t, BUILD - .05, BUILD + .25));
    if (s > .45) {
      researcherAt(RX, RS, { eyes: 'look', lookX: 1, lookY: -.3, aR: lerp(-1, 1.3, up), aL: lerp(-1, 1.3, up), mouth: up > .5 ? 'O' : 'smile' });
      clawdAt(CX, CU, { eyes: up > .5 ? 'spark' : 'look', lookX: 1, aL: lerp(.2, 1.5, up), aR: lerp(.2, 1.5, up), dy: -1.2 * pulse2(t, 5) * up, mouth: up > .5 ? 'O' : 'smile' });
    } else if (s > .05) {                                   // too small for faces: two dabs of colour on the crest
      paint(rectPts(CX - 105, crestY(CX) - 168, 210, 126, 0), { wash: PAL.clay, washOp: 255, ink: null });
      paint(rectPts(CX - 80, crestY(CX) - 225, 160, 60, 0), { wash: SL.HAT, washOp: 255, ink: null });
      paint(rectPts(RX - 36, crestY(RX) - 190, 72, 190, 0), { wash: PAL.cream, washOp: 255, ink: null });
    }
  };
  LV[1] = (s, t) => {                                       // the desert at night: dune rows in perspective, sleeping towns
    for (let i = 0; i < 22; i++) {
      const y = 556 + 520 * Math.pow(hash(i * 1.7 + .3), 1.5), x = hash(i * 4.9 + 1.1) * 2200 - 140, w = (y - 540) * 2.6 + 30;
      if (Math.abs(x - 960) < 170 + w && y < 660) continue;
      paint(ellPts(x, y, w, (y - 540) * .1 + 2, 18, 0), { wash: i % 3 ? DUNE : SAND_LT, washOp: 110, ink: null });
    }
    [[360, 610], [1560, 590], [620, 800], [1380, 730], [230, 940], [1720, 900], [1050, 980], [80, 700]].forEach(([x, y], i) => town(x, y, 7, 1.2 + (y - 540) * .025, i * 9, s));
  };
  LV[2] = (s, t) => {                                       // a continent at night from orbit: dark seas, city lights, cloud
    const R = 3000, cx = 960, cy = 540 + R;
    for (const [x, y, rx, ry, sd] of [[60, 860, 560, 420, 3], [1900, 800, 520, 330, 8], [1500, 1080, 300, 140, 13], [380, 610, 200, 50, 19]])
      paint(clampDisc(blob(x, y, rx, ry, sd), cx, cy, R), { wash: OCEAN, washOp: 255, fill: PAL.indigo, fillOp: 50, tex: .5, ink: null });
    for (let i = 0; i < 16; i++) {
      const x = 200 + hash(i * 2.7) * 1520, y = 600 + hash(i * 6.1 + 2) * 440;
      if (Math.abs(x - 960) < 180 && y < 660) continue;
      town(x, y, 5, .9 + (y - 540) * .006, i * 7 + 100, s);
    }
    for (let i = 0; i < 4; i++) paint(ellPts(300 + i * 430, 640 + 120 * hash(i + 40), 160, 18, 14, 0, -.1), { fill: PAL.cream, fillOp: 26, bleed: .3, ink: null });
  };
  LV[3] = (s, t) => {                                       // the globe: oceans, night-side shading, a few cities
    const cx = 960, cy = 840, R = 300;
    for (const [x, y, rx, ry, sd] of [[700, 930, 220, 250, 5], [1190, 1020, 210, 150, 11], [1235, 700, 70, 90, 17], [820, 650, 60, 40, 23]])
      paint(clampDisc(blob(x, y, rx, ry, sd), cx, cy, R), { wash: OCEAN, washOp: 255, fill: PAL.indigo, fillOp: 50, tex: .5, ink: null });
    [[1100, 780], [1040, 900], [880, 760], [1180, 860]].forEach(([x, y], i) => town(x, y, 3, 1.2, i * 5 + 300, s));
    paint(clampDisc(ellPts(1010, 990, 330, 260, 30), cx, cy, R), { fill: PAL.ink, fillOp: 70, bleed: .3, ink: null });
  };
  function planetPts(cx, cy, R) {
    if (R < 1600) return ellPts(cx, cy, R, R, 72);
    const a = Math.asin(Math.min(1, 1500 / R)), p = [];
    for (let i = 0; i <= 48; i++) { const q = -Math.PI / 2 - a + 2 * a * i / 48; p.push([cx + Math.cos(q) * R, cy + Math.sin(q) * R]); }
    p.push([cx + 1500, 4000], [cx - 1500, 4000]); return p;
  }
  function build(t, lt) {
    const z = kf(t, ZK, ease), s3 = Math.pow(10, 3 - z), s0 = Math.pow(10, -z);
    const cx = 960, cy = 540 + 300 * s3, R = 300 * s3;
    const pan = 300 * s3 * ease(seg(t, barT(101) + .1, barT(102) + .4));
    const amp = lerp(1, 18, easeIn(seg(t, BUILD, END))) * (.55 + .45 * pulse2(t, 3));
    const [sx, sy] = shakeXY(t, amp), bump = 1 + .03 * pulse(t, 5) * seg(t, BUILD, END);
    sky(t);
    push(); translate(960, 540); scale(bump); translate(-960 + sx, -540 + sy - pan);
    // atmosphere, then the planet's night side (its land colour darkens as we leave the desert)
    const g = Math.min(46, 16 * s3);
    atmo(cx, cy, R, g);
    paint(planetPts(cx, cy, R), { wash: mixCol(SAND_N, '#3C3352', seg(z, 1, 3)), washOp: 255, fill: PAL.violet, fillOp: 25, tex: .5, ink: null });
    for (let k = 3; k >= 0; k--) {
      const s = Math.pow(10, k - z);
      if (s > 10.5 || s < .03) continue;
      push(); translate(960, 540); scale(s); translate(-960, -540); LV[k](s, t); pop();
    }
    powerLine(t, s0, litAt, (x, y) => Math.hypot(x - cx, y - cy) < R - .5);
    // the sun is coming: a gold rim creeps round the globe's left limb in the last two bars
    const sun = ease(seg(t, barT(101) + .3, END));
    if (sun > .01 && R < 1600) {
      const w = 22 * sun, p = [];
      for (let i = 0; i <= 20; i++) { const q = 2.2 + 1.9 * i / 20; p.push([cx + Math.cos(q) * (R + 4), cy + Math.sin(q) * (R + 4)]); }
      for (let i = 20; i >= 0; i--) { const q = 2.2 + 1.9 * i / 20; p.push([cx + w + Math.cos(q) * R, cy + Math.sin(q) * R]); }
      paint(p, { wash: PAL.ochre, washOp: 230, fill: PAL.clay, fillOp: 60, bleed: .2, ink: null });
    }
    pop();
    flash(easeIn(seg(t, END - .45, END)), '#FFFDF6');
  }

  chapter('prophecy', 157.53, END, [[157.53, dune], [160.8, rulerShot], [164.3, prophecy], [166.9, shadowShot], [171.0, nod], [175.4, pylonsShot], [BUILD, build]]);
})();
