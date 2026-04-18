import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { IUpdateConversationPayload } from "@/types/conversation.types";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import { toast } from "sonner";

interface UpdateConversationArgs {
  conversationId: string;
  payload: IUpdateConversationPayload;
}

/**
 * Updates conversation details and refreshes related caches.
 */
export const useUpdateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      payload,
    }: UpdateConversationArgs) => {
      if (payload.image) {
        const formData = new FormData();

        if (payload.title) {
          formData.append("title", payload.title);
        }

        if (payload.description) {
          formData.append("description", payload.description);
        }

        formData.append("image", payload.image);

        const response = await axiosInstance.patch(
          `/conversations/${conversationId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        return response.data;
      }

      const response = await axiosInstance.patch(
        `/conversations/${conversationId}`,
        payload
      );

      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["members", variables.conversationId],
      });
      toast.success("Conversation updated");
    },
    onError: (error) => {
      axiosErrorHandler(error);
    },
  });
};
