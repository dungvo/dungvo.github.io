import { activate } from '../world/optics.js';

export function linkGroups(stage, x, y) {
  return (stage.links ?? []).filter(group => group.some(([column, row]) => column === x && row === y));
}

export function chapterMove(stage, grid, x, y) {
  let next = activate(grid, x, y);
  if (!next) return null;
  const turned = new Set([x + ',' + y]);
  for (const group of linkGroups(stage, x, y)) {
    for (const [column, row] of group) {
      const key = column + ',' + row;
      if (turned.has(key)) continue;
      turned.add(key);
      next = activate(next, column, row);
    }
  }
  return next;
}
