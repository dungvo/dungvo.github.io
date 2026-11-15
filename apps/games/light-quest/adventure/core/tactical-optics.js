// Directions increase clockwise in screen coordinates. Mirror axes advance by 22.5°.
export const DIRS = Object.freeze([[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]);
const EPS = 1e-7;
const norm = (n) => ((n % 8) + 8) % 8;
const cross = ([x, y], [u, v]) => x * v - y * u;
const dot = ([x, y], [u, v]) => x * u + y * v;
const unit = (direction) => {
  const [x, y] = DIRS[norm(direction)];
  const length = Math.hypot(x, y);
  return [x / length, y / length];
};

export function reflect(direction, axis) {
  return norm(axis - direction);
}

export function mirrorNormal(axis, flipped = false) {
  const angle = axis * Math.PI / 8;
  const side = flipped ? -1 : 1;
  return [-Math.sin(angle) * side, Math.cos(angle) * side];
}

export function frontHit(direction, normal) {
  return dot(unit(direction), Array.isArray(normal) ? normal : unit(normal)) < -EPS;
}

function intersect(object, [x, y], direction) {
  const offset = [object.x - x, object.y - y];
  if (object.type === 'mirror') {
    const angle = object.axis * Math.PI / 8;
    const tangent = [Math.cos(angle), Math.sin(angle)];
    const divisor = cross(direction, tangent);
    if (Math.abs(divisor) < EPS) return Infinity;
    const distance = cross(offset, tangent) / divisor;
    const mirrorOffset = cross(offset, direction) / divisor;
    return Math.abs(mirrorOffset) <= (object.halfLength ?? 0.44) ? distance : Infinity;
  }
  const along = dot(offset, direction);
  const sideways = Math.abs(cross(direction, offset));
  if (object.type === 'wall' || object.type === 'rock') {
    const radius = object.radius ?? 0.39;
    return sideways < radius ? along - Math.sqrt(radius ** 2 - sideways ** 2) : Infinity;
  }
  // Lenses, splitters and receivers are idealized point optics at their pivots.
  return sideways < EPS ? along : Infinity;
}

function boundary([x, y], [dx, dy], {width, height}) {
  const tx = dx > EPS ? (width - .5 - x) / dx : dx < -EPS ? (-.5 - x) / dx : Infinity;
  const ty = dy > EPS ? (height - .5 - y) / dy : dy < -EPS ? (-.5 - y) / dy : Infinity;
  return Math.min(tx, ty);
}

export function segmentTouches({from, to}, x, y, radius = EPS) {
  const span = [to[0] - from[0], to[1] - from[1]];
  const offset = [x - from[0], y - from[1]];
  const lengthSquared = dot(span, span);
  const projection = lengthSquared > EPS ? Math.max(0, Math.min(1, dot(offset, span) / lengthSquared)) : 0;
  return Math.hypot(offset[0] - projection * span[0], offset[1] - projection * span[1]) <= radius;
}

export function propagate(level, {maxSteps = 4096, threshold = .001} = {}) {
  const falloff = level.transmissionPerCell ?? 1;
  if (falloff <= 0 || falloff > 1) throw new RangeError('Transmission must be in (0, 1]');
  const objects = level.objects ?? [];
  for (const object of objects) {
    if (object.efficiency !== undefined && !(object.efficiency >= 0 && object.efficiency <= 1)) {
      throw new RangeError('Passive optical efficiency must be in [0, 1]');
    }
  }
  const queue = (level.sources ?? []).filter(source => source.enabled !== false).map((source, i) => ({
    at: [source.x, source.y], dir: norm(source.dir), power: source.power ?? 1,
    color: source.color ?? 'gold', source: source.id ?? i, visited: new Set()
  }));
  const beams = [];
  const hits = [];
  const contacts = [];
  let steps = 0;
  let limitReached = false;
  for (const ray of queue) {
    while (ray.power >= threshold) {
      if (steps >= maxSteps) { limitReached = true; break; }
      steps++;
      const direction = unit(ray.dir);
      const edge = boundary(ray.at, direction, level);
      let distance = Math.min(edge, falloff === 1 ? Infinity : Math.log(threshold / ray.power) / Math.log(falloff));
      let target;
      for (const object of objects) {
        const candidate = intersect(object, ray.at, direction);
        if (candidate > EPS && candidate <= distance && (!target || candidate < distance - EPS)) {
          distance = candidate;
          target = object;
        }
      }
      if (distance <= EPS) break;
      const to = ray.at.map((value, i) => value + direction[i] * distance);
      const endPower = ray.power * falloff ** distance;
      beams.push({from: ray.at, to, color: ray.color, power: ray.power, endPower, source: ray.source});
      if (!target) break;
      const visit = [objects.indexOf(target), ray.dir, ...to.map(n => Math.round(n * 1e6)), Math.round(endPower * 1e6)].join(':');
      if (ray.visited.has(visit)) break;
      ray.visited.add(visit);
      ray.at = to;
      ray.power = endPower;
      const hit = {id: target.id, x: target.x, y: target.y, at: to, color: ray.color, power: endPower, source: ray.source};

      if (target.type === 'wall') break;
      if (target.type === 'receiver') {
        hits.push({...hit, kind: 'receiver'});
        if (target.absorb !== false) break;
      }
      if (target.type === 'rock') {
        hits.push({...hit, kind: 'rock', broken: ray.color === 'red' && endPower >= (target.hardness ?? 1)});
        break;
      }
      if (target.type === 'mirror') {
        const facing = target.normal ?? mirrorNormal(target.axis, target.flipped);
        const reflected = !target.broken && (target.sided !== 'single' || frontHit(ray.dir, facing));
        contacts.push({...hit, kind: reflected ? 'reflection' : 'absorbed'});
        if (!reflected) break;
        ray.dir = reflect(ray.dir, target.axis);
        ray.power *= target.efficiency ?? 1;
      }
      if (target.type === 'filter') {
        if (target.color !== ray.color) { contacts.push({...hit, kind: 'absorbed'}); break; }
        ray.power *= target.efficiency ?? 1;
      }
      if (target.type === 'amplifier') {
        ray.power += Math.max(0, Math.min(target.supply ?? 0, (target.cap ?? Infinity) - ray.power, ray.power * ((target.gain ?? 1) - 1)));
      }
      if (target.type === 'splitter') {
        const ratio = target.ratio ?? .5;
        if (ratio < 0 || ratio > 1) throw new RangeError('Split ratio must be 0..1');
        const output = ray.power * (target.efficiency ?? 1);
        queue.push({...ray, dir: norm(ray.dir + (target.turn ?? 2)), power: output * ratio, visited: new Set(ray.visited)});
        ray.power = output * (1 - ratio);
      }
    }
    if (limitReached) break;
  }
  return {beams, hits, contacts, steps, limitReached};
}
