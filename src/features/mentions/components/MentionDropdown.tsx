import type { IParticipant } from "@/types/conversation.types";

interface MentionDropdownProps {
  /** Conversation participants to show. */
  members: IParticipant[];
  /** Current filter query typed after @. */
  query: string;
  /** Called when a member is selected. */
  onSelect: (memberName: string, memberId: string) => void;
}

/**
 * Dropdown for @mention autocomplete in the message composer.
 */
export default function MentionDropdown({
  members,
  query,
  onSelect,
}: MentionDropdownProps) {
  const filtered = members.filter((member) =>
    member.user.name.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="absolute bottom-full left-4 mb-1 w-64 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-400 shadow-lg">
        No matches found
      </div>
    );
  }

  return (
    <div className="absolute bottom-full left-4 mb-1 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="max-h-56 overflow-y-auto p-1">
        {filtered.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelect(member.user.name, member.user.id)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-gray-50"
          >
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
              {member.user.profileImage ? (
                <img
                  src={member.user.profileImage}
                  alt={member.user.name}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                member.user.name.charAt(0).toUpperCase()
              )}
            </div>
            <span className="truncate font-medium text-gray-700">
              {member.user.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
