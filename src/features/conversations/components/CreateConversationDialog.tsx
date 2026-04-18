import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Search, X } from "lucide-react";
import { useSearchUsers } from "../api/useSearchUsers";
import { useCreateConversation } from "../api/useCreateConversation";
import UserSearchResult from "./UserSearchResult";
import { useAppSelector } from "@/store/hooks";
import type { IUser } from "@/types/auth.types";

interface CreateConversationDialogProps {
  /** Controls dialog visibility. */
  open: boolean;
  /** Called when the dialog open state changes. */
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for searching users and creating a new conversation.
 */
export default function CreateConversationDialog({
  open,
  onOpenChange,
}: CreateConversationDialogProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data: searchResults, isLoading: isSearching } =
    useSearchUsers(debouncedQuery);
  const createMutation = useCreateConversation();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredResults =
    searchResults?.users.filter((user) => user.id !== currentUser?.id) ?? [];

  const handleToggleUser = useCallback((user: IUser) => {
    setSelectedUsers((previous) => {
      const exists = previous.find((entry) => entry.id === user.id);

      if (exists) {
        return previous.filter((entry) => entry.id !== user.id);
      }

      return [...previous, user];
    });
  }, []);

  const handleClose = useCallback(() => {
    setSearchInput("");
    setDebouncedQuery("");
    setTitle("");
    setDescription("");
    setImage(null);
    setSelectedUsers([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  }, [onOpenChange]);

  const handleCreate = () => {
    if (selectedUsers.length === 0) {
      return;
    }

    createMutation.mutate(
      {
        title:
          title.trim() ||
          (selectedUsers.length > 1
            ? selectedUsers.map((user) => user.name).join(", ")
            : selectedUsers[0]?.name),
        description:
          description.trim() ||
          `Conversation with ${selectedUsers.map((user) => user.name).join(", ")}`,
        image: image ?? undefined,
        type: selectedUsers.length > 1 ? "group" : "private",
        membersIds: selectedUsers.map((user) => user.id),
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900">
            New Conversation
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 border-b px-4 py-3">
          <input
            type="text"
            placeholder="Conversation title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
          <textarea
            placeholder="Conversation description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => setImage(event.target.files?.[0] ?? null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
            >
              <ImagePlus size={16} />
              {image ? "Change image" : "Upload image"}
            </button>
            {image && (
              <div className="min-w-0 flex-1 text-xs text-gray-500">
                <p className="truncate">{image.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="relative border-b px-4 py-3">
          <Search
            size={16}
            className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm transition placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
            autoFocus
          />
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-b px-4 py-2">
            {selectedUsers.map((user) => (
              <span
                key={user.id}
                className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"
              >
                {user.name}
                <button
                  onClick={() => handleToggleUser(user)}
                  className="rounded-full p-0.5 transition hover:bg-blue-200"
                  aria-label={`Remove ${user.name}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="max-h-64 overflow-y-auto px-2 py-2">
          {isSearching ? (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : debouncedQuery && filteredResults.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No users found
            </p>
          ) : debouncedQuery ? (
            filteredResults.map((user) => (
              <UserSearchResult
                key={user.id}
                user={user}
                isSelected={selectedUsers.some((entry) => entry.id === user.id)}
                onToggle={handleToggleUser}
              />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">
              Type to search for users
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t px-4 py-3">
          <button
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={selectedUsers.length === 0 || createMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
