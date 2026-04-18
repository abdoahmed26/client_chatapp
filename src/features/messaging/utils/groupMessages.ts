import type { IMessage, IMessageGroup } from "@/types/message.types";

const GROUP_WINDOW_MS = 5 * 60 * 1000;

/**
 * Groups consecutive messages from the same sender within a 5-minute window.
 * @param messages - Messages in chronological order.
 * @returns Message groups for list rendering.
 */
export function groupMessages(messages: IMessage[]): IMessageGroup[] {
  if (messages.length === 0) {
    return [];
  }

  const groups: IMessageGroup[] = [];
  let currentGroup: IMessageGroup = {
    senderId: messages[0].sender.id,
    senderName: messages[0].sender.name,
    senderProfileImage: messages[0].sender.profileImage,
    messages: [messages[0]],
  };

  for (let index = 1; index < messages.length; index += 1) {
    const message = messages[index];
    const previousMessage = messages[index - 1];
    const timeDiff =
      new Date(message.createdAt).getTime() -
      new Date(previousMessage.createdAt).getTime();

    if (
      message.sender.id === currentGroup.senderId &&
      timeDiff <= GROUP_WINDOW_MS
    ) {
      currentGroup.messages.push(message);
      continue;
    }

    groups.push(currentGroup);
    currentGroup = {
      senderId: message.sender.id,
      senderName: message.sender.name,
      senderProfileImage: message.sender.profileImage,
      messages: [message],
    };
  }

  groups.push(currentGroup);
  return groups;
}
