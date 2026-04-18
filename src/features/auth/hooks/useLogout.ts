import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { axiosInstance, removeTokenCookie } from "@/lib/axios";
import { useAppDispatch } from "@/store/hooks";
import { authLogout } from "@/store/slices/authSlice";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Ignore server logout errors and still clear client auth state.
    } finally {
      removeTokenCookie();
      dispatch(authLogout());
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    }
  };

  return { logout };
};
