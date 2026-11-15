import {applyGardenAction, createGarden, COSTS, mirrorById, wolfIntent} from '../core/garden-room.js';

import {AWAKENING} from '../core/awakening-levels.js';
import {bridgeWalkable, platePressed, shutterOpen, walkOptions} from '../core/room-traversal.js';

const Phaser = globalThis.Phaser;
const $ = id => document.getElementById(id);
const ASSET = '../assets/awakening/';
const WIDTH = 856;
const HEIGHT = 744;
const CELL = 112;
const BORDER = 36;
const COLORS = {
  gold: [0xffac34, 0xffd350, 0xfffae4],
  red: [0xf82e42, 0xff6e62, 0xffeee4]
};
const EVENT_TEXT = {
  'relay-needs-relic': 'Cần gạt cần năng lượng từ Lõi Mặt Trời.',
  relic: 'Đã lấy Lõi Mặt Trời. Cầu trên đã quá tải. Hãy thắp một cầu khác ở bờ đông.',
  'rift-seal': 'Đã nhặt Ấn Vực Sáng trên cầu dưới.',
  return: 'Đã đưa Lõi Mặt Trời về bệ. Anh đã vượt qua Vực Ánh Sáng!',
  push: 'Đã đẩy khối đá. Đặt nó lên mâm để giữ cửa nâng.',
  relay: 'Cần gạt đã chốt cửa trên. Tìm đường tới mâm đá dưới.',
  bell: 'Tiếng chuông giữ chân sói. Bật tia đỏ và xoay gương trước khi sói tuần tra lại.',
  scan: 'Soi Sáng đã hé lộ hoa linh quang. Hãy nhặt bông hoa trên bàn.',
  repair: 'Gương cổ đã được phục hồi.',
  shard: 'Đã nhận mảnh sửa gương. Chọn gương vỡ để dùng.',
  secret: 'Đã cất hoa linh quang vào túi.',
  rock: 'Tia đỏ đã phá đá! Chạm mảnh vàng để nhặt.',
  wound: 'Tia đỏ đã làm Sói Bóng Đêm bị thương.',
  defeat: 'Đã hạ Sói Bóng Đêm!',
  break: 'Sói đã phá Gương Đông. Bạn có thể dùng mảnh vàng để sửa.',
  gate: 'Pha lê đã sáng. Cổng cổ đã mở!',
  pattern: 'Đã tạo Đường Sáng Cổ và nhận ấn thưởng!'
};
const DEVICES = {
  sun: ['Nguồn vàng', 'Tia vàng đánh thức pha lê.'],
  ember: ['Nguồn đỏ', 'Chạm để bật hoặc tắt (−1 năng lượng). Tia đỏ phá đá và làm sói bị thương.'],
  north: ['Gương Bắc', 'Một mặt · kính xanh phản xạ, lưng đồng hấp thụ.'],
  south: ['Gương Nam', 'Hai mặt · kính xanh phản xạ ở cả hai phía.'],
  middle: ['Gương Giữa', 'Hai mặt · kính xanh phản xạ ở cả hai phía.'],
  guard: ['Gương Đông', 'Hai mặt · kính xanh phản xạ ở cả hai phía.'],
  prism: ['Lăng kính tách tia', 'Chia tia thành hai nhánh và làm suy hao 8% công suất.'],
  'moon-lens': ['Bộ khuếch đại vàng', 'Tiếp năng lượng vào nhánh đi xuống của lăng kính.'],
  'ember-lens': ['Bộ khuếch đại đỏ', 'Tăng công suất tia đỏ để phá đá.'],
  'sun-filter': ['Kính lọc vàng', 'Chỉ truyền tia vàng.'],
  'ember-filter': ['Kính lọc đỏ', 'Chỉ truyền tia đỏ.'],
  crystal: ['Pha lê cổng', 'Cần tia đúng màu và đủ công suất để mở cổng.'],
  'crystal-east': ['Pha lê thứ hai', 'Cần tia đúng màu và đủ công suất để mở cổng.'],
  'sealed-rock': ['Đá phong ấn', 'Chỉ vỡ khi tia đỏ đủ công suất.'],
  shard: ['Mảnh sửa gương', 'Chạm để nhặt.'],
  secret: ['Hoa linh quang', 'Chạm để nhặt.']
};
const SPRITES = {splitter:'splitter', amplifier:'amplifier', filter:'filter', rock:'rock', receiver:'crystal', wall:'wall'};
const px = n => BORDER + (n + .5) * CELL;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const BUTTONS = new Map();
const WALK_BUTTONS = new Map();
const defaultDevice = room => room.objects.find(device => device.type === 'mirror' && !device.locked)?.id ??
  room.objects.find(device => device.type === 'splitter' || device.type === 'mirror')?.id ?? room.sources[0].id;
const progressKey = 'light-quest-awakening-v1';
const lastRoom = AWAKENING.length - 1;
const requestedRoom = Number(new URLSearchParams(location.search).get('man')) - 1;
const practice = Boolean(AWAKENING[requestedRoom]?.traversal?.exit);
const ROOM_BACKDROPS = {garden:'waterfall', prism:'prism-hall', ember:'ember-ruins', violet:'amethyst-cavern', night:'moonlit-fortress', rift:'amethyst-cavern'};
const THEME_WASH = {prism:0x2ccad8, ember:0xe25b45, violet:0xa66ee0, night:0x394bc5, rift:0x293766};
function loadProgress() {
  const empty = AWAKENING.map(() => false);
  if (practice) return {unlocked:requestedRoom, active:requestedRoom, cleared:empty};
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey));
    if (Number.isInteger(saved?.unlocked) && saved.unlocked >= 0 && saved.unlocked < AWAKENING.length) {
      const unlocked = Math.min(lastRoom, saved.unlocked + Number(saved.cleared?.[saved.unlocked] === true));
      const active = Number.isInteger(saved.active) && saved.active >= 0 ? Math.min(saved.active, unlocked) : 0;
      const cleared = AWAKENING.map((_, index) => index < saved.unlocked || saved.cleared?.[index] === true);
      return {unlocked, active, cleared};
    }
  } catch { /* Private browser sessions can restrict storage. */ }
  return {unlocked:0, active:0, cleared:empty};
}
const progress = loadProgress();
let state = createGarden(AWAKENING[progress.active]);
let selected = defaultDevice(state.level);
let explorer = 'lumi';
const history = [];
let idleTimer;
let clueTimer;

function hideClue() {
  clearTimeout(clueTimer);
  $('board-clue').hidden = true;
}

function showClue(id, title, text) {
  const tile = BUTTONS.get(id);
  if (!tile) return;
  const clue = $('board-clue');
  const top = parseFloat(tile.style.top);
  clue.style.setProperty('--clue-x', tile.style.left);
  clue.style.setProperty('--clue-y', tile.style.top);
  clue.dataset.below = String(top < 33);
  $('clue-title').textContent = title;
  $('clue-body').textContent = text;
  clue.hidden = false;
  clearTimeout(clueTimer);
  clueTimer = setTimeout(hideClue, 9000);
}

function saveProgress() {
  if (practice) return;
  try { localStorage.setItem(progressKey, JSON.stringify(progress)); } catch { /* Progress stays in this session. */ }
}

function loadRoom(index) {
  if (!Number.isInteger(index) || index < 0 || index > progress.unlocked || (practice && index !== requestedRoom)) return;
  hideClue();
  progress.active = index;
  state = createGarden(AWAKENING[index]);
  history.length = 0;
  selected = defaultDevice(state.level);
  saveProgress();
  say(state.level.intro);
  game.scene.getScene('garden').drawFloor();
  render();
}

function synchronizeLevels() {
  const picker = $('level-select');
  [...picker.options].forEach((option, index) => {
    option.disabled = practice ? index !== requestedRoom : index > progress.unlocked;
    const check = progress.cleared[index] ? ' ✓' : '';
    option.textContent = `${index + 1}. ${AWAKENING[index].title}${check}`;
  });
  picker.value = progress.active;
  $('room-count').textContent = `Màn ${progress.active + 1}/${AWAKENING.length}`;
  $('room-title').textContent = state.level.title;
  document.title = `Light Quest · ${state.level.title}`;
  if (document.body.dataset.theme !== state.level.theme) {
    document.body.dataset.theme = state.level.theme;
    document.body.style.setProperty('--room-bg', `url("${ASSET}${ROOM_BACKDROPS[state.level.theme]}.webp")`);
  }
  const isLast = progress.active === lastRoom;
  $('next-level').hidden = practice || !state.opened || isLast;
  $('chapter-complete').hidden = practice ? !progress.cleared[requestedRoom] : !isLast || !progress.cleared.every(Boolean);
  $('chapter-complete').textContent = practice ? '✓ Xong thử thách' : '✓ Xong chương';
  $('return-campaign').hidden = !practice;
  $('room-progress').textContent = practice ? 'Chơi thử riêng' : `${progress.cleared.filter(Boolean).length}/${AWAKENING.length} đã qua`;
}

function say(message) {
  $('message').textContent = message;
  $('mobile-message').textContent = message;
}

function synchronizeButtons() {
  const devices = [...state.level.sources, ...state.level.objects.filter(o => o.type !== 'wall')];
  if (state.loot === 'loose') devices.push({id:'shard', ...state.lootPosition});
  if (state.secret && !state.collectedSecret) devices.push({id:'secret', ...state.level.secret});
  const ids = new Set(devices.map(device => device.id));
  for (const [id, button] of BUTTONS) {
    if (!ids.has(id)) { button.remove(); BUTTONS.delete(id); }
  }
  for (const device of devices) {
    const {id, x, y} = device;
    let button = BUTTONS.get(id);
    if (!button) {
      button = document.createElement('button');
      button.className = 'tile-control';
      button.type = 'button';
      button.dataset.device = id;
      button.style.width = `${100 * (CELL - 5) / WIDTH}%`;
      button.style.height = `${100 * (CELL - 5) / HEIGHT}%`;
      button.addEventListener('click', () => activateDevice(id));
      BUTTONS.set(id, button);
      $('hotspots').append(button);
    }
    button.style.left = `${100 * px(x) / WIDTH}%`;
    button.style.top = `${100 * px(y) / HEIGHT}%`;
    button.setAttribute('aria-label', DEVICES[id][0] + (device.broken ? ' đã vỡ' : ''));
    if (id === 'ember') button.setAttribute('aria-pressed', String(device.enabled));
    if (device.type === 'mirror') button.dataset.axis = device.axis;
    button.dataset.selected = String(id === selected);
  }
}

function synchronizeWalk() {
  const active = document.activeElement;
  const focusedWalk = active?.classList.contains('walk-control');
  const options = state.energy >= COSTS.walk ? walkOptions(state) : [];
  const keys = new Set(options.map(({x,y}) => `${x},${y}`));
  for (const [key, button] of WALK_BUTTONS) {
    if (!keys.has(key)) { button.remove(); WALK_BUTTONS.delete(key); }
  }
  const layout = state.level.traversal;
  for (const {x,y,label,arrow,crate} of options) {
    const key = `${x},${y}`;
    let button = WALK_BUTTONS.get(key);
    if (!button) {
      button = document.createElement('button');
      button.className = 'tile-control walk-control';
      button.type = 'button';
      button.dataset.walk = key;
      button.style.left = `${100 * px(x) / WIDTH}%`;
      button.style.top = `${100 * px(y) / HEIGHT}%`;
      button.style.width = `${100 * (CELL - 5) / WIDTH}%`;
      button.style.height = `${100 * (CELL - 5) / HEIGHT}%`;
      button.addEventListener('click', () => commit({type:'walk', x, y}));
      WALK_BUTTONS.set(key, button);
      $('walk-hotspots').append(button);
    }
    const bell = layout.bell?.x === x && layout.bell?.y === y && !state.traversal.bellUsed;
    const relay = layout.relays?.find(item => item.x === x && item.y === y);
    const relic = layout.relic?.x === x && layout.relic?.y === y && !state.opened && !state.traversal.carryingRelic;
    const exit = layout.exit?.x === x && layout.exit?.y === y;
    const bridge = layout.bridges?.some(item => item.x === x && item.y === y);
    const plate = layout.plates?.some(item => item.x === x && item.y === y);
    button.textContent = arrow;
    button.dataset.push = String(Boolean(crate));
    button.setAttribute('aria-label', crate ? `Đẩy khối đá ${label}` :
      bell ? 'Đi tới chuông' : relic ? 'Nhặt Lõi Mặt Trời' : exit ? 'Bước lên bệ trả lõi' :
      bridge ? 'Bước lên cầu sáng' : relay ? relay.bridgeLabel ?? 'Đi tới cần gạt' : plate ? 'Bước lên mâm đá' : `Đi ${label}`);
  }
  $('walk-guide').hidden = !state.traversal;
  const guide = $('walk-guide');
  if (!layout?.exit) guide.textContent = 'Chạm ô có mũi tên để đi hoặc đẩy khối đá.';
  else if (state.opened) guide.textContent = '✓ Đã đưa Lõi Mặt Trời về bệ.';
  else if (!state.traversal.carryingRelic) guide.textContent = 'Chạm ô có mũi tên. Qua cầu trên để lấy lõi ở bờ đông.';
  else if (!state.traversal.returnRelay) guide.textContent = 'Cầu trên quá tải. Mang lõi tới một trong hai cần gạt ở bờ đông.';
  else guide.textContent = 'Đưa lõi qua cầu đang sáng, về bệ ở góc dưới bên trái.';
  if (focusedWalk && !active.isConnected) {
    (WALK_BUTTONS.values().next().value ?? $('wait')).focus({preventScroll:true});
  }
}

function synchronizeHUD() {
  synchronizeButtons();
  synchronizeWalk();
  synchronizeLevels();
  const receivers = state.level.objects.filter(object => object.type === 'receiver');
  const charged = state.charged.length;
  const mission = state.level.traversal?.exit;
  $('goal').textContent = mission
    ? (state.opened ? 'Đã trả Lõi Mặt Trời' : state.traversal.carryingRelic ? 'Mang lõi về bệ đá' : 'Qua vực và lấy Lõi Mặt Trời')
    : (state.opened ? 'Đã mở cổng' : `Đánh thức pha lê (${charged}/${receivers.length})`);
  $('relic-status').hidden = !mission;
  if (mission) $('relic-stock').textContent = state.opened ? 'Đã trả' : state.traversal.carryingRelic ? 'Đang mang' : 'Chưa lấy';
  $('shape').hidden = !state.level.pattern && !mission;
  $('shape').textContent = mission ? 'Nhặt Ấn Vực Sáng ở cầu dưới' : 'Tạo Đường Sáng Cổ';
  $('secret-goal').hidden = !state.level.secret;
  $('wolf-goal').hidden = !state.wolf;
  $('max-energy').textContent = state.level.energy;
  $('meter').max = state.level.energy;
  $('energy').textContent = state.energy;
  $('meter').value = state.energy;
  $('turn').textContent = state.turn;
  $('goal').dataset.done = String(state.opened);
  $('shape').dataset.done = String(state.pattern);
  $('secret-goal').dataset.done = String(state.collectedSecret);
  $('wolf-goal').dataset.done = String(state.wolf?.hp === 0);
  $('board').dataset.open = String(state.opened);
  $('board').dataset.route = state.route ?? '';
  $('stock').textContent = state.repairStock;
  $('flower').textContent = Number(state.collectedSecret);
  $('reward-label').textContent = mission ? 'Ấn Vực Sáng' : 'Ấn Đường Sáng';
  $('reward').textContent = Number(state.pattern);
  $('undo').disabled = history.length === 0;
  $('scan').hidden = !state.level.secret;
  $('scan').disabled = state.secret || state.energy < COSTS.scan;

  const intent = wolfIntent(state);
  $('intent').hidden = !state.wolf;
  $('intent').dataset.danger = String(intent?.type === 'break');
  $('intent').textContent = intent?.type === 'break'
    ? '⚠ Sói sắp phá gương Đông ở lượt kế!'
    : intent?.type === 'distracted' ? `Sói dừng vì tiếng chuông · còn ${state.traversal.bellTurns} lượt.`
    : intent ? `Sói Bóng Đêm · ${state.wolf.hp}/2 máu. Đang tuần tra.` : '✓ Sói Bóng Đêm đã bị hạ.';

  const mirror = mirrorById(state, selected);
  const [name, description] = DEVICES[selected];
  const receiver = receivers.find(object => object.id === selected);
  const color = receiver?.color === 'red' ? 'đỏ' : 'vàng';
  const info = mirror?.locked ? 'Gương cố định · đổi đường tia bằng cửa chắn sáng.' : receiver ? `Cần tia ${color} · ${state.charged.includes(selected) ? 'đã sáng' : 'chưa đủ sáng'}.` : description;
  $('selected').textContent = name;
  $('device-info').textContent = mirror?.broken
    ? 'Đã vỡ · dùng mảnh vàng để sửa.'
    : mirror ? `${(mirror.axis * 22.5).toLocaleString('vi-VN')}° · ${info}` : info;
  $('mirror-actions').hidden = !mirror || mirror.locked;
  $('left').disabled = $('right').disabled = !mirror || mirror.broken || state.energy < COSTS.rotate;
  $('flip').hidden = mirror?.sided !== 'single';
  $('flip').disabled = $('right').disabled;
  $('repair').hidden = !mirror?.broken;
  $('repair').disabled = state.repairStock === 0 || state.energy < COSTS.repair;
}

function render(events = []) {
  synchronizeHUD();
  game.loop.wake();
  game.scene.getScene('garden').paint(events);
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => game.loop.sleep(), events.length && !reducedMotion.matches ? 750 : 100);
}

function commit(action) {
  hideClue();
  const result = applyGardenAction(state, action);
  if (result.error) {
    say(result.error === 'energy' ? 'Thiếu năng lượng. Chờ một lượt để hồi lại 2 điểm.' : 'Bạn chưa thể thực hiện hành động này.');
    synchronizeHUD();
    return;
  }
  history.push(state);
  state = result.state;
  if (state.opened && !progress.cleared[progress.active]) {
    progress.cleared[progress.active] = true;
    progress.unlocked = Math.max(progress.unlocked, Math.min(progress.active + 1, AWAKENING.length - 1));
    saveProgress();
  }
  const messages = result.events.map(event => event.type === 'bridge' ? `${event.label} đã sáng. Có thể quay về bờ tây.` :
    EVENT_TEXT[event.type]).filter(Boolean);
  if (messages.length) say(messages.join(' '));
  else if (action.type === 'source') say(state.level.sources.find(source => source.id === action.id).enabled ? 'Đã bật nguồn đỏ.' : 'Đã tắt nguồn đỏ.');
  else if (action.type === 'walk') say('Chạm một ô sáng để đi tiếp.');
  else if (action.type === 'wait') say('Đã qua lượt và hồi năng lượng.');
  else if (action.type === 'rotate' || action.type === 'flip') say('Đã đổi hướng gương. Quan sát tia sau phản xạ.');
  render(result.events);
}

function activateDevice(id) {
  selected = id;
  if (id === 'shard' || id === 'secret') {
    selected = defaultDevice(state.level);
    commit({type:'collect', id});
    BUTTONS.get('north').focus({preventScroll:true});
  } else if (id === 'ember') commit({type:'source', id});
  else {
    const mirror = mirrorById(state, id);
    if (mirror && !mirror.broken && !mirror.locked) commit({type:'rotate', id});
    else {
      synchronizeHUD();
      const text = mirror?.broken ? 'Chọn Sửa nếu túi có mảnh vàng.' : $('device-info').textContent;
      showClue(id, DEVICES[id][0], text);
    }
  }
}

function wireControls() {
  $('left').onclick = () => commit({type:'rotate', id:selected, delta:-1});
  $('right').onclick = () => commit({type:'rotate', id:selected});
  $('flip').onclick = () => commit({type:'flip', id:selected});
  $('repair').onclick = () => commit({type:'repair', id:selected});
  $('scan').onclick = () => commit({type:'scan'});
  $('wait').onclick = () => commit({type:'wait'});
  $('undo').onclick = () => {
    if (!history.length) return;
    hideClue();
    state = history.pop();
    selected = defaultDevice(state.level);
    say('Đã trở về lượt trước.');
    render();
  };
  $('reset').onclick = () => loadRoom(progress.active);
  $('hint').onclick = () => {
    showClue(defaultDevice(state.level), 'Gợi ý', state.level.hint);
    say(state.level.hint);
    const clueRect = $('board-clue').getBoundingClientRect();
    if (clueRect.bottom < 0 || clueRect.top > innerHeight) $('board').scrollIntoView({block:'start'});
  };
  $('board').addEventListener('pointerdown', event => {
    if (!event.target.closest('.tile-control')) hideClue();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') hideClue();
  });
  $('level-select').onchange = event => loadRoom(Number(event.target.value));
  $('next-level').onclick = () => {
    loadRoom(progress.active + 1);
    $('level-select').focus({preventScroll:true});
  };
  $('character').onclick = () => {
    explorer = explorer === 'lumi' ? 'sol' : 'lumi';
    $('explorer').src = `${ASSET}${explorer}.webp`;
    $('speaker').textContent = explorer === 'lumi' ? 'Lumi' : 'Sol';
    if (state.traversal) render();
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimeout(idleTimer); game.loop.sleep(); }
    else render();
  });
}

function start() {
  class GardenScene extends Phaser.Scene {
    constructor() { super('garden'); }
    preload() {
      this.load.atlas('garden', ASSET + 'garden-atlas.webp', ASSET + 'garden-atlas.json');
      this.load.image('hero-lumi', ASSET + 'lumi.webp');
      this.load.image('hero-sol', ASSET + 'sol.webp');
    }
    create() {
      if (!this.textures.exists('garden')) {
        $('loading').textContent = 'Không tải được tài nguyên. Hãy tải lại trang.';
        return;
      }
      this.floor = this.add.container();
      this.drawFloor();
      this.crossings = this.add.container().setDepth(1);
      this.rays = this.add.graphics().setDepth(2);
      this.actors = this.add.container().setDepth(3);
      this.effects = this.add.container().setDepth(4);
      this.paint();
      for (const [index, room] of AWAKENING.entries()) {
        $('level-select').add(new Option(`${index + 1}. ${room.title}`, index));
      }
      $('level-select').disabled = false;
      synchronizeHUD();
      say(state.level.intro);
      wireControls();
      $('loading').hidden = true;
      $('board').setAttribute('aria-busy', 'false');
      idleTimer = setTimeout(() => game.loop.sleep(), 150);
    }
    sprite(frame, x, y, size, layer = this.actors) {
      const object = this.add.image(x, y, 'garden', frame);
      object.setScale(size / Math.max(object.width, object.height));
      layer?.add(object);
      return object;
    }
    drawFloor() {
      this.floor.removeAll(true);
      const trim = this.add.graphics();
      this.floor.add(trim);
      trim.fillStyle(0x070d19, .88).fillRoundedRect(1, 2, WIDTH - 2, HEIGHT - 3, 22);
      trim.lineStyle(2, 0xc6a474, .9).strokeRoundedRect(2, 3, WIDTH - 4, HEIGHT - 5, 21);
      for (let y = 0; y < state.level.height; y++) {
        for (let x = 0; x < state.level.width; x++) {
          const variant = (x * 11 + y * 7 + progress.active) % 3;
          const medallion = (x === 1 && y === 2 + progress.active % 2) || (x === 3 && y === 4) || (x === 0 && y === 3);
          this.sprite(`tile-${variant + (medallion ? 3 : 0)}`, px(x), px(y), CELL - 3, this.floor);
        }
      }
      for (let x = 0; x < 14; x++) {
        this.floor.add(this.add.image(BORDER + (x + .5) * CELL / 2, 21, 'garden', `tile-${6 + x % 3}`).setDisplaySize(CELL / 2 + 1, 39));
        this.floor.add(this.add.image(BORDER + (x + .5) * CELL / 2, HEIGHT - 21, 'garden', `tile-${6 + (x + 1) % 3}`)
          .setDisplaySize(CELL / 2 + 1, 39).setFlipY(true));
      }
      for (let y = 0; y < 12; y++) {
        this.floor.add(this.add.image(21, BORDER + (y + .5) * CELL / 2, 'garden', `tile-${6 + (y + 1) % 3}`).setDisplaySize(39, CELL / 2 + 1));
        this.floor.add(this.add.image(WIDTH - 21, BORDER + (y + .5) * CELL / 2, 'garden', `tile-${6 + y % 3}`)
          .setDisplaySize(39, CELL / 2 + 1).setFlipX(true));
      }
      for (const [x,y] of [[21,21], [WIDTH-21,21], [21,HEIGHT-21], [WIDTH-21,HEIGHT-21]]) {
        this.sprite('tile-8', x, y, 40, this.floor);
      }
      const wash = THEME_WASH[state.level.theme];
      if (wash) this.floor.add(this.add.graphics().fillStyle(wash, .13).fillRoundedRect(3, 3, WIDTH - 6, HEIGHT - 6, 18));
      for (const [x, y, size, angle] of [[71,32,102,16],[WIDTH-62,43,105,51],[80,HEIGHT-25,111,-11],
        [WIDTH-89,HEIGHT-24,115,-13],[WIDTH-24,367,92,81],[21,338,105,-83]]) {
        this.sprite('vine', x, y, size, this.floor).setAngle(angle);
      }
    }
    drawChasm() {
      const layout = state.level.traversal;
      if (layout?.chasm === undefined) return;
      const water = this.add.graphics();
      const x = px(layout.chasm);
      water.fillStyle(0x081125, .98).fillRect(x - CELL/2, BORDER, CELL, HEIGHT - 2 * BORDER);
      for (let y = BORDER + 10; y < HEIGHT - BORDER; y += 26) {
        const shift = (y % 10) * 2;
        water.lineStyle(2,0x547bbf,.21).lineBetween(x-33+shift,y,x+34,y+5);
      }
      for (const edge of [-1,1]) water.lineStyle(5,0xa098c1,.72)
        .lineBetween(x + edge*(CELL/2-2),BORDER,x + edge*(CELL/2-2),HEIGHT-BORDER);
      for (const bridge of layout.bridges) {
        const y = px(bridge.y);
        const active = bridgeWalkable(state, bridge);
        const color = bridge.fragile ? 0xf8bb63 : 0x78dbef;
        water.lineStyle(active ? 5 : 2,color,active ? .95 : .32).strokeRoundedRect(x-54,y-26,108,52,8);
        if (!active) continue;
        water.fillStyle(color,.24).fillRoundedRect(x-53,y-25,106,50,8);
        for (let dx = -44; dx < 50; dx += 14) water.lineStyle(4,color,.68).lineBetween(x+dx,y-20,x+dx,y+20);
        if (bridge.seal && !state.pattern) this.sprite('shard', x, y, 38, this.crossings);
      }
      this.crossings.add(water);
    }
    drawTraversal(events) {
      const layout = state.level.traversal;
      if (!layout) return;
      const travel = state.traversal;
      const marker = this.add.graphics();
      this.actors.add(marker);
      const emblem = (point, glyph, active) => {
        const x = px(point.x);
        const y = px(point.y);
        const color = active ? 0x8bffcf : 0xffdc90;
        marker.lineStyle(3,color,.85).strokeRoundedRect(x-32,y-26,64,52,9);
        this.actors.add(this.add.text(x,y,glyph,{font:'bold 26px Georgia',color:active?'#9cffd8':'#fff0b2'}).setOrigin(.5));
      };
      for (const plate of layout.plates ?? []) emblem(plate, '◇', platePressed(state, plate));
      for (const relay of layout.relays ?? []) {
        emblem(relay, relay.axis === 1 ? '↘' : relay.axis === 2 ? '↓' : '⚙',
          relay.mirror ? travel.returnRelay === relay.id : travel.relays.includes(relay.id));
      }
      if (layout.exit) {
        this.sprite('portal', px(layout.exit.x), px(layout.exit.y), 79).setAlpha(state.opened ? 1 : .75);
        if (!travel.carryingRelic && !state.opened) this.sprite('shard', px(layout.relic.x), px(layout.relic.y), 92);
      }
      if (layout.bell) {
        this.sprite('shard', px(layout.bell.x), px(layout.bell.y), 61).setAlpha(travel.bellUsed ? .55 : 1);
        emblem(layout.bell, '♫', travel.bellTurns > 0);
      }
      for (const crate of travel.crates) {
        const x = px(crate.x);
        const y = px(crate.y);
        const block = this.sprite('wall', x, y, 84);
        const push = events.find(event => event.type === 'push' && event.id === crate.id);
        if (push && !reducedMotion.matches) {
          block.setPosition(px(push.from[0]),px(push.from[1]));
          this.tweens.add({targets:block,x,y,duration:170,ease:'Sine.easeOut'});
        }
      }
      const x = px(travel.player.x);
      const y = px(travel.player.y);
      const hero = this.add.image(x, y + 32, `hero-${explorer}`).setOrigin(.5,1);
      hero.setScale(92 / hero.height);
      this.actors.add(hero);
      const cargo = travel.carryingRelic && !state.opened ? this.sprite('shard', x + 18, y - 24, 32) : null;
      const walk = events.find(event => event.type === 'walk');
      if (walk && !reducedMotion.matches) {
        hero.setPosition(px(walk.from[0]),px(walk.from[1]) + 32);
        this.tweens.add({targets:hero,x,y:y+32,duration:170,ease:'Sine.easeOut'});
        if (cargo) {
          cargo.setPosition(px(walk.from[0]) + 18,px(walk.from[1]) - 24);
          this.tweens.add({targets:cargo,x:x+18,y:y-24,duration:170,ease:'Sine.easeOut'});
        }
      }
    }
    paint(events = []) {
      this.tweens.killAll();
      this.actors.removeAll(true);
      this.effects.removeAll(true);
      this.rays.clear();
      this.crossings.removeAll(true);
      this.drawChasm();
      for (const beam of state.optics.beams) {
        const [glow, edge, core] = COLORS[beam.color];
        const [x1, y1] = beam.from.map(px);
        const [x2, y2] = beam.to.map(px);
        const brightness = Phaser.Math.Clamp(Math.sqrt(beam.endPower / 1.4), .22, 1);
        for (const [width, color, alpha] of [[30, glow, .11], [19, glow, .21], [10, edge, .62], [5, edge, .96], [2.5, core, 1]]) {
          this.rays.lineStyle(width, color, alpha * brightness).lineBetween(x1, y1, x2, y2);
        }
      }
      for (const contact of state.optics.contacts) {
        const [x, y] = contact.at.map(px);
        this.rays.fillStyle(COLORS[contact.color][0], .26).fillCircle(x, y, 14);
        this.rays.fillStyle(COLORS[contact.color][2], .85).fillCircle(x, y, 3.8);
      }
      for (const source of state.level.sources) {
        this.sprite(source.id, px(source.x), px(source.y), 108).setAlpha(source.enabled === false ? .54 : 1);
      }
      for (const object of state.level.objects) {
        const x = px(object.x);
        const y = px(object.y);
        if (object.shutter) {
          const open = shutterOpen(state, object);
          const gate = this.add.graphics();
          this.actors.add(gate);
          gate.lineStyle(4,open ? 0x87eec3 : 0xddaa69,.86).strokeRoundedRect(x-36,y-29,72,58,7);
          if (!open) {
            gate.fillStyle(0x221c32,.85).fillRoundedRect(x-34,y-27,68,54,7);
            for (const offset of [-23,-8,8,23]) gate.lineStyle(5,0xd9a76a,.95).lineBetween(x+offset,y-23,x+offset,y+23);
          }
        } else if (object.type === 'mirror') {
          this.sprite('tile-4', x, y, 83).setAlpha(.86);
          const frame = object.sided === 'single' ? 'mirror-single' : 'mirror-face';
          this.sprite(frame, x, y, 101).setAngle(object.axis * 22.5 + (object.flipped ? 180 : 0)).setAlpha(object.broken ? .35 : 1);
          if (object.broken) this.actors.add(this.add.text(x, y, '×', {font:'bold 46px Georgia',color:'#ffd2bd'}).setOrigin(.5));
        } else {
          const sprite = this.sprite(SPRITES[object.type], x, y, object.type === 'receiver' ? 109 : object.type === 'wall' ? 106 : 92);
          if (object.type === 'wall') sprite.setTint(0xa1a6bd).setAlpha(.90);
          if (object.type === 'receiver') {
            const lit = state.charged.includes(object.id);
            const ring = this.add.graphics();
            const color = COLORS[object.color][1];
            ring.lineStyle(lit ? 4 : 2, color, lit ? .84 : .52).strokeEllipse(x, y + 32, 56, 19);
            this.actors.add(ring);
            sprite.setAlpha(lit ? 1 : .67);
          }
          if (object.type === 'filter' && object.color === 'red') sprite.setTint(0xff8b90);
        }
      }
      this.drawTraversal(events);
      if (state.loot === 'loose') this.sprite('shard', px(state.lootPosition.x), px(state.lootPosition.y), 84);
      if (state.secret && !state.collectedSecret) {
        const secret = state.level.secret;
        this.sprite('flower', px(secret.x), px(secret.y), 83);
      }
      if (state.wolf?.hp) {
        const x = px(state.wolf.x);
        const y = px(state.wolf.y);
        const wolf = this.sprite('wolf', x, y, 108);
        const health = this.add.graphics();
        this.actors.add(health);
        for (let i = 0; i < 2; i++) health.fillStyle(i < state.wolf.hp ? 0xffa6d0 : 0x372141).fillCircle(-8 + 16 * i, -42, 5);
        health.setPosition(x, y);
        const movement = events.find(event => event.type === 'move');
        if (movement && !reducedMotion.matches) {
          for (const item of [wolf, health]) item.setPosition(px(movement.from[0]), px(movement.from[1]));
          this.tweens.add({targets:[wolf,health], x, y, duration:180, ease:'Sine.easeOut'});
        }
      }
      if (state.opened && !state.level.traversal?.exit) this.sprite('portal', WIDTH - 25, 25, 48);
      if (!reducedMotion.matches) for (const event of events) this.animate(event);
    }
    animate(event) {
      if (event.x === undefined) return;
      const x = px(event.x);
      const y = px(event.y);
      const glows = {relic:0xffdc87, bridge:0x82edff, return:0xffe8a1, 'rift-seal':0xffe8a1, bell:0x98f9d9, relay:0x98f9d9, rock:0xffab74, defeat:0xea97ff, wound:0xfb5464, break:0xfaa986, scan:0x8cffdc, gate:0xffed9b, repair:0x87f1ff, pattern:0xffed9b};
      const color = glows[event.type];
      if (!color) return;
      const sparks = this.add.graphics();
      for (let i = 0; i < 10; i++) {
        const angle = i * Math.PI / 5;
        const radius = 32 + i % 3 * 9;
        sparks.fillStyle(color, .85).fillCircle(Math.cos(angle) * radius, Math.sin(angle) * radius, 2 + i % 3);
      }
      sparks.lineStyle(4, color, .78).strokeCircle(0, 0, 34).setPosition(x, y);
      this.effects.add(sparks);
      this.tweens.add({targets:sparks, scale: event.type === 'scan' ? 4 : 2, alpha:0, duration:520,
        onComplete:() => { if (sparks.active) sparks.destroy(); }});
    }
  }
  return new Phaser.Game({
    type: Phaser.CANVAS, loader:{imageLoadType:'HTMLImageElement'}, parent:'game', width:WIDTH, height:HEIGHT, transparent:true,
    input:{mouse:false,touch:false,keyboard:false,gamepad:false},
    audio:{noAudio:true}, fps:{target:30, limit:30, forceSetTimeOut:true},
    render:{antialias:true}, scene:GardenScene
  });
}

const game = Phaser ? start() : null;
if (!game) $('loading').textContent = 'Không tải được game. Kiểm tra kết nối rồi tải lại.';
