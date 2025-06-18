"use client";

import React, { createContext, useState, useContext, useMemo } from "react";

export type Message = {
  text: string;
  isUser: boolean;
  isLoading: boolean;
  type: "normal" | "init" | "limit" | "fetch";
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
  const [sending, setSending] = useState(false);
  const [playing, setPlaying] = useState(-1);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "",
      isUser: false,
      isLoading: false,
      type: "init",
    },
  ]);

  const generateText = async (
    prompt: string,
    history: Message[]
  ): Promise<Message> => {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, history }),
    });

    if (!response.ok) {
      return {
        text: "",
        isUser: false,
        isLoading: false,
        type: response.status === 429 ? "limit" : "fetch",
      };
      // throw new Error(`HTTP error! status: ${response.status}`);
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

    return {
      text: result,
      isUser: false,
      isLoading: false,
      type: "normal",
    };
  };

  const addMessage = async (text: string) => {
    const userMessage: Message = {
      text,
      isUser: true,
      isLoading: false,
      type: "normal",
    };
    const tempMessage: Message = {
      text: "",
      isUser: false,
      isLoading: true,
      type: "normal",
    };
    setSending(true);
    setMessages([...messages, userMessage, tempMessage]);

    const chatMessage = await generateText(text, messages.slice(-4));
    setSending(false);
    setMessages([...messages, userMessage, chatMessage]);
  };

  const contextValue = useMemo(
    () => ({ messages, addMessage, sending, playing, setPlaying }),
    [messages, sending, playing]
  );

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};
