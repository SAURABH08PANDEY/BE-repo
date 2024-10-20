const OTP = require("../models/OTPSchema");

const generateOTP = async (companyId, type) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otp = await OTP.findOne({ companyId, type });
  if (otp) {
    await OTP.deleteOne({ _id: otp._id });
  }
  const otpEntry = new OTP({
    companyId,
    otp: type == 'phone' ? '123456' : otpCode,
    type,
  });

  await otpEntry.save();
  return otpCode;
};

module.exports = {
  generateOTP,
};
