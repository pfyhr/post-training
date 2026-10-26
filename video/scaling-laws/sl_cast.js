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
  return { NIGHT, GRID, SAND, STEEL, STEEL_DK, HAT, HAT_DK, HAT_LT, hardHat, HARD, HARD_LAMP, labCoat };
})();
