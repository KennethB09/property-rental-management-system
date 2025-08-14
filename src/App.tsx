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
import PageNotFound from "./pages/pageNotFound.tsx";
import ConfirmEmail from "./pages/confirmEmail.tsx";
import AuthPageLayout from "./pages/authPageLayout.tsx";
import LandlordLogin from "./pages/landlord/landlordLogin.tsx";
import LandlordSignUp from "./pages/landlord/landlordSignup.tsx";

function App() {
  const { session } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            !session ? (
              <AuthPageLayout />
            ) : (
              <ProtectedRoute />
            )
          }
        >
          <Route index path="tenant-login" element={<TenantLogin />}/>
          <Route path="landlord-login" element={<LandlordLogin />}/>
          <Route path="tenant-signup" element={<TenantSignup />}/>
          <Route path="landlord-signup" element={<LandlordSignUp />}/>
        </Route>
        
        <Route path="/email-verification" element={<ConfirmEmail />} />

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
        <Route
          path="/"
          errorElement
          element={<Navigate to={"/auth/tenant-login"} />}
        />
        <Route path="*" errorElement element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
