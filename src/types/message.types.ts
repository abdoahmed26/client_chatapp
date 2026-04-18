/** Sender details embedded in each message from the API. */
export interface IMessageSender {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
}

/** A single emoji reaction on a message. */
export interface IReaction {
  id: string;
  user: IMessageSender;
  reaction: string;
}

/** A user mention within a message. */
export interface IMention {
  id: string;
  user: IMessageSender;
}

/** Payload for POST /message-reactions. */
export interface ICreateReactionPayload {
  messageId: string;
  reaction: string;
}

/** Payload for POST /message-mentions. */
export interface ICreateMentionPayload {
  messageId: string;
  userId: string;
}

/**
 * Full message object returned by the conversation messages endpoint.
 */
export interface IMessage {
  id: string;
  content: string | null;
  files: string[];
  seen: boolean;
  parentMessage: IMessage | null;
  createdAt: string;
  updatedAt: string;
  sender: IMessageSender;
  reactions: IReaction[];
  mentions: IMention[];
}

/**
 * Payload for sending a new message as multipart/form-data.
 */
export interface ISendMessagePayload {
  content: string;
  conversationId: string;
  files?: File[];
  parentMessageId?: string;
}

/** Payload for editing an existing message. */
export interface IUpdateMessagePayload {
  content: string;
}

/**
 * A group of consecutive messages from the same sender within a short time window.
 */
export interface IMessageGroup {
  senderId: string;
  senderName: string;
  senderProfileImage: string | null;
  messages: IMessage[];
}
