// Deterministic eight-direction grid optics. 0=E, 1=SE, ... 7=NE.
// Mirror axis is a multiple of 22.5 degrees. Reflection: outgoing angle = 2*axis - incoming.
export const DIRS=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
export const mod=(n,m)=>(n%m+m)%m;
export function reflect(incoming,axisStep){return mod(axisStep-incoming,8)}
export function trace(level,angles){
 const mirrors=new Map(level.mirrors.map((m,i)=>[m.x+','+m.y,angles[i]]));
 const walls=new Set((level.walls||[]).map(p=>p.join(',')));
 const targets=new Set(level.targets.map(p=>p.join(',')));
 const charged=new Set(),segments=[],seen=new Set();
 const queue=level.sources.map(s=>({...s,dir:s.dir}));
 for(const source of queue){
  let {x,y,dir}=source;
  for(let step=0;step<level.width*level.height*12;step++){
   const state=x+','+y+','+dir;
   if(seen.has(state))break;
   seen.add(state);
   const [dx,dy]=DIRS[dir],nx=x+dx,ny=y+dy;
   if(nx<0||ny<0||nx>=level.width||ny>=level.height||walls.has(nx+','+ny))break;
   segments.push([x,y,nx,ny]);x=nx;y=ny;
   if(targets.has(x+','+y))charged.add(x+','+y);
   const mirror=mirrors.get(x+','+y);
   if(mirror!==undefined)dir=reflect(dir,mirror);
  }
 }
 return {segments,charged,won:charged.size===targets.size};
}
