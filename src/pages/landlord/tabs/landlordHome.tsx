import ItemHome from "@/components/landlordUi/home/itemHome";
import { usePropertyContext } from "@/hooks/usePropertyContext";

export default function LandlordHome() {
  const { properties } = usePropertyContext();

  return (
    <div className="h-full">
      {properties.map((property) => (
        <ItemHome key={property.id} property={property} />
      ))}
    </div>
  );
}
