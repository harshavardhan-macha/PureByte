import { useEffect, useState, useCallback } from "react";
import { Search, Loader2, ChevronRight } from "lucide-react";
import IngredientDetail from "../../components/dashboard/IngredientDetail";
import { searchIngredients, getIngredient, getErrorMessage } from "../../lib/mlApi";

const severityDot = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-yellow-400",
};

const severityLabelColor = {
  high: "text-red-700 bg-red-50 border-red-100",
  medium: "text-amber-700 bg-amber-50 border-amber-100",
  low: "text-yellow-700 bg-yellow-50 border-yellow-100",
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
      <h1 className="text-2xl font-bold text-slate-900">Ingredients database</h1>
      <p className="mt-1 text-sm text-slate-500">
        Browse flagged additives and common concerns.
      </p>

      <div className="relative mt-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or alias…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
        />
      </div>

      {/* Filter Chips */}
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
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition hover:opacity-90 select-none ${
                isActive
                  ? "bg-emerald-800 text-white border-emerald-800"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-emerald-800" />
        </div>
      ) : items.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">No ingredients match your criteria.</p>
      ) : (
        <ul className="mt-5 space-y-2">
          {items.map((item) => (
            <li key={item.name}>
              <div
                onClick={() => openDetail(item.name)}
                className="group flex w-full items-center gap-3 rounded-xl border border-emerald-900/10 bg-white px-4 py-3 text-left transition hover:border-emerald-900/20 hover:shadow-sm cursor-pointer"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${severityDot[item.severity] || severityDot.low}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold capitalize text-slate-900">{item.name}</p>
                  <p className="truncate text-xs text-slate-500">{item.reason}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${severityLabelColor[item.severity] || severityLabelColor.low}`}>
                  {item.severity}
                </span>
                <ChevronRight size={16} className="shrink-0 text-slate-400" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <IngredientDetail ingredient={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
