import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';

export default function SystemGraph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility: find peak and total from data
  const peak = data.length
    ? data.reduce((prev, curr) => (curr.appointments > prev.appointments ? curr : prev))
    : { day: '', appointments: 0 };

  const total = data.reduce((sum, curr) => sum + curr.appointments, 0);

  useEffect(() => {
    async function fetchWeeklyAppointments() {
      try {
        const { data } =  await api.get('/dashboard/weekly-appointments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Expect data format: [{ day: 'Mon', appointments: 10 }, ...]
        setData(data);
      } catch (error) {
        console.error('Failed to fetch weekly appointments:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeeklyAppointments();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white border border-[#e0e0e0] rounded-lg p-4 shadow-sm text-center text-gray-500">
        Loading chart...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full bg-white border border-[#e0e0e0] rounded-lg p-4 shadow-sm text-center text-gray-500">
        No appointment data available.
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-[#e0e0e0] rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[#686161] text-xs sm:text-md font-semibold">Weekly Appointment Queue</h2>
        <span className="text-sm text-[#1FBEC3] font-medium">Total: {total}</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Most appointments occurred on <span className="font-semibold">{peak.day}</span>.
      </p>

      <div className="w-full h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value) => [`${value} Appointment${value !== 1 ? 's' : ''}`, '']}
              labelStyle={{ fontWeight: 'semibold' }}
            />
            <Bar dataKey="appointments" fill="#1FBEC3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
