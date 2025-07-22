import React, { useState } from "react"
import { Link } from 'react-router-dom'
import { HiOutlineLogout } from "react-icons/hi";

export default function Profile() {

    const [showModel, setShowModel] = useState(false);

    return(
      <div onClick={() => setShowModel(!showModel)}
       className="hidden md:flex justify-center items-center bg-[#000] cursor-pointer w-8 h-8 rounded-full hover:bg-[#535353]">
        
        {showModel && (
            <div onClick={(e) => e.stopPropagation()}
            className="fixed right-2 z-500 top-18 bg-white border border-[#dbdbdb] flex flex-col items-center p12 w-40 h-40 rounded-lg ">
                <div className="flex justify-center items-center text-[#5c5b5b] font-semibold border-b border-[#afa9a9] w-full p-1.5">
                    <h1>Profile</h1>
                </div>
                <Link to='/login'
                className="flex items-center text-sm text-[#292828] p-4 mt-2 w-37 h-5 bg-[#f8f7f7] hover:bg-[#e6e5e5] border border-[#eeeaea] rounded-lg">
                    <HiOutlineLogout className="mr-1"/>
                    Logout 
                </Link>
            </div>
        )}

    </div>
    )
}