"use client";

import React, { createContext, useState, useContext, useMemo } from 'react';

interface MessageContextType {
  messages: string[];
  addMessage: (message: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const INIT_PROMPT = "Hello! How can I help you today?";
  const [messages, setMessages] = useState<string[]>([INIT_PROMPT]);

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

  const addMessage = async (message: string) => {
    setMessages([...messages, message]);
    const output = await generateText(message);
    setMessages([...messages, message, output]);
  };

  const contextValue = useMemo(() => ({ messages, addMessage }), [messages, addMessage]);

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};
