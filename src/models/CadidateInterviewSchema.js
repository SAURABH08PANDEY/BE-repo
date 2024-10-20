const mongoose = require("mongoose");

const CandidateInterviewSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interview",
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CandidateInterviewSchema.statics.createCandidatesInterview = async function (
  candidateIds = [],
  interviewId = null
) {
  const candidateInterviewObject = candidateIds.map((candidateId) => ({
    candidateId,
    interviewId,
  }));
  const data = await this.insertMany(candidateInterviewObject);
  return data;
};

module.exports = mongoose.model("CandidateInterview", CandidateInterviewSchema);
