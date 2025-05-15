import { AudioLines, AudioWaveform, ChevronDown, ChevronUp, Mars, Venus } from "lucide-react";
import { useSpeech } from "../utils/speechContext";
import { useState } from "react";
import { useConfig } from "../utils/configContext";

const voiceList = ["af_bella", "af_jessica", "am_fenrir", "am_michael"];

export default function HeaderVoice() {
  const { supported } = useSpeech();
  const { voice, setVoice } = useConfig();
  const [open, setOpen] = useState(false);

  if (!supported) {
    return (
      <div className="w-20" />
    )
  }

  const genderIcon = (v: string) => {
    return (
      v.includes("af") ? 
        <Venus className="h-6 inline text-pink-500" /> :
        <Mars className="h-6 inline text-blue-500" />
    )
  }

  const renderName = (v: string) => {
    return `${v.split("_")[1].slice(0, 1).toUpperCase()}${v.split("_")[1].slice(1)}`
  }

  const selectName = (v: string) => {
    setVoice(v as any);
    setOpen(false);
  }

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer pl-5 bg-gray-300 hover:bg-gray-200 transition-colors border-gray-300 border-2 rounded-full relative flex gap-1 px-2 justify-end items-center"
      >
        {genderIcon(voice)}
        <AudioLines className="w-4" />
        {open ?
          <ChevronUp className="size-4" /> :
          <ChevronDown className="size-4" />
        }
      </div>
      {
        open && 
        <div className="flex flex-col z-50 bg-gray-300 border-gray-300 border-2 rounded-lg absolute top-8 w-40">
          {voiceList.map(v =>
            v === voice ?
            <p className="relative flex items-center gap-1 pl-5 p-1 bg-gray-200 w-full first:rounded-t-lg last:rounded-b-lg">
              <span className="absolute left-2">&#10003;</span>
              {genderIcon(v)}
              {renderName(v)}
            </p>
            :
            <button type="button" onClick={() => selectName(v)} className="flex items-center gap-1 pl-5 p-1 hover:bg-gray-200 transition-colors w-full first:rounded-t-lg last:rounded-b-lg">
              {genderIcon(v)}
              {renderName(v)}
            </button>
          )}
        </div>
      }
    </div>
  )
}
