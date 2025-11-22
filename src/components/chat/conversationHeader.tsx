import type { conversation } from "@/types/interface";
import { ArrowLeft } from "lucide-react";

type ConversationHeaderProps = {
  onClose: () => void;
  conversation: conversation;
};

export default function ConversationHeader({
  onClose,
  conversation,
}: ConversationHeaderProps) {
  return (
    <div className="flex gap-4 items-center p-4 shadow-2xs">
      <button className="text-gray-900" onClick={onClose}>
        <ArrowLeft size={30} />
      </button>
      <div className="flex gap-3 items-center">
        <img
          className="aspect-square w-16 rounded-full object-cover"
          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${conversation.listing_id.thumbnail}`}
        />
        <h1 className="font-semibold text-gray-900 text-xl">
          {conversation.listing_id.name}
        </h1>
      </div>
    </div>
  );
}
