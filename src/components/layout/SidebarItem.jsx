import { DynamicIcon } from '../ui/icons';
import { isActivePath } from '../../utils/routeHelpers';
import { navigateTo } from '../../utils/navigation';
export default function SidebarItem({ item, currentPath, onClose }) { const [label,path,icon] = item; const active = isActivePath(currentPath, path); return <button onClick={() => { navigateTo(path); onClose?.(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><DynamicIcon name={icon} className="w-5 h-5" /><span>{label}</span></button>; }
