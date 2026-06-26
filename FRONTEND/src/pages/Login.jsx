<<<<<<< HEAD
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, authLoading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const result = await login(email.trim().toLowerCase(), password, remember);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <h1 className="text-3xl font-semibold text-slate-900 text-center mb-3">Welcome back</h1>
        <p className="text-sm text-slate-500 text-center mb-7">Log in to continue to your PureByte dashboard.</p>

        {error && <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            placeholder="name@example.com"
          />

          <label className="block text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-11 rounded-2xl border border-slate-200 px-4 text-base text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-green-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full min-h-11 rounded-2xl bg-green-500 text-white text-base font-semibold transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {authLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don’t have an account? <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">Register</Link>
        </p>
      </div>
    </div>
  );
}
=======
import { ArrowRight , Eye, EyeOff } from "lucide-react";
import {useNavigate } from "react-router-dom";
import food from "../assets/food.png"
import logo from "../assets/logo.png"
import { useState } from "react";
import React from 'react';
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword]= useState(false);
  const navigate= useNavigate();
  const [username, setUsername] = useState("");
    const handleLogin = () => {
        navigate("/dashboard", {
        state: { username }
        });
    };
return(
  
  <div className="min-h-screen flex flex-col lg:flex-row ">
    
      
    <section className="lg:w-1/2 flex items-center justify-center ">
   
    {/* bg-gradient-to-br from-green-100 via-emerald-50 to-white */}
    <div className="max-w-md mx-10 mb-35">
      <Link to="/">
       <div className=" flex items-center gap-2 mb-8">
        <img src={logo} alt="logo" className="w-6 h-6" />
        <h1 className="text-3xl font-bold text-green-500 cursor-pointer">
          PureByte
        </h1>
      </div>
      </Link>
      <div className="text-green-500 mb-5">Ai powered Food Quality Detection</div>
  <h3 className="text-3xl font-bold">
    Eat Smart,
    <span className="text-green-500 block">
      Live Better
    </span>
  </h3>

  <p className="text-gray-500 ">
    Scan your food, detect harmful ingredients,
    check nutrition and make healthier choices.
  </p>
</div>
    <div className="relative flex items-center justify-center  p-6"></div>
        
      <div className="relative w-full max-w-md aspect-square flex items-baseline translate-y-35">
        
        
        <div className="absolute top-[8%] right-[2%]  z-20 w-44 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-white/60">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-600 text-sm">🍃</span>
            <span className="text-xs font-semibold text-slate-500 tracking-wide">Freshness Score</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl font-extrabold text-emerald-800">8.6</span>
            <span className="text-sm font-semibold text-slate-400">/10</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-bold text-emerald-600">Very Fresh!</span>
            <span className="text-xs">🧪</span>
          </div>
      
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
  
      
        <div className="absolute bottom-[10%] left-[-15%] z-20 w-44 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-white/60">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-slate-400 text-xs">🛡️</span>
            <span className="text-xs font-semibold text-slate-500 tracking-wide">Harmful Ingredients</span>
          </div>
          <span className="text-3xl font-extrabold text-slate-800 block">2</span>
          <span className="text-xs font-bold text-emerald-600 mt-1 block">Low Risk</span>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '20%' }}></div>
          </div>
        </div>

      
        <div className="absolute bottom-[5%] right-[5%] z-20 w-40 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-white/60">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-emerald-500 text-xs">🔥</span>
            <span className="text-xs font-semibold text-slate-500 tracking-wide">Calories</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-emerald-800">320</span>
            <span className="text-sm font-bold text-emerald-600">kcal</span>
          </div>
          <span className="text-xs text-slate-400 font-medium block mt-0.5">Per Serving</span>
        </div>
        

        <div className="w-[85%] h-[85%] rounded-[50px] overflow-hidden shadow-2xl shadow-emerald-900/10 border-4 border-white">
        
        <div className="absolute inset-0 w-96 h-96 bg-green-300/55 blur-3xl rounded-full"></div>
          <img 
            src={food}
             
            className="relative z-10 w-full h-full object-cover"
          />
          </div>
       
    </div>
    </section>

    <section className="lg:w-1/2 flex items-center justify-center">
      <div className="flex items-center justify-center">
        
        <div className="bg-white shadow-2xl border border-green-200 rounded-xl p-8 w-full max-w-md">
          
          <h1 className="text-3xl font-bold mb-6 text-center">
            Login
          </h1>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3 mb-4"
          />

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
          />

          {/* Password with toggle 👇 */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border rounded-lg p-3 pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="text-right mb-4">
        <button type="button"
        onClick={() => navigate("/forgot-password")}
        className="text-sm text-green-600 hover:underline"
       >
        Forgot Password?
        </button>
       </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full flex justify-between items-center bg-green-500 text-white p-3 px-6 rounded-lg hover:bg-green-600 transition"
          >
            Login
            <ArrowRight size={18} />
          </button>

          {/* OR Divider */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-sm text-gray-400 font-medium">
              or
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

        </div>
      </div>
    </section>
  
    {/* <section className="lg:w-1/2 flex items-center justify-center">
    <div className=" flex items-center justify-center  ">
   

      <div className="bg-white shadow-2xl border border-green-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4"
        />
        <input type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
        />
        <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-4"

        />
        <button type="button" 
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 tpo-1/2 -translate-y-1/2 text-gray-500">
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        </div>

        <button onClick={handleLogin} className="w-full  items-center flex justify-between bg-green-500 text-white p-3  px-32 rounded-lg hover:bg-green-600 transition">
          Login <ArrowRight size={18} className="align-center items-center" />
        </button>
        <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-sm text-gray-400 font-medium">or</span>
        <div className="flex-grow border-t border-gray-200"></div>
        </div>

  <button type="button" className="flex items-center justify-center gap-3 w-full px-6 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://w3.org">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
    <span>Sign in with Google</span></button>
      </div>
      </div>
      </section> */}
      </div>
    );
  }
>>>>>>> 8d9cf23aa8ee14c6c1742a04481996e6815dc60b
