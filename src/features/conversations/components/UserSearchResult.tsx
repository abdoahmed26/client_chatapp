import { Check } from "lucide-react";
import type { IUser } from "@/types/auth.types";

interface UserSearchResultProps {
  /** Search result user. */
  user: IUser;
  /** Whether this user is selected. */
  isSelected: boolean;
  /** Toggles selection for this user. */
  onToggle: (user: IUser) => void;
}

/**
 * A selectable user search result inside the creation dialog.
 */
export default function UserSearchResult({
  user,
  isSelected,
  onToggle,
}: UserSearchResultProps) {
  const avatarFallback = user.name.charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onToggle(user)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
        isSelected ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          avatarFallback
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
        <p className="truncate text-xs text-gray-500">{user.email}</p>
      </div>

      {isSelected && (
        <Check size={18} className="shrink-0 text-blue-500" />
      )}
    </button>
  );
}
