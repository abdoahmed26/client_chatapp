import { MessageSquarePlus } from "lucide-react";

interface EmptyConversationsProps {
  /** Whether the empty state is caused by a search query. */
  isSearchResult?: boolean;
}

/**
 * Empty state for the conversations list.
 */
export default function EmptyConversations({
  isSearchResult = false,
}: EmptyConversationsProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <MessageSquarePlus
        size={48}
        strokeWidth={1.5}
        className="text-gray-300"
      />
      {isSearchResult ? (
        <>
          <h3 className="text-sm font-medium text-gray-500">
            No conversations found
          </h3>
          <p className="text-xs text-gray-400">Try a different search term</p>
        </>
      ) : (
        <>
          <h3 className="text-sm font-medium text-gray-500">
            No conversations yet
          </h3>
          <p className="text-xs text-gray-400">
            Start a new conversation using the button above
          </p>
        </>
      )}
    </div>
  );
}
