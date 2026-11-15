// Light Quest M0: deterministic 2D grid ray tracing. No rendering dependencies.
// Directions clockwise from East; mirrors are line segments with a front normal.
export const DIRS=Object.freeze([[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]]);
const key=(x,y)=>x+','+y;
const norm=n=>((n%8)+8)%8;
export function reflect(direction,axis){return norm(axis-direction)}
// A single-sided mirror reflects only when the incoming ray points against its front normal.
// Normal is a direction index (0=E,2=S,4=W,6=N). Dot product strictly negative means front hit.
export function frontHit(direction,normal){
 const d=DIRS[norm(direction)],n=DIRS[norm(normal)];
 return d[0]*n[0]+d[1]*n[1]<0;
}
export function propagate(level,opts={}){
 const maxSteps=opts.maxSteps??4096,threshold=opts.threshold??0.001;
 const cells=new Map((level.objects||[]).map(o=>[key(o.x,o.y),o]));
 const beams=[],hits=[],seen=new Set(),queue=(level.sources||[]).map((s,i)=>({...s,dir:norm(s.dir),power:s.power??1,color:s.color??'gold',origin:i}));
 let steps=0;
 while(queue.length){
  let ray=queue.shift();
  while(ray.power>=threshold&&steps++<maxSteps){
   const [dx,dy]=DIRS[ray.dir],nx=ray.x+dx,ny=ray.y+dy;
   if(nx<0||ny<0||nx>=level.width||ny>=level.height)break;
   const state=[nx,ny,ray.dir,ray.color,Math.round(ray.power*1000)].join(':');
   if(seen.has(state))break;seen.add(state);
   beams.push({from:[ray.x,ray.y],to:[nx,ny],color:ray.color,power:ray.power});
   ray={...ray,x:nx,y:ny};
   const object=cells.get(key(nx,ny));
   if(!object)continue;
   if(object.type==='wall')break;
   if(object.type==='receiver'){hits.push({x:nx,y:ny,color:ray.color,power:ray.power});if(object.absorb!==false)break;continue}
   if(object.type==='filter'){if(object.color!==ray.color)break;continue}
   if(object.type==='mirror'){
    if(object.broken)break;
    if(object.sided==='single'&&!frontHit(ray.dir,object.normal))break;
    ray.dir=reflect(ray.dir,object.axis);ray.power*=object.efficiency??1;continue;
   }
   if(object.type==='splitter'){
    const ratio=object.ratio??0.5;
    if(ratio<0||ratio>1)throw new Error('split ratio must be 0..1');
    const original=ray.power;
    queue.push({...ray,dir:norm(ray.dir+(object.turn??2)),power:original*ratio});
    ray.power=original*(1-ratio);continue;
   }
   if(object.type==='rock'){
    hits.push({x:nx,y:ny,color:ray.color,power:ray.power,kind:'rock',broken:ray.color==='red'&&ray.power>=(object.hardness??1)});
    break;
   }
  }
 }
 return {beams,hits,steps,limitReached:steps>=maxSteps};
}
