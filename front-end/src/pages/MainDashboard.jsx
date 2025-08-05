import { useState, useEffect } from 'react';
import api from '../services/api'


import Logo from '../assets/Logo.svg';
import LogoIcon from '../assets/Icon.svg';
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

const token = localStorage.getItem("token");

export default function MainDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await api.get('/auth/me'); 
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUser();
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: Date.now(),
      message: "Welcome! You’ll get live updates here.",
      createdAt: new Date().toISOString(),
    },
  ]);

  const pushNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      time: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (window.innerWidth < 640) {
      setSidebarOpen(false); // Auto-close sidebar on mobile
    }
  };

  const navButtonClass = (tabName) =>
    `flex items-center w-full py-2 px-5 mb-2 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
      activeTab === tabName
        ? 'bg-[#1FBEC3] text-white'
        : 'text-gray-500 hover:bg-[#1ca0a5] hover:text-white'
    }`;

  return (
    <div className="flex flex-col w-full h-screen bg-[#f2f6ff]">
      {/* Top Nav */}
      <div className="flex justify-between items-center w-full bg-white p-3">
        <a href="/">
          <img src={Logo} alt="Site Logo" className="w-35" />
        </a>

        {user ? (
          <div>
            <h1 className="text-[#1FBEC3] font-bold text-sm hidden sm:block">
              {user.name || user.username || 'User'}
            </h1>
            <p className="text-sm text-[#878080] hidden sm:block">
              Welcome back{' '}
              <span className="text-[#1FBEC3] cursor-pointer font-bold hover:underline">
                {user.role || 'User'}
              </span>
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-[#1FBEC3] font-bold text-lg hidden sm:block">Loading...</h1>
            <p className="text-sm text-[#878080] hidden sm:block">Please wait...</p>
          </div>
        )}

        <div className="w-1/2 p-1 hidden sm:block">
          <input
            type="search"
            placeholder="Search..."
            className="text-sm border border-[#d8d6d6] w-full py-1.5 px-3 rounded-lg focus:outline-[#8f8f8f]"
          />
        </div>

        <div className="flex gap-2">
          <Notify notifications={notifications} setActiveTab={setActiveTab} token={token} />
          <Profile setActiveTab={setActiveTab} profileImage={user?.profileImage || ""} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex justify-center items-center bg-[#1FBEC3] hover:bg-[#55979b] cursor-pointer w-8 h-8 rounded-full"
          >
            <SlMenu className="text-white" />
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="flex w-full h-full mt-2 bg-[#ffffff42] relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed sm:hidden top-0 left-0 w-full h-full bg-[#00000054] bg-opacity-50 z-40"
            />
        )}

        {/* Sidebar */}
        {sidebarOpen && (
          <div
            className={`
              fixed sm:static top-0 left-0 h-full z-50 bg-white p-2 border border-gray-200 shadow-xs rounded-md w-[200px]
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
            `}
          >
            <p className="text-xs text-[#686161] font-semibold mt-2 mb-2">MENU</p>

            <button onClick={() => handleTabChange('Dashboard')} className={navButtonClass('Dashboard')}>
              <LuHouse className="mr-2" />
              Dashboard
            </button>

            <button onClick={() => handleTabChange('Notification')} className={navButtonClass('Notification')}>
              <MdOutlineMailOutline className="mr-2" />
              Notification
            </button>

            <p className="text-xs text-[#686161] font-semibold mt-5 mb-2">BOOKING</p>

            <button onClick={() => handleTabChange('BookAppointments')} className={navButtonClass('BookAppointments')}>
              <CiMoneyCheck1 className="mr-2" />
              Appointment
            </button>

            <button onClick={() => handleTabChange('BookingStatus')} className={navButtonClass('BookingStatus')}>
              <MdOutlineFactCheck className="mr-2" />
              Booking Status
            </button>

            <p className="text-xs text-[#686161] font-semibold mt-5 mb-2">PROFILE</p>

            <button onClick={() => handleTabChange('MyProfile')} className={navButtonClass('MyProfile')}>
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

            {/* Bottom Logo */}
            <div className="absolute flex justify-center items-center bottom-4 left-0 w-full h-[60px] p-2">
              <img src={LogoIcon} className="w-10" alt="Icon Logo" />
              <p className="text-[#777171] text-sm font-semibold ml-2">2025 - QueueCare</p>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'Dashboard' && <Dashboard />}
          {activeTab === 'Notification' && <Notification notifications={notifications} />}
          {activeTab === 'BookAppointments' && <BookAppointments pushNotification={pushNotification} />}
          {activeTab === 'BookingStatus' && <BookingStatus />}
          {activeTab === 'MyProfile' && <MyProfile />}
        </div>
      </div>
    </div>
  );
}
