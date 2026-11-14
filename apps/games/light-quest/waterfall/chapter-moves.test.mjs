import assert from 'node:assert/strict';
import { makeGrid, solve, trace } from '../world/optics.js';
import { chapters } from './chapters.js';
import { chapterMove } from './chapter-moves.js';

for (const [id, chapter] of Object.entries(chapters)) {
  const grid = makeGrid(chapter);
  const solution = solve(grid, (board, x, y) => chapterMove(chapter, board, x, y));
  assert.ok(solution?.length, id + ' has a nonempty solution');
  const solved = solution.reduce((board, { x, y }) => chapterMove(chapter, board, x, y), grid);
  assert.ok(trace(solved).won, id + ' finishes when following its hints');
}
const stage = chapters.T07;
const initial = makeGrid(stage);
const afterEdge = chapterMove(stage, initial, 2, 2);
assert.deepEqual([2, 4, 6].map(x => afterEdge[2][x].state), [0, 0, 1]);
const afterMiddle = chapterMove(stage, initial, 4, 2);
assert.deepEqual([2, 4, 6].map(x => afterMiddle[2][x].state), [0, 0, 0]);
assert.deepEqual([2, 4, 6].map(x => initial[2][x].state), [1, 1, 1]);
