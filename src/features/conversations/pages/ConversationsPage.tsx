import ChatLayout from "@/components/layout/ChatLayout";
import Sidebar from "../components/Sidebar";

/**
 * Protected conversations page that assembles the chat layout.
 */
export default function ConversationsPage() {
  return <ChatLayout sidebar={<Sidebar />} />;
}
