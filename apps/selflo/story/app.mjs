const $ = id => document.getElementById(id);
const els = {channel:$('channel'),picker:$('storyPicker'),format:$('format'),theme:$('theme'),fontSize:$('fontSize'),status:$('status'),screen:$('deviceScreen'),scroll:$('readerScroll'),story:$('story'),progress:$('progress'),bookmark:$('bookmark'),sourceBadge:$('readerSourceBadge')};
const bases = {authoring:'../perspective-library/authoring/vi/',release:'../perspective-library/release/vi/'};
const themeNames = {adversity_resilience:'Nhân sinh & trí tuệ',attention:'Chú tâm',change_growth:'Thay đổi & trưởng thành',emotion:'Cảm xúc',meaning_values:'Ý nghĩa & giá trị',relationships:'Mối quan hệ',rest_wellbeing:'Nghỉ ngơi & an lành',self_understanding:'Thấu hiểu bản thân',work_achievement:'Công việc & thành tựu'};
const draftFiles=['draft-v2.json','draft-if-human-v2.json'];
let stories=[];let descriptors=new Map();let artworkByTheme=new Map();let selected=null;

const fetchJSON=async url=>{const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error(`Không tải được ${url} (${response.status})`);return response.json()};
const words=story=>[...(story.sections||[]).flatMap(s=>(s.blocks||[]).filter(b=>b.type!=='part_heading').map(b=>b.text_vi)),story.takeaway?.text_vi,...(story.reflection?.prompts_vi||[]),story.reflection?.closing_vi].filter(Boolean).join(' ').trim().split(/\s+/).length;
const minutes=story=>Math.max(1,Math.ceil(words(story)/220));

async function load(){
  els.status.textContent='Đang tải story…';descriptors=new Map();artworkByTheme=new Map();
  try{
    if(els.channel.value==='draft'){
      stories=await Promise.all(draftFiles.map(fetchJSON));
    }else{
      const base=bases[els.channel.value];const manifest=await fetchJSON(`${base}manifest.json`);
      descriptors=new Map(manifest.files.map(file=>[file.id,file]));
      const artworkDescriptor=manifest.files.find(file=>file.kind==='story_artwork_catalog');
      if(artworkDescriptor){const catalog=await fetchJSON(base+artworkDescriptor.path);artworkByTheme=new Map((catalog.themes||[]).map(item=>[item.theme_id,item]))}
      stories=await Promise.all(manifest.files.filter(file=>file.kind==='story').map(file=>fetchJSON(base+file.path)));
    }
    stories.sort((a,b)=>a.title_vi.localeCompare(b.title_vi,'vi'));
    const requested=new URLSearchParams(location.search).get('id');
    els.picker.replaceChildren(...stories.map(story=>new Option(story.title_vi,story.id)));
    if(stories.some(story=>story.id===requested))els.picker.value=requested;
    selected=stories.find(story=>story.id===els.picker.value)||stories[0];
    render();
  }catch(error){showError(error.message);}
}

function resolveHero(story){
  if(story.hero_image?.preview_path)return story.hero_image.preview_path;
  const descriptor=descriptors.get(story.hero_image?.file_id);
  if(descriptor)return {url:bases[els.channel.value]+descriptor.path,alt:story.hero_image?.alt_text_vi||''};
  if(story.reader_format==='editorial_v2'){
    const mapping=artworkByTheme.get(story.primary_theme);const shared=mapping&&descriptors.get(mapping.file_id);
    if(shared)return {url:bases[els.channel.value]+shared.path,alt:mapping.alt_text_vi||''};
  }
  return null;
}

function render(){
  if(!selected)return showError('Nguồn này chưa có story.');
  const declared=selected.reader_format||'classic_v1';
  const format=els.format.value==='auto'?declared:els.format.value;
  els.screen.dataset.theme=els.theme.value;
  document.documentElement.style.setProperty('--scale',els.fontSize.value);
  els.story.className=format==='editorial_v2'?'editorial':'classic';
  els.story.replaceChildren(format==='editorial_v2'?editorial(selected):classic(selected));
  els.status.textContent=`${format==='editorial_v2'?'Editorial V2':'Classic V1'} · ${words(selected)} từ · ${minutes(selected)} phút`;
  els.sourceBadge.textContent=`${els.channel.options[els.channel.selectedIndex].text} · ${format==='editorial_v2'?'Editorial V2':'Classic V1'} · r${selected.revision||'–'}`;
  els.scroll.scrollTop=0;if(location.hash){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}))}updateProgress();syncURL();
}

function introduction(story,heroAsset){
  const fragment=document.createDocumentFragment();
  if(heroAsset){const hero=document.createElement('div');hero.className='hero';const image=document.createElement('img');image.src=typeof heroAsset==='string'?heroAsset:heroAsset.url;image.alt=typeof heroAsset==='string'?(story.hero_image?.alt_text_vi||''):heroAsset.alt;hero.append(image);fragment.append(hero)}
  const intro=document.createElement('header');intro.className='intro';
  const kicker=document.createElement('p');kicker.className='kicker';kicker.textContent=themeNames[story.primary_theme]||story.primary_theme;
  const title=document.createElement('h1');title.textContent=story.title_vi;
  const subtitle=document.createElement('p');subtitle.className='subtitle';subtitle.textContent=story.subtitle_vi||story.authorship?.source_label||'';
  const meta=document.createElement('div');meta.className='meta';meta.innerHTML=`<span>◷ ${minutes(story)} phút đọc</span><span>◇ ${story.metadata?.story_style==='parable'?'Ngụ ngôn':'Câu chuyện'}</span>`;
  intro.append(kicker,title,subtitle,meta);if(story.opening_quote_vi){const opening=document.createElement('blockquote');opening.className='opening-quote';opening.textContent=story.opening_quote_vi;intro.append(opening)}fragment.append(intro);return fragment;
}

function storyBody(story){const body=document.createElement('div');body.className='story-body';(story.sections||[]).forEach(section=>{const node=document.createElement('section');node.className='story-section';node.id=section.id;if(section.title_vi){const heading=document.createElement('h2');heading.textContent=section.title_vi;node.append(heading)}(section.blocks||[]).forEach(block=>node.append(blockNode(block)));body.append(node)});return body}
function blockNode(block){
  if(block.type==='part_heading'){const part=document.createElement('header');part.id=block.id;part.className='part-heading';const label=document.createElement('p');label.className='part-label';label.textContent=`Phần ${block.part_number}`;const title=document.createElement('h2');title.textContent=block.title_vi||'';part.append(label,title);if(block.subtitle_vi){const subtitle=document.createElement('p');subtitle.className='part-subtitle';subtitle.textContent=block.subtitle_vi;part.append(subtitle)}return part}
  if(block.type==='pull_quote'){const quote=document.createElement('blockquote');quote.className='pull-quote';quote.append(document.createTextNode(block.text_vi||''));if(block.attribution_vi){const cite=document.createElement('cite');cite.textContent=block.attribution_vi;quote.append(cite)}return quote}
  if(block.type==='divider'){const divider=document.createElement('div');divider.className='divider';return divider}
  const node=document.createElement(block.type==='heading'?'h3':'p');node.textContent=block.text_vi||'';if(block.type==='paragraph')node.className=`paragraph paragraph-${block.style||'narrative'}`;return node;
}

function editorial(story){const root=document.createDocumentFragment();root.append(introduction(story,resolveHero(story)),storyBody(story));const zone=document.createElement('div');zone.id='reflection';zone.className='reflection-zone';zone.append(takeaway(story));if(story.reflection?.prompts_vi?.length){const prompts=document.createElement('section');prompts.className='prompts';const heading=document.createElement('h2');heading.textContent='Gợi ý suy ngẫm';const list=document.createElement('ul');story.reflection.prompts_vi.slice(0,2).forEach(text=>{const item=document.createElement('li');item.textContent=text;list.append(item)});prompts.append(heading,list);zone.append(prompts)}if(story.reflection?.closing_vi){const closing=document.createElement('p');closing.className='closing';closing.textContent=story.reflection.closing_vi;zone.append(closing)}root.append(zone);return root}
function classic(story){const root=document.createDocumentFragment();root.append(introduction(story,resolveHero(story)),storyBody(story),takeaway(story));return root}
function takeaway(story){const card=document.createElement('section');card.className='takeaway';const heading=document.createElement('h2');heading.textContent=story.takeaway?.title_vi||'Nhìn lại';const text=document.createElement('p');text.textContent=story.takeaway?.text_vi||'';card.append(heading,text);return card}

function showError(message){const node=$('errorTemplate').content.cloneNode(true);node.querySelector('p').textContent=message;els.story.replaceChildren(node);els.status.textContent='Có lỗi khi tải dữ liệu'}
function updateProgress(){const max=els.scroll.scrollHeight-els.scroll.clientHeight;els.progress.style.width=`${max>0?Math.min(100,els.scroll.scrollTop/max*100):100}%`}
function syncURL(){const url=new URL(location.href);url.searchParams.set('source',els.channel.value);url.searchParams.set('id',selected.id);history.replaceState({},'',url)}

els.channel.addEventListener('change',load);els.picker.addEventListener('change',()=>{selected=stories.find(story=>story.id===els.picker.value);render()});els.format.addEventListener('change',render);els.theme.addEventListener('change',render);els.fontSize.addEventListener('change',render);els.scroll.addEventListener('scroll',updateProgress,{passive:true});els.bookmark.addEventListener('click',()=>{els.bookmark.textContent=els.bookmark.textContent==='♥'?'♧':'♥'});
const source=new URLSearchParams(location.search).get('source');if(['draft','authoring','release'].includes(source))els.channel.value=source;load();
