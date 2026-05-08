import { DynamicIcon } from '../ui/icons';
export default function ProfileCard({ id, title, icon, selectedProfile, onClick }) {
  const selected = selectedProfile === id;
  return <button type="button" onClick={() => onClick(id)} className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-200 ${selected ? 'border-blue-600 bg-blue-50 shadow-md -translate-y-1' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'}`}>
    <DynamicIcon name={icon} className={`w-8 h-8 mb-3 ${selected ? 'text-blue-600' : 'text-slate-500'}`} />
    <span className={`font-medium text-sm text-center ${selected ? 'text-blue-800' : 'text-slate-700'}`}>{title}</span>
  </button>;
}
