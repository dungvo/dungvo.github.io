const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const clean = value => String(value ?? '').toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const get = url => fetch(url, {cache:'no-store'}).then(response => { if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`); return response.json(); });

const config = await get('features.v1.json');
const enabled = new Map(config.features.filter(feature => feature.studio_preview).map(feature => [feature.id, feature]));
const manifest = await get('../../perspective-library/release/vi/manifest.json');
const storyFiles = manifest.files.filter(file => file.kind === 'story');
const stories = await Promise.all(storyFiles.map(file => get(`../../perspective-library/release/vi/${file.path}`)));
const storiesByID = new Map(stories.map(story => [story.id, story]));
const seriesData = enabled.has('story_series') ? await get(enabled.get('story_series').data_url) : {series:[]};
const analysisData = enabled.has('content_analysis') ? await get(enabled.get('content_analysis').data_url) : {items:[]};

$('featureBadges').innerHTML = config.features.map(feature => `<span class="feature ${feature.studio_preview ? 'on' : ''}">${esc(feature.label_vi)} · ${feature.studio_preview ? 'Preview' : 'Ẩn'}${feature.public_candidate ? ' · Public candidate' : ''}</span>`).join('');

const types = [
  {id:'story',label:'Câu chuyện',description:'Những bài độc lập để đọc trọn trong một lần.',count:stories.length,href:'../../perspectives/'},
  ...(enabled.has('story_series') ? [{id:'series',label:'Series',description:'Nhiều story cùng một trục và thứ tự đọc.',count:seriesData.series.length,href:'#series'}] : []),
  ...(enabled.has('content_analysis') ? [{id:'analysis',label:'Phân tích',description:'Cơ chế, giới hạn và những câu hỏi còn mở.',count:analysisData.items.length,href:'#analysis'}] : []),
  {id:'knowledge',label:'Kiến thức',description:'Khái niệm và đường khám phá để hiểu thêm.',count:null,href:'../knowledge-maze/'}
];
$('typeGrid').innerHTML = types.map((item,index) => `<a class="type-card reveal" href="${esc(item.href)}"><span>0${index+1}</span><h3>${esc(item.label)}</h3><p>${esc(item.description)}</p><small>${item.count == null ? 'Đang phát triển' : `${item.count} nội dung`} &nbsp; →</small></a>`).join('');

function episodeView(episode) {
  const story = episode.story_id ? storiesByID.get(episode.story_id) : null;
  if (!story) return `<li class="planned"><b>${String(episode.number).padStart(2,'0')}</b><span><strong>Tập ${episode.number}</strong><small>Đang chờ nội dung</small></span></li>`;
  return `<li><b>${String(episode.number).padStart(2,'0')}</b><a href="../../perspectives/read/?story=${encodeURIComponent(story.id)}"><strong>${esc(story.title_vi)}</strong><small>${esc(story.subtitle_vi || 'Đọc câu chuyện')}</small></a></li>`;
}
$('seriesGrid').innerHTML = seriesData.series.map(series => `<article class="series-card"><div class="series-cover"><span>SELFLO SERIES</span><h3>${esc(series.title_vi)}</h3><p>${esc(series.subtitle_vi)}</p><b>${series.episode_count} tập</b></div><div class="series-copy"><p>${esc(series.description_vi)}</p><ol>${series.episodes.map(episodeView).join('')}</ol></div></article>`).join('') || '<p class="empty">Chưa có series trong catalog.</p>';

function analysisCard(item) {
  const source = storiesByID.get(item.content_id);
  const title = source?.title_vi || item.id;
  const sections = item.analysis_sections || [];
  return `<article class="analysis-card"><span>PHÂN TÍCH · ${esc(item.audience)}</span><h3>${esc(title)}</h3><p>${esc(item.editorial_assessment?.summary_vi || '')}</p><details><summary>Xem cấu trúc phân tích</summary>${sections.map(section => `<div><b>${esc(section.title_vi)}</b><p>${esc(section.body_vi)}</p></div>`).join('')}</details></article>`;
}
$('analysisGrid').innerHTML = analysisData.items.map(analysisCard).join('') || '<p class="empty">Chưa có bài phân tích.</p>';

const searchable = [
  ...stories.map(story => ({kind:'Câu chuyện',title:story.title_vi,description:story.subtitle_vi || story.opening_quote_vi || '',href:`../../perspectives/read/?story=${encodeURIComponent(story.id)}`})),
  ...seriesData.series.map(series => ({kind:'Series',title:series.title_vi,description:series.description_vi,href:'#series'})),
  ...analysisData.items.map(item => ({kind:'Phân tích',title:storiesByID.get(item.content_id)?.title_vi || item.id,description:item.editorial_assessment?.summary_vi || '',href:'#analysis'}))
];
let timer;
$('siteSearch').addEventListener('input', event => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const query = clean(event.target.value.trim());
    const section = $('searchResults');
    if (!query) { section.hidden = true; return; }
    const matches = searchable.filter(item => clean(`${item.kind} ${item.title} ${item.description}`).includes(query));
    $('searchTitle').textContent = `${matches.length} kết quả cho “${event.target.value.trim()}”`;
    $('resultGrid').innerHTML = matches.length ? matches.map(item => `<a href="${esc(item.href)}"><span>${esc(item.kind)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></a>`).join('') : '<p class="empty">Chưa tìm thấy nội dung phù hợp.</p>';
    section.hidden = false;
  }, 120);
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('visible', entry.isIntersecting)), {threshold:0.08,rootMargin:'0px 0px -5%'});
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
