import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { showError, showSuccess } from "../lib/toast";

export default function Login() {
  const navigate = useNavigate();
  const { login, authLoading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      showError("Please enter your email and password.");
      return;
    }

    const result = await login(email.trim().toLowerCase(), password, remember);
    if (result.success) {
      showSuccess("Welcome back!");
      navigate("/dashboard");
    } else {
      showError(result.error);
    }
  };

  return (
    <div
      className="relative w-full rounded-3xl p-8 pt-14 shadow-xl sm:p-10 sm:pt-16"
      style={{ backgroundColor: "var(--dash-surface)" }}
    >
      <Link
        to="/"
        className="absolute left-6 top-6 inline-flex items-center gap-1 text-xs font-semibold transition hover:opacity-80"
        style={{ color: "var(--dash-accent)" }}
      >
        ← Back to home
      </Link>

      <div className="mb-6 flex justify-center">
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-85">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: "var(--dash-accent)" }}
          >
            P
          </div>
          <div className="text-left">
            <span className="block text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
              PureByte
            </span>
            <span className="block text-[10px] leading-none" style={{ color: "var(--dash-text-muted)" }}>
              Food quality AI
            </span>
          </div>
        </Link>
      </div>

      <h1 className="mb-3 text-center text-3xl font-semibold" style={{ color: "var(--dash-text)" }}>
        Welcome back
      </h1>
      <p className="mb-7 text-center text-sm" style={{ color: "var(--dash-text-muted)" }}>
        Log in to continue to your PureByte dashboard.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-h-11 rounded-2xl border px-4 text-base focus:outline-none focus:ring-2"
          style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          placeholder="name@example.com"
        />

        <label className="block text-sm font-medium text-slate-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full min-h-11 rounded-2xl border px-4 text-base focus:outline-none focus:ring-2"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center text-sm font-medium"
            style={{ color: "var(--dash-accent)" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 focus:ring-green-500"
              style={{ accentColor: "var(--dash-accent)" }}
            />
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={authLoading}
          className="w-full min-h-11 rounded-2xl text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: "var(--dash-accent)" }}
        >
          {authLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--dash-text-muted)" }}>
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold" style={{ color: "var(--dash-accent)" }}>
          Register
        </Link>
      </p>
    </div>
  );
}
