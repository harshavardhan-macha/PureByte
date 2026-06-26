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
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-3 rounded mb-3"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <button
        onClick={resetPassword}
        className="w-full bg-green-600 text-white p-3 rounded"
      >
        Reset Password
      </button>
    </div>
  );
}

export default ResetPassword;