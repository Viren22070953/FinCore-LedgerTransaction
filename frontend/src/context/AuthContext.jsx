import { createContext, useContext, useMemo, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("fincore_user"));
  } catch {
    return null;
  }
};

const extractUser = (data) => data?.user || data?.data?.user || data?.result?.user;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setAuthLoading(true);
    try {
      const response = await authService.login(credentials);
      const nextUser = extractUser(response.data);

      if (nextUser) {
        localStorage.setItem("fincore_user", JSON.stringify(nextUser));
        setUser(nextUser);
      }

      return response.data;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("fincore_user");
      setUser(null);
      setAuthLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isSystemUser:
        user?.role === "system" ||
        user?.role === "system_user" ||
        user?.role === "SYSTEM_USER",
      authLoading,
      login: handleLogin,
      logout: handleLogout,
      setUser,
    }),
    [user, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
