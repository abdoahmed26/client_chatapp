import type { IParticipant } from "@/types/conversation.types";
import { Shield, ShieldCheck, UserMinus } from "lucide-react";

interface MemberItemProps {
  member: IParticipant;
  isAdmin: boolean;
  isSelf: boolean;
  onRemove: (memberId: string) => void;
  onToggleRole: (memberId: string, currentRole: "member" | "admin") => void;
}

/**
 * Renders a single conversation member row with optional admin actions.
 */
export default function MemberItem({
  member,
  isAdmin,
  isSelf,
  onRemove,
  onToggleRole,
}: MemberItemProps) {
  const avatarFallback = member.user.name.charAt(0).toUpperCase();
  const isTargetAdmin = member.role === "admin";
  const avatarUrl = member.user.profileImage;

  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={member.user.name}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
          {avatarFallback}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-gray-900">
            {member.user.name}
            {isSelf ? <span className="ml-1 text-xs text-gray-400">(you)</span> : null}
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
              isTargetAdmin ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {isTargetAdmin ? (
              <>
                <ShieldCheck size={10} />
                Admin
              </>
            ) : (
              "Member"
            )}
          </span>
        </div>
        <p className="truncate text-xs text-gray-400">{member.user.email}</p>
      </div>

      {isAdmin && !isSelf ? (
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onToggleRole(member.id, member.role)}
            className="rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-amber-500"
            title={isTargetAdmin ? "Demote to Member" : "Promote to Admin"}
            aria-label={isTargetAdmin ? "Demote to Member" : "Promote to Admin"}
          >
            {isTargetAdmin ? <Shield size={16} /> : <ShieldCheck size={16} />}
          </button>
          <button
            onClick={() => onRemove(member.id)}
            className="rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-red-500"
            title="Remove member"
            aria-label="Remove member"
          >
            <UserMinus size={16} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
