import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { showError, showSuccess } from "../lib/toast";
import Logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login, authLoading, isAuthenticated, loading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitError, setSubmitError] = useState("");

  const emailError = useMemo(() => {
    if (!email) return "";
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email) ? "" : "Please enter a valid email address.";
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return "";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return "";
  }, [password]);

  const formValid = !emailError && !passwordError && email.trim() && password.length >= 8;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-700" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/scan" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!email.trim() || !password) {
      setSubmitError("Please enter your email and password.");
      return;
    }
    if (emailError || passwordError) {
      setSubmitError("Please fix the highlighted fields before continuing.");
      return;
    }

    const result = await login(email.trim().toLowerCase(), password, remember);
    if (result.success) {
      showSuccess("Welcome back!");
      navigate("/dashboard");
    } else {
      setSubmitError(result.error);
      showError(result.error);
    }
  };

  return (
    <div
      className="relative w-full rounded-[1.5rem] border border-[var(--dash-border)] p-8 pt-14 shadow-xl sm:p-10 sm:pt-16"
      style={{ backgroundColor: "var(--dash-surface)" }}
    >
     

      {/* <div className="mb-6 flex justify-center">
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-85">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: "var(--dash-accent)" }}
          >
            <img src={Logo} alt="PureByte" className="h-full w-full object-contain" />
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
      </div> */}

      <h1 className="mb-3 text-center text-3xl font-semibold" style={{ color: "var(--dash-text)" }}>
        Welcome back
      </h1>
      <p className="mb-7 text-center text-sm" style={{ color: "var(--dash-text-muted)" }}>
        Log in to continue to your PureByte dashboard.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(emailError)}
            className="field"
            placeholder="name@example.com"
          />
          {emailError ? <p className="mt-1 text-sm text-[var(--dash-danger)]">{emailError}</p> : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(passwordError)}
              className="field pr-14"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full text-sm font-medium"
              style={{ color: "var(--dash-accent)" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordError ? <p className="mt-1 text-sm text-[var(--dash-danger)]">{passwordError}</p> : null}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
              style={{ accentColor: "var(--dash-accent)" }}
            />
            Remember me
          </label>
        </div>

        {submitError ? (
          <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-sm text-[var(--dash-danger)]">
            {submitError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={authLoading || !formValid}
          className="btn-primary w-full"
        >
          {authLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
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
