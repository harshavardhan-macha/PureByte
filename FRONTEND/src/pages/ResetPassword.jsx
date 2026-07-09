import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const resetPassword = () => {
    if (!password || !confirmPassword)
      return alert("Fill all fields");

    if (password !== confirmPassword)
      return alert("Passwords do not match");

    console.log("Password reset for:", email);
    alert("Password reset successful!");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-slate-900 sm:text-left">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
        />

        <button
          type="button"
          onClick={resetPassword}
          className="w-full min-h-11 rounded-2xl bg-green-600 text-base font-semibold text-white hover:bg-green-700"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
