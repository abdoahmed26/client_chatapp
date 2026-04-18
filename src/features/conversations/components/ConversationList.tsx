import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import { Loader2 } from "lucide-react";
import ConversationItem from "./ConversationItem";
import EmptyConversations from "./EmptyConversations";
import type { IConversation } from "@/types/conversation.types";

interface ConversationListProps {
  /** Flattened list of loaded conversations. */
  conversations: IConversation[];
  /** Whether the initial conversations query is loading. */
  isLoading: boolean;
  /** Whether the next page is loading. */
  isFetchingNextPage: boolean;
  /** Whether another page is available. */
  hasNextPage: boolean;
  /** Loads the next conversation page. */
  fetchNextPage: () => void;
  /** Whether the list is currently filtered. */
  isSearchResult: boolean;
}

/**
 * Scrollable sidebar conversation list with infinite scroll.
 */
export default function ConversationList({
  conversations,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  isSearchResult,
}: ConversationListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [handleIntersection]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-1 px-2 py-2">
        {Array.from({ length: 8 }).map((_, index) => {
          const widths = ['w-2/3', 'w-1/2', 'w-3/4'];
          return (
            <div
              key={index}
              className="flex animate-pulse items-center gap-3 px-3 py-3 transition-opacity duration-300"
            >
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className={`h-3 ${widths[index % 3]} rounded bg-gray-200`} />
                <div className="h-2.5 w-4/5 rounded bg-gray-200" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (conversations.length === 0) {
    return <EmptyConversations isSearchResult={isSearchResult} />;
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="flex-1 overflow-y-auto"
    >
      {conversations.map((conversation) => (
        <motion.div key={conversation.id} variants={staggerItemVariants}>
          <ConversationItem conversation={conversation} />
        </motion.div>
      ))}

      <div ref={sentinelRef} className="h-4" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-3">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      )}
    </motion.div>
  );
}
