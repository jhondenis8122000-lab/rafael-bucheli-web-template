const { readFileSync, readdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const theme = path.join(root, 'theme');
const check = process.argv.includes('--check');
const fragments = ['site-header', 'footer-links'].map((name) => ({
  name,
  source: readFileSync(path.join(root, 'partials', name + '.html'), 'utf8').trimEnd(),
}));

function render(source, route) {
  const result = source.replace(/\{\{(active|current):([/a-z|-]+)\}\}/g, (_, type, routes) => {
    if (!routes.split('|').includes(route)) return '';
    return type === 'active' ? ' class="active"' : ' aria-current="page"';
  });
  if (result.includes('{{')) throw new Error('Marcador de navegacion desconocido');
  return result;
}

function synchronize(html, { name, source }, route, optional) {
  const start = '<!-- NAV:' + name + ' -->';
  const end = '<!-- /NAV:' + name + ' -->';
  const block = new RegExp('^([ \\t]*)' + start + '\\r?\\n[\\s\\S]*?^\\1' + end + '(?=\\r?$)', 'gm');
  const matches = Array.from(html.matchAll(block));
  if (optional && !html.includes(start) && !html.includes(end)) return html;
  if (matches.length !== 1 || html.split(start).length !== 2 || html.split(end).length !== 2) {
    throw new Error('Se esperaba un unico bloque ' + name);
  }

  const newline = html.includes('\r\n') ? '\r\n' : '\n';
  return html.replace(block, (_, indent) =>
    [start, ...render(source, route).split('\n'), end]
      .map((line) => indent + line)
      .join(newline));
}

function main() {
  const pages = readdirSync(theme).filter((file) => file.endsWith('.html'));
  const changes = [];
  for (const file of pages) {
    const filename = path.join(theme, file);
    const html = readFileSync(filename, 'utf8');
    const route = file === 'index.html' ? '/' : '/' + path.basename(file, '.html').replaceAll('_', '-');
    let next = html;
    try {
      for (const fragment of fragments) {
        next = synchronize(next, fragment, route, file === '404.html' && fragment.name === 'footer-links');
      }
    } catch (error) {
      throw new Error(file + ': ' + error.message);
    }
    if (html !== next) changes.push({ file, filename, next });
  }

  if (check && changes.length) {
    console.error('Navegacion desactualizada: ' + changes.map(({ file }) => file).join(', '));
    console.error('Ejecute npm run nav:sync.');
    process.exitCode = 1;
    return;
  }

  for (const { filename, next } of changes) writeFileSync(filename, next);
  console.log('Navegacion verificada en ' + pages.length + ' paginas; ' + changes.length + ' actualizadas.');
}

main();
