import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { setTokenCookie } from "@/lib/axios";
import { removeTokenCookie } from "@/lib/axios";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";

export const useOAuthToken = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const syncOAuthToken = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        toast.error(error);
        searchParams.delete("error");
        setSearchParams(searchParams, { replace: true });
        return;
      }

      if (!token) {
        return;
      }

      setIsProcessing(true);
      setTokenCookie(token);

      try {
        const user = await getCurrentUser(token);

        dispatch(
          setCredentials({
            token,
            user,
          })
        );

        toast.success("Successfully signed in with Google!");
        navigate("/", { replace: true });
      } catch {
        removeTokenCookie();
        toast.error("Unable to load your account. Please try again.");
        searchParams.delete("token");
        setSearchParams(searchParams, { replace: true });
        setIsProcessing(false);
      }
    };

    void syncOAuthToken();
  }, [searchParams, setSearchParams, navigate, dispatch]);

  return { isProcessing };
};
