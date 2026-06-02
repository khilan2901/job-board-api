const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { AppError } = require('../middlewares/errorHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  res.status(201).json({ success: true, token, data: user.fullProfile });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide an email and password', 400);
  }

  // Explicitly selecting password because schema has select: false
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user._id);

  res.status(200).json({ success: true, token, data: user.fullProfile });
};