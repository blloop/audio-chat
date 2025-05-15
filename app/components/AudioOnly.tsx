import { Mic, Play, Square } from "lucide-react";
import { useSpeech } from "../utils/speechContext";
import { useMessage } from "../utils/messageContext";
import { cn } from "../utils/cn";
import { useEffect, useState } from "react";
import { useConfig } from "../utils/configContext";
import Image from "next/image";

const stateText = {
  init: "Click to start a conversation!",
  listening: "Listening...",
  loading: "Loading, please wait...",
  speaking: "Speaking...",
};

const AudioOnly: React.FC = () => {
  const { transcript, listen, listening, setInput } = useSpeech();
  const { messages, playing, setPlaying } = useMessage();
  const { autoSend, isText } = useConfig();
  const [currState, setCurrState] = useState<keyof typeof stateText>("init");

  useEffect(() => {
    if (playing !== -1) {
      setCurrState("speaking");
    } else if (isText) {
      setCurrState("init");
    }
  }, [playing]);

  useEffect(() => {
    if (!listening) {
      if ((!isText || autoSend) && !listening && transcript) {
        setCurrState("loading");
      } else {
        setCurrState("init");
      }
    } else {
      setCurrState("listening");
    }
  }, [listening]);

  const mainButton = () => {
    if (messages.length === 1) {
      setPlaying(0);
    } else if (playing !== -1) {
      // TODO: Fix audio not stopping issue
      // call stop() from useSpeech() here
      setPlaying(-1);
      setCurrState("init");
    } else {
      setInput("");
      listen();
      setCurrState("listening");
    }
  };

  const logoClass = "font-thin size-full text-white";

  const renderLogo = () => {
    switch (currState) {
      case "init":
        return <Play className={logoClass} />;
      case "listening":
        return <Mic className={logoClass} />;
      case "speaking":
        return <Square className={logoClass} />;
      default:
        return (
          <Image
            className="fill-white size-full object-cover"
            width={240}
            height={96}
            alt="Response is loading."
            src="/loading.svg"
          />
        );
    }
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "size-48 bg-purple-400 transition-colors p-8 rounded-full",
          listening || (currState === "loading" && "pointer-events-none"),
          listening
            ? "bg-purple-400 pointer-events-none"
            : "bg-zinc-300 hover:bg-purple-400",
        )}
        onClick={mainButton}
      >
        {renderLogo()}
      </button>
      <p className="text-black">{stateText[currState]}</p>
    </>
  );
};

export default AudioOnly;
