const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/authMiddleware");
const {
  initializeCompany,
  verifyOtp,
  createInterview,
} = require("../controllers/authAndRegistration");

router.post("/init-company/", initializeCompany);
router.post("/create-interview",authMiddleware, createInterview);
router.post("/verify-otp/", verifyOtp);

module.exports = router;
