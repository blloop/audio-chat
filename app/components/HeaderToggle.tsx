"use client";

import { MessagesSquare, Mic } from "lucide-react";
import { cn } from "../utils/cn";
import { useSpeech } from "../utils/speechContext";
import { useConfig } from "../utils/configContext";

export default function HeaderToggle() {
  const { supported } = useSpeech();
  const { isText, toggleText } = useConfig();

  if (!supported) return null;

  return (
    <div
      onClick={() => toggleText()}
      className="cursor-pointer bg-gray-300 hover:bg-gray-200 transition-colors border-gray-300 border-2 rounded-full relative flex w-18 gap-4 px-2 justify-end items-center"
    >
      <MessagesSquare
        className={cn("size-6 z-10", isText && "text-gray-200")}
      />
      <Mic className={cn("size-6 z-10", !isText && "text-gray-200")} />
      <div
        className={cn(
          "rounded-full absolute bg-purple-500 w-10 h-8 transition-[right]",
          isText ? "right-10" : "right-0"
        )}
      />
    </div>
  );
}
