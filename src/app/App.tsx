import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateAuth } from "@/store/slices/authSlice";
import ProtectedRoutes from "@/routes/ProtectedRoutes";
import { SocketProvider } from "@/lib/socketContext";
import CallOverlay from "@/features/calls/components/CallOverlay";

const ConversationsPage = lazy(
  () => import("@/features/conversations/pages/ConversationsPage")
);
const ConversationView = lazy(
  () => import("@/features/conversations/components/ConversationView")
);
const ConversationPlaceholder = lazy(
  () => import("@/features/conversations/components/ConversationPlaceholder")
);
const LoginPage = lazy(() => import("@/features/auth/pages/Login"));
const RegisterPage = lazy(() => import("@/features/auth/pages/Register"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));

function App() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const callStatus = useAppSelector((state) => state.call.status);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  // Warn before closing/refreshing if a call is active
  useEffect(() => {
    if (callStatus === "ongoing" || callStatus === "connecting") {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
      };
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [callStatus]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SocketProvider>
      <div className="App">
        <Toaster />
        {/* Global call overlay — renders on top of all pages */}
        <CallOverlay />
        <Routes>
          <Route
            path="/login"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <RegisterPage />
              </Suspense>
            }
          />
          <Route element={<ProtectedRoutes />}>
            <Route
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <ConversationsPage />
                </Suspense>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    <ConversationPlaceholder />
                  </Suspense>
                }
              />
              <Route
                path="conversations/:id"
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    <ConversationView />
                  </Suspense>
                }
              />
            </Route>
            <Route
              path="/profile"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <ProfilePage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </div>
    </SocketProvider>
  );
}

export default App;
