import ResponsiveDialog from "@/components/responsiveDialog";
import NavigationItem from "@/components/navigationBar/navigationItem";
import { House, MessageCircle, LayoutGrid, Menu } from "lucide-react";
import NavigationBar from "@/components/navigationBar/navigationBar";
import { Routes, Route } from "react-router";
import LandlordHome from "./landlordHome";

export default function LandlordDashboard() {
  return (
    <main className="bg-white h-screen relative">
      <ResponsiveDialog />
      <Routes>
        <Route path="" element={<LandlordHome />}/>
      </Routes>
      <NavigationBar>
        <NavigationItem url="/landlord/dashboard" Icon={House} label="home" />
        <NavigationItem url="/landlord/dashboard/chats" Icon={MessageCircle} label="Chats" />
        <NavigationItem url="/landlord/dashboard/manage" Icon={LayoutGrid} label="Manage" />
        <NavigationItem url="/landlord/dashboard/menu" Icon={Menu} label="Menu" />
      </NavigationBar>
    </main>
  );
}
