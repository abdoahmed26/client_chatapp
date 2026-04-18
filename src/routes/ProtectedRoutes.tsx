import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useAppSelector } from "@/store/hooks";

export default function ProtectedRoutes() {
  const { token, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
