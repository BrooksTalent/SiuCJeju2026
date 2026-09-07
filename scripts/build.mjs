import { readFile, access, mkdir, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import './render-cafes.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'opening.html', 'journal.html', 'cafes.html', 'style-guide.html', 'stay.html', 'weather.html', 'food.html', 'notes.html', ...Array.from({length:5}, (_,i)=>`day${i+1}.html`)];
const files = [...pages, 'styles.css', 'cafes.css', 'journal.js', 'cover-music.css', 'cover-music.js', 'assets/cover-music.mp3', 'docs/濟州小詩生日之旅.md', 'assets/jeju-cover.png', '.nojekyll'];
for (const page of pages) {
  const html = await readFile(resolve(root, page), 'utf8');
  if (!html.includes('lang="zh-Hant"') || !html.includes('name="viewport"')) throw new Error(`Missing language or viewport: ${page}`);
  for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|#|mailto:|tel:)/.test(link)) continue;
    await access(resolve(root, link));
  }
}
const png = await readFile(resolve(root, 'assets/jeju-cover.png'));
if (png.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error('Invalid cover PNG');
console.log(`Cover dimensions: ${png.readUInt32BE(16)} × ${png.readUInt32BE(20)}`);
for (const file of files) {
  const output = resolve(root, 'dist', file);
  await mkdir(dirname(output), {recursive: true});
  await copyFile(resolve(root, file), output);
}
console.log(`Validated ${pages.length} pages, local links and cover image. Static site ready in dist/.`);
