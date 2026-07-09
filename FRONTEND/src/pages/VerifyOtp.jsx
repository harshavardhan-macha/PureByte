import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const verifyOtp = () => {
    if (!otp) return alert("Enter OTP");

    console.log("Verifying OTP for:", email, otp);
    navigate("/reset-password", { state: { email } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-slate-900 sm:text-left">Verify OTP</h2>

        <p className="mb-3 text-sm text-gray-500">
          OTP sent to: {email}
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mb-4 w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
        />

        <button
          type="button"
          onClick={verifyOtp}
          className="w-full min-h-11 rounded-2xl bg-green-500 text-base font-semibold text-white hover:bg-green-600"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;
