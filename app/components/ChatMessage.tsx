import React from "react";
import { cn } from "../utils/cn";

interface ChatMessageProps {
  message: string;
  fromUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, fromUser }) => {
  const alignment = fromUser ? "self-end" : "self-start";
  const roundLarge = fromUser
    ? "-right-2 rounded-bl-xl"
    : "-left-2 rounded-br-xl";
  const roundSmall = fromUser
    ? "-right-4 rounded-bl-lg"
    : "-left-4 rounded-br-lg";
  const bgColor = fromUser ? "bg-blue-500" : "bg-gray-300";
  const textColor = fromUser ? "text-white" : "text-black";

  return (
    <div
      className={cn(
        "relative p-3 rounded-3xl max-w-xs",
        alignment,
        bgColor,
        textColor,
      )}
    >
      <span className="z-20">{message}</span>
      <div
        className={cn(
          "absolute z-10 bottom-0 w-4 h-6 bg-stone-500",
          alignment,
          bgColor,
          roundLarge,
        )}
      ></div>
      <div
        className={cn(
          "absolute z-10 bottom-0 w-4 h-6 bg-gray-100",
          alignment,
          roundSmall,
        )}
      ></div>
    </div>
  );
};

export default ChatMessage;
