// sl_cast.js: costumes and colours shared by every chapter of this video, under one global `SL`.
// Each is a clawd() draw hook, (u, sw) => {...}, drawn in Clawd's own frame (feet at 0, u = Clawd's unit).
const SL = (() => {
  const NIGHT = '#1A1F44', GRID = '#3A9C98', SAND = '#D9A15A', STEEL = '#5D6A8C', STEEL_DK = '#3B4466';
  // the lab's hard hat: dome, ridge and a wide brim, so it reads as a hard hat even at choir size
  const HAT = '#F5B700', HAT_DK = '#C47F00', HAT_LT = '#FFE07A';
  const hardHat = (lamp = false) => (u, sw) => {
    const d = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; d.push([Math.cos(a) * 3.9 * u, -8.5 * u + Math.sin(a) * 3.9 * u]); }
    paint(d, { wash: HAT, washOp: 255, fill: HAT_DK, fillOp: 50, tex: .4, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(-1.9 * u, -10.6 * u, .9 * u, 1.3 * u, 14, 0, .5), { wash: HAT_LT, washOp: 200, ink: null });                  // shine
    paint(rrPts(-.75 * u, -12.55 * u, 1.5 * u, 4.1 * u, .7 * u), { wash: HAT_DK, washOp: 255, ink: PAL.ink, sw: sw * .7 });  // ridge
    paint([[-6 * u, -8.75 * u], [6 * u, -8.75 * u], [5.6 * u, -7.95 * u], [-5.6 * u, -7.95 * u]], { wash: HAT, washOp: 255, ink: PAL.ink, sw: sw * .8 }); // brim
    inkLine([[-5.5 * u, -8.1 * u], [5.5 * u, -8.1 * u]], sw * 1.1, HAT_DK, 'ink', 0);                                        // brim underside
    if (lamp) {
      paint(rrPts(-1.1 * u, -10.1 * u, 2.2 * u, 1.3 * u, .4 * u), { wash: STEEL, washOp: 255, ink: PAL.ink, sw: sw * .7 });
      paint(ellPts(0, -9.45 * u, .55 * u, .5 * u, 12), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .5 });
      paint(ellPts(0, -9.45 * u, 2.2 * u, 1.8 * u, 18, 1), { fill: PAL.cream, fillOp: 70, bleed: .3, ink: null });
    }
  };
  const HARD = hardHat(), HARD_LAMP = hardHat(true);
  // the lab coat: a cream coat panel over the body with lapels and a pen in the pocket
  const labCoat = (u, sw) => {
    paint(rectPts(-5.15 * u, -3.7 * u, 10.3 * u, 1.85 * u, u * .05), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .7 });
    inkLine([[-1.2 * u, -3.7 * u], [0, -2.6 * u], [1.2 * u, -3.7 * u]], sw * .6, PAL.ink, 'inkfine', 0);
    paint(rectPts(2.2 * u, -3.4 * u, 1.3 * u, .9 * u, u * .03), { ink: PAL.ink, sw: sw * .5 });
    inkLine([[2.6 * u, -3.75 * u], [2.6 * u, -3.1 * u]], sw * .6, PAL.indigo, 'inkfine', 0);
  };
  // the festival robot helmet (choruses: chapters 4, 7, 9): a low chrome dome from the brow up, a darker rim, a dark
  // visor across the eyes and a neon LED stripe that brightens with `glow` (0..1, use helmetGlow(t)). Kept low so the
  // body still reads underneath. `glint` (0..1) flares a star where a light catches the dome; `tint` adds a coloured
  // reflection (e.g. gold at sunrise).
  const CHROME = '#C9CED8', CHROME_DK = '#8C93A3', VISOR = '#1C1A2E', LED = '#3FF0D8';
  const robotHelmet = (glow = 0, { glint = 0, tint = null } = {}) => (u, sw) => {
    const d = []; for (let i = 0; i <= 20; i++) { const a = Math.PI + i / 20 * Math.PI; d.push([Math.cos(a) * 5.15 * u, -7.6 * u + Math.sin(a) * 3.3 * Math.pow(Math.abs(Math.sin(a)), .35) * u]); }
    d.push([5.15 * u, -7.3 * u], [-5.15 * u, -7.3 * u]);
    paint(d, { wash: CHROME, washOp: 255, fill: CHROME_DK, fillOp: 45, tex: .4, ink: PAL.ink, sw: sw * .9 });
    if (tint) paint(ellPts(2.2 * u, -8.5 * u, 2.4 * u, .55 * u, 16, 0, -.2), { fill: tint, fillOp: 80, bleed: .2, ink: null });
    const hl = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * (1.12 + i * .045); hl.push([Math.cos(a) * 4.1 * u, -7.8 * u + Math.sin(a) * 2.45 * u]); }
    for (let i = 8; i >= 0; i--) { const a = Math.PI * (1.12 + i * .045); hl.push([Math.cos(a) * 3.3 * u, -7.8 * u + Math.sin(a) * 1.85 * u]); }
    paint(hl, { wash: '#F4F6FA', washOp: 235, ink: null, curv: .5 });                                                         // curved highlight
    paint(rectPts(-5.3 * u, -7.95 * u, 10.6 * u, .65 * u, 0), { wash: CHROME_DK, washOp: 255, ink: PAL.ink, sw: sw * .7 });   // lower rim
    paint(rrPts(-5.2 * u, -7.3 * u, 10.4 * u, 2.2 * u, .7 * u), { wash: VISOR, washOp: 255, ink: PAL.ink, sw: sw * .8 });     // visor
    paint(ellPts(0, -6.2 * u, 5.4 * u, 1.05 * u, 18), { fill: LED, fillOp: 40 + 140 * glow, bleed: .25, ink: null });
    paint(rrPts(-4.4 * u, -6.45 * u, 8.8 * u, .5 * u, .25 * u), { wash: mixCol('#1F8F86', LED, .35 + .65 * glow), washOp: 255, ink: null });
    if (glow > .4) paint(rrPts(-4.1 * u, -6.33 * u, 8.2 * u, .22 * u, .1 * u), { wash: '#E9FFFB', washOp: 255 * (glow - .4) / .6, ink: null });
    if (glint > .03) {
      const r = (1.2 + 2.2 * glint) * u;
      paint(ellPts(-2.6 * u, -9.8 * u, r * .9, r * .9, 16), { fill: '#FFE07A', fillOp: 140 * glint, bleed: .3, ink: null });
      paint(starPts(-2.6 * u, -9.8 * u, r, .16, 4, glint * .6), { wash: '#FFFBEA', washOp: 255, ink: null });
    }
  };
  const helmetGlow = t => .25 + .75 * pulse(t, 5);
  // the helmet is painted after the arms, so arms raised above ~.35 rad get painted again on top (engine arm geometry);
  // call with the same ground point, unit and options as the clawd() call
  function overArm(x, y, u, side, a, o, len = 2.2) {
    push(); translate(x, y + (o.dy || 0) * u); if (o.rot) rotate(o.rot); scale((o.sx ?? 1) * (1 + (o.sq || 0) * .6), 1 - (o.sq || 0));
    translate(side * 4.9 * u, -4.5 * u); rotate(side < 0 ? a : -a);
    paint(rrPts(side < 0 ? -len * u : 0, -.5 * u, len * u, u, .3 * u), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: clamp(u / 15, .45, 2.4) * .8 });
    pop();
  }
  // a Clawd in the robot helmet, with raised arms kept on top of it
  const robotClawd = (t, x, y, u, o = {}) => {
    clawd(x, y, u, { draw: robotHelmet(o.glow ?? helmetGlow(t), o.helmet), ...o });
    for (const [side, a] of [[-1, o.aL ?? .2], [1, o.aR ?? .2]]) if (a > .35) overArm(x, y, u, side, a, o);
  };
  // a choir mouth driven by the vocal track (vox.js); seed staggers singers by a few ms so the choir isn't a single sprite
  const sing = (t, seed = 0) => { const v = VOX(t + .03 * (hash(seed) - .5)); return v > .55 ? 'O' : v > .3 ? 'o' : 'flat'; };
  return { sing, robotHelmet, helmetGlow, overArm, robotClawd, NIGHT, GRID, SAND, STEEL, STEEL_DK, HAT, HAT_DK, HAT_LT, hardHat, HARD, HARD_LAMP, labCoat };
})();
