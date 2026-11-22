import { spawnSync } from 'node:child_process';
import { createPrivateKey, randomBytes, X509Certificate } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { isIPv4 } from 'node:net';
import { networkInterfaces } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { stdin, stdout } from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseArgs, parseEnv } from 'node:util';

const appRoot = fileURLToPath(new URL('../', import.meta.url));
const privateIPv4 = address => isIPv4(address) && /^(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(address);
const readEnv = path => existsSync(path) ? parseEnv(readFileSync(path, 'utf8')) : {};
const enoughDays = 7 * 24 * 60 * 60 * 1000;

function installed(command, flag) {
  return spawnSync(command, [flag], { stdio: 'ignore' }).status === 0;
}

function certificateValid(directory, ip) {
  try {
    const certificate = new X509Certificate(readFileSync(join(directory, 'server.pem')));
    const root = new X509Certificate(readFileSync(join(directory, 'ca', 'rootCA.pem')));
    const key = createPrivateKey(readFileSync(join(directory, 'server-key.pem')));
    return certificate.checkIP(ip) && Date.parse(certificate.validTo) - Date.now() > enoughDays
      && certificate.checkPrivateKey(key) && certificate.checkIssued(root) && certificate.verify(root.publicKey);
  } catch { return false; }
}

function issueCertificate(directory, ip) {
  if (certificateValid(directory, ip)) return;
  const parent = join(directory, 'ca');
  mkdirSync(parent, { mode: 0o700, recursive: true });
  const temp = mkdtempSync(join(directory, 'cert-'));
  try {
    const cert = join(temp, 'server.pem');
    const key = join(temp, 'server-key.pem');
    const result = spawnSync('mkcert', ['-cert-file', cert, '-key-file', key, ip], {
      env: { ...process.env, CAROOT: parent }, encoding: 'utf8',
    });
    if (result.status !== 0) throw new Error('mkcert không tạo được chứng chỉ HTTPS cho địa chỉ Wi-Fi này.');
    chmodSync(key, 0o600);
    for (const file of ['server.pem', 'server-key.pem']) renameSync(join(temp, file), join(directory, file));
  } finally { rmSync(temp, { recursive: true, force: true }); }
}

async function setup() {
  const { values } = parseArgs({ options: { ip: { type: 'string' }, port: { type: 'string' }, 'without-ai': { type: 'boolean' } } });
  if (!installed('mkcert', '-version')) throw new Error('Cần mkcert để tạo HTTPS. Trên Mac chạy brew install mkcert.');
  const lanPath = join(appRoot, '.env.lan');
  const local = readEnv(join(appRoot, '.env'));
  const previous = readEnv(lanPath);
  let interfaces;
  try { interfaces = networkInterfaces(); }
  catch { throw new Error('Hệ điều hành chưa cho đọc địa chỉ mạng. Chạy trực tiếp trong Terminal trên máy Mac.'); }
  const choices = Object.entries(interfaces).flatMap(([name, interfaces]) =>
    (interfaces ?? []).filter(item => !item.internal && privateIPv4(item.address)).map(item => ({ name, ip: item.address })));
  let hidden = false;
  const output = new Writable({ write(chunk, encoding, callback) {
    if (hidden) callback();
    else stdout.write(chunk, encoding, callback);
  } });
  const interactive = Boolean(stdin.isTTY && stdout.isTTY);
  const input = interactive ? createInterface({ input: stdin, output, terminal: true }) : null;
  let ip;
  let groqKey;
  try {
    ip = values.ip ?? choices.find(item => item.ip === previous.HOST)?.ip;
    if (!ip && choices.length === 1) ip = choices[0].ip;
    if (!ip && input && choices.length) {
      for (const [index, choice] of choices.entries()) stdout.write(`${index + 1}. ${choice.ip} (${choice.name})\n`);
      const selection = await input.question('Chọn địa chỉ Wi-Fi của máy này: ');
      ip = choices[Number(selection) - 1]?.ip;
    }
    if (!privateIPv4(ip) || !choices.some(choice => choice.ip === ip)) {
      throw new Error('Chọn một địa chỉ IPv4 nội bộ đang có trên máy. Có thể truyền --ip 192.168.x.x.');
    }
    if (values['without-ai']) groqKey = '';
    else {
      groqKey = process.env.GROQ_API_KEY || previous.GROQ_API_KEY || local.GROQ_API_KEY || '';
      if (!groqKey && input) {
        stdout.write('Khóa Groq API (Enter để thử dịch vụ gọi món cơ bản): ');
        hidden = true;
        try { groqKey = (await input.question('')).trim(); }
        finally { hidden = false; stdout.write('\n'); }
      }
    }
  } finally { input?.close(); }
  if (groqKey && !/^gsk_[a-zA-Z0-9_\-]+$/.test(groqKey)) throw new Error('Khóa Groq phải bắt đầu bằng gsk_.');
  const port = Number(values.port ?? previous.PORT ?? 8787);
  if (!Number.isSafeInteger(port) || port < 1024 || port > 65535) throw new Error('Cổng HTTPS phải là số từ 1024 đến 65535.');
  const transcribe = groqKey && installed('ffmpeg', '-version') ? '1' : '0';
  const token = previous.FOOD_TOKEN || local.FOOD_TOKEN || randomBytes(32).toString('hex');
  if (token.length < 24 || !/^[\w-]+$/.test(token)) throw new Error('FOOD_TOKEN phải từ 24 ký tự trở lên, chỉ gồm chữ, số, dấu gạch ngang hoặc gạch dưới.');
  const directory = join(appRoot, '.food-lan');
  mkdirSync(directory, { mode: 0o700, recursive: true });
  issueCertificate(directory, ip);
  const settings = {
    HOST: ip, PORT: port, FOOD_AI_PROVIDER: 'groq', GROQ_API_KEY: groqKey, FOOD_TRANSCRIBE: transcribe,
    FOOD_ORIGINS: '', FOOD_TOKEN: token, FOOD_TLS_CERT: '.food-lan/server.pem', FOOD_TLS_KEY: '.food-lan/server-key.pem',
  };
  const tmp = join(directory, 'env-' + randomBytes(8).toString('hex'));
  try {
    writeFileSync(tmp, Object.entries(settings).map(([name, value]) => name + '=' + value + '\n').join(''), { mode: 0o600, flag: 'wx' });
    renameSync(tmp, lanPath);
  } finally { if (existsSync(tmp)) rmSync(tmp); }
  stdout.write('Đã tạo cấu hình LAN. Chạy npm run start:lan rồi mở trên thiết bị cùng Wi-Fi:\n');
  stdout.write('Kết nối thiết bị: https://' + ip + ':' + port + '/#ket-noi\n');
  stdout.write('Màn bếp: https://' + ip + ':' + port + '/#bep\n');
  stdout.write('Mã quán: xem FOOD_TOKEN ở .env.lan trên máy chủ.\n');
  stdout.write('Chứng chỉ tin cậy cho các thiết bị thử: .food-lan/ca/rootCA.pem\n');
  if (groqKey && transcribe === '0') stdout.write('Groq văn bản đã sẵn sàng. Cài FFmpeg rồi chạy lại setup:lan để bật thu âm qua API.\n');
  if (!groqKey) stdout.write('Đang cấu hình chế độ gọi món cơ bản. Chạy lại setup:lan khi có khóa Groq.\n');
}

setup().catch(error => { console.error(error.message); process.exitCode = 1; });
