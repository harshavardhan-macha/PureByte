import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) {
  if (totalItems === 0) return null;
  if (totalPages <= 1 && totalItems <= pageSize) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array with optional ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 sm:flex-row">
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm" style={{ color: "var(--dash-text-muted)" }}>
        <span>
          Showing <strong className="font-semibold" style={{ color: "var(--dash-text)" }}>{startItem}–{endItem}</strong> of{" "}
          <strong className="font-semibold" style={{ color: "var(--dash-text)" }}>{totalItems}</strong> ingredients
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-[var(--dash-border)] pl-3">
            <label htmlFor="page-size-select" className="text-xs">Per page:</label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-bg-surface)] px-2 py-1 text-xs font-medium text-[var(--dash-text)] focus:outline-none focus:ring-1 focus:ring-[var(--dash-accent)]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <nav className="flex items-center gap-1" aria-label="Pagination Navigation">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg-surface)] text-[var(--dash-text)] transition hover:bg-[var(--dash-surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="flex h-9 w-8 items-center justify-center text-xs" style={{ color: "var(--dash-text-muted)" }}>
                •••
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-[var(--dash-accent)] text-white shadow-sm"
                  : "border border-[var(--dash-border)] bg-[var(--dash-bg-surface)] text-[var(--dash-text)] hover:bg-[var(--dash-surface-muted)]"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg-surface)] text-[var(--dash-text)] transition hover:bg-[var(--dash-surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
