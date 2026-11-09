const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const reflection = [[3, 2, 1, 0], [1, 0, 3, 2]];

export const receivers = 'TRBY';
export const controls = '/\\FKMP';
export const colorNames = ['trắng', 'đỏ', 'lam', 'vàng'];
export const position = (x, y) => y * 100 + x;

export function makeGrid(stage) {
  let filter = 0;
  return stage.rows.map(row => Array.from(row, type => ({
    type,
    state: '/P'.includes(type) ? 1 : type === 'F' ? (stage.filters?.[filter++] ?? 0) : 0
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

function traceRays(grid, source, total, gateOpen) {
  const rays = [{ ...source, direction: 0, color: 0, crossing: false }];
  const lit = new Set([position(source.x, source.y)]);
  const charged = new Set();
  const seen = new Set();
  const segments = [];
  let relay = false;
  let bridge = false;
  for (const ray of rays) {
    let { x, y, direction, color, crossing } = ray;
    while (true) {
      const key = [position(x, y), direction, color, crossing].join(',');
      if (seen.has(key)) break;
      seen.add(key);
      const [dx, dy] = directions[direction];
      const nx = x + dx;
      const ny = y + dy;
      const cell = grid[ny]?.[nx];
      const blocked = !cell || '#M'.includes(cell.type) ||
        (cell.type === '=' && !crossing) || (cell.type === 'G' && !gateOpen);
      const length = blocked ? (cell ? .66 : .49) : 1;
      segments.push({ x, y, nx: x + dx * length, ny: y + dy * length, color });
      if (blocked) break;
      x = nx;
      y = ny;
      const spot = position(x, y);
      lit.add(spot);
      const { type, state } = cell;
      if ('/\\'.includes(type)) direction = reflection[state][direction];
      if (type === 'P') rays.push({ x, y, direction: reflection[state][direction], color, crossing });
      if (type === 'F') color = state + 1;
      if (type === 'K' && state) bridge = crossing = true;
      if (type === 'A' && color === 2) relay = true;
      if (receivers.includes(type) && (type === 'T' || receivers.indexOf(type) === color)) {
        charged.add(spot);
        if (charged.size === total) break;
      }
    }
  }
  return { segments, lit, charged, total, bridge, relay: relay || gateOpen,
    won: total > 0 && charged.size === total };
}

export function trace(grid) {
  const y = grid.findIndex(row => row.some(cell => cell.type === 'S'));
  const x = grid[y].findIndex(cell => cell.type === 'S');
  const total = grid.flat().filter(cell => receivers.includes(cell.type)).length;
  const first = traceRays(grid, { x, y }, total, false);
  // A blue relay opens root gates for every ray, regardless of tracing order.
  return first.relay ? traceRays(grid, { x, y }, total, true) : first;
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
