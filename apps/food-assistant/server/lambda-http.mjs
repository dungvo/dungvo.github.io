import { EventEmitter } from 'node:events';
import { Readable } from 'node:stream';

export function lambdaHttp(requestHandler) {
  return async event => {
    const path = event.rawPath;
    const method = event.requestContext?.http?.method;
    if (!method || typeof path !== 'string' || !path.startsWith('/api/')) {
      return { statusCode: 404, body: 'Not found' };
    }
    const bytes = Buffer.from(event.body ?? '', event.isBase64Encoded ? 'base64' : 'utf8');
    const req = Readable.from(bytes.length ? [bytes] : []);
    req.url = path + (event.rawQueryString ? '?' + event.rawQueryString : '');
    req.method = method;
    req.headers = Object.fromEntries(Object.entries(event.headers ?? {}).map(([name, value]) => [name.toLowerCase(), value]));
    const res = new EventEmitter();
    const headers = {};
    let result;
    let statusCode = 200;
    res.setHeader = (name, value) => { headers[name.toLowerCase()] = value; };
    res.writeHead = (status, values) => {
      statusCode = status;
      for (const [name, value] of Object.entries(values ?? {})) res.setHeader(name, value);
      res.headersSent = true;
    };
    res.end = body => { result = { statusCode, headers, body: String(body ?? ''), isBase64Encoded: false }; };
    await requestHandler(req, res);
    return result ?? { statusCode: 500, body: 'No response' };
  };
}
