import PageTitle from '../components/ui/PageTitle';
import StatusBadge from '../components/ui/StatusBadge';
import { mockProjects } from '../data/mockProjects';
import { navigateTo } from '../utils/navigation';
import { toBrowserPath } from '../utils/basePath';
import { setActiveProject } from '../utils/projectContext';

const variant = (health) => (health === 'Crítico' || health === 'Bloqueado' ? 'critico' : health === 'Atenção' ? 'atencao' : 'sucesso');

function projectPath(projectId, destination = 'agf') {
  return destination === 'detail' ? `/projetos/${projectId}` : `/projetos/${projectId}/agf`;
}

function selectProject(projectId, destination = 'agf') {
  setActiveProject(projectId);
  navigateTo(projectPath(projectId, destination));
}

export default function PortfolioPage() {
  return (
    <>
      <PageTitle
        title="Portfólio de Projetos"
        subtitle="Selecione um projeto para definir o contexto de trabalho e acessar a Jornada AGF vinculada."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockProjects.map((p) => (
          <article
            key={p.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{p.code}</p>
                <h3 className="mt-1 font-semibold text-slate-900">{p.name}</h3>
              </div>
              <StatusBadge variant={variant(p.healthStatus)}>{p.healthStatus}</StatusBadge>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div><dt className="text-slate-500">Cliente</dt><dd className="font-medium text-slate-800">{p.clientName}</dd></div>
              <div><dt className="text-slate-500">Status</dt><dd className="font-medium text-slate-800">{p.status}</dd></div>
              <div><dt className="text-slate-500">Gate atual</dt><dd className="font-medium text-slate-800">Gate {p.currentGate}</dd></div>
              <div><dt className="text-slate-500">Nível AGF</dt><dd className="font-medium text-slate-800">{p.agfLevel}</dd></div>
              <div><dt className="text-slate-500">Go Live previsto</dt><dd className="font-medium text-slate-800">{p.plannedGoLive}</dd></div>
              <div><dt className="text-slate-500">Progresso</dt><dd className="font-medium text-slate-800">{p.progress}%</dd></div>
            </dl>
            <div className="mt-6 grid grid-cols-1 gap-3">
              <a
                href={toBrowserPath(projectPath(p.id))}
                onClick={(event) => {
                  event.preventDefault();
                  selectProject(p.id);
                }}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Abrir projeto / Jornada AGF
              </a>
              <a
                href={toBrowserPath(projectPath(p.id, 'detail'))}
                onClick={(event) => {
                  event.preventDefault();
                  selectProject(p.id, 'detail');
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Ver detalhes do projeto
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
