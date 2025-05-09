"use client";

import SpeechRecognition, {
  useSpeechRecognition,
// @ts-ignore
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
});

const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
};

export const SpeechProvider = ({ children }: { children: ReactNode }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [input, setInput] = useState("");

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
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
