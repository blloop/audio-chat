"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Mars, Speech, Venus } from "lucide-react";
import { useConfig, VoiceType } from "../utils/configContext";
import { useSpeech } from "../utils/speechContext";

const voiceList: VoiceType[] = [
  "Friendly_Person",
  "Calm_Woman",
  "Decent_Boy",
  "Exuberant_Girl",
];

export default function HeaderVoice() {
  const { supported } = useSpeech();
  const { voice, setVoice } = useConfig();
  const [open, setOpen] = useState(false);

  if (!supported) return null;

  const genderIcon = (v: string) => {
    return v.includes("a") ? (
      <Venus className="h-6 inline text-pink-500" />
    ) : (
      <Mars className="h-6 inline text-blue-500" />
    );
  };

  const flagIcon = (v: string) => {
    return (
      <img
        className="size-8"
        src={v.toLowerCase().includes("b") ? "/uk.svg" : "/us.svg"}
      />
    );
  };

  const selectName = (v: VoiceType) => {
    setVoice(v);
    setOpen(false);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="h-full cursor-pointer pl-5 mr-2 bg-gray-300 hover:bg-gray-200 transition-colors border-gray-300 border-2 rounded-full relative flex gap-1 px-2 justify-end items-center"
      >
        {genderIcon(voice)}
        {flagIcon(voice)}
        {open ? (
          <ChevronUp className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </div>
      {open && (
        <div className="flex flex-col z-50 bg-gray-300 border-gray-300 border-2 rounded-lg absolute top-8 mt-1 w-40">
          {voiceList.map((v, i) =>
            v === voice ? (
              <p
                key={i}
                className="relative flex items-center gap-1 pl-5 p-1 bg-gray-200 w-full first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="absolute left-2">&#10003;</span>
                {genderIcon(v)}
                {flagIcon(v)}
              </p>
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => selectName(v)}
                className="flex items-center gap-1 pl-5 p-1 hover:bg-gray-200 transition-colors w-full first:rounded-t-lg last:rounded-b-lg"
              >
                {genderIcon(v)}
                {flagIcon(v)}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
