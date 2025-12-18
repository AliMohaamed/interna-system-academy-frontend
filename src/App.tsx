import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/protected-route";
import { PublicRoute } from "@/components/common/public-route";
import LoginPage from "./features/auth/pages/LoginPage";
import { DashboardLayout } from "./components/layout/dashboard-layout";
import DashboardPage from "./features/dashboard/pages/DashboardPage";

// Placeholder for the Layout you will bring from v0
// import { DashboardLayout } from "@/components/layouts/dashboard-layout"; 
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes (Dashboard) */}
      <Route element={<ProtectedRoute />}>
        
        {/* ✅ Wrap dashboard routes with the Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/crm" element={<div>CRM Module</div>} />
          <Route path="/students" element={<div>Students List</div>} />
          {/* Add other routes here */}
        </Route>

      </Route>

      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
}

export default App;