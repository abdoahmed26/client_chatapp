import { IConversation } from "@/types/conversation.types";
import { ArrowLeft, Phone, Users, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCallSocket } from "@/features/calls/hooks/useCallSocket";
import { useAppSelector } from "@/store/hooks";
import type { IParticipant } from "@/types/conversation.types";

interface MessageHeaderProps {
  /** The active conversation. */
  conversation: IConversation | null;
  /** Callback to toggle the members panel. Only called for group/channel. */
  onToggleMembers?: () => void;
  /** Members of the current conversation (used to resolve the peer for calls). */
  members?: IParticipant[];
}

/**
 * Header bar for the active conversation.
 * Shows back button, conversation identity, call buttons (for private), and members toggle.
 */
export default function MessageHeader({
  conversation,
  onToggleMembers,
  members = [],
}: MessageHeaderProps) {
  const navigate = useNavigate();
  const { startCall } = useCallSocket();
  const currentUser = useAppSelector((state) => state.auth.user);
  const callStatus = useAppSelector((state) => state.call.status);

  const conversationName =
    conversation?.title || conversation?.description || "Chat";
  const conversationImage = conversation?.image;
  const showMembersButton =
    !!conversation && conversation.type !== "private" && !!onToggleMembers;

  // For private conversations, resolve the other participant
  const isPrivate = conversation?.type === "private";
  const peer = isPrivate
    ? members.find((m) => m.user.id !== currentUser?.id)?.user ?? null
    : null;

  const canCall = isPrivate && peer && callStatus === "idle";

  const handleAudioCall = () => {
    if (!peer) return;
    startCall({
      calleeId: peer.id,
      calleeName: peer.name,
      calleeProfileImage: peer.profileImage ?? null,
      type: "audio",
      conversationId: conversation?.id,
    });
  };

  const handleVideoCall = () => {
    if (!peer) return;
    startCall({
      calleeId: peer.id,
      calleeName: peer.name,
      calleeProfileImage: peer.profileImage ?? null,
      type: "video",
      conversationId: conversation?.id,
    });
  };

  return (
    <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
      <button
        onClick={() => navigate("/")}
        className="rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 md:hidden"
        aria-label="Back to conversations"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="flex flex-1 items-center gap-3">
        {conversationImage ? (
          <img
            src={conversationImage}
            alt={conversationName}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
            {conversationName.charAt(0).toUpperCase()}
          </div>
        )}
        <h2 className="truncate text-lg font-semibold text-gray-900">
          {conversationName}
        </h2>
      </div>

      {/* Call buttons — only for private (1:1) conversations */}
      {canCall && (
        <div className="flex items-center gap-1">
          <button
            onClick={handleAudioCall}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-green-50 hover:text-green-600"
            aria-label="Audio call"
            title="Audio call"
          >
            <Phone size={19} />
          </button>
          <button
            onClick={handleVideoCall}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label="Video call"
            title="Video call"
          >
            <Video size={19} />
          </button>
        </div>
      )}

      {showMembersButton ? (
        <button
          onClick={onToggleMembers}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-500"
          aria-label="Toggle members panel"
        >
          <Users size={20} />
        </button>
      ) : null}
    </div>
  );
}
