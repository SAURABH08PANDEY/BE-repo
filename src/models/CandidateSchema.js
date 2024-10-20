const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CandidateSchema.statics.createCandidatesFromEmails = async function (
  emails = []
) {
  const existingCandidates = await this.find({ email: { $in: emails } });
  const existingEmails = existingCandidates.map((candidate) => candidate.email);
  const newCandidates = emails.filter(
    (email) => !existingEmails.includes(email)
  );

  const candidates = newCandidates.map((email) => ({
    email,
  }));

  const result = await this.insertMany(candidates);
  return [...result, ...existingCandidates];
};

module.exports = mongoose.model("Candidate", CandidateSchema);
