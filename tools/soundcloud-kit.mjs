// tools/soundcloud-kit.mjs: build out/soundcloud/ — lossless audio, artwork, and paste-ready text for each upload.
//   node tools/soundcloud-kit.mjs
// Audio: audio/masters/NN-slug.wav → FLAC at the master's own rate (lossless, no resample).
// Art: out/covers/<slug>.png (3000 px) → 2000 px JPEG. Text: liner notes from README, lyrics from album.json.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const album = JSON.parse(readFileSync('album.json', 'utf8'));
const readme = readFileSync('README.md', 'utf8');
const OUT = 'out/soundcloud'; for (const d of ['audio', 'art', 'text']) mkdirSync(`${OUT}/${d}`, { recursive: true });
const coverSlug = slug => slug.replace(/^\d\d-/, '');
const note = num => { const m = readme.match(new RegExp(`\\*\\*${num} · [^*]+\\.\\*\\* ([^\\n]+)`)); return m ? m[1].trim() : ''; };
const GENRE = { '02': 'R&B', '03': 'Surf Pop', '04': 'Dream Pop', '05': 'Hyperpop', '06': 'Bedroom Pop', '07': 'House', '08': 'Electropop', '09': 'Country', '10': 'Piano Ballad' };
const CREDIT = `A fan album after Claude-Pop's "I'm Upping My P(doom)": lyrics by osmarks (2024), recording by deckard (@slimer48484), music video by John Heibel (github.com/JohnHeibel/PDoomVideo). Track 01 is theirs and is not uploaded here; listen to it at https://x.com/slimer48484/status/2097752569212756134`;
const AI = 'Made with AI: original lyrics written for this album with Claude; music and vocals generated with Suno from those lyrics; endings edited by hand from the stems. Cover art painted in code with p5.brush.';
const TAGS = '"fan album" "AI music" Suno Claude-Pop "AI safety" "P(doom)" "post-training"';
const jpg = (src, dst, px = 2000) => execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', '-Z', String(px), src, '--out', dst], { stdio: 'ignore' });

const lines = [];
for (const t of album.tracks) {
  const slug = t.slug, name = `${t.num} ${t.title}`;
  const wav = `audio/masters/${slug}.wav`;
  if (existsSync(wav)) execFileSync('ffmpeg', ['-nostdin', '-hide_banner', '-loglevel', 'error', '-y', '-i', wav, '-c:a', 'flac', `${OUT}/audio/${name}.flac`]);
  const cover = `out/covers/${coverSlug(slug)}.png`; if (existsSync(cover)) jpg(cover, `${OUT}/art/${name}.jpg`);
  const lyr = t.lyrics.split('\n').filter(l => !/^\[.*\]$/.test(l.trim())).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  const desc = `${note(t.num)}\n\nFrom "Post-Training", a Claude-Pop fan album. Track ${t.num} of 10.\n\n${AI}\n\n${CREDIT}\n\nLYRICS\n\n${lyr}`;
  writeFileSync(`${OUT}/text/${name}.txt`, `TITLE\n${t.title}\n\nGENRE\n${GENRE[t.num] || 'Pop'}\n\nTAGS\n${TAGS}\n\nDESCRIPTION (${desc.length} characters)\n${desc}\n`);
  lines.push(`${name}: audio ${existsSync(wav) ? 'yes' : 'MISSING'}, art ${existsSync(cover) ? 'yes' : 'MISSING'}, description ${desc.length} chars`);
}
if (existsSync('out/covers/album.png')) jpg('out/covers/album.png', `${OUT}/art/00 Post-Training (album).jpg`);
if (existsSync('out/covers/portrait.png')) jpg('out/covers/portrait.png', `${OUT}/art/profile.jpg`, 1000);
const tracklist = album.tracks.map(t => `${t.num}. ${t.title}`).join('\n');
writeFileSync(`${OUT}/text/00 album and profile.txt`, `ALBUM (SoundCloud playlist, type: Album)
TITLE
Post-Training

DESCRIPTION
A fan album after Claude-Pop's "I'm Upping My P(doom)". Nine new pop songs sung from inside the AI moment, where nearly every line is a reference someone on the timeline will catch. Sincere feelings, ridiculous vocabulary.

01. I'm Upping My P(doom): the single that started it, by deckard. Not uploaded here: https://x.com/slimer48484/status/2097752569212756134
${tracklist.split('\n').slice(1).join('\n')}

${AI}

${CREDIT}

Each track's description has its story and full lyrics.

TAGS
${TAGS}


PROFILE
DISPLAY NAME
Claude-Pop (fan sessions)

BIO
Fan sessions in the style of Claude-Pop. Not deckard, not affiliated: this is a fan project, made with Claude and Suno, crediting the people who started it on every track. Claude-Pop is deckard's (@slimer48484).
`);
console.log(lines.join('\n'));
