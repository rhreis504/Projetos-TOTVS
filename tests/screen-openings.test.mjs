import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const appSource = readFileSync(new URL('../src/static-app.js', import.meta.url), 'utf8');

function renderRoute(pathname, { profile = 'totvs', search = '' } = {}) {
  const root = { innerHTML: '' };
  const listeners = {};
  const localStorage = new Map(profile ? [['accessProfile', profile]] : []);
  const location = { pathname, search, hash: '' };
  const history = {
    pushState(_state, _title, nextPath) { location.pathname = nextPath.split('?')[0]; location.search = nextPath.includes('?') ? `?${nextPath.split('?')[1]}` : ''; },
    replaceState(_state, _title, nextPath) { this.pushState(_state, _title, nextPath); },
  };
  const document = {
    getElementById(id) { return id === 'root' ? root : null; },
    querySelectorAll() { return []; },
    querySelector() { return null; },
  };
  const context = {
    document,
    history,
    location,
    localStorage: {
      getItem(key) { return localStorage.get(key) ?? null; },
      setItem(key, value) { localStorage.set(key, String(value)); },
      removeItem(key) { localStorage.delete(key); },
    },
    URLSearchParams,
    window: {
      addEventListener(type, callback) { listeners[type] = callback; },
    },
  };

  vm.runInNewContext(appSource, context, { filename: 'src/static-app.js' });
  return { html: root.innerHTML, pathname: location.pathname };
}

const screenRoutes = [
  ['/Projetos-TOTVS/', 'Bem-vindo à Governança Inteligente'],
  ['/Projetos-TOTVS/home', 'Bem-vindo à Governança Inteligente'],
  ['/Projetos-TOTVS/portfolio', 'Portfólio de Projetos'],
  ['/Projetos-TOTVS/agf', 'Jornada AGF'],
  ['/Projetos-TOTVS/agf/arvore', 'Árvore AGF'],
  ['/Projetos-TOTVS/agf/gate/3', 'Gate 3 · Execução'],
  ['/Projetos-TOTVS/projetos/PRJ-001', 'Implantação RH Rossi'],
  ['/Projetos-TOTVS/projetos/PRJ-001/agf', 'Jornada AGF · Implantação RH Rossi'],
  ['/Projetos-TOTVS/projetos/PRJ-001/agf/gate/3', 'Implantação RH Rossi · Gate 3'],
  ['/Projetos-TOTVS/cockpit', 'Cockpit Executivo'],
  ['/Projetos-TOTVS/status-report', 'Status Report'],
  ['/Projetos-TOTVS/pendencias', 'Pendências'],
  ['/Projetos-TOTVS/riscos', 'Riscos'],
  ['/Projetos-TOTVS/gaps', 'Gaps'],
  ['/Projetos-TOTVS/times', 'Times de Implantação'],
  ['/Projetos-TOTVS/indicadores', 'Indicadores'],
  ['/Projetos-TOTVS/tap.html', 'TAP · Termo de Abertura do Projeto'],
  ['/Projetos-TOTVS/orbit', 'ORBIT'],
  ['/Projetos-TOTVS/configuracoes', 'Configurações'],
];

test('all authenticated screens open inside GitHub Pages base path', () => {
  for (const [route, expectedText] of screenRoutes) {
    const { html } = renderRoute(route);
    assert.match(html, new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Expected ${route} to render ${expectedText}`);
    assert.doesNotMatch(html, /Página não encontrada/, `Expected ${route} to resolve to a configured screen`);
    assert.match(html, /class="app-wallpaper shell"/, `Expected ${route} to render the application shell`);
  }
});

test('unauthenticated access opens login instead of a blank page', () => {
  const { html, pathname } = renderRoute('/Projetos-TOTVS/tap.html', { profile: null });
  assert.equal(pathname, '/Projetos-TOTVS/login');
  assert.match(html, /Acesse sua jornada de implantação/);
  assert.doesNotMatch(html, /^\s*$/);
});

test('published html entry points load the static browser-safe app bundle', () => {
  for (const file of ['index.html', 'tap.html']) {
    const html = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(html, /href="\.\/src\/static-app\.css"/);
    assert.match(html, /src="\.\/src\/static-app\.js"/);
    assert.doesNotMatch(html, /src="\/src\/main\.jsx"/);
  }
});
