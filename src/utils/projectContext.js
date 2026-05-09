import { mockProjects } from '../data/mockProjects';

const ACTIVE_PROJECT_KEY = 'adaptiveOne.activeProjectId';
const PORTFOLIO_CACHE_KEY = 'adaptiveOne.portfolio.projects';

function safeParseProjects() {
  try {
    return JSON.parse(localStorage.getItem(PORTFOLIO_CACHE_KEY) || '[]');
  } catch (error) {
    console.warn('Não foi possível ler projetos criados pela TAP.', error);
    return [];
  }
}

export function getAllProjects() {
  const byId = new Map();
  [...mockProjects, ...safeParseProjects()].forEach((project) => {
    if (project?.id) byId.set(project.id, { ...byId.get(project.id), ...project });
  });
  return [...byId.values()];
}

export function getProjectById(projectId) {
  return getAllProjects().find((project) => project.id === projectId || project.code === projectId) || null;
}

export function getActiveProjectId() {
  const projectId = localStorage.getItem(ACTIVE_PROJECT_KEY);
  return getProjectById(projectId) ? projectId : null;
}

export function getActiveProject() {
  return getProjectById(getActiveProjectId());
}

export function setActiveProject(projectId) {
  if (getProjectById(projectId)) {
    localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
  }
}

export function clearActiveProject() {
  localStorage.removeItem(ACTIVE_PROJECT_KEY);
}
