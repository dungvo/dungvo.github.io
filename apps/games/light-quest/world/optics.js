const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const reflection = [[3, 2, 1, 0], [1, 0, 3, 2]];

export const receivers = 'TRBY';
export const controls = '/\\FKM';
export const colorNames = ['trắng', 'đỏ', 'lam', 'vàng'];
export const position = (x, y) => y * 100 + x;

export function makeGrid(stage) {
  let filter = 0;
  return stage.rows.map(row => Array.from(row, type => ({
    type,
    state: type === '/' ? 1 : type === 'F' ? (stage.filters?.[filter++] ?? 0) : 0
  })));
}

export function activate(grid, x, y) {
  const cell = grid[y]?.[x];
  if (!cell || !controls.includes(cell.type)) return null;
  const next = grid.map(row => row.slice());
  if (cell.type === 'M') {
    const alt = y === 2 ? 3 : 2;
    const destination = grid[alt]?.[x]?.type === '.' ? [x, alt] :
      grid[y][x + 1]?.type === '.' ? [x + 1, y] : null;
    if (!destination) return null;
    const [nx, ny] = destination;
    next[ny][nx] = cell;
    next[y][x] = { type: '.', state: 0 };
  } else {
    next[y][x] = { ...cell, state: (cell.state + 1) % (cell.type === 'F' ? 3 : 2) };
  }
  return next;
}

export function trace(grid) {
  let y = grid.findIndex(row => row.some(cell => cell.type === 'S'));
  let x = grid[y].findIndex(cell => cell.type === 'S');
  let direction = 0;
  let color = 0;
  let bridge = false;
  const segments = [];
  const lit = new Set([position(x, y)]);
  const charged = new Set();
  const seen = new Set();
  const total = grid.flat().filter(cell => receivers.includes(cell.type)).length;
  while (true) {
    const [dx, dy] = directions[direction];
    const nx = x + dx;
    const ny = y + dy;
    const cell = grid[ny]?.[nx];
    const blocked = !cell || '#M'.includes(cell.type) || (cell.type === '=' && !bridge);
    const length = blocked ? (cell ? .66 : .49) : 1;
    segments.push({ x, y, nx: x + dx * length, ny: y + dy * length, color });
    if (blocked) break;
    x = nx;
    y = ny;
    const spot = position(x, y);
    lit.add(spot);
    const key = [spot, direction, color, bridge].join(',');
    if (seen.has(key)) break;
    seen.add(key);
    if ('/\\'.includes(cell.type)) direction = reflection[cell.state][direction];
    if (cell.type === 'F') color = cell.state + 1;
    if (cell.type === 'K' && cell.state) bridge = true;
    if (receivers.includes(cell.type)) {
      if (cell.type === 'T' || receivers.indexOf(cell.type) === color) charged.add(spot);
      if (charged.size === total) break;
    }
  }
  return { segments, lit, charged, total, bridge, won: total > 0 && charged.size === total };
}

export function solve(initial) {
  const key = grid => grid.flat().map(cell => cell.type + cell.state).join('');
  const queue = [{ grid: initial, path: [] }];
  const seen = new Set([key(initial)]);
  for (let index = 0; index < queue.length; index++) {
    const { grid, path } = queue[index];
    if (trace(grid).won) return path;
    for (const [y, row] of grid.entries()) {
      for (const [x, cell] of row.entries()) {
        if (!controls.includes(cell.type)) continue;
        const next = activate(grid, x, y);
        if (!next) continue;
        const state = key(next);
        if (seen.has(state)) continue;
        seen.add(state);
        queue.push({ grid: next, path: [...path, { x, y }] });
      }
    }
  }
  return null;
}
