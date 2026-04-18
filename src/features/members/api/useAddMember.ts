import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { IAddMemberPayload } from "@/types/conversation.types";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import { toast } from "sonner";

interface AddMemberArgs {
  conversationId: string;
  payload: IAddMemberPayload;
}

/**
 * Adds a member to a conversation and refreshes the members list.
 */
export const useAddMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, payload }: AddMemberArgs) => {
      const response = await axiosInstance.post(
        `/conversation-members/${conversationId}`,
        payload
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["members", variables.conversationId],
      });
      toast.success("Member added");
    },
    onError: (error) => {
      axiosErrorHandler(error);
    },
  });
};
