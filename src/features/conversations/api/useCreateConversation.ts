import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import type {
  IConversation,
  ICreateConversationPayload,
} from "@/types/conversation.types";

const getExistingConversationId = (error: unknown): number | null => {
  if (!isAxiosError(error)) {
    return null;
  }

  const data = error.response?.data;

  return (
    data?.data?.conversation?.id ??
    data?.data?.existingConversation?.id ??
    data?.data?.id ??
    data?.conversation?.id ??
    data?.existingConversation?.id ??
    data?.id ??
    null
  );
};

/**
 * Creates a new conversation and navigates to it on success.
 */
export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<IConversation, unknown, ICreateConversationPayload>({
    mutationFn: async (payload) => {
      const requestBody =
        payload.image instanceof File
          ? (() => {
              const formData = new FormData();

              if (payload.title) {
                formData.append("title", payload.title);
              }

              if (payload.description) {
                formData.append("description", payload.description);
              }

              formData.append("type", payload.type);
              formData.append("image", payload.image);
              payload.membersIds.forEach((id) => formData.append("membersIds", id));

              return formData;
            })()
          : payload;

      const response = await axiosInstance.post("/conversations", requestBody);
      return response.data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Conversation created!");
      navigate(`/conversations/${data.id}`);
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        const existingConversationId = getExistingConversationId(error);

        if (existingConversationId) {
          toast.info("Opened your existing conversation.");
          navigate(`/conversations/${existingConversationId}`);
          return;
        }

        toast.error("This conversation already exists.");
        return;
      }

      axiosErrorHandler(error);
    },
  });
};
