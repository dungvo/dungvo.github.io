import test from 'node:test';
import assert from 'node:assert/strict';
import {AWAKENING} from '../core/awakening-levels.js';
import {applyGardenAction, createGarden, mirrorById} from '../core/garden-room.js';

const rotate = (id, delta = 1) => ({type:'rotate', id, delta});
const ember = {type:'source', id:'ember'};
const shard = {type:'collect', id:'shard'};
const repair = {type:'repair', id:'guard'};

function step(state, action) {
  const result = applyGardenAction(state, action);
  assert.equal(result.error, undefined);
  return result.state;
}

function play(index, ...actions) {
  return actions.reduce(step, createGarden(AWAKENING[index]));
}

test('every chapter room starts on a valid 7 by 6 board with an unsolved gate', () => {
  const ids = new Set();
  for (const room of AWAKENING) {
    assert.ok(!ids.has(room.id));
    ids.add(room.id);
    const coordinates = new Set();
    const devices = [...room.sources, ...room.objects];
    assert.equal(new Set(devices.map(device => device.id)).size, devices.length);
    for (const {x, y} of devices) {
      assert.ok(x >= 0 && x < room.width && y >= 0 && y < room.height);
      const coordinate = x + ',' + y;
      assert.ok(!coordinates.has(coordinate), room.id + ' overlaps at ' + coordinate);
      coordinates.add(coordinate);
    }
    const initial = createGarden(room);
    const waited = step(initial, {type:'wait'});
    assert.equal(waited.opened, false);
    assert.equal(waited.optics.limitReached, false);
  }
});

const move = ([x,y]) => ({type:'walk',x,y});

test('prism room is solved with a counterweight and pressure plates without rotating a mirror', () => {
  const initial = createGarden(AWAKENING[1]);
  assert.equal(applyGardenAction(initial, rotate('south')).error, 'invalid');
  const first = [[2,3],[3,3]].map(move).reduce(step, initial);
  assert.deepEqual(first.charged, ['crystal']);
  assert.equal(first.opened, false);
  assert.deepEqual(first.traversal.crates[0], {id:'counterweight',x:4,y:3});
  const solved = [[2,3],[2,4],[2,5]].map(move).reduce(step, first);
  assert.deepEqual(solved.charged, ['crystal', 'crystal-east']);
  assert.equal(solved.opened, true);
  assert.equal(solved.route, 'counterweight');
  assert.equal(solved.turn, 5);
  assert.equal(solved.energy, 11);
  assert.deepEqual(initial.traversal.crates[0], {id:'counterweight',x:2,y:3});
});

test('the relay offers a route that avoids the crate and stays active off the switch tile', () => {
  const path = [[1,2],[1,1],[1,0],[1,1],[1,2],[1,3],[1,4],[2,4],[2,5]];
  const solved = play(1, ...path.map(move));
  assert.equal(solved.opened, true);
  assert.equal(solved.route, 'relay');
  assert.deepEqual(solved.traversal.crates[0], {id:'counterweight',x:2,y:3});
  assert.deepEqual(solved.traversal.relays, ['latch']);
});

test('blocked or distant walking and impossible pushes leave energy, turn and optics intact', () => {
  const initial = createGarden(AWAKENING[1]);
  const pressed = play(1, move([2,3]), move([3,3]));
  const away = step(pressed, move([2,3]));
  for (const [state,position] of [[initial,[2,2]], [initial,[4,3]], [pressed,[4,3]], [away,[2,2]]]) {
    const result = applyGardenAction(state, move(position));
    assert.equal(result.error, 'invalid');
    assert.equal(result.state, state);
  }
});

test('two-spectrum room needs its red lens and the correct filter', () => {
  const first = play(2, rotate('north'), ember);
  assert.deepEqual(first.charged, ['crystal']);
  assert.equal(first.opened, false);
  const solved = step(first, rotate('guard'));
  assert.deepEqual(solved.charged, ['crystal', 'crystal-east']);
  assert.equal(solved.opened, true);
  const unpowered = structuredClone(first);
  unpowered.level.objects = unpowered.level.objects.filter(o => o.id !== 'ember-lens');
  assert.equal(step(unpowered, rotate('guard')).opened, false);
});

test('the diagonal room traces the three mirror route and earns the geometric pattern reward', () => {
  const solved = play(3, rotate('north'), rotate('middle', -1), rotate('guard'));
  assert.equal(solved.opened, true);
  assert.equal(solved.pattern, true);
  assert.deepEqual(solved.optics.contacts.map(hit => hit.id), ['north', 'middle', 'guard']);
});

test('the warden room reveals a shard at the broken rock and requires repair on the intended route', () => {
  const interrupted = play(4, ember, shard, rotate('north'));
  assert.deepEqual(interrupted.lootPosition, {x:2, y:4});
  assert.equal(interrupted.wolf.hp, 0);
  assert.equal(mirrorById(interrupted, 'guard').broken, true);
  assert.equal(interrupted.opened, false);
  const solved = step(interrupted, repair);
  assert.equal(solved.opened, true);
  assert.equal(solved.repairStock, 0);
});

test('ringing the bell before the wolf moves opens a no-combat route to the warden gate', () => {
  const rung = play(4, move([5,1]));
  assert.equal(rung.wolf.step, 0);
  assert.equal(rung.traversal.bellTurns, 2);
  const solved = [ember, rotate('north')].reduce(step, rung);
  assert.equal(solved.opened, true);
  assert.equal(solved.route, 'bell');
  assert.equal(solved.wolf.hp, 2);
  assert.equal(mirrorById(solved, 'guard').broken, undefined);
  assert.equal(solved.traversal.bellTurns, 0);
  const off = step(solved, move([4,1]));
  const back = step(off, move([5,1]));
  assert.equal(back.traversal.bellTurns, 0);
  assert.equal(mirrorById(back, 'guard').broken, true);
});
