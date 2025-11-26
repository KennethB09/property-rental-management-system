import type { conversation } from "@/types/interface";
import { supabase } from "@/supabaseClient";
import { useConversationContext } from "@/hooks/useConversationContext";
import type { message } from "@/types/interface";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { format } from "date-fns";

type ChatItemProps = {
  conversation: conversation;
  onClickConversation: () => void;
};

export default function ChatItem({
  conversation,
  onClickConversation,
}: ChatItemProps) {
  const { dispatch } = useConversationContext();
  const { session } = useAuthContext();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const realtime = () => {
    const channel = supabase.channel(`room:${conversation.id}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `convo_id=eq.${conversation.id}`,
        },
        (payload) => {
          // console.log("Message received via realtime:", payload.new);
          dispatch({ type: "NEW_MESSAGE", payload: payload.new as message });
        }
      )
      .subscribe((status, error) => {
        if (status === "SUBSCRIBED") console.log("Realtime subscribed");
        if (status === "CHANNEL_ERROR") console.error("Channel error:", error);
      });

    return channel;
  };

  useEffect(() => {
    if (!session.user.id || !conversation) return;

    channelRef.current = realtime();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [session.user.id, conversation]);

  const sender = conversation.last_msg
    ? conversation.landlord_id.id === conversation.last_msg.sender_id
      ? conversation.landlord_id.first_name
      : conversation.tenant_id.first_name
    : "";

  return (
    <div
      className="flex h-20 w-full gap-4 items-center"
      onClick={onClickConversation}
    >
      <div className="flex justify-center aspect-square items-center w-20 h-full object-fill">
        <img
          className="w-full h-full object-cover rounded-full"
          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${conversation.listing_id.thumbnail}`}
        />
      </div>
      <div className="flex flex-col w-full min-w-0">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 truncate">
          {conversation.listing_id.name}
        </h1>
        {conversation.last_msg && (
          <div className="flex justify-between w-full overflow-hidden text-gray-500 min-w-0">
            <span className="truncate">
              {conversation.last_msg &&
                sender + ": " + conversation.last_msg.content}
            </span>
            <span className="flex-shrink-0 ml-2">
              {" • "}
              {conversation.last_msg &&
                format(new Date(conversation.last_msg.created_at), "hh:mm aa")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
