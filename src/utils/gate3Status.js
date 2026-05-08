export function getGate3Status(project, healthStatus) {
  if (!project) return 'Não iniciado';
  if (project.currentGate < 3) return 'Próximo';
  if (project.currentGate > 3) return 'Concluído';
  if (healthStatus === 'Bloqueado') return 'Bloqueado';
  if (healthStatus === 'Crítico') return 'Crítico';
  if (healthStatus === 'Atenção') return 'Em atenção';
  if (healthStatus === 'Saudável') return 'Em andamento';
  return 'Em andamento';
}
