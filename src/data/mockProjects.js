export const mockProjects = [
 { name:'Implantação ERP Protheus', client:'Grupo Aurora', status:'Em execução', gate:'Gate 3', health:'Atenção', goLive:'30/08/2026' },
 { name:'Migração Backoffice', client:'Indústria Sol', status:'Planejamento', gate:'Gate 1', health:'Saudável', goLive:'15/10/2026' },
 { name:'Rollout RH', client:'Rede Horizonte', status:'Homologação', gate:'Gate 4', health:'Crítico', goLive:'20/06/2026' },
];
export const mockGaps = [
 { code:'GAP-001', description:'Adequação fiscal regional não prevista', origin:'Fit Gap', impact:'Alto', solution:'Parametrização complementar e validação fiscal', status:'Em análise', gate:'Gate 3' },
 { code:'GAP-002', description:'Integração legada sem layout padronizado', origin:'Integração', impact:'Médio', solution:'Criar conector intermediário', status:'Priorizado', gate:'Gate 2' },
];
export const mockTeams = [
 { front:'Financeiro', owner:'Ana Martins', role:'Consultora líder', company:'TOTVS', email:'ana.martins@totvs.com', status:'Mobilizado' },
 { front:'Fiscal', owner:'Carlos Lima', role:'Key user', company:'Cliente', email:'carlos.lima@cliente.com', status:'Em validação' },
 { front:'Tecnologia', owner:'Bruna Alves', role:'Arquiteta', company:'Parceiro', email:'bruna.alves@parceiro.com', status:'Mobilizado' },
];
