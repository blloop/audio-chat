import HeaderToggle from "./HeaderToggle";
import HeaderVoice from "./HeaderVoice";

export default function Header() {
  return (
    <div className="flex justify-between w-full gap-2 p-4 text-black border-b-2 border-gray-200 bg-gray-100">
      <HeaderVoice />
      <div className="flex gap-2">
        <p className="text-2xl font-semibold text-gray-500">AudioChat</p>
      </div>
      <HeaderToggle />
    </div>
  );
}
