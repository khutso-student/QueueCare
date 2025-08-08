const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URI
      : process.env.MONGO_URI_LOCAL;

    if (!uri) {
      throw new Error('MongoDB URI is missing.');
    }

    await mongoose.connect(uri); // ✅ No need for options with Mongoose v8+

    console.log(`✅ MongoDB connected successfully to ${process.env.NODE_ENV} database`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
