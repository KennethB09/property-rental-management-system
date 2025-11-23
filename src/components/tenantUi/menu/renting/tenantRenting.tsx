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
    <div className="fixed flex flex-col w-full h-full top-0 left-0 bg-white z-10 lg:static lg:border lg:border-gray-300 lg:rounded-2xl lg:w-1/2">
      <div className="flex w-full justify-between p-4">
        <h1 className="text-2xl font-bold text-gray-900">Renting</h1>
        <button onClick={() => onClick("")}>
          <X size={25} />
        </button>
      </div>

      <Tabs defaultValue="renting" className="px-4 overflow-y-hidden">
        <TabsList>
          <TabsTrigger value="renting">Current Renting</TabsTrigger>
          <TabsTrigger value="requests">Requests and Invites</TabsTrigger>
          <TabsTrigger value="past">Past Rentals</TabsTrigger>
        </TabsList>
        <TabsContent value="renting" className="py-4">
          <Renting />
        </TabsContent>
        <TabsContent value="requests" className="py-4 h-full overflow-y-auto">
          <RequestsAndInvites />
        </TabsContent>
        <TabsContent value="past" className="py-4">
          <TenantPastRentals />
        </TabsContent>
      </Tabs>
    </div>
  );
}
