import { X } from "lucide-react";

const severityStyles = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-yellow-100 text-yellow-800",
};

export default function IngredientDetail({ ingredient, onClose }) {
  if (!ingredient) return null;

  const { name, severity, reason, aliases = [], conditions = [] } = ingredient;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold capitalize text-slate-900">{name}</h2>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${severityStyles[severity] || severityStyles.low}`}
            >
              {severity} risk
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-600">{reason}</p>

        {aliases.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Also known as</p>
            <p className="mt-1 text-sm text-slate-700">{aliases.join(", ")}</p>
          </div>
        )}

        {conditions.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Related conditions</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {conditions.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs text-emerald-800"
                >
                  {c.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
