import { IoMdNotificationsOutline } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";

export default function Notify({ notifications, setActiveTab }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const dropdownRef = useRef();

  // Helper to mark notification as read on server
  const markNotificationRead = async (id) => {
    try {
      await fetch(`https://queuecare.onrender.com/api/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  // Mark all notifications in the list as read on the backend & locally
  const markAllAsRead = async () => {
    // Mark all unread notifications as read on backend
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => markNotificationRead(n._id)));

    // Update localStorage
    localStorage.setItem(
      "viewed_notifications",
      JSON.stringify(notifications.map((n) => n._id))
    );
    setHasNew(false);
  };

  useEffect(() => {
    // Check if any notifications are unread and update hasNew accordingly
    const viewed = localStorage.getItem("viewed_notifications");
    let viewedIds = [];
    if (viewed) {
      viewedIds = JSON.parse(viewed);
    }
    // Also consider server read status
    const unseen = notifications.find(
      (n) => !viewedIds.includes(n._id) && !n.read
    );
    setHasNew(!!unseen);
  }, [notifications]);

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    if (!showDropdown) {
      markAllAsRead();
    }
  };

  const handleViewAll = () => {
    setActiveTab("Notification");
    markAllAsRead();
    setShowDropdown(false);
  };

  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={handleToggleDropdown}
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
            {/* Optional: Add Clear All button here */}
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
                  <li
                    key={n._id}
                    className={`border-b border-[#ddd] py-2 ${
                      !n.read ? "font-semibold" : ""
                    }`}
                  >
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
