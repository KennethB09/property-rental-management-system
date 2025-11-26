import TenantHeader from "@/components/tenantUi/tenantHeader";
import emptyProfile from "@/assets/svgs/blank-profile-picture-973460.svg";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext.tsx";
import { toast } from "sonner";
import { Loader2, SunMoon, House } from "lucide-react";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import { useApi } from "@/context/ApiContext";
import type { tenant } from "@/types/interface";
import TenantProfile from "@/components/tenantUi/tenantProfile";
import TenantRenting from "@/components/tenantUi/menu/renting/tenantRenting";

export type TactiveList = "profile" | "renting";

export default function TenantMenu() {
  const { signOut } = useAuthContext();
  const { getTenantProfile } = useApi();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<undefined | tenant>(undefined);
  const [activeList, setActiveList] = useState<TactiveList | "">("");

  useEffect(() => {
    async function getProfile() {
      setLoading(true);

      const profile = await getTenantProfile();

      if (profile.error) {
        setLoading(false);
        return toast.error(profile.error);
      }

      setLoading(false);
      setProfile(profile.data);
    }

    getProfile();
  }, []);

  return (
    <div className="flex flex-col h-full lg:w-[91%] max-md:bg-gray-900">
      <TenantHeader title="Menu" />

      <div className="lg:m-4 lg:p-4 lg:border lg:border-gray-300 dark:bg-gray-900 lg:rounded-2xl flex-1 min-h-0 lg:flex">
        <div className="flex flex-col items-center h-full gap-3 lg:w-1/2">
          <div className="flex justify-center items-center rounded-full border-1 border-green-700 aspect-square h-44 overflow-hidden">
            {loading ? (
              <Loader2 className="animate-spin text-gray-700" />
            ) : (
              <img
                className="aspect-square w-full object-fill"
                src={
                  profile && profile.profile_pic
                    ? `https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/${profile.profile_pic}`
                    : emptyProfile
                }
              />
            )}
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            {profile?.first_name}{" "}
            {profile?.last_name}
          </h1>
          <div className="flex flex-col justify-between h-full w-full">
            <div className="mx-4">
              <div
                className="py-1 flex gap-4 items-center text-gray-900 dark:text-slate-100"
                onClick={() => setActiveList("renting")}
              >
                <House size={35} />
                <h2 className="text-xl font-semibold">Renting</h2>
              </div>
              <div
                className="py-1 flex gap-4 items-center text-gray-900 dark:text-slate-100"
                onClick={() => setActiveList("profile")}
              >
                <User size={35} />
                <h2 className="text-xl font-semibold">Profile</h2>
              </div>
              <div className="py-1 flex gap-3 w-full justify-between items-center">
                <div className="flex gap-4 items-center text-gray-900 dark:text-slate-100">
                  <SunMoon size={35} />
                  <h2 className="text-xl font-semibold">Theme</h2>
                </div>
                <ModeToggle />
              </div>
            </div>

            <Button
              variant={"outline"}
              className="text-red-500 border-red-500 dark:bg-gray-800 dark:border-red-500 mt-auto mb-20 lg:mb-0 mx-4"
              onClick={signOut}
            >
              Logout
            </Button>
          </div>
        </div>

        {activeList === "profile" && profile && (
          <TenantProfile tenant={profile} onClose={setActiveList} />
        )}
        {activeList === "renting" && <TenantRenting onClick={setActiveList} />}
      </div>
    </div>
  );
}
