/**
 * Parses backend date strings safely.
 * Timezone-less ISO strings are treated as UTC (backend convention).
 */
function parseDateValue(date: Date | string): Date {
  if (date instanceof Date) {
    return date;
  }

  // Already has timezone info → parse directly
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(date)) {
    return new Date(date);
  }

  // No timezone → assume UTC (append Z)
  return new Date(`${date}Z`);
}

/**
 * Formats a date into a short, human-readable relative time string.
 * @param date - ISO 8601 string or Date object.
 * @returns A relative label such as "Just now", "2m ago", "Yesterday", or "Mar 24".
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const value = parseDateValue(date);
  const diffMs = now.getTime() - value.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (value.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  if (diffDay < 7) {
    return value.toLocaleDateString(undefined, { weekday: "short" });
  }

  return value.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
