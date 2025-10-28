import ResponsiveDialog from "@/components/responsiveDialog";
import NavigationItem from "@/components/navigationBar/navigationItem";
import { House, MessageCircle, LayoutGrid, Menu } from "lucide-react";
import NavigationBar from "@/components/navigationBar/navigationBar";
import { Routes, Route } from "react-router";
import LandlordHome from "./landlordHome";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/modeToggle";

type Ttab = "Home" | "Chats" | "Manage" | "Menu";

export default function LandlordDashboard() {
  const [activeTab, setActiveTab] = useState<Ttab>("Home");

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(storedTab as Ttab);
    } else {
      setActiveTab("Home");
    }
  }, []);

  function handleTab(param: Ttab) {
    localStorage.setItem("activeTab", param);
    setActiveTab(param);
  }

  return (
    <main className="bg-white h-screen relative">
      <ModeToggle />
      <ResponsiveDialog />
      <Routes>
        <Route path="" element={<LandlordHome />} />
      </Routes>
      <NavigationBar>
        <NavigationItem
          url="/landlord/dashboard"
          Icon={House}
          label="Home"
          activeTab={activeTab}
          onClick={handleTab}
        />
        <NavigationItem
          url="/landlord/dashboard/chats"
          Icon={MessageCircle}
          label="Chats"
          activeTab={activeTab}
          onClick={handleTab}
        />
        <NavigationItem
          url="/landlord/dashboard/manage"
          Icon={LayoutGrid}
          label="Manage"
          activeTab={activeTab}
          onClick={handleTab}
        />
        <NavigationItem
          url="/landlord/dashboard/menu"
          Icon={Menu}
          label="Menu"
          activeTab={activeTab}
          onClick={handleTab}
        />
      </NavigationBar>
    </main>
  );
}
