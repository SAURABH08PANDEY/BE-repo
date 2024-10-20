const Company = require("../models/CompanySchema");
const Otp = require("../models/OTPSchema");
const Interview = require("../models/InterviewSchema");
const Candidate = require("../models/CandidateSchema");
const CandidateInterview = require("../models/CadidateInterviewSchema");
const { generateOTP } = require("../services/generateOtpService");
const { sendEmail } = require("../services/sendEmailService");
const jwt = require("jsonwebtoken");

const initializeCompany = async (req, res) => {
  const { name, company_email, phone_number, company_name, employee_size } =
    req?.body;

  try {
    const existingCompany = await Company.find({
      $or: [{ company_email }, { phone_number }],
    });

    const existingWithEmail = existingCompany.filter(
      (company) =>
        company.company_email == company_email &&
        company.is_email_verified == true
    );
    if (existingWithEmail.length > 0) {
      res.status(400).json({
        success: false,
        message: "This email is already registered with us.",
      });
      return;
    }

    const existingWithPhone = existingCompany.filter(
      (company) =>
        company.phone_number == phone_number &&
        company.is_phone_verified == true
    );
    if (existingWithPhone.length > 0) {
      res.status(400).json({
        success: false,
        message: "This phone number already registered with us.",
      });
      return;
    }

    if (existingCompany) {
      await Company.deleteMany({
        _id: { $in: existingCompany.map((obj) => obj?._id) },
      });
    }

    const company = new Company({
      name,
      company_email,
      phone_number,
      company_name,
      employee_size,
    });

    const saveCompany = await company.save();
    const phoneOtp = await generateOTP(company._id, "phone");
    const emailOtp = await generateOTP(company._id, "email");
    //const response = await sendEmail(company_email, emailOtp);

    res.status(201).json({
      success: true,
      data: {
        message: "Otp sent successfully",
        companyId: saveCompany._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { companyId, otp, type } = req.body;

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    const otpRecord = await Otp.findOne({
      companyId,
      otp,
      type,
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (otpRecord.verified) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has already been verified" });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    if (type === "email") {
      company.is_email_verified = true;
    } else if (type === "phone") {
      company.is_phone_verified = true;
    } else {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    await company.save();

    if (company.is_email_verified && company.is_phone_verified) {
      const token = jwt.sign(
        {
          companyId: company._id,
          email: company.company_email,
          phone: company.phone_number,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        token,
      });
    }

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
    return;
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }
};

const createInterview = async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      experienceLevel,
      endDate,
      candidateEmails,
    } = req.body;
  
    const interview = new Interview({
      companyId: req.auth_user.companyId,
      jobTitle,
      jobDescription,
      experienceLevel,
      endDate,
    });
    const savedInterview = await interview.save();
    const candidates = await Candidate.createCandidatesFromEmails(candidateEmails);
    const candidateIds = candidates.map((candidate) => candidate._id);
    await CandidateInterview.createCandidatesInterview(candidateIds, savedInterview._id);
    res.status(200).json({ status: "success" });
    
  } catch (error) {
    res.status(400).json({ status: error.message });
  }
};

module.exports = {
  initializeCompany,
  createInterview,
  verifyOtp,
};
