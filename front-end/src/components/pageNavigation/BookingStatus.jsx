import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BookingStatus() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('/api/bookings', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            });
            console.log('Raw bookings response:', data);
            setBookings(Array.isArray(data) ? data : data.bookings || []);

      
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-bold  mb-6 text-[#655E5E]">Booking Status</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-400">No bookings found.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-xs rounded-xl p-4 border border-[#bebdbd] hover:shadow-sm transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-gray-800">{booking.fullName}</p>
                  <p className="text-sm text-gray-500">{booking.email}</p>
                  <p className="text-sm text-gray-500">
                    {booking.department} — {booking.session} Session
                  </p>
                  <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col gap-2 items-start md:items-end">
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                  {booking.queueNumber && (
                    <p className="text-sm text-gray-700">
                        Queue: Line {booking.queueLine} • No. {booking.queueNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );


}






