// c10_brownout.js: 211.89-219.39, bars 114-117, kick out. The planet from the drop, now on its night side, with Clawd
// and the Researcher standing on top of it next to a little lab hut and the master breaker. The city lights go out
// block by block on the beat, the breaker trips with a BZZT, and in the dark only Clawd's eyes and the Researcher's
// glasses show. A flashlight clicks on, finds the breaker, gets tossed to Clawd; the Researcher spits on their hands,
// jumps, hangs off the lever and rides it down. CLUNK: every light on the planet comes on at once and the camera
// snaps out to the whole lit globe (chapter 11 picks up at planet scale and keeps zooming out).
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { NIGHT, GRID, STEEL, STEEL_DK, HARD } = SL;
  const DARK = '#0B0D24', LIT = '#FFD98A', B0 = 452;               // B0 = beat number of barT(114)
  const SHOT2 = bt(B0 + 12), CLUNK = bt(B0 + 15);                   // CLUNK on the last beat, so it reads before the wipe covers it
  const TRIP = bt(B0 + 10);                                         // the breaker trips with the last light

  // ---------------- the planet: Clawd and the Researcher stand on its top ----------------
  const G = [960, 1900], R = 1250;
  const surf = x => G[1] - Math.sqrt(R * R - (x - G[0]) * (x - G[0]));
  const tilt = x => Math.asin((x - G[0]) / R);
  const onGlobe = (phi, d) => [G[0] + (R - d) * Math.sin(phi), G[1] - (R - d) * Math.cos(phi)];

  // city blocks on the night side: polar position, grid size; they die from the edges inward, one a beat
  const BLOCKS = [[-.62, 140, 4, 3], [.66, 170, 5, 3], [-.38, 330, 4, 4], [.42, 300, 4, 3], [-.82, 420, 3, 3],
                  [.2, 470, 5, 4], [-.14, 620, 4, 3], [.78, 520, 3, 3], [-.5, 720, 4, 3]]
    .map(([phi, d, n, m], i) => ({ phi, d, n, m, i }));
  [...BLOCKS].sort((a, b) => Math.abs(b.phi) * 1.4 + b.d / 900 - (Math.abs(a.phi) * 1.4 + a.d / 900))
    .forEach((b, k) => { b.die = bt(B0 + 1 + k); });
  const LINE = [];                                                  // after the CLUNK: a dead-straight line of lights
  for (let i = 0; i < 26; i++) LINE.push([lerp(80, 1840, i / 25), lerp(1180, 760, i / 25)]);

  // 0..1 how lit a block is at t (flickers just before it dies; everything flickers at the hand-off from chapter 9)
  function litOf(die, t, id) {
    if (t >= CLUNK) return 1;
    const f = Math.floor(t * 24);
    if (t < bt(B0) + .45) return hash(f * 1.3 + 2) > .45 ? 1 : .1;
    if (t < die - .28) return 1;
    if (t < die) return hash(f * 3.1 + id * 7) > .5 ? 1 : 0;
    return 0;
  }
  const litFrac = t => (BLOCKS.reduce((s, b) => s + litOf(b.die, t, b.i), 0) + litOf(TRIP, t, 99)) / (BLOCKS.length + 1);

  const STARS = []; for (let i = 0; i < 90; i++) {
    const x = -900 + 3800 * hash(i * 3.7), y = -500 + 2300 * hash(i * 5.3 + 1);
    if (Math.hypot(x - G[0], y - G[1]) > R + 90) STARS.push([x, y, 2 + 4 * hash(i + .5), i]);
  }
  const CONT = [[-.55, 260, 330, 190], [.5, 230, 300, 210], [-.1, 560, 360, 160], [.3, 470, 200, 150], [-.7, 560, 220, 260], [.75, 520, 180, 200]];

  function sky(t) {
    paint(rectPts(-1400, -1200, 4800, 4000), { wash: NIGHT, washOp: 255, fill: PAL.indigo, fillOp: 60, bleed: .2, tex: .5, ink: null });
    for (const [x, y, r, i] of STARS) paint(ellPts(x, y, r, r, 6), { wash: PAL.cream, washOp: 150 + 100 * Math.abs(wob(t, .7, hash(i))), ink: null });
  }
  function globe(t, glow) {
    paint(ellPts(G[0], G[1], R + 90, R + 90, 90), { fill: PAL.teal, fillOp: 30 + 50 * glow, bleed: .3, tex: .3, ink: null });
    paint(ellPts(G[0], G[1], R + 30, R + 30, 90), { fill: GRID, fillOp: 40 + 60 * glow, bleed: .2, tex: .3, ink: null });
    paint(ellPts(G[0], G[1], R, R, 120), { wash: '#232B5C', washOp: 255, fill: PAL.indigo, fillOp: 80, tex: .5, ink: PAL.ink, sw: 1.6 });
    CONT.forEach(([phi, d, rx, ry], i) => {
      const [x, y] = onGlobe(phi, d), p = [];
      for (let k = 0; k < 14; k++) { const a = k / 14 * TAU, w = .75 + .4 * hash(i * 20 + k); p.push([x + Math.cos(a) * rx * w, y + Math.sin(a) * ry * w]); }
      paint(p, { wash: '#2E3F5E', washOp: 255, fill: PAL.sap, fillOp: 40, tex: .5, ink: null, curv: .7 });
      paint(ellPts(x + rx * .2, y - ry * .1, rx * .35, ry * .3, 12), { fill: soft(PAL.ochre, .3), fillOp: 35, bleed: .2, ink: null });
    });
  }

  // the lab hut, left of Clawd; its windows are the last light on the planet
  const HUT = 520;
  function hut() {
    push(); translate(HUT, surf(HUT) + 6); rotate(tilt(HUT));
    paint(rectPts(-75, -95, 150, 95, 2), { wash: STEEL_DK, washOp: 255, fill: PAL.night, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.2 });
    paint([[-88, -95], [88, -95], [70, -122], [-70, -122]], { wash: STEEL, washOp: 255, ink: PAL.ink, sw: 1.1 });
    inkLine([[40, -122], [40, -160]], 1.2, PAL.ink, 'ink', 0);
    paint(ellPts(40, -166, 22, 10, 14, 0, -.5), { wash: STEEL, washOp: 255, ink: PAL.ink, sw: .9 });
    for (const wx of [-55, 10]) paint(rectPts(wx, -72, 44, 32, 1), { wash: PAL.ink, washOp: 255, ink: null });
    paint(rectPts(-12, -50, 20, 50, 1), { wash: PAL.night, washOp: 255, ink: PAL.ink, sw: .8 });
    pop();
  }
  function hutLights(k) {
    if (k < .05) return;
    push(); translate(HUT, surf(HUT) + 6); rotate(tilt(HUT));
    glow(-12, -56, 120, 80, k);
    for (const wx of [-55, 10]) paint(rectPts(wx + 3, -69, 38, 26, 1), { wash: LIT, washOp: 255 * k, fill: PAL.cream, fillOp: 90 * k, ink: null });
    pop();
  }

  // a warm pool of light: flat washes (a watercolour fill of yellow over the indigo globe reads green)
  const glow = (x, y, rx, ry, k) => {
    paint(ellPts(x, y, rx, ry, 22, 2), { wash: '#F0805A', washOp: Math.min(255, 40 * k), ink: null });
    paint(ellPts(x, y, rx * .6, ry * .6, 18, 2), { wash: '#FFA868', washOp: Math.min(255, 50 * k), ink: null });
  };
  function cityLights(t, boost = 1) {
    for (const b of BLOCKS) {
      const k = litOf(b.die, t, b.i), [x, y] = onGlobe(b.phi, b.d);
      if (k > .05) {
        push(); translate(x, y); rotate(b.phi);
        glow(0, 0, b.n * 30 + 50, b.m * 28 + 40, k * boost);
        for (let c = 0; c < b.n; c++) for (let r = 0; r < b.m; r++) {
          if (hash(b.i * 31 + c * 7 + r * 3) < .22) continue;
          paint(rectPts((c - (b.n - 1) / 2) * 30 - 6, (r - (b.m - 1) / 2) * 28 - 6, 12, 12, 0), { wash: hash(b.i + c + r * 5) > .3 ? LIT : PAL.cream, washOp: 255 * k, ink: null });
        }
        pop();
      }
      const age = t - b.die;                                        // the pop as it dies
      if (age > 0 && age < .35 && t < CLUNK) spark(x, y, age, 60 + b.m * 10);
    }
  }
  function spark(x, y, age, r) {
    const k = 1 - age / .35, s = r * (.6 + .6 * easeOut(age / .12));
    paint(starPts(x, y, s, .3, 6, age * 3), { wash: PAL.cream, washOp: 230 * k, fill: PAL.ochre, fillOp: 120 * k, ink: null });
    for (let j = 0; j < 3; j++) {
      const a = hash(Math.floor(x) + j * 9) * TAU, L = s * 1.4;
      inkLine([[x, y], [x + Math.cos(a) * L * .4 + 8, y + Math.sin(a) * L * .4], [x + Math.cos(a) * L * .6 - 8, y + Math.sin(a) * L * .6], [x + Math.cos(a) * L, y + Math.sin(a) * L]], 1.6 * k + .3, LIT, 'ink', 0);
    }
  }

  // ---------------- the master breaker: a tall steel cabinet with a big lever; ang = rod angle (rad, up = off) ----------------
  const P = [1310, 422], LEV = 220, OFF_A = .42;
  const grip = ang => [P[0] - LEV * Math.cos(ang), P[1] - LEV * Math.sin(ang)];
  function breaker(ang, on) {
    paint([[1250, 684], [1430, 684], [1430, surf(1430) + 10], [1250, surf(1250) + 10]], { wash: '#8C8A86', washOp: 255, fill: PAL.ink, fillOp: 30, tex: .5, ink: PAL.ink, sw: 1 });
    paint(rectPts(1265, 360, 150, 326, 2), { wash: STEEL, washOp: 255, fill: STEEL_DK, fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.4 });
    paint(rectPts(1280, 400, 120, 270, 2), { ink: PAL.ink, sw: .8 });                                      // door
    paint(rectPts(1265, 360, 150, 26, 0), { wash: PAL.ochre, washOp: 255, ink: null });                   // hazard band
    for (let i = 0; i < 6; i++) paint([[1265 + i * 28, 386], [1279 + i * 28, 386], [1293 + i * 28, 360], [1279 + i * 28, 360]], { wash: PAL.ink, washOp: 255, ink: null });
    paint(rectPts(1265, 360, 150, 26, 0), { ink: PAL.ink, sw: 1 });
    paint([[1352, 470], [1322, 540], [1344, 540], [1328, 600], [1376, 520], [1352, 520], [1368, 470]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .9 });   // bolt
    paint(ellPts(1390, 418, 9, 9, 12), { wash: on ? PAL.sap : '#D0383F', washOp: 255, ink: PAL.ink, sw: .7 });
    if (on) paint(ellPts(1390, 418, 26, 26, 14), { fill: PAL.sap, fillOp: 90, bleed: .3, ink: null });
    inkLine([[1300, 686], [1290, 720], [1250, 760]], 6, PAL.ink, 'ink', .5);                              // the cable into the planet
    // the lever: rod, hub, red T-grip
    const [hx, hy] = grip(ang), ca = Math.cos(ang), sa = Math.sin(ang), w = 8;
    paint([[P[0] - sa * w, P[1] + ca * w], [hx - sa * w, hy + ca * w], [hx + sa * w, hy - ca * w], [P[0] + sa * w, P[1] - ca * w]], { wash: '#B9BFCC', washOp: 255, ink: PAL.ink, sw: 1 });
    paint(ellPts(P[0], P[1], 22, 22, 16), { wash: STEEL_DK, washOp: 255, ink: PAL.ink, sw: 1.1 });
    paint(ellPts(P[0], P[1], 7, 7, 10), { wash: PAL.ink, ink: null });
    knob(ang);
  }
  const knob = ang => { const [hx, hy] = grip(ang);
    paint(ellPts(hx, hy, 24, 24, 16), { wash: '#C8324A', washOp: 255, fill: '#7A1C2B', fillOp: 70, tex: .4, ink: PAL.ink, sw: 1.1 });
    paint(ellPts(hx - 8, hy - 8, 7, 5, 10, 0, -.6), { wash: '#F08A8A', washOp: 220, ink: null }); };

  // ---------------- the cast, and their glowing bits in the dark ----------------
  const CU = 30, RS = 22;
  function clawdEyes(x, u, rot, k, lookX = 0, open = 1, big = 1) {
    if (k < .03) return;
    push(); translate(x, surf(x)); rotate(rot);
    for (const ex of [-3, 2]) {
      const cx = ex * u + .5 * u + lookX * .45 * u, h = 2 * u * open * big;
      paint(ellPts(cx, -6 * u, 1.3 * u, 1.8 * u, 14), { wash: '#F0805A', washOp: 50 * k, ink: null });
      paint(rrPts(cx - .5 * u * big, -6 * u - h / 2, u * big, Math.max(h, .2 * u), .45 * u), { wash: PAL.cream, washOp: 255 * k, ink: null });
    }
    pop();
  }
  function glasses(x, y, s, rot, k, glint = 0) {
    if (k < .03) return;
    push(); translate(x, y); rotate(rot);
    for (const side of [-1, 1]) {
      const cx = side * 1.0 * s, cy = -10.55 * s;
      paint(ellPts(cx, cy, 1.25 * s, 1.25 * s, 14), { wash: PAL.sky, washOp: 40 * k, ink: null });
      paint(ellPts(cx, cy, .86 * s, .84 * s, 18), { wash: PAL.cream, washOp: 230 * k, ink: null });
      paint(ellPts(cx, cy, .64 * s, .62 * s, 18), { wash: DARK, washOp: 255, ink: null });
      const g = -.5 + glint;                                         // a glint sliding across each lens
      paint([[cx + (g - .12) * s, cy - .45 * s], [cx + (g + .1) * s, cy - .45 * s], [cx + (g + .32) * s, cy + .3 * s], [cx + (g + .1) * s, cy + .3 * s]], { wash: PAL.cream, washOp: 200 * k, ink: null });
    }
    paint(rectPts(-.25 * s, -10.65 * s, .5 * s, .14 * s, 0), { wash: PAL.cream, washOp: 160 * k, ink: null });   // bridge
    pop();
  }
  const torch = (x, y, ang, on) => {
    push(); translate(x, y); rotate(ang);
    paint(rrPts(-26, -7, 34, 14, 4), { wash: '#3B4466', washOp: 255, ink: PAL.ink, sw: .9 });
    paint([[6, -10], [20, -12], [20, 12], [6, 10]], { wash: '#9AA3B5', washOp: 255, ink: PAL.ink, sw: .9 });
    paint(ellPts(20, 0, 3, 11, 10), { wash: on ? PAL.cream : STEEL_DK, washOp: 255, ink: null });
    pop();
  };
  // a cone of light from (x, y) along ang, `len` long, ending in a pool of radius r
  function beamPts(x, y, ang, len, r) {
    const ca = Math.cos(ang), sa = Math.sin(ang), ex = x + ca * len, ey = y + sa * len, p = [[x - sa * 10, y + ca * 10]];
    for (let i = 0; i <= 12; i++) { const a = ang + Math.PI / 2 - i / 12 * Math.PI; p.push([ex + Math.cos(a) * r, ey + Math.sin(a) * r]); }
    p.push([x + sa * 10, y - ca * 10]);
    return p;
  }
  // like irisShape, but see-through: darkness everywhere outside the cone
  function darkOutside(pts, op) {
    const n = pts.length; let cx = 0, cy = 0; for (const p of pts) { cx += p[0]; cy += p[1]; } cx /= n; cy /= n;
    const out = p => { const dx = p[0] - cx, dy = p[1] - cy, d = Math.hypot(dx, dy) || 1; return [cx + dx / d * 5000, cy + dy / d * 5000]; };
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[(i + 1) % n], ex = (b[0] - a[0]) * .01, ey = (b[1] - a[1]) * .01;   // just enough overlap to close the seams
      const a2 = [a[0] - ex, a[1] - ey], b2 = [b[0] + ex, b[1] + ey];
      paint([a2, b2, out(b2), out(a2)], { wash: DARK, washOp: op, ink: null });
    }
  }
  // how much a point sits inside the cone (0..1)
  function inBeam(px, py, x, y, ang, len, r) {
    const dx = px - x, dy = py - y, along = dx * Math.cos(ang) + dy * Math.sin(ang), across = Math.abs(-dx * Math.sin(ang) + dy * Math.cos(ang));
    if (along < 0 || along > len + r) return 0;
    const half = lerp(10, r, clamp(along / len));
    return clamp((half - across) / 40);
  }

  // ---------------- 211.89 – 217.51: block by block the planet goes dark; the camera creeps in ----------------
  function lightsOut(t, lt) {
    const f = litFrac(t), k = seg(t, bt(B0), SHOT2);
    camBegin(lerp(960, 1000, ease(k)), lerp(760, 500, ease(k)), lerp(.55, 1.2, ease(k)));
    sky(t); globe(t, f);
    hut();
    const trip = seg(t, TRIP, TRIP + .12);
    breaker(lerp(0, OFF_A, backOut(trip)), t < TRIP);
    // the cast: flinch at every block that dies
    const last = BLOCKS.reduce((m, b) => t >= b.die && b.die > m ? b.die : m, -9), flinch = Math.exp(-(t - last) * 9) * (t > last ? 1 : 0);
    const cm = mood(t, [[0, 'happy'], [bt(B0 + 2), 'normal', '!'], [bt(B0 + 5), 'scared', 'sweat']]);
    const cx = 720, rx = 935;
    clawd(cx, surf(cx), CU, { draw: HARD, ...cm, mouth: f > .7 ? 'smile' : 'wobble', rot: tilt(cx), sq: (cm.take || 0) + .07 * flinch,
      aL: .2 - .5 * (1 - f), aR: .2 - .5 * (1 - f), lookX: Math.sin(t * 2.2) });
    researcher(rx, surf(rx), RS, { rot: tilt(rx), eyes: t > bt(B0 + 3) ? 'wide' : 'dot', brows: t > bt(B0 + 3) ? 'worried' : null,
      mouth: t > bt(B0 + 3) ? 'o' : 'smile', hairUp: (1 - f) * .8 + .2 * flinch, aL: -1.1 + .5 * (1 - f), aR: -1.1 + .5 * (1 - f), sq: .05 * flinch });
    // darkness falls a step on every beat; only the lights that are still on show through it
    camEnd();
    flash(lerp(.12, .93, 1 - f), DARK);
    camBegin(lerp(960, 1000, ease(k)), lerp(760, 500, ease(k)), lerp(.55, 1.2, ease(k)));
    cityLights(t);
    hutLights(litOf(TRIP, t, 99));
    if (t >= TRIP && t < TRIP + .4) { const [gx, gy] = grip(OFF_A); spark(gx + 40, gy + 20, t - TRIP, 70); spark(P[0], P[1], t - TRIP, 50); }
    // in the dark: the eyes and the glasses. Clawd looks left, right, then at the Researcher; the glasses glint back
    const d = clamp((1 - f - .5) * 2), look = kf(t, [[TRIP + .25, 0], [TRIP + .4, -1], [bt(B0 + 11) - .05, -1], [bt(B0 + 11) + .1, 1], [SHOT2, 1]]);
    const blink = Math.abs(t - (bt(B0 + 11) + .25)) < .06 ? .1 : 1;
    clawdEyes(cx, CU, tilt(cx), d, look, blink, t > bt(B0 + 5) ? 1.2 : 1);
    glasses(rx, surf(rx), RS, tilt(rx), d, seg(t, bt(B0 + 11) + .1, SHOT2));
    if (t >= TRIP && t < TRIP + .9) sfx('BZZT…', 1350, 230, 130, LIT, t - TRIP, { life: .9, rot: -.1, screen: true });
    BLOCKS.forEach((b, j) => { if (j % 4 === 1 && t >= b.die && t < b.die + .45) { const [x, y] = onGlobe(b.phi, b.d); sfx('bzzt', x, y - 90, 54, soft(LIT, .2), t - b.die, { life: .45 }); } });
    camEnd();
  }

  // ---------------- 217.51 – 219.39: flashlight, toss, spit, hang, CLUNK ----------------
  function breakerPull(t, lt) {
    const on = t >= CLUNK, pull = easeIn(seg(t, bt(B0 + 14) + .22, CLUNK)), out = easeOut(seg(t, CLUNK, CLUNK + .3));
    const ang = on ? OFF_A * -.06 * Math.exp(-(t - CLUNK) * 20) : OFF_A * (1 - pull) + (t < bt(B0 + 14) + .22 && t > bt(B0 + 14) + .1 ? .03 * Math.sin(t * 60) : 0);
    const cam = [lerp(1060, 960, out), lerp(470, 1400, out), lerp(1.4, .42, out)], [sx, sy] = shakeXY(t, on ? 10 * (1 - out) : 0);
    camBegin(cam[0] + sx, cam[1] + sy, cam[2]);
    sky(t); globe(t, on ? 1 : 0);
    hut(); breaker(ang, on);

    // Clawd, left: squints when the beam hits its face, catches the flashlight, holds it on the lever
    const cx = 700, toss = seg(t, bt(B0 + 13) + .05, bt(B0 + 13) + .25), holds = toss >= 1;
    const cm = mood(t, [[0, 'normal'], [SHOT2 + .08, 'closed', '!'], [SHOT2 + .45, 'normal'], [CLUNK, 'happy', 'spark']]);
    const caR = on ? 1.6 : holds ? .55 : .2, tipC = [cx + (4.9 + 2.2 * Math.cos(caR)) * CU, surf(cx) - (4.5 + 2.2 * Math.sin(caR)) * CU];
    clawd(cx, surf(cx), CU, { draw: HARD, ...cm, mouth: on ? 'O' : 'flat', rot: 0, aR: caR, aL: on ? 1.6 : .2, dy: on ? -.6 * Math.sin(Math.min(1, (t - CLUNK) / .3) * Math.PI) : 0 });

    // the Researcher: stands with the flashlight, spits on their hands, jumps, hangs off the grip, rides it down
    const jump = seg(t, bt(B0 + 14), bt(B0 + 14) + .14), [gx, gy] = grip(ang), A = 1.35;
    const rxStand = 1050, ryStand = surf(rxStand), hangY = gy + (7.6 + 3.2 * Math.sin(A)) * RS;
    const rx = lerp(rxStand, gx - (1.75 + 3.2 * Math.cos(A)) * RS, ease(jump)), ry = Math.min(surf(rx), lerp(ryStand, hangY, backOut(jump)) - 40 * Math.sin(jump * Math.PI));
    const spit = seg(t, bt(B0 + 13) + .25, bt(B0 + 14)), hanging = jump > .5;
    const rub = spit > .35 ? .12 * Math.sin(t * 50) : 0;
    const aL = t < bt(B0 + 13) ? .3 : hanging ? (on ? 1.5 : 1.2 + .5 * Math.sin(t * 18)) : t < bt(B0 + 13) + .25 ? 1 : lerp(1, .95, spit) + rub;
    const aR = t < bt(B0 + 13) ? -1.1 : hanging ? A : lerp(-1.1, .95, ease(seg(t, bt(B0 + 13) + .2, bt(B0 + 13) + .3))) - rub;
    const re = t > bt(B0 + 13) - .1 && t < bt(B0 + 13) + .3 ? '!' : hanging && !on ? 'sweat' : null;
    researcher(rx, ry, RS, { eyes: on ? 'star' : hanging ? 'closed' : 'wide', brows: on ? 'up' : 'worried', mouth: on ? 'grin' : hanging ? 'flat' : spit > 0 && spit < .35 ? 'O' : 'o',
      aL, aR, run: hanging && !on ? t * 3 : undefined, hairUp: hanging ? .6 : .2, noShadow: hanging && ry < surf(rx) - 10,
      emote: re, emoteK: re ? 1 : 0 });
    if (hanging) knob(ang);                                          // the knob sits over the hand that holds it
    if (spit > 0 && spit < .5) for (const side of [-1, 1]) {        // ptoo: a drop to each palm
      const k = seg(spit, 0, .35), mx = rx, my = ry - 9 * RS, hx = rx + side * (1.75 + 3.2 * Math.cos(.95)) * RS, hy = ry - (7.6 + 3.2 * Math.sin(.95)) * RS;
      if (k < 1) paint(ellPts(lerp(mx, hx, k), lerp(my, hy, k) - 30 * Math.sin(k * Math.PI), 4, 5, 8), { wash: PAL.sky, washOp: 230, ink: PAL.ink, sw: .5 });
    }

    // the flashlight: in the Researcher's left hand, sweeping; tossed (spinning) to Clawd; then held on the lever
    const hL = [rxStand - (1.75 + 3.2 * Math.cos(.3)) * RS, ryStand - (7.6 + 3.2 * Math.sin(.3)) * RS];
    const aim = Math.atan2(gy + 100 - tipC[1], gx + 10 - tipC[0]);
    let fx, fy, fa;
    if (toss <= 0) { [fx, fy] = hL; fa = lerp(Math.PI, TAU + .02, ease(seg(t, SHOT2 + .3, bt(B0 + 13) - .05))); }
    else if (!holds) { fx = lerp(hL[0], tipC[0], toss); fy = lerp(hL[1], tipC[1], toss) - 70 * Math.sin(toss * Math.PI); fa = TAU + toss * TAU + aim * toss; }
    else { [fx, fy] = tipC; fa = aim; }
    const torchOn = t >= SHOT2 + .06, len = holds ? 360 : 300, br = holds ? 240 : 120;
    if (!on && torchOn) {
      const bp = beamPts(fx, fy, fa, len, br);
      darkOutside(bp, 236);
      paint(bp, { fill: '#FFE9B0', fillOp: 30, bleed: .35, ink: null });               // a warm, soft-edged beam hides the wedge seams
      paint(bp, { wash: PAL.cream, washOp: 40, fill: PAL.cream, fillOp: 60, bleed: .15, tex: .3, border: .4, ink: null });
    }
    if (!on && !torchOn) { camEnd(); flash(.93, DARK); camBegin(cam[0] + sx, cam[1] + sy, cam[2]); }
    torch(fx, fy, fa, torchOn && !on);
    if (!on) {
      const lc = torchOn ? inBeam(cx + .5 * CU, surf(cx) - 6 * CU, fx, fy, fa, len, br) : 0;
      clawdEyes(cx, CU, 0, 1 - lc, holds ? .8 : t < SHOT2 + .5 ? 0 : .6, cm.eyes === 'closed' ? .1 : 1);
      const lr = torchOn ? inBeam(rx, ry - 10.5 * RS, fx, fy, fa, len, br) : 0;
      if (!hanging) glasses(rx, ry, RS, 0, 1 - lr, frac(t * 1.5));
    }
    if (t >= SHOT2 && t < SHOT2 + .4) sfx('click', 880, 330, 46, PAL.cream, t - SHOT2, { life: .4 });

    // CLUNK: every light on the planet at once, and a straight line of them right across it
    if (on) {
      cityLights(t, 1.4);
      hutLights(1);
      LINE.forEach(([x, y], i) => { const k = seg(t, CLUNK + i * .006, CLUNK + .05 + i * .006);
        if (k > 0 && Math.hypot(x - G[0], y - G[1]) < R - 20) { glow(x, y, 40, 40, k * 1.3); paint(ellPts(x, y, 11, 11, 10), { wash: LIT, washOp: 255 * k, ink: null }); } });
      sfx('CLUNK', 1300, 300, 170, LIT, t - CLUNK, { life: .6, rot: -.08, screen: true });
    }
    camEnd();
    if (on) flash(.6 * (1 - seg(t, CLUNK, CLUNK + .1)), LIT);
  }

  chapter('brownout', barT(114), 219.39, [[barT(114), lightsOut], [SHOT2, breakerPull]]);
})();
