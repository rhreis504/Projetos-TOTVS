import PageTitle from '../../components/ui/PageTitle';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import ProjectSelector from '../../components/gate3/ProjectSelector';
import ProjectContextHeader from '../../components/gate3/ProjectContextHeader';
import Gate3KpiCards from '../../components/gate3/Gate3KpiCards';
import Gate3StepsPanel from '../../components/gate3/Gate3StepsPanel';
import Gate3Tabs from '../../components/gate3/Gate3Tabs';
import Gate3AcceptanceCriteria from '../../components/gate3/Gate3AcceptanceCriteria';
import Gate3HealthPanel from '../../components/gate3/Gate3HealthPanel';
import { mockProjects } from '../../data/mockProjects';
import { mockClients } from '../../data/mockClients';
import { mockProjectTeam } from '../../data/mockProjectTeam';
import { mockProjectWorkstreams } from '../../data/mockProjectWorkstreams';
import { mockGate3Activities } from '../../data/mockGate3Activities';
import { mockGate3PendingItems } from '../../data/mockGate3PendingItems';
import { mockGate3Risks } from '../../data/mockGate3Risks';
import { mockGate3Gaps } from '../../data/mockGate3Gaps';
import { mockGate3Decisions } from '../../data/mockGate3Decisions';
import { mockGate3Issues } from '../../data/mockGate3Issues';
import { mockGate3ChangeRequests } from '../../data/mockGate3ChangeRequests';
import { mockGate3Deliverables } from '../../data/mockGate3Deliverables';
import { mockGate3Dependencies } from '../../data/mockGate3Dependencies';
import { mockGate3StatusReports } from '../../data/mockGate3StatusReports';
import { mockGate3ActionPlans } from '../../data/mockGate3ActionPlans';
import { mockGate3Meetings } from '../../data/mockGate3Meetings';
import { agfGates } from '../../data/agfGates';
import { calculateGate3Health } from '../../utils/gate3Health';
import { getGate3Status } from '../../utils/gate3Status';
import { navigateTo } from '../../utils/navigation';

const filterByProject = (items, projectId) => items.filter((item) => item.projectId === projectId);

export default function Gate3Page({ projectId }) {
  if (!projectId) return <ProjectSelector />;
  const project = mockProjects.find((item) => item.id === projectId);
  if (!project) return <EmptyState title="Projeto não encontrado" description="O projectId informado não existe nos dados mockados. Volte ao portfólio e selecione um projeto válido."><button onClick={()=>navigateTo('/portfolio')} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Voltar ao Portfólio</button></EmptyState>;

  const data = {
    client: mockClients.find((item) => item.id === project.clientId), team: filterByProject(mockProjectTeam, projectId), workstreams: filterByProject(mockProjectWorkstreams, projectId),
    activities: filterByProject(mockGate3Activities, projectId), pendingItems: filterByProject(mockGate3PendingItems, projectId), risks: filterByProject(mockGate3Risks, projectId), gaps: filterByProject(mockGate3Gaps, projectId), decisions: filterByProject(mockGate3Decisions, projectId), issues: filterByProject(mockGate3Issues, projectId), changeRequests: filterByProject(mockGate3ChangeRequests, projectId), deliverables: filterByProject(mockGate3Deliverables, projectId), dependencies: filterByProject(mockGate3Dependencies, projectId), statusReports: filterByProject(mockGate3StatusReports, projectId), actionPlans: filterByProject(mockGate3ActionPlans, projectId), meetings: filterByProject(mockGate3Meetings, projectId),
  };
  const health = calculateGate3Health(data);
  const gateStatus = getGate3Status(project, health.status);
  const gate3Steps = agfGates.find((gate) => gate.id === 3)?.steps || [];

  return <div className="space-y-6"><PageTitle title="Gate 3 — Execução Controlada" subtitle="Construção, validações, integrações, gestão diária da implantação e controle operacional do projeto."/><section className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-300">Execução Controlada e Gestão Operacional do Projeto</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Gate 3 — Execução Controlada</h1><p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">Motor operacional do projeto dentro do Adaptive One, consolidando atividades, riscos, pendências, gaps, decisões, mudanças, dependências, entregáveis e status semanal.</p></div><div className="flex flex-wrap gap-2"><StatusBadge variant="info">{gateStatus}</StatusBadge><StatusBadge variant="neutro">{data.team.length} integrantes</StatusBadge></div></div><div className="mt-6 flex flex-wrap gap-3"><button onClick={()=>navigateTo('/portfolio')} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">Voltar ao Portfólio</button><button onClick={()=>navigateTo(`/projetos/${project.id}/agf`)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Voltar à Jornada AGF</button></div></section><ProjectContextHeader project={project} healthStatus={health.status}/><Gate3KpiCards project={project} data={data}/><Gate3StepsPanel steps={gate3Steps}/><Gate3Tabs project={project} workstreams={data.workstreams} data={data} health={health}/><Gate3AcceptanceCriteria/><Gate3HealthPanel health={health} data={data}/></div>;
}
