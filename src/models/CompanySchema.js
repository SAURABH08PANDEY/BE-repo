const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: { type: "string", required: true },
  phone_number: {
    type: "string",
    required: true,
    unique: true,
    lowercase: true,
  },
  company_name: { type: "string", required: true },
  company_email: { type: "string", required: true, unique: true },
  employee_size: { type: "number", required: true },
  is_email_verified: { type: "boolean", required: true, default: false },
  is_phone_verified: { type: "boolean", required: true, default: false },
  updated_at: { type: "date", default: Date.now },
  created_at: { type: "date", default: Date.now },
});

CompanySchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

CompanySchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

module.exports = mongoose.model("Company", CompanySchema);
