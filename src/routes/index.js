const router = require('express').Router();

// Model Registrations
require('../models/User');
require('../models/Company');
require('../models/Job');
require('../models/Application');

// Route Implementations
const authRoutes = require('./authRoutes');
const companyRoutes = require('./companyRoutes');
const jobRoutes = require('./jobRoutes');

// Mount Sub-routers
router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running cleanly' });
});

module.exports = router;