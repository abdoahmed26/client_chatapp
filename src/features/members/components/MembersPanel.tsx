import { useState } from "react";
import { Loader2, Settings, UserPlus, X } from "lucide-react";
import type { IConversation } from "@/types/conversation.types";
import { useAppSelector } from "@/store/hooks";
import { useMembers } from "../api/useMembers";
import { useRemoveMember } from "../api/useRemoveMember";
import { useUpdateMemberRole } from "../api/useUpdateMemberRole";
import { useIsConversationAdmin } from "../hooks/useIsConversationAdmin";
import AddMemberDialog from "./AddMemberDialog";
import EditConversationForm from "./EditConversationForm";
import MemberItem from "./MemberItem";

interface MembersPanelProps {
  conversationId: string;
  conversation: IConversation | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Slide-in panel for viewing and managing conversation members.
 */
export default function MembersPanel({
  conversationId,
  conversation,
  isOpen,
  onClose,
}: MembersPanelProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data: members, isLoading, isError } = useMembers(conversationId);
  const isAdmin = useIsConversationAdmin(members);
  const removeMutation = useRemoveMember();
  const roleMutation = useUpdateMemberRole();

  if (conversation?.type === "private") {
    return null;
  }

  const handleRemove = (memberId: string) => {
    if (!window.confirm("Remove this member from the conversation?")) {
      return;
    }

    removeMutation.mutate({ conversationId, memberId });
  };

  const handleToggleRole = (
    memberId: string,
    currentRole: "member" | "admin"
  ) => {
    roleMutation.mutate({
      conversationId,
      memberId,
      payload: { role: currentRole === "admin" ? "member" : "admin" },
    });
  };

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={onClose}
        />
      ) : null}

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-80 flex-col border-l border-gray-200 bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Members{members ? ` (${members.length})` : ""}
          </h3>
          <div className="flex items-center gap-1">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setShowEditForm((prev) => !prev)}
                  className="rounded p-1.5 text-gray-500 transition hover:bg-gray-100"
                  title="Edit conversation"
                  aria-label="Edit conversation"
                >
                  <Settings size={16} />
                </button>
                <button
                  onClick={() => setShowAddDialog(true)}
                  className="rounded p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-blue-500"
                  title="Add member"
                  aria-label="Add member"
                >
                  <UserPlus size={16} />
                </button>
              </>
            ) : null}
            <button
              onClick={onClose}
              className="rounded p-1.5 text-gray-500 transition hover:bg-gray-100"
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {showEditForm && conversation ? (
            <div className="mb-3">
              <EditConversationForm
                conversationId={conversationId}
                conversation={conversation}
                onDone={() => setShowEditForm(false)}
              />
            </div>
          ) : null}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={22} className="animate-spin text-gray-400" />
            </div>
          ) : isError ? (
            <p className="py-8 text-center text-sm text-red-500">
              Failed to load members.
            </p>
          ) : (
            <div className="space-y-1">
              {(members ?? []).map((member) => (
                <MemberItem
                  key={member.id}
                  member={member}
                  isAdmin={isAdmin}
                  isSelf={member.user.id === currentUser?.id}
                  onRemove={handleRemove}
                  onToggleRole={handleToggleRole}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddDialog ? (
        <AddMemberDialog
          conversationId={conversationId}
          existingMembers={members || []}
          onClose={() => setShowAddDialog(false)}
        />
      ) : null}
    </>
  );
}
