import type { TProperty } from "@/types/appData";

type ItemHomeProps = {
  property: TProperty;
};

export default function ItemHome({ property }: ItemHomeProps) {
  return (
    <div className="flex items-center gap-2 h-24">
      <div className="aspect-square flex justify-center items-center w-24">
        <img
          className="h-20 object-cover rounded-2xl"
          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${property.thumbnail}`}
        />
      </div>
      <div>
        <h1 className="font-bold text-lg text-gray-900">{property.name}</h1>
        <span className="font-semibold text-base text-gray-800">Rent: {property.rent}</span>
      </div>
    </div>
  );
}
