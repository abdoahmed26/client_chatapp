import { useMemo, useState } from "react";
import ConversationList from "./ConversationList";
import ConversationSearch from "./ConversationSearch";
import CreateConversationDialog from "./CreateConversationDialog";
import SidebarHeader from "./SidebarHeader";
import { useConversations } from "../api/useConversations";
import { useConversationSearch } from "../hooks/useConversationSearch";

/**
 * Complete sidebar shell for conversations, including search and creation.
 */
export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useConversations();

  const allConversations = useMemo(() => {
    const flattened =
      data?.pages.flatMap((page) => page.conversations) ?? [];

    return [...flattened].sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );
  }, [data]);

  const filteredConversations = useConversationSearch(
    allConversations,
    searchQuery
  );

  return (
    <>
      <div className="flex h-full flex-col">
        <SidebarHeader onNewConversation={() => setIsCreateDialogOpen(true)} />
        <ConversationSearch value={searchQuery} onChange={setSearchQuery} />
        <ConversationList
          conversations={filteredConversations}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage ?? false}
          fetchNextPage={() => {
            void fetchNextPage();
          }}
          isSearchResult={searchQuery.trim().length > 0}
        />
      </div>

      <CreateConversationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}
