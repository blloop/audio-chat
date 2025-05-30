import type { Metadata } from "next";
import "./globals.css";
import { SpeechProvider } from "./utils/speechContext";
import { MessageProvider } from "./utils/messageContext";
import { ConfigProvider } from "./utils/configContext";

export const metadata: Metadata = {
  title: "Audio Chat",
  description: "Configurable LLM audio interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative antialiased mx-auto max-w-xl">
        <ConfigProvider>
          <SpeechProvider>
            <MessageProvider>{children}</MessageProvider>
          </SpeechProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
