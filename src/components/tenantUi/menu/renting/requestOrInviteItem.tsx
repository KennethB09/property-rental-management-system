import type { landlord, tenancies, tenant } from "@/types/interface";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useApi } from "@/context/ApiContext";
import type { tenanciesStatus } from "@/types/enums";
import { toast } from "sonner";
import { useState } from "react";
import { useTenanciesContext } from "@/hooks/useTenanciesContext";

export type requestOrInviteItemTenancy = Omit<
  tenancies,
  "tenant_id, landlord_id"
> & {
  tenant_id: tenant;
  landlord_id: landlord;
};

type RequestOrInviteItemProps = {
  item: requestOrInviteItemTenancy;
};

export default function RequestOrInviteItem({
  item,
}: RequestOrInviteItemProps) {
  const { updateTenancyStatus } = useApi();
  const { dispatch } = useTenanciesContext();
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(newStatus: tenanciesStatus) {
    setIsLoading(true);

    const response = await updateTenancyStatus(
      item.id,
      newStatus,
      item.property_id.id
    );

    if (response.error) {
      setIsLoading(false);
      return toast.error(response.error);
    }

    setIsLoading(false);

    if (response.data?.status === "active") toast.success("Rent successfully.");

    if (response.data?.status === "declined") toast.success("Invite declined.");

    if (response.data?.status === "ended") toast.success("Leave successfully.");

    dispatch({
      type: "CHANGE_STATUS",
      payload: { id: response.data?.id!, status: response.data?.status! },
    });
  }

  if (item.initiated_by === "landlord") {
    return (
      <div className="flex flex-wrap border gap-2 border-gray-200 rounded-2xl p-3">
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-gray-900">Landlord Invite</h1>
          <p className="text-base text-gray-900">
            <span className="font-semibold">
              {item.landlord_id.first_name} {item.landlord_id.last_name}
            </span>{" "}
            invited you to rent{" "}
            <span className="font-semibold">"{item.property_id.name}"</span>.
          </p>
          <span className="text-gray-500 font-semibold">
            {format(new Date(item.created_at), "MMM dd yyyy hh:mm aa")}
          </span>
        </div>
        {item.status === "pending" && (
          <div className="text-gray-900 flex gap-2">
            <Button
              variant={"secondary"}
              onClick={() => handleUpdate("declined")}
              disabled={isLoading}
            >
              Decline
            </Button>
            <Button
              className="bg-green-700"
              onClick={() => handleUpdate("active")}
              disabled={isLoading}
            >
              Accept
            </Button>
          </div>
        )}
        {item.status === "declined" && (
          <div className="text-red-500 space-y-3">
            <p className="font-semibold text-base">Invite delined.</p>
          </div>
        )}
        {item.status === "active" && (
          <div className="text-green-700 space-y-3">
            <p className="font-semibold text-base">Invite accepted.</p>
          </div>
        )}
        {item.status === "cancelled" && (
          <div className="text-yellow-500 space-y-3">
            <p className="font-semibold text-base">
              You cancelled your request.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 border border-gray-200 rounded-2xl p-3">
      <div className="space-y-1">
        <h1 className="text-lg font-bold text-gray-900">Rent Request</h1>
        <p className="text-base text-gray-900">
          You sent rent request to
          <span className="font-semibold">
            {item.landlord_id.first_name} {item.landlord_id.last_name}
          </span>{" "}
          to rent{" "}
          <span className="font-semibold">"{item.property_id.name}"</span>.
        </p>
        <span className="text-gray-500 font-semibold">
          {format(new Date(item.created_at), "MMM dd yyyy hh:mm aa")}
        </span>
      </div>
      {item.status === "pending" && (
        <div className="flex gap-3">
          <Button
            variant={"secondary"}
            onClick={() => handleUpdate("cancelled")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      )}
      {item.status === "declined" && (
        <div className="text-red-500 space-y-3">
          <p className="font-semibold text-base">
            Landlord declined the request.
          </p>
        </div>
      )}
      {item.status === "active" && (
        <div className="text-green-700 space-y-3">
          <p className="font-semibold text-base">
            Landlord accepted the request.
          </p>
        </div>
      )}
      {item.status === "cancelled" && (
        <div className="text-yellow-500 space-y-3">
          <p className="font-semibold text-base">Request cancelled.</p>
        </div>
      )}
    </div>
  );
}
