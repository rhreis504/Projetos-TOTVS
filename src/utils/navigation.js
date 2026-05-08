import { toBrowserPath } from './basePath';

function emitRouteChange() {
  const event = typeof PopStateEvent === 'function' ? new PopStateEvent('popstate') : new Event('popstate');
  window.dispatchEvent(event);
}

export function navigateTo(path, { replace = false } = {}) {
  const browserPath = toBrowserPath(path);
  const historyAction = replace ? 'replaceState' : 'pushState';

  if (window.location.pathname !== browserPath || window.location.search || window.location.hash) {
    window.history[historyAction]({}, '', browserPath);
  }

  emitRouteChange();
}
