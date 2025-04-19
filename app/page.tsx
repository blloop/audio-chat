"use client";

import Image from "next/image";
import ChatMessage from "./components/ChatMessage";
import ArrowUp from "./ui/ArrowUp.svg";
import CircleStop from "./ui/CircleStop.svg";
import Microphone from "./ui/Microphone.svg";
import Settings from "./ui/Settings.svg";
import { useEffect, useState } from "react";
import { useSpeech } from "./utils/speechContext";

// https://replicate.com/jaaari/kokoro-82m
// https://replicate.com/meta/meta-llama-3-8b-instruct

export default function Home() {
  const [input, setInput] = useState("");
  const [auto, setAuto] = useState(true);
  const { transcript, listening, reset, listen, stop, speak, supported } =
    useSpeech();

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  const audioButton = () => {
    if (listening) {
      stop();
    } else {
      setInput("");
      listen();
    }
  };

  if (!supported) {
    return (
      <div className="flex flex-col h-screen font-sans bg-gray-100">
        {/* Message list area */}
        <div className="flex flex-col flex-grow overflow-y-auto p-4 space-y-4">
          <ChatMessage
            message="Hello! How can I help you today?"
            fromUser={false}
          />
          <ChatMessage message="I need help with my account." fromUser={true} />
        </div>

        <div className="absolute inset-0 bg-[#0006] z-40 max-w-xl" />
        <div className="flex absolute inset-0 justify-center items-center z-50">
          <p className="bg-gray-800 p-4 rounded-xl">
            Your browser does not support speech recognition
          </p>
        </div>

        {/* Bottom input area */}
        <div className="flex gap-2 p-4 border-t border-gray-200 bg-gray-100 rounded-b-3xl">
          <input
            type="text"
            placeholder="Type your input here..."
            className="w-full border-2 border-gray-300 rounded-md text-black px-2"
          />
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 transition-colors text-white font-bold p-2 rounded-full"
          >
            <Image
              className="text-white"
              alt="Up arrow"
              width={32}
              height={32}
              src={ArrowUp}
            />
          </button>
          <button
            type="button"
            className="hover:bg-gray-400 px-2 rounded-full transition-colors"
          >
            <Image
              alt="Microphone icon"
              width={32}
              height={32}
              src={Microphone}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-white">
      <div className="flex justify-center w-full p-4 pb-2 text-black border-b-2 border-gray-200 bg-gray-100">
        <p className="text-2xl font-semibold text-gray-500">AudioChat</p>
      </div>
      {/* Message list area */}
      <div className="flex flex-col flex-grow overflow-y-auto p-4 space-y-4">
        <div className="flex-1"></div>
        <ChatMessage
          message="Hi there! How can I help you today?"
          fromUser={false}
        />
        {/* <ChatMessage
          message="I need help with my account."
          fromUser={true}
        /> */}
      </div>

      {/* Bottom input area */}
      <div className="flex flex-col gap-2 p-4 border-t border-gray-200 bg-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={listening ? "Recording..." : "Type your input here..."}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            className="w-full border-2 border-gray-300 rounded-full text-black px-3"
          />
          <button
            disabled={input.length === 0}
            type="button"
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:pointer-events-none transition-colors text-white font-bold p-2 rounded-full"
          >
            <Image
              className="text-white"
              alt="Up arrow"
              width={32}
              height={32}
              src={ArrowUp}
            />
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={audioButton}
            className="bg-gray-300 hover:bg-gray-400 p-2 px-3 rounded-full transition-colors"
          >
            {listening ? (
              <Image
                alt="Stop icon"
                className="inline"
                width={24}
                height={24}
                src={CircleStop}
              />
            ) : (
              <Image
                alt="Microphone icon"
                className="inline"
                width={24}
                height={24}
                src={Microphone}
              />
            )}
            <span className="text-black ml-2">Mic Input</span>
          </button>
          <div />
          <input
            id="autoSend"
            type="checkbox"
            className="scale-[1.5]"
            checked={auto}
            onChange={(e) => setAuto(e.target.checked)}
          />
          <label className="text-black" htmlFor="autoSend">
            Auto Send
          </label>
        </div>
      </div>
    </div>
  );
}
