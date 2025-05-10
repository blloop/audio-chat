import { ArrowUp } from "lucide-react";
import { useSpeech } from "../utils/speechContext";

export default function MessageInput({ handleMessage }: { handleMessage: () => void }) {
  const { listening, input, setInput } = useSpeech();

  return (
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
  )
}