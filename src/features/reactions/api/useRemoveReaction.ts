import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import axiosErrorHandler from "@/lib/axiosErrorHandler";

/**
 * Removes a reaction and refreshes the current conversation messages.
 */
export const useRemoveReaction = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reactionId: string) => {
      const response = await axiosInstance.delete(
        `/message-reactions/${reactionId}`
      );
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
    },
    onError: (error) => {
      axiosErrorHandler(error);
    },
  });
};
