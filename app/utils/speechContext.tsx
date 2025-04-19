"use client";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { createContext, ReactNode, useContext } from "react";

interface SpeechContextType {
  transcript: string;
  listening: boolean;
  reset: any;
  listen: () => void;
  stop: () => void;
  speak: (text: string) => void;
  supported: boolean;
}

const SpeechContext = createContext<SpeechContextType>({
  transcript: "",
  listening: false,
  reset: () => {},
  listen: () => {},
  stop: () => {},
  speak: () => {},
  supported: false,
});

export const SpeechProvider = ({ children }: { children: ReactNode }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

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
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
