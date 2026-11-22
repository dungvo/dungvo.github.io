const localMonth = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit' });

export function trackUsage(db, { limit = 50000, warning = 40000, exchange = 26000, inputRate = 0.4, outputRate = 1.6 } = {}) {
  if (![limit, warning, exchange, inputRate, outputRate].every(value => Number.isFinite(value) && value > 0)
    || warning > limit || limit > 1e8 || exchange > 1e6 || inputRate > 1000 || outputRate > 1000) {
    throw new Error('Cấu hình hạn mức AI không hợp lệ.');
  }
  const limitMilli = Math.floor(limit * 1000);
  db.exec(`CREATE TABLE IF NOT EXISTS ai_usage (
    month TEXT NOT NULL, kind TEXT NOT NULL, milli INTEGER NOT NULL, calls INTEGER NOT NULL,
    PRIMARY KEY (month, kind)
  )`);
  const select = db.prepare('SELECT kind, milli, calls FROM ai_usage WHERE month=?');
  const increment = db.prepare(`INSERT INTO ai_usage VALUES (?,?,?,1)
    ON CONFLICT(month, kind) DO UPDATE SET milli=milli+excluded.milli, calls=calls+1`);
  const refund = db.prepare('UPDATE ai_usage SET milli=milli-? WHERE month=? AND kind=?');
  const estimated = sum => Math.ceil(sum / 1000);
  const sumMilli = rows => rows.reduce((sum, row) => sum + row.milli, 0);
  function status() {
    const month = localMonth.format(new Date());
    const rows = select.all(month);
    const used = estimated(sumMilli(rows));
    return { month, limit, warning, used, textCalls: rows.find(row => row.kind === 'text')?.calls ?? 0,
      audioCalls: rows.find(row => row.kind === 'audio')?.calls ?? 0, atWarning: used >= warning };
  }
  function reserve(kind, milli) {
    const month = localMonth.format(new Date());
    db.exec('BEGIN IMMEDIATE');
    try {
      if (sumMilli(select.all(month)) + milli > limitMilli) {
        db.exec('COMMIT');
        return null;
      }
      increment.run(month, kind, milli);
      db.exec('COMMIT');
      let settled = false;
      return actual => {
        if (settled) return;
        settled = true;
        if (Number.isSafeInteger(actual) && actual >= 0 && actual !== milli) refund.run(milli - actual, month, kind);
      };
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }
  return { status, reserve,
    audioCost: ms => Math.ceil(ms * exchange * 0.0045 / 60),
    textCost: (inputTokens, outputTokens) => Math.ceil((inputTokens * inputRate + outputTokens * outputRate) * exchange / 1000),
  };
}
