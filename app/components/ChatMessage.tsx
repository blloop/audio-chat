import React, { memo, useEffect, useState, useRef, useMemo } from "react";
import { Ellipsis, StopCircle, Check, Copy, Volume2 } from "lucide-react";
import Image from "next/image";
import { cn } from "../utils/cn";
import { Message, useMessage } from "../utils/messageContext";
import { useConfig } from "../utils/configContext";
import { useSpeech } from "../utils/speechContext";

const specialText: { [key: string]: string | null } = {
  normal: null,
  init: "Hello! How can I help you today?",
  limit:
    "You've reached your usage limit for this demo. Please try again later.",
  fetch: "There was an error reaching the server. Please try again later.",
};

interface ChatMessageProps {
  index: number;
  message: Message;
  latest: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  index,
  message,
  latest,
}) => {
  const alignment = message.isUser ? "self-end" : "self-start";
  const roundLarge = message.isUser
    ? "-right-2 rounded-bl-xl"
    : "-left-2 rounded-br-xl";
  const roundSmall = message.isUser
    ? "-right-4 rounded-bl-xl"
    : "-left-4 rounded-br-xl";
  const bgColor = message.isUser ? "bg-purple-500" : "bg-gray-200";
  const textColor = message.isUser ? "text-white" : "text-black";
  const shadowColor = message.isUser
    ? "[box-shadow:-0.25rem_0.25rem_0.25rem_theme(colors.gray.300)]"
    : "[box-shadow:0.25rem_0.25rem_0.25rem_theme(colors.gray.300)]";
  const { stop } = useSpeech();
  const { isText, autoSpeak, voice } = useConfig();
  const { playing, setPlaying } = useMessage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [fetching, setFetching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const memoizedProgress = useMemo(() => progress, [progress]);

  const playAudio = async () => {
    if (audioRef.current) {
      // Play cached audio
      startAudio();
    } else if (message.type !== "normal") {
      // Play hard-coded
      if (!audioRef.current) {
        audioRef.current = new Audio(`/${voice}_${message.type}.wav`);
      }
      startAudio();
    } else {
      // Fetch new audio
      setFetching(true);
      try {
        const response = await fetch("/api/minimax", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: message.text, voice }),
        });

        if (!response.ok) {
          let errorDetails = `API request failed with status ${response.status}`;
          try {
            const errorData = await response.json();
            errorDetails = errorData.details || errorData.error || errorDetails;
          } catch {
            errorDetails = response.statusText || errorDetails;
          }
          throw new Error(`Speech API Error: ${errorDetails}`);
        }

        const audioBlob = await response.blob();
        const newAudioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(newAudioUrl);
        audioRef.current = audio;
        startAudio();
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
      setFetching(false);
    }
  };

  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((playError) => {
        console.error("Error playing audio:", playError);
        URL.revokeObjectURL(audioRef.current?.src ?? "");
        setPlaying(-1);
      });
      audioRef.current.onended = () => {
        setPlaying(-1);
        setProgress(0);
      };
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          const percentage =
            (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(percentage);
        }
      };
    }
    setPlaying(index);
  };

  const stopAudio = () => {
    if (playing === index) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlaying(-1);
    } else {
      playAudio();
    }
  };

  useEffect(() => {
    stop();
    if (playing === index) {
      playAudio();
    }
    if (playing !== index && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
  }, [playing]);

  useEffect(() => {
    if (
      (!isText || autoSpeak) &&
      latest &&
      !message.isUser &&
      !message.isLoading
    ) {
      playAudio();
    }
  }, [message, latest]);

  return (
    <div
      className={cn(
        "relative group flex items-end",
        alignment,
        message.isUser ? "mb-4" : "mb-8"
      )}
    >
      <span
        className={cn(
          "p-3 z-20 rounded-3xl max-w-[min(100vw,22rem)]",
          bgColor,
          textColor,
          shadowColor
        )}
      >
        {message.isLoading ? (
          <Image
            className="w-10 h-4 px-1 object-cover"
            width={240}
            height={96}
            alt="Message is loading."
            src="/loading.svg"
          />
        ) : (
          specialText[message.type] || message.text
        )}
      </span>
      <div
        className={cn(
          "absolute z-10 bottom-0 w-4 h-6",
          alignment,
          bgColor,
          roundLarge
        )}
      ></div>
      <div
        className={cn(
          "absolute z-10 bottom-0 w-4 h-6 bg-white",
          alignment,
          roundSmall
        )}
      ></div>
      {!message.isUser && !message.isLoading && (
        <progress
          className="absolute -bottom-8 left-8 w-[calc(100%-4rem)] h-7 py-2.5"
          value={memoizedProgress}
          max="100"
        ></progress>
      )}
      {!message.isUser && !message.isLoading && (
        <button
          className={cn(
            "absolute -bottom-8 left-0 p-1 rounded-full hover:bg-purple-200 transition-colors"
          )}
          type="button"
          onClick={stopAudio}
        >
          {playing === index ? (
            <StopCircle className="text-red-500 h-5 w-5" />
          ) : fetching ? (
            <Ellipsis className="text-purple-500 h-5 w-5" />
          ) : (
            <Volume2 className="text-purple-500 h-5 w-5" />
          )}
        </button>
      )}
      {!message.isUser && (
        <button
          className={cn(
            "relative -right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-purple-200 transition-all",
            copied && "opacity-100 pointer-events-none transition-all"
          )}
          onClick={() => {
            navigator.clipboard.writeText(message.text);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        >
          {copied ? (
            <Check className="text-green-500 h-5 w-5" />
          ) : (
            <Copy className="text-purple-500 h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
};

const MemoizedChatMessage = memo(ChatMessage);

export default MemoizedChatMessage;
