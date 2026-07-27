const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'theme');
const port = Number(process.env.PORT || 8098);

const routes = new Map([
  ['/', 'index.html'],
  ['/admisiones', 'admisiones.html'],
  ['/oferta-academica', 'oferta_academica.html'],
  ['/actividades-extracurriculares', 'actividades_extracurriculares.html'],
  ['/servicios', 'servicios.html'],
  ['/nosotros', 'nosotros.html'],
  ['/contacto', 'contacto.html'],
  ['/landing-page', 'landing_page.html'],
  ['/404', '404.html'],
]);

const redirects = new Map([
  ['/index.html', '/'],
  ['/inicio.html', '/'],
  ['/admisiones.html', '/admisiones'],
  ['/oferta_academica.html', '/oferta-academica'],
  ['/actividades_extracurriculares.html', '/actividades-extracurriculares'],
  ['/servicios.html', '/servicios'],
  ['/nosotros.html', '/nosotros'],
  ['/contacto.html', '/contacto'],
  ['/landing_page.html', '/landing-page'],
  ['/404.html', '/404'],
]);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function safePath(relativePath) {
  const normalized = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(root, normalized);
  return filePath.startsWith(root) ? filePath : null;
}

function sendFile(res, filePath, status = 200) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      send404(res);
      return;
    }

    res.writeHead(status, {
      'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
}

function send404(res) {
  const filePath = path.join(root, '404.html');
  sendFile(res, filePath, 404);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/';

  if (redirects.has(pathname)) {
    res.writeHead(301, { Location: redirects.get(pathname) });
    res.end();
    return;
  }

  const routeFile = routes.get(pathname);
  const target = routeFile || pathname.slice(1);
  const filePath = safePath(target);

  if (!filePath) {
    send404(res);
    return;
  }

  fs.stat(filePath, (error, stat) => {
    if (!error && stat.isFile()) {
      sendFile(res, filePath);
      return;
    }

    const htmlPath = safePath(`${target}.html`);
    if (htmlPath && fs.existsSync(htmlPath)) {
      sendFile(res, htmlPath);
      return;
    }

    send404(res);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Servidor local: http://127.0.0.1:${port}/`);
  console.log(`URLs limpias: http://127.0.0.1:${port}/admisiones`);
});
