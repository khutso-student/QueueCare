const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  session: { type: String, enum: ['Morning', 'Afternoon'], required: true },
   date: { type: Date, required: true }, 
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  queueNumber: { type: Number },
  queueLine: { type: Number }, // 1 = Morning, 2 = Afternoon
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
