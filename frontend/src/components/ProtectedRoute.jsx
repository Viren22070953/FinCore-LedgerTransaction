import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ systemOnly = false }) {
  const { isAuthenticated, isSystemUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (systemOnly && !isSystemUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
