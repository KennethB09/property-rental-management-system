import { useTenanciesContext } from "@/hooks/useTenanciesContext";
import TenantItem, { type tenantTenancy } from "./tenantItem";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";

export default function Tenants() {
  const { session } = useAuthContext();
  const { tenancies, dispatch } = useTenanciesContext();
  const filterActive = tenancies.filter((item) => item.status === "active");
  const [alertOpen, setAlertOpen] = useState(false);
  const [evicting, setEvicting] = useState<tenantTenancy | undefined>(
    undefined
  );

  async function handleEviction(tenancy: tenantTenancy) {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/update-tenancy-status/${
        tenancy.property_id.id
      }`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id: tenancy.id, status: "ended" }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      return toast.error("Ops, something went wrong. Please try again.");
    }

    dispatch({
      type: "CHANGE_STATUS",
      payload: { id: tenancy.id, status: json.status },
    });
    setEvicting(undefined);
  }

  function handleClickEvict(tenancy: tenantTenancy) {
    setEvicting(tenancy);
    setAlertOpen(true);
  }

  return (
    <div className="py-3">
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Evict tenant</AlertDialogTitle>
            <AlertDialogDescription>
              Evicting a tenant through this application only removes the
              tenant's access and association within the app's system. It does
              not constitute a legal eviction. Landlords must still follow the
              proper legal process required by local laws and regulations to
              formally evict a tenant outside of the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleEviction(evicting!)} disabled={!evicting}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className=" space-y-2">
        {filterActive.map((tenant) => (
          <TenantItem
            key={tenant.id}
            tenant={tenant as tenantTenancy}
            onEvict={() => handleClickEvict(tenant as tenantTenancy)}
          />
        ))}
      </div>
    </div>
  );
}
