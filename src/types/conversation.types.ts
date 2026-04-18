import type { IUser } from "@/types/auth.types";

/** Summarized last message shown in a conversation list item. */
export interface IMessagePreview {
  id: string;
  content?: string;
  files?: string[];
  seen: boolean;
  sender: { id: string; name: string; profileImage?: string };
  createdAt: string;
}

/** A user's membership in a conversation. */
export interface IParticipant {
  id: string;
  user: IUser;
  role: "member" | "admin";
}

/** A chat thread between two or more users. */
export interface IConversation {
  id: string;
  title: string | null;
  description: string | null;
  image: string | null;
  type: "private" | "group" | "channel";
  createdAt: string; // ISO 8601
  updatedAt: string;
}

/** Request payload for POST /conversations. */
export interface ICreateConversationPayload {
  title?: string;
  description?: string;
  image?: File;
  type: "private" | "group" | "channel";
  membersIds: string[];
}

/** Request payload for POST /conversation-members/:conversationId. */
export interface IAddMemberPayload {
  userId: string;
  role: "member" | "admin";
}

/** Request payload for PATCH /conversation-members/:conversationId?memberId=. */
export interface IUpdateMemberRolePayload {
  role: "member" | "admin";
}

/** Request payload for PATCH /conversations/:id. */
export interface IUpdateConversationPayload {
  title?: string;
  description?: string;
  image?: File;
}
