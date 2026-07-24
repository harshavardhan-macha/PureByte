import { Outlet } from "react-router-dom";
import DashboardNav from "../components/dashboard/DashboardNav";
import AppFooter from "../components/layout/AppFooter";

export default function DashboardLayout() {
  return (
    <div className="dashboard-theme flex min-h-screen flex-col">
      <DashboardNav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
