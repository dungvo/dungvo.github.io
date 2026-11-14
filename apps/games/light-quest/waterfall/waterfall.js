import { apply, gear, initial, outputs, routes, titles, targets } from './engine.mjs';

import { activate, trace } from '../world/optics.js';
import { chapters, routesToChapters, finale } from './chapters.js';
import { chapterGrid, chapterHint, paintChapter } from './chapter-board.js';

const $ = id => document.getElementById(id);
const key = 'light-quest.waterfall.v1';
const modal = $('modal');
const names = { an: 'An', kha: 'Kha' };
const art = {
  hub: ['./falls.webp', './falls-small.webp'],
  stars: ['../world/star-observatory.webp', '../world/star-observatory-small.webp'],
  roots: ['../world/root-grove.webp', '../world/root-grove-small.webp'],
  old: ['../world/secret-doors.webp', '../world/secret-doors-small.webp']
};
const outlets = {
  stars: [['moon', 'Đĩa trăng'], ['star', 'Đĩa sao']],
  roots: [['seed', 'Hạt Mầm'], ['stream', 'Đèn suối']],
  old: [['tower', 'Mạch tháp'], ['root', 'Mạch rễ']]
};
const endings = {
  stars: 'Hai đĩa sao cùng sáng. Trên vách núi, dải đèn đầu tiên của làng đã thức.',
  roots: 'Hạt Mầm nuôi dòng sáng qua bờ đối diện. Cửa rễ mở lối xuống bến hồ.',
  old: 'Hai mạch được nối. Từ cổng cũ, bạn nhìn thấy đèn làng và dòng suối cùng sáng.'
};
const locations = {
  source: [140, 142], mirror: [366, 269],
  stars: [885, 145], roots: [851, 420], old: [113, 418],
  upper: [739, 183], lower: [737, 386], idle: [558, 318],
  hero: [510, 330], bank: [215, 448], crossing: [342, 356], npc: [205, 287], skill: [550, 415], inspect: [288, 464]
};
let saved = null;
try { saved = JSON.parse(localStorage.getItem(key)); } catch { /* Saved data is optional. */ }
const stored = saved?.state;
let state = stored && Object.hasOwn(names, stored.hero) && Object.hasOwn(art, stored.scene) &&
  [0, 1, 2].includes(stored.direction) && ['bank', 'island'].includes(stored.position) &&
  Array.isArray(stored.charged) && Array.isArray(stored.rings) && stored.rings.length === 2 &&
  stored.rings.every(n => [0, 1, 2].includes(n)) && Array.isArray(stored.completed) ? stored : null;
let records = Array.isArray(saved?.records) ? saved.records.filter(id => routes.includes(id)) : [];
let past = [];
let painted = '';
let hint = 0;
const roomAttempts = Object.fromEntries(Object.keys(chapters).map(id => {
  const storedMoves = saved?.roomAttempts?.[id];
  const moves = Array.isArray(storedMoves) ? storedMoves.filter(move =>
    Array.isArray(move) && move.length === 2 && move.every(Number.isInteger)) : [];
  return [id, moves];
}));
const done = new Set(Array.isArray(saved?.done) ? saved.done.filter(id => Object.hasOwn(chapters, id)) : []);
const chapterBeam = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
chapterBeam.id = 'chapter-beam';
chapterBeam.setAttribute('aria-hidden', 'true');
let room = state && isOpen(saved?.room) ? saved.room : null;

function isOpen(id) {
  if (id === finale) return done.has('T05') && done.has('R05');
  for (const [route, list] of Object.entries(routesToChapters)) {
    const index = list.indexOf(id);
    if (index === 0) return records.includes(route);
    if (index > 0) return done.has(list[index - 1]);
  }
  return false;
}

const save = () => {
  try { localStorage.setItem(key, JSON.stringify({ state, records, room, done: [...done], roomAttempts })); } catch { /* Continue in memory. */ }
};

function position(element, point) {
  element.style.setProperty('--x', point[0] / 10 + '%');
  element.style.setProperty('--y', point[1] / 5.625 + '%');
}

function message(text) { $('status').textContent = text; }

function perform(action) {
  const next = apply(state, action);
  if (!next) return false;
  past.push(state);
  state = next;
  records = [...new Set([...records, ...state.completed])];
  hint = 0;
  save();
  render();
  return true;
}

function dialog(title, detail, buttons) {
  $('modal-title').textContent = title;
  $('modal-text').textContent = detail;
  $('modal-actions').replaceChildren();
  for (const [name, run] of buttons) {
    const button = document.createElement('button');
    button.textContent = name;
    button.onclick = () => { modal.close(); run(); };
    $('modal-actions').append(button);
  }
  modal.showModal();
}

function marker(id, text, location, action, note, powered = false) {
  const el = document.createElement('button');
  el.className = 'marker';
  el.dataset.object = id;
  el.toggleAttribute('data-powered', powered);
  el.textContent = text;
  if (note) {
    const sub = document.createElement('small');
    sub.textContent = note;
    el.append(sub);
  }
  position(el, location);
  el.onclick = action;
  $('objects').append(el);
  return el;
}

function linePath(points, warm = false) {
  const ns = 'http://www.w3.org/2000/svg';
  const styles = warm ? [['#ffb951', 11, .17], ['#ffd56d', 4, .78], ['#fff5c4', 1.4, 1]] :
    [['#42cbff', 11, .19], ['#54e0ff', 4, .85], ['#e4fcff', 1.4, 1]];
  for (const [index, point] of points.slice(1).entries()) {
    for (const [color, width, opacity] of styles) {
      const line = document.createElementNS(ns, 'line');
      const [x, y] = points[index];
      for (const [name, val] of Object.entries({ x1: x, y1: y, x2: point[0], y2: point[1], stroke: color, 'stroke-width': width, opacity })) {
        line.setAttribute(name, val);
      }
      $('beam').append(line);
    }
  }
}

function drawLight(target) {
  $('beam').replaceChildren();
  const emitter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  for (const [key, value] of Object.entries({ cx: locations.source[0], cy: locations.source[1], r: 7, fill: '#b3faff', stroke: '#805a38', 'stroke-width': 3 })) emitter.setAttribute(key, value);
  $('beam').append(emitter);
  const { source, mirror, idle, upper, lower } = locations;
  if (state.scene === 'stars') {
    for (const id of state.charged) linePath([locations.hero, id === 'moon' ? upper : lower], true);
    return;
  }
  if (state.scene !== 'hub') {
    linePath([source, mirror, state.direction === 0 ? upper : state.direction === 1 ? lower : idle], state.scene === 'stars');
    return;
  }
  if (state.position === 'bank') {
    linePath([source, locations.crossing]);
    return;
  }
  const end = target === 'old' && !state.revealed ? locations.inspect : locations[target];
  const path = [source, mirror, end];
  if (state.portable) {
    path.splice(2, 0, locations.skill);
    const mirror = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    for (const [key, value] of Object.entries({ cx: locations.skill[0], cy: locations.skill[1], r: 7, fill: '#c9e7f2', stroke: '#d9aa62', 'stroke-width': 3 })) mirror.setAttribute(key, value);
    $('beam').append(mirror);
  }
  linePath(path);
}

function nextRoom(id) {
  const list = Object.values(routesToChapters).find(items => items.includes(id));
  if (!list) return null;
  const next = list[list.indexOf(id) + 1];
  return next ?? (isOpen(finale) && !done.has(finale) ? finale : null);
}

function useArtwork(area) {
  if (painted === area) return;
  painted = area;
  $('scene').dataset.area = area;
  $('scene').querySelector('source').srcset = art[area][1];
  $('land').src = art[area][0];
}

function enterRoom(id) {
  if (!isOpen(id)) return;
  room = id;
  hint = 0;
  showPlay();
  save();
}

function showNext(id) {
  const button = $('next-room');
  button.hidden = !id;
  if (id) {
    button.textContent = chapters[id].title + ' →';
    button.onclick = () => enterRoom(id);
  }
}

function renderChapter(step) {
  const stage = chapters[room];
  const area = room.startsWith('T') ? 'stars' : room.startsWith('R') ? 'roots' : 'old';
  useArtwork(area);
  const grid = chapterGrid(stage, roomAttempts[room]);
  const view = trace(grid);
  if (view.won) done.add(room);
  $('title').textContent = stage.title;
  $('explored').textContent = view.charged.size + ' / ' + view.total + ' tinh thể sáng';
  $('undo').disabled = !roomAttempts[room].length;
  $('hint').hidden = view.won;
  $('return').hidden = false;
  $('return').classList.remove('gold');
  showNext(view.won ? nextRoom(room) : null);
  message(step?.text ?? (view.won
    ? room === finale ? 'Hai mạch đã sáng. Từ xa, cả tháp làng và bờ hồ cùng đón bình minh.'
      : 'Tinh thể đã sáng. Tiến độ được lưu trên bản đồ màn.'
    : stage.desc + (view.relay ? ' Cửa rễ đã mở.' : '') + (view.bridge ? ' Cầu đã nối.' : '')));
  paintChapter($('chapter-board'), chapterBeam, grid, view, step, (x, y) => {
    if (view.won || !activate(grid, x, y)) return;
    roomAttempts[room].push([x, y]);
    renderChapter();
    save();
  });
}

function render() {
  $('chapter-board').hidden = !room;
  $('objects').hidden = $('hero').hidden = $('beam').hidden = Boolean(room);
  if (room) {
    renderChapter();
    return;
  }
  const scene = state.scene;
  const powered = outputs(state)[0];
  const complete = state.charged.length === 2;
  $('title').textContent = titles[scene];
  $('explored').textContent = records.length + ' / 3 lối đã khám phá';
  $('undo').disabled = !past.length;
  $('hint').hidden = complete;
  $('return').hidden = scene === 'hub';
  $('return').classList.toggle('gold', complete);
  useArtwork(scene);
  showNext(complete ? routesToChapters[scene]?.find(id => !done.has(id) && isOpen(id)) : null);
  $('hero-name').textContent = names[state.hero];
  $('hero-art').src = './' + state.hero + '.webp';
  position($('hero'), scene === 'hub' && state.position === 'bank' ? locations.bank : locations.hero);
  drawLight(powered);
  const activeObject = document.activeElement?.dataset.object;
  $('objects').replaceChildren();
  if (scene !== 'stars') {
    const mirror = marker('mirror', '', locations.mirror, () => { if (!perform('rotate')) message('Hãy qua cầu để đứng cạnh gương.'); }, '', true);
    mirror.classList.add('mirror');
    mirror.setAttribute('aria-label', 'Xoay gương');
    const angles = [18, -34, 68];
    mirror.innerHTML = '<svg viewBox="0 0 38 34" aria-hidden="true"><ellipse cx="19" cy="28" rx="14" ry="4" fill="#a47840"/><path d="M15 16h8l2 10H13z" fill="#c9a46d"/><g transform="rotate(' + angles[state.direction] + ' 19 14)"><rect x="6" y="7" width="26" height="14" rx="2" fill="#9bc6d8" stroke="#ffdc91" stroke-width="2"/><path d="M9 17L22 9m-7 11L29 11" stroke="#effbff" stroke-width="1.5"/></g></svg>';
  }
  if (scene === 'stars') {
    for (const [id, label, spot] of [['moon', 'Xoay vòng trăng', locations.upper], ['star', 'Xoay vòng sao', locations.lower]]) {
      const aligned = state.charged.includes(id);
      const ring = marker(id, label, spot, () => perform('align-' + id), aligned ? '✓ Đã khớp' : 'Chưa khớp', aligned);
      ring.classList.add('ring');
      const icon = document.createElement('b');
      icon.textContent = ['○', '☾', '✦'][state.rings[id === 'moon' ? 0 : 1]];
      icon.setAttribute('aria-hidden', 'true');
      ring.prepend(icon);
    }
    message(complete ? endings.stars : 'Căn dấu ☾ ở vòng trăng và dấu ✦ ở vòng sao. · ' + state.charged.length + ' / 2');
  } else if (scene === 'hub') {
    if (state.position === 'bank') marker('cross', 'Qua cầu', locations.crossing, () => perform('cross'), '', true);
    if (state.position === 'island') marker('npc', 'Bà Miên', locations.npc, () => dialog('Bà Miên', 'Cửa cũ có dấu xoắn. Chiếc đèn cạnh cửa sẽ cho con thấy trụ ẩn.', [['Ghi vào nhật ký', () => {
      perform('clue');
      message('Đã ghi dấu xoắn. Soi đèn gần Lối Cũ để lộ trụ.');
    }]]));
    if (state.position === 'island') marker('skill', gear[state.hero], locations.skill, () => {
      if (!perform('skill')) message(state.clue ? 'Dấu ẩn đã hiện.' : 'Hỏi Bà Miên trước để biết nên soi ở đâu.');
    }, '', state.portable);
    if (state.clue && !state.revealed) marker('inspect', 'Đèn cũ', locations.inspect, () => perform('inspect'));
    for (const id of routes) {
      const open = state.position === 'island' && powered === id && (id !== 'old' || state.revealed);
      marker(id, titles[id], locations[id], () => {
        if (!perform(id)) message(state.position === 'bank' ? 'Qua cầu để tới gần cổ vật và cửa.' : id === 'old' && !state.revealed ? 'Có một dấu xoắn trên cửa. Bà Miên có thể biết thêm.' : 'Xoay gương để cấp sáng cho lối này.');
      }, open ? 'Lối mở' : 'Đang khóa', open);
    }
    message(state.position === 'bank' ? 'Qua cầu để tới đảo đá. Ở đó bạn mới xoay được gương.' :
      'Chạm gương để đổi đường tia. Đi qua cửa sáng hoặc hỏi Bà Miên về dấu xoắn.');
  } else {
    const hintText = { roots: 'Đánh thức Hạt Mầm trước. Sau đó dẫn tia đến đèn suối.',
      old: 'Khởi động mạch tháp trước, rồi nối mạch rễ.' };
    outlets[scene].forEach(([id, title], i) => {
      const done = state.charged.includes(id);
      marker(id, title, i ? locations.lower : locations.upper, () => {
        if (!perform('capture:' + id)) message(done ? 'Đích này đã được ghi.' : 'Dẫn tia tới đích. Nếu mạch chưa nối, hãy thử đích còn lại trước.');
      }, done ? '✓ Đã thắp' : powered === id ? 'Chạm để thắp' : 'Chờ tia', powered === id || done);
    });
    message(complete ? endings[scene] : hintText[scene] + ' · ' + state.charged.length + ' / 2');
  }
  if (activeObject) $('objects').querySelector('[data-object="' + activeObject + '"]')?.focus({ preventScroll: true });
}

function showPlay() {
  $('lobby').hidden = true;
  $('play').hidden = false;
  $('pause').hidden = false;
  render();
  $('title').focus({ preventScroll: true });
}

function showLobby() {
  $('lobby').hidden = false;
  $('play').hidden = true;
  $('pause').hidden = true;
  $('resume').hidden = !state;
}

$('lobby').querySelectorAll('[data-character]').forEach(button => {
  const start = () => {
    state = initial(button.dataset.character);
    room = null;
    past = [];
    hint = 0;
    save();
    showPlay();
  };
  button.onclick = () => state ? dialog('Bắt đầu lượt mới?', 'Vị trí đang chơi sẽ được thay bằng lượt mới. Các lối đã khám phá vẫn được ghi lại.',
    [['Chơi mới', start]]) : start();
});
$('resume').onclick = showPlay;
$('pause').onclick = () => dialog('Tạm dừng', 'Hành trình được lưu sau mỗi thao tác trên thiết bị này.', [
  ['Tiếp tục', () => {}], ['Lưu và về menu', () => { save(); showLobby(); }]
]);
$('undo').onclick = () => {
  if (room) {
    roomAttempts[room].pop();
    renderChapter();
    save();
    return;
  }
  if (!past.length) return;
  state = past.pop();
  hint = 0;
  save();
  render();
};
$('return').onclick = () => {
  if (!room) {
    perform('back');
    return;
  }
  room = null;
  if (state.scene !== 'hub') state = apply(state, 'back');
  hint = 0;
  past = [];
  save();
  showPlay();
};
$('chapters').onclick = () => {
  const buttons = [];
  for (const list of [...Object.values(routesToChapters), [finale]]) {
    for (const id of list) {
      if (isOpen(id)) buttons.push([chapters[id].title + (done.has(id) ? ' ✓' : ''), () => enterRoom(id)]);
    }
  }
  dialog('Bản đồ màn', done.size + ' / 12 màn mới đã giải. Hoàn thành phòng đầu của mỗi lối để mở khu đó. ' +
    'Giải xong Đài Sao và Suối Rễ để mở Hai mạch bình minh.', buttons);
};
$('hint').onclick = () => {
  if (room) {
    const step = chapterHint(chapterGrid(chapters[room], roomAttempts[room]));
    if (step) renderChapter(step);
    else message('Thử hoàn tác để tìm lại đường sáng.');
    return;
  }
  hint++;
  const scene = state.scene;
  const target = outputs(state)[0];
  let spot = 'mirror';
  if (scene === 'hub') {
    if (state.position === 'bank') {
      spot = 'cross';
      message('Chạm Qua cầu để bước tới đảo đá.');
    } else message(hint === 1 ? 'Hãy theo tia từ nguồn tới trụ. Cửa có ánh sáng là cửa có thể đi.' :
      'Chạm gương để chuyển giữa Đài Sao, Suối Rễ và dấu xoắn. Hỏi Bà Miên để mở Lối Cũ.');
  } else if (scene === 'stars') {
    spot = state.charged.includes('moon') ? 'star' : 'moon';
    message(hint === 1 ? 'Tìm vòng đồng có dấu chưa sáng.' : 'Chạm vòng đang được đánh dấu để căn lại.');
  } else {
    const goal = targets[scene].find(id => id !== 'empty' && !state.charged.includes(id));
    if (target === goal) spot = target;
    message(hint === 1 ? 'Quan sát đích nào chưa được thắp.' :
      spot === 'mirror' ? 'Xoay gương đến đích cần thắp.' : 'Chạm đích được viền sáng để ghi kết quả.');
  }
  $('objects').querySelectorAll('[data-focus]').forEach(el => el.removeAttribute('data-focus'));
  if (hint > 1) $('objects').querySelector('[data-object="' + spot + '"]')?.setAttribute('data-focus', '');
};
showLobby();
