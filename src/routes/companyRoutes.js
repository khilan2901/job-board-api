const router = require('express').Router();
const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middlewares/auth');

router
  .route('/')
  .get(getCompanies)
  .post(protect, authorize('employer', 'admin'), createCompany);

router
  .route('/:id')
  .get(getCompany)
  .put(protect, authorize('employer', 'admin'), updateCompany)
  .delete(protect, authorize('employer', 'admin'), deleteCompany);

module.exports = router;