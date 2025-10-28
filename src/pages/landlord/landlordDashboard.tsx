import ResponsiveDialog from "@/components/responsiveDialog";
import NavigationItem from "@/components/navigationBar/navigationItem";
import { House, MessageCircle, LayoutGrid, Menu } from "lucide-react";
import NavigationBar from "@/components/navigationBar/navigationBar";
import { Routes, Route } from "react-router";
import LandlordHome from "./landlordHome";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/modeToggle";
import { useAuthContext } from "@/context/AuthContext.tsx";
import { toast } from "sonner";

type Ttab = "Home" | "Chats" | "Manage" | "Menu";

export default function LandlordDashboard() {
  const { session } = useAuthContext();
  const [activeTab, setActiveTab] = useState<Ttab>("Home");
  const [accountSetup, setAccountSetup] = useState(false);

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(storedTab as Ttab);
    } else {
      setActiveTab("Home");
    }
  }, []);

  useEffect(() => {
    const accountSetup = localStorage.getItem("setup");

    async function checkAccountSetup() {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/check-setup/${
          session.user.id
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        return toast.error("Request Error", {
          description: "Something went wrong. Please try again.",
          duration: 5000,
        });
      }

      localStorage.setItem("setup", json[0].account_setup_complete);
      setAccountSetup(true);
    }

    if (!accountSetup || accountSetup === "false") {
      checkAccountSetup();
    }
  }, []);

  function handleTab(param: Ttab) {
    localStorage.setItem("activeTab", param);
    setActiveTab(param);
  }

  return (
    <main className="bg-white h-screen relative">
      <ModeToggle />
      <ResponsiveDialog state={accountSetup} setState={setAccountSetup}/>
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
