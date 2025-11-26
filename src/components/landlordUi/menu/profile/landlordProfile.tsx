import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { TuserProfile } from "@/types/userData";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TactiveList } from "@/pages/landlord/tabs/landlordMenu";
import LandlordEditProfile from "./landlordEditProfile";

type LandlordProfileProps = {
  userId: string;
  userData: TuserProfile;
  setState: React.Dispatch<React.SetStateAction<TactiveList | "">>;
};

export default function LandlordProfile({
  userId,
  userData,
  setState,
}: LandlordProfileProps) {
  const [editProfile, setEditProfile] = useState(false);

  return (
    <div className="font-roboto overflow-y-scroll no-scrollbar dark:bg-gray-900">
      {editProfile && (
        <div className="absolute w-full h-full z-10 left-0 top-0 bg-white dark:bg-gray-900 overflow-y-auto">
          <LandlordEditProfile userData={userData} setState={setEditProfile} />
        </div>
      )}
      <div className="text-gray-900 flex justify-between items-center p-4 mb-4">
        <button onClick={() => setState("")} className="w-14">
          <ArrowLeft size={25} />
        </button>
        <h1 className="text-xl font-bold">Profile</h1>
        <Button variant={"outline"} className="w-14" onClick={() => setEditProfile(prev => !prev)}>
          Edit
        </Button>
      </div>
      <div className="flex flex-col items-center gap-10 p-4">
        <div className="flex justify-center items-center rounded-full border-1 border-green-700 aspect-square h-32 overflow-hidden">
          <img
            className="aspect-square w-fill object-fill"
            src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/profile/${userId}/${userData.userProfile[0].name}`}
          />
        </div>
        <div className="w-full space-y-3">
          <div className="space-y-2">
            <Label htmlFor="fname" className="font-semibold text-gray-900">
              First Name
            </Label>
            <Input
              id="fname"
              value={userData.userData.first_name}
              disabled
              className="border-1 border-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lname" className="font-semibold text-gray-900">
              Last Name
            </Label>
            <Input
              id="lname"
              value={userData.userData.last_name}
              disabled
              className="border-1 border-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-gray-900">
              Email
            </Label>
            <Input
              id="email"
              value={userData.userData.email}
              disabled
              className="border-1 border-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-semibold text-gray-900">
              Phone Number
            </Label>
            <Input
              id="phone"
              value={userData.userData.phone_number}
              disabled
              className="border-1 border-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business" className="font-semibold text-gray-900">
              Business Name
            </Label>
            <Input
              id="business"
              value={userData.userData.business_name}
              disabled
              className="border-1 border-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="font-semibold text-gray-900">
              Address
            </Label>
            <Input
              id="address"
              value={userData.userData.address}
              disabled
              className="border-1 border-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
