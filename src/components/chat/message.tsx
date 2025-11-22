import type { message } from "@/types/interface";
import emptyProfile from "@/assets/svgs/blank-profile-picture-973460.svg";
import { format } from "date-fns";

type Treciever = {
  id: string;
  first_name: string;
  last_name: string;
  profile: string;
};

type MessageProps = {
  currentUser: string;
  reciever: Treciever;
  message: message;
};

export default function Message({
  message,
  currentUser,
  reciever,
}: MessageProps) {
  if (currentUser === message.sender_id) {
    return (
      <div className="flex justify-end">
        <div className="flex flex-col w-[65%]">
          <div className="bg-green-700 w-fit ml-auto rounded-2xl p-3">
            <p className="text-white">{message.content}</p>
          </div>
          <div className="flex justify-end">
            <span className="text-gray-500 font-semibold text-sm">
              {format(new Date(message.created_at), "hh:mm aa")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex flex-col w-[65%]">
        <div className="flex gap-2">
          <img
            className="aspect-square h-8 rounded-full object-cover"
            src={
              reciever.profile !== ""
                ? `https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/${reciever.profile}`
                : emptyProfile
            }
          />
          <div className="bg-green-700 w-fit mr-auto rounded-2xl p-3">
            <p className="text-white">{message.content}</p>
          </div>
        </div>
        <div>
          <span className="text-gray-500 font-semibold text-sm">
            {format(new Date(message.created_at), "hh:mm aa")}
          </span>
        </div>
      </div>
    </div>
  );
}
