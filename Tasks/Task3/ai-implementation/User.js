// Import required modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define user schema with validation
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create User model from schema
const UserModel = mongoose.model('users-ai', userSchema);

/**
 * User Class - Handles user authentication operations
 * Implements register and login functionality with password hashing
 */
class User {
  /**
   * Constructor to initialize user object
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  /**
   * Register a new user in the database
   * Hashes password before storing for security
   * @returns {Promise<Object>} Result object with success status and message
   */
  async register() {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ username: this.username });
      
      if (existingUser) {
        return {
          success: false,
          message: 'Username already exists. Please choose a different username.'
        };
      }

      // Hash password using bcrypt for security
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);

      // Create new user with hashed password
      const newUser = new UserModel({
        username: this.username,
        password: hashedPassword
      });

      // Save user to database
      await newUser.save();

      return {
        success: true,
        message: 'User registered successfully',
        username: this.username
      };

    } catch (error) {
      // Handle validation errors
      if (error.name === 'ValidationError') {
        return {
          success: false,
          message: Object.values(error.errors)[0].message
        };
      }

      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  }

  /**
   * Authenticate user login
   * Compares hashed password for security
   * @returns {Promise<Object>} Result object with success status and message
   */
  async login() {
    try {
      // Find user by username
      const foundUser = await UserModel.findOne({ username: this.username });

      // Check if user exists
      if (!foundUser) {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }

      // Compare provided password with hashed password in database
      const isPasswordValid = await bcrypt.compare(this.password, foundUser.password);

      if (isPasswordValid) {
        return {
          success: true,
          message: 'Login successful',
          user: {
            id: foundUser._id,
            username: foundUser.username
          }
        };
      } else {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }

    } catch (error) {
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }
}

// Export User class for use in other modules
module.exports = User;
