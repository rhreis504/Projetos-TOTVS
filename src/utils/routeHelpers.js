export const routeTitles = {
  '/home': 'Painel Principal', '/portfolio': 'Portfólio de Projetos', '/cockpit': 'Cockpit Executivo',
  '/status-report': 'Status Report', '/riscos': 'Riscos', '/pendencias': 'Pendências', '/gaps': 'Gaps',
  '/times': 'Times de Implantação', '/indicadores': 'Indicadores', '/orbit': 'ORBIT', '/configuracoes': 'Configurações',
  '/agf': 'Jornada AGF', '/agf/arvore': 'Árvore de Gates do AGF',
};
export function getPageTitle(path) { if (/^\/agf\/gate\/\d$/.test(path)) return `Gate ${path.split('/').pop()}`; return routeTitles[path] || 'Página não encontrada'; }
export function isActivePath(current, itemPath) { return current === itemPath || (itemPath !== '/home' && current.startsWith(`${itemPath}/`)); }
