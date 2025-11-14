import TenantHeader from "@/components/tenantUi/tenantHeader";
import emptyProfile from "@/assets/svgs/blank-profile-picture-973460.svg"
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

export type TactiveList = "profile" | "renting";

export default function TenantMenu() {
  const { session, signOut } = useAuthContext();
  const { getTenantProfile } = useApi();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<undefined | tenant>(undefined);
  const [activeList, setActiveList] = useState<TactiveList | "">("");

  useEffect(() => {
    async function getProfile() {
      setLoading(true)

      const profile = await getTenantProfile();

      if (profile.error) {
        setLoading(false);
        return toast.error(profile.error);
      }

      setLoading(false);
      setProfile(profile.data);
    };

    getProfile();
  }, [])

  return (
    <div className="flex flex-col h-screen gap-4">

      {activeList !== "" && profile && <TenantProfile tenant={profile} onClose={setActiveList}/>}

      <TenantHeader title="Menu" />

      <div className="flex flex-col items-center h-full gap-3">
        <div className="flex justify-center items-center rounded-full border-1 border-green-700 aspect-square h-44 overflow-hidden">
          {loading ? (
            <Loader2 className="animate-spin text-gray-700" />
          ) : (
            <img
              className="aspect-square w-full object-fill"
              src={profile && profile.profile_pic ? `https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/${profile.profile_pic}` : emptyProfile}
            />
          )}
        </div>
        <h1 className="text-lg font-semibold text-gray-900">
          {session.user.user_metadata.first_name}{" "}
          {session.user.user_metadata.last_name}
        </h1>
        <div className="flex flex-col justify-between h-full w-full">
          <div className="mx-4">
            <div className="py-1 flex gap-4 items-center text-gray-900">
              <House size={35} />
              <h2 className="text-xl font-semibold">Renting</h2>
            </div>
            <div
              className="py-1 flex gap-4 items-center text-gray-900"
              onClick={() => setActiveList("profile")}
            >
              <User size={35} />
              <h2 className="text-xl font-semibold">Profile</h2>
            </div>
            <div className="py-1 flex gap-3 w-full justify-between items-center">
              <div className="flex gap-4 items-center text-gray-900">
                <SunMoon size={35} />
                <h2 className="text-xl font-semibold">Theme</h2>
              </div>
              <ModeToggle />
            </div>
          </div>

          <Button
            variant={"outline"}
            className="text-red-500 border-red-500 mt-auto mb-20 mx-4"
            onClick={signOut}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
