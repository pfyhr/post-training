// c09_planet.js: 191.27-211.89, bars 103-113. The drop. Sunrise over a little planet with a festival stage on its
// crown; the lead Clawd (robot helmet) is as big as the planet, the choir stands in a ring around the limb and the
// loss line wraps it like Saturn's ring. Every stomp lights a desert town, pylons stride the curve like a chorus
// line, Clawd plugs the planet into the Sun, and then the whole thing turns out to be painted on log-log paper:
// the line rips through the edge of the page and keeps going into space. The power flickers on the last beat.
(() => {
  const soft = (c, k = .5) => mixCol(c, PAL.paper, k);
  const { HARD, labCoat, STEEL, STEEL_DK, GRID } = SL;
  const GOLD = '#F2B544', GOLD_LT = '#FFD98A', SUNC = '#FFC64A', DAWN = '#2B2550', DAWN_MID = '#8A3F5E';
  const OCEAN = '#33558A', OCEAN_DK = '#1E2F5C', LAND = '#CF9552', LAND_DK = '#8E5A34', TOWN = '#FFF1C4', NIGHTSHADE = '#191433';
  const CHROME = '#C9CED8', CHROME_DK = '#8C93A3', VISOR = '#1C1A2E', LED = '#3FF0D8';
  const P = (t, k = 7) => pulse(t, k), E = barT(114);
  const chantOn = t => frac(bpOf(t)) < .45;

  // the robot helmet is shared by the three choruses (sl_cast.js); here the sun glints off it
  const robotHelmet = (glow, glint = 0) => SL.robotHelmet(glow, { glint });

  // ---------------- sky: dawn in space, a faint log-log grid, and the sun ----------------
  function loglog(x0, y0, x1, y1, D, col, w) {               // decades from the bottom-left corner, 9 lines each
    for (let k = 0; ; k++) { let any = false;
      for (let m = 1; m <= 9; m++) { const x = x0 + D * (k + Math.log10(m)); if (x > x1) break; any = true; inkLine([[x, y0], [x, y1]], m === 1 ? w * 1.8 : w, col, 'inkfine', 0); }
      if (!any) break; }
    for (let k = 0; ; k++) { let any = false;
      for (let m = 1; m <= 9; m++) { const y = y1 - D * (k + Math.log10(m)); if (y < y0) break; any = true; inkLine([[x0, y], [x1, y]], m === 1 ? w * 1.8 : w, col, 'inkfine', 0); }
      if (!any) break; }
  }
  function sky(t, sx, sy, sr) {
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: DAWN, washOp: 255, fill: PAL.indigo, fillOp: 60, bleed: .2, tex: .5, ink: null });
    loglog(-40, -40, W + 40, H + 40, 520, mixCol(DAWN, GRID, .3), .45);
    for (let i = 0; i < 26; i++) {
      const x = hash(i) * W, y = hash(i + 50) * H * .85, r = 1.6 + 2.4 * hash(i + 9), tw = .5 + .5 * wob(t, .6 + hash(i + 3), hash(i));
      paint(ellPts(x, y, r, r, 6), { wash: PAL.cream, washOp: 90 + 140 * tw, ink: null });
    }
    paint(ellPts(sx, sy, sr * 7, sr * 5, 30, 10), { wash: DAWN_MID, washOp: 110, fill: DAWN_MID, fillOp: 90, bleed: .25, tex: .3, ink: null });
    paint(ellPts(sx, sy, sr * 4.4, sr * 3.5, 30, 8), { wash: PAL.clay, washOp: 120, fill: PAL.clay, fillOp: 90, bleed: .25, tex: .3, ink: null });
    paint(ellPts(sx, sy, sr * 2.6, sr * 2.3, 28, 6), { wash: GOLD, washOp: 120, fill: GOLD, fillOp: 100, bleed: .25, ink: null });
  }
  function sun(t, sx, sy, r, boost = 0) {
    const p = P(t);
    sunburst(sx, sy, GOLD, PAL.clay, t * .18, 18, r * 3.6 * (1 + .5 * boost), 40 + 50 * p + 40 * boost);
    paint(ellPts(sx, sy, r * (1.55 + .15 * p + .3 * boost), r * (1.55 + .15 * p + .3 * boost), 28, 3), { fill: GOLD_LT, fillOp: 160, bleed: .3, ink: null });
    paint(ellPts(sx, sy, r, r, 36, 2), { wash: SUNC, washOp: 255, fill: PAL.ochre, fillOp: 70, tex: .4, ink: PAL.clayDk, sw: 1.1 });
    paint(ellPts(sx - r * .28, sy - r * .28, r * .5, r * .4, 20), { fill: '#FFF2C0', fillOp: 170, bleed: .2, ink: null });
  }

  // ---------------- the planet: an orthographic globe with continents, a sunrise terminator and desert towns ----------------
  const CONT = [
    [[0.0, .45, .30], [.30, .30, .26], [-.20, .62, .22], [.15, .05, .18]],
    [[1.25, -.15, .32], [1.45, .15, .25], [1.10, -.45, .20]],
    [[2.45, .40, .34], [2.80, .55, .26], [2.65, .12, .22]],
    [[3.70, -.30, .28], [3.95, -.05, .22], [3.55, .1, .16]],
    [[4.75, .35, .32], [5.05, .55, .22], [4.90, .05, .20]],
    [[5.70, -.20, .24], [5.85, .10, .18]],
  ];
  const DES = [[.05, .42], [.33, .27], [-.17, .6], [1.28, -.12], [1.45, .18], [2.5, .38], [2.78, .55], [2.65, .12],
               [3.75, -.28], [3.95, -.04], [4.8, .35], [5.03, .55], [5.7, -.18], [5.86, .1]];
  const ROT = t => .12 * t;
  const proj = (g, lon, lat) => {
    const a = lon + g.rot, x = Math.cos(lat) * Math.sin(a), y = Math.sin(lat), z = Math.cos(lat) * Math.cos(a);
    const yy = y * Math.cos(g.tilt) - z * Math.sin(g.tilt), zz = z * Math.cos(g.tilt) + y * Math.sin(g.tilt);
    return [g.cx + g.R * x, g.cy - g.R * yy, zz, x, yy];
  };
  const blob = (g, [lon, lat, r], n = 18) => {                // a lon/lat disc; hidden points fold onto the limb
    const pts = []; let vis = false;
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, p = proj(g, lon + r * Math.cos(a) / Math.max(.3, Math.cos(lat)), lat + r * Math.sin(a));
      if (p[2] > 0) { vis = true; pts.push([p[0], p[1]]); }
      else { const d = Math.hypot(p[3], p[4]) || 1; pts.push([g.cx + g.R * p[3] / d, g.cy - g.R * p[4] / d]); }
    }
    return vis ? pts : null;
  };
  // when each desert lights: the ones facing us in shot C go one per beat (left to right), the far side after
  const C0 = barT(106), C1 = barT(108);
  const gC = t => ({ cx: 960, cy: 660, R: 320, rot: ROT(t), tilt: .4 });
  const LIT_AT = (() => {
    const g = gC((C0 + C1) / 2), at = DES.map(() => C1 - BEAT * .5);
    const vis = DES.map((d, i) => [i, proj(g, d[0], d[1])]).filter(v => v[1][2] > .25).sort((a, b) => a[1][0] - b[1][0]);
    vis.forEach(([i], k) => { at[i] = C0 + Math.floor(k * 8 / vis.length) * BEAT; });
    return at;
  })();

  function globe(t, g, o = {}) {
    const R = g.R, dir = Math.atan2(g.sy - g.cy, g.sx - g.cx), es = [Math.cos(dir), Math.sin(dir)], ep = [-es[1], es[0]];
    paint(ellPts(g.cx, g.cy, R * 1.13, R * 1.13, 44, 4), { fill: GOLD_LT, fillOp: 90 + 50 * (o.boost || 0), bleed: .3, ink: null }); // atmosphere
    paint(ellPts(g.cx, g.cy, R, R, 56, 1), { wash: OCEAN, washOp: 255, fill: OCEAN_DK, fillOp: 80, tex: .5, ink: null });
    CONT.forEach(c => c.forEach(b => { const pts = blob(g, b); if (pts) paint(pts, { wash: LAND, washOp: 255, fill: LAND_DK, fillOp: 70, tex: .6, ink: null, curv: .5 }); }));
    // night side: everything away from the sun past a terminator that bulges sunward (it's still mostly night)
    const m = g.m ?? -.35, sh = [];
    const at = (c, s) => [g.cx + R * (c * ep[0] + s * es[0]), g.cy + R * (c * ep[1] + s * es[1])];
    for (let i = 0; i <= 20; i++) { const a = i / 20 * Math.PI; sh.push(at(Math.cos(a), -Math.sin(a))); }
    for (let i = 20; i >= 0; i--) { const a = i / 20 * Math.PI; sh.push(at(Math.cos(a), -m * Math.sin(a))); }
    paint(sh, { wash: NIGHTSHADE, washOp: 195 * (1 - .4 * (o.boost || 0)), fill: NIGHTSHADE, fillOp: 60, bleed: .12, tex: .4, ink: null });
    const rim = [];                                           // sunlit rim
    for (let i = 0; i <= 20; i++) { const a = i / 20 * Math.PI; rim.push(at(Math.cos(a), Math.sin(a))); }
    for (let i = 20; i >= 0; i--) { const a = i / 20 * Math.PI; rim.push(at(Math.cos(a) * .97, Math.sin(a) * .72)); }
    paint(rim, { fill: GOLD_LT, fillOp: 190, bleed: .15, ink: null });
    paint(ellPts(g.cx, g.cy, R, R, 56, 1), { ink: PAL.ink, sw: g.R > 200 ? 1.5 : 1 });
    lightLine(g, o.bright ?? 1);
    towns(t, g, o.bright ?? 1);
  }
  function lightLine(g, b = 1) {                              // the straight row of lights the bridge left us
    for (let i = 0; i < 40; i++) {
      const lon = i / 40 * TAU, p = proj(g, lon, .12 + .08 * Math.sin(lon * 2));
      if (p[2] < .08) continue;
      const r = Math.max(1.3, g.R * .011) * (.6 + .4 * p[2]);
      paint(ellPts(p[0], p[1], r * 3, r * 3 * Math.sqrt(p[2]), 10), { fill: GOLD, fillOp: 110 * b, bleed: .2, ink: null });
      paint(ellPts(p[0], p[1], r, r, 8), { wash: TOWN, washOp: 230 * b, ink: null });
    }
  }
  function towns(t, g, b = 1) {
    DES.forEach((d, i) => {
      const age = t - LIT_AT[i]; if (age < 0) return;
      const p = proj(g, d[0], d[1]); if (p[2] < .05) return;
      const k = backOut(clamp(age / .3)), f = Math.sqrt(p[2]), r = g.R * .13 * k * (1 + .15 * P(t));
      paint(ellPts(p[0], p[1], r * 1.4, r * 1.4 * f, 18, 2), { fill: GOLD, fillOp: 170 * b, bleed: .3, ink: null });
      paint(ellPts(p[0], p[1], r * .55, r * .55 * f, 14), { wash: GOLD_LT, washOp: 210 * b, ink: null });
      const dr = Math.max(1.2, g.R * .012);
      for (let j = 0; j < 6; j++) { const a = hash(i * 7 + j) * TAU, rr = r * .75 * hash(i * 3 + j + 1);
        paint(ellPts(p[0] + Math.cos(a) * rr, p[1] + Math.sin(a) * rr * f, dr, dr, 8), { wash: TOWN, washOp: 255 * b, ink: null }); }
      if (age < .55 && g.R > 200) { const e = age / .55, q = r * (1.2 + 3 * e);
        paint(ellPts(p[0], p[1], q, q * f, 24), { ink: GOLD_LT, sw: 3 * (1 - e), br: 'ink' }); }
    });
  }
  // the loss line, bent into a ring around the planet; back half before the globe, front half after
  function ring(t, g, half) {
    const rx = g.R * 1.55, ry = g.R * .3, rot = -.14, cy = g.cy - g.R * .12, w = g.R * .045 * (1 + .3 * P(t));
    const pt = (a, dr) => { const x = Math.cos(a) * (rx + dr), y = Math.sin(a) * (ry + dr * .35);
      return [g.cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]; };
    const band = ww => { const o = [], i = []; const a0 = half < 0 ? Math.PI : 0;
      for (let k = 0; k <= 28; k++) { const a = a0 + k / 28 * Math.PI; o.push(pt(a, ww)); i.unshift(pt(a, -ww)); } return o.concat(i); };
    paint(band(w * 3), { fill: GOLD, fillOp: 110, bleed: .25, ink: null });
    paint(band(w), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 50, ink: PAL.ink, sw: .9 });
    const mid = []; for (let k = 2; k <= 26; k++) mid.push(pt((half < 0 ? Math.PI : 0) + k / 28 * Math.PI, -w * .3));
    inkLine(mid, 1.2, PAL.clayLt, 'inkfine', .5);
  }
  // the choir standing round the limb, feet on the planet, chanting
  function choirRing(t, g, u, a0, a1, n, skip = 0) {
    for (let i = 0; i < n; i++) {
      const a = lerp(a0, a1, i / (n - 1)); if (Math.abs(a + Math.PI / 2) < skip) continue;
      push(); translate(g.cx + g.R * Math.cos(a), g.cy + g.R * Math.sin(a)); rotate(a + Math.PI / 2);
      const m = move('stomp', t, 0), ch = chantOn(t);
      clawd(0, 0, u, { ...m, draw: i % 2 ? labCoat : HARD, mouth: ch ? 'O' : 'flat', eyes: ch ? 'closed' : 'happy', noShadow: true });
      pop();
    }
  }
  // the festival stage on the planet's crown: deck, speaker stacks, two sweeping beams
  function stage(t, x, y, u) {
    const p = P(t), sw = clamp(u / 15, .6, 2);
    for (const s of [-1, 1]) {
      const a = -Math.PI / 2 + s * (.25 + .2 * wob(t, .27, s * .3));
      paint([[x + s * 3 * u, y - 2 * u], [x + s * 3 * u + Math.cos(a - .07) * 40 * u, y - 2 * u + Math.sin(a - .07) * 40 * u], [x + s * 3 * u + Math.cos(a + .07) * 40 * u, y - 2 * u + Math.sin(a + .07) * 40 * u]],
        { fill: s < 0 ? GOLD_LT : soft(LED, .3), fillOp: 45 + 40 * p, bleed: .1, ink: null });
    }
    paint(rrPts(x - 15 * u, y - 1.1 * u, 30 * u, 1.6 * u, .5 * u), { wash: '#5A3A2A', washOp: 255, fill: PAL.ink, fillOp: 40, tex: .5, ink: PAL.ink, sw });
    for (const s of [-1, 1]) {
      const bx = x + s * 11.5 * u, bump = 1 + .08 * p;
      paint(rrPts(bx - 1.9 * u, y - 7.3 * u, 3.8 * u, 6.2 * u, .3 * u), { wash: STEEL_DK, washOp: 255, fill: PAL.night, fillOp: 60, ink: PAL.ink, sw });
      for (const [cy, r] of [[-5.6, 1.15], [-2.6, 1.15]]) {
        paint(ellPts(bx, y + cy * u, r * u * bump, r * u * bump, 18), { wash: PAL.ink, washOp: 255, ink: STEEL, sw: sw * 1.4 });
        paint(ellPts(bx, y + cy * u, .4 * u, .4 * u, 12), { wash: STEEL, washOp: 255, ink: null });
      }
    }
  }
  function lead(t, x, y, u, o = {}) {
    const p = P(t), m = move(o.style || 'roof', t);
    clawd(x, y, u, { ...m, draw: robotHelmet(o.glow ?? (.25 + .75 * p), o.glint || 0), mouth: chantOn(t) ? 'O' : 'grin', noShadow: true, ...o });
  }
  const whiteIn = lt => { const k = 1 - ease(lt / .5); if (k > .01) paint(rectPts(-60, -60, W + 120, H + 120), { wash: PAL.cream, washOp: 255 * k, ink: null }); };
  const beatGlow = t => { const p = P(t, 9); if (p > .05) paint(rectPts(-60, -60, W + 120, H + 120), { fill: GOLD_LT, fillOp: 40 * p, bleed: .1, ink: null }); };

  // ---------------- 191.27 – 193.14: out of the white, the sun comes up behind the planet ----------------
  function sunrise(t, lt) {
    const p = P(t), [shx, shy] = shakeXY(t, 6 * p), sy = lerp(1000, 470, easeOut(seg(lt, 0, 1.7))), sx = 1320;
    camBegin(960 + shx, 540 + shy, lerp(1.08, 1, easeOut(lt / 1.87)) + .025 * p);
    const g = { cx: 960, cy: 900, R: 340, rot: ROT(t), tilt: .35, sx, sy, m: -.45 };
    sky(t, sx, sy, 120); sun(t, sx, sy, 120);
    ring(t, g, -1);
    globe(t, g);
    choirRing(t, g, 9, -Math.PI - .15, .15, 15, .42);
    ring(t, g, 1);
    stage(t, 960, 562, 26 / 2.6);
    lead(t, 960, 561, 28, { glint: .6 * ease(seg(lt, .8, 1.4)) + .5 * p * seg(lt, .8, 1.4) });
    camEnd();
    beatGlow(t);
    whiteIn(lt);
  }

  // ---------------- 193.14 – 196.89: close on the helmet, sun behind it, the choir on the curve below ----------------
  function helmetShot(t, lt, dur) {
    const p = P(t), [shx, shy] = shakeXY(t, 5 * p), sx = 1350, sy = lerp(360, 250, lt / dur);
    camBegin(960 + shx, 520 + shy, lerp(1, 1.1, ease(lt / dur)) + .03 * p);
    const g = { cx: 960, cy: 1420, R: 760, rot: ROT(t), tilt: .5, sx, sy, m: -.5 };
    sky(t, sx, sy, 160); sun(t, sx, sy, 160);
    globe(t, g);
    choirRing(t, g, 14, -2.5, -.64, 11, .36);
    const u = 44;
    stage(t, 960, 661, u / 2.6);
    const sweep = seg(frac(bpOf(t) / 4), 0, .35);              // a slow glint sweeps the dome every bar, and flares on each beat
    lead(t, 960, 660, u, { style: t < barT(105) ? 'bounce' : 'roof', glint: Math.max(p * .9, Math.sin(sweep * Math.PI)) });
    camEnd();
    beatGlow(t);
  }

  // ---------------- 196.89 – 200.64: every stomp lights a desert town ----------------
  function desertTowns(t, lt, dur) {
    const p = P(t), [shx, shy] = shakeXY(t, 6 * p), g = { ...gC(t), sx: 1500, sy: 300, m: -.25 };
    camBegin(960 + shx, 520 + shy, lerp(1.04, 1, ease(lt / dur)) + .03 * p);
    sky(t, g.sx, g.sy, 110); sun(t, g.sx, g.sy, 110);
    ring(t, g, -1);
    globe(t, g);
    choirRing(t, g, 7, -Math.PI - .15, .15, 15, .45);
    ring(t, g, 1);
    stage(t, 960, g.cy - g.R + 1, 20 / 2.6);
    lead(t, 960, g.cy - g.R, 20, { style: 'stomp' });
    // a shock ring from Clawd's feet on every stomp
    const e = frac(bpOf(t)); if (e < .6) paint(ellPts(960, g.cy - g.R, 60 + 420 * e, 18 + 120 * e, 30), { ink: GOLD_LT, sw: 3 * (1 - e / .6) });
    camEnd();
    beatGlow(t);
  }

  // ---------------- 200.64 – 204.39: pylons stride round the curve behind Clawd; BZZT, the cables snap taut ----------------
  const rotP = (bx, by, r, lx, ly) => [bx + lx * Math.cos(r) - ly * Math.sin(r), by + lx * Math.sin(r) + ly * Math.cos(r)];
  function pylon(x, y, h, r, t, i) {                          // a lattice tower that kicks like a chorus girl
    const bp = bpOf(t) + i * .5, side = Math.floor(bp) % 2 ? 1 : -1, kick = Math.sin(frac(bp) * Math.PI);
    const bob = -h * .04 * Math.abs(Math.sin(bp * Math.PI)), w = 2.2;
    const L = (lx, ly) => rotP(x, y, r, lx, ly + bob);
    const fl = [-.26 * h + (side < 0 ? .1 * h * kick : 0), side < 0 ? -.14 * h * kick : 0], fr = [.26 * h + (side > 0 ? .1 * h * kick : 0), side > 0 ? -.14 * h * kick : 0];
    const F = (lx, ly) => rotP(x, y, r, lx, ly);
    const footL = F(fl[0], fl[1]), footR = F(fr[0], fr[1]), wl = L(-.08 * h, -.55 * h), wr = L(.08 * h, -.55 * h), top = L(0, -h);
    inkLine([footL, wl], w * 1.3, STEEL_DK, 'ink', 0); inkLine([footR, wr], w * 1.3, STEEL_DK, 'ink', 0);
    inkLine([footL, L(.05 * h, -.3 * h), L(-.08 * h, -.55 * h)], w * .7, STEEL_DK, 'inkfine', 0);
    inkLine([footR, L(-.05 * h, -.3 * h), L(.08 * h, -.55 * h)], w * .7, STEEL_DK, 'inkfine', 0);
    inkLine([wl, top, wr], w * 1.3, STEEL_DK, 'ink', 0);
    inkLine([wl, L(.05 * h, -.78 * h), L(-.04 * h, -.9 * h)], w * .7, STEEL_DK, 'inkfine', 0);
    inkLine([L(-.34 * h, -.76 * h), L(.34 * h, -.76 * h)], w * 1.2, STEEL_DK, 'ink', 0);
    inkLine([L(-.24 * h, -.9 * h), L(.24 * h, -.9 * h)], w, STEEL_DK, 'ink', 0);
    for (const s of [-1, 1]) for (const [ax, ay] of [[.34, -.76], [.24, -.9]]) {
      const a = L(s * ax * h, ay * h), b = L(s * ax * h, ay * h + .06 * h);
      inkLine([a, b], w * .8, PAL.ink, 'inkfine', 0); paint(ellPts(b[0], b[1], 4, 4, 8), { wash: PAL.cream, ink: PAL.ink, sw: .6 });
    }
    for (const f of [footL, footR]) paint(ellPts(f[0], f[1], h * .035, h * .02, 10), { wash: STEEL_DK, ink: PAL.ink, sw: .7 });   // little feet
    return [L(-.34 * h, -.7 * h), L(.34 * h, -.7 * h)];      // cable points (hanging off the lower arm)
  }
  const cable = (a, b, sag, col, sw) => {
    const pts = []; for (let i = 0; i <= 12; i++) { const k = i / 12; pts.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k) + sag * 4 * k * (1 - k)]); }
    inkLine(pts, sw, col, 'ink', .4); return pts;
  };
  function pylonsShot(t, lt, dur) {
    const p = P(t), zap = barT(109), [shx, shy] = shakeXY(t, 5 * p + 14 * Math.max(0, 1 - Math.abs(t - zap) / .3));
    camBegin(960 + shx, 540 + shy, 1 + .025 * p);
    const cx = 960, cy = 2320, R = 1560, surf = x => cy - Math.sqrt(R * R - (x - cx) * (x - cx)), tilt = x => Math.asin((x - cx) / R);
    sky(t, 330, 800, 130); sun(t, 330, 800, 130);
    // the planet's curve: ocean and land rolling left under the walkers, towns lit on the land
    paint(ellPts(cx, cy, R * 1.03, R * 1.03, 90, 2), { fill: GOLD_LT, fillOp: 110, bleed: .3, ink: null });
    paint(ellPts(cx, cy, R, R, 120, 1), { wash: OCEAN, washOp: 255, fill: OCEAN_DK, fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.4 });
    const sc = .085 * t;                                       // surface scroll, radians
    for (let k = -3; k <= 3; k++) {
      const base = Math.floor(sc / .9) * .9, a0 = base + k * .9 - sc, a1 = a0 + .5 + .15 * hash(k + Math.floor(sc / .9));
      if (a1 < -.75 || a0 > .75) continue;
      const pts = []; for (let i = 0; i <= 16; i++) { const a = lerp(a0, a1, i / 16) - Math.PI / 2; pts.push([cx + (R + 3) * Math.cos(a), cy + (R + 3) * Math.sin(a)]); }
      for (let i = 16; i >= 0; i--) { const a = lerp(a0 + .03, a1 - .03, i / 16) - Math.PI / 2, rr = R - (i === 0 || i === 16 ? 10 : 140 + 150 * hash(i + k * 31 + Math.floor(sc / .9) * 31));
        pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); }
      paint(pts, { wash: LAND, washOp: 255, fill: LAND_DK, fillOp: 90, tex: .6, ink: PAL.ink, sw: .8, curv: .6 });
      const id = k + Math.floor(sc / .9);
      for (let j = 0; j < 7; j++) { const a = lerp(a0 + .05, a1 - .05, hash(id * 9 + j)) - Math.PI / 2, rr = R - 25 - 90 * hash(id * 5 + j);
        const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a), r = 20 + 12 * hash(j + id);
        paint(ellPts(x, y, r * 1.6, r, 14), { fill: GOLD_LT, fillOp: 190, bleed: .3, ink: null });
        for (let q = 0; q < 3; q++) paint(ellPts(x + (q - 1) * 9, y + 4 * hash(q + j), 3.5, 3.5, 8), { wash: TOWN, ink: null }); }
    }
    paint(ellPts(cx, cy, R, R, 120, 1), { ink: PAL.ink, sw: 1.4 });
    // the walkers: four pylons and Clawd at the head of the line, holding the end of the cable
    const XS = [240, 520, 800, 1080], H0 = 290;
    const taut = ease(seg(t, zap - .05, zap + .05)), sag = lerp(110 + 20 * wob(t, 1.1), 18, taut) * (1 - .3 * elasticOut(seg(t, zap, zap + .8)) * (1 - taut));
    const hooks = XS.map((x, i) => pylon(x, surf(x), H0, tilt(x), t, i));
    const ux = 1460, uy = surf(ux), u = 30, ur = tilt(ux), m = move('walk', t);
    const aL = .75 + .2 * pulse(t, 5), hand = rotP(ux, uy + m.dy * u, ur, -(4.9 + 2.2 * Math.cos(aL)) * u, -(4.5 + 2.2 * Math.sin(aL)) * u);
    const glow = taut > .5, ccol = glow ? GOLD_LT : PAL.ink, segs = [];
    for (let i = 0; i < hooks.length - 1; i++) segs.push(cable(hooks[i][1], hooks[i + 1][0], sag, ccol, glow ? 3.5 : 2.5));
    segs.push(cable(hooks[3][1], hand, sag * .8, ccol, glow ? 3.5 : 2.5));
    if (glow) segs.forEach((s, i) => {                        // current running down the line, one spark per beat
      const q = s[Math.min(12, Math.floor(frac(bpOf(t) + i * .25) * 13))];
      paint(ellPts(q[0], q[1], 16, 16, 12), { fill: GOLD_LT, fillOp: 200, bleed: .3, ink: null });
      paint(ellPts(q[0], q[1], 5, 5, 8), { wash: PAL.cream, ink: null });
    });
    lead(t, ux, uy, u, { ...m, rot: ur, aL, aR: .4 + .5 * p, glow: glow ? .6 + .4 * p : .25 + .75 * p });
    if (t >= zap) sfx('BZZT!', 960, 330, 120, GOLD_LT, t - zap, { life: 1.2, rot: -.06 });
    camEnd();
    beatGlow(t);
  }

  // ---------------- 204.39 – 208.14: Clawd throws the plug; it lands in a socket on the Sun ----------------
  function plugAt(x, y, s, r) {                               // a big three-quarter plug, prongs to the right
    push(); translate(x, y); rotate(r);
    for (const py of [-.22, .22]) paint(rectPts(.45 * s, py * s - .06 * s, .5 * s, .12 * s, 0), { wash: STEEL, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rrPts(-.5 * s, -.4 * s, .95 * s, .8 * s, .15 * s), { wash: PAL.cream, washOp: 255, fill: PAL.clayLt, fillOp: 40, ink: PAL.ink, sw: 1.3 });
    paint(rrPts(-.75 * s, -.17 * s, .3 * s, .34 * s, .06 * s), { wash: STEEL_DK, washOp: 255, ink: PAL.ink, sw: 1 });
    inkLine([[-.1 * s, -.25 * s], [-.1 * s, .25 * s]], 1, soft(PAL.ink, .4), 'inkfine', 0);
    pop();
  }
  function plugShot(t, lt) {
    const p = P(t), jam = barT(111), throwT = jam - 2 * BEAT, aj = t - jam;
    const [shx, shy] = shakeXY(t, 5 * p + (aj > 0 ? 22 * Math.max(0, 1 - aj / .45) : 0));
    camBegin(960 + shx, 540 + shy, 1 + .025 * p + (aj > 0 ? .04 * Math.max(0, 1 - aj / .4) : 0));
    const boost = aj > 0 ? 1 : 0, sx = 1450, sy = 500, sr = 230;
    sky(t, sx, sy, sr * .75); sun(t, sx, sy, sr, boost * (.6 + .4 * p));
    const sock = [sx - sr * .58, sy + 30];                      // the socket plate, on the sun's face
    paint(rrPts(sock[0] - 62, sock[1] - 78, 124, 156, 22), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: 1.4 });
    for (const dy of [-26, 26]) paint(rrPts(sock[0] - 22, sock[1] + dy - 9, 44, 18, 5), { wash: PAL.ink, ink: null });
    const g = { cx: 540, cy: 690, R: 240, rot: ROT(t), tilt: .35, sx, sy, m: -.1 };
    ring(t, g, -1);
    globe(t, g, { bright: aj > 0 ? 1 : .55, boost });
    ring(t, g, 1);
    // Clawd's throw: wind up with the plug overhead, fling on beat 3, follow through
    const u = 22, fx = 540, fy = g.cy - g.R;
    const wind = seg(t, barT(110), throwT), fling = seg(t, throwT, throwT + .2);
    const aR = aj > 0 ? 1.3 + .3 * p : lerp(lerp(.6, 2.3, ease(wind)), .2, ease(fling)), rot = lerp(lerp(0, .22, ease(wind)), -.25, ease(fling)) * (aj > 0 ? 0 : 1);
    const hand = rotP(fx, fy, rot, (4.9 + 2.2 * Math.cos(aR)) * u, -(4.5 + 2.2 * Math.sin(aR)) * u);
    const fly = seg(t, throwT, jam), dest = [sock[0] - 48, sock[1]];
    let pp, pr;
    if (t < throwT) { pp = [hand[0] + 10, hand[1] - 10]; pr = -.3 - .6 * wind; }
    else { const k = fly * .6 + .4 * fly * fly; pp = [lerp(hand[0], dest[0], k), lerp(hand[1], dest[1], k) - 260 * Math.sin(Math.PI * k)]; pr = lerp(-.9, 0, ease(k)); }
    if (aj > 0) pp = dest;
    // the cable comes out of the planet's shoulder and droops to the plug
    const c0 = [g.cx + g.R * Math.cos(-.55), g.cy + g.R * Math.sin(-.55)];
    const csag = aj > 0 ? 40 + 8 * wob(t, 2) : lerp(140, 60, fly);
    const cpts = cable(c0, [pp[0] - 60 * Math.cos(pr), pp[1] - 60 * Math.sin(pr)], csag, aj > 0 ? PAL.ink : PAL.ink, 4.5);
    if (aj > 0) {                                              // power runs from the sun down the cable into the planet
      for (let j = 0; j < 3; j++) { const q = cpts[12 - Math.min(12, Math.floor(frac(bpOf(t) + j / 3) * 13))];
        paint(ellPts(q[0], q[1], 20, 20, 12), { fill: GOLD_LT, fillOp: 220, bleed: .3, ink: null });
        paint(ellPts(q[0], q[1], 6, 6, 8), { wash: PAL.cream, ink: null }); }
    }
    stage(t, fx, fy + 1, u / 2.6);
    lead(t, fx, fy, u, { style: aj > 0 ? 'roof' : 'idle', ...(aj > 0 ? {} : { rot, aR, aL: .3 + .4 * wind }), glow: aj > 0 ? .5 + .5 * p : .25 + .75 * p });
    plugAt(pp[0], pp[1], 110, pr);
    if (aj > 0) sfx('KA-CHUNK!', sock[0] - 40, sock[1] - 170, 96, GOLD_LT, aj, { life: 1.3, rot: -.08 });
    camEnd();
    if (aj > 0 && aj < .4) paint(rectPts(-60, -60, W + 120, H + 120), { wash: GOLD_LT, washOp: 210 * (1 - ease(aj / .4)), ink: null });
    beatGlow(t);
  }

  // ---------------- 208.14 – 211.89: pull back: it's all painted on log-log paper; the line rips through the edge ----------------
  const PAPER = [[150, 140], [1400, 112], [1420, 940], [130, 958]];
  const LA = [150, 905], LS = -.32, EDGE = 1412, lineY = x => LA[1] + LS * (x - LA[0]);
  function tearShot(t, lt, dur) {
    const p = P(t), rip = barT(112) + 3 * BEAT;           // bar 112, beat 4
    const zoom = lerp(1.55, 1, easeOut(seg(t, barT(112), barT(113) + BEAT))) + .025 * p;
    const [shx, shy] = shakeXY(t, 4 * p + (t > rip ? 16 * Math.max(0, 1 - (t - rip) / .35) : 0));
    camBegin(lerp(700, 960, ease(seg(t, barT(112), barT(114)))) + shx, lerp(560, 540, ease(lt / dur)) + shy, zoom);
    // space beyond the page
    paint(rectPts(-900, -900, W + 1800, H + 1800), { wash: DAWN, washOp: 255, fill: PAL.indigo, fillOp: 70, bleed: .2, tex: .5, ink: null });
    for (let i = 0; i < 60; i++) { const x = -500 + hash(i + 200) * (W + 1000), y = -400 + hash(i + 300) * (H + 800), r = 1.5 + 2.5 * hash(i + 400);
      paint(ellPts(x, y, r, r, 6), { wash: PAL.cream, washOp: 110 + 120 * (.5 + .5 * wob(t, .8 + hash(i), hash(i + 1))), ink: null }); }
    // the sheet: cream, a shadow, a log-log grid, and the painting we have been watching
    paint(PAPER.map(([x, y]) => [x + 18, y + 22]), { fill: PAL.ink, fillOp: 110, bleed: .15, ink: null });
    const torn = t > rip, tk = easeOut(seg(t, rip, rip + .3));
    const ey = lineY(EDGE), notch = torn ? [[EDGE + 6, ey - 115 * tk], [EDGE - 60 * tk, ey - 40 * tk], [EDGE - 100 * tk, ey + 6], [EDGE - 55 * tk, ey + 42 * tk], [EDGE + 6, ey + 105 * tk]] : [];
    const sheet = [PAPER[0], PAPER[1], ...(torn ? notch : []), PAPER[2], PAPER[3]];
    paint(sheet, { wash: PAL.paper, washOp: 255, fill: PAL.cream, fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.2 });
    loglog(170, 150, 1395, 935, 410, mixCol(PAL.paper, PAL.teal, .45), .6);
    const sx = 1090, sy = 340;
    paint(ellPts(sx, sy, 210, 190, 28, 6), { fill: GOLD, fillOp: 120, bleed: .3, ink: null });
    sunburst(sx, sy, GOLD_LT, PAL.clayLt, t * .18, 14, 230, 50 + 40 * p);
    paint(ellPts(sx, sy, 86, 86, 30, 2), { wash: SUNC, washOp: 255, fill: PAL.ochre, fillOp: 70, ink: PAL.clayDk, sw: 1 });
    paint(rrPts(sx - 72, sy - 4, 30, 38, 7), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .8 });
    const g = { cx: 520, cy: 610, R: 140, rot: ROT(t), tilt: .35, sx, sy, m: 0 };
    cable([g.cx + g.R * .8, g.cy - g.R * .6], [sx - 74, sy + 15], 50, PAL.ink, 2.4);
    globe(t, g);
    stage(t, g.cx, g.cy - g.R + 1, 9 / 2.6);
    lead(t, g.cx, g.cy - g.R, 9, { style: 'roof' });
    // the line: across the page, then pushing at the edge, then through it and away into space a beat at a time
    const nb = Math.max(0, (t - rip) / BEAT), ext = t < rip ? 0 : (Math.floor(nb) + easeOut(frac(nb) * 2.5)) * 190 + 120 * tk;
    const push0 = t < rip ? 26 * ease(seg(t, rip - BEAT, rip)) : 0, tipX = EDGE - 4 + push0 + ext, tip = [tipX, lineY(tipX)];
    if (!torn && push0 > 1) paint([[EDGE - 2, ey - 40], [EDGE + push0, ey - 6], [EDGE + push0, ey + 8], [EDGE - 2, ey + 40]], { wash: PAL.paper, washOp: 255, ink: PAL.ink, sw: 1 }); // the edge bulges
    const w0 = 10 * (1 + .3 * p);
    const band = (a, b, w) => { const n = [Math.sin(Math.atan(LS)), -Math.cos(Math.atan(LS))]; return [[a[0] + n[0] * w, a[1] + n[1] * w], [b[0] + n[0] * w, b[1] + n[1] * w], [b[0] - n[0] * w, b[1] - n[1] * w], [a[0] - n[0] * w, a[1] - n[1] * w]]; };
    if (torn) { paint(band([EDGE, ey], tip, w0 * 3.2), { wash: GOLD, washOp: 110 + 70 * p, ink: null }); paint(band([EDGE, ey], tip, w0 * 2.2), { wash: GOLD_LT, washOp: 255, ink: null }); }
    paint(band(LA, tip[0] < EDGE ? tip : [EDGE, ey], w0 * 2.4), { fill: GOLD, fillOp: 90, bleed: .25, ink: null });
    paint(band(LA, tip, w0), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 40, ink: PAL.ink, sw: 1 });
    inkLine([[LA[0] + 10, lineY(LA[0] + 10) - w0 * .3], [tip[0] - 8, lineY(tip[0] - 8) - w0 * .3]], 1.2, PAL.clayLt, 'inkfine', 0);
    if (torn) {
      const gg = 46 + 26 * p;
      paint(ellPts(tip[0], tip[1], gg, gg, 18, 3), { wash: GOLD, washOp: 150, ink: null }); paint(ellPts(tip[0], tip[1], gg * .55, gg * .55, 16, 2), { wash: GOLD_LT, washOp: 230, ink: null });
      paint(ellPts(tip[0], tip[1], 13, 13, 12), { wash: PAL.cream, ink: PAL.ink, sw: .7 });
      // curled flaps and paper shreds flying off
      for (const s of [-1, 1]) paint([[EDGE + 6, ey + s * 105 * tk], [EDGE - 58 * tk, ey + s * 38 * tk], [EDGE + 70 * tk, ey + s * (30 + 80 * tk)]], { wash: soft(PAL.paper, .2), washOp: 255, fill: PAL.ochre, fillOp: 40, ink: PAL.ink, sw: .9 });
      const fa = t - rip;
      for (let i = 0; i < 7; i++) { const a = -1.1 + 2.2 * hash(i + 70), v = 260 + 260 * hash(i + 80), x = EDGE + Math.cos(a) * v * fa + 60 * fa, y = ey + Math.sin(a) * v * fa + 140 * fa * fa, s = 9 + 9 * hash(i + 90);
        if (fa < 1.6) paint([[x, y - s], [x + s * 1.2, y + s * .3], [x - s * .5, y + s * .8]].map(([qx, qy]) => rotP(x, y, fa * 6 * (hash(i) - .5), qx - x, qy - y)), { wash: PAL.paper, washOp: 255, ink: PAL.ink, sw: .6 }); }
      sfx('RRRIP!', EDGE + 150, ey + 150, 84, PAL.cream, t - rip, { life: 1.1, rot: .08 });
    }
    // power flicker on the very last beat: the whole frame browns out, only the lights hold on
    const FL = [.0, .75, .1, .8, .3, .85, .5, .9, .6, .92, .75, .93, .85, .95];
    const fi = Math.floor((t - (E - .58)) * 24), fk = fi < 0 ? 0 : FL[Math.min(FL.length - 1, fi)];
    if (fk > 0) {
      paint(rectPts(-900, -900, W + 1800, H + 1800), { wash: '#0E0C1E', washOp: 255 * fk, ink: null });
      lightLine(g, 1); towns(t, g, 1);
      paint(band(LA, tip, w0 * .8), { wash: PAL.clay, washOp: 200 * (1 - .6 * fk), ink: null });
      if (torn) paint(ellPts(tip[0], tip[1], 16, 16, 12), { wash: GOLD_LT, washOp: 230, ink: null });
    }
    camEnd();
    if (fk < .3) beatGlow(t);
  }

  chapter('planet', barT(103), barT(114), [[barT(103), sunrise], [barT(104), helmetShot], [barT(106), desertTowns],
    [barT(108), pylonsShot], [barT(110), plugShot], [barT(112), tearShot]]);
})();
