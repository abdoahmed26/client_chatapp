import { useCallback, useState } from "react";
import type { IMessage } from "@/types/message.types";

interface MessageActionsState {
  replyingTo: IMessage | null;
  editingMessage: IMessage | null;
  startReply: (message: IMessage) => void;
  cancelReply: () => void;
  startEdit: (message: IMessage) => void;
  cancelEdit: () => void;
}

/**
 * Manages reply and edit state for the message input.
 */
export function useMessageActions(): MessageActionsState {
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<IMessage | null>(null);

  const startReply = useCallback((message: IMessage) => {
    setEditingMessage(null);
    setReplyingTo(message);
  }, []);

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  const startEdit = useCallback((message: IMessage) => {
    setReplyingTo(null);
    setEditingMessage(message);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingMessage(null);
  }, []);

  return {
    replyingTo,
    editingMessage,
    startReply,
    cancelReply,
    startEdit,
    cancelEdit,
  };
}
