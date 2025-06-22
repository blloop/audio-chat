import HeaderToggle from "./HeaderToggle";
import HeaderVoice from "./Settings";

export default function Header() {
  return (
    <div className="absolute top-0 bg-[#0001] z-40 flex flex-wrap justify-between w-full gap-2 p-4 text-black">
      <HeaderVoice />
      <div className="flex gap-2">
        <p className="text-2xl font-semibold text-gray-700">AudioChat</p>
      </div>
      <HeaderToggle />
    </div>
  );
}
