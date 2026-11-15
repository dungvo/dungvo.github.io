import test from 'node:test';
import assert from 'node:assert/strict';
import {applyGardenAction, createGarden, GARDEN, mirrorById, wolfIntent} from '../core/garden-room.js';
import {frontHit, mirrorNormal, propagate, reflect, segmentTouches, DIRS} from '../core/tactical-optics.js';

const rotate = (id, delta = 1) => ({type:'rotate', id, delta});
const amber = {type:'source', id:'ember'};
const pick = id => ({type:'collect', id});
function step(state, action) {
  const next = applyGardenAction(state, action);
  assert.equal(next.error, undefined, `Unexpected error for ${JSON.stringify(action)}`);
  return next.state;
}
const run = (...actions) => actions.reduce(step, createGarden());

test('all 64 reflections satisfy the vector reflection equation', () => {
  for (let angle = 0; angle < 8; angle++) {
    const [nx, ny] = mirrorNormal(angle);
    for (let incoming = 0; incoming < 8; incoming++) {
      const [ix, iy] = DIRS[incoming];
      const [ox, oy] = DIRS[reflect(incoming, angle)];
      const incidence = 2 * (ix * nx + iy * ny);
      const inputLength = Math.hypot(ix, iy);
      const outputLength = Math.hypot(ox, oy);
      assert.ok(Math.hypot((ix - incidence * nx) / inputLength - ox / outputLength,
        (iy - incidence * ny) / inputLength - oy / outputLength) < 1e-8);
    }
  }
});

test('a flipped single-sided mirror absorbs on the side that used to reflect', () => {
  const base = {width:4, height:4, sources:[{x:0,y:1,dir:0}], objects:[
    {id:'m',type:'mirror',x:1,y:1,axis:2,sided:'single'},
    {id:'r',type:'receiver',x:1,y:3}
  ]};
  assert.equal(propagate(base).hits[0].id, 'r');
  const rear = structuredClone(base);
  rear.objects[0].flipped = true;
  assert.equal(propagate(rear).hits.length, 0);
  assert.equal(propagate(rear).contacts[0].kind, 'absorbed');
  assert.equal(frontHit(0, mirrorNormal(2, true)), false);
});

test('crossing a cell does not hit an off-center mirror; parallel incidence travels straight', () => {
  const objects = [{id:'m',type:'mirror',x:2,y:1.8,axis:4,halfLength:.4},{id:'r',type:'receiver',x:4,y:1}];
  const level = {width:5,height:4,sources:[{x:0,y:1,dir:0}],objects};
  assert.equal(propagate(level).hits[0].id, 'r');
  objects[0] = {...objects[0], y:1, axis:0};
  assert.equal(propagate(level).hits[0].id, 'r');
});

test('off-center rays intersect the mirror segment and reflect at that exact position', () => {
  const level = {width:5,height:4,sources:[{x:0,y:1,dir:0}],objects:[
    {id:'m',type:'mirror',x:2,y:1.2,axis:2},
    {id:'r',type:'receiver',x:1.8,y:3}
  ]};
  const result = propagate(level);
  assert.equal(result.hits[0].id, 'r');
  assert.ok(Math.abs(result.beams[0].to[0] - 1.8) < 1e-8);
  assert.deepEqual(result.beams[1].from, result.beams[0].to);
});

test('nearest blocker occludes a receiver even if it appears first in level data', () => {
  const result = propagate({width:6,height:2,sources:[{x:0,y:1,dir:0}],objects:[
    {id:'goal',type:'receiver',x:5,y:1},{id:'wall',type:'wall',x:2,y:1,radius:.3}
  ]});
  assert.equal(result.hits.length, 0);
  assert.deepEqual(result.beams[0].to, [1.7,1]);
});

test('coincident independent sources each reach the receiver', () => {
  const result = propagate({width:6,height:2,sources:[
    {id:'one',x:0,y:1,dir:0,power:2},{id:'two',x:0,y:1,dir:0,power:2},{id:'off',x:0,y:1,dir:0,enabled:false}
  ],objects:[{id:'goal',type:'receiver',x:5,y:1}]});
  assert.deepEqual(result.hits.map(hit => hit.source), ['one','two']);
});

test('transport loss and amplifier reserve respect distance, gain and the power cap', () => {
  const result = propagate({width:5,height:4,transmissionPerCell:.9,sources:[{x:0,y:1,dir:0,power:2}],objects:[
    {type:'amplifier',x:2,y:1,gain:2,cap:2,supply:.3},
    {type:'receiver',id:'goal',x:4,y:1}
  ]});
  assert.ok(Math.abs(result.beams[1].power - 1.92) < 1e-8);
  assert.ok(Math.abs(result.hits[0].power - 1.5552) < 1e-8);
});

test('passive optics reject amplification and the beam fades before distant devices', () => {
  const level = {width:8,height:3,transmissionPerCell:.1,sources:[{x:0,y:1,dir:0}],objects:[
    {type:'filter',x:4,y:1,color:'gold',efficiency:1.2}
  ]};
  assert.throws(() => propagate(level), /efficiency/);
  level.objects = [{type:'receiver',x:4,y:1}];
  const result = propagate(level, {threshold:.01});
  assert.equal(result.hits.length, 0);
  assert.ok(Math.abs(result.beams[0].to[0] - 2) < 1e-8);
});

test('exact cycles stop and ray interaction budget is enforced', () => {
  const level = {width:5,height:5,sources:[{x:2,y:1,dir:0}],objects:[
    {type:'mirror',axis:2,x:3,y:1},{type:'mirror',axis:6,x:3,y:3},
    {type:'mirror',axis:2,x:1,y:3},{type:'mirror',axis:6,x:1,y:1}
  ]};
  assert.equal(propagate(level).limitReached, false);
  assert.equal(propagate(level).steps, 5);
  assert.equal(propagate(level, {maxSteps:2}).limitReached, true);
});

test('the game opens by two mirrors, rewards the real pattern and preserves state on reads', () => {
  const start = createGarden();
  const before = structuredClone(start);
  const north = step(start, rotate('north'));
  const won = step(north, rotate('south'));
  assert.deepEqual(start, before);
  assert.equal(won.energy, GARDEN.energy - 2);
  assert.equal(won.turn, 2);
  assert.equal(won.route, 'mirrors');
  assert.equal(won.opened, true);
  assert.equal(won.pattern, true);
  assert.ok(won.optics.beams.some(beam => segmentTouches(beam, 2, 3)));
});

test('the splitter route opens the same gate without granting the shape reward', () => {
  const s = run(rotate('north', -1));
  assert.equal(s.route, 'prism');
  assert.equal(s.opened, true);
  assert.equal(s.pattern, false);
});

test('red source breaks rock and reveals a finite repair item; wolf can be defeated', () => {
  const first = run(amber);
  assert.equal(first.loot, 'loose');
  assert.equal(first.wolf.hp, 2);
  assert.equal(wolfIntent(first).type, 'break');
  const second = step(first, pick('shard'));
  assert.equal(second.wolf.hp, 1);
  assert.equal(second.repairStock, 1);
  assert.equal(mirrorById(second, 'guard').broken, true);
  const third = step(second, {type:'repair',id:'guard'});
  assert.equal(third.wolf.hp, 0);
  assert.equal(third.repairStock, 0);
  assert.equal(mirrorById(third, 'guard').broken, false);
  assert.equal(applyGardenAction(third, pick('shard')).state, third);
});

test('Soi Sáng reveals bounded loot and costs energy only once', () => {
  const first = run({type:'scan'});
  assert.equal(first.secret, true);
  assert.equal(first.energy, 18);
  assert.equal(applyGardenAction(first, {type:'scan'}).state, first);
  assert.equal(step(first, pick('secret')).collectedSecret, true);
});

test('a failed repair preserves the entire turn; waiting recovers energy', () => {
  const s = run(rotate('north'), rotate('south'));
  assert.equal(mirrorById(s, 'guard').broken, true);
  assert.equal(applyGardenAction(s, {type:'repair',id:'guard'}).state, s);
  assert.equal(step(s, {type:'wait'}).energy, GARDEN.energy);
  assert.equal(step(createGarden(), {type:'wait'}).energy, GARDEN.energy);
});
