import { Search, X } from "lucide-react";

interface ConversationSearchProps {
  /** Current search query value. */
  value: string;
  /** Called when the search value changes. */
  onChange: (value: string) => void;
}

/**
 * Search input used to filter conversations in the sidebar.
 */
export default function ConversationSearch({
  value,
  onChange,
}: ConversationSearchProps) {
  return (
    <div className="relative px-3 py-2">
      <Search
        size={16}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder="Search conversations..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm transition placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
