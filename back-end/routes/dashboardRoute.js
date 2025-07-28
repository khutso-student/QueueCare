const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const totalAppointments = await Booking.countDocuments();
    const approved = await Booking.countDocuments({ status: 'Approved' });
    const pending = await Booking.countDocuments({ status: 'Pending' });
    const rejected = await Booking.countDocuments({ status: 'Rejected' });

    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });

    // Upcoming appointments: only those on or after today, sorted ascending by date
    const upcomingAppointments = await Booking.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(3);

    const recentActivities = upcomingAppointments.map((appt) => {
      let icon = 'booked';
      if (appt.status === 'Approved') icon = 'approved';
      else if (appt.status === 'Pending') icon = 'pending';
      else if (appt.status === 'Rejected') icon = 'rejected';

      return {
        icon,
        text: `Appointment for ${appt.fullName} (${appt.department}) is ${appt.status}`,
        time: timeAgo(appt.createdAt),
      };
    });

    res.json({
      totalAppointments,
      approved,
      pending,         // <-- added this here
      rejected,
      totalQueues: 4,  // You can calculate dynamically if needed
      totalDoctors,
      totalPatients,
      recentActivities,
      upcomingAppointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Dashboard data fetch failed' });
  }
});

// Helper to convert timestamps into "x mins ago"
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

router.get('/weekly-appointments', async (req, res) => {
  try {
    // Get today's date and last 6 days for a week
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Aggregate bookings by day of week for last 7 days
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000) }, // last 7 days
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' }, // 1=Sun, 2=Mon, ...
          count: { $sum: 1 },
        },
      },
    ];

    const aggResult = await Booking.aggregate(pipeline);

    // Convert MongoDB $dayOfWeek (1=Sun) to day short names & build data array
    // Initialize all days with 0
    const data = daysShort.map((day) => ({ day, appointments: 0 }));

    aggResult.forEach((item) => {
      // MongoDB dayOfWeek: 1=Sun, so map index
      const index = item._id - 1;
      if (index >= 0 && index < data.length) {
        data[index].appointments = item.count;
      }
    });

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch weekly appointments:', error);
    res.status(500).json({ message: 'Failed to fetch weekly appointments' });
  }
});

module.exports = router;




