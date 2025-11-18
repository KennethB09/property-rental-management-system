import type { message } from "@/types/interface";

type MessageProps = {
  currentUser: string;
  message: message;
};

export default function Message({ message, currentUser }: MessageProps) {
  if (currentUser === message.sender_id) {
    return (
      <div className="flex justify-end">
        <div className="flex flex-col w-1/2 ">
          <div className="bg-green-700 w-fit ml-auto rounded-2xl p-3">
            <p className="text-white">{message.content}</p>
          </div>
          <div>
            <span className="text-gray-500 font-semibold text-sm">
              {message.created_at}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex flex-col w-1/2 ">
        <div className="bg-green-700 w-fit mr-auto rounded-2xl p-3">
          <p className="text-white">{message.content}</p>
        </div>
        <div>
          <span className="text-gray-500 font-semibold text-sm">
            {message.created_at}
          </span>
        </div>
      </div>
    </div>
  );
}
