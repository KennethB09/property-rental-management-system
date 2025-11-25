import RequestItem, { type requestTenancy } from "./requestItem";
import { useTenanciesContext } from "@/hooks/useTenanciesContext";

type RequestProps = {};

export default function Request({}: RequestProps) {
    const { tenancies } = useTenanciesContext();
    // const filteredTenancies = tenancies.filter(tenancy => tenancy.status !== "active");

  return (
    <div className="flex flex-col-reverse gap-2 max-sm:pb-16">
      {tenancies.map((req) => (
        <RequestItem key={req.id} request={req as requestTenancy} />
      ))}
    </div>
  );
}
