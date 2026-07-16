import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function PrivateRoute() {
  const { loading, isAuthenticated, serverError } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  if (serverError && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h1 className="text-xl font-bold text-slate-800">Connection Error</h1>
        <p className="mt-2 text-sm text-slate-600 max-w-sm">
          Could not connect to the PureByte backend server. Please make sure the backend is running and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
