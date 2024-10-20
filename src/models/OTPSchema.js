const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['email', 'phone'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Otp', OTPSchema);
