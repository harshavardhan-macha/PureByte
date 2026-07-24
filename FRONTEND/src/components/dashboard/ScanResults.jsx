import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, Bookmark, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { showSuccess } from "../../lib/toast";
import { getEffectiveSeverity } from "../../utils/severity";

const severityStyles = {
  high: "badge-danger",
  medium: "badge-warning",
  low: "badge-success",
  severe: "badge-danger",
  unknown: "badge-muted",
};

function scoreColor(score) {
  if (score >= 70) return "text-[var(--dash-success)]";
  if (score >= 40) return "text-[var(--dash-warning)]";
  return "text-[var(--dash-danger)]";
}

function scoreLabel(score) {
  if (score >= 70) return "Generally safer";
  if (score >= 40) return "Moderate concerns";
  return "Significant concerns";
}

function verdictMeta(score) {
  if (score >= 70) return { label: "Safe", tone: "badge-success", title: "Low concern" };
  if (score >= 40) return { label: "Caution", tone: "badge-warning", title: "Needs attention" };
  return { label: "Avoid", tone: "badge-danger", title: "High concern" };
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
    parsedIngredients = [],
    totalIngredientsParsed = 0,
    createdAt,
  } = result || {};
  const verdict = useMemo(() => verdictMeta(safetyScore), [safetyScore]);

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
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        {onClose && (
          <button type="button" onClick={onClose} className="btn-secondary px-3 py-2 text-sm">
            ← Back to scanner
          </button>
        )}

        <button
          type="button"
          onClick={handleBookmark}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-1.5 text-xs font-semibold transition hover:bg-[var(--dash-surface-muted)]"
          style={{ color: bookmarked ? "var(--dash-accent)" : "var(--dash-text-muted)" }}
        >
          <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} className="transition-transform active:scale-125" />
          {bookmarked ? "Bookmarked" : "Bookmark scan"}
        </button>
      </div>

      <div className="page-card p-6 sm:p-7">
        {productName && (
          <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--dash-text-muted)" }}>{productName}</p>
        )}
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <span className={`text-5xl font-extrabold tabular-nums ${scoreColor(safetyScore)}`}>
            {displayScore}
          </span>
          <div>
            <p className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>Safety score</p>
            <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>{scoreLabel(safetyScore)}</p>
          </div>
          <span className={`ml-auto inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${verdict.tone}`}>
            {verdict.label}
          </span>
        </div>

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-3">
            <p style={{ color: "var(--dash-text-muted)" }}>Rule-based score</p>
            <p className="mt-1 font-bold" style={{ color: "var(--dash-text)" }}>{ruleBasedScore}</p>
          </div>
          <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-3">
            <p style={{ color: "var(--dash-text-muted)" }}>Ingredients parsed</p>
            <p className="mt-1 font-bold" style={{ color: "var(--dash-text)" }}>{totalIngredientsParsed}</p>
          </div>
        </div>
        {parsedIngredients.length > 0 && (
          <div className="mt-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-4 py-4 text-sm text-[var(--dash-text-muted)]">
            <p className="font-semibold text-[var(--dash-text)]">Parsed ingredient tokens</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {parsedIngredients.map((token, idx) => (
                <span key={`${token}-${idx}`} className="rounded-full border border-[var(--dash-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--dash-text)]">
                  {token}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-3 text-xs" style={{ color: "var(--dash-text-muted)" }}>
          ML unsafe probability: {(mlUnsafeProbability * 100).toFixed(1)}%
          {createdAt && ` · ${new Date(createdAt).toLocaleString()}`}
        </p>
      </div>

      {personalizedWarnings.length > 0 && (
        <div className="rounded-2xl border border-[var(--dash-warning)]/20 bg-[rgba(185,115,22,0.08)] p-5">
          <div className="mb-3 flex items-center gap-2" style={{ color: "var(--dash-warning)" }}>
            <AlertTriangle size={18} />
            <h3 className="font-bold">Personalized warnings</h3>
          </div>
          <ul className="space-y-2">
            {personalizedWarnings.map((w, i) => (
              <li key={i} className="text-sm font-medium leading-relaxed" style={{ color: "var(--dash-warning)" }}>
                {w.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>
            Flagged ingredients ({flaggedIngredients.length})
          </h3>
          <span className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
            Tap to expand details
          </span>
        </div>

        {flaggedIngredients.length === 0 ? (
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-3 text-sm" style={{ color: "var(--dash-success)" }}>
            <CheckCircle2 size={18} />
            No flagged ingredients detected in this list.
          </div>
        ) : (
          <ul className="space-y-3">
            {flaggedIngredients.map((item) => {
              const isExpanded = !!expanded[item.ingredient];
              const sev = getEffectiveSeverity(item);
              const badgeClass = severityStyles[sev] || severityStyles.low;
              return (
                <li
                  key={item.ingredient}
                  onClick={() => toggleExpand(item.ingredient)}
                  className="cursor-pointer rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold capitalize" style={{ color: "var(--dash-text)" }}>{item.ingredient}</p>
                      <p className="mt-1 text-sm" style={{ color: "var(--dash-text-muted)" }}>
                        {item.reason || "Ingredient flagged for further review."}
                      </p>
                      {item.matchedText && (
                        <p className="mt-2 text-xs uppercase tracking-[0.2em]" style={{ color: "var(--dash-text-muted)" }}>
                          Matched label text: {item.matchedText}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold uppercase ${badgeClass}`}>
                        {sev}
                      </span>
                      {isExpanded ? <ChevronUp size={16} style={{ color: "var(--dash-text-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--dash-text-muted)" }} />}
                    </div>
                  </div>

                  <div className={`mt-3 overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-sm" style={{ color: "var(--dash-text)" }}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">Health note</span>
                        <span className="text-xs uppercase tracking-[0.24em]" style={{ color: "var(--dash-text-muted)" }}>
                          {item.deduction || 0} pts
                        </span>
                      </div>
                      <p className="mt-2 leading-relaxed" style={{ color: "var(--dash-text-muted)" }}>
                        {item.reason || "This ingredient may be associated with health concerns and should be reviewed carefully."}
                      </p>
                      {item.relatedConditions?.length > 0 ? (
                        <p className="mt-2 text-xs" style={{ color: "var(--dash-text-muted)" }}>
                          Related: {item.relatedConditions.map((c) => c.replace(/_/g, " ")).join(", ")}
                        </p>
                      ) : null}
                      <a
                        href="#"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
                        style={{ color: "var(--dash-accent)" }}
                        onClick={(event) => event.stopPropagation()}
                      >
                        View ingredient database <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-3 text-xs" style={{ color: "var(--dash-text-muted)" }}>
        <Info size={14} className="mt-0.5 shrink-0" />
        Scores are based on known flagged additives and ML analysis. This is informational only — not medical advice.
      </div>
    </div>
  );
}
