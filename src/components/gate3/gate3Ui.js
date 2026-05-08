export const statusVariant = (value = '') => {
  if (['Saudável', 'Concluída', 'Concluído', 'Validado', 'OK', 'Resolvida', 'Resolvido', 'Mitigado', 'Encerrado'].includes(value)) return 'sucesso';
  if (['Atenção', 'Em andamento', 'Em análise', 'Monitorando', 'Em curso', 'Pronto para validação', 'Solicitada', 'Aberta', 'Ativa', 'Pendente', 'Não iniciada', 'Não iniciado', 'Próximo'].includes(value)) return 'atencao';
  if (['Crítico', 'Crítica', 'Vencida', 'Atrasada', 'Atrasado', 'Bloqueada', 'Bloqueado', 'Materializado', 'Reprovado'].includes(value)) return 'critico';
  return 'info';
};
export const workstreamName = (workstreams, id) => workstreams.find((item) => item.id === id)?.name || 'Frente não informada';
