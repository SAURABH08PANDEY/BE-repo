const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  experienceLevel: {
    type: String,
    enum: ['junior', 'mid', 'senior'],
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  }
});

module.exports = mongoose.model('Interview', InterviewSchema);
