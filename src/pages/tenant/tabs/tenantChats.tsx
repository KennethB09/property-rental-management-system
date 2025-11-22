import TenantHeader from "@/components/tenantUi/tenantHeader";
import Conversation from "@/components/chat/conversation";
import { useConversationContext } from "@/hooks/useConversationContext";
import ChatItem from "@/components/chat/chatItem";
import { useState } from "react";
import type { conversation } from "@/types/interface";

export default function TenantChats() {
  const [activeConversation, setActiveConversation] = useState<
    conversation | undefined
  >(undefined);
  const { conversations } = useConversationContext();

  function handleClickConversation(param: conversation) {
    setActiveConversation(param);
  }

  return (
    <div className="h-full">
      {activeConversation && <Conversation conversation={activeConversation} onClose={() => setActiveConversation(undefined)}/>}

      <TenantHeader title="Chats" />

      <div className="flex flex-col h-full overflow-y-scroll gap-2 px-4">
        {conversations.map((item) => (
          <ChatItem
            key={item.id}
            conversation={item}
            onClickConversation={() => handleClickConversation(item)}
          />
        ))}
      </div>
    </div>
  );
}
