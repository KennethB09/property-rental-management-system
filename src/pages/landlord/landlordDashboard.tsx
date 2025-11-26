import ResponsiveDialog from "@/components/responsiveDialog";
import NavigationItem from "@/components/navigationBar/navigationItem";
import { House, MessageCircle, LayoutGrid, Menu } from "lucide-react";
import NavigationBar from "@/components/navigationBar/navigationBar";
import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext.tsx";
import { toast, Toaster } from "sonner";
import { useLocation } from "react-router";
import { useGetLandlordProperty } from "@/hooks/useGetLandlordProperty";
import { useApi } from "@/context/ApiContext";
import { useConversationContext } from "@/hooks/useConversationContext";
import { useTenanciesContext } from "@/hooks/useTenanciesContext";

type Ttab = "Home" | "Chats" | "Manage" | "Menu";

export default function LandlordDashboard() {
  const { getConversations, getTenancies } = useApi();
  const { dispatch: conversationDispatch } = useConversationContext();
  const { session } = useAuthContext();
  const loaction = useLocation();
  const [activeTab, setActiveTab] = useState<Ttab>("Home");
  const [accountSetup, setAccountSetup] = useState(false);
  const { error } = useGetLandlordProperty();
  const { dispatch: tenanciesDispatch } = useTenanciesContext();

  if (error) {
    toast.error(error);
  }

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");

    if (loaction.pathname.split("/").length === 3) {
      setActiveTab("Home");
    } else if (storedTab) {
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

    async function getUserConversations() {
      const conversations = await getConversations("landlord");

      if (conversations.error) {
        return toast.error(conversations.error);
      }

      conversationDispatch({
        type: "SET_CONVERSATIONS",
        payload: conversations.data!,
      });
    }

    async function getUserTenancies() {
      const tenancies = await getTenancies();

      if (tenancies.error) {
        console.log(tenancies.error)
        return toast.error(tenancies.error);
      }
      // console.log(tenancies.data)
      tenanciesDispatch({ type: "SET_TENANCIES", payload: tenancies.data! });
    }

    getUserConversations();
    getUserTenancies();
  }, []);

  function handleTab(param: Ttab) {
    localStorage.setItem("activeTab", param);
    setActiveTab(param);
  }

  return (
    <main className=" font-roboto lg:flex lg:flex-row-reverse h-dvh lg:items-center dark:bg-gray-950">
      <Toaster richColors />
      <ResponsiveDialog state={accountSetup} setState={setAccountSetup} />
      
      <Outlet />

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
