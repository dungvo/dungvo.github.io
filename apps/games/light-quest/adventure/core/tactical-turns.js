// Pure state transitions; enemy acts only after player commits a turn.
import {propagate} from './tactical-optics.js';
export function createTurnState(level){return {level:structuredClone(level),turn:0,energy:level.energy??12,history:[],enemies:structuredClone(level.enemies||[])}}
export function takeAction(state,action){
 const cost={rotate:1,scan:2,repair:3,place:3,amplify:4}[action.type];
 if(cost===undefined)throw new Error('Unknown action');
 if(state.energy<cost)return {state,error:'NOT_ENOUGH_ENERGY'};
 const next=structuredClone(state);next.history=[];next.energy-=cost;next.turn++;
 const o=next.level.objects?.find(o=>o.id===action.id);
 if(action.type==='rotate'){if(!o||o.type!=='mirror')return {state,error:'INVALID_MIRROR'};o.axis=(o.axis+1)%8;o.normal=(o.normal+1)%8}
 if(action.type==='repair'){if(!o||o.type!=='mirror'||!o.broken)return {state,error:'INVALID_REPAIR'};o.broken=false}
 if(action.type==='scan')next.scanned=true;
 const optics=propagate(next.level);
 // Deterministic patrol: enemies advance one point per player action.
 for(const e of next.enemies){if(e.patrol?.length){e.index=((e.index??0)+1)%e.patrol.length;[e.x,e.y]=e.patrol[e.index]}}
 return {state:next,optics};
}
