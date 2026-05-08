import GateTimeline from './GateTimeline';
import GateCard from '../cards/GateCard';
export default function AgfJourney({ gates }) { return <section className="space-y-6"><GateTimeline gates={gates} /><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{gates.map(gate => <GateCard key={gate.id} gate={gate} />)}</div></section>; }
