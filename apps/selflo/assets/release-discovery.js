(() => {
  'use strict';
  const ROOT='/apps/selflo/';
  const RELEASE=ROOT+'perspective-library/release/vi/';
  const view=document.body.dataset.libraryView || 'overview';
  const studio=location.pathname.startsWith(ROOT+'studio/');
  const perspectiveBase=studio ? ROOT+'studio/perspectives/' : ROOT+'perspectives/';
  const themeNames={
    adversity_resilience:'Nghịch cảnh',attention:'Chú ý',change_growth:'Thay đổi',
    emotion:'Cảm xúc',meaning_values:'Ý nghĩa',relationships:'Mối quan hệ',
    rest_wellbeing:'Nghỉ ngơi',self_understanding:'Hiểu mình',work_achievement:'Công việc'
  };
  const state={stories:[],quotes:[],revision:null,mode:'all',query:'',visible:12,all:[],storyMap:new Map()};
  const ICON=ROOT+'assets/selflo-icons.svg#';
  const icon=(name)=>'<svg class="selflo-icon" aria-hidden="true"><use href="'+ICON+name+'"></use></svg>';
  const escapeHTML=(value)=>String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const normalize=value=>String(value??'').toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
  const fetchJson=async(path,refresh=false)=>{
    const response=await fetch(RELEASE+path+(refresh?'?v='+Date.now():''),{cache:refresh?'no-store':'default'});
    if(!response.ok)throw new Error('Release: '+path+' (HTTP '+response.status+')');
    return response.json();
  };
  const themeLabel=item=>themeNames[item.theme]||'Góc nhìn';
  const readUrl=id=>ROOT+'perspectives/read/?story='+encodeURIComponent(id);
  const quoteUrl=id=>perspectiveBase+'quotes/?quote='+encodeURIComponent(id);
  function renderStory(item) {
    const artwork=item.image
      ? '<img src="'+escapeHTML(item.image)+'" alt="'+escapeHTML(item.imageAlt)+'" loading="lazy" decoding="async">'
      : '<div class="article-card-art-empty" aria-hidden="true">'+icon('book')+'</div>';
    return '<a class="article-card-link" href="'+readUrl(item.id)+'"><article class="article-card editorial-story-card">'+artwork+
      '<div class="article-card-body"><span class="article-type">'+icon('book')+' Story · '+escapeHTML(themeLabel(item))+'</span>'+
      '<h3>'+escapeHTML(item.title)+'</h3><p>'+escapeHTML(item.subtitle||'')+'</p>'+
      '<span class="article-meta">'+icon('clock')+' '+item.readingMinutes+' phút đọc</span></div></article></a>';
  }
  function renderQuote(item,compact=false) {
    const img=item.image?'<img src="'+escapeHTML(item.image)+'" alt="" loading="lazy" decoding="async">':
      '<div class="quote-fallback-art">'+icon('leaf')+'</div>';
    const attribution=item.author||'Selflo';
    const related=item.storyId&&state.storyMap.has(item.storyId)
      ? '<a class="quote-related" href="'+readUrl(item.storyId)+'">Đọc câu chuyện liên quan '+icon('arrow')+'</a>':'';
    return '<article class="quote-card quote-editorial '+(compact?'quote-compact':'quote-feed-card')+'" data-quote-id="'+escapeHTML(item.id)+'">'+
      '<div class="quote-artwork">'+img+'</div><div class="quote-copy">'+
      '<span class="quote-eyebrow">'+icon('quote')+' '+escapeHTML(themeLabel(item))+'</span>'+
      '<blockquote>'+escapeHTML(item.text)+'</blockquote>'+
      '<div class="quote-bottom"><span class="quote-attribution">— '+escapeHTML(attribution)+'</span>'+
      (compact?'<a class="quote-related" href="'+quoteUrl(item.id)+'">Xem quote '+icon('arrow')+'</a>':related)+'</div>'+
      '</div></article>';
  }
  function sortStories(items) {
    return items.sort((a,b)=>b.reviewTime.localeCompare(a.reviewTime)||a.title.localeCompare(b.title,'vi'));
  }
  async function loadData() {
    const manifest=await fetchJson('manifest.json',true);
    state.revision=manifest.library_revision;
    const artworkDescriptor=manifest.files.find(f=>f.kind==='story_artwork_catalog');
    const artwork=artworkDescriptor?await fetchJson(artworkDescriptor.path):{themes:[]};
    const themeImages=new Map((artwork.themes||[]).map(f=>[f.theme_id,f.file_id]));
    const assets=new Map(manifest.files.filter(f=>f.kind==='image').map(f=>[f.id,f]));
    const imagePath=fileId=>assets.has(fileId)?RELEASE+assets.get(fileId).path:'';
    const storyDescriptors=manifest.files.filter(f=>f.kind==='story');
    const rawStories=await Promise.all(storyDescriptors.map(f=>fetchJson(f.path)));
    state.stories=sortStories(rawStories.map(s=>({
      type:'story',id:s.id,title:s.title_vi||'',subtitle:s.subtitle_vi||'',
      theme:s.primary_theme,readingMinutes:s.metadata?.reading_time_minutes||1,
      reviewTime:s.review?.reviewed_at||'',
      image:imagePath(s.hero_image?.file_id||themeImages.get(s.primary_theme)),
      imageAlt:s.hero_image?.alt_text_vi||''
    })));
    state.storyMap=new Map(state.stories.map(s=>[s.id,s]));
    const quoteDescriptors=manifest.files.filter(f=>f.kind==='quote_pack');
    const rawPacks=await Promise.all(quoteDescriptors.map(f=>fetchJson(f.path)));
    const seen=new Set();
    state.quotes=rawPacks.flatMap(pack=>pack.quotes||[]).sort((a,b)=>
      Number(!!b.display?.featured)-Number(!!a.display?.featured)||
      (b.display?.priority||0)-(a.display?.priority||0)||
      a.id.localeCompare(b.id)
    ).filter(q=>{if(seen.has(q.id))return false;seen.add(q.id);return true}).map(q=>{
      const story=state.storyMap.get(q.story_id);
      return {
        type:'quote',id:q.id,title:q.title_vi||'',text:q.text_vi||'',theme:q.primary_theme,
        storyId:q.story_id||null,
        author:q.display?.attribution_vi||q.authorship?.author_name||'Selflo',
        image:story?.image||imagePath(themeImages.get(q.primary_theme))
      };
    });
    if(state.quotes.length===0||state.stories.length===0)throw Error('Release không có quote hoặc story.');
  }
  function match(items,query) {
    if(!query)return items;
    const term=normalize(query.trim());
    return items.filter(item=>normalize([
      item.title,item.subtitle,item.text,item.author,themeLabel(item)
    ].join(' ')).includes(term));
  }
  function scrollToResults(node){
    if(!node)return;
    node.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    node.querySelector('h2,h1')?.setAttribute('tabindex','-1');
    node.querySelector('h2,h1')?.focus({preventScroll:true});
  }
  function wireOverview() {
    const newest=state.stories.slice(0,3);
    const lifeThemes=new Set(['emotion','relationships','work_achievement','self_understanding','rest_wellbeing']);
    const life=state.stories.filter(s=>!newest.includes(s)&&lifeThemes.has(s.theme)).slice(0,3);
    const storyGrid=document.querySelector('#newestGrid');
    storyGrid.innerHTML=newest.map(renderStory).join('');
    document.querySelector('#reflectionGrid').innerHTML=state.quotes.slice(0,3).map(q=>renderQuote(q,true)).join('');
    document.querySelector('#lifeGrid').innerHTML=(life.length?life:state.stories.slice(3,6)).map(renderStory).join('');
    const feature=document.querySelector('[data-featured-story]');
    const original=state.storyMap.get(feature?.dataset.featuredStory);
    if(feature&&original){
      feature.href=readUrl(original.id);
      feature.querySelector('h2').textContent=original.title;
      feature.querySelector('p').textContent=original.subtitle;
      feature.querySelector('[data-reading-time]').textContent=original.readingMinutes+' phút đọc';
      const image=feature.querySelector('img'); if(image&&original.image){image.src=original.image;image.alt=original.imageAlt;}
    }
    document.querySelectorAll('[data-explore-quotes]').forEach(link=>link.href=perspectiveBase+'quotes/');
    document.querySelectorAll('[data-explore-stories]').forEach(link=>link.href=perspectiveBase+'stories/');
    const all=document.querySelector('#allContent'),grid=document.querySelector('#contentGrid');
    const meta=document.querySelector('#releaseMeta'),title=document.querySelector('#resultsTitle');
    const tabs=[...document.querySelectorAll('[data-search-filter]')];
    let show=12;
    function renderSearch(){
      const source=state.mode==='quote'?state.quotes:state.mode==='story'?state.stories:[...state.stories,...state.quotes];
      const items=match(source,state.query);
      all.hidden=false;
      title.textContent=state.query?'Kết quả tìm kiếm cho “'+state.query+'”':'Tất cả Góc nhìn';
      meta.textContent=items.length+' kết quả · Release '+state.revision;
      grid.classList.toggle('quote-feed',state.mode==='quote');
      grid.innerHTML=items.length?items.slice(0,show).map(it=>it.type==='quote'?renderQuote(it):renderStory(it)).join(''):
        '<div class="empty-state">Không tìm thấy nội dung phù hợp. Hãy thử từ khóa khác.</div>';
      const load=document.querySelector('#searchLoadMore');
      load.hidden=items.length<=show;
      tabs.forEach(tab=>{tab.classList.toggle('active',tab.dataset.searchFilter===state.mode);tab.setAttribute('aria-pressed',String(tab.dataset.searchFilter===state.mode))});
      load.onclick=()=>{show+=12;renderSearch()};
    }
    tabs.forEach(tab=>tab.addEventListener('click',()=>{
      state.mode=tab.dataset.searchFilter;show=12;renderSearch();scrollToResults(all);
    }));
    const search=document.querySelector('#heroContentSearch');
    const searchForm=document.querySelector('#heroSearchForm');
    let timer;
    search.addEventListener('input',()=>{
      clearTimeout(timer);
      timer=setTimeout(()=>{state.query=search.value.trim();show=12;renderSearch()},250);
    });
    searchForm.addEventListener('submit',event=>{
      event.preventDefault();clearTimeout(timer);state.query=search.value.trim();show=12;renderSearch();scrollToResults(all);
    });
    document.querySelector('#clearSearch')?.addEventListener('click',()=>{
      search.value='';state.query='';state.mode='all';show=12;renderSearch();scrollToResults(all);
    });
    const params=new URLSearchParams(location.search);
    if(params.get('q')){search.value=params.get('q');state.query=search.value;renderSearch();scrollToResults(all);}
  }
  function wireCatalog(){
    const isQuote=view==='quotes';
    const heading=document.querySelector('#catalogHeading');
    const grid=document.querySelector('#catalogGrid');
    const count=document.querySelector('#catalogCount');
    const input=document.querySelector('#catalogSearch');
    const filter=document.querySelector('#catalogTheme');
    const button=document.querySelector('#catalogLoadMore');
    const sentinel=document.querySelector('#catalogSentinel');
    state.all=isQuote?state.quotes:state.stories;
    for(const theme of [...new Set(state.all.map(it=>it.theme).filter(Boolean))].sort((a,b)=>themeLabel({theme:a}).localeCompare(themeLabel({theme:b}),'vi'))){
      const option=document.createElement('option');option.value=theme;option.textContent=themeLabel({theme});filter.append(option);
    }
    const params=new URLSearchParams(location.search);input.value=params.get('q')||'';
    let filtered=state.all;
    let busy=false;
    function render(reset=false){
      if(reset)state.visible=12;
      filtered=match(state.all.filter(it=>filter.value==='all'||it.theme===filter.value),input.value);
      const visible=filtered.slice(0,state.visible);
      grid.innerHTML=visible.length?visible.map(it=>isQuote?renderQuote(it):renderStory(it)).join(''):
        '<div class="empty-state">Chưa có nội dung phù hợp với bộ lọc.</div>';
      count.textContent='Đang hiển thị '+visible.length+'/'+filtered.length+' '+(isQuote?'quote':'story')+' · Release '+state.revision;
      button.hidden=filtered.length<=state.visible;
    }
    function loadMore(){
      if(busy||filtered.length<=state.visible)return;
      busy=true;state.visible+=12;render();busy=false;
    }
    input.addEventListener('input',()=>render(true));filter.addEventListener('change',()=>render(true));
    document.querySelector('#catalogForm').addEventListener('submit',event=>{
      event.preventDefault();render(true);
      const url=new URL(location.href);input.value.trim()?url.searchParams.set('q',input.value.trim()):url.searchParams.delete('q');
      history.replaceState(null,'',url);scrollToResults(heading);
    });
    button.addEventListener('click',loadMore);
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))loadMore()},{rootMargin:'160px 0px'});
      observer.observe(sentinel);
    }
    const target=params.get('quote');
    if(isQuote&&target){
      const idx=state.all.findIndex(q=>q.id===target);
      if(idx>=0){state.visible=Math.max(12,idx+1);render();const card=[...grid.querySelectorAll('[data-quote-id]')].find(el=>el.dataset.quoteId===target);scrollToResults(card);}
      else render();
    }else render();
  }
  async function start(){
    try{
      await loadData();
      if(view==='overview')wireOverview();else wireCatalog();
    }catch(error){
      console.error('[Selflo Release Discovery]',error);
      const target=document.querySelector(view==='overview'?'#newestGrid':'#catalogGrid');
      if(target)target.innerHTML='<p class="empty-state" role="alert">Chưa tải được nội dung Release. Vui lòng thử tải lại trang.</p>';
    }
  }
  start();
})();
