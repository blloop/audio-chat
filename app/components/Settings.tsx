"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Mars, Settings, Shuffle, Venus, X } from "lucide-react";
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
  };

  const toggleLocale = () => {
    const currVoice = voiceList.indexOf(voice);
    setVoice(voiceList[currVoice + (currVoice < 2 ? 2 : -2)]);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="hover:bg-gray-300 transition-colors rounded-full px-2 py-1 mr-12">
        <Settings className="text-gray-700" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed z-50 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[320px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 focus:outline-none text-gray-700">
          <Dialog.Title className="m-0 text-lg font-bold">
            Settings
          </Dialog.Title>
          <Dialog.Description></Dialog.Description>
          <Dialog.Close asChild>
            <button className="text-gray-700 hover:bg-gray-300 rounded-full absolute top-[1rem] right-[1rem] inline-flex h-[1.5rem] w-[1.5rem] appearance-none items-center justify-center rounded-full focus:outline-none">
              <X />
            </button>
          </Dialog.Close>
          <button
            type="button"
            onClick={() => toggleGender()}
            className="bg-gray-300 hover:bg-gray-200 transition-colors border-gray-300 border-2 rounded-full flex gap-1 px-2 items-center"
          >
            {voice.includes("a") ? (
              <Venus className="h-6 inline text-pink-500" />
            ) : (
              <Mars className="h-6 inline text-blue-500" />
            )}
            <Shuffle className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleLocale()}
            className="bg-gray-300 hover:bg-gray-200 transition-colors border-gray-300 border-2 rounded-full flex gap-1 px-2 items-center"
          >
            <img
              className="size-6"
              src={voice.toLowerCase().includes("b") ? "/uk.svg" : "/us.svg"}
            />
            <Shuffle className="size-4" />
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
