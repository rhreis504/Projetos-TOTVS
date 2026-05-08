export const routeTitles = {
  '/home': 'Painel Principal', '/portfolio': 'Portfólio de Projetos', '/cockpit': 'Cockpit Executivo',
  '/status-report': 'Status Report', '/riscos': 'Riscos', '/pendencias': 'Pendências', '/gaps': 'Gaps',
  '/times': 'Times de Implantação', '/indicadores': 'Indicadores', '/orbit': 'ORBIT', '/configuracoes': 'Configurações',
  '/agf': 'Jornada AGF', '/agf/arvore': 'Árvore de Gates do AGF',
};
export function getPageTitle(path) {
  if (/^\/projetos\/[^/]+\/agf\/gate\/3$/.test(path)) return 'Gate 3 — Execução Controlada';
  if (/^\/projetos\/[^/]+\/agf$/.test(path)) return 'Jornada AGF do Projeto';
  if (/^\/projetos\/[^/]+$/.test(path)) return 'Detalhe do Projeto';
  if (/^\/agf\/gate\/\d$/.test(path)) return `Gate ${path.split('/').pop()}`;
  return routeTitles[path] || 'Página não encontrada';
}
export function isActivePath(current, itemPath) {
  if (itemPath === '/agf' && /^\/projetos\/[^/]+\/agf/.test(current)) return true;
  if (itemPath === '/portfolio' && /^\/projetos\/[^/]+$/.test(current)) return true;
  return current === itemPath || (itemPath !== '/home' && current.startsWith(`${itemPath}/`));
}
