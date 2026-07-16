export default function SegmentedTabs({ tabs, active, onChange }) {
  return (
    <div className="flex rounded-xl bg-emerald-900/5 p-1">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
            active === id
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
