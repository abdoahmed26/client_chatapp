import { useMemo } from "react";
import type { IConversation } from "@/types/conversation.types";

/**
 * Filters conversations client-side by title, description, or type.
 * @param conversations - The full loaded conversation list.
 * @param query - The raw sidebar search query.
 * @returns The filtered list.
 */
export const useConversationSearch = (
  conversations: IConversation[],
  query: string
): IConversation[] => {
  return useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      if (conversation.title?.toLowerCase().includes(trimmed)) {
        return true;
      }

      if (conversation.description?.toLowerCase().includes(trimmed)) {
        return true;
      }

      return conversation.type.toLowerCase().includes(trimmed);
    });
  }, [conversations, query]);
};
