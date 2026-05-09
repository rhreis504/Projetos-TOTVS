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
  ['Riscos', '/riscos', '⚠'], ['Gaps', '/gaps', '↯'], ['Times de Implantação', '/times', '●'], ['Indicadores', '/indicadores', '▲'], ['TAP', '/tap.html', '▧'], ['ORBIT', '/orbit', '◎'],
];
const systemMenu = [['Configurações', '/configuracoes', '⚙']];
const pageTitles = Object.fromEntries([...menu, ...systemMenu].map(([label, path]) => [path, label]));
const projects = [
  { id: 'PRJ-001', code: 'ROSSI-RH-2026', name: 'Implantação RH Rossi', clientName: 'Rossi Supermercados', status: 'Em execução', progress: '38%', color: 'amber', currentGate: '3', agfLevel: 'Hard', description: 'Implantação integrada das soluções de RH, folha, ponto, admissão digital, ATS, LMS/LXP, Feedz, Quirons e Ahgora.' },
  { id: 'PRJ-002', code: 'AURORA-ERP-2026', name: 'Implantação ERP Protheus', clientName: 'Grupo Aurora', status: 'Em planejamento', progress: '14%', color: 'green', currentGate: '1', agfLevel: 'Medium', description: 'Implantação de ERP com foco financeiro, fiscal e suprimentos.' },
  { id: 'PRJ-003', code: 'HORIZONTE-RH-2026', name: 'Rollout RH', clientName: 'Rede Horizonte', status: 'Crítico', progress: '72%', color: 'red', currentGate: '4', agfLevel: 'Simple', description: 'Rollout de RH e folha para novas unidades.' },
];
const gates = [
  ['1', 'Gate 1 · Descoberta', 'Entendimento inicial, objetivos e restrições do projeto.', 'Concluído', 'green'],
  ['2', 'Gate 2 · Planejamento', 'Plano integrado, cronograma, capacidade e critérios de aceite.', 'Em andamento', 'amber'],
  ['3', 'Gate 3 · Execução', 'Construção, validações, integrações e gestão diária da implantação.', 'Próximo', 'green'],
  ['4', 'Gate 4 · Go-live', 'Preparação, corte, estabilização e sustentação assistida.', 'Monitorar', 'amber'],
];

const gate3Stages = [
  ['6.1', 'Início da Execução', 'Confirmação formal do início operacional do projeto.', 'Plano de execução ativado · baseline operacional confirmada · equipe e cliente sincronizados · critérios de acompanhamento definidos'],
  ['6.2', 'Gestão das Atividades', 'Controle das tarefas executadas pelo time.', 'Atividades por pacote de trabalho · dependências monitoradas · evidências vinculadas · esforço previsto x realizado'],
  ['6.3', 'Gestão das Entregas', 'Acompanhamento dos entregáveis do projeto.', 'Entregas por marco · critérios de aceite vinculados · evidências obrigatórias · preparação automática para Gate 4'],
  ['6.4', 'Gestão de Impedimentos', 'Registro e tratamento dos bloqueios da execução.', 'Severidade · escalonamento · plano de ação · decisão registrada · impacto em prazo, custo e escopo'],
  ['6.5', 'Gestão de Riscos Operacionais', 'Monitoramento dos riscos durante a execução.', 'Severidade · tendência · gatilhos · contingência · reavaliação pela IA'],
  ['6.6', 'Controle de Escopo', 'Garantia de que a execução respeita o escopo aprovado.', 'Change request formal · impacto em prazo, custo, esforço e qualidade · aprovação obrigatória · histórico de decisão'],
  ['6.7', 'Controle de Prazo e Esforço', 'Acompanhamento da evolução real contra o planejado.', 'Baseline x realizado · caminho crítico · desvio de esforço · previsão de impacto futuro · recomendação da IA'],
  ['6.8', 'Comunicação e Status Report', 'Formalização da comunicação do andamento do projeto.', 'Status executivo · indicadores · riscos · impedimentos · decisões pendentes · recomendações da IA · registro para comitê'],
  ['6.9', 'Preparação para Validação', 'Organização dos pacotes que serão avaliados no Gate 4.', 'Pacote de validação completo · evidências anexadas · pendências identificadas · checklist de qualidade inicial · envio controlado para Gate 4'],
];
const gate3Controls = [
  ['Atividade / pacote', 'Parametrização RM Folha', 'Regis Reis', 'Em execução', '12/05/2026', 'Hard'],
  ['Entregável', 'Plano de integração Ahgora', 'Líder técnico', 'Pronto para validação', '15/05/2026', 'Hard'],
  ['Impedimento', 'Carga inicial de rubricas com divergência', 'Cliente', 'Escalonar', '10/05/2026', 'Hard'],
  ['Risco operacional', 'Baixa disponibilidade dos key users', 'Sponsor', 'Monitorar', '17/05/2026', 'Hard'],
  ['Mudança de escopo', 'Inclusão de fluxo complementar Feedz', 'PMO', 'Em análise', '20/05/2026', 'Hard'],
  ['Status report', 'Relatório executivo semanal', 'PM', 'Emitido', '08/05/2026', 'Hard'],
];
const gate3ScoreBands = [
  ['80–100', 'Execução saudável', 'Mantém execução com acompanhamento regular.', 'green'],
  ['60–79', 'Execução com atenção', 'Mantém execução com ações corretivas.', 'amber'],
  ['40–59', 'Execução em risco', 'Exige plano de recuperação.', 'amber'],
  ['0–39', 'Execução crítica', 'Exige escalonamento e possível bloqueio.', 'red'],
];
const gate3AiOutputs = ['Score de execução', 'Análise de desempenho', 'Riscos ocultos', 'Tendência de atraso', 'Tendência de estouro de esforço', 'Pontos críticos de escopo', 'Recomendações de ação', 'Alertas de impedimentos', 'Sugestão de escalonamento', 'Pacotes para Gate 4'];
const gate3Baseline = ['Atividades', 'Entregas', 'Responsáveis', 'Prazos', 'Esforço', 'Riscos', 'Impedimentos', 'Mudanças', 'Status reports', 'Evidências', 'Decisões'];
const gate3Artifacts = ['Plano de execução atualizado', 'Controle de atividades', 'Controle de entregas', 'Registro de impedimentos', 'Registro de riscos operacionais', 'Controle de mudanças', 'Status report', 'Relatório de desvios', 'Pacotes de validação para Gate 4', 'Histórico de decisões', 'Score de execução'];
const gate3Roles = ['PM', 'PMO', 'Equipe técnica', 'Líder técnico', 'Cliente', 'Key users', 'Sponsor', 'Comitê', 'IA'];

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
function healthLabel(color) { return color === 'red' ? 'Crítico' : color === 'amber' ? 'Atenção' : 'Saudável'; }
function findProject(projectId) { return projects.find(project => project.id === projectId); }
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
  const active = current === path || (path === '/agf' && (current.startsWith('/agf/') || /^\/projetos\/[^/]+\/agf/.test(current))) || (path === '/portfolio' && /^\/projetos\/[^/]+$/.test(current));
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
  return `<section class="hero"><h1>Portfólio de Projetos</h1><p>Selecione um projeto pelo link de ação para abrir o fluxo da Jornada AGF.</p></section><section class="grid"><article class="card full table-wrap"><table><thead><tr><th>Projeto</th><th>Cliente</th><th>Status</th><th>Progresso</th><th>Saúde</th><th>Ações</th></tr></thead><tbody>${projects.map(project => `<tr><td><strong>${esc(project.name)}</strong><br><span class="muted">${esc(project.code)}</span></td><td>${esc(project.clientName)}</td><td>${esc(project.status)}</td><td>${esc(project.progress)}</td><td>${badge(healthLabel(project.color), project.color)}</td><td class="actions-cell"><a class="action-link" href="${href(`/projetos/${project.id}/agf`)}" data-route="/projetos/${project.id}/agf">Abrir projeto →</a><a class="secondary-link" href="${href(`/projetos/${project.id}`)}" data-route="/projetos/${project.id}">Detalhes</a></td></tr>`).join('')}</tbody></table></article></section>`;
}
function projectDetailPage(projectId) {
  const project = findProject(projectId);
  if (!project) return notFound();
  return `<section class="hero"><h1>${esc(project.name)}</h1><p>${esc(project.description)}</p></section><section class="grid"><article class="card wide"><h3>${esc(project.clientName)}</h3><p class="muted">Código: ${esc(project.code)} · Nível AGF: ${esc(project.agfLevel)}</p><ul class="list"><li><span>Status</span>${badge(project.status, project.color)}</li><li><span>Gate atual</span>${badge(`Gate ${project.currentGate}`, project.color)}</li><li><span>Progresso</span><strong>${esc(project.progress)}</strong></li></ul><a class="action-link" href="${href(`/projetos/${project.id}/agf`)}" data-route="/projetos/${project.id}/agf">Acessar Jornada AGF →</a></article><article class="card"><h3>Trocar projeto</h3><p class="muted">Volte ao portfólio para selecionar outro projeto.</p><a class="action-link" href="${href('/portfolio')}" data-route="/portfolio">Voltar ao Portfólio →</a></article></section>`;
}
function agfPage(projectId) {
  const project = projectId ? findProject(projectId) : null;
  if (projectId && !project) return notFound();
  const gateBasePath = project ? `/projetos/${project.id}/agf/gate` : '/agf/gate';
  const intro = project ? `Fluxo AGF vinculado ao projeto ${project.name}.` : 'Modelo de governança por gates para aumentar previsibilidade e transparência.';
  return `<section class="hero"><h1>${project ? `Jornada AGF · ${esc(project.name)}` : 'Jornada AGF'}</h1><p>${esc(intro)}</p></section><section class="grid"><article class="card full gate-list">${gates.map(([id, title, desc, status, color]) => `<div class="gate"><div><strong>${esc(title)}</strong><p class="muted">${esc(desc)}</p>${badge(status, color)}</div><a class="action-link" href="${href(`${gateBasePath}/${id}`)}" data-route="${gateBasePath}/${id}">Abrir gate →</a></div>`).join('')}</article><article class="card"><h3>Árvore de gates</h3><p class="muted">Veja a estrutura completa da jornada.</p><a class="action-link" href="${href('/agf/arvore')}" data-route="/agf/arvore">Abrir árvore →</a></article>${project ? `<article class="card"><h3>Detalhes do projeto</h3><p class="muted">Consulte o contexto completo do projeto selecionado.</p><a class="action-link" href="${href(`/projetos/${project.id}`)}" data-route="/projetos/${project.id}">Ver detalhes →</a></article>` : ''}</section>`;
}
function gateTreePage() { return `<section class="hero"><h1>Árvore AGF</h1><p>Sequência de decisões, evidências e aprovações da implantação.</p></section><section class="grid">${gates.map(([id, title, desc, status, color]) => `<article class="card"><h3>${esc(title)}</h3><p class="muted">${esc(desc)}</p>${badge(status, color)}<br><a class="action-link" href="${href(`/agf/gate/${id}`)}" data-route="/agf/gate/${id}">Detalhar →</a></article>`).join('')}</section>`; }
function gate3ExecutionPage(project) {
  const score = project ? 72 : 68;
  const projectName = project ? project.name : 'Projeto selecionado';
  const agfLevel = project ? project.agfLevel : 'Hard';
  return `<section class="hero gate3-hero"><p class="eyebrow">Gate 3 · Execução Controlada e Gestão Operacional</p><h1>${esc(projectName)} · Gate 3 · Execução</h1><p>Conduz a execução real do projeto de forma controlada, integrando PMBOK, governança AGF, operação ágil, status report, riscos, impedimentos, escopo, prazo, esforço, qualidade e recomendações da IA.</p><div class="hero-actions">${project ? `<a class="hero-btn light" href="${href(`/projetos/${project.id}/agf`)}" data-route="/projetos/${project.id}/agf">Voltar à Jornada AGF</a>` : `<a class="hero-btn light" href="${href('/portfolio')}" data-route="/portfolio">Selecionar projeto</a>`}<a class="hero-btn" href="#gate3-script">Ver script completo</a></div></section>
  <section class="grid gate3-dashboard">
    ${kpi('Score de execução', `${score}/100`, 'Execução com atenção')}
    ${kpi('Nível AGF', agfLevel, 'Vem do Gate 0 e não pode ser alterado')}
    ${kpi('Status operacional', 'Em execução', 'Controle contínuo ativo')}
    <article class="card wide"><h3>Definição e objetivo</h3><p class="muted">O Gate 3 transforma o planejamento aprovado em execução monitorada, evitando avanço no improviso e preparando cada pacote para validação no Gate 4.</p><ul class="list compact"><li><span>Entregas controladas por fases, pacotes ou marcos</span>${badge('Ativo')}</li><li><span>Desvios identificados rapidamente</span>${badge('Monitorar', 'amber')}</li><li><span>IA apoiando análise de desempenho e tendências</span>${badge('Em curso', 'amber')}</li></ul></article>
    <article class="card full"><h3>Modelo de operação por complexidade</h3><div class="three-cols"><div><strong>Simple</strong><p class="muted">Execução objetiva, controle essencial, baixa formalização e alta velocidade.</p></div><div><strong>Medium</strong><p class="muted">Execução estruturada, controle periódico e gestão equilibrada de prazo, escopo e riscos.</p></div><div><strong>Hard</strong><p class="muted">Execução rigorosa, governança ativa, evidências obrigatórias e bloqueio de avanço sem conformidade.</p></div></div></article>
    <article class="card full"><h3>Campos obrigatórios da execução</h3><div class="form-grid"><label>Data de início operacional<input value="${esc(project?.startDate || '2026-05-08')}" readonly></label><label>Baseline operacional<input value="Confirmada" readonly></label><label>Frequência de status report<input value="Semanal" readonly></label><label>Rito ágil<input value="Daily + planning + review operacional" readonly></label><label>Critério de continuidade<input value="Score 60–79: ações corretivas obrigatórias" readonly></label><label>Preparação Gate 4<input value="Pacotes prontos por entregável" readonly></label></div></article>
    <article class="card full" id="gate3-script"><h3>Script completo do Gate 3</h3><div class="stage-grid">${gate3Stages.map(([code, title, desc, hard]) => `<div class="stage-card"><span>${esc(code)}</span><strong>${esc(title)}</strong><p>${esc(desc)}</p><small>${esc(hard)}</small></div>`).join('')}</div></article>
    <article class="card full table-wrap"><h3>Controle operacional integrado PMBOK + Ágil</h3><table><thead><tr><th>Área / backlog</th><th>Item controlado</th><th>Responsável</th><th>Status</th><th>Prazo</th><th>Rigor</th></tr></thead><tbody>${gate3Controls.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></article>
    <article class="card wide"><h3>Score de execução e continuidade</h3><ul class="list">${gate3ScoreBands.map(([range, label, rule, color]) => `<li><span><strong>${esc(range)}</strong> · ${esc(label)}<br><small>${esc(rule)}</small></span>${badge(label, color)}</li>`).join('')}</ul><p class="muted small-note">Decisão divergente da recomendação da IA exige justificativa formal.</p></article>
    <article class="card"><h3>Saída da IA</h3><div class="pill-list">${gate3AiOutputs.map(item => `<span>${esc(item)}</span>`).join('')}</div></article>
    <article class="card"><h3>Baseline de execução</h3><div class="pill-list">${gate3Baseline.map(item => `<span>${esc(item)}</span>`).join('')}</div></article>
    <article class="card wide"><h3>Regras de governança</h3><ul class="check-list"><li>Atividades atualizadas e entregas rastreadas.</li><li>Impedimentos tratados, riscos monitorados e mudanças registradas.</li><li>Status report emitido, desvios justificados e evidências anexadas conforme complexidade.</li><li>Pacotes preparados para validação no Gate 4.</li></ul></article>
    <article class="card wide"><h3>Artefatos gerados</h3><div class="pill-list">${gate3Artifacts.map(item => `<span>${esc(item)}</span>`).join('')}</div></article>
    <article class="card"><h3>Papéis envolvidos</h3><div class="pill-list">${gate3Roles.map(item => `<span>${esc(item)}</span>`).join('')}</div></article>
    <article class="card full"><h3>Resultado esperado</h3><p class="muted">Execução em andamento com controle, entregas acompanhadas, atividades atualizadas, impedimentos tratados, riscos monitorados, escopo controlado, status report gerado, indicadores operacionais atualizados, score de execução e pacotes prontos para o Gate 4.</p></article>
  </section>`;
}
function gatePage(id, projectId) {
  const gate = gates.find(g => g[0] === id) || gates[0];
  const project = projectId ? findProject(projectId) : null;
  if (projectId && !project) return notFound();
  if (id === '3') return gate3ExecutionPage(project);
  return `<section class="hero"><h1>${project ? `${esc(project.name)} · ` : ''}${esc(gate[1])}</h1><p>${esc(gate[2])}</p></section><section class="grid"><article class="card"><h3>Status</h3><div class="kpi">${esc(gate[3])}</div>${badge(gate[3], gate[4])}</article><article class="card wide"><h3>Critérios de aceite</h3><ul class="list"><li><span>Plano validado com stakeholders</span>${badge('OK')}</li><li><span>Riscos classificados e mitigados</span>${badge('Monitorar', 'amber')}</li><li><span>Evidências anexadas ao comitê</span>${badge('Em curso', 'amber')}</li></ul>${project ? `<a class="action-link" href="${href(`/projetos/${project.id}/agf`)}" data-route="/projetos/${project.id}/agf">Voltar à Jornada AGF →</a>` : ''}</article></section>`;
}

function tapPage() {
  return `<section class="hero"><h1>TAP · Termo de Abertura do Projeto</h1><p>Formalize a abertura, objetivos, escopo inicial, governança, premissas e critérios de sucesso antes de avançar na Jornada AGF.</p></section>
  <section class="grid">
    <article class="card wide"><h3>Identificação do projeto</h3><ul class="list"><li><span>Projeto</span><strong>Implantação RH Rossi</strong></li><li><span>Cliente</span><strong>Rossi Supermercados</strong></li><li><span>Patrocinador</span><strong>Diretoria de RH</strong></li><li><span>Gerente do projeto</span><strong>PMO TOTVS</strong></li></ul></article>
    <article class="card"><h3>Status do TAP</h3><div class="kpi">Em validação</div>${badge('Pronto para assinatura', 'amber')}</article>
    <article class="card"><h3>Objetivos</h3><p class="muted">Alinhar expectativas, responsabilidades, macroescopo e critérios executivos para iniciar o projeto com governança.</p></article>
    <article class="card"><h3>Escopo inicial</h3><p class="muted">RH, folha, ponto, admissão digital, ATS, LMS/LXP, Feedz, Quirons e Ahgora.</p></article>
    <article class="card"><h3>Premissas</h3><p class="muted">Disponibilidade de key users, ambientes preparados, dados saneados e calendário de comitês confirmado.</p></article>
    <article class="card full"><h3>Checklist de abertura</h3><ul class="list"><li><span>Business case e objetivos aprovados</span>${badge('OK')}</li><li><span>Governança e papéis definidos</span>${badge('OK')}</li><li><span>Riscos iniciais registrados</span>${badge('Atenção', 'amber')}</li><li><span>Critérios de aceite do TAP</span>${badge('Em validação', 'amber')}</li></ul><a class="action-link" href="${href('/agf')}" data-route="/agf">Continuar para Jornada AGF →</a></article>
  </section>`;
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
  '/tap.html': tapPage,
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
    const projectGateMatch = path.match(/^\/projetos\/([^/]+)\/agf\/gate\/(\d)$/);
    const projectAgfMatch = path.match(/^\/projetos\/([^/]+)\/agf$/);
    const projectMatch = path.match(/^\/projetos\/([^/]+)$/);
    const content = projectGateMatch ? gatePage(projectGateMatch[2], projectGateMatch[1])
      : projectAgfMatch ? agfPage(projectAgfMatch[1])
        : projectMatch ? projectDetailPage(projectMatch[1])
          : gateMatch ? gatePage(gateMatch[1])
            : (routes[path] ? routes[path]() : notFound());
    const title = projectGateMatch ? `Gate ${projectGateMatch[2]}` : projectAgfMatch ? 'Jornada AGF do Projeto' : projectMatch ? 'Detalhe do Projeto' : pageTitles[path] || (gateMatch ? `Gate ${gateMatch[1]}` : 'Adaptive One');
    root.innerHTML = shell(content, title);
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
