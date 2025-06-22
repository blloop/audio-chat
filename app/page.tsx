import AudioOnly from "./components/AudioOnly";
import ChatList from "./components/ChatList";
import InputArea from "./components/InputArea";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="relative flex flex-col h-screen font-sans bg-white mx-auto max-w-xl">
      <Header />
      <ChatList />
      <InputArea />
      <AudioOnly />
    </div>
  );
}
