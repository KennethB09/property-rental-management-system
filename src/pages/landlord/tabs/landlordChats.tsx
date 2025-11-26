import TenantHeader from "@/components/tenantUi/tenantHeader";
import Conversation from "@/components/chat/conversation";
import { useConversationContext } from "@/hooks/useConversationContext";
import ChatItem from "@/components/chat/chatItem";
import { useState } from "react";
import type { conversation } from "@/types/interface";

export default function LandlordChats() {
  const [activeConversation, setActiveConversation] = useState<
    conversation | undefined
  >(undefined);
  const { conversations } = useConversationContext();

  function handleClickConversation(param: conversation) {
    if (activeConversation) return setActiveConversation(undefined);

    setActiveConversation(param);
  }
  return (
    <div className="flex flex-col h-full lg:w-[91%]">
      <TenantHeader title="Chats" />

      <div className="lg:m-4 lg:p-4 lg:border lg:border-gray-300 dark:bg-gray-900 lg:rounded-2xl flex-1 min-h-0 lg:flex">
        <div className="flex flex-col h-full overflow-y-scroll no-scrollbar gap-2 px-4 lg:w-1/2">
          {conversations.map((item) => (
            <ChatItem
              key={item.id}
              conversation={item}
              onClickConversation={() => handleClickConversation(item)}
            />
          ))}
        </div>

        {activeConversation && (
          <Conversation
            conversation={activeConversation}
            onClose={() => setActiveConversation(undefined)}
          />
        )}
      </div>
    </div>
  );
}
