export const mockProjects = [
  { id: 'PRJ-001', code: 'ROSSI-RH-2026', name: 'Implantação RH Rossi', clientId: 'CLI-001', clientName: 'Rossi Supermercados', client: 'Rossi Supermercados', description: 'Implantação integrada das soluções de RH, folha, ponto, admissão digital, ATS, LMS/LXP, Feedz, Quirons e Ahgora.', projectManager: 'Regis Reis', programManager: 'Regis Reis', sponsor: 'Dalete Titton', status: 'Em execução', agfLevel: 'Hard', currentGate: 3, gate: 'Gate 3', healthStatus: 'Atenção', health: 'Atenção', origin: 'Manual', startDate: '2026-05-08', plannedGoLive: 'A definir', goLive: 'A definir', progress: 38, lastUpdate: '2026-05-08' },
  { id: 'PRJ-002', code: 'AURORA-ERP-2026', name: 'Implantação ERP Protheus', clientId: 'CLI-002', clientName: 'Grupo Aurora', client: 'Grupo Aurora', description: 'Implantação de ERP com foco financeiro, fiscal e suprimentos.', projectManager: 'Ana Martins', programManager: 'Marcos Lima', sponsor: 'Renata Costa', status: 'Em planejamento', agfLevel: 'Medium', currentGate: 1, gate: 'Gate 1', healthStatus: 'Saudável', health: 'Saudável', origin: 'HUBX', startDate: '2026-04-20', plannedGoLive: '2026-08-30', goLive: '30/08/2026', progress: 14, lastUpdate: '2026-05-06' },
  { id: 'PRJ-003', code: 'HORIZONTE-RH-2026', name: 'Rollout RH', clientId: 'CLI-003', clientName: 'Rede Horizonte', client: 'Rede Horizonte', description: 'Rollout de RH e folha para novas unidades.', projectManager: 'Bruna Alves', programManager: 'Carlos Lima', sponsor: 'Paula Rocha', status: 'Crítico', agfLevel: 'Simple', currentGate: 4, gate: 'Gate 4', healthStatus: 'Crítico', health: 'Crítico', origin: 'Manual', startDate: '2026-03-12', plannedGoLive: '2026-06-20', goLive: '20/06/2026', progress: 72, lastUpdate: '2026-05-07' },
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
