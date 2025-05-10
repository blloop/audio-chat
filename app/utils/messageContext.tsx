"use client";

import React, { createContext, useState, useContext, useMemo } from "react";

export type Message = {
  text: string;
  isUser: boolean;
  isLoading: boolean;
};

interface MessageContextType {
  messages: Message[];
  addMessage: (text: string) => void;
  sending: boolean;
  playing: number;
  setPlaying: (idx: number) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const INIT_PROMPT = "Hello! How can I help you today?";

  const [sending, setSending] = useState(false);
  const [playing, setPlaying] = useState(-1);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: INIT_PROMPT,
      isUser: false,
      isLoading: false,
    },
  ]);

  async function generateText(prompt: string) {
    const response = await fetch("/api/llama3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("ReadableStream not supported in this browser.");
    }

    let result = "";
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      result += decoder.decode(value);
    }

    return result;
  }

  const addMessage = async (text: string) => {
    const userMessage: Message = { text, isUser: true, isLoading: false };
    const tempMessage: Message = { text: "", isUser: false, isLoading: true };
    setSending(true);
    setMessages([...messages, userMessage, tempMessage]);
    const output = await generateText(text);
    const chatMessage: Message = {
      text: output,
      isUser: false,
      isLoading: false,
    };
    setMessages([...messages, userMessage, chatMessage]);
    setSending(false);
  };

  const contextValue = useMemo(
    () => ({ messages, addMessage, sending, playing, setPlaying }),
    [messages, sending, playing],
  );

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};
