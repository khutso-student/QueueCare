import { PiChatTeardropTextThin } from "react-icons/pi";
export default function Chat() {
    return(
        <div className="flex justify-center items-center bg-[#bdb9b971] p-2 w-8 h-8 rounded-full  hover:bg-[#979191e3]">
            <button>
                <PiChatTeardropTextThin className="text-[#4d4949ef] text-[25px] cursor-pointer" />
            </button>
        </div>
    )
}