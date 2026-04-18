import { useMemo } from "react";
import type { IParticipant } from "@/types/conversation.types";
import { useAppSelector } from "@/store/hooks";

/**
 * Checks whether the current user is an admin in the provided members list.
 * @param members - The loaded members list for the active conversation.
 */
export function useIsConversationAdmin(
  members: IParticipant[] | undefined
): boolean {
  const currentUser = useAppSelector((state) => state.auth.user);

  return useMemo(() => {
    if (!members || !currentUser) {
      return false;
    }

    const membership = members.find((member) => member.user.id === currentUser.id);
    return membership?.role === "admin";
  }, [currentUser, members]);
}
