import { useEffect, useState } from 'react';
import { getDashboardData } from '../../services/bookingAPI'; // ✅ NEW import
import SystemGraph from '../SystemGraph';

import { LuLayoutList } from "react-icons/lu";
import { GoChecklist, GoGraph } from "react-icons/go";
import { CiCircleList } from "react-icons/ci";
import { MdOutlineFilterListOff, MdOutlineCancel } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FaUserClock} from "react-icons/fa";
import { FaUserMd, FaUser } from "react-icons/fa";
import { RiUserShared2Line } from "react-icons/ri";
import { BsGraphDown } from "react-icons/bs";


const StatCard = ({ icon, label, value, bgColor, iconColor }) => (
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

const UserCard = ({ icon, label, value, bgColor, iconColor, lineChat }) => (
  <div className="flex items-center gap-3 bg-white w-full rounded border border-[#e4e4e4] hover:shadow-sm mb-2 p-3 ">
    <div style={{ backgroundColor: bgColor }} className="p-3 rounded-full">
      <div style={{ color: iconColor }} className="text-[20px]">
        {icon}
      </div>
    </div>
    <div className="flex-1">
      <p className="text-xs text-[#979191]">{label}</p>
      <div className="flex items-center gap-2">
        <h1 className="text-[#686161] font-bold">{value}</h1>
        <div>{lineChat}</div>
      </div>
    </div>
  </div>
);

const activityIconMap = {
  approved: <TiTick className="text-green-500" />,
  pending: <FaUserClock className="text-[#1FBEC3]" />,
  rejected: <MdOutlineCancel className="text-red-500" />,
  booked: <RiUserShared2Line className="text-[#1FBEC3]" />,
};

const statusBadgeColors = {
  Approved: { bg: 'bg-green-100', text: 'text-green-600' },
  Pending: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  Rejected: { bg: 'bg-red-100', text: 'text-red-600' },
  Cancelled: { bg: 'bg-red-100', text: 'text-red-600' },
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    approved: 0,
    rejected: 0,
    totalQueues: 0,
    totalDoctors: 0,
    totalPatients: 0,
    recentActivities: [],
    upcomingAppointments: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData(); // ✅ using service
        setStats(dashboardData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full p-2 overflow-y-auto">
      {/* Quick Stats */}
      <div className="flex flex-col w-full lg:w-3/4 gap-4 h-auto">
        <p className="text-[#686161] text-xs font-semibold ml-1">QUICK STATS</p>
        <div className="w-full h-auto overflow-x-auto scrollbar-hide mb-2 ">
          <div className="flex justify-between gap-3 flex-nowrap min-w-max">
            <StatCard icon={<LuLayoutList />} label="Total Appointments" value={stats.totalAppointments} bgColor="#1FBEC3" iconColor="#fff" />
            <StatCard icon={<CiCircleList />} label="Total Queues" value={stats.totalQueues} bgColor="#F193FF" iconColor="#E32BFF" />
            <StatCard icon={<GoChecklist />} label="Approved Appointments" value={stats.approved} bgColor="#B2FFB7" iconColor="#61DA6A" />
            <StatCard icon={<MdOutlineFilterListOff />} label="Rejected Appointments" value={stats.rejected} bgColor="#FED0D0" iconColor="#FB5959" />
          </div>
        </div>

        <SystemGraph />

        {/* Recent Activity */}
        <p className="text-[#686161] text-xs font-semibold ml-1 mt-4">RECENT ACTIVITY FEED</p>
        <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-3">
          {stats.recentActivities.length === 0 ? (
            <p className="text-gray-500 text-center">No recent activities.</p>
          ) : (
            stats.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-lg">{activityIconMap[activity.icon] || <RiUserShared2Line />}</div>
                  <p className="text-sm text-[#4b4b4b]">{activity.text}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Users + Upcoming */}
      <div className="w-full lg:w-1/4">
        <p className="text-[#686161] text-xs font-semibold mb-2 ml-1">TOTAL USERS</p>
        <UserCard
          bgColor="#9AE1E4"
          iconColor="#1FBEC3"
          icon={<FaUserMd />}
          label="Total Number of doctors"
          value={stats.totalDoctors}
          lineChat={<GoGraph className="text-[#1FBEC3]" />}
        />
        <UserCard
          bgColor="#FED0D0"
          iconColor="#FB5959"
          icon={<FaUser />}
          label="Total Number of Patients"
          value={stats.totalPatients}
          lineChat={<BsGraphDown className="text-red-500" />}
        />

        <p className="text-[#686161] text-xs font-semibold my-3 ml-1">UPCOMING APPOINTMENTS</p>
        <div className="space-y-3">
          {stats.upcomingAppointments.length === 0 ? (
            <p className="text-gray-500 text-center">No upcoming appointments.</p>
          ) : (
            stats.upcomingAppointments.map((appt) => {
              const badgeColors = statusBadgeColors[appt.status] || { bg: 'bg-gray-100', text: 'text-gray-600' };
              return (
                <div
                  key={appt._id}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1FBEC3] text-white p-2 rounded-full">
                      <FaUser />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 font-semibold">{appt.fullName}</p>
                      <p className="text-xs text-gray-500">{`Dr. ${appt.doctorName || appt.department} — ${appt.department}`}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(appt.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })} — {appt.session} Session
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs ${badgeColors.bg} ${badgeColors.text} px-2 py-1 rounded-full`}>
                    {appt.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
