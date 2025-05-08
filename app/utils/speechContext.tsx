"use client";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { createContext, ReactNode, useContext, useState } from "react";

interface SpeechContextType {
  transcript: string;
  listening: boolean;
  reset: any;
  listen: () => void;
  stop: () => void;
  speak: (text: string) => void;
  supported: boolean;
  input: string;
  setInput: (text: string) => void;
  auto: boolean;
  setAuto: (bool: boolean) => void;
}

const SpeechContext = createContext<SpeechContextType>({
  transcript: "",
  listening: false,
  reset: () => {},
  listen: () => {},
  stop: () => {},
  speak: () => {},
  supported: false,
  input: "",
  setInput: () => {},
  auto: false,
  setAuto: () => {},
});

export const SpeechProvider = ({ children }: { children: ReactNode }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [input, setInput] = useState("");
  const [auto, setAuto] = useState(false);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <SpeechContext.Provider
      value={{
        transcript,
        listening,
        reset: resetTranscript,
        listen: SpeechRecognition.startListening,
        stop: SpeechRecognition.stopListening,
        speak,
        supported: browserSupportsSpeechRecognition,
        input,
        setInput,
        auto,
        setAuto,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
