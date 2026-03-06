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
    await mongoose.connect('mongodb+srv://admin:admin123456789@cluster0.2fnyrro.mongodb.net/studentDB?appName=Cluster0', {
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
