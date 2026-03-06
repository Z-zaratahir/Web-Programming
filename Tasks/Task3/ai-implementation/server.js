// Import required modules
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const connectDatabase = require('./database');
const User = require('./User');
const authMiddleware = require('./middleware');

// Initialize Express application
const app = express();
const PORT = 3001; // Different port from student implementation

// Connect to MongoDB database
connectDatabase();

// Middleware Configuration
// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files from current directory and parent (for shared css/Images)
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '..')));

// Configure session middleware for user authentication
app.use(session({
  secret: 'your-super-secret-key-change-this-in-production', // Secret key to sign session ID cookie
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something is stored
  cookie: {
    maxAge: 3600000, // Session expires after 1 hour (in milliseconds)
    httpOnly: true, // Prevents client-side JavaScript from accessing cookie
    secure: false // Set to true in production with HTTPS
  }
}));

// Routes

/**
 * POST /register
 * Register a new user account
 * Body: { username, password }
 */
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Create new User instance and register
    const newUser = new User(username, password);
    const result = await newUser.register();

    // Send appropriate response based on result
    if (result.success) {
      req.session.user = username;
      res.redirect('/html/homepage.html');
    } else {
      const loginAttempt = await newUser.login();
      if (loginAttempt.success) {
        req.session.user = username;
        res.redirect('/html/homepage.html');
      } else {
        res.redirect('/html/signup.html?error=exists');
      }
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

/**
 * POST /login
 * Authenticate user and create session
 * Body: { username, password }
 */
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Create User instance and attempt login
    const loginUser = new User(username, password);
    const result = await loginUser.login();

    if (result.success) {
      // Create session for authenticated user
      req.session.user = username;
      
      res.redirect('/html/homepage.html');
    } else {
      // Authentication failed
      res.redirect('/html/webite.html?error=invalid');
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

/**
 * GET /dashboard
 * Protected route - requires authentication
 * Returns welcome message with username
 */
app.get('/dashboard', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome ${req.session.user}`,
    user: req.session.user
  });
});

/**
 * GET /logout
 * Destroy user session and logout
 */
app.get('/logout', (req, res) => {
  // Destroy session
  req.session.destroy((error) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: 'Logout failed. Please try again.'
      });
    } else {
      res.redirect('/html/webite.html');
    }
  });
});

/**
 * GET /
 * Home route - basic API info
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Login System API',
    version: '1.0.0',
    endpoints: {
      register: 'POST /register',
      login: 'POST /login',
      dashboard: 'GET /dashboard (protected)',
      logout: 'GET /logout'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   POST   /register  - Register new user`);
  console.log(`   POST   /login     - Login user`);
  console.log(`   GET    /dashboard - Protected dashboard`);
  console.log(`   GET    /logout    - Logout user`);
});

// Export app for testing purposes
module.exports = app;
