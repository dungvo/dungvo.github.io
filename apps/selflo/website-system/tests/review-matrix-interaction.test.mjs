import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const html=await readFile(resolve(import.meta.dirname,'../../studio/review-matrix/index.html'),'utf8');
const tests=[
  [/class="quote-card \$\{active\?\.id===x\.id/, 'selected-card class'],
  [/data-id="\$\{esc\(x\.id\)\}" tabindex="0"/,'focusable selectable card'],
  [/function clearDetail\(\)/,'empty filter clears detail'],
  [/function syncDetail\(\)/,'selection follows filters'],
  [/renderList\(\);syncDetail\(\)/,'filter change synchronizes detail'],
  [/const selected=filtered\(\)\.find/,'selection constrained to current filtered rows'],
  [/addEventListener\('keydown'/,'keyboard selection'],
  [/AI review chưa đạt/,'explicit AI review labeling'],
  [/dReviewReason/,'reason in detail panel']
];
for(const [pattern,description] of tests)assert.match(html,pattern,description);
console.log('Review Matrix UI guard tests passed:',tests.length);
