(()=>{
'use strict';
const ROOT='/apps/selflo/',RELEASE=ROOT+'perspective-library/release/vi/',KEY='selflo.flow.studio.v1';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const themes={adversity_resilience:'Nghịch cảnh',attention:'Chú ý',change_growth:'Thay đổi',emotion:'Cảm xúc',meaning_values:'Ý nghĩa',relationships:'Mối quan hệ',rest_wellbeing:'Nghỉ ngơi',self_understanding:'Hiểu mình',work_achievement:'Công việc'};
const slots=['Đêm yên tĩnh','Bình minh','Buổi sáng','Bắt đầu ngày','Giữa buổi sáng','Trước giờ nghỉ','Nghỉ trưa','Đầu giờ chiều','Đổi góc nhìn','Cuối giờ làm','Trở về','Khám phá buổi tối','Nhìn lại','Trước giờ ngủ'];
const ranges=[[0,4],[4,6],[6,7.5],[7.5,9],[9,10.5],[10.5,11.5],[11.5,13],[13,14.5],[14.5,16],[16,17.5],[17.5,19.5],[19.5,21],[21,22.5],[22.5,24]];
const wants=[['calm','Tôi muốn nhẹ lòng'],['story','Một câu chuyện'],['curious','Điều gì đó bất ngờ'],['work','Góc nhìn về công việc'],['relationships','Chuyện về con người'],['play','Giải trí một chút']];
let all=[],current=null,need='',history={date:'',seen:[],likes:[],dislikes:[],visits:0},sim=false;
try{history={...history,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(history))}catch{}};
const today=()=>new Date().toLocaleDateString('en-CA');
const slotOf=h=>ranges.findIndex(([a,b])=>h>=a&&h<b);
const context=()=>{
const now=new Date(),h=now.getHours()+now.getMinutes()/60;
return {slot:$('slot').value==='auto'?slotOf(h):Number($('slot').value),day:$('day').value==='auto'?now.getDay():Number($('day').value),visit:$('visit').value==='auto'?(history.visits>1?'return':'first'):$('visit').value};
};
const fetchJson=async p=>{const r=await fetch(RELEASE+p);if(!r.ok)throw Error('Không tải được '+p);return r.json()};
const mapStory=s=>({id:s.id,type:'story',title:s.title_vi,summary:s.subtitle_vi||s.opening_quote_vi||'Một câu chuyện trong thư viện Selflo.',theme:s.primary_theme,minutes:s.metadata?.reading_time_minutes||1,url:ROOT+'perspectives/read/?story='+encodeURIComponent(s.id)});
const mapQuote=q=>({id:q.id,type:'quote',title:q.title_vi||'',summary:q.text_vi||'',theme:q.primary_theme,author:q.authorship?.author_name||'Selflo',url:ROOT+'studio/perspectives/quotes/?quote='+encodeURIComponent(q.id)});
async function load(){
const m=await fetchJson('manifest.json');const stories=m.files.filter(x=>x.kind==='story'),packs=m.files.filter(x=>x.kind==='quote_pack');
const results=await Promise.allSettled([...stories,...packs].map(x=>fetchJson(x.path)));
const quotes=new Set();all=results.flatMap((r,i)=>{
if(r.status!=='fulfilled')return [];
const v=r.value;
if(i<stories.length)return v.status==='active'?[mapStory(v)]:[];
return (v.quotes||[]).filter(q=>{if(quotes.has(q.id))return false;quotes.add(q.id);return q.review?.status==='approved'&&q.rights?.status!=='unverified'}).map(mapQuote);
});
if(!all.length)throw Error('Không tìm thấy nội dung Release phù hợp.');
}
const hash=s=>{let h=2166136261;for(const c of s){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0};
function score(x,c){
const t=x.theme;let n=(hash(x.id+'|'+c.day+'|'+c.slot)%19)/19;
const morning=c.slot>=2&&c.slot<=4,night=c.slot>=12||c.slot<=1,lunch=c.slot===6,weekend=c.day===0||c.day===6;
const prefs={
calm:['rest_wellbeing','emotion','meaning_values'],story:[],curious:['attention','self_understanding','meaning_values'],work:['work_achievement','change_growth'],relationships:['relationships','meaning_values']
};
if(need==='story')n+=x.type==='story'?12:-12;
else if(need==='play')n-=20;
else if(need&&prefs[need])n+=prefs[need].includes(t)?12:0;
else{
if(morning)n+=['change_growth','meaning_values','attention'].includes(t)?5:0;
if(night)n+=['rest_wellbeing','relationships','self_understanding'].includes(t)?6:0;
if(lunch)n+=x.type==='quote'?5:0;
if(weekend)n+=['relationships','meaning_values','self_understanding'].includes(t)?4:0;
if(c.slot>=3&&c.slot<=5)n+=t==='work_achievement'?4:0;
if(c.slot===11)n+=x.type==='story'?5:0;
}
if(x.type==='story')n+=c.slot===11||c.slot===12||weekend?2:0;
if(history.seen.includes(x.id))n-=30;
if(history.likes.includes(x.id))n+=1;
if(history.dislikes.includes(x.id))n-=20;
return n;
}
const reason=(x,c)=>{const day=c.day===0?'Chủ nhật':c.day===6?'cuối tuần':'ngày trong tuần';return 'Đề xuất dựa trên '+slots[c.slot].toLowerCase()+', '+day+(need?' và lựa chọn gần nhất của bạn':'')+'. Chủ đề: '+(themes[x.theme]||'Góc nhìn')+'. Selflo không suy đoán cảm xúc của bạn.'};
function pick(){
const c=context();
$('greeting').textContent=c.visit==='return'?'Một điều khác cho lần trở lại này.':['Một điều dành cho lúc này.','Có một điều đáng để khám phá.','Đôi khi chỉ cần một góc nhìn khác.'][(c.slot+c.day)%3];
$('intro').textContent=c.visit==='return'?'Bạn đã ghé Selflo hôm nay. Lần này, thử một nội dung khác nhé.':'Không cần chọn trước. Nếu điều này chưa hợp, bạn có thể đổi bất cứ lúc nào.';
if(need==='play'){current=null;render(c);return}
const pool=all.filter(x=>need!=='story'||x.type==='story').sort((a,b)=>score(b,c)-score(a,c));
current=pool[0]||null;render(c);
}
function render(c){
$('status').textContent='';
if(!current){$('feature').innerHTML='<article class="flow-card"><p class="flow-kind">GIẢI TRÍ · CHƯA PHÁT HÀNH</p><h2>Một thử thách ngắn?</h2><p class="summary">Game Lab đã có ba trò chơi tương tác độc lập với độ khó tăng dần. Hãy thử chơi ngay.</p><div class="flow-card-actions"><a class="action-link" href="/apps/selflo/studio/developer/game-lab/">Chơi Game Lab ↗</a><button id="back-read" type="button">Khám phá nội dung khác</button></div></article>';$('back-read').onclick=()=>{need='';pick()};$('reason').textContent='Game Lab là nội dung trò chơi gốc ở Studio, chưa đưa vào Release public.';$('other-list').innerHTML='';return}
const x=current,story=x.type==='story',subtitle=story?'<p class="summary">'+esc(x.summary)+'</p>':'<blockquote class="quote">'+esc(x.summary)+'</blockquote>';
$('feature').innerHTML='<article class="flow-card"><p class="flow-kind">'+(story?'CÂU CHUYỆN':'MỘT CÂU NÓI')+' · '+esc(themes[x.theme]||'Góc nhìn')+'</p><h2>'+esc(x.title||'Một góc nhìn cho bạn')+'</h2>'+subtitle+'<p class="meta">'+(story?esc(x.minutes)+' phút đọc · Tóm tắt từ nội dung Release':'— '+esc(x.author))+'</p><div class="flow-card-actions"><a class="action-link" href="'+esc(x.url)+'">'+(story?'Đọc câu chuyện':'Xem Quote')+' ↗</a></div><div class="feedback"><button type="button" data-feedback="like" aria-pressed="'+history.likes.includes(x.id)+'">♡ Tôi thích</button><button type="button" data-feedback="dislike" aria-pressed="'+history.dislikes.includes(x.id)+'">Không hợp lúc này</button></div></article>';
$('feature').querySelectorAll('[data-feedback]').forEach(b=>b.onclick=()=>{const k=b.dataset.feedback==='like'?'likes':'dislikes',other=k==='likes'?'dislikes':'likes';history[k]=[...new Set([...history[k],x.id])];history[other]=history[other].filter(id=>id!==x.id);save();render(context())});
$('reason').textContent=reason(x,c);
const others=all.filter(y=>y.id!==x.id&&(!history.seen.includes(y.id))&&y.type!==x.type).sort((a,b)=>score(b,c)-score(a,c)).slice(0,2);
$('other-list').innerHTML=others.map(y=>'<a href="'+esc(y.url)+'"><small>'+esc(y.type==='story'?'Story':'Quote')+' · '+esc(themes[y.theme]||'Góc nhìn')+'</small><strong>'+esc(y.title||y.summary.slice(0,65))+'</strong></a>').join('')||'<p class="flow-empty">Bạn đã xem khá nhiều nội dung. Hãy thử đổi chủ đề.</p>';
}
function advance(){
if(current){history.seen.push(current.id);history.seen=[...new Set(history.seen)].slice(-120);save()}
pick();
}
function start(){
const d=today();if(history.date!==d){history={date:d,seen:[],likes:history.likes||[],dislikes:history.dislikes||[],visits:0};}
history.visits++;save();
ranges.forEach(([a,b],i)=>{const o=document.createElement('option');o.value=String(i);const f=h=>String(Math.floor(h)).padStart(2,'0')+':'+(h%1?'30':'00');o.textContent=f(a)+'–'+f(b)+' · '+slots[i];$('slot').appendChild(o)});
$('need-options').innerHTML=wants.map(([id,label])=>'<button type="button" data-need="'+id+'" aria-pressed="false">'+label+'</button>').join('');
$('need-options').querySelectorAll('[data-need]').forEach(b=>b.onclick=()=>{need=b.dataset.need;$('needs').hidden=true;pick()});
$('preferences').onclick=()=>{$('needs').hidden=!$('needs').hidden};
$('clear-need').onclick=()=>{need='';$('needs').hidden=true;pick()};
$('next').onclick=advance;
$('simulate').onclick=()=>{need='';pick()};
$('reset').onclick=()=>{try{localStorage.removeItem(KEY)}catch{}history={date:today(),seen:[],likes:[],dislikes:[],visits:1};need='';pick()};
load().then(pick).catch(e=>{$('status').textContent=e.message;$('feature').innerHTML='<p class="flow-empty">Không tải được kho nội dung chính thức. Vui lòng thử lại sau.</p>'});
}
start();
})();