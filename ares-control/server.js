const http = require('http');

const USER = process.env.ARES_BASIC_USER || 'bryce';
const PASS = process.env.ARES_BASIC_PASS || 'change-me';

function unauthorized(res) {
  res.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="Ares Control"',
    'Content-Type': 'text/plain'
  });
  res.end('Unauthorized');
}

function ok(res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    name: 'Ares Control',
    status: 'online',
    ts: new Date().toISOString()
  }));
}

http.createServer((req, res) => {
  const auth = req.headers['authorization'] || '';
  if (!auth.startsWith('Basic ')) return unauthorized(res);
  const b64 = auth.slice('Basic '.length);
  const [u, p] = Buffer.from(b64, 'base64').toString('utf8').split(':');
  if (u !== USER || p !== PASS) return unauthorized(res);

  if (req.url === '/' || req.url.startsWith('/health')) return ok(res);

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
}).listen(3030, '0.0.0.0', () => {
  console.log('Ares Control listening on :3030');
});
