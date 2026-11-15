import test from 'node:test';
import assert from 'node:assert/strict';
import {reflect,frontHit,propagate} from '../core/tactical-optics.js';
import {createTurnState,takeAction} from '../core/tactical-turns.js';
test('45 degree mirror reflects east to north then north to east',()=>{
 assert.equal(reflect(0,6),6);
 assert.equal(reflect(6,6),0);
});
test('single-sided mirror rejects rear incident light',()=>{
 assert.equal(frontHit(0,4),true);
 assert.equal(frontHit(0,0),false);
});
test('ray follows two mirrors to target',()=>{
 const result=propagate({width:5,height:5,sources:[{x:0,y:2,dir:0}],objects:[
 {x:2,y:2,type:'mirror',axis:6,sided:'double'},
 {x:2,y:0,type:'mirror',axis:6,sided:'double'},
 {x:4,y:0,type:'receiver'}]});
 assert.equal(result.hits.length,1);assert.deepEqual([result.hits[0].x,result.hits[0].y],[4,0]);
});
test('single-sided mirror blocks from back',()=>{
 const r=propagate({width:4,height:3,sources:[{x:0,y:1,dir:0}],objects:[{x:1,y:1,type:'mirror',axis:6,normal:0,sided:'single'},{x:1,y:0,type:'receiver'}]});
 assert.equal(r.hits.length,0);
});
test('splitter conserves power',()=>{
 const r=propagate({width:5,height:5,sources:[{x:0,y:2,dir:0,power:10}],objects:[{x:2,y:2,type:'splitter',ratio:.3,turn:2},{x:4,y:2,type:'receiver'},{x:2,y:4,type:'receiver'}]});
 assert.equal(r.hits.length,2);assert.equal(r.hits.reduce((n,h)=>n+h.power,0),10);
});
test('filter allows only matching color',()=>{
 const level={width:4,height:2,sources:[{x:0,y:1,dir:0,color:'blue'}],objects:[{x:1,y:1,type:'filter',color:'red'},{x:3,y:1,type:'receiver'}]};
 assert.equal(propagate(level).hits.length,0);
 level.sources[0].color='red';assert.equal(propagate(level).hits.length,1);
});
test('red beam breaks rock only above threshold',()=>{
 const level={width:4,height:2,sources:[{x:0,y:1,dir:0,color:'red',power:2}],objects:[{x:2,y:1,type:'rock',hardness:3}]};
 assert.equal(propagate(level).hits[0].broken,false);level.sources[0].power=3;assert.equal(propagate(level).hits[0].broken,true);
});
test('energy deducted once and enemy patrol advances once',()=>{
 const state=createTurnState({width:3,height:3,energy:5,sources:[],objects:[{id:'m',x:1,y:1,type:'mirror',axis:0,normal:0}],enemies:[{x:0,y:0,patrol:[[0,0],[1,0]]}]});
 const {state:next}=takeAction(state,{type:'rotate',id:'m'});
 assert.equal(next.energy,4);assert.equal(next.turn,1);assert.equal(next.enemies[0].x,1);assert.equal(state.turn,0);
});
test('invalid action does not consume energy',()=>{
 const state=createTurnState({width:2,height:2,energy:4,sources:[],objects:[]});
 const r=takeAction(state,{type:'rotate',id:'missing'});assert.equal(r.state.energy,4);
});
