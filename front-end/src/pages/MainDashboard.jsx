import { useState } from 'react';

import Logo from '../assets/Logo.svg';
import Chat from '../components/Chat';
import Notify from '../components/Notify';
import Profile from '../components/Profile';

import Dashboard from '../components/pageNavigation/Dashboard';
import Notification from '../components/pageNavigation/Notification';
import BookAppointments from '../components/pageNavigation/BookAppoinments';
import BookingStatus from '../components/pageNavigation/BookingStatus';
import MyProfile from '../components/pageNavigation/MyProfile';

import { LuHouse } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiMoneyCheck1 } from "react-icons/ci";
import { MdOutlineFactCheck } from "react-icons/md";
import { LiaUserCogSolid } from "react-icons/lia";
import { IoIosLogOut } from "react-icons/io";
import { SlMenu } from "react-icons/sl";
import { Link } from 'react-router-dom';

export default function MainDashboard() {
  const [openMenu, setOpenMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Helper to determine active styling
  const navButtonClass = (tabName) =>
    `flex items-center w-full py-2 px-5 mb-2 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
      activeTab === tabName
        ? 'bg-[#1FBEC3] text-white'
        : 'text-gray-500 hover:bg-[#1ca0a5] hover:text-white'
    }`;

  return (
    <div className="flex flex-col w-full h-screen bg-[#f2f6ff] ">
      {/* Top Nav */}
      <div className="flex justify-between items-center w-full bg-white p-3">
        <a href="/">
          <img src={Logo} alt="Site Logo" className="w-35" />
        </a>

        <div>
          <h1 className="text-[#1FBEC3] font-bold text-lg hidden sm:block">Khutso Makunyane</h1>
          <p className="text-sm text-[#878080] hidden sm:block">Welcome back <span className='text-[#1FBEC3] cursor-pointer font-bold hover:underline'>Patient</span> </p>
        </div>

        <div className="w-1/2 p-1 hidden sm:block">
          <input
            type="search"
            placeholder="Search..."
            className="text-sm border border-[#d8d6d6] w-full py-1.5 px-3 rounded-lg focus:outline-[#8f8f8f]"
          />
        </div>

        <div className="flex gap-2">
          <Chat />
          <Notify />
          <Profile />
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex justify-center items-center bg-[#1FBEC3] hover:bg-[#55979b] cursor-pointer w-8 h-8 rounded-full"
          >
            <SlMenu className="text-white" />
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="flex w-full h-full mt-2 bg-[#ffffff42]">
        {/* Side Navigation */}
        {openMenu && (
          <div    className={`h-full bg-white p-2 border border-gray-200 shadow-xs 
            transition-all duration-500 ease-in-out rounded-md
            ${openMenu ? 'w-[200px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
            <p className="text-xs text-[#686161] font-semibold mt-2  mb-2">MENU</p>

            <button onClick={() => setActiveTab('Dashboard')} className={navButtonClass('Dashboard')}>
              <LuHouse className="mr-2" />
              Dashboard
            </button>

            <button onClick={() => setActiveTab('Notification')} className={navButtonClass('Notification')}>
              <MdOutlineMailOutline className="mr-2" />
              Notification
            </button>

            <p className="text-xs text-[#686161] font-semibold mt-5 mb-2">BOOKING</p>

            <button onClick={() => setActiveTab('BookAppointments')} className={navButtonClass('BookAppointments')}>
              <CiMoneyCheck1 className="mr-2" />
              Appointment
            </button>

            <button onClick={() => setActiveTab('BookingStatus')} className={navButtonClass('BookingStatus')}>
              <MdOutlineFactCheck className="mr-2" />
              Booking Status
            </button>

            <p className="text-xs text-[#686161] font-semibold mt-5 mb-2">PROFILE</p>

            <button onClick={() => setActiveTab('MyProfile')} className={navButtonClass('MyProfile')}>
              <LiaUserCogSolid className="mr-2" />
              My Profile
            </button>

            <Link
              to="/login"
              className="flex items-center hover:bg-[#1ca0a5] cursor-pointer w-full py-2 px-5 mt-2 text-sm text-gray-500 hover:text-white rounded-lg"
            >
              <IoIosLogOut className="mr-2" />
              Logout
            </Link>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1  overflow-y-auto">
          {activeTab === 'Dashboard' && <Dashboard />}
          {activeTab === 'Notification' && <Notification />}
          {activeTab === 'BookAppointments' && <BookAppointments />}
          {activeTab === 'BookingStatus' && <BookingStatus />}
          {activeTab === 'MyProfile' && <MyProfile />}
        </div>
      </div>
    </div>
  );
}
