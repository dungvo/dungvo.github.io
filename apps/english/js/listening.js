(() => {
  'use strict';
  const root = document.querySelector('#listeningView');
  const topics = window.ListeningPractice || [];
  if (!root || !topics.length) return;
  const KEY = 'chunkLabListeningV1';
  const all = topics.flatMap(topic => topic.items);
  const $ = selector => root.querySelector(selector);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle = values => { const result = [...values]; for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };
  let saved = {};
  try { const parsed = JSON.parse(localStorage.getItem(KEY)); if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) saved = parsed; } catch (_) {}
  let session = null;
  let utterance = null;
  let audioSerial = 0;
  function stat(id) { const value = saved[id]; return value && typeof value === 'object' ? value : {}; }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(saved)); $('#listeningStorageNotice').hidden = true; return true; }
    catch (_) { $('#listeningStorageNotice').hidden = false; return false; }
  }
  function refreshTopics() {
    const select = $('#listeningTopic');
    const previous = select.value;
    select.innerHTML = '<option value="all">Tất cả chủ đề</option>' + topics.map(topic => `<option value="${esc(topic.id)}">${esc(topic.title)} · ${topic.items.length}</option>`).join('');
    if (topics.some(topic => topic.id === previous)) select.value = previous;
    const count = document.querySelector('[data-listening-level="1"] small');
    count.textContent = all.length + ' cụm & câu ngắn · chọn nghĩa';
    document.querySelectorAll('[data-listening-chunk-count]').forEach(node => { node.textContent = all.length + ' cụm & câu ngắn'; });
    renderStats();
    if ($('#listeningLibrary').open) renderLibrary();
  }

  function mergeChunks(library) {
    const normalize = text => text.trim().toLowerCase().replaceAll('’', "'").replace(/[.!?…]+$/, '').trim();
    const byPhrase = new Map(all.map(item => [normalize(item.en), item]));
    const advanced = window.AdvancedListening;
    const groups = [
      ['shared-library', 'Chunk Library', library.map(item => ({text:item.chunk, meaning:item.meaning, example:item.example}))],
      ['shared-sentences', 'Cụm từ trong câu dài', (advanced?.level2 || []).flatMap(item => item.chunks.map(chunk => ({...chunk, example:item.en})))],
      ['shared-dialogues', 'Cụm từ trong hội thoại', (advanced?.conversations || []).flatMap(item => item.chunks)]
    ];
    const meanings = [...new Set([...all.map(item => item.vi), ...groups.flatMap(group => group[2].map(item => item.meaning))].filter(value => typeof value === 'string' && value.trim()))];
    for (const [id, title, phrases] of groups) {
      const items = [];
      for (const phrase of phrases) {
        if (typeof phrase.text !== 'string' || typeof phrase.meaning !== 'string' || !phrase.meaning.trim()) continue;
        const key = normalize(phrase.text);
        if (!key) continue;
        const existing = byPhrase.get(key);
        if (existing) {
          existing.sources = [...new Set([...(existing.sources || []), title])];
          continue;
        }
        const offset = meanings.indexOf(phrase.meaning);
        const distractors = [meanings[(offset + 1) % meanings.length], meanings[(offset + 2) % meanings.length]];
        const item = {id:'shared:' + key, topic:id, en:phrase.text, vi:phrase.meaning, clue:phrase.example || '', transfer:'Dùng cụm này để nói một câu trong tình huống của bạn.', distractors, sources:[title]};
        byPhrase.set(key, item);
        items.push(item);
      }
      if (items.length) { topics.push({id,title,items}); all.push(...items); }
    }
    refreshTopics();
  }

  function pool() { return $('#listeningTopic').value === 'all' ? all : all.filter(item => item.topic === $('#listeningTopic').value); }
  function stop() { audioSerial++; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); utterance = null; }
  function renderStats() {
    const seen = all.filter(item => stat(item.id).attempts).length;
    const attempts = all.reduce((n, item) => n + (stat(item.id).attempts || 0), 0);
    const clean = all.reduce((n, item) => n + (stat(item.id).correct || 0), 0);
    const weak = pool().filter(item => ['wrong', 'assisted', 'skipped'].includes(stat(item.id).last));
    $('#listeningStats').innerHTML = `<strong>${seen} / ${all.length}</strong><span>câu đã luyện · ${attempts} lượt</span><span>${clean} lượt đúng khi chưa mở câu</span><span>${weak.length} câu cần ôn trong chủ đề đã chọn</span>`;
    $('#listeningReview').disabled = !weak.length;
  }
  function renderLibrary() {
    const query = $('#listeningChunkSearch').value.trim().toLowerCase();
    const matches = item => [item.en, item.vi, ...(item.sources || [])].some(value => value.toLowerCase().includes(query));
    $('#listeningLibraryList').innerHTML = topics.filter(topic => $('#listeningTopic').value === 'all' || topic.id === $('#listeningTopic').value).map(topic => ({...topic, items:topic.items.filter(matches)})).filter(topic => topic.items.length).map(topic => `<h3>${esc(topic.title)}</h3><ol>${topic.items.map(item => `<li><button type="button" data-listen-library="${esc(item.id)}">${esc(item.en)} · Nghe</button><p lang="vi">${esc(item.vi)}</p>${item.sources?.length ? `<small>${esc(item.sources.join(" · "))}</small>` : ""}</li>`).join('')}</ol>`).join('') || '<p>Không tìm thấy cụm phù hợp.</p>';
  }
  function start(review = false) {
    stop();
    const candidates = shuffle(pool().filter(item => !review || ['wrong', 'assisted', 'skipped'].includes(stat(item.id).last)));
    if (!candidates.length) return;
    // Prefer weak material, then unseen material, then less-practiced sentences.
    candidates.sort((a, b) => {
      const rank = item => ['wrong','assisted','skipped'].includes(stat(item.id).last) ? 0 : !stat(item.id).attempts ? 1 : 2;
      return rank(a) - rank(b) || (stat(a.id).attempts || 0) - (stat(b.id).attempts || 0);
    });
    session = { items: candidates.slice(0, Number($('#listeningRoundSize').value)), index: 0, results: [], heard: false, assisted: false, answered: false };
    $('#listeningLibrary').open = false;
    renderQuestion();
  }
  function audio(text, rate = 0.96, onStart) {
    stop();
    const status = $('#listeningAudioStatus');
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      if (status) status.textContent = 'Trình duyệt này chưa hỗ trợ đọc câu. Hãy thử Safari, Chrome hoặc Edge; bạn vẫn có thể mở câu để học.';
      return;
    }
    const token = audioSerial;
    const voices = window.speechSynthesis.getVoices().filter(v => /^en\b/i.test(v.lang));
    const preferred = ['Samantha','Ava','Google US English','Microsoft Aria','Microsoft Jenny','Daniel'];
    const voice = preferred.map(name => voices.find(v => v.name.includes(name))).find(Boolean) || voices.find(v => /^en-US$/i.test(v.lang)) || voices[0];
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice?.lang || 'en-US';
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.onstart = () => { if (token !== audioSerial) return; if (status) status.textContent = rate < 0.8 ? 'Đang đọc chậm…' : 'Đang đọc…'; onStart?.(); };
    utterance.onend = () => { if (token === audioSerial && status) status.textContent = 'Đã đọc xong. Bạn có thể nghe lại.'; };
    utterance.onerror = event => { if (token === audioSerial && status && !['canceled','interrupted'].includes(event.error)) status.textContent = 'Chưa phát được âm thanh. Kiểm tra âm lượng, giọng tiếng Anh trên thiết bị rồi bấm Nghe lại; hoặc mở câu để học.'; };
    if (status) status.textContent = 'Đang chuẩn bị giọng đọc…';
    window.speechSynthesis.speak(utterance);
  }
  function current() { return session.items[session.index]; }
  function renderQuestion() {
    session.heard = false; session.assisted = false; session.answered = false;
    const item = current();
    const options = shuffle([item.vi, ...item.distractors]);
    $('#listeningCard').innerHTML = `<div class="listening-steps"><span class="current">1 · Nghe & chọn</span><span>2 · Xem & nói lại</span><span>3 · Tự dùng câu</span></div><p class="eyebrow">CÂU ${session.index + 1} / ${session.items.length} · ${esc(topics.find(t => t.id === item.topic).title)}</p><h2 tabindex="-1" id="listeningQuestionTitle">Người nói muốn nói gì?</h2><p>Câu tiếng Anh đang được ẩn. Nghe rồi chọn nghĩa tiếng Việt phù hợp nhất.</p><div class="listening-audio"><button type="button" class="primary" data-listening-audio="normal">▶ Nghe câu</button><button type="button" class="secondary" data-listening-audio="slow">▷ Nghe chậm</button><button type="button" class="text-button" data-listening-stop>Dừng</button></div><p id="listeningAudioStatus" class="listening-status" role="status">Bấm Nghe câu để bắt đầu.</p><div class="listening-options" role="group" aria-label="Chọn nghĩa tiếng Việt">${options.map((option, index) => `<button type="button" class="listening-option" data-listening-option="${index}" disabled><b>${String.fromCharCode(65 + index)}</b><span>${esc(option)}</span></button>`).join('')}</div><button type="button" class="text-button" id="listeningReveal">Cần trợ giúp? Hiện câu tiếng Anh</button><div id="listeningFeedback" role="status"></div><div id="listeningTranscript" hidden></div><div class="listening-actions"><button type="button" class="secondary" id="listeningSkip">Chưa nghe ra · để ôn lại</button><button type="button" class="primary" id="listeningNext" disabled>${session.index + 1 === session.items.length ? 'Xem kết quả →' : 'Câu tiếp theo →'}</button></div>`;
    $('#listeningCard').querySelectorAll('[data-listening-option]').forEach(button => button.addEventListener('click', () => answer(options[Number(button.dataset.listeningOption)], button)));
    $('#listeningReveal').addEventListener('click', () => { if (!session.answered) session.assisted = true; reveal(); enableOptions(); });
    $('#listeningSkip').addEventListener('click', () => { if (!session.answered) record('skipped'); advance(); });
    $('#listeningNext').addEventListener('click', advance);
    $('#listeningQuestionTitle').focus({preventScroll:true});
    if (window.matchMedia('(max-width:760px)').matches && root.classList.contains('active')) $('#listeningCard').scrollIntoView({block:'start',behavior:'instant'});
  }
  function enableOptions() { $('#listeningCard').querySelectorAll('[data-listening-option]').forEach(button => { button.disabled = session.answered; }); }
  function record(outcome) {
    if (session.answered) return;
    session.answered = true;
    const item = current(); const old = stat(item.id);
    saved[item.id] = { ...old, attempts: (old.attempts || 0) + 1, correct: (old.correct || 0) + (outcome === 'correct' ? 1 : 0), last: outcome, practiced: new Date().toISOString() };
    session.results.push({ id: item.id, outcome }); save(); renderStats();
  }
  function answer(value, button) {
    if (session.answered || (!session.heard && !session.assisted)) return;
    const item = current(); const correct = value === item.vi;
    const outcome = session.assisted ? 'assisted' : correct ? 'correct' : 'wrong';
    record(outcome);
    $('#listeningCard').querySelectorAll('[data-listening-option]').forEach(option => { option.disabled = true; if (option.querySelector('span').textContent === item.vi) option.classList.add('correct'); });
    if (!correct) button.classList.add('wrong');
    $('#listeningFeedback').innerHTML = `<div class="listening-result ${outcome === 'correct' ? '' : 'assisted'}"><strong>${correct ? 'Đúng nghĩa rồi.' : 'Chưa đúng — xem lựa chọn màu xanh.'}</strong><p>${session.assisted ? 'Bạn đã mở câu trước khi chọn. Lượt này được ghi nhận là có trợ giúp và sẽ xuất hiện lại để ôn.' : correct ? 'Bạn đã hiểu câu qua âm thanh. Bây giờ nghe lại và nói thành tiếng.' : 'Chú ý phần nghĩa bên dưới, nghe lại rồi thử nói câu đó.'}</p></div>`;
    reveal(); $('#listeningNext').disabled = false;
    $('#listeningSkip').hidden = true;
    $('#listeningCard').querySelectorAll('.listening-steps span').forEach((node, i) => node.classList.toggle('current', i > 0));
  }
  function reveal() {
    const panel = $('#listeningTranscript'); if (!panel.hidden) return;
    const item = current();
    panel.hidden = false;
    $('#listeningReveal').hidden = true;
    const note = item.translationNote;
    const translationNote = note ? `<section class="listening-translation-note" aria-label="Lưu ý về cách hiểu tự nhiên"><span>DỄ DỊCH SAI NẾU DỊCH TỪNG TỪ</span><div><b>Đừng hiểu máy móc</b><p>${esc(note.wrong)}</p></div><div><b>Cách nhớ</b><p>${esc(note.rule)}</p></div><div><b>So sánh</b><p>${esc(note.contrast)}</p></div></section>` : "";
    panel.innerHTML = `<div class="listening-transcript"><p class="eyebrow">CÂU TIẾNG ANH</p><h3 lang="en">${esc(item.en)}</h3><p>${esc(item.vi)}</p>${window.ListeningPronunciation?.html(item.en) || ""}<small>${esc(item.clue)}</small>${translationNote}${window.ChunkLabListeningLinks?.html(item, 1) || ""}<p><b>Nói lại:</b> Nghe mẫu, nói theo hai lần. Sau đó ẩn câu và thử nói từ trí nhớ.</p><button type="button" class="secondary" id="listeningHideSentence">Ẩn / hiện câu tiếng Anh</button></div><div class="listening-transfer"><label for="listeningOwnSentence">Tự dùng câu trong tình huống mới</label><p>${esc(item.transfer)}</p><textarea id="listeningOwnSentence" lang="en" placeholder="Nói thành tiếng trước. Bạn cũng có thể viết câu của mình ở đây…"></textarea><small>Câu viết được lưu trên thiết bị. Phần nói và viết này để bạn tự luyện; trang chưa tự chấm phát âm hoặc ngữ pháp.</small><p id="listeningDraftStatus" role="status"></p></div>`;
    $('#listeningOwnSentence').value = stat(item.id).draft || '';
    $('#listeningOwnSentence').addEventListener('input', event => { saved[item.id] = { ...stat(item.id), draft: event.target.value }; const stored = save(); $('#listeningDraftStatus').textContent = stored ? 'Đã lưu câu của bạn trên thiết bị này.' : 'Chưa lưu được. Bạn có thể sao chép câu này trước khi rời trang.'; });
    $('#listeningHideSentence').addEventListener('click', () => { const h3 = panel.querySelector('h3'); h3.hidden = !h3.hidden; });
  }
  function advance() {
    if (!session || !session.answered) return;
    stop(); session.index++;
    if (session.index < session.items.length) { renderQuestion(); return; }
    const good = session.results.filter(r => r.outcome === 'correct').length;
    const assisted = session.results.filter(r => r.outcome === 'assisted').length;
    $('#listeningCard').innerHTML = `<p class="eyebrow">HOÀN THÀNH LƯỢT LUYỆN</p><h2 tabindex="-1" id="listeningFinished">${good} / ${session.items.length} câu đúng qua nghe</h2><p>${assisted} câu có trợ giúp · ${session.results.filter(r => ['wrong','skipped'].includes(r.outcome)).length} câu sai hoặc chưa nghe ra.</p><p>Chọn một câu đã học, che chữ và nói lại. Ngày mai hãy ôn trước khi học câu mới.</p><div class="listening-library"><ol>${session.results.map(r => { const item = all.find(i => i.id === r.id); return `<li><b>${r.outcome === 'correct' ? '✓ Đúng' : r.outcome === 'assisted' ? 'Có trợ giúp' : 'Cần ôn'}</b><p lang="en">${esc(item.en)}</p><p>${esc(item.vi)}</p></li>`; }).join('')}</ol></div><div class="listening-actions"><button type="button" class="primary" id="listeningAgain">Luyện lượt tiếp theo</button><button type="button" class="secondary" id="listeningRetry" ${session.results.every(r => r.outcome === 'correct') ? 'disabled' : ''}>Ôn câu cần luyện</button></div>`;
    $('#listeningAgain').addEventListener('click', () => start()); $('#listeningRetry').addEventListener('click', () => start(true));
    $('#listeningFinished').focus({preventScroll:true});
  }
  $('#listeningTopic').addEventListener('change', () => { renderStats(); if ($('#listeningLibrary').open) renderLibrary(); $('#listeningTopicNote').textContent = topics.find(t => t.id === $('#listeningTopic').value)?.note || 'Chọn một chủ đề hoặc luyện kết hợp. Lượt luyện dùng số câu hiện có trong chủ đề.'; });
  $('#listeningStart').addEventListener('click', () => start());
  $('#listeningReview').addEventListener('click', () => start(true));
  root.addEventListener('click', event => {
    const play = event.target.closest('[data-listening-audio]');
    if (play && session && session.index < session.items.length) audio(current().en, play.dataset.listeningAudio === 'slow' ? 0.72 : 0.96, () => { session.heard = true; enableOptions(); });
    if (event.target.closest('[data-listening-stop]')) { stop(); const status = $('#listeningAudioStatus'); if (status) status.textContent = 'Đã dừng.'; }
    const library = event.target.closest('[data-listen-library]');
    if (library) { const item = all.find(i => i.id === library.dataset.listenLibrary); if (item) audio(item.en); }
  });
  new MutationObserver(() => { if (!root.classList.contains('active')) stop(); }).observe(root, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  $('#listeningChunkSearch').addEventListener('input', renderLibrary);
  $('#listeningLibrary').addEventListener('toggle', () => { if ($('#listeningLibrary').open) renderLibrary(); });
  window.ChunkLabMergeListeningChunks = mergeChunks;
  mergeChunks(window.ChunkLabListeningLibrary || []);
})();
