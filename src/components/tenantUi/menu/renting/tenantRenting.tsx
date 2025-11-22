import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Renting from "./renting";
import { X } from "lucide-react";
import type { TactiveList } from "../../tenantProfile";
import RequestsAndInvites from "./requestsAndInvites";
import TenantPastRentals from "./tenantPastRentals";

type TenantRentingProps = {
  onClick: React.Dispatch<React.SetStateAction<TactiveList | "">>;
};

export default function TenantRenting({ onClick }: TenantRentingProps) {
  return (
    <div className="fixed w-full h-full top-0 left-0 bg-white z-10">
      <div className="flex w-full justify-between p-4">
        <h1 className="text-3xl font-bold text-gray-900">Renting</h1>
        <button onClick={() => onClick("")}>
          <X size={30} />
        </button>
      </div>
      <Tabs defaultValue="renting" className="px-4">
        <TabsList>
          <TabsTrigger value="renting">Current Renting</TabsTrigger>
          <TabsTrigger value="requests">Requests and Invites</TabsTrigger>
          <TabsTrigger value="past">Past Rentals</TabsTrigger>
        </TabsList>
        <TabsContent value="renting" className="py-4">
          <Renting />
        </TabsContent>
        <TabsContent value="requests" className="py-4">
          <RequestsAndInvites />
        </TabsContent>
        <TabsContent value="past" className="py-4">
          <TenantPastRentals />
        </TabsContent>
      </Tabs>
    </div>
  );
}
