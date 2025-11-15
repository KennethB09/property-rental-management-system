import TenantHeader from "@/components/tenantUi/tenantHeader";
import TenantChat from "@/components/tenantUi/tenantChat";
import { useConversationContext } from "@/hooks/useConversationContext";
import ChatItem from "@/components/tenantUi/chatItem";

export default function TenantChats() {
  const { conversations } = useConversationContext();

  return (
    <div>
      <TenantHeader title="Chats" />

      <div>
        {conversations.map((item) => (
          <ChatItem key={item.id} conversation={item} />
        ))}
      </div>
    </div>
  );
}
