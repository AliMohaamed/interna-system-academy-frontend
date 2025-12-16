import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/protected-route";
import { PublicRoute } from "@/components/common/public-route";
import LoginPage from "./features/auth/pages/LoginPage";

// Placeholder for the Layout you will bring from v0
// import { DashboardLayout } from "@/components/layouts/dashboard-layout"; 

function App() {
  return (
    <Routes>
      {/* Public Routes (Login) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes (Dashboard) */}
      <Route element={<ProtectedRoute />}>
        {/* We will wrap this with DashboardLayout later */}
        {/* <Route element={<DashboardLayout />}> */}
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard Home */}
          <Route path="/dashboard" element={<div>Dashboard Home (Stats)</div>} />
          
          {/* Features Placeholders */}
          <Route path="/leads" element={<div>Leads Module</div>} />
          <Route path="/students" element={<div>Students Module</div>} />
          <Route path="/tutors" element={<div>Tutors Module</div>} />
          <Route path="/settings" element={<div>Settings Module</div>} />

        {/* </Route> */}
      </Route>

      {/* Catch All (404) */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;