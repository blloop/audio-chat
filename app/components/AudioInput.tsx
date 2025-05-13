import { useSpeech } from "../utils/speechContext";
import { cn } from "../utils/cn";
import { CircleStop, Mic } from "lucide-react";
import { useConfig } from "../utils/configContext";

const AudioInput: React.FC = () => {
  const { listen, listening, supported, setInput } = useSpeech();
  const { autoSend, setAutoSend, autoSpeak, setAutoSpeak, autoListen, setAutoListen } = useConfig();

  if (!supported) {
    return (
      <p className="bg-gray-800 px-4 py-2 rounded-xl">
        Your browser does not support speech recognition
      </p>
    );
  }

  const audioButton = () => {
    if (listening) {
      stop();
    } else {
      setInput("");
      listen();
    }
  };

  return (
    <div className="flex flex-row-reverse flex-wrap gap-4 items-center justify-between">
      <div className="px-2 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <input
            id="autoListen"
            type="checkbox"
            className="scale-[1.5]"
            checked={autoListen}
            onChange={(e) => setAutoListen(e.target.checked)}
          />
          <label className="text-black" htmlFor="autoListen">
            Auto Listen
          </label>
        </div>
        <div className="flex gap-2">
          <input
            id="autoSend"
            type="checkbox"
            className="scale-[1.5]"
            checked={autoSend}
            onChange={(e) => setAutoSend(e.target.checked)}
          />
          <label className="text-black" htmlFor="autoSend">
            Auto Send
          </label>
        </div>
        <div className="flex gap-2">
          <input
            id="autoPlay"
            type="checkbox"
            className="scale-[1.5]"
            checked={autoSpeak}
            onChange={(e) => setAutoSpeak(e.target.checked)}
          />
          <label className="text-black" htmlFor="autoPlay">
            Autoplay
          </label>
        </div>
      </div>
      <button
        type="button"
        onClick={audioButton}
        className={cn(
          "flex shrink-0 text-black bg-gray-300 hover:bg-gray-400 p-2 px-3 rounded-full transition-colors",
          listening && "bg-purple-300 hover:bg-purple-300",
        )}
      >
        {listening ? <CircleStop /> : <Mic />}
        <span className="text-black ml-2">Mic Input</span>
      </button>
    </div>
  );
};

export default AudioInput;
