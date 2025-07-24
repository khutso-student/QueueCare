const Booking = require("../models/Booking.js");
const User = require("../models/User.js");

// Create a booking
// Assuming Express route handler
const createBooking = async (req, res) => {
  try {
    const { fullName, email, department, session, date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const newBooking = new Booking({
      fullName,
      email,
      department,
      session,
      date: new Date(date),  // ensure date is Date type
      status: 'Pending',
      // you can set queueNumber and queueLine later on approval
      createdBy: req.user._id, // if you track who creates the booking
    });

    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");
      console.log("Bookings fetched:", bookings.map(b => ({ id: b._id, date: b.date })));

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;

    // Assign queueLine and queueNumber only when status is 'Approved'
    if (status === 'Approved') {
      // 1. Set queueLine
      booking.queueLine = booking.session === 'Afternoon' ? 2 : 1;

      // 2. Count existing approved bookings for same date, session, department
      const existingApprovedCount = await Booking.countDocuments({
        status: 'Approved',
        date: booking.date,
        session: booking.session,
        department: booking.department,
      });

      // 3. Set queueNumber (1-based)
      booking.queueNumber = existingApprovedCount + 1;
    }

    const updatedBooking = await booking.save();

    res.status(200).json({ message: "Booking status updated", booking: updatedBooking });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Failed to update booking" });
  }
};


// Update booking details (except status)
const updateBooking = async (req, res) => {
  try {
    const { fullName, email, department, session, date } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.fullName = fullName || booking.fullName;
    booking.email = email || booking.email;
    booking.department = department || booking.department;
    booking.session = session || booking.session;

    if (date) {
      booking.date = new Date(date);
    }

    if (session) {
      booking.queueLine = session === "Afternoon" ? 2 : 1;
    }

    await booking.save();

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Update Booking Error:", error);
    res.status(500).json({ message: "Failed to update booking" });
  }
};



// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking" });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
};
