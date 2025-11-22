import RequestItem, { type requestTenancy } from "./requestItem";
import { useTenanciesContext } from "@/hooks/useTenanciesContext";

type RequestProps = {};

export default function Request({}: RequestProps) {
    const { tenancies } = useTenanciesContext();
    // const filteredTenancies = tenancies.filter(tenancy => tenancy.status !== "active");

  return (
    <div className="py-3 space-y-2">
      {tenancies.map((req) => (
        <RequestItem key={req.id} request={req as requestTenancy} />
      ))}
    </div>
  );
}
