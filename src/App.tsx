import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import TenantDashboard from "./pages/tenant/tenantDashboard.tsx";
import TenantLogin from "./pages/tenant/tenantLogin.tsx";
import TenantSignup from "./pages/tenant/tenantSignup.tsx";
import { useAuthContext } from "./context/AuthContext.tsx";
import Settings from "./routes/Settings.tsx";
import Listings from "./routes/Listings.tsx";
import "./App.css";
import { ProtectedRoute } from "./components/protectedRoute.tsx";
import LandlordDashboard from "./pages/landlord/landlordDashboard.tsx";
import { useUserRole } from "./hooks/useCheckRole.tsx";
import PageNotFound from "./pages/pageNotFound.tsx";

function App() {
  const { session } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth/tenant-login"
          element={!session ? <TenantLogin /> : <Navigate to="/tenant/dashboard" replace />}
        />
        <Route
          path="/auth/tenant-signup"
          element={!session ? <TenantSignup /> : <Navigate to="/tenant/dashboard" replace />}
        />

        <Route
          path="/landlord/dashboard"
          element={
            <ProtectedRoute allowedRoles={["landlord"]}>
              <LandlordDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tenant/dashboard"
          element={
            <ProtectedRoute allowedRoles={["tenant"]}>
              <TenantDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="listings" element={<Listings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" errorElement element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
