import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext.tsx";
import { toast } from "sonner";
import { Loader2, SunMoon, Star } from "lucide-react";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import type { TuserProfile } from "@/types/userData";
import LandlordProfile from "@/components/landlordUi/menu/profile/landlordProfile";

export type TactiveList = "profile" | "your-rating";

export default function LandlordMenu() {
  const { session, signOut } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<null | TuserProfile>(null);
  const [activeList, setActiveList] = useState<TactiveList | "">("");

  useEffect(() => {
    async function getUserProfile() {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/get-profile/${
          session.user.id
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        if (response.status >= 400 && response.status <= 500) {
          return toast.error(
            json.message || "Ops, something went wrong please try again."
          );
        }

        if (response.status >= 300 && response.status <= 400) {
          return toast.warning(json.message);
        }
      }

      setProfile(json);
      setLoading(false);
    }

    getUserProfile();
  }, []);

  return (
    <div className="flex flex-col p-4 h-full gap-4 font-roboto">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Menu</h1>
      </header>
      <div className="flex flex-col h-full">
        {activeList !== "" && (
          <div className="absolute w-full h-full z-10 left-0 top-0 bg-white">
            {activeList === "profile" && profile && (
              <LandlordProfile
                userId={session.user.id}
                userData={profile}
                setState={setActiveList}
              />
            )}
          </div>
        )}
        <div className="flex flex-col items-center h-full gap-3">
          <div className="flex justify-center items-center rounded-full border-1 border-green-700 aspect-square h-44 overflow-hidden">
            {loading ? (
              <Loader2 className="animate-spin text-gray-700" />
            ) : (
              <img
                className="aspect-square w-32 object-fill"
                src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/profile/${session.user.id}/${profile?.userProfile[0].name}`}
              />
            )}
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            {profile?.userData.first_name} {profile?.userData.last_name}
          </h1>
          <div className="flex flex-col justify-between h-full w-full">
            <div className="w-full">
              <div className="py-1 flex gap-4 items-center text-gray-900">
                <Star size={30} />
                <h2 className="text-lg font-semibold">Your Ratings</h2>
              </div>
              <div
                className="py-1 flex gap-4 items-center text-gray-900"
                onClick={() => setActiveList("profile")}
              >
                <User size={30} />
                <h2 className="text-lg font-semibold">Profile</h2>
              </div>
              <div className="py-1 flex gap-3 w-full justify-between items-center">
                <div className="flex gap-4 items-center text-gray-900">
                  <SunMoon size={30} />
                  <h2 className="text-lg font-semibold">Theme</h2>
                </div>
                <ModeToggle />
              </div>
            </div>

            <Button
              variant={"outline"}
              className="w-full text-red-500 border-red-500 mt-auto mb-16"
              onClick={signOut}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
