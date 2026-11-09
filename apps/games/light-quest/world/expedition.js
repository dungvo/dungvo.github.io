import { garden, world } from './levels.js';
import { activate, colorNames, controls, makeGrid, position, receivers, solve, trace } from './optics.js';

const $ = id => document.getElementById(id);
const scene = $('scene');
const board = $('board');
const menu = $('menu');
const isGarden = document.body.dataset.campaign === 'garden';
const stages = isGarden ? garden : world;
const prefix = isGarden ? 'light-quest.secret-garden' : 'light-quest.world';
const legacyChoice = 'light-quest.secret-garden.choice.v1';
const colors = ['#ffdfa0', '#ff828d', '#8de5ff', '#ffd263'];
const svgNS = 'http://www.w3.org/2000/svg';
const pieces = new URL('./pieces.svg', import.meta.url);
const art = scene.querySelector('picture');
const doors = {
  stars: { title: 'Tinh Tú', item: 'Mảnh Sao', area: 'Đài quan sát', stages: [5, 6] },
  forest: { title: 'Rừng Sâu', item: 'Hạt Mầm', area: 'Suối Rễ', stages: [7, 8] }
};
const gateStage = 4;
const lastStage = garden.length;
const chapterNames = { stars: 'Đài quan sát', forest: 'Suối Rễ', dawn: 'Bình minh' };
const artworks = { stars: 'star-observatory', forest: 'root-grove' };

function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function parse(key) {
  try { return JSON.parse(read(key)); } catch { return null; }
}

function write(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Play remains available without storage. */ }
}

const progress = isGarden ? parse(prefix + '.progress.v9') ?? parse(prefix + '.progress.v8') : parse(prefix + '.v1');
const oldAttempt = parse(prefix + '.attempt.v8');
const savedAttempts = isGarden ? parse(prefix + '.attempts.v9') : null;
const attempts = new Map();
if (oldAttempt?.level) attempts.set(oldAttempt.level, oldAttempt);
for (const [id, attempt] of Object.entries(savedAttempts ?? {})) attempts.set(Number(id), attempt);
const legacyComplete = isGarden && read(prefix + '.v1') === 'complete';
const limit = value => Number.isInteger(value) && value >= 1 && value <= stages.length;
const savedBest = progress?.best;
const best = Object.fromEntries(Object.entries(savedBest && typeof savedBest === 'object' ? savedBest : {})
  .filter(([id, count]) => limit(Number(id)) && Number.isInteger(count) && count >= 0));
const oldDoor = read(legacyChoice);
const savedItems = parse('light-quest.secret-garden.inventory.v8');
const inventory = new Set(Object.keys(doors).filter(door => door === oldDoor ||
  (Array.isArray(savedItems) && savedItems.includes(door))));

let unlocked = Math.max(legacyComplete ? gateStage : 1, limit(progress?.unlocked) ? progress.unlocked : 1);
const cleared = id => Object.hasOwn(best, id) || (legacyComplete && id < gateStage);

function canPlay(id) {
  if (!limit(id)) return false;
  if (!isGarden) return id <= unlocked;
  if (id <= gateStage) return id === 1 || cleared(id - 1) || id <= unlocked;
  if (id === lastStage) return Object.values(doors).every(door => cleared(door.stages[1]));
  const door = doors[stages[id - 1].area];
  return cleared(gateStage) && inventory.has(stages[id - 1].area) && (id === door.stages[0] || cleared(id - 1));
}

let level = canPlay(progress?.level) ? progress.level : legacyComplete ? gateStage : 1;
let grid;
let history = [];
let actions = [];
let tiles = [];
let beam;
let hint = null;
let view;
let exploring = false;
let artwork = 'moonwood';

function element(tag, attrs) {
  const node = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attrs ?? {})) node.setAttribute(key, value);
  return node;
}

function svgUse(id, classes) {
  const icon = element('svg', { viewBox: '0 0 80 80', class: classes, 'aria-hidden': 'true' });
  icon.append(element('use', { href: pieces.href + '#' + id }));
  return icon;
}

function buildBlooms() {
  const layer = scene.querySelector('.blooms');
  const coords = [[12,79],[15,76],[20,87],[24,87],[78,70],[76,77],[85,77],[69,87],[28,81],[8,66]];
  coords.forEach(([x, y], i) => {
    const flower = element('g', { class: 'flower', style: '--delay:' + (i * 43) + 'ms' });
    const petals = element('g', { transform: 'translate(' + x + ' ' + y + ')' });
    for (let angle = 0; angle < 360; angle += 72) {
      petals.append(element('ellipse', { cx: 0, cy: -.66, rx: .35, ry: .78, transform: 'rotate(' + angle + ')',
        fill: i % 2 ? '#eeb0fd' : '#a9daff', opacity: .87 }));
    }
    petals.append(element('circle', { r: .34, fill: '#fff4b7' }));
    flower.append(petals);
    layer.append(flower);
  });
}

function persist() {
  const attempt = { level, actions };
  attempts.set(level, attempt);
  if (isGarden) {
    write(prefix + '.progress.v9', JSON.stringify({ unlocked, level, best, exploring }));
    write(prefix + '.attempts.v9', JSON.stringify(Object.fromEntries(attempts)));
  } else {
    write(prefix + '.v1', JSON.stringify({ unlocked, level, best }));
    write(prefix + '.attempt.v8', JSON.stringify(attempt));
  }
}

function label(cell, x, y) {
  const where = ' · hàng ' + (y + 1) + ', cột ' + (x + 1);
  const names = { P: 'Xoay lăng kính đôi', F: 'Lăng kính ' + colorNames[cell.state + 1], K: cell.state ? 'Công tắc đang bật' : 'Công tắc đang tắt', M: 'Dời bóng tối' };
  return (names[cell.type] ?? ('Xoay gương ' + (cell.state ? 'xuống phải' : 'lên phải'))) + where;
}

function updateTile(x, y) {
  const cell = grid[y][x];
  const type = cell.type;
  const spot = position(x, y);
  const interactive = controls.includes(type);
  const target = receivers.includes(type);
  const kind = { S: 'crystal', T: 'crystal', R: 'crystal', B: 'crystal', Y: 'crystal', F: 'prism', P: 'splitter', A: 'seed', G: 'root-gate', K: 'switch', M: 'shadow', '#': 'wall', '=': 'bridge' }[type] ?? 'mirror';
  let tile = tiles[y][x];
  if (tile.dataset.type !== type) {
    const replacement = document.createElement(interactive ? 'button' : 'div');
    replacement.className = 'tile';
    replacement.dataset.type = type;
    replacement.dataset.x = x;
    replacement.dataset.y = y;
    if (interactive) {
      replacement.type = 'button';
      replacement.onclick = () => play(x, y);
    } else {
      replacement.setAttribute('aria-hidden', 'true');
    }
    if (type === '.' || type === '=') {
      const ground = document.createElement('span');
      ground.className = type === '=' ? 'trench' : 'anchor';
      replacement.append(ground);
    }
    if (type !== '.') {
      if (type !== '=' && type !== '#' && type !== 'M') replacement.append(svgUse('pedestal', 'base'));
      replacement.append(svgUse(kind, 'object ' + kind));
      if (type === 'P') replacement.append(svgUse('splitter-facet', 'object splitter-facet'));
    }
    tile.replaceWith(replacement);
    tile = tiles[y][x] = replacement;
  }
  tile.toggleAttribute('data-target', target);
  tile.toggleAttribute('data-charged', view.charged.has(spot));
  tile.toggleAttribute('data-source', type === 'S');
  tile.toggleAttribute('data-hint', hint?.x === x && hint?.y === y);
  tile.style.setProperty('--element', type === 'S' ? '#b6f5ff' :
    colors[type === 'F' ? cell.state + 1 : target ? receivers.indexOf(type) : 0]);
  tile.style.setProperty('--turn', (cell.state ? -44 : 44) + 'deg');
  tile.toggleAttribute('data-lit', view.lit.has(spot));
  if (type === 'A' || type === 'G') tile.lastElementChild.toggleAttribute('data-powered', view.relay);
  if (type === 'K') tile.lastElementChild.toggleAttribute('data-pressed', Boolean(cell.state));
  if (type === '=') tile.lastElementChild.toggleAttribute('data-powered', view.bridge);
  if (interactive) {
    tile.setAttribute('aria-label', label(cell, x, y));
    tile.setAttribute('aria-disabled', String(view.won));
  }
}

function buildBoard() {
  board.replaceChildren();
  board.style.setProperty('--rows', grid.length);
  board.style.setProperty('--cols', grid[0].length);
  tiles = grid.map(row => row.map(() => board.appendChild(document.createElement('div'))));
  beam = element('svg', { class: 'beam', viewBox: '0 0 ' + grid[0].length * 100 + ' ' + grid.length * 100,
    preserveAspectRatio: 'none', 'aria-hidden': 'true' });
  const floor = element('svg', { class: 'floor', viewBox: beam.getAttribute('viewBox'),
    preserveAspectRatio: 'none', 'aria-hidden': 'true' });
  const rubble = element('g');
  grid.forEach((row, y) => row.forEach((cell, x) => {
    if (cell.type === '=') return;
    const variant = (x * 13 + y * 7) % 12;
    const slab = element('path', { d: 'M 11 7 L 78 4 94 18 94 83 78 95 9 92 5 73 5 22 Z',
      transform: 'translate(' + (x * 100 + variant / 2) + ' ' + (y * 100 + variant / 3) + ')',
      class: 'slab', opacity: .28 + variant / 60 });
    rubble.append(slab);
  }));
  floor.append(rubble);
  board.prepend(floor);
  board.append(beam);
}

function drawBeam(animate) {
  beam.replaceChildren();
  for (const segment of view.segments) {
    const group = element('g', { style: '--ray:' + colors[segment.color] });
    for (const part of ['aura', 'glow', 'core']) {
      group.append(element('line', { class: part, x1: (segment.x + .5) * 100, y1: (segment.y + .5) * 100,
        x2: (segment.nx + .5) * 100, y2: (segment.ny + .5) * 100 }));
    }
    beam.append(group);
  }
  if (animate) {
    beam.classList.remove('fresh');
    // Flush only after a move so a second rapid input restarts the short ray transition.
    beam.getBoundingClientRect();
    beam.classList.add('fresh');
  }
}

function nextAction() {
  if (exploring) {
    return canPlay(lastStage) ? {
      text: cleared(lastStage) ? 'Về Bình minh →' : 'Mở lối Bình minh →',
      run: () => start(lastStage, attempts.get(lastStage))
    } : null;
  }
  if (!isGarden && level === stages.length) {
    return view.won ? { text: 'Bước vào khu vườn →', run: () => location.assign('./garden/') } : null;
  }
  if (isGarden && level === lastStage) {
    return view.won ? { text: 'Xem hồi kết →', run: showEnding } : null;
  }
  if (isGarden && [gateStage, ...Object.values(doors).map(door => door.stages[1])].includes(level)) {
    return cleared(level) ? {
      text: level === gateStage ? 'Khám phá hai cánh cửa →' : 'Trở lại hai cánh cửa →',
      run: enterDoors
    } : null;
  }
  return canPlay(level + 1) ? { text: 'Màn tiếp →', run: () => start(level + 1, attempts.get(level + 1)) } : null;
}

function render(message, animate = false) {
  view = trace(grid);
  if (view.won) {
    best[level] = Math.min(best[level] ?? Infinity, actions.length);
    if (!isGarden || level < gateStage) unlocked = Math.max(unlocked, Math.min(level + 1, stages.length));
    if (isGarden && level === gateStage) write(prefix + '.v1', 'complete');
  }
  const stage = stages[level - 1];
  const chapter = isGarden ? chapterNames[stage.area] ?? 'Khu vườn bí mật' : 'Thung lũng · ' + stage.kind;
  $('chapter').textContent = exploring ? 'Khu vườn bí mật · Ngã rẽ' : chapter + ' / ' + String(level).padStart(2, '0');
  $('title').textContent = exploring ? 'Hai lối qua khu vườn' : stage.title;
  const done = stages.filter((_, i) => cleared(i + 1)).length;
  $('progress').replaceChildren();
  if (isGarden) {
    const gems = document.createElement('span');
    gems.className = 'progress-gems';
    gems.setAttribute('aria-hidden', 'true');
    for (const group of [[1, 2, 3, 4], [5, 6], [7, 8], [9]]) {
      const pip = document.createElement('i');
      pip.toggleAttribute('data-done', group.every(cleared));
      gems.append(pip);
    }
    $('progress').append(gems);
  }
  $('progress').append(done + ' / ' + stages.length);
  $('progress').setAttribute('aria-label', done + ' trên ' + stages.length + ' màn đã giải');
  $('objectives').textContent = exploring ? 'Chọn một cánh cửa để khám phá' :
    'Tinh thể ' + view.charged.size + ' / ' + view.total + (view.relay ? ' · Cửa rễ mở' : '') + (view.bridge ? ' · Đã nối cầu' : '');
  scene.toggleAttribute('data-tree', isGarden ? level > 1 || view.won : view.won);
  scene.toggleAttribute('data-bloom', isGarden ? level > 2 || level === 2 && view.won : view.won);
  scene.toggleAttribute('data-open', view.won && !exploring);
  scene.toggleAttribute('data-bridge', view.bridge);
  scene.toggleAttribute('data-dawn', !exploring && isGarden && level === lastStage && view.won);
  $('status').textContent = exploring ? 'Túi khám phá · ' + inventory.size + ' / 2' : view.won ? '✦ Đã thắp sáng' : 'Dẫn đường cho ánh sáng';
  const doorway = doors[stage.area];
  const success = level === lastStage && isGarden ? 'Mảnh Sao và Hạt Mầm đã đánh thức bình minh.' :
    doorway?.stages[1] === level ? 'Đã thắp sáng ' + doorway.area + '. Quay lại hai cánh cửa để tiếp tục.' :
      'Tinh thể đã sáng. Lối đi tiếp theo đã mở.';
  $('feedback').textContent = message ?? (exploring ?
    (canPlay(lastStage) ? 'Hai vùng đất đã sáng. Mảnh Sao và Hạt Mầm cùng mở lối Bình minh.' :
      'Mảnh Sao mở lăng kính đôi ở Tinh Tú. Hạt Mầm đánh thức cửa rễ ở Rừng Sâu.') :
    view.won ? success : stage.desc);
  $('record').textContent = exploring ? 'Hành trình · ' + done + ' / ' + stages.length :
    actions.length + ' thao tác' + (Object.hasOwn(best, level) ? ' · Kỷ lục ' + best[level] : '');
  $('undo').hidden = $('hint').hidden = exploring;
  $('undo').disabled = exploring || !history.length;
  $('hint').disabled = exploring || view.won;
  $('reset').hidden = exploring;
  $('return-doors').hidden = !isGarden || exploring || !cleared(gateStage);
  const next = nextAction();
  $('advance').hidden = !next;
  $('advance').textContent = next?.text ?? '';
  $('advance').onclick = next?.run ?? null;
  if (!exploring) {
    grid.forEach((row, y) => row.forEach((_, x) => updateTile(x, y)));
    drawBeam(animate);
  }
  persist();
}

function changeArtwork(name) {
  if (name === artwork) return;
  artwork = name;
  art.querySelector('source').srcset = new URL(name + '-small.webp', import.meta.url).href;
  art.querySelector('img').src = new URL(name + '.webp', import.meta.url).href;
}

function animateArrival() {
  scene.classList.remove('entering');
  scene.getBoundingClientRect();
  scene.classList.add('entering');
}

function start(next, attempt, transition = true) {
  level = next;
  exploring = false;
  board.hidden = false;
  $('explore').hidden = true;
  const area = stages[level - 1].area;
  changeArtwork(artworks[area] ?? 'moonwood');
  scene.dataset.area = area ?? '';
  scene.removeAttribute('data-explore');
  scene.removeAttribute('data-door');
  grid = makeGrid(stages[level - 1]);
  actions = [];
  history = [];
  hint = null;
  if (attempt?.level === level && Array.isArray(attempt.actions)) {
    for (const step of attempt.actions) {
      if (trace(grid).won) break;
      if (!Number.isInteger(step?.x) || !Number.isInteger(step?.y)) break;
      const nextGrid = activate(grid, step.x, step.y);
      if (!nextGrid) break;
      history.push(grid);
      actions.push(step);
      grid = nextGrid;
    }
  }
  buildBoard();
  render();
  if (transition) {
    animateArrival();
    $('title').focus({ preventScroll: true });
  }
}

function play(x, y) {
  if (view.won || exploring || menu.open) return;
  const next = activate(grid, x, y);
  if (!next) {
    render('Bóng tối đang kẹt. Hãy hoàn tác để mở đường.');
    return;
  }
  const movedShadow = grid[y][x].type === 'M' && tiles[y][x] === document.activeElement;
  history.push(grid);
  grid = next;
  actions.push({ x, y });
  hint = null;
  render(undefined, true);
  if (movedShadow) {
    const nextY = y === 2 ? 3 : 2;
    const shadow = grid[nextY]?.[x]?.type === 'M' ? tiles[nextY][x] : tiles[y][x + 1];
    shadow?.focus({ preventScroll: true });
  }
}

function openMenu(title, content) {
  $('menu-title').textContent = title;
  $('menu-content').replaceChildren(content);
  if (!menu.open) menu.showModal();
}

function enterDoors() {
  if (!isGarden || !cleared(gateStage)) return;
  exploring = true;
  board.hidden = true;
  scene.setAttribute('data-explore', '');
  changeArtwork('secret-doors');
  const container = $('explore');
  container.replaceChildren();
  for (const [door, info] of Object.entries(doors)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'door';
    const count = info.stages.filter(cleared).length;
    button.textContent = info.title;
    const progress = document.createElement('small');
    progress.textContent = count === info.stages.length ? '✓ Đã thắp sáng' : count + ' / ' + info.stages.length + ' màn';
    button.append(progress);
    button.toggleAttribute('data-found', inventory.has(door));
    button.onclick = () => {
      const alreadyFound = inventory.has(door);
      inventory.add(door);
      write('light-quest.secret-garden.inventory.v8', JSON.stringify([...inventory]));
      write(legacyChoice, door);
      const next = info.stages.find(id => !cleared(id)) ?? info.stages[0];
      start(next, attempts.get(next));
      if (!alreadyFound) render('Bạn nhận được ' + info.item + '. ' + stages[next - 1].desc);
    };
    container.append(button);
  }
  container.hidden = false;
  render();
  animateArrival();
  container.firstElementChild.focus({ preventScroll: true });
}

$('undo').onclick = () => {
  if (!history.length || exploring) return;
  grid = history.pop();
  actions.pop();
  hint = null;
  render(undefined, true);
};
$('reset').onclick = () => start(level);
$('hint').onclick = () => {
  if (view.won || exploring) return;
  hint = solve(grid)?.[0];
  if (!hint) {
    render('Đường sáng đang bị khóa. Hãy hoàn tác hoặc chơi lại màn.');
    return;
  }
  const cell = grid[hint.y][hint.x];
  const nextColor = colorNames[(cell.state + 1) % 3 + 1];
  const messages = { P: 'Xoay lăng kính đôi được đánh dấu để đổi hướng nhánh rẽ.', F: 'Đổi lăng kính được đánh dấu sang ' + nextColor + '.', K: (cell.state ? 'Tắt' : 'Bật') + ' công tắc được đánh dấu.', M: 'Dời bóng tối được đánh dấu ra khỏi đường tia.' };
  render(messages[cell.type] ?? 'Xoay tấm gương được đánh dấu, rồi theo dõi hướng mới của tia sáng.');
};
$('return-doors').onclick = enterDoors;

function showEnding() {
  const content = document.createElement('div');
  content.className = 'ending-card';
  const seal = document.createElement('span');
  seal.textContent = '✦';
  seal.setAttribute('aria-hidden', 'true');
  const story = document.createElement('p');
  story.textContent = 'Mảnh Sao vỡ thành những hạt sáng. Hạt Mầm vươn qua khe đá, đón tia nắng đầu tiên. Từ giờ, khu vườn có thể tự giữ ánh sáng của mình.';
  const back = document.createElement('button');
  back.type = 'button';
  back.textContent = 'Về hai cánh cửa';
  back.onclick = () => {
    menu.close();
    enterDoors();
  };
  content.append(seal, story, back);
  openMenu('Khu vườn đã thức giấc', content);
}

$('pause').onclick = () => {
  const content = document.createElement('div');
  const p = document.createElement('p');
  p.textContent = 'Bạn có thể đóng bảng này để tiếp tục đúng vị trí đang chơi.';
  const resume = document.createElement('button');
  resume.type = 'button';
  resume.textContent = 'Tiếp tục chơi';
  resume.onclick = () => menu.close();
  content.append(p, resume);
  openMenu('Đang tạm dừng', content);
};
$('journal').onclick = () => {
  const content = document.createElement('div');
  const pack = document.createElement('p');
  pack.textContent = 'Túi khám phá · ' + ([...inventory].map(door => doors[door].item).join(' · ') || 'Chưa có vật phẩm');
  content.append(pack);
  const list = document.createElement('div');
  list.className = 'level-list';
  stages.forEach((stage, index) => {
    const id = index + 1;
    const button = document.createElement('button');
    button.type = 'button';
    button.disabled = !canPlay(id);
    if (id === level && !exploring) button.setAttribute('aria-current', 'step');
    button.textContent = String(id).padStart(2, '0') + ' · ' + stage.title +
      (cleared(id) ? ' ✓' : !canPlay(id) ? ' · Đang khóa' : '');
    button.onclick = () => {
      menu.close();
      if (id !== level || exploring) start(id, attempts.get(id));
    };
    list.append(button);
  });
  content.append(list);
  openMenu('Nhật ký hành trình', content);
};

buildBlooms();
start(level, attempts.get(level), false);
if (isGarden && (progress?.exploring || oldAttempt?.exploring && !savedAttempts)) enterDoors();
