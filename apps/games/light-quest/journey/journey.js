function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function record(key) {
  try { return JSON.parse(read(key)); } catch { return null; }
}

const valley = record('light-quest.world.v1');
const garden = record('light-quest.secret-garden.progress.v9') ??
  record('light-quest.secret-garden.progress.v8');
const classic = record('light-quest.v1');
const legacyGarden = read('light-quest.secret-garden.v1') === 'complete';

function count(best, ids) {
  return ids.filter(id => Object.hasOwn(best ?? {}, id)).length;
}

function progress(id, done, total) {
  document.getElementById(id).textContent = done + ' / ' + total + ' màn đã giải';
}

const valleyDone = count(valley?.best, Array.from({ length: 18 }, (_, i) => i + 1));
const gardenDone = (legacyGarden ? 3 : count(garden?.best, [1, 2, 3])) + count(garden?.best, [4]);
progress('world-progress', valleyDone, 18);
progress('garden-progress', gardenDone, 4);
progress('classic-progress', count(classic?.stars, Array.from({ length: 30 }, (_, i) => i + 1)), 30);
for (const [id, stages] of [['stars', [5, 6]], ['forest', [7, 8]]]) {
  if (gardenDone === 4) progress(id + '-progress', count(garden?.best, stages), stages.length);
}
if (count(garden?.best, [9])) document.getElementById('dawn-progress').textContent = 'Khu vườn đã thức giấc';

const resume = document.getElementById('resume');
if (gardenDone || garden?.exploring || valleyDone === 18) {
  resume.href = '../world/garden/';
  resume.textContent = gardenDone ? 'Tiếp tục ở Khu vườn →' : 'Bước vào Khu vườn →';
} else if (valleyDone || valley?.level > 1) {
  resume.textContent = 'Tiếp tục ở Thung lũng →';
}
