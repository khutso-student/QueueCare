import SystemGraph from '../SystemGraph';

import { LuLayoutList } from "react-icons/lu";
import { GoChecklist } from "react-icons/go";
import { CiCircleList } from "react-icons/ci";
import { MdOutlineFilterListOff } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle, FaUserClock } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { MdOutlineCancel } from "react-icons/md";
import { RiUserShared2Line } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { BsGraphDown } from "react-icons/bs";

const StatCard = ({ icon, label, value, bgColor, iconColor }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 bg-white border border-[#D9D2D2] hover:shadow-sm rounded-lg w-full sm:w-1/2 lg:w-[23%] py-3 px-2">
      <div style={{ backgroundColor: bgColor }} className="p-3 rounded-full">
        <div style={{ color: iconColor }} className="text-[20px]">
          {icon}
        </div>
      </div>
      <p className="text-xs text-[#979191] text-center">{label}</p>
      <h1 className="text-[#686161] font-bold">{value}</h1>
    </div>
  );
};

const UserCard = ({ icon, label, value, bgColor, iconColor, lineChat }) => {
  return (
    <div className="flex items-center gap-3 bg-white w-full rounded border border-[#e4e4e4] hover:shadow-sm mb-2 p-3 ">
      <div style={{ backgroundColor: bgColor }} className="p-3 rounded-full">
        <div style={{ color: iconColor }} className="text-[20px]">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-[#979191]">{label}</p>
        <div className='flex items-center gap-2'>
          <h1 className="text-[#686161] font-bold">{value}</h1>
          <div>{lineChat}</div>
        </div>
      </div>
    </div>
  );
};

const activities = [
  {
    icon: <TiTick className="text-green-500" />,
    text: 'Appointment for John approved',
    time: '2 mins ago',
  },
  {
    icon: <FaUserClock className="text-[#1FBEC3]" />,
    text: 'New appointment request by Sarah',
    time: '10 mins ago',
  },
  {
    icon: <MdOutlineCancel className="text-red-500" />,
    text: 'Appointment for Mike rejected',
    time: '30 mins ago',
  },
  {
    icon: <RiUserShared2Line className="text-[#1FBEC3]" />,
    text: 'Patient Alex booked for Thursday',
    time: '1 hour ago',
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full p-2 overflow-y-auto">
      {/* Left */}
      <div className="flex flex-col w-full lg:w-3/4 gap-4 h-auto">
        <p className="text-[#686161] text-xs font-semibold ml-1">QUICK STATS</p>
        <div className="w-full h-auto overflow-x-auto scrollbar-hide mb-2 ">
            <div className="flex justify-between gap-3 flex-nowrap min-w-max">
                <StatCard
                icon={<LuLayoutList />}
                label="Total Appointments"
                value="10"
                bgColor="#1FBEC3"
                iconColor="#fff"
                />
                <StatCard
                icon={<CiCircleList />}
                label="Total Queues"
                value="4"
                bgColor="#F193FF"
                iconColor="#E32BFF"
                />
                <StatCard
                icon={<GoChecklist />}
                label="Approved Appoinments"
                value="25"
                bgColor="#B2FFB7"
                iconColor="#61DA6A"
                />
                <StatCard
                icon={<MdOutlineFilterListOff />}
                label="Rejected Appoinments"
                value="5"
                bgColor="#FED0D0"
                iconColor="#FB5959"
                />
            </div>
        </div>


        <SystemGraph />

        <p className="text-[#686161] text-xs font-semibold ml-1 mt-4">RECENT ACTIVITY FEED</p>
        <div className="bg-white rounded-lg  border border-gray-200 p-3 space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-lg">{activity.icon}</div>
                <p className="text-sm text-[#4b4b4b]">{activity.text}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/4">
        <p className="text-[#686161] text-xs font-semibold mb-2 ml-1">TOTAL USERS</p>
        <UserCard 
          bgColor="#9AE1E4"
          iconColor="#1FBEC3"
          icon={<FaUserDoctor />}
          label="Total Number of doctors"
          value="5"
          lineChat={<GoGraph className='text-[#1FBEC3]' />}
        />

        <UserCard 
          bgColor="#FED0D0"
          iconColor="#FB5959"
          icon={<FaUser />}
          label="Total Number of Patients"
          value="20"
          lineChat={<BsGraphDown className='text-red-500' />}
        />

        <p className="text-[#686161] text-xs font-semibold my-3 ml-1">UPCOMING APPOINTMENTS</p>
        <div className="space-y-3">
  {/* Example upcoming appointment card */}
  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition">
    <div className="flex items-center gap-3">
      <div className="bg-[#1FBEC3] text-white p-2 rounded-full">
        <FaUser />
      </div>
      <div>
        <p className="text-sm text-gray-700 font-semibold">John Doe</p>
        <p className="text-xs text-gray-500">Dr. Smith — Eye Checkup</p>
        <p className="text-xs text-gray-400">Tue, 23 Jul — 10:30 AM</p>
      </div>
    </div>
    <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
      Pending
    </span>
  </div>

  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition">
    <div className="flex items-center gap-3">
      <div className="bg-[#1FBEC3] text-white p-2 rounded-full">
        <FaUser />
      </div>
      <div>
        <p className="text-sm text-gray-700 font-semibold">Sarah Mike</p>
        <p className="text-xs text-gray-500">Dr. Adams — Dental Cleaning</p>
        <p className="text-xs text-gray-400">Wed, 24 Jul — 2:00 PM</p>
      </div>
    </div>
    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
      Approved
    </span>
  </div>

  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition">
    <div className="flex items-center gap-3">
      <div className="bg-[#1FBEC3] text-white p-2 rounded-full">
        <FaUser />
      </div>
      <div>
        <p className="text-sm text-gray-700 font-semibold">Kevin Lee</p>
        <p className="text-xs text-gray-500">Dr. Taylor — General Checkup</p>
        <p className="text-xs text-gray-400">Thu, 25 Jul — 9:00 AM</p>
      </div>
    </div>
    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
      Cancelled
    </span>
  </div>
</div>


      </div>
    </div>
  );
}
