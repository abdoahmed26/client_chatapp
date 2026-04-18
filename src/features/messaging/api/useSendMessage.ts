import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import type { ISendMessagePayload } from "@/types/message.types";

/**
 * Sends a new message with optional file attachments.
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ISendMessagePayload) => {
      const formData = new FormData();
      formData.append("content", payload.content);
      formData.append("conversationId", payload.conversationId);

      if (payload.parentMessageId) {
        formData.append("parentMessageId", payload.parentMessageId);
      }

      payload.files?.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosInstance.post("/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      axiosErrorHandler(error);
    },
  });
};
