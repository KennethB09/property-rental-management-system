import type { review } from "@/types/interface";
import { format } from "date-fns";

type ReviewItemProps = {
  data: review;
};

export default function ReviewItem({ data }: ReviewItemProps) {
  return (
    <div className="flex flex-col gap-2 border border-gray-200 p-3 rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <img
            className="aspect-square rounded-full border border-gray-400 w-8"
            src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/${data.tenant_ID.profile_pic}`}
          />
          <h1 className="text-base font-semibold text-gray-900 dark:text-slate-100">
            {data.tenant_ID.first_name} {data.tenant_ID.last_name}
          </h1>
        </div>
        <span className="font-semibold text-gray-700 dark:text-slate-400">Rating: {data.rating}</span>
      </div>
      <div>
        <p className="text-base text-gray-900 dark:text-slate-100">{data.content}</p>
      </div>
      <div>
        <span className="font-semibold text-gray-600 text-sm">
          {format(new Date(data.created_at), "MMM dd, yyyy")}
        </span>
      </div>
    </div>
  );
}
