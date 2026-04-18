import { LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useAppSelector } from "@/store/hooks";

interface SidebarHeaderProps {
  /** Opens the create-conversation dialog. */
  onNewConversation: () => void;
}

/**
 * Sidebar header with user identity, create action, and logout.
 * Avatar is clickable to navigate to the profile page.
 */
export default function SidebarHeader({
  onNewConversation,
}: SidebarHeaderProps) {
  const user = useAppSelector((state) => state.auth.user);
  const { logout } = useLogout();
  const navigate = useNavigate();
  const avatarFallback = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-600 transition hover:ring-2 hover:ring-blue-300"
          aria-label="View profile"
          title="View profile"
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            avatarFallback
          )}
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Chats</h1>
          <p className="text-xs text-gray-400">{user?.name ?? "User"}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onNewConversation}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
          aria-label="New conversation"
          title="New conversation"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={logout}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-500"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
