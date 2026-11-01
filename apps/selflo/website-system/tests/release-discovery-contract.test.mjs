import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {Script} from 'node:vm';

const root=resolve(import.meta.dirname,'../..');
const release=resolve(root,'perspective-library/release/vi');
const manifest=JSON.parse(await readFile(resolve(release,'manifest.json'),'utf8'));
const descriptors=manifest.files||[];
const stories=descriptors.filter(f=>f.kind==='story');
const quotePacks=descriptors.filter(f=>f.kind==='quote_pack');
const images=new Set(descriptors.filter(f=>f.kind==='image').map(f=>f.id));
assert.ok(stories.length>=22,'public Release should retain its released stories');
assert.ok(quotePacks.length>=9,'public Release should retain all theme quote packs');
const storyIDs=new Set(stories.map(f=>f.id));
let storyBlocks=0;
const supported=new Set(['part_heading','paragraph','pull_quote','statement','dialogue','divider','sequence','list','verse','aside','source_note','figure']);
for(const descriptor of stories){
  const story=JSON.parse(await readFile(resolve(release,descriptor.path),'utf8'));
  assert.equal(story.id,descriptor.id,descriptor.path);
  assert.ok(story.title_vi && Array.isArray(story.sections) && story.sections.length,'complete story sections: '+story.id);
  assert.ok(Number.isInteger(story.metadata?.reading_time_minutes),'reading time: '+story.id);
  if(story.hero_image?.file_id)assert.ok(images.has(story.hero_image.file_id),'missing Story hero: '+story.id);
  for(const section of story.sections){
    assert.ok(Array.isArray(section.blocks) && section.blocks.length,'empty story section: '+story.id);
    for(const block of section.blocks){
      assert.ok(supported.has(block.type),'Reader does not support '+block.type+' in '+story.id);
      if(block.type==='figure')assert.ok(images.has(block.image?.file_id||block.file_id),'missing figure in '+story.id);
      storyBlocks++;
    }
  }
  for(const id of story.metadata?.related_content_ids||[])assert.ok(storyIDs.has(id),'Related story not released: '+id);
}
const quoteIDs=new Set();
let quoteCount=0;
for(const pack of quotePacks){
  const data=JSON.parse(await readFile(resolve(release,pack.path),'utf8'));
  for(const quote of data.quotes||[]){
    assert.ok(quote.id && quote.text_vi,'Quote must have full text and stable ID');
    assert.ok(!quoteIDs.has(quote.id),'duplicate Quote '+quote.id);
    quoteIDs.add(quote.id);quoteCount++;
  }
}
assert.ok(quoteCount>=385,'all published Quote packs must be addressable');
const runtime=await readFile(resolve(root,'assets/release-discovery.js'),'utf8');
new Script(runtime,{filename:'release-discovery.js'});
assert.match(runtime,/const RELEASE=ROOT\+'perspective-library\/release\/vi\/'/);
assert.match(runtime,/IntersectionObserver/,'Quote feed supports incremental scroll');
assert.match(runtime,/scrollToResults\(all\)/,'search submit scrolls to results');
assert.doesNotMatch(runtime,/slice\(0,\s*15\)/,'catalog may not cut off at 15');
const knowledge=await readFile(resolve(root,'assets/knowledge-reader-v1.js'),'utf8');
new Script(knowledge,{filename:'knowledge-reader-v1.js'});
assert.doesNotMatch(knowledge,/perspective-library\/source\/vi/,'Knowledge public cannot read Source');
assert.match(knowledge,/manifest\.json/,'Knowledge is Release manifest driven');
assert.ok(storyIDs.has('story.why_ai_feels_easier_to_ask'),'Knowledge article is in Release');
for(const channel of ['', 'studio/']){
  const overview=await readFile(resolve(root,channel+'perspectives/index.html'),'utf8');
  assert.match(overview,/assets\/release-discovery\.js\?v=1/,channel+' shared script');
  assert.match(overview,/id="heroSearchForm"/,channel+' searchable header');
  assert.match(overview,/data-explore-quotes/,channel+' quote link');
  assert.match(overview,/data-explore-stories/,channel+' story link');
  assert.doesNotMatch(overview,/<script[^>]+perspectives-v3\.js/,'legacy duplicate script still active');
  for(const kind of ['quotes','stories']){
    const html=await readFile(resolve(root,channel+'perspectives/'+kind+'/index.html'),'utf8');
    assert.match(html,/assets\/release-discovery\.js\?v=1/,channel+kind+' same runtime');
    assert.match(html,new RegExp('data-library-view="'+kind+'"'));
    assert.match(html,/id="catalogSentinel"/,kind+' has lazy scroll anchor');
    assert.match(html,/id="catalogLoadMore"/,kind+' has accessible fallback');
  }
}
const builder=await readFile(resolve(root,'website-system/scripts/build-studio.mjs'),'utf8');
new Script(builder.replaceAll(/^import .*?;$/gm,'').replace('import.meta.dirname',"'tests'"),{filename:'studio-build.mjs'});
assert.match(builder,/publicSearch/,'Studio build must preserve shared search header');
assert.doesNotMatch(builder,/studio\/assets\/perspectives-v3\.js/);
console.log('Release discovery contract verified:',stories.length,'complete Stories,',storyBlocks,'blocks,',quoteCount,'Quotes; Public/Studio parity.');
