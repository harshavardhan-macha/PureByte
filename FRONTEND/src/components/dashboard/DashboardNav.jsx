import { NavLink } from "react-router-dom";
import { ScanLine, History, Leaf, Users, User, LogOut } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const links = [
  { to: "/scan", label: "Scan", icon: ScanLine },
  { to: "/history", label: "History", icon: History },
  { to: "/ingredients", label: "Ingredients", icon: Leaf },
  { to: "/community", label: "Community", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
];

const navClass = ({ isActive }) =>
  `inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-white shadow-sm" : "hover:bg-white/70"
  }`;

export default function DashboardNav() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayEmail = user?.email || "";

  return (
    <header
      className="border-b"
      style={{ borderColor: "var(--dash-border)", backgroundColor: "var(--dash-nav-bg)" }}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <NavLink to="/scan" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "var(--dash-accent)" }}
          >
                          <img src={logo}></img>
          </div>
          <span className="text-base font-semibold" style={{ color: "var(--dash-text)" }}>
            PureByte
          </span>
        </NavLink>

        <nav
          className="order-3 flex w-full flex-wrap items-center gap-1 rounded-full p-1 sm:order-2 sm:w-auto"
          style={{ backgroundColor: "var(--dash-accent-soft)", opacity: 0.95 }}
        >
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={navClass}
              style={({ isActive }) => ({
                color: isActive ? "var(--dash-accent)" : "rgba(6, 95, 70, 0.75)",
              })}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="order-2 flex items-center gap-2 sm:order-3">
          <span
            className="hidden max-w-[160px] truncate text-sm sm:inline"
            style={{ color: "var(--dash-text-muted)" }}
          >
            {displayEmail}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/70"
            style={{ color: "var(--dash-accent)" }}
            aria-label="Log out"
          >
            <LogOut size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
}
