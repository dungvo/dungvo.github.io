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

test('split prism room needs both gold receivers simultaneously', () => {
  const first = play(1, rotate('north', -1));
  assert.deepEqual(first.charged, ['crystal']);
  assert.equal(first.opened, false);
  const solved = step(first, rotate('south'));
  assert.deepEqual(solved.charged, ['crystal', 'crystal-east']);
  assert.equal(solved.opened, true);
  assert.equal(solved.pattern, false);
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
