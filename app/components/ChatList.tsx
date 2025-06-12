"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { cn } from "../utils/cn";
import { Message, useMessage } from "../utils/messageContext";
import { useSpeech } from "../utils/speechContext";
import { useConfig } from "../utils/configContext";
import MemoizedChatMessage from "./ChatMessage";

export default function ChatList() {
  const { messages } = useMessage();
  const messageRef = useRef<HTMLDivElement | null>(null);
  const { playing, addMessage } = useMessage();
  const { transcript, listen, listening, input, setInput } = useSpeech();
  const { autoSend, isText } = useConfig();

  // Scroll to the bottom when messages are updated or mode is toggled
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isText]);

  // Set input value based on transcript from speech API
  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  // Automatically send the message when speaking is done
  useEffect(() => {
    if ((!isText || autoSend) && !listening && transcript) {
      handleMessage();
    }
  }, [listening, transcript]);

  const handleMessage = async () => {
    setInput("");
    addMessage(input);
  };

  const trimEnd = useCallback((message: Message) => {
    const messageText = message.text;
    if (
      messageText.charAt(messageText.length - 2) === "{" &&
      messageText.charAt(messageText.length - 1) === "}"
    ) {
      return {
        ...message,
        text: messageText.slice(0, messageText.length - 2),
      };
    }
    return message;
  }, []);

  const memoizedMessages = useMemo(() => {
    return messages.map((e, i) => (
      <MemoizedChatMessage
        key={i}
        index={i}
        message={trimEnd(e)}
        latest={i === messages.length - 1}
      />
    ));
  }, [messages, trimEnd]);

  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-4 pb-0",
        !isText && "hidden"
      )}
    >
      <div className="flex-1"></div>
      {memoizedMessages}
      <div ref={messageRef} />
    </div>
  );
}
