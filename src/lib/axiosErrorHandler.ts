/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosError } from "axios";
import { toast } from "sonner";

export default function axiosErrorHandler(error: any) {
    
    if (isAxiosError(error)) {
        if (error.response?.status === 401) {
            return error.response?.data?.data?.message || error.message || "Unauthorized";
        }

        const message = error.response?.data?.data?.message || error.message || "An unexpected error occurred.";
        toast.error(message);
        return message;
    }

    if (error instanceof Error) {
        toast.error(error.message);
        return error.message;
    }

    toast.error("An unexpected error occurred.");
    return "An unexpected error occurred.";
}
