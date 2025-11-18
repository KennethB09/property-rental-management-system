import type { conversation } from "@/types/interface";
import { supabase } from "@/supabaseClient";
import { useConversationContext } from "@/hooks/useConversationContext";
import type { message } from "@/types/interface";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { useAuthContext } from "@/context/AuthContext";

type ChatItemProps = {
  conversation: conversation;
  onClickConversation: () => void;
};

export default function ChatItem({ conversation, onClickConversation }: ChatItemProps) {
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
            console.log("Message received via realtime:", payload.new);
            dispatch({ type: "NEW_MESSAGE", payload: payload.new as message })
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
  
  return (
    <div className="flex h-20" onClick={onClickConversation}>
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
