"use client";

import { useEffect, useRef } from "react";
import { cn } from "./utils/cn";
import { useSpeech } from "./utils/speechContext";
import { useMessage } from "./utils/messageContext";
import { useConfig } from "./utils/configContext";
import AudioInput from "./components/AudioInput";
import MessageInput from "./components/MessageInput";
import ChatMessage from "./components/ChatMessage";
import Header from "./components/Header";
import AudioOnly from "./components/AudioOnly";

export default function Home() {
  const { messages, addMessage } = useMessage();
  const { transcript, listening, input, setInput } = useSpeech();
  const { autoSend, isText } = useConfig();
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
  if (!listening && transcript && (!isText || autoSend)) {
      handleMessage();
    }
  }, [listening, transcript]);

  const handleMessage = async () => {
    setInput("");
    addMessage(input);
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-white">
      <Header />

      {/* Message list area */}
      <div className={cn("flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-4 space-y-4",
        !isText && "hidden"
      )}>
        <div className="flex-1"></div>
        {messages.map((e, i) => (
          <ChatMessage
            key={i}
            index={i}
            message={e}
            latest={i === messages.length - 1}
          />
        ))}
        <div ref={messageRef} />
      </div>
      {/* Bottom input area */}
      <div className={cn("flex flex-col gap-2 p-4 border-t border-gray-200 bg-gray-100",
        !isText && "hidden"
      )}>
        <MessageInput handleMessage={handleMessage} />
        <AudioInput />
      </div>

      {/* Microphone button area */}
      <div className={cn("flex flex-col flex-1 gap-4 items-center justify-center",
        isText && "hidden"
      )}>
        <AudioOnly />
      </div>
      {/* Bottom description area */}
      <div className={cn("flex flex-col h-16", isText && "hidden")}>
      </div>
    </div>
  );
}
