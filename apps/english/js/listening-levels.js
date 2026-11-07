(() => {
  'use strict';
  const root = document.querySelector('#listeningView');
  const data = window.AdvancedListening;
  if (!root || !data) return;

  const KEY = 'chunkLabListeningAdvancedV1';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle = values => { const result = [...values]; for (let i = result.length - 1; i; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };
  const level1 = root.querySelector('#listeningLevel1');
  const level2 = root.querySelector('#listeningLevel2');
  const level3 = root.querySelector('#listeningLevel3');
  let saved = { l2:{}, l3:{} };
  try { const value = JSON.parse(localStorage.getItem(KEY)); if (value && typeof value === 'object') saved = {l2:value.l2 || {},l3:value.l3 || {}}; } catch (_) {}
  let activeLevel = 1;
  let l2Session = null;
  let l3Session = null;
  let audioToken = 0;

  function save() { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (_) {} }
  function stopAudio(statusId) {
    audioToken++;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const status = statusId && document.getElementById(statusId);
    if (status) status.textContent = 'Đã dừng.';
  }
  function voices() {
    if (!('speechSynthesis' in window)) return [];
    const english = window.speechSynthesis.getVoices().filter(v => /^en\b/i.test(v.lang));
    const preferred = ['Samantha','Ava','Google US English','Microsoft Aria','Microsoft Jenny','Daniel'];
    return [...preferred.map(name => english.find(v => v.name.includes(name))).filter(Boolean), ...english.filter(v => !preferred.some(name => v.name.includes(name)))];
  }
  function speakText(text, rate, statusId, onStart) {
    stopAudio();
    const status = document.getElementById(statusId);
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { if (status) status.textContent = 'Thiết bị chưa hỗ trợ giọng đọc. Bạn có thể hiện transcript để học.'; return; }
    const token = audioToken;
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices()[0];
    utterance.lang = voice?.lang || 'en-US'; if (voice) utterance.voice = voice; utterance.rate = rate;
    utterance.onstart = () => { if (token !== audioToken) return; if (status) status.textContent = rate < .8 ? 'Đang đọc chậm…' : 'Đang đọc…'; onStart?.(); };
    utterance.onend = () => { if (token === audioToken && status) status.textContent = 'Đã đọc xong. Bạn có thể nghe lại.'; };
    utterance.onerror = event => { if (token === audioToken && status && !['canceled','interrupted'].includes(event.error)) status.textContent = 'Chưa phát được âm thanh. Hãy thử lại hoặc hiện transcript.'; };
    if (status) status.textContent = 'Đang chuẩn bị giọng đọc…';
    window.speechSynthesis.speak(utterance);
  }
  function speakConversation(turns, rate, statusId, onStart) {
    stopAudio();
    const status = document.getElementById(statusId);
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { if (status) status.textContent = 'Thiết bị chưa hỗ trợ giọng đọc. Bạn có thể hiện transcript để học.'; return; }
    const token = audioToken;
    const available = voices();
    const speakerVoice = new Map();
    let started = false;
    turns.forEach((turn, index) => {
      if (!speakerVoice.has(turn.speaker)) speakerVoice.set(turn.speaker, available[speakerVoice.size % Math.max(available.length, 1)]);
      const utterance = new SpeechSynthesisUtterance(turn.text);
      const voice = speakerVoice.get(turn.speaker); utterance.lang = voice?.lang || 'en-US'; if (voice) utterance.voice = voice; utterance.rate = rate;
      utterance.onstart = () => { if (token !== audioToken) return; if (!started) { started = true; onStart?.(); } if (status) status.textContent = `Đang nghe ${turn.speaker}…`;
      };
      utterance.onend = () => { if (token === audioToken && index === turns.length - 1 && status) status.textContent = 'Đã nghe hết hội thoại. Bạn có thể nghe lại.'; };
      utterance.onerror = event => { if (token === audioToken && status && !['canceled','interrupted'].includes(event.error)) status.textContent = 'Âm thanh bị gián đoạn. Hãy bấm nghe lại hoặc hiện transcript.'; };
      window.speechSynthesis.speak(utterance);
    });
    if (status) status.textContent = 'Đang chuẩn bị hội thoại…';
  }

  function chooseLevel(level) {
    activeLevel = level; stopAudio();
    [level1, level2, level3].forEach((panel, index) => { panel.hidden = index + 1 !== level; });
    root.querySelectorAll('[data-listening-level]').forEach(button => { const selected = Number(button.dataset.listeningLevel) === level; button.classList.toggle('active', selected); button.setAttribute('aria-selected', selected); });
    root.querySelector('.listening-head .lead').textContent = level === 1 ? 'Nghe common chunks ngắn, chọn đúng ý định rồi mở câu để học cách dùng.' : level === 2 ? 'Nghe câu dài hơn, hiểu toàn bộ ý và nhận ra các chunks tạo nên câu.' : 'Nghe một hội thoại hoàn chỉnh, trả lời câu hỏi rồi học các chunks có thể dùng lại.';
    root.querySelector('.listening-badge').textContent = level === 1 ? 'Mức 1 · 100 chunks' : level === 2 ? 'Mức 2 · 30 câu dài' : 'Mức 3 · 12 hội thoại';
    try { localStorage.setItem('chunkLabListeningLevel', String(level)); } catch (_) {}
  }

  function l2Pool() { const topic = document.getElementById('l2Topic').value; return topic === 'all' ? data.level2 : data.level2.filter(item => item.topic === topic); }
  function renderL2Stats() {
    const seen = data.level2.filter(item => saved.l2[item.id]?.attempts).length;
    const correct = data.level2.reduce((sum,item) => sum + (saved.l2[item.id]?.correct || 0), 0);
    const review = l2Pool().filter(item => ['wrong','assisted','skipped'].includes(saved.l2[item.id]?.last));
    document.getElementById('l2Stats').innerHTML = `<strong>${seen} / ${data.level2.length}</strong><span>câu đã luyện</span><span>${correct} lượt hiểu đúng không trợ giúp</span><span>${review.length} câu cần ôn trong chủ đề này</span>`;
    document.getElementById('l2Review').disabled = !review.length;
  }
  function startL2(review = false) {
    stopAudio();
    let candidates = shuffle(l2Pool().filter(item => !review || ['wrong','assisted','skipped'].includes(saved.l2[item.id]?.last)));
    candidates.sort((a,b) => { const rank = x => ['wrong','assisted','skipped'].includes(saved.l2[x.id]?.last) ? 0 : saved.l2[x.id]?.attempts ? 2 : 1; return rank(a)-rank(b) || (saved.l2[a.id]?.attempts||0)-(saved.l2[b.id]?.attempts||0); });
    if (!candidates.length) return;
    l2Session = {items:candidates.slice(0,5), index:0, results:[], heard:false, assisted:false, answered:false};
    renderL2Question();
  }
  function l2Current() { return l2Session.items[l2Session.index]; }
  function renderL2Question() {
    const item = l2Current(); l2Session.heard = false; l2Session.assisted = false; l2Session.answered = false;
    const options = shuffle([item.vi,...item.distractors]);
    document.getElementById('l2Card').innerHTML = `<div class="listening-steps"><span class="current">1 · Nghe câu dài</span><span>2 · Hiểu toàn ý</span><span>3 · Nhận ra chunks</span></div><p class="eyebrow">MỨC 2 · CÂU ${l2Session.index+1} / ${l2Session.items.length}</p><h2 tabindex="-1">Cả câu có ý nghĩa gì?</h2><p>Đừng cố dịch từng từ. Hãy nghe các cụm bạn nhận ra và ghép thành ý chính.</p><div class="listening-audio"><button class="primary" data-l2-audio="normal">▶ Nghe câu</button><button class="secondary" data-l2-audio="slow">▷ Nghe chậm</button><button class="text-button" data-advanced-stop>Dừng</button></div><p id="l2AudioStatus" class="listening-status" role="status">Bấm Nghe câu để bắt đầu.</p><div class="listening-options">${options.map((option,i)=>`<button class="listening-option" data-l2-option="${i}" disabled><b>${String.fromCharCode(65+i)}</b><span>${esc(option)}</span></button>`).join('')}</div><button class="text-button" id="l2Reveal">Cần trợ giúp? Hiện câu tiếng Anh</button><div id="l2Feedback" role="status"></div><div id="l2Transcript" hidden></div><div class="listening-actions"><button class="secondary" id="l2Skip">Chưa nghe ra · để ôn lại</button><button class="primary" id="l2Next" disabled>${l2Session.index+1===l2Session.items.length?'Xem kết quả →':'Câu tiếp theo →'}</button></div>`;
    document.querySelectorAll('[data-l2-option]').forEach(button => button.addEventListener('click', () => answerL2(options[Number(button.dataset.l2Option)],button)));
    document.getElementById('l2Reveal').onclick = () => { l2Session.assisted = true; revealL2(); enableL2(); };
    document.getElementById('l2Skip').onclick = () => { recordL2('skipped'); advanceL2(); };
    document.getElementById('l2Next').onclick = advanceL2;
    document.querySelector('#l2Card h2').focus({preventScroll:true});
  }
  function enableL2() { document.querySelectorAll('[data-l2-option]').forEach(b => b.disabled = l2Session.answered); }
  function recordL2(outcome) { if (l2Session.answered) return; l2Session.answered=true; const item=l2Current(), old=saved.l2[item.id]||{}; saved.l2[item.id]={attempts:(old.attempts||0)+1,correct:(old.correct||0)+(outcome==='correct'?1:0),last:outcome}; l2Session.results.push(outcome); save(); renderL2Stats(); }
  function answerL2(value,button) {
    if (l2Session.answered || (!l2Session.heard && !l2Session.assisted)) return;
    const item=l2Current(), correct=value===item.vi, outcome=l2Session.assisted?'assisted':correct?'correct':'wrong'; recordL2(outcome);
    document.querySelectorAll('[data-l2-option]').forEach(b=>{b.disabled=true;if(b.querySelector('span').textContent===item.vi)b.classList.add('correct');}); if(!correct)button.classList.add('wrong');
    document.getElementById('l2Feedback').innerHTML=`<div class="listening-result ${outcome==='correct'?'':'assisted'}"><strong>${correct?'Đúng ý rồi.':'Chưa đúng — xem đáp án màu xanh.'}</strong><p>${outcome==='correct'?'Bây giờ xem các chunks đã tạo nên câu.':'Nghe lại một lần sau khi xem cách tách chunks.'}</p></div>`; revealL2(); document.getElementById('l2Next').disabled=false; document.getElementById('l2Skip').hidden=true;
  }
  function revealL2() { const panel=document.getElementById('l2Transcript'); if(!panel.hidden)return; const item=l2Current(); panel.hidden=false; document.getElementById('l2Reveal').hidden=true; panel.innerHTML=`<div class="listening-transcript"><p class="eyebrow">CÂU ĐÃ NGHE</p><h3 lang="en">${esc(item.en)}</h3><p>${esc(item.vi)}</p>${item.note?`<div class="advanced-note"><b>Điểm cần nhớ</b><p>${esc(item.note)}</p></div>`:''}<div class="chunk-breakdown"><b>Các chunks tạo nên câu</b>${item.chunks.map(c=>`<div><span lang="en">${esc(c.text)}</span><i>→</i><span>${esc(c.meaning)}</span></div>`).join('')}</div><p><b>Luyện lại:</b> nghe chậm, dừng trong đầu sau mỗi chunk, rồi nói lại cả câu.</p></div>`; }
  function advanceL2() { if(!l2Session?.answered)return; stopAudio(); l2Session.index++; if(l2Session.index<l2Session.items.length){renderL2Question();return;} const good=l2Session.results.filter(x=>x==='correct').length; document.getElementById('l2Card').innerHTML=`<p class="eyebrow">HOÀN THÀNH MỨC 2</p><h2>${good} / ${l2Session.results.length} câu hiểu đúng qua nghe</h2><p>Mỗi câu dài là một chuỗi chunks. Hãy chọn một câu khó, nói lại theo từng cụm rồi nối thành câu hoàn chỉnh.</p><div class="listening-actions"><button class="primary" id="l2Again">Luyện thêm 5 câu</button><button class="secondary" id="l2Retry">Ôn câu cần luyện</button></div>`; document.getElementById('l2Again').onclick=()=>startL2(); document.getElementById('l2Retry').onclick=()=>startL2(true); }

  function renderL3Stats() { const seen=data.conversations.filter(c=>saved.l3[c.id]?.attempts).length; const best=data.conversations.reduce((s,c)=>s+(saved.l3[c.id]?.best||0),0); document.getElementById('l3Stats').innerHTML=`<strong>${seen} / ${data.conversations.length}</strong><span>hội thoại đã luyện</span><span>${best} câu hỏi đúng ở lượt tốt nhất</span>`; }
  function startL3() {
    stopAudio(); const category=document.getElementById('l3Topic').value; let candidates=data.conversations.filter(c=>category==='all'||c.category===category); candidates=shuffle(candidates).sort((a,b)=>(saved.l3[a.id]?.attempts||0)-(saved.l3[b.id]?.attempts||0)); if(!candidates.length)return;
    l3Session={item:candidates[0],question:0,score:0,heard:false,assisted:false,answers:[]}; renderL3Question();
  }
  function renderL3Question() {
    const c=l3Session.item,q=c.questions[l3Session.question], canAnswer=l3Session.heard||l3Session.assisted;
    document.getElementById('l3Card').innerHTML=`<div class="conversation-heading"><div><p class="eyebrow">MỨC 3 · HỘI THOẠI ${l3Session.question+1>1?'ĐANG TIẾP TỤC':''}</p><h2>${esc(c.title)}</h2><p>${esc(c.situation)}</p></div><span>${l3Session.question+1} / ${c.questions.length} câu hỏi</span></div><div class="listening-audio"><button class="primary" data-l3-audio="normal">▶ Nghe toàn bộ</button><button class="secondary" data-l3-audio="slow">▷ Nghe chậm</button><button class="text-button" data-advanced-stop>Dừng</button></div><p id="l3AudioStatus" class="listening-status" role="status">${l3Session.heard?'Bạn có thể nghe lại trước khi trả lời.':'Nghe toàn bộ hội thoại trước khi trả lời.'}</p><section class="conversation-question"><p class="eyebrow">CÂU HỎI ${l3Session.question+1}</p><h3>${esc(q.prompt)}</h3><div class="listening-options">${q.options.map((o,i)=>`<button class="listening-option" data-l3-option="${i}" ${canAnswer?'':'disabled'}><b>${String.fromCharCode(65+i)}</b><span>${esc(o)}</span></button>`).join('')}</div><div id="l3Feedback"></div></section><button class="text-button" id="l3Reveal">Cần trợ giúp? Hiện transcript</button><div id="l3Transcript" ${l3Session.assisted?'':'hidden'}>${l3Session.assisted?transcriptHTML(c):''}</div>`;
    document.querySelectorAll('[data-l3-option]').forEach(b=>b.addEventListener('click',()=>answerL3(Number(b.dataset.l3Option),b)));
    document.getElementById('l3Reveal').onclick=()=>{l3Session.assisted=true;renderL3Question();};
  }
  function transcriptHTML(c, includeChunks=false) { return `<div class="conversation-transcript"><p class="eyebrow">TRANSCRIPT</p>${c.turns.map(t=>`<div><b>${esc(t.speaker)}</b><p lang="en">${esc(t.text)}</p></div>`).join('')}${includeChunks?`<section class="conversation-chunks"><h3>Chunks có thể dùng lại</h3>${c.chunks.map(x=>`<div><b lang="en">${esc(x.text)}</b><span>${esc(x.meaning)}</span></div>`).join('')}</section>`:''}</div>`; }
  function answerL3(index,button) {
    const q=l3Session.item.questions[l3Session.question]; if(!(l3Session.heard||l3Session.assisted)||l3Session.answers[l3Session.question]!=null)return;
    const correct=index===q.answer; if(correct)l3Session.score++; l3Session.answers[l3Session.question]=index;
    document.querySelectorAll('[data-l3-option]').forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add('correct');}); if(!correct)button.classList.add('wrong');
    document.getElementById('l3Feedback').innerHTML=`<div class="listening-result ${correct?'':'assisted'}"><strong>${correct?'Đúng rồi.':'Chưa đúng.'}</strong><p>${esc(q.explanation)}</p><button class="primary" id="l3Next">${l3Session.question+1===l3Session.item.questions.length?'Xem kết quả →':'Câu hỏi tiếp theo →'}</button></div>`;
    document.getElementById('l3Next').onclick=()=>{l3Session.question++; if(l3Session.question<l3Session.item.questions.length)renderL3Question();else finishL3();};
  }
  function finishL3() { const c=l3Session.item,old=saved.l3[c.id]||{}; saved.l3[c.id]={attempts:(old.attempts||0)+1,best:Math.max(old.best||0,l3Session.score),last:l3Session.score,assisted:l3Session.assisted}; save(); renderL3Stats(); document.getElementById('l3Card').innerHTML=`<p class="eyebrow">HOÀN THÀNH HỘI THOẠI</p><h2>${l3Session.score} / ${c.questions.length} câu đúng</h2><p>${l3Session.assisted?'Bạn đã dùng transcript hỗ trợ. Hãy nghe lại một lần và không nhìn chữ.':'Bạn đã trả lời mà không mở transcript.'}</p>${transcriptHTML(c,true)}<div class="listening-actions"><button class="primary" id="l3Another">Luyện hội thoại khác</button><button class="secondary" id="l3Replay">▶ Nghe lại</button></div><p id="l3ReplayStatus" class="listening-status" role="status"></p>`; document.getElementById('l3Another').onclick=startL3; document.getElementById('l3Replay').onclick=()=>speakConversation(c.turns,.92,'l3ReplayStatus',()=>{}); }

  document.getElementById('l2Topic').innerHTML='<option value="all">Tất cả chủ đề</option>'+data.level2Topics.map(t=>`<option value="${t.id}">${esc(t.title)} · ${data.level2.filter(x=>x.topic===t.id).length} câu</option>`).join('');
  const categories=[...new Set(data.conversations.map(c=>c.category))]; document.getElementById('l3Topic').innerHTML='<option value="all">Tất cả chủ đề</option>'+categories.map(c=>`<option>${esc(c)}</option>`).join('');
  root.querySelectorAll('[data-listening-level]').forEach(b=>b.addEventListener('click',()=>chooseLevel(Number(b.dataset.listeningLevel))));
  document.getElementById('l2Topic').onchange=renderL2Stats; document.getElementById('l2Start').onclick=()=>startL2(); document.getElementById('l2Review').onclick=()=>startL2(true); document.getElementById('l3Start').onclick=startL3;
  root.addEventListener('click',event=>{ const l2=event.target.closest('[data-l2-audio]'); if(l2&&l2Session)speakText(l2Current().en,l2.dataset.l2Audio==='slow'?.7:.94,'l2AudioStatus',()=>{l2Session.heard=true;enableL2();}); const l3=event.target.closest('[data-l3-audio]'); if(l3&&l3Session)speakConversation(l3Session.item.turns,l3.dataset.l3Audio==='slow'?.72:.94,'l3AudioStatus',()=>{l3Session.heard=true;document.querySelectorAll('[data-l3-option]').forEach(b=>b.disabled=false);}); if(event.target.closest('[data-advanced-stop]'))stopAudio(activeLevel===2?'l2AudioStatus':'l3AudioStatus'); });
  new MutationObserver(()=>{if(!root.classList.contains('active'))stopAudio();}).observe(root,{attributes:true,attributeFilter:['class']}); document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAudio();}); window.addEventListener('pagehide',()=>stopAudio());
  renderL2Stats(); renderL3Stats(); chooseLevel(Number(localStorage.getItem('chunkLabListeningLevel'))||1);
})();
