import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { LoginFormData } from "@/features/auth/validations/LoginValidation";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import { setTokenCookie } from "@/lib/axios";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import type { ILoginResponse } from "@/types/auth.types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useLoginMutation = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials: LoginFormData) => {
            const response = await axiosInstance.post("/auth/login", credentials);
            return response.data;
        },
        onSuccess: (data: ILoginResponse) => {
            setTokenCookie(data.data.token);
            dispatch(setCredentials({ token: data.data.token, user: data.data.user }));
            toast.success("Successfully logged in!");
            navigate("/", { replace: true });
        },
        onError: (error) => {
            axiosErrorHandler(error);
        },
    });
};
