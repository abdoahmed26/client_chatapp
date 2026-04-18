import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { IUpdateMemberRolePayload } from "@/types/conversation.types";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import { toast } from "sonner";

interface UpdateMemberRoleArgs {
  conversationId: string;
  memberId: string;
  payload: IUpdateMemberRolePayload;
}

/**
 * Updates a member role and refreshes the members list.
 */
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      memberId,
      payload,
    }: UpdateMemberRoleArgs) => {
      const response = await axiosInstance.patch(
        `/conversation-members/${conversationId}`,
        payload,
        { params: { memberId } }
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["members", variables.conversationId],
      });
      toast.success("Role updated");
    },
    onError: (error) => {
      axiosErrorHandler(error);
    },
  });
};
