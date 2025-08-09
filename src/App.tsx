import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import TenantDashboard from "./pages/tenantDashboard.tsx";
import TenantLogin from "./pages/tenantLogin.tsx";
import TenantSignup from "./pages/tenantSignup.tsx";
import { useAuthContext } from "./context/AuthContext.tsx";
import "./App.css"

function App() {
  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? <TenantDashboard /> : <Navigate to={"auth/tenant-login"} />
          }
        />
        <Route
          path="auth/tenant-login"
          element={user ? <Navigate to={"/"} /> : <TenantLogin />}
        />
        <Route
          path="auth/tenant-signup"
          element={user ? <Navigate to={"/"} /> : <TenantSignup />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
