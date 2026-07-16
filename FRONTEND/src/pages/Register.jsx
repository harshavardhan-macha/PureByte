import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { showError, showSuccess } from "../lib/toast";

export default function Register() {
  const navigate = useNavigate();
  const { register, authLoading } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) nextErrors.name = "Full name is required.";
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!emailPattern.test(email)) nextErrors.email = "Enter a valid email.";
    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    else if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      showError("Please fix the highlighted fields before continuing.");
      return;
    }

    const result = await register(name.trim(), email.trim().toLowerCase(), password, remember);
    if (result.success) {
      showSuccess("Account created — welcome to PureByte!");
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
        Create account
      </h1>
      <p className="mb-7 text-center text-sm" style={{ color: "var(--dash-text-muted)" }}>
        Start scanning your food and protect your health.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full min-h-11 rounded-2xl border px-4 text-base focus:outline-none focus:ring-2"
          style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          type="text"
          placeholder="Enter your full name"
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}

        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-h-11 rounded-2xl border px-4 text-base focus:outline-none focus:ring-2"
          style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          type="email"
          placeholder="name@example.com"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

        <label className="block text-sm font-medium text-slate-700">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full min-h-11 rounded-2xl border px-4 text-base focus:outline-none focus:ring-2"
          style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          type="password"
          placeholder="Create a password"
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

        <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full min-h-11 rounded-2xl border px-4 text-base focus:outline-none focus:ring-2"
          style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          type="password"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
            style={{ accentColor: "var(--dash-accent)" }}
          />
          Remember me
        </label>

        <button
          type="submit"
          disabled={authLoading}
          className="w-full min-h-11 rounded-2xl text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: "var(--dash-accent)" }}
        >
          {authLoading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--dash-text-muted)" }}>
        Already have an account?{" "}
        <Link to="/login" className="font-semibold" style={{ color: "var(--dash-accent)" }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
