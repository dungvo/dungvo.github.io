export const maxRecordingMs = 15000;
export const maxAudioBytes = 2 * 1024 * 1024;
export const audioExtensions = Object.freeze({ 'audio/webm': 'webm', 'audio/mp4': 'mp4', 'audio/ogg': 'ogg' });
export const audioType = value => value.split(';', 1)[0].trim().toLowerCase();

export function canRecordAudio() {
  return typeof globalThis.MediaRecorder === 'function' && Boolean(globalThis.navigator?.mediaDevices?.getUserMedia);
}

export async function captureAudio(signal, onReady) {
  signal.throwIfAborted();
  if (!canRecordAudio()) throw new Error('Trình duyệt này chưa hỗ trợ thu âm.');
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  try {
    signal.throwIfAborted();
    const candidates = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus'];
    const mimeType = candidates.find(type => MediaRecorder.isTypeSupported(type));
    const recorder = new MediaRecorder(stream, { audioBitsPerSecond: 64000, ...(mimeType ? { mimeType } : {}) });
    const clip = await new Promise((resolve, reject) => {
      const chunks = [];
      let size = 0;
      let timer;
      let finished = false;

      const stop = () => {
        if (recorder.state === 'recording') recorder.stop();
      };
      const finish = (error, result) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        signal.removeEventListener('abort', abort);
        if (error) { stop(); reject(error); }
        else resolve(result);
      };
      const abort = () => finish(signal.reason);
      signal.addEventListener('abort', abort, { once: true });
      recorder.ondataavailable = event => {
        if (finished || !event.data.size) return;
        size += event.data.size;
        if (size > maxAudioBytes) { finish(new Error('Bản thu vượt giới hạn dung lượng. Hãy nói câu ngắn hơn.')); return; }
        chunks.push(event.data);
      };
      recorder.onerror = () => finish(new Error('Thiết bị dừng thu âm. Thử lại hoặc nhập câu gọi.'));
      recorder.onstop = () => {
        const type = audioType(recorder.mimeType || chunks[0]?.type || '');
        if (!size) { finish(new Error('Chưa thu được âm thanh.')); return; }
        if (!Object.hasOwn(audioExtensions, type)) { finish(new Error('Định dạng thu âm của thiết bị chưa được hỗ trợ.')); return; }
        finish(null, new Blob(chunks, { type }));
      };
      try {
        recorder.start(1000);
        timer = setTimeout(stop, maxRecordingMs);
        onReady(stop);
      } catch (error) { finish(error); }
    });
    signal.throwIfAborted();
    return clip;
  } finally {
    for (const track of stream.getTracks()) track.stop();
  }
}

export function speechFrame(results) {
  const segments = Array.from(results ?? []).filter(result => result[0]?.transcript?.trim());
  return {
    text: segments.map(result => result[0].transcript.trim()).join(' '),
    final: segments.length > 0 && segments.every(result => result.isFinal),
  };
}
