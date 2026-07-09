import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = () => {
    if (!email) return alert("Enter email");

    console.log("Sending OTP to:", email);
    navigate("/verify-otp", { state: { email } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-slate-900 sm:text-left">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
        />

        <button
          type="button"
          onClick={sendOtp}
          className="w-full min-h-11 rounded-2xl bg-green-500 text-base font-semibold text-white hover:bg-green-600"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
