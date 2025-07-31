import { formatDistanceToNow } from "date-fns";

export default function Notification({ notifications = [] }) {
  // Defensive copy and sort newest first
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
              <li key={n.id} className="p-3 bg-white shadow rounded">
                <div className="text-sm text-gray-900">{n.message}</div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(displayDate, { addSuffix: true })}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
