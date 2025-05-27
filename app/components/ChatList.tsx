"use client";

import { useEffect, useRef } from "react";
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
  const { autoSend, autoListen, isText } = useConfig();

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    if ((!isText || autoSend) && !listening && transcript) {
      handleMessage();
    }
  }, [listening, transcript]);

  useEffect(() => {
    if ((!isText || autoListen) && playing === -1) {
      setInput("");
      listen();
    }
  }, [playing]);

  const handleMessage = async () => {
    setInput("");
    addMessage(input);
  };

  const trimEnd = (message: Message) => {
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
  };

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-4 space-y-4",
        !isText && "hidden",
      )}
    >
      <div className="flex-1"></div>
      {messages.map((e, i) => (
        <MemoizedChatMessage
          key={i}
          index={i}
          message={trimEnd(e)}
          latest={i === messages.length - 1}
        />
      ))}
      <div ref={messageRef} />
    </div>
  );
}
