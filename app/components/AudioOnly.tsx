"use client";

import { useEffect, useState } from "react";
import { Mic, Play, Square } from "lucide-react";
import Image from "next/image";
import { cn } from "../utils/cn";
import { useSpeech } from "../utils/speechContext";
import { useMessage } from "../utils/messageContext";
import { useConfig } from "../utils/configContext";

const stateText = {
  init: "Click to begin a conversation!",
  resume: "Click to resume your conversation!",
  listening: "Listening...",
  loading: "Loading, please wait...",
  speaking: "Speaking...",
};

const logoClass = "font-thin size-full text-white";

const AudioOnly: React.FC = () => {
  const { transcript, listen, listening, setInput, stop } = useSpeech();
  const { messages, playing, setPlaying } = useMessage();
  const { isText, autoSpeak } = useConfig();
  const [currState, setCurrState] = useState<keyof typeof stateText>("init");

  // Update state when speaking starts/stops
  useEffect(() => {
    if (playing !== -1) {
      setCurrState("speaking");
    } else if (!isText) {
      // Automatically listen when audio stops
      setInput("");
      listen();
    } else {
      setCurrState("init");
    }
  }, [playing]);

  // Update state when listening starts/stops
  useEffect(() => {
    if (listening) {
      setCurrState("listening");
    } else if ((!isText || autoSpeak) && transcript) {
      setCurrState("loading");
    } else {
      setCurrState("init");
    }
  }, [listening]);

  // Handle main button interface
  const mainButton = () => {
    if (listening) {
      stop();
    } else if (playing === -1) {
      // Play last message
      setPlaying(messages.length - 1);
      setCurrState("speaking");
    } else {
      // Stop conversation in all other cases
      setPlaying(-1);
      setCurrState("init");
    }
  };

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
    <div
      className={cn(
        "flex flex-col flex-1 gap-4 items-center justify-center",
        isText && "hidden"
      )}
    >
      <button
        type="button"
        className={cn(
          "size-48 bg-purple-400 transition-colors p-8 rounded-full bg-zinc-300 hover:bg-purple-400",
          currState === "loading" && "pointer-events-none"
        )}
        onClick={mainButton}
      >
        {renderLogo()}
      </button>
      <p className="text-black">{stateText[currState]}</p>
    </div>
  );
};

export default AudioOnly;
