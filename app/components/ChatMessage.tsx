import React from "react";
import { cn } from "../utils/cn";

interface ChatMessageProps {
  message: string;
  fromUser: boolean;
}

const kokoroSpeak = async (message: string) => {
  if (message && message.length > 0) {
    const inputParams = {
      text: message,
    };
    try {
      const response = await fetch("/api/kokoro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputParams),
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
        throw new Error(`Speech API Error: ${errorDetails}`);
      }

      // Get the audio data as a Blob
      const audioBlob = await response.blob();

      // Create an object URL from the Blob
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create an Audio object and play it
      const audio = new Audio(audioUrl);
      audio.play().catch((playError) => {
        console.error("Error playing audio:", playError);
        URL.revokeObjectURL(audioUrl);
      });

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
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

  return (
    <div
      className={cn(
        "relative p-3 rounded-3xl max-w-xs",
        alignment,
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
      <button type="button" onClick={() => kokoroSpeak(message)}>PLAY</button>
    </div>
  );
};

export default ChatMessage;
