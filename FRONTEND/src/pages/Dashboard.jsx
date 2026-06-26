import { useAuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-3 text-slate-600">Welcome back, {user?.name || "User"}.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 text-lg font-medium text-slate-900">{user?.email}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Member since</p>
            <p className="mt-2 text-lg font-medium text-slate-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;