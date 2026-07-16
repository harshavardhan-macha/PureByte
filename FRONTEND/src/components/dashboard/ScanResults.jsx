import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import { showSuccess } from "../../lib/toast";

const severityStyles = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-800 border-amber-200",
  low: "bg-yellow-50 text-yellow-800 border-yellow-200",
};

function scoreColor(score) {
  if (score >= 70) return "text-emerald-700";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

function scoreLabel(score) {
  if (score >= 70) return "Generally safer";
  if (score >= 40) return "Moderate concerns";
  return "Significant concerns";
}

export default function ScanResults({ result, onClose }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [expanded, setExpanded] = useState({});

  const {
    productName,
    safetyScore = 0,
    ruleBasedScore = 0,
    mlUnsafeProbability = 0,
    flaggedIngredients = [],
    personalizedWarnings = [],
    totalIngredientsParsed = 0,
    createdAt,
  } = result || {};

  useEffect(() => {
    let start = 0;
    const end = safetyScore;
    if (end === 0) {
      setDisplayScore(0);
      return;
    }
    const duration = 500; // ms
    const stepTime = 16; // ~60fps
    const totalSteps = duration / stepTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [safetyScore]);

  if (!result) return null;

  const handleBookmark = () => {
    const nextState = !bookmarked;
    setBookmarked(nextState);
    if (nextState) {
      showSuccess("Scan bookmarked! You can access this later.");
    } else {
      showSuccess("Removed scan from bookmarks.");
    }
  };

  const toggleExpand = (ingredient) => {
    setExpanded((prev) => ({
      ...prev,
      [ingredient]: !prev[ingredient],
    }));
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-emerald-800 hover:text-emerald-900 transition"
          >
            ← Back to scanner
          </button>
        )}
        
        <button
          type="button"
          onClick={handleBookmark}
          className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition hover:bg-slate-50"
          style={{ borderColor: "var(--dash-border)", color: bookmarked ? "var(--dash-accent)" : "var(--dash-text-muted)" }}
        >
          <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} className="transition-transform active:scale-125" />
          {bookmarked ? "Bookmarked" : "Bookmark scan"}
        </button>
      </div>

      <div className="rounded-xl border bg-white p-6 transition hover:shadow-sm" style={{ borderColor: "var(--dash-border)" }}>
        {productName && (
          <p className="text-sm font-bold" style={{ color: "var(--dash-text-muted)" }}>{productName}</p>
        )}
        <div className="mt-2 flex items-end gap-3">
          <span className={`text-5xl font-extrabold tabular-nums transition-all duration-300 ${scoreColor(safetyScore)}`}>
            {displayScore}
          </span>
          <div>
            <p className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>Safety score</p>
            <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>{scoreLabel(safetyScore)}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: "var(--dash-surface-muted)" }}>
            <p style={{ color: "var(--dash-text-muted)" }}>Rule-based score</p>
            <p className="font-bold" style={{ color: "var(--dash-text)" }}>{ruleBasedScore}</p>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: "var(--dash-surface-muted)" }}>
            <p style={{ color: "var(--dash-text-muted)" }}>Ingredients parsed</p>
            <p className="font-bold" style={{ color: "var(--dash-text)" }}>{totalIngredientsParsed}</p>
          </div>
        </div>

        <p className="mt-3 text-xs" style={{ color: "var(--dash-text-muted)" }}>
          ML unsafe probability: {(mlUnsafeProbability * 100).toFixed(1)}%
          {createdAt && ` · ${new Date(createdAt).toLocaleString()}`}
        </p>
      </div>

      {personalizedWarnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-amber-900">
            <AlertTriangle size={18} />
            <h3 className="font-bold">Personalized warnings</h3>
          </div>
          <ul className="space-y-2">
            {personalizedWarnings.map((w, i) => (
              <li key={i} className="text-sm text-amber-950 font-medium leading-relaxed">
                {w.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-lg font-bold" style={{ color: "var(--dash-text)" }}>
          Flagged ingredients ({flaggedIngredients.length})
        </h3>

        {flaggedIngredients.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 size={18} />
            No flagged ingredients detected in this list.
          </div>
        ) : (
          <ul className="space-y-3">
            {flaggedIngredients.map((item) => {
              const isExpanded = !!expanded[item.ingredient];
              return (
                <li
                  key={item.ingredient}
                  onClick={() => toggleExpand(item.ingredient)}
                  className={`rounded-xl border px-4 py-3 cursor-pointer transition select-none hover:shadow-sm ${severityStyles[item.severity] || severityStyles.low}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold capitalize">{item.ingredient}</p>
                      <p className="text-xs opacity-75 font-medium mt-0.5">Click to reveal details</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 rounded-full bg-white/60 px-2 py-0.5 text-xs font-bold uppercase">
                        {item.severity}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  <div className={`mt-2 transition-all duration-200 overflow-hidden ${isExpanded ? "max-h-[300px] opacity-100 border-t pt-2 mt-2 border-current/10" : "max-h-0 opacity-0"}`}>
                    <p className="text-sm font-medium leading-relaxed opacity-95">{item.reason}</p>
                    {item.relatedConditions?.length > 0 && (
                      <p className="mt-2 text-xs font-bold opacity-80">
                        Related: {item.relatedConditions.map((c) => c.replace(/_/g, " ")).join(", ")}
                        {" · "}-{item.deduction} pts
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-xl border bg-slate-50 px-4 py-3 text-xs text-slate-500" style={{ borderColor: "var(--dash-border)" }}>
        <Info size={14} className="mt-0.5 shrink-0" />
        Scores are based on known flagged additives and ML analysis. This is informational only — not medical advice.
      </div>
    </div>
  );
}
