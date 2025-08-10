import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import TenantDashboard from "./pages/tenantDashboard.tsx";
import TenantLogin from "./pages/tenantLogin.tsx";
import TenantSignup from "./pages/tenantSignup.tsx";
import { useAuthContext } from "./context/AuthContext.tsx";
import Settings from "./routes/Settings.tsx";
import Listings from "./routes/Listings.tsx";
import "./App.css";

function App() {
  const { session } = useAuthContext();

  if (session === undefined) {
    return <p>loading</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            session ? (
              <TenantDashboard />
            ) : (
              <Navigate to={"auth/tenant-login"} />
            )
          }
        >
          <Route path="listings" element={<Listings />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route
          path="auth/tenant-login"
          element={session ? <Navigate to={"/"} /> : <TenantLogin />}
        />
        <Route
          path="auth/tenant-signup"
          element={session ? <Navigate to={"/"} /> : <TenantSignup />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
