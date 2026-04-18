import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import { toast } from "sonner";
import EmojiPickerPopover from "@/components/ui/EmojiPickerPopover";
import MentionDropdown from "@/features/mentions/components/MentionDropdown";
import { useMentionTrigger } from "@/features/mentions/hooks/useMentionTrigger";
import type { IParticipant } from "@/types/conversation.types";
import type { IMessage } from "@/types/message.types";
import FilePreview from "./FilePreview";
import ReplyPreview from "./ReplyPreview";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface MessageInputProps {
  onSend: (content: string, files: File[], parentMessageId?: string) => void;
  onSaveEdit: (messageId: string, content: string) => void;
  replyingTo: IMessage | null;
  editingMessage: IMessage | null;
  onCancelReply: () => void;
  onCancelEdit: () => void;
  isSending: boolean;
  /** Conversation members for @mention suggestions. */
  members?: IParticipant[];
  /** Notifies parent whenever selected mention IDs change. */
  onMentionedUsersChange?: (userIds: string[]) => void;
}

/**
 * Message composer with reply/edit state, file attachments, emoji insertion, and @mentions.
 */
export default function MessageInput({
  onSend,
  onSaveEdit,
  replyingTo,
  editingMessage,
  onCancelReply,
  onCancelEdit,
  isSending,
  members = [],
  onMentionedUsersChange,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen: isMentionOpen,
    query: mentionQuery,
    mentionedUserIds,
    handleTextChange: handleMentionTextChange,
    selectMention,
    closeMention,
    resetMentions,
  } = useMentionTrigger();

  useEffect(() => {
    onMentionedUsersChange?.(mentionedUserIds);
  }, [mentionedUserIds, onMentionedUsersChange]);

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.content || "");
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [text]);

  const handleTextUpdate = (newText: string) => {
    setText(newText);
    handleMentionTextChange(newText);
  };

  const handleSend = useCallback(() => {
    const trimmed = text.trim();

    if (!trimmed && files.length === 0) {
      return;
    }

    if (editingMessage) {
      if (trimmed) {
        onSaveEdit(editingMessage.id, trimmed);
      }
      setText("");
      return;
    }

    onSend(trimmed, files, replyingTo?.id);
    setText("");
    setFiles([]);
    closeMention();
    resetMentions();
  }, [
    closeMention,
    editingMessage,
    files,
    onSaveEdit,
    onSend,
    replyingTo,
    resetMentions,
    text,
  ]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Escape" && isMentionOpen) {
      closeMention();
    }
  };

  const handleMentionSelect = (userName: string, userId: string) => {
    const updatedText = selectMention(userName, userId, text);
    setText(updatedText);
    textareaRef.current?.focus();
  };

  const handleEmojiSelect = (emoji: string) => {
    setText((previous) => previous + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 10 MB limit`);
        return false;
      }

      return true;
    });

    setFiles((previous) => [...previous, ...validFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleCancelEdit = () => {
    setText("");
    onCancelEdit();
  };

  return (
    <div className="relative border-t border-gray-200 bg-white">
      {replyingTo ? (
        <div className="px-4 pt-2">
          <ReplyPreview message={replyingTo} onCancel={onCancelReply} />
        </div>
      ) : null}

      {editingMessage ? (
        <div className="flex items-center gap-2 px-4 pt-2">
          <span className="text-xs font-medium text-amber-600">
            Editing message
          </span>
          <button
            onClick={handleCancelEdit}
            className="text-xs text-gray-400 transition hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : null}

      {files.length > 0 ? (
        <div className="px-4 pt-2">
          <FilePreview files={files} onRemove={removeFile} />
        </div>
      ) : null}

      {isMentionOpen && !editingMessage ? (
        <MentionDropdown
          members={members}
          query={mentionQuery}
          onSelect={handleMentionSelect}
        />
      ) : null}

      <div className="flex items-end gap-2 px-4 py-3">
        {!editingMessage ? (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-500"
              aria-label="Attach file"
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </>
        ) : null}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(event) => handleTextUpdate(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
        />

        {!editingMessage ? (
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-yellow-500"
              aria-label="Insert emoji"
            >
              <Smile size={20} />
            </button>
            {showEmojiPicker ? (
              <EmojiPickerPopover
                onSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
                position="top"
              />
            ) : null}
          </div>
        ) : null}

        <button
          onClick={handleSend}
          disabled={isSending || (!text.trim() && files.length === 0)}
          className="shrink-0 rounded-xl bg-blue-500 p-2.5 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={editingMessage ? "Save edit" : "Send message"}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
