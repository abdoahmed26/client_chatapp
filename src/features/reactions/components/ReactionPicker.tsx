import { useState } from "react";
import { Smile } from "lucide-react";
import EmojiPickerPopover from "@/components/ui/EmojiPickerPopover";

interface ReactionPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

/**
 * Smile button that opens the emoji picker for adding a reaction to a message.
 */
export default function ReactionPicker({
  onSelectEmoji,
}: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (emoji: string) => {
    onSelectEmoji(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-yellow-500"
        title="React"
        aria-label="Add reaction"
      >
        <Smile size={14} />
      </button>
      {isOpen ? (
        <EmojiPickerPopover
          onSelect={handleSelect}
          onClose={() => setIsOpen(false)}
          position="bottom"
        />
      ) : null}
    </div>
  );
}

