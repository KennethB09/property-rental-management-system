import { X } from "lucide-react";
import emptyProfile from "@/assets/svgs/blank-profile-picture-973460.svg";
import { useAuthContext } from "@/context/AuthContext.tsx";
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
  const { session } = useAuthContext();
  const [openEditModal, setOpenEditModal] = useState(false);
  return (
    <div className="fixed h-screen w-full z-10 bg-white">
      {openEditModal && (
        <TenantEditProfile userData={tenant} setState={setOpenEditModal} />
      )}

      <div className="flex items-center justify-between h-16 p-4 mb-3">
        <button onClick={() => onClose("")} className="">
          <X size={30} />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 ml-6">Profile</h1>
        <Button
          variant={"outline"}
          className=""
          onClick={() => setOpenEditModal(true)}
        >
          Edit
        </Button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center items-center rounded-full border-1 border-green-700 aspect-square h-44 overflow-hidden">
          <img
            className="aspect-square w-full object-fill"
            src={
              tenant.profile_pic !== ""
                ? `https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/${tenant.profile_pic}`
                : emptyProfile
            }
          />
        </div>
        <div className="w-full px-4 space-y-4 mt-4">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-900 text-lg">
              First Name
            </span>
            <span className="rounded-2xl bg-gray-200 p-3 text-gray-600 font-medium">
              {tenant.first_name}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-900 text-lg">
              Last Name
            </span>
            <span className="rounded-2xl bg-gray-200 p-3 text-gray-600 font-medium">
              {tenant.last_name}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-900 text-lg">
              Phone Number
            </span>
            <span className="rounded-2xl bg-gray-200 p-3 text-gray-600 font-medium">
              {tenant.phone_number}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-900 text-lg">Email</span>
            <span className="rounded-2xl bg-gray-200 p-3 text-gray-600 font-medium">
              {tenant.email}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-900 text-lg">
              Occupation
            </span>
            <span className="rounded-2xl bg-gray-200 p-3 text-gray-600 font-medium capitalize">
              {tenant.occupation.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
