import { BrowserRouter, Routes , Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard"
import Features from "./pages/Features"
import Community from "./pages/Community"
import About from "./pages/About"
import Works from "./pages/Works"
import FoodScanner from "./pages/foodscanner";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import ShareExperience from "./pages/ShareExperience";
function App() {
    return(
    <BrowserRouter>
     <Routes> 
      <Route path="/shareExp" element={<ShareExperience />} />
      <Route path="/Community" element={<Community />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/features" element={<Features />} />
      <Route path="/About" element={<About />} />
      <Route path="/Works" element={<Works />} />
      <Route path="/food-scanner" element={<FoodScanner />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;