import {propagate, segmentTouches} from './tactical-optics.js';
import {createTraversal, opticsBoard, returnMissionComplete, walk, walkOptions} from './room-traversal.js';

export const GARDEN = {
  width: 7, height: 6, energy: 20, transmissionPerCell: .985,
  sources: [
    {id: 'sun', x: 0, y: 1, dir: 0, color: 'gold', power: 1.75},
    {id: 'ember', x: 0, y: 5, dir: 0, color: 'red', power: 1.1, enabled: false}
  ],
  objects: [
    {id: 'north', type: 'mirror', x: 2, y: 1, axis: 1, sided: 'single', efficiency: .94},
    {id: 'south', type: 'mirror', x: 2, y: 4, axis: 1, sided: 'double', efficiency: .94},
    {id: 'guard', type: 'mirror', x: 6, y: 5, axis: 2, sided: 'double', efficiency: .94},
    {id: 'prism', type: 'splitter', x: 6, y: 1, ratio: .52, efficiency: .92},
    {id: 'moon-lens', type: 'amplifier', x: 6, y: 2, gain: 1.9, supply: .75, cap: 1.7},
    {id: 'sun-filter', type: 'filter', x: 4, y: 4, color: 'gold', efficiency: .91},
    {id: 'ember-filter', type: 'filter', x: 1, y: 5, color: 'red', efficiency: .93},
    {id: 'ember-lens', type: 'amplifier', x: 2, y: 5, gain: 2, supply: .9, cap: 1.9},
    {id: 'crystal', type: 'receiver', x: 6, y: 4, color: 'gold', requirement: 1.15},
    {id: 'ruin-a', type: 'wall', x: 3, y: 0},
    {id: 'ruin-b', type: 'wall', x: 5, y: 2},
    {id: 'ruin-c', type: 'wall', x: 4, y: 3},
    {id: 'sealed-rock', type: 'rock', x: 4, y: 5, hardness: 1.55}
  ],
  wolf: {x: 5, y: 4, hp: 2, step: 0, patrol: [[5, 4], [5, 5], [6, 5], [6, 4]]},
  secret: {x: 3, y: 3, radius: 2},
  lantern: [3, 4],
  pattern: [[0, 1], [1, 1], [2, 1], [2, 2], [2, 3], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4]]
};

export const COSTS = {rotate: 1, flip: 1, source: 1, scan: 2, repair: 3, collect: 0, walk: 1, wait: 0};
export const mirrorById = (state, id) => state.level.objects.find(o => o.id === id && o.type === 'mirror');

export function createGarden(definition = GARDEN) {
  const level = structuredClone(definition);
  const state = {
    level, traversal:createTraversal(level.traversal), energy: level.energy, turn: 0, wolf: structuredClone(level.wolf),
    repairStock: 0, loot: 'sealed', lootPosition: null, secret: false, collectedSecret: false, charged: [],
    pattern: false, opened: false, route: null
  };
  state.optics = propagate(opticsBoard(state));
  return state;
}

export function wolfIntent(state) {
  const wolf = state.wolf;
  if (!wolf?.hp) return null;
  if (state.traversal?.bellTurns) return {type:'distracted'};
  const mirror = mirrorById(state, 'guard');
  if (wolf.step === 1 && mirror && !mirror.broken) return {type: 'break', id: mirror.id, x: mirror.x, y: mirror.y};
  const [x, y] = wolf.patrol[(wolf.step + 1) % wolf.patrol.length];
  return {type: 'move', x, y};
}

export function applyGardenAction(state, action) {
  const cost = COSTS[action.type];
  const mirror = mirrorById(state, action.id);
  const step = action.type === 'walk' && walkOptions(state).find(option => option.x === action.x && option.y === action.y);
  const source = state.level.sources.find(item => item.id === action.id);
  if (cost === undefined || (action.type === 'rotate' && (!mirror || mirror.broken || mirror.locked)) ||
      (action.type === 'flip' && (!mirror || mirror.broken || mirror.locked || mirror.sided !== 'single')) ||
      (action.type === 'walk' && !step) ||
      (action.type === 'source' && source?.id !== 'ember') ||
      (action.type === 'repair' && (!mirror?.broken || !state.repairStock)) ||
      (action.type === 'scan' && (!state.level.secret || state.secret)) ||
      (action.type === 'collect' && !((action.id === 'shard' && state.loot === 'loose') ||
        (action.id === 'secret' && state.secret && !state.collectedSecret)))) return {state, error: 'invalid'};
  if (state.energy < cost) return {state, error: 'energy'};

  const next = structuredClone(state);
  const events = [];
  const nextMirror = mirrorById(next, action.id);
  next.turn++;
  next.energy -= cost;
  switch (action.type) {
    case 'walk': events.push(...walk(next, step)); break;
    case 'rotate': {
      const raw = nextMirror.axis + (action.delta === -1 ? -1 : 1);
      nextMirror.axis = (raw + 8) % 8;
      if (raw < 0 || raw >= 8) nextMirror.flipped = !nextMirror.flipped;
      break;
    }
    case 'flip': nextMirror.flipped = !nextMirror.flipped; break;
    case 'source': {
      const emitter = next.level.sources.find(item => item.id === action.id);
      emitter.enabled = !emitter.enabled;
      break;
    }
    case 'scan': {
      const [x, y] = next.level.lantern;
      const secret = next.level.secret;
      next.secret = Math.hypot(secret.x - x, secret.y - y) <= secret.radius;
      events.push({type: 'scan', x, y});
      break;
    }
    case 'repair':
      nextMirror.broken = false;
      next.repairStock--;
      events.push({type: 'repair', x: nextMirror.x, y: nextMirror.y});
      break;
    case 'collect':
      if (action.id === 'shard') {
        next.loot = 'collected';
        next.repairStock++;
      } else next.collectedSecret = true;
      events.push({type: action.id});
      break;
    case 'wait': next.energy = Math.min(next.level.energy, next.energy + 2); break;
  }

  const beforeDamage = propagate(opticsBoard(next));
  const brokenRock = beforeDamage.hits.find(hit => hit.kind === 'rock' && hit.broken);
  if (brokenRock) {
    next.level.objects = next.level.objects.filter(o => o.id !== brokenRock.id);
    next.loot = 'loose';
    next.lootPosition = {x:brokenRock.x, y:brokenRock.y};
    events.push({type: 'rock', x: brokenRock.x, y: brokenRock.y});
  }
  const wolf = next.wolf;
  if (wolf?.hp && beforeDamage.beams.some(beam => beam.color === 'red' &&
      segmentTouches(beam, wolf.x, wolf.y, .33) &&
      beam.power * next.level.transmissionPerCell ** Math.hypot(wolf.x - beam.from[0], wolf.y - beam.from[1]) >= .8)) {
    wolf.hp--;
    events.push({type: wolf.hp ? 'wound' : 'defeat', x: wolf.x, y: wolf.y});
  }

  const intent = wolfIntent(next);
  if (intent?.type === 'break') {
    mirrorById(next, intent.id).broken = true;
    events.push({...intent});
  }
  if (intent && intent.type !== 'distracted') {
    events.push({type:'move', from:[wolf.x, wolf.y]});
    wolf.step = (wolf.step + 1) % wolf.patrol.length;
    [wolf.x, wolf.y] = wolf.patrol[wolf.step];
  }

  if (next.traversal?.bellTurns) next.traversal.bellTurns--;

  next.optics = propagate(opticsBoard(next));
  if (next.level.traversal?.exit) {
    if (!next.opened && returnMissionComplete(next)) {
      next.opened = true;
      next.route = next.traversal.returnRelay;
      next.traversal.carryingRelic = false;
      events.push({type:'return', ...next.level.traversal.exit});
    }
    return {state:next, events};
  }
  const receivers = next.level.objects.filter(o => o.type === 'receiver');
  next.charged = receivers.filter(o => next.optics.hits.some(hit =>
    hit.id === o.id && hit.color === o.color && hit.power >= o.requirement)).map(o => o.id);
  if (receivers.length && receivers.every(receiver => next.charged.includes(receiver.id))) {
    const crystal = receivers.at(-1);
    const gold = next.optics.beams.filter(beam => beam.color === 'gold');
    const points = next.level.pattern;
    const matches = points?.length > 1 && points.slice(1).every(([x, y], i) => gold.some(beam =>
      beam.source === 'sun' && segmentTouches(beam, ...points[i]) && segmentTouches(beam, x, y)));
    if (!next.opened) events.push({type: 'gate', x: crystal.x, y: crystal.y});
    next.opened = true;
    const layout = next.level.traversal;
    if (layout?.plates) next.route ??= next.traversal.relays.length ? 'relay' : 'counterweight';
    else if (layout?.bell) next.route ??= next.traversal.bellUsed && wolf.hp ? 'bell' : 'repair';
    else next.route ??= matches ? 'mirrors' : next.level.pattern ? 'prism' : 'gate';
    if (matches && !next.pattern) {
      next.pattern = true;
      events.push({type: 'pattern', x: crystal.x, y: crystal.y});
    }
  }
  return {state: next, events};
}
