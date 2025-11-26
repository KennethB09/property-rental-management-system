import { Button } from "@/components/ui/button";
import { useApi } from "@/context/ApiContext";
import { useTenanciesContext } from "@/hooks/useTenanciesContext";
import type { tenanciesStatus } from "@/types/enums";
import type { listing, tenancies, tenant } from "@/types/interface";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export type requestTenancy = Omit<tenancies, "property_id, tenant_id"> & {
  property_id: listing;
  tenant_id: tenant;
};

type RequestItemProps = {
  request: requestTenancy;
};

export default function RequestItem({ request }: RequestItemProps) {
  const { updateTenancyStatus } = useApi();
  const { dispatch } = useTenanciesContext();
  const [isLoading, setIsLoading] = useState(false);

  async function updateStatus(id: string, newStatus: tenanciesStatus) {
    setIsLoading(true);

    const response = await updateTenancyStatus(
      id,
      newStatus,
      request.property_id.id
    );

    if (response.error) {
      setIsLoading(false);
      console.error(response.error);
      return toast.error("Ops, something went wrong. Please try again.");
    }

    setIsLoading(false);
    dispatch({
      type: "CHANGE_STATUS",
      payload: { id: response.data?.id!, status: response.data?.status! },
    });
  }

  if (request.initiated_by === "landlord") {
    return (
      <div className="flex flex-wrap border justify-between items-center gap-4 border-gray-200 rounded-2xl p-3">
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100">Invite</h1>
          <p className="text-base text-gray-900 dark:text-slate-100">
            You invited{" "}
            <span className="font-semibold">
              {request.tenant_id.first_name} {request.tenant_id.last_name}
            </span>{" "}
            to rent{" "}
            <span className="font-semibold">"{request.property_id.name}"</span>.
          </p>
          <span className="text-gray-500 font-semibold">
            {format(new Date(request.created_at), "MMM dd yyyy hh:mm aa")}
          </span>
        </div>
        {request.status === "pending" && (
          <div className="text-gray-900 flex justify-between items-center w-full lg:w-1/2">
            <p className="font-semibold text-base">Waiting for confirmation</p>
            <Button
              variant={"secondary"}
              onClick={() => updateStatus(request.id, "cancelled")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        )}
        {request.status === "declined" && (
          <div className="text-red-500 space-y-3">
            <p className="font-semibold text-base">
              <span className="font-semibold">
                {request.tenant_id.first_name} {request.tenant_id.last_name}
              </span>{" "}
              declined the invite.
            </p>
          </div>
        )}
        {request.status === "active" && (
          <div className="text-green-700 space-y-3">
            <p className="font-semibold text-base">
              <span className="font-semibold">
                {request.tenant_id.first_name} {request.tenant_id.last_name}
              </span>{" "}
              accepted the invite.
            </p>
          </div>
        )}
        {request.status === "cancelled" && (
          <div className="text-yellow-500 space-y-3">
            <p className="font-semibold text-base">
              You cancelled your invite.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border border-gray-200 rounded-2xl p-3">
      <div className="space-y-1">
        <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100">Rent Request</h1>
        <p className="text-base text-gray-900 dark:text-slate-100">
          <span className="font-semibold">
            {request.tenant_id.first_name} {request.tenant_id.last_name}
          </span>{" "}
          want to rent{" "}
          <span className="font-semibold">"{request.property_id.name}"</span>.
        </p>
        <span className="text-gray-500 font-semibold">
          {format(new Date(request.created_at), "MMM dd yyyy hh:mm aa")}
        </span>
      </div>
      {request.status === "pending" && (
        <div className="flex gap-3">
          <Button
            className="bg-green-700"
            onClick={() => updateStatus(request.id, "active")}
            disabled={isLoading}
          >
            Accept
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => updateStatus(request.id, "declined")}
            disabled={isLoading}
          >
            Decline
          </Button>
        </div>
      )}
      {request.status === "declined" && (
        <div className="text-red-500 space-y-3">
          <p className="font-semibold text-base">You declined the request.</p>
        </div>
      )}
      {request.status === "active" && (
        <div className="text-green-700 space-y-3">
          <p className="font-semibold text-base">You accepted the request.</p>
        </div>
      )}
      {request.status === "cancelled" && (
        <div className="text-yellow-500 space-y-3">
          <p className="font-semibold text-base">Request cancelled.</p>
        </div>
      )}
    </div>
  );
}
