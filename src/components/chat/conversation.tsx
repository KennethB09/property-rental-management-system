import type { conversation } from "@/types/interface";
import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "@/context/AuthContext";
import Message from "./message";
import { useConversationContext } from "@/hooks/useConversationContext";
import ConversationForm from "./conversationForm";
import ConversationHeader from "./conversationHeader";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type TenantChatProps = {
  conversation: conversation;
  onClose: () => void;
};

export default function Conversation({
  conversation,
  onClose,
}: TenantChatProps) {
  const { session } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const newMessageRef = useRef<HTMLDivElement>(null);
  const { messages, dispatch } = useConversationContext();
  const reciever =
    conversation.landlord_id.id === session.user.id
      ? conversation.tenant_id
      : conversation.landlord_id;

  async function getMessages() {
    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/get-messages/${
        conversation.id
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
      setIsLoading(false);
      return toast.error(json.message || "Failed to load messages");
    }

    setIsLoading(false);
    dispatch({ type: "SET_MESSAGES", payload: json });
  }

  useEffect(() => {
    if (!session.user.id || !conversation) return;

    getMessages();
  }, [session.user.id, conversation]);

  const sortMessages = messages?.sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  useEffect(() => {
    if (newMessageRef.current!) {
      newMessageRef.current.scrollTo({
        top: newMessageRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [sortMessages]);

  return (
    <div
      className="fixed inset-0 h-screen w-full bg-white z-10 flex flex-col justify-between 
lg:static lg:border lg:border-gray-300 lg:rounded-2xl lg:h-full lg:w-1/2"
    >
      <ConversationHeader onClose={onClose} conversation={conversation} />

      <div className="flex-1 overflow-y-scroll p-4" ref={newMessageRef}>
        {!isLoading ? (
          <div className="flex flex-col space-y-3">
            {sortMessages.length === 0 && <p>No messages yet...</p>}
            {sortMessages.map((msg) => (
              <Message
                key={msg.id}
                message={msg}
                currentUser={session.user.id}
                reciever={{
                  id: reciever.id,
                  first_name: reciever.first_name,
                  last_name: reciever.last_name,
                  profile: reciever.profile_pic,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="h-full w-full flex justify-center items-center">
            <Loader2 size={30} className="animate-spin text-green-700" />
          </div>
        )}
      </div>

      <ConversationForm
        conversationId={conversation.id}
        landlordId={conversation.landlord_id.id}
        tenantId={conversation.tenant_id.id}
        propertyId={conversation.listing_id.id}
      />
    </div>
  );
}
