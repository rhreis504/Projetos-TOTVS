export function calculateGate3Health({ pendingItems = [], risks = [], gaps = [], decisions = [], dependencies = [], deliverables = [], changeRequests = [], issues = [] }) {
  const factors = [];
  const hasBlockedDependency = dependencies.some((item) => item.status === 'Bloqueada');
  const hasCriticalIssue = issues.some((item) => item.status === 'Crítica');
  const hasCriticalOpenRisk = risks.some((item) => item.severity === 'Crítica' && ['Aberto', 'Monitorando', 'Materializado'].includes(item.status));
  const hasCriticalOverduePending = pendingItems.some((item) => item.priority === 'Crítica' && item.status === 'Vencida');
  const hasOverdueDecision = decisions.some((item) => item.status === 'Vencida');
  const hasOverduePending = pendingItems.some((item) => item.status === 'Vencida');
  const hasHighRisk = risks.some((item) => item.severity === 'Alta' || item.impact === 'Alto');
  const hasGapInAnalysis = gaps.some((item) => item.status === 'Em análise' && item.requiredDecision);
  const hasChangeInAnalysis = changeRequests.some((item) => item.status === 'Em análise');
  const hasLateDeliverable = deliverables.some((item) => item.status === 'Atrasado');

  if (hasBlockedDependency) factors.push('Existem dependências bloqueadas');
  if (hasCriticalIssue) factors.push('Existem issues críticas materializadas');
  if (hasCriticalOpenRisk) factors.push('Existem riscos críticos abertos ou em monitoramento');
  if (hasCriticalOverduePending) factors.push('Existem pendências críticas vencidas');
  if (hasOverdueDecision) factors.push('Existem decisões vencidas');
  if (hasOverduePending) factors.push('Existem pendências vencidas');
  if (hasHighRisk) factors.push('Existem riscos de alto impacto');
  if (hasGapInAnalysis) factors.push('Existem gaps em análise sem decisão final');
  if (hasChangeInAnalysis) factors.push('Existem mudanças de escopo em análise');
  if (hasLateDeliverable) factors.push('Existem entregáveis atrasados');

  if (hasBlockedDependency || hasCriticalIssue) return { status: 'Bloqueado', factors };
  if (hasCriticalOpenRisk || hasCriticalOverduePending || hasOverdueDecision) return { status: 'Crítico', factors };
  if (hasOverduePending || hasHighRisk || hasGapInAnalysis || hasChangeInAnalysis || hasLateDeliverable) return { status: 'Atenção', factors };
  return { status: 'Saudável', factors: factors.length ? factors : ['Sem fatores críticos identificados nos dados simulados'] };
}
