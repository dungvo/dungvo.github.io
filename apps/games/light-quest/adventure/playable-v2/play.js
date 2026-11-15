import {propagate} from '../core/tactical-optics.js';
const W=1200,H=720,S=72,OX=340,OY=136,COLORS={gold:0xffd36e,red:0xff625b,blue:0x72d9ff,purple:0xc68aff};
const $=s=>document.querySelector(s);
const initial=()=>({width:7,height:6,sources:[{x:0,y:2,dir:0,color:'gold',power:1},{x:0,y:5,dir:0,color:'red',power:2}],objects:[
{id:'a',type:'mirror',x:2,y:2,axis:0,sided:'double'},{id:'b',type:'mirror',x:2,y:0,axis:0,sided:'double'},
{id:'c',type:'mirror',x:4,y:5,axis:0,sided:'double'},
{id:'door',type:'receiver',x:6,y:0,color:'gold'},
{id:'rock',type:'rock',x:5,y:5,hardness:1.5},
{type:'wall',x:3,y:3},{type:'wall',x:4,y:3}]});
let level=initial(),energy=24,turn=0,history=[],rockGone=false,loot=false,gate=false,scan=false,monster={x:6,y:3,hp:2,route:[[6,3],[5,3],[5,4],[6,4]],i:0},selected='rotate';
function snapshot(){history.push(JSON.stringify({level,energy,turn,rockGone,loot,gate,scan,monster}));if(history.length>100)history.shift()}
function undo(){if(!history.length)return;({level,energy,turn,rockGone,loot,gate,scan,monster}=JSON.parse(history.pop()));game.scene.keys.play.paint()}
function act(type,id){const cost={rotate:1,scan:2,repair:3,wait:0}[type];if(energy<cost){toast('Không đủ năng lượng');return}if(type==='rotate'&&!level.objects.some(o=>o.id===id&&o.type==='mirror'))return;snapshot();energy-=cost;turn++;if(type==='rotate'){const o=level.objects.find(o=>o.id===id);o.axis=(o.axis+1)%8}if(type==='scan')scan=true;
const ray=propagate(level);if(ray.beams.some(seg=>seg.color==='red'&&seg.to[0]===monster.x&&seg.to[1]===monster.y)){monster.hp=Math.max(0,monster.hp-1);if(monster.hp===0)toast('Đã tiêu diệt Quái Bóng Tối!')}if(ray.hits.some(h=>h.kind==='rock'&&h.broken)){rockGone=true;level.objects=level.objects.filter(o=>o.id!=='rock')}gate=ray.hits.some(h=>h.x===6&&h.y===0&&h.color==='gold');
if(monster.hp>0){monster.i=(monster.i+1)%monster.route.length;[monster.x,monster.y]=monster.route[monster.i];if(turn%4===0){const target=level.objects.find(o=>o.id==='c');if(target&&!target.broken){target.broken=true;toast('Quái vật đã phá gương C!')}}}
game.scene.keys.play.paint()}
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),1700)}
class Play extends Phaser.Scene{
constructor(){super('play')}
preload(){this.load.svg('temple','../assets/temple-garden.svg',{width:1200,height:720});this.load.svg('sprites','../assets/optics-sprites.svg',{width:512,height:128})}create(){this.cameras.main.setBackgroundColor('#09182c');this.add.image(600,360,'temple').setDepth(-10);this.art=this.add.graphics();this.spriteLayer=this.add.container(0,0).setDepth(5);this.board=this.add.graphics();this.rays=this.add.graphics();this.items=this.add.graphics();this.labels=[];this.paint();this.input.on('pointerdown',p=>{let x=Math.floor((p.x-OX)/S),y=Math.floor((p.y-OY)/S);if(x<0||x>=7||y<0||y>=6)return;let obj=level.objects.find(o=>o.x===x&&o.y===y);if(obj?.type==='mirror'){if(obj.broken){if(loot){snapshot();obj.broken=false;loot=false;turn++;energy=Math.max(0,energy-3);this.paint();toast('Đã phục hồi gương cổ')}else toast('Cần tìm mảnh gương để sửa')}else act('rotate',obj.id)}else if(rockGone&&!loot&&x===5&&y===5){snapshot();loot=true;this.paint();toast('Nhận mảnh gương cổ!')}else if(scan){toast('Ô ('+(x+1)+','+(y+1)+') đã được soi sáng')}else toast('Chạm vào gương để xoay')})}
drawBackdrop(){let g=this.art;g.fillGradientStyle(0x112b45,0x122a46,0x0b2634,0x0b1c31).fillRect(0,0,W,H);
for(let i=0;i<100;i++){let x=(i*131+47)%W,y=(i*79+17)%H;g.fillStyle(i%3===0?0x8061ac:0x2e6b65,.26).fillCircle(x,y,7+i%23)}
g.fillStyle(0x2c3e43).fillRoundedRect(17,85,285,525,22);g.fillStyle(0x2c3e43).fillRoundedRect(900,85,285,525,22);
g.lineStyle(5,0xc5a064).strokeRoundedRect(17,85,285,525,22);g.lineStyle(5,0xc5a064).strokeRoundedRect(900,85,285,525,22);
g.fillStyle(0x1e3d48).fillRoundedRect(26,93,267,509,17);g.fillStyle(0x1e3d48).fillRoundedRect(909,93,267,509,17);
for(let i=0;i<24;i++){const x=320+i*23,y=i%2?90:590;g.fillStyle(0x3c7758,.75).fillCircle(x,y,21);g.fillStyle(0x667e50,.45).fillCircle(x+9,y+9,10)}
g.fillStyle(0x16364b).fillRoundedRect(312,110,570,495,12);
g.fillStyle(0x2e5a64).fillRoundedRect(34,460,244,120,12);g.fillStyle(0x4f7584).fillEllipse(150,545,220,33);
g.fillStyle(0xd5c2ad).fillCircle(160,480,23);g.fillStyle(0xeeeeef).fillCircle(160,470,20);g.fillStyle(0x304c84).fillTriangle(122,537,160,492,201,537);g.fillStyle(0xffdc92).fillCircle(222,479,12);
g.lineStyle(2,0xffe7b1).strokeCircle(222,479,18);
g.fillStyle(0x30485b).fillRoundedRect(918,477,244,101,14);g.lineStyle(3,0xa98a61).strokeRoundedRect(918,477,244,101,14);
}
paint(){this.board.clear();this.rays.clear();this.items.clear();this.labels.forEach(t=>t.destroy());this.labels=[];this.spriteLayer.removeAll(true);
const g=this.board,o=this.items,b=this.rays;
// Illustrated floor is baked into temple-garden.svg; rays and objects stay dynamic.
for(let y=0;y<6;y++)for(let x=0;x<7;x++){const xx=OX+x*S,yy=OY+y*S;g.fillStyle(0x13273a,.03).fillRoundedRect(xx+2,yy+2,S-4,S-4,6);if((x*7+y)%9===0){g.lineStyle(2,0x72976b,.7).lineBetween(xx+8,yy+8,xx+23,yy+15)}}
let result=propagate(level);if(result.hits.some(h=>h.kind==='rock'&&h.broken)&&!rockGone){rockGone=true;level.objects=level.objects.filter(o=>o.id!=='rock');result=propagate(level)}
gate=result.hits.some(h=>h.x===6&&h.y===0&&h.color==='gold');
for(const beam of result.beams){const [x,y]=beam.from,[a,c]=beam.to;const ax=OX+(x+.5)*S,ay=OY+(y+.5)*S,bx=OX+(a+.5)*S,by=OY+(c+.5)*S,col=COLORS[beam.color];b.lineStyle(19,col,.16).lineBetween(ax,ay,bx,by);b.lineStyle(9,col,.68).lineBetween(ax,ay,bx,by);b.lineStyle(3,0xfff8dd).lineBetween(ax,ay,bx,by)}
for(const source of level.sources){let x=OX+(source.x+.5)*S,y=OY+(source.y+.5)*S;this.spriteLayer.add(this.add.image(x,y,'sprites').setCrop(source.color==='red'?128:256,0,128,128).setDisplaySize(66,66))}
for(const obj of level.objects){let x=OX+(obj.x+.5)*S,y=OY+(obj.y+.5)*S;
if(obj.type==='mirror'){const sprite=this.add.image(x,y,'sprites').setCrop(0,0,128,128).setDisplaySize(67,67).setAngle(obj.axis*22.5-135).setAlpha(obj.broken?.5:1);this.spriteLayer.add(sprite);if(obj.broken){o.lineStyle(3,0xff6a6a).lineBetween(x-16,y-20,x+13,y+18)}}
if(obj.type==='receiver'){o.fillStyle(gate?0xe5af3b:0x6c6487).fillCircle(x,y,28);o.lineStyle(5,0xffe3a6).strokeCircle(x,y,28);o.fillStyle(gate?0xffffff:0x87a8d4).fillTriangle(x,y-20,x+19,y+16,x-19,y+16)}
if(obj.type==='rock'){o.fillStyle(0x8e7b74).fillRoundedRect(x-26,y-22,52,45,11);o.lineStyle(4,0xbca69b).strokeRoundedRect(x-26,y-22,52,45,11);o.lineStyle(3,0xed9b6b).lineBetween(x-12,y-17,x+13,y+17)}
if(obj.type==='wall'){o.fillStyle(0x687073).fillRoundedRect(x-30,y-30,60,60,9);o.lineStyle(5,0x9a9b92).strokeRoundedRect(x-30,y-30,60,60,9)}
}
if(rockGone&&!loot){const x=OX+5.5*S,y=OY+5.5*S;o.fillStyle(0x61d4f5).fillTriangle(x,y-19,x+16,y+9,x-16,y+9);o.lineStyle(3,0xffffff).strokeCircle(x,y,24)}
if(monster.hp>0){let x=OX+(monster.x+.5)*S,y=OY+(monster.y+.5)*S;this.spriteLayer.add(this.add.image(x,y,'sprites').setCrop(384,0,128,128).setDisplaySize(69,69))}
if(scan){o.lineStyle(4,0x76f6d7,.7).strokeRoundedRect(OX+4*S+6,OY+4*S+6,2*S-12,S-12,9)}
this.labels.push(this.add.text(44,108,'NHIỆM VỤ',{font:'bold 23px Georgia',color:'#ffe1a1'}));this.labels.push(this.add.text(42,157,'◇ Dẫn tia vàng mở cổng\n\n◇ Dùng tia đỏ phá đá\n\n◇ Thu thập mảnh gương\n\n◇ Khám phá bí mật',{font:'18px system-ui',color:'#e4e5db',lineSpacing:6}));
this.labels.push(this.add.text(928,108,'TRẠNG THÁI',{font:'bold 23px Georgia',color:'#ffe1a1'}));this.labels.push(this.add.text(928,158,'⚡ Năng lượng: '+energy+'/24\n\n⌛ Lượt: '+turn+'\n\n◆ Đá: '+(rockGone?'Đã phá':'Chưa phá')+'\n\n✧ Cổng: '+(gate?'Đã mở':'Chưa mở')+'\n\n◈ Mảnh gương: '+(loot?1:0),{font:'17px system-ui',color:'#e4e5db',lineSpacing:4}));
this.labels.push(this.add.text(930,488,'QUÁI BÓNG TỐI\nDi chuyển mỗi lượt.\nPhá gương mỗi 4 lượt.',{font:'16px system-ui',color:'#ffcaac',lineSpacing:5}));
this.labels.push(this.add.text(44,465,'LUMI · NGƯỜI DẪN ĐƯỜNG',{font:'bold 15px Georgia',color:'#ffe5a6'}));
this.labels.push(this.add.text(40,560,'Xoay gương, tìm lối đi,\nđánh thức khu vườn!',{font:'15px system-ui',color:'#ffffff'}));
$('#energy').textContent=energy;$('#turn').textContent=turn;$('#loot').textContent=loot?'Đã lấy':'Chưa lấy';if(gate&&rockGone&&!loot&&turn>0)toast('Cổng mở! Chạm mảnh pha lê tại vị trí đá đã phá.');
}
}
const game=new Phaser.Game({type:Phaser.CANVAS,parent:'game',width:W,height:H,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[Play],fps:{target:30,forceSetTimeOut:true},render:{antialias:true}});
$('#reset').onclick=()=>{level=initial();energy=24;turn=0;history=[];rockGone=false;loot=false;gate=false;scan=false;monster={x:6,y:3,hp:2,route:[[6,3],[5,3],[5,4],[6,4]],i:0};game.scene.keys.play.paint()};
$('#undo').onclick=undo;$('#scan').onclick=()=>act('scan');$('#wait').onclick=()=>act('wait');$('#hint').onclick=()=>toast('Hai gương phía trên: xoay đến 135° để đưa tia vàng đến cổng. Tia đỏ phá đá theo đường thẳng.');
document.addEventListener('visibilitychange',()=>document.hidden?game.loop.sleep():game.loop.wake());
