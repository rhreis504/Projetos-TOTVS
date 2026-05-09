const CONFIG_STORAGE_KEY = 'totvs_cockpit_config';
const DEFAULT_PROJECTS_TABLE = 'projects';
const DEFAULT_TAP_TABLE = 'tap_entries';

function safeJsonParse(value, fallback = null) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn('Não foi possível interpretar a configuração do Cockpit.', error);
    return fallback;
  }
}

function readParentConfig() {
  if (typeof window === 'undefined') return null;
  if (window.parent && window.parent !== window) return window.parent.config || window.parent.totvs_cockpit_config || null;
  return null;
}

export function readCockpitConfig() {
  if (typeof window === 'undefined') return {};
  const localConfig = safeJsonParse(window.localStorage?.getItem(CONFIG_STORAGE_KEY), {});
  const parentConfig = readParentConfig() || {};
  const windowConfig = window.config || window.totvs_cockpit_config || {};
  return {
    ...parentConfig,
    ...windowConfig,
    ...localConfig,
    supabase: {
      ...(parentConfig.supabase || {}),
      ...(windowConfig.supabase || {}),
      ...(localConfig.supabase || {}),
    },
  };
}

function normalizeProjectRef(value) {
  if (!value) return '';
  const ref = String(value).trim();
  if (/^[a-z0-9-]{10,}$/i.test(ref) && !ref.includes('.')) return ref;
  const dashboardMatch = ref.match(/app\.supabase\.com\/project\/([a-z0-9-]+)/i);
  if (dashboardMatch?.[1]) return dashboardMatch[1];
  const supabaseHostMatch = ref.match(/https?:\/\/([a-z0-9-]+)\.supabase\.co/i);
  if (supabaseHostMatch?.[1]) return supabaseHostMatch[1];
  return '';
}

export function resolveSupabaseSettings(config = readCockpitConfig()) {
  const supabase = config.supabase || {};
  const rawUrl = supabase.url || supabase.apiUrl || supabase.restUrl || '';
  const projectRef = supabase.projectRef || normalizeProjectRef(rawUrl);
  let url = String(rawUrl || '').trim().replace(/\/$/, '');

  if (!url && projectRef) url = `https://${projectRef}.supabase.co`;
  if (/app\.supabase\.com\/project\//i.test(url)) {
    const dashboardRef = normalizeProjectRef(url);
    url = dashboardRef ? `https://${dashboardRef}.supabase.co` : url;
  }
  if (url && !/^https?:\/\//i.test(url) && !url.includes('supabase.co')) url = `https://${url}.supabase.co`;

  const key = supabase.secret || supabase.service_role || supabase.serviceRole || supabase.publishableKey || supabase.anonKey || supabase.key || '';
  return {
    url,
    key,
    schema: supabase.schema || 'public',
    projectsTable: supabase.projectsTable || DEFAULT_PROJECTS_TABLE,
    tapTable: supabase.tapTable || DEFAULT_TAP_TABLE,
  };
}

export function getProjectCode(config = readCockpitConfig(), fallbackProjectId = '') {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search || '');
    const queryProject = params.get('primaryProject') || params.get('project') || params.get('projectId');
    if (queryProject) return queryProject;
  }
  return config.activeProjectId || fallbackProjectId || config.projectId || 'TAP-PROJECT';
}

export function getProjectName(config = readCockpitConfig(), projectCode = '') {
  const project = (config.projects || []).find((item) => item.id === projectCode || item.code === projectCode);
  return project?.name || project?.title || projectCode || 'Projeto TAP';
}

function assertSupabase(settings) {
  if (!settings.url || !settings.key) {
    throw new Error('Supabase não configurado. Informe supabase.url ou supabase.projectRef e uma credencial válida em totvs_cockpit_config.');
  }
}

async function request(path, { method = 'GET', body, prefer, settings = resolveSupabaseSettings() } = {}) {
  assertSupabase(settings);
  const headers = {
    apikey: settings.key,
    Authorization: `Bearer ${settings.key}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (settings.schema && settings.schema !== 'public') {
    headers['Accept-Profile'] = settings.schema;
    headers['Content-Profile'] = settings.schema;
  }
  if (prefer) headers.Prefer = prefer;

  const response = await fetch(`${settings.url}/rest/v1/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  const payload = text ? safeJsonParse(text, text) : null;
  if (!response.ok) {
    const message = payload?.message || payload?.hint || payload?.details || text || `Erro HTTP ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

export async function resolveProject({ createIfMissing = false, projectCode, projectName } = {}) {
  const config = readCockpitConfig();
  const settings = resolveSupabaseSettings(config);
  const code = projectCode || getProjectCode(config);
  const name = projectName || getProjectName(config, code);
  const table = encodeURIComponent(settings.projectsTable);
  const selectPath = `${table}?code=eq.${encodeURIComponent(code)}&select=id,code,name&limit=1`;
  const existing = await request(selectPath, { settings });
  if (existing?.[0]) return existing[0];
  if (!createIfMissing) return null;
  const created = await request(table, {
    method: 'POST',
    body: [{ code, name }],
    prefer: 'return=representation,resolution=merge-duplicates',
    settings,
  });
  return created?.[0] || null;
}

export async function loadTapEntries({ projectCode } = {}) {
  const project = await resolveProject({ createIfMissing: false, projectCode });
  if (!project?.id) return [];
  const settings = resolveSupabaseSettings();
  const table = encodeURIComponent(settings.tapTable);
  const rows = await request(`${table}?project_id=eq.${encodeURIComponent(project.id)}&select=id,payload,created_at&order=created_at.desc.nullslast`, { settings });
  return (rows || []).map((row) => ({ ...(row.payload || {}), id: row.id, _dbId: row.id, createdAt: row.payload?.createdAt || row.created_at }));
}

export async function saveTapEntry(tapData, { projectCode, projectName } = {}) {
  const project = await resolveProject({ createIfMissing: true, projectCode, projectName });
  if (!project?.id) throw new Error('Não foi possível resolver ou criar o projeto ativo no Supabase.');
  const settings = resolveSupabaseSettings();
  const table = encodeURIComponent(settings.tapTable);
  const payload = { ...tapData, projectId: project.code, projectDbId: project.id };
  const row = { project_id: project.id, payload };
  if (tapData._dbId) {
    const result = await request(`${table}?id=eq.${encodeURIComponent(tapData._dbId)}`, {
      method: 'PATCH',
      body: row,
      prefer: 'return=representation',
      settings,
    });
    return { ...(result?.[0]?.payload || payload), id: result?.[0]?.id || tapData._dbId, _dbId: result?.[0]?.id || tapData._dbId };
  }
  const result = await request(table, {
    method: 'POST',
    body: [row],
    prefer: 'return=representation,resolution=merge-duplicates',
    settings,
  });
  return { ...(result?.[0]?.payload || payload), id: result?.[0]?.id || payload.id, _dbId: result?.[0]?.id || payload.id };
}

export async function deleteTapEntry(tapData) {
  const dbId = tapData?._dbId || tapData?.id;
  if (!dbId) return;
  const settings = resolveSupabaseSettings();
  const table = encodeURIComponent(settings.tapTable);
  await request(`${table}?id=eq.${encodeURIComponent(dbId)}`, { method: 'DELETE', settings });
}

export async function loadPortfolioProjectsFromSupabase() {
  const settings = resolveSupabaseSettings();
  const table = encodeURIComponent(settings.projectsTable);
  return request(`${table}?select=id,code,name,created_at&order=created_at.desc.nullslast`, { settings });
}
