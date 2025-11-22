import NavigationBar from "@/components/navigationBar/navigationBar";
import NavigationItem from "@/components/navigationBar/navigationItem";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Telescope, MessageCircle, Heart, Menu } from "lucide-react";
import { getListedProperties } from "@/hooks/useFetchData";
import { useApi } from "@/context/ApiContext";
import { useAppContext } from "@/hooks/useAppContext";
import { useConversationContext } from "@/hooks/useConversationContext";
import { useTenanciesContext } from "@/hooks/useTenanciesContext";

type Ttab = "Explore" | "Chats" | "Saved" | "Menu";

export default function TenantDashboard() {
  const { getTenantSaves, getConversations, getTenancies } = useApi();
  const { dispatch: tenanciesDispatch } = useTenanciesContext();
  const { dispatch } = useAppContext();
  const { dispatch: conversationDispatch } = useConversationContext();
  const { error } = getListedProperties();
  const loaction = useLocation();
  const [activeTab, setActiveTab] = useState<Ttab>("Explore");

  if (error) {
    toast.error(error);
  }

  useEffect(() => {
    function checkTab() {
      const storedTab = localStorage.getItem("TenantActiveTab");

      if (loaction.pathname.split("/").length === 3) {
        setActiveTab("Explore");
      } else if (storedTab) {
        setActiveTab(storedTab as Ttab);
      } else {
        setActiveTab("Explore");
      }
    }

    async function getTenantSaveListings() {
      const saves = await getTenantSaves();

      if (saves.error) {
        return toast.error(saves.error);
      }
      // console.log(saves.data)
      dispatch({ type: "SET_SAVES", payload: saves.data });
    }

    async function getUserConversations() {
      const conversations = await getConversations("tenant");

      if (conversations.error) {
        return toast.error(conversations.error);
      }
      // console.log(conversations.data)
      conversationDispatch({
        type: "SET_CONVERSATIONS",
        payload: conversations.data!,
      });
    }

    async function getUserTenancies() {
      const tenancies = await getTenancies();

      if (tenancies.error) {
        console.log(tenancies.error);
        return toast.error(tenancies.error);
      }
      // console.log(tenancies.data)
      tenanciesDispatch({ type: "SET_TENANCIES", payload: tenancies.data! });
    }

    checkTab();
    getTenantSaveListings();
    getUserConversations();
    getUserTenancies();
  }, []);

  function handleTab(param: Ttab) {
    localStorage.setItem("TenantActiveTab", param);
    setActiveTab(param);
  }

  return (
    <main className="font-roboto">
      <Toaster richColors />

      <Outlet />

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
          url="/tenant/dashboard/saved"
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
