import api from "../api/axiosInstance";

export const register = (payload) => api.post("/api/auth/register", payload);
export const login = (payload) => api.post("/api/auth/login", payload);
export const logout = () => api.post("/api/auth/logout");
export const forgotPassword = (payload) =>
  api.post("/api/auth/forgot-password", payload);
export const resetPassword = (payload) =>
  api.post("/api/auth/reset-password", payload);
