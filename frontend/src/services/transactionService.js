import api from "../api/axiosInstance";

export const createTransaction = (payload) =>
  api.post("/api/transactions/create", payload);
export const depositInitialFunds = (payload) =>
  api.post("/api/transactions/initial-funds", payload);
export const getTransactionHistory = () =>
  api.get("/api/transactions/history");
