const Booking = require("../models/Booking.js");
const User = require("../models/User.js");
const Notification = require("../models/Notification");

// Departments list for validation
const validDepartments = [
  "General Consultation",
  "Dentistry",
  "Cardiology",
  "Dermatology",
  "ENT (Ear, Nose, Throat)",
  "Gynecology",
  "Pediatrics",
  "Orthopedics",
  "Ophthalmology (Eyes)",
  "Neurology",
  "Oncology",
  "Radiology",
  "Urology",
  "Gastroenterology",
  "Psychiatry",
  "Physiotherapy",
  "Nutrition & Dietetics",
  "Pulmonology",
  "Nephrology",
  "Emergency",
  "Infectious Diseases",
];

const isValidDepartment = (department) => validDepartments.includes(department);

const getDoctorByDepartment = async () => {
  return await User.findOne({ role: "doctor" });
};


// Create a booking
const createBooking = async (req, res) => {
    console.log("Create Booking request body:", req.body);
    console.log("Authenticated user:", req.user);

      if (!req.user) {
    console.log("No authenticated user found in request.");
    return res.status(401).json({ message: "Unauthorized: user not authenticated" });
  }
  
  try {
    const { fullName, email, department, session, date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    if (!department || !isValidDepartment(department)) {
      return res.status(400).json({ message: "Invalid or missing department" });
    }

    // Find doctor by department
    const doctor = await getDoctorByDepartment();
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found for this department" });
    }

    const newBooking = new Booking({
      fullName,
      email,
      department,
      session,
      date: new Date(date),
      status: "Pending",
      createdBy: req.user._id,
      doctorId: doctor._id, // Save doctorId in booking for reference
      patientId: req.user._id,
      user: req.user._id, // Save patientId (creator) in booking
    });

    await newBooking.save();

    // Create notification for the doctor (admin)
    await Notification.create({
      userId: doctor._id,
      bookingId: newBooking._id,
      message: `New appointment booked by ${fullName} for ${department}.`,
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("❌ Booking creation failed:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Full error object:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let bookings;

    if (userRole === "doctor" || userRole === "admin") {
      // Admins or doctors see all bookings
      bookings = await Booking.find()
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email");
    } else if (userRole === "patient") {
      // Patients see only their own bookings
      bookings = await Booking.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email");
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

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

    if (status === "Approved") {
      booking.queueLine = booking.session === "Afternoon" ? 2 : 1;

      const existingApprovedCount = await Booking.countDocuments({
        status: "Approved",
        date: booking.date,
        session: booking.session,
        department: booking.department,
      });

      booking.queueNumber = existingApprovedCount + 1;
    }

    const updatedBooking = await booking.save();

    // Notify the patient about status update
    await Notification.create({
      userId: booking.patientId, // Patient's userId stored in booking
      bookingId: updatedBooking._id,
      message: `Your appointment for ${booking.department} has been ${booking.status}.`,
    });

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

    if (department && !isValidDepartment(department)) {
      return res.status(400).json({ message: "Invalid department" });
    }

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
