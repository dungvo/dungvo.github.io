(() => {
  const base = '../perspective-library/release/vi/';
  const state = { stories: [], quotes: [], items: [], revision: null, quoteFiles: [], allQuotesPromise: null };
  const themeNames = {adversity_resilience:'Nghịch cảnh',attention:'Chú ý',change_growth:'Thay đổi',emotion:'Cảm xúc',meaning_values:'Ý nghĩa',relationships:'Mối quan hệ',rest_wellbeing:'Nghỉ ngơi',self_understanding:'Hiểu mình',work_achievement:'Công việc'};
  const esc = value => String(value || '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const clean = value => String(value || '').toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const fetchJson = async path => { const fresh = path === 'manifest.json'; const response = await fetch(base + path + (fresh ? `?check=${Date.now()}` : ''), {cache: fresh ? 'no-store' : 'default'}); if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`); return response.json(); };
  const requireStory = story => {
    const missing = [];
    if (!story?.id) missing.push('id');
    if (!story?.title_vi) missing.push('title_vi');
    if (!story?.primary_theme) missing.push('primary_theme');
    if (!Number.isInteger(story?.metadata?.reading_time_minutes) || story.metadata.reading_time_minutes < 1 || story.metadata.reading_time_minutes > 180) missing.push('metadata.reading_time_minutes (integer 1...180)');
    if (missing.length) throw new Error(`Payload story không hợp lệ (${story?.id || 'không có id'}): ${missing.join(', ')}`);
    return story;
  };
  const artworkFor = (item, imageMap, themeMap) => {
    const fileId = item.hero_image?.file_id || themeMap[item.primary_theme];
    return fileId && imageMap[fileId] ? base + imageMap[fileId] : '';
  };

  function articleCard(item) {
    const art = item.image ? `<img src="${esc(item.image)}" alt="${esc(item.imageAlt || '')}" loading="lazy">` : '<div class="article-card-art-empty" aria-hidden="true"></div>';
    return `<a class="article-card-link" href="read/?story=${encodeURIComponent(item.id)}"><article class="article-card">${art}<div class="article-card-body"><span class="article-type">▧ &nbsp; Story · ${esc(themeNames[item.theme] || 'Góc nhìn')}</span><h3>${esc(item.title)}</h3><p>${esc(item.subtitle || item.text)}</p><span class="article-meta"><span>◷ &nbsp; ${item.readingMinutes} phút đọc</span></span></div></article></a>`;
  }
  function quoteCard(item) {
    const body = `<blockquote>${esc(item.text)}</blockquote><small>${esc(themeNames[item.theme] || 'Suy ngẫm')}</small>`;
    return item.storyId ? `<a class="quote-card" href="read/?story=${encodeURIComponent(item.storyId)}">${body}</a>` : `<article class="quote-card">${body}</article>`;
  }
  function mapQuotes(packs) {
    return packs.flatMap(pack => pack.quotes || []).sort((a,b) => Number(b.display?.featured) - Number(a.display?.featured) || (b.display?.priority || 0) - (a.display?.priority || 0)).map(quote => ({type:'quote',id:quote.id,title:quote.title_vi,text:quote.text_vi,storyId:quote.story_id,theme:quote.primary_theme}));
  }
  function syncItems() { state.items = [...state.stories, ...state.quotes]; }
  function updateFeatured() {
    const link = document.querySelector('[data-featured-story]');
    if (!link) return;
    const story = state.stories.find(item => item.id === link.dataset.featuredStory);
    if (!story) throw new Error(`Featured story không có trong Release: ${link.dataset.featuredStory}`);
    link.href = `read/?story=${encodeURIComponent(story.id)}`;
    link.querySelector('h2').textContent = story.title;
    link.querySelector('p').textContent = story.subtitle || story.text || '';
    link.querySelector('[data-reading-time]').textContent = `◷ ${story.readingMinutes} phút đọc`;
    const image = link.querySelector('img');
    if (image && story.image) { image.src = story.image; image.alt = story.imageAlt || ''; }
  }
  function renderEditorial() {
    const lead = state.stories.find(item => item.id === 'story.last_time');
    const newest = [lead, ...state.stories.filter(item => item !== lead)].filter(Boolean).slice(0, 3);
    const lifeThemes = new Set(['emotion','relationships','work_achievement','self_understanding','rest_wellbeing']);
    const life = state.stories.filter(item => !newest.includes(item) && lifeThemes.has(item.theme)).slice(0, 3);
    document.querySelector('#newestGrid').innerHTML = newest.map(articleCard).join('');
    document.querySelector('#reflectionGrid').innerHTML = state.quotes.slice(0, 3).map(quoteCard).join('');
    document.querySelector('#lifeGrid').innerHTML = (life.length === 3 ? life : state.stories.filter(item => !newest.includes(item)).slice(0, 3)).map(articleCard).join('');
  }
  function renderAll(query = '') {
    const all = document.querySelector('#allContent');
    const grid = document.querySelector('#contentGrid');
    const matches = state.items.filter(item => clean(`${item.title} ${item.subtitle} ${item.text} ${themeNames[item.theme]}`).includes(clean(query)));
    all.hidden = false;
    grid.innerHTML = matches.length ? matches.slice(0, 15).map(item => item.type === 'story' ? articleCard(item) : quoteCard(item)).join('') : '<div class="empty-state">Chưa tìm thấy Góc nhìn phù hợp. Hãy thử một từ khóa khác.</div>';
    document.querySelector('#releaseMeta').textContent = `${matches.length} nội dung · Release ${state.revision}`;
  }
  async function loadInitialQuotes() {
    const packs = [];
    for (const file of state.quoteFiles) {
      packs.push(await fetchJson(file.path));
      if (mapQuotes(packs).length >= 3) break;
    }
    state.quotes = mapQuotes(packs);
    syncItems();
  }
  async function ensureAllQuotesLoaded() {
    if (state.allQuotesPromise) return state.allQuotesPromise;
    state.allQuotesPromise = Promise.all(state.quoteFiles.map(file => fetchJson(file.path))).then(packs => {
      state.quotes = mapQuotes(packs);
      syncItems();
    }).catch(error => {
      state.allQuotesPromise = null;
      throw error;
    });
    return state.allQuotesPromise;
  }
  async function load() {
    try {
      const manifest = await fetchJson('manifest.json');
      state.revision = manifest.library_revision;
      const imageMap = Object.fromEntries(manifest.files.filter(file => file.kind === 'image').map(file => [file.id, file.path]));
      const artworkFile = manifest.files.find(file => file.kind === 'story_artwork_catalog');
      const artwork = artworkFile ? await fetchJson(artworkFile.path) : {themes: []};
      const themeMap = Object.fromEntries((artwork.themes || []).map(item => [item.theme_id, item.file_id]));
      state.quoteFiles = manifest.files.filter(file => file.kind === 'quote_pack');
      const rawStories = await Promise.all(manifest.files.filter(file => file.kind === 'story').map(file => fetchJson(file.path)));
      state.stories = rawStories.map(requireStory).map(story => ({type:'story',id:story.id,title:story.title_vi,subtitle:story.subtitle_vi,text:story.opening_quote_vi,theme:story.primary_theme,readingMinutes:story.metadata.reading_time_minutes,image:artworkFor(story,imageMap,themeMap),imageAlt:story.hero_image?.alt_vi || ''}));
      await loadInitialQuotes();
      updateFeatured();
      renderEditorial();
    } catch (error) {
      console.error('[Selflo Perspectives]', error);
      document.querySelectorAll('.article-grid,.quote-grid').forEach(grid => { grid.innerHTML = '<div class="empty-state">Dữ liệu Góc nhìn chưa hợp lệ hoặc chưa thể tải. Vui lòng thử lại sau.</div>'; });
    }
  }
  document.querySelectorAll('a[href="#allContent"]').forEach(link => link.addEventListener('click', async event => {
    event.preventDefault();
    try { await ensureAllQuotesLoaded(); renderAll(); } catch (error) { console.error('[Selflo Perspectives]', error); renderAll(); }
    document.querySelector('#allContent').scrollIntoView({behavior:'smooth'});
  }));
  let searchTimer;
  document.querySelector('#heroContentSearch')?.addEventListener('input', event => {
    const query = event.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(async () => {
      try { await ensureAllQuotesLoaded(); } catch (error) { console.error('[Selflo Perspectives]', error); }
      renderAll(query);
      if (query) document.querySelector('#allContent').scrollIntoView({behavior:'smooth',block:'start'});
    }, 180);
  });
  load();
})();
