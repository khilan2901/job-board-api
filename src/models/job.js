const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [100, 'Description must be at least 100 characters'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Posted by is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    type: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    },
    salary: {
      type: {
        min: { type: Number },
        max: { type: Number },
        currency: {
          type: String,
          enum: ['INR', 'USD', 'EUR'],
          default: 'INR',
        },
        isPublic: { type: Boolean, default: true },
      },
      default: {},
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open',
    },
    expiresAt: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ title: 'text', description: 'text' });

// Salary validation
jobSchema.pre('save', function (next) {
  if (this.salary?.min && this.salary?.max) {
    if (this.salary.min > this.salary.max) {
      return next(new Error('Salary min cannot be greater than max'));
    }
  }
  next();
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;