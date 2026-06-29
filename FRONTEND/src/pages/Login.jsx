import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, authLoading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const result = await login(email.trim().toLowerCase(), password, remember);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <h1 className="text-3xl font-semibold text-slate-900 text-center mb-3">Welcome back</h1>
        <p className="text-sm text-slate-500 text-center mb-7">Log in to continue to your PureByte dashboard.</p>

        {error && <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            placeholder="name@example.com"
          />

          <label className="block text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-green-600"
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
                className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full min-h-11 rounded-2xl bg-green-500 text-white text-base font-semibold transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {authLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don’t have an account? <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">Register</Link>
        </p>
      </div>
    </div>
  );
}
