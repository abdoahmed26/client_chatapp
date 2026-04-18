import { useEffect, useRef } from "react";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";

interface EmojiPickerPopoverProps {
  /** Called when an emoji is selected. */
  onSelect: (emoji: string) => void;
  /** Closes the picker. */
  onClose: () => void;
  /** Controls whether the popover renders above or below the trigger. */
  position?: "top" | "bottom";
}

/**
 * Shared emoji picker popover with outside-click dismissal.
 */
export default function EmojiPickerPopover({
  onSelect,
  onClose,
  position = "top",
}: EmojiPickerPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelect(emojiData.emoji);
  };

  return (
    <div
      ref={ref}
      className={`absolute right-0 z-50 ${
        position === "top" ? "bottom-full mb-2" : "top-full mt-2"
      }`}
    >
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        theme={Theme.LIGHT}
        emojiStyle={EmojiStyle.NATIVE}
        searchDisabled={false}
        lazyLoadEmojis
      />
    </div>
  );
}
