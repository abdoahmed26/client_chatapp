import { Reply, Pencil, Trash2 } from "lucide-react";
import ReactionPicker from "@/features/reactions/components/ReactionPicker";
import { useAppSelector } from "@/store/hooks";
import type { IMessage } from "@/types/message.types";

interface MessageActionsProps {
  message: IMessage;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReact: (emoji: string) => void;
}

/**
 * Floating action toolbar for a message bubble.
 * Includes reply, reaction, and own-message actions.
 */
export default function MessageActions({
  message,
  onReply,
  onEdit,
  onDelete,
  onReact,
}: MessageActionsProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isOwn = message.sender.id === currentUser?.id;

  return (
    <div className="absolute -top-3 right-2 z-10 hidden items-center gap-0.5 rounded-lg border border-gray-200 bg-white px-1 py-0.5 shadow-sm group-hover:flex">
      <button
        onClick={onReply}
        className="rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-blue-500"
        title="Reply"
        aria-label="Reply to message"
      >
        <Reply size={14} />
      </button>
      <ReactionPicker onSelectEmoji={onReact} />
      {isOwn ? (
        <>
          <button
            onClick={onEdit}
            className="rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-amber-500"
            title="Edit"
            aria-label="Edit message"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-red-500"
            title="Delete"
            aria-label="Delete message"
          >
            <Trash2 size={14} />
          </button>
        </>
      ) : null}
    </div>
  );
}
