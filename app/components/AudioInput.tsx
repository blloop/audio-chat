import Image from "next/image";
import { useState } from "react";
import { useSpeech } from "../utils/speechContext";
import CircleStop from "../ui/CircleStop.svg";
import Microphone from "../ui/Microphone.svg";
import { cn } from "../utils/cn";

export default function AudioInput({
  setInput,
}: {
  setInput: (input: string) => void;
}) {
  const { listen, listening, supported } = useSpeech();
  const [auto, setAuto] = useState(true);

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
    <div className="flex gap-2 items-center">
      <button
        type="button"
        onClick={audioButton}
        className={cn(
          "bg-gray-300 hover:bg-gray-400 p-2 px-3 rounded-full transition-colors",
          listening && "bg-purple-300 hover:bg-purple-300",
        )}
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
  );
}
