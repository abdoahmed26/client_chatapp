import { useMutation } from "@tanstack/react-query";
import { axiosInstance, getTokenCookie } from "@/lib/axios";
import axiosErrorHandler from "@/lib/axiosErrorHandler";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import type { IUpdateProfilePayload, IUser } from "@/types/auth.types";
import { toast } from "sonner";

const extractUser = (data: unknown): IUser => {
  if (typeof data === "object" && data !== null) {
    if ("id" in data && "name" in data && "email" in data) {
      return data as IUser;
    }

    if ("user" in data) {
      return extractUser((data as { user: unknown }).user);
    }

    if ("data" in data) {
      return extractUser((data as { data: unknown }).data);
    }
  }

  throw new Error("Unexpected profile response shape");
};

/**
 * Updates the current user's profile and synchronizes the Redux auth store.
 */
export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: async (payload: IUpdateProfilePayload) => {
      if (!currentUser) {
        throw new Error("Not authenticated");
      }

      if (payload.profileImage) {
        const formData = new FormData();

        if (payload.name) {
          formData.append("name", payload.name);
        }

        formData.append("profileImage", payload.profileImage);

        const response = await axiosInstance.patch(
          `/users/${currentUser.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        return extractUser(response.data);
      }

      const response = await axiosInstance.patch(`/users/${currentUser.id}`, {
        name: payload.name,
      });

      return extractUser(response.data);
    },
    onSuccess: (updatedUser: IUser) => {
      const token = getTokenCookie();

      if (token) {
        dispatch(setCredentials({ token, user: updatedUser }));
      }

      toast.success("Profile updated");
    },
    onError: (error) => {
      axiosErrorHandler(error);
    },
  });
};
