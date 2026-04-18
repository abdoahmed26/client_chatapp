import { MessageCircle } from "lucide-react";

/**
 * Empty state shown when a conversation has no messages.
 */
export default function EmptyMessages() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-gray-400">
      <MessageCircle size={48} strokeWidth={1.5} />
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-500">No messages yet</h3>
        <p className="mt-1 text-xs text-gray-400">Say hello!</p>
      </div>
    </div>
  );
}
