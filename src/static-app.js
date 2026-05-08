const APP_NAME = 'Adaptive One';
const STORAGE_KEY = 'accessProfile';
const profiles = {
  cliente: { label: 'Cliente', text: 'Visão do cliente com foco em evolução, pendências e riscos.' },
  totvs: { label: 'TOTVS', text: 'Visão TOTVS para governança executiva e implantação.' },
  parceiro: { label: 'Parceiro', text: 'Visão do parceiro para colaboração e acompanhamento.' },
};
const menu = [
  ['Home', '/home', '▦'], ['Portfólio de Projetos', '/portfolio', '▣'], ['Jornada AGF', '/agf', '◆'],
  ['Cockpit Executivo', '/cockpit', '◈'], ['Status Report', '/status-report', '▤'], ['Pendências', '/pendencias', '✓'],
  ['Riscos', '/riscos', '⚠'], ['Gaps', '/gaps', '↯'], ['Times de Implantação', '/times', '●'], ['Indicadores', '/indicadores', '▲'], ['ORBIT', '/orbit', '◎'],
];
const systemMenu = [['Configurações', '/configuracoes', '⚙']];
const pageTitles = Object.fromEntries([...menu, ...systemMenu].map(([label, path]) => [path, label]));
const projects = [
  ['ERP Cloud', 'Em execução', '72%', 'green'], ['Backoffice Protheus', 'Atenção', '54%', 'amber'], ['RH Digital', 'Planejamento', '31%', 'green'], ['Fiscal Sync', 'Risco', '43%', 'red'],
];
const gates = [
  ['1', 'Gate 1 · Descoberta', 'Entendimento inicial, objetivos e restrições do projeto.', 'Concluído', 'green'],
  ['2', 'Gate 2 · Planejamento', 'Plano integrado, cronograma, capacidade e critérios de aceite.', 'Em andamento', 'amber'],
  ['3', 'Gate 3 · Execução', 'Construção, validações, integrações e gestão diária da implantação.', 'Próximo', 'green'],
  ['4', 'Gate 4 · Go-live', 'Preparação, corte, estabilização e sustentação assistida.', 'Monitorar', 'amber'],
];
const risks = [
  ['Integração fiscal', 'Alto', 'red'], ['Disponibilidade de key users', 'Médio', 'amber'], ['Migração de dados', 'Médio', 'amber'], ['Ambiente homologação', 'Baixo', 'green'],
];
const pending = [
  ['Validar matriz de responsabilidades', 'Cliente', '12/05/2026'], ['Aprovar plano de cutover', 'TOTVS', '15/05/2026'], ['Enviar massa de testes', 'Parceiro', '17/05/2026'],
];
const root = document.getElementById('root');
let selectedProfile = '';
let sidebarOpen = false;
function basePath() {
  const parts = location.pathname.split('/').filter(Boolean);
  return parts[0] === 'Projetos-TOTVS' ? '/Projetos-TOTVS' : '';
}
function appPath() {
  const base = basePath();
  const path = location.pathname;
  if (base && path === base) return '/';
  if (base && path.startsWith(base + '/')) return path.slice(base.length) || '/';
  return path || '/';
}
function href(path) { return `${basePath()}${path === '/' ? '/' : path}`; }
function go(path, replace = false) {
  history[replace ? 'replaceState' : 'pushState']({}, '', href(path));
  render();
}
function profile() { return profiles[localStorage.getItem(STORAGE_KEY)] ? localStorage.getItem(STORAGE_KEY) : null; }
function esc(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}
function badge(text, color = 'green') { return `<span class="badge ${color}">${esc(text)}</span>`; }
function shell(content, title) {
  const current = appPath();
  const nav = menu.map(([label, path, icon]) => navLink(label, path, icon, current)).join('');
  const sys = systemMenu.map(([label, path, icon]) => navLink(label, path, icon, current)).join('');
  const p = profiles[profile()];
  return `<div class="app-wallpaper shell">
    <aside class="sidebar ${sidebarOpen ? 'open' : ''}" id="sidebar">
      <div class="sidebar-brand"><span class="brand-mark">▦</span><div><h1>${APP_NAME}</h1><p>Governança Inteligente</p></div></div>
      <div class="nav-label">Menu principal</div>${nav}
      <div class="nav-label">Sistema</div>${sys}
    </aside>
    <section class="content">
      <header class="topbar"><div style="display:flex;align-items:center;gap:12px"><button class="mobile-menu" data-toggle-menu>☰</button><h2>${esc(title)}</h2></div><div style="display:flex;align-items:center;gap:12px"><span class="muted">${esc(p.label)}</span><button class="logout" data-logout>Sair</button></div></header>
      <main class="main">${content}</main>
    </section>
  </div>`;
}
function navLink(label, path, icon, current) {
  const active = current === path || (path === '/agf' && current.startsWith('/agf/'));
  return `<a class="nav-link ${active ? 'active' : ''}" href="${href(path)}" data-route="${path}"><span>${icon}</span><span>${esc(label)}</span></a>`;
}
function login() {
  return `<div class="login-page"><section class="login-card">
    <div class="login-hero"><div class="brand"><span class="brand-mark">▦</span>${APP_NAME}</div><p>Governança Inteligente</p></div>
    <div class="login-body"><h2>Acesse sua jornada de implantação</h2><p class="muted" style="text-align:center">Escolha seu perfil de acesso para continuar</p>
      <div id="login-error"></div>
      <form id="login-form">
        <div class="profile-grid">${Object.entries(profiles).map(([id, item]) => `<button type="button" class="profile-option ${selectedProfile === id ? 'selected' : ''}" data-profile="${id}"><span style="font-size:24px">${id === 'cliente' ? '▣' : id === 'totvs' ? '▦' : '◇'}</span><strong>${esc(item.label)}</strong></button>`).join('')}</div>
        <label class="field"><span>E-mail corporativo</span><input id="email" type="email" autocomplete="email" placeholder="seu.nome@empresa.com"></label>
        <label class="field"><span>Senha</span><input id="password" type="password" autocomplete="current-password" placeholder="••••••••"></label>
        <button class="primary-btn" type="submit">Conectar</button>
      </form>
      <p class="muted" style="text-align:center;font-size:12px;margin-top:20px">© 2026 Adaptive One - Governança de Projetos</p>
    </div>
  </section></div>`;
}
function homePage() {
  const p = profiles[profile()];
  return `<section class="hero"><h1>Bem-vindo à Governança Inteligente</h1><p>${esc(p.text)}</p></section>
  <section class="grid">
    ${kpi('Projetos ativos', '12', '4 em atenção')}${kpi('Saúde média', '84%', 'Dentro da meta')}${kpi('Pendências críticas', '7', 'Acompanhar hoje')}
    <article class="card wide"><h3>Próximos marcos</h3><ul class="list"><li><span>Comitê executivo ERP Cloud</span>${badge('10/05', 'green')}</li><li><span>Homologação Backoffice</span>${badge('13/05', 'amber')}</li><li><span>Cutover Fiscal Sync</span>${badge('18/05', 'red')}</li></ul></article>
    <article class="card"><h3>Jornada AGF</h3><p class="muted">Acompanhe gates, critérios e evolução da implantação.</p><a class="action-link" href="${href('/agf')}" data-route="/agf">Abrir jornada →</a></article>
  </section>`;
}
function kpi(title, number, subtitle) { return `<article class="card"><h3>${esc(title)}</h3><div class="kpi">${esc(number)}</div><p class="muted">${esc(subtitle)}</p></article>`; }
function portfolioPage() {
  return `<section class="hero"><h1>Portfólio de Projetos</h1><p>Visão consolidada dos projetos, status e avanço por frente.</p></section><section class="grid"><article class="card full table-wrap"><table><thead><tr><th>Projeto</th><th>Status</th><th>Progresso</th><th>Saúde</th></tr></thead><tbody>${projects.map(([name, status, progress, color]) => `<tr><td><strong>${name}</strong></td><td>${esc(status)}</td><td>${progress}</td><td>${badge(color === 'red' ? 'Crítico' : color === 'amber' ? 'Atenção' : 'Saudável', color)}</td></tr>`).join('')}</tbody></table></article></section>`;
}
function agfPage() {
  return `<section class="hero"><h1>Jornada AGF</h1><p>Modelo de governança por gates para aumentar previsibilidade e transparência.</p></section><section class="grid"><article class="card full gate-list">${gates.map(([id, title, desc, status, color]) => `<div class="gate"><div><strong>${esc(title)}</strong><p class="muted">${esc(desc)}</p>${badge(status, color)}</div><a class="action-link" href="${href(`/agf/gate/${id}`)}" data-route="/agf/gate/${id}">Abrir gate →</a></div>`).join('')}</article><article class="card"><h3>Árvore de gates</h3><p class="muted">Veja a estrutura completa da jornada.</p><a class="action-link" href="${href('/agf/arvore')}" data-route="/agf/arvore">Abrir árvore →</a></article></section>`;
}
function gateTreePage() { return `<section class="hero"><h1>Árvore AGF</h1><p>Sequência de decisões, evidências e aprovações da implantação.</p></section><section class="grid">${gates.map(([id, title, desc, status, color]) => `<article class="card"><h3>${esc(title)}</h3><p class="muted">${esc(desc)}</p>${badge(status, color)}<br><a class="action-link" href="${href(`/agf/gate/${id}`)}" data-route="/agf/gate/${id}">Detalhar →</a></article>`).join('')}</section>`; }
function gatePage(id) {
  const gate = gates.find(g => g[0] === id) || gates[0];
  return `<section class="hero"><h1>${esc(gate[1])}</h1><p>${esc(gate[2])}</p></section><section class="grid"><article class="card"><h3>Status</h3><div class="kpi">${esc(gate[3])}</div>${badge(gate[3], gate[4])}</article><article class="card wide"><h3>Critérios de aceite</h3><ul class="list"><li><span>Plano validado com stakeholders</span>${badge('OK')}</li><li><span>Riscos classificados e mitigados</span>${badge('Monitorar', 'amber')}</li><li><span>Evidências anexadas ao comitê</span>${badge('Em curso', 'amber')}</li></ul></article></section>`;
}
function cockpitPage() { return `<section class="hero"><h1>Cockpit Executivo</h1><p>Indicadores executivos para tomada de decisão.</p></section><section class="grid">${kpi('SPI', '0.96', 'Cronograma sob controle')}${kpi('CPI', '1.02', 'Custo saudável')}${kpi('Satisfação', '91%', 'Pesquisa semanal')}<article class="card full"><h3>Alertas executivos</h3><ul class="list">${risks.slice(0,3).map(([r, l, c]) => `<li><span>${esc(r)}</span>${badge(l, c)}</li>`).join('')}</ul></article></section>`; }
function statusReportPage() { return `<section class="hero"><h1>Status Report</h1><p>Resumo semanal padronizado para comunicação com stakeholders.</p></section><section class="grid"><article class="card full"><h3>Resumo</h3><p>A implantação segue dentro do plano, com atenção especial para integração fiscal e disponibilidade de key users.</p></article>${kpi('Concluído', '68%', 'Evolução geral')}${kpi('Próximo marco', '13/05', 'Homologação')}${kpi('Decisões', '3', 'Pendentes no comitê')}</section>`; }
function pendingPage() { return `<section class="hero"><h1>Pendências</h1><p>Itens de ação, responsáveis e prazos.</p></section><section class="grid"><article class="card full table-wrap"><table><thead><tr><th>Item</th><th>Responsável</th><th>Prazo</th></tr></thead><tbody>${pending.map(([i,o,d]) => `<tr><td>${esc(i)}</td><td>${esc(o)}</td><td>${esc(d)}</td></tr>`).join('')}</tbody></table></article></section>`; }
function risksPage() { return `<section class="hero"><h1>Riscos</h1><p>Monitoramento preventivo dos principais riscos do portfólio.</p></section><section class="grid"><article class="card full"><ul class="list">${risks.map(([r,l,c]) => `<li><span>${esc(r)}</span>${badge(l,c)}</li>`).join('')}</ul></article></section>`; }
function genericPage(title, subtitle) { return `<section class="hero"><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></section><section class="grid">${kpi('Aderência', '88%', 'Meta operacional')}${kpi('Itens abertos', '14', 'Backlog priorizado')}${kpi('Tendência', '↑', 'Evolução positiva')}<article class="card full"><h3>Detalhes</h3><p class="muted">Página disponível e navegável para acompanhamento da governança.</p></article></section>`; }
function notFound() { return `<section class="hero"><h1>Página não encontrada</h1><p>Use o menu lateral para continuar navegando.</p></section>`; }
const routes = {
  '/home': homePage, '/portfolio': portfolioPage, '/agf': agfPage, '/agf/arvore': gateTreePage, '/cockpit': cockpitPage,
  '/status-report': statusReportPage, '/pendencias': pendingPage, '/riscos': risksPage,
  '/gaps': () => genericPage('Gaps', 'Acompanhe lacunas, impactos e planos de ação.'),
  '/times': () => genericPage('Times de Implantação', 'Visão dos squads, papéis e capacidade.'),
  '/indicadores': () => genericPage('Indicadores', 'Métricas operacionais e executivas do portfólio.'),
  '/orbit': () => genericPage('ORBIT', 'Radar de maturidade, riscos e oportunidades.'),
  '/configuracoes': () => genericPage('Configurações', 'Preferências e parâmetros da aplicação.'),
};
function render() {
  const path = appPath();
  const currentProfile = profile();
  if (new URLSearchParams(location.search).get('redirect')) {
    const target = new URLSearchParams(location.search).get('redirect');
    return go(target.startsWith('/') ? target : `/${target}`, true);
  }
  if (!currentProfile && path !== '/login') return go('/login', true);
  if (currentProfile && (path === '/' || path === '/login')) return go('/home', true);
  if (!currentProfile) root.innerHTML = login();
  else {
    const gateMatch = path.match(/^\/agf\/gate\/(\d)$/);
    const content = gateMatch ? gatePage(gateMatch[1]) : (routes[path] ? routes[path]() : notFound());
    root.innerHTML = shell(content, pageTitles[path] || (gateMatch ? `Gate ${gateMatch[1]}` : 'Adaptive One'));
  }
  bindEvents();
}
function bindEvents() {
  document.querySelectorAll('[data-route]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); sidebarOpen = false; go(link.dataset.route); }));
  document.querySelectorAll('[data-profile]').forEach(button => button.addEventListener('click', () => { selectedProfile = button.dataset.profile; render(); }));
  document.querySelector('[data-logout]')?.addEventListener('click', () => { localStorage.removeItem(STORAGE_KEY); selectedProfile = ''; go('/login'); });
  document.querySelector('[data-toggle-menu]')?.addEventListener('click', () => { sidebarOpen = !sidebarOpen; render(); });
  document.getElementById('login-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const error = document.getElementById('login-error');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!selectedProfile) return error.innerHTML = '<div class="error">Selecione um perfil de acesso.</div>';
    if (!email) return error.innerHTML = '<div class="error">Informe o e-mail corporativo.</div>';
    if (!password) return error.innerHTML = '<div class="error">Informe a senha.</div>';
    localStorage.setItem(STORAGE_KEY, selectedProfile);
    go('/home');
  });
}
window.addEventListener('popstate', render);
render();
