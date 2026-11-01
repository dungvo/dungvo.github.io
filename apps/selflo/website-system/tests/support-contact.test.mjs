import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const appRoot=resolve(import.meta.dirname,'../..');
const paths=[
  'support/index.html',
  'studio/support/index.html',
  'privacy/index.html',
  'studio/privacy/index.html',
  'privacy-policy/index.html'
];
for(const path of paths){
  const html=await readFile(resolve(appRoot,path),'utf8');
  assert.match(html,/mailto:cdung\.vo@gmail\.com/,path+' needs working contact link');
  assert.match(html,/cdung\.vo@gmail\.com/,path+' needs visible email');
  assert.doesNotMatch(html,/support@selflo\.app/,path+' must not retain old address');
}
console.log('Selflo support contact consistency checks passed.');
