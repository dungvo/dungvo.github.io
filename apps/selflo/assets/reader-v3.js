(() => {
  const base = '../../perspective-library/release/vi/';
  const root = document.querySelector('#reader');
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const fetchJson = async (path, fresh = false) => {
    const suffix = fresh ? `${path.includes('?') ? '&' : '?'}check=${Date.now()}` : '';
    const response = await fetch(base + path + suffix, {cache: fresh ? 'no-store' : 'default'});
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.json();
  };
  function rich(node) {
    if (!Array.isArray(node?.runs) || !node.runs.length) return esc(node?.text_vi);
    return node.runs.map(run => {
      let value = esc(run.text_vi);
      const marks = new Set(run.marks || []);
      if (marks.has('strong')) value = `<strong>${value}</strong>`;
      if (marks.has('emphasis')) value = `<em>${value}</em>`;
      if (marks.has('accent')) value = `<span class="text-accent">${value}</span>`;
      return value;
    }).join('');
  }
  function dialogue(block) {
    const turns = (block.turns || []).map(turn => `<div class="dialogue-turn ${esc(turn.delivery || 'spoken')}">${turn.speaker?.label_vi ? `<b>${esc(turn.speaker.label_vi)}</b>` : ''}${(turn.paragraphs || []).map(item => `<p>${rich(item)}</p>`).join('')}</div>`).join('');
    return `<div class="dialogue ${esc(block.style || 'monologue')}">${turns}</div>`;
  }
  function blockView(block, assets) {
    switch (block.type) {
      case 'part_heading': return `<div class="part-heading"><span>Phần ${esc(block.part_number)}</span><h2>${esc(block.title_vi)}</h2>${block.subtitle_vi ? `<p>${esc(block.subtitle_vi)}</p>` : ''}</div>`;
      case 'paragraph': return `<p class="story-paragraph ${esc(block.style || 'narrative')}">${rich(block)}</p>`;
      case 'pull_quote': return `<blockquote class="pull-quote ${esc(block.presentation || 'centerpiece')}">${rich(block)}${block.attribution_vi ? `<small>— ${esc(block.attribution_vi)}</small>` : ''}</blockquote>`;
      case 'statement': return `<p class="statement ${esc(block.presentation || 'leading')}">${rich(block)}</p>`;
      case 'dialogue': return dialogue(block);
      case 'divider': return '<div class="story-divider" role="separator" aria-hidden="true">◇</div>';
      case 'sequence': return `<ol class="story-sequence ${esc(block.progression || 'neutral')}">${(block.items || []).map(item => `<li>${rich(item)}</li>`).join('')}</ol>`;
      case 'flow': return `<ol class="story-sequence legacy-flow">${(block.items || []).map(item => `<li>${rich(item)}</li>`).join('')}</ol>`;
      case 'list': { const tag = block.style === 'ordered' ? 'ol' : 'ul'; return `<${tag} class="story-list ${esc(block.style || 'plain')}">${(block.items || []).map(item => `<li>${rich(item)}</li>`).join('')}</${tag}>`; }
      case 'verse': return `<figure class="story-verse"><div>${(block.lines || []).map(line => `<span>${rich(line)}</span>`).join('')}</div>${block.attribution_vi ? `<figcaption>— ${esc(block.attribution_vi)}</figcaption>` : ''}</figure>`;
      case 'aside': return `<aside class="story-note aside">${block.title_vi ? `<b>${esc(block.title_vi)}</b>` : ''}<p>${rich(block)}</p></aside>`;
      case 'source_note': return `<aside class="story-note source-note">${block.title_vi ? `<b>${esc(block.title_vi)}</b>` : ''}<p>${rich(block)}</p></aside>`;
      case 'figure': {
        const asset = assets.get(block.image?.file_id || block.file_id);
        if (!asset) return '';
        const alt = block.image?.alt_text_vi || block.alt_text_vi || '';
        const caption = block.image?.caption_vi || block.caption_vi;
        return `<figure class="story-figure"><img src="${esc(base + asset.path)}" alt="${esc(alt)}">${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;
      }
      default: return '';
    }
  }
  const readingMinutes = story => Math.max(1, Math.ceil((JSON.stringify(story).match(/[\p{L}\p{N}]+/gu) || []).length / 220));
  function render(story, manifest, heroPath) {
    document.title = `${story.title_vi} · Selflo`;
    const assets = new Map(manifest.files.filter(file => file.kind === 'image').map(file => [file.id, file]));
    const sections = story.sections.map((section, index) => {
      const id = section.id || `section-${index + 1}`;
      const marker = section.marker_vi ? `<span class="section-marker">${esc(section.marker_vi)}${section.marker_unit_vi ? ` ${esc(section.marker_unit_vi)}` : ''}</span>` : '';
      return `<section class="story-section" id="${esc(id)}">${marker}${section.title_vi ? `<h2>${esc(section.title_vi)}</h2>` : ''}${section.subtitle_vi ? `<p class="section-subtitle">${esc(section.subtitle_vi)}</p>` : ''}${section.blocks.map(item => blockView(item, assets)).join('')}</section>`;
    }).join('');
    const toc = story.sections.filter(section => section.title_vi).map((section, index) => `<a href="#${esc(section.id || `section-${index + 1}`)}">${esc(section.title_vi)}</a>`).join('');
    const prompts = story.reflection?.prompts?.map(item => `<li>${esc(item.text_vi)}</li>`).join('') || '';
    const opening = story.opening_quote_vi ? `<blockquote class="opening-quote">${esc(story.opening_quote_vi)}</blockquote>` : '';
    const heroStyle = heroPath ? ` style="background-image:url('${esc(base + heroPath)}')"` : '';
    root.innerHTML = `<section class="story-hero"${heroStyle}><div class="hero-copy"><span class="hero-kicker">Góc nhìn · Story</span><h1>${esc(story.title_vi)}</h1><p>${esc(story.subtitle_vi)}</p><div class="hero-meta"><span>◷ ${readingMinutes(story)} phút đọc</span><span>♡ Lưu lại</span></div></div></section><div class="reader-progress"><span></span></div><div class="story-layout"><article class="story-body">${opening}${sections}<section class="story-closing"><p class="closing-label">${esc(story.takeaway?.title_vi || 'Điều để mang theo')}</p><h2>${rich(story.takeaway)}</h2>${story.reflection?.closing_vi ? `<p>${esc(story.reflection.closing_vi)}</p>` : ''}${prompts ? `<div class="reflection-card"><b>Một câu hỏi để suy ngẫm</b><ul class="reflection-list">${prompts}</ul></div>` : ''}</section></article>${toc ? `<nav class="story-toc" aria-label="Mục lục"><b>Trong bài này</b>${toc}</nav>` : ''}</div>`;
    const bar = root.querySelector('.reader-progress span');
    const updateProgress = () => { const max = document.documentElement.scrollHeight - innerHeight; bar.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`; };
    addEventListener('scroll', updateProgress, {passive:true}); updateProgress();
  }
  async function load() {
    try {
      const id = new URLSearchParams(location.search).get('story') || 'story.original_if_i_lived_a_human_life';
      const manifest = await fetchJson('manifest.json', true);
      const descriptor = manifest.files.find(file => file.kind === 'story' && file.id === id);
      if (!descriptor) throw new Error(`Unknown story: ${id}`);
      const story = await fetchJson(descriptor.path);
      const hero = manifest.files.find(file => file.kind === 'image' && file.id === story.hero_image?.file_id);
      render(story, manifest, hero?.path);
    } catch (error) {
      console.error(error);
      root.innerHTML = '<section class="reader-error"><h1>Chưa thể mở câu chuyện.</h1><p>Nội dung có thể chưa được phát hành hoặc kết nối đang gián đoạn.</p><a href="../">Trở lại Góc nhìn</a></section>';
    }
  }
  load();
})();
