import React, { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineLogout } from "react-icons/hi";
import { AuthContext } from '../context/AuthContext'; // adjust path as needed

export default function Profile({ setActiveTab, profileImage }) {
  const [showModel, setShowModel] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleViewAll = () => {
    setActiveTab("MyProfile");
    setShowModel(false);
  };

  const handleLogout = () => {
    logout();
    setShowModel(false);
    navigate('/login'); // redirect after logout
  };

  return (
    <div
      onClick={() => setShowModel(!showModel)}
      className=" md:flex justify-center items-center bg-[#000] cursor-pointer w-8 h-8 rounded-full hover:bg-[#535353]"
    >
      {profileImage ? (
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-500" />
      )}

      {showModel && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed right-2 z-50 top-18 bg-white border border-[#dbdbdb] flex flex-col items-center p-2 w-40 rounded-lg shadow-sm"
        >
          <div className="flex justify-center items-center text-[#5c5b5b] font-semibold w-full p-1.5">
            <h1>Profile</h1>
          </div>

          <button
            onClick={handleViewAll}
            className="flex items-center text-sm text-[#292828] py-2 px-4 mt-2 w-full bg-[#f8f7f7] hover:bg-[#e6e5e5] border border-[#eeeaea] rounded-lg"
          >
            <HiOutlineLogout className="mr-1" />
            My Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center text-sm text-[#292828] py-2 px-4 mt-2 w-full bg-[#f8f7f7] hover:bg-[#e6e5e5] border border-[#eeeaea] rounded-lg"
          >
            <HiOutlineLogout className="mr-1" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
