import { navigateTo } from '../../utils/navigation';
import { mockProjects } from '../../data/mockProjects';
import { setActiveProject } from '../../utils/projectContext';

function openProjectGate3(projectId) {
  setActiveProject(projectId);
  navigateTo(`/projetos/${projectId}/agf/gate/3`);
}

export default function ProjectSelector() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">Selecione um projeto para visualizar o Gate 3.</h1>
      <p className="mt-2 text-sm text-slate-600">O Gate 3 é um módulo operacional vinculado ao projeto selecionado no portfólio.</p>
      <button onClick={() => navigateTo('/portfolio')} className="mt-6 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
        Acessar Portfólio de Projetos
      </button>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {mockProjects.map((project) => (
          <button key={project.id} onClick={() => openProjectGate3(project.id)} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left hover:border-blue-300 hover:bg-blue-50">
            <span className="text-sm font-semibold text-slate-900">{project.name}</span>
            <span className="mt-1 block text-xs text-slate-500">{project.clientName}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
