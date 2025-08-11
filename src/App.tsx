import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import TenantDashboard from "./pages/tenantDashboard.tsx";
import TenantLogin from "./pages/tenantLogin.tsx";
import TenantSignup from "./pages/tenantSignup.tsx";
import { useAuthContext } from "./context/AuthContext.tsx";
import Settings from "./routes/Settings.tsx";
import Listings from "./routes/Listings.tsx";
import "./App.css";
import { ProtectedRoute } from "./components/protectedRoute.tsx";
import LandlordDashboard from "./pages/landlordDashboard.tsx";

function App() {
  const { session, userRole, loading } = useAuthContext();
  
  // Show loading while authentication state is being determined
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Helper function to check if user is authenticated
  const isAuthenticated = session !== null && userRole !== "guest";

  console.log("App render - Session:", !!session, "UserRole:", userRole, "IsAuth:", isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - only accessible when NOT authenticated */}
        <Route
          path="/auth/tenant-login"
          element={
            !isAuthenticated ? (
              <TenantLogin />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/auth/tenant-signup"
          element={
            !isAuthenticated ? (
              <TenantSignup />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Landlord Protected Routes */}
        <Route
          path="/landlord/dashboard"
          element={
            <ProtectedRoute allowedRoles={["landlord"]}>
              <LandlordDashboard />
            </ProtectedRoute>
          }
        />

        {/* Tenant Protected Routes */}
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
        </Route>

        {/* Default Route Based on Authentication and Role */}
        <Route path="/" element={<DefaultRoute />} />
        
        {/* Catch all route - redirect to appropriate page */}
        <Route path="*" element={<DefaultRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

function DefaultRoute() {
  const { session, userRole } = useAuthContext();
  
  console.log("DefaultRoute - Session:", !!session, "UserRole:", userRole);
  
  // If not authenticated, redirect to login
  if (!session || userRole === "guest") {
    console.log("Redirecting to login");
    return <Navigate to="/auth/tenant-login" replace />;
  }

  // If authenticated, redirect based on role
  switch (userRole) {
    case "landlord":
      console.log("Redirecting to landlord dashboard");
      return <Navigate to="/landlord/dashboard" replace />;
    case "tenant":
      console.log("Redirecting to tenant dashboard");
      return <Navigate to="/tenant/dashboard" replace />;
    default:
      console.log("Unknown role, redirecting to login");
      return <Navigate to="/auth/tenant-login" replace />;
  }
}

export default App;