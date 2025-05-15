"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "./utils/cn";
import { useSpeech } from "./utils/speechContext";
import { useMessage } from "./utils/messageContext";
import { useConfig } from "./utils/configContext";
import AudioInput from "./components/AudioInput";
import MessageInput from "./components/MessageInput";
import ChatMessage from "./components/ChatMessage";
import AudioOnly from "./components/AudioOnly";
import HeaderVoice from "./components/HeaderVoice";
import HeaderToggle from "./components/HeaderToggle";

export default function Home() {
  const { playing, messages, addMessage } = useMessage();
  const { transcript, listen, listening, input, setInput } = useSpeech();
  const { autoSend, autoListen, isText } = useConfig();
  const messageRef = useRef<HTMLDivElement | null>(null);

  const handleMessage = useCallback(async () => {
    setInput("");
    addMessage(input);
  }, [addMessage, input, setInput]);

  useEffect(() => {
    setInput(transcript);
  }, [transcript, setInput]);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if ((!isText || autoSend) && !listening && transcript) {
      handleMessage();
    }
  }, [
    listening,
    transcript,
    autoListen,
    isText,
    listen,
    setInput,
    autoSend,
    handleMessage,
  ]);

  useEffect(() => {
    if ((!isText || autoListen) && playing === -1) {
      setInput("");
      listen();
    }
  }, [playing, isText, autoListen, setInput, listen]);

  return (
    <div className="flex flex-col h-screen font-sans bg-white">
      {/* Header area */}
      <div className="flex justify-between w-full gap-2 p-4 text-black border-b-2 border-gray-200 bg-gray-100">
        <HeaderVoice />
        <p className="text-2xl font-semibold text-gray-500">AudioChat</p>
        <HeaderToggle />
      </div>

      {/* Message list area */}
      <div
        className={cn(
          "flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-4 space-y-4",
          !isText && "hidden",
        )}
      >
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
      <div
        className={cn(
          "flex flex-col gap-2 p-4 border-t border-gray-200 bg-gray-100",
          !isText && "hidden",
        )}
      >
        <MessageInput handleMessage={handleMessage} />
        <AudioInput />
      </div>

      {/* Microphone button area */}
      <div
        className={cn(
          "flex flex-col flex-1 gap-4 items-center justify-center",
          isText && "hidden",
        )}
      >
        <AudioOnly />
      </div>
      {/* Bottom description area */}
      <div className={cn("flex flex-col h-16", isText && "hidden")}></div>
    </div>
  );
}
