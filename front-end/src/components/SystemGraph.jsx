import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { day: 'Mon', appointments: 10 },
  { day: 'Tue', appointments: 15 },
  { day: 'Wed', appointments: 7 },
  { day: 'Thu', appointments: 20 },
  { day: 'Fri', appointments: 12 },
  { day: 'Sat', appointments: 8 },
  { day: 'Sun', appointments: 5 },
];

const peak = data.reduce((prev, curr) =>
  curr.appointments > prev.appointments ? curr : prev
);
const total = data.reduce((sum, curr) => sum + curr.appointments, 0);

export default function SystemGraph() {
  return (
    <div className="w-full bg-white border border-[#e0e0e0] rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[#686161] text-xs sm:text-md font-semibold">Weekly Appointment Queue</h2>
        <span className="text-sm text-[#1FBEC3] font-medium">
          Total: {total}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Most appointments occurred on <span className="font-semibold">{peak.day}</span>.
      </p>

      {/* Fixed height to prevent overflow */}
      <div className="w-full h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value) => [`${value} Appointments`, '']}
              labelStyle={{ fontWeight: 'semibold' }}
            />
            <Bar dataKey="appointments" fill="#1FBEC3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
