const STEPS = [
  {dx:0, dy:-1, label:'lên', arrow:'↑'},
  {dx:1, dy:0, label:'phải', arrow:'→'},
  {dx:0, dy:1, label:'xuống', arrow:'↓'},
  {dx:-1, dy:0, label:'trái', arrow:'←'}
];
const at = (a, b) => a.x === b.x && a.y === b.y;
const offset = (point, dx, dy) => ({x:point.x + dx, y:point.y + dy});

export function createTraversal(layout) {
  if (!layout) return null;
  return {player:{...layout.start}, crates:structuredClone(layout.crates ?? []), relays:[], bellTurns:0, bellUsed:false};
}

export function walkOptions(state) {
  const traversal = state.traversal;
  if (!traversal) return [];
  const {level} = state;
  const occupied = [...level.sources, ...level.objects];
  const blocked = point => point.x < 0 || point.y < 0 || point.x >= level.width ||
    point.y >= level.height || occupied.some(device => at(point, device));
  return STEPS.flatMap(({dx, dy, label, arrow}) => {
    const point = offset(traversal.player, dx, dy);
    if (blocked(point)) return [];
    const crate = traversal.crates.find(item => at(item, point));
    const destination = offset(point, dx, dy);
    if (crate && (blocked(destination) || traversal.crates.some(item => at(destination, item)))) return [];
    return [{...point, dx, dy, label, arrow, crate:crate?.id}];
  });
}

export function walk(state, step) {
  const traversal = state.traversal;
  const from = traversal.player;
  const to = {x:step.x, y:step.y};
  traversal.player = to;
  const events = [{type:'walk', from:[from.x, from.y], ...to}];
  if (step.crate) {
    const crate = traversal.crates.find(item => item.id === step.crate);
    Object.assign(crate, offset(to, step.dx, step.dy));
    events.push({type:'push', id:crate.id, ...crate, from:[to.x, to.y]});
  }
  const layout = state.level.traversal;
  const relay = layout.relays?.find(item => at(item, to));
  if (relay && !traversal.relays.includes(relay.id)) {
    traversal.relays.push(relay.id);
    events.push({type:'relay', x:relay.x, y:relay.y});
  }
  if (layout.bell && at(layout.bell, to) && !traversal.bellUsed) {
    traversal.bellUsed = true;
    traversal.bellTurns = layout.bell.duration;
    events.push({type:'bell', ...to});
  }
  return events;
}

export function platePressed(state, plate) {
  return at(state.traversal.player, plate) || state.traversal.crates.some(crate => at(crate, plate));
}

export function shutterOpen(state, shutter) {
  const {plates = [], relays = []} = state.level.traversal;
  return plates.some(plate => plate.shutter === shutter.id && platePressed(state, plate)) ||
    relays.some(relay => relay.shutter === shutter.id && state.traversal.relays.includes(relay.id));
}

export function opticsBoard(state) {
  if (!state.traversal) return state.level;
  const objects = state.level.objects.filter(item => !item.shutter || !shutterOpen(state, item));
  objects.push(...state.traversal.crates.map(crate => ({...crate, type:'wall', radius:.36})));
  return {...state.level, objects};
}
