const Job = require('../models/Job');
const Company = require('../models/Company');
const { AppError } = require('../middlewares/errorHandler');

exports.createJob = async (req, res) => {
  req.body.postedBy = req.user.id;

  // Security Verification: Ensure this employer actually owns the target company
  const company = await Company.findById(req.body.company);
  if (!company) {
    throw new AppError('Target company registration not found', 404);
  }
  if (company.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('You cannot publish job listings for companies you do not own', 403);
  }

  const job = await Job.create(req.body);
  res.status(201).json({ success: true, data: job });
};


exports.getJobs = async (req, res) => {
  let query = {};

  // Leverages text index on title & description if query is present
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Filter systems can be appended directly here (e.g., status, type, location)
  if (req.query.type) query.type = req.query.type;
  if (req.query.location) query.location = req.query.location;

  const jobs = await Job.find(query)
    .populate('company', 'name logo website')
    .populate('postedBy', 'name email');

  res.status(200).json({ success: true, count: jobs.length, data: jobs });
};

exports.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('company', 'name logo location size')
    .populate('postedBy', 'name email');

  if (!job) {
    throw new AppError('Job posting not found', 404);
  }

  // Atomically increment view count on request
  job.viewCount += 1;
  await job.save();

  res.status(200).json({ success: true, data: job });
};


exports.updateJob = async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    throw new AppError('Job posting not found', 404);
  }

  // Ensure modifier is the original publisher or an admin
  if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to alter this job posting', 403);
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true, // Respects your pre-save max/min validation check
  });

  res.status(200).json({ success: true, data: job });
};


exports.deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new AppError('Job posting not found', 404);
  }

  if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to remove this job posting', 403);
  }

  await job.deleteOne();
  res.status(200).json({ success: true, data: {} });
};