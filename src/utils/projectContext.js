import { mockProjects } from '../data/mockProjects';

const ACTIVE_PROJECT_KEY = 'adaptiveOne.activeProjectId';

export function getProjectById(projectId) {
  return mockProjects.find((project) => project.id === projectId) || null;
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
