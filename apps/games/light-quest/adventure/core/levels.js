// All gameplay content is data-driven; new levels require no renderer changes.
export const LEVELS=[{
 id:'garden-01',title:'Ánh Sáng Đầu Tiên',width:5,height:5,
 sources:[{x:0,y:2,dir:0}],targets:[[4,0]],
 mirrors:[{x:2,y:2,angle:0},{x:2,y:0,angle:0}],
 walls:[],hint:'Gương dưới đặt 45°, gương trên đặt 135° (đo từ trục ngang).'
},{
 id:'garden-02',title:'Đường Chéo Bí Mật',width:5,height:5,
 sources:[{x:0,y:3,dir:0}],targets:[[4,1]],
 mirrors:[{x:2,y:3,angle:0},{x:4,y:1,angle:0}],
 walls:[[3,3]],hint:'Tận dụng góc 22,5° để chuyển tia sang đường chéo.'
}];
