const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorHandler');

// Protect routes - Ensure user is authenticated
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized to access this route', 401);
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Attach user to request object (excluding password due to select: false in schema)
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    throw new AppError('The user belonging to this token no longer exists', 401);
  }

  next();
};

// Restrict routes to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(`User role '${req.user.role}' is not authorized to access this action`, 403);
    }
    next();
  };
};

module.exports = { protect, authorize };