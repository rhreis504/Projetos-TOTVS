import { useEffect, useState } from 'react';
import PageTitle from '../components/ui/PageTitle';

const SUPABASE_STORAGE_KEY = 'totvs_cockpit_config';
const defaultSupabaseConfig = {
  url: '',
  apiUrl: '',
  projectRef: '',
  schema: 'public',
  projectsTable: 'projects',
  tapTable: 'tap_entries',
  publishableKey: '',
  anonKey: '',
  secret: '',
  serviceRole: '',
  currentKey: '',
  previousKey: '',
};
const items=['Clientes','Usuários e Perfis','Tipos de Projeto','Nível AGF: Simple, Medium, Hard','Status Padrão','Tipos de Risco','Severidade','Prioridade','Critérios de Aprovação','Templates de Documentos','Soluções / Produtos','Times e Responsáveis','Papéis do Projeto'];

function normalizeSupabaseUrl(rawUrl) {
  const input = String(rawUrl || '').trim();
  if (!input) throw new Error('Informe a Project URL do Supabase.');
  const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  const parsed = new URL(candidate);
  if (parsed.hostname === 'app.supabase.com') throw new Error('Use a Project URL, não app.supabase.com.');
  return `${parsed.protocol}//${parsed.hostname}`;
}

function supabaseProjectRef(rawUrl) {
  return normalizeSupabaseUrl(rawUrl).replace(/^https?:\/\//, '').split('.')[0] || '';
}

function readStoredSupabaseConfig() {
  try {
    const stored = JSON.parse(localStorage.getItem(SUPABASE_STORAGE_KEY) || '{}');
    return { ...defaultSupabaseConfig, ...(stored.supabase || {}) };
  } catch (_error) {
    return defaultSupabaseConfig;
  }
}

function buildSupabaseConfig(form) {
  const url = normalizeSupabaseUrl(form.url);
  const publishableKey = form.publishableKey.trim();
  const secret = form.secret.trim();

  return {
    url,
    apiUrl: form.apiUrl.trim() || `${url}/rest/v1/`,
    projectRef: form.projectRef.trim() || supabaseProjectRef(url),
    schema: form.schema.trim() || 'public',
    projectsTable: form.projectsTable.trim() || 'projects',
    tapTable: form.tapTable.trim() || 'tap_entries',
    publishableKey,
    anonKey: publishableKey,
    secret,
    serviceRole: secret,
    currentKey: '',
    previousKey: '',
  };
}

export default function SettingsPage(){
  const [supabaseForm, setSupabaseForm] = useState(defaultSupabaseConfig);
  const [connectionLog, setConnectionLog] = useState('Preencha as credenciais do Supabase e salve para ativar a integração.');

  useEffect(() => {
    setSupabaseForm(readStoredSupabaseConfig());
  }, []);

  function updateSupabaseField(field, value) {
    setSupabaseForm((current) => ({ ...current, [field]: value }));
  }

  function saveSupabaseConfig() {
    try {
      const supabase = buildSupabaseConfig(supabaseForm);
      const stored = JSON.parse(localStorage.getItem(SUPABASE_STORAGE_KEY) || '{}');
      localStorage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify({ ...stored, supabase }));
      setSupabaseForm(supabase);
      setConnectionLog(`Configuração Supabase salva em ${SUPABASE_STORAGE_KEY}. URL: ${supabase.url}`);
      return supabase;
    } catch (error) {
      setConnectionLog(`Erro ao salvar: ${error.message}`);
      return null;
    }
  }

  async function testSupabaseConnection() {
    try {
      const cfg = buildSupabaseConfig(supabaseForm);
      const key = cfg.secret || cfg.serviceRole || cfg.publishableKey || cfg.anonKey;
      if (!key) throw new Error('Informe uma chave Supabase para testar.');

      const endpoint = `${cfg.url}/rest/v1/${cfg.projectsTable}?select=id,code,name&limit=1`;
      const response = await fetch(endpoint, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });
      const text = await response.text();
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`);

      saveSupabaseConfig();
      setConnectionLog(`Conexão OK. Endpoint: ${endpoint}\nRetorno: ${text}`);
    } catch (error) {
      setConnectionLog(`Falha na conexão: ${error.message}`);
    }
  }

  return <>
    <PageTitle title="Configurações" subtitle="Parâmetros preparados para administração futura do Adaptive One."/>
    <section className="mb-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Supabase</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">Conexão Rossi/TOTVS</h2>
          <p className="mt-2 text-sm text-slate-600">Informe a Project URL, chaves REST e tabelas usadas pela integração. Os dados são salvos no navegador em <code>{SUPABASE_STORAGE_KEY}</code>.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Schema: {supabaseForm.schema || 'public'}</span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-semibold text-slate-700">Project URL
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={supabaseForm.url} onChange={(event)=>updateSupabaseField('url', event.target.value)} placeholder="https://SEU-PROJECT-REF.supabase.co" />
        </label>
        <label className="text-sm font-semibold text-slate-700">Project Ref
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={supabaseForm.projectRef} onChange={(event)=>updateSupabaseField('projectRef', event.target.value)} placeholder="SEU-PROJECT-REF" />
        </label>
        <label className="text-sm font-semibold text-slate-700">Schema REST
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={supabaseForm.schema} onChange={(event)=>updateSupabaseField('schema', event.target.value)} placeholder="public" />
        </label>
        <label className="text-sm font-semibold text-slate-700">Tabela de Projetos
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={supabaseForm.projectsTable} onChange={(event)=>updateSupabaseField('projectsTable', event.target.value)} placeholder="projects" />
        </label>
        <label className="text-sm font-semibold text-slate-700">Tabela TAP
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={supabaseForm.tapTable} onChange={(event)=>updateSupabaseField('tapTable', event.target.value)} placeholder="tap_entries" />
        </label>
        <label className="text-sm font-semibold text-slate-700">Publishable/Anon Key
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="password" value={supabaseForm.publishableKey} onChange={(event)=>updateSupabaseField('publishableKey', event.target.value)} placeholder="eyJ... ou sb_publishable_..." />
        </label>
        <label className="text-sm font-semibold text-slate-700">Service Role/Secret Key
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="password" value={supabaseForm.secret} onChange={(event)=>updateSupabaseField('secret', event.target.value)} placeholder="sb_secret_... ou service_role" />
        </label>
        <label className="text-sm font-semibold text-slate-700">REST API URL
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={supabaseForm.apiUrl} onChange={(event)=>updateSupabaseField('apiUrl', event.target.value)} placeholder="https://SEU-PROJECT-REF.supabase.co/rest/v1/" />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={saveSupabaseConfig} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Salvar Supabase</button>
        <button type="button" onClick={testSupabaseConnection} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Testar Conexão Supabase</button>
      </div>
      <pre className="mt-4 min-h-24 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">{connectionLog}</pre>
    </section>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">{items.map(i=><article key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"><h3 className="font-semibold text-slate-900">{i}</h3><p className="text-sm text-slate-600 mt-2">Configuração mockada para futura integração com backend e Supabase.</p></article>)}</div>
  </>;
}
