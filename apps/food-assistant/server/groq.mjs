const baseUrl = 'https://api.groq.com/openai/v1';

async function sendGroq(fetcher, key, endpoint, body, signal, json) {
  const response = await fetcher(baseUrl + endpoint, {
    method: 'POST', headers: { Authorization: 'Bearer ' + key, ...(json ? { 'Content-Type': 'application/json' } : {}) },
    body: json ? JSON.stringify(body) : body, signal,
  });
  if (response.status === 429) throw Object.assign(new Error(
    'Groq đang giới hạn lượt sử dụng. Hãy thử lại sau, nhập câu hoặc chạm món.'), { status: 429 });
  if (response.status === 401 || response.status === 403) throw Object.assign(new Error(
    'Groq chưa cấp quyền cho khóa API. Kiểm tra khóa trên máy chủ của quán.'), { status: 503 });
  if (!response.ok) throw new Error('Groq rejected the request');
  return response.json();
}

export function groqProvider(fetcher = globalThis.fetch) {
  return {
    async interpret(key, model, input, { instructions, schema, outputTokens }) {
      const result = await sendGroq(fetcher, key, '/chat/completions', {
        model, reasoning_effort: 'low', max_completion_tokens: outputTokens,
        messages: [{ role: 'system', content: instructions }, { role: 'user', content: JSON.stringify(input) }],
        response_format: { type: 'json_schema', json_schema: { name: 'restaurant_command', strict: true, schema } },
      }, AbortSignal.timeout(15000), true);
      const choice = result.choices?.[0];
      let draft;
      if (choice?.finish_reason === 'stop' && choice.message?.content) {
        try { draft = JSON.parse(choice.message.content); } catch { /* Server validation rejects the draft. */ }
      }
      return { draft, usage: { input_tokens: result.usage?.prompt_tokens, output_tokens: result.usage?.completion_tokens } };
    },
    async transcribe(key, audio, signal) {
      const form = new FormData();
      form.set('model', 'whisper-large-v3-turbo');
      form.set('language', 'vi');
      form.set('response_format', 'json');
      form.set('temperature', '0');
      form.set('file', audio, 'cau-goi-mon.wav');
      return (await sendGroq(fetcher, key, '/audio/transcriptions', form, signal, false)).text;
    },
  };
}
