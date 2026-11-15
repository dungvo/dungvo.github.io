import {propagate, segmentTouches} from './tactical-optics.js';

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

export const COSTS = {rotate: 1, flip: 1, source: 1, scan: 2, repair: 3, collect: 0, wait: 0};
export const mirrorById = (state, id) => state.level.objects.find(o => o.id === id && o.type === 'mirror');

export function createGarden() {
  const level = structuredClone(GARDEN);
  return {
    level, energy: level.energy, turn: 0, wolf: structuredClone(level.wolf),
    repairStock: 0, loot: 'sealed', secret: false, collectedSecret: false,
    pattern: false, opened: false, route: null, optics: propagate(level)
  };
}

export function wolfIntent(state) {
  const wolf = state.wolf;
  if (!wolf.hp) return null;
  const mirror = mirrorById(state, 'guard');
  if (wolf.step === 1 && mirror && !mirror.broken) return {type: 'break', id: mirror.id, x: mirror.x, y: mirror.y};
  const [x, y] = wolf.patrol[(wolf.step + 1) % wolf.patrol.length];
  return {type: 'move', x, y};
}

export function applyGardenAction(state, action) {
  const cost = COSTS[action.type];
  const mirror = mirrorById(state, action.id);
  const source = state.level.sources.find(item => item.id === action.id);
  if (cost === undefined || (action.type === 'rotate' && (!mirror || mirror.broken)) ||
      (action.type === 'flip' && (!mirror || mirror.broken || mirror.sided !== 'single')) ||
      (action.type === 'source' && source?.id !== 'ember') ||
      (action.type === 'repair' && (!mirror?.broken || !state.repairStock)) ||
      (action.type === 'scan' && state.secret) ||
      (action.type === 'collect' && !((action.id === 'shard' && state.loot === 'loose') ||
        (action.id === 'secret' && state.secret && !state.collectedSecret)))) return {state, error: 'invalid'};
  if (state.energy < cost) return {state, error: 'energy'};

  const next = structuredClone(state);
  const events = [];
  const nextMirror = mirrorById(next, action.id);
  next.turn++;
  next.energy -= cost;
  switch (action.type) {
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

  const beforeDamage = propagate(next.level);
  const brokenRock = beforeDamage.hits.find(hit => hit.kind === 'rock' && hit.broken);
  if (brokenRock) {
    next.level.objects = next.level.objects.filter(o => o.id !== brokenRock.id);
    next.loot = 'loose';
    events.push({type: 'rock', x: brokenRock.x, y: brokenRock.y});
  }
  const wolf = next.wolf;
  if (wolf.hp && beforeDamage.beams.some(beam => beam.color === 'red' &&
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
  if (intent) {
    events.push({type:'move', from:[wolf.x, wolf.y]});
    wolf.step = (wolf.step + 1) % wolf.patrol.length;
    [wolf.x, wolf.y] = wolf.patrol[wolf.step];
  }

  next.optics = propagate(next.level);
  const crystal = next.level.objects.find(o => o.id === 'crystal');
  if (next.optics.hits.some(hit => hit.id === crystal.id && hit.color === crystal.color && hit.power >= crystal.requirement)) {
    const gold = next.optics.beams.filter(beam => beam.color === 'gold');
    const points = next.level.pattern;
    const matches = points.slice(1).every(([x, y], i) => gold.some(beam =>
      beam.source === 'sun' && segmentTouches(beam, ...points[i]) && segmentTouches(beam, x, y)));
    if (!next.opened) events.push({type: 'gate', x: crystal.x, y: crystal.y});
    next.opened = true;
    next.route ??= matches ? 'mirrors' : 'prism';
    if (matches && !next.pattern) {
      next.pattern = true;
      events.push({type: 'pattern', x: crystal.x, y: crystal.y});
    }
  }
  return {state: next, events};
}
