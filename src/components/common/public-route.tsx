import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};