import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function Notification({ notifications = [], fetchNotifications }) {
  const [loadingIds, setLoadingIds] = useState([]);

  const handleMarkAsRead = async (id) => {
    try {
      setLoadingIds((prev) => [...prev, id]);
      const res = await fetch(`https://queuecare.onrender.com/api/notifications/${id}/read`, {
      method: 'PATCH',
      credentials: 'include', // if using cookies/auth
      headers: {
        'Content-Type': 'application/json',
      },
    });


      if (res.ok) {
        fetchNotifications(); // Re-fetch updated notifications
      } else {
        console.error('Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="p-4">
      <h1 className="text-xl text-[#4e4d4d] font-semibold mb-4">All Notifications</h1>
      <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
        {sortedNotifications.length === 0 ? (
          <li className="text-gray-500">No notifications available.</li>
        ) : (
          sortedNotifications.map((n) => {
            const date = new Date(n.timestamp);
            const isValidDate = !isNaN(date);
            const displayDate = isValidDate ? date : new Date();

            return (
              <li key={n._id} className="p-3 bg-white shadow rounded">
                <div className="text-sm text-gray-900">{n.message}</div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(displayDate, { addSuffix: true })}
                </div>

                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    disabled={loadingIds.includes(n._id)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    {loadingIds.includes(n._id) ? 'Marking...' : 'Mark as Read'}
                  </button>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
