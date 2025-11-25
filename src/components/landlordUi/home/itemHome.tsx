import type { TProperty } from "@/types/appData";

type ItemHomeProps = {
  property: TProperty;
};

const statusStyle = {
  unlisted: "rounded-2xl py-1 px-2 border border-yellow-600 w-24 text-center bg-yellow-200 text-yellow-600 text-sm",
  available: "rounded-2xl py-1 px-2 border border-green-600 w-24 text-center bg-green-200 text-green-600 text-sm",
  occupied: "rounded-2xl py-1 px-2 border border-blue-600 w-24 text-center bg-blue-200 text-blue-600 text-sm"
}

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
        <h1 className="font-bold text-lg truncate text-gray-900">{property.name}</h1>
        <span className="font-semibold text-base text-gray-800">Rent: {property.rent}</span>
      </div>
      <span className={statusStyle[property.status]}>{property.status}</span>
    </div>
  );
}
