import { BrowserRouter, Routes , Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard"
import Features from "./pages/Features"
import Community from "./pages/Community"
import About from "./pages/About"
import Works from "./pages/Works"
function App() {
    return(
    <BrowserRouter>
     <Routes> 
      <Route path="/Community" element={<Community />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/features" element={<Features />} />
      <Route path="/About" element={<About />} />
      <Route path="/Works" element={<Works />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;

