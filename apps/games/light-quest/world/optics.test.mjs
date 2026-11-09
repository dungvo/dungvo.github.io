import assert from 'node:assert/strict';
import { garden, world } from './levels.js';
import { activate, makeGrid, solve, trace } from './optics.js';

for (const [campaign, stages] of Object.entries({ world, garden })) {
  for (const [index, stage] of stages.entries()) {
    let grid = makeGrid(stage);
    const path = solve(grid);
    assert.ok(path?.length, campaign + ' ' + (index + 1) + ' must be playable and initially unsolved');
    const start = grid;
    for (const [i, step] of path.entries()) {
      const hint = solve(grid);
      assert.equal(hint.length, path.length - i);
      const { x, y } = step;
      grid = activate(grid, x, y);
      assert.equal(trace(grid).won, i === path.length - 1);
    }
    assert.deepEqual(start, makeGrid(stage), 'Search and moves must leave undo snapshots intact');
  }
}

let finale = makeGrid(garden[3]);
finale = activate(finale, 1, 3); // switch
assert.equal(trace(finale).bridge, true);
finale = activate(finale, 3, 3); // lower mirror
assert.equal(trace(finale).charged.size, 0);
finale = activate(activate(finale, 3, 2), 3, 2); // lower prism to red
assert.equal(trace(finale).charged.size, 1);
assert.equal(trace(finale).won, false);
assert.equal(solve(finale).length, 2);
const splitter = makeGrid(garden[4]);
assert.equal(trace(splitter).charged.size, 1, 'The straight branch is preserved');
assert.equal(trace(activate(splitter, 2, 2)).charged.size, 2, 'Rotating the splitter charges both branches');

let dawn = makeGrid(garden[8]);
dawn = activate(dawn, 2, 3); // split toward the relay
assert.equal(trace(dawn).relay, false, 'A red beam cannot activate the seed relay');
dawn = activate(dawn, 2, 2); // red to blue
const fed = trace(dawn);
assert.equal(fed.relay, true);
assert.ok(fed.segments.some(ray => ray.y === 3 && ray.x === 3 && ray.nx === 4),
  'The later split branch must open the gate for the first branch');
assert.equal(fed.charged.size, 1);
assert.equal(fed.won, false);
dawn = activate(dawn, 2, 2); // blue to yellow
assert.equal(trace(dawn).relay, false, 'Losing the blue beam closes the gates again');
console.log('Verified 18 World and 9 Secret Garden stages, shortest hints, split rays and cross-branch relay.');
