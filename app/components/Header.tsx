import HeaderToggle from "./HeaderToggle";
import HeaderVoice from "./HeaderVoice";

export default function Header() {
  return (
    <div className="absolute top-0 bg-[#0001] flex flex-wrap justify-between w-full gap-2 p-4 text-black bg-gray-100">
      <HeaderVoice />
      <div className="flex gap-2">
        <p className="text-2xl font-semibold text-gray-700">AudioChat</p>
      </div>
      <HeaderToggle />
    </div>
  );
}
