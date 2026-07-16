import { useEffect, useState, useCallback } from "react";
import { Search, Loader2, ChevronRight } from "lucide-react";
import IngredientDetail from "../../components/dashboard/IngredientDetail";
import { getEffectiveSeverity } from "../../utils/severity";
import { searchIngredients, getIngredient, getErrorMessage } from "../../lib/mlApi";

const severityDot = {
  high: "bg-[var(--dash-danger)]",
  medium: "bg-[var(--dash-warning)]",
  low: "bg-[var(--dash-success)]",
  severe: "bg-[var(--dash-danger)]",
  unknown: "bg-[var(--dash-border)]",
};

const severityLabelColor = {
  high: "badge-danger",
  medium: "badge-warning",
  low: "badge-success",
  severe: "badge-danger",
  unknown: "badge-muted",
};

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function IngredientsPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const [severityFilter, setSeverityFilter] = useState(""); // "", "high", "medium", "low"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchIngredients = useCallback(async (q, severity) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await searchIngredients(q, severity || null);
      setItems(data.items || []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load ingredients."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIngredients(debouncedQuery, severityFilter);
  }, [debouncedQuery, severityFilter, fetchIngredients]);

  const openDetail = async (name) => {
    try {
      const { data } = await getIngredient(name);
      if (data.error) {
        setSelected({ name, severity: "low", reason: "No details available.", aliases: [], conditions: [] });
      } else {
        setSelected(data);
      }
    } catch {
      setSelected(items.find((i) => i.name === name) || null);
    }
  };

  return (
    <div>
      <div className="page-card p-6 sm:p-7">
        <h1 className="text-2xl font-bold" style={{ color: "var(--dash-text)" }}>Ingredients database</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--dash-text-muted)" }}>
          Browse flagged additives and common concerns.
        </p>

        <div className="relative mt-5">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--dash-text-muted)" }} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or alias…"
            className="field pl-10"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
        {[
          { id: "", label: "All Risk Levels" },
          { id: "high", label: "High Risk" },
          { id: "medium", label: "Medium Risk" },
          { id: "low", label: "Low Risk" },
        ].map((chip) => {
          const isActive = severityFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setSeverityFilter(chip.id)}
              className={`pill ${isActive ? "pill-active" : ""}`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-[var(--dash-danger)]/20 bg-[rgba(209,67,67,0.08)] px-4 py-3 text-sm text-[var(--dash-danger)]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 flex justify-center rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] py-16">
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--dash-accent)" }} />
        </div>
      ) : items.length === 0 ? (
        <p className="mt-10 text-center text-sm" style={{ color: "var(--dash-text-muted)" }}>No ingredients match your criteria.</p>
      ) : (
        <ul className="mt-5 space-y-2">
          {items.map((item) => {
            const sev = getEffectiveSeverity(item);
            return (
            <li key={item.name}>
              <div
                onClick={() => openDetail(item.name)}
                className="group flex w-full items-center gap-3 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${severityDot[sev] || severityDot.low}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold capitalize" style={{ color: "var(--dash-text)" }}>{item.name}</p>
                  <p className="truncate text-xs" style={{ color: "var(--dash-text-muted)" }}>{item.reason}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${severityLabelColor[sev] || severityLabelColor.low}`}>
                  {sev}
                </span>
                <ChevronRight size={16} className="shrink-0" style={{ color: "var(--dash-text-muted)" }} />
              </div>
            </li>
          })}
        </ul>
      )}

      {selected && (
        <IngredientDetail ingredient={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
