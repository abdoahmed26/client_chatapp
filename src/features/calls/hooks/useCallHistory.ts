import { useQuery } from "@tanstack/react-query";
import { getCallHistory } from "../api/callsApi";
import type { ICallRecord } from "@/types/call.types";

/**
 * React Query hook for fetching the user's call history.
 */
export function useCallHistory() {
  return useQuery<ICallRecord[]>({
    queryKey: ["calls"],
    queryFn: getCallHistory,
    staleTime: 30_000,
  });
}
