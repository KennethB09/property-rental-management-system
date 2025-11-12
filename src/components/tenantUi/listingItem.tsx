import type { TProperty } from "@/types/appData"
import { Heart } from "lucide-react";


type ListingItemProps = {
    property: TProperty;
    onClick: (param: TProperty) => void;
}

export default function ListingItem({ property, onClick }: ListingItemProps) {


    return (
        <div onClick={() => onClick(property)}>
            <div><Heart /></div>

            <img src=""/>

            <div>
                <h1>{property.name}</h1>
                <span>{}</span>
            </div>
        </div>
    )
}