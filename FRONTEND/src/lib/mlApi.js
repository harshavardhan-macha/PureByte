import axios from "axios";
import { showSessionExpired } from "./toast";

const mlApi = axios.create({
  baseURL: import.meta.env.VITE_ML_API_URL || "http://localhost:8000",
});

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

let sessionExpiredNotified = false;

mlApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

mlApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Only treat explicit 401 as auth failure — never logout on 404/500/network errors
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

export const resetMlSessionExpiredFlag = () => {
  sessionExpiredNotified = false;
};

export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error.response) return "Unable to reach the analysis service. Is the backend running?";
  const detail = error.response.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
  return error.response.data?.message || error.response.data?.error || fallback;
};

export const analyzeText = (ingredientsText, productName) =>
  mlApi.post("/api/scan/analyze-text", { ingredientsText, productName: productName || null });

export const analyzeImage = (file, productName) => {
  const form = new FormData();
  form.append("file", file);
  if (productName) form.append("productName", productName);
  return mlApi.post("/api/scan/analyze-image", form);
};

export const getScanHistory = (limit = 20, skip = 0) =>
  mlApi.get("/api/scan/history", { params: { limit, skip } });

export const getScanById = (scanId) => mlApi.get(`/api/scan/history/${scanId}`);

export const deleteScan = (scanId) => mlApi.delete(`/api/scan/history/${scanId}`);

export const searchIngredients = (q, severity, page = 1, limit = 10) =>
  mlApi.get("/api/ingredients", {
    params: {
      ...(q ? { q } : {}),
      ...(severity ? { severity } : {}),
      ...(page ? { page } : {}),
      ...(limit ? { limit } : {}),
    },
  });

export const getIngredient = (name) => mlApi.get(`/api/ingredients/${encodeURIComponent(name)}`);

export const getHealthProfile = () => mlApi.get("/api/users/health-profile");

export const updateHealthProfile = (profile) => mlApi.put("/api/users/health-profile", profile);

export default mlApi;
