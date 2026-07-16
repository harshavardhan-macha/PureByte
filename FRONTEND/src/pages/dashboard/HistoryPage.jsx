import { useEffect, useMemo, useState } from "react";
import { ChevronRight, History as HistoryIcon, Loader2, Trash2, Share2, RefreshCw, ArrowUpDown } from "lucide-react";
import ScanResults from "../../components/dashboard/ScanResults";
import { getScanHistory, getScanById, deleteScan, getErrorMessage } from "../../lib/mlApi";
import { showError, showSuccess } from "../../lib/toast";

function scoreBadge(score) {
  if (score >= 70) return "badge-success";
  if (score >= 40) return "badge-warning";
  return "badge-danger";
}

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [expandedId, setExpandedId] = useState(null);

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

  const filteredItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    if (filter === "all") return sorted;
    return sorted.filter((item) => {
      if (filter === "safe") return (item.safetyScore || 0) >= 70;
      if (filter === "caution") return (item.safetyScore || 0) >= 40 && (item.safetyScore || 0) < 70;
      return (item.safetyScore || 0) < 40;
    });
  }, [filter, items, sortOrder]);

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
      <div className="page-card p-6 sm:p-7">
        <h1 className="text-2xl font-bold" style={{ color: "var(--dash-text)" }}>Scan history</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--dash-text-muted)" }}>Your past ingredient analyses.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { id: "all", label: "All" },
            { id: "safe", label: "Safe" },
            { id: "caution", label: "Caution" },
            { id: "risk", label: "High risk" },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id)}
              className={`pill ${filter === chip.id ? "pill-active" : ""}`}
            >
              {chip.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <ArrowUpDown size={14} style={{ color: "var(--dash-text-muted)" }} />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-1.5 text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
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
      ) : filteredItems.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-[var(--dash-border)] bg-[var(--dash-surface)] px-6 py-12 text-center">
          <HistoryIcon size={32} style={{ color: "var(--dash-accent)", opacity: 0.5 }} />
          <p className="mt-3 font-medium" style={{ color: "var(--dash-text)" }}>No matching scans yet</p>
          <p className="mt-1 text-sm" style={{ color: "var(--dash-text-muted)" }}>
            Analyze a product on the Scan page and it will appear here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <li key={item.id}>
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="group rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold" style={{ color: "var(--dash-text)" }}>
                        {item.productName || "Untitled product"}
                      </p>
                      <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
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

                    <div className="flex items-center gap-2">
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-sm font-bold tabular-nums ${scoreBadge(item.safetyScore)}`}>
                        {item.safetyScore}
                      </span>
                      <ChevronRight size={18} className="shrink-0 text-slate-400" />
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="mt-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={(e) => handleRescan(e, item)} className="btn-secondary px-3 py-2 text-sm">
                          <RefreshCw size={14} /> Re-scan
                        </button>
                        <button type="button" onClick={(e) => handleShare(e, item)} className="btn-secondary px-3 py-2 text-sm">
                          <Share2 size={14} /> Share
                        </button>
                        <button type="button" onClick={(e) => handleDelete(e, item.id)} className="btn-secondary px-3 py-2 text-sm">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                      <div className="mt-3 text-sm" style={{ color: "var(--dash-text-muted)" }}>
                        <p>Overall verdict: {item.safetyScore >= 70 ? "Safe" : item.safetyScore >= 40 ? "Caution" : "Avoid"}</p>
                        <p className="mt-1">Flagged items: {item.flaggedIngredients?.length || 0}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
