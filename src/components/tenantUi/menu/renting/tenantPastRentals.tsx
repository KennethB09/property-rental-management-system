import { useTenanciesContext } from "@/hooks/useTenanciesContext";
import PastRentalItem from "./pastRentalItem";

export default function TenantPastRentals() {
  const { tenancies } = useTenanciesContext();
  const filterRenting = tenancies.filter((item) => item.status === "ended");

  return (
    <div>
      {filterRenting.map((item) => (
        <PastRentalItem key={item.id} pastRental={item} />
      ))}
    </div>
  );
}
