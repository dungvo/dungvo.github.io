import { gzipSync, gunzipSync } from 'node:zlib';
import { createState, mutate, OrderError } from '../domain.js';
import { usageMonth, usagePolicy } from './usage.mjs';

const itemLimit = 370 * 1024;
const decodedLimit = 4 * 1024 * 1024;
const clash = error => error.name === 'ConditionalCheckFailedException';
const key = id => ({ pk: { S: id } });
const number = value => ({ N: String(value) });
const stateKey = key('shop');

export function dynamoBackend(send, TableName, options) {
  const policy = usagePolicy(options);
  async function get(Key) {
    return (await send('GetItem', { TableName, Key, ConsistentRead: true })).Item;
  }
  async function itemState() {
    const item = await get(stateKey);
    return item ? JSON.parse(gunzipSync(item.payload.B, { maxOutputLength: decodedLimit }).toString('utf8')) : createState();
  }
  async function commit(action) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const state = await itemState();
      const next = mutate(state, action);
      if (next === state) return state;
      const json = Buffer.from(JSON.stringify(next));
      const payload = gzipSync(json);
      if (payload.length > itemLimit || json.length > decodedLimit) {
        throw new OrderError('STORAGE_LIMIT', 'Dữ liệu đã đạt giới hạn của bản AWS thử nghiệm. Vui lòng xuất sao lưu và mở rộng lưu trữ.');
      }
      try {
        await send('PutItem', { TableName, Item: { ...stateKey, rev: number(next.rev), payload: { B: payload } },
          ConditionExpression: state.rev === 0 ? 'attribute_not_exists(pk)' : 'rev = :previous',
          ...(state.rev === 0 ? {} : { ExpressionAttributeValues: { ':previous': number(state.rev) } }),
        });
        return next;
      } catch (error) {
        if (!clash(error)) throw error;
      }
    }
    throw new OrderError('CONFLICT', 'Bàn đang cập nhật trên nhiều thiết bị. Kiểm tra rồi gửi lại.');
  }
  async function status() {
    const month = usageMonth();
    const item = await get(key('ai-' + month));
    const used = Math.ceil(Number(item?.milli?.N ?? 0) / 1000);
    return { month, limit: policy.limit, warning: policy.warning, used, atWarning: used >= policy.warning,
      audioCalls: Number(item?.audioCalls?.N ?? 0), textCalls: Number(item?.textCalls?.N ?? 0) };
  }
  async function reserve(kind, milli) {
    if (milli > policy.limitMilli) return null;
    const Key = key('ai-' + usageMonth());
    const count = kind === 'audio' ? 'audioCalls' : 'textCalls';
    try {
      await send('UpdateItem', { TableName, Key, UpdateExpression: 'ADD milli :charge, #calls :one',
        ConditionExpression: 'attribute_not_exists(milli) OR milli <= :room',
        ExpressionAttributeNames: { '#calls': count },
        ExpressionAttributeValues: { ':charge': number(milli), ':one': number(1), ':room': number(policy.limitMilli - milli) },
      });
    } catch (error) {
      if (clash(error)) return null;
      throw error;
    }
    let settled = false;
    return async actual => {
      if (settled) return;
      settled = true;
      if (!Number.isSafeInteger(actual) || actual < 0 || actual === milli) return;
      await send('UpdateItem', { TableName, Key, UpdateExpression: 'ADD milli :adjust',
        ExpressionAttributeValues: { ':adjust': number(actual - milli) } });
    };
  }
  return { read: itemState, commit, usage: { ...policy, status, reserve } };
}
