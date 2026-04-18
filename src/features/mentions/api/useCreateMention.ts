import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import type { ICreateMentionPayload } from "@/types/message.types";

/**
 * Creates a mention on a message after the message itself has been created.
 */
export const useCreateMention = () => {
  return useMutation({
    mutationFn: async (payload: ICreateMentionPayload) => {
      const response = await axiosInstance.post("/message-mentions", payload);
      return response.data;
    },
    onError: (error) => {
      axiosErrorHandler(error);
    },
  });
};
