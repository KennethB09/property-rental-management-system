import type { TProperty } from "@/types/appData";

type ItemHomeProps = {
  property: TProperty;
};

export default function ItemHome({ property }: ItemHomeProps) {
  return (
    <div className="flex items-center gap-2 h-20 w-full">
      <div className="aspect-square flex justify-center items-center w-20 h-full">
        <img
          className="h-full w-20 aspect-square object-cover rounded-2xl"
          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${property.thumbnail}`}
        />
      </div>
      <div className="flex flex-col w-full overflow-hidden">
        <h1 className="font-bold text-lg  truncate text-gray-900">{property.name}</h1>
        <span className="font-semibold text-base text-gray-800">Rent: {property.rent}</span>
      </div>
    </div>
  );
}
