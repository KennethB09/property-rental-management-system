import type { conversation, message } from "@/types/interface";
import { createContext, useReducer, type ReactNode } from "react";

type ConversationState = {
  messages: message[] | [];
  conversations: conversation[] | [];
};

type ConversationAction =
  | { type: "SET_CONVERSATIONS"; payload: conversation[] }
  | { type: "NEW_CONVERSATION"; payload: conversation }
  | { type: "REMOVE_CONVERSATION"; payload: string }
  | { type: "SET_MESSAGES"; payload: message[] }
  | { type: "NEW_MESSAGE"; payload: message };

export type ConversationContext = {
  messages: message[] | [];
  conversations: conversation[] | [];
  dispatch: React.Dispatch<ConversationAction>;
};

export const conversationContext = createContext<
  ConversationContext | undefined
>(undefined);

const conversationReducer = (
  state: ConversationState,
  action: ConversationAction
): ConversationState => {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return {
        ...state,
        conversations: action.payload,
      };
    case "NEW_CONVERSATION":
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    case "REMOVE_CONVERSATION":
      return {
        ...state,
        conversations: state.conversations.filter(
          (convo) => convo.id !== action.payload
        ),
      };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };
    case "NEW_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
};

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(conversationReducer, {
    conversations: [],
    messages: [],
  });

  return (
    <conversationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </conversationContext.Provider>
  );
};
