import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { boundedAudio } from '../server/audio.mjs';

const available = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;

function encodedTone(seconds) {
  const result = spawnSync('ffmpeg', ['-nostdin', '-loglevel', 'error', '-f', 'lavfi', '-i',
    'sine=frequency=300:duration=' + seconds, '-c:a', 'libopus', '-f', 'webm', 'pipe:1']);
  assert.equal(result.status, 0, result.stderr.toString());
  return new Blob([result.stdout], { type: 'audio/webm' });
}

test('Máy chủ đo thời lượng đã giải mã, đổi WebM thành WAV', { skip: !available }, async () => {
  const decoded = await boundedAudio(encodedTone(1.25), AbortSignal.timeout(5000));
  assert.equal(decoded.milliseconds, 1250);
  assert.equal(decoded.audio.type, 'audio/wav');
  const wav = Buffer.from(await decoded.audio.arrayBuffer());
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
  assert.equal(wav.readUInt32LE(40), 40000);
});

test('Đo thời lượng thực để từ chối âm thanh dài hơn giới hạn', { skip: !available }, async () => {
  await assert.rejects(boundedAudio(encodedTone(17), AbortSignal.timeout(5000)), /dài quá/);
});

test('Giải mã MP4 có chỉ mục ở cuối tệp', { skip: !available }, async () => {
  const { mkdtempSync, readFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const folder = mkdtempSync(join(tmpdir(), 'food-audio-test-'));
  try {
    const path = join(folder, 'sample.mp4');
    const result = spawnSync('ffmpeg', ['-nostdin', '-loglevel', 'error', '-f', 'lavfi', '-i',
      'sine=frequency=300:duration=1', '-c:a', 'aac', path]);
    assert.equal(result.status, 0, result.stderr.toString());
    const decoded = await boundedAudio(new Blob([readFileSync(path)], { type: 'audio/mp4' }), AbortSignal.timeout(5000));
    assert.ok(decoded.milliseconds >= 950 && decoded.milliseconds <= 1050);
  } finally { rmSync(folder, { recursive: true, force: true }); }
});
