const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/dashboard
router.get('/', protect, async (req, res) => {
  try {
    const isDoctor = req.user.role === 'doctor';

    // Build filter condition for bookings
    const bookingFilter = isDoctor
      ? {} // no filter, get all bookings
      : { email: req.user.email }; // patients get only their bookings

    // Total appointments count filtered by user role
    const totalAppointments = await Booking.countDocuments(bookingFilter);

    // Count by status filtered
    const approved = await Booking.countDocuments({ ...bookingFilter, status: 'Approved' });
    const pending = await Booking.countDocuments({ ...bookingFilter, status: 'Pending' });
    const rejected = await Booking.countDocuments({ ...bookingFilter, status: 'Rejected' });

    // Total doctors & patients are site-wide stats, no filter needed
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });

    // Upcoming appointments filtered and sorted
    const upcomingAppointments = await Booking.find({
      ...bookingFilter,
      date: { $gte: new Date() }
    })
      .sort({ date: 1 })
      .limit(3);

    // Recent activities based on upcomingAppointments
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

    // You can calculate totalQueues dynamically if needed; for now keep static
    const totalQueues = 4;

    res.json({
      totalAppointments,
      approved,
      pending,
      rejected,
      totalQueues,
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

router.get('/weekly-appointments', protect, async (req, res) => {
  try {
    const isDoctor = req.user.role === 'doctor';
    const bookingFilter = isDoctor ? {} : { email: req.user.email };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pipeline = [
      {
        $match: {
          ...bookingFilter,
          createdAt: { $gte: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000) }, // last 7 days
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          count: { $sum: 1 },
        },
      },
    ];

    const aggResult = await Booking.aggregate(pipeline);

    const data = daysShort.map((day) => ({ day, appointments: 0 }));

    aggResult.forEach((item) => {
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










