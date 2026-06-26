import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = () => {
    if (!email) return alert("Enter email");

    // simulate API call
    console.log("Sending OTP to:", email);

    // move to OTP page
    navigate("/verify-otp", { state: { email } });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <button
        onClick={sendOtp}
        className="w-full bg-green-500 text-white p-3 rounded"
      >
        Send OTP
      </button>
    </div>
  );
}

export default ForgotPassword;