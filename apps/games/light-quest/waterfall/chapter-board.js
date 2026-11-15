import { makeGrid, solve, controls, receivers, colorNames } from '../world/optics.js';

import { chapterMove, linkGroups } from './chapter-moves.js';

const colors = ['#ffe6a8', '#ff7a85', '#68e8ff', '#ffe277'];
const art = new URL('../world/pieces.svg', import.meta.url);
const ns = 'http://www.w3.org/2000/svg';
const icons = { S: 'crystal', T: 'crystal', R: 'crystal', B: 'crystal', Y: 'crystal', '/': 'mirror', '\\': 'mirror',
  F: 'prism', K: 'switch', M: 'shadow', '#': 'wall', '=': 'bridge', P: 'splitter', A: 'seed', G: 'root-gate' };
const labels = { '/': 'Xoay gương', '\\': 'Xoay gương', F: 'Đổi màu lăng kính',
  K: 'Công tắc cầu', M: 'Dời bóng tối', P: 'Xoay lăng kính đôi' };

function svg(tag, attrs) {
  const node = document.createElementNS(ns, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
}

export function chapterGrid(stage, moves) {
  let grid = makeGrid(stage);
  for (const move of moves) {
    if (!Array.isArray(move)) break;
    const next = chapterMove(stage, grid, ...move);
    if (!next) break;
    grid = next;
  }
  return grid;
}

export function chapterHint(stage, grid) {
  const step = solve(grid, (board, x, y) => chapterMove(stage, board, x, y))?.[0];
  if (!step) return null;
  const cell = grid[step.y][step.x];
  const label = labels[cell.type];
  const text = cell.type === 'F' ? label + ' sang ' + colorNames[(cell.state + 1) % 3 + 1] + '.' :
    label + ' ở ô đang viền sáng.';
  const linked = linkGroups(stage, step.x, step.y);
  return { ...step, text: linked.length ? text + ' Các vật cùng nhóm cũng xoay.' : text };
}

export function paintChapter(board, beam, stage, grid, view, step, move) {
  const width = grid[0].length;
  const height = grid.length;
  const previous = document.activeElement?.dataset.cell;
  board.style.setProperty('--cols', width);
  board.style.setProperty('--rows', height);
  board.replaceChildren();
  grid.forEach((row, y) => row.forEach(({ type, state }, x) => {
    const active = controls.includes(type);
    const cell = document.createElement(active ? 'button' : 'span');
    cell.className = 'chapter-cell';
    const pos = y * 100 + x;
    cell.toggleAttribute('data-reached', view.charged.has(pos) || type === 'S' ||
      '=GA'.includes(type) && (type === '=' ? view.bridge : view.relay));
    cell.toggleAttribute('data-hint', step?.x === x && step.y === y);
    if (active) {
      cell.dataset.cell = x + ',' + y;
      const detail = type === 'F' ? ' · ' + colorNames[state + 1] : type === 'K' ? (state ? ' · bật' : ' · tắt') : '';
      cell.setAttribute('aria-label', labels[type] + detail + ' · hàng ' + (y + 1) + ' ô ' + (x + 1));
      cell.onclick = () => move(x, y);
      const groups = linkGroups(stage, x, y);
      if (groups.length) {
        const tag = document.createElement('span');
        tag.className = 'gear-tag';
        tag.textContent = groups.map(group => 'ABC'[stage.links.indexOf(group)]).join('·');
        cell.append(tag);
        cell.setAttribute('aria-label', cell.getAttribute('aria-label') + ' · bánh răng ' + tag.textContent);
        if (step && groups.some(group => group.some(([column, row]) => step.x === column && step.y === row))) {
          cell.setAttribute('data-gear-hint', '');
        }
      }
    }
    if (icons[type]) {
      const token = svg('svg', { viewBox: '0 0 80 80', 'aria-hidden': 'true' });
      const index = receivers.indexOf(type);
      token.style.color = colors[type === 'F' ? state + 1 : Math.max(0, index)];
      if ('/\\P'.includes(type)) token.style.rotate = state ? '-40deg' : '40deg';
      token.append(svg('use', { href: art.href + '#' + icons[type] }));
      cell.append(token);
    }
    board.append(cell);
  }));
  if (previous) board.querySelector('[data-cell="' + previous + '"]')?.focus({ preventScroll: true });

  beam.setAttribute('viewBox', '0 0 ' + width * 100 + ' ' + height * 100);
  beam.replaceChildren();
  for (const segment of view.segments) {
    const points = { x1: (segment.x + .5) * 100, y1: (segment.y + .5) * 100,
      x2: (segment.nx + .5) * 100, y2: (segment.ny + .5) * 100 };
    for (const [weight, opacity, color] of [[10, .24, colors[segment.color]], [4, .8, colors[segment.color]], [1.4, 1, '#fff']]) {
      beam.append(svg('line', { ...points, 'stroke-width': weight, opacity, stroke: color }));
    }
  }
  board.append(beam);
}
