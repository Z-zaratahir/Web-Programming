/**
 * Authentication Middleware
 * Protects routes by checking if user is logged in
 * Used to secure dashboard and other protected routes
 */

/**
 * Checks if user has an active session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = (req, res, next) => {
  // Check if user session exists
  if (req.session && req.session.user) {
    // User is authenticated, proceed to next middleware/route
    next();
  } else {
    // User is not authenticated, send 401 Unauthorized response
    res.status(401).json({
      success: false,
      message: 'Unauthorized. Please login first to access this resource.'
    });
  }
};

// Export middleware for use in routes
module.exports = authMiddleware;
