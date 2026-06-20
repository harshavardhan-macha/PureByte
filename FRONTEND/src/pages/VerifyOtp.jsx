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

    // move to reset password
    navigate("/reset-password", { state: { email } });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>

      <p className="text-sm text-gray-500 mb-3">
        OTP sent to: {email}
      </p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <button
        onClick={verifyOtp}
        className="w-full bg-green-500 text-white p-3 rounded"
      >
        Verify OTP
      </button>
    </div>
  );
}

export default VerifyOtp;