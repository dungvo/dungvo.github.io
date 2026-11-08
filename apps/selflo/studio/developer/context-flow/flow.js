(()=>{
'use strict';
const ROOT='/apps/selflo/',RELEASE=ROOT+'perspective-library/release/vi/',KEY='selflo.flow.studio.v1';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const themes={mystery:'Bí ẩn',humor:'Hài hước',nature:'Thiên nhiên',science_curiosity:'Khám phá',social_observation:'Quan sát xã hội',adversity_resilience:'Nghịch cảnh',attention:'Chú ý',change_growth:'Thay đổi',emotion:'Cảm xúc',meaning_values:'Ý nghĩa',relationships:'Mối quan hệ',rest_wellbeing:'Nghỉ ngơi',self_understanding:'Hiểu mình',work_achievement:'Công việc'};
const slots=['Đêm yên tĩnh','Bình minh','Buổi sáng','Bắt đầu ngày','Giữa buổi sáng','Trước giờ nghỉ','Nghỉ trưa','Đầu giờ chiều','Đổi góc nhìn','Cuối giờ làm','Trở về','Khám phá buổi tối','Nhìn lại','Trước giờ ngủ'];
const ranges=[[0,4],[4,6],[6,7.5],[7.5,9],[9,10.5],[10.5,11.5],[11.5,13],[13,14.5],[14.5,16],[16,17.5],[17.5,19.5],[19.5,21],[21,22.5],[22.5,24]];
const contextGroup=(c)=>({day:c.day===1?'week_start':c.day===0||c.day===6?'weekend':'weekday',time:c.slot<=2?'early':c.slot<=5?'active':c.slot<=8?'break':c.slot<=11?'evening':'night'});
const wants=[['calm','Tôi muốn nhẹ lòng'],['story','Một câu chuyện'],['curious','Điều gì đó bất ngờ'],['work','Góc nhìn về công việc'],['relationships','Chuyện về con người'],['play','Giải trí một chút']];
let all=[],current=null,need='',lastKinds=[],history={date:'',seen:[],likes:[],dislikes:[],visits:0},sim=false;
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
try{const r=await fetch('./sourced-catalog.json');if(r.ok){const c=await r.json();all.push(...c.entries.map(x=>({id:x.id,type:'external_story',title:x.title_vi,summary:x.teaser_vi,theme:x.theme,intent:x.intent,minutes:x.minutes,author:x.author,source_work:x.source_work,rights:x.rights,url:x.source_url})))}}catch(e){console.warn('External catalog unavailable',e)}
try{const r=await fetch('./discovery-catalog.json');if(r.ok){const c=await r.json();all.push(...c.entries.map(x=>({id:x.id,type:'micro_discovery',title:x.title,summary:x.teaser,action:x.action,theme:x.group,intent:x.intent,minutes:'1',author:'Selflo',url:'',group:x.group})))}}catch(e){console.warn('Micro discovery catalog unavailable',e)}
all.push({id:'game-detective',type:'game',title:'Hồ sơ Ánh Trăng',summary:'Một hiện trường có điều bất thường. Bạn có tìm ra trước khi kết luận?',theme:'mystery',intent:'play',minutes:'3–6',url:ROOT+'studio/developer/detective/'},{id:'game-adventure',type:'game',title:'Hành trình Đom Đóm',summary:'Đi qua những thế giới nhỏ, tìm ánh sáng và khám phá một điều bất ngờ.',theme:'adventure',intent:'play',minutes:'3–6',url:ROOT+'studio/developer/adventure/'},{id:'game-visual',type:'game',title:'Thử thách thị giác',summary:'Năm trò chơi trực quan: ánh sáng, mê cung, trí nhớ và quan sát.',theme:'play',intent:'play',minutes:'2–5',url:ROOT+'studio/developer/visual-games/'});
if(!all.length)throw Error('Không tìm thấy nội dung phù hợp.');
}
const hash=s=>{let h=2166136261;for(const c of s){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0};
function score(x,c){
const t=x.theme,g=contextGroup(c);let n=(hash(x.id+'|'+c.day+'|'+c.slot)%19)/19;
const morning=c.slot>=2&&c.slot<=4,night=c.slot>=12||c.slot<=1,lunch=c.slot===6,weekend=c.day===0||c.day===6;
const prefs={
calm:['rest_wellbeing','emotion','meaning_values'],story:[],curious:['attention','self_understanding','meaning_values'],work:['work_achievement','change_growth'],relationships:['relationships','meaning_values']
};
if(need==='story')n+=x.type==='story'||x.type==='external_story'?20:-20;
else if(need==='play')n+=x.type==='game'?24:x.type==='micro_discovery'&&x.group==='play'?15:-12;
else if(need&&prefs[need])n+=prefs[need].includes(t)||x.intent===need?12:0;
else{
if(morning)n+=['change_growth','meaning_values','attention','curiosity','observation'].includes(t)?5:0;
if(night)n+=['rest_wellbeing','relationships','self_understanding','calm','reflection'].includes(t)?6:0;
if(lunch)n+=x.type==='game'||x.group==='play'?9:0;
if(g.day==='weekend')n+=['relationships','meaning_values','self_understanding'].includes(t)?4:0;if(g.day==='week_start')n+=['change_growth','work_achievement'].includes(t)?2:0;
if(c.slot>=3&&c.slot<=5)n+=t==='work_achievement'?4:0;
if(c.slot===11)n+=x.type==='story'?5:0;
}
if(x.type==='story'||x.type==='external_story')n+=c.slot===11||c.slot===12||weekend?2:0;if(x.type==='external_story'){n+=3;if(c.slot===11||weekend)n+=2;if(x.intent==='calm'&&night)n+=4;if(x.intent==='humor'&&lunch)n+=5;if(x.intent==='adventure'&&weekend)n+=4;if(x.intent==='mystery'&&c.slot===11)n+=5;if(x.intent==='critical'&&morning)n+=3;}
if(x.type==='micro_discovery'){n+=3;if(x.group==='observation'&&c.slot>=2&&c.slot<=8)n+=5;if(x.group==='connection'&&weekend)n+=4;if(x.group==='reflection'&&night)n+=6}
if(x.type==='game'){n+=lunch?12:0;if(c.slot>=9&&c.slot<=11)n+=4}
if(lastKinds.includes(x.type))n-=7;
if(history.seen.includes(x.id))n-=100;
if(history.likes.includes(x.id))n+=1;
if(history.dislikes.includes(x.id))n-=20;
return n;
}
const reason=(x,c)=>{const day=contextGroup(c).day==='week_start'?'đầu tuần':contextGroup(c).day==='weekend'?'cuối tuần':'ngày thường';return 'Đề xuất dựa trên '+slots[c.slot].toLowerCase()+', '+day+(need?' và lựa chọn gần nhất của bạn':'')+'. Chủ đề: '+(themes[x.theme]||'Góc nhìn')+'. Selflo không suy đoán cảm xúc của bạn.'};
function pick(){
const c=context();
$('greeting').textContent=c.visit==='return'?'Một điều khác cho lần trở lại này.':['Một điều dành cho lúc này.','Có một điều đáng để khám phá.','Đôi khi chỉ cần một góc nhìn khác.'][(c.slot+c.day)%3];
$('intro').textContent=c.visit==='return'?'Bạn đã ghé Selflo hôm nay. Lần này, thử một nội dung khác nhé.':'Không cần chọn trước. Nếu điều này chưa hợp, bạn có thể đổi bất cứ lúc nào.';
const pool=all.filter(x=>need!=='story'||x.type==='story'||x.type==='external_story').sort((a,b)=>score(b,c)-score(a,c));
current=pool[0]||null;render(c);
}
function render(c){
$('status').textContent='';
if(!current){$('feature').innerHTML='<article class="flow-card"><p class="flow-kind">GIẢI TRÍ · CHƯA PHÁT HÀNH</p><h2>Một thử thách ngắn?</h2><p class="summary">Visual Game Lab có năm trò chơi thao tác trực quan với độ khó tăng dần. Hãy thử chơi ngay.</p><div class="flow-card-actions"><a class="action-link" href="/apps/selflo/studio/developer/visual-games/">Chơi Visual Game Lab ↗</a><button id="back-read" type="button">Khám phá nội dung khác</button></div></article>';$('back-read').onclick=()=>{need='';pick()};$('reason').textContent='Game Lab là nội dung trò chơi gốc ở Studio, chưa đưa vào Release public.';$('other-list').innerHTML='';return}
const x=current,external=x.type==='external_story',story=x.type==='story'||external,micro=x.type==='micro_discovery',game=x.type==='game';
const kind=micro?'MỘT KHÁM PHÁ NHỎ':game?'THỬ CHƠI':story?'CÂU CHUYỆN':'MỘT CÂU NÓI';
const subtitle=micro?'<p class="summary">'+esc(x.summary)+'</p><div class="flow-micro-action"><span>✦ THỬ NGAY</span><p>'+esc(x.action)+'</p></div>':story||game?'<p class="summary">'+esc(x.summary)+'</p>':'<blockquote class="quote">'+esc(x.summary)+'</blockquote>';
const action=micro?'':('<a class="action-link" href="'+esc(x.url)+'">'+(game?'Bắt đầu chơi':story?'Khám phá câu chuyện':'Xem Quote')+' ↗</a>');
const meta=micro?'Khoảng 1 phút · Hoạt động gốc của Selflo':game?'Trò chơi tại Developer · Có thể chơi ngay':external?'Truyện tuyển chọn · Mở bản gốc tiếng Anh tại nguồn':story?'Nội dung Selflo Release':'— '+esc(x.author);
$('feature').innerHTML='<article class="flow-card flow-card--'+esc(x.type)+'"><p class="flow-kind">'+kind+' · '+esc(themes[x.theme]||({observation:'Quan sát',curiosity:'Tò mò',play:'Giải trí',connection:'Kết nối',calm:'Thư giãn',reflection:'Nhìn lại',adventure:'Phiêu lưu'}[x.theme]||'Khám phá'))+'</p><h2>'+esc(x.title||'Một góc nhìn cho bạn')+'</h2>'+subtitle+'<p class="meta">'+meta+'</p><div class="flow-card-actions">'+action+'</div><div class="feedback"><button type="button" data-feedback="like" aria-pressed="'+history.likes.includes(x.id)+'">♡ Tôi thích</button><button type="button" data-feedback="dislike" aria-pressed="'+history.dislikes.includes(x.id)+'">Không hợp lúc này</button></div></article>';
$('feature').querySelectorAll('[data-feedback]').forEach(b=>b.onclick=()=>{const k=b.dataset.feedback==='like'?'likes':'dislikes',other=k==='likes'?'dislikes':'likes';history[k]=[...new Set([...history[k],x.id])];history[other]=history[other].filter(id=>id!==x.id);save();render(context())});
$('reason').textContent=reason(x,c);
const others=all.filter(y=>y.id!==x.id&&(!history.seen.includes(y.id))&&y.type!==x.type).sort((a,b)=>score(b,c)-score(a,c)).slice(0,2);
$('other-list').innerHTML=others.map(y=>'<a href="'+esc(y.url||'#feature')+'"><small>'+esc(y.type==='story'?'Story':y.type==='external_story'?'Truyện tuyển chọn':y.type==='micro_discovery'?'Khám phá nhanh':y.type==='game'?'Game':'Quote')+' · '+esc(themes[y.theme]||'Góc nhìn')+'</small><strong>'+esc(y.title||y.summary.slice(0,65))+'</strong></a>').join('')||'<p class="flow-empty">Bạn đã xem khá nhiều nội dung. Hãy thử đổi chủ đề.</p>';
}
function advance(){
if(current){lastKinds=[current.type,...lastKinds].slice(0,3);history.seen.push(current.id);history.seen=[...new Set(history.seen)].slice(-250);save()}
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