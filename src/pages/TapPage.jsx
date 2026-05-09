import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Filter,
  Link as LinkIcon,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageTitle from '../components/ui/PageTitle';
import { getActiveProject } from '../utils/projectContext';
import {
  deleteTapEntry,
  getProjectCode,
  getProjectName,
  loadTapEntries,
  readCockpitConfig,
  resolveSupabaseSettings,
  saveTapEntry,
} from '../services/tapSupabaseService';

const TAP_STORAGE_KEY = 'adaptiveOne.tap.entries';
const TAP_OPTIONS_KEY = 'adaptiveOne.tap.quickOptions';
const PORTFOLIO_CACHE_KEY = 'adaptiveOne.portfolio.projects';

const baseProducts = [
  'TOTVS RM - Folha de Pagamento',
  'TOTVS RM - Cargos e Salários',
  'APP Meu RH',
  'ATS - Atração de Talentos',
  'LMS / LXP',
  'Feedz by TOTVS',
  'Quirons - Saúde e Segurança do Trabalho',
  'Ahgora - Ponto Eletrônico',
  'Dgite - Admissão Digital',
  'Swile',
  'Cloud Tradicional',
  'TOTVS Cloud RM Standard',
  'TOTVS Cloud Adicional Standard',
  'Outros',
];

const optionFields = {
  codCliente: ['CLI-ROSSI', 'CLI-AURORA', 'CLI-HORIZONTE'],
  nomeProjeto: ['Implantação RH Rossi', 'Implantação ERP Protheus', 'Rollout RH'],
  gpp: ['GPP Sul', 'GPP Enterprise', 'GPP RH'],
  coordenador: ['Camila Azevedo', 'Rafael Nunes', 'Bianca Souza'],
  esn: ['ESN HCM', 'ESN ERP', 'ESN Cloud'],
  arquiteto: ['Marina Torres', 'Paulo Nunes', 'Leandro Costa'],
  gerenteProjeto: ['Daniel Mota', 'Fernanda Lima'],
  gerentePrograma: ['Patrícia Campos', 'Eduardo Prado'],
  pmo: ['PMO Corporativo', 'PMO HCM'],
  sponsorCliente: ['Diretoria de RH', 'Diretoria Financeira'],
  sponsorTotvs: ['Diretoria TOTVS', 'Head de Implantação'],
  responsavelFrente: ['Consultoria HCM', 'Arquitetura Cloud', 'Squad Integrações'],
};

const emptyTap = {
  id: '',
  dataTap: '',
  codCliente: [],
  nomeProjeto: '',
  gpp: '',
  coordenador: '',
  esn: '',
  arquiteto: '',
  drive: '',
  criticidadeCliente: 'BAIXA',
  criticidadeTotvs: 'BAIXA',
  produtos: [],
  detalhesProdutos: {},
  valorProjeto: '',
  receitaAtual: '',
  margemVenda: '',
  margemAtual: '',
  margemVendaValor: '',
  margemAtualValor: '',
  mrrMensal: '',
  mrrTotal: '',
  psaPlanejado: '',
  diferencaPsa: '',
  investimentoPerdas: '',
  investimentoComercial: '',
  investimentoErro: '',
  projetoEmPerda: 'Não',
  dataInicio: '',
  goLive: '',
  duracao: '',
  posProducao: '',
  encerramento: '',
  sponsorCliente: '',
  sponsorTotvs: '',
  gerenteProjeto: '',
  gerentePrograma: '',
  pmo: '',
  keyUsers: '',
  canalComunicacao: '',
  periodicidadeStatusReport: '',
  ritoExecutivoDefinido: 'Não',
  kickoffRealizado: 'Não',
  observacao: '',
  premissas: '',
  restricoes: '',
  riscosIniciais: '',
  pontosAtencao: '',
  decisoesRegistradas: '',
};

const initialFilters = {
  cliente: '',
  gpp: '',
  criticidadeCliente: '',
  criticidadeTotvs: '',
  projetoEmPerda: '',
  nomeProjeto: '',
  produto: '',
};

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error('Falha ao interpretar dados locais da TAP.', error);
    return fallback;
  }
}

function getCurrentProjectCode(fallbackProjectId = '') {
  return getProjectCode(readCockpitConfig(), fallbackProjectId);
}

function hasSupabaseConfiguration() {
  const settings = resolveSupabaseSettings(readCockpitConfig());
  return Boolean(settings.url && settings.key);
}

async function readTapEntries(projectCode) {
  return loadTapEntries({ projectCode });
}

function mirrorTapProjectToPortfolio(tap) {
  const cache = safeParse(localStorage.getItem(PORTFOLIO_CACHE_KEY), []);
  const projectCode = tap.projectId || tap.nomeProjeto || tap.id;
  const project = {
    id: projectCode,
    code: projectCode,
    name: tap.nomeProjeto || projectCode,
    clientId: (tap.codCliente || [])[0] || '',
    clientName: (tap.codCliente || []).join(', ') || 'Cliente não informado',
    client: (tap.codCliente || []).join(', ') || 'Cliente não informado',
    description: tap.observacao || tap.premissas || 'Projeto criado a partir de TAP.',
    projectManager: tap.coordenador || tap.gerenteProjeto || 'Não informado',
    programManager: tap.gerentePrograma || tap.gpp || 'Não informado',
    sponsor: tap.sponsorCliente || tap.sponsorTotvs || 'Não informado',
    status: tap.projetoEmPerda === 'Sim' ? 'Em atenção' : 'Em planejamento',
    agfLevel: tap.criticidadeCliente === 'ALTA' ? 'Hard' : tap.criticidadeCliente === 'MÉDIA' ? 'Medium' : 'Simple',
    currentGate: 1,
    gate: 'Gate 1',
    healthStatus: tap.projetoEmPerda === 'Sim' || tap.criticidadeCliente === 'ALTA' ? 'Atenção' : 'Saudável',
    health: tap.projetoEmPerda === 'Sim' || tap.criticidadeCliente === 'ALTA' ? 'Atenção' : 'Saudável',
    origin: 'TAP',
    startDate: tap.dataInicio || tap.dataTap || '',
    plannedGoLive: tap.goLive || 'A definir',
    goLive: tap.goLive || 'A definir',
    progress: 0,
    lastUpdate: new Date().toISOString().slice(0, 10),
  };
  const next = [project, ...cache.filter((item) => item.id !== project.id && item.code !== project.code)];
  localStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(next));
}

async function persistTapEntries(entries) {
  localStorage.setItem(TAP_STORAGE_KEY, JSON.stringify(entries));
}

function saveQuickOptions(options) {
  localStorage.setItem(TAP_OPTIONS_KEY, JSON.stringify(options));
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const normalized = String(value).replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
  return Number(normalized) || 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(normalizeNumber(value));
}

function formatDate(value) {
  if (!value) return 'Não informado';
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

function addMonths(dateValue, months) {
  if (!dateValue || !months) return '';
  const date = new Date(`${dateValue}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + Number(months));
  return date.toISOString().slice(0, 10);
}

function createTapId() {
  return crypto?.randomUUID ? crypto.randomUUID() : `tap-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getCriticalityClasses(value) {
  const key = String(value || '').toUpperCase();
  if (key === 'ALTA') return 'bg-red-50 text-red-700 border-red-200';
  if (key === 'MÉDIA' || key === 'MEDIA') return 'bg-teal-50 text-teal-700 border-teal-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
}

function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-md rounded-xl border p-4 shadow-xl ${isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`} role="status">
      <div className="flex items-start gap-3">
        {isError ? <AlertTriangle className="mt-0.5 h-5 w-5" /> : <CheckCircle2 className="mt-0.5 h-5 w-5" />}
        <div>
          <p className="text-sm font-semibold">{toast.message}</p>
          {toast.detail ? <pre className="mt-2 max-h-24 overflow-auto whitespace-pre-wrap text-xs opacity-80">{toast.detail}</pre> : null}
        </div>
        <button type="button" onClick={onClose} className="ml-2 rounded-lg p-1 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Fechar notificação"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

function Field({ label, children, className = '' }) {
  return <label className={`grid gap-2 text-sm font-medium text-slate-700 ${className}`}>{label}{children}</label>;
}

function Input(props) {
  return <input {...props} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${props.className || ''}`} />;
}

function Select(props) {
  return <select {...props} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${props.className || ''}`} />;
}

function Textarea(props) {
  return <textarea {...props} className={`min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${props.className || ''}`} />;
}

function Section({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function QuickInput({ field, value, onChange, options, addOption, placeholder }) {
  const listId = `tap-${field}-options`;
  return (
    <div className="flex gap-2">
      <Input list={listId} value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      <datalist id={listId}>{(options[field] || []).map((option) => <option key={option} value={option} />)}</datalist>
      <button type="button" onClick={() => addOption(field, value)} className="rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" title="Adicionar opção rápida">+</button>
    </div>
  );
}

function TapModal({ draft, setDraft, onClose, onSave, onDelete, quickOptions, addOption, productCatalog, addProductToCatalog }) {
  const [productSearch, setProductSearch] = useState('');
  const [customProduct, setCustomProduct] = useState('');

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function calculateFinancial(field, value) {
    setDraft((current) => {
      const next = { ...current, [field]: value };
      if ((field === 'valorProjeto' || field === 'margemVenda') && next.valorProjeto && next.margemVenda && !current.margemVendaValor) {
        next.margemVendaValor = ((normalizeNumber(next.valorProjeto) * normalizeNumber(next.margemVenda)) / 100).toFixed(2);
      }
      if ((field === 'receitaAtual' || field === 'margemAtual') && next.receitaAtual && next.margemAtual && !current.margemAtualValor) {
        next.margemAtualValor = ((normalizeNumber(next.receitaAtual) * normalizeNumber(next.margemAtual)) / 100).toFixed(2);
      }
      if ((field === 'psaPlanejado' || field === 'valorProjeto') && next.psaPlanejado && next.valorProjeto && !current.diferencaPsa) {
        next.diferencaPsa = (normalizeNumber(next.psaPlanejado) - normalizeNumber(next.valorProjeto)).toFixed(2);
      }
      return next;
    });
  }

  function calculateTimeline(field, value) {
    setDraft((current) => {
      const next = { ...current, [field]: value };
      if ((field === 'dataInicio' || field === 'duracao') && next.dataInicio && next.duracao && !current.goLive) {
        next.goLive = addMonths(next.dataInicio, next.duracao);
      }
      if ((field === 'goLive' || field === 'posProducao') && next.goLive && next.posProducao && !current.encerramento) {
        next.encerramento = addMonths(next.goLive, next.posProducao);
      }
      return next;
    });
  }

  function toggleClient(code) {
    const client = code.trim();
    if (!client) return;
    setDraft((current) => ({
      ...current,
      codCliente: current.codCliente.includes(client) ? current.codCliente.filter((item) => item !== client) : [...current.codCliente, client],
    }));
    addOption('codCliente', client);
  }

  function addProduct(product) {
    const name = product.trim();
    if (!name) return;
    setDraft((current) => {
      if (current.produtos.includes(name)) return current;
      return {
        ...current,
        produtos: [...current.produtos, name],
        detalhesProdutos: {
          ...current.detalhesProdutos,
          [name]: { codigoProposta: '', codClienteProduto: '', idTotvs: '', nomeOferta: '', anexoOferta: '', obs: '', responsavelFrente: '', dependenciaPrincipal: '', pontoAtencao: '', premissa: '' },
        },
      };
    });
  }

  function removeProduct(product) {
    setDraft((current) => {
      const details = { ...current.detalhesProdutos };
      delete details[product];
      return { ...current, produtos: current.produtos.filter((item) => item !== product), detalhesProdutos: details };
    });
  }

  function updateProductDetail(product, field, value) {
    setDraft((current) => ({
      ...current,
      detalhesProdutos: {
        ...current.detalhesProdutos,
        [product]: { ...(current.detalhesProdutos[product] || {}), [field]: value },
      },
    }));
  }

  const filteredProducts = productCatalog.filter((product) => product.toLowerCase().includes(productSearch.toLowerCase()) && !draft.produtos.includes(product));

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="my-6 w-full max-w-6xl rounded-2xl border border-slate-100 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-6 backdrop-blur">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{draft.id ? 'Editar TAP' : 'Nova TAP'}</h2>
            <p className="mt-1 text-sm text-slate-600">Organize a abertura formal do projeto por identificação, escopo, financeiro, timeline e governança.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Fechar formulário"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={(event) => { event.preventDefault(); onSave(); }} className="space-y-6 p-6">
          <Section title="Identificação" description="Dados básicos da abertura do projeto e criticidade inicial.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Data da TAP"><Input type="date" value={draft.dataTap} onChange={(event) => update('dataTap', event.target.value)} /></Field>
              <Field label="Código do Cliente (multi-seleção)">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex flex-wrap gap-2">{quickOptions.codCliente.map((code) => <button key={code} type="button" onClick={() => toggleClient(code)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${draft.codCliente.includes(code) ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{code}</button>)}</div>
                  <div className="mt-3 flex gap-2"><Input placeholder="Adicionar código" onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); toggleClient(event.currentTarget.value); event.currentTarget.value = ''; } }} /><span className="self-center text-xs text-slate-500">Enter</span></div>
                </div>
              </Field>
              <Field label="Nome do Projeto"><QuickInput field="nomeProjeto" value={draft.nomeProjeto} onChange={(value) => update('nomeProjeto', value)} options={quickOptions} addOption={addOption} /></Field>
              <Field label="GPP"><QuickInput field="gpp" value={draft.gpp} onChange={(value) => update('gpp', value)} options={quickOptions} addOption={addOption} /></Field>
              <Field label="Coordenador do Projeto (CP)"><QuickInput field="coordenador" value={draft.coordenador} onChange={(value) => update('coordenador', value)} options={quickOptions} addOption={addOption} /></Field>
              <Field label="ESN"><QuickInput field="esn" value={draft.esn} onChange={(value) => update('esn', value)} options={quickOptions} addOption={addOption} /></Field>
              <Field label="Arquiteto"><QuickInput field="arquiteto" value={draft.arquiteto} onChange={(value) => update('arquiteto', value)} options={quickOptions} addOption={addOption} /></Field>
              <Field label="Drive do Projeto"><Input type="url" value={draft.drive} onChange={(event) => update('drive', event.target.value)} placeholder="https://" /></Field>
              <Field label="Criticidade Cliente"><Select value={draft.criticidadeCliente} onChange={(event) => update('criticidadeCliente', event.target.value)}><option>BAIXA</option><option>MÉDIA</option><option>ALTA</option></Select></Field>
              <Field label="Criticidade TOTVS"><Select value={draft.criticidadeTotvs} onChange={(event) => update('criticidadeTotvs', event.target.value)}><option>BAIXA</option><option>MÉDIA</option><option>ALTA</option></Select></Field>
            </div>
          </Section>

          <Section title="Escopo e Produtos" description="Selecione os produtos contratados e adicione itens customizados quando necessário.">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"><Search className="h-4 w-4 text-slate-400" /><input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} className="w-full text-sm outline-none" placeholder="Pesquisar produto" /></div>
                <div className="max-h-56 space-y-2 overflow-auto pr-1">{filteredProducts.map((product) => <button key={product} type="button" onClick={() => addProduct(product)} className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"><span>{product}</span><Plus className="h-4 w-4" /></button>)}</div>
                <div className="mt-4 flex gap-2"><Input value={customProduct} onChange={(event) => setCustomProduct(event.target.value)} placeholder="Produto customizado" /><button type="button" onClick={() => { addProductToCatalog(customProduct); addProduct(customProduct); setCustomProduct(''); }} className="rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Adicionar</button></div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-slate-900">Produtos selecionados</h4>
                <div className="mt-3 flex flex-wrap gap-2">{draft.produtos.length ? draft.produtos.map((product) => <span key={product} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{product}<button type="button" onClick={() => removeProduct(product)} aria-label={`Remover ${product}`}><X className="h-3.5 w-3.5" /></button></span>) : <p className="text-sm text-slate-500">Nenhum produto selecionado.</p>}</div>
              </div>
            </div>
          </Section>

          {draft.produtos.length ? <Section title="Detalhes dos Produtos" description="Cada produto selecionado possui seu próprio detalhamento de oferta, frente e premissas.">
            <div className="space-y-4">{draft.produtos.map((product) => {
              const details = draft.detalhesProdutos[product] || {};
              return <article key={product} className="rounded-2xl border border-slate-200 bg-white p-4"><h4 className="mb-4 text-sm font-semibold text-slate-900">{product}</h4><div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Código da Proposta ou Oferta"><Input value={details.codigoProposta || ''} onChange={(event) => updateProductDetail(product, 'codigoProposta', event.target.value)} /></Field>
                <Field label="Código do Cliente vinculado"><Input value={details.codClienteProduto || ''} onChange={(event) => updateProductDetail(product, 'codClienteProduto', event.target.value)} /></Field>
                <Field label="ID TOTVS"><Input value={details.idTotvs || ''} onChange={(event) => updateProductDetail(product, 'idTotvs', event.target.value)} /></Field>
                <Field label="Nome da Oferta"><Input value={details.nomeOferta || ''} onChange={(event) => updateProductDetail(product, 'nomeOferta', event.target.value)} /></Field>
                <Field label="Anexo da Oferta"><Input value={details.anexoOferta || ''} onChange={(event) => updateProductDetail(product, 'anexoOferta', event.target.value)} /></Field>
                <Field label="Responsável pela Frente"><QuickInput field="responsavelFrente" value={details.responsavelFrente || ''} onChange={(value) => updateProductDetail(product, 'responsavelFrente', value)} options={quickOptions} addOption={addOption} /></Field>
                <Field label="Dependência Principal"><Input value={details.dependenciaPrincipal || ''} onChange={(event) => updateProductDetail(product, 'dependenciaPrincipal', event.target.value)} /></Field>
                <Field label="Ponto de Atenção"><Input value={details.pontoAtencao || ''} onChange={(event) => updateProductDetail(product, 'pontoAtencao', event.target.value)} /></Field>
                <Field label="Premissa"><Input value={details.premissa || ''} onChange={(event) => updateProductDetail(product, 'premissa', event.target.value)} /></Field>
                <Field label="Observações do Produto" className="lg:col-span-3"><Textarea value={details.obs || ''} onChange={(event) => updateProductDetail(product, 'obs', event.target.value)} /></Field>
              </div></article>;
            })}</div>
          </Section> : null}

          <Section title="Financeiro" description="Valores executivos da venda, receita, margens, MRR, PSA e investimentos.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                ['valorProjeto', 'Valor do Projeto'], ['receitaAtual', 'Receita Atual'], ['margemVenda', 'Margem da Venda em %'], ['margemAtual', 'Margem Atual em %'],
                ['margemVendaValor', 'Margem Venda em R$'], ['margemAtualValor', 'Margem Atual em R$'], ['mrrMensal', 'MRR Mensal'], ['mrrTotal', 'MRR Total Contratado'],
                ['psaPlanejado', 'PSA Planejado'], ['diferencaPsa', 'Diferença PSA x Projeto'], ['investimentoPerdas', 'Investimento em Perdas'], ['investimentoComercial', 'Investimento Comercial'], ['investimentoErro', 'Investimento por Erro de Produto'],
              ].map(([field, label]) => <Field key={field} label={label}><Input inputMode="decimal" value={draft[field]} onChange={(event) => calculateFinancial(field, event.target.value)} /></Field>)}
              <Field label="Projeto em Perda"><Select value={draft.projetoEmPerda} onChange={(event) => update('projetoEmPerda', event.target.value)}><option>Não</option><option>Sim</option></Select></Field>
            </div>
          </Section>

          <Section title="Timeline do Projeto" description="Linha base executiva da implantação, go-live e encerramento.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Field label="Data de Início"><Input type="date" value={draft.dataInicio} onChange={(event) => calculateTimeline('dataInicio', event.target.value)} /></Field>
              <Field label="Data de Go Live Prevista"><Input type="date" value={draft.goLive} onChange={(event) => calculateTimeline('goLive', event.target.value)} /></Field>
              <Field label="Duração em meses"><Input type="number" min="0" value={draft.duracao} onChange={(event) => calculateTimeline('duracao', event.target.value)} /></Field>
              <Field label="Pós-produção em meses"><Input type="number" min="0" value={draft.posProducao} onChange={(event) => calculateTimeline('posProducao', event.target.value)} /></Field>
              <Field label="Data de Encerramento"><Input type="date" value={draft.encerramento} onChange={(event) => update('encerramento', event.target.value)} /></Field>
            </div>
          </Section>

          <Section title="Governança e Responsáveis" description="Papéis, ritos e canais oficiais para controle da implantação.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {['sponsorCliente', 'sponsorTotvs', 'gerenteProjeto', 'gerentePrograma', 'pmo'].map((field) => <Field key={field} label={{ sponsorCliente: 'Sponsor do Cliente', sponsorTotvs: 'Sponsor TOTVS', gerenteProjeto: 'Gerente do Projeto', gerentePrograma: 'Gerente de Programa', pmo: 'PMO' }[field]}><QuickInput field={field} value={draft[field]} onChange={(value) => update(field, value)} options={quickOptions} addOption={addOption} /></Field>)}
              <Field label="Key Users"><Input value={draft.keyUsers} onChange={(event) => update('keyUsers', event.target.value)} /></Field>
              <Field label="Canal oficial de comunicação"><Input value={draft.canalComunicacao} onChange={(event) => update('canalComunicacao', event.target.value)} /></Field>
              <Field label="Periodicidade do Status Report"><Input value={draft.periodicidadeStatusReport} onChange={(event) => update('periodicidadeStatusReport', event.target.value)} /></Field>
              <Field label="Rito executivo definido"><Select value={draft.ritoExecutivoDefinido} onChange={(event) => update('ritoExecutivoDefinido', event.target.value)}><option>Não</option><option>Sim</option></Select></Field>
              <Field label="Kickoff realizado"><Select value={draft.kickoffRealizado} onChange={(event) => update('kickoffRealizado', event.target.value)}><option>Não</option><option>Sim</option></Select></Field>
            </div>
          </Section>

          <Section title="Observações" description="Premissas, restrições, riscos iniciais, pontos de atenção e decisões registradas.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Observações gerais"><Textarea value={draft.observacao} onChange={(event) => update('observacao', event.target.value)} /></Field>
              <Field label="Premissas"><Textarea value={draft.premissas} onChange={(event) => update('premissas', event.target.value)} /></Field>
              <Field label="Restrições"><Textarea value={draft.restricoes} onChange={(event) => update('restricoes', event.target.value)} /></Field>
              <Field label="Riscos iniciais"><Textarea value={draft.riscosIniciais} onChange={(event) => update('riscosIniciais', event.target.value)} /></Field>
              <Field label="Pontos de atenção"><Textarea value={draft.pontosAtencao} onChange={(event) => update('pontosAtencao', event.target.value)} /></Field>
              <Field label="Decisões registradas"><Textarea value={draft.decisoesRegistradas} onChange={(event) => update('decisoesRegistradas', event.target.value)} /></Field>
            </div>
          </Section>

          <div className="sticky bottom-0 -mx-6 -mb-6 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 p-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>{draft.id ? <button type="button" onClick={onDelete} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"><Trash2 className="h-4 w-4" />Excluir TAP</button> : null}</div>
            <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">Cancelar</button><button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">{draft.id ? 'Atualizar TAP' : 'Salvar TAP'}</button></div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TapPage() {
  const [taps, setTaps] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState(emptyTap);
  const [isLoading, setIsLoading] = useState(true);
  const [lastError, setLastError] = useState('');
  const [toast, setToast] = useState(null);
  const [quickOptions, setQuickOptions] = useState(() => ({ ...optionFields, ...safeParse(localStorage.getItem(TAP_OPTIONS_KEY), {}) }));
  const [productCatalog, setProductCatalog] = useState(() => [...new Set([...baseProducts, ...safeParse(localStorage.getItem(`${TAP_OPTIONS_KEY}.products`), [])])]);

  const activeProject = getActiveProject();
  const activeProjectId = getCurrentProjectCode(activeProject?.id);
  const cockpitConfig = readCockpitConfig();
  const projectName = activeProject?.name || getProjectName(cockpitConfig, activeProjectId);
  const hasSupabase = hasSupabaseConfiguration();

  async function loadTaps() {
    setIsLoading(true);
    setLastError('');
    try {
      const entries = await readTapEntries(activeProjectId);
      setTaps(entries);
      await persistTapEntries(entries);
    } catch (error) {
      console.error('Erro ao carregar TAPs.', error);
      setLastError(error?.message || String(error));
      setToast({ type: 'error', message: 'Não foi possível carregar as TAPs do Supabase. Consulte os detalhes técnicos.', detail: error?.message || String(error) });
      setTaps(safeParse(localStorage.getItem(TAP_STORAGE_KEY), []));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadTaps(); }, [activeProjectId]);

  const filteredTaps = useMemo(() => taps.filter((tap) => {
    const matchCliente = !filters.cliente || (tap.codCliente || []).some((client) => client.toLowerCase().includes(filters.cliente.toLowerCase()));
    const matchGpp = !filters.gpp || (tap.gpp || '').toLowerCase().includes(filters.gpp.toLowerCase());
    const matchCritCliente = !filters.criticidadeCliente || tap.criticidadeCliente === filters.criticidadeCliente;
    const matchCritTotvs = !filters.criticidadeTotvs || tap.criticidadeTotvs === filters.criticidadeTotvs;
    const matchPerda = !filters.projetoEmPerda || tap.projetoEmPerda === filters.projetoEmPerda;
    const matchProjeto = !filters.nomeProjeto || (tap.nomeProjeto || '').toLowerCase().includes(filters.nomeProjeto.toLowerCase());
    const matchProduto = !filters.produto || (tap.produtos || []).some((product) => product.toLowerCase().includes(filters.produto.toLowerCase()));
    return matchCliente && matchGpp && matchCritCliente && matchCritTotvs && matchPerda && matchProjeto && matchProduto;
  }), [filters, taps]);

  const metrics = useMemo(() => ({
    total: taps.length,
    highCriticality: taps.filter((tap) => tap.criticidadeCliente === 'ALTA' || tap.criticidadeTotvs === 'ALTA').length,
    lossProjects: taps.filter((tap) => tap.projetoEmPerda === 'Sim').length,
    goLive: taps.filter((tap) => tap.goLive).length,
    revenue: taps.reduce((sum, tap) => sum + normalizeNumber(tap.valorProjeto), 0),
  }), [taps]);

  function openNewTap() {
    const today = new Date().toISOString().slice(0, 10);
    setDraft({ ...emptyTap, id: '', dataTap: today, projectId: activeProjectId || null });
    setIsModalOpen(true);
  }

  function openEditTap(tap) {
    setDraft({ ...emptyTap, ...tap, codCliente: tap.codCliente || [], produtos: tap.produtos || [], detalhesProdutos: tap.detalhesProdutos || {} });
    setIsModalOpen(true);
  }

  function addOption(field, value) {
    const option = String(value || '').trim();
    if (!option) return;
    setQuickOptions((current) => {
      const next = { ...current, [field]: [...new Set([...(current[field] || []), option])] };
      saveQuickOptions(next);
      return next;
    });
  }

  function addProductToCatalog(product) {
    const name = String(product || '').trim();
    if (!name) return;
    setProductCatalog((current) => {
      const next = [...new Set([...current, name])];
      localStorage.setItem(`${TAP_OPTIONS_KEY}.products`, JSON.stringify(next.filter((item) => !baseProducts.includes(item))));
      return next;
    });
  }

  async function saveTap() {
    if (!draft.nomeProjeto.trim()) {
      setToast({ type: 'error', message: 'Informe o nome do projeto antes de salvar a TAP.' });
      return;
    }
    const now = new Date().toISOString();
    const saved = { ...draft, projectId: draft.projectId || activeProjectId || null, updatedAt: now, createdAt: draft.createdAt || now };
    try {
      const persisted = await saveTapEntry(saved, { projectCode: activeProjectId, projectName: projectName || draft.nomeProjeto });
      const freshEntries = await readTapEntries(activeProjectId);
      await persistTapEntries(freshEntries);
      mirrorTapProjectToPortfolio(persisted);
      setTaps(freshEntries);
      setIsModalOpen(false);
      setToast({ type: 'success', message: draft._dbId ? 'TAP atualizada com sucesso no Supabase.' : 'TAP criada com sucesso no Supabase.' });
    } catch (error) {
      console.error('Erro ao salvar TAP.', error);
      setLastError(error?.message || String(error));
      setToast({ type: 'error', message: 'Não foi possível salvar a TAP.', detail: error?.message || String(error) });
    }
  }

  async function deleteTap() {
    if (!draft.id) return;
    try {
      await deleteTapEntry(draft);
      const freshEntries = await readTapEntries(activeProjectId);
      await persistTapEntries(freshEntries);
      setTaps(freshEntries);
      setIsModalOpen(false);
      setToast({ type: 'success', message: 'TAP excluída com sucesso no Supabase.' });
    } catch (error) {
      console.error('Erro ao excluir TAP.', error);
      setLastError(error?.message || String(error));
      setToast({ type: 'error', message: 'Não foi possível excluir a TAP.', detail: error?.message || String(error) });
    }
  }

  const activeFilterLabels = Object.entries(filters)
    .filter(([, value]) => value)
    .map(([key, value]) => ({
      key,
      value,
      label: `${{ cliente: 'Cliente', gpp: 'GPP', criticidadeCliente: 'Criticidade Cliente', criticidadeTotvs: 'Criticidade TOTVS', projetoEmPerda: 'Projeto em perda', nomeProjeto: 'Projeto', produto: 'Produto' }[key]}: ${value}`,
    }));

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageTitle title="TAP - Termo de Abertura do Projeto" subtitle="Formalização inicial do projeto, escopo, responsáveis, criticidade, financeiro e linha base de execução." />
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setIsFilterOpen((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"><Filter className="h-4 w-4" />Filtros</button>
          <button type="button" onClick={loadTaps} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"><RefreshCw className="h-4 w-4" />Atualizar</button>
          <button type="button" onClick={openNewTap} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"><Plus className="h-4 w-4" />Nova TAP</button>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-700">
        {activeProject ? <span>Projeto ativo identificado: <strong>{activeProject.name}</strong>. Novas TAPs serão vinculadas ao projeto.</span> : <span>Nenhum projeto ativo identificado. A TAP usará o contexto configurado no Cockpit/Supabase.</span>}
        <span className="ml-2 font-semibold">Persistência: {hasSupabase ? 'Supabase REST configurado.' : 'Supabase não configurado.'}</span>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total de TAPs', metrics.total, ClipboardList, 'bg-blue-50 text-blue-700'],
          ['Criticidade alta', metrics.highCriticality, AlertTriangle, 'bg-red-50 text-red-700'],
          ['Projetos em perda', metrics.lossProjects, DollarSign, 'bg-amber-50 text-amber-700'],
          ['Go Live previsto', metrics.goLive, CalendarDays, 'bg-emerald-50 text-emerald-700'],
          ['Receita total', formatCurrency(metrics.revenue), DollarSign, 'bg-sky-50 text-sky-700'],
        ].map(([label, value, Icon, color]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></div><div className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></div></div></article>)}
      </div>

      {isFilterOpen ? <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-900">Filtros avançados</h2><p className="text-sm text-slate-600">Refine a listagem sem recarregar a página.</p></div><button type="button" onClick={() => setFilters(initialFilters)} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Limpar filtros</button></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Field label="Cliente"><Input value={filters.cliente} onChange={(event) => setFilters((current) => ({ ...current, cliente: event.target.value }))} /></Field>
          <Field label="GPP"><Input value={filters.gpp} onChange={(event) => setFilters((current) => ({ ...current, gpp: event.target.value }))} /></Field>
          <Field label="Criticidade Cliente"><Select value={filters.criticidadeCliente} onChange={(event) => setFilters((current) => ({ ...current, criticidadeCliente: event.target.value }))}><option value="">Todas</option><option>BAIXA</option><option>MÉDIA</option><option>ALTA</option></Select></Field>
          <Field label="Criticidade TOTVS"><Select value={filters.criticidadeTotvs} onChange={(event) => setFilters((current) => ({ ...current, criticidadeTotvs: event.target.value }))}><option value="">Todas</option><option>BAIXA</option><option>MÉDIA</option><option>ALTA</option></Select></Field>
          <Field label="Projeto em perda"><Select value={filters.projetoEmPerda} onChange={(event) => setFilters((current) => ({ ...current, projetoEmPerda: event.target.value }))}><option value="">Todos</option><option>Sim</option><option>Não</option></Select></Field>
          <Field label="Nome do projeto"><Input value={filters.nomeProjeto} onChange={(event) => setFilters((current) => ({ ...current, nomeProjeto: event.target.value }))} /></Field>
          <Field label="Produto do escopo"><Input value={filters.produto} onChange={(event) => setFilters((current) => ({ ...current, produto: event.target.value }))} /></Field>
        </div>
      </section> : null}

      {activeFilterLabels.length ? <div className="mb-6 flex flex-wrap gap-2">{activeFilterLabels.map((filter) => <button type="button" key={filter.key} onClick={() => setFilters((current) => ({ ...current, [filter.key]: '' }))} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100">{filter.label}<X className="h-3 w-3" /></button>)}<button type="button" onClick={() => setFilters(initialFilters)} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">Limpar filtros</button></div> : null}

      {lastError ? <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"><strong>Detalhe técnico do último erro:</strong><pre className="mt-2 whitespace-pre-wrap text-xs">{lastError}</pre></div> : null}

      {isLoading ? <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{[1, 2, 3, 4].map((item) => <div key={item} className="h-56 animate-pulse rounded-2xl bg-slate-200" />)}</div> : filteredTaps.length ? <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">{filteredTaps.map((tap) => <article key={tap.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap gap-2"><span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getCriticalityClasses(tap.criticidadeCliente)}`}>Cliente: {tap.criticidadeCliente}</span><span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getCriticalityClasses(tap.criticidadeTotvs)}`}>TOTVS: {tap.criticidadeTotvs}</span>{tap.projetoEmPerda === 'Sim' ? <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Projeto em perda</span> : null}</div>
            <h2 className="mt-3 text-lg font-bold text-slate-900">{tap.nomeProjeto || 'Projeto sem nome'}</h2>
            <p className="mt-1 text-sm text-slate-600">Cliente: {(tap.codCliente || []).join(', ') || 'Não informado'} · GPP: {tap.gpp || 'Não informado'}</p>
          </div>
          <button type="button" onClick={() => openEditTap(tap)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"><Pencil className="h-4 w-4" />Editar</button>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Coordenador</span><p className="font-medium text-slate-800">{tap.coordenador || 'Não informado'}</p></div>
          <div><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Go Live previsto</span><p className="font-medium text-slate-800">{formatDate(tap.goLive)}</p></div>
          <div><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Valor do projeto</span><p className="font-medium text-slate-800">{formatCurrency(tap.valorProjeto)}</p></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">{(tap.produtos || []).slice(0, 8).map((product) => <span key={product} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{product}</span>)}{(tap.produtos || []).length > 8 ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">+{tap.produtos.length - 8}</span> : null}</div>
        {tap.drive ? <a href={tap.drive} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"><LinkIcon className="h-4 w-4" />Drive do projeto</a> : null}
      </article>)}</div> : <EmptyState title="Nenhuma TAP cadastrada" description="Crie a primeira TAP para formalizar a abertura do projeto e organizar os dados iniciais de governança."><button type="button" onClick={openNewTap} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"><Plus className="h-4 w-4" />Criar Nova TAP</button></EmptyState>}

      {isModalOpen ? <TapModal draft={draft} setDraft={setDraft} onClose={() => setIsModalOpen(false)} onSave={saveTap} onDelete={deleteTap} quickOptions={quickOptions} addOption={addOption} productCatalog={productCatalog} addProductToCatalog={addProductToCatalog} /> : null}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
