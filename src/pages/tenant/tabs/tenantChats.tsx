import TenantHeader from "@/components/tenantUi/tenantHeader";
import TenantChat from "@/components/tenantUi/tenantChat";
import { useConversationContext } from "@/hooks/useConversationContext";
import ChatItem from "@/components/tenantUi/chatItem";
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
    <div>
      {activeConversation && <TenantChat conversation={activeConversation} onClose={() => setActiveConversation(undefined)}/>}

      <TenantHeader title="Chats" />

      <div>
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
