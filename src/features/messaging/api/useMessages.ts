import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { IMessage } from "@/types/message.types";

/**
 * Fetches all messages for a conversation.
 * @param conversationId - The selected conversation id.
 */
export const useMessages = (conversationId: string) => {
  return useQuery<IMessage[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/messages/conversation/${conversationId}`
      );
      return response.data.data;
    },
    enabled: !!conversationId,
  });
};
