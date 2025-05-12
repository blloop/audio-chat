import { MessagesSquare, Mic } from "lucide-react";
import { cn } from "../utils/cn";
import { useConfig } from "../utils/configContext";
import { useSpeech } from "../utils/speechContext";

const Header: React.FC = () => {
  const { supported } = useSpeech();
  const { isText, toggleText } = useConfig();

  return (
    <div className="flex justify-between w-full gap-2 p-4 text-black border-b-2 border-gray-200 bg-gray-100">
      <div className="w-20" />
      <p className="text-2xl font-semibold text-gray-500">AudioChat</p>
      {supported ? (
        <div
          onClick={() => toggleText()}
          className="cursor-pointer bg-gray-300 hover:bg-gray-200 transition-colors border-gray-300 border-2 rounded-full relative flex w-18 gap-4 px-2 justify-end items-center"
        >
          <MessagesSquare
            className={cn("size-6 z-10", isText && "text-gray-200")}
          />
          <Mic className={cn("size-6 z-10", !isText && "text-gray-200")} />
          <div
            className={cn(
              "rounded-full absolute bg-purple-500 w-10 h-8 transition-[right]",
              isText ? "right-10" : "right-0",
            )}
          />
        </div>
      ) : (
        <div className="w-20" />
      )}
    </div>
  );
};

export default Header;
