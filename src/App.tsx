import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import TenantDashboard from "./pages/tenant/tenantDashboard.tsx";
import TenantLogin from "./pages/tenant/tenantLogin.tsx";
import TenantSignup from "./pages/tenant/tenantSignup.tsx";
import { useAuthContext } from "./context/AuthContext.tsx";
import "./App.css";
import { ProtectedRoute } from "./components/protectedRoute.tsx";
import LandlordDashboard from "./pages/landlord/landlordDashboard.tsx";
import PageNotFound from "./pages/pageNotFound.tsx";
import ConfirmEmail from "./pages/confirmEmail.tsx";
import AuthPageLayout from "./pages/authPageLayout.tsx";
import LandlordLogin from "./pages/landlord/landlordLogin.tsx";
import LandlordSignUp from "./pages/landlord/landlordSignup.tsx";
import { PropertiesProvider } from "./context/PropertyContext.tsx";
import TenantSearch from "./pages/tenant/tenantSearch.tsx";
import TenantExplore from "@/pages/tenant/tabs/tenantExplore";
import TenantChats from "@/pages/tenant/tabs/tenantChats";
import TenantSaved from "@/pages/tenant/tabs/tenantSaved";
import TenantMenu from "@/pages/tenant/tabs/tenantMenu";
import LandlordChats from "@/pages/landlord/tabs/landlordChats";
import LandlordManage from "@/pages/landlord/tabs/landlordManage";
import LandlordMenu from "@/pages/landlord/tabs/landlordMenu";
import LandlordHome from "@/pages/landlord/tabs/landlordHome";

function App() {
  const { session } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={!session ? <AuthPageLayout /> : <ProtectedRoute />}
        >
          <Route index path="tenant-login" element={<TenantLogin />} />
          <Route path="landlord-login" element={<LandlordLogin />} />
          <Route path="tenant-signup" element={<TenantSignup />} />
          <Route path="landlord-signup" element={<LandlordSignUp />} />
        </Route>

        <Route path="/email-verification" element={<ConfirmEmail />} />

        <Route
          path="/landlord"
          element={
            <ProtectedRoute allowedRoles={["landlord"]}>
              <PropertiesProvider>
                <Outlet />
              </PropertiesProvider>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<LandlordDashboard />}>
            <Route index element={<LandlordHome />} />
            <Route path="chats" element={<LandlordChats />} />
            <Route path="manage" element={<LandlordManage />} />
            <Route path="menu" element={<LandlordMenu />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route
          path="/tenant"
          element={
            <ProtectedRoute allowedRoles={["tenant"]}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TenantDashboard />}>
            <Route index element={<TenantExplore />} />
            <Route path="chats" element={<TenantChats />} />
            <Route path="saved" element={<TenantSaved />} />
            <Route path="menu" element={<TenantMenu />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route path="search" element={<TenantSearch />} />
          <Route path="*" element={<PageNotFound />} />
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
