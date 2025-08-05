const express = require('express');
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingControllers')
const { protect } = require('../middleware/auth') 

const router = express.Router();


router.post('/', protect, createBooking);
router.get("/bookings", protect, getAllBookings);
router.get("/admin/bookings", protect, authorize("doctor"), getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking); 
router.put('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);



module.exports = router;
