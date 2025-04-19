"use client";

import Image from "next/image";
import ChatMessage from "./components/ChatMessage";
import ArrowUp from "./ui/ArrowUp.svg";
import CircleStop from "./ui/CircleStop.svg";
import Microphone from "./ui/Microphone.svg";
import { useEffect, useState } from "react";
import { useSpeech } from "./utils/speechContext";

// https://replicate.com/jaaari/kokoro-82m
// https://replicate.com/meta/meta-llama-3-8b-instruct

export default function Home() {
  const [input, setInput] = useState("");
  const { transcript, listening, reset, listen, stop, speak, supported } = useSpeech();

  useEffect(() => {
    setInput(transcript);
  }, [transcript])

  const audioButton = () => {
    if (listening) {
      stop();
    } else {
      setInput("");
      listen();
    }
  }

  return (
    <div className="flex flex-col h-screen mx-auto max-w-xl font-sans bg-white">
      {/* Message list area */}
      <div className="flex flex-col flex-grow overflow-y-auto p-4 space-y-4">
        <ChatMessage
          message="Hello! How can I help you today?"
          fromUser={false}
        />
        <ChatMessage
          message="I need help with my account."
          fromUser={true}
        />
      </div>

      {/* Bottom input area */}
      <div className="flex gap-2 p-4 border-t border-gray-200 bg-gray-100 rounded-b-3xl">
        <input type="text" placeholder={listening ? "Recording..." : "Type your input here..."} value={input} onChange={(e) => {setInput(e.target.value)}} className="w-full border-2 border-gray-300 rounded-md text-black px-2" />
        <button type="button" className="bg-blue-500 hover:bg-blue-700 transition-colors text-white font-bold p-2 rounded-full">
          <Image className="text-white" alt="Up arrow" width={32} height={32} src={ArrowUp} />
        </button>
        <button type="button" onClick={audioButton} className="hover:bg-gray-400 px-2 rounded-full transition-colors">
          {listening ?
            <Image alt="Stop icon" width={32} height={32} src={CircleStop} />
          :
            <Image alt="Microphone icon" width={32} height={32} src={Microphone} />
          }
        </button>
      </div>
    </div>
  );
}
