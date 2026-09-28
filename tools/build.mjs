// tools/build.mjs: regenerate suno/*.txt and album.json from tracks/*.md. Run: node tools/build.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
const CRED = `A fan album after Claude-Pop's "I'm Upping My P(doom)" (lyrics by osmarks, recording by deckard @slimer48484, video by John Heibel / github.com/JohnHeibel/PDoomVideo). This track: original lyrics for the fan album. See CREDITS.md.`;
const album = {
  artist: 'Claude-Pop (fan sessions)', album: 'Post-Training', attribution: CRED, credits: 'CREDITS.md',
  inspired_by: { lyrics: 'osmarks, https://www.youtube.com/watch?v=uEB5E67vcPA', recording: 'deckard (@slimer48484), https://x.com/slimer48484/status/2097752569212756134', video: 'John Heibel, https://github.com/JohnHeibel/PDoomVideo' },
  tracks: [],
};
mkdirSync('suno', { recursive: true });
const grab = (md, re) => (md.match(re) || [, ''])[1].trim();
for (const f of readdirSync('tracks').filter(f => /^\d\d-.*\.md$/.test(f) && !f.startsWith('01')).sort()) {
  const md = readFileSync('tracks/' + f, 'utf8');
  const title = grab(md, /^# \d+ · (.+)$/m), num = f.slice(0, 2), slug = f.replace(/\.md$/, '');
  const style = grab(md, /\*\*Style:\*\* (.+)/), tempo = grab(md, /\*\*Tempo:\*\* (.+?) ·/), key = grab(md, /\*\*Key:\*\* (.+?) ·/);
  const length = grab(md, /\*\*Length:\*\* ~?(.+)/), voice = grab(md, /\*\*Voice:\*\* (.+)/);
  const lyrics = md.split('\n---\n')[1].trim();
  const stylePrompt = `${style} ${tempo}, ${key}. Vocal persona: ${voice}`;
  album.tracks.push({ num, slug, title, style: stylePrompt, tempo, key, length, voice, lyrics });
  writeFileSync(`suno/${slug}.txt`, `TITLE: ${title}\nARTIST: ${album.artist}\nATTRIBUTION: ${CRED}\n\nSTYLE:\n${stylePrompt}\n\nLYRICS:\n${lyrics}\n`);
  console.log(`${num} ${title}: ${lyrics.split('\n').length} lyric lines`);
}
writeFileSync('album.json', JSON.stringify(album, null, 2) + '\n');
