const mongoose = require('mongoose');
const Job = require('./Job');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant is required'],
    },
    resume: {
      type: String,
      required: [true, 'Resume URL is required'],
    },
    coverLetter: {
      type: String,
      maxlength: [1000, 'Cover letter cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Compound unique index — one application per job per user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Capture isNew BEFORE save (post hook is too late)
applicationSchema.pre('save', function (next) {
  this._wasNew = this.isNew;
  next();
});

// Increment job's applicationCount only on new applications
applicationSchema.post('save', async function (doc) {
  if (this._wasNew) {
    await Job.findByIdAndUpdate(doc.job, { $inc: { applicationCount: 1 } });
  }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;