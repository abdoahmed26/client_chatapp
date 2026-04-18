import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { IParticipant } from "@/types/conversation.types";

/**
 * Fetches all members of a conversation.
 * @param conversationId - The conversation to fetch members for.
 */
export const useMembers = (conversationId: string) => {
  return useQuery<IParticipant[]>({
    queryKey: ["members", conversationId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/conversation-members/${conversationId}`
      );
      return response.data.conversationMembers;
    },
    enabled: !!conversationId,
  });
};
