import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, authLoading } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

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
    setSubmitError("");

    if (!validate()) {
      return;
    }

    const result = await register(name.trim(), email.trim().toLowerCase(), password, remember);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10">
        <h1 className="text-3xl font-semibold text-slate-900 text-center mb-3">Create account</h1>
        <p className="text-sm text-slate-500 text-center mb-7">Start scanning your food and protect your health.</p>

        {submitError && <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{submitError}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            type="text"
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}

          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            type="email"
            placeholder="name@example.com"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            type="password"
            placeholder="Create a password"
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

          <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            type="password"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
            />
            Remember me
          </label>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full min-h-11 rounded-2xl bg-green-500 text-white text-base font-semibold transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {authLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-green-600 hover:text-green-700">Log in</Link>
        </p>
      </div>
    </div>
  );
}
