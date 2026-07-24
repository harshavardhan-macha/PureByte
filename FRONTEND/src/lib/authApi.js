import api from "../utils/axiosInstance";

export const getCurrentUser = () => api.get("/auth/me");

export default api;
