import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const repoRoot = resolve(import.meta.dirname, '../..');
const tools = ['review', 'content-catalog', 'review-matrix', 'story-seed', 'reader', 'knowledge-maze', 'quotes', 'website-preview'];
for (const tool of tools) {
  const html = await readFile(resolve(repoRoot, `studio/${tool}/index.html`), 'utf8');
  assert.match(html, /href="\.\.\/"/, `${tool} needs a route back to Studio`);
}
console.log(`Developer back-navigation passed for ${tools.length} tools.`);
