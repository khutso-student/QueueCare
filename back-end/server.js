const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

// Dynamically load the correct .env file
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, envFile) });

// Connect to MongoDB
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://queuecare.onrender.com',
  'https://queue-care-swart.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = `❌ CORS policy does not allow access from: ${origin}`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
};

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoute'));
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/uploads', require('./routes/upload'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
