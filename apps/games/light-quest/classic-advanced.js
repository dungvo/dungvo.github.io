const stages = [
  [6, 10, 'Chéo', [[2,2,'D'],[4,3,'D']]],
  [6, 11, 'Chéo', [[1,1,'D'],[4,1,'D'],[1,4,'D'],[4,4,'D']]],
  [6, 12, 'Hàng ngang', [[1,1,'H'],[4,3,'H']]],
  [6, 13, 'Cột dọc', [[2,2,'V'],[4,4,'V'],[1,4,'D']]],
  [6, 14, 'Giao tuyến', [[1,2,'H'],[4,2,'V'],[3,4,'D']]],
  [7, 13, 'Liên kết', [[1,1,'A'],[5,5,'A']]],
  [7, 14, 'Hai cặp', [[1,1,'A'],[4,4,'A'],[5,1,'B'],[1,5,'B']]],
  [7, 15, 'Đường chéo', [[2,2,'D'],[4,2,'D'],[2,4,'A'],[4,4,'A']]],
  [7, 16, 'Hàng và cột', [[1,2,'H'],[3,4,'H'],[4,2,'V'],[5,4,'D']]],
  [7, 17, 'Ngã tư', [[1,1,'H'],[5,5,'V'],[1,5,'A'],[5,1,'A'],[3,3,'D']]],
  [8, 16, 'Mạng sao', [[1,1,'A'],[6,6,'A'],[6,1,'B'],[1,6,'B'],[3,3,'D']]],
  [8, 17, 'Phản chiếu', [[1,2,'D'],[6,2,'D'],[2,5,'H'],[5,5,'V'],[1,6,'A'],[6,1,'A']]],
  [8, 18, 'Giao điểm', [[1,1,'H'],[6,2,'V'],[3,3,'A'],[4,4,'A'],[2,6,'B'],[5,1,'B']]],
  [8, 19, 'Bầu trời đôi', [[1,1,'A'],[6,6,'A'],[6,1,'B'],[1,6,'B'],[3,2,'H'],[4,5,'V'],[2,4,'D'],[5,3,'D']]],
  [8, 21, 'Vương miện ánh sáng', [[1,1,'H'],[6,6,'V'],[2,2,'D'],[5,5,'D'],[1,6,'A'],[6,1,'A'],[3,4,'B'],[4,3,'B']]],
  [7, 14, 'Bước mã đầu tiên', [[2,2,'K'],[4,4,'K']]],
  [7, 15, 'Vùng sáng', [[3,3,'Q'],[1,5,'Q']]],
  [7, 16, 'Mã và vùng', [[1,2,'K'],[5,4,'Q'],[3,3,'D']]],
  [8, 17, 'Bốn góc trời', [[1,1,'K'],[6,6,'K'],[1,6,'Q'],[6,1,'Q']]],
  [8, 18, 'Nhịp điệu của mã', [[2,2,'K'],[5,2,'K'],[2,5,'K'],[5,5,'K'],[3,3,'H']]],
  [8, 19, 'Vệt sáng lan rộng', [[2,2,'Q'],[5,5,'Q'],[2,5,'V'],[5,2,'H']]],
  [8, 19, 'Giao thoa', [[1,1,'A'],[6,6,'A'],[2,5,'K'],[5,2,'Q'],[3,3,'D']]],
  [8, 20, 'Mật mã ngân hà', [[1,2,'K'],[6,5,'K'],[3,3,'Q'],[4,4,'Q'],[2,6,'H'],[5,1,'V']]],
  [8, 21, 'Hai vùng liên kết', [[1,1,'B'],[6,6,'B'],[2,2,'Q'],[5,5,'Q'],[1,6,'K'],[6,1,'K']]],
  [8, 22, 'Trái tim thiên hà', [[1,1,'A'],[6,6,'A'],[6,1,'B'],[1,6,'B'],[3,3,'Q'],[4,4,'K'],[2,5,'H'],[5,2,'V']]]
];

export const maximum = 30 + stages.length;
export const symbols = { D: '×', H: '↔', V: '↕', A: 'A', B: 'B', K: '♞', Q: '▦' };
export const names = { D: 'Ô chéo', H: 'Ô hàng ngang', V: 'Ô cột dọc', A: 'Ô liên kết A', B: 'Ô liên kết B', K: 'Ô bước mã', Q: 'Ô vùng 3×3' };
export const guide = {
  D: '× Đổi ô này và bốn ô chéo.',
  H: '↔ Đổi cả hàng.',
  V: '↕ Đổi cả cột.',
  A: 'A Đổi dạng dấu cộng quanh ô vừa chạm và ô A còn lại.',
  B: 'B Đổi dạng dấu cộng quanh ô vừa chạm và ô B còn lại.',
  K: '♞ Đổi ô này và các ô cách hai bước theo một chiều, một bước theo chiều kia (như quân mã).',
  Q: '▦ Đổi toàn bộ vùng 3×3 quanh ô này.'
};

export function advancedLevel(id, rand, solve) {
  const [size, target, title, marks] = stages[id - 31];
  const types = new Map(marks.map(([x, y, type]) => [y * size + x, type]));
  const sizeSquared = size * size;
  function cross(index, diagonal = false) {
    const x = index % size;
    const y = Math.floor(index / size);
    const offsets = diagonal ? [[0,0],[-1,-1],[1,-1],[-1,1],[1,1]] : [[0,0],[-1,0],[1,0],[0,-1],[0,1]];
    return offsets.flatMap(([dx, dy]) => {
      const col = x + dx;
      const row = y + dy;
      return col >= 0 && col < size && row >= 0 && row < size ? [row * size + col] : [];
    });
  }
  const effects = Array.from({ length: sizeSquared }, (_, index) => {
    const type = types.get(index);
    if (type === 'D') return cross(index, true);
    if (type === 'K') {
      const x = index % size, y = Math.floor(index / size);
      const offsets = [[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]];
      return [index, ...offsets.flatMap(([dx,dy]) => x+dx>=0 && x+dx<size && y+dy>=0 && y+dy<size ? [(y+dy)*size+x+dx] : [])];
    }
    if (type === 'Q') {
      const x = index % size, y = Math.floor(index / size), result = [];
      for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++) if (x+dx>=0 && x+dx<size && y+dy>=0 && y+dy<size) result.push((y+dy)*size+x+dx);
      return result;
    }
    if (type === 'H') return Array.from({ length: size }, (_, x) => index - index % size + x);
    if (type === 'V') return Array.from({ length: size }, (_, y) => index % size + y * size);
    if (type === 'A' || type === 'B') {
      const pair = [...types].find(([other, mark]) => other !== index && mark === type)[0];
      return [...new Set([...cross(index), ...cross(pair)])];
    }
    return cross(index);
  });
  const random = rand(9703 + id * 3821);
  let best = null;
  for (let attempt = 0; attempt < 18; attempt++) {
    const indices = Array.from({ length: sizeSquared }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const board = new Array(sizeSquared).fill(1);
    const moves = [...new Set([...types.keys(), ...indices])].slice(0, target);
    for (const move of moves) for (const cell of effects[move]) board[cell] ^= 1;
    const solution = solve(board, size, effects);
    if (solution?.count && (!best || solution.count > best.solution.count)) best = { board, solution };
    if (best?.solution.count === target) break;
  }
  return { size, title, types, effects, ...best };
}
