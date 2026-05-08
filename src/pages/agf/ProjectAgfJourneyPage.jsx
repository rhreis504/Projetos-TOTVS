import PageTitle from '../../components/ui/PageTitle';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { agfGates } from '../../data/agfGates';
import { mockProjects } from '../../data/mockProjects';
import { calculateGate3Health } from '../../utils/gate3Health';
import { getGate3Status } from '../../utils/gate3Status';
import { mockGate3PendingItems } from '../../data/mockGate3PendingItems';
import { mockGate3Risks } from '../../data/mockGate3Risks';
import { mockGate3Gaps } from '../../data/mockGate3Gaps';
import { mockGate3Decisions } from '../../data/mockGate3Decisions';
import { mockGate3Dependencies } from '../../data/mockGate3Dependencies';
import { mockGate3Deliverables } from '../../data/mockGate3Deliverables';
import { mockGate3ChangeRequests } from '../../data/mockGate3ChangeRequests';
import { mockGate3Issues } from '../../data/mockGate3Issues';
import { navigateTo } from '../../utils/navigation';

const variant = (v) => (['Crítico', 'Bloqueado'].includes(v) ? 'critico' : v === 'Em atenção' || v === 'Próximo' ? 'atencao' : v === 'Concluído' ? 'sucesso' : 'info');

export default function ProjectAgfJourneyPage({ projectId }) {
  const project = mockProjects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <EmptyState title="Projeto não encontrado" description="Volte ao portfólio para acessar a Jornada AGF de um projeto válido.">
        <button onClick={() => navigateTo('/portfolio')} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          Voltar ao Portfólio
        </button>
      </EmptyState>
    );
  }

  const by = (items) => items.filter((item) => item.projectId === projectId);
  const health = calculateGate3Health({
    pendingItems: by(mockGate3PendingItems),
    risks: by(mockGate3Risks),
    gaps: by(mockGate3Gaps),
    decisions: by(mockGate3Decisions),
    dependencies: by(mockGate3Dependencies),
    deliverables: by(mockGate3Deliverables),
    changeRequests: by(mockGate3ChangeRequests),
    issues: by(mockGate3Issues),
  });
  const statusFor = (gate) => (gate.id < project.currentGate ? 'Concluído' : gate.id > project.currentGate ? 'Próximo' : gate.id === 3 ? getGate3Status(project, health.status) : 'Em andamento');

  return (
    <div className="space-y-6">
      <PageTitle
        title={`Jornada AGF — ${project.name}`}
        subtitle="Esta jornada está vinculada ao projeto selecionado no portfólio e seguirá neste contexto até você escolher outro projeto."
      />
      <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-300">Projeto selecionado no portfólio</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{project.clientName} • {project.code}</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">Gate atual: Gate {project.currentGate} • Saúde simulada Gate 3: {health.status} • Progresso: {project.progress}%</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge variant={variant(project.status)}>{project.status}</StatusBadge>
            <StatusBadge variant={variant(health.status)}>{health.status}</StatusBadge>
            <StatusBadge variant="info">Gate {project.currentGate}</StatusBadge>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => navigateTo('/portfolio')} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">Trocar projeto no Portfólio</button>
          <button onClick={() => navigateTo(`/projetos/${project.id}`)} className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">Ver detalhes do projeto</button>
          <button onClick={() => navigateTo(`/projetos/${project.id}/agf/gate/3`)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Acessar Gate 3</button>
        </div>
      </section>
      <div className="space-y-4">
        {agfGates.map((g) => {
          const status = statusFor(g);
          return (
            <article key={g.id} className={`rounded-2xl border p-6 shadow-sm ${g.id === project.currentGate ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white'}`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Gate {g.id}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">{g.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{g.objective}</p>
                </div>
                <StatusBadge variant={variant(status)}>{status}</StatusBadge>
              </div>
              {g.id === 3 && <button onClick={() => navigateTo(`/projetos/${project.id}/agf/gate/3`)} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Abrir módulo operacional Gate 3</button>}
            </article>
          );
        })}
      </div>
    </div>
  );
}
