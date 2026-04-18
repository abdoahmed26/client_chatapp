import { useCallback, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import type { IMessage } from "@/types/message.types";
import { groupMessages } from "../utils/groupMessages";
import MessageActions from "./MessageActions";
import MessageBubble from "./MessageBubble";
import EmptyMessages from "./EmptyMessages";

interface MessageListProps {
  messages: IMessage[];
  isLoading: boolean;
  isError: boolean;
  onReply: (message: IMessage) => void;
  onEdit: (message: IMessage) => void;
  onDelete: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onToggleReaction: (
    messageId: string,
    emoji: string,
    existingReactionId: string | null
  ) => void;
}

/**
 * Scrollable message list with grouping, auto-scroll, reactions, and view states.
 */
export default function MessageList({
  messages,
  isLoading,
  isError,
  onReply,
  onEdit,
  onDelete,
  onReact,
  onToggleReaction,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages.length]);

  const scrollToMessage = useCallback((messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);

    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.classList.add("bg-yellow-100");
    window.setTimeout(() => element.classList.remove("bg-yellow-100"), 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        <p className="text-sm">Failed to load messages. Please try again.</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return <EmptyMessages />;
  }

  const groups = groupMessages(messages);

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {groups.flatMap((group) =>
        group.messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isFirstInGroup={index === 0}
            onScrollToMessage={scrollToMessage}
            onToggleReaction={onToggleReaction}
            actions={
              <MessageActions
                message={message}
                onReply={() => onReply(message)}
                onEdit={() => onEdit(message)}
                onDelete={() => onDelete(message.id)}
                onReact={(emoji) => onReact(message.id, emoji)}
              />
            }
          />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
