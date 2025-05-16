"use client";

import { cn } from "../utils/cn";
import { useConfig } from "../utils/configContext";
import AudioInput from "./AudioInput";
import MessageInput from "./MessageInput";

export default function InputArea() {
  const { isText } = useConfig();

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 border-t border-gray-200 bg-gray-100",
        !isText && "hidden",
      )}
    >
      <MessageInput />
      <AudioInput />
    </div>
  );
}
