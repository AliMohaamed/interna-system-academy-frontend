import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export const ProtectedRoute = () => {
  const { isAuthenticated, accessToken } = useAuthStore();
  const location = useLocation();

  // 1. Check if user is authenticated
  if (!isAuthenticated || !accessToken) {
    // Redirect to login, but save the location they tried to access
    // so we can send them back there after login (UX Best Practice)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If authenticated, render the child routes (The Dashboard)
  return <Outlet />;
};