"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export type VoiceType = "af_bella" | "af_jessica" | "am_fenrir" | "am_michael";

interface ConfigContextType {
  autoSend: boolean;
  setAutoSend: (bool: boolean) => void;
  autoSpeak: boolean;
  setAutoSpeak: (bool: boolean) => void;
  isText: boolean;
  toggleText: () => void;
  voice: VoiceType;
  setVoice: (str: VoiceType) => void;
}

const ConfigContext = createContext<ConfigContextType>({
  autoSend: false,
  setAutoSend: () => {},
  autoSpeak: false,
  setAutoSpeak: () => {},
  isText: false,
  toggleText: () => {},
  voice: "af_bella",
  setVoice: () => {},
});

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [autoSend, setAutoSend] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isText, setIsText] = useState(true);
  const [voice, setVoice] = useState<VoiceType>("af_bella");

  return (
    <ConfigContext.Provider
      value={{
        autoSend,
        setAutoSend,
        autoSpeak,
        setAutoSpeak,
        isText,
        toggleText: () => setIsText(!isText),
        voice,
        setVoice: (str: VoiceType) => setVoice(str),
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
