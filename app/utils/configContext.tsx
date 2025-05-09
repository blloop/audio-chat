"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface ConfigContextType {
  autoSend: boolean;
  setAutoSend: (bool: boolean) => void;
  autoSpeak: boolean;
  setAutoSpeak: (bool: boolean) => void;
}

const ConfigContext = createContext<ConfigContextType>({
  autoSend: false,
  setAutoSend: () => {},
  autoSpeak: false,
  setAutoSpeak: () => {},
});

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [autoSend, setAutoSend] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  return (
    <ConfigContext.Provider
      value={{
        autoSend,
        setAutoSend,
        autoSpeak,
        setAutoSpeak,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
