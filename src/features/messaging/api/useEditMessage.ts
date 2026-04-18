import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import type { IUpdateMessagePayload } from "@/types/message.types";

interface EditMessageArgs {
  messageId: string;
  conversationId: string;
  payload: IUpdateMessagePayload;
}

/**
 * Updates a message's text content.
 */
export const useEditMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, payload }: EditMessageArgs) => {
      const response = await axiosInstance.patch(`/messages/${messageId}`, payload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      toast.success("Message updated");
    },
    onError: (error) => {
      axiosErrorHandler(error);
    },
  });
};
