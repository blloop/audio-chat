"use client";

import { createContext, ReactNode, useContext, useState, useMemo } from "react";

export type VoiceType =
  | "Friendly_Person"
  | "Calm_Woman"
  | "Decent_Boy"
  | "Exuberant_Girl";

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
  voice: "Friendly_Person",
  setVoice: () => {},
});

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [autoSend, setAutoSend] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isText, setIsText] = useState(true);
  const [voice, setVoice] = useState<VoiceType>("Friendly_Person");

  const contextValue = useMemo(
    () => ({
      autoSend,
      setAutoSend,
      autoSpeak,
      setAutoSpeak,
      isText,
      toggleText: () => setIsText(!isText),
      voice,
      setVoice: (str: VoiceType) => setVoice(str),
    }),
    [autoSend, autoSpeak, isText, voice]
  );

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
