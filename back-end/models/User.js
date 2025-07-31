const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ✅ fixed typo here
  role: { type: String, enum: ["doctor", "patient"], default: "patient" },

  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },

  profileImage: { type: String,  default: "",},
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
