"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface ConfigContextType {
  autoSend: boolean;
  setAutoSend: (bool: boolean) => void;
  autoSpeak: boolean;
  setAutoSpeak: (bool: boolean) => void;
  autoListen: boolean;
  setAutoListen: (bool: boolean) => void;
  isText: boolean;
  toggleText: () => void;
}

const ConfigContext = createContext<ConfigContextType>({
  autoSend: false,
  setAutoSend: () => {},
  autoSpeak: false,
  setAutoSpeak: () => {},
  autoListen: false,
  setAutoListen: () => {},
  isText: false,
  toggleText: () => {},
});

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [autoSend, setAutoSend] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [autoListen, setAutoListen] = useState(false);
  const [isText, setIsText] = useState(true);

  return (
    <ConfigContext.Provider
      value={{
        autoSend,
        setAutoSend,
        autoSpeak,
        setAutoSpeak,
        autoListen,
        setAutoListen,
        isText,
        toggleText: () => setIsText(!isText),
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
