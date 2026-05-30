const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [50, 'Description must be at least 50 characters'],
    },
    website: {
      type: String,
      validate: {
        validator: function (value) {
          return /^https?:\/\/.+/.test(value);
        },
        message: 'Website must start with http:// or https://',
      },
    },
    logo: {
      type: String,
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Manufacturing', 'Media', 'Consulting'],
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model('Company', companySchema);

module.exports = Company;