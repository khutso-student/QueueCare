import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function Notification({ notifications = [], fetchNotifications, token }) {
  const [loadingIds, setLoadingIds] = useState([]);

  const handleMarkAsRead = async (id) => {
    if (!id) {
      console.error("Notification ID is undefined. Cannot mark as read.");
      return;
    }

    try {
      setLoadingIds((prev) => [...prev, id]);
      const res = await fetch(`https://queuecare.onrender.com/api/notifications/${id}/read`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchNotifications();
      } else {
        console.error('Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Notification ID is undefined. Cannot delete.");
      return;
    }

    try {
      setLoadingIds(prev => [...prev, id]);
      const res = await fetch(`https://queuecare.onrender.com/api/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchNotifications();
      } else {
        console.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setLoadingIds(prev => prev.filter(item => item !== id));
    }
  };

  const sortedNotifications = [...notifications]
    .filter(n => n._id) // filter out invalid items
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="p-4">
      <h1 className="text-xl text-[#4e4d4d] font-semibold mb-4">All Notifications</h1>
      <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
        {sortedNotifications.length === 0 ? (
          <li className="text-gray-500">No notifications available.</li>
        ) : (
          sortedNotifications.map((n) => {
            const date = new Date(n.createdAt);
            const isValidDate = !isNaN(date);
            const displayDate = isValidDate ? date : new Date();

            return (
              <li key={n._id} className="p-3 bg-white shadow rounded flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-900">{n.message}</div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(displayDate, { addSuffix: true })}
                  </div>
                </div>

                <div className="flex space-x-3">
                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n._id)}
                      disabled={loadingIds.includes(n._id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {loadingIds.includes(n._id) ? 'Marking...' : 'Mark as Read'}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(n._id)}
                    disabled={loadingIds.includes(n._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    {loadingIds.includes(n._id) ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
