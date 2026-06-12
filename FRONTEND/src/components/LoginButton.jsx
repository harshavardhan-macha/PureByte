import {useNavigate} from "react-router-dom";
import { LogIn } from "lucide-react";
export default function Login() {
    const navigate= useNavigate();
    return  (
         <button  onClick={() => navigate("/login")}
            className="bg-green-500  text-white rounded px-3 font-semibold flex items-center hover:bg-green-600 transition">
            Login
            <LogIn size={18}/>
        </button>
    );
}
