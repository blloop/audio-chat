"use client";

import { useEffect, useState } from "react";
import { Mic, Play, Square } from "lucide-react";
import Image from "next/image";
import { cn } from "../utils/cn";
import { useSpeech } from "../utils/speechContext";
import { useMessage } from "../utils/messageContext";
import { useConfig } from "../utils/configContext";

const stateText = {
  init: "Click to start a conversation!",
  listening: "Listening...",
  loading: "Loading, please wait...",
  speaking: "Speaking...",
};

const AudioOnly: React.FC = () => {
  const { transcript, listen, listening, setInput, stop } = useSpeech();
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
    console.log("mainButton called");
    if (messages.length === 1) {
      console.log("chain 1");
      setPlaying(playing === 0 ? -1 : 0);
      console.log("setPlaying", playing);
    } else if (playing !== -1) {
      console.log("chain 2");
      stop();
      setPlaying(-1);
      setCurrState("init");
    } else {
      console.log("chain 3");
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
    <div
      className={cn(
        "flex flex-col flex-1 gap-4 items-center justify-center",
        isText && "hidden"
      )}
    >
      <button
        type="button"
        className={cn(
          "size-48 bg-purple-400 transition-colors p-8 rounded-full",
          listening || (currState === "loading" && "pointer-events-none"),
          listening ? "bg-purple-400" : "bg-zinc-300 hover:bg-purple-400"
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
