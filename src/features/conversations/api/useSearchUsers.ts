import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { IUser } from "@/types/auth.types";
import type { IPaginatedResponse } from "@/types/common.types";

/**
 * Searches users by name or email for the create-conversation flow.
 * @param searchQuery - The debounced search string.
 */
export const useSearchUsers = (searchQuery: string) => {
  return useQuery<IPaginatedResponse<"users", IUser>>({
    queryKey: ["users", "search", searchQuery],
    queryFn: async () => {
      const response = await axiosInstance.get("/users", {
        params: { search: searchQuery, limit: 10, page: 1 },
      });

      return response.data;
    },
    enabled: searchQuery.trim().length > 0,
  });
};
