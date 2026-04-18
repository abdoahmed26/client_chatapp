import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { IPaginatedResponse } from "@/types/common.types";
import type { IConversation } from "@/types/conversation.types";

const CONVERSATIONS_LIMIT = 20;

/**
 * Fetches the current user's conversations with infinite scroll pagination.
 */
export const useConversations = () => {
  return useInfiniteQuery<IPaginatedResponse<"conversations", IConversation>>({
    queryKey: ["conversations"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get("/conversations", {
        params: { page: pageParam, limit: CONVERSATIONS_LIMIT },
      });

      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
  });
};
