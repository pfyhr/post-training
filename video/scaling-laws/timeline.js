// timeline.js: this song's additions on top of the engine timeline (loaded after it, so these declarations win).
// The engine's METER windows are patched to the three choruses and pdoomAt() now reads as the loss, stepping down
// on the beat. The corner meter is a little log-log chart: the dot slides down a line that never bends.

const BAR = 4 * BEAT;
const bt = n => OFF + n * BEAT;               // time of beat n (0 = first downbeat)
const barT = n => OFF + (n - 1) * BAR;        // time of the downbeat of bar n (1-based, as in STORYBOARD.md)

function cornerMeter(t) {
  for (const [a, b] of METER) {
    if (t < a || t >= b + .3) continue;
    const v = pdoomAt(t), k = backOut((t - a) / .4) * (1 - ease((t - b) / .3));
    if (k < .02) return;
    const x = 1700, y = 70, w = 170, h = 150;
    push(); translate(x, y); scale(k);
    paint(rrPts(0, 0, w, h, 10, 2), { wash: PAL.cream, washOp: 245, ink: PAL.ink, sw: 1.1 });
    for (let i = 1; i < 4; i++) {
      inkLine([[i * w / 4, 8], [i * w / 4, h - 8]], .5, mixCol(PAL.teal, PAL.cream, .45), 'inkfine', 0);
      inkLine([[8, i * h / 4], [w - 8, i * h / 4]], .5, mixCol(PAL.teal, PAL.cream, .45), 'inkfine', 0);
    }
    // loss 3.4 at the top-left down to 1.5 at the bottom-right, on a straight line
    const p = clamp((3.4 - v) / 1.9), px = 18 + p * (w - 36), py = 18 + p * (h - 36);
    inkLine([[14, 14], [w - 14, h - 14]], 2.2, PAL.clay, 'ink', 0);
    paint(ellPts(px, py, 11, 11, 14, 1), { wash: PAL.clayDk, ink: PAL.ink, sw: .8 });
    pop();
    letter('loss ' + v.toFixed(1), x + w / 2, y + h * k + 24, 30 * k, PAL.cream);
  }
}
