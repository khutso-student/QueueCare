const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoute = require('./routes/dashboardRoute');

dotenv.config();  
connectDB();

const corsOptions = {
  origin: 'http://localhost:5173', // ✅ your Vite frontend
  credentials: true,              // ✅ allow cookies
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoute);  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
