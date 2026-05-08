const rawBaseUrl = import.meta.env.BASE_URL || '/';

function normalizeBasePath(baseUrl) {
  if (!baseUrl || baseUrl === '/') return '';
  return `/${baseUrl.replace(/^\/+|\/+$/g, '')}`;
}

export const basePath = normalizeBasePath(rawBaseUrl);

export function toAppPath(browserPath = window.location.pathname) {
  if (!basePath) return browserPath || '/';
  if (browserPath === basePath) return '/';
  if (browserPath.startsWith(`${basePath}/`)) {
    return browserPath.slice(basePath.length) || '/';
  }
  return browserPath || '/';
}

export function toBrowserPath(appPath = '/') {
  const normalizedPath = appPath.startsWith('/') ? appPath : `/${appPath}`;
  if (!basePath) return normalizedPath;
  return normalizedPath === '/' ? `${basePath}/` : `${basePath}${normalizedPath}`;
}

export function getCurrentAppPath() {
  return toAppPath(window.location.pathname);
}

export function getRedirectedAppPath() {
  const redirectedPath = new URLSearchParams(window.location.search).get('redirect');
  if (!redirectedPath) return null;
  return redirectedPath.startsWith('/') ? redirectedPath : `/${redirectedPath}`;
}
