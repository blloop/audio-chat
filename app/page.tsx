"use client";

import { useEffect, useRef } from "react";
import { useSpeech } from "./utils/speechContext";
import { useMessage } from "./utils/messageContext";
import { useConfig } from "./utils/configContext";
import AudioInput from "./components/AudioInput";
import MessageInput from "./components/MessageInput";
import ChatMessage from "./components/ChatMessage";

export default function Home() {
  const { messages, addMessage } = useMessage();
  const { transcript, listening, input, setInput } = useSpeech();
  const { autoSend } = useConfig();
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!listening && transcript && autoSend) {
      handleMessage();
    }
  }, [listening, transcript]);

  const handleMessage = () => {
    setInput("");
    addMessage(input);
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-white">
      <div className="flex justify-center w-full p-4 pb-2 text-black border-b-2 border-gray-200 bg-gray-100">
        <p className="text-2xl font-semibold text-gray-500">AudioChat</p>
      </div>
      {/* Message list area */}
      <div className="flex flex-col flex-grow overflow-y-auto px-4 space-y-4">
        <div className="flex-1"></div>
        {messages.map((e, i) => (
          <ChatMessage
            key={i}
            message={e}
            latest={i === messages.length - 1}
            audioPath={i === 0 ? "/initial_message.wav" : null}
          />
        ))}
        <div ref={messageRef} />
      </div>

      {/* Bottom input area */}
      <div className="flex flex-col gap-2 p-4 border-t border-gray-200 bg-gray-100">
        <MessageInput handleMessage={handleMessage} />
        <AudioInput />
      </div>
    </div>
  );
}
