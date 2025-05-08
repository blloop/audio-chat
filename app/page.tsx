"use client";

import ChatMessage from "./components/ChatMessage";
import { useEffect, useRef } from "react";
import { useSpeech } from "./utils/speechContext";
import AudioInput from "./components/AudioInput";
import { ArrowUp } from "lucide-react";
import { useMessage, MessageProvider } from "./utils/messageContext";

export default function Home() {
  const { messages, addMessage } = useMessage();
  const { transcript, listening, input, setInput } = useSpeech();
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessage = () => {
    setInput("");
    addMessage(input);
  };

  return (
    <MessageProvider>
      <div className="flex flex-col h-screen font-sans bg-white">
        <div className="flex justify-center w-full p-4 pb-2 text-black border-b-2 border-gray-200 bg-gray-100">
          <p className="text-2xl font-semibold text-gray-500">AudioChat</p>
        </div>
        {/* Message list area */}
        <div className="flex flex-col flex-grow overflow-y-auto p-4 space-y-4">
          <div className="flex-1"></div>
          {messages.map((e, i) => (
            <ChatMessage
              key={i}
              message={e}
              fromUser={i % 2 === 1}
              audioPath={i === 0 ? "/initial_message.wav" : null}
            />
          ))}
          <div ref={messageRef} />
        </div>

        {/* Bottom input area */}
        <div className="flex flex-col gap-2 p-4 border-t border-gray-200 bg-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={
                listening ? "Recording..." : "Type your input here..."
              }
              disabled={listening}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              className="w-full border-2 border-gray-300 rounded-full text-black px-3"
            />
            <button
              disabled={input.length === 0}
              onClick={handleMessage}
              type="button"
              className="bg-purple-500 hover:bg-purple-700 disabled:bg-gray-400 disabled:pointer-events-none transition-colors text-white font-bold p-2 rounded-full"
            >
              <ArrowUp />
            </button>
          </div>
          <AudioInput setInput={setInput} />
        </div>
      </div>
    </MessageProvider>
  );
}
