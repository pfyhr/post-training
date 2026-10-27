// lyrics.js: [start, end, text] for 07 Scaling Laws, from Whisper word timestamps on the release master,
// snapped to the 128.04 BPM grid (first downbeat 0.08 s, bar 1.874 s). Lines marked "by ear" Whisper could not hear.
const LY = [
  // Intro, bars 1-16: the lab chants
  [3.8, 11.2, "Bigger. Bigger. Bigger. Bigger."], [11.3, 18.7, "Bigger. Bigger. Bigger. Bigger."],
  [18.8, 26.2, "Bigger. Bigger. Bigger. Bigger."], [26.3, 30.0, "Bigger. Bigger. Bigger. Bigger."],
  // Verse 1
  [37.3, 43.0, "Ten to the twenty-three, it was cute, it could rhyme"],
  [44.6, 50.5, "Ten to the twenty-five, now it's doing my job part-time"],
  [51.4, 55.3, "Add a zero, add a zero, watch the line stay straight"],
  [55.4, 59.0, "Log-log paper never lied to me, not yet, just wait"],
  // Pre-chorus 1 (kick drops out at 67.56)
  [59.1, 62.7, "They said we'd hit a wall (there is no wall)"],
  [62.8, 66.1, "They said the data's gone (synthesize it all)"],
  [66.2, 70.1, "They said the money's dry (five hundred bil')"],
  [70.2, 75.0, "They said we'd hit a wall..."],
  // Chorus 1
  [75.1, 77.2, "Scaling laws! (bigger, bigger)"],
  [77.3, 81.2, "The loss goes down, the loss goes down"],
  [81.3, 84.5, "Scaling laws! (bigger, bigger)"],
  [84.6, 88.5, "Give me a gigawatt and a desert town"],
  [88.6, 92.3, "A power law's a promise, so keep the power on"],
  [92.4, 94.9, "Scaling laws! (bigger, bigger)"],
  [95.0, 97.8, "'Til the loss is gone"],
  // Verse 2 (pickup into bar 57)
  [103.8, 108.4, "Twenty tokens for a parameter, Chinchilla told me so"],
  [108.4, 112.0, "DeepMind ran the numbers and the old ratio had to go"],
  [112.0, 116.0, "Now think longer, think again, test-time is a new axis, friend"],
  [116.0, 119.1, "Every line we find, we ride it to the end"],
  // Pre-chorus 2 (kick drops out at 127.54)
  [119.2, 122.5, "They said we'd hit a wall (there is no wall)"],
  [122.5, 126.0, "They said the data's gone (synthesize it all)"],
  [126.0, 130.0, "They said the money's dry (five hundred bil')"],
  [130.0, 135.0, "They said we'd hit a wall..."],
  // Chorus 2
  [135.0, 136.9, "Scaling laws! (bigger, bigger)"],
  [137.0, 140.8, "The loss goes down, the loss goes down"],
  [140.9, 144.2, "Scaling laws! (bigger, bigger)"],
  [144.3, 148.2, "Give me a gigawatt and a desert town"],
  [148.3, 152.3, "A power law's a promise, so keep the power on"],
  [152.4, 154.6, "Scaling laws! (bigger, bigger)"],
  [154.7, 157.2, "'Til the loss is gone"],
  // Bridge, whispered
  [160.8, 163.6, "Straight line on the log-log"],
  [164.3, 166.9, "It's not a trend, it's a prophecy"],
  [166.9, 171.0, "Predict the loss of the next one"],
  [171.0, 175.3, "From a thousand times less, and it agrees"],
  [175.5, 181.8, "(bigger... bigger... bigger...)"],                       // by ear
  // Drop / final chorus
  [191.3, 192.3, "Scaling laws! (bigger, bigger)"],
  [192.4, 196.8, "The loss goes down, the loss goes down"],
  [196.9, 199.8, "Scaling laws! (bigger, bigger)"],
  [199.9, 204.2, "Give me a gigawatt and a desert town"],
  [204.3, 207.9, "A power law's a promise, so keep the power on"],
  [208.0, 210.5, "Scaling laws! (bigger, bigger)"],
  [210.6, 212.6, "'Til the loss is gone"],
  [219.4, 234.4, "(Bigger. Bigger. Bigger. Bigger.)"]                     // by ear
];
