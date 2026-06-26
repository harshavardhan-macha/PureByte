import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "../utils/axiosInstance";

const AuthContext = createContext();

const getStoredToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

const saveToken = (token, remember) => {
  if (remember) {
    localStorage.setItem("token", token);
    sessionStorage.removeItem("token");
  } else {
    sessionStorage.setItem("token", token);
    localStorage.removeItem("token");
  }
};

const clearToken = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const logout = () => {
    clearToken();
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener("authLogout", handleLogout);
    return () => window.removeEventListener("authLogout", handleLogout);
  }, []);

  useEffect(() => {
    const hydrateUser = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/auth/me");
        setUser(data.user);
      } catch (error) {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, []);

  const login = async (email, password, remember) => {
    setAuthLoading(true);
    try {
      const { data } = await axios.post("/auth/login", { email, password });
      saveToken(data.token, remember);
      setUser(data.user);
      setAuthLoading(false);
      return { success: true };
    } catch (error) {
      setAuthLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const register = async (name, email, password, remember) => {
    setAuthLoading(true);
    try {
      const { data } = await axios.post("/auth/register", { name, email, password });
      saveToken(data.token, remember);
      setUser(data.user);
      setAuthLoading(false);
      return { success: true };
    } catch (error) {
      setAuthLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed. Please try again.",
      };
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      authLoading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
