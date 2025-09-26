export const Stat = ({ label, value, sub }) => (
  <div className="p-4 rounded-2xl border bg-slate-800 shadow-sm text-slate-100">
    <div className="text-sm text-slate-400">{label}</div>
    <div className="text-2xl font-semibold mt-1">{value}</div>
    {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
  </div>
);