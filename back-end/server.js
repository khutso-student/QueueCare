const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoute = require('./routes/dashboardRoute');
const authRoute = require('./routes/authRoute');
const uploadRoutes = require('./routes/upload');

dotenv.config();
connectDB();

// ✅ Allowed frontend origins (Vercel, localhost)
const allowedOrigins = [
  'http://localhost:5173',
  'https://queuecare.onrender.com',
  'https://queue-care-swart.vercel.app' // ✅ No trailing slash!
];

// ✅ CORS Options
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// ✅ Create express app
const app = express();

// ✅ Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // 🛡️ Handle preflight requests

app.use(express.json());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoute); 
app.use('/api/auth', authRoute);
app.use("/api/uploads", uploadRoutes);

// ✅ Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
