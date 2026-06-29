const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const HOST = 'localhost';

// MIME типи
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // За замовчуванням - index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(__dirname, pathname);

  // Безпека: перевіримо, щоб запит не виходив за межи папки
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Сторінка не знайдена</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Помилка сервера', 'utf-8');
      }
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║  🚀 АРС Заправка - Сервер Запущений   ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  📱 Веб-адреса: http://${HOST}:${PORT}       ║`);
  console.log('║                                        ║');
  console.log('║  🔑 Облікові дані:                     ║');
  console.log('║  • Адмін:      admin / 0000           ║');
  console.log('║  • Співроб:    sub / 1111             ║');
  console.log('║                                        ║');
  console.log('║  ⏹️  Натисніть Ctrl+C для вимкнення    ║');
  console.log('╚════════════════════════════════════════╝\n');

  // Автоматично відкриваємо браузер
  if (process.platform === 'win32') {
    require('child_process').exec(`start http://${HOST}:${PORT}`);
  } else if (process.platform === 'darwin') {
    require('child_process').exec(`open http://${HOST}:${PORT}`);
  } else if (process.platform === 'linux') {
    require('child_process').exec(`xdg-open http://${HOST}:${PORT}`);
  }
});

console.log('Очікуємо на підключення...');
