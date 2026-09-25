(() => {
  "use strict";
  const chunks = window.CHUNKS || [];
  const KEY = "chunkLabProgressV1";
  const SESSION_SIZE = 7;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const shuffle = (a) => [...a].sort(() => Math.random() - .5);
  const escapeHtml = (s) => String(s).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const defaultState = () => ({total:0,correct:0,today:new Date().toISOString().slice(0,10),todayCount:0,items:{}});
  let progress = loadProgress();
  let session = null;

  function loadProgress(){
    try { const p = {...defaultState(), ...JSON.parse(localStorage.getItem(KEY))}; rollover(p); return p; }
    catch { return defaultState(); }
  }
  function rollover(p){ const d=new Date().toISOString().slice(0,10); if(p.today!==d){p.today=d;p.todayCount=0;} }
  function save(){ localStorage.setItem(KEY, JSON.stringify(progress)); }
  function stat(id){ return progress.items[id] || {seen:0,correct:0,wrong:0}; }
  function record(id, correct){
    const s=stat(id); s.seen++; correct?s.correct++:s.wrong++; progress.items[id]=s;
    progress.total++; if(correct)progress.correct++; progress.todayCount++; save();
  }
  function weakness(c){ const s=stat(c.id); return s.seen===0?2:(s.wrong*3-s.correct*.25)+1/(s.seen+1); }
  function weightedPool(review){
    const sorted=[...chunks].sort((a,b)=>weakness(b)-weakness(a));
    if(review) return sorted.filter(c=>stat(c.id).wrong>0).slice(0,Math.max(SESSION_SIZE,4));
    return shuffle(sorted.slice(0,Math.max(12,Math.ceil(chunks.length*.7))));
  }
  function show(name){ $$(".view").forEach(v=>v.classList.remove("active")); $("#"+name+"View").classList.add("active"); window.scrollTo(0,0); }
  function updateHome(){
    rollover(progress); save(); const count=Math.min(progress.todayCount,10), pct=Math.round(count/10*100);
    $("#todayCount").textContent=count; $("#progressPercent").textContent=pct+"%"; $("#progressRing").style.setProperty("--p",pct*3.6+"deg");
    $("#chunkCount").textContent=chunks.length+" learned chunks";
    const weak=[...chunks].filter(c=>stat(c.id).wrong>0).sort((a,b)=>weakness(b)-weakness(a));
    $("#reviewTitle").textContent=weak.length?weak.length+" chunk"+(weak.length>1?"s":"")+" to strengthen":"Start practicing";
    $("#reviewCopy").textContent=weak.length?"Focus first on “"+weak[0].chunk+"” and other patterns you've missed.":"Your difficult chunks will appear here more often.";
    $("#reviewCard").classList.toggle("has-mistakes",weak.length>0);
  }
  function start(mode){
    const actualMode=mode==="review"?"mixed":mode, pool=weightedPool(mode==="review");
    const items=shuffle(pool).slice(0,Math.min(SESSION_SIZE,pool.length || chunks.length));
    session={mode:actualMode,sourceMode:mode,items,index:0,score:0,bestStreak:0,streak:0,answered:false};
    show("practice"); render();
  }
  function currentMode(){
    if(session.mode!=="mixed") return session.mode;
    return ["meaning","situation","build","speak"][session.index%4];
  }
  function render(){
    const c=session.items[session.index], mode=currentMode(), n=session.index+1;
    $("#sessionProgressBar").style.width=((session.index/session.items.length)*100)+"%";
    $("#sessionScore").textContent=session.score+"/"+session.index;
    if(mode==="meaning") renderChoice(c,"What does this chunk mean?",c.chunk,c.meaning,"meaning");
    else if(mode==="situation") renderChoice(c,"What would you say?",c.situation,c.chunk,"chunk");
    else if(mode==="build") renderBuild(c);
    else renderSpeak(c);
    document.title=`${n}/${session.items.length} · Chunk Lab`;
  }
  function distractors(c,field){
    const preferred=(c.confusedWith||[]).map(id=>chunks.find(x=>x.id===id)).filter(Boolean).map(x=>x[field]);
    return shuffle([...preferred,...chunks.filter(x=>x.id!==c.id).map(x=>x[field])].filter((v,i,a)=>v&&a.indexOf(v)===i)).slice(0,3);
  }
  function renderChoice(c,label,prompt,answer,field){
    const options=shuffle([answer,...distractors(c,field)]);
    $("#practiceCard").innerHTML=`<p class="question-label">${label}</p><h1 class="prompt">${escapeHtml(prompt)}</h1>${field==="chunk"?"":`<p class="context">Choose the closest meaning.</p>`}<div class="options">${options.map((o,i)=>`<button class="option" data-answer="${escapeHtml(o)}"><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${escapeHtml(o)}</span></button>`).join("")}</div><div id="feedbackSlot"></div>`;
    $$(".option").forEach(b=>b.addEventListener("click",()=>answerChoice(b,b.dataset.answer===answer,c)));
  }
  function answerChoice(button,correct,c){
    if(session.answered)return; session.answered=true; record(c.id,correct); updateSessionScore(correct);
    $$(".option").forEach(b=>{b.disabled=true;if(b.dataset.answer===(currentMode()==="meaning"?c.meaning:c.chunk))b.classList.add("correct")});
    if(!correct)button.classList.add("wrong"); feedback(correct,c);
  }
  function feedback(correct,c){
    $("#feedbackSlot").innerHTML=`<div class="feedback ${correct?"good":"bad"}"><strong>${correct?"Exactly.":"Not quite — save this distinction."}</strong>${escapeHtml(c.note)}</div><button class="primary next-button" id="nextButton">${session.index===session.items.length-1?"See results":"Next chunk →"}</button>`;
    $("#nextButton").addEventListener("click",next);
  }
  function updateSessionScore(correct){ if(correct){session.score++;session.streak++;session.bestStreak=Math.max(session.bestStreak,session.streak)}else session.streak=0; $("#sessionScore").textContent=session.score+"/"+(session.index+1); }
  function renderBuild(c){
    const words=shuffle([c.answer,...c.alternatives.slice(0,3)]);
    $("#practiceCard").innerHTML=`<p class="question-label">BUILD THE SENTENCE</p><h1 class="prompt">Choose the missing word</h1><p class="context">${escapeHtml(c.situation)}</p><div class="gap-sentence">${escapeHtml(c.gap).replace("___",'<span class="blank" id="blank">___</span>')}</div><div class="word-bank">${words.map(w=>`<button class="word-chip">${escapeHtml(w)}</button>`).join("")}</div><div id="feedbackSlot"></div>`;
    $$(".word-bank .word-chip").forEach(b=>b.addEventListener("click",()=>{if(session.answered)return;$("#blank").textContent=b.textContent; answerBuild(b.textContent===c.answer,c)}));
  }
  function answerBuild(correct,c){ session.answered=true;record(c.id,correct);updateSessionScore(correct);$$(".word-chip").forEach(b=>b.disabled=true);feedback(correct,c); }
  function renderSpeak(c){
    $("#practiceCard").innerHTML=`<div class="speak-card"><p class="question-label">SPEAK & PRONOUNCE</p><p class="context">Say it aloud before revealing the pronunciation.</p><h1 class="speak-quote">${escapeHtml(c.chunk)}</h1><div class="ipa-box" id="ipaBox">••••••••</div><div class="speak-actions"><button class="secondary" id="revealIpa">Reveal IPA</button><button class="secondary" id="listenButton">▶ Listen</button></div><div class="feedback"><strong>Use it like this</strong>${escapeHtml(c.example)}</div><div class="self-rate"><button class="secondary" id="againRate">Needs practice</button><button class="primary" id="goodRate">I said it well</button></div></div>`;
    $("#revealIpa").addEventListener("click",()=>{$("#ipaBox").textContent=c.ipa;$("#revealIpa").disabled=true});
    $("#listenButton").addEventListener("click",()=>speak(c.chunk));
    $("#againRate").addEventListener("click",()=>rateSpeak(false,c)); $("#goodRate").addEventListener("click",()=>rateSpeak(true,c));
  }
  function speak(text){ if(!("speechSynthesis" in window))return; speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=.82;speechSynthesis.speak(u); }
  function rateSpeak(correct,c){ if(session.answered)return;session.answered=true;record(c.id,correct);updateSessionScore(correct);next(); }
  function next(){ session.index++;session.answered=false;if(session.index>=session.items.length)finish();else render(); }
  function finish(){
    const accuracy=Math.round(session.score/session.items.length*100);$("#summaryScore").textContent=session.score+"/"+session.items.length;$("#summaryAccuracy").textContent=accuracy+"%";$("#summaryStreak").textContent=session.bestStreak;
    $("#summaryLine").textContent=accuracy>=85?"Your recall is getting automatic.":accuracy>=60?"Good progress. Your misses are queued for review.":"A useful session—weak spots are now prioritized.";
    $("#sessionProgressBar").style.width="100%";show("summary");document.title="Session complete · Chunk Lab";updateHome();
  }
  $$('[data-mode]').forEach(b=>b.addEventListener("click",()=>start(b.dataset.mode)));
  $$('[data-nav="home"]').forEach(b=>b.addEventListener("click",()=>{show("home");updateHome();document.title="Chunk Lab — English Practice"}));
  $("#againButton").addEventListener("click",()=>start(session.sourceMode));
  $("#resetButton").addEventListener("click",()=>{if(confirm("Reset all scores and personalized review data on this device?")){progress=defaultState();save();updateHome();}});
  updateHome();
})();
