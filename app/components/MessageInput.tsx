import { ArrowUp } from "lucide-react";
import { useSpeech } from "../utils/speechContext";
import { useMessage } from "../utils/messageContext";
import { useEffect, useRef } from "react";
import { useConfig } from "../utils/configContext";

interface MessageInputProps {
  handleMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ handleMessage }) => {
  const { sending } = useMessage();
  const { listening, input, setInput } = useSpeech();
  const { isText } = useConfig();
  const promptRef = useRef<() => void>(handleMessage);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          if (
            inputRef.current === document.activeElement &&
            !listening &&
            input.length > 0
          ) {
            promptRef.current();
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
  }, [input.length, listening]);

  useEffect(() => {
    if (!listening && !sending) {
      inputRef.current?.focus();
    }
  }, [listening, sending, isText]);

  useEffect(() => {
    promptRef.current = handleMessage;
  }, [handleMessage]);

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
        onClick={handleMessage}
        type="button"
        className="bg-purple-500 hover:bg-purple-700 disabled:bg-gray-400 disabled:pointer-events-none transition-colors text-white font-bold p-2 rounded-full"
      >
        <ArrowUp />
      </button>
    </div>
  );
};

export default MessageInput;
