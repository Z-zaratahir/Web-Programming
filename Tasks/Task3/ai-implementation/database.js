// Import mongoose for MongoDB connection
const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB database
 * Uses async/await for better error handling
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
  try {
    // Connecting to MongoDB with modern connection options
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database: studentDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // Exit process with failure code
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

module.exports = connectDatabase;
