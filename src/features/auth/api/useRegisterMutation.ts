/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { RegisterFormData } from "@/features/auth/validations/RegisterValidation";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useRegisterMutation = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (data: RegisterFormData) => {
            const response = await axiosInstance.post("/auth/register", data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Account created successfully!");
            navigate("/login", { replace: true });
        },
        onError: (error: any) => {
            axiosErrorHandler(error);
        },
    });
};
