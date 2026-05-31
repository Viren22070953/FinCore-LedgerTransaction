import api from "../api/axiosInstance";

export const createAccount = (payload) =>
  api.post("/api/accounts/create", payload);
export const getMyAccounts = () => api.get("/api/accounts/my-accounts");
export const getBalance = (accountId) =>
  api.get(`/api/accounts/${accountId}/balance`);
