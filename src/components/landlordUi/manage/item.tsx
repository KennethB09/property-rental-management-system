import type { TProperty } from "@/types/appData";

type ItemProps = {
    property: TProperty
    onClick: (param: TProperty) => void
}

export default function Item({ property, onClick }: ItemProps) {
  return (
    <div className="flex items-center gap-2 h-24" onClick={() => onClick(property)}>
      <div className="aspect-square flex justify-center items-center w-20 h-20">
        <img
          className="h-20 w-20 aspect-square object-cover rounded-2xl"
          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${property.thumbnail}`}
        />
      </div>
      <div className="truncate">
        <h1 className="font-bold text-lg text-gray-900 dark:text-slate-100">{property.name}</h1>
        <span className="font-semibold text-base text-gray-800 dark:text-slate-600">Rent: {property.rent}</span>
      </div>
    </div>
  );
}
