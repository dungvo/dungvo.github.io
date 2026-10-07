(() => {
  const base = '../perspective-library/release/vi/';
  const state = { items: [], revision: null };
  const themeNames = {adversity_resilience:'Nghịch cảnh',attention:'Chú ý',change_growth:'Thay đổi',emotion:'Cảm xúc',meaning_values:'Ý nghĩa',relationships:'Mối quan hệ',rest_wellbeing:'Nghỉ ngơi',self_understanding:'Hiểu mình',work_achievement:'Công việc'};
  const esc = value => String(value || '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const clean = value => String(value || '').toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const fetchJson = async path => { const fresh = path === 'manifest.json'; const response = await fetch(base + path + (fresh ? `?check=${Date.now()}` : ''), {cache: fresh ? 'no-store' : 'default'}); if (!response.ok) throw new Error(path); return response.json(); };
  const minutes = item => Math.max(3, Math.round(((item.subtitle || '').length + (item.text || '').length + (item.title || '').length) / 85) + 3);
  const artworkFor = (item, imageMap, themeMap) => base + (imageMap[item.hero_image?.file_id || themeMap[item.primary_theme]] || 'artwork/images/attention-v1.r1.jpg');

  function articleCard(item) {
    return `<a class="article-card-link" href="read/?story=${encodeURIComponent(item.id)}"><article class="article-card"><img src="${esc(item.image)}" alt="" loading="lazy"><div class="article-card-body"><span class="article-type">▧ &nbsp; Story · ${esc(themeNames[item.theme] || 'Góc nhìn')}</span><h3>${esc(item.title)}</h3><p>${esc(item.subtitle || item.text)}</p><span class="article-meta"><span>◷ &nbsp; ${minutes(item)} phút đọc</span><span>♧ &nbsp; Lưu lại</span></span></div></article></a>`;
  }
  function quoteCard(item) {
    const body = `<blockquote>${esc(item.text)}</blockquote><small>${esc(themeNames[item.theme] || 'Suy ngẫm')}</small>`;
    return item.storyId ? `<a class="quote-card" href="read/?story=${encodeURIComponent(item.storyId)}">${body}</a>` : `<article class="quote-card">${body}</article>`;
  }
  function renderEditorial(stories, quotes) {
    const lead = stories.find(item => item.id === 'story.last_time');
    const newest = [lead, ...stories.filter(item => item !== lead)].filter(Boolean).slice(0, 3);
    const lifeThemes = new Set(['emotion','relationships','work_achievement','self_understanding','rest_wellbeing']);
    const life = stories.filter(item => !newest.includes(item) && lifeThemes.has(item.theme)).slice(0, 3);
    document.querySelector('#newestGrid').innerHTML = newest.map(articleCard).join('');
    document.querySelector('#reflectionGrid').innerHTML = quotes.slice(0, 3).map(quoteCard).join('');
    document.querySelector('#lifeGrid').innerHTML = (life.length === 3 ? life : stories.filter(item => !newest.includes(item)).slice(0, 3)).map(articleCard).join('');
  }
  function renderAll(query = '') {
    const all = document.querySelector('#allContent');
    const grid = document.querySelector('#contentGrid');
    const matches = state.items.filter(item => clean(`${item.title} ${item.subtitle} ${item.text} ${themeNames[item.theme]}`).includes(clean(query)));
    all.hidden = false;
    grid.innerHTML = matches.length ? matches.slice(0, 15).map(item => item.type === 'story' ? articleCard(item) : quoteCard(item)).join('') : '<div class="empty-state">Chưa tìm thấy Góc nhìn phù hợp. Hãy thử một từ khóa khác.</div>';
    document.querySelector('#releaseMeta').textContent = `${matches.length} nội dung · Release ${state.revision}`;
  }
  async function load() {
    try {
      const manifest = await fetchJson('manifest.json');
      state.revision = manifest.library_revision;
      const imageMap = Object.fromEntries(manifest.files.filter(file => file.kind === 'image').map(file => [file.id, file.path]));
      const artworkFile = manifest.files.find(file => file.kind === 'story_artwork_catalog');
      const artwork = artworkFile ? await fetchJson(artworkFile.path) : {themes: []};
      const themeMap = Object.fromEntries((artwork.themes || []).map(item => [item.theme_id, item.file_id]));
      const storyResults = await Promise.allSettled(manifest.files.filter(file => file.kind === 'story').map(file => fetchJson(file.path)));
      const packResults = await Promise.allSettled(manifest.files.filter(file => file.kind === 'quote_pack').map(file => fetchJson(file.path)));
      const stories = storyResults.filter(result => result.status === 'fulfilled').map(result => result.value).map(story => ({type:'story',id:story.id,title:story.title_vi,subtitle:story.subtitle_vi,text:story.opening_quote_vi,theme:story.primary_theme,image:artworkFor(story,imageMap,themeMap)}));
      const quotes = packResults.filter(result => result.status === 'fulfilled').flatMap(result => result.value.quotes || []).sort((a,b) => Number(b.display?.featured) - Number(a.display?.featured) || (b.display?.priority || 0) - (a.display?.priority || 0)).map(quote => ({type:'quote',id:quote.id,title:quote.title_vi,text:quote.text_vi,storyId:quote.story_id,theme:quote.primary_theme}));
      state.items = [...stories, ...quotes];
      renderEditorial(stories, quotes);
    } catch (error) {
      document.querySelectorAll('.article-grid,.quote-grid').forEach(grid => { grid.innerHTML = '<div class="empty-state">Chưa thể mở thư viện lúc này. Vui lòng thử tải lại trang.</div>'; });
    }
  }
  document.querySelectorAll('a[href="#allContent"]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); renderAll(); document.querySelector('#allContent').scrollIntoView({behavior:'smooth'}); }));
  document.querySelector('#heroContentSearch')?.addEventListener('input', event => { renderAll(event.target.value); if (event.target.value) document.querySelector('#allContent').scrollIntoView({behavior:'smooth',block:'start'}); });
  load();
})();
