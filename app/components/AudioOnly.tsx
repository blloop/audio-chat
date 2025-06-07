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

const logoClass = "font-thin size-full text-white";

const AudioOnly: React.FC = () => {
  const { transcript, listen, listening, setInput, stop } = useSpeech();
  const { playing, setPlaying } = useMessage();
  const { isText } = useConfig();
  const [currState, setCurrState] = useState<keyof typeof stateText>("init");

  useEffect(() => {
    console.log("updating state! listening:", listening, "playing:", playing)
    if (listening) {
      setCurrState("listening")
    } else if (playing === -1) {
      setCurrState("init");
    } else {
      setCurrState("speaking");
    }
  }, [listening, playing]);

  useEffect(() => {
    if (!listening && transcript) {
      setCurrState("loading");
    }
  }, []);

  // Automatically switch to listening when message is done playing
  useEffect(() => {
    if (!isText && playing === -1) {
      setInput("");
      listen();
    }
  }, [playing]);

  // useEffect(() => {
  //   if (!listening) {
  //     if ((!isText || autoSend) && !listening && transcript) {
  //       setCurrState("loading");
  //     } else {
  //       setCurrState("init");
  //     }
  //   } else {
  //     setCurrState("listening");
  //   }
  // }, [listening]);

  const mainButton = () => {
    if (listening) {
      stop();
    } else if (playing === -1) {
      console.log("chain 3");
      setInput("");
      listen();
      setCurrState("listening");
    } else {
      console.log("chain 2");
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
          currState === "loading" && "pointer-events-none",
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
