import type { conversation } from "@/types/interface";

type ChatItemProps = {
  conversation: conversation;
};

export default function ChatItem({ conversation }: ChatItemProps) {
  return (
    <div className="flex h-20">
      <div className="flex justify-center aspect-square items-center w-20 h-full object-fill">
        <img
          className="w-full h-full object-cover rounded-full"
          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${conversation.listing_id.thumbnail}`}
        />
      </div>
      <div>
        <h1>{conversation.listing_id.name}</h1>
        <span>{conversation.last_msg}</span>
      </div>
    </div>
  );
}
