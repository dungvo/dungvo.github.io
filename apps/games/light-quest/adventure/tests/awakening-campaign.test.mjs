import test from 'node:test';
import assert from 'node:assert/strict';
import {AWAKENING} from '../core/awakening-levels.js';
import {bridgeWalkable, walkOptions} from '../core/room-traversal.js';
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

const rift = AWAKENING.length - 1;
const outbound = [[2,1],[3,1],[4,1],[5,1],[6,1],[6,0]];
const backToRelays = [[6,1],[6,2],[6,3]];
const acrossDiagonal = [[5,3],[4,3],[3,3],[2,3],[1,3],[0,3],[0,4],[0,5]];
const acrossLower = [[6,4],[6,5],[5,5],[4,5],[4,4],[3,4],[2,4],[2,5],[1,5],[0,5]];

test('the launch bridge crosses the chasm only before collecting the heavy relic', () => {
  const start = createGarden(AWAKENING[rift]);
  const [upper,diagonal,lower] = start.level.traversal.bridges;
  assert.deepEqual([upper,diagonal,lower].map(bridge => bridgeWalkable(start, bridge)), [true,false,false]);
  assert.equal(applyGardenAction(start, move([3,0])).error, 'invalid');
  const carrier = play(rift, ...outbound.map(move));
  assert.equal(carrier.traversal.carryingRelic, true);
  assert.equal(carrier.opened, false);
  assert.equal(bridgeWalkable(carrier, upper), false);
  const atGap = [[6,1],[5,1],[4,1]].map(move).reduce(step, carrier);
  assert.equal(walkOptions(atGap).some(point => point.x === 3 && point.y === 1), false);
  assert.equal(applyGardenAction(atGap, move([3,1])).state, atGap);
});

test('both alternate bridges require the right optical path and deliver the relic to the exit', () => {
  const diagonallyLit = play(rift, ...[...outbound,...backToRelays].map(move));
  const bridges = diagonallyLit.level.traversal.bridges;
  assert.deepEqual(bridges.map(bridge => bridgeWalkable(diagonallyLit, bridge)), [false,true,false]);
  const across = acrossDiagonal.slice(0,-1).map(move).reduce(step, diagonallyLit);
  assert.equal(across.opened, false, 'Crossing a bridge alone does not complete the mission');
  const diagonalExit = step(across, move([0,5]));
  assert.equal(diagonalExit.opened, true);
  assert.equal(diagonalExit.route, 'diagonal-bridge');
  assert.equal(diagonalExit.traversal.carryingRelic, false);
  assert.equal(diagonalExit.pattern, false);

  const direct = play(rift, ...[...outbound,...backToRelays,...acrossLower].map(move));
  assert.equal(direct.opened, true);
  assert.equal(direct.route, 'lower-bridge');
  assert.equal(direct.pattern, true);
  assert.deepEqual(bridges.map(bridge => bridgeWalkable(direct, bridge)), [false,false,true]);
  assert.ok(direct.turn > diagonalExit.turn && direct.energy > 0);
});

test('the exit and the bridge controls do not work without the relic', () => {
  const atExit = play(rift, ...[[2,1],[2,2],[1,2],[1,3],[0,3],[0,4],[0,5]].map(move));
  assert.equal(atExit.opened, false);
  const atRelay = play(rift, ...[[2,1],[3,1],[4,1],[5,1],[6,1],[6,2],[6,3]].map(move));
  assert.equal(atRelay.traversal.returnRelay, null);
  assert.equal(mirrorById(atRelay, 'north').axis, 0);
});
