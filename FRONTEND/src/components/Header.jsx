import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `block min-h-11 rounded-xl px-3 py-2.5 text-sm font-medium transition md:inline-flex md:items-center md:min-h-0 md:px-0 md:py-0 ${
    isActive ? "text-green-600" : "text-slate-700 hover:text-green-600"
  }`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuthContext();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-500 text-xl font-bold text-white">
              <img src="src/assets/logo.png"></img>
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900">PureByte</p>
              <p className="truncate text-xs text-slate-500 sm:text-sm">Food quality AI</p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/features" className={navLinkClass}>Features</NavLink>
            <NavLink to="/Works" className={navLinkClass}>How it works</NavLink>
            <NavLink to="/Community" className={navLinkClass}>Community</NavLink>
            <NavLink to="/About" className={navLinkClass}>About</NavLink>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-700">Hi, {user?.name}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="min-h-11 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="min-h-11 rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold text-white hover:bg-green-600"
              >
                Login
              </NavLink>
            )}
          </nav>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-slate-100 py-4 md:hidden">
            <NavLink to="/" className={navLinkClass} onClick={closeMenu}>Home</NavLink>
            <NavLink to="/features" className={navLinkClass} onClick={closeMenu}>Features</NavLink>
            <NavLink to="/Works" className={navLinkClass} onClick={closeMenu}>How it works</NavLink>
            <NavLink to="/Community" className={navLinkClass} onClick={closeMenu}>Community</NavLink>
            <NavLink to="/About" className={navLinkClass} onClick={closeMenu}>About</NavLink>
            {isAuthenticated ? (
              <div className="mt-2 flex flex-col gap-3 border-t border-slate-100 pt-4">
                <span className="px-3 text-sm text-slate-700">Hi, {user?.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="min-h-11 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={closeMenu}
                className="mt-2 min-h-11 rounded-2xl bg-green-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-600"
              >
                Login
              </NavLink>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
