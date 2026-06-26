import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginButton() {
  return (
    <Link to="/login" className="inline-flex min-h-11 items-center rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold text-white hover:bg-green-600 transition">
      <LogIn size={18} className="mr-2" />
      Login
    </Link>
  );
}
