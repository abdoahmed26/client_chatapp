import { axiosInstance } from "@/lib/axios";
import type { ICallRecord } from "@/types/call.types";

/**
 * Fetch the current user's call history.
 */
export async function getCallHistory(): Promise<ICallRecord[]> {
  const response = await axiosInstance.get("/calls");
  return response.data.data;
}

/**
 * Fetch a single call by ID.
 */
export async function getCallById(id: string): Promise<ICallRecord> {
  const response = await axiosInstance.get(`/calls/${id}`);
  return response.data.data;
}
