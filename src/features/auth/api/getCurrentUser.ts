import { axiosInstance } from "@/lib/axios";

export const getCurrentUser = async (token: string)=> {
  const response = await axiosInstance.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};
