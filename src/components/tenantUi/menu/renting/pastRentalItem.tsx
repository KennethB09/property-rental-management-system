import { Button } from "@/components/ui/button";
import type { tenancies } from "@/types/interface";
import { format } from "date-fns";

type PastRentalItemProps = {
  pastRental: tenancies;
  handleClick: (data: tenancies) => void;
};

export default function PastRentalItem({ pastRental, handleClick }: PastRentalItemProps) {
  return (
    <div className="flex flex-wrap gap-1 border border-gray-200 rounded-2xl p-3">
      <div className="flex items-center gap-2">
        <img
          className="object-cover aspect-square rounded-2xl w-16 h-16"
          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${pastRental.property_id.thumbnail}`}
        />
        <div className="overflow-hidden">
          <h1 className="text-gray-900 dark:text-slate-100 font-semibold text-lg truncate">
            {pastRental.property_id.name}
          </h1>
          <div className="flex flex-wrap gap-1 text-sm font-regular text-gray-700 dark:text-slate-500">
            <span>Rent: {pastRental.property_id.rent}</span>
            <span>
              Rented on: {format(new Date(pastRental.start), "MMM dd, yyyy")}
            </span>
            <span>
              Ended on: {format(pastRental.end ? new Date(pastRental.end) : new Date(), "MMM dd, yyyy")}
            </span>
          </div>
        </div>
      </div>
        <Button variant={"outline"} className="ml-auto" onClick={() => handleClick(pastRental)}>Write a review</Button>
    </div>
  );
}
