import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function Notify({ token, setActiveTab }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]);

  // ✅ Fetch notifications from server
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://queuecare.onrender.com/api/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ Mark as read
  const handleMarkAsRead = async (id) => {
    setLoadingIds((prev) => [...prev, id]);

    try {
      const res = await fetch(`https://queuecare.onrender.com/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchNotifications();
      } else {
        console.error("Failed to mark as read");
      }
    } catch (err) {
      console.error("Error marking as read:", err);
    } finally {
      setLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // ✅ Delete notification
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://queuecare.onrender.com/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchNotifications();
      } else {
        console.error("Failed to delete notification");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="p-4">
      <h1 className="text-xl text-[#4e4d4d] font-semibold mb-4">All Notifications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
          {sortedNotifications.length === 0 ? (
            <li className="text-gray-500">No notifications available.</li>
          ) : (
            sortedNotifications.map((n) => {
              const date = new Date(n.timestamp);
              const isValidDate = !isNaN(date);
              const displayDate = isValidDate ? date : new Date();

              return (
                <li key={n._id} className="p-3 bg-white shadow rounded relative">
                  <div className="text-sm text-gray-700">{n.message}</div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(displayDate, { addSuffix: true })}
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n._id)}
                      disabled={loadingIds.includes(n._id)}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      {loadingIds.includes(n._id) ? "Marking..." : "Mark as Read"}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(n._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
