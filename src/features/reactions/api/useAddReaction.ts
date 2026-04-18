import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import type { ICreateReactionPayload } from "@/types/message.types";

/**
 * Creates a reaction on a message and refreshes the current conversation messages.
 */
export const useAddReaction = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ICreateReactionPayload) => {
      const response = await axiosInstance.post("/message-reactions", payload);
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
