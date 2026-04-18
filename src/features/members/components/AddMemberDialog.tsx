import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Search, UserPlus, X } from "lucide-react";
import type { IParticipant } from "@/types/conversation.types";
import { useSearchUsers } from "@/features/conversations/api/useSearchUsers";
import { useAddMember } from "../api/useAddMember";

interface AddMemberDialogProps {
  conversationId: string;
  existingMembers: IParticipant[];
  onClose: () => void;
}

/**
 * Modal dialog for searching and adding new conversation members.
 */
export default function AddMemberDialog({
  conversationId,
  existingMembers,
  onClose,
}: AddMemberDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: searchResults, isLoading: isSearching } =
    useSearchUsers(debouncedSearch);
  const addMutation = useAddMember();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const existingIds = useMemo(
    () => new Set(existingMembers.map((member) => member.user.id)),
    [existingMembers]
  );

  const filteredUsers = useMemo(() => {
    return (searchResults?.users ?? []).filter((user) => !existingIds.has(user.id));
  }, [existingIds, searchResults]);

  const handleAdd = (userId: string) => {
    addMutation.mutate(
      { conversationId, payload: { userId, role: "member" } },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-60 bg-black/40" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-70 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">Add Member</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 transition hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name or email..."
              className="flex-1 bg-transparent text-sm placeholder:text-gray-400 focus:outline-none"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto p-2">
          {isSearching ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={20} className="animate-spin text-gray-400" />
            </div>
          ) : null}

          {!isSearching && !debouncedSearch ? (
            <p className="py-6 text-center text-sm text-gray-400">
              Type to search for users.
            </p>
          ) : null}

          {!isSearching && debouncedSearch && filteredUsers.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              No users found.
            </p>
          ) : null}

          {!isSearching
            ? filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                  </div>

                  <button
                    onClick={() => handleAdd(user.id)}
                    disabled={addMutation.isPending}
                    className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
                    aria-label={`Add ${user.name}`}
                  >
                    <span className="flex items-center gap-1">
                      {addMutation.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <UserPlus size={14} />
                      )}
                      Add
                    </span>
                  </button>
                </div>
              ))
            : null}

          {!isSearching && debouncedSearch && (searchResults?.users?.length ?? 0) > 0 && filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center gap-1 py-2 text-xs text-green-500">
              <Check size={14} />
              Everyone in the results is already a member.
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
