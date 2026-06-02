const router = require('express').Router();
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/auth');

router
  .route('/')
  .get(getJobs)
  .post(protect, authorize('employer', 'admin'), createJob);

router
  .route('/:id')
  .get(getJob)
  .put(protect, authorize('employer', 'admin'), updateJob)
  .delete(protect, authorize('employer', 'admin'), deleteJob);

module.exports = router;