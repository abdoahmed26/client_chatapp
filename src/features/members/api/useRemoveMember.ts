import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import { toast } from "sonner";

interface RemoveMemberArgs {
  conversationId: string;
  memberId: string;
}

/**
 * Removes a member from a conversation and refreshes the members list.
 */
export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, memberId }: RemoveMemberArgs) => {
      const response = await axiosInstance.delete(
        `/conversation-members/${conversationId}`,
        { params: { memberId } }
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["members", variables.conversationId],
      });
      toast.success("Member removed");
    },
    onError: (error) => {
      axiosErrorHandler(error);
    },
  });
};
