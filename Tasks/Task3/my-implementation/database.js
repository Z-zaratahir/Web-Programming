const mongoose = require('mongoose');

// MongoDB connection configuration
const connectdb = async () => {
  try {
    // Connect to MongoDB Atlas using Mongoose
    await mongoose.connect('mongodb+srv://admin:admin123456789@cluster0.2fnyrro.mongodb.net/studentDB?retryWrites=true&w=majority', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('database connected');
  } catch (error) {
    console.log('database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectdb;
