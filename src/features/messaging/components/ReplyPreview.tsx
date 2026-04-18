import { X } from "lucide-react";
import type { IMessage } from "@/types/message.types";

interface ReplyPreviewProps {
  /** The original message being replied to. */
  message: IMessage;
  /** Optional cancel action for reply/edit input state. */
  onCancel?: () => void;
  /** Optional click action for jumping to the original message. */
  onClick?: () => void;
}

/**
 * Compact quoted message preview used in replies and the input area.
 */
export default function ReplyPreview({
  message,
  onCancel,
  onClick,
}: ReplyPreviewProps) {
  const truncatedContent = message.content
    ? message.content.length > 80
      ? `${message.content.slice(0, 80)}...`
      : message.content
    : message.files.length > 0
      ? `File attachment (${message.files.length})`
      : "Message";

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border-l-4 border-blue-400 bg-blue-50 px-3 py-2 ${
        onClick ? "cursor-pointer transition hover:bg-blue-100" : ""
      }`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-blue-600">{message.sender.name}</p>
        <p className="truncate text-xs text-gray-500">{truncatedContent}</p>
      </div>
      {onCancel && (
        <button
          onClick={(event) => {
            event.stopPropagation();
            onCancel();
          }}
          className="shrink-0 rounded p-0.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
          aria-label="Cancel reply"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
