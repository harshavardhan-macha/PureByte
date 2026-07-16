import axios from "axios";
import { showSessionExpired } from "../lib/toast";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ""}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

let sessionExpiredNotified = false;

export const resetSessionExpiredFlag = () => {
  sessionExpiredNotified = false;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      if (!sessionExpiredNotified) {
        sessionExpiredNotified = true;
        showSessionExpired();
      }

      window.dispatchEvent(new Event("authLogout"));
    }

    return Promise.reject(error);
  },
);

export const getApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error.response) return "Unable to reach the server. Check your connection and try again.";
  return error.response.data?.message || error.response.data?.error || fallback;
};

export default api;
