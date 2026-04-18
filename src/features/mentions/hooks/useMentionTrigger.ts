import { useCallback, useState } from "react";

interface MentionTriggerState {
  /** Whether the mention dropdown should be visible. */
  isOpen: boolean;
  /** The text typed after @ for filtering. */
  query: string;
  /** List of user IDs that have been mentioned. */
  mentionedUserIds: string[];
  /** Detects whether the current text contains an active mention token. */
  handleTextChange: (text: string) => void;
  /** Replaces the active @query with the selected display name. */
  selectMention: (userName: string, userId: string, currentText: string) => string;
  /** Dismisses the dropdown. */
  closeMention: () => void;
  /** Clears tracked mentions. */
  resetMentions: () => void;
}

/**
 * Tracks an active @mention token inside the message composer.
 */
export function useMentionTrigger(): MentionTriggerState {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);

  const handleTextChange = useCallback((text: string) => {
    const lastAtIndex = text.lastIndexOf("@");

    if (lastAtIndex === -1) {
      setIsOpen(false);
      setQuery("");
      return;
    }

    const afterAt = text.slice(lastAtIndex + 1);
    const charBefore = lastAtIndex > 0 ? text[lastAtIndex - 1] : " ";

    if (afterAt.includes("\n") || (charBefore !== " " && charBefore !== "\n" && lastAtIndex !== 0)) {
      setIsOpen(false);
      setQuery("");
      return;
    }

    setIsOpen(true);
    setQuery(afterAt);
  }, []);

  const selectMention = useCallback(
    (userName: string, userId: string, currentText: string): string => {
      const lastAtIndex = currentText.lastIndexOf("@");

      if (lastAtIndex === -1) {
        return currentText;
      }

      const before = currentText.slice(0, lastAtIndex);
      const updatedText = `${before}@${userName} `;

      setIsOpen(false);
      setQuery("");
      setMentionedUserIds((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );

      return updatedText;
    },
    []
  );

  const closeMention = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const resetMentions = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setMentionedUserIds([]);
  }, []);

  return {
    isOpen,
    query,
    mentionedUserIds,
    handleTextChange,
    selectMention,
    closeMention,
    resetMentions,
  };
}
