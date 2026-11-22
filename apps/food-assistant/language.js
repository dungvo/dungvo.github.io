import { fold } from './menu.js';

const numberWords = ['khong', 'mot', 'hai', 'ba', 'bon', 'nam', 'sau', 'bay', 'tam', 'chin'];
const regionalDigits = new Map([['tu', 4], ['lam', 5], ['muoi', 10]]);
const digit = token => regionalDigits.get(token) ?? numberWords.indexOf(token);
const units = new Set(['to', 'ly', 'coc', 'phan', 'dia', 'chai', 'chen', 'suat', 'bat', 'cai']);
const fillers = new Set(['va', 'voi', 'cho', 'giup', 'em', 'minh', 'toi', 'nhe', 'nha', 'a', 'oi', 'lay', 'mot chut']);
const tokens = value => value.match(/[\p{L}\p{M}\d]+/gu) ?? [];

function quantity(words, at = 0) {
  const first = words[at];
  if (/^\d+$/.test(first ?? '')) return [Number(first), 1];
  const rank = digit(first);
  if (rank < 0) return [null, 0];
  if (rank === 10 || (rank >= 2 && words[at + 1] === 'muoi')) {
    const length = rank === 10 ? 1 : 2;
    const last = digit(words[at + length]);
    return last > 0 && last < 10 ? [(rank === 10 ? 10 : rank * 10) + last, length + 1] : [rank === 10 ? 10 : rank * 10, length];
  }
  return [rank, 1];
}

function catalog(menu, includeInactive) {
  return menu.filter(item => item.active || includeInactive).flatMap(item =>
    [item.name, ...item.aliases].map((alias, index) => ({ id: item.id, words: fold(alias).split(' '), exact: index === 0 })));
}

function search(names, words, at) {
  const matches = names.filter(entry => entry.words.every((word, index) => word === words[at + index]));
  const size = Math.max(0, ...matches.map(entry => entry.words.length));
  const longest = matches.filter(entry => entry.words.length === size);
  const candidates = longest.some(entry => entry.exact) ? longest.filter(entry => entry.exact) : longest;
  return { size, ids: [...new Set(candidates.map(entry => entry.id))] };
}

const noteStart = word => /^(khong|it|nhieu|them|bo|de|rieng|nong|lanh|ghi)$/.test(word ?? '');

function orderPatch(names, words, at) {
  const [lastQty, lastLength] = quantity(words, at);
  if (lastLength && words[at - 1] === 'a' && words[at + lastLength] === 'thoi') {
    return { kind: 'last-quantity', qty: lastQty, end: at + lastLength + 1 };
  }
  const match = search(names, words, at);
  const [qty, length] = quantity(words, at + match.size);
  if (match.size && length && words[at + match.size + length] === 'thoi') {
    return { kind: 'quantity', match, qty, end: at + match.size + length + 1 };
  }
  if (units.has(words[at])) {
    const target = search(names, words, at + 1);
    const end = at + 1 + target.size;
    if (target.size && noteStart(words[end])) return { kind: 'note', match: target, end };
  }
  const [count, countLength] = quantity(words, at);
  if (count === 1 && units.has(words[at + countLength]) && noteStart(words[at + countLength + 1])) {
    return { kind: 'portion', end: at + countLength + 1 };
  }
  return null;
}

function phoBreakdown(names, words, at, count) {
  if (!count || words[at] !== 'pho' || words[at + 1] !== 'bo' || !quantity(words, at + 2)[1]) return null;
  const items = [];
  let next = at + 2;
  while (next < words.length) {
    const [qty, length] = quantity(words, next);
    if (!length) break;
    const variant = words[next + length];
    const item = search(names, words, next + length);
    const belongs = item.size === 1 && item.ids.length === 1
      && names.some(name => name.id === item.ids[0] && ['pho bo ' + variant, 'pho ' + variant].includes(name.words.join(' ')));
    if (!belongs) break;
    if (qty < 1 || qty > 99) return { error: 'Kiểm tra số lượng từng loại phở.' };
    items.push({ id: item.ids[0], qty, note: '' });
    next += length + 1;
    if (words[next] === 'va' && quantity(words, next + 1)[1]) next++;
  }
  if (!items.length && search(names, words, at).size) return null;
  if (items.reduce((sum, item) => sum + item.qty, 0) !== count) return { error: 'Số tô phở bò chưa khớp với từng loại. Anh/chị gọi bao nhiêu tô mỗi loại?' };
  return { items, next };
}

function readNote(original, words, names, start, allowPatches) {
  let end = start + Number(words[start] === 'ghi' && words[start + 1] === 'chu') * 2;
  const note = [];
  while (end < words.length) {
    const [number, length] = quantity(words, end);
    const afterNumber = end + length + Number(units.has(words[end + length]));
    if (number && search(names, words, afterNumber).size) break;
    if (allowPatches && (orderPatch(names, words, end) || words[end] === 'a'
      || ['va', 'them'].includes(words[end]) && (quantity(words, end + 1)[1] || search(names, words, end + 1).size))) break;
    if (search(names, words, end).size) return null;
    note.push(original[end++]);
  }
  return { note: note.join(' '), end };
}

function readItems(original, names, allowPatches = false) {
  const words = original.map(fold);
  const items = [];
  let next = 0;
  while (next < words.length) {
    while (fillers.has(words[next]) || allowPatches && (words[next] === 'them'
      || words[next] === 'thoi' && orderPatch(names, words, next + 1))) next++;
    if (next >= words.length) break;
    const patch = allowPatches ? orderPatch(names, words, next) : null;
    if (patch) {
      const targets = !patch.match ? items.slice(-1) : items.filter(item => patch.match.ids.length === 1 && item.id === patch.match.ids[0]);
      if (targets.length !== 1) return { error: 'Chưa rõ dòng món cần sửa. Hãy nói rõ tên món hoặc chọn trong đơn.' };
      const [target] = targets;
      next = patch.end;
      if (patch.kind === 'quantity' || patch.kind === 'last-quantity') {
        if (patch.qty < 1 || patch.qty > 99) return { error: 'Số lượng mỗi món phải từ 1 đến 99.' };
        target.qty = patch.qty;
        continue;
      }
      const note = readNote(original, words, names, next, true);
      if (!note?.note || patch.kind === 'note' && target.qty !== 1) return { error: 'Ghi chú này áp dụng cho tô nào? Hãy nói rõ số tô hoặc chọn món để sửa.' };
      if (patch.kind === 'portion' && target.qty > 1) {
        target.qty--;
        items.push({ id: target.id, qty: 1, note: note.note });
      } else target.note = note.note;
      next = note.end;
      continue;
    }
    let [qty, size] = quantity(words, next);
    const group = allowPatches ? phoBreakdown(names, words, next + size + Number(size && units.has(words[next + size])), qty) : null;
    if (group) {
      if (group.error) return group;
      items.push(...group.items);
      next = group.next;
      continue;
    }
    const exactHere = search(names, words, next);
    if (exactHere.size && size && !search(names, words, next + size + Number(units.has(words[next + size]))).size) {
      qty = null;
      size = 0;
    }
    next += size;
    if (size && units.has(words[next])) next++;
    const match = search(names, words, next);
    if (match.ids.length !== 1) return { error: match.ids.length > 1 ? 'Tên gọi tắt ứng với nhiều món. Hãy nói tên đầy đủ hoặc chạm món.' : 'Có từ hoặc món chưa nhận diện. Kiểm tra lại câu gọi món.' };
    if (qty !== null && (qty < 1 || qty > 99)) return { error: 'Số lượng mỗi món phải từ 1 đến 99.' };
    next += match.size;
    if (!noteStart(words[next]) || search(names, words, next + 1).size
      || words[next] === 'them' && quantity(words, next + 1)[1]
      || allowPatches && orderPatch(names, words, next)) {
      items.push({ id: match.ids[0], qty: qty ?? 1, note: '' });
      continue;
    }
    const note = readNote(original, words, names, next, allowPatches);
    if (!note) return { error: 'Chưa rõ đây là ghi chú hay món mới. Hãy nói số lượng trước món mới.' };
    items.push({ id: match.ids[0], qty: qty ?? 1, note: note.note });
    next = note.end;
  }
  return items.length ? { items } : { error: 'Chưa nghe thấy món.' };
}

const newDraft = (intent, table, values = {}) => ({
  intent, table: table ?? null, items: [], replacement: null, explicit: false, question: '', ...values,
});
const clarify = (table, question) => newDraft('clarify', table, { question });

export function mentionedTables(text) {
  const words = tokens(text).map(fold);
  return words.flatMap((word, index) => {
    if (word !== 'ban') return [];
    const [table, size] = quantity(words, index + 1);
    return size ? [{ table, index, size }] : [];
  });
}

export function protectsTable(draft, text, selectedTable) {
  const mentions = mentionedTables(text);
  if (draft.intent === 'clarify') return true;
  if (draft.intent === 'queue') return mentions.length === 0;
  return mentions.length === 1 ? draft.table === mentions[0].table : mentions.length === 0 && draft.table === selectedTable;
}

export function parse(text, state, selectedTable) {
  if (typeof text !== 'string' || !text.trim() || text.length > 500) return clarify(selectedTable, 'Nhập một câu gọi món tối đa 500 ký tự.');
  const original = tokens(text);
  const words = original.map(fold);
  let table = selectedTable ?? null;
  const mentions = mentionedTables(text);
  if (mentions.length > 1) return clarify(table, 'Mỗi câu chỉ nên gọi cho một bàn. Vui lòng chọn bàn cụ thể.');
  if (mentions.length) {
    const { table: id, index, size } = mentions[0];
    table = id;
    original.splice(index, size + 1);
    words.splice(index, size + 1);
  }
  const sentence = words.join(' ');
  if (/^(bep )?(con bao nhieu( to| mon)?( chua ra)?|mon nao (can )?nau truoc|bep con mon gi)( vay| a)?$/.test(sentence) && (!mentions.length || sentence.startsWith('bep '))) {
    return newDraft('queue', null);
  }
  if (!Number.isInteger(table) || table < 1 || table > state.tableCount) return clarify(null, 'Chọn một bàn đã được cấu hình.');
  if (/^(tinh tien|thanh toan|lay hoa don|in hoa don)( giup| nhe| a)?$/.test(sentence)) return newDraft('bill', table);
  if (/^(con mon gi( chua ra)?|con (bao nhieu|may)( mon| to)?( chua ra)?|mon nao chua ra)( vay| a| nhe)?$/.test(sentence)) return newDraft('pending', table);
  if (!sentence) return newDraft('select', table);
  const intent = /^(huy|bo)( mon)? /.test(sentence) ? 'cancel' : /^doi /.test(sentence) ? 'replace' : 'add';
  if (intent === 'add' && /\b(?:huy|doi)\b/.test(sentence)) return clarify(table, 'Hãy đọc một thao tác mỗi lượt. Có thể dùng “à không” để sửa câu gọi.');
  const explicit = intent === 'add' && /^(them|goi them|lay them|cho them) /.test(sentence);
  const prefix = intent === 'cancel' ? /^(huy|bo)( mon)? / : intent === 'replace' ? /^doi / : /^(?:(?:goi|lay|cho) them|them|goi mon) /;
  const stripped = sentence.replace(prefix, '');
  const remaining = original.slice(words.length - stripped.split(' ').length);
  const includeInactive = intent !== 'add';
  const names = catalog(state.menu, includeInactive);
  const replacementNames = catalog(state.menu, false);
  if (intent === 'replace') {
    const pivot = remaining.findIndex(word => ['thanh', 'sang'].includes(fold(word)));
    if (pivot < 1 || pivot >= remaining.length - 1) {
      const choices = /\bpho bo\b/.test(stripped) ? [...new Set((state.active[table]?.lines ?? [])
        .filter(line => line.status === 'waiting' && line.qty > 0 && fold(line.name).startsWith('pho '))
        .map(line => line.name))] : [];
      const question = choices.length > 1
        ? 'Đổi ' + choices.slice(0, 3).join(' hay ') + ', và đổi sang món nào?'
        : 'Anh/chị muốn đổi món nào và đổi sang món gì?';
      return clarify(table, question);
    }
    const from = readItems(remaining.slice(0, pivot), names);
    const to = readItems(remaining.slice(pivot + 1), replacementNames);
    if (from.items?.length !== 1 || to.items?.length !== 1 || (to.items[0].qty !== 1 && to.items[0].qty !== from.items[0].qty)) {
      return clarify(table, 'Chỉ đổi một loại món mỗi lượt và giữ nguyên số lượng.');
    }
    return newDraft(intent, table, { items: from.items, replacement: to.items[0].id });
  }
  const corrected = remaining.map(fold);
  const correction = corrected.findIndex((word, index) => (word === 'a' && corrected[index + 1] === 'khong') || (word === 'y' && corrected[index + 1] === 'la') || (word === 'sua' && corrected[index + 1] === 'lai'));
  let result = readItems(correction < 0 ? remaining : remaining.slice(0, correction), names, intent === 'add');
  if (correction >= 0) {
    const fragment = remaining.slice(correction + 2);
    let replacement = readItems(fragment, names);
    if (!replacement.items && result.items?.length && quantity(fragment.map(fold), 0)[1] === fragment.length) {
      replacement = { items: [{ ...result.items.at(-1), qty: quantity(fragment.map(fold))[0] }] };
    }
    if (result.items?.length && replacement.items?.length === 1 && replacement.items[0].qty >= 1 && replacement.items[0].qty <= 99) {
      result = { items: [...result.items.slice(0, -1), ...replacement.items] };
    } else {
      return clarify(table, 'Chưa rõ món nào cần sửa. Hãy đọc lại lượt gọi hoàn chỉnh.');
    }
  }
  if (!result.items || (intent === 'cancel' && result.items.length !== 1)) {
    return clarify(table, result.error ?? 'Chỉ hủy một loại món mỗi lượt.');
  }
  return newDraft(intent, table, { items: result.items, explicit });
}

const schemaObject = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
export const draftSchema = schemaObject({
  intent: { type: 'string', enum: ['add', 'cancel', 'replace', 'bill', 'pending', 'queue', 'select', 'clarify'] },
  table: { type: ['integer', 'null'] },
  items: { type: 'array', items: schemaObject({ id: { type: 'string' }, qty: { type: 'integer' }, note: { type: 'string' } }) },
  replacement: { type: ['string', 'null'] },
  explicit: { type: 'boolean' },
  question: { type: 'string' },
});

export function validDraft(draft, state) {
  if (!draft || Object.keys(draft).length !== 6 || !draftSchema.required.every(field => Object.hasOwn(draft, field))
    || !draftSchema.properties.intent.enum.includes(draft.intent) || typeof draft.explicit !== 'boolean'
    || typeof draft.question !== 'string' || draft.question.length > 300 || !Array.isArray(draft.items) || draft.items.length > 24) return false;
  const { intent, table, items, replacement, question } = draft;
  const dishExists = (id, active) => typeof id === 'string' && state.menu.some(item => item.id === id && (!active || item.active));
  if (table !== null && (!Number.isSafeInteger(table) || table < 1 || table > state.tableCount)) return false;
  if (table === null && !['queue', 'clarify'].includes(intent)) return false;
  if (intent === 'clarify' && !question.trim()) return false;
  if (intent !== 'clarify' && question) return false;
  if (intent !== 'add' && draft.explicit) return false;
  if ((intent === 'add' && !items.length) || (['cancel', 'replace'].includes(intent) && items.length !== 1)
    || (!['add', 'cancel', 'replace'].includes(intent) && items.length)) return false;
  if (intent === 'replace' ? (!dishExists(replacement, true) || items[0].id === replacement) : replacement !== null) return false;
  return items.every(item => item && Object.keys(item).length === 3 && ['id', 'qty', 'note'].every(field => Object.hasOwn(item, field))
    && dishExists(item.id, intent === 'add') && Number.isInteger(item.qty) && item.qty >= 1 && item.qty <= 99
    && typeof item.note === 'string' && item.note.length <= 180);
}
