import { Button } from "@/components/ui/button";
import type { tenancies, listing, tenant } from "@/types/interface";
import { format } from "date-fns";

export type tenantTenancy = Omit<tenancies, "property_id, tenant_id"> & {
  property_id: listing;
  tenant_id: tenant;
};

type TenantItemProps = {
  tenant: tenantTenancy;
  onEvict: () => void;
};

export default function TenantItem({ tenant, onEvict }: TenantItemProps) {
  return (
    <div className="flex flex-wrap gap-2 border border-gray-200 rounded-2xl p-3">
      <div className="flex flex-wrap justify-between lg:w-full">
        <div className="flex items-center gap-3 w-full">
          <img
            className="aspect-square w-10 rounded-full"
            src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/${tenant.tenant_id.profile_pic}`}
          />
          <h1 className="text-lg text-gray-900 font-semibold">
            {tenant.tenant_id.first_name} {tenant.tenant_id.last_name}
          </h1>
        </div>
        <span className="font-semibold text-gray-900">Occupied: {tenant.property_id.name}</span>
        <div>
          <span className="font-semibold text-gray-900">
            Rented on: {format(tenant.start ? new Date(tenant.start) : new Date(), "MMM dd yyyy hh:mm aa")}
          </span>
          {tenant.end && <span>End on: {tenant.end}</span>}
        </div>
      </div>
      <div>
        <Button onClick={onEvict} variant={"destructive"} className="bg-transparent border border-red-600 text-red-600">Evict Tenant</Button>
      </div>
    </div>
  );
}
