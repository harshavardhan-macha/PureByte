import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios, { resetSessionExpiredFlag } from "../utils/axiosInstance";
import { resetMlSessionExpiredFlag } from "../lib/mlApi";

const AuthContext = createContext();

const getStoredToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

const saveToken = (token, remember) => {
  resetSessionExpiredFlag();
  resetMlSessionExpiredFlag();

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
  const [serverError, setServerError] = useState(false);

  const logout = () => {
    clearToken();
    setUser(null);
    setLoading(false);
    setServerError(false);
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
        setServerError(false);
      } catch (error) {
        // Only clear session on actual 401 — network/500 errors should not log the user out
        if (error.response?.status === 401) {
          clearToken();
          setUser(null);
        } else {
          setServerError(true);
        }
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
      serverError,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, authLoading, serverError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
