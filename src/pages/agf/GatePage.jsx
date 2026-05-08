import PageTitle from '../../components/ui/PageTitle';
import StatusBadge from '../../components/ui/StatusBadge';
import GateStepList from '../../components/agf/GateStepList';
import GateSummaryPanel from '../../components/agf/GateSummaryPanel';
import EmptyState from '../../components/ui/EmptyState';
import { agfGates } from '../../data/agfGates';
export default function GatePage({ gateId }){ const gate = agfGates.find(g=>String(g.id)===String(gateId)); if(!gate) return <EmptyState title="Gate não encontrado" description="Informe um gate entre 0 e 5."/>; return <><PageTitle title={`Gate ${gate.id} — ${gate.name}`} subtitle={gate.objective}/><div className="mb-6 flex flex-wrap items-center gap-3"><StatusBadge variant="info">Status simulado: Em andamento</StatusBadge><StatusBadge variant="neutro">Nível AGF: Medium</StatusBadge></div><div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6"><GateStepList steps={gate.steps}/><GateSummaryPanel/></div></>}
