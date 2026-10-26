// render.mjs: drive studio.html in headless Chrome. Adapted from video/engine/render.mjs for macOS and this song.
// Run from anywhere; paths resolve from this folder. Output goes to out/video/scaling-laws/ at the repo root.
//   node render.mjs --sheet=3.9,4.2,4.6 [--cols=3] [--w=640] [--out=check/c00.jpg]   contact sheet (fast visual check)
//   node render.mjs --stills=0.8,3,23.8 [--out=stills]                               full-res PNG stills
//   node render.mjs --clip=0:30 [--fps=24] [--out=clip.mp4]                          short clip with audio
//   node render.mjs --frames=0:237.2 --workers=4                                     full-res JPEG frames (resumable)
//   node render.mjs --encode [--out=scaling-laws.mp4]                                frames + song → MP4
// --ch=c03_wall[,c04_festival] loads only those chapters. At most SLOTS renders run at once across processes
// (others wait their turn), so several people or agents can check chapters in parallel without swamping the machine.
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, renameSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const CHROME = args.chrome || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DUR = 237.2, fps = +(args.fps || 24);
const OUT = resolve(here, '../../out/video/scaling-laws'), FRAMES_DIR = `${OUT}/frames`;
const AUDIO = resolve(here, '../../audio/masters/07-scaling-laws.flac');
const outPath = def => resolve(OUT, args.out || def);

const run = (cmd, a) => new Promise((ok, bad) => { const p = spawn(cmd, a, { stdio: 'inherit' }); p.on('close', c => c ? bad(new Error(cmd + ' exited ' + c)) : ok()); });

if (args.encode) {
  const out = outPath('scaling-laws.mp4'), n = readdirSync(FRAMES_DIR).filter(f => f.endsWith('.jpg')).length;
  console.log(`encoding ${n} frames → ${out}`);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-stats', '-framerate', String(fps), '-i', `${FRAMES_DIR}/f%05d.jpg`, '-i', AUDIO,
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k',
    '-movflags', '+faststart', '-shortest', out]);
  console.log('wrote ' + out);
  process.exit(0);
}

// a render slot: a lock dir holding our pid; a slot whose process has died is taken over
const SLOTS = +(args.slots || 3), LOCKS = `${OUT}/locks`; mkdirSync(LOCKS, { recursive: true });
const alive = pid => { try { process.kill(pid, 0); return true; } catch { return false; } };
let slot = null;
for (let waited = 0; slot == null; waited++) {
  for (let i = 0; i < SLOTS && slot == null; i++) {
    const d = `${LOCKS}/slot${i}`;
    try { mkdirSync(d); writeFileSync(`${d}/pid`, String(process.pid)); slot = d; }
    catch { let pid = 0; try { pid = +readFileSync(`${d}/pid`, 'utf8'); } catch {} if (pid && !alive(pid)) rmSync(d, { recursive: true, force: true }); }
  }
  if (slot == null) { if (waited % 15 === 0) console.log('waiting for a render slot…'); await new Promise(r => setTimeout(r, 2000)); }
}
const release = () => { try { rmSync(slot, { recursive: true, force: true }); } catch {} };
process.on('exit', release); for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(130));

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--use-angle=metal', '--enable-gpu-rasterization', '--window-size=1920,1080', '--disable-renderer-backgrounding', '--disable-background-timer-throttling']
});
async function openPage(tag = '') {
  const page = await browser.newPage();
  page.on('console', m => { if (['error', 'warn'].includes(m.type())) console.log(`[page${tag}]`, m.text()); });
  page.on('pageerror', e => console.log(`[page error${tag}]`, e.message));
  // the page pulls its fonts from Google Fonts: allow a slow network and retry once rather than lose a long render
  const url = pathToFileURL(resolve(here, 'studio.html')).href + '?render' + (args.ch ? '&ch=' + args.ch : '');
  try { await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 }); }
  catch (e) { console.log(`[page${tag}] ${e.message}, retrying`); await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 }); }
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  return page;
}
const frameOf = async (page, t, type, q) => {
  const url = await page.evaluate((t, type, q) => window.renderAt(t, type, q), t, type, q);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};
const times = s => String(s).split(',').map(Number);

if (args.sheet) {
  const page = await openPage(), out = outPath('check/sheet.jpg'); mkdirSync(dirname(out), { recursive: true });
  const { url, ms } = await page.evaluate((ts, c, w) => window.renderSheet(ts, c, w), times(args.sheet), +(args.cols || 3), +(args.w || 640));
  writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(`${out}  ms/frame: ${ms.join(' ')}`);
} else if (args.stills) {
  const page = await openPage(), out = outPath('stills'); mkdirSync(out, { recursive: true });
  console.log('GPU:', await page.evaluate(() => window.gpuInfo()));
  for (const s of times(args.stills)) {
    const t0 = Date.now(), buf = await frameOf(page, s, 'image/png');
    const f = `${out}/t${s.toFixed(2).replace('.', '_')}.png`; writeFileSync(f, buf);
    console.log(`${f}  ${Date.now() - t0} ms`);
  }
} else if (args.frames) {
  // Parallel, resumable: each worker page pulls the next missing frame index; files are written atomically.
  const [a, b] = String(args.frames).split(':').map(Number), workers = +(args.workers || 4);
  mkdirSync(FRAMES_DIR, { recursive: true });
  const first = Math.round(a * fps), last = Math.min(Math.ceil(DUR * fps) - 1, Math.round(b * fps) - 1);
  const todo = []; for (let i = first; i <= last; i++) { const f = `${FRAMES_DIR}/f${String(i).padStart(5, '0')}.jpg`; if (!existsSync(f) || statSync(f).size < 1000) todo.push(i); }
  console.log(`${todo.length} frames to render (${last - first + 1 - todo.length} already done), ${workers} workers`);
  let next = 0, done = 0; const start = Date.now();
  const work = async w => {
    const page = await openPage('#' + w);
    while (next < todo.length) {
      const i = todo[next++], f = `${FRAMES_DIR}/f${String(i).padStart(5, '0')}.jpg`;
      const buf = await frameOf(page, i / fps, 'image/jpeg', .94);
      writeFileSync(f + '.tmp', buf); renameSync(f + '.tmp', f);
      if (++done % 24 === 0 || done === todo.length) {
        const el = (Date.now() - start) / 1000;
        console.log(`frame ${done}/${todo.length}  ${(el / done * 1000).toFixed(0)} ms/frame effective  eta ${((todo.length - done) * el / done / 60).toFixed(1)} min`);
      }
    }
  };
  await Promise.all(Array.from({ length: workers }, (_, w) => work(w)));
} else {
  // Short clip with audio, rendered in parallel into a temp frame folder, then muxed.
  const [a, b] = args.clip ? String(args.clip).split(':').map(Number) : [0, DUR], workers = +(args.workers || 4);
  const out = outPath('clip.mp4'), tmp = out.replace(/\.mp4$/, '') + '_frames';         // per-output, so clips can't collide
  rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
  const n = Math.round((b - a) * fps), start = Date.now(); let next = 0, done = 0;
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    await new Promise(r => setTimeout(r, w * 1500));          // stagger page loads
    const page = await openPage('#' + w);
    while (next < n) {
      const i = next++; writeFileSync(`${tmp}/c${String(i).padStart(5, '0')}.jpg`, await frameOf(page, a + i / fps, 'image/jpeg', .92));
      if (++done % 48 === 0 || done === n) console.log(`frame ${done}/${n}  ${((Date.now() - start) / done).toFixed(0)} ms/frame effective`);
    }
  }));
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', `${tmp}/c%05d.jpg`, '-ss', String(a), '-t', String(b - a), '-i', AUDIO,
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', out]);
  rmSync(tmp, { recursive: true, force: true });
  console.log(`wrote ${out}`);
}
await browser.close();
