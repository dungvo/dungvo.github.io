export const routes = ['stars', 'roots', 'old'];
export const titles = { hub: 'Cầu Thác', stars: 'Đài Sao', roots: 'Suối Rễ', old: 'Lối Cũ' };
export const gear = { an: 'Soi dấu', kha: 'Gương dã chiến' };
export const targets = {
  hub: ['stars', 'roots', 'old'],
  stars: ['moon', 'star', 'empty'],
  roots: ['seed', 'stream', 'empty'],
  old: ['tower', 'root', 'empty']
};

export function initial(hero) {
  return { hero, scene: 'hub', direction: 0, clue: false, revealed: false, portable: false,
    charged: [], rings: [0, 0], completed: [], position: 'bank' };
}

export function outputs(state) {
  if (state.scene === 'hub' && state.portable) return ['stars'];
  const target = targets[state.scene][state.direction];
  return target === 'empty' ? [] : [target];
}

export function apply(state, action) {
  const { scene, hero } = state;
  const capture = action.startsWith('capture:');
  switch (capture ? 'capture' : action) {
    case 'align-moon':
    case 'align-star': {
      if (scene !== 'stars') return null;
      const index = action === 'align-moon' ? 0 : 1;
      const rings = [...state.rings];
      rings[index] = (rings[index] + 1) % 3;
      const charged = ['moon', 'star'].filter((_, i) => rings[i] === i + 1);
      return { ...state, rings, charged, completed: charged.length === 2 && !state.completed.includes(scene)
        ? [...state.completed, scene] : state.completed };
    }
    case 'rotate':
      if (scene === 'stars') return null;
      if (scene === 'hub' && state.position === 'bank') return null;
      return { ...state, direction: (state.direction + 1) % 3, portable: false };
    case 'clue':
      return scene === 'hub' && !state.clue ? { ...state, clue: true } : null;
    case 'skill':
      if (scene !== 'hub' || state.position !== 'island') return null;
      if (hero === 'an') return state.clue && !state.revealed ? { ...state, revealed: true } : null;
      return { ...state, portable: !state.portable };
    case 'cross':
      return scene === 'hub' && state.position === 'bank' && state.direction === 0
        ? { ...state, position: 'island' } : null;
    case 'inspect':
      return scene === 'hub' && state.clue && !state.revealed ? { ...state, revealed: true } : null;

    case 'capture': {
      if (scene === 'hub' || scene === 'stars') return null;
      const target = outputs(state)[0];
      if (!target || action.slice(8) !== target || state.charged.includes(target)) return null;
      // Roots and the old path require the relay to be awakened before the outlet.
      if (state.charged.length === 0 && target !== targets[scene][0]) return null;
      const charged = [...state.charged, target];
      const completed = charged.length === 2 && !state.completed.includes(scene)
        ? [...state.completed, scene] : state.completed;
      return { ...state, charged, completed };
    }
    case 'back':
      return scene !== 'hub' ? { ...state, scene: 'hub', direction: 0, charged: [], portable: false } : null;
    default:
      if (scene !== 'hub' || state.position !== 'island' || !routes.includes(action) || !outputs(state).includes(action) ||
          action === 'old' && !state.revealed) return null;
      return { ...state, scene: action, direction: 2, charged: [], rings: [0, 0], portable: false };
  }
}
