import { MessageSquare } from "lucide-react";

/**
 * Placeholder shown when no conversation is selected.
 */
export default function ConversationPlaceholder() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-gray-400">
      <MessageSquare size={64} strokeWidth={1.5} />
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-500">
          Select a conversation
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Choose a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
}
