import { IoMdNotificationsOutline } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";

// Key used to persist in localStorage
const STORAGE_KEY = "user_notifications";
const VIEWED_KEY = "viewed_notifications";

export default function Notify({ notifications, setActiveTab }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNew, setHasNew] = useState(true); // assume new unless viewed
  const dropdownRef = useRef();

  useEffect(() => {
    const viewed = localStorage.getItem("viewed_notifications");
    if (viewed) {
      const viewedIds = JSON.parse(viewed);
      const unseen = notifications.find(n => !viewedIds.includes(n.id));
      setHasNew(!!unseen);
    }
  }, [notifications]);

  const markViewed = () => {
    localStorage.setItem(
      "viewed_notifications",
      JSON.stringify(notifications.map((n) => n.id))
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
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-700">Notifications</h2>
            {/* You can keep the Clear All button here if you want */}
          </div>
          {recentNotifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {recentNotifications.map((n) => {
                const date = new Date(n.createdAt);
                const isValidDate = !isNaN(date);
                const displayDate = isValidDate ? date : new Date(); // fallback to now

                return (
                  <li key={n.id} className="border-b border-[#ddd] py-2">
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
