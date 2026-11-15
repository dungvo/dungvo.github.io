import {GARDEN} from './garden-room.js';

const fixture = (id, type, x, y, attrs) => ({id, type, x, y, ...attrs});
const mirror = (id, x, y, axis, sided = 'double') => fixture(id, 'mirror', x, y, {axis, sided, efficiency:.94});
const crystal = (id, x, y, color, requirement) => fixture(id, 'receiver', x, y, {color, requirement});
const wall = (id, x, y) => fixture(id, 'wall', x, y);
const sun = (y, power) => ({id:'sun',x:0,y,dir:0,color:'gold',power});
const ember = (y, power) => ({id:'ember',x:0,y,dir:0,color:'red',power,enabled:false});
const room = (metadata, content) => ({width:7,height:6,energy:16,transmissionPerCell:.985,...metadata,...content});
const branch = (x, y) => fixture('prism','splitter',x,y,{ratio:.45,efficiency:.92});
const filter = (id, x, y, color) => fixture(id,'filter',x,y,{color,efficiency:.93});
const lens = (id, x, y) => fixture(id,'amplifier',x,y,{gain:2,supply:.9,cap:1.9});

export const AWAKENING = [
  {
    ...GARDEN, id:'first-light', title:'Ánh Sáng Đầu Tiên', theme:'garden',
    intro:'Chạm gương xanh để xoay. Dẫn tia vàng đến pha lê để mở cổng cổ.',
    hint:'Gương Bắc và Nam cùng nghiêng 45° tạo đường gấp khúc. Hoặc đặt gương Bắc nằm ngang để tia đi thẳng đến lăng kính.'
  },
  room({
    id:'split-prism', title:'Điện Lăng Kính', theme:'prism',
    intro:'Chạm ô sáng cạnh nhân vật để đi. Giữ hai mâm đá cùng lúc để nâng cửa chắn tia.',
    hint:'Đẩy khối đá hai ô sang phải lên mâm phía trên. Sau đó đi vòng xuống mâm dưới. Cần gạt ở phía tây là lối khác.'
  }, {
    sources:[sun(1,2.65)],
    objects:[
      branch(3,1), fixture('upper-shutter','wall',5,1,{shutter:true}), crystal('crystal',6,1,'gold',1),
      fixture('south','mirror',3,4,{axis:2,sided:'double',efficiency:.94,locked:true}),
      fixture('lower-shutter','wall',5,4,{shutter:true}), crystal('crystal-east',6,4,'gold',.85),
      wall('ruin-a',2,2), wall('ruin-b',5,3), wall('ruin-c',1,5)
    ],
    traversal:{
      start:{x:1,y:3},
      crates:[{id:'counterweight',x:2,y:3}],
      plates:[{id:'upper-plate',x:4,y:3,shutter:'upper-shutter'},{id:'lower-plate',x:2,y:5,shutter:'lower-shutter'}],
      relays:[{id:'latch',x:1,y:0,shutter:'upper-shutter'}]
    }
  }),
  room({
    id:'two-spectra', title:'Hành Lang Hai Màu', theme:'ember',
    intro:'Mỗi pha lê nhận một màu. Bật nguồn đỏ và để bộ khuếch đại tiếp sức cho tia.',
    hint:'Gương Bắc đưa tia vàng xuống. Tia đỏ phải đi qua kính lọc và bộ khuếch đại trước khi Gương Đông đưa nó lên.'
  }, {
    sources:[sun(1,1.75),ember(5,1.1)],
    objects:[
      mirror('north',2,1,1,'single'), filter('sun-filter',2,3,'gold'), crystal('crystal',2,4,'gold',1.3),
      filter('ember-filter',1,5,'red'), lens('ember-lens',2,5), mirror('guard',5,5,5),
      crystal('crystal-east',5,2,'red',1.6),
      wall('ruin-a',4,1), wall('ruin-b',3,4), wall('ruin-c',6,3)
    ],
    secret:{x:4,y:3,radius:2}, lantern:[4,4]
  }),
  room({
    id:'diagonal-trail', title:'Mật Đạo Chéo', theme:'violet',
    intro:'Đường ngang bị chặn. Hãy dùng các góc 22,5° để nối đường sáng qua ba gương.',
    hint:'Gương Bắc nghiêng 22,5°, Gương Giữa nằm ngang, Gương Đông nghiêng 22,5°. Theo tia chéo tới từng gương.'
  }, {
    sources:[sun(1,1.85)],
    objects:[
      mirror('north',2,1,0,'single'), mirror('middle',4,3,1), mirror('guard',6,1,0),
      crystal('crystal',6,5,'gold',1.25),
      wall('ruin-a',4,1), wall('ruin-b',5,3), wall('ruin-c',3,4)
    ],
    pattern:[[0,1],[1,1],[2,1],[3,2],[4,3],[5,2],[6,1],[6,2],[6,3],[6,4],[6,5]]
  }),
  room({
    id:'night-warden', title:'Cổng Của Sói Bóng Đêm', theme:'night',
    intro:'Đi tới chuông để đánh lạc hướng sói, hoặc dùng tia đỏ hạ nó và sửa gương đã vỡ.',
    hint:'Bước tới chuông trước khi sói phá gương. Trong lúc sói dừng, bật tia đỏ để phá đá rồi xoay Gương Bắc nghiêng 45°.'
  }, {
    sources:[sun(1,1.9),ember(4,1.1)],
    objects:[
      mirror('north',2,1,1,'single'), lens('ember-lens',1,4),
      fixture('sealed-rock','rock',2,4,{hardness:1.55}), mirror('guard',2,5,2),
      crystal('crystal',6,5,'gold',1.35),
      wall('ruin-a',4,3), wall('ruin-b',4,2), wall('ruin-c',5,0)
    ],
    traversal:{start:{x:4,y:1},bell:{x:5,y:1,duration:3}},
    wolf:{x:3,y:5,hp:2,step:0,patrol:[[3,5],[3,4],[2,4],[2,5]]},
    secret:{x:5,y:3,radius:2}, lantern:[5,4]
  }),
  room({
    id:'rift-relic', title:'Vực Ánh Sáng', theme:'rift', energy:24,
    intro:'Dùng cầu đang sáng để qua vực. Lấy Lõi Mặt Trời rồi mang về bệ đá bên bờ xuất phát.',
    hint:'Qua cầu trên để lấy lõi ở góc trên bên phải. Lõi quá nặng cho cầu cũ. Bước lên một cần gạt bên bờ đông để thắp cầu chéo (ngắn hơn) hoặc cầu dưới (có ấn thưởng).'
  }, {
    sources:[sun(1,2.3)],
    objects:[
      fixture('north','mirror',1,1,{axis:0,sided:'double',efficiency:.95,locked:true}),
      fixture('south','mirror',1,4,{axis:2,sided:'double',efficiency:.95,locked:true}),
      wall('ruin-a',4,2), wall('ruin-b',5,2), wall('ruin-c',0,2)
    ],
    traversal:{
      start:{x:2,y:0},
      chasm:3,
      relic:{x:6,y:0},
      exit:{x:0,y:5},
      bridges:[{x:3,y:1,fragile:true},{x:3,y:3},{x:3,y:4,seal:true}],
      relays:[
        {id:'diagonal-bridge',x:6,y:3,mirror:'north',axis:1,bridgeLabel:'Cầu chéo'},
        {id:'lower-bridge',x:5,y:5,mirror:'north',axis:2,bridgeLabel:'Cầu dưới'}
      ]
    }
  })
];
