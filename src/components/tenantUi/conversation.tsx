import type { conversation } from "@/types/interface";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import Message from "../chat/message";
import { Send, Loader2, ArrowLeft, UserRoundPlus } from "lucide-react";
import { useConversationContext } from "@/hooks/useConversationContext";

type TenantChatProps = {
  conversation: conversation;
  onClose: () => void;
};

export default function Conversation({ conversation, onClose }: TenantChatProps) {
  const { session } = useAuthContext();
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
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

  async function sendMessage() {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/send-message/${
          conversation.id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            senderId: session.user.id,
            message: message,
            replyingTo: replyingTo,
          }),
        }
      );

      if (!response.ok) {
        const json = await response.json();
        toast.error(json.message || "Failed to send message");
        setIsLoading(false);
        return;
      }

      setMessage("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }

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
    <div className="fixed h-screen w-full bg-white z-10 flex flex-col justify-between">
      <div className="flex gap-4 items-center p-4 shadow-2xs">
        <button className="text-gray-900" onClick={onClose}>
          <ArrowLeft size={30}/>
        </button>
        <div className="flex gap-3 items-center">
          <img className="aspect-square w-16 rounded-full object-cover" src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${conversation.listing_id.thumbnail}`}/>
          <h1 className="font-semibold text-gray-900 text-xl">{conversation.listing_id.name}</h1>
        </div>
      </div>
      <div className="overflow-y-scroll p-4" ref={newMessageRef}>
        <div className="space-y-3">
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
      </div>
      <div className="flex gap-3 p-4">
        <Button className="bg-green-700"><UserRoundPlus />Add as tenant</Button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-green-700"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </div>
  );
}
