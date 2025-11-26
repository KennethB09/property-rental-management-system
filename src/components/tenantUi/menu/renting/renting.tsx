import { useTenanciesContext } from "@/hooks/useTenanciesContext"
import RentingItem from "./rentingItem";

export default function Renting() {
    const { tenancies } = useTenanciesContext();
    const filterRenting = tenancies.filter(item => item.status === "active");

    return (
        <div className="flex flex-col-reverse gap-2">
            {filterRenting.map(renting => (
                <RentingItem key={renting.id} renting={renting}/>
            ))}
        </div>
    )
}