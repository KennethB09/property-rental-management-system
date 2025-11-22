import { useTenanciesContext } from "@/hooks/useTenanciesContext";
import RequestOrInviteItem, { type requestOrInviteItemTenancy } from "./requestOrInviteItem";

export default function RequestsAndInvites() {
    const { tenancies } = useTenanciesContext();

    return (
        <div className="flex flex-col gap-2">
            {tenancies.map(item => (
                <RequestOrInviteItem key={item.id} item={item as unknown as requestOrInviteItemTenancy}/>
            ))}
        </div>
    )
}