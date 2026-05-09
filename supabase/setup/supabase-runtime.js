export const SUPABASE_STORAGE_KEY = 'totvs_cockpit_config';

export function normalizeSupabaseUrl(rawUrl) {
  const input = String(rawUrl || '').trim();
  if (!input) throw new Error('Informe a Project URL do Supabase.');
  const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  const parsed = new URL(candidate);
  if (parsed.hostname === 'app.supabase.com') throw new Error('Use a Project URL, não app.supabase.com.');
  return `${parsed.protocol}//${parsed.hostname}`;
}

export function getSupabaseProjectRef(rawUrl) {
  return normalizeSupabaseUrl(rawUrl).replace(/^https?:\/\//, '').split('.')[0] || '';
}

export function buildSupabaseConfig(formConfig) {
  const url = normalizeSupabaseUrl(formConfig.url);
  const publishableKey = formConfig.publishableKey || formConfig.anonKey || '';
  const secret = formConfig.secret || formConfig.serviceRole || '';

  return {
    url,
    apiUrl: formConfig.apiUrl || `${url}/rest/v1/`,
    projectRef: formConfig.projectRef || getSupabaseProjectRef(url),
    schema: formConfig.schema || 'public',
    projectsTable: formConfig.projectsTable || 'projects',
    tapTable: formConfig.tapTable || 'tap_entries',
    publishableKey,
    anonKey: publishableKey,
    secret,
    serviceRole: secret,
    currentKey: formConfig.currentKey || '',
    previousKey: formConfig.previousKey || '',
  };
}

export function readSupabaseSettings(storage = globalThis.localStorage) {
  const stored = JSON.parse(storage.getItem(SUPABASE_STORAGE_KEY) || '{}');
  return stored.supabase || {};
}

export function saveSupabaseSettings(supabase, storage = globalThis.localStorage) {
  const stored = JSON.parse(storage.getItem(SUPABASE_STORAGE_KEY) || '{}');
  storage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify({ ...stored, supabase }));
  return supabase;
}
