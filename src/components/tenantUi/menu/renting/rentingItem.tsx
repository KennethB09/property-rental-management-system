import { Button } from "@/components/ui/button";
import { useApi } from "@/context/ApiContext";
import { useTenanciesContext } from "@/hooks/useTenanciesContext";
import type { tenanciesStatus } from "@/types/enums";
import type { tenancies } from "@/types/interface";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

type RentingItemProps = {
  renting: tenancies;
};

export default function RentingItem({ renting }: RentingItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { updateTenancyStatus } = useApi();
  const { dispatch } = useTenanciesContext();

  async function leaveProperty(newStatus: tenanciesStatus) {
    setIsLoading(true);

    const response = await updateTenancyStatus(
      renting.id,
      newStatus,
      renting.property_id.id
    );

    if (response.error) {
      setIsLoading(false);
      console.log(response.error);
      return toast.error("Ops, something went wrong. Please try again.");
    }

    setIsLoading(false);
    dispatch({
      type: "CHANGE_STATUS",
      payload: { id: renting.id, status: response.data?.status! },
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex gap-2">
        <img
          className="object-cover aspect-square rounded-2xl w-24 h-24"
          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${renting.property_id.thumbnail}`}
        />
        <div className="overflow-hidden">
          <h1 className="text-gray-900 font-semibold text-lg truncate">
            {renting.property_id.name}
          </h1>
          <div className="flex flex-wrap gap-2 font-regular text-gray-700">
            <span>Rent: {renting.property_id.rent}</span>
            <span>
              Rented on: {format(new Date(renting.start), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex justify-end w-full">
            <Button variant={"outline"} onClick={() => leaveProperty("ended")} disabled={isLoading}>Leave</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
