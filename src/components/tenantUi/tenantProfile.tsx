import { X } from "lucide-react";
import emptyProfile from "@/assets/svgs/blank-profile-picture-973460.svg";
import type { tenant } from "@/types/interface";
import { Button } from "../ui/button";
import { useState } from "react";
import TenantEditProfile from "./tenantEditProfile";

export type TactiveList = "profile" | "renting";

type TenantProfileProps = {
  tenant: tenant;
  onClose: React.Dispatch<React.SetStateAction<TactiveList | "">>;
};

export default function TenantProfile({ tenant, onClose }: TenantProfileProps) {
  const [openEditModal, setOpenEditModal] = useState(false);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden h-full w-full z-20 bg-white dark:bg-gray-900 lg:border lg:border-gray-300 lg:rounded-2xl lg:h-full lg:w-1/2 lg:relative">
      {openEditModal && (
        <TenantEditProfile userData={tenant} setState={setOpenEditModal} />
      )}

      <div className="flex items-center justify-between h-16 p-4">
        <button onClick={() => onClose("")} className="">
          <X size={30} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 ml-6">Profile</h1>
        <Button
          variant={"outline"}
          className=""
          onClick={() => setOpenEditModal(true)}
        >
          Edit
        </Button>
      </div>

      <div className="flex h-full overflow-y-scroll lg:px-8 lg:mb-4">
        <div className="flex flex-col items-center w-full">
          <img
            className="aspect-square rounded-full w-32 border-1 border-green-700"
            src={
              tenant.profile_pic !== ""
                ? `https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/${tenant.profile_pic}`
                : emptyProfile
            }
          />
          <div className="w-full px-4 space-y-4 mt-4">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-900 text-lg">
                First Name
              </span>
              <span className="rounded-2xl bg-gray-200 dark:bg-gray-800 p-3 text-gray-600 dark:text-gray-500 font-medium">
                {tenant.first_name}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-900 text-lg">
                Last Name
              </span>
              <span className="rounded-2xl bg-gray-200 p-3 dark:bg-gray-800 text-gray-600 dark:text-gray-500 font-medium">
                {tenant.last_name}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-900 text-lg">
                Phone Number
              </span>
              <span className="rounded-2xl bg-gray-200 dark:bg-gray-800 p-3 text-gray-600 dark:text-gray-500 font-medium">
                {tenant.phone_number}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-900 text-lg">Email</span>
              <span className="rounded-2xl bg-gray-200 dark:bg-gray-800 p-3 text-gray-600 dark:text-gray-500 font-medium">
                {tenant.email}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-900 text-lg">
                Occupation
              </span>
              <span className="rounded-2xl bg-gray-200 dark:bg-gray-800 p-3 text-gray-600 dark:text-gray-500 font-medium capitalize">
                {tenant.occupation.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
