import type { ReactNode } from "react";
import { motion } from "framer-motion";
import ReactionBar from "@/features/reactions/components/ReactionBar";
import { useAppSelector } from "@/store/hooks";
import { formatRelativeTime } from "@/lib/formatDate";
import type { IMention, IMessage } from "@/types/message.types";
import FileAttachment from "./FileAttachment";
import ReplyPreview from "./ReplyPreview";

interface MessageBubbleProps {
  message: IMessage;
  isFirstInGroup: boolean;
  actions?: ReactNode;
  onScrollToMessage?: (messageId: string) => void;
  onToggleReaction?: (
    messageId: string,
    emoji: string,
    existingReactionId: string | null
  ) => void;
}

/**
 * Parses message content and highlights explicit @mentions present in the message metadata.
 */
function renderContentWithMentions(
  content: string,
  mentions: IMention[],
  isOwn: boolean
): ReactNode[] {
  if (mentions.length === 0) {
    return [content];
  }

  const mentionNames = mentions.map((mention) => mention.user.name);
  const pattern = mentionNames
    .map((name) => `@${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`)
    .join("|");
  const regex = new RegExp(`(${pattern})`, "g");

  return content.split(regex).map((part, index) => {
    const isMention = mentionNames.some((name) => part === `@${name}`);

    if (!isMention) {
      return part;
    }

    return (
      <span
        key={`${part}-${index}`}
        className={`font-semibold ${isOwn ? "text-blue-100" : "text-blue-600"}`}
      >
        {part}
      </span>
    );
  });
}

/**
 * Renders a single message bubble with reply, attachment, reaction, and mention support.
 */
export default function MessageBubble({
  message,
  isFirstInGroup,
  actions,
  onScrollToMessage,
  onToggleReaction,
}: MessageBubbleProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isOwn = message.sender.id === currentUser?.id;
  const isEdited = message.updatedAt !== message.createdAt;
  const avatarFallback = message.sender.name.charAt(0).toUpperCase();

  return (
    <motion.div
      id={`message-${message.id}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`group relative flex gap-2 px-4 ${
        isFirstInGroup ? "mt-3" : "mt-0.5"
      } ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isOwn ? (
        <div className="w-8 shrink-0">
          {isFirstInGroup ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
              {message.sender.profileImage ? (
                <img
                  src={message.sender.profileImage}
                  alt={message.sender.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                avatarFallback
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={`relative max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
        {isFirstInGroup && !isOwn ? (
          <p className="mb-0.5 px-1 text-xs font-semibold text-gray-600">
            {message.sender.name}
          </p>
        ) : null}

        <div
          className={`rounded-2xl px-3 py-2 ${
            isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          {message.parentMessage ? (
            <div className="mb-1.5">
              <ReplyPreview
                message={message.parentMessage}
                onClick={
                  onScrollToMessage
                    ? () => onScrollToMessage(message.parentMessage!.id)
                    : undefined
                }
              />
            </div>
          ) : null}

          {message.content ? (
            <p className="whitespace-pre-wrap wrap-break-word text-sm">
              {renderContentWithMentions(
                message.content,
                message.mentions || [],
                isOwn
              )}
            </p>
          ) : null}

          {message.files.length > 0 ? (
            <div className="mt-1.5 space-y-1.5">
              {message.files.map((url, index) => (
                <FileAttachment key={`${url}-${index}`} url={url} />
              ))}
            </div>
          ) : null}

          <div
            className={`mt-1 flex items-center gap-1 text-[10px] ${
              isOwn ? "justify-end text-blue-200" : "justify-start text-gray-400"
            }`}
          >
            {isEdited ? <span>edited</span> : null}
            <span>{formatRelativeTime(message.createdAt)}</span>
          </div>
        </div>

        {actions}
        <ReactionBar
          reactions={message.reactions || []}
          onToggleReaction={(emoji, existingReactionId) =>
            onToggleReaction?.(message.id, emoji, existingReactionId)
          }
        />
      </div>
    </motion.div>
  );
}
