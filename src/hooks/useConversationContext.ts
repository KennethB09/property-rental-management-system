import type { ConversationContext } from "@/context/ConversationContext";
import { conversationContext } from "@/context/ConversationContext";
import { useContext } from "react";

export const useConversationContext = (): ConversationContext => {
  const context = useContext(conversationContext);

  if (!context) {
    throw new Error(
      "Conversation context must be used within a Conversation Context Provider"
    );
  }

  return context;
};
