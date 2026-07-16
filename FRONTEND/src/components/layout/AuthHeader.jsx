import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AuthHeader() {
  return (
    <header
      className="border-b"
      style={{ borderColor: "var(--dash-border)", backgroundColor: "var(--dash-nav-bg)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "var(--dash-accent)" }}
          >
            P
          </div>
          <span className="text-base font-semibold" style={{ color: "var(--dash-text)" }}>
            PureByte
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium transition hover:border-[var(--dash-border)] hover:bg-[var(--dash-surface)]"
          style={{ color: "var(--dash-accent)" }}
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    </header>
  );
}
