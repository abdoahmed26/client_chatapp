import { useCallback, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useConversations } from "@/features/conversations/api/useConversations";
import { useCreateMention } from "@/features/mentions/api/useCreateMention";
import MembersPanel from "@/features/members/components/MembersPanel";
import { useMembers } from "@/features/members/api/useMembers";
import { useAddReaction } from "@/features/reactions/api/useAddReaction";
import { useRemoveReaction } from "@/features/reactions/api/useRemoveReaction";
import { useDeleteMessage } from "@/features/messaging/api/useDeleteMessage";
import { useEditMessage } from "@/features/messaging/api/useEditMessage";
import { useMessages } from "@/features/messaging/api/useMessages";
import { useSendMessage } from "@/features/messaging/api/useSendMessage";
import MessageHeader from "@/features/messaging/components/MessageHeader";
import MessageInput from "@/features/messaging/components/MessageInput";
import MessageList from "@/features/messaging/components/MessageList";
import { useMessageActions } from "@/features/messaging/hooks/useMessageActions";

/**
 * Full conversation messaging view.
 */
export default function ConversationView() {
  const { id: conversationId } = useParams<{ id: string }>();
  const { data: conversationPages } = useConversations();
  const { data: messages = [], isLoading, isError } = useMessages(conversationId || "");
  const { data: members = [] } = useMembers(conversationId || "");
  const sendMutation = useSendMessage();
  const editMutation = useEditMessage();
  const deleteMutation = useDeleteMessage();
  const createMentionMutation = useCreateMention();
  const {
    replyingTo,
    editingMessage,
    startReply,
    cancelReply,
    startEdit,
    cancelEdit,
  } = useMessageActions();
  const addReactionMutation = useAddReaction(conversationId || "");
  const removeReactionMutation = useRemoveReaction(conversationId || "");
  const [isMembersPanelOpen, setIsMembersPanelOpen] = useState(false);
  const mentionedUserIdsRef = useRef<string[]>([]);

  const toggleMembersPanel = useCallback(() => {
    setIsMembersPanelOpen((prev) => !prev);
  }, []);

  const conversation = useMemo(() => {
    const conversations =
      conversationPages?.pages.flatMap((page) => page.conversations) ?? [];

    return conversations.find((item) => item.id === conversationId) ?? null;
  }, [conversationId, conversationPages]);

  const handleReact = useCallback(
    (messageId: string, emoji: string) => {
      addReactionMutation.mutate({ messageId, reaction: emoji });
    },
    [addReactionMutation]
  );

  const handleToggleReaction = useCallback(
    (
      messageId: string,
      emoji: string,
      existingReactionId: string | null
    ) => {
      if (existingReactionId) {
        removeReactionMutation.mutate(existingReactionId);
        return;
      }

      addReactionMutation.mutate({ messageId, reaction: emoji });
    },
    [addReactionMutation, removeReactionMutation]
  );

  const handleMentionedUsersChange = useCallback((userIds: string[]) => {
    mentionedUserIdsRef.current = userIds;
  }, []);

  const handleSend = useCallback(
    (content: string, files: File[], parentMessageId?: string) => {
      if (!conversationId) {
        return;
      }

      sendMutation.mutate(
        {
          content,
          conversationId,
          files: files.length > 0 ? files : undefined,
          parentMessageId,
        },
        {
          onSuccess: (data) => {
            cancelReply();
            const messageId = data?.id || data?.data?.id;

            if (messageId && mentionedUserIdsRef.current.length > 0) {
              for (const userId of mentionedUserIdsRef.current) {
                createMentionMutation.mutate({ messageId, userId });
              }
            }

            mentionedUserIdsRef.current = [];
          },
        }
      );
    },
    [cancelReply, conversationId, createMentionMutation, sendMutation]
  );

  const handleSaveEdit = useCallback(
    (messageId: string, content: string) => {
      if (!conversationId) {
        return;
      }

      editMutation.mutate(
        { messageId, conversationId, payload: { content } },
        {
          onSuccess: () => {
            cancelEdit();
          },
        }
      );
    },
    [cancelEdit, conversationId, editMutation]
  );

  const handleDelete = useCallback(
    (messageId: string) => {
      if (!conversationId || !window.confirm("Delete this message?")) {
        return;
      }

      deleteMutation.mutate({ messageId, conversationId });
    },
    [conversationId, deleteMutation]
  );

  if (!conversationId) {
    return null;
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <MessageHeader
        conversation={conversation}
        onToggleMembers={toggleMembersPanel}
        members={members}
      />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        isError={isError}
        onReply={startReply}
        onEdit={startEdit}
        onDelete={handleDelete}
        onReact={handleReact}
        onToggleReaction={handleToggleReaction}
      />
      <MessageInput
        onSend={handleSend}
        onSaveEdit={handleSaveEdit}
        replyingTo={replyingTo}
        editingMessage={editingMessage}
        onCancelReply={cancelReply}
        onCancelEdit={cancelEdit}
        isSending={sendMutation.isPending}
        members={members}
        onMentionedUsersChange={handleMentionedUsersChange}
      />
      <MembersPanel
        conversationId={conversationId}
        conversation={conversation}
        isOpen={isMembersPanelOpen}
        onClose={() => setIsMembersPanelOpen(false)}
      />
    </div>
  );
}
