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
console.log('Verified all 18 World and 4 Secret Garden stages, including hints and multi-crystal gating.');
