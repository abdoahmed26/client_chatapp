import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import axiosErrorHandler from "@/lib/axiosErrorHandler";

interface DeleteMessageArgs {
  messageId: string;
  conversationId: string;
}

/**
 * Deletes a message and refreshes the related caches.
 */
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId }: DeleteMessageArgs) => {
      const response = await axiosInstance.delete(`/messages/${messageId}`);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Message deleted");
    },
    onError: (error) => {
      axiosErrorHandler(error);
    },
  });
};
