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

function readItems(original, names) {
  const words = original.map(fold);
  const items = [];
  let next = 0;
  while (next < words.length) {
    while (fillers.has(words[next])) next++;
    if (next >= words.length) break;
    let [qty, size] = quantity(words, next);
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
    const note = [];
    if (words[next] === 'ghi' && words[next + 1] === 'chu') next += 2;
    else if (!/^(khong|it|nhieu|them|bo|de|rieng|nong|lanh)$/.test(words[next] ?? '')
      || search(names, words, next + 1).size || (words[next] === 'them' && quantity(words, next + 1)[1])) {
      items.push({ id: match.ids[0], qty: qty ?? 1, note: '' });
      continue;
    }
    while (next < words.length) {
      const [number, length] = quantity(words, next);
      const afterNumber = next + length + Number(units.has(words[next + length]));
      if (number && search(names, words, afterNumber).size) break;
      if (search(names, words, next).size) {
        return { error: 'Chưa rõ đây là ghi chú hay món mới. Hãy nói số lượng trước món mới.' };
      }
      note.push(original[next++]);
    }
    items.push({ id: match.ids[0], qty: qty ?? 1, note: note.join(' ') });
  }
  return items.length ? { items } : { error: 'Chưa nghe thấy món.' };
}

const newDraft = (intent, table, values = {}) => ({
  intent, table: table ?? null, items: [], replacement: null, explicit: false, question: '', ...values,
});
const clarify = (table, question) => newDraft('clarify', table, { question });

export function parse(text, state, selectedTable) {
  if (typeof text !== 'string' || !text.trim() || text.length > 500) return clarify(selectedTable, 'Nhập một câu gọi món tối đa 500 ký tự.');
  const original = tokens(text);
  const words = original.map(fold);
  let table = selectedTable ?? null;
  const mentions = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i] === 'ban' && quantity(words, i + 1)[1]) mentions.push(i);
  }
  if (mentions.length > 1) return clarify(table, 'Mỗi câu chỉ nên gọi cho một bàn. Vui lòng chọn bàn cụ thể.');
  if (mentions.length) {
    const at = mentions[0];
    const [id, length] = quantity(words, at + 1);
    table = id;
    original.splice(at, length + 1);
    words.splice(at, length + 1);
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
    const pivot = remaining.findIndex(word => fold(word) === 'thanh');
    if (pivot < 1 || pivot >= remaining.length - 1) return clarify(table, 'Nói theo mẫu “đổi một tái thành nạm”.');
    const from = readItems(remaining.slice(0, pivot), names);
    const to = readItems(remaining.slice(pivot + 1), replacementNames);
    if (from.items?.length !== 1 || to.items?.length !== 1 || (to.items[0].qty !== 1 && to.items[0].qty !== from.items[0].qty)) {
      return clarify(table, 'Chỉ đổi một loại món mỗi lượt và giữ nguyên số lượng.');
    }
    return newDraft(intent, table, { items: from.items, replacement: to.items[0].id });
  }
  const corrected = remaining.map(fold);
  const correction = corrected.findIndex((word, index) => (word === 'a' && corrected[index + 1] === 'khong') || (word === 'y' && corrected[index + 1] === 'la') || (word === 'sua' && corrected[index + 1] === 'lai'));
  let result = readItems(correction < 0 ? remaining : remaining.slice(0, correction), names);
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
