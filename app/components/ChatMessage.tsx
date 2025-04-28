import React, { useState } from "react";
import { cn } from "../utils/cn";
import { AudioLines, Ellipsis, Volume2Icon } from "lucide-react";

interface ChatMessageProps {
  message: string;
  fromUser: boolean;
}

const kokoroSpeak = async (
  message: string,
  setIndex: (index: number) => void,
) => {
  if (message && message.length > 0) {
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
        // Get the detailed error if available
        let errorDetails = `API request failed with status ${response.status}`;
        try {
          const errorData = await response.json(); // Try parsing JSON error response
          errorDetails = errorData.details || errorData.error || errorDetails;
        } catch (e) {
          // If response is not JSON, use the status text
          errorDetails = response.statusText || errorDetails;
        }
        setIndex(0);
        throw new Error(`Speech API Error: ${errorDetails}`);
      }

      // Get the audio data as a Blob
      const audioBlob = await response.blob();

      // Create an object URL from the Blob
      const audioUrl = URL.createObjectURL(audioBlob);

      // Indicate that the audio is playing
      setIndex(2);

      // Create an Audio object and play it
      const audio = new Audio(audioUrl);
      audio.play().catch((playError) => {
        console.error("Error playing audio:", playError);
        URL.revokeObjectURL(audioUrl);
        setIndex(0);
      });

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setIndex(0);
      };
    } catch (error) {
      setIndex(0);
      console.error("Error fetching or playing speech:", error);
    }
  }
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, fromUser }) => {
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

  return (
    <div
      className={cn(
        "flex flex-col relative p-3 rounded-3xl max-w-xs",
        alignment,
        bgColor,
        textColor,
      )}
    >
      <span className="z-20 break-all">{message}</span>
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
      {!fromUser && (
        <button
          className={cn(
            "absolute p-2 rounded-full -right-10 bottom-1 hover:bg-purple-200 transition-colors",
            index > 0 ? "pointer-events-none" : "",
          )}
          type="button"
          onClick={() => kokoroSpeak(message, (idx: number) => setIndex(idx))}
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

export default ChatMessage;
