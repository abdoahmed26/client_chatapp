import type { ReactNode } from "react";
import { Outlet, useParams } from "react-router-dom";

interface ChatLayoutProps {
  /** The sidebar content shown in the left panel. */
  sidebar: ReactNode;
}

/**
 * Split-panel chat layout with responsive mobile routing behavior.
 */
export default function ChatLayout({ sidebar }: ChatLayoutProps) {
  const { id } = useParams<{ id: string }>();
  const hasSelectedConversation = Boolean(id);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <aside
        className={`w-full flex-col border-r border-gray-200 bg-white md:flex md:w-80 md:shrink-0 ${
          hasSelectedConversation ? "hidden md:flex" : "flex"
        }`}
      >
        {sidebar}
      </aside>

      <main
        className={`min-w-0 flex-1 flex-col ${
          hasSelectedConversation ? "flex" : "hidden md:flex"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
