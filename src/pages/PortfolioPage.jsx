import { useEffect, useMemo, useState } from 'react';
import PageTitle from '../components/ui/PageTitle';
import StatusBadge from '../components/ui/StatusBadge';
import { mockProjects } from '../data/mockProjects';
import { navigateTo } from '../utils/navigation';
import { toBrowserPath } from '../utils/basePath';
import { setActiveProject } from '../utils/projectContext';
import { loadPortfolioProjectsFromSupabase, resolveSupabaseSettings } from '../services/tapSupabaseService';

const PORTFOLIO_CACHE_KEY = 'adaptiveOne.portfolio.projects';

const variant = (health) => (health === 'Crítico' || health === 'Bloqueado' ? 'critico' : health === 'Atenção' ? 'atencao' : 'sucesso');

function projectPath(projectId, destination = 'agf') {
  return destination === 'detail' ? `/projetos/${projectId}` : `/projetos/${projectId}/agf`;
}

function selectProject(projectId, destination = 'agf') {
  setActiveProject(projectId);
  navigateTo(projectPath(projectId, destination));
}

function safeParse(value, fallback = []) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn('Não foi possível carregar projetos locais criados pela TAP.', error);
    return fallback;
  }
}

function normalizeSupabaseProject(project) {
  return {
    id: project.code || project.id,
    code: project.code || project.id,
    name: project.name || project.code || 'Projeto sem nome',
    clientName: 'Cliente informado na TAP',
    status: 'Em planejamento',
    currentGate: 1,
    agfLevel: 'Simple',
    healthStatus: 'Saudável',
    plannedGoLive: 'A definir',
    progress: 0,
    origin: 'Supabase',
  };
}

function mergeProjects(...projectGroups) {
  const byId = new Map();
  projectGroups.flat().forEach((project) => {
    if (!project?.id) return;
    byId.set(project.id, { ...byId.get(project.id), ...project });
  });
  return [...byId.values()];
}

export default function PortfolioPage() {
  const [tapProjects, setTapProjects] = useState(() => safeParse(localStorage.getItem(PORTFOLIO_CACHE_KEY)));

  useEffect(() => {
    const settings = resolveSupabaseSettings();
    if (!settings.url || !settings.key) return;
    loadPortfolioProjectsFromSupabase()
      .then((projects) => {
        const normalized = (projects || []).map(normalizeSupabaseProject);
        setTapProjects((current) => {
          const next = mergeProjects(normalized, current);
          localStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(next));
          return next;
        });
      })
      .catch((error) => console.warn('Não foi possível carregar projetos do Supabase para o portfólio.', error));
  }, []);

  const projects = useMemo(() => mergeProjects(mockProjects, tapProjects), [tapProjects]);

  return (
    <>
      <PageTitle
        title="Portfólio de Projetos"
        subtitle="Selecione um projeto para definir o contexto de trabalho e acessar a Jornada AGF vinculada. Projetos criados pela TAP aparecem automaticamente nesta lista."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
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
              {p.origin === 'TAP' || p.origin === 'Supabase' ? <div><dt className="text-slate-500">Origem</dt><dd className="font-medium text-slate-800">{p.origin}</dd></div> : null}
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
