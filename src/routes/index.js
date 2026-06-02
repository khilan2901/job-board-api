const router = require('express').Router();
require('../models/User');
require('../models/Company');
require('../models/Job');
require('../models/Application');

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

module.exports = router;