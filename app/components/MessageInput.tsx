"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { useSpeech } from "../utils/speechContext";
import { useMessage } from "../utils/messageContext";
import { useConfig } from "../utils/configContext";

const MessageInput: React.FC = () => {
  const { sending, addMessage } = useMessage();
  const { listening, input, setInput } = useSpeech();
  const { isText } = useConfig();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleMessage = async (input: string) => {
    setInput("");
    addMessage(input);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          if (
            inputRef.current === document.activeElement &&
            !listening &&
            input.length > 0
          ) {
            handleMessage(input);
            inputRef.current?.focus();
          }
        default:
          if (
            event.key === "Escape" &&
            document.activeElement instanceof HTMLElement
          ) {
            document.activeElement.blur();
          }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [inputRef, listening, input]);

  useEffect(() => {
    if (!listening && !sending) {
      inputRef.current?.focus();
    }
  }, [listening, sending, isText]);

  return (
    <div className="flex gap-2">
      <input
        type="text"
        ref={inputRef}
        placeholder={listening ? "Listening..." : "Type your input here..."}
        disabled={listening || sending}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        className="w-full border-2 border-gray-300 rounded-full text-black px-3"
      />
      <button
        disabled={input.length === 0 || sending}
        onClick={() => handleMessage(input)}
        type="button"
        className="bg-purple-500 hover:bg-purple-700 disabled:bg-gray-400 disabled:pointer-events-none transition-colors text-white font-bold p-2 rounded-full"
      >
        <ArrowUp />
      </button>
    </div>
  );
};

export default MessageInput;
