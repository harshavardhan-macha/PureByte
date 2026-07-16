import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Community from "./pages/Community";
import About from "./pages/About";
import Works from "./pages/Works";
import ShareExperience from "./pages/ShareExperience";
import ScanPage from "./pages/dashboard/ScanPage";
import HistoryPage from "./pages/dashboard/HistoryPage";
import IngredientsPage from "./pages/dashboard/IngredientsPage";
import CommunityPage from "./pages/dashboard/CommunityPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" richColors closeButton duration={4000} />
        <Routes>
          <Route path="/Community" caseSensitive element={<Community />} />
          <Route path="/" element={<Home />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/ingredients" element={<IngredientsPage />} />
              <Route path="/community" caseSensitive element={<CommunityPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/dashboard" element={<Navigate to="/scan" replace />} />
          </Route>
          <Route path="/shareExp" element={<ShareExperience />} />
          <Route path="/features" element={<Features />} />
          <Route path="/About" element={<About />} />
          <Route path="/Works" element={<Works />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
