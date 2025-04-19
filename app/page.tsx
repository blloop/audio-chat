import ChatMessage from "./components/ChatMessage";

// https://replicate.com/jaaari/kokoro-82m
// https://replicate.com/meta/meta-llama-3-8b-instruct

export default function Home() {
  return (
    <div className="flex flex-col h-screen rounded-3xl mx-auto max-w-xl bg-gray-100">
      {/* Message list area */}
      <div className="flex flex-col flex-grow overflow-y-auto p-4 space-y-4">
        <ChatMessage
          message="Hello! How can I help you today? Hello! How can I help you today? Hello! How can I help you today? Hello! How can I help you today? Hello! How can I help you today?"
          fromUser={false}
        />
        <ChatMessage
          message="I need help with my account. Hello! How can I help you today? Hello! How can I help you today? Hello! How can I help you today?"
          fromUser={true}
        />
      </div>

      {/* Bottom input area */}
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-3xl">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Start
        </button>
      </div>
    </div>
  );
}
