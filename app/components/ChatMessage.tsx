import React, { memo, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AudioLines, StopCircle } from "lucide-react";
import { cn } from "../utils/cn";
import { Message, useMessage } from "../utils/messageContext";
import { useConfig } from "../utils/configContext";

interface ChatMessageProps {
  message: Message;
  index: number;
  latest: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, index, latest }) => {
  const alignment = message.isUser ? "self-end" : "self-start";
  const roundLarge = message.isUser
    ? "-right-2 rounded-bl-xl"
    : "-left-2 rounded-br-xl";
  const roundSmall = message.isUser
    ? "-right-4 rounded-bl-xl"
    : "-left-4 rounded-br-xl";
  const bgColor = message.isUser ? "bg-purple-500" : "bg-gray-200";
  const textColor = message.isUser ? "text-white" : "text-black";
  const AUDIO_PATH = index === 0 ? "/initial_message.wav" : null

  const { autoSpeak } = useConfig();
  const { playing, setPlaying } = useMessage();
  const [audioUrl, setAudioUrl] = useState<string | null>(AUDIO_PATH);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [fetching, setFetching] = useState(false);

  const playAudio = async () => {
    if (message && !message.isLoading && message.text.length > 0) {
      if (audioUrl) {
        // Play cached audio
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        startAudio();
      } else {
        // Fetch new audio
        setFetching(true);
        try {
          const response = await fetch("/api/kokoro", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: message.text }),
          });

          if (!response.ok) {
            let errorDetails = `API request failed with status ${response.status}`;
            try {
              const errorData = await response.json();
              errorDetails =
                errorData.details || errorData.error || errorDetails;
            } catch (e) {
              errorDetails = response.statusText || errorDetails;
            }
            throw new Error(`Speech API Error: ${errorDetails}`);
          }

          const audioBlob = await response.blob();
          const newAudioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(newAudioUrl);
          setFetching(false);

          const audio = new Audio(newAudioUrl);
          audioRef.current = audio;
          startAudio();
        } catch (error) {
          console.error("Error fetching or playing speech:", error);
          setFetching(false);
        }
      }
    }
  };

  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((playError) => {
        console.error("Error playing audio:", playError);
        URL.revokeObjectURL(audioUrl ?? "");
        setAudioUrl(null);
        setPlaying(-1);
      });
      audioRef.current.onended = () => {
        setPlaying(-1);
      };
    }
    setPlaying(index);
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  useEffect(() => {
    if (playing !== index && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [playing]);

  useEffect(() => {
    if (!message.isUser && !message.isLoading && message.text && latest && autoSpeak) {
      playAudio();
    }
  }, [message, latest])

  return (
    <div className={cn("flex flex-wrap", alignment)}>
      <div
        className={cn(
          "relative flex flex-col relative p-3 rounded-3xl max-w-xs",
          bgColor,
          textColor,
        )}
      >
        <span className="z-20">
          {message.isLoading ? (
            <Image
              className="w-10 h-4 px-1 object-cover"
              width={180}
              height={10}
              alt="Message is loading."
              src="/loading.svg"
            />
          ) : (
            message.text
          )}
        </span>
        <div
          className={cn(
            "absolute z-10 bottom-0 w-4 h-6",
            alignment,
            bgColor,
            roundLarge,
          )}
        ></div>
        <div
          className={cn(
            "absolute z-10 bottom-0 w-4 h-6 bg-white",
            alignment,
            roundSmall,
          )}
        ></div>
      </div>
      {!message.isUser && !message.isLoading && (
        <button
          className={cn(
            "self-end p-2 rounded-full hover:bg-purple-200 transition-colors",
          )}
          type="button"
          onClick={() => {
            if (playing === index) {
              stopAudio();
              setPlaying(-1);
            } else {
              playAudio();
            }
          }}
        >
          {playing === index ? (
            <StopCircle className="text-red-500" />
          ) : fetching ? (
            <Ellipsis className="text-purple-500" />
          ) : (
            <AudioLines className="text-purple-500" />
          )}
        </button>
      )}
    </div>
  );
};

const MemoizedChatMessage = memo(ChatMessage);

export default MemoizedChatMessage;
