import { useAppSelector } from "@/store/hooks";
import type { IReaction } from "@/types/message.types";

interface GroupedReaction {
  emoji: string;
  count: number;
  reactionIds: string[];
  hasReacted: boolean;
  userReactionId: string | null;
}

interface ReactionBarProps {
  reactions: IReaction[];
  onToggleReaction: (emoji: string, existingReactionId: string | null) => void;
}

/**
 * Displays grouped emoji reactions and lets the current user toggle their own reaction.
 */
export default function ReactionBar({
  reactions,
  onToggleReaction,
}: ReactionBarProps) {
  const currentUser = useAppSelector((state) => state.auth.user);

  if (reactions.length === 0) {
    return null;
  }

  const grouped: GroupedReaction[] = [];

  for (const reaction of reactions) {
    const existing = grouped.find((group) => group.emoji === reaction.reaction);

    if (existing) {
      existing.count += 1;
      existing.reactionIds.push(reaction.id);

      if (reaction.user.id === currentUser?.id) {
        existing.hasReacted = true;
        existing.userReactionId = reaction.id;
      }

      continue;
    }

    grouped.push({
      emoji: reaction.reaction,
      count: 1,
      reactionIds: [reaction.id],
      hasReacted: reaction.user.id === currentUser?.id,
      userReactionId: reaction.user.id === currentUser?.id ? reaction.id : null,
    });
  }

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {grouped.map((group) => (
        <button
          key={group.emoji}
          onClick={() => onToggleReaction(group.emoji, group.userReactionId)}
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition ${
            group.hasReacted
              ? "border-blue-300 bg-blue-50 text-blue-600"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
          title={`${group.emoji} ${group.count}`}
        >
          <span>{group.emoji}</span>
          <span className="font-medium">{group.count}</span>
        </button>
      ))}
    </div>
  );
}
