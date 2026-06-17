import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
export default function LoginButton() {
    return  (
        <Link to="/login">
         <button  onClick={() => navigate("/login")}
            className="bg-green-500  text-white rounded px-3 font-semibold flex items-center cursor-pointer hover:bg-green-600 transition">
            Login
            <LogIn size={18}/>
        </button>
        </Link>
    );
}
