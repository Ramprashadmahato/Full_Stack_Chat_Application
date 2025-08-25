// Get the other user in a 1-to-1 chat
export const getSender = (loggedUser, users) => {
  if (!users || users.length === 0) return null;
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

// Check if the sender of current message is different from next message
export const isSameSender = (messages, mess, index, userId) => {
  if (!messages || !mess) return false;
  return (
    index < messages.length - 1 &&
    (messages[index + 1]?.sender?._id !== mess?.sender?._id ||
      messages[index + 1]?.sender?._id === undefined) &&
    messages[index]?.sender?._id !== userId
  );
};

// Check if this is the last message from another user
export const isLastMessage = (messages, index, userId) => {
  if (!messages || messages.length === 0) return false;
  const lastMsg = messages[messages.length - 1];
  return index === messages.length - 1 && lastMsg?.sender?._id !== userId;
};

// Determine margin for chat bubble depending on sender
export const isSameSenderMargin = (messages, mess, index, userId) => {
  if (!messages || !mess) return "auto";

  if (
    index < messages.length - 1 &&
    messages[index + 1]?.sender?._id === mess?.sender?._id &&
    messages[index]?.sender?._id !== userId
  ) {
    return 33;
  } else if (
    (index < messages.length - 1 &&
      messages[index + 1]?.sender?._id !== mess?.sender?._id &&
      messages[index]?.sender?._id !== userId) ||
    (index === messages.length - 1 && messages[index]?.sender?._id !== userId)
  ) {
    return 0;
  } else return "auto";
};

// Check if previous message is from the same user
export const isSameUser = (messages, mess, index) => {
  if (!messages || !mess || index === 0) return false;
  return messages[index - 1]?.sender?._id === mess?.sender?._id;
};
