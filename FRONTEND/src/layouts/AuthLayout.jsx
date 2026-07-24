import { Outlet } from "react-router-dom";
import AuthHeader from "../components/layout/AuthHeader";
import AppFooter from "../components/layout/AppFooter";

export default function AuthLayout() {
  return (
    <div className="dashboard-theme flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
