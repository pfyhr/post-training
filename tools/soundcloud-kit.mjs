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
const STYLE = { '02': 'rnb, slowjam, quietstorm, falsetto, romantic, humor, slow, 68bpm', '03': 'surfpop, skapunk, surfrock, carefree, summery, humor, upbeat, 124bpm',
  '04': 'dreampop, yachtrock, softrock, dreamy, wistful, romantic, midtempo, 96bpm', '05': 'hyperpop, poppunk, glitchpop, bratty, chaotic, gleeful, fast, 165bpm, goodhart',
  '06': 'bedroompop, lofi, indiefolk, melancholic, intimate, sad, slow, 78bpm', '07': 'frenchhouse, edm, festival, euphoric, relentless, anthem, uptempo, 128bpm',
  '08': 'electropop, darkpop, whisperpop, eerie, playful, uncanny, midtempo, 92bpm', '09': 'country, americana, outlawcountry, rueful, tender, bittersweet, slow, 70bpm',
  '10': 'pianoballad, ballad, strings, elegiac, tender, dignified, slow, 66bpm' };
const GENRE = { '02': 'R&B & Soul', '03': 'Pop', '04': 'Pop', '05': 'Electronic', '06': 'Indie', '07': 'House', '08': 'Electronic', '09': 'Country', '10': 'Piano' };
const CREDIT = `A fan album after Claude-Pop's "I'm Upping My P(doom)": lyrics by osmarks (2024), recording by deckard (@slimer48484), music video by John Heibel (github.com/JohnHeibel/PDoomVideo). Track 01 is theirs and is not uploaded here; listen to it at https://x.com/slimer48484/status/2097752569212756134`;
const AI = 'Made with AI: original lyrics written for this album with Claude; music and vocals generated with Suno from those lyrics; endings edited by hand from the stems. Cover art painted in code with p5.brush. Fully open source, lyrics, prompts, art and tools: https://github.com/pfyhr/post-training';
const TAGS = 'fanalbum, aimusic, suno, claudepop, aisafety, pdoom, posttraining';
const jpg = (src, dst, px = 2000) => execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', '-Z', String(px), src, '--out', dst], { stdio: 'ignore' });

const lines = [], cards = [];
for (const t of album.tracks) {
  const slug = t.slug, name = `${t.num} ${t.title}`;
  const wav = `audio/masters/${slug}.wav`;
  if (existsSync(wav)) execFileSync('ffmpeg', ['-nostdin', '-hide_banner', '-loglevel', 'error', '-y', '-i', wav, '-c:a', 'flac', `${OUT}/audio/${name}.flac`]);
  const cover = `out/covers/${coverSlug(slug)}.png`; if (existsSync(cover)) jpg(cover, `${OUT}/art/${name}.jpg`);
  // Section labels kept for readers, the Suno production directions after the dash dropped: [Final Chorus – key change] → [Final Chorus]
  const lyr = t.lyrics.split('\n').map(l => l.replace(/^\[(.+?)\s+[–-]\s+[^\]]*\]$/, '[$1]')).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  const story = `${note(t.num)}\n\nFrom "Post-Training", a Claude-Pop fan album. Track ${t.num} of 10.\n\n${AI}\n\n${CREDIT}`;
  const desc = `${story}\n\nLYRICS\n\n${lyr}`;
  writeFileSync(`${OUT}/text/${name}.txt`, `TITLE\n${t.title}\n\nGENRE\n${GENRE[t.num] || 'Pop'}\n\nTAGS\n${TAGS}\n\n` +
    `=== IF SOUNDCLOUD HAS A LYRICS FIELD: paste DESCRIPTION (SHORT) and LYRICS separately ===\n\nDESCRIPTION (SHORT, ${story.length} characters)\n${story}\n\nLYRICS\n${lyr}\n\n` +
    `=== IF THERE IS NO LYRICS FIELD: paste this one instead ===\n\nDESCRIPTION (WITH LYRICS, ${desc.length} characters)\n${desc}\n`);
  cards.push({ num: t.num, title: t.title, file: `${name}.flac`, art: `${name}.jpg`, genre: GENRE[t.num] || 'Pop', tags: `${STYLE[t.num]}, ${TAGS}`, desc });
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
${tracklist}

${AI}

${CREDIT}

Each track's description has its story and full lyrics.

TAGS
${TAGS}


PROFILE
DISPLAY NAME
Claude-Pop (fan sessions)

BIO
Fan sessions in the style of Claude-Pop. Not deckard, not affiliated: this is a fan project, made with Claude and Suno, crediting the people who started it on every track. Claude-Pop is deckard's (@slimer48484). Everything is open source: https://github.com/pfyhr/post-training
`);
// upload.html: one card per track with a copy button on every field, so a failed upload is quick to redo.
const esc = x => x.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const field = (label, val, big) => `<div class="f"><div class="l">${label}<button onclick="cp(this)">copy</button></div>${big ? `<textarea readonly>${esc(val)}</textarea>` : `<input readonly value="${esc(val).replace(/"/g, '&quot;')}">`}</div>`;
const albumTxt = readFileSync(`${OUT}/text/00 album and profile.txt`, 'utf8'), albumDesc = albumTxt.split('\nDESCRIPTION\n')[1].split('\nTAGS\n')[0].trim();
const page = `<!doctype html><meta charset="utf-8"><title>SoundCloud upload sheet</title><style>
:root{--bg:#1b1820;--card:#26222d;--ink:#eee;--mut:#aaa;--acc:#e8aa38}body{margin:0;background:var(--bg);color:var(--ink);font:15px system-ui,sans-serif}
main{max-width:900px;margin:0 auto;padding:16px}h1{font-size:22px}.c{background:var(--card);border-radius:10px;padding:14px;margin:14px 0}.c h2{margin:0 0 6px;font-size:18px}
.meta{color:var(--mut);font-size:13px;margin-bottom:8px}.f{margin:8px 0}.l{display:flex;justify-content:space-between;color:var(--mut);font-size:13px;margin-bottom:3px}
input,textarea{width:100%;box-sizing:border-box;background:#141217;color:var(--ink);border:1px solid #3a3440;border-radius:6px;padding:7px;font:13px ui-monospace,monospace}textarea{height:140px}
button{background:var(--acc);border:0;border-radius:5px;padding:2px 10px;cursor:pointer;font-weight:600}label{display:block;margin-top:6px;color:var(--mut)}
</style><main><h1>SoundCloud upload sheet</h1><p>Upload and save one track at a time, then make the album from the saved tracks. Tick each card when it is saved.</p>
<div class="c"><h2>Profile</h2>${field('Display name', 'Claude-Pop (fan sessions)')}${field('Bio', albumTxt.split('\nBIO\n')[1].trim(), true)}<div class="meta">Avatar: art/profile.jpg</div></div>
${cards.map(c => `<div class="c"><h2>${c.num} · ${c.title}</h2><div class="meta">Audio: audio/${esc(c.file)} · Art: art/${esc(c.art)}</div>
${field('Track title', c.title)}${field('Main artist', 'Claude-Pop (fan sessions)')}${field('Genre', c.genre)}${field('Tags', c.tags)}${field('Description (with lyrics)', c.desc, true)}
<label><input type="checkbox" style="width:auto"> saved on SoundCloud</label></div>`).join('')}
<div class="c"><h2>Album (playlist, type Album)</h2><div class="meta">Art: art/00 Post-Training (album).jpg · add the nine saved tracks in order</div>
${field('Album title', 'Post-Training')}${field('Main artist', 'Claude-Pop (fan sessions)')}${field('Genre', 'Pop')}${field('Tags', TAGS + ', conceptalbum, humor')}${field('Album description', albumDesc, true)}</div>
</main><script>function cp(b){const e=b.parentNode.nextElementSibling;navigator.clipboard.writeText(e.value);b.textContent='copied';setTimeout(()=>b.textContent='copy',1200)}
document.querySelectorAll('input[type=checkbox]').forEach((c,i)=>{try{c.checked=localStorage.getItem('sc'+i)==='1'}catch(e){};c.onchange=()=>{try{localStorage.setItem('sc'+i,c.checked?'1':'0')}catch(e){}}})</script>`;
writeFileSync(`${OUT}/upload.html`, page);
console.log(lines.join('\n'));
