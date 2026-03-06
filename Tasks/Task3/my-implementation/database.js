const mongoose = require('mongoose');

// MongoDB connection configuration
const connectdb = async () => {
  try {
    // Connect to MongoDB Atlas using Mongoose
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('database connected');
  } catch (error) {
    console.log('database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectdb;
