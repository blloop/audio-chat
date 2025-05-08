import React, { memo, useState } from "react";
import { cn } from "../utils/cn";
import { AudioLines, Ellipsis, Volume2Icon } from "lucide-react";

interface ChatMessageProps {
  message: string;
  fromUser: boolean;
  audioPath: string | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  fromUser,
  audioPath,
}) => {
  const alignment = fromUser ? "self-end" : "self-start";
  const roundLarge = fromUser
    ? "-right-2 rounded-bl-xl"
    : "-left-2 rounded-br-xl";
  const roundSmall = fromUser
    ? "-right-4 rounded-bl-xl"
    : "-left-4 rounded-br-xl";
  const bgColor = fromUser ? "bg-purple-500" : "bg-gray-200";
  const textColor = fromUser ? "text-white" : "text-black";

  // Index state: 0 = Base, 1 = Loading, 2 = Playing
  const [index, setIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(audioPath);

  const playAudio = async () => {
    if (message && message.length > 0) {
      if (audioUrl) {
        // Play cached fetched audio
        setIndex(2);
        const audio = new Audio(audioUrl);
        audio.play().catch((playError) => {
          console.error("Error playing cached fetched audio:", playError);
          setIndex(0);
        });
        audio.onended = () => {
          setIndex(0);
        };
      } else {
        // Fetch new audio
        setIndex(1);
        try {
          const response = await fetch("/api/kokoro", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: message }),
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
            setIndex(0);
            throw new Error(`Speech API Error: ${errorDetails}`);
          }

          const audioBlob = await response.blob();
          const newAudioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(newAudioUrl);

          setIndex(2);
          const audio = new Audio(newAudioUrl);
          audio.play().catch((playError) => {
            console.error("Error playing fetched audio:", playError);
            URL.revokeObjectURL(newAudioUrl);
            setAudioUrl(null);
            setIndex(0);
          });

          audio.onended = () => {
            setIndex(0);
          };
        } catch (error) {
          setIndex(0);
          console.error("Error fetching or playing speech:", error);
        }
      }
    }
  };

  return (
    <div className={cn("flex flex-wrap", alignment)}>
      <div
        className={cn(
          "relative flex flex-col relative p-3 rounded-3xl max-w-xs",
          bgColor,
          textColor,
        )}
      >
        <span className="z-20">{message}</span>
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
      {!fromUser && (
        <button
          className={cn(
            "self-end p-2 rounded-full hover:bg-purple-200 transition-colors",
            index > 0 ? "pointer-events-none" : "",
          )}
          type="button"
          onClick={playAudio}
        >
          {index === 1 ? (
            <Ellipsis className="text-purple-500" />
          ) : index === 2 ? (
            <Volume2Icon className="text-purple-500" />
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
