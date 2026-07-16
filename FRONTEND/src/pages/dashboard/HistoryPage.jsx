import { useEffect, useState } from "react";
import { ChevronRight, History as HistoryIcon, Loader2, Trash2, Share2, RefreshCw } from "lucide-react";
import ScanResults from "../../components/dashboard/ScanResults";
import { getScanHistory, getScanById, deleteScan, getErrorMessage } from "../../lib/mlApi";
import { showError, showSuccess } from "../../lib/toast";

function scoreBadge(score) {
  if (score >= 70) return "bg-emerald-100 text-emerald-800";
  if (score >= 40) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-700";
}

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadHistory = async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const { data } = await getScanHistory();
      setItems(data.items || []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load scan history."));
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const openDetail = async (scanId) => {
    setDetailLoading(true);
    setError("");
    try {
      const { data } = await getScanById(scanId);
      if (data.error) {
        setError(data.error);
        return;
      }
      setSelected(data);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load scan details."));
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (e, scanId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this scan from your history?")) {
      return;
    }
    try {
      await deleteScan(scanId);
      setItems((prev) => prev.filter((item) => item.id !== scanId));
      showSuccess("Scan deleted");
    } catch (err) {
      showError("Could not delete scan. Please try again.");
    }
  };

  const handleShare = (e, item) => {
    e.stopPropagation();
    const text = `PureByte Ingredient Scan: ${item.productName || "Product"} got a safety score of ${item.safetyScore}/100!`;
    navigator.clipboard.writeText(text)
      .then(() => showSuccess("Scan score copied to clipboard!"))
      .catch(() => showError("Failed to copy link."));
  };

  const handleRescan = async (e, item) => {
    e.stopPropagation();
    showSuccess("Re-scanning product...");
    openDetail(item.id);
  };

  if (selected) {
    return (
      <div>
        {detailLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-emerald-800" />
          </div>
        ) : (
          <ScanResults result={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Scan history</h1>
      <p className="mt-1 text-sm text-slate-500">Your past ingredient analyses.</p>

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
        <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-emerald-300 bg-white px-6 py-12 text-center">
          <HistoryIcon size={32} className="text-emerald-700/50" />
          <p className="mt-3 font-medium text-slate-700">No scans yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Analyze a product on the Scan page and it will appear here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <div
                onClick={() => openDetail(item.id)}
                className="group flex w-full items-center justify-between gap-3 rounded-xl border border-emerald-900/10 bg-white px-4 py-3 text-left transition hover:border-emerald-900/20 hover:shadow-sm cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {item.productName || "Untitled product"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "Unknown date"}
                    {" · "}
                    {item.totalIngredientsParsed ?? 0} ingredients
                    {item.flaggedIngredients?.length
                      ? ` · ${item.flaggedIngredients.length} flagged`
                      : ""}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleRescan(e, item)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-700 transition"
                      title="Re-scan"
                    >
                      <RefreshCw size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleShare(e, item)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                      title="Share"
                    >
                      <Share2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, item.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <span
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums ${scoreBadge(item.safetyScore)}`}
                  >
                    {item.safetyScore}
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-slate-400" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
