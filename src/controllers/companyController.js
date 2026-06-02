const Company = require('../models/Company');
const { AppError } = require('../middlewares/errorHandler');


exports.createCompany = async (req, res) => {
  // Bind company owner to currently logged-in user
  req.body.owner = req.user.id;

  const company = await Company.create(req.body);
  res.status(201).json({ success: true, data: company });
};


exports.getCompanies = async (req, res) => {
  const companies = await Company.find().populate('owner', 'name email');
  res.status(200).json({ success: true, count: companies.length, data: companies });
};


exports.getCompany = async (req, res) => {
  const company = await Company.findById(req.params.id).populate('owner', 'name email');
  
  if (!company) {
    throw new AppError('Company not found', 404);
  }

  res.status(200).json({ success: true, data: company });
};


exports.updateCompany = async (req, res) => {
  let company = await Company.findById(req.params.id);

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  // Ensure user is the company owner or an admin
  if (company.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this company record', 403);
  }

  company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: company });
};


exports.deleteCompany = async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  if (company.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this company record', 403);
  }

  await company.deleteOne();
  res.status(200).json({ success: true, data: {} });
};