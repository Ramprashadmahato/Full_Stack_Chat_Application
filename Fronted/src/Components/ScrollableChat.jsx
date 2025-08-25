import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  // Safety check: return null if messages is not an array
  if (!messages || !Array.isArray(messages)) return null;

  return (
    <ScrollableFeed className="overflow-auto">
      {messages.map((message, index) => {
        const isCurrentUser = message.sender._id === user._id;

        const showAvatar =
          isSameSender(messages, message, index, user._id) ||
          isLastMessage(messages, index, user._id);

        const marginLeft = isSameSenderMargin(messages, message, index, user._id);
        const marginTop = isSameUser(messages, message, index, user._id) ? 4 : 10;

        // Safe fallback for sender image
        const senderImage = message.sender.image || "/default-avatar.png";
        const senderName = message.sender.name || "User";

        return (
          <div className="flex items-end" key={message._id}>
            {showAvatar && (
              <div className="relative" title={senderName}>
                <img
                  src={senderImage}
                  alt={senderName}
                  onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = "/default-avatar.png";
                  }}
                  className="h-6 w-6 rounded-full mr-1 mt-5 object-cover"
                />
              </div>
            )}

            <span
              style={{ marginLeft: marginLeft }}
              className={`px-4 py-2 max-w-2/3 break-words ${
                isCurrentUser
                  ? "bg-blue-200 rounded-tr-none rounded-l-lg rounded-br-lg"
                  : "bg-green-200 rounded-bl-none rounded-l-lg rounded-br-lg"
              }`}
            >
              {message.content}
            </span>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
