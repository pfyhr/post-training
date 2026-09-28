// video/covers/render.mjs: node render.mjs album scaling-laws ...  → out/covers/<name>.png (3000x3000)
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url)), outDir = resolve(here, '../../out/covers'); mkdirSync(outDir, { recursive: true });
const names = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 0,
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--use-angle=metal', '--enable-gpu-rasterization'] });
for (const name of names) {
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('[page error]', e.message)); page.on('console', m => { if (['error', 'warn'].includes(m.type())) console.log('[page]', m.text()); });
  await page.goto(pathToFileURL(resolve(here, 'cover.html')).href + '?render&cover=' + name, { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  const t0 = Date.now(), url = await page.evaluate(() => window.renderAt(0, 'image/png'));
  writeFileSync(`${outDir}/${name}.png`, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(`${outDir}/${name}.png  ${Date.now() - t0} ms`); await page.close();
}
await browser.close();
