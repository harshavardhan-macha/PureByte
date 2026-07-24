import { X } from "lucide-react";
import getEffectiveSeverity from "../../utils/severity";

const severityStyles = {
  high: "badge-danger",
  medium: "badge-warning",
  low: "badge-success",
  severe: "badge-danger",
  unknown: "badge-warning",
};

export default function IngredientDetail({ ingredient, onClose }) {
  if (!ingredient) return null;
  const { name, reason, aliases = [], conditions = [] } = ingredient;
  const severity = getEffectiveSeverity(ingredient);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold capitalize" style={{ color: "var(--dash-text)" }}>{name}</h2>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${severityStyles[severity] || severityStyles.low}`}
            >
              {severity} risk
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 transition hover:bg-[var(--dash-surface-muted)]"
            style={{ color: "var(--dash-text-muted)" }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--dash-text-muted)" }}>{reason}</p>

        {aliases.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>Also known as</p>
            <p className="mt-1 text-sm" style={{ color: "var(--dash-text)" }}>{aliases.join(", ")}</p>
          </div>
        )}

        {conditions.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>Related conditions</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {conditions.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-2.5 py-0.5 text-xs"
                  style={{ color: "var(--dash-accent)" }}
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
