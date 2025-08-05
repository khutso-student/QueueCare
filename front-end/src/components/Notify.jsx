import { IoMdNotificationsOutline } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";

const VIEWED_KEY = "viewed_notifications";

export default function Notify({ setActiveTab }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const dropdownRef = useRef();

  // ✅ FETCH notifications from backend (Render)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("https://queuecare.onrender.com/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        setNotifications(data);

        // Check if there are unseen notifications
        const viewed = JSON.parse(localStorage.getItem(VIEWED_KEY)) || [];
        const unseen = data.find((n) => !viewed.includes(n._id));
        setHasNew(!!unseen);
      } catch (err) {
        console.error("Notification fetch error:", err);
      }
    };

    fetchNotifications();
  }, []);

  const markViewed = () => {
    localStorage.setItem(
      VIEWED_KEY,
      JSON.stringify(notifications.map((n) => n._id))
    );
    setHasNew(false);
  };

  const handleViewAll = () => {
    setActiveTab("Notification");
    markViewed();
    setShowDropdown(false);
  };

  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => {
          setShowDropdown((prev) => !prev);
          markViewed();
        }}
        className="flex justify-center items-center bg-[#bdb9b971] p-2 w-8 h-8 rounded-full hover:bg-[#979191e3] cursor-pointer relative"
      >
        <IoMdNotificationsOutline className="text-[#4d4949ef] text-[25px]" />
        {hasNew && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
        )}
      </div>

      {showDropdown && (
        <div className="absolute right-0 mt-2 mr-[-75px] sm:mr-[-40px] w-70 border border-[#eeeeee] bg-white shadow-lg rounded-lg z-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-700">Notifications</h2>
          </div>
          {recentNotifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {recentNotifications.map((n) => {
                const date = new Date(n.createdAt);
                const isValidDate = !isNaN(date);
                const displayDate = isValidDate ? date : new Date();

                return (
                  <li key={n._id} className="border-b border-[#ddd] py-2">
                    <div className="text-sm text-gray-800">{n.message}</div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(displayDate, { addSuffix: true })}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <button
            onClick={handleViewAll}
            className="mt-3 w-full py-2 text-center bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700"
          >
            View All
          </button>
        </div>
      )}
    </div>
  );
}
