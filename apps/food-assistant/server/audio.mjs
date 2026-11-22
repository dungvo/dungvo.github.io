import { spawn } from 'node:child_process';

const formats = { 'audio/webm': 'matroska', 'audio/ogg': 'ogg', 'audio/mp4': 'mov' };
const bytesPerSecond = 32000;

export async function boundedAudio(blob, signal) {
  const input = Buffer.from(await blob.arrayBuffer());
  const pcm = await new Promise((resolve, reject) => {
    const child = spawn(process.env.FOOD_FFMPEG_BIN || 'ffmpeg', ['-nostdin', '-loglevel', 'error', '-protocol_whitelist', 'pipe,cache',
      '-threads', '1', '-f', formats[blob.type], '-read_ahead_limit', '2097152', '-i', 'cache:pipe:0',
      '-map', '0:a:0', '-t', '16', '-ac', '1', '-ar', '16000', '-f', 's16le', 'pipe:1'], {
      stdio: ['pipe', 'pipe', 'ignore'], signal: AbortSignal.any([signal, AbortSignal.timeout(4000)]),
    });
    const chunks = [];
    let size = 0;
    child.stdout.on('data', chunk => { size += chunk.length; if (size <= 16 * bytesPerSecond) chunks.push(chunk); });
    child.stdin.on('error', () => {});
    child.on('error', reject);
    child.on('close', code => {
      if (code || size < 1600 || size > 15500 * bytesPerSecond / 1000) reject(new Error('Bản thu không hợp lệ hoặc dài quá 15 giây.'));
      else resolve(Buffer.concat(chunks));
    });
    child.stdin.end(input);
  });
  const wav = Buffer.alloc(44);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + pcm.length, 4);
  wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(16000, 24);
  wav.writeUInt32LE(bytesPerSecond, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(pcm.length, 40);
  return { audio: new Blob([wav, pcm], { type: 'audio/wav' }), milliseconds: Math.ceil(pcm.length * 1000 / bytesPerSecond) };
}
