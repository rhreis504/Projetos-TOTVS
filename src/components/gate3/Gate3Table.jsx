import StatusBadge from '../ui/StatusBadge';
import { statusVariant } from './gate3Ui';

export default function Gate3Table({ columns, rows, getAlert }) {
  return <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr>{columns.map((column)=><th key={column.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{column.label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row)=><tr key={row.id || row.code} className={getAlert?.(row) ? 'bg-red-50/60' : 'bg-white'}>{columns.map((column)=>{ const value = column.render ? column.render(row) : row[column.key]; return <td key={column.key} className="px-4 py-3 align-top text-sm text-slate-700">{column.badge ? <StatusBadge variant={statusVariant(value)}>{value}</StatusBadge> : value}</td>; })}</tr>)}</tbody></table></div>;
}
