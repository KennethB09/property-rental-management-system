import NavigationBar from "@/components/navigationBar/navigationBar";
import NavigationItem from "@/components/navigationBar/navigationItem";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Routes, Route } from "react-router";
import { Telescope, MessageCircle, Heart, Menu } from "lucide-react";
import TenantExplore from "./tabs/tenantExplore";
import TenantChats from "./tabs/tenantChats";
import TenantSaved from "./tabs/tenantSaved";
import TenantMenu from "./tabs/tenantMenu";
import { getListedProperties } from "@/hooks/useFetchData";
import { useApi } from "@/context/ApiContext";
import { useAppContext } from "@/hooks/useAppContext";

type Ttab = "Explore" | "Chats" | "Saved" | "Menu";

export default function TenantDashboard() {
  const { getTenantSaves } = useApi();
  const { dispatch } = useAppContext();
  const { error } = getListedProperties();
  const loaction = useLocation();
  const [activeTab, setActiveTab] = useState<Ttab>("Explore");

  if (error) {
    toast.error(error);
  }

  useEffect(() => {
    function checkTab() {
      const storedTab = localStorage.getItem("activeTab");

      if (loaction.pathname.split("/").length === 3) {
        setActiveTab("Explore");
      } else if (storedTab) {
        setActiveTab(storedTab as Ttab);
      } else {
        setActiveTab("Explore");
      }
    };

    async function getTenantSaveListings() {
      const saves = await getTenantSaves();

      if (saves.error) {
        return toast.error(saves.error);
      }

      dispatch({ type: "SET_SAVES", payload: saves.data })
    };

    checkTab();
    getTenantSaveListings();
  }, []);

  function handleTab(param: Ttab) {
    localStorage.setItem("TenantActiveTab", param);
    setActiveTab(param);
  };

  return (
    <main className="font-roboto">
      <Toaster richColors />

      <Routes>
        <Route index path="/" element={<TenantExplore />} />
        <Route path="/chats" element={<TenantChats />} />
        <Route path="/manage" element={<TenantSaved />} />
        <Route path="/menu" element={<TenantMenu />} />
      </Routes>

      <NavigationBar>
        <NavigationItem
          url="/tenant/dashboard/"
          Icon={Telescope}
          label="Explore"
          activeTab={activeTab}
          onClick={handleTab}
        />
        <NavigationItem
          url="/tenant/dashboard/chats"
          Icon={MessageCircle}
          label="Chats"
          activeTab={activeTab}
          onClick={handleTab}
        />
        <NavigationItem
          url="/tenant/dashboard/manage"
          Icon={Heart}
          label="Saved"
          activeTab={activeTab}
          onClick={handleTab}
        />
        <NavigationItem
          url="/tenant/dashboard/menu"
          Icon={Menu}
          label="Menu"
          activeTab={activeTab}
          onClick={handleTab}
        />
      </NavigationBar>
    </main>
  );
}
