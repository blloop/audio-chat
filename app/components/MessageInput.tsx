import { ArrowUp } from "lucide-react";
import { useSpeech } from "../utils/speechContext";
import { useMessage } from "../utils/messageContext";

interface MessageInputProps {
  handleMessage: () => void
}

const MessageInput: React.FC<MessageInputProps> = ({ handleMessage }) => {
  const { sending } = useMessage();
  const { listening, input, setInput } = useSpeech();

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder={
          listening ? "Recording..." : "Type your input here..."
        }
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
}

export default MessageInput;
