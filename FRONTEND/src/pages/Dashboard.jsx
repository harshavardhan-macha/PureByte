import { useLocation } from "react-router-dom";
function Dashboard(){
    const location=useLocation();
    const username = location.state?.username || "User";
    return(
        <div className="text-center">
            <h1 className="font-bold text-xl">
                User Dashboard
            </h1>
            <p>
                Welcome Back, {username}!
            </p>
        </div>
    );
}
export default Dashboard;