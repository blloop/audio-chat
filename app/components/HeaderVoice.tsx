"use client";

import { Mars, Shuffle, Venus } from "lucide-react";
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

  if (!supported) return null;
  
  const toggleGender = () => {
    const currVoice = voiceList.indexOf(voice);
    setVoice(voiceList[currVoice + (currVoice % 2 === 0 ? 1 : -1)]);
  }

  const toggleLocale = () => {
    const currVoice = voiceList.indexOf(voice);
    setVoice(voiceList[currVoice + (currVoice < 2 ? 2 : -2)]);
  }

  return (
    <div className="flex gap-2">
      <div
        onClick={() => toggleGender()}
        className="h-full cursor-pointer bg-gray-300 hover:bg-gray-200 transition-colors border-gray-300 border-2 rounded-full flex gap-1 px-2 items-center"
      >
        {voice.includes("a") ? (
          <Venus className="h-6 inline text-pink-500" />
        ) : (
          <Mars className="h-6 inline text-blue-500" />
        )}
        <Shuffle className="size-4" />
      </div>
      <div
        onClick={() => toggleLocale()}
        className="h-full cursor-pointer bg-gray-300 hover:bg-gray-200 transition-colors border-gray-300 border-2 rounded-full flex gap-1 px-2 items-center"
      >
        <img
          className="size-6"
          src={voice.toLowerCase().includes("b") ? "/uk.svg" : "/us.svg"}
        />
        <Shuffle className="size-4" />
      </div>
    </div>
  );
}
