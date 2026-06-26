import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuthContext();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500 text-white text-xl font-bold">P</div>
          <div>
            <p className="text-base font-semibold text-slate-900">PureByte</p>
            <p className="text-sm text-slate-500">Food quality AI</p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          ☰
        </button>

        <nav className={`flex-col gap-4 md:flex md:flex-row md:items-center ${menuOpen ? "flex" : "hidden"}`}>
          <NavLink to="/" className={({ isActive }) => `text-sm font-medium ${isActive ? "text-green-600" : "text-slate-700 hover:text-green-600"}`}>
            Home
          </NavLink>
          <NavLink to="/features" className={({ isActive }) => `text-sm font-medium ${isActive ? "text-green-600" : "text-slate-700 hover:text-green-600"}`}>
            Features
          </NavLink>
          <NavLink to="/Works" className={({ isActive }) => `text-sm font-medium ${isActive ? "text-green-600" : "text-slate-700 hover:text-green-600"}`}>
            How it works
          </NavLink>
          <NavLink to="/community" className={({ isActive }) => `text-sm font-medium ${isActive ? "text-green-600" : "text-slate-700 hover:text-green-600"}`}>
            Community
          </NavLink>
          <NavLink to="/About" className={({ isActive }) => `text-sm font-medium ${isActive ? "text-green-600" : "text-slate-700 hover:text-green-600"}`}>
            About
          </NavLink>
          {isAuthenticated ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <span className="text-sm text-slate-700">Hi, {user?.name}</span>
              <button onClick={logout} className="min-h-11 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800">
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="min-h-11 rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold text-white text-center hover:bg-green-600">
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

/* //     <header className="flex items-center px-6 py-3 gap-6">
//       <div className="flex items-center gap-2">
//         <img src={logo} alt="logo" className="w-8 h-8"/>
//       <h1 className=" text-3xl font-bold text-green-500 mr-130 px-1 py-2">
//         PureByte
//       </h1>
//       </div>
//       <nav className="flex gap-12 text-lg py-4">
//         <a href="#" className="hover:text-green-500 font-semibold"> Home</a>
//         <a href="#" className="hover:text-green-500 font-semibold">Features</a>
//         <a href="#" className="hover:text-green-500 font-semibold">How It Works</a>
//         <a href="#" className="hover:text-green-500 font-semibold">Community</a>
//         <a href="#" className="hover:text-green-500 font-semibold">About Us</a>
//        <LoginButton />
//       </nav>
       
//     </header> */
  
