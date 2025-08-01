const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoute = require('./routes/dashboardRoute');
const authRoute = require('./routes/authRoute');
const uploadRoutes = require("./routes/upload");

dotenv.config();  
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://queuecare.onrender.com',
  'https://queue-care-swart.vercel.app/',
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoute); 
app.use('/api/auth', authRoute);
app.use("/api/uploads", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
