// tools/eleven-music.mjs: generate a track with the ElevenLabs Music API from album.json.
//   ELEVENLABS_API_KEY=... node tools/eleven-music.mjs 02            compose → audio/02-<slug>-eleven-<n>.mp3
//   node tools/eleven-music.mjs 02 --dry                              print the composition plan, call nothing
//   node tools/eleven-music.mjs 02 --plan                             ask ElevenLabs for its own plan (free), save it, no audio
//   node tools/eleven-music.mjs 02 --from=audio/02-...plan.json       compose from a saved/edited plan
//   options: --model=music_v2_5 (default) | music_v2 | music_v1   --takes=1   --seed=N
// The plan is built from the [Section] tags in the lyrics: one section per tag, lines as written, duration from the
// line count and tempo. Bracketed directions after a dash ("[Outro – spoken, fading]") become local styles.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const num = args.find(a => /^\d\d$/.test(a));
const opt = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
if (!num) { console.error('usage: node tools/eleven-music.mjs <NN> [--dry|--plan|--from=plan.json] [--model=..] [--takes=N] [--seed=N]'); process.exit(1); }

const album = JSON.parse(readFileSync('album.json', 'utf8'));
const track = album.tracks.find(t => t.num === num);
if (!track) { console.error(`no track ${num} in album.json`); process.exit(1); }
const slug = track.slug;
const bpm = parseFloat(track.tempo) || 100;
const targetMs = (() => { const m = track.length.match(/(\d+):(\d+)/); return m ? (60 * +m[1] + +m[2]) * 1000 : 210000; })();

// ---- style words: split the prose style prompt into short tags ElevenLabs likes ----
const styleTags = track.style.replace(/Vocal persona:.*$/, '').split(/[.,;]| meets /).map(s => s.trim().replace(/^and /, '')).filter(s => s && s.length < 60 && !/^Vocal persona/.test(s));
const negatives = ['low quality', 'distorted vocals', 'off-key', 'muddy mix'];

// ---- sections from [Tag – directions] blocks ----
function buildPlan() {
  const blocks = track.lyrics.split(/\n(?=\[)/).map(b => b.trim()).filter(Boolean);
  const sections = blocks.map(b => {
    const m = b.match(/^\[([^\]]+)\]\n?([\s\S]*)$/);
    const [name, ...dir] = m[1].split(/\s[–-]\s/);
    const lines = m[2].split('\n').map(l => l.trim()).filter(Boolean).slice(0, 30).map(l => l.slice(0, 200));
    const spoken = /spoken|whisper/i.test(m[1]);
    const beatsPerLine = spoken ? 6 : /chorus/i.test(name) ? 8 : 8;
    let ms = Math.round(lines.length * beatsPerLine * 60000 / bpm);
    if (/intro|outro/i.test(name)) ms += 4000;                 // room for the band to breathe
    if (!lines.length) ms = 8000;
    return { section_name: name.trim().slice(0, 100), positive_local_styles: dir.join(', ').split(/,\s*/).filter(Boolean), negative_local_styles: [], duration_ms: Math.min(120000, Math.max(3000, ms)), lines };
  });
  // scale to the target length, staying inside 3–120 s per section and 10 min total
  const total = sections.reduce((a, s) => a + s.duration_ms, 0), k = Math.min(600000, targetMs) / total;
  for (const s of sections) s.duration_ms = Math.min(120000, Math.max(3000, Math.round(s.duration_ms * k / 500) * 500));
  return { positive_global_styles: styleTags, negative_global_styles: negatives, sections };
}

const plan = opt.from ? JSON.parse(readFileSync(opt.from, 'utf8')) : buildPlan();
const planTotal = plan.sections.reduce((a, s) => a + s.duration_ms, 0);
const summary = plan.sections.map(s => `  ${s.section_name.padEnd(14)} ${(s.duration_ms / 1000).toFixed(1).padStart(6)} s  ${s.lines.length} lines${s.positive_local_styles.length ? '  [' + s.positive_local_styles.join(', ') + ']' : ''}`).join('\n');
console.log(`${track.num} ${track.title}  (${bpm} BPM, target ${(targetMs / 1000).toFixed(0)} s, plan ${(planTotal / 1000).toFixed(0)} s)\n  styles: ${plan.positive_global_styles.join(' · ')}\n${summary}`);
if (opt.dry) process.exit(0);

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.error('set ELEVENLABS_API_KEY (or use --dry)'); process.exit(1); }
const model = opt.model || 'music_v2_5';
const H = { 'xi-api-key': KEY, 'content-type': 'application/json' };
mkdirSync('audio', { recursive: true });

if (opt.plan) {
  // Let ElevenLabs write the plan from our style + lyrics (no credits). Useful to compare against ours.
  const prompt = `${track.style}\n\nUse exactly these lyrics, in this order and structure:\n${track.lyrics}`;
  const r = await fetch('https://api.elevenlabs.io/v1/music/plan', { method: 'POST', headers: H, body: JSON.stringify({ prompt, music_length_ms: Math.min(600000, targetMs), model_id: model }) });
  if (!r.ok) { console.error(r.status, await r.text()); process.exit(1); }
  const f = `audio/${slug}-eleven.plan.json`; writeFileSync(f, JSON.stringify(await r.json(), null, 2)); console.log('wrote ' + f + '  (edit it, then --from=' + f + ')');
  process.exit(0);
}

const takes = +(opt.takes || 1);
for (let i = 1; i <= takes; i++) {
  let n = 1; while (existsSync(`audio/${slug}-eleven-${n}.mp3`)) n++;
  const body = { composition_plan: plan, model_id: model, output_format: 'mp3_44100_192' };
  if (opt.seed) body.seed = +opt.seed + i - 1;
  const t0 = Date.now();
  const r = await fetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192', { method: 'POST', headers: H, body: JSON.stringify(body) });
  if (!r.ok) { console.error(r.status, await r.text()); process.exit(1); }
  const out = `audio/${slug}-eleven-${n}.mp3`;
  writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  writeFileSync(`audio/${slug}-eleven-${n}.plan.json`, JSON.stringify(plan, null, 2));
  console.log(`wrote ${out}  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}
