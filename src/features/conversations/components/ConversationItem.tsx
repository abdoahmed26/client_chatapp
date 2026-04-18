import { Link, useParams } from "react-router-dom";
import { formatRelativeTime } from "@/lib/formatDate";
import type { IConversation } from "@/types/conversation.types";

interface ConversationItemProps {
  /** The conversation rendered in the list. */
  conversation: IConversation;
}

/**
 * A single conversation entry in the sidebar list.
 */
export default function ConversationItem({
  conversation,
}: ConversationItemProps) {
  const { id } = useParams<{ id: string }>();
  const isSelected = id === String(conversation.id);
  const displayName =
    conversation.title?.trim() ||
    conversation.description?.trim() ||
    `${conversation.type} conversation`;
  const avatarUrl = conversation.image ?? null;
  const avatarFallback = displayName.charAt(0).toUpperCase();
  const previewText = conversation.description?.trim() || "No description";

  return (
    <Link
      to={`/conversations/${conversation.id}`}
      className={`flex items-center gap-3 px-3 py-3 transition-all duration-200 ease-out hover:bg-gray-50 hover:shadow-sm ${
        isSelected ? "border-r-2 border-blue-500 bg-blue-50" : ""
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          avatarFallback
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-medium text-gray-900">
            {displayName}
          </span>
          <span className="ml-2 shrink-0 text-xs text-gray-400">
            {formatRelativeTime(conversation.updatedAt)}
          </span>
        </div>
        <div className="mt-0.5 flex items-center justify-between">
          <p className="truncate text-xs text-gray-500">{previewText}</p>
          <span className="ml-2 shrink-0 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            {conversation.type}
          </span>
        </div>
      </div>
    </Link>
  );
}
