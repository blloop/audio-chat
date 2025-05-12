import { Mic, Play } from "lucide-react";
import { useSpeech } from "../utils/speechContext";
import { useMessage } from "../utils/messageContext";
import { cn } from "../utils/cn";

const AudioOnly: React.FC = () => {
  const { listen, listening, setInput } = useSpeech();
  const { setPlaying } = useMessage();

  const audioButton = () => {
    if (listening) {
      setPlaying(-1);
    } else {
      setInput("");
      listen();
    }
  };

  return (
    <>
      <button
        type="button"
        className={cn("size-48 bg-purple-400 transition-colors p-8 rounded-full",
          listening ? "bg-purple-400" : "bg-gray-400 hover:bg-purple-400"
        )}
        onClick={audioButton}
      >
        {listening ? 
          <Mic className="font-thin size-full text-white" /> :
          <Play className="font-thin size-full text-white" />
        }
      </button>
      <p className="text-black">Click to start a conversation!</p>
    </>
  )
}

export default AudioOnly;
