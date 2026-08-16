import { Outlet } from "react-router-dom";
import DashboardNav from "../components/dashboard/DashboardNav";

export default function DashboardLayout() {
  return (
    <div className="dashboard-theme flex min-h-screen flex-col bg-[#f5f7f5]">
      <DashboardNav />
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
        <Outlet />
      </main>
    </div>
  );
}
