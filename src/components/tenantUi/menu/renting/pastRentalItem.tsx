import type { tenancies } from "@/types/interface";
import { format } from "date-fns";

type PastRentalItemProps = {
  pastRental: tenancies;
};

export default function PastRentalItem({ pastRental }: PastRentalItemProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <img
          className="object-cover aspect-square rounded-2xl w-24 h-24"
          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${pastRental.property_id.thumbnail}`}
        />
        <div className="overflow-hidden">
          <h1 className="text-gray-900 font-semibold text-lg truncate">
            {pastRental.property_id.name}
          </h1>
          <div className="flex flex-col font-regular text-gray-700">
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
    </div>
  );
}
